-- Rollback: 003_create_editions_table
-- Created: 13 Apr 2025
-- Description: Remove Editions table and RecordingEditions junction table

-- Step 1: Drop the junction table first (due to foreign key constraints)
DROP TABLE IF EXISTS "RecordingEditions";

-- Step 2: Drop the Editions table
DROP TABLE IF EXISTS "Editions";
