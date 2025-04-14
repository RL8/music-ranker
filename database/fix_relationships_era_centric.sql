-- Fix Database Relationships for Music Ranker (Era-Centric Approach)
-- This script adds the necessary foreign key relationships and enhancements for era-centric approach

-- Begin transaction for safety
BEGIN;

-- Report start of operation
DO $$
BEGIN
  RAISE NOTICE '=== Adding Foreign Key Relationships and Era-Centric Enhancements ===';
END $$;

-- 1. Add relationship between Recordings and Albums
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'recordings_albumid_fkey' 
    AND table_name = 'Recordings'
  ) THEN
    RAISE NOTICE 'Adding foreign key relationship: Recordings.albumId -> Albums.albumId';
    
    ALTER TABLE "Recordings"
    ADD CONSTRAINT "recordings_albumid_fkey" 
    FOREIGN KEY ("albumId") 
    REFERENCES "Albums"("albumId");
  ELSE
    RAISE NOTICE 'Relationship already exists: Recordings.albumId -> Albums.albumId';
  END IF;
END $$;

-- 2. Add relationship between Recordings and Songs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'recordings_songid_fkey' 
    AND table_name = 'Recordings'
  ) THEN
    RAISE NOTICE 'Adding foreign key relationship: Recordings.songId -> Songs.songId';
    
    ALTER TABLE "Recordings"
    ADD CONSTRAINT "recordings_songid_fkey" 
    FOREIGN KEY ("songId") 
    REFERENCES "UniqueSongs"("songId");
  ELSE
    RAISE NOTICE 'Relationship already exists: Recordings.songId -> Songs.songId';
  END IF;
END $$;

-- 3. Add relationship between Albums and Eras
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'albums_eraid_fkey' 
    AND table_name = 'Albums'
  ) THEN
    RAISE NOTICE 'Adding foreign key relationship: Albums.eraId -> Eras.eraId';
    
    ALTER TABLE "Albums"
    ADD CONSTRAINT "albums_eraid_fkey" 
    FOREIGN KEY ("eraId") 
    REFERENCES "Eras"("eraId");
  ELSE
    RAISE NOTICE 'Relationship already exists: Albums.eraId -> Eras.eraId';
  END IF;
END $$;

-- 4. Add relationship between RecordingEditions and Recordings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'recordingeditions_recordingid_fkey' 
    AND table_name = 'RecordingEditions'
  ) THEN
    RAISE NOTICE 'Adding foreign key relationship: RecordingEditions.recordingId -> Recordings.recordingId';
    
    ALTER TABLE "RecordingEditions"
    ADD CONSTRAINT "recordingeditions_recordingid_fkey" 
    FOREIGN KEY ("recordingId") 
    REFERENCES "Recordings"("recordingId");
  ELSE
    RAISE NOTICE 'Relationship already exists: RecordingEditions.recordingId -> Recordings.recordingId';
  END IF;
END $$;

-- 5. Add relationship between RecordingEditions and Editions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'recordingeditions_editionid_fkey' 
    AND table_name = 'RecordingEditions'
  ) THEN
    RAISE NOTICE 'Adding foreign key relationship: RecordingEditions.editionId -> Editions.editionId';
    
    ALTER TABLE "RecordingEditions"
    ADD CONSTRAINT "recordingeditions_editionid_fkey" 
    FOREIGN KEY ("editionId") 
    REFERENCES "Editions"("editionId");
  ELSE
    RAISE NOTICE 'Relationship already exists: RecordingEditions.editionId -> Editions.editionId';
  END IF;
END $$;

-- 6. Add missing duration column to user_song_rankings if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_song_rankings' 
    AND column_name = 'duration'
  ) THEN
    RAISE NOTICE 'Adding duration column to user_song_rankings table';
    
    ALTER TABLE "user_song_rankings"
    ADD COLUMN "duration" integer;
  ELSE
    RAISE NOTICE 'Duration column already exists in user_song_rankings';
  END IF;
END $$;

-- 7. Add era_context_id column to user_song_rankings if needed (for era-centric approach)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_song_rankings' 
    AND column_name = 'era_context_id'
  ) THEN
    RAISE NOTICE 'Adding era_context_id column to user_song_rankings table';
    
    ALTER TABLE "user_song_rankings"
    ADD COLUMN "era_context_id" text REFERENCES "Eras"("eraId");
  ELSE
    RAISE NOTICE 'era_context_id column already exists in user_song_rankings';
  END IF;
END $$;

-- 8. Add index on UniqueSongs.originalEraId for better performance with era-centric queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE tablename = 'UniqueSongs' 
    AND indexname = 'idx_uniquesongs_originaleraid'
  ) THEN
    RAISE NOTICE 'Adding index on UniqueSongs.originalEraId';
    
    CREATE INDEX "idx_uniquesongs_originaleraid" 
    ON "UniqueSongs"("originalEraId");
  ELSE
    RAISE NOTICE 'Index on UniqueSongs.originalEraId already exists';
  END IF;
END $$;

-- 9. Create or replace SongsByEra view for era-centric song grouping
DO $$
BEGIN
  RAISE NOTICE 'Creating SongsByEra view';
  
  DROP VIEW IF EXISTS "SongsByEra";
  
  CREATE VIEW "SongsByEra" AS
  SELECT 
    s."songId",
    s."canonicalTitle",
    s."originalEraId",
    s."notes",
    e."eraName",
    e."eraStartDate",
    e."primaryAlbumId"
  FROM 
    "UniqueSongs" s
  JOIN 
    "Eras" e ON s."originalEraId" = e."eraId"
  ORDER BY 
    e."eraStartDate", s."canonicalTitle";
END $$;

-- 10. Create or replace AlbumsByEra view for era-centric album grouping
DO $$
BEGIN
  RAISE NOTICE 'Creating AlbumsByEra view';
  
  DROP VIEW IF EXISTS "AlbumsByEra";
  
  CREATE VIEW "AlbumsByEra" AS
  SELECT 
    a."albumId",
    a."albumTitle",
    a."releaseDate",
    a."albumType",
    a."eraId",
    e."eraName",
    e."eraStartDate",
    e."primaryAlbumId",
    (a."albumId" = e."primaryAlbumId") AS "isPrimaryAlbum"
  FROM 
    "Albums" a
  JOIN 
    "Eras" e ON a."eraId" = e."eraId"
  ORDER BY 
    e."eraStartDate", a."releaseDate";
END $$;

-- Verify the relationships were added
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
  JOIN information_schema.constraint_column_usage AS ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE 
  tc.constraint_type = 'FOREIGN KEY' AND 
  tc.table_name IN ('Recordings', 'Albums', 'RecordingEditions', 'user_song_rankings')
ORDER BY 
  tc.table_name, kcu.column_name;

-- Final confirmation
DO $$
BEGIN
  RAISE NOTICE 'Foreign key relationships and era-centric enhancements have been added successfully!';
END $$;

COMMIT;
