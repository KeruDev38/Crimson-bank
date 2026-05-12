package com.neobank.account.controller;

import com.neobank.account.dto.AccountResponse;
import com.neobank.account.service.AccountService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAccounts(Authentication authentication) {
        return ResponseEntity.ok(accountService.getAccounts(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(Authentication authentication) {
        return ResponseEntity.ok(accountService.createAccount(authentication.getName()));
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable String accountNumber, Authentication authentication) {
        return ResponseEntity.ok(accountService.getAccount(accountNumber, authentication.getName()));
    }
}
