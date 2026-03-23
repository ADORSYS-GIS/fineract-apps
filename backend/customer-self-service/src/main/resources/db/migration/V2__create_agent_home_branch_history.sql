CREATE TABLE agent_home_branch_history (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_keycloak_id    VARCHAR(255) NOT NULL,
  previous_office_id   INTEGER NOT NULL,
  previous_office_name VARCHAR(100) NOT NULL,
  new_office_id        INTEGER NOT NULL,
  new_office_name      VARCHAR(100) NOT NULL,
  changed_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by           VARCHAR(255) NOT NULL,
  reason               VARCHAR(50) NOT NULL,
  notes                TEXT
);

CREATE INDEX idx_branch_hist_agent ON agent_home_branch_history(agent_keycloak_id);
