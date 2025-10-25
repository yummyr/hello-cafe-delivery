package com.yuan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @NotBlank(message = "Username cannot be empty")
    private String username;

    @NotBlank(message = "Password cannot be empty")
    private String password;

    @NotBlank(message = "Role cannot be empty")
    @Pattern(regexp = "employee|customer", message = "Role must be 'employee' or 'customer'")
    private String role;
}

