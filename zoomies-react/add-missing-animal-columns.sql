-- Add missing columns to animals table
-- Run this in your Supabase SQL editor

-- Add age column
ALTER TABLE animals ADD COLUMN IF NOT EXISTS age TEXT;

-- Add rescued_date column  
ALTER TABLE animals ADD COLUMN IF NOT EXISTS rescued_date TEXT;

-- Add personality column (JSON array)
ALTER TABLE animals ADD COLUMN IF NOT EXISTS personality JSONB DEFAULT '[]'::jsonb;

-- Add current_needs column (JSON array)
ALTER TABLE animals ADD COLUMN IF NOT EXISTS current_needs JSONB DEFAULT '[]'::jsonb;

-- Add animal_type column (if not already added)
ALTER TABLE animals ADD COLUMN IF NOT EXISTS animal_type TEXT;

-- Add comments to explain the new columns
COMMENT ON COLUMN animals.age IS 'Age of the animal (e.g., "3 years", "6 months")';
COMMENT ON COLUMN animals.rescued_date IS 'Date when animal was rescued (e.g., "Jan 2024", "March 15, 2023")';
COMMENT ON COLUMN animals.personality IS 'Array of personality traits (e.g., ["Playful", "Curious", "Friendly"])';
COMMENT ON COLUMN animals.current_needs IS 'Array of current needs (e.g., ["Medical checkup", "New toys", "Special diet"])';
COMMENT ON COLUMN animals.animal_type IS 'Preset animal type for sorting (Dog, Cat, Pig, etc.)';

-- Verify all columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'animals' 
AND column_name IN ('age', 'rescued_date', 'personality', 'current_needs', 'animal_type')
ORDER BY column_name; 