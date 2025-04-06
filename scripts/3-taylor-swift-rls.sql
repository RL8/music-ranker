-- Part 3: Set up Row Level Security policies for Taylor Swift tables

-- Enable RLS on all tables
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
