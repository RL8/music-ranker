-- Create ranking-related tables for the Music Ranker application
-- These tables store user rankings and history

-- Transaction block for atomicity
BEGIN;

-- Report start of operation
DO $$
BEGIN
  RAISE NOTICE 'Creating ranking tables for Music Ranker application...';
END $$;

-- User Album Rankings table
CREATE TABLE IF NOT EXISTS public."user_album_rankings" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" text NOT NULL,
  "album_id" text NOT NULL,
  "tier" text NOT NULL,
  "rank_in_tier" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "unique_user_album_ranking" UNIQUE ("user_id", "album_id")
);

-- Report album rankings table creation
DO $$
BEGIN
  RAISE NOTICE 'Created user_album_rankings table';
END $$;

-- User Song Rankings table
CREATE TABLE IF NOT EXISTS public."user_song_rankings" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" text NOT NULL,
  "song_id" text NOT NULL,
  "album_context_id" text,
  "tier" text NOT NULL,
  "rank_in_tier" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "unique_user_song_ranking" UNIQUE ("user_id", "song_id", "album_context_id")
);

-- Report song rankings table creation
DO $$
BEGIN
  RAISE NOTICE 'Created user_song_rankings table';
END $$;

-- Ranking History table
CREATE TABLE IF NOT EXISTS public."ranking_history" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" text NOT NULL,
  "ranking_type" text NOT NULL,
  "rankings_snapshot" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);

-- Report history table creation
DO $$
BEGIN
  RAISE NOTICE 'Created ranking_history table';
END $$;

-- Create Songs table if it doesn't exist (it should already exist but verification showed it missing)
CREATE TABLE IF NOT EXISTS public."Songs" (
  "songId" text PRIMARY KEY,
  "canonicalTitle" text NOT NULL,
  "originalEraId" text REFERENCES public."Eras"("eraId"),
  "notes" text
);

-- Report Songs table creation or verification
DO $$
BEGIN
  RAISE NOTICE 'Verified Songs table exists';
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_user_album_rankings_user_id" ON public."user_album_rankings" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_song_rankings_user_id" ON public."user_song_rankings" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_user_song_rankings_album_context" ON public."user_song_rankings" ("album_context_id");
CREATE INDEX IF NOT EXISTS "idx_ranking_history_user_id" ON public."ranking_history" ("user_id");

-- Report index creation
DO $$
BEGIN
  RAISE NOTICE 'Created performance indexes';
END $$;

-- Validation queries to show table structure
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM 
  information_schema.columns 
WHERE 
  table_name IN ('user_album_rankings', 'user_song_rankings', 'ranking_history')
  AND table_schema = 'public'
ORDER BY 
  table_name, ordinal_position;

-- Final confirmation
DO $$
BEGIN
  RAISE NOTICE 'Ranking tables setup complete!';
END $$;

COMMIT;
