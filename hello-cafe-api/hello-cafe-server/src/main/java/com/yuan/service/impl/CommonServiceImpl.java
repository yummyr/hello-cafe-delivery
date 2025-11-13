package com.yuan.service.impl;

import com.yuan.constant.FileConstant;
import com.yuan.service.CommonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommonServiceImpl implements CommonService {

    private final S3Service s3Service;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            // Validate file
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File cannot be null or empty");
            }

            // Check file size
            if (file.getSize() > FileConstant.MAX_IMAGE_SIZE) {
                throw new IllegalArgumentException("File size exceeds maximum allowed size");
            }

            // Check file type
            if (!FileConstant.ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
                throw new IllegalArgumentException("File type not supported");
            }

            // Upload file to S3
            String fileUrl = s3Service.uploadFile(file);

            log.info("File uploaded successfully: {}", fileUrl);
            return fileUrl;

        } catch (Exception e) {
            log.error("Failed to upload file: {}", file != null ? file.getOriginalFilename() : "null", e);
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }
}