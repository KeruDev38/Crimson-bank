package com.neobank.compliance.controller;

import com.neobank.compliance.dto.AuditLogRequest;
import com.neobank.compliance.dto.AuditLogResponse;
import com.neobank.compliance.service.ComplianceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/audit-logs")
public class InternalAuditController {

    private final ComplianceService complianceService;
    private final String serviceToken;

    public InternalAuditController(ComplianceService complianceService,
                                   @Value("${internal.service-token}") String serviceToken) {
        this.complianceService = complianceService;
        this.serviceToken = serviceToken;
    }

    @PostMapping
    public ResponseEntity<AuditLogResponse> audit(@Valid @RequestBody AuditLogRequest request,
                                                  @RequestHeader("X-Service-Token") String token) {
        if (!serviceToken.equals(token)) {
            throw new IllegalArgumentException("Invalid service token");
        }
        return ResponseEntity.ok(complianceService.audit(request));
    }
}
