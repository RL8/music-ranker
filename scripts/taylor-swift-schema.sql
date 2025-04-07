-- Taylor Swift Database Schema
-- This script creates a comprehensive schema for Taylor Swift's music data
-- with support for songs appearing on multiple albums

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS taylor_swift_song_ratings;
DROP TABLE IF EXISTS taylor_swift_song_appearances;
DROP TABLE IF EXISTS taylor_swift_songs;
DROP TABLE IF EXISTS taylor_swift_albums;

-- Create albums table
CREATE TABLE taylor_swift_albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  era TEXT NOT NULL,
  release_date DATE NOT NULL,
  is_taylors_version BOOLEAN DEFAULT FALSE,
  cover_image_url TEXT,
  spotify_id TEXT,
  total_tracks INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create songs table
CREATE TABLE taylor_swift_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  duration_ms INTEGER,
  explicit BOOLEAN DEFAULT FALSE,
  spotify_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for song appearances on albums
CREATE TABLE taylor_swift_song_appearances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL REFERENCES taylor_swift_songs(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES taylor_swift_albums(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  disc_number INTEGER DEFAULT 1,
  version_type TEXT DEFAULT 'studio', -- studio, live, acoustic, demo, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure a song can only appear once in a specific position on an album
  UNIQUE(album_id, disc_number, position)
);

-- Create song ratings table
CREATE TABLE taylor_swift_song_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  song_id UUID NOT NULL REFERENCES taylor_swift_songs(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure a user can only rate a song once
  UNIQUE(user_id, song_id)
);

-- Create indexes for performance
CREATE INDEX idx_taylor_swift_albums_era ON taylor_swift_albums(era);
CREATE INDEX idx_taylor_swift_albums_release_date ON taylor_swift_albums(release_date);
CREATE INDEX idx_taylor_swift_songs_title ON taylor_swift_songs(title);
CREATE INDEX idx_taylor_swift_song_appearances_song_id ON taylor_swift_song_appearances(song_id);
CREATE INDEX idx_taylor_swift_song_appearances_album_id ON taylor_swift_song_appearances(album_id);
CREATE INDEX idx_taylor_swift_song_ratings_song_id ON taylor_swift_song_ratings(song_id);
CREATE INDEX idx_taylor_swift_song_ratings_user_id ON taylor_swift_song_ratings(user_id);

-- Create function to get songs that appear on multiple albums
CREATE OR REPLACE FUNCTION get_songs_on_multiple_albums(limit_count INTEGER DEFAULT 100)
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
      s.id AS song_id,
      s.title AS song_title,
      COUNT(sa.album_id) AS appearance_count
    FROM taylor_swift_songs s
    JOIN taylor_swift_song_appearances sa ON s.id = sa.song_id
    GROUP BY s.id, s.title
    HAVING COUNT(sa.album_id) > 1
    ORDER BY COUNT(sa.album_id) DESC, s.title
    LIMIT limit_count
  ),
  album_appearances AS (
    SELECT
      sc.song_id,
      sc.song_title,
      sc.appearance_count,
      json_agg(
        json_build_object(
          'album_id', a.id,
          'album_title', a.title,
          'era', a.era,
          'release_date', a.release_date,
          'position', sa.position,
          'disc_number', sa.disc_number,
          'version_type', sa.version_type
        ) ORDER BY a.release_date
      ) AS albums
    FROM song_counts sc
    JOIN taylor_swift_song_appearances sa ON sc.song_id = sa.song_id
    JOIN taylor_swift_albums a ON sa.album_id = a.id
    GROUP BY sc.song_id, sc.song_title, sc.appearance_count
  )
  SELECT * FROM album_appearances
  ORDER BY appearance_count DESC, song_title;
END;
$$ LANGUAGE plpgsql;

-- Create function to get album songs with their details
CREATE OR REPLACE FUNCTION get_album_songs_with_details(album_id_param UUID)
RETURNS TABLE (
  song_id UUID,
  song_title TEXT,
  duration_ms INTEGER,
  explicit BOOLEAN,
  position INTEGER,
  disc_number INTEGER,
  version_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS song_id,
    s.title AS song_title,
    s.duration_ms,
    s.explicit,
    sa.position,
    sa.disc_number,
    sa.version_type
  FROM taylor_swift_songs s
  JOIN taylor_swift_song_appearances sa ON s.id = sa.song_id
  WHERE sa.album_id = album_id_param
  ORDER BY sa.disc_number, sa.position;
END;
$$ LANGUAGE plpgsql;

-- Create function to get song appearances across albums
CREATE OR REPLACE FUNCTION get_song_appearances(song_id_param UUID)
RETURNS TABLE (
  album_id UUID,
  album_title TEXT,
  era TEXT,
  release_date DATE,
  position INTEGER,
  disc_number INTEGER,
  version_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id AS album_id,
    a.title AS album_title,
    a.era,
    a.release_date,
    sa.position,
    sa.disc_number,
    sa.version_type
  FROM taylor_swift_albums a
  JOIN taylor_swift_song_appearances sa ON a.id = sa.album_id
  WHERE sa.song_id = song_id_param
  ORDER BY a.release_date, sa.disc_number, sa.position;
END;
$$ LANGUAGE plpgsql;

-- Set up Row Level Security (RLS)
-- Enable RLS on the tables
ALTER TABLE taylor_swift_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE taylor_swift_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE taylor_swift_song_appearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE taylor_swift_song_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to read album and song data
CREATE POLICY "Allow public read access to albums" 
  ON taylor_swift_albums FOR SELECT USING (true);

CREATE POLICY "Allow public read access to songs" 
  ON taylor_swift_songs FOR SELECT USING (true);

CREATE POLICY "Allow public read access to song appearances" 
  ON taylor_swift_song_appearances FOR SELECT USING (true);

-- Create policy for users to manage their own ratings
CREATE POLICY "Users can manage their own ratings" 
  ON taylor_swift_song_ratings 
  USING (auth.uid() = user_id);

-- Create policy for users to read all ratings
CREATE POLICY "Allow public read access to ratings" 
  ON taylor_swift_song_ratings FOR SELECT USING (true);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_taylor_swift_albums_modtime
  BEFORE UPDATE ON taylor_swift_albums
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_taylor_swift_songs_modtime
  BEFORE UPDATE ON taylor_swift_songs
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_taylor_swift_song_appearances_modtime
  BEFORE UPDATE ON taylor_swift_song_appearances
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_taylor_swift_song_ratings_modtime
  BEFORE UPDATE ON taylor_swift_song_ratings
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
