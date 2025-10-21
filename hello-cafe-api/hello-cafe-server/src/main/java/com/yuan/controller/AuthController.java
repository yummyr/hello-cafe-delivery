package com.yuan.controller;

import com.yuan.dto.LoginRequestDTO;
import com.yuan.dto.LoginResponseDTO;
import com.yuan.dto.RegisterRequestDTO;
import com.yuan.entity.Employee;
import com.yuan.properties.JwtProperties;
import com.yuan.repository.EmployeeRepository;
import com.yuan.result.Result;
import com.yuan.service.AuthService;
import com.yuan.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtProperties jwtProperties;




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
            return Result.error(e.getMessage()); // 直接返回异常消息，避免暴露内部信息
        }
    }
    @PostMapping("/register")
    public void registerUser(@RequestBody RegisterRequestDTO req) {
       authService.registerUser(req);

    }

    @PostMapping("/reset-password")
    public Result<String> resetPassword(@RequestParam String username,
                                        @RequestParam String newPassword) {
        try {
            Optional<Employee> employeeOpt = employeeRepository.findByUsername(username);
            if (employeeOpt.isPresent()) {
                Employee employee = employeeOpt.get();
                employee.setPassword(passwordEncoder.encode(newPassword));
                employeeRepository.save(employee);
                return Result.success("Password reset successfully");
            }
            return Result.error("User not found");
        } catch (Exception e) {
            return Result.error("Password reset failed: " + e.getMessage());
        }
    }

    @PostMapping("/login-now")
    public Result<LoginResponseDTO> loginNow(@RequestBody LoginRequestDTO req) {
        try {
            log.info("Login now for: {}", req.getUsername());

            // 1. 验证用户存在
            Optional<Employee> employeeOpt = employeeRepository.findByUsername(req.getUsername());
            if (employeeOpt.isEmpty()) {
                log.error("Employee not found: {}", req.getUsername());
                return Result.error("Employee not found");
            }

            Employee employee = employeeOpt.get();
            log.info("Employee found: {}", employee.getUsername());

            // 2. 验证密码
            boolean passwordValid = passwordEncoder.matches(req.getPassword(), employee.getPassword());
            log.info("Password valid: {}", passwordValid);

            if (!passwordValid) {
                return Result.error("Invalid password");
            }

            // 3. 生成简单 token（Base64 编码的用户信息）
            String tokenData = String.format("%d:%s:%d:employee",
                    employee.getId(), employee.getUsername(), System.currentTimeMillis());
            String simpleToken = Base64.getEncoder().encodeToString(tokenData.getBytes());

            // 4. 返回响应
            LoginResponseDTO response = new LoginResponseDTO();
            response.setUsername(employee.getUsername());
            response.setRole("employee");
            response.setExpiresIn(7200000L); // 2小时
            response.setToken(simpleToken);

            log.info("✅ Login successful for: {}", employee.getUsername());
            return Result.success(response);

        } catch (Exception e) {
            log.error("Login now failed: ", e);
            return Result.error("Login failed: " + e.getMessage());
        }
    }



}
