-- 1. Rank Songs by Number of Editions
-- This query shows all songs ranked by how many editions each has

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

COMMIT;
