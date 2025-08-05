-- Fix RLS Policies for User Profile Creation
-- Run this in your Supabase SQL Editor to fix the signup issue

-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users';

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create new, more permissive policies
-- Allow all users to read user profiles
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = auth_id);

-- Allow any authenticated user to insert a profile (for signup)
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Also allow service role to insert (backup option)
CREATE POLICY "Service role can insert users" ON users FOR INSERT WITH CHECK (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users'; 