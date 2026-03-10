package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.TaxTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface TaxTransactionRepository extends JpaRepository<TaxTransaction, Long> {

    /**
     * Sum of capital gains taxable amounts for a user in a given fiscal year.
     * Used to check the 500,000 XAF annual exemption threshold.
     */
    @Query("SELECT COALESCE(SUM(t.taxableAmount), 0) FROM TaxTransaction t " +
           "WHERE t.userId = :userId AND t.fiscalYear = :fiscalYear " +
           "AND t.taxType = 'CAPITAL_GAINS' AND t.status = 'SUCCESS'")
    BigDecimal sumCapitalGainsByUserAndYear(@Param("userId") Long userId,
                                            @Param("fiscalYear") int fiscalYear);
}
