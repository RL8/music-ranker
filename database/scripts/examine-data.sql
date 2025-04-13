-- SQL queries to examine existing data in Supabase tables

-- Count records in each table
SELECT 'Albums' as table_name, COUNT(*) as record_count FROM "Albums"
UNION ALL
SELECT 'Artists', COUNT(*) FROM "Artists"
UNION ALL
SELECT 'Eras', COUNT(*) FROM "Eras"
UNION ALL
SELECT 'Recordings', COUNT(*) FROM "Recordings"
UNION ALL
SELECT 'Songs', COUNT(*) FROM "Songs"
ORDER BY table_name;

-- Examine Albums table data
SELECT * FROM "Albums" LIMIT 10;

-- Examine Artists table data
SELECT * FROM "Artists" LIMIT 10;

-- Examine Eras table data
SELECT * FROM "Eras" LIMIT 10;

-- Examine Recordings table data
SELECT * FROM "Recordings" LIMIT 10;

-- Examine Songs table data
SELECT * FROM "Songs" LIMIT 10;

-- Check for relationships between tables
-- Albums to Songs relationship (via Recordings)
SELECT a."albumTitle" as album_title, COUNT(r."recordingId") as recording_count
FROM "Albums" a
LEFT JOIN "Recordings" r ON r."albumId" = a."albumId"
GROUP BY a."albumTitle"
ORDER BY a."albumTitle"
LIMIT 10;

-- Artists to Albums relationship (via artistsJson in Recordings)
SELECT ar."artistName" as artist_name, COUNT(DISTINCT r."albumId") as album_count
FROM "Artists" ar
LEFT JOIN "Recordings" r ON r."artistsJson"::text LIKE '%' || ar."artistId" || '%'
GROUP BY ar."artistName"
ORDER BY ar."artistName"
LIMIT 10;

-- Check table schemas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'Albums'
ORDER BY ordinal_position;

-- Find most recent additions (if created_at exists)
SELECT * FROM "Albums" 
WHERE EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Albums' AND column_name = 'created_at'
)
ORDER BY "created_at" DESC NULLS LAST 
LIMIT 5;

-- Check for any constraints or foreign keys
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public';
