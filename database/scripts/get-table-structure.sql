-- SQL queries to examine table structures in Supabase

-- Get column information for all tables in the public schema
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name IN ('Albums', 'Artists', 'Eras', 'Recordings', 'Songs')
ORDER BY 
    table_name,
    ordinal_position;

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
