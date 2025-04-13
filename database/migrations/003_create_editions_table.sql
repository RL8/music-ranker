-- Migration: 003_create_editions_table
-- Created: 13 Apr 2025
-- Description: Create Editions table and RecordingEditions junction table

-- Start a transaction block for better error handling
BEGIN;

-- Step 1: Create the Editions table with predefined edition types
CREATE TABLE IF NOT EXISTS "Editions" (
  "editionId" TEXT PRIMARY KEY,
  "editionName" TEXT NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Confirm table creation
SELECT 'Editions table created successfully' AS "Status";

-- Step 2: Insert the predefined edition types
INSERT INTO "Editions" ("editionId", "editionName", "description")
VALUES
  ('main', 'Main Album', 'Standard album release'),
  ('vault', 'Vault', 'From The Vault tracks'),
  ('deluxe', 'Deluxe', 'Deluxe edition bonus tracks'),
  ('3am', '3am Ed.', '3am Edition tracks'),
  ('platinum', 'Platinum', 'Platinum edition bonus tracks'),
  ('target', 'Target Ed.', 'Target exclusive edition tracks'),
  ('single', 'Single', 'Released as a single'),
  ('till_dawn', 'Till Dawn Ed.', 'Till Dawn Edition tracks')
ON CONFLICT ("editionId") DO NOTHING;

-- Confirm editions inserted
SELECT COUNT(*) AS "Editions Inserted" FROM "Editions";

-- Step 3: Create the junction table to associate recordings with editions
CREATE TABLE IF NOT EXISTS "RecordingEditions" (
  "recordingId" TEXT REFERENCES "Recordings"("recordingId") ON DELETE CASCADE,
  "editionId" TEXT REFERENCES "Editions"("editionId") ON DELETE CASCADE,
  "notes" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("recordingId", "editionId")
);

-- Confirm junction table creation
SELECT 'RecordingEditions junction table created successfully' AS "Status";

-- Step 4: Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_recording_editions_recording_id ON "RecordingEditions" ("recordingId");
CREATE INDEX IF NOT EXISTS idx_recording_editions_edition_id ON "RecordingEditions" ("editionId");

-- Confirm indexes created
SELECT 'Indexes created successfully' AS "Status";

-- Step 5: Add comments to document the tables
COMMENT ON TABLE "Editions" IS 'Contains predefined album editions and release types';
COMMENT ON TABLE "RecordingEditions" IS 'Junction table linking recordings to their respective editions';

-- Step 6: Final confirmation
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully at %', NOW();
    RAISE NOTICE 'Tables created: Editions, RecordingEditions';
    RAISE NOTICE 'Indexes created: idx_recording_editions_recording_id, idx_recording_editions_edition_id';
    RAISE NOTICE 'Total editions created: %', (SELECT COUNT(*) FROM "Editions");
END $$;

-- Show available editions for reference
SELECT "editionId", "editionName", "description" 
FROM "Editions" 
ORDER BY "editionName";

-- Commit the transaction
COMMIT;
