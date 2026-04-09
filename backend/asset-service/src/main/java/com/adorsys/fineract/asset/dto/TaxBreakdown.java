package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

/**
 * Itemized tax breakdown for a trade quote, embedded in {@link QuoteResponse}.
 *
 * <p>Cameroon/CEMAC tax rules apply three possible charges to asset trades:</p>
 * <ol>
 *   <li><b>Registration duty</b> — applies to all trades when enabled for the asset (typically 2%).</li>
 *   <li><b>Capital gains tax</b> — applies to SELL trades where the sale price exceeds the holder's
 *       average acquisition cost (typically 16.5%). Zero for BUY trades. Exempt if the holder's
 *       total annual realized gains are below 500,000 XAF.</li>
 *   <li><b>TVA (VAT)</b> — applies when enabled for the asset (typically 19.25%). Zero if disabled.</li>
 * </ol>
 *
 * <p>All rate fields express percentages as decimals (e.g. {@code 0.02} = 2%).
 * All amount fields are in XAF.</p>
 *
 * <p>Null for the whole {@code TaxBreakdown} object when no taxes are configured for the asset.</p>
 */
public record TaxBreakdown(
    /**
     * Registration duty rate as a decimal (e.g. {@code 0.02} = 2%).
     * Applied to the gross trade value on both BUY and SELL transactions
     * when registration duty is enabled for this asset.
     */
    @Schema(description = "Registration duty rate (e.g. 0.02 = 2%).")
    BigDecimal registrationDutyRate,

    /**
     * Registration duty amount charged on this trade, in XAF.
     * Equals {@code grossAmount * registrationDutyRate}.
     * Zero when registration duty is disabled for this asset.
     */
    @Schema(description = "Registration duty amount in XAF.")
    BigDecimal registrationDutyAmount,

    /**
     * Capital gains tax rate as a decimal (e.g. {@code 0.165} = 16.5%).
     * Applicable only on SELL trades. Zero for BUY trades, and null when capital
     * gains tax is disabled for this asset.
     */
    @Schema(description = "Capital gains tax rate (e.g. 0.165 = 16.5%). Zero for BUY.", nullable = true)
    BigDecimal capitalGainsRate,

    /**
     * Capital gains tax amount charged on this trade, in XAF.
     * Calculated on the realized gain: {@code (salePrice - avgCostBasis) * units * rate}.
     * Zero for BUY trades or when there is no gain. Null when capital gains tax is disabled.
     */
    @Schema(description = "Capital gains tax amount in XAF. Zero for BUY.", nullable = true)
    BigDecimal capitalGainsTaxAmount,

    /**
     * TVA (VAT) rate as a decimal (e.g. {@code 0.1925} = 19.25%).
     * Zero when TVA is disabled for this asset. Null when not applicable.
     */
    @Schema(description = "TVA (VAT) rate (e.g. 0.1925 = 19.25%). Zero if disabled.", nullable = true)
    BigDecimal tvaRate,

    /**
     * TVA (VAT) amount charged on this trade, in XAF.
     * Applied to the trade fee amount, not the gross trade value.
     * Zero when TVA is disabled for this asset. Null when not applicable.
     */
    @Schema(description = "TVA amount in XAF. Zero if disabled.", nullable = true)
    BigDecimal tvaAmount,

    /**
     * Sum of all tax charges for this trade, in XAF.
     * Equals {@code registrationDutyAmount + capitalGainsTaxAmount + tvaAmount}.
     * This amount is included in the {@code netAmount} of the parent {@link QuoteResponse}.
     */
    @Schema(description = "Total tax amount (registration duty + capital gains + TVA).")
    BigDecimal totalTaxAmount,

    /**
     * Whether the capital gains exemption was applied to this trade.
     * {@code true} when the holder's cumulative realized gains for the current calendar year
     * are below the 500,000 XAF exemption threshold, resulting in zero capital gains tax.
     * Always {@code false} for BUY trades.
     */
    @Schema(description = "True if capital gains exemption was applied (annual gains < 500,000 XAF).")
    boolean capitalGainsExemptionApplied
) {}
