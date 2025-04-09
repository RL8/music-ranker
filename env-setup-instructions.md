# Environment Setup Instructions

To complete the Supabase integration, please create a `.env` file in the root of your Music Ranker project with the following content:

```
# Supabase configuration
VUE_APP_SUPABASE_URL=https://hrmbnvtbosdzxdcfzrnv.supabase.co
VUE_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybWJudnRib3NkenhkY2Z6cm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjAwNzAsImV4cCI6MjA1OTM5NjA3MH0.xYqXcPjEiFLxtBJCalpVsJXJZRH3lYU0C9Nx5Rae-Qc
```

## Steps:

1. Create a new file named `.env` in the directory:
   ```
   c:\Users\Bravo\CascadeProjects\ts4apr\music-ranker\.env
   ```

2. Copy and paste the above content into the file

3. Save the file

4. Restart the development server to load the environment variables

The `.env` file is included in `.gitignore` to prevent sensitive credentials from being committed to your repository, which is why we can't create it directly through the tool.
