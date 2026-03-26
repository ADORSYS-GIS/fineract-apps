package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.TaxTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public interface TaxTransactionRepository extends JpaRepository<TaxTransaction, Long> {

    /**
     * Sum of capital gains taxable amounts for a user in a given fiscal year.
     * Uses FOR UPDATE to prevent concurrent trades from reading stale cumulative totals
     * during the annual 500,000 XAF exemption check.
     */
    @Query(value = "SELECT COALESCE(SUM(t.taxable_amount), 0) FROM tax_transactions t " +
           "WHERE t.user_id = :userId AND t.fiscal_year = :fiscalYear " +
           "AND t.tax_type = 'CAPITAL_GAINS' AND t.status = 'SUCCESS' " +
           "FOR UPDATE",
           nativeQuery = true)
    BigDecimal sumCapitalGainsByUserAndYear(@Param("userId") Long userId,
                                            @Param("fiscalYear") int fiscalYear);

    /**
     * Sum of all successful tax amounts collected for a given tax type.
     * Used by reconciliation to compare against Fineract tax account balances.
     */
    @Query("SELECT COALESCE(SUM(t.taxAmount), 0) FROM TaxTransaction t " +
           "WHERE t.taxType = :taxType AND t.status = 'SUCCESS'")
    BigDecimal sumCollectedByTaxType(@Param("taxType") String taxType);

    /**
     * Aggregate tax amounts grouped by tax type within a date range.
     * Returns rows of [taxType, sumTaxAmount, count].
     */
    /** Callers must pass non-null Instants (use Instant.EPOCH / Instant.now() for unbounded). */
    @Query("SELECT t.taxType, COALESCE(SUM(t.taxAmount), 0), COUNT(t) FROM TaxTransaction t " +
           "WHERE t.status = 'SUCCESS' " +
           "AND t.createdAt >= :from AND t.createdAt < :to " +
           "GROUP BY t.taxType")
    List<Object[]> sumByTaxTypeAndDateRange(@Param("from") Instant from, @Param("to") Instant to);
}
