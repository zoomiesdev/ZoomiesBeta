-- Fix member count triggers for communities
-- Run this in your Supabase SQL editor

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_community_member_count_trigger ON community_members;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_community_member_count() CASCADE;

-- Create the function to update member counts with debugging
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
  community_name TEXT;
BEGIN
  -- Get community name for debugging
  SELECT name INTO community_name FROM communities WHERE id = COALESCE(NEW.community_id, OLD.community_id);
  
  IF TG_OP = 'INSERT' THEN
    -- Increase member count when someone joins
    UPDATE communities 
    SET member_count = member_count + 1 
    WHERE id = NEW.community_id;
    
    -- Log the operation
    SELECT member_count INTO current_count FROM communities WHERE id = NEW.community_id;
    RAISE NOTICE 'User joined community: % (%), new count: %', community_name, NEW.community_id, current_count;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrease member count when someone leaves (but not below 0)
    UPDATE communities 
    SET member_count = GREATEST(member_count - 1, 0)
    WHERE id = OLD.community_id;
    
    -- Log the operation
    SELECT member_count INTO current_count FROM communities WHERE id = OLD.community_id;
    RAISE NOTICE 'User left community: % (%), new count: %', community_name, OLD.community_id, current_count;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER update_community_member_count_trigger
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_community_member_count();

-- First, clean up any duplicate memberships (keep one per user per community)
WITH duplicates AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY community_id, user_id ORDER BY id) as rn
  FROM community_members
)
DELETE FROM community_members 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Update all member counts to correct values (one-time fix)
UPDATE communities 
SET member_count = (
  SELECT COUNT(*) 
  FROM community_members 
  WHERE community_id = communities.id
);

-- Show current member counts for verification
SELECT 
  c.name,
  c.member_count as "Current Count",
  COUNT(cm.id) as "Actual Count"
FROM communities c
LEFT JOIN community_members cm ON c.id = cm.community_id
GROUP BY c.id, c.name, c.member_count
ORDER BY c.name;