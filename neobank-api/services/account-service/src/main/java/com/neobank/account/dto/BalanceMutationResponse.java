package com.neobank.account.dto;

import java.math.BigDecimal;

public record BalanceMutationResponse(
        String accountNumber,
        BigDecimal balance,
        BigDecimal availableBalance
) {
}
