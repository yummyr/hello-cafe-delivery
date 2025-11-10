package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComboOverViewVO {
    private Integer sold;          // 已启售套餐数量
    private Integer discontinued;  // 已停售套餐数量
}