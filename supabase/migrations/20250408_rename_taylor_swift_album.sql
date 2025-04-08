-- Migration: Rename Taylor Swift's debut album from "Taylor Swift" to "Debut"
-- This change reflects the common fan terminology for her first album

UPDATE "Albums"
SET "albumTitle" = 'Debut'
WHERE "albumId" = 'ALBUM_TS';
