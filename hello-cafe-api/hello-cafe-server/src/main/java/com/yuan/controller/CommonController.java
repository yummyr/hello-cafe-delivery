package com.yuan.controller;

import com.yuan.result.Result;
import com.yuan.service.CommonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/common")
public class CommonController {

    private final CommonService commonService;

    /**
     * File upload
     */
    @PostMapping("/upload")
    public Result<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            log.info("Uploading file: {}", file != null ? file.getOriginalFilename() : "null");

            String fileUrl = commonService.uploadFile(file);

            return Result.success(fileUrl);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid file upload: {}", e.getMessage());
            return Result.error(e.getMessage());
        } catch (Exception e) {
            log.error("Failed to upload file", e);
            return Result.error("Failed to upload file: " + e.getMessage());
        }
    }
}