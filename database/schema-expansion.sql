-- Schema Expansion for Music Ranker App
-- This script adds the necessary tables and columns to support the new features
-- IMPORTANT: BACK UP YOUR DATABASE BEFORE RUNNING THIS SCRIPT

-- 1. Extend Profiles Table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- 2. Create Album Ranking Table
CREATE TABLE IF NOT EXISTS public.user_album_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES public.taylor_swift_albums(id) ON DELETE CASCADE, -- Assuming taylor_swift_albums exists
  tier INTEGER NOT NULL CHECK (tier >= 1 AND tier <= 5),
  rank_in_tier INTEGER NOT NULL, -- Position within the tier (1, 2, or 3)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, album_id), -- User can rank an album only once
  UNIQUE(user_id, tier, rank_in_tier) -- Only one album per rank slot per user
);
ALTER TABLE public.user_album_rankings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own album rankings" ON public.user_album_rankings
  FOR ALL USING (auth.uid() = user_id);

-- 3. Create Song Ranking Table
CREATE TABLE IF NOT EXISTS public.user_song_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.taylor_swift_songs(id) ON DELETE CASCADE, -- Assuming taylor_swift_songs exists
  -- Optional: Include album_appearance_id if ranking specific versions
  -- album_appearance_id UUID REFERENCES public.taylor_swift_song_appearances(id) ON DELETE CASCADE,
  album_context_id UUID NOT NULL REFERENCES public.taylor_swift_albums(id) ON DELETE CASCADE, -- Which album's list is this ranking for?
  tier INTEGER NOT NULL CHECK (tier >= 1),
  rank_in_tier INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, song_id, album_context_id) -- User ranks a song once per album context
  -- Add constraint for rank_in_tier if needed based on tier structure
);
ALTER TABLE public.user_song_rankings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own song rankings" ON public.user_song_rankings
  FOR ALL USING (auth.uid() = user_id);

-- 4. Create Premium Status Table
CREATE TABLE IF NOT EXISTS public.user_premium_status (
   user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
   is_premium BOOLEAN DEFAULT FALSE NOT NULL,
   subscription_type TEXT, -- e.g., 'annual', 'lifetime_1989'
   expires_at TIMESTAMPTZ,
   stripe_customer_id TEXT, -- Store Stripe Customer ID
   updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.user_premium_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own premium status" ON public.user_premium_status
   FOR SELECT USING (auth.uid() = user_id);
-- Add policies for service role updates via webhooks

-- 5. Create Ranking History Table
CREATE TABLE IF NOT EXISTS public.ranking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_timestamp TIMESTAMPTZ DEFAULT NOW(),
  ranking_type TEXT NOT NULL, -- 'album' or 'song'
  -- Store snapshot of rankings as JSONB
  rankings_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.ranking_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own ranking history" ON public.ranking_history
  FOR SELECT USING (auth.uid() = user_id);
-- Premium users might have different SELECT policies

-- Add necessary INDEXES for performance on foreign keys and frequently queried columns
CREATE INDEX IF NOT EXISTS idx_user_album_rankings_user_id ON public.user_album_rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_song_rankings_user_id ON public.user_song_rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_album_rankings_album_id ON public.user_album_rankings(album_id);
CREATE INDEX IF NOT EXISTS idx_user_song_rankings_song_id ON public.user_song_rankings(song_id);
CREATE INDEX IF NOT EXISTS idx_user_song_rankings_album_context_id ON public.user_song_rankings(album_context_id);
CREATE INDEX IF NOT EXISTS idx_ranking_history_user_id ON public.ranking_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ranking_history_ranking_type ON public.ranking_history(ranking_type);

-- Add triggers to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_album_rankings_updated_at
BEFORE UPDATE ON public.user_album_rankings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_song_rankings_updated_at
BEFORE UPDATE ON public.user_song_rankings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_premium_status_updated_at
BEFORE UPDATE ON public.user_premium_status
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
