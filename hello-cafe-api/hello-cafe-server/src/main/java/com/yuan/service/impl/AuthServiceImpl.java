package com.yuan.service.impl;

import com.yuan.dto.LoginRequestDTO;
import com.yuan.dto.LoginResponseDTO;
import com.yuan.dto.RegisterRequestDTO;
import com.yuan.entity.Employee;
import com.yuan.entity.User;
import com.yuan.properties.JwtProperties;
import com.yuan.repository.EmployeeRepository;
import com.yuan.repository.UserRepository;
import com.yuan.result.Result;
import com.yuan.service.AuthService;
import com.yuan.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * Unified login service for both Employee and Customer.
 */
@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthServiceImpl implements AuthService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtProperties jwtProperties;

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
                default -> throw new RuntimeException("Invalid role: must be 'employee' or 'customer'");
            };

        } catch (Exception e) {
            log.error("Login failed for user: {}, role: {}", req.getUsername(), req.getRole(), e);
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    /**
     * validate request params
     */
    private void validateLoginRequest(LoginRequestDTO req) {
        if (req.getUsername() == null || req.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username cannot be empty");
        }
        if (req.getPassword() == null || req.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }
        if (req.getRole() == null || req.getRole().trim().isEmpty()) {
            throw new RuntimeException("Role cannot be empty");
        }
    }

    /**
     * employee login
     */
    private LoginResponseDTO loginEmployee(LoginRequestDTO req) {
        log.info("Processing employee login for: {}", req.getUsername());

        Employee employee = employeeRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        log.info("Employee found: {}", employee.getUsername());

        if (!passwordEncoder.matches(req.getPassword(), employee.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        log.info("Password validation successful");

        String token = generateEmployeeToken(employee);

        return buildLoginResponse(employee.getUsername(), "employee", token, jwtProperties.getAdminTtl());
    }

    /**
     * customer login
     */
    private LoginResponseDTO loginCustomer(LoginRequestDTO req) {
        log.info("Processing customer login for: {}", req.getUsername());

        User user = (User) userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        log.info("Customer found: {}", user.getUsername());

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        log.info("Password validation successful");

        String token = generateCustomerToken(user);

        return buildLoginResponse(user.getUsername(), "customer", token, jwtProperties.getUserTtl());
    }

    /**
     * generate employee token
     */
    private String generateEmployeeToken(Employee employee) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", employee.getId());
        claims.put("username", employee.getUsername());
        claims.put("role", "employee");
        claims.put("name", employee.getName());

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

        return JwtUtil.createJWT(
                jwtProperties.getUserSecretKey(),
                jwtProperties.getUserTtl(),
                claims
        );
    }

    /**
     * build login response dto
     */
    private LoginResponseDTO buildLoginResponse(String username, String role, String token, Long expiresIn) {
        LoginResponseDTO response = new LoginResponseDTO();
        response.setUsername(username);
        response.setRole(role);
        response.setToken(token);
        response.setExpiresIn(expiresIn);

        log.info("Login successful for: {}, role: {}", username, role);
        return response;
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
}
