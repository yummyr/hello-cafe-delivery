package com.yuan.controller;

import com.yuan.dto.LoginRequestDTO;
import com.yuan.dto.LoginResponseDTO;
import com.yuan.dto.RegisterRequestDTO;
import com.yuan.result.Result;
import com.yuan.service.AuthService;
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

}
