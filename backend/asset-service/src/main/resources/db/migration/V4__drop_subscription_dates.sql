-- Remove subscription start/end dates from assets table.
-- The secondary-market reseller model makes subscription windows irrelevant.
ALTER TABLE assets DROP COLUMN subscription_start_date;
ALTER TABLE assets DROP COLUMN subscription_end_date;
