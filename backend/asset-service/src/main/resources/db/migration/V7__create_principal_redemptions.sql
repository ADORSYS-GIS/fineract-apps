CREATE TABLE principal_redemptions (
    id                          BIGSERIAL PRIMARY KEY,
    asset_id                    VARCHAR(36)    NOT NULL REFERENCES assets(id),
    user_id                     BIGINT         NOT NULL,
    units                       DECIMAL(20,8)  NOT NULL,
    face_value                  DECIMAL(20,0)  NOT NULL,
    cash_amount                 DECIMAL(20,0)  NOT NULL,
    realized_pnl                DECIMAL(20,0),
    fineract_cash_transfer_id   BIGINT,
    fineract_asset_transfer_id  BIGINT,
    status                      VARCHAR(20)    NOT NULL DEFAULT 'SUCCESS',
    failure_reason              VARCHAR(500),
    redeemed_at                 TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    redemption_date             DATE           NOT NULL
);

CREATE INDEX idx_pr_asset_id ON principal_redemptions(asset_id);
CREATE INDEX idx_pr_user_id  ON principal_redemptions(user_id);
CREATE INDEX idx_pr_status_failed ON principal_redemptions(status)
    WHERE status = 'FAILED';
