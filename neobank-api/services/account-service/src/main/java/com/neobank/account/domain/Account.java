package com.neobank.account.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_username", nullable = false, length = 50)
    private String ownerUsername;

    @Column(name = "account_number", nullable = false, unique = true, length = 32)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AccountType type = AccountType.CHECKING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AccountStatus status = AccountStatus.ACTIVE;

    @Column(nullable = false, length = 3)
    private String currency = "USD";

    @Column(length = 80)
    private String nickname;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "available_balance", nullable = false, precision = 19, scale = 2)
    private BigDecimal availableBalance = BigDecimal.ZERO;

    @Column(name = "daily_transfer_limit", nullable = false, precision = 19, scale = 2)
    private BigDecimal dailyTransferLimit = new BigDecimal("5000.00");

    @Column(name = "daily_withdrawal_limit", nullable = false, precision = 19, scale = 2)
    private BigDecimal dailyWithdrawalLimit = new BigDecimal("1000.00");

    @Column(name = "last_activity_at")
    private LocalDateTime lastActivityAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Version
    @Column(nullable = false)
    private Long version = 0L;

    protected Account() {
    }

    public Account(String ownerUsername, String accountNumber) {
        this.ownerUsername = ownerUsername;
        this.accountNumber = accountNumber;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.lastActivityAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getOwnerUsername() { return ownerUsername; }
    public String getAccountNumber() { return accountNumber; }
    public AccountType getType() { return type; }
    public AccountStatus getStatus() { return status; }
    public String getCurrency() { return currency; }
    public String getNickname() { return nickname; }
    public BigDecimal getBalance() { return balance; }
    public BigDecimal getAvailableBalance() { return availableBalance; }
    public BigDecimal getDailyTransferLimit() { return dailyTransferLimit; }
    public BigDecimal getDailyWithdrawalLimit() { return dailyWithdrawalLimit; }
    public LocalDateTime getLastActivityAt() { return lastActivityAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getClosedAt() { return closedAt; }
    public Long getVersion() { return version; }

    public void credit(BigDecimal amount) {
        this.balance = this.balance.add(amount);
        this.availableBalance = this.availableBalance.add(amount);
        this.lastActivityAt = LocalDateTime.now();
    }

    public void debit(BigDecimal amount) {
        if (this.availableBalance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }
        this.balance = this.balance.subtract(amount);
        this.availableBalance = this.availableBalance.subtract(amount);
        this.lastActivityAt = LocalDateTime.now();
    }

    public enum AccountType {
        CHECKING, SAVINGS, WALLET, CREDIT
    }

    public enum AccountStatus {
        ACTIVE, FROZEN, PENDING_REVIEW, CLOSED
    }
}
