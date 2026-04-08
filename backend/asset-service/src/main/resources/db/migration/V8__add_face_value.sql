-- V8: Add face_value column for BTA discount bonds.
-- For DISCOUNT bonds, face_value = par/redemption value (e.g. 1,000,000 XAF)
-- while issuer_price = LP's acquisition cost (e.g. 945,000 XAF).
-- For COUPON bonds, face_value = issuer_price (no change).

ALTER TABLE assets ADD COLUMN face_value NUMERIC(20, 8);

-- Backfill: existing bonds use issuer_price as face value
UPDATE assets SET face_value = issuer_price WHERE category = 'BONDS';
