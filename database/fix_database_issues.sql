-- Fix database issues identified during testing
-- This script addresses missing relationships and columns

-- Begin transaction for safety
BEGIN;

-- Report start of operation
DO $$
BEGIN
  RAISE NOTICE 'Fixing database issues for Music Ranker application...';
END $$;

-- 1. Add foreign key relationship between Albums and Recordings
DO $$
BEGIN
  -- Check if the foreign key already exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_recording_album' 
    AND table_name = 'Recordings'
  ) THEN
    RAISE NOTICE 'Adding foreign key relationship between Recordings and Albums';
    
    -- Add the foreign key constraint
    ALTER TABLE "Recordings"
    ADD CONSTRAINT "fk_recording_album" 
    FOREIGN KEY ("albumId") 
    REFERENCES "Albums"("albumId");
    
    RAISE NOTICE 'Foreign key relationship added successfully';
  ELSE
    RAISE NOTICE 'Foreign key relationship already exists';
  END IF;
END $$;

-- 2. Add missing duration column to user_song_rankings
DO $$
BEGIN
  -- Check if the column already exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_song_rankings' 
    AND column_name = 'duration'
  ) THEN
    RAISE NOTICE 'Adding duration column to user_song_rankings table';
    
    -- Add the missing column
    ALTER TABLE "user_song_rankings"
    ADD COLUMN "duration" integer;
    
    RAISE NOTICE 'Duration column added successfully';
  ELSE
    RAISE NOTICE 'Duration column already exists';
  END IF;
END $$;

-- 3. Ensure other necessary relationships are in place
DO $$
BEGIN
  -- Check if the foreign key already exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_recording_song' 
    AND table_name = 'Recordings'
  ) THEN
    RAISE NOTICE 'Adding foreign key relationship between Recordings and Songs';
    
    -- Add the foreign key constraint
    ALTER TABLE "Recordings"
    ADD CONSTRAINT "fk_recording_song" 
    FOREIGN KEY ("songId") 
    REFERENCES "Songs"("songId");
    
    RAISE NOTICE 'Foreign key relationship added successfully';
  ELSE
    RAISE NOTICE 'Foreign key relationship already exists';
  END IF;
END $$;

-- Validation queries to show updated structure
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name IN ('Recordings', 'user_song_rankings');

-- Check the user_song_rankings table structure
SELECT 
  column_name, 
  data_type 
FROM 
  information_schema.columns 
WHERE 
  table_name = 'user_song_rankings'
ORDER BY 
  ordinal_position;

-- Final confirmation
DO $$
BEGIN
  RAISE NOTICE 'Database fixes completed successfully!';
END $$;

COMMIT;
