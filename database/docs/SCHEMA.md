# Music Ranker Database Schema

This document provides detailed information about the database schema used in the Music Ranker application.

## Tables Overview

The database consists of 7 main tables:

1. **Albums** - Stores information about music albums
2. **Artists** - Contains artist information
3. **Eras** - Represents musical eras or periods
4. **Recordings** - Individual recordings of songs on albums
5. **Songs** - Contains song information
6. **Editions** - Contains predefined album editions and release types
7. **RecordingEditions** - Junction table linking recordings to their respective editions

## Table Structures

### Albums Table

Stores information about music albums.

| Column Name  | Data Type | Nullable | Description                                |
|--------------|-----------|----------|--------------------------------------------|
| albumId      | text      | NO       | Primary key, unique identifier for albums  |
| albumTitle   | text      | YES      | The title of the album                     |
| releaseDate  | text      | YES      | The release date of the album              |
| albumType    | text      | YES      | Type of album (e.g., studio, live, compilation) |
| eraId        | text      | YES      | Foreign key reference to Eras table        |

### Artists Table

Contains information about music artists.

| Column Name  | Data Type | Nullable | Description                                |
|--------------|-----------|----------|--------------------------------------------|
| artistId     | text      | YES      | Unique identifier for artists              |
| artistName   | text      | YES      | The name of the artist                     |

### Eras Table

Represents musical eras or periods.

| Column Name    | Data Type | Nullable | Description                                |
|----------------|-----------|----------|--------------------------------------------|
| eraId          | text      | YES      | Unique identifier for eras                 |
| eraName        | text      | YES      | The name of the era                        |
| primaryAlbumId | text      | YES      | Foreign key reference to the primary album of this era |
| eraStartDate   | text      | YES      | The start date of the era                  |

### Recordings Table

Individual recordings of songs on albums.

| Column Name    | Data Type | Nullable | Description                                |
|----------------|-----------|----------|--------------------------------------------|
| recordingId    | text      | NO       | Primary key, unique identifier for recordings |
| recordingTitle | text      | YES      | The title of the recording                 |
| songId         | text      | YES      | Foreign key reference to Songs table       |
| albumId        | text      | YES      | Foreign key reference to Albums table      |
| discNumber     | bigint    | YES      | The disc number for multi-disc albums      |
| trackNumber    | bigint    | YES      | The track number on the disc               |
| versionType    | text      | YES      | Type of version (e.g., original, acoustic, live) |
| artistsJson    | jsonb     | YES      | JSON array of artists contributing to this recording |
| notes          | text      | YES      | Additional notes about the recording       |

### Songs Table

Contains information about songs.

| Column Name     | Data Type | Nullable | Description                                |
|-----------------|-----------|----------|--------------------------------------------|
| songId          | text      | NO       | Primary key, unique identifier for songs   |
| canonicalTitle  | text      | YES      | The canonical/standard title of the song   |
| originalEraId   | text      | YES      | Foreign key reference to the era when the song was originally released |
| notes           | text      | YES      | Additional notes about the song            |

### Editions Table

Contains predefined album editions and release types.

| Column Name    | Data Type | Nullable | Description                                |
|----------------|-----------|----------|--------------------------------------------|
| editionId      | text      | NO       | Primary key, unique identifier for editions |
| editionName    | text      | NO       | Display name of the edition                |
| description    | text      | YES      | Description of the edition                 |
| created_at     | timestamp | YES      | Timestamp when the record was created      |

### RecordingEditions Table

Junction table linking recordings to their respective editions.

| Column Name    | Data Type | Nullable | Description                                |
|----------------|-----------|----------|--------------------------------------------|
| recordingId    | text      | NO       | Primary key (part 1), foreign key to Recordings table |
| editionId      | text      | NO       | Primary key (part 2), foreign key to Editions table |
| notes          | text      | YES      | Additional notes about this recording-edition relationship |
| created_at     | timestamp | YES      | Timestamp when the record was created      |

## Relationships

The database tables are related as follows:

1. **Albums to Eras**: Albums have an `eraId` that references the `eraId` in the Eras table
2. **Eras to Albums**: Eras have a `primaryAlbumId` that references the `albumId` in the Albums table
3. **Recordings to Songs**: Recordings have a `songId` that references the `songId` in the Songs table
4. **Recordings to Albums**: Recordings have an `albumId` that references the `albumId` in the Albums table
5. **Songs to Eras**: Songs have an `originalEraId` that references the `eraId` in the Eras table
6. **Recordings to Editions**: Recordings have a `recordingId` that references the `recordingId` in the RecordingEditions table
7. **Editions to Recordings**: Editions have an `editionId` that references the `editionId` in the RecordingEditions table

## Data Model Diagram

```
┌─────────┐       ┌─────────┐
│  Albums │◄──────┤   Eras  │
└────┬────┘       └────┬────┘
     │                 │
     │                 │
     │                 │
     │                 │
┌────▼────┐       ┌────▼────┐
│Recordings│       │  Songs  │
└──────────┘       └─────────┘
     │                 │
     │                 │
     │                 │
     │                 │
┌────▼────┐       ┌────▼────┐
│RecordingEditions│       │  Editions  │
└──────────┘       └─────────┘
```

## Notes

- The database uses text-based IDs rather than auto-incrementing integers
- Date fields are stored as text rather than date types
- The Recordings table includes a JSONB field for storing artist information
- There are bidirectional relationships between Albums and Eras
