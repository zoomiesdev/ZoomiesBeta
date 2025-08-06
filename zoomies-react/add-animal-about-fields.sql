-- Add new fields to animals table for editable About section
-- Run this in your Supabase SQL editor

-- Add age field
ALTER TABLE animals ADD COLUMN IF NOT EXISTS age TEXT;

-- Add rescued_date field  
ALTER TABLE animals ADD COLUMN IF NOT EXISTS rescued_date TEXT;

-- Add personality field (JSON array)
ALTER TABLE animals ADD COLUMN IF NOT EXISTS personality JSONB DEFAULT '[]'::jsonb;

-- Add current_needs field (JSON array)
ALTER TABLE animals ADD COLUMN IF NOT EXISTS current_needs JSONB DEFAULT '[]'::jsonb;

-- Add comments to explain the new fields
COMMENT ON COLUMN animals.age IS 'Age of the animal (e.g., "3 years", "6 months")';
COMMENT ON COLUMN animals.rescued_date IS 'Date when animal was rescued (e.g., "Jan 2024", "March 15, 2023")';
COMMENT ON COLUMN animals.personality IS 'Array of personality traits (e.g., ["Playful", "Curious", "Friendly"])';
COMMENT ON COLUMN animals.current_needs IS 'Array of current needs (e.g., ["Medical checkup", "New toys", "Special diet"])';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'animals' 
AND column_name IN ('age', 'rescued_date', 'personality', 'current_needs')
ORDER BY column_name; 