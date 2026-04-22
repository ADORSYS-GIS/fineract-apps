package com.adorsys.fineract.registration.service.fineract;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class FineractCodeValueService {

    /**
     * This service is dedicated to managing Fineract's "Code Values," which are used for dynamic,
     * system-defined enumerations like gender, address types, etc. It provides a mechanism to fetch
     * these values from the Fineract API and caches them to reduce redundant API calls. The service can
     * resolve human-readable labels (e.g., "Male") into their corresponding numeric IDs required by Fineract.
     */
    private final Cache<String, Long> codeValueCache = Caffeine.newBuilder()
            .maximumSize(2_000)
            .expireAfterWrite(1, TimeUnit.HOURS)
            .build();
    private final RestClient fineractRestClient;
    private final FineractProperties fineractProperties;

    public FineractCodeValueService(RestClient fineractRestClient, FineractProperties fineractProperties) {
        this.fineractRestClient = fineractRestClient;
        this.fineractProperties = fineractProperties;
    }

    @SuppressWarnings("unchecked")
    public void refreshCodeValueCache(String codeName) {
        log.info("Fetching dynamic IDs for code: {}", codeName);

        Integer codeId = fineractProperties.getCodes().get(codeName);
        if (codeId == null) {
            log.error("Unknown code name: {}", codeName);
            return;
        }

        try {
            List<Map<String, Object>> values = fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/codes/{codeId}/codevalues", codeId)
                    .retrieve()
                    .body(List.class);

            if (values != null) {
                for (Map<String, Object> val : values) {
                    String label = ((String) val.get("name")).toLowerCase();
                    Long id = ((Number) val.get("id")).longValue();
                    codeValueCache.put(codeName + ":" + label, id);
                }
            }
        } catch (Exception e) {
            log.error("Could not fetch IDs for {} (ID: {}): {}", codeName, codeId, e.getMessage());
        }
    }

    public Long getDynamicId(String codeName, String label) {
        if (label == null) {
            return null;
        }
        String key = codeName + ":" + label.toLowerCase();
        if (codeValueCache.getIfPresent(key) == null) {
            refreshCodeValueCache(codeName);
        }
        return codeValueCache.getIfPresent(key);
    }
}
