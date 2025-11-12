package com.yuan.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class WaitingAcceptanceVO {
    private Integer count; // waiting order count
    private List<WaitingOrderSummary> orders; // order summary

    @Data
    public static class WaitingOrderSummary {
        private Long id;
        private String number;
        private String userName;
        private String phone;
        private Double amount;
        private LocalDateTime orderTime;
        private Integer waitingMinutes;
    }
}