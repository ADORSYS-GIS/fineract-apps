package com.adorsys.fineract.asset.storage;

import com.adorsys.fineract.asset.exception.AssetException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.io.PushbackInputStream;
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

        PushbackInputStream pbStream = new PushbackInputStream(content, 12);
        try {
            byte[] header = new byte[12];
            int bytesRead = pbStream.read(header, 0, 12);
            if (bytesRead > 0) {
                pbStream.unread(header, 0, bytesRead);
            }
            validateMagicBytes(header, bytesRead, contentType);
        } catch (IOException e) {
            throw new AssetException("Failed to read file content for validation");
        }

        String sanitized = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String key = folder + "/" + UUID.randomUUID() + "-" + sanitized;

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(properties.getBucket())
                .key(key)
                .contentType(contentType)
                .build();

        s3Client.putObject(request, RequestBody.fromInputStream(pbStream, contentLength));
        log.info("Uploaded file: bucket={}, key={}", properties.getBucket(), key);

        return key;
    }

    private void validateMagicBytes(byte[] header, int bytesRead, String contentType) {
        if (bytesRead < 3) {
            throw new AssetException("File too small to validate");
        }
        boolean valid = switch (contentType) {
            case "image/jpeg" ->
                    (header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF;
            case "image/png" ->
                    bytesRead >= 8
                    && (header[0] & 0xFF) == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47
                    && header[4] == 0x0D && header[5] == 0x0A && header[6] == 0x1A && header[7] == 0x0A;
            case "image/webp" ->
                    bytesRead >= 12
                    && header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46
                    && header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50;
            default -> false;
        };
        if (!valid) {
            throw new AssetException("File content does not match declared content type: " + contentType);
        }
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
