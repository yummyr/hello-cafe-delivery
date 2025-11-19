package com.yuan.dto;

import com.yuan.entity.MenuItemFlavor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class MenuItemDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;
    private String name;
    private Long categoryId;
    private Double price;
    private String image;
    private String description;
    private Integer status;         //0 not sell ,1 sell
    private List<MenuItemFlavor> flavors = new ArrayList<>();
}
