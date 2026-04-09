-- V11: Add columns to archive tables that were added to the live tables in V2, V5, V7
--      but never backfilled into the archive schemas.
--
-- trade_log_archive: add accrued_interest_amount (added to trade_log in V7)
-- orders_archive:    add registration_duty_amount + capital_gains_tax_amount (V2),
--                    tva_amount (V5), accrued_interest_amount (V7)
--
-- All columns are nullable to match existing nullability on the source tables
-- and to allow existing archive rows to remain valid (they carry NULL for these fields).

ALTER TABLE trade_log_archive
    ADD COLUMN accrued_interest_amount DECIMAL(20, 0);

ALTER TABLE orders_archive
    ADD COLUMN registration_duty_amount DECIMAL(20, 0),
    ADD COLUMN capital_gains_tax_amount DECIMAL(20, 0),
    ADD COLUMN tva_amount               DECIMAL(20, 0),
    ADD COLUMN accrued_interest_amount  DECIMAL(20, 0);
