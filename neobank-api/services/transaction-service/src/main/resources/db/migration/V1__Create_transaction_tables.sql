CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    owner_username VARCHAR(50) NOT NULL,
    from_account_number VARCHAR(32),
    to_account_number VARCHAR(32),
    amount DECIMAL(19,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    reference VARCHAR(64) NOT NULL UNIQUE,
    external_reference VARCHAR(128),
    idempotency_key VARCHAR(128) UNIQUE,
    type VARCHAR(30) NOT NULL,
    description VARCHAR(500),
    transaction_date TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    channel VARCHAR(30) NOT NULL DEFAULT 'API',
    fee DECIMAL(19,2) NOT NULL DEFAULT 0.00,
    balance_after DECIMAL(19,2),
    failure_reason VARCHAR(500),
    risk_score INTEGER,
    processed_at TIMESTAMP,
    updated_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_transactions_type CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'CARD_PURCHASE', 'CARD_REFUND', 'FEE', 'INTEREST', 'REVERSAL')),
    CONSTRAINT chk_transactions_status CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED')),
    CONSTRAINT chk_transactions_channel CHECK (channel IN ('API', 'MOBILE', 'WEB', 'CARD', 'ATM', 'ADMIN')),
    CONSTRAINT chk_transactions_fee_non_negative CHECK (fee >= 0),
    CONSTRAINT chk_transactions_risk_score CHECK (risk_score IS NULL OR (risk_score >= 0 AND risk_score <= 100))
);

CREATE INDEX idx_transactions_owner_username ON transactions(owner_username);
CREATE INDEX idx_transactions_reference ON transactions(reference);
CREATE INDEX idx_transactions_from_account_number ON transactions(from_account_number);
CREATE INDEX idx_transactions_to_account_number ON transactions(to_account_number);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
