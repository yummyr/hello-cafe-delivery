package com.yuan.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yuan.dto.LoginRequestDTO;
import com.yuan.dto.LoginResponseDTO;
import com.yuan.dto.RegisterRequestDTO;
import com.yuan.result.Result;
import com.yuan.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
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
        authService.registerUser(req);
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
