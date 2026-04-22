package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.client.CinetPayClient;
import com.adorsys.fineract.gateway.client.MtnMomoClient;
import com.adorsys.fineract.gateway.client.NokashClient;
import com.adorsys.fineract.gateway.client.OrangeMoneyClient;
import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.dto.PaymentResponse;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Polls payment providers for the current status of a transaction.
 * Shared by StaleTransactionCleanupScheduler (PENDING reconciliation) and
 * PaymentService (on-demand status check).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProviderStatusPoller {

    private final MtnMomoClient mtnClient;
    private final OrangeMoneyClient orangeClient;
    private final CinetPayClient cinetPayClient;
    private final NokashClient nokashClient;

    /**
     * Poll result from a provider status check.
     *
     * @param status           The payment status reported by the provider.
     * @param cinetPayProvider For CinetPay transactions, the underlying provider (MTN or Orange),
     *                         or null when the provider could not be determined.
     */
    public record PollResult(PaymentStatus status, PaymentProvider cinetPayProvider) {
        public static PollResult of(PaymentStatus status) {
            return new PollResult(status, null);
        }

        public static PollResult ofCinetPay(PaymentStatus status, PaymentProvider actualProvider) {
            return new PollResult(status, actualProvider);
        }
    }

    public PollResult poll(PaymentTransaction txn) {
        try {
            return switch (txn.getProvider()) {
                case MTN_MOMO -> {
                    PaymentStatus status = txn.getType() == PaymentResponse.TransactionType.DEPOSIT
                        ? mtnClient.getCollectionStatus(txn.getTransactionId())
                        : mtnClient.getDisbursementStatus(txn.getTransactionId());
                    yield PollResult.of(status);
                }
                case ORANGE_MONEY -> PollResult.of(
                    orangeClient.getTransactionStatus(txn.getTransactionId(), txn.getProviderReference())
                );
                case CINETPAY -> {
                    CinetPayClient.VerifyResult result = cinetPayClient.verifyTransactionFull(txn.getTransactionId());
                    yield PollResult.ofCinetPay(result.status(), result.actualProvider());
                }
                case NOKASH -> PollResult.of(
                    nokashClient.getTransactionStatus(txn.getProviderReference())
                );
                default -> PollResult.of(PaymentStatus.PENDING);
            };
        } catch (Exception e) {
            log.warn("Provider poll failed for txnId={}: {}", txn.getTransactionId(), e.getMessage());
            return PollResult.of(PaymentStatus.PENDING);
        }
    }
}
