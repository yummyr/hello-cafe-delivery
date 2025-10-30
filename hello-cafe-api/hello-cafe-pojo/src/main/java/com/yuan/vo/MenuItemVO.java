package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemVO {
    private Long id;
    private String name;
    private String categoryName;
    private Double price;
    private String image;
    private String description;
    private Integer status;
    private LocalDateTime updateTime;
}
