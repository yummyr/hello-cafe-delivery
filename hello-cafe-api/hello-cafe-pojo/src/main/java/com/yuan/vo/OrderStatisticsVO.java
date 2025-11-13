package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatisticsVO {
    private Integer toBeConfirmed;     // pending confirmation count
    private Integer confirmed;         // pending delivery count
    private Integer deliveryInProgress; // in delivery count
    private Integer completed;         // completed count
    private Integer canceled;          // canceled count
}