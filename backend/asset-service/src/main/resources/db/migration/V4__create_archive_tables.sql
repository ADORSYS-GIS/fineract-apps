-- =============================================================================
-- V4: Create archive tables for trade_log and orders
-- =============================================================================
-- Archive tables mirror the hot tables but without FK constraints.
-- An archived_at column tracks when the row was archived.
-- Rows are moved here by ArchivalScheduler after the configured retention period.

-- Orders archive (mirrors orders, no FK constraints)
CREATE TABLE orders_archive (
    id                VARCHAR(36)   PRIMARY KEY,
    idempotency_key   VARCHAR(36),
    user_id           BIGINT        NOT NULL,
    user_external_id  VARCHAR(36)   NOT NULL,
    asset_id          VARCHAR(36)   NOT NULL,
    side              VARCHAR(4)    NOT NULL,
    cash_amount       DECIMAL(20,0) NOT NULL,
    units             DECIMAL(20,8),
    execution_price   DECIMAL(20,0),
    fee               DECIMAL(20,0),
    spread_amount     DECIMAL(20,0) DEFAULT 0,
    status            VARCHAR(25)   NOT NULL,
    failure_reason    VARCHAR(500),
    created_at        TIMESTAMPTZ   NOT NULL,
    updated_at        TIMESTAMPTZ,
    version           BIGINT        DEFAULT 0,
    archived_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_archive_user ON orders_archive(user_id, created_at DESC);
CREATE INDEX idx_orders_archive_status ON orders_archive(status, created_at);

-- Trade log archive (mirrors trade_log, no FK constraints)
CREATE TABLE trade_log_archive (
    id                         VARCHAR(36)   PRIMARY KEY,
    order_id                   VARCHAR(36)   NOT NULL,
    user_id                    BIGINT        NOT NULL,
    asset_id                   VARCHAR(36)   NOT NULL,
    side                       VARCHAR(4)    NOT NULL,
    units                      DECIMAL(20,8) NOT NULL,
    price_per_unit             DECIMAL(20,0) NOT NULL,
    total_amount               DECIMAL(20,0) NOT NULL,
    fee                        DECIMAL(20,0) NOT NULL DEFAULT 0,
    spread_amount              DECIMAL(20,0) NOT NULL DEFAULT 0,
    realized_pnl               DECIMAL(20,0),
    fineract_cash_transfer_id  BIGINT,
    fineract_asset_transfer_id BIGINT,
    executed_at                TIMESTAMPTZ   NOT NULL,
    archived_at                TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trade_archive_user ON trade_log_archive(user_id, executed_at);
CREATE INDEX idx_trade_archive_asset ON trade_log_archive(asset_id, executed_at DESC);
CREATE INDEX idx_trade_archive_executed ON trade_log_archive(executed_at);
