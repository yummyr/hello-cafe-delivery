package com.yuan.service.impl;

import com.yuan.constant.FileConstant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import java.io.ByteArrayOutputStream;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor

public class S3Service {

    private final S3Client s3Client;

    @Value("${hello-cafe.aws.s3.bucket-name}")
    private String bucketName;
    /**
     * uploadFile to S3
     *
     * @param file
     * @return open access URL to the uploaded file
     */
    public String uploadFile(MultipartFile file) {
        try {
            // generate unique file name
            String uniqueFileName = "menu/" + UUID.randomUUID().toString() + "_" +
                    (file.getOriginalFilename() != null ? file.getOriginalFilename() : "");
            byte[] bytesToUpload;

            // check Compress if it’s an image
            if (FileConstant.ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
                log.info("Compressing image before upload: {}", file.getOriginalFilename());
                try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                    Thumbnails.of(file.getInputStream())
                            .size(800, 800)         // resize (preserve aspect ratio)
                            .outputQuality(0.8f)    // 0.0~1.0 compression quality
                            .toOutputStream(outputStream);
                    bytesToUpload = outputStream.toByteArray();
                }
                // log.info("Image compressed successfully. Original size: {} KB, New size: {} KB",
                //         file.getSize() / 1024, bytesToUpload.length / 1024);
            } else {
                // non-image, upload directly
                bytesToUpload = file.getBytes();
                // log.info("Non-image file, uploading without compression: {}", file.getOriginalFilename());
            }

            // upload file
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(uniqueFileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest,
                    RequestBody.fromBytes(bytesToUpload));

            // generate open access URL
            String url = String.format("https://%s.s3.amazonaws.com/%s",
                    bucketName, uniqueFileName);

            // log.info("File uploaded successfully: {}", url);
            return url;

        } catch (IOException e) {
            log.error("Failed to upload file to S3", e);
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    /**
     * deleteFile from S3
     *
     * @param imageUrl open access URL to the file
     */
    public void deleteFile(String imageUrl) {
        try {
            // extract key from URL
            String key = extractKeyFromUrl(imageUrl);

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            // log.info("File deleted successfully: {}", key);

        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", imageUrl, e);
            throw new RuntimeException("Failed to delete file", e);
        }
    }


    /**
     * extract file name from URL
     */
    private String extractKeyFromUrl(String url) {
        // URL format: https://bucket-name.s3.amazonaws.com/menu/filename.jpg
        String[] parts = url.split(".s3.amazonaws.com/");
        return parts.length > 1 ? parts[1] : "";
    }
}