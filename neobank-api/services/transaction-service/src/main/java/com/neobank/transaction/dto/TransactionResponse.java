package com.neobank.transaction.dto;

import com.neobank.transaction.domain.Transaction;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        String reference,
        String fromAccountNumber,
        String toAccountNumber,
        BigDecimal amount,
        String currency,
        Transaction.TransactionType type,
        Transaction.TransactionStatus status,
        Transaction.TransactionChannel channel,
        String description,
        BigDecimal fee,
        BigDecimal balanceAfter,
        LocalDateTime transactionDate,
        LocalDateTime processedAt
) {
    public static TransactionResponse from(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getReference(),
                transaction.getFromAccountNumber(),
                transaction.getToAccountNumber(),
                transaction.getAmount(),
                transaction.getCurrency(),
                transaction.getType(),
                transaction.getStatus(),
                transaction.getChannel(),
                transaction.getDescription(),
                transaction.getFee(),
                transaction.getBalanceAfter(),
                transaction.getTransactionDate(),
                transaction.getProcessedAt()
        );
    }
}
