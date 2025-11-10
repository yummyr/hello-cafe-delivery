package com.yuan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPaymentVO {
    private String nonceStr;    // 随机字符串
    private String packageStr;   // 统一下单接口返回的 prepay_id 参数值
    private String signType;     // 签名算法
    private String timeStamp;    // 时间戳
    private String paySign;      // 签名
}