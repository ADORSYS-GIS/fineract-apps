package com.adorsys.fineract.registration.dto.deposit;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class DepositRequest {
    private Long savingsAccountId;
    private BigDecimal depositAmount;
    @NotBlank(message = "Payment type is required")
    private String paymentType;
}
