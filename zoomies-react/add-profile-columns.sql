-- Add missing columns to users table for profile customization
-- Run this in your Supabase SQL Editor

-- Add customize_data column (JSONB for storing customization preferences)
ALTER TABLE users ADD COLUMN IF NOT EXISTS customize_data JSONB DEFAULT '{}';

-- Add feeling-related columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS feeling TEXT DEFAULT 'Happy';
ALTER TABLE users ADD COLUMN IF NOT EXISTS feeling_emoji TEXT DEFAULT '😊';
ALTER TABLE users ADD COLUMN IF NOT EXISTS feeling_description TEXT DEFAULT 'Feeling great today!';

-- Add name column (for display name)
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;

-- Update existing users to have default values
UPDATE users SET 
  customize_data = '{
    "backgroundType": "inherit",
    "backgroundColor": "inherit",
    "backgroundImage": null,
    "buttonColor": "var(--primary)",
    "headerTextColor": "var(--text)",
    "bodyTextColor": "var(--text-secondary)",
    "leftSidebarWidgets": ["feelings"],
    "rightSidebarWidgets": ["following", "showcasePicture"]
  }'::jsonb
WHERE customize_data IS NULL;

-- Set default name for existing users
UPDATE users SET name = username WHERE name IS NULL; 