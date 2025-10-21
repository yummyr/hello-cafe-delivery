package com.yuan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;
import java.io.Serializable;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class EmployeeDTO implements Serializable {
    private Long id;
    private String username;
    private String name;
    private String phone;
    private String gender;
}
