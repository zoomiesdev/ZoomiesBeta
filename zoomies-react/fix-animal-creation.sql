-- Fix animal creation issues
-- 1. Add animal_type column
ALTER TABLE animals ADD COLUMN IF NOT EXISTS animal_type TEXT;

-- 2. Add comment to explain the column
COMMENT ON COLUMN animals.animal_type IS 'Preset animal type for sorting (Dog, Cat, Pig, etc.)';

-- 3. Add missing RLS policies for animal creation
-- Authenticated users can create animals
CREATE POLICY "Authenticated users can create animals" ON animals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update animals they created (sanctuary-based)
CREATE POLICY "Users can update own animals" ON animals FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_id = auth.uid() 
    AND users.sanctuary_name = animals.sanctuary
  )
);

-- Users can delete animals they created (sanctuary-based)
CREATE POLICY "Users can delete own animals" ON animals FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_id = auth.uid() 
    AND users.sanctuary_name = animals.sanctuary
  )
);

-- 4. Test the setup
SELECT 'Animal creation should now work!' as status; 