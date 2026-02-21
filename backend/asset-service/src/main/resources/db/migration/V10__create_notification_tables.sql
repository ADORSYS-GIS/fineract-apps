-- Notification log: stores all user notifications
CREATE TABLE notification_log (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    event_type      VARCHAR(50) NOT NULL,
    title           VARCHAR(200) NOT NULL,
    body            VARCHAR(2000) NOT NULL,
    reference_id    VARCHAR(36),
    reference_type  VARCHAR(30),
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notif_user_unread ON notification_log(user_id, is_read, created_at DESC)
    WHERE is_read = FALSE;

CREATE INDEX idx_notif_user_created ON notification_log(user_id, created_at DESC);

-- Notification preferences: one row per user, controls which event types generate notifications
CREATE TABLE notification_preferences (
    id                      BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL UNIQUE,
    trade_executed          BOOLEAN NOT NULL DEFAULT TRUE,
    coupon_paid             BOOLEAN NOT NULL DEFAULT TRUE,
    redemption_completed    BOOLEAN NOT NULL DEFAULT TRUE,
    asset_status_changed    BOOLEAN NOT NULL DEFAULT TRUE,
    order_stuck             BOOLEAN NOT NULL DEFAULT TRUE,
    income_paid             BOOLEAN NOT NULL DEFAULT TRUE,
    treasury_shortfall      BOOLEAN NOT NULL DEFAULT TRUE,
    delisting_announced     BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at              TIMESTAMPTZ
);
