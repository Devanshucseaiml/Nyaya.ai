# Database Setup Guide for Nyaya.ai

## Issue
The legal stories dropdown for selecting legal cases is not working because the required database tables haven't been created yet.

## Solution
You need to run the database setup scripts in your Supabase project.

## Steps to Fix

### 1. Access Your Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project
3. Go to the **SQL Editor** section

### 2. Run the Database Scripts
Execute these scripts in order:

#### Step 1: Create Users Table
```sql
-- Copy and paste the contents of scripts/001_create_users_table.sql
```

#### Step 2: Create Legal Tables
```sql
-- Copy and paste the contents of scripts/002_create_legal_tables.sql
```

#### Step 3: Seed Data
```sql
-- Copy and paste the contents of scripts/003_seed_data.sql
```

#### Step 4: Create Legal Stories Tables
```sql
-- Copy and paste the contents of scripts/setup_legal_stories.sql
```

### 3. Alternative: Quick Fix
If you want to quickly test the dropdown, you can just create the categories table:

```sql
-- Create story_categories table
CREATE TABLE IF NOT EXISTS story_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert basic categories
INSERT INTO story_categories (name, description, icon, color) VALUES
('Consumer Rights', 'Product liability, fraud, and consumer protection', 'ShoppingCart', '#F59E0B'),
('Labor Rights', 'Workplace issues, discrimination, and labor rights', 'Users', '#7C3AED'),
('Property Rights', 'Real estate, land disputes, and property rights', 'Home', '#059669'),
('Family Law', 'Divorce, custody, marriage, and family disputes', 'Heart', '#EF4444'),
('Criminal Law', 'Criminal cases, arrests, and legal defense', 'Shield', '#DC2626'),
('Constitutional Rights', 'Fundamental rights and constitutional matters', 'Scale', '#EC4899')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE story_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy
CREATE POLICY "Categories are viewable by everyone" ON story_categories FOR SELECT USING (true);
```

### 4. Verify Setup
After running the scripts, you should see:
- A `story_categories` table in your database
- Categories populated in the table
- The dropdown working in the legal stories form

### 5. Check Environment Variables
Make sure your `.env.local` file has the correct Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Troubleshooting

### If the dropdown still doesn't work:
1. Check the browser console for errors
2. Verify the database connection in Supabase
3. Ensure the RLS policies are correctly set
4. Check if the `story_categories` table has data

### Common Issues:
- **Table doesn't exist**: Run the setup scripts
- **Permission denied**: Check RLS policies
- **No data**: Insert the sample categories
- **Connection error**: Verify environment variables

## Need Help?
If you're still having issues:
1. Check the browser console for error messages
2. Verify your Supabase project settings
3. Ensure all scripts were executed successfully
4. Contact support with specific error messages

