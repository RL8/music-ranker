-- Migration: 001_initial_schema
-- Created: 13 Apr 2025
-- Description: Initial database schema for Music Ranker application

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
