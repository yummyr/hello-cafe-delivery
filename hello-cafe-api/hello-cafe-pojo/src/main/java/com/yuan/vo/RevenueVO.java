package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueVO {
    private String dateList;        // "4-1,4-2,4-3,..."
    private String revenueList;    // "120,98,105,..."

}
