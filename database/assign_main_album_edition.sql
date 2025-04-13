-- Script: assign_main_album_edition.sql
-- Created: 13 Apr 2025
-- Description: Assign "Main Album" edition to all songs that don't currently have an edition

-- Start a transaction block
BEGIN;

-- Step 1: Identify songs without editions
CREATE TEMP TABLE songs_without_editions AS
SELECT 
    us."songId",
    us."canonicalTitle",
    r."recordingId"
FROM 
    "UniqueSongs" us
JOIN 
    "Recordings" r ON us."songId" = r."songId"
LEFT JOIN 
    "RecordingEditions" re ON r."recordingId" = re."recordingId"
WHERE 
    re."recordingId" IS NULL;

-- Show songs that will be updated
SELECT 
    "songId",
    "canonicalTitle" AS "Song Title",
    COUNT("recordingId") AS "Recording Count"
FROM 
    songs_without_editions
GROUP BY 
    "songId", "canonicalTitle"
ORDER BY 
    "canonicalTitle";

-- Step 2: Show total count of songs and recordings to be updated
SELECT 
    COUNT(DISTINCT "songId") AS "Songs to Update",
    COUNT("recordingId") AS "Recordings to Update"
FROM 
    songs_without_editions;

-- Step 3: Insert the "Main Album" edition for all identified recordings
WITH inserted_records AS (
    INSERT INTO "RecordingEditions" ("recordingId", "editionId", "notes")
    SELECT 
        "recordingId",
        'main',
        'Automatically assigned as Main Album on ' || CURRENT_DATE
    FROM 
        songs_without_editions
    ON CONFLICT ("recordingId", "editionId") DO NOTHING
    RETURNING *
)
SELECT COUNT(*) AS "Recordings Assigned to Main Album" FROM inserted_records;

-- Step 4: Verify that all songs now have editions
SELECT 
    COUNT(*) AS "Songs Still Without Editions"
FROM 
    "UniqueSongs" us
LEFT JOIN 
    "Recordings" r ON us."songId" = r."songId"
LEFT JOIN 
    "RecordingEditions" re ON r."recordingId" = re."recordingId"
WHERE 
    re."recordingId" IS NULL
    AND r."recordingId" IS NOT NULL;

-- Step 5: Show updated distribution of editions
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

-- Step 6: Final confirmation
DO $$
BEGIN
    RAISE NOTICE 'Main Album edition assignment completed at %', NOW();
    RAISE NOTICE 'Total songs in database: %', (SELECT COUNT(*) FROM "UniqueSongs");
    RAISE NOTICE 'Total songs with editions: %', (
        SELECT COUNT(DISTINCT s."songId") 
        FROM "UniqueSongs" s
        JOIN "Recordings" r ON s."songId" = r."songId"
        JOIN "RecordingEditions" re ON r."recordingId" = re."recordingId"
    );
END $$;

-- Clean up
DROP TABLE songs_without_editions;

-- Commit the transaction
COMMIT;
