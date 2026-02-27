package com.adorsys.fineract.registration.dto.deposit;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DepositRequest {
    private Long savingsAccountId;
    private BigDecimal depositAmount;
}
