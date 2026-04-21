-- =============================================================================
-- Asset Service — Baseline Schema
-- Consolidated from V1–V16. Represents the full schema at production baseline.
-- Future changes: add V2__<description>.sql, V3__<description>.sql, etc.
-- =============================================================================

-- Assets (tokenized digital assets backed by Fineract products)
CREATE TABLE assets (
    id                              VARCHAR(36)   PRIMARY KEY,
    fineract_product_id             INTEGER       UNIQUE,
    symbol                          VARCHAR(10)   NOT NULL UNIQUE,
    currency_code                   VARCHAR(10)   NOT NULL UNIQUE,
    name                            VARCHAR(255)  NOT NULL,
    description                     VARCHAR(1000),
    image_url                       VARCHAR(500),
    category                        VARCHAR(30)   NOT NULL,
    status                          VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    price_mode                      VARCHAR(10)   NOT NULL DEFAULT 'MANUAL',
    manual_price                    DECIMAL(20,8),
    decimal_places                  INTEGER       NOT NULL DEFAULT 0,
    total_supply                    DECIMAL(20,8) NOT NULL,
    circulating_supply              DECIMAL(20,8) NOT NULL DEFAULT 0,
    trading_fee_percent             DECIMAL(5,4)  DEFAULT 0.0050,
    -- Bond/fixed-income fields
    isin_code                       VARCHAR(12),
    maturity_date                   DATE,
    interest_rate                   DECIMAL(8,4),
    coupon_frequency_months         INTEGER,
    next_coupon_date                DATE,
    capital_opened_percent          DECIMAL(5,2),
    bond_type                       VARCHAR(10),
    day_count_convention            VARCHAR(10),
    issuer_country                  VARCHAR(50),
    face_value                      NUMERIC(20,8),
    issue_date                      DATE,
    -- LP (Liquidity Partner) fields
    issuer_name                     VARCHAR(255),
    issuer_price                    DECIMAL(20,8),
    lp_client_id                    BIGINT        NOT NULL,
    lp_client_name                  VARCHAR(200),
    lp_asset_account_id             BIGINT,
    lp_cash_account_id              BIGINT,
    lp_spread_account_id            BIGINT,
    lp_tax_account_id               BIGINT,
    -- Tax configuration (Cameroon/CEMAC regulatory compliance)
    registration_duty_enabled       BOOLEAN       NOT NULL DEFAULT true,
    registration_duty_rate          DECIMAL(5,4)  DEFAULT 0.0200,
    ircm_enabled                    BOOLEAN       NOT NULL DEFAULT true,
    ircm_rate_override              DECIMAL(5,4),
    ircm_exempt                     BOOLEAN       NOT NULL DEFAULT false,
    capital_gains_tax_enabled       BOOLEAN       NOT NULL DEFAULT true,
    capital_gains_rate              DECIMAL(5,4)  DEFAULT 0.1650,
    is_bvmac_listed                 BOOLEAN       NOT NULL DEFAULT false,
    is_government_bond              BOOLEAN       NOT NULL DEFAULT false,
    tva_enabled                     BOOLEAN       NOT NULL DEFAULT false,
    tva_rate                        DECIMAL(5,4),
    -- Exposure limits
    max_position_percent            DECIMAL(5,2),
    max_order_size                  DECIMAL(20,8),
    daily_trade_limit_xaf           DECIMAL(20,0),
    min_order_size                  DECIMAL(20,8),
    min_order_cash_amount           DECIMAL(20,0),
    -- Lockup
    lockup_days                     INTEGER,
    -- Income distribution
    income_type                     VARCHAR(30),
    income_rate                     DECIMAL(8,4),
    distribution_frequency_months   INTEGER,
    next_distribution_date          DATE,
    -- Delisting
    delisting_date                  DATE,
    delisting_redemption_price      DECIMAL(20,0),
    -- Metadata
    created_at                      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ,
    version                         BIGINT        DEFAULT 0,
    CONSTRAINT chk_circulating_supply_non_negative CHECK (circulating_supply >= 0),
    CONSTRAINT chk_circulating_supply_max          CHECK (circulating_supply <= total_supply)
);

