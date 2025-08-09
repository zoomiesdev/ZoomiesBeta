-- Fix community foreign key constraints
-- This script will check and fix the foreign key issues

-- First, let's see what foreign key constraints exist
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('community_members', 'community_posts', 'comments', 'reactions');

-- Check what tables we have for users
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%user%';

-- Check current user ID from auth
SELECT auth.uid() as current_auth_user_id;

-- Check if current user exists in users table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE NOTICE 'Users table exists';
        -- Check if current user is in users table
        IF EXISTS (SELECT 1 FROM users WHERE id = auth.uid()) THEN
            RAISE NOTICE 'Current user exists in users table';
        ELSE
            RAISE NOTICE 'Current user NOT found in users table';
        END IF;
    ELSE
        RAISE NOTICE 'Users table does NOT exist';
    END IF;
END $$;

-- If users table doesn't exist or is causing issues, 
-- we can temporarily remove the foreign key constraint
-- Uncomment the lines below if needed:

-- DROP CONSTRAINT IF EXISTS on community_members table
-- ALTER TABLE community_members DROP CONSTRAINT IF EXISTS community_members_user_id_fkey;
-- ALTER TABLE community_posts DROP CONSTRAINT IF EXISTS community_posts_user_id_fkey;
-- ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
-- ALTER TABLE reactions DROP CONSTRAINT IF EXISTS reactions_user_id_fkey;