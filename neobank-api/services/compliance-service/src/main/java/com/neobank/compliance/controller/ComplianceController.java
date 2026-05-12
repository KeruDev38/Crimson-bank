package com.neobank.compliance.controller;

import com.neobank.compliance.dto.AuditLogResponse;
import com.neobank.compliance.dto.CustomerProfileRequest;
import com.neobank.compliance.dto.CustomerProfileResponse;
import com.neobank.compliance.service.ComplianceService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/compliance")
public class ComplianceController {

    private final ComplianceService complianceService;

    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @GetMapping("/profile")
    public ResponseEntity<CustomerProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(complianceService.getProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<CustomerProfileResponse> upsertProfile(@Valid @RequestBody CustomerProfileRequest request,
                                                                 Authentication authentication) {
        return ResponseEntity.ok(complianceService.upsertProfile(authentication.getName(), request));
    }

    @PostMapping("/profile/verify")
    public ResponseEntity<CustomerProfileResponse> verifyProfile(Authentication authentication) {
        return ResponseEntity.ok(complianceService.verifyProfile(authentication.getName()));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs(Authentication authentication) {
        return ResponseEntity.ok(complianceService.getAuditLogs(authentication.getName()));
    }
}
