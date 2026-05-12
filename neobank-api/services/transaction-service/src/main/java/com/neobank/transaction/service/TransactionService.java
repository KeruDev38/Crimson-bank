package com.neobank.transaction.service;

import com.neobank.transaction.client.AccountClient;
import com.neobank.transaction.domain.Transaction;
import com.neobank.transaction.dto.TransactionResponse;
import com.neobank.transaction.repository.TransactionRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountClient accountClient;

    public TransactionService(TransactionRepository transactionRepository, AccountClient accountClient) {
        this.transactionRepository = transactionRepository;
        this.accountClient = accountClient;
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactions(String ownerUsername) {
        return transactionRepository.findByOwnerUsernameOrderByTransactionDateDesc(ownerUsername).stream()
                .map(TransactionResponse::from)
                .toList();
    }

    @Transactional
    public TransactionResponse deposit(String ownerUsername, String accountNumber, BigDecimal amount, String description,
                                       String idempotencyKey) {
        Transaction existing = findIdempotent(ownerUsername, idempotencyKey);
        if (existing != null) {
            return TransactionResponse.from(existing);
        }

        Transaction transaction = new Transaction(
                ownerUsername,
                null,
                accountNumber,
                amount,
                Transaction.TransactionType.DEPOSIT,
                description
        );
        transaction.setIdempotencyKey(idempotencyKey);
        transaction = transactionRepository.save(transaction);
        try {
            AccountClient.BalanceMutationResponse mutation = accountClient.credit(accountNumber, ownerUsername, amount);
            transaction.complete(mutation.balance());
        } catch (RuntimeException ex) {
            transaction.fail(ex.getMessage());
        }
        return TransactionResponse.from(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponse withdraw(String ownerUsername, String accountNumber, BigDecimal amount, String description,
                                        String idempotencyKey) {
        Transaction existing = findIdempotent(ownerUsername, idempotencyKey);
        if (existing != null) {
            return TransactionResponse.from(existing);
        }

        Transaction transaction = new Transaction(
                ownerUsername,
                accountNumber,
                null,
                amount,
                Transaction.TransactionType.WITHDRAWAL,
                description
        );
        transaction.setIdempotencyKey(idempotencyKey);
        transaction = transactionRepository.save(transaction);
        try {
            AccountClient.BalanceMutationResponse mutation = accountClient.debit(accountNumber, ownerUsername, amount);
            transaction.complete(mutation.balance());
        } catch (RuntimeException ex) {
            transaction.fail(ex.getMessage());
        }
        return TransactionResponse.from(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponse transfer(String ownerUsername, String fromAccountNumber, String toAccountNumber,
                                        BigDecimal amount, String description, String idempotencyKey) {
        Transaction existing = findIdempotent(ownerUsername, idempotencyKey);
        if (existing != null) {
            return TransactionResponse.from(existing);
        }

        Transaction transaction = new Transaction(
                ownerUsername,
                fromAccountNumber,
                toAccountNumber,
                amount,
                Transaction.TransactionType.TRANSFER,
                description
        );
        transaction.setIdempotencyKey(idempotencyKey);
        transaction = transactionRepository.save(transaction);
        try {
            AccountClient.BalanceMutationResponse mutation = accountClient.transfer(
                    ownerUsername,
                    fromAccountNumber,
                    toAccountNumber,
                    amount
            );
            transaction.complete(mutation.balance());
        } catch (RuntimeException ex) {
            transaction.fail(ex.getMessage());
        }
        return TransactionResponse.from(transactionRepository.save(transaction));
    }

    private Transaction findIdempotent(String ownerUsername, String idempotencyKey) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            return null;
        }
        return transactionRepository.findByOwnerUsernameAndIdempotencyKey(ownerUsername, idempotencyKey).orElse(null);
    }
}
