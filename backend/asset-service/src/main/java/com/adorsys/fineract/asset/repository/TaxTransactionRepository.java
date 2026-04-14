package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.TaxTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

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
     * Sum of IRCM withheld for a specific user across all successful tax transactions.
     * Used to compute the totalIrcmWithheld summary field in UserIncomeHistoryResponse.
     */
    @Query("SELECT COALESCE(SUM(t.taxAmount), 0) FROM TaxTransaction t " +
           "WHERE t.userId = :userId AND t.taxType = 'IRCM' AND t.status = 'SUCCESS'")
    BigDecimal sumIrcmByUser(@Param("userId") Long userId);
}
