CREATE TABLE customer_profiles (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    date_of_birth DATE,
    tax_id_hash VARCHAR(128),
    address_line1 VARCHAR(160),
    address_line2 VARCHAR(160),
    city VARCHAR(80),
    state_province VARCHAR(80),
    postal_code VARCHAR(20),
    country VARCHAR(2) NOT NULL DEFAULT 'US',
    kyc_status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED',
    risk_rating VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
    pep BOOLEAN NOT NULL DEFAULT FALSE,
    sanctions_screened BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_customer_profiles_kyc_status CHECK (kyc_status IN ('NOT_STARTED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED')),
    CONSTRAINT chk_customer_profiles_risk_rating CHECK (risk_rating IN ('LOW', 'STANDARD', 'HIGH', 'PROHIBITED'))
);

CREATE INDEX idx_customer_profiles_username ON customer_profiles(username);
CREATE INDEX idx_customer_profiles_kyc_status ON customer_profiles(kyc_status);
CREATE INDEX idx_customer_profiles_risk_rating ON customer_profiles(risk_rating);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_username VARCHAR(50),
    action VARCHAR(120) NOT NULL,
    resource_type VARCHAR(80) NOT NULL,
    resource_id VARCHAR(80),
    outcome VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    metadata TEXT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT chk_audit_logs_outcome CHECK (outcome IN ('SUCCESS', 'FAILURE', 'DENIED'))
);

CREATE INDEX idx_audit_logs_actor_username ON audit_logs(actor_username);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
