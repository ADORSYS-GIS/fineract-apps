-- Persistent audit log for admin actions (created by AuditLogAspect)
CREATE TABLE audit_log (
    id              BIGSERIAL       PRIMARY KEY,
    action          VARCHAR(100)    NOT NULL,
    admin_subject   VARCHAR(255)    NOT NULL,
    target_asset_id VARCHAR(36),
    target_asset_symbol VARCHAR(10),
    result          VARCHAR(10)     NOT NULL,
    error_message   VARCHAR(500),
    duration_ms     BIGINT          NOT NULL DEFAULT 0,
    request_summary TEXT,
    performed_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_admin ON audit_log(admin_subject);
CREATE INDEX idx_audit_log_asset ON audit_log(target_asset_id);
CREATE INDEX idx_audit_log_performed ON audit_log(performed_at);
