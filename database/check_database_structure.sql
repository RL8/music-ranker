-- Comprehensive Database Structure Check Script
-- This script provides detailed information about the current structure of your Supabase database

-- Begin transaction for read-only operations
BEGIN;

-- Report start of operation
DO $$
BEGIN
  RAISE NOTICE '=== Music Ranker Database Structure Check ===';
  RAISE NOTICE 'Starting comprehensive database structure check...';
  RAISE NOTICE '=============================================';
END $$;

-- 1. List all tables in the public schema
DO $$
BEGIN
  RAISE NOTICE 'Checking tables in public schema...';
END $$;

SELECT 
  table_name,
  table_type
FROM 
  information_schema.tables 
WHERE 
  table_schema = 'public' AND
  table_type IN ('BASE TABLE', 'VIEW')
ORDER BY 
  table_type, table_name;

-- 2. Check for case sensitivity issues (tables with similar names but different case)
DO $$
BEGIN
  RAISE NOTICE '---------------------------------------------';
  RAISE NOTICE 'Checking for case sensitivity issues...';
END $$;

SELECT 
  lower(table_name) as lowercase_name,
  array_agg(table_name) as actual_names,
  count(*) as name_count
FROM 
  information_schema.tables 
WHERE 
  table_schema = 'public' AND
  table_type = 'BASE TABLE'
GROUP BY 
  lower(table_name)
HAVING 
  count(*) > 1
ORDER BY 
  lowercase_name;

-- 3. For each table, list its columns and data types
DO $$
BEGIN
  RAISE NOTICE '---------------------------------------------';
  RAISE NOTICE 'Listing columns for each table...';
END $$;

-- This section will dynamically generate and execute SQL to list columns for each table
DO $$
DECLARE
  table_record record;
BEGIN
  FOR table_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  LOOP
    RAISE NOTICE '---------------------------------------------';
    RAISE NOTICE 'Table: %', table_record.table_name;
    
    -- Execute dynamic SQL to get column information for this table
    EXECUTE format('
      SELECT 
        column_name, 
        data_type,
        is_nullable,
        column_default
      FROM 
        information_schema.columns 
      WHERE 
        table_schema = ''public'' AND
        table_name = %L
      ORDER BY 
        ordinal_position', table_record.table_name);
  END LOOP;
END $$;

-- 4. List all foreign key relationships
DO $$
BEGIN
  RAISE NOTICE '---------------------------------------------';
  RAISE NOTICE 'Checking foreign key relationships...';
END $$;

SELECT 
  tc.table_name AS table_name, 
  kcu.column_name AS column_name, 
  ccu.table_name AS referenced_table,
  ccu.column_name AS referenced_column,
  tc.constraint_name
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
  tc.table_name, kcu.column_name;

-- 5. Check for tables referenced in application but missing in database
DO $$
BEGIN
  RAISE NOTICE '---------------------------------------------';
  RAISE NOTICE 'Checking for expected application tables...';
END $$;

WITH expected_tables AS (
  SELECT unnest(ARRAY[
    'Songs', 'Albums', 'Recordings', 'Eras', 'UniqueSongs', 
    'RecordingEditions', 'Editions', 'user_album_rankings', 
    'user_song_rankings', 'ranking_history'
  ]) AS table_name
)
SELECT 
  e.table_name AS expected_table,
  CASE 
    WHEN t.table_name IS NULL THEN 'MISSING'
    ELSE 'EXISTS'
  END AS status,
  t.table_type
FROM 
  expected_tables e
LEFT JOIN 
  information_schema.tables t ON lower(e.table_name) = lower(t.table_name) 
  AND t.table_schema = 'public'
ORDER BY 
  e.table_name;

-- 6. Check for views
DO $$
BEGIN
  RAISE NOTICE '---------------------------------------------';
  RAISE NOTICE 'Checking views...';
END $$;

SELECT 
  table_name AS view_name,
  view_definition
FROM 
  information_schema.views
WHERE 
  table_schema = 'public'
ORDER BY 
  table_name;

-- 7. Summary of database structure
DO $$
DECLARE
  table_count integer;
  view_count integer;
  fk_count integer;
BEGIN
  SELECT count(*) INTO table_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  
  SELECT count(*) INTO view_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_type = 'VIEW';
  
  SELECT count(*) INTO fk_count 
  FROM information_schema.table_constraints 
  WHERE table_schema = 'public' AND constraint_type = 'FOREIGN KEY';
  
  RAISE NOTICE '---------------------------------------------';
  RAISE NOTICE 'Database Structure Summary:';
  RAISE NOTICE 'Total tables: %', table_count;
  RAISE NOTICE 'Total views: %', view_count;
  RAISE NOTICE 'Total foreign key relationships: %', fk_count;
  RAISE NOTICE '=============================================';
END $$;

-- Final confirmation
DO $$
BEGIN
  RAISE NOTICE 'Database structure check completed!';
END $$;

-- Rollback as this was a read-only operation
ROLLBACK;
