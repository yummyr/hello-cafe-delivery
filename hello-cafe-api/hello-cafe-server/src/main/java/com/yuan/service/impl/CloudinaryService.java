package com.yuan.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Upload image to Cloudinary
     * @param file image file
     * @return image URL
     */
    public String uploadImage(MultipartFile file) throws IOException {
        try {
            // Validate file
            validateFile(file);

            // Convert MultipartFile to File
            File uploadFile = convertMultipartFileToFile(file);

            // Generate unique public_id
            String publicId = generatePublicId(file.getOriginalFilename());

            // Upload configuration
            Map uploadOptions = ObjectUtils.asMap(
                    "public_id", publicId,
                    "folder", "hello-cafe",  // folder name
                    "resource_type", "auto",  // auto-detect resource type
                    "overwrite", false       // do not overwrite existing files
            );

            // Execute upload
            Map uploadResult = cloudinary.uploader().upload(uploadFile, uploadOptions);

            // Delete temporary file
            uploadFile.delete();

            // Get secure HTTPS URL
            String imageUrl = (String) uploadResult.get("secure_url");
            log.info("Image uploaded successfully: {}", imageUrl);

            return imageUrl;

        } catch (Exception e) {
            log.error("Failed to upload image to Cloudinary", e);
            throw new IOException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    /**
     * Upload image with custom options
     */
    public String uploadImage(MultipartFile file, Map<String, Object> options) throws IOException {
        try {
            validateFile(file);
            File uploadFile = convertMultipartFileToFile(file);

            Map uploadResult = cloudinary.uploader().upload(uploadFile, options);
            uploadFile.delete();

            return (String) uploadResult.get("secure_url");

        } catch (Exception e) {
            log.error("Failed to upload image with options", e);
            throw new IOException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    /**
     * Delete image
     * @param publicId image public_id
     */
    public void deleteImage(String publicId) throws IOException {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Image deleted: {}, result: {}", publicId, result.get("result"));
        } catch (Exception e) {
            log.error("Failed to delete image: {}", publicId, e);
            throw new IOException("Failed to delete image: " + e.getMessage(), e);
        }
    }

    /**
     * Extract public_id from URL
     * @param imageUrl Cloudinary image URL
     * @return public_id
     */
    public String extractPublicIdFromUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return null;
        }

        try {
            // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
            String[] parts = imageUrl.split("/upload/");
            if (parts.length < 2) {
                return null;
            }

            String pathAfterUpload = parts[1];
            // Remove version number (v1234567890/)
            if (pathAfterUpload.startsWith("v")) {
                pathAfterUpload = pathAfterUpload.substring(pathAfterUpload.indexOf("/") + 1);
            }

            // Remove file extension
            int lastDotIndex = pathAfterUpload.lastIndexOf(".");
            if (lastDotIndex > 0) {
                pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
            }

            return pathAfterUpload;

        } catch (Exception e) {
            log.error("Failed to extract public_id from URL: {}", imageUrl, e);
            return null;
        }
    }

    /**
     * Generate image transformation URL
     * @param publicId image public_id
     * @param width width
     * @param height height
     * @return transformed URL
     */
    public String generateTransformedUrl(String publicId, int width, int height) {
        return cloudinary.url()
                .transformation(new Transformation()
                        .width(width)
                        .height(height)
                        .crop("fill")
                        .quality("auto")
                        .fetchFormat("auto"))
                .generate(publicId);
    }

    /**
     * Generate thumbnail URL
     */
    public String generateThumbnailUrl(String publicId) {
        return generateTransformedUrl(publicId, 300, 300);
    }

    /**
     * Validate file
     */
    private void validateFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("File is empty");
        }

        // Validate file size (e.g., maximum 10MB)
        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            throw new IOException("File size exceeds maximum limit of 10MB");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("File must be an image");
        }

        // Validate file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidImageExtension(originalFilename)) {
            throw new IOException("Invalid image file extension");
        }
    }

    /**
     * Validate image extension
     */
    private boolean isValidImageExtension(String filename) {
        String[] validExtensions = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"};
        String lowerFilename = filename.toLowerCase();
        for (String ext : validExtensions) {
            if (lowerFilename.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Convert MultipartFile to File
     */
    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File convFile = File.createTempFile("temp", getFileExtension(file.getOriginalFilename()));
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }

    /**
     * Generate unique public_id
     */
    private String generatePublicId(String originalFilename) {
        String uuid = UUID.randomUUID().toString();
        String extension = getFileExtension(originalFilename);
        return uuid + extension.replace(".", "");
    }

    /**
     * Get file extension
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf(".");
        return (lastDotIndex > 0) ? filename.substring(lastDotIndex) : "";
    }
}