-- Add RLS policy to allow reading all animals for Ambassador Hub
-- Run this in your Supabase SQL editor

-- Enable RLS on animals table if not already enabled
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Add policy to allow reading all animals (for Ambassador Hub)
CREATE POLICY "Anyone can read animals" ON animals FOR SELECT USING (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'animals' AND policyname = 'Anyone can read animals'; 