package com.yuan.constant;

public class RedisConstant {

    /**
     * Shop status key in Redis
     * Value: 0 (closed) or 1 (open)
     */
    public static final String SHOP_STATUS_KEY = "shop:status";

    /**
     * Default shop status (closed)
     */
    public static final Integer DEFAULT_SHOP_STATUS = 0;
}