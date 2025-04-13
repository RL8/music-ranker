-- Script: find_songs_without_editions.sql
-- Created: 13 Apr 2025
-- Description: Summarize songs in the UniqueSongs table with and without editions

-- Start a transaction block (read-only)
BEGIN;

-- Create a temporary table to identify songs with editions
CREATE TEMP TABLE temp_song_edition_status AS
SELECT 
    us."songId",
    us."canonicalTitle",
    CASE 
        WHEN COUNT(re."recordingId") > 0 THEN TRUE
        ELSE FALSE
    END AS has_edition
FROM 
    "UniqueSongs" us
LEFT JOIN 
    "Recordings" r ON us."songId" = r."songId"
LEFT JOIN 
    "RecordingEditions" re ON r."recordingId" = re."recordingId"
GROUP BY 
    us."songId", us."canonicalTitle";

-- List songs without editions
SELECT 
    "songId",
    "canonicalTitle" AS "Song Title",
    'No Edition Assigned' AS "Status"
FROM 
    temp_song_edition_status
WHERE 
    has_edition = FALSE
ORDER BY 
    "canonicalTitle";

-- List songs with editions
SELECT 
    s."songId",
    s."canonicalTitle" AS "Song Title",
    e."editionName" AS "Edition"
FROM 
    "UniqueSongs" s
JOIN 
    "Recordings" r ON s."songId" = r."songId"
JOIN 
    "RecordingEditions" re ON r."recordingId" = re."recordingId"
JOIN 
    "Editions" e ON re."editionId" = e."editionId"
GROUP BY 
    s."songId", s."canonicalTitle", e."editionName"
ORDER BY 
    s."canonicalTitle", e."editionName";

-- Summary by edition type
SELECT 
    e."editionName" AS "Edition",
    COUNT(DISTINCT s."songId") AS "Song Count"
FROM 
    "UniqueSongs" s
JOIN 
    "Recordings" r ON s."songId" = r."songId"
JOIN 
    "RecordingEditions" re ON r."recordingId" = re."recordingId"
JOIN 
    "Editions" e ON re."editionId" = e."editionId"
GROUP BY 
    e."editionName"
ORDER BY 
    COUNT(DISTINCT s."songId") DESC;

-- Overall summary statistics
SELECT 
    'Songs with editions' AS "Category",
    COUNT(DISTINCT s."songId") AS "Count"
FROM 
    "UniqueSongs" s
JOIN 
    "Recordings" r ON s."songId" = r."songId"
JOIN 
    "RecordingEditions" re ON r."recordingId" = re."recordingId"

UNION ALL

SELECT 
    'Songs without editions' AS "Category",
    COUNT(*) AS "Count"
FROM 
    temp_song_edition_status
WHERE 
    has_edition = FALSE

UNION ALL

SELECT 
    'Total songs' AS "Category",
    COUNT(*) AS "Count"
FROM 
    "UniqueSongs"

UNION ALL

SELECT 
    'Percentage with editions' AS "Category",
    ROUND(
        (SELECT COUNT(DISTINCT s."songId") 
         FROM "UniqueSongs" s
         JOIN "Recordings" r ON s."songId" = r."songId"
         JOIN "RecordingEditions" re ON r."recordingId" = re."recordingId") * 100.0 / 
        (SELECT COUNT(*) FROM "UniqueSongs"),
        2
    ) AS "Count";

-- Clean up
DROP TABLE temp_song_edition_status;

-- Roll back the transaction (since this is just a read-only script)
ROLLBACK;
