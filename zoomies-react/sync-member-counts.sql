-- Manually sync all member counts to correct values
-- This will fix any incorrect counts regardless of trigger issues

-- Update all community member counts to match actual membership records
UPDATE communities 
SET member_count = (
  SELECT COUNT(*) 
  FROM community_members 
  WHERE community_id = communities.id
);

-- Show the results
SELECT 
  name as "Community Name",
  member_count as "Updated Count"
FROM communities 
ORDER BY name;

-- Verify the counts are now correct
SELECT 
  c.name as "Community Name",
  c.member_count as "Displayed Count",
  COUNT(cm.id) as "Actual Members",
  CASE 
    WHEN c.member_count = COUNT(cm.id) THEN '✅ CORRECT'
    ELSE '❌ STILL WRONG'
  END as "Status"
FROM communities c
LEFT JOIN community_members cm ON c.id = cm.community_id
GROUP BY c.id, c.name, c.member_count
ORDER BY c.name;