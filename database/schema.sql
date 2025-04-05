-- Music Ranker Database Schema
-- Based on previous project structure but optimized for Music Ranker app

-- Create necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Profiles table (for user data)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "Users can view their own profile" 
  on public.profiles 
  for select 
  using (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles 
  for update 
  using (auth.uid() = id);

-- Artists table
create table if not exists public.artists (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  genre text,
  description text,
  image_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS on artists
alter table public.artists enable row level security;

-- RLS policies for artists
create policy "Artists are viewable by everyone" 
  on public.artists 
  for select 
  to authenticated, anon
  using (true);

create policy "Artists are insertable by authenticated users" 
  on public.artists 
  for insert 
  to authenticated
  with check (true);

-- Songs table
create table if not exists public.songs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  artist_id uuid references public.artists(id) on delete cascade,
  album text,
  release_year integer,
  genre text,
  duration integer, -- in seconds
  image_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS on songs
alter table public.songs enable row level security;

-- RLS policies for songs
create policy "Songs are viewable by everyone" 
  on public.songs 
  for select 
  to authenticated, anon
  using (true);

create policy "Songs are insertable by authenticated users" 
  on public.songs 
  for insert 
  to authenticated
  with check (true);

-- User song ratings table
create table if not exists public.user_song_ratings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  song_id uuid references public.songs(id) on delete cascade not null,
  rating decimal(3,1) not null check (rating >= 0 and rating <= 5),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique(user_id, song_id)
);

-- Enable RLS on user_song_ratings
alter table public.user_song_ratings enable row level security;

-- RLS policies for user_song_ratings
create policy "Users can view their own ratings" 
  on public.user_song_ratings 
  for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own ratings" 
  on public.user_song_ratings 
  for insert 
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own ratings" 
  on public.user_song_ratings 
  for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own ratings" 
  on public.user_song_ratings 
  for delete 
  using (auth.uid() = user_id);

-- User playlists table
create table if not exists public.playlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  is_public boolean default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS on playlists
alter table public.playlists enable row level security;

-- RLS policies for playlists
create policy "Users can view their own playlists" 
  on public.playlists 
  for select 
  using (auth.uid() = user_id);

create policy "Public playlists are viewable by everyone" 
  on public.playlists 
  for select 
  using (is_public = true);

create policy "Users can insert their own playlists" 
  on public.playlists 
  for insert 
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own playlists" 
  on public.playlists 
  for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own playlists" 
  on public.playlists 
  for delete 
  using (auth.uid() = user_id);

-- Playlist songs junction table
create table if not exists public.playlist_songs (
  id uuid default uuid_generate_v4() primary key,
  playlist_id uuid references public.playlists(id) on delete cascade not null,
  song_id uuid references public.songs(id) on delete cascade not null,
  position integer not null,
  created_at timestamp with time zone default now() not null,
  unique(playlist_id, song_id)
);

-- Enable RLS on playlist_songs
alter table public.playlist_songs enable row level security;

-- RLS policies for playlist_songs
create policy "Users can view songs in their playlists" 
  on public.playlist_songs 
  for select 
  using (
    playlist_id in (
      select id from public.playlists where user_id = auth.uid()
    )
  );

create policy "Users can view songs in public playlists" 
  on public.playlist_songs 
  for select 
  using (
    playlist_id in (
      select id from public.playlists where is_public = true
    )
  );

create policy "Users can insert songs to their playlists" 
  on public.playlist_songs 
  for insert 
  to authenticated
  with check (
    playlist_id in (
      select id from public.playlists where user_id = auth.uid()
    )
  );

create policy "Users can update songs in their playlists" 
  on public.playlist_songs 
  for update 
  using (
    playlist_id in (
      select id from public.playlists where user_id = auth.uid()
    )
  );

create policy "Users can delete songs from their playlists" 
  on public.playlist_songs 
  for delete 
  using (
    playlist_id in (
      select id from public.playlists where user_id = auth.uid()
    )
  );

-- Create a function to handle new user registration
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to call the function when a new user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
