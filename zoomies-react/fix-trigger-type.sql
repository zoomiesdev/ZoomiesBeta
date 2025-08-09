-- Fix the trigger type - current trigger has wrong type (13 instead of 21)
-- This will reinstall the trigger with the correct configuration

-- Step 1: Drop the broken trigger
DROP TRIGGER IF EXISTS update_community_member_count_trigger ON community_members;

-- Step 2: Drop and recreate the function to be sure it's correct
DROP FUNCTION IF EXISTS update_community_member_count() CASCADE;

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

-- Step 3: Create the trigger with explicit AFTER INSERT OR DELETE
CREATE TRIGGER update_community_member_count_trigger
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_community_member_count();

-- Step 4: Verify the trigger type is now correct
SELECT 
  'TRIGGER TYPE CHECK' as "Test",
  t.tgname as "Trigger Name",
  CASE t.tgtype
    WHEN 5 THEN '✅ AFTER INSERT'
    WHEN 6 THEN '✅ AFTER DELETE' 
    WHEN 21 THEN '✅ AFTER INSERT OR DELETE (CORRECT!)'
    ELSE '❌ WRONG TYPE: ' || t.tgtype::text
  END as "Trigger Type"
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
WHERE t.tgname = 'update_community_member_count_trigger';

-- Step 5: Sync all current counts
UPDATE communities 
SET member_count = (
  SELECT COUNT(*) 
  FROM community_members 
  WHERE community_id = communities.id
);

-- Step 6: Show success message
SELECT 
  '🎉 TRIGGER FIXED!' as "Status",
  'Member counts will now update automatically!' as "Message";