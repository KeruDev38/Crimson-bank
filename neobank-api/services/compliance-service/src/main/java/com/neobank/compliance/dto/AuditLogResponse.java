package com.neobank.compliance.dto;

import com.neobank.compliance.domain.AuditLog;
import java.time.LocalDateTime;

public record AuditLogResponse(
        Long id,
        String actorUsername,
        String action,
        String resourceType,
        String resourceId,
        AuditLog.AuditOutcome outcome,
        String metadata,
        LocalDateTime createdAt
) {
    public static AuditLogResponse from(AuditLog auditLog) {
        return new AuditLogResponse(
                auditLog.getId(),
                auditLog.getActorUsername(),
                auditLog.getAction(),
                auditLog.getResourceType(),
                auditLog.getResourceId(),
                auditLog.getOutcome(),
                auditLog.getMetadata(),
                auditLog.getCreatedAt()
        );
    }
}
