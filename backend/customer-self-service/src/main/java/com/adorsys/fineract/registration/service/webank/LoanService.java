package com.adorsys.fineract.registration.service.webank;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.dto.webank.LoanRequest;
import com.adorsys.fineract.registration.dto.webank.LoanResponse;
import com.adorsys.fineract.registration.dto.webank.TxnResponse;
import com.adorsys.fineract.registration.exception.RegistrationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Manages Fineract loan operations for Webank credit feature.
 */
@Slf4j
@Service
public class LoanService {

    private final RestClient fineractRestClient;
    private final FineractProperties fineractProperties;
    private final DateTimeFormatter dateFormatter;

    // Product ID to Fineract loan product mapping
    private static final Map<String, Integer> PRODUCT_MAP = Map.of(
        "WEBANK_SHORT_7", 10,
        "WEBANK_SHORT_14", 11,
        "WEBANK_SHORT_30", 12,
        "WEBANK_INSTALL_2", 13,
        "WEBANK_INSTALL_3", 14,
        "WEBANK_INSTALL_6", 15,
        "WEBANK_LONG_12", 16,
        "WEBANK_LONG_24", 17
    );

    public LoanService(RestClient fineractRestClient, FineractProperties fineractProperties) {
        this.fineractRestClient = fineractRestClient;
        this.fineractProperties = fineractProperties;
        this.dateFormatter = DateTimeFormatter.ofPattern(fineractProperties.getDefaults().getDateFormat());
    }

    /**
     * Create a loan, approve it, and disburse to the customer's wallet.
     */
    @SuppressWarnings("unchecked")
    public LoanResponse createAndDisburseLoan(String customerId, LoanRequest req) {
        log.info("Creating loan for customer={}, product={}, amount={}", customerId, req.productId(), req.amount());

        Integer fineractProductId = PRODUCT_MAP.get(req.productId());
        if (fineractProductId == null) {
            throw new RegistrationException("VALIDATION_ERROR", "Unknown product: " + req.productId(), "productId");
        }

        try {
            // 1. Create loan application
            Map<String, Object> loanBody = new HashMap<>();
            loanBody.put("clientId", Long.parseLong(customerId));
            loanBody.put("productId", fineractProductId);
            loanBody.put("principal", req.amount());
            loanBody.put("loanTermFrequency", req.durationValue());
            loanBody.put("loanTermFrequencyType", "days".equals(req.durationUnit()) ? 0 : 2); // 0=days, 2=months
            loanBody.put("numberOfRepayments", 1);
            loanBody.put("repaymentEvery", req.durationValue());
            loanBody.put("repaymentFrequencyType", "days".equals(req.durationUnit()) ? 0 : 2);
            loanBody.put("interestRatePerPeriod", 0); // flat fee handled separately
            loanBody.put("amortizationType", 1); // equal installments
            loanBody.put("interestType", 1); // flat
            loanBody.put("interestCalculationPeriodType", 1); // same as repayment
            loanBody.put("transactionProcessingStrategyCode", "mifos-standard-strategy");
            loanBody.put("expectedDisbursementDate", LocalDate.now().format(dateFormatter));
            loanBody.put("submittedOnDate", LocalDate.now().format(dateFormatter));
            loanBody.put("locale", fineractProperties.getDefaults().getLocale());
            loanBody.put("dateFormat", fineractProperties.getDefaults().getDateFormat());

            Map<String, Object> createResponse = fineractRestClient.post()
                .uri("/fineract-provider/api/v1/loans")
                .body(loanBody)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

            if (createResponse == null || !createResponse.containsKey("loanId")) {
                throw new RegistrationException("Failed to create loan - no loanId in response");
            }

            Long loanId = ((Number) createResponse.get("loanId")).longValue();
            log.info("Loan created: loanId={}", loanId);

            // 2. Approve loan
            Map<String, Object> approveBody = new HashMap<>();
            approveBody.put("approvedOnDate", LocalDate.now().format(dateFormatter));
            approveBody.put("locale", fineractProperties.getDefaults().getLocale());
            approveBody.put("dateFormat", fineractProperties.getDefaults().getDateFormat());

            fineractRestClient.post()
                .uri("/fineract-provider/api/v1/loans/{loanId}?command=approve", loanId)
                .body(approveBody)
                .retrieve()
                .toBodilessEntity();

            // 3. Disburse loan
            Map<String, Object> disburseBody = new HashMap<>();
            disburseBody.put("actualDisbursementDate", LocalDate.now().format(dateFormatter));
            disburseBody.put("locale", fineractProperties.getDefaults().getLocale());
            disburseBody.put("dateFormat", fineractProperties.getDefaults().getDateFormat());

            fineractRestClient.post()
                .uri("/fineract-provider/api/v1/loans/{loanId}?command=disburse", loanId)
                .body(disburseBody)
                .retrieve()
                .toBodilessEntity();

            log.info("Loan disbursed: loanId={}", loanId);

            // Calculate repayment date
            LocalDate repaymentDate = "days".equals(req.durationUnit())
                ? LocalDate.now().plusDays(req.durationValue())
                : LocalDate.now().plusMonths(req.durationValue());

            return new LoanResponse(
                String.valueOf(loanId),
                req.amount(),
                LocalDate.now().toString(),
                repaymentDate.toString(),
                List.of(new LoanResponse.RepaymentEntry(repaymentDate.toString(), req.amount(), "pending"))
            );
        } catch (RegistrationException e) {
            throw e;
        } catch (Exception e) {
            log.error("Loan creation failed for customer {}: {}", customerId, e.getMessage(), e);
            throw new RegistrationException("Loan creation failed: " + e.getMessage(), e);
        }
    }