CREATE INDEX idx_assets_status    ON assets(status);
CREATE INDEX idx_assets_category  ON assets(category);
CREATE INDEX idx_assets_maturity  ON assets(status, maturity_date)   WHERE maturity_date IS NOT NULL;
CREATE INDEX idx_assets_coupon    ON assets(status, next_coupon_date) WHERE next_coupon_date IS NOT NULL;

-- Current asset prices (one row per asset)
CREATE TABLE asset_prices (
    asset_id            VARCHAR(36)   PRIMARY KEY REFERENCES assets(id),
    bid_price           DECIMAL(20,0) NOT NULL,
    ask_price           DECIMAL(20,0) NOT NULL,
    previous_close      DECIMAL(20,0),
    change_24h_percent  DECIMAL(10,4),
    day_open            DECIMAL(20,0),
    day_high            DECIMAL(20,0),
    day_low             DECIMAL(20,0),
    day_close           DECIMAL(20,0),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Price history snapshots
CREATE TABLE price_history (
    id          BIGSERIAL   PRIMARY KEY,
    asset_id    VARCHAR(36) NOT NULL REFERENCES assets(id),
    price       DECIMAL(20,0) NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_price_history_asset_captured ON price_history(asset_id, captured_at);

-- User portfolio positions
CREATE TABLE user_positions (
    id                          BIGSERIAL     PRIMARY KEY,
    user_id                     BIGINT        NOT NULL,
    asset_id                    VARCHAR(36)   NOT NULL REFERENCES assets(id),
    fineract_savings_account_id BIGINT        NOT NULL,
    total_units                 DECIMAL(20,8) NOT NULL DEFAULT 0,
    avg_purchase_price          DECIMAL(20,4) NOT NULL DEFAULT 0,
    total_cost_basis            DECIMAL(20,0) NOT NULL DEFAULT 0,
    realized_pnl                DECIMAL(20,0) NOT NULL DEFAULT 0,
    accrued_interest            DECIMAL(20,0) NOT NULL DEFAULT 0,
    total_fees_paid             NUMERIC(20,0) NOT NULL DEFAULT 0,
    total_taxes_paid            NUMERIC(20,0) NOT NULL DEFAULT 0,
    last_trade_at               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    first_purchase_date         TIMESTAMPTZ,
    version                     BIGINT        DEFAULT 0,
    CONSTRAINT uq_user_positions UNIQUE (user_id, asset_id)
);

CREATE INDEX idx_user_positions_user  ON user_positions(user_id);
CREATE INDEX idx_user_positions_asset ON user_positions(asset_id);

-- Trade orders
CREATE TABLE orders (
    id                          VARCHAR(36)   PRIMARY KEY,
    idempotency_key             VARCHAR(36)   UNIQUE,
    user_id                     BIGINT        NOT NULL,
    user_external_id            VARCHAR(36)   NOT NULL,
    asset_id                    VARCHAR(36)   NOT NULL REFERENCES assets(id),
    side                        VARCHAR(4)    NOT NULL,
    cash_amount                 DECIMAL(20,0) NOT NULL,
    units                       DECIMAL(20,8),
    execution_price             DECIMAL(20,0),
    fee                         DECIMAL(20,0),
    spread_amount               DECIMAL(20,0) DEFAULT 0,
    buyback_premium             DECIMAL(20,0) DEFAULT 0,
    registration_duty_amount    DECIMAL(20,0),
    capital_gains_tax_amount    DECIMAL(20,0),
    tva_amount                  DECIMAL(20,0),
    accrued_interest_amount     NUMERIC(20,0),
    queued_price                DECIMAL(20,0),
    quoted_at                   TIMESTAMPTZ,
    quote_expires_at            TIMESTAMPTZ,
    quoted_ask_price            DECIMAL(20,0),
    quoted_bid_price            DECIMAL(20,0),
    status                      VARCHAR(25)   NOT NULL DEFAULT 'PENDING',
    failure_reason              VARCHAR(500),
    fineract_batch_id           VARCHAR(255),
    resolved_by                 VARCHAR(100),
    resolved_at                 TIMESTAMPTZ,
    created_at                  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ,
    version                     BIGINT        DEFAULT 0
);

CREATE INDEX idx_orders_user_status             ON orders(user_id, status);
CREATE INDEX idx_orders_asset                   ON orders(asset_id, created_at);
CREATE INDEX idx_orders_user_created            ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_user_asset              ON orders(user_id, asset_id, created_at DESC);
CREATE INDEX idx_orders_stale_cleanup           ON orders(status, created_at)
    WHERE status IN ('PENDING', 'EXECUTING', 'NEEDS_RECONCILIATION', 'QUOTED');
CREATE INDEX idx_orders_status                  ON orders(status)
    WHERE status IN ('NEEDS_RECONCILIATION', 'FAILED');
CREATE INDEX idx_orders_quote_expiry            ON orders(status, quote_expires_at)
    WHERE status = 'QUOTED';
CREATE INDEX idx_orders_asset_status            ON orders(asset_id, status);
CREATE INDEX idx_orders_user_external_id        ON orders(user_external_id);
CREATE INDEX idx_orders_user_status_created     ON orders(user_id, status, created_at DESC);
CREATE INDEX idx_orders_user_asset_status_created ON orders(user_id, asset_id, status, created_at DESC);

-- Executed trade log
CREATE TABLE trade_log (
    id                          VARCHAR(36)   PRIMARY KEY,
    order_id                    VARCHAR(36)   NOT NULL REFERENCES orders(id),
    user_id                     BIGINT        NOT NULL,
    asset_id                    VARCHAR(36)   NOT NULL REFERENCES assets(id),
    side                        VARCHAR(4)    NOT NULL,
    units                       DECIMAL(20,8) NOT NULL,
    price_per_unit              DECIMAL(20,0) NOT NULL,
    total_amount                DECIMAL(20,0) NOT NULL,
    fee                         DECIMAL(20,0) NOT NULL DEFAULT 0,
    spread_amount               DECIMAL(20,0) NOT NULL DEFAULT 0,
    buyback_premium             DECIMAL(20,0) NOT NULL DEFAULT 0,
    realized_pnl                DECIMAL(20,0),
    accrued_interest_amount     NUMERIC(20,0),
    fineract_cash_transfer_id   BIGINT,
    fineract_asset_transfer_id  BIGINT,
    executed_at                 TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trade_log_user       ON trade_log(user_id, executed_at);
CREATE INDEX idx_trade_log_asset      ON trade_log(asset_id, executed_at DESC);
CREATE INDEX idx_trade_log_order      ON trade_log(order_id);
CREATE INDEX idx_trade_log_user_asset ON trade_log(user_id, asset_id);

-- Purchase lots for FIFO cost basis and per-lot lockup
CREATE TABLE purchase_lots (
    id                BIGSERIAL     PRIMARY KEY,
    user_id           BIGINT        NOT NULL,
    asset_id          VARCHAR(36)   NOT NULL REFERENCES assets(id),
    units             DECIMAL(20,8) NOT NULL,
    remaining_units   DECIMAL(20,8) NOT NULL,
    purchase_price    DECIMAL(20,4) NOT NULL,
    purchased_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    lockup_expires_at TIMESTAMPTZ,
    version           BIGINT        DEFAULT 0
);

CREATE INDEX idx_lots_user_asset ON purchase_lots(user_id, asset_id, purchased_at);

-- User favorite assets
CREATE TABLE user_favorites (
    id         BIGSERIAL   PRIMARY KEY,
    user_id    BIGINT      NOT NULL,
    asset_id   VARCHAR(36) NOT NULL REFERENCES assets(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_favorites UNIQUE (user_id, asset_id)
);

CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);

-- Coupon payment audit (bond interest payments)
CREATE TABLE interest_payments (
    id                      BIGSERIAL      PRIMARY KEY,
    asset_id                VARCHAR(36)    NOT NULL REFERENCES assets(id),
    user_id                 BIGINT         NOT NULL,
    units                   DECIMAL(20,8)  NOT NULL,
    face_value              DECIMAL(20,0)  NOT NULL,
    annual_rate             DECIMAL(8,4)   NOT NULL,
    period_months           INTEGER        NOT NULL,
    cash_amount             DECIMAL(20,0)  NOT NULL,
    gross_amount_per_unit   NUMERIC(20,4),
    fineract_transfer_id    BIGINT,
    status                  VARCHAR(20)    NOT NULL DEFAULT 'SUCCESS',
    failure_reason          VARCHAR(500),
    paid_at                 TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    coupon_date             DATE           NOT NULL
);

CREATE INDEX idx_interest_payments_asset ON interest_payments(asset_id, coupon_date);
CREATE INDEX idx_interest_payments_user  ON interest_payments(user_id, paid_at);
CREATE UNIQUE INDEX uq_interest_payments_success
    ON interest_payments(asset_id, user_id, coupon_date)
    WHERE status = 'SUCCESS';

-- Archive tables (no FK constraints, used by ArchivalScheduler)

CREATE TABLE orders_archive (
    id                          VARCHAR(36)   PRIMARY KEY,
    idempotency_key             VARCHAR(36),
    user_id                     BIGINT        NOT NULL,
    user_external_id            VARCHAR(36)   NOT NULL,
    asset_id                    VARCHAR(36)   NOT NULL,
    side                        VARCHAR(4)    NOT NULL,
    cash_amount                 DECIMAL(20,0) NOT NULL,
    units                       DECIMAL(20,8),
    execution_price             DECIMAL(20,0),
    fee                         DECIMAL(20,0),
    spread_amount               DECIMAL(20,0) DEFAULT 0,
    registration_duty_amount    DECIMAL(20,0),
    capital_gains_tax_amount    DECIMAL(20,0),
    tva_amount                  DECIMAL(20,0),
    accrued_interest_amount     DECIMAL(20,0),
    quoted_at                   TIMESTAMPTZ,
    quote_expires_at            TIMESTAMPTZ,
    quoted_ask_price            DECIMAL(20,0),
    quoted_bid_price            DECIMAL(20,0),
    status                      VARCHAR(25)   NOT NULL,
    failure_reason              VARCHAR(500),
    created_at                  TIMESTAMPTZ   NOT NULL,
    updated_at                  TIMESTAMPTZ,
    version                     BIGINT        DEFAULT 0,
    archived_at                 TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_archive_user   ON orders_archive(user_id, created_at DESC);
CREATE INDEX idx_orders_archive_status ON orders_archive(status, created_at);

CREATE TABLE trade_log_archive (
    id                          VARCHAR(36)   PRIMARY KEY,
    order_id                    VARCHAR(36)   NOT NULL,
    user_id                     BIGINT        NOT NULL,
    asset_id                    VARCHAR(36)   NOT NULL,
    side                        VARCHAR(4)    NOT NULL,
    units                       DECIMAL(20,8) NOT NULL,
    price_per_unit              DECIMAL(20,0) NOT NULL,
    total_amount                DECIMAL(20,0) NOT NULL,
    fee                         DECIMAL(20,0) NOT NULL DEFAULT 0,
    spread_amount               DECIMAL(20,0) NOT NULL DEFAULT 0,
    realized_pnl                DECIMAL(20,0),
    accrued_interest_amount     DECIMAL(20,0),
    fineract_cash_transfer_id   BIGINT,
    fineract_asset_transfer_id  BIGINT,
    executed_at                 TIMESTAMPTZ   NOT NULL,
    archived_at                 TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trade_archive_user     ON trade_log_archive(user_id, executed_at);
CREATE INDEX idx_trade_archive_asset    ON trade_log_archive(asset_id, executed_at DESC);
CREATE INDEX idx_trade_archive_executed ON trade_log_archive(executed_at);

-- Portfolio value snapshots (daily)
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

-- Principal redemptions (bond maturity payouts)
CREATE TABLE principal_redemptions (
    id                          BIGSERIAL     PRIMARY KEY,
    asset_id                    VARCHAR(36)   NOT NULL REFERENCES assets(id),
    user_id                     BIGINT        NOT NULL,
    units                       DECIMAL(20,8) NOT NULL,
    face_value                  DECIMAL(20,0) NOT NULL,
    cash_amount                 DECIMAL(20,0) NOT NULL,
    realized_pnl                DECIMAL(20,0),
    fineract_cash_transfer_id   BIGINT,
    fineract_asset_transfer_id  BIGINT,
    status                      VARCHAR(20)   NOT NULL DEFAULT 'SUCCESS',
    failure_reason              VARCHAR(500),
    redeemed_at                 TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    redemption_date             DATE          NOT NULL
);

CREATE INDEX idx_pr_asset_id    ON principal_redemptions(asset_id);
CREATE INDEX idx_pr_user_id     ON principal_redemptions(user_id);
CREATE INDEX idx_pr_status_failed ON principal_redemptions(status) WHERE status = 'FAILED';

-- Notification log
CREATE TABLE notification_log (
    id              BIGSERIAL     PRIMARY KEY,
    user_id         BIGINT,
    event_type      VARCHAR(50)   NOT NULL,
    title           VARCHAR(200)  NOT NULL,
    body            VARCHAR(2000) NOT NULL,
    reference_id    VARCHAR(36),
    reference_type  VARCHAR(30),
    is_read         BOOLEAN       NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notif_user_unread  ON notification_log(user_id, is_read, created_at DESC) WHERE is_read = FALSE;
CREATE INDEX idx_notif_user_created ON notification_log(user_id, created_at DESC);
CREATE INDEX idx_notif_admin_created ON notification_log(created_at DESC) WHERE user_id IS NULL;

-- Notification preferences
CREATE TABLE notification_preferences (
    id                      BIGSERIAL   PRIMARY KEY,
    user_id                 BIGINT      NOT NULL UNIQUE,
    trade_executed          BOOLEAN     NOT NULL DEFAULT TRUE,
    coupon_paid             BOOLEAN     NOT NULL DEFAULT TRUE,
    redemption_completed    BOOLEAN     NOT NULL DEFAULT TRUE,
    asset_status_changed    BOOLEAN     NOT NULL DEFAULT TRUE,
    order_stuck             BOOLEAN     NOT NULL DEFAULT TRUE,
    income_paid             BOOLEAN     NOT NULL DEFAULT TRUE,
    treasury_shortfall      BOOLEAN     NOT NULL DEFAULT TRUE,
    delisting_announced     BOOLEAN     NOT NULL DEFAULT TRUE,
    updated_at              TIMESTAMPTZ
);

-- Income distributions (dividends, rent, harvest yields)
CREATE TABLE income_distributions (
    id                      BIGSERIAL   PRIMARY KEY,
    asset_id                VARCHAR(36) NOT NULL REFERENCES assets(id),
    user_id                 BIGINT      NOT NULL,
    income_type             VARCHAR(30) NOT NULL,
    units                   DECIMAL(20,8) NOT NULL,
    rate_applied            DECIMAL(8,4) NOT NULL,
    cash_amount             DECIMAL(20,0) NOT NULL,
    fineract_transfer_id    BIGINT,
    status                  VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    failure_reason          VARCHAR(500),
    distribution_date       DATE        NOT NULL,
    paid_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_income_dist_asset ON income_distributions(asset_id, distribution_date);
CREATE INDEX idx_income_dist_user  ON income_distributions(user_id, paid_at);
CREATE UNIQUE INDEX uq_income_distributions_success
    ON income_distributions(asset_id, user_id, distribution_date)
    WHERE status = 'SUCCESS';

-- Reconciliation reports
CREATE TABLE reconciliation_reports (
    id              BIGSERIAL     PRIMARY KEY,
    report_date     DATE          NOT NULL,
    report_type     VARCHAR(50)   NOT NULL,
    asset_id        VARCHAR(36)   REFERENCES assets(id),
    user_id         BIGINT,
    expected_value  DECIMAL(20,8),
    actual_value    DECIMAL(20,8),
    discrepancy     DECIMAL(20,8),
    severity        VARCHAR(20)   NOT NULL DEFAULT 'WARNING',
    status          VARCHAR(20)   NOT NULL DEFAULT 'OPEN',
    notes           VARCHAR(1000),
    resolved_by     VARCHAR(100),
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recon_status   ON reconciliation_reports(status) WHERE status = 'OPEN';
CREATE INDEX idx_recon_severity ON reconciliation_reports(severity, report_date) WHERE severity = 'CRITICAL';

-- Audit log (admin actions)
CREATE TABLE audit_log (
    id                  BIGSERIAL    PRIMARY KEY,
    action              VARCHAR(100) NOT NULL,
    admin_subject       VARCHAR(255) NOT NULL,
    target_asset_id     VARCHAR(36),
    target_asset_symbol VARCHAR(10),
    result              VARCHAR(10)  NOT NULL,
    error_message       VARCHAR(500),
    duration_ms         BIGINT       NOT NULL DEFAULT 0,
    request_summary     TEXT,
    client_ip           VARCHAR(45),
    user_agent          VARCHAR(500),
    performed_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_admin     ON audit_log(admin_subject);
CREATE INDEX idx_audit_log_asset     ON audit_log(target_asset_id);
CREATE INDEX idx_audit_log_performed ON audit_log(performed_at);

-- Scheduled payments (coupon/income pending admin approval)
CREATE TABLE scheduled_payments (
    id                          BIGSERIAL     PRIMARY KEY,
    asset_id                    VARCHAR(36)   NOT NULL REFERENCES assets(id),
    payment_type                VARCHAR(20)   NOT NULL,
    schedule_date               DATE          NOT NULL,
    status                      VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    estimated_rate              DECIMAL(8,4),
    estimated_amount_per_unit   DECIMAL(20,4),
    estimated_total             DECIMAL(20,0),
    holder_count                INTEGER       NOT NULL DEFAULT 0,
    actual_amount_per_unit      DECIMAL(20,4),
    confirmed_by                VARCHAR(255),
    confirmed_at                TIMESTAMPTZ,
    cancelled_by                VARCHAR(255),
    cancelled_at                TIMESTAMPTZ,
    cancel_reason               VARCHAR(500),
    holders_paid                INTEGER,
    holders_failed              INTEGER,
    total_amount_paid           DECIMAL(20,0),
    executed_at                 TIMESTAMPTZ,
    created_at                  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_scheduled_payment UNIQUE (asset_id, payment_type, schedule_date)
);

CREATE INDEX idx_scheduled_payments_status ON scheduled_payments(status);
CREATE INDEX idx_scheduled_payments_asset  ON scheduled_payments(asset_id);

-- Tax transaction audit trail (Cameroon/CEMAC regulatory compliance)
CREATE TABLE tax_transactions (
    id                      BIGSERIAL    PRIMARY KEY,
    order_id                VARCHAR(36),
    scheduled_payment_id    BIGINT,
    user_id                 BIGINT       NOT NULL,
    asset_id                VARCHAR(36)  NOT NULL,
    tax_type                VARCHAR(30)  NOT NULL,
    taxable_amount          DECIMAL(20,0) NOT NULL,
    tax_rate                DECIMAL(5,4) NOT NULL,
    tax_amount              DECIMAL(20,0) NOT NULL,
    fineract_transfer_id    BIGINT,
    fiscal_year             INT          NOT NULL,
    fiscal_month            INT          NOT NULL,
    status                  VARCHAR(20)  NOT NULL DEFAULT 'SUCCESS',
    failure_reason          VARCHAR(500),
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tax_user_year ON tax_transactions(user_id, fiscal_year, tax_type);
CREATE INDEX idx_tax_month     ON tax_transactions(fiscal_year, fiscal_month, tax_type);
CREATE INDEX idx_tax_order     ON tax_transactions(order_id);
CREATE INDEX idx_tax_asset     ON tax_transactions(asset_id);

-- Per-category daily value snapshots (for sparkline charts)
CREATE TABLE category_snapshots (
    id            BIGSERIAL     PRIMARY KEY,
    user_id       BIGINT        NOT NULL,
    snapshot_date DATE          NOT NULL,
    category      VARCHAR(30)   NOT NULL,
    total_value   DECIMAL(20,0) NOT NULL,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_category_snapshot UNIQUE (user_id, snapshot_date, category)
);

CREATE INDEX idx_category_snapshots_user_date ON category_snapshots(user_id, snapshot_date DESC);

-- Per-asset projection counters (denormalized for fast reporting)
CREATE TABLE asset_projections (
    asset_id            VARCHAR(36)    PRIMARY KEY REFERENCES assets(id),
    total_cash_volume   DECIMAL(19,4)  NOT NULL DEFAULT 0,
    total_spread        DECIMAL(19,4)  NOT NULL DEFAULT 0,
    total_fees          DECIMAL(19,4)  NOT NULL DEFAULT 0,
    total_tax_reg_duty  DECIMAL(19,4)  NOT NULL DEFAULT 0,
    total_tax_ircm      DECIMAL(19,4)  NOT NULL DEFAULT 0,
    total_tax_cap_gains DECIMAL(19,4)  NOT NULL DEFAULT 0,
    total_tax_tva       DECIMAL(19,4)  NOT NULL DEFAULT 0,
    total_buy_count     BIGINT         NOT NULL DEFAULT 0,
    total_sell_count    BIGINT         NOT NULL DEFAULT 0,
    last_updated_at     TIMESTAMP,
    version             BIGINT         NOT NULL DEFAULT 0
);

-- Settlement tracking (LP payouts, tax remittances, trust rebalancing)
CREATE TABLE settlements (
    id                          VARCHAR(36)    PRIMARY KEY,
    lp_client_id                BIGINT,
    settlement_type             VARCHAR(30)    NOT NULL,
    amount                      DECIMAL(19,4)  NOT NULL,
    status                      VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    description                 TEXT,
    source_account_id           BIGINT,
    destination_account_id      BIGINT,
    source_gl_code              VARCHAR(10),
    destination_gl_code         VARCHAR(10),
    created_by                  VARCHAR(100),
    approved_by                 VARCHAR(100),
    created_at                  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at                 TIMESTAMP,
    executed_at                 TIMESTAMP,
    rejected_at                 TIMESTAMP,
    rejection_reason            TEXT,
    fineract_journal_entry_id   VARCHAR(100),
    version                     BIGINT         NOT NULL DEFAULT 0
);

-- ShedLock distributed scheduler lock table
CREATE TABLE shedlock (
    name        VARCHAR(64)  NOT NULL,
    lock_until  TIMESTAMP(3) NOT NULL,
    locked_at   TIMESTAMP(3) NOT NULL,
    locked_by   VARCHAR(255) NOT NULL,
    PRIMARY KEY (name)
);
