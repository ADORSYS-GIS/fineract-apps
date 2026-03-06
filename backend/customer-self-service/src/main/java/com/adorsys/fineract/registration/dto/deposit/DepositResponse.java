package com.adorsys.fineract.registration.dto.deposit;

import lombok.Data;

@Data
public class DepositResponse {
    private boolean success;
    private String status;
    private Long savingsAccountId;
    private Long transactionId;
}