    /**
     * Record a loan repayment.
     */
    public TxnResponse repayLoan(String customerId, String loanId, long amount, String idempotencyKey) {
        log.info("Repaying loan: loanId={}, amount={}", loanId, amount);

        try {
            Map<String, Object> body = new HashMap<>();
            body.put("transactionDate", LocalDate.now().format(dateFormatter));
            body.put("transactionAmount", amount);
            body.put("locale", fineractProperties.getDefaults().getLocale());
            body.put("dateFormat", fineractProperties.getDefaults().getDateFormat());

            @SuppressWarnings("unchecked")
            Map<String, Object> response = fineractRestClient.post()
                .uri("/fineract-provider/api/v1/loans/{loanId}/transactions?command=repayment", Long.parseLong(loanId))
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

            String txnId = response != null ? String.valueOf(response.getOrDefault("resourceId", "")) : "";
            return new TxnResponse(txnId, amount, 0);
        } catch (Exception e) {
            log.error("Loan repayment failed: loanId={}, error={}", loanId, e.getMessage(), e);
            throw new RegistrationException("Loan repayment failed: " + e.getMessage(), e);
        }
    }

    /**
     * Get active loan for a customer.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getActiveLoan(String customerId) {
        try {
            List<Map<String, Object>> loans = fineractRestClient.get()
                .uri("/fineract-provider/api/v1/loans?sqlSearch=client_id=" + customerId + " and loan_status_id=300")
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});

            if (loans != null && !loans.isEmpty()) {
                return loans.get(0);
            }
            return null;
        } catch (Exception e) {
            log.error("Failed to get active loan for customer {}: {}", customerId, e.getMessage());
            return null;
        }
    }

    /**
     * Get loan history for a customer.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getLoanHistory(String customerId) {
        try {
            List<Map<String, Object>> loans = fineractRestClient.get()
                .uri("/fineract-provider/api/v1/loans?sqlSearch=client_id=" + customerId)
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});

            return loans != null ? loans : List.of();
        } catch (Exception e) {
            log.error("Failed to get loan history for customer {}: {}", customerId, e.getMessage());
            return List.of();
        }
    }
}
