-- V6: Add bond type (BTA/OTA), day count convention, and issuer country
-- to support CEMAC treasury instrument classification.

ALTER TABLE assets ADD COLUMN bond_type VARCHAR(10);
ALTER TABLE assets ADD COLUMN day_count_convention VARCHAR(10);
ALTER TABLE assets ADD COLUMN issuer_country VARCHAR(50);

-- Backfill existing bonds: default to COUPON (OTA) with ACT/365
UPDATE assets
SET bond_type = 'COUPON',
    day_count_convention = 'ACT_365'
WHERE category = 'BONDS';
