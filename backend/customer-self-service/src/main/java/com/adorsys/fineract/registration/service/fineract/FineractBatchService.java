package com.adorsys.fineract.registration.service.fineract;

import com.adorsys.fineract.registration.dto.batch.BatchRequest;
import com.adorsys.fineract.registration.dto.batch.BatchResponse;
import com.adorsys.fineract.registration.exception.RegistrationException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

@Slf4j
@Service
public class FineractBatchService {
    private final RestClient fineractRestClient;

    public FineractBatchService(RestClient fineractRestClient) {
        this.fineractRestClient = fineractRestClient;
    }

    public List<BatchResponse> sendBatchRequest(List<BatchRequest> batchRequest) {
        log.info("Sending batch request to Fineract");

        try {
            @SuppressWarnings({"null"})
            List<BatchResponse> responses = fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/batches?enclosingTransaction=true")
                    .body(batchRequest)
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<BatchResponse>>() {});

            if (responses != null) {
                for (BatchResponse response : responses) {
                    if (response.getStatusCode() < 200 || response.getStatusCode() >= 300) {
                        String errorMessage = "Batch leg " + response.getRequestId() + " failed with status " + response.getStatusCode() + ": " + response.getBody();
                        log.error(errorMessage);
                        throw new RegistrationException(errorMessage);
                    }
                }
            }
            
            log.info("Batch request successful");
            return responses;

        } catch (HttpClientErrorException e) {
            log.error("Fineract API error: {}", e.getResponseBodyAsString(), e);
            throw new RegistrationException("Failed to send batch request: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Failed to send batch request: {}", e.getMessage(), e);
            throw new RegistrationException("Failed to send batch request", e);
        }
    }
}
