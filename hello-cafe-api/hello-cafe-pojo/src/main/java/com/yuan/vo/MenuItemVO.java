package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class MenuItemVO {
    private Long id;
    private String name;
    private String categoryName;
    private Double price;
    private String image;
    private String description;
    private Integer status;
    private LocalDateTime updateTime;
    private Integer copies;      // menu item quantity
}
