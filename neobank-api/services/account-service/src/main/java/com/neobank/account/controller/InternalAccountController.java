package com.neobank.account.controller;

import com.neobank.account.dto.BalanceMutationRequest;
import com.neobank.account.dto.BalanceMutationResponse;
import com.neobank.account.dto.InternalTransferRequest;
import com.neobank.account.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/accounts")
public class InternalAccountController {

    private final AccountService accountService;
    private final String serviceToken;

    public InternalAccountController(AccountService accountService,
                                     @Value("${internal.service-token}") String serviceToken) {
        this.accountService = accountService;
        this.serviceToken = serviceToken;
    }

    @PostMapping("/{accountNumber}/credit")
    public ResponseEntity<BalanceMutationResponse> credit(@PathVariable String accountNumber,
                                                          @Valid @RequestBody BalanceMutationRequest request,
                                                          @RequestHeader("X-Service-Token") String token) {
        requireServiceToken(token);
        return ResponseEntity.ok(accountService.credit(accountNumber, request.ownerUsername(), request.amount()));
    }

    @PostMapping("/{accountNumber}/debit")
    public ResponseEntity<BalanceMutationResponse> debit(@PathVariable String accountNumber,
                                                         @Valid @RequestBody BalanceMutationRequest request,
                                                         @RequestHeader("X-Service-Token") String token) {
        requireServiceToken(token);
        return ResponseEntity.ok(accountService.debit(accountNumber, request.ownerUsername(), request.amount()));
    }

    @PostMapping("/transfers")
    public ResponseEntity<BalanceMutationResponse> transfer(@Valid @RequestBody InternalTransferRequest request,
                                                            @RequestHeader("X-Service-Token") String token) {
        requireServiceToken(token);
        return ResponseEntity.ok(accountService.transfer(
                request.ownerUsername(),
                request.fromAccountNumber(),
                request.toAccountNumber(),
                request.amount()
        ));
    }

    private void requireServiceToken(String token) {
        if (!serviceToken.equals(token)) {
            throw new IllegalArgumentException("Invalid service token");
        }
    }
}
