package com.neobank.compliance.dto;

import com.neobank.compliance.domain.AuditLog;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AuditLogRequest(
        @Size(max = 50) String actorUsername,
        @NotBlank @Size(max = 120) String action,
        @NotBlank @Size(max = 80) String resourceType,
        @Size(max = 80) String resourceId,
        @NotNull AuditLog.AuditOutcome outcome,
        String metadata
) {
}
