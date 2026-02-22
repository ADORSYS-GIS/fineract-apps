-- Bond/fixed-income fields on assets table
ALTER TABLE assets ADD COLUMN issuer VARCHAR(255);
ALTER TABLE assets ADD COLUMN isin_code VARCHAR(12);
ALTER TABLE assets ADD COLUMN maturity_date DATE;
ALTER TABLE assets ADD COLUMN interest_rate DECIMAL(8,4);
ALTER TABLE assets ADD COLUMN coupon_frequency_months INTEGER;
ALTER TABLE assets ADD COLUMN next_coupon_date DATE;
ALTER TABLE assets ADD COLUMN subscription_end_date DATE NOT NULL;
ALTER TABLE assets ADD COLUMN capital_opened_percent DECIMAL(5,2);

-- Partial indexes for scheduler queries
CREATE INDEX idx_assets_maturity ON assets(status, maturity_date) WHERE maturity_date IS NOT NULL;
CREATE INDEX idx_assets_coupon ON assets(status, next_coupon_date) WHERE next_coupon_date IS NOT NULL;

-- Widen category column to accommodate BONDS
ALTER TABLE assets ALTER COLUMN category TYPE VARCHAR(30);

-- Coupon payment audit table
CREATE TABLE interest_payments (
    id                   BIGSERIAL PRIMARY KEY,
    asset_id             VARCHAR(36)    NOT NULL REFERENCES assets(id),
    user_id              BIGINT         NOT NULL,
    units                DECIMAL(20,8)  NOT NULL,
    face_value           DECIMAL(20,0)  NOT NULL,
    annual_rate          DECIMAL(8,4)   NOT NULL,
    period_months        INTEGER        NOT NULL,
    cash_amount          DECIMAL(20,0)  NOT NULL,
    fineract_transfer_id BIGINT,
    status               VARCHAR(20)    NOT NULL DEFAULT 'SUCCESS',
    failure_reason       VARCHAR(500),
    paid_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    coupon_date          DATE           NOT NULL
);

CREATE INDEX idx_interest_payments_asset ON interest_payments(asset_id, coupon_date);
CREATE INDEX idx_interest_payments_user ON interest_payments(user_id, paid_at);
