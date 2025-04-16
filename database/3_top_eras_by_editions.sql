-- 3. Top Eras by Average Editions Per Song
-- This query shows which eras have the most editions per song on average

-- Begin transaction for safety
BEGIN;

-- Show top eras by average number of editions per song
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
  ROUND(COUNT(DISTINCT re."editionId")::NUMERIC / NULLIF(COUNT(DISTINCT s."songId"), 0), 2) DESC;

COMMIT;
