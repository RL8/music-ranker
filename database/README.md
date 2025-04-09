# Supabase Setup for Music Ranker

This guide will help you set up a new Supabase project for the Music Ranker application while leveraging the database schema from your previous project.

## Creating a New Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in to your account
2. Click "New Project"
3. Enter a name for your project (e.g., "music-ranker")
4. Choose an organization
5. Set a secure database password (save this somewhere safe)
6. Choose a region close to your users
7. Click "Create new project"

## Setting Up the Database Schema

After your project is created, you'll need to set up the database schema:

1. In the Supabase dashboard, navigate to the "SQL Editor" section
2. Create a new query
3. Copy and paste the contents of the `schema.sql` file from this directory
4. Run the query to create all the necessary tables and security policies

## Configuring Your Application

1. In the Supabase dashboard, go to "Settings" > "API"
2. Copy your "Project URL" and "anon" public API key
3. Create a `.env` file in the root of your project (based on `.env.example`)
4. Add your Supabase credentials:

```
VUE_APP_SUPABASE_URL=your_project_url
VUE_APP_SUPABASE_ANON_KEY=your_anon_key
```

## Testing the Connection

To verify that your application can connect to Supabase:

1. Start your development server with `yarn serve`
2. Open your browser's developer console
3. You should not see any Supabase connection errors

## Database Structure

The Music Ranker database includes the following tables:

- `profiles`: User profile information
- `artists`: Music artists
- `songs`: Individual songs with artist references
- `user_song_ratings`: User ratings for songs
- `playlists`: User-created playlists
- `playlist_songs`: Junction table for songs in playlists

### Schema Expansion (Vue 3 Migration)

The `schema-expansion.sql` file contains additional tables and columns needed for the Vue 3 version of the application:

- Extended `profiles` table with bio and profile image fields
- `user_album_rankings`: For storing user album tier rankings
- `user_song_rankings`: For storing user song tier rankings within album contexts
- `user_premium_status`: For tracking premium subscription status
- `ranking_history`: For maintaining historical snapshots of rankings

To apply these changes:

1. **IMPORTANT**: Back up your database first
2. In the Supabase dashboard, navigate to the "SQL Editor" section
3. Create a new query
4. Copy and paste the contents of the `schema-expansion.sql` file
5. Review the changes carefully before running the query

Each table has appropriate Row Level Security (RLS) policies to ensure data privacy and security.

## Next Steps

After setting up Supabase, you can:

1. Add some initial data for testing
2. Implement authentication in your application
3. Start building features that use the database

For more information on using Supabase with Vue.js, refer to the [Supabase Vue.js documentation](https://supabase.com/docs/guides/with-vue-3).
