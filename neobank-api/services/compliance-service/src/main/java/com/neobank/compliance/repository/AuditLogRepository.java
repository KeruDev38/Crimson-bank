package com.neobank.compliance.repository;

import com.neobank.compliance.domain.AuditLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByActorUsernameOrderByCreatedAtDesc(String actorUsername);
}
