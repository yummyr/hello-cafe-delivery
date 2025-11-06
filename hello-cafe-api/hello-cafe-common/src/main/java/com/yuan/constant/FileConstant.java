package com.yuan.constant;

import java.util.Arrays;
import java.util.List;

public class FileConstant {

    private FileConstant() {} // forbid instantiation

    public static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    public static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
}
