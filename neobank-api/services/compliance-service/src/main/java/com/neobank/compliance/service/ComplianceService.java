package com.neobank.compliance.service;

import com.neobank.compliance.domain.AuditLog;
import com.neobank.compliance.domain.CustomerProfile;
import com.neobank.compliance.dto.AuditLogRequest;
import com.neobank.compliance.dto.AuditLogResponse;
import com.neobank.compliance.dto.CustomerProfileRequest;
import com.neobank.compliance.dto.CustomerProfileResponse;
import com.neobank.compliance.repository.AuditLogRepository;
import com.neobank.compliance.repository.CustomerProfileRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ComplianceService {

    private final CustomerProfileRepository customerProfileRepository;
    private final AuditLogRepository auditLogRepository;

    public ComplianceService(CustomerProfileRepository customerProfileRepository, AuditLogRepository auditLogRepository) {
        this.customerProfileRepository = customerProfileRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public CustomerProfileResponse getProfile(String username) {
        CustomerProfile profile = customerProfileRepository.findByUsername(username)
                .orElseGet(() -> new CustomerProfile(username));
        return CustomerProfileResponse.from(profile);
    }

    @Transactional
    public CustomerProfileResponse upsertProfile(String username, CustomerProfileRequest request) {
        CustomerProfile profile = customerProfileRepository.findByUsername(username)
                .orElseGet(() -> new CustomerProfile(username));
        profile.updateProfile(
                request.dateOfBirth(),
                request.taxIdHash(),
                request.addressLine1(),
                request.addressLine2(),
                request.city(),
                request.stateProvince(),
                request.postalCode(),
                request.country()
        );
        return CustomerProfileResponse.from(customerProfileRepository.save(profile));
    }

    @Transactional
    public CustomerProfileResponse verifyProfile(String username) {
        CustomerProfile profile = customerProfileRepository.findByUsername(username)
                .orElseGet(() -> new CustomerProfile(username));
        profile.markVerified();
        return CustomerProfileResponse.from(customerProfileRepository.save(profile));
    }

    @Transactional
    public AuditLogResponse audit(AuditLogRequest request) {
        AuditLog auditLog = new AuditLog(
                request.actorUsername(),
                request.action(),
                request.resourceType(),
                request.resourceId(),
                request.outcome(),
                request.metadata()
        );
        return AuditLogResponse.from(auditLogRepository.save(auditLog));
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAuditLogs(String username) {
        return auditLogRepository.findByActorUsernameOrderByCreatedAtDesc(username).stream()
                .map(AuditLogResponse::from)
                .toList();
    }
}
