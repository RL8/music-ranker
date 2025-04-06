-- Part 4: Create helper functions for Taylor Swift schema

-- Function to get all songs for an album
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

-- Function to get songs that appear on multiple albums
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
