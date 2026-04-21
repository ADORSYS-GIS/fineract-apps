-- =============================================================================
-- Payment Gateway Service — Baseline Schema
-- Consolidated from V1–V9. Represents the full schema at production baseline.
-- Future changes: add V2__<description>.sql, V3__<description>.sql, etc.
-- =============================================================================

-- Payment transaction lifecycle tracking
CREATE TABLE payment_transactions (
    transaction_id                  VARCHAR(36)              PRIMARY KEY,
    provider_reference              VARCHAR(255),
    external_id                     VARCHAR(36)              NOT NULL,
    account_id                      BIGINT                   NOT NULL,
    provider                        VARCHAR(20)              NOT NULL,
    type                            VARCHAR(20)              NOT NULL,
    amount                          DECIMAL(15,2)            NOT NULL,
    currency                        VARCHAR(3)               NOT NULL,
    status                          VARCHAR(20)              NOT NULL,
    notif_token                     VARCHAR(255),
    idempotency_key                 VARCHAR(255)             NOT NULL,
    stale_resolution_retry_count    INT                      NOT NULL DEFAULT 0,
    created_at                      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMP WITH TIME ZONE,
    fineract_transaction_id         BIGINT,
    version                         BIGINT                   DEFAULT 0,

    CONSTRAINT chk_provider CHECK (provider IN ('MTN_MOMO', 'ORANGE_MONEY', 'CINETPAY')),
    CONSTRAINT chk_type     CHECK (type IN ('DEPOSIT', 'WITHDRAWAL')),
    CONSTRAINT chk_status   CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESSFUL', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUNDED'))
);

CREATE INDEX        idx_provider_reference  ON payment_transactions(provider_reference);
CREATE INDEX        idx_external_id_created ON payment_transactions(external_id, created_at);
CREATE INDEX        idx_status              ON payment_transactions(status);
CREATE INDEX        idx_status_created      ON payment_transactions(status, created_at);
CREATE UNIQUE INDEX idx_idempotency_key     ON payment_transactions(idempotency_key);

COMMENT ON TABLE  payment_transactions IS 'Tracks payment transaction lifecycle for idempotency and audit';
COMMENT ON COLUMN payment_transactions.transaction_id    IS 'Server-generated UUID for this transaction record';
COMMENT ON COLUMN payment_transactions.idempotency_key   IS 'Client-supplied key for deduplication';
COMMENT ON COLUMN payment_transactions.provider_reference IS 'Reference ID returned by payment provider';
COMMENT ON COLUMN payment_transactions.external_id       IS 'Customer external ID from Fineract/Keycloak';
COMMENT ON COLUMN payment_transactions.version           IS 'Optimistic locking version for concurrent updates';

-- Dead-letter queue for failed withdrawal reversals
CREATE TABLE reversal_dead_letters (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transaction_id  VARCHAR(36)    NOT NULL,
    fineract_txn_id BIGINT,
    account_id      BIGINT         NOT NULL,
    amount          DECIMAL(15,2)  NOT NULL,
    currency        VARCHAR(3)     NOT NULL DEFAULT 'XAF',
    provider        VARCHAR(20)    NOT NULL,
    provider_hint   VARCHAR(50),
    failure_reason  VARCHAR(500),
    retry_count     INTEGER        DEFAULT 0,
    created_at      TIMESTAMP      NOT NULL DEFAULT NOW(),
    resolved        BOOLEAN        NOT NULL DEFAULT FALSE,
    resolved_by     VARCHAR(100),
    resolved_at     TIMESTAMP,
    notes           TEXT
);

CREATE INDEX idx_dlq_unresolved ON reversal_dead_letters(resolved) WHERE resolved = FALSE;
