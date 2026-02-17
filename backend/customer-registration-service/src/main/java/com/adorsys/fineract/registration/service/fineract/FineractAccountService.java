package com.adorsys.fineract.registration.service.fineract;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.exception.RegistrationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class FineractAccountService {
    /**
     * This service is responsible for all account-related interactions with the Fineract API.
     * It includes functionalities such as creating and retrieving savings accounts for a given client,
     * fetching transaction history for a specific account, and identifying the owner of an account.
     * This abstracts the complexities of the Fineract API into a more manageable and focused service.
     */
    private static final String SAVINGS_ACCOUNTS = "savingsAccounts";
    private static final String TRANSACTIONS = "transactions";
    private static final String SAVINGS_ID = "savingsId";
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

    public Long createSavingsAccount(Long clientId) {
        log.info("Creating savings account for client: {}", clientId);

        Map<String, Object> savingsPayload = Map.of(
                CLIENT_ID, clientId,
                "productId", fineractProperties.getDefaults().getSavingsProductId(),
                LOCALE, fineractProperties.getDefaults().getLocale(),
                DATE_FORMAT, fineractProperties.getDefaults().getDateFormat(),
                "submittedOnDate", LocalDate.now().format(dateTimeFormatter)
        );

        try {
            @SuppressWarnings({"unchecked", "null"})
            Map<String, Object> response = fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts")
                    .body(savingsPayload)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey(SAVINGS_ID)) {
                Long savingsId = ((Number) response.get(SAVINGS_ID)).longValue();
                log.info("Created savings account with ID: {}", savingsId);
                return savingsId;
            }

            throw new RegistrationException("Failed to create savings account: invalid response");
        } catch (Exception e) {
            log.error("Failed to create savings account: {}", e.getMessage(), e);
            throw new RegistrationException("Failed to create savings account", e);
        }
    }
}
