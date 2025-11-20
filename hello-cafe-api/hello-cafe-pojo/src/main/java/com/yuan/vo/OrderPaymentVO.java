package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPaymentVO {
    private String nonceStr;    // random string
    private String packageStr;   // prepay_id parameter value returned by unified order interface
    private String signType;     // signature algorithm
    private String timeStamp;    // timestamp
    private String paySign;      // signature
    private String paymentUrl;   // Stripe payment session URL
}