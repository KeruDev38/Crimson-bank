package com.neobank.compliance.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_profiles")
public class CustomerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "tax_id_hash", length = 128)
    private String taxIdHash;

    @Column(name = "address_line1", length = 160)
    private String addressLine1;

    @Column(name = "address_line2", length = 160)
    private String addressLine2;

    @Column(length = 80)
    private String city;

    @Column(name = "state_province", length = 80)
    private String stateProvince;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(nullable = false, length = 2)
    private String country = "US";

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false, length = 30)
    private KycStatus kycStatus = KycStatus.NOT_STARTED;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_rating", nullable = false, length = 30)
    private RiskRating riskRating = RiskRating.STANDARD;

    @Column(name = "pep", nullable = false)
    private Boolean politicallyExposedPerson = false;

    @Column(name = "sanctions_screened", nullable = false)
    private Boolean sanctionsScreened = false;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    @Column(nullable = false)
    private Long version = 0L;

    protected CustomerProfile() {
    }

    public CustomerProfile(String username) {
        this.username = username;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public String getTaxIdHash() { return taxIdHash; }
    public String getAddressLine1() { return addressLine1; }
    public String getAddressLine2() { return addressLine2; }
    public String getCity() { return city; }
    public String getStateProvince() { return stateProvince; }
    public String getPostalCode() { return postalCode; }
    public String getCountry() { return country; }
    public KycStatus getKycStatus() { return kycStatus; }
    public RiskRating getRiskRating() { return riskRating; }
    public Boolean getPoliticallyExposedPerson() { return politicallyExposedPerson; }
    public Boolean getSanctionsScreened() { return sanctionsScreened; }
    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void updateProfile(LocalDate dateOfBirth, String taxIdHash, String addressLine1, String addressLine2,
                              String city, String stateProvince, String postalCode, String country) {
        this.dateOfBirth = dateOfBirth;
        this.taxIdHash = taxIdHash;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.stateProvince = stateProvince;
        this.postalCode = postalCode;
        this.country = country != null ? country : this.country;
        this.kycStatus = KycStatus.PENDING_REVIEW;
    }

    public void markVerified() {
        this.kycStatus = KycStatus.VERIFIED;
        this.sanctionsScreened = true;
        this.verifiedAt = LocalDateTime.now();
    }

    public enum KycStatus {
        NOT_STARTED, PENDING_REVIEW, VERIFIED, REJECTED, EXPIRED
    }

    public enum RiskRating {
        LOW, STANDARD, HIGH, PROHIBITED
    }
}
