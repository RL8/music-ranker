-- Function to get editions by era
-- This function returns a list of editions associated with each era through song recordings

-- Begin transaction for safety
BEGIN;

DO $$
BEGIN
  RAISE NOTICE '=== Creating get_editions_by_era function ===';
END $$;

-- Drop the function if it already exists
DROP FUNCTION IF EXISTS get_editions_by_era();

-- Create the function
CREATE OR REPLACE FUNCTION get_editions_by_era()
RETURNS TABLE (
  era_id TEXT,
  era_name TEXT,
  edition_id TEXT,
  edition_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e."eraId"::TEXT AS era_id,
    e."eraName"::TEXT AS era_name,
    ed."editionId"::TEXT AS edition_id,
    ed."editionName"::TEXT AS edition_name
  FROM 
    "Eras" e
  JOIN 
    "UniqueSongs" s ON e."eraId" = s."originalEraId"
  JOIN 
    "Recordings" r ON s."songId" = r."songId"
  JOIN 
    "RecordingEditions" re ON r."recordingId" = re."recordingId"
  JOIN 
    "Editions" ed ON re."editionId" = ed."editionId"
  GROUP BY 
    e."eraId", e."eraName", ed."editionId", ed."editionName"
  ORDER BY 
    e."eraName", ed."editionName";
END;
$$ LANGUAGE plpgsql;

-- Test the function
SELECT * FROM get_editions_by_era() LIMIT 5;

-- Show count of editions by era
SELECT 
  era_id,
  era_name,
  COUNT(DISTINCT edition_id) AS edition_count
FROM 
  get_editions_by_era()
GROUP BY 
  era_id, era_name
ORDER BY 
  edition_count DESC;

COMMIT;
