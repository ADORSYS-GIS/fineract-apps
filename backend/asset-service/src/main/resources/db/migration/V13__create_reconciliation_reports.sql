-- Reconciliation reports table
CREATE TABLE reconciliation_reports (
    id                  BIGSERIAL PRIMARY KEY,
    report_date         DATE NOT NULL,
    report_type         VARCHAR(50) NOT NULL,
    asset_id            VARCHAR(36) REFERENCES assets(id),
    user_id             BIGINT,
    expected_value      DECIMAL(20, 8),
    actual_value        DECIMAL(20, 8),
    discrepancy         DECIMAL(20, 8),
    severity            VARCHAR(20) NOT NULL DEFAULT 'WARNING',
    status              VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    notes               VARCHAR(1000),
    resolved_by         VARCHAR(100),
    resolved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recon_status ON reconciliation_reports(status) WHERE status = 'OPEN';
CREATE INDEX idx_recon_severity ON reconciliation_reports(severity, report_date)
    WHERE severity = 'CRITICAL';
