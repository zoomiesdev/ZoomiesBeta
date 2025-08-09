-- Comprehensive diagnosis of why triggers aren't working
-- Run this in your Supabase SQL editor

-- Step 1: Check if triggers exist
SELECT 
  'TRIGGER CHECK' as "Test Type",
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_trigger t
      JOIN pg_class c ON t.tgrelid = c.oid
      WHERE t.tgname = 'update_community_member_count_trigger'
    ) THEN '✅ TRIGGER EXISTS'
    ELSE '❌ TRIGGER MISSING'
  END as "Result";

-- Step 2: Check if function exists
SELECT 
  'FUNCTION CHECK' as "Test Type",
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'update_community_member_count'
    ) THEN '✅ FUNCTION EXISTS'
    ELSE '❌ FUNCTION MISSING'
  END as "Result";

-- Step 3: Check current member counts vs reality
SELECT 
  'MEMBER COUNT CHECK' as "Test Type",
  c.name as "Community",
  c.member_count as "Displayed",
  COUNT(cm.id) as "Actual",
  CASE 
    WHEN c.member_count = COUNT(cm.id) THEN '✅ CORRECT'
    ELSE '❌ WRONG'
  END as "Status"
FROM communities c
LEFT JOIN community_members cm ON c.id = cm.community_id
GROUP BY c.id, c.name, c.member_count
ORDER BY c.name;

-- Step 4: Test if triggers can fire by manually inserting/deleting
-- First, let's see what communities exist
SELECT 
  'AVAILABLE COMMUNITIES' as "Test Type",
  id as "Community ID",
  name as "Community Name",
  member_count as "Current Count"
FROM communities 
ORDER BY name
LIMIT 3;

-- Step 5: Check if RLS is blocking trigger execution
SELECT 
  'RLS CHECK' as "Test Type",
  tablename as "Table",
  CASE 
    WHEN rowsecurity THEN '⚠️ RLS ENABLED'
    ELSE '✅ RLS DISABLED'
  END as "RLS Status"
FROM pg_tables 
WHERE tablename IN ('communities', 'community_members');

-- Step 6: Check trigger details
SELECT 
  'TRIGGER DETAILS' as "Test Type",
  t.tgname as "Trigger Name",
  c.relname as "Table",
  CASE t.tgtype
    WHEN 5 THEN 'AFTER INSERT'
    WHEN 6 THEN 'AFTER DELETE' 
    WHEN 21 THEN 'AFTER INSERT OR DELETE'
    ELSE 'OTHER: ' || t.tgtype::text
  END as "Trigger Type",
  p.proname as "Function Name"
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
LEFT JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgname = 'update_community_member_count_trigger';