package com.neobank.account.service;

import com.neobank.account.domain.Account;
import com.neobank.account.dto.AccountResponse;
import com.neobank.account.dto.BalanceMutationResponse;
import com.neobank.account.exception.ResourceNotFoundException;
import com.neobank.account.repository.AccountRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> getAccounts(String ownerUsername) {
        return accountRepository.findByOwnerUsernameOrderByCreatedAtDesc(ownerUsername).stream()
                .map(AccountResponse::from)
                .toList();
    }

    @Transactional
    public AccountResponse createAccount(String ownerUsername) {
        Account account = new Account(ownerUsername, generateAccountNumber());
        return AccountResponse.from(accountRepository.save(account));
    }

    @Transactional(readOnly = true)
    public AccountResponse getAccount(String accountNumber, String ownerUsername) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        if (!account.getOwnerUsername().equals(ownerUsername)) {
            throw new ResourceNotFoundException("Account not found");
        }
        return AccountResponse.from(account);
    }

    @Transactional
    public BalanceMutationResponse credit(String accountNumber, String ownerUsername, java.math.BigDecimal amount) {
        Account account = getOwnedAccount(accountNumber, ownerUsername);
        account.credit(amount);
        Account saved = accountRepository.save(account);
        return new BalanceMutationResponse(saved.getAccountNumber(), saved.getBalance(), saved.getAvailableBalance());
    }

    @Transactional
    public BalanceMutationResponse debit(String accountNumber, String ownerUsername, java.math.BigDecimal amount) {
        Account account = getOwnedAccount(accountNumber, ownerUsername);
        account.debit(amount);
        Account saved = accountRepository.save(account);
        return new BalanceMutationResponse(saved.getAccountNumber(), saved.getBalance(), saved.getAvailableBalance());
    }

    @Transactional
    public BalanceMutationResponse transfer(String ownerUsername, String fromAccountNumber, String toAccountNumber,
                                            java.math.BigDecimal amount) {
        Account fromAccount = getOwnedAccount(fromAccountNumber, ownerUsername);
        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Destination account not found"));

        fromAccount.debit(amount);
        toAccount.credit(amount);
        Account saved = accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
        return new BalanceMutationResponse(saved.getAccountNumber(), saved.getBalance(), saved.getAvailableBalance());
    }

    private Account getOwnedAccount(String accountNumber, String ownerUsername) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        if (!account.getOwnerUsername().equals(ownerUsername)) {
            throw new ResourceNotFoundException("Account not found");
        }
        return account;
    }

    private String generateAccountNumber() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }
}
