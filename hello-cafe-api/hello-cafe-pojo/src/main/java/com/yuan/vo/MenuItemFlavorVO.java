package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemFlavorVO {
    private Long id;          // flavor id
    private Long menuItemId;   // menuitem id
    private String name;       // flavor name
    private String value;      // flavor value（JSON string）
}