-- Migration: 004_import_editions_from_csv
-- Created: 13 Apr 2025
-- Description: Import edition assignments from CSV data

-- Start a transaction block for better error handling
BEGIN;

-- Step 1: Create a temporary table to hold the CSV data
CREATE TEMP TABLE temp_song_editions (
    songId TEXT,
    edition TEXT
);

-- Step 2: Insert the CSV data into the temporary table
INSERT INTO temp_song_editions (songId, edition) VALUES
('SONG_SLUT', 'Vault'),
('SONG_BABE', 'Vault'),
('SONG_BETTE_DAVIS_EYES', 'Deluxe'),
('SONG_BETTER_MAN', 'Vault'),
('SONG_BIGGER_THAN_THE_WHOLE_SKY', '3am Ed.'),
('SONG_BYE_BYE_BABY', 'Vault'),
('SONG_CASTLES_CRUMBLING', 'Vault'),
('SONG_COME_BACK_BE_HERE', 'Deluxe'),
('SONG_COME_IN_WITH_THE_RAIN', 'Platinum'),
('SONG_DEAR_READER', '3am Ed.'),
('SONG_DONT_YOU', 'Vault'),
('SONG_DROPS_OF_JUPITER', 'Deluxe'),
('SONG_ELECTRIC_TOUCH', 'Vault'),
('SONG_FOOLISH_ONE', 'Vault'),
('SONG_FOREVER_WINTER', 'Vault'),
('SONG_GIRL_AT_HOME', 'Deluxe'),
('SONG_GLITCH', '3am Ed.'),
('SONG_HIGH_INFIDELITY', '3am Ed.'),
('SONG_HITS_DIFFERENT', 'Target Exclusive'),
('SONG_I_BET_YOU_THINK_ABOUT_ME', 'Vault'),
('SONG_I_CAN_SEE_YOU', 'Vault'),
('SONG_I_WANT_YOU_BACK', 'Deluxe'),
('SONG_IF_THIS_WAS_A_MOVIE', 'Deluxe'),
('SONG_IS_IT_OVER_NOW', 'Vault'),
('SONG_JUMP_THEN_FALL', 'Platinum'),
('SONG_MESSAGE_IN_A_BOTTLE', 'Vault'),
('SONG_MR_PERFECTLY_FINE', 'Vault'),
('SONG_NEW_ROMANTICS', 'Deluxe'),
('SONG_NOTHING_NEW', 'Vault'),
('SONG_NOW_THAT_WE_DONT_TALK', 'Vault'),
('SONG_OURS', 'Deluxe'),
('SONG_PARIS', '3am Ed.'),
('SONG_RONAN', 'Single'),
('SONG_RUN', 'Vault'),
('SONG_SAY_DONT_GO', 'Vault'),
('SONG_SUBURBAN_LEGENDS', 'Vault'),
('SONG_SUPERMAN', 'Deluxe'),
('SONG_SUPERSTAR', 'Platinum'),
('SONG_THATS_WHEN', 'Vault'),
('SONG_THE_GREAT_WAR', '3am Ed.'),
('SONG_THE_LAKES', 'Deluxe'),
('SONG_THE_MOMENT_I_KNEW', 'Deluxe'),
('SONG_THE_OTHER_SIDE_OF_THE_DOOR', 'Platinum'),
('SONG_THE_VERY_FIRST_NIGHT', 'Vault'),
('SONG_TIMELESS', 'Vault'),
('SONG_TODAY_WAS_A_FAIRYTALE', 'Single'),
('SONG_UNTOUCHABLE', 'Platinum'),
('SONG_WE_WERE_HAPPY', 'Vault'),
('SONG_WHEN_EMMA_FALLS_IN_LOVE', 'Vault'),
('SONG_WONDERLAND', 'Deluxe'),
('SONG_WOULDVE_COULDVE_SHOULDVE', '3am Ed.'),
('SONG_YOU_ALL_OVER_ME', 'Vault'),
('SONG_YOU_ARE_IN_LOVE', 'Deluxe'),
('SONG_YOURE_LOSING_ME', 'Till Dawn Ed.');

-- Provide feedback on the number of songs loaded
SELECT COUNT(*) AS "Songs Loaded into Temporary Table" FROM temp_song_editions;

-- Step 3: Map the edition names to edition IDs
CREATE TEMP TABLE temp_song_edition_ids AS
SELECT 
    tse.songId,
    CASE 
        WHEN tse.edition = 'Vault' THEN 'vault'
        WHEN tse.edition = 'Deluxe' THEN 'deluxe'
        WHEN tse.edition = '3am Ed.' THEN '3am'
        WHEN tse.edition = 'Platinum' THEN 'platinum'
        WHEN tse.edition = 'Target Ed.' THEN 'target'
        WHEN tse.edition = 'Target Exclusive' THEN 'target'
        WHEN tse.edition = 'Single' THEN 'single'
        WHEN tse.edition = 'Till Dawn Ed.' THEN 'till_dawn'
        ELSE 'main' -- Default to main album if no match
    END AS editionId
FROM 
    temp_song_editions tse;

-- Step 4: Insert the data into the RecordingEditions table
-- This joins with Recordings to get the recordingId for each songId
WITH inserted_records AS (
    INSERT INTO "RecordingEditions" ("recordingId", "editionId", "notes")
    SELECT 
        r."recordingId",
        tsei.editionId,
        'Imported from CSV on ' || CURRENT_DATE
    FROM 
        "Recordings" r
    JOIN 
        temp_song_edition_ids tsei ON r."songId" = tsei.songId
    ON CONFLICT ("recordingId", "editionId") DO NOTHING
    RETURNING *
)
SELECT COUNT(*) AS "Records Inserted" FROM inserted_records;

-- Step 5: Check for songs that couldn't be matched to recordings
SELECT 
    tse.songId AS "Unmatched Song ID",
    tse.edition AS "Edition",
    'Song ID not found in Recordings table' AS "Reason"
FROM 
    temp_song_editions tse
LEFT JOIN
    "Songs" s ON tse.songId = s."songId"
LEFT JOIN
    "Recordings" r ON s."songId" = r."songId"
WHERE
    r."recordingId" IS NULL;

-- Step 6: Show a summary of editions and their recording counts
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

-- Step 7: Clean up temporary tables
DROP TABLE temp_song_editions;
DROP TABLE temp_song_edition_ids;

-- Step 8: Final confirmation
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully at %', NOW();
    RAISE NOTICE 'Total editions in database: %', (SELECT COUNT(*) FROM "Editions");
    RAISE NOTICE 'Total recording-edition assignments: %', (SELECT COUNT(*) FROM "RecordingEditions");
END $$;

-- Commit the transaction
COMMIT;
