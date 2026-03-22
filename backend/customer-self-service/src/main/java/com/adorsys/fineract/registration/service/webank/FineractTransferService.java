package com.adorsys.fineract.registration.service.webank;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.dto.webank.TransferRequest;
import com.adorsys.fineract.registration.dto.webank.TransferResponse;
import com.adorsys.fineract.registration.exception.RegistrationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Calls the Webank custom transfer plugin endpoint for atomic transfers with fees.
 */
@Slf4j
@Service
public class FineractTransferService {

    private final RestClient fineractRestClient;
    private final FineractProperties fineractProperties;
    private final DateTimeFormatter dateFormatter;

    public FineractTransferService(RestClient fineractRestClient, FineractProperties fineractProperties) {
        this.fineractRestClient = fineractRestClient;
        this.fineractProperties = fineractProperties;
        this.dateFormatter = DateTimeFormatter.ofPattern(fineractProperties.getDefaults().getDateFormat());
    }

    /**
     * Execute an atomic transfer via the Webank custom transfer plugin.
     * POST /fineract-provider/api/v1/customtransfer
     */
    @SuppressWarnings("unchecked")
    public TransferResponse transfer(TransferRequest req) {
        log.info("Executing atomic transfer: from={}, to={}, amount={}, fee={}",
            req.fromCustomerId(), req.toCustomerId(), req.amount(), req.feeAmount());

        try {
            Map<String, Object> body = new HashMap<>();
            body.put("fromAccountId", Long.parseLong(req.fromCustomerId()));
            body.put("toAccountId", Long.parseLong(req.toCustomerId()));
            body.put("amount", req.amount());
            body.put("feeAmount", req.feeAmount() != null ? req.feeAmount() : 0);
            body.put("feeGLAccountId", req.feeGLAccountId());
            body.put("platformFeeAccountId", req.platformFeeAccountId());
            body.put("idempotencyKey", req.idempotencyKey());
            body.put("description", req.description());
            body.put("transferDate", LocalDate.now().format(dateFormatter));
            body.put("locale", fineractProperties.getDefaults().getLocale());
            body.put("dateFormat", fineractProperties.getDefaults().getDateFormat());

            Map<String, Object> response = fineractRestClient.post()
                .uri("/fineract-provider/api/v1/customtransfer")
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

            if (response == null) {
                throw new RegistrationException("Empty response from Fineract custom transfer");
            }

            return new TransferResponse(
                String.valueOf(response.getOrDefault("transferId", "")),
                String.valueOf(response.getOrDefault("fromTransactionId", "")),
                String.valueOf(response.getOrDefault("toTransactionId", "")),
                String.valueOf(response.getOrDefault("feeTransactionId", "")),
                req.amount(),
                req.feeAmount() != null ? req.feeAmount() : 0
            );
        } catch (RegistrationException e) {
            throw e;
        } catch (Exception e) {
            log.error("Custom transfer failed: {}", e.getMessage(), e);
            throw new RegistrationException("Transfer failed: " + e.getMessage(), e);
        }
    }

    /**
     * Execute a withdrawal via Fineract savings API.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> withdraw(Long savingsAccountId, long amount, String description) {
        log.info("Executing withdrawal: account={}, amount={}", savingsAccountId, amount);

        try {
            Map<String, Object> body = new HashMap<>();
            body.put("locale", fineractProperties.getDefaults().getLocale());
            body.put("dateFormat", fineractProperties.getDefaults().getDateFormat());
            body.put("transactionDate", LocalDate.now().format(dateFormatter));
            body.put("transactionAmount", amount);
            body.put("note", description);

            return fineractRestClient.post()
                .uri("/fineract-provider/api/v1/savingsaccounts/{id}/transactions?command=withdrawal", savingsAccountId)
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            log.error("Withdrawal failed for account {}: {}", savingsAccountId, e.getMessage(), e);
            throw new RegistrationException("Withdrawal failed: " + e.getMessage(), e);
        }
    }
}
