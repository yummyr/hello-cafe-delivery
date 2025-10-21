package com.yuan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.Serializable;

/**
 * DTO returned after successful login.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class LoginResponseDTO implements Serializable {
    private String token;
    private long expiresIn;
    private String username;
    private String role;
}
