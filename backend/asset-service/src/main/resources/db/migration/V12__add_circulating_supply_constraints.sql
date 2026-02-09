-- Ensure circulating_supply can never go negative or exceed total_supply
ALTER TABLE assets
    ADD CONSTRAINT chk_circulating_supply_non_negative
    CHECK (circulating_supply >= 0);

ALTER TABLE assets
    ADD CONSTRAINT chk_circulating_supply_max
    CHECK (circulating_supply <= total_supply);
