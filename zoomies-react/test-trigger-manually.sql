-- Manual test to see if triggers are working
-- This will test the trigger by simulating a join/leave

-- Step 1: Get your user ID and a community ID to test with
-- Replace 'YOUR_EMAIL_HERE' with your actual email
SELECT 
  'USER INFO' as "Info Type",
  id as "Your User ID",
  email as "Your Email"
FROM auth.users 
WHERE email LIKE '%@%'  -- Shows all users, find yours
LIMIT 5;

-- Step 2: Pick a community to test with
SELECT 
  'COMMUNITIES' as "Info Type", 
  id as "Community ID",
  name as "Community Name",
  member_count as "Current Count"
FROM communities 
ORDER BY name;

-- Step 3: Manual test instructions
/*
MANUAL TEST STEPS:
1. Copy your User ID from the first query
2. Copy a Community ID from the second query  
3. Replace USER_ID_HERE and COMMUNITY_ID_HERE below with actual UUIDs
4. Run the test insert/delete commands one at a time
5. Check if member_count changes

-- Test INSERT (simulates joining)
INSERT INTO community_members (community_id, user_id) 
VALUES ('COMMUNITY_ID_HERE', 'USER_ID_HERE');

-- Check if count went up
SELECT name, member_count FROM communities WHERE id = 'COMMUNITY_ID_HERE';

-- Test DELETE (simulates leaving)  
DELETE FROM community_members 
WHERE community_id = 'COMMUNITY_ID_HERE' AND user_id = 'USER_ID_HERE';

-- Check if count went down
SELECT name, member_count FROM communities WHERE id = 'COMMUNITY_ID_HERE';
*/

SELECT 'Run the manual test commands above with your actual IDs!' as "Instructions";