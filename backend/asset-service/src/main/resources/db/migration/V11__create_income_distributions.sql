-- Income distribution records for non-bond assets (dividends, rent, harvest yields)
CREATE TABLE income_distributions (
    id                      BIGSERIAL PRIMARY KEY,
    asset_id                VARCHAR(36) NOT NULL REFERENCES assets(id),
    user_id                 BIGINT NOT NULL,
    income_type             VARCHAR(30) NOT NULL,
    units                   DECIMAL(20, 8) NOT NULL,
    rate_applied            DECIMAL(8, 4) NOT NULL,
    cash_amount             DECIMAL(20, 0) NOT NULL,
    fineract_transfer_id    BIGINT,
    status                  VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    failure_reason          VARCHAR(500),
    distribution_date       DATE NOT NULL,
    paid_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_income_dist_asset ON income_distributions(asset_id, distribution_date);
CREATE INDEX idx_income_dist_user ON income_distributions(user_id, paid_at);

-- Income configuration fields on the assets table
ALTER TABLE assets ADD COLUMN income_type VARCHAR(30);
ALTER TABLE assets ADD COLUMN income_rate DECIMAL(8, 4);
ALTER TABLE assets ADD COLUMN distribution_frequency_months INTEGER;
ALTER TABLE assets ADD COLUMN next_distribution_date DATE;
