-- Fix RLS issue that may be preventing triggers from working
-- The trigger function might not have permission to update the communities table

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS update_community_member_count_trigger ON community_members;
DROP FUNCTION IF EXISTS update_community_member_count() CASCADE;

-- Step 2: Create function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER 
SECURITY DEFINER  -- This bypasses RLS policies
SET search_path = public
AS $$
BEGIN
  -- Handle INSERT (someone joins)
  IF TG_OP = 'INSERT' THEN
    UPDATE communities 
    SET member_count = member_count + 1 
    WHERE id = NEW.community_id;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE (someone leaves)
  IF TG_OP = 'DELETE' THEN
    UPDATE communities 
    SET member_count = GREATEST(member_count - 1, 0)
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create the trigger
CREATE TRIGGER update_community_member_count_trigger
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_community_member_count();

-- Step 4: Temporarily disable RLS on communities table for this update
ALTER TABLE communities DISABLE ROW LEVEL SECURITY;

-- Step 5: Sync all current counts
UPDATE communities 
SET member_count = (
  SELECT COUNT(*) 
  FROM community_members 
  WHERE community_id = communities.id
);

-- Step 6: Re-enable RLS on communities table
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- Step 7: Verify everything is working
SELECT 
  'FINAL CHECK' as "Test Type",
  name as "Community",
  member_count as "Count"
FROM communities 
ORDER BY name;

-- Step 8: Test the trigger manually (replace with actual IDs)
/*
-- To test manually, get a user ID and community ID:
SELECT 'Copy these IDs for testing:' as note;
SELECT id as user_id FROM auth.users LIMIT 1;
SELECT id as community_id, name FROM communities LIMIT 1;

-- Then test with actual IDs:
-- INSERT INTO community_members (community_id, user_id) VALUES ('your-community-id', 'your-user-id');
-- Check if count increased in communities table
-- DELETE FROM community_members WHERE community_id = 'your-community-id' AND user_id = 'your-user-id';
-- Check if count decreased
*/