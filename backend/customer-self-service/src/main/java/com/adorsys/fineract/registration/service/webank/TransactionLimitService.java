package com.adorsys.fineract.registration.service.webank;

import com.adorsys.fineract.registration.config.WebankProperties;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;

/**
 * Enforces KYC-tier transaction limits per the Webank PRD.
 * All amounts in XAF minor units (int64).
 * -1 = unlimited, 0 = blocked.
 */
@Slf4j
@Service
public class TransactionLimitService {

    private final StringRedisTemplate redis;
    private final WebankProperties props;

    // Per-transaction limits by KYC level
    private static final Map<Integer, Long> P2P_PER_TXN = Map.of(1, 50_000L, 2, -1L, 3, -1L);
    private static final Map<Integer, Long> P2P_DAILY = Map.of(1, 50_000L, 2, 1_000_000L, 3, -1L);
    private static final Map<Integer, Long> TOPUP_MONTHLY = Map.of(1, 100_000L, 2, -1L, 3, -1L);
    private static final Map<Integer, Long> CASHOUT_PER_OP = Map.of(1, 0L, 2, 500_000L, 3, 500_000L);
    private static final Map<Integer, Long> MERCHANT_PER_TXN = Map.of(1, 25_000L, 2, -1L, 3, -1L);
    private static final Map<Integer, Long> SEND_MOMO = Map.of(1, 0L, 2, 500_000L, 3, -1L);

    public TransactionLimitService(StringRedisTemplate redis, WebankProperties props) {
        this.redis = redis;
        this.props = props;
    }

    /**
     * Validates a transaction against KYC-tier limits.
     * @throws LimitExceededException if any limit is exceeded
     */
    public void validateTransaction(String customerId, String userId, int kycLevel, String opType, long amount) {
        // 1. Check recovery cooling period first (overrides all other limits)
        if (isRecovering(userId) && amount > props.recoveryCoolingCap()) {
            throw new LimitExceededException("RECOVERY_COOLING_LIMIT", props.recoveryCoolingCap(),
                "Recovery cooling period active. Maximum " + props.recoveryCoolingCap() + " XAF per transaction.");
        }

        // 2. Check per-transaction limit
        long perTxnLimit = getPerTxnLimit(kycLevel, opType);
        if (perTxnLimit == 0) {
            throw new LimitExceededException("LIMIT_EXCEEDED", 0,
                opType + " is blocked at KYC level " + kycLevel + ". Please upgrade your KYC level.");
        }
        if (perTxnLimit > 0 && amount > perTxnLimit) {
            throw new LimitExceededException("LIMIT_EXCEEDED", perTxnLimit,
                "Per-transaction limit exceeded. Maximum: " + perTxnLimit + " XAF.");
        }

        // 3. Check daily accumulation for P2P
        if ("p2p".equals(opType)) {
            long dailyLimit = P2P_DAILY.getOrDefault(kycLevel, 50_000L);
            if (dailyLimit > 0) {
                long used = getDailyUsed(customerId, "p2p");
                if (used + amount > dailyLimit) {
                    throw new LimitExceededException("LIMIT_EXCEEDED", dailyLimit - used,
                        "Daily P2P limit exceeded. Remaining: " + (dailyLimit - used) + " XAF.");
                }
            }
        }

        // 4. Check monthly accumulation for top-up
        if ("topup".equals(opType)) {
            long monthlyLimit = TOPUP_MONTHLY.getOrDefault(kycLevel, 100_000L);
            if (monthlyLimit > 0) {
                long used = getMonthlyUsed(customerId, "topup");
                if (used + amount > monthlyLimit) {
                    throw new LimitExceededException("LIMIT_EXCEEDED", monthlyLimit - used,
                        "Monthly top-up limit exceeded. Remaining: " + (monthlyLimit - used) + " XAF.");
                }
            }
        }

        log.debug("Transaction validated: customer={}, op={}, amount={}, kycLevel={}", customerId, opType, amount, kycLevel);
    }

    /**
     * Records a successful transaction for accumulation tracking.
     */
    public void recordTransaction(String customerId, String opType, long amount) {
        String dailyKey = "limit:daily:" + opType + ":" + customerId;
        redis.opsForValue().increment(dailyKey, amount);
        redis.expire(dailyKey, Duration.ofSeconds(props.dailyLimitTtl()));

        String monthlyKey = "limit:monthly:" + opType + ":" + customerId;
        redis.opsForValue().increment(monthlyKey, amount);
        redis.expire(monthlyKey, Duration.ofSeconds(props.monthlyLimitTtl()));
    }

    public boolean isRecovering(String userId) {
        return Boolean.TRUE.equals(redis.hasKey("recovering:" + userId));
    }

    public long getDailyUsed(String customerId, String opType) {
        String val = redis.opsForValue().get("limit:daily:" + opType + ":" + customerId);
        return val != null ? Long.parseLong(val) : 0;
    }

    public long getMonthlyUsed(String customerId, String opType) {
        String val = redis.opsForValue().get("limit:monthly:" + opType + ":" + customerId);
        return val != null ? Long.parseLong(val) : 0;
    }

    public long getPerTxnLimit(int kycLevel, String opType) {
        return switch (opType) {
            case "p2p" -> P2P_PER_TXN.getOrDefault(kycLevel, 50_000L);
            case "cashout" -> CASHOUT_PER_OP.getOrDefault(kycLevel, 0L);
            case "merchant" -> MERCHANT_PER_TXN.getOrDefault(kycLevel, 25_000L);
            case "send_momo" -> SEND_MOMO.getOrDefault(kycLevel, 0L);
            case "topup" -> TOPUP_MONTHLY.getOrDefault(kycLevel, 100_000L);
            default -> -1L; // unlimited for unknown ops
        };
    }

    public long getDailyLimit(int kycLevel, String opType) {
        if ("p2p".equals(opType)) return P2P_DAILY.getOrDefault(kycLevel, 50_000L);
        return -1L;
    }

    public long getMonthlyLimit(int kycLevel, String opType) {
        if ("topup".equals(opType)) return TOPUP_MONTHLY.getOrDefault(kycLevel, 100_000L);
        return -1L;
    }

    @Getter
    public static class LimitExceededException extends RuntimeException {
        private final String code;
        private final long limit;

        public LimitExceededException(String code, long limit, String message) {
            super(message);
            this.code = code;
            this.limit = limit;
        }
    }
}
