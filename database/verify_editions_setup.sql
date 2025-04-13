-- Verification script for Editions tables and data
-- Created: 13 Apr 2025
-- Description: Verify that the Editions tables were created and data was imported correctly

-- Start a transaction block (read-only)
BEGIN;

-- Step 1: Check if the tables exist
SELECT 
    table_name,
    'Table exists' AS status
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'public' 
    AND table_name IN ('Editions', 'RecordingEditions');

-- Step 2: Check the Editions table content
SELECT 
    "editionId",
    "editionName",
    "description"
FROM 
    "Editions"
ORDER BY 
    "editionName";

-- Step 3: Check the number of records in the RecordingEditions table
SELECT 
    COUNT(*) AS "Total RecordingEditions"
FROM 
    "RecordingEditions";

-- Step 4: Check the distribution of editions
SELECT 
    e."editionName" AS "Edition",
    COUNT(re."recordingId") AS "Number of Recordings"
FROM 
    "Editions" e
LEFT JOIN 
    "RecordingEditions" re ON e."editionId" = re."editionId"
GROUP BY 
    e."editionName"
ORDER BY 
    COUNT(re."recordingId") DESC;

-- Step 5: Sample of recordings by edition (limit 5 per edition)
SELECT 
    e."editionName" AS "Edition",
    s."canonicalTitle" AS "Song Title",
    r."recordingTitle" AS "Recording Title",
    a."albumTitle" AS "Album"
FROM 
    "RecordingEditions" re
JOIN 
    "Editions" e ON re."editionId" = e."editionId"
JOIN 
    "Recordings" r ON re."recordingId" = r."recordingId"
LEFT JOIN 
    "Songs" s ON r."songId" = s."songId"
LEFT JOIN 
    "Albums" a ON r."albumId" = a."albumId"
ORDER BY 
    e."editionName", 
    s."canonicalTitle"
LIMIT 20;

-- Step 6: Check for any potential issues
-- Songs in the CSV that didn't get imported
WITH csv_songs AS (
    VALUES 
        ('SONG_SLUT'), ('SONG_BABE'), ('SONG_BETTE_DAVIS_EYES'), ('SONG_BETTER_MAN'),
        ('SONG_BIGGER_THAN_THE_WHOLE_SKY'), ('SONG_BYE_BYE_BABY'), ('SONG_CASTLES_CRUMBLING'),
        ('SONG_COME_BACK_BE_HERE'), ('SONG_COME_IN_WITH_THE_RAIN'), ('SONG_DEAR_READER'),
        ('SONG_DONT_YOU'), ('SONG_DROPS_OF_JUPITER'), ('SONG_ELECTRIC_TOUCH'),
        ('SONG_FOOLISH_ONE'), ('SONG_FOREVER_WINTER'), ('SONG_GIRL_AT_HOME'),
        ('SONG_GLITCH'), ('SONG_HIGH_INFIDELITY'), ('SONG_HITS_DIFFERENT'),
        ('SONG_I_BET_YOU_THINK_ABOUT_ME'), ('SONG_I_CAN_SEE_YOU'), ('SONG_I_WANT_YOU_BACK'),
        ('SONG_IF_THIS_WAS_A_MOVIE'), ('SONG_IS_IT_OVER_NOW'), ('SONG_JUMP_THEN_FALL'),
        ('SONG_MESSAGE_IN_A_BOTTLE'), ('SONG_MR_PERFECTLY_FINE'), ('SONG_NEW_ROMANTICS'),
        ('SONG_NOTHING_NEW'), ('SONG_NOW_THAT_WE_DONT_TALK'), ('SONG_OURS'),
        ('SONG_PARIS'), ('SONG_RONAN'), ('SONG_RUN'), ('SONG_SAY_DONT_GO'),
        ('SONG_SUBURBAN_LEGENDS'), ('SONG_SUPERMAN'), ('SONG_SUPERSTAR'),
        ('SONG_THATS_WHEN'), ('SONG_THE_GREAT_WAR'), ('SONG_THE_LAKES'),
        ('SONG_THE_MOMENT_I_KNEW'), ('SONG_THE_OTHER_SIDE_OF_THE_DOOR'),
        ('SONG_THE_VERY_FIRST_NIGHT'), ('SONG_TIMELESS'), ('SONG_TODAY_WAS_A_FAIRYTALE'),
        ('SONG_UNTOUCHABLE'), ('SONG_WE_WERE_HAPPY'), ('SONG_WHEN_EMMA_FALLS_IN_LOVE'),
        ('SONG_WONDERLAND'), ('SONG_WOULDVE_COULDVE_SHOULDVE'), ('SONG_YOU_ALL_OVER_ME'),
        ('SONG_YOU_ARE_IN_LOVE'), ('SONG_YOURE_LOSING_ME')
)
SELECT 
    c.column1 AS "Song ID",
    'Not found in RecordingEditions' AS "Status"
FROM 
    csv_songs c
LEFT JOIN 
    "Songs" s ON c.column1 = s."songId"
LEFT JOIN 
    "Recordings" r ON s."songId" = r."songId"
LEFT JOIN 
    "RecordingEditions" re ON r."recordingId" = re."recordingId"
WHERE 
    re."recordingId" IS NULL;

-- Roll back the transaction (since this is just a verification script)
ROLLBACK;
