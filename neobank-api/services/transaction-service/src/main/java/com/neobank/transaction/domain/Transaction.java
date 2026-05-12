package com.neobank.transaction.domain;

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
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_username", nullable = false, length = 50)
    private String ownerUsername;

    @Column(name = "from_account_number", length = 32)
    private String fromAccountNumber;

    @Column(name = "to_account_number", length = 32)
    private String toAccountNumber;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency = "USD";

    @Column(nullable = false, unique = true, length = 64)
    private String reference;

    @Column(name = "external_reference", length = 128)
    private String externalReference;

    @Column(name = "idempotency_key", unique = true, length = 128)
    private String idempotencyKey;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TransactionType type;

    @Column(length = 500)
    private String description;

    @Column(name = "transaction_date", nullable = false, updatable = false)
    private LocalDateTime transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TransactionStatus status = TransactionStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TransactionChannel channel = TransactionChannel.API;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal fee = BigDecimal.ZERO;

    @Column(name = "balance_after", precision = 19, scale = 2)
    private BigDecimal balanceAfter;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    @Column(nullable = false)
    private Long version = 0L;

    protected Transaction() {
    }

    public Transaction(String ownerUsername, String fromAccountNumber, String toAccountNumber, BigDecimal amount,
                       TransactionType type, String description) {
        this.ownerUsername = ownerUsername;
        this.fromAccountNumber = fromAccountNumber;
        this.toAccountNumber = toAccountNumber;
        this.amount = amount;
        this.type = type;
        this.description = description;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }

    @PrePersist
    protected void onCreate() {
        this.transactionDate = LocalDateTime.now();
        if (this.reference == null) {
            this.reference = "txn_" + UUID.randomUUID().toString().replace("-", "");
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getOwnerUsername() { return ownerUsername; }
    public String getFromAccountNumber() { return fromAccountNumber; }
    public String getToAccountNumber() { return toAccountNumber; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public String getReference() { return reference; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public TransactionType getType() { return type; }
    public String getDescription() { return description; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public TransactionStatus getStatus() { return status; }
    public TransactionChannel getChannel() { return channel; }
    public BigDecimal getFee() { return fee; }
    public BigDecimal getBalanceAfter() { return balanceAfter; }
    public String getFailureReason() { return failureReason; }
    public LocalDateTime getProcessedAt() { return processedAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void complete(BigDecimal balanceAfter) {
        this.status = TransactionStatus.COMPLETED;
        this.balanceAfter = balanceAfter;
        this.processedAt = LocalDateTime.now();
    }

    public void fail(String reason) {
        this.status = TransactionStatus.FAILED;
        this.failureReason = reason;
        this.processedAt = LocalDateTime.now();
    }

    public enum TransactionType {
        DEPOSIT, WITHDRAWAL, TRANSFER, CARD_PURCHASE, CARD_REFUND, FEE, INTEREST, REVERSAL
    }

    public enum TransactionStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, REVERSED
    }

    public enum TransactionChannel {
        API, MOBILE, WEB, CARD, ATM, ADMIN
    }
}
