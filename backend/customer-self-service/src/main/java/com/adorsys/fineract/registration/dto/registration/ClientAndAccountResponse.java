package com.adorsys.fineract.registration.dto.registration;

import lombok.Data;

@Data
public class ClientAndAccountResponse {
    private boolean success;
    private String status;
    private Long fineractClientId;
    private Long savingsAccountId;
}
