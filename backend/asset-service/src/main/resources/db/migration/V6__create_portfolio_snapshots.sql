-- Portfolio value history snapshots for performance charting.
-- One row per (user, date) pair, taken daily after market close.

CREATE TABLE portfolio_snapshots (
    id               BIGSERIAL      PRIMARY KEY,
    user_id          BIGINT         NOT NULL,
    snapshot_date    DATE           NOT NULL,
    total_value      DECIMAL(20,0)  NOT NULL,
    total_cost_basis DECIMAL(20,0)  NOT NULL,
    unrealized_pnl   DECIMAL(20,0)  NOT NULL,
    position_count   INTEGER        NOT NULL,
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_portfolio_snapshot UNIQUE (user_id, snapshot_date)
);

CREATE INDEX idx_portfolio_snapshots_user_date ON portfolio_snapshots(user_id, snapshot_date DESC);
