-- Fineract requires TWO databases:
-- 1. fineract_default (created automatically by Testcontainers as the main DB)
-- 2. fineract_tenants (must be created by init script)
CREATE DATABASE fineract_tenants OWNER fineract;
