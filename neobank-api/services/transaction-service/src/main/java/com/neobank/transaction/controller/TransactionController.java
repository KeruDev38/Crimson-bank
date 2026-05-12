package com.neobank.transaction.controller;

import com.neobank.transaction.dto.DepositRequest;
import com.neobank.transaction.dto.TransactionResponse;
import com.neobank.transaction.dto.TransferRequest;
import com.neobank.transaction.dto.WithdrawRequest;
import com.neobank.transaction.service.TransactionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions(Authentication authentication) {
        return ResponseEntity.ok(transactionService.getTransactions(authentication.getName()));
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(@Valid @RequestBody DepositRequest request,
                                                       Authentication authentication) {
        return ResponseEntity.ok(transactionService.deposit(
                authentication.getName(),
                request.accountNumber(),
                request.amount(),
                request.description(),
                request.idempotencyKey()
        ));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(@Valid @RequestBody WithdrawRequest request,
                                                        Authentication authentication) {
        return ResponseEntity.ok(transactionService.withdraw(
                authentication.getName(),
                request.accountNumber(),
                request.amount(),
                request.description(),
                request.idempotencyKey()
        ));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(@Valid @RequestBody TransferRequest request,
                                                        Authentication authentication) {
        return ResponseEntity.ok(transactionService.transfer(
                authentication.getName(),
                request.fromAccountNumber(),
                request.toAccountNumber(),
                request.amount(),
                request.description(),
                request.idempotencyKey()
        ));
    }
}
