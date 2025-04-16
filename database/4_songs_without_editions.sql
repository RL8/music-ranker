-- 4. Songs With No Editions (Potential Data Issues)
-- This query identifies songs that don't have any editions recorded

-- Begin transaction for safety
BEGIN;

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
