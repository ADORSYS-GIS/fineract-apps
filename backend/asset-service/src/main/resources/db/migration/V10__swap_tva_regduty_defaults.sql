-- V10: Swap tax defaults — Registration Duty ON by default, TVA OFF by default
--
-- Rationale:
--   Registration duty (2% droit d'enregistrement) is a standard OHADA/CEMAC securities
--   transfer stamp tax applicable to all asset trades. It is enabled by default.
--
--   TVA (19.25%) is a service consumption tax that applies only to the platform fee,
--   not to the full investment amount. It is disabled by default and enabled explicitly
--   per asset where the regulatory context requires it.
--
--   V9 backfilled tva_enabled = true for all assets. This migration reverts that decision
--   and applies the new defaults going forward.

-- Revert TVA: disable on all existing assets
UPDATE assets SET tva_enabled = false;
ALTER TABLE assets ALTER COLUMN tva_enabled SET DEFAULT false;

-- Enable registration duty on all existing assets
UPDATE assets SET registration_duty_enabled = true;
ALTER TABLE assets ALTER COLUMN registration_duty_enabled SET DEFAULT true;

-- Populate registration_duty_rate and capital_gains_rate where currently null
-- so rates are explicit and auditable on every asset record
UPDATE assets
SET registration_duty_rate = 0.0200
WHERE registration_duty_rate IS NULL;

UPDATE assets
SET capital_gains_rate = 0.1650
WHERE capital_gains_rate IS NULL;

UPDATE assets
SET tva_rate = 0.1925
WHERE tva_rate IS NULL;
