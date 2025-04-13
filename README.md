# music-ranker

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Database

The Music Ranker application uses a Supabase PostgreSQL database to store information about albums, artists, songs, and user rankings.

### Database Structure

The database consists of 5 main tables:
- **Albums** - Contains album information (25 records)
- **Artists** - Contains artist information (19 records)
- **Eras** - Represents musical eras or periods (11 records)
- **Recordings** - Individual recordings of songs on albums (463 records)
- **Songs** - Contains song information (233 records)

### Database Documentation

For detailed information about the database structure, see the following files:
- [Database README](/database/README.md) - Overview of the database
- [Schema Documentation](/database/SCHEMA.md) - Detailed schema documentation
- [Current Schema SQL](/database/current-schema.sql) - SQL to recreate the current schema
- [Database Diagram](/database/schema-diagram.dbml) - Visual representation of the database structure
- [TypeScript Types](/src/types/database.ts) - TypeScript type definitions for database tables

### Database Connection

The application connects to Supabase using environment variables defined in the `.env` file. See the [Database README](/database/README.md) for more information about connecting to the database.
