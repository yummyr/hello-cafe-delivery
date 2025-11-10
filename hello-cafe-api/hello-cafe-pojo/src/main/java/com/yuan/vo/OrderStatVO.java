package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatVO {

    private String dateList;
    private String orderCountList;
    private String validOrderCountList;

    private Integer totalOrderCount;
    private Integer validOrderCount;
    private Double orderCompletionRate;
}
