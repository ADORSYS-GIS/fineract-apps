-- Add LP tax withholding account for custodial model (LTAX savings product)
ALTER TABLE assets ADD COLUMN lp_tax_account_id BIGINT;

-- Add TVA (VAT) per-asset tax configuration
ALTER TABLE assets ADD COLUMN tva_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE assets ADD COLUMN tva_rate DECIMAL(5,4);

-- Per-asset projection counters (denormalized for fast reporting)
CREATE TABLE asset_projections (
    asset_id VARCHAR(36) PRIMARY KEY REFERENCES assets(id),
    total_cash_volume DECIMAL(19,4) NOT NULL DEFAULT 0,
    total_spread DECIMAL(19,4) NOT NULL DEFAULT 0,
    total_fees DECIMAL(19,4) NOT NULL DEFAULT 0,
    total_tax_reg_duty DECIMAL(19,4) NOT NULL DEFAULT 0,
    total_tax_ircm DECIMAL(19,4) NOT NULL DEFAULT 0,
    total_tax_cap_gains DECIMAL(19,4) NOT NULL DEFAULT 0,
    total_tax_tva DECIMAL(19,4) NOT NULL DEFAULT 0,
    total_buy_count BIGINT NOT NULL DEFAULT 0,
    total_sell_count BIGINT NOT NULL DEFAULT 0,
    last_updated_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

-- Settlement tracking for LP payouts, tax remittances, trust rebalancing
CREATE TABLE settlements (
    id VARCHAR(36) PRIMARY KEY,
    lp_client_id BIGINT,
    settlement_type VARCHAR(30) NOT NULL,
    amount DECIMAL(19,4) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    description TEXT,
    source_account_id BIGINT,
    destination_account_id BIGINT,
    source_gl_code VARCHAR(10),
    destination_gl_code VARCHAR(10),
    created_by VARCHAR(100),
    approved_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    executed_at TIMESTAMP,
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    fineract_journal_entry_id VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0
);
