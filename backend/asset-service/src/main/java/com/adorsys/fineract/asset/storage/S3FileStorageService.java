package com.adorsys.fineract.asset.storage;

import com.adorsys.fineract.asset.exception.AssetException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3FileStorageService implements FileStorageService {

    private final S3Client s3Client;
    private final StorageProperties properties;

    @Override
    public String upload(String folder, String fileName, InputStream content, long contentLength, String contentType) {
        if (contentLength > properties.getMaxFileSize()) {
            throw new AssetException("File size exceeds maximum allowed: " + properties.getMaxFileSize() + " bytes");
        }
        if (!properties.getAllowedContentTypes().contains(contentType)) {
            throw new AssetException("Content type not allowed: " + contentType
                    + ". Allowed: " + properties.getAllowedContentTypes());
        }

        String sanitized = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String key = folder + "/" + UUID.randomUUID() + "-" + sanitized;

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(properties.getBucket())
                .key(key)
                .contentType(contentType)
                .build();

        s3Client.putObject(request, RequestBody.fromInputStream(content, contentLength));
        log.info("Uploaded file: bucket={}, key={}", properties.getBucket(), key);

        return key;
    }

    @Override
    public void delete(String key) {
        try {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(properties.getBucket())
                    .key(key)
                    .build();
            s3Client.deleteObject(request);
            log.info("Deleted file: bucket={}, key={}", properties.getBucket(), key);
        } catch (Exception e) {
            log.warn("Failed to delete file from storage: key={}, error={}", key, e.getMessage());
        }
    }

    @Override
    public String getPublicUrl(String key) {
        String baseUrl = properties.getPublicBaseUrl();
        if (baseUrl == null || baseUrl.isBlank()) {
            return key;
        }
        String base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
        return base + key;
    }
}
