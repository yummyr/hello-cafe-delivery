package com.yuan.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1")
public class SimpleAuthController {
    
    @PostMapping("/simple-login")
    public ResponseEntity<Map<String, Object>> simpleLogin(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String role = request.get("role");
        
        System.out.println("Simple login: " + username + ", " + role);
        
        // 直接返回成功，不调用任何服务
        return ResponseEntity.ok(Map.of(
            "code", 1,
            "msg", "Success",
            "data", Map.of(
                "username", username,
                "role", role,
                "token", "simple-token-" + System.currentTimeMillis()
            )
        ));
    }
}