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
public class MenuItemPageQueryDTO implements Serializable {

    private int page = 1;
    private int pageSize = 10;
    private Long categoryId;       // Changed to wrapper type to handle null values
    private String name;          // menu item name for furry query
    private String categoryName;  // category name for furry query
    private Integer status ;       // status（1=Active, 0=Inactive）

}
