package com.neobank.account.dto;

import com.neobank.account.domain.Account;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AccountResponse(
        Long id,
        String accountNumber,
        Account.AccountType type,
        Account.AccountStatus status,
        String currency,
        String nickname,
        BigDecimal balance,
        BigDecimal availableBalance,
        BigDecimal dailyTransferLimit,
        BigDecimal dailyWithdrawalLimit,
        LocalDateTime lastActivityAt,
        LocalDateTime createdAt
) {

    public static AccountResponse from(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getType(),
                account.getStatus(),
                account.getCurrency(),
                account.getNickname(),
                account.getBalance(),
                account.getAvailableBalance(),
                account.getDailyTransferLimit(),
                account.getDailyWithdrawalLimit(),
                account.getLastActivityAt(),
                account.getCreatedAt()
        );
    }
}
