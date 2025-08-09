-- Debug community memberships and counts
-- Run this in your Supabase SQL editor to see what's actually in the database

-- Show all communities with their displayed counts vs actual member counts
SELECT 
  c.name as "Community Name",
  c.member_count as "Displayed Count",
  COUNT(cm.id) as "Actual Members",
  CASE 
    WHEN c.member_count = COUNT(cm.id) THEN '✅ MATCH'
    ELSE '❌ MISMATCH'
  END as "Status"
FROM communities c
LEFT JOIN community_members cm ON c.id = cm.community_id
GROUP BY c.id, c.name, c.member_count
ORDER BY c.name;

-- Show actual membership records (with user IDs)
SELECT 
  c.name as "Community",
  cm.user_id as "User ID",
  cm.id as "Membership ID"
FROM communities c
JOIN community_members cm ON c.id = cm.community_id
ORDER BY c.name, cm.user_id;

-- Show user count by community
SELECT 
  c.name as "Community",
  COUNT(DISTINCT cm.user_id) as "Unique Users"
FROM communities c
LEFT JOIN community_members cm ON c.id = cm.community_id
GROUP BY c.id, c.name
ORDER BY c.name;