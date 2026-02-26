-- Scheduled payments: pending approval records for coupon and income distributions.
-- Schedulers create PENDING records; admins confirm (execute) or cancel them.
CREATE TABLE scheduled_payments (
    id                      BIGSERIAL PRIMARY KEY,
    asset_id                VARCHAR(36) NOT NULL REFERENCES assets(id),
    payment_type            VARCHAR(20) NOT NULL,   -- COUPON or INCOME
    schedule_date           DATE NOT NULL,
    status                  VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                            -- PENDING, CONFIRMED, CANCELLED

    -- Rate-based estimate (calculated when the schedule is created)
    estimated_rate              DECIMAL(8, 4),
    estimated_amount_per_unit   DECIMAL(20, 4),
    estimated_total             DECIMAL(20, 0),
    holder_count                INTEGER NOT NULL DEFAULT 0,

    -- Confirmation details (populated on confirm)
    actual_amount_per_unit  DECIMAL(20, 4),
    confirmed_by            VARCHAR(255),
    confirmed_at            TIMESTAMPTZ,
    cancelled_by            VARCHAR(255),
    cancelled_at            TIMESTAMPTZ,
    cancel_reason           VARCHAR(500),

    -- Execution results (populated after Fineract transfers)
    holders_paid            INTEGER,
    holders_failed          INTEGER,
    total_amount_paid       DECIMAL(20, 0),
    executed_at             TIMESTAMPTZ,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_scheduled_payment UNIQUE (asset_id, payment_type, schedule_date)
);

CREATE INDEX idx_scheduled_payments_status ON scheduled_payments(status);
CREATE INDEX idx_scheduled_payments_asset ON scheduled_payments(asset_id);
