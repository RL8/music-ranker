# Music Ranker Database Documentation

This directory contains documentation and resources related to the Music Ranker application's database structure.

## Database Overview

The Music Ranker application uses a Supabase PostgreSQL database with the following structure:

### Tables

| Table Name  | Description                                      | Record Count |
|-------------|--------------------------------------------------|--------------|
| Albums      | Contains album information                       | 25           |
| Artists     | Contains artist information                      | 19           |
| Eras        | Represents musical eras or periods               | 11           |
| Recordings  | Individual recordings of songs on albums         | 463          |
| Songs       | Contains song information                        | 233          |

## Database Connection

The application connects to Supabase using environment variables defined in the `.env` file:

```
VUE_APP_SUPABASE_URL=https://zfujellgwbznmosjuenq.supabase.co
VUE_APP_SUPABASE_ANON_KEY=your_anon_key
VUE_APP_SUPABASE_SERVICE_KEY=your_service_key
```

## Documentation Files

This directory contains the following documentation files:

- `README.md` - This overview file
- `SCHEMA.md` - Detailed schema documentation
- `schema.sql` - SQL statements to recreate the database structure
- `examine-data.sql` - SQL queries to examine database content
- `get-table-structure.sql` - SQL queries to retrieve table structure

## Related Resources

- TypeScript type definitions: `/src/types/database.ts`
- Supabase client configuration: `/src/lib/supabase/client.js`
- Database service layer: `/src/services/supabaseService.js`