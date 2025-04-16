-- 2. Song Edition Statistics
-- This query shows summary statistics about editions in the database

-- Begin transaction for safety
BEGIN;

DO $$
DECLARE
  "total_songs" INT;
  "songs_with_editions" INT;
  "max_editions" INT;
  "avg_editions" NUMERIC(10,2);
BEGIN
  -- Get total number of songs
  SELECT COUNT(*) INTO "total_songs" FROM "UniqueSongs";
  
  -- Get number of songs with at least one edition
  SELECT COUNT(*) INTO "songs_with_editions" 
  FROM (
    SELECT s."songId"
    FROM "UniqueSongs" s
    JOIN "Recordings" r ON s."songId" = r."songId"
    JOIN "RecordingEditions" re ON r."recordingId" = re."recordingId"
    GROUP BY s."songId"
    HAVING COUNT(DISTINCT re."editionId") > 0
  ) AS "songs_with_eds";
  
  -- Get maximum number of editions for any song
  SELECT MAX("edition_count") INTO "max_editions"
  FROM (
    SELECT COUNT(DISTINCT re."editionId") AS "edition_count"
    FROM "UniqueSongs" s
    JOIN "Recordings" r ON s."songId" = r."songId"
    JOIN "RecordingEditions" re ON r."recordingId" = re."recordingId"
    GROUP BY s."songId"
  ) AS "max_eds";
  
  -- Get average number of editions per song
  SELECT COALESCE(AVG("edition_count"), 0) INTO "avg_editions"
  FROM (
    SELECT COUNT(DISTINCT re."editionId") AS "edition_count"
    FROM "UniqueSongs" s
    JOIN "Recordings" r ON s."songId" = r."songId"
    JOIN "RecordingEditions" re ON r."recordingId" = re."recordingId"
    GROUP BY s."songId"
  ) AS "avg_eds";
  
  -- Create a temporary table to show the statistics
  CREATE TEMPORARY TABLE IF NOT EXISTS "temp_edition_stats" (
    "metric" TEXT,
    "value" TEXT
  );
  
  -- Insert the statistics
  INSERT INTO "temp_edition_stats" VALUES
    ('Total songs in database', "total_songs"::TEXT),
    ('Songs with at least one edition', "songs_with_editions"::TEXT),
    ('Maximum editions for any song', "max_editions"::TEXT),
    ('Average editions per song', "avg_editions"::TEXT);
    
  -- Display the statistics
  RAISE NOTICE 'Summary Statistics:';
  RAISE NOTICE '- Total songs in database: %', "total_songs";
  RAISE NOTICE '- Songs with at least one edition: %', "songs_with_editions";
  RAISE NOTICE '- Maximum editions for any song: %', "max_editions";
  RAISE NOTICE '- Average editions per song: %', "avg_editions";
END $$;

-- Return the statistics as a result set
SELECT * FROM "temp_edition_stats";

COMMIT;
