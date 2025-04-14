-- SQL Query to Check Table Relationships
-- This query shows all foreign key relationships in the database

-- Begin transaction for read-only operation
BEGIN;

-- Report start of operation
DO $$
BEGIN
  RAISE NOTICE '=== Checking Database Relationships ===';
END $$;

-- Main query to show all foreign key relationships
SELECT 
  tc.table_schema,
  tc.constraint_name,
  tc.table_name AS source_table,
  kcu.column_name AS source_column,
  ccu.table_name AS target_table,
  ccu.column_name AS target_column,
  tc.constraint_type
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE 
  tc.constraint_type = 'FOREIGN KEY' AND
  tc.table_schema = 'public'
ORDER BY 
  tc.table_name, 
  kcu.column_name;

-- Show table relationships as a summary
DO $$
DECLARE
  rel_record record;
BEGIN
  RAISE NOTICE '---------------------------------------------';
  RAISE NOTICE 'Table Relationships Summary:';
  RAISE NOTICE '---------------------------------------------';
  
  FOR rel_record IN 
    SELECT 
      tc.table_name AS source_table,
      kcu.column_name AS source_column,
      ccu.table_name AS target_table,
      ccu.column_name AS target_column
    FROM 
      information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    WHERE 
      tc.constraint_type = 'FOREIGN KEY' AND
      tc.table_schema = 'public'
    ORDER BY 
      tc.table_name, 
      kcu.column_name
  LOOP
    RAISE NOTICE '% (%) → % (%)', 
      rel_record.source_table, 
      rel_record.source_column,
      rel_record.target_table,
      rel_record.target_column;
  END LOOP;
END $$;

-- Check for missing relationships that should exist based on the application code
DO $$
BEGIN
  RAISE NOTICE '---------------------------------------------';
  RAISE NOTICE 'Checking for Missing Expected Relationships:';
  RAISE NOTICE '---------------------------------------------';
  
  -- Check Albums -> Recordings relationship
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
      AND kcu.table_name = 'Recordings'
      AND kcu.column_name = 'albumId'
      AND ccu.table_name = 'Albums'
  ) THEN
    RAISE NOTICE 'MISSING: Recordings (albumId) → Albums (albumId)';
  END IF;
  
  -- Check Songs -> Recordings relationship
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
      AND kcu.table_name = 'Recordings'
      AND kcu.column_name = 'songId'
      AND (ccu.table_name = 'Songs' OR ccu.table_name = 'UniqueSongs')
  ) THEN
    RAISE NOTICE 'MISSING: Recordings (songId) → Songs/UniqueSongs (songId)';
  END IF;
  
  -- Check Albums -> Eras relationship
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
      AND kcu.table_name = 'Albums'
      AND kcu.column_name = 'eraId'
      AND ccu.table_name = 'Eras'
  ) THEN
    RAISE NOTICE 'MISSING: Albums (eraId) → Eras (eraId)';
  END IF;
  
  -- Check RecordingEditions -> Recordings relationship
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
      AND kcu.table_name = 'RecordingEditions'
      AND kcu.column_name = 'recordingId'
      AND ccu.table_name = 'Recordings'
  ) THEN
    RAISE NOTICE 'MISSING: RecordingEditions (recordingId) → Recordings (recordingId)';
  END IF;
  
  -- Check RecordingEditions -> Editions relationship
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_schema = 'public'
      AND kcu.table_name = 'RecordingEditions'
      AND kcu.column_name = 'editionId'
      AND ccu.table_name = 'Editions'
  ) THEN
    RAISE NOTICE 'MISSING: RecordingEditions (editionId) → Editions (editionId)';
  END IF;
END $$;

-- Rollback as this was a read-only operation
ROLLBACK;
