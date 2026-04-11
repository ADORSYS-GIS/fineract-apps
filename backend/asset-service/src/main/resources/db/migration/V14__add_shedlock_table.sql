-- ShedLock distributed scheduler lock table.
-- Prevents duplicate @Scheduled job execution when asset-service runs as multiple pods.
-- Each scheduled task acquires a named lock here before executing; only one pod wins.
CREATE TABLE IF NOT EXISTS shedlock (
    name        VARCHAR(64)  NOT NULL,
    lock_until  TIMESTAMP(3) NOT NULL,
    locked_at   TIMESTAMP(3) NOT NULL,
    locked_by   VARCHAR(255) NOT NULL,
    PRIMARY KEY (name)
);
