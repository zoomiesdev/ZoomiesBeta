-- Add missing RLS policy for animal creation
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