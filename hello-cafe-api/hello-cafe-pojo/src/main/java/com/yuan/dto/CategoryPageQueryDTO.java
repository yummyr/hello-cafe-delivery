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
public class CategoryPageQueryDTO implements Serializable {
    private String name;
    private int page = 1;
    private int pageSize = 10;
}
