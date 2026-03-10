package com.adorsys.fineract.gateway.entity;

import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.dto.PaymentResponse.TransactionType;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payment_transactions", indexes = {
    @Index(name = "idx_provider_reference", columnList = "providerReference"),
    @Index(name = "idx_external_id_created", columnList = "externalId, createdAt"),
    @Index(name = "idx_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
public class PaymentTransaction {

    @Id
    @Column(length = 36)
    private String transactionId;  // UUID - serves as idempotency key

    @Column(length = 255)
    private String providerReference;

    @Column(length = 36, nullable = false)
    private String externalId;  // Customer external ID

    @Column(nullable = false)
    private Long accountId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private PaymentProvider provider;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private TransactionType type;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(length = 3, nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private PaymentStatus status;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    private Long fineractTransactionId;

    @Column(length = 255)
    private String notifToken;

    @Version
    private Long version;  // Optimistic locking for concurrent callback handling

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // Builder-style constructor for convenience
    public PaymentTransaction(String transactionId, String providerReference, String externalId,
                              Long accountId, PaymentProvider provider, TransactionType type,
                              BigDecimal amount, String currency, PaymentStatus status) {
        this.transactionId = transactionId;
        this.providerReference = providerReference;
        this.externalId = externalId;
        this.accountId = accountId;
        this.provider = provider;
        this.type = type;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
    }
}
