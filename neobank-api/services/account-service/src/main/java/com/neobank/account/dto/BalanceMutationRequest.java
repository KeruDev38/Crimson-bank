package com.neobank.account.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record BalanceMutationRequest(
        String ownerUsername,

        @NotNull
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        BigDecimal amount
) {
}
