-- Cleanup script to remove duplicate community memberships
-- Run this in your Supabase SQL Editor to clean up any duplicate records

-- First, let's see if there are any duplicates
SELECT 
  community_id, 
  user_id, 
  COUNT(*) as count 
FROM community_members 
GROUP BY community_id, user_id 
HAVING COUNT(*) > 1;

-- Remove duplicate memberships (keeps the first one, removes duplicates)
DELETE FROM community_members a
USING community_members b
WHERE a.id > b.id
AND a.community_id = b.community_id
AND a.user_id = b.user_id;

-- Verify no duplicates remain
SELECT 
  community_id, 
  user_id, 
  COUNT(*) as count 
FROM community_members 
GROUP BY community_id, user_id 
HAVING COUNT(*) > 1;