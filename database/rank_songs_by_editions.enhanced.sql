-- Rank Songs by Number of Editions
-- This query counts how many editions each song has and ranks them in descending order

-- Begin transaction for safety
BEGIN;

DO $$
BEGIN
  RAISE NOTICE '=== Ranking Songs by Number of Editions ===';
END $$;

-- Main query to count editions per song and display results with ranking
SELECT 
  ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT re."editionId") DESC) AS "rank",
  s."songId",
  s."canonicalTitle" AS "song_title",
  e."eraName" AS "era",
  COUNT(DISTINCT re."editionId") AS "edition_count"
FROM 
  "UniqueSongs" s
LEFT JOIN 
  "Eras" e ON s."originalEraId" = e."eraId"
LEFT JOIN 
  "Recordings" r ON s."songId" = r."songId"
LEFT JOIN 
  "RecordingEditions" re ON r."recordingId" = re."recordingId"
GROUP BY 
  s."songId", s."canonicalTitle", e."eraName"
ORDER BY 
  COUNT(DISTINCT re."editionId") DESC, s."canonicalTitle";

-- Show summary statistics
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
  
  -- Display summary
  RAISE NOTICE 'Summary Statistics:';
  RAISE NOTICE '- Total songs in database: %', "total_songs";
  RAISE NOTICE '- Songs with at least one edition: %', "songs_with_editions";
  RAISE NOTICE '- Maximum editions for any song: %', "max_editions";
  RAISE NOTICE '- Average editions per song: %', "avg_editions";
END $$;

-- Show top 5 eras by average number of editions per song
SELECT 
  e."eraName" AS "era",
  COUNT(DISTINCT s."songId") AS "total_songs",
  COUNT(DISTINCT re."editionId") AS "total_editions",
  ROUND(COUNT(DISTINCT re."editionId")::NUMERIC / NULLIF(COUNT(DISTINCT s."songId"), 0), 2) AS "avg_editions_per_song"
FROM 
  "Eras" e
LEFT JOIN 
  "UniqueSongs" s ON e."eraId" = s."originalEraId"
LEFT JOIN 
  "Recordings" r ON s."songId" = r."songId"
LEFT JOIN 
  "RecordingEditions" re ON r."recordingId" = re."recordingId"
GROUP BY 
  e."eraId", e."eraName"
HAVING 
  COUNT(DISTINCT s."songId") > 0
ORDER BY 
  "avg_editions_per_song" DESC
LIMIT 5;

-- Show songs with no editions (potential data issues)
SELECT 
  s."songId",
  s."canonicalTitle" AS "song_title",
  e."eraName" AS "era"
FROM 
  "UniqueSongs" s
LEFT JOIN 
  "Eras" e ON s."originalEraId" = e."eraId"
LEFT JOIN 
  "Recordings" r ON s."songId" = r."songId"
LEFT JOIN 
  "RecordingEditions" re ON r."recordingId" = re."recordingId"
GROUP BY 
  s."songId", s."canonicalTitle", e."eraName"
HAVING 
  COUNT(DISTINCT re."editionId") = 0
ORDER BY 
  e."eraName", s."canonicalTitle";

COMMIT;
