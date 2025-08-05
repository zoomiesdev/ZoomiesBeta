-- Quick Fix for User Signup Issue
-- Run this in your Supabase SQL Editor

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- 2. Create new permissive policy
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Create the user profile function (bypasses RLS)
CREATE OR REPLACE FUNCTION create_user_profile(
  p_auth_id UUID,
  p_username TEXT,
  p_email TEXT,
  p_bio TEXT DEFAULT 'New Zoomies member! 🐾',
  p_avatar TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- Insert the user profile
  INSERT INTO users (auth_id, username, email, bio, avatar)
  VALUES (p_auth_id, p_username, p_email, p_bio, p_avatar)
  RETURNING id INTO new_user_id;
  
  -- Return success result
  result := json_build_object(
    'success', true,
    'user_id', new_user_id,
    'message', 'User profile created successfully'
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    result := json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Failed to create user profile'
    );
    
    RETURN result;
END;
$$;

-- 4. Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_profile(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- 5. Verify the function was created
SELECT routine_name, routine_type FROM information_schema.routines WHERE routine_name = 'create_user_profile'; 