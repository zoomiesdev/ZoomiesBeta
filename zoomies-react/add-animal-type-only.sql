-- Add animal_type column to animals table (only if it doesn't exist)
ALTER TABLE animals ADD COLUMN IF NOT EXISTS animal_type TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN animals.animal_type IS 'Preset animal type for sorting (Dog, Cat, Pig, etc.)';

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'animals' AND column_name = 'animal_type'; 