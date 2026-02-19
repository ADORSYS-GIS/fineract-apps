package com.adorsys.fineract.gateway.entity;

import com.adorsys.fineract.gateway.dto.PaymentProvider;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "reversal_dead_letters")
@Getter
@Setter
@NoArgsConstructor
public class ReversalDeadLetter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 36, nullable = false)
    private String transactionId;

    private Long fineractTxnId;

    @Column(nullable = false)
    private Long accountId;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(length = 3, nullable = false)
    private String currency = "XAF";

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private PaymentProvider provider;

    @Column(length = 500)
    private String failureReason;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private boolean resolved = false;

    @Column(length = 100)
    private String resolvedBy;

    private Instant resolvedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    public ReversalDeadLetter(String transactionId, Long fineractTxnId, Long accountId,
                              BigDecimal amount, String currency, PaymentProvider provider,
                              String failureReason) {
        this.transactionId = transactionId;
        this.fineractTxnId = fineractTxnId;
        this.accountId = accountId;
        this.amount = amount;
        this.currency = currency;
        this.provider = provider;
        this.failureReason = failureReason;
    }
}
