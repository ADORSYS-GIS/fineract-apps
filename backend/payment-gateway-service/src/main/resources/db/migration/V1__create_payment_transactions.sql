-- Payment transactions table for tracking payment lifecycle
CREATE TABLE payment_transactions (
    transaction_id VARCHAR(36) PRIMARY KEY,
    provider_reference VARCHAR(100),
    external_id VARCHAR(36) NOT NULL,
    account_id BIGINT NOT NULL,
    provider VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    fineract_transaction_id BIGINT,
    version BIGINT DEFAULT 0,

    -- Constraints
    CONSTRAINT chk_provider CHECK (provider IN ('MTN_MOMO', 'ORANGE_MONEY', 'CINETPAY')),
    CONSTRAINT chk_type CHECK (type IN ('DEPOSIT', 'WITHDRAWAL')),
    CONSTRAINT chk_status CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESSFUL', 'FAILED'))
);

-- Indexes for common queries
CREATE INDEX idx_provider_reference ON payment_transactions(provider_reference);
CREATE INDEX idx_external_id_created ON payment_transactions(external_id, created_at);
CREATE INDEX idx_status ON payment_transactions(status);
CREATE INDEX idx_status_created ON payment_transactions(status, created_at);

-- Comments
COMMENT ON TABLE payment_transactions IS 'Tracks payment transaction lifecycle for idempotency and audit';
COMMENT ON COLUMN payment_transactions.transaction_id IS 'UUID serving as idempotency key';
COMMENT ON COLUMN payment_transactions.provider_reference IS 'Reference ID returned by payment provider';
COMMENT ON COLUMN payment_transactions.external_id IS 'Customer external ID from Fineract/Keycloak';
COMMENT ON COLUMN payment_transactions.version IS 'Optimistic locking version for concurrent updates';
