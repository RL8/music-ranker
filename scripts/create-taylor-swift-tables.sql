-- SQL script to create Taylor Swift tables in Supabase
-- Execute this in the Supabase SQL Editor before running the migration script

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create taylor_swift_albums table
CREATE TABLE IF NOT EXISTS taylor_swift_albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  first_release_date DATE,
  album_types TEXT[] DEFAULT '{}',
  secondary_types TEXT[] DEFAULT '{}',
  era TEXT,
  is_taylors_version BOOLEAN DEFAULT FALSE,
  artwork_url TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries by era
CREATE INDEX IF NOT EXISTS idx_taylor_swift_albums_era ON taylor_swift_albums(era);

-- Create taylor_swift_songs table
CREATE TABLE IF NOT EXISTS taylor_swift_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  canonical_album_id UUID,
  length_ms INTEGER,
  is_taylors_version BOOLEAN DEFAULT FALSE,
  is_from_vault BOOLEAN DEFAULT FALSE,
  lyrics TEXT,
  songwriter_credits TEXT[],
  production_credits TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_canonical_album
    FOREIGN KEY(canonical_album_id)
    REFERENCES taylor_swift_albums(id)
    ON DELETE SET NULL
);

-- Create a junction table for song appearances on albums
CREATE TABLE IF NOT EXISTS taylor_swift_song_appearances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL,
  album_id UUID NOT NULL,
  position INTEGER,
  disc_number INTEGER DEFAULT 1,
  is_bonus_track BOOLEAN DEFAULT FALSE,
  is_deluxe_edition BOOLEAN DEFAULT FALSE,
  version_type TEXT, -- 'studio', 'live', 'acoustic', 'remix', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_song
    FOREIGN KEY(song_id)
    REFERENCES taylor_swift_songs(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_album
    FOREIGN KEY(album_id)
    REFERENCES taylor_swift_albums(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_song_album_position
    UNIQUE(album_id, position, disc_number)
);

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_album_era ON taylor_swift_albums(era);
CREATE INDEX IF NOT EXISTS idx_song_title ON taylor_swift_songs(title);
CREATE INDEX IF NOT EXISTS idx_song_appearance_song_id ON taylor_swift_song_appearances(song_id);
CREATE INDEX IF NOT EXISTS idx_song_appearance_album_id ON taylor_swift_song_appearances(album_id);

-- Create table for user ratings of songs
CREATE TABLE IF NOT EXISTS taylor_swift_song_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  song_id UUID NOT NULL,
  album_id UUID,  -- Optional, can rate song in context of specific album
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_song
    FOREIGN KEY(song_id)
    REFERENCES taylor_swift_songs(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_album
    FOREIGN KEY(album_id)
    REFERENCES taylor_swift_albums(id)
    ON DELETE SET NULL,
  CONSTRAINT unique_user_song_rating
    UNIQUE(user_id, song_id, album_id)
);

-- Add Supabase RLS (Row Level Security) policies
-- For now, we'll allow public read access but restrict write access
ALTER TABLE taylor_swift_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE taylor_swift_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE taylor_swift_song_appearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE taylor_swift_song_ratings ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access for albums" 
  ON taylor_swift_albums FOR SELECT USING (true);

CREATE POLICY "Public read access for songs" 
  ON taylor_swift_songs FOR SELECT USING (true);
  
CREATE POLICY "Public read access for song appearances" 
  ON taylor_swift_song_appearances FOR SELECT USING (true);

-- Rating policies
CREATE POLICY "Public read access for ratings" 
  ON taylor_swift_song_ratings FOR SELECT USING (true);

CREATE POLICY "Users can create their own ratings" 
  ON taylor_swift_song_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
  ON taylor_swift_song_ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
  ON taylor_swift_song_ratings FOR DELETE USING (auth.uid() = user_id);

-- Optionally, you can enable write access for admins or other roles
-- For example:
-- CREATE POLICY "Admins can modify album data" 
--   ON taylor_swift_albums FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- Helper functions
-- Function to get all songs for an album
CREATE OR REPLACE FUNCTION get_album_songs(album_uuid UUID)
RETURNS TABLE (
  song_id UUID,
  song_title TEXT,
  position INTEGER,
  disc_number INTEGER,
  length_ms INTEGER,
  is_taylors_version BOOLEAN,
  is_bonus_track BOOLEAN,
  version_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS song_id,
    s.title AS song_title,
    sa.position,
    sa.disc_number,
    s.length_ms,
    s.is_taylors_version,
    sa.is_bonus_track,
    sa.version_type
  FROM
    taylor_swift_songs s
  JOIN
    taylor_swift_song_appearances sa ON s.id = sa.song_id
  WHERE
    sa.album_id = album_uuid
  ORDER BY
    sa.disc_number, sa.position;
END;
$$ LANGUAGE plpgsql;

-- Function to get songs that appear on multiple albums
CREATE OR REPLACE FUNCTION get_songs_on_multiple_albums(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  song_id UUID,
  song_title TEXT,
  appearance_count BIGINT,
  albums JSON
) AS $$
BEGIN
  RETURN QUERY
  WITH song_counts AS (
    SELECT
      s.id,
      s.title,
      COUNT(sa.album_id) AS album_count
    FROM
      taylor_swift_songs s
    JOIN
      taylor_swift_song_appearances sa ON s.id = sa.song_id
    GROUP BY
      s.id, s.title
    HAVING
      COUNT(sa.album_id) > 1
    ORDER BY
      COUNT(sa.album_id) DESC
    LIMIT limit_count
  ),
  album_appearances AS (
    SELECT
      sc.id AS song_id,
      sc.title AS song_title,
      sc.album_count,
      json_agg(
        json_build_object(
          'album_id', a.id,
          'album_title', a.title,
          'position', sa.position,
          'disc_number', sa.disc_number,
          'version_type', sa.version_type
        )
      ) AS albums
    FROM
      song_counts sc
    JOIN
      taylor_swift_song_appearances sa ON sc.id = sa.song_id
    JOIN
      taylor_swift_albums a ON sa.album_id = a.id
    GROUP BY
      sc.id, sc.title, sc.album_count
  )
  SELECT
    aa.song_id,
    aa.song_title,
    aa.album_count AS appearance_count,
    aa.albums
  FROM
    album_appearances aa
  ORDER BY
    aa.album_count DESC;
END;
$$ LANGUAGE plpgsql;
