package com.yuan.service;

import org.springframework.web.multipart.MultipartFile;

public interface CommonService {
    /**
     * File upload
     */
    String uploadFile(MultipartFile file);
}