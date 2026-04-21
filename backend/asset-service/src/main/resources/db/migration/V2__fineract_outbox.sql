-- Outbox table for guaranteeing at-least-once DB finalization after Fineract batch calls.
-- Status lifecycle: PENDING → DISPATCHED (Fineract succeeded) → CONFIRMED (all DB writes done)
--                  PENDING → ABORTED (Fineract itself failed)
--                  DISPATCHED → FAILED (max retries exceeded on DB finalization)
CREATE TABLE fineract_outbox (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type        VARCHAR(50) NOT NULL,
    reference_type    VARCHAR(50) NOT NULL,
    reference_id      VARCHAR(255) NOT NULL,
    idempotency_key   VARCHAR(255) NOT NULL,
    status            VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payload           TEXT        NOT NULL,
    fineract_response TEXT,
    last_error        TEXT,
    retry_count       INTEGER     NOT NULL DEFAULT 0,
    max_retries       INTEGER     NOT NULL DEFAULT 5,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dispatched_at     TIMESTAMPTZ,
    confirmed_at      TIMESTAMPTZ,
    CONSTRAINT uq_fineract_outbox_idempotency UNIQUE (idempotency_key)
);

CREATE INDEX idx_fineract_outbox_status_created
    ON fineract_outbox (status, created_at)
    WHERE status IN ('PENDING', 'DISPATCHED');
