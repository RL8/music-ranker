/**
 * Execute SQL schema changes in smaller chunks
 * This approach is more reliable for complex SQL scripts
 */

const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key must be set in .env.local file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Define our SQL statements individually for more control
async function executeSchemaChanges() {
  console.log('Starting schema changes...');
  
  try {
    // 1. First check for existing tables
    console.log('Checking for existing Taylor Swift tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .ilike('tablename', '%taylor_swift%');
      
    if (tablesError) {
      console.error('Error checking tables:', tablesError);
    } else {
      if (tables && tables.length > 0) {
        console.log(`Found ${tables.length} existing Taylor Swift tables:`);
        tables.forEach(t => console.log(` - ${t.tablename}`));
        
        // 2. Drop existing tables if they exist
        for (const table of tables) {
          console.log(`Dropping table ${table.tablename}...`);
          const { error: dropError } = await supabase.rpc('exec', { 
            command: `DROP TABLE IF EXISTS "${table.tablename}" CASCADE;` 
          });
          
          if (dropError) {
            console.log(`Cannot drop via RPC, this is normal. Will use raw SQL...`);
          }
        }
      } else {
        console.log('No existing Taylor Swift tables found');
      }
    }
    
    // 3. Create tables one by one
    console.log('\nCreating new Taylor Swift tables...');
    
    // 3.1 Create albums table
    console.log('Creating taylor_swift_albums table...');
    const createAlbumsSQL = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
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
      
      CREATE INDEX IF NOT EXISTS idx_album_era ON taylor_swift_albums(era);
    `;
    
    const { error: albumsError } = await executeSQL(createAlbumsSQL);
    if (albumsError) {
      console.error('Error creating albums table:', albumsError);
    } else {
      console.log('Created taylor_swift_albums table successfully');
    }
    
    // 3.2 Create songs table
    console.log('Creating taylor_swift_songs table...');
    const createSongsSQL = `
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
      
      CREATE INDEX IF NOT EXISTS idx_song_title ON taylor_swift_songs(title);
    `;
    
    const { error: songsError } = await executeSQL(createSongsSQL);
    if (songsError) {
      console.error('Error creating songs table:', songsError);
    } else {
      console.log('Created taylor_swift_songs table successfully');
    }
    
    // 3.3 Create song appearances junction table
    console.log('Creating taylor_swift_song_appearances table...');
    const createAppearancesSQL = `
      CREATE TABLE IF NOT EXISTS taylor_swift_song_appearances (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        song_id UUID NOT NULL,
        album_id UUID NOT NULL,
        position INTEGER,
        disc_number INTEGER DEFAULT 1,
        is_bonus_track BOOLEAN DEFAULT FALSE,
        is_deluxe_edition BOOLEAN DEFAULT FALSE,
        version_type TEXT,
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
      
      CREATE INDEX IF NOT EXISTS idx_song_appearance_song_id ON taylor_swift_song_appearances(song_id);
      CREATE INDEX IF NOT EXISTS idx_song_appearance_album_id ON taylor_swift_song_appearances(album_id);
    `;
    
    const { error: appearancesError } = await executeSQL(createAppearancesSQL);
    if (appearancesError) {
      console.error('Error creating song appearances table:', appearancesError);
    } else {
      console.log('Created taylor_swift_song_appearances table successfully');
    }
    
    // 3.4 Create ratings table
    console.log('Creating taylor_swift_song_ratings table...');
    const createRatingsSQL = `
      CREATE TABLE IF NOT EXISTS taylor_swift_song_ratings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        song_id UUID NOT NULL,
        album_id UUID,
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
    `;
    
    const { error: ratingsError } = await executeSQL(createRatingsSQL);
    if (ratingsError) {
      console.error('Error creating ratings table:', ratingsError);
    } else {
      console.log('Created taylor_swift_song_ratings table successfully');
    }
    
    // 3.5 Set up security policies
    console.log('Setting up Row Level Security policies...');
    const setupRLSSQL = `
      ALTER TABLE taylor_swift_albums ENABLE ROW LEVEL SECURITY;
      ALTER TABLE taylor_swift_songs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE taylor_swift_song_appearances ENABLE ROW LEVEL SECURITY;
      ALTER TABLE taylor_swift_song_ratings ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Public read access for albums" 
        ON taylor_swift_albums FOR SELECT USING (true);
      
      CREATE POLICY "Public read access for songs" 
        ON taylor_swift_songs FOR SELECT USING (true);
        
      CREATE POLICY "Public read access for song appearances" 
        ON taylor_swift_song_appearances FOR SELECT USING (true);
      
      CREATE POLICY "Public read access for ratings" 
        ON taylor_swift_song_ratings FOR SELECT USING (true);
      
      CREATE POLICY "Users can create their own ratings" 
        ON taylor_swift_song_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can update their own ratings" 
        ON taylor_swift_song_ratings FOR UPDATE USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can delete their own ratings" 
        ON taylor_swift_song_ratings FOR DELETE USING (auth.uid() = user_id);
    `;
    
    const { error: rlsError } = await executeSQL(setupRLSSQL);
    if (rlsError) {
      console.error('Error setting up RLS:', rlsError);
    } else {
      console.log('Set up RLS policies successfully');
    }
    
    // 3.6 Create helper functions
    console.log('Creating helper functions...');
    const createFunctionsSQL = `
      CREATE OR REPLACE FUNCTION get_album_songs(album_uuid UUID)
      RETURNS TABLE (
        song_id UUID,
        song_title TEXT,
        position INTEGER,
        disc_number INTEGER,
        length_ms INTEGER,
        is_taylors_version BOOLEAN,
        is_bonus_track BOOLEAN,
        version_type TEXT
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT
          s.id AS song_id,
          s.title AS song_title,
          sa.position,
          sa.disc_number,
          s.length_ms,
          s.is_taylors_version,
          sa.is_bonus_track,
          sa.version_type
        FROM
          taylor_swift_songs s
        JOIN
          taylor_swift_song_appearances sa ON s.id = sa.song_id
        WHERE
          sa.album_id = album_uuid
        ORDER BY
          sa.disc_number, sa.position;
      END;
      $$ LANGUAGE plpgsql;
      
      CREATE OR REPLACE FUNCTION get_songs_on_multiple_albums(limit_count INTEGER DEFAULT 50)
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
            s.id,
            s.title,
            COUNT(sa.album_id) AS album_count
          FROM
            taylor_swift_songs s
          JOIN
            taylor_swift_song_appearances sa ON s.id = sa.song_id
          GROUP BY
            s.id, s.title
          HAVING
            COUNT(sa.album_id) > 1
          ORDER BY
            COUNT(sa.album_id) DESC
          LIMIT limit_count
        ),
        album_appearances AS (
          SELECT
            sc.id AS song_id,
            sc.title AS song_title,
            sc.album_count,
            json_agg(
              json_build_object(
                'album_id', a.id,
                'album_title', a.title,
                'position', sa.position,
                'disc_number', sa.disc_number,
                'version_type', sa.version_type
              )
            ) AS albums
          FROM
            song_counts sc
          JOIN
            taylor_swift_song_appearances sa ON sc.id = sa.song_id
          JOIN
            taylor_swift_albums a ON sa.album_id = a.id
          GROUP BY
            sc.id, sc.title, sc.album_count
        )
        SELECT
          aa.song_id,
          aa.song_title,
          aa.album_count AS appearance_count,
          aa.albums
        FROM
          album_appearances aa
        ORDER BY
          aa.album_count DESC;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    const { error: functionsError } = await executeSQL(createFunctionsSQL);
    if (functionsError) {
      console.error('Error creating helper functions:', functionsError);
    } else {
      console.log('Created helper functions successfully');
    }
    
    console.log('\nSchema changes completed!');
    console.log('You can now run the migration script to populate the tables.');
    
  } catch (error) {
    console.error('Error executing schema changes:', error);
  }
}

// Helper function to execute SQL
async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec', { command: sql });
    if (error) {
      // If RPC doesn't exist, let's create it
      if (error.message && error.message.includes('function "exec" does not exist')) {
        // First, create the exec function
        const createExecFn = `
          CREATE OR REPLACE FUNCTION exec(command text) 
          RETURNS VOID AS $$
          BEGIN
            EXECUTE command;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `;
        
        // Execute raw query to create the function
        await executeRawQuery(createExecFn);
        
        // Try again with the newly created function
        return await supabase.rpc('exec', { command: sql });
      } else {
        // For other errors, try direct execution
        return await executeRawQuery(sql);
      }
    }
    
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Helper function for raw query execution
async function executeRawQuery(sql) {
  try {
    // Use the raw http driver for direct SQL execution
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({ query: sql })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return { data: null, error: new Error(`SQL execution failed: ${errorText}`) };
    }
    
    const result = await response.json();
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Execute schema changes
executeSchemaChanges();
