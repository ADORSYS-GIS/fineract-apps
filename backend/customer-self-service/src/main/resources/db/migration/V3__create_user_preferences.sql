CREATE TABLE user_preferences (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       VARCHAR(255) NOT NULL,
  pref_key      VARCHAR(100) NOT NULL,
  pref_value    VARCHAR(500) NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, pref_key)
);

CREATE INDEX idx_user_pref ON user_preferences(user_id);
