-- Delisting configuration fields
ALTER TABLE assets ADD COLUMN delisting_date DATE;
ALTER TABLE assets ADD COLUMN delisting_redemption_price DECIMAL(20, 0);
