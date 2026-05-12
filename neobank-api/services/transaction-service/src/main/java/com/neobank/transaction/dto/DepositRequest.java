package com.neobank.transaction.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record DepositRequest(
        @NotBlank @Size(max = 32) String accountNumber,
        @NotNull @DecimalMin(value = "0.01", message = "Amount must be greater than 0") BigDecimal amount,
        @Size(max = 500) String description,
        @Size(max = 128) String idempotencyKey
) {
}
