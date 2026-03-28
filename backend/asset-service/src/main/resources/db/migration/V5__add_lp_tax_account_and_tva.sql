-- Add LP tax withholding account for custodial model (LTAX savings product)
ALTER TABLE assets ADD COLUMN lp_tax_account_id BIGINT;

-- Add TVA (VAT) per-asset tax configuration
ALTER TABLE assets ADD COLUMN tva_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE assets ADD COLUMN tva_rate DECIMAL(5,4);
