-- V7: Add accrued interest amount to orders and trade_log
-- for OTA (coupon bond) trades where buyer compensates seller for accrued interest.

ALTER TABLE orders ADD COLUMN accrued_interest_amount NUMERIC(20, 0);
ALTER TABLE trade_log ADD COLUMN accrued_interest_amount NUMERIC(20, 0);
