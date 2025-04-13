-- Songs by Era Query
-- This script returns all songs in the Songs table, categorized by era
-- Created: 13 Apr 2025

-- Main query to get songs grouped by era
SELECT 
    e."eraName" AS "Era Name",
    e."eraStartDate" AS "Era Start Date",
    s."canonicalTitle" AS "Song Title",
    s."songId" AS "Song ID",
    s."notes" AS "Notes"
FROM 
    "Songs" s
LEFT JOIN 
    "Eras" e ON s."originalEraId" = e."eraId"
ORDER BY 
    e."eraStartDate", -- Sort eras chronologically
    s."canonicalTitle"; -- Sort songs alphabetically within each era

-- Summary count of songs per era
SELECT 
    e."eraName" AS "Era Name",
    COUNT(s."songId") AS "Song Count"
FROM 
    "Eras" e
LEFT JOIN 
    "Songs" s ON e."eraId" = s."originalEraId"
GROUP BY 
    e."eraName"
ORDER BY 
    COUNT(s."songId") DESC;

-- Find songs without an era assigned
SELECT 
    s."canonicalTitle" AS "Song Title",
    s."songId" AS "Song ID",
    s."notes" AS "Notes"
FROM 
    "Songs" s
WHERE 
    s."originalEraId" IS NULL OR s."originalEraId" = '';

-- Find eras without any songs
SELECT 
    e."eraName" AS "Era Name",
    e."eraId" AS "Era ID"
FROM 
    "Eras" e
LEFT JOIN 
    "Songs" s ON e."eraId" = s."originalEraId"
WHERE 
    s."songId" IS NULL;
