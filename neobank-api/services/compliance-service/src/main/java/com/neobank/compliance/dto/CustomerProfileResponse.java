package com.neobank.compliance.dto;

import com.neobank.compliance.domain.CustomerProfile;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record CustomerProfileResponse(
        String username,
        LocalDate dateOfBirth,
        String addressLine1,
        String addressLine2,
        String city,
        String stateProvince,
        String postalCode,
        String country,
        CustomerProfile.KycStatus kycStatus,
        CustomerProfile.RiskRating riskRating,
        Boolean sanctionsScreened,
        LocalDateTime verifiedAt
) {
    public static CustomerProfileResponse from(CustomerProfile profile) {
        return new CustomerProfileResponse(
                profile.getUsername(),
                profile.getDateOfBirth(),
                profile.getAddressLine1(),
                profile.getAddressLine2(),
                profile.getCity(),
                profile.getStateProvince(),
                profile.getPostalCode(),
                profile.getCountry(),
                profile.getKycStatus(),
                profile.getRiskRating(),
                profile.getSanctionsScreened(),
                profile.getVerifiedAt()
        );
    }
}
