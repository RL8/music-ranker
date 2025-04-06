-- Part 1: Create basic tables for Taylor Swift Schema

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the albums table
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

-- Create the songs table (now only contains unique songs)
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

-- Create ratings table
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
