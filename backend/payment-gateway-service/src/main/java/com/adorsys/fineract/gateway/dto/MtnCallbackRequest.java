package com.adorsys.fineract.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Callback payload from MTN MoMo API.
 *
 * MTN sends callbacks for both collection (deposits) and disbursement (withdrawals).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MtnCallbackRequest {

    /**
     * Reference ID from the original request
     */
    @JsonProperty("referenceId")
    private String referenceId;

    /**
     * External ID from the original request
     */
    @JsonProperty("externalId")
    private String externalId;

    /**
     * Transaction status: SUCCESSFUL, FAILED, PENDING
     */
    @JsonProperty("status")
    private String status;

    /**
     * Reason for failure (if status is FAILED)
     */
    @JsonProperty("reason")
    private String reason;

    /**
     * Financial transaction ID from MTN
     */
    @JsonProperty("financialTransactionId")
    private String financialTransactionId;

    /**
     * Amount of the transaction
     */
    @JsonProperty("amount")
    private String amount;

    /**
     * Currency code
     */
    @JsonProperty("currency")
    private String currency;

    /**
     * Payer information (for collections)
     */
    @JsonProperty("payer")
    private PartyInfo payer;

    /**
     * Payee information (for disbursements)
     */
    @JsonProperty("payee")
    private PartyInfo payee;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PartyInfo {
        @JsonProperty("partyIdType")
        private String partyIdType;

        @JsonProperty("partyId")
        private String partyId;
    }

    public boolean isSuccessful() {
        return "SUCCESSFUL".equalsIgnoreCase(status);
    }

    public boolean isFailed() {
        return "FAILED".equalsIgnoreCase(status);
    }
}
