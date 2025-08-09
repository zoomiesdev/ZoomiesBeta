-- Check if the member count trigger exists and is working
-- Run this in your Supabase SQL editor

-- Check if the trigger exists (using pg_trigger table directly)
SELECT 
  t.tgname as "Trigger Name",
  c.relname as "Table Name",
  'exists' as "Status"
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
WHERE t.tgname = 'update_community_member_count_trigger';

-- Check if the function exists
SELECT 
  proname as "Function Name",
  'exists' as "Status"
FROM pg_proc 
WHERE proname = 'update_community_member_count';

-- If no results above, the trigger/function doesn't exist and needs to be created