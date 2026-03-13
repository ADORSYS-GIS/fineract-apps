-- Per-category daily value snapshots for sparkline charts
CREATE TABLE category_snapshots (
    id            BIGSERIAL    PRIMARY KEY,
    user_id       BIGINT       NOT NULL,
    snapshot_date DATE         NOT NULL,
    category      VARCHAR(30)  NOT NULL,
    total_value   DECIMAL(20,0) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_category_snapshot UNIQUE (user_id, snapshot_date, category)
);

CREATE INDEX idx_category_snapshots_user_date ON category_snapshots(user_id, snapshot_date DESC);
