-- Dead-letter queue for failed withdrawal reversals.
-- When a Fineract withdrawal reversal fails after all retries,
-- the transaction is recorded here for manual intervention by ops.
CREATE TABLE reversal_dead_letters (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transaction_id  VARCHAR(36) NOT NULL,
    fineract_txn_id BIGINT,
    account_id      BIGINT NOT NULL,
    amount          DECIMAL(15, 2) NOT NULL,
    currency        VARCHAR(3) NOT NULL DEFAULT 'XAF',
    provider        VARCHAR(20) NOT NULL,
    failure_reason  VARCHAR(500),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved        BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_by     VARCHAR(100),
    resolved_at     TIMESTAMP,
    notes           TEXT
);

CREATE INDEX idx_dlq_unresolved ON reversal_dead_letters(resolved) WHERE resolved = FALSE;
