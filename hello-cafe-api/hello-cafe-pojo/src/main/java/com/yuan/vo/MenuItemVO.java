package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemVO {
    private Long id;
    private String name;
    private String image;
    private String categoryName;  // query from Category table by category_id
    private Double price;
    private Integer status;
    private LocalDateTime updateTime;
}
