-- Update the create_user_profile function to include user type
-- This bypasses RLS policies for user creation

CREATE OR REPLACE FUNCTION create_user_profile(
  p_auth_id UUID,
  p_username TEXT,
  p_email TEXT,
  p_bio TEXT DEFAULT 'New Zoomies member! 🐾',
  p_avatar TEXT DEFAULT NULL,
  p_type TEXT DEFAULT 'user'
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
  INSERT INTO users (auth_id, username, email, bio, avatar, type)
  VALUES (p_auth_id, p_username, p_email, p_bio, p_avatar, p_type)
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_profile(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated; 