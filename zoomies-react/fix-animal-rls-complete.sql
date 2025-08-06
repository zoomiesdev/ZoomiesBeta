-- Comprehensive RLS policy fix for animals table
-- Run this in your Supabase SQL editor

-- Enable RLS on animals table
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can create animals" ON animals;
DROP POLICY IF EXISTS "Users can update own animals" ON animals;
DROP POLICY IF EXISTS "Users can delete own animals" ON animals;
DROP POLICY IF EXISTS "Anyone can read animals" ON animals;

-- Create comprehensive policies

-- 1. Anyone can read animals (for Ambassador Hub)
CREATE POLICY "Anyone can read animals" ON animals FOR SELECT USING (true);

-- 2. Authenticated users can create animals
CREATE POLICY "Authenticated users can create animals" ON animals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Users can update animals they created (sanctuary-based)
CREATE POLICY "Users can update own animals" ON animals FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_id = auth.uid() 
    AND users.sanctuary_name = animals.sanctuary
  )
);

-- 4. Users can delete animals they created (sanctuary-based)
CREATE POLICY "Users can delete own animals" ON animals FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_id = auth.uid() 
    AND users.sanctuary_name = animals.sanctuary
  )
);

-- Verify all policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'animals'
ORDER BY policyname; 