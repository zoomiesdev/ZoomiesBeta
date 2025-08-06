-- Add customization column to animals table
-- Run this in your Supabase SQL editor

-- Add customization column (JSONB for storing customization settings)
ALTER TABLE animals ADD COLUMN IF NOT EXISTS customization JSONB DEFAULT '{}'::jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN animals.customization IS 'JSON object containing customization settings (colors, backgrounds, etc.)';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'animals' AND column_name = 'customization'; 