package com.adorsys.fineract.registration.service.fineract;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.exception.FineractApiException;
import com.adorsys.fineract.registration.exception.IdempotencyException;
import com.adorsys.fineract.registration.exception.ValidationException;
import com.adorsys.fineract.registration.exception.RegistrationException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.concurrent.ConcurrentHashMap;


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
    private final RedisTemplate<String, Object> redisTemplate;

    public FineractAccountService(RestClient fineractRestClient, FineractProperties fineractProperties, RedisTemplate<String, Object> redisTemplate) {
        this.fineractRestClient = fineractRestClient;
        this.fineractProperties = fineractProperties;
        this.dateTimeFormatter = DateTimeFormatter.ofPattern(fineractProperties.getDefaults().getDateFormat());
        this.redisTemplate = redisTemplate;
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getSavingsAccountsByClientId(Long clientId) {
        log.info("Getting savings accounts for client: {}", clientId);

        try {
            Map<String, Object> response = fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/accounts", clientId)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});

            if (response != null && response.containsKey(SAVINGS_ACCOUNTS)) {
                return (List<Map<String, Object>>) response.get(SAVINGS_ACCOUNTS);
            }
            return List.of();
        } catch (Exception e) {
            log.error("Failed to get savings accounts for client {}: {}", clientId, e.getMessage());
            return List.of();
        }
    }

    public Map<String, Object> getSavingsAccount(Long accountId) {
        log.info("Getting savings account: {}", accountId);

        try {
            return fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{accountId}", accountId)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});
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
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});

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
            throw new FineractApiException("Failed to approve savings account", e);
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
            throw new FineractApiException("Failed to activate savings account", e);
        }
    }

    public Map<String, Object> makeDeposit(Long savingsAccountId, BigDecimal amount, String paymentType) {
        return makeDeposit(savingsAccountId, amount, paymentType, null);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> makeDeposit(Long savingsAccountId, BigDecimal amount, String paymentType, String idempotencyKey) {
        if (idempotencyKey == null) {
            log.info("No idempotency key provided. Proceeding with standard deposit.");
            return performDeposit(savingsAccountId, amount, paymentType);
        }
        log.info("Idempotency key provided: {}. Starting idempotent deposit flow.", idempotencyKey);

        String lockKey = idempotencyKey + ":lock";
        Boolean lockAcquired = redisTemplate.opsForValue().setIfAbsent(lockKey, "true", 1, TimeUnit.MINUTES);

        if (Boolean.TRUE.equals(lockAcquired)) {
            log.info("Successfully acquired lock for idempotency key: {}", idempotencyKey);
            try {
                Object cachedResponse = getCachedResponse(idempotencyKey);
                if (cachedResponse != null) {
                    log.info("Returning cached response for idempotency key: {}", idempotencyKey);
                    return (Map<String, Object>) cachedResponse;
                }

                log.info("No cached response found. Proceeding with new deposit for idempotency key: {}", idempotencyKey);
                Map<String, Object> response = performDeposit(savingsAccountId, amount, paymentType);
                cacheResponse(idempotencyKey, response);
                return response;
            } finally {
                log.debug("Releasing lock for idempotency key: {}", idempotencyKey);
                redisTemplate.delete(lockKey);
            }
        } else {
            log.warn("Failed to acquire lock for idempotency key: {}. Another request may be in progress.", idempotencyKey);
            // If lock is not acquired, another request is in progress.
            // Wait a bit and check for the cached response.
            try {
                log.info("Waiting for a short period for other request to complete...");
                Thread.sleep(500); // Wait for 500ms
                Object cachedResponse = getCachedResponse(idempotencyKey);
                if (cachedResponse != null) {
                    log.info("Found cached response after waiting for idempotency key: {}", idempotencyKey);
                    return (Map<String, Object>) cachedResponse;
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IdempotencyException("Thread interrupted while waiting for idempotency key", e);
            }
            log.error("Could not acquire lock and no cached response found after waiting for idempotency key: {}", idempotencyKey);
            throw new IdempotencyException("Another request with the same idempotency key is already being processed.");
        }
    }

    private final Map<String, Long> paymentTypeCache = new ConcurrentHashMap<>();

    private Map<String, Object> performDeposit(Long savingsAccountId, BigDecimal amount, String paymentType) {
        log.info("Making deposit to savings account: {}", savingsAccountId);
        try {
            Map<String, Object> body = new HashMap<>();
            body.put(LOCALE, fineractProperties.getDefaults().getLocale());
            body.put(DATE_FORMAT, fineractProperties.getDefaults().getDateFormat());
            body.put("transactionDate", LocalDate.now().format(dateTimeFormatter));
            body.put("transactionAmount", amount);

            Long paymentTypeId = getPaymentTypeIdByName(paymentType);
            body.put("paymentTypeId", paymentTypeId);

            Map<String, Object> response = fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{savingsAccountId}/transactions?command=deposit", savingsAccountId)
                    .body(body)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});
            log.debug("Successfully made deposit. Fineract response: {}", response);
            return response;
        } catch (RegistrationException | ValidationException e) {
            throw e; // Re-throw it as is
        } catch (Exception e) {
            log.error("Failed to make deposit to savings account {}: {}", savingsAccountId, e.getMessage());
            throw new FineractApiException("Failed to make deposit", e);
        }
    }

    private Long getPaymentTypeIdByName(String paymentTypeName) {
        String key = paymentTypeName.toLowerCase();
        // Check cache first
        if (paymentTypeCache.containsKey(key)) {
            log.info("Payment type cache hit for '{}'.", paymentTypeName);
            return paymentTypeCache.get(key);
        }

        // If not in cache, fetch from API
        log.info("Payment type cache miss for '{}'. Fetching all payment types from API.", paymentTypeName);
        List<Map<String, Object>> paymentTypes = fineractRestClient.get()
                .uri("/fineract-provider/api/v1/paymenttypes")
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});

        if (paymentTypes != null) {
            // Populate cache with lowercase keys for case-insensitive lookup
            log.debug("Populating payment type cache with {} entries.", paymentTypes.size());
            for (Map<String, Object> pt : paymentTypes) {
                String name = (String) pt.get("name");
                Long id = ((Number) pt.get("id")).longValue();
                paymentTypeCache.put(name.toLowerCase(), id);
            }
        }

        // Check cache again
        if (paymentTypeCache.containsKey(key)) {
            return paymentTypeCache.get(key);
        }

        log.error("Payment type '{}' not found after fetching from API.", paymentTypeName);
        throw new ValidationException("Payment type not found: " + paymentTypeName, "paymentType");
    }


    private Object getCachedResponse(String idempotencyKey) {
        if (idempotencyKey == null) {
            return null;
        }
        try {
            Object cachedValue = redisTemplate.opsForValue().get(idempotencyKey);
            if (cachedValue != null) {
                log.debug("Idempotency cache hit for key: {}", idempotencyKey);
            } else {
                log.debug("Idempotency cache miss for key: {}", idempotencyKey);
            }
            return cachedValue;
        } catch (Exception e) {
            log.error("Redis error while checking idempotency key: {}", e.getMessage());
            // Fail closed
            throw new IdempotencyException("Failed to check idempotency key", e);
        }
    }

    private void cacheResponse(String idempotencyKey, Map<String, Object> response) {
        if (idempotencyKey == null || response == null) {
            return;
        }

        int maxRetries = 3;
        long delayMs = 100; // 100 milliseconds

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                log.info("Attempt {} of {}: Caching successful response for idempotency key: {}", attempt, maxRetries, idempotencyKey);
                redisTemplate.opsForValue().set(idempotencyKey, response, 24, TimeUnit.HOURS);
                return; // Success, exit the method
            } catch (Exception e) {
                log.warn("Attempt {} of {} failed to cache response for idempotency key: {}. Retrying in {}ms.", attempt, maxRetries, e.getMessage(), delayMs);
                if (attempt == maxRetries) {
                    log.error("Redis error after {} attempts while storing idempotency key: {}. This may lead to duplicate transactions.", maxRetries, e.getMessage());
                    throw new IdempotencyException("Failed to cache response for idempotency key after " + maxRetries + " attempts", e);
                }
                try {
                    Thread.sleep(delayMs);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new IdempotencyException("Thread interrupted during retry delay for caching", ie);
                }
            }
        }
    }
}
