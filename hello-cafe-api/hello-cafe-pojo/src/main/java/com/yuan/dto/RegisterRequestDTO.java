package com.yuan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class RegisterRequestDTO {
    private static final long serialVersionUID = 1L;
    private String name;
    private String email;
    private String username;
    private String password;
    private String phone;
    private String gender;
    private String avatar;

}
