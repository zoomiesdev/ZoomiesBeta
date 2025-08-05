-- Update RLS Policy for Users Table
-- Run this in your Supabase SQL Editor to fix the signup issue

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create the new permissive policy
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() IS NOT NULL); 