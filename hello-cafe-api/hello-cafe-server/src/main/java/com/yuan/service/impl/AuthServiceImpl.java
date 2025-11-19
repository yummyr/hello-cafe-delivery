package com.yuan.service.impl;

import com.yuan.constant.MessageConstant;
import com.yuan.dto.LoginRequestDTO;
import com.yuan.dto.LoginResponseDTO;
import com.yuan.dto.RegisterRequestDTO;
import com.yuan.entity.Employee;
import com.yuan.entity.User;
import com.yuan.exception.LoginFailedException;
import com.yuan.properties.JwtProperties;
import com.yuan.repository.EmployeeRepository;
import com.yuan.repository.UserRepository;
import com.yuan.result.Result;
import com.yuan.service.AuthService;
import com.yuan.service.impl.CloudinaryService;
import com.yuan.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * Unified login service for both Employee and Customer.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtProperties jwtProperties;
    private final CloudinaryService cloudinaryService;


    @Override
    public LoginResponseDTO login(LoginRequestDTO req) {
        log.info("=== AUTH SERVICE LOGIN START ===");
        log.info("Attempting login for user: {}, role: {}", req.getUsername(), req.getRole());

        try {
            // validate params
            validateLoginRequest(req);

            // dispatch according to different roles
            return switch (req.getRole().toLowerCase()) {
                case "employee" -> loginEmployee(req);
                case "customer" -> loginCustomer(req);
                default -> throw new LoginFailedException(MessageConstant.ROLE_ERROR);
            };

        } catch (Exception e) {
            log.error("Login failed for user: {}, role: {}", req.getUsername(), req.getRole(), e);
            throw new LoginFailedException(MessageConstant.LOGIN_FAILED);
        }
    }

    /**
     * validate request params
     */
    private void validateLoginRequest(LoginRequestDTO req) {
        if (req.getUsername() == null || req.getUsername().trim().isEmpty()) {
            throw new LoginFailedException(MessageConstant.NAME_EMPTY_ERROR);
        }
        if (req.getPassword() == null || req.getPassword().trim().isEmpty()) {
            throw new LoginFailedException(MessageConstant.PASSWORD_EMPTY_ERROR);
        }
        if (req.getRole() == null || req.getRole().trim().isEmpty()) {
            throw new LoginFailedException(MessageConstant.ROLE_EMPTY_ERROR);
        }
    }

    /**
     * employee login
     */
    private LoginResponseDTO loginEmployee(LoginRequestDTO req) {
        log.info("Processing employee login for: {}", req.getUsername());

        Employee employee = employeeRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new LoginFailedException(MessageConstant.ACCOUNT_NOT_FOUND));

        log.info("Employee found: {}", employee.getUsername());

        if (!passwordEncoder.matches(req.getPassword(), employee.getPassword())) {
            throw new LoginFailedException(MessageConstant.PASSWORD_ERROR);
        }

        log.info("Password validation successful");

        String token = generateEmployeeToken(employee);

        log.info("Token generated for employee token: {}", token);

        return new LoginResponseDTO(token, jwtProperties.getAdminTtl(), employee.getUsername(), "employee");
    }

    /**
     * customer login
     */
    private LoginResponseDTO loginCustomer(LoginRequestDTO req) {
        log.info("Processing customer login for: {}", req.getUsername());

        User user = (User) userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new LoginFailedException(MessageConstant.ACCOUNT_NOT_FOUND));

        log.info("Customer found: {}", user.getUsername());

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw  new LoginFailedException(MessageConstant.PASSWORD_ERROR);
        }

        log.info("Password validation successful");

        String token = generateCustomerToken(user);

        return new LoginResponseDTO(token, jwtProperties.getUserTtl(), user.getUsername(), "customer");
    }

    /**
     * generate employee token
     */
    private String generateEmployeeToken(Employee employee) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", employee.getId());
        claims.put("username", employee.getUsername());
        claims.put("role", "employee");
        claims.put("tokenType", "employee");

        return JwtUtil.createJWT(
                jwtProperties.getAdminSecretKey(),
                jwtProperties.getAdminTtl(),
                claims
        );
    }

    /**
     * generate customer token
     */
    private String generateCustomerToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("username", user.getUsername());
        claims.put("role", "customer");
        claims.put("tokenType", "customer");

        return JwtUtil.createJWT(
                jwtProperties.getUserSecretKey(),
                jwtProperties.getUserTtl(),
                claims
        );
    }

    @Override
    public Result<User> registerUser(RegisterRequestDTO registerRequest) {
        User existingUser = (User) userRepository.findByUsername(registerRequest.getUsername()).orElse(null);
        log.info("existingUser: {}", existingUser);
        if (existingUser != null) {
            return Result.error("Username already exists");
        }

        User newUser = new User(null, registerRequest.getName(), registerRequest.getEmail(), registerRequest.getUsername(), passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getPhone(), registerRequest.getGender(), registerRequest.getAvatar(), LocalDate.now());
        log.info("newUser: {}", newUser);
        userRepository.save(newUser);
        return Result.success(newUser);
    }

    /**
     * Register user with avatar upload
     */
    @Override
    public Result<User> registerUserWithAvatar(RegisterRequestDTO registerRequest, MultipartFile avatarFile) {
        User existingUser = (User) userRepository.findByUsername(registerRequest.getUsername()).orElse(null);
        log.info("existingUser: {}", existingUser);
        if (existingUser != null) {
            return Result.error("Username already exists");
        }

        String avatarUrl = registerRequest.getAvatar();

        // Upload avatar to Cloudinary if file is provided
        if (avatarFile != null && !avatarFile.isEmpty()) {
            try {
                avatarUrl = cloudinaryService.uploadImage(avatarFile);
                log.info("Avatar uploaded successfully: {}", avatarUrl);
            } catch (IOException e) {
                log.error("Failed to upload avatar: {}", e.getMessage());
                return Result.error("Failed to upload avatar: " + e.getMessage());
            }
        }

        User newUser = new User(null, registerRequest.getName(), registerRequest.getEmail(), registerRequest.getUsername(), passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getPhone(), registerRequest.getGender(), avatarUrl, LocalDate.now());
        log.info("newUser: {}", newUser);
        userRepository.save(newUser);
        return Result.success(newUser);
    }

    /**
     * Update user avatar
     */
    @Override
    public Result<String> updateUserAvatar(MultipartFile avatarFile) {
        Long currentUserId = com.yuan.utils.UserUtils.getCurrentUserId();

        if (avatarFile == null || avatarFile.isEmpty()) {
            return Result.error("No avatar file provided");
        }

        try {
            // Upload new avatar to Cloudinary
            String avatarUrl = cloudinaryService.uploadImage(avatarFile);
            log.info("New avatar uploaded successfully: {}", avatarUrl);

            // Find user and update avatar
            User user = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Delete old avatar from Cloudinary if it exists
            if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                try {
                    String publicId = cloudinaryService.extractPublicIdFromUrl(user.getAvatar());
                    if (publicId != null) {
                        cloudinaryService.deleteImage(publicId);
                        log.info("Old avatar deleted: {}", publicId);
                    }
                } catch (Exception e) {
                    log.warn("Failed to delete old avatar: {}", e.getMessage());
                    // Continue with avatar update even if deletion fails
                }
            }

            // Update user avatar in database
            user.setAvatar(avatarUrl);
            userRepository.save(user);

            log.info("User avatar updated for user ID: {}", currentUserId);
            return Result.success(avatarUrl);

        } catch (IOException e) {
            log.error("Failed to upload avatar: {}", e.getMessage());
            return Result.error("Failed to upload avatar: " + e.getMessage());
        } catch (Exception e) {
            log.error("Failed to update user avatar: {}", e.getMessage());
            return Result.error("Failed to update avatar: " + e.getMessage());
        }
    }

    /**
     * Get user profile including avatar
     */
    @Override
    public Result<User> getUserProfile() {
        Long currentUserId = com.yuan.utils.UserUtils.getCurrentUserId();

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return Result.success(user);
    }

    /**
     * Refresh token - extend expiration time for active users
     */
    public LoginResponseDTO refreshToken(String oldToken) {
        Claims claims = null;
        String secretKey = null;
        Long ttl = null;
        // try to parse using admin key
        try {
            claims = JwtUtil.parseJWT(jwtProperties.getAdminSecretKey(), oldToken);
            secretKey = jwtProperties.getAdminSecretKey();
            ttl = jwtProperties.getAdminTtl();
        } catch (Exception e) {
            log.debug("Failed to parse with admin key: {}", e.getMessage());
        }

        // try to parse using user key
        if (claims == null) {
            try {
                claims = JwtUtil.parseJWT(jwtProperties.getUserSecretKey(), oldToken);
                secretKey = jwtProperties.getUserSecretKey();
            } catch (Exception e) {
                log.debug("Failed to parse with user key: {}", e.getMessage());
            }
        }

        // Extract user information from claims
        Long id = claims.get("id", Long.class);
        String username = claims.get("username", String.class);
        String role = claims.get("role", String.class);

        if (id == null || username == null || role == null) {
            throw new RuntimeException("Invalid token claims");
        }

        // Verify user still exists in database
        if ("employee".equals(role)) {
            Employee employee = employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
            ;

        } else if ("customer".equals(role)) {
            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        }

        // Create new token with same claims but extended expiration
        Map<String, Object> newClaims = new HashMap<>();
        newClaims.put("id", id);
        newClaims.put("username", username);
        newClaims.put("role", role);
        String newToken = JwtUtil.createJWT(secretKey, ttl, newClaims);


        log.info("Token refreshed for user: {} (role: {})", username, role);

        // Return response with new token
        return new LoginResponseDTO(newToken, ttl, username, role);
    }
}
