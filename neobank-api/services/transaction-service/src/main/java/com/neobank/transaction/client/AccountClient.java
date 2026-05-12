package com.neobank.transaction.client;

import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class AccountClient {

    private final RestClient restClient;
    private final String serviceToken;

    public AccountClient(RestClient.Builder builder,
                         @Value("${services.account-service.url}") String accountServiceUrl,
                         @Value("${internal.service-token}") String serviceToken) {
        this.restClient = builder.baseUrl(accountServiceUrl).build();
        this.serviceToken = serviceToken;
    }

    public BalanceMutationResponse credit(String accountNumber, String ownerUsername, BigDecimal amount) {
        return restClient.post()
                .uri("/internal/accounts/{accountNumber}/credit", accountNumber)
                .header("X-Service-Token", serviceToken)
                .body(new BalanceMutationRequest(ownerUsername, amount))
                .retrieve()
                .body(BalanceMutationResponse.class);
    }

    public BalanceMutationResponse debit(String accountNumber, String ownerUsername, BigDecimal amount) {
        return restClient.post()
                .uri("/internal/accounts/{accountNumber}/debit", accountNumber)
                .header("X-Service-Token", serviceToken)
                .body(new BalanceMutationRequest(ownerUsername, amount))
                .retrieve()
                .body(BalanceMutationResponse.class);
    }

    public BalanceMutationResponse transfer(String ownerUsername, String fromAccountNumber, String toAccountNumber,
                                            BigDecimal amount) {
        return restClient.post()
                .uri("/internal/accounts/transfers")
                .header("X-Service-Token", serviceToken)
                .body(new InternalTransferRequest(ownerUsername, fromAccountNumber, toAccountNumber, amount))
                .retrieve()
                .body(BalanceMutationResponse.class);
    }

    private record BalanceMutationRequest(String ownerUsername, BigDecimal amount) {
    }

    private record InternalTransferRequest(String ownerUsername, String fromAccountNumber, String toAccountNumber,
                                           BigDecimal amount) {
    }

    public record BalanceMutationResponse(String accountNumber, BigDecimal balance, BigDecimal availableBalance) {
    }
}
