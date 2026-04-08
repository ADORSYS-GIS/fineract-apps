-- Backfill tva_enabled = true for all existing assets.
-- V5 added the column with DEFAULT false, but the business default is true (TVA on for all assets).
-- New assets created after this migration will use the Java @Builder.Default (true).
UPDATE assets SET tva_enabled = true WHERE tva_enabled = false;
ALTER TABLE assets ALTER COLUMN tva_enabled SET DEFAULT true;
