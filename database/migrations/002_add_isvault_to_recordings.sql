-- Migration: 002_add_isvault_to_recordings
-- Created: 13 Apr 2025
-- Description: Add isVault boolean field to Recordings table to identify "From The Vault" tracks

-- Add Vault field to Recordings table
ALTER TABLE "Recordings"
ADD COLUMN "isVault" BOOLEAN DEFAULT FALSE;

-- Update existing "From The Vault" recordings with exact capitalization match
UPDATE "Recordings"
SET "isVault" = TRUE
WHERE "notes" LIKE '%From The Vault%' 
   OR "versionType" LIKE '%vault%';

-- Add an index for faster querying of vault tracks
CREATE INDEX idx_recordings_isvault ON "Recordings" ("isVault");

-- Comment on the column to document its purpose
COMMENT ON COLUMN "Recordings"."isVault" IS 'Indicates if this recording is a "From The Vault" track (TRUE) or not (FALSE)';
