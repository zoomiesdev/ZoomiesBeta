-- Install bulletproof member count triggers
-- This will make member counts update automatically when joining/leaving

-- Step 1: Clean up any existing triggers/functions
DROP TRIGGER IF EXISTS update_community_member_count_trigger ON community_members;
DROP FUNCTION IF EXISTS update_community_member_count() CASCADE;

-- Step 2: Create a simple, reliable function
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
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

-- Step 4: Sync all current counts to be accurate
UPDATE communities 
SET member_count = (
  SELECT COUNT(*) 
  FROM community_members 
  WHERE community_id = communities.id
);

-- Step 5: Test the trigger works
SELECT 
  'Trigger installed successfully!' as "Status",
  COUNT(*) as "Communities Updated"
FROM communities;

-- Step 6: Verify trigger exists
SELECT 
  t.tgname as "Trigger Name",
  c.relname as "Table Name"
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
WHERE t.tgname = 'update_community_member_count_trigger';