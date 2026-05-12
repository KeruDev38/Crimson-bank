package com.neobank.compliance.dto;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CustomerProfileRequest(
        LocalDate dateOfBirth,
        @Size(max = 128) String taxIdHash,
        @Size(max = 160) String addressLine1,
        @Size(max = 160) String addressLine2,
        @Size(max = 80) String city,
        @Size(max = 80) String stateProvince,
        @Size(max = 20) String postalCode,
        @Size(min = 2, max = 2) String country
) {
}
