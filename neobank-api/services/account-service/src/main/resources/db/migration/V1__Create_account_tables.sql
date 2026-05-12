CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    owner_username VARCHAR(50) NOT NULL,
    account_number VARCHAR(32) NOT NULL UNIQUE,
    type VARCHAR(30) NOT NULL DEFAULT 'CHECKING',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    nickname VARCHAR(80),
    balance DECIMAL(19,2) NOT NULL DEFAULT 0.00,
    available_balance DECIMAL(19,2) NOT NULL DEFAULT 0.00,
    daily_transfer_limit DECIMAL(19,2) NOT NULL DEFAULT 5000.00,
    daily_withdrawal_limit DECIMAL(19,2) NOT NULL DEFAULT 1000.00,
    last_activity_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    closed_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_accounts_type CHECK (type IN ('CHECKING', 'SAVINGS', 'WALLET', 'CREDIT')),
    CONSTRAINT chk_accounts_status CHECK (status IN ('ACTIVE', 'FROZEN', 'PENDING_REVIEW', 'CLOSED')),
    CONSTRAINT chk_accounts_balance_non_negative CHECK (balance >= 0),
    CONSTRAINT chk_accounts_available_balance_non_negative CHECK (available_balance >= 0),
    CONSTRAINT chk_accounts_daily_transfer_limit_non_negative CHECK (daily_transfer_limit >= 0),
    CONSTRAINT chk_accounts_daily_withdrawal_limit_non_negative CHECK (daily_withdrawal_limit >= 0)
);

CREATE INDEX idx_accounts_owner_username ON accounts(owner_username);
CREATE INDEX idx_accounts_status ON accounts(status);

CREATE TABLE bank_cards (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL,
    card_token VARCHAR(128) NOT NULL UNIQUE,
    last_four VARCHAR(4) NOT NULL,
    brand VARCHAR(30) NOT NULL DEFAULT 'VISA',
    type VARCHAR(30) NOT NULL DEFAULT 'DEBIT',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    expires_on DATE NOT NULL,
    daily_purchase_limit DECIMAL(19,2) NOT NULL DEFAULT 2500.00,
    daily_atm_limit DECIMAL(19,2) NOT NULL DEFAULT 500.00,
    failed_pin_attempts INTEGER NOT NULL DEFAULT 0,
    locked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_bank_cards_account_id FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    CONSTRAINT chk_bank_cards_brand CHECK (brand IN ('VISA', 'MASTERCARD', 'AMEX')),
    CONSTRAINT chk_bank_cards_type CHECK (type IN ('DEBIT', 'CREDIT', 'VIRTUAL')),
    CONSTRAINT chk_bank_cards_status CHECK (status IN ('ACTIVE', 'FROZEN', 'LOST', 'STOLEN', 'EXPIRED', 'CANCELLED')),
    CONSTRAINT chk_bank_cards_daily_purchase_limit_non_negative CHECK (daily_purchase_limit >= 0),
    CONSTRAINT chk_bank_cards_daily_atm_limit_non_negative CHECK (daily_atm_limit >= 0)
);

CREATE INDEX idx_bank_cards_account_id ON bank_cards(account_id);
CREATE INDEX idx_bank_cards_status ON bank_cards(status);

CREATE TABLE beneficiaries (
    id BIGSERIAL PRIMARY KEY,
    owner_username VARCHAR(50) NOT NULL,
    name VARCHAR(120) NOT NULL,
    alias VARCHAR(80),
    bank_code VARCHAR(40) NOT NULL,
    account_number VARCHAR(64) NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'EXTERNAL_ACCOUNT',
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    trusted BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_beneficiaries_owner_account UNIQUE (owner_username, account_number),
    CONSTRAINT chk_beneficiaries_type CHECK (type IN ('INTERNAL_USER', 'EXTERNAL_ACCOUNT', 'BILLER'))
);

CREATE INDEX idx_beneficiaries_owner_username ON beneficiaries(owner_username);
