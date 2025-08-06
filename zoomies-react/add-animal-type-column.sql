-- Add animal_type column to animals table
ALTER TABLE animals ADD COLUMN IF NOT EXISTS animal_type TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN animals.animal_type IS 'Preset animal type for sorting (Dog, Cat, Pig, etc.)';

-- Update RLS policies to include animal_type
-- The existing policies should work with the new column automatically 