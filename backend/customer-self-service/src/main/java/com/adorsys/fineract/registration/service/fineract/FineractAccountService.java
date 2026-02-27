package com.adorsys.fineract.registration.service.fineract;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.exception.RegistrationException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Slf4j
@Service
public class FineractAccountService {
    private static final String SAVINGS_ACCOUNTS = "savingsAccounts";
    private static final String TRANSACTIONS = "transactions";
    private static final String CLIENT_ID = "clientId";
    private static final String LOCALE = "locale";
    private static final String DATE_FORMAT = "dateFormat";

    private final RestClient fineractRestClient;
    private final FineractProperties fineractProperties;
    private final DateTimeFormatter dateTimeFormatter;

    public FineractAccountService(RestClient fineractRestClient, FineractProperties fineractProperties) {
        this.fineractRestClient = fineractRestClient;
        this.fineractProperties = fineractProperties;
        this.dateTimeFormatter = DateTimeFormatter.ofPattern(fineractProperties.getDefaults().getDateFormat());
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getSavingsAccountsByClientId(Long clientId) {
        log.info("Getting savings accounts for client: {}", clientId);

        try {
            Map<String, Object> response = fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/accounts", clientId)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey(SAVINGS_ACCOUNTS)) {
                return (List<Map<String, Object>>) response.get(SAVINGS_ACCOUNTS);
            }
            return List.of();
        } catch (Exception e) {
            log.error("Failed to get savings accounts for client {}: {}", clientId, e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getSavingsAccount(Long accountId) {
        log.info("Getting savings account: {}", accountId);

        try {
            return fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{accountId}", accountId)
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            log.error("Failed to get savings account {}: {}", accountId, e.getMessage());
            return Map.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getSavingsAccountTransactions(Long accountId) {
        log.info("Getting transactions for savings account: {}", accountId);

        try {
            Map<String, Object> response = fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{accountId}?associations=transactions", accountId)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey(TRANSACTIONS)) {
                return (List<Map<String, Object>>) response.get(TRANSACTIONS);
            }
            return List.of();
        } catch (Exception e) {
            log.error("Failed to get transactions for account {}: {}", accountId, e.getMessage());
            return List.of();
        }
    }

    public Long getSavingsAccountOwner(Long accountId) {
        Map<String, Object> account = getSavingsAccount(accountId);
        if (account != null && account.containsKey(CLIENT_ID)) {
            return ((Number) account.get(CLIENT_ID)).longValue();
        }
        return null;
    }

    public void approveSavingsAccount(Long savingsAccountId) {
        log.info("Approving savings account: {}", savingsAccountId);
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("approvedOnDate", LocalDate.now().format(dateTimeFormatter));
            body.put(LOCALE, fineractProperties.getDefaults().getLocale());
            body.put(DATE_FORMAT, fineractProperties.getDefaults().getDateFormat());

            fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{savingsAccountId}?command=approve", savingsAccountId)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.error("Failed to approve savings account {}: {}", savingsAccountId, e.getMessage());
            throw new RegistrationException("Failed to approve savings account", e);
        }
    }

    public void activateSavingsAccount(Long savingsAccountId) {
        log.info("Activating savings account: {}", savingsAccountId);
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("activatedOnDate", LocalDate.now().format(dateTimeFormatter));
            body.put(LOCALE, fineractProperties.getDefaults().getLocale());
            body.put(DATE_FORMAT, fineractProperties.getDefaults().getDateFormat());

            fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{savingsAccountId}?command=activate", savingsAccountId)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.error("Failed to activate savings account {}: {}", savingsAccountId, e.getMessage());
            throw new RegistrationException("Failed to activate savings account", e);
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> makeDeposit(Long savingsAccountId, BigDecimal amount) {
        log.info("Making deposit to savings account: {}", savingsAccountId);
        try {
            Map<String, Object> body = new HashMap<>();
            body.put(LOCALE, fineractProperties.getDefaults().getLocale());
            body.put(DATE_FORMAT, fineractProperties.getDefaults().getDateFormat());
            body.put("transactionDate", LocalDate.now().format(dateTimeFormatter));
            body.put("transactionAmount", amount);
            body.put("paymentTypeId", fineractProperties.getDefaults().getPaymentTypeId());

            return fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{savingsAccountId}/transactions?command=deposit", savingsAccountId)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            log.error("Failed to make deposit to savings account {}: {}", savingsAccountId, e.getMessage());
            throw new RegistrationException("Failed to make deposit", e);
        }
    }
}
