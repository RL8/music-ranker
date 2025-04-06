-- Part 2: Create indexes for Taylor Swift Schema

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_album_era ON taylor_swift_albums(era);
CREATE INDEX IF NOT EXISTS idx_song_title ON taylor_swift_songs(title);
CREATE INDEX IF NOT EXISTS idx_song_appearance_song_id ON taylor_swift_song_appearances(song_id);
CREATE INDEX IF NOT EXISTS idx_song_appearance_album_id ON taylor_swift_song_appearances(album_id);
