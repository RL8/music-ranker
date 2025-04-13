-- Music Ranker Current Database Schema
-- Generated on 13 Apr 2025

-- Create Albums table
CREATE TABLE IF NOT EXISTS public."Albums" (
  "albumId" text PRIMARY KEY,
  "albumTitle" text,
  "releaseDate" text,
  "albumType" text,
  "eraId" text
);

-- Create Artists table
CREATE TABLE IF NOT EXISTS public."Artists" (
  "artistId" text,
  "artistName" text
);

-- Create Eras table
CREATE TABLE IF NOT EXISTS public."Eras" (
  "eraId" text,
  "eraName" text,
  "primaryAlbumId" text,
  "eraStartDate" text
);

-- Create Recordings table
CREATE TABLE IF NOT EXISTS public."Recordings" (
  "recordingId" text PRIMARY KEY,
  "recordingTitle" text,
  "songId" text,
  "albumId" text,
  "discNumber" bigint,
  "trackNumber" bigint,
  "versionType" text,
  "artistsJson" jsonb,
  "notes" text
);

-- Create Songs table
CREATE TABLE IF NOT EXISTS public."Songs" (
  "songId" text PRIMARY KEY,
  "canonicalTitle" text,
  "originalEraId" text,
  "notes" text
);

-- Add foreign key constraints
ALTER TABLE public."Albums" 
  ADD CONSTRAINT fk_album_era FOREIGN KEY ("eraId") REFERENCES public."Eras"("eraId");

ALTER TABLE public."Eras" 
  ADD CONSTRAINT fk_era_primary_album FOREIGN KEY ("primaryAlbumId") REFERENCES public."Albums"("albumId");

ALTER TABLE public."Recordings" 
  ADD CONSTRAINT fk_recording_song FOREIGN KEY ("songId") REFERENCES public."Songs"("songId"),
  ADD CONSTRAINT fk_recording_album FOREIGN KEY ("albumId") REFERENCES public."Albums"("albumId");

ALTER TABLE public."Songs" 
  ADD CONSTRAINT fk_song_original_era FOREIGN KEY ("originalEraId") REFERENCES public."Eras"("eraId");

-- Note: The actual database may not have these foreign key constraints explicitly defined,
-- but they represent the logical relationships between tables.
