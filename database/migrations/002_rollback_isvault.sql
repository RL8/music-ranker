-- Rollback: 002_add_isvault_to_recordings
-- Created: 13 Apr 2025
-- Description: Remove isVault boolean field from Recordings table

-- First, drop the index if it was created
DROP INDEX IF EXISTS idx_recordings_isvault;

-- Then, drop the column from the Recordings table
ALTER TABLE "Recordings" DROP COLUMN IF EXISTS "isVault";
