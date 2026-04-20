-- V15: Security hardening — add partial unique indexes to prevent duplicate payments

-- Prevent duplicate successful coupon payments (interest_payments).
-- FAILED rows are allowed to repeat so retry attempts can be recorded.
-- The partial index (WHERE status = 'SUCCESS') allows multiple FAILED rows
-- for the same (asset_id, user_id, coupon_date) while enforcing uniqueness
-- once a payment succeeds.
CREATE UNIQUE INDEX uq_interest_payments_success
    ON interest_payments (asset_id, user_id, coupon_date)
    WHERE status = 'SUCCESS';

-- Prevent duplicate successful income distributions (income_distributions).
-- Same partial-index pattern as above.
CREATE UNIQUE INDEX uq_income_distributions_success
    ON income_distributions (asset_id, user_id, distribution_date)
    WHERE status = 'SUCCESS';
