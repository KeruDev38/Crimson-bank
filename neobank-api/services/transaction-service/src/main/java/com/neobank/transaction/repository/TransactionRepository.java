package com.neobank.transaction.repository;

import com.neobank.transaction.domain.Transaction;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByOwnerUsernameOrderByTransactionDateDesc(String ownerUsername);

    Optional<Transaction> findByOwnerUsernameAndIdempotencyKey(String ownerUsername, String idempotencyKey);
}
