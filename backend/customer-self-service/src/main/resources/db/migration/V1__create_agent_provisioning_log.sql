CREATE TABLE agent_provisioning_log (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fineract_txn_id         BIGINT NOT NULL,
  agent_keycloak_id       VARCHAR(255) NOT NULL,
  agent_phone             VARCHAR(20) NOT NULL,
  amount_xaf              BIGINT NOT NULL,
  home_branch_office_id   INTEGER NOT NULL,
  home_branch_name        VARCHAR(100) NOT NULL,
  servicing_office_id     INTEGER NOT NULL,
  servicing_branch_name   VARCHAR(100) NOT NULL,
  is_home_branch          BOOLEAN GENERATED ALWAYS AS
                          (home_branch_office_id = servicing_office_id) STORED,
  staff_id                VARCHAR(255) NOT NULL,
  staff_name              VARCHAR(255),
  receipt_ref             VARCHAR(100),
  executed_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prov_servicing ON agent_provisioning_log(servicing_office_id, executed_at);
CREATE INDEX idx_prov_home      ON agent_provisioning_log(home_branch_office_id, executed_at);
