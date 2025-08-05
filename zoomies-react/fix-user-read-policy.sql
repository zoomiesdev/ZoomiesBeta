-- Fix user read policy to allow reading by auth_id
-- Run this in your Supabase SQL Editor

-- Drop the existing read policy
DROP POLICY IF EXISTS "Users can read all users" ON users;

-- Create a new policy that allows reading by auth_id
CREATE POLICY "Users can read by auth_id" ON users FOR SELECT USING (
  auth.uid() = auth_id OR auth.uid() IS NOT NULL
);

-- Also ensure the update policy is correct
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = auth_id);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users'; 