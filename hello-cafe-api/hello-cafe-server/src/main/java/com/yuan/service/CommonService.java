package com.yuan.service;

import org.springframework.web.multipart.MultipartFile;

public interface CommonService {
    /**
     * 文件上传
     */
    String uploadFile(MultipartFile file);
}