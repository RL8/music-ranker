-- Create views for the Music Ranker application
-- These views provide the expected structure for the application's database service

-- Begin transaction for safety
BEGIN;

-- Check if UniqueSongs exists and what type it is
DO $$
DECLARE
    object_type text;
BEGIN
    SELECT 
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'UniqueSongs') THEN 'VIEW'
            WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'UniqueSongs') THEN 'TABLE'
            ELSE 'NONE'
        END INTO object_type;
    
    RAISE NOTICE 'UniqueSongs exists as: %', object_type;
    
    -- If it's a table, we don't need to create the view
    -- If it's a view, we'll drop and recreate it
    -- If it doesn't exist, we'll create it
    
    IF object_type = 'VIEW' THEN
        RAISE NOTICE 'Dropping existing UniqueSongs view to recreate it';
        DROP VIEW "UniqueSongs";
    ELSIF object_type = 'TABLE' THEN
        RAISE NOTICE 'UniqueSongs already exists as a table, skipping view creation';
        RETURN;
    END IF;
END $$;

-- Only create the UniqueSongs view if it doesn't exist as a table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'UniqueSongs') THEN
        RAISE NOTICE 'Creating UniqueSongs view';
        
        EXECUTE 'CREATE OR REPLACE VIEW "UniqueSongs" AS
        SELECT 
          s."songId",
          s."canonicalTitle",
          s."originalEraId",
          s."notes",
          e."eraName"
        FROM 
          "Songs" s
        LEFT JOIN 
          "Eras" e ON s."originalEraId" = e."eraId"';
    END IF;
END $$;

-- Check if RecordingEditions exists and what type it is
DO $$
DECLARE
    object_type text;
BEGIN
    SELECT 
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'RecordingEditions') THEN 'VIEW'
            WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'RecordingEditions') THEN 'TABLE'
            ELSE 'NONE'
        END INTO object_type;
    
    RAISE NOTICE 'RecordingEditions exists as: %', object_type;
    
    -- If it's already a table or view, we don't need to create anything
    IF object_type = 'NONE' THEN
        RAISE NOTICE 'Creating RecordingEditions view';
        
        EXECUTE 'CREATE OR REPLACE VIEW "RecordingEditions" AS
        SELECT 
          re."recordingId",
          re."editionId"
        FROM 
          "RecordingEditions" re';
    ELSE
        RAISE NOTICE 'RecordingEditions already exists as a %, skipping creation', object_type;
    END IF;
END $$;

-- Final validation
DO $$
BEGIN
    RAISE NOTICE 'View creation process completed';
END $$;

COMMIT;
