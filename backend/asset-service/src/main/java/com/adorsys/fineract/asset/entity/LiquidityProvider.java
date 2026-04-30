package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "liquidity_providers")
public class LiquidityProvider {

    /** Fineract client ID — natural PK, assigned externally. */
    @Id
    @Column(name = "client_id")
    private Long clientId;

    @Column(name = "client_name", length = 200)
    private String clientName;

    /** LSAV savings account — LP cash pool shared across all assets. */
    @Column(name = "cash_account_id")
    private Long cashAccountId;

    /** LSPD savings account — spread margin collected from trades. */
    @Column(name = "spread_account_id")
    private Long spreadAccountId;

    /** LTAX savings account — tax withheld from LP on sell transactions. */
    @Column(name = "tax_account_id")
    private Long taxAccountId;

    /** Human-readable Fineract account number for the cash account (e.g. "000000042"). */
    @Column(name = "cash_account_no", length = 32)
    private String cashAccountNo;

    /** Human-readable Fineract account number for the spread account. */
    @Column(name = "spread_account_no", length = 32)
    private String spreadAccountNo;

    /** Human-readable Fineract account number for the tax account. */
    @Column(name = "tax_account_no", length = 32)
    private String taxAccountNo;
}
