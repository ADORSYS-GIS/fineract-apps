package com.adorsys.fineract.asset.storage;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Data
@Configuration
@ConfigurationProperties(prefix = "storage")
public class StorageProperties {

    private String bucket = "fineract-assets";
    private String region = "us-east-1";
    private String endpoint;
    private String accessKey;
    private String secretKey;
    private String publicBaseUrl;
    private long maxFileSize = 5 * 1024 * 1024; // 5MB
    private Set<String> allowedContentTypes = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );
}
