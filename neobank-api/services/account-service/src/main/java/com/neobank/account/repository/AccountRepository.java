package com.neobank.account.repository;

import com.neobank.account.domain.Account;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByOwnerUsernameOrderByCreatedAtDesc(String ownerUsername);

    Optional<Account> findByAccountNumber(String accountNumber);
}
