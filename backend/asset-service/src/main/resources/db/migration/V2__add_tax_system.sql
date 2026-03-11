-- ============================================================================
-- V2: Tax collection system (Cameroon/CEMAC regulatory compliance)
-- Adds per-asset tax configuration and tax transaction audit trail.
-- ============================================================================

-- Per-asset tax configuration columns
ALTER TABLE assets ADD COLUMN registration_duty_enabled BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE assets ADD COLUMN registration_duty_rate DECIMAL(5,4) DEFAULT 0.0200;
ALTER TABLE assets ADD COLUMN ircm_enabled BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE assets ADD COLUMN ircm_rate_override DECIMAL(5,4);
ALTER TABLE assets ADD COLUMN ircm_exempt BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE assets ADD COLUMN capital_gains_tax_enabled BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE assets ADD COLUMN capital_gains_rate DECIMAL(5,4) DEFAULT 0.1650;
ALTER TABLE assets ADD COLUMN is_bvmac_listed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE assets ADD COLUMN is_government_bond BOOLEAN NOT NULL DEFAULT false;

-- Tax amounts on orders (registration duty + capital gains at trade time)
ALTER TABLE orders ADD COLUMN registration_duty_amount DECIMAL(20,0);
ALTER TABLE orders ADD COLUMN capital_gains_tax_amount DECIMAL(20,0);

-- Tax transaction audit trail
CREATE TABLE tax_transactions (
    id              BIGSERIAL       PRIMARY KEY,
    order_id        VARCHAR(36),
    scheduled_payment_id BIGINT,
    user_id         BIGINT          NOT NULL,
    asset_id        VARCHAR(36)     NOT NULL,
    tax_type        VARCHAR(30)     NOT NULL,
    taxable_amount  DECIMAL(20,0)   NOT NULL,
    tax_rate        DECIMAL(5,4)    NOT NULL,
    tax_amount      DECIMAL(20,0)   NOT NULL,
    fineract_transfer_id BIGINT,
    fiscal_year     INT             NOT NULL,
    fiscal_month    INT             NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'SUCCESS',
    failure_reason  VARCHAR(500),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tax_user_year ON tax_transactions(user_id, fiscal_year, tax_type);
CREATE INDEX idx_tax_month ON tax_transactions(fiscal_year, fiscal_month, tax_type);
CREATE INDEX idx_tax_order ON tax_transactions(order_id);
CREATE INDEX idx_tax_asset ON tax_transactions(asset_id);
