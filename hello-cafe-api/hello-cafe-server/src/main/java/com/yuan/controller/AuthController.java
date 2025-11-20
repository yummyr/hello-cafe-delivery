package com.yuan.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yuan.dto.LoginRequestDTO;
import com.yuan.dto.LoginResponseDTO;
import com.yuan.dto.RegisterRequestDTO;
import com.yuan.entity.User;
import com.yuan.result.Result;
import com.yuan.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Result<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO req) {
        try {
            log.info("Login request received - username: {}, role: {}",
                    req.getUsername(), req.getRole());

            LoginResponseDTO response = authService.login(req);
            return Result.success(response);

        } catch (RuntimeException e) {
            log.error("Login failed for user: {}, error: {}",
                    req.getUsername(), e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/register")
    public void registerUser(@RequestBody RegisterRequestDTO req) {
        log.info("register info:{}",req);

        authService.registerUser(req);
    }

    @PostMapping("/register-with-avatar")
    public Result<User> registerUserWithAvatar(
            @RequestPart("userData") RegisterRequestDTO registerRequest,
            @RequestPart(value = "avatar", required = false) MultipartFile avatarFile) {
        try {
            log.info("Registration request with avatar received - username: {}",
                    registerRequest.getUsername());

            return authService.registerUserWithAvatar(registerRequest, avatarFile);

        } catch (Exception e) {
            log.error("Registration with avatar failed for user: {}, error: {}",
                    registerRequest.getUsername(), e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/update-avatar")
    public Result<String> updateUserAvatar(@RequestParam("avatar") MultipartFile avatarFile) {
        try {
            log.info("Avatar update request received");

            return authService.updateUserAvatar(avatarFile);

        } catch (Exception e) {
            log.error("Avatar update failed, error: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/profile")
    public Result<User> getUserProfile() {
        try {
            log.info("User profile request received");

            return authService.getUserProfile();

        } catch (Exception e) {
            log.error("Failed to get user profile, error: {}", e.getMessage());
            return Result.error(e.getMessage());
        }
    }


    /**
     * Refresh token endpoint
     * Extends the expiration time of a valid token
     */
    @PostMapping("/refresh")
    public Result<LoginResponseDTO> refreshToken(HttpServletRequest request) {
        try {
            log.info("Token refresh request received");

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("No token provided in refresh request");
                return Result.error("No token provided");
            }

            String oldToken = authHeader.substring(7);

            // Delegate to service layer
            LoginResponseDTO response = authService.refreshToken(oldToken);

            log.info("Token refreshed successfully for user: {}", response.getUsername());
            return Result.success(response);

        } catch (RuntimeException | JsonProcessingException e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return Result.error("Invalid or expired token");
        }}
}
