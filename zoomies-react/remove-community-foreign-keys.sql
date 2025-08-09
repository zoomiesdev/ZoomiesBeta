-- Remove foreign key constraints that are causing issues
-- This allows the community system to work with Supabase Auth directly

-- Remove foreign key constraints
ALTER TABLE community_members DROP CONSTRAINT IF EXISTS community_members_user_id_fkey;
ALTER TABLE community_posts DROP CONSTRAINT IF EXISTS community_posts_user_id_fkey;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE reactions DROP CONSTRAINT IF EXISTS reactions_user_id_fkey;

-- Verify constraints are removed
SELECT 
    tc.table_name, 
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.table_constraints AS tc 
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('community_members', 'community_posts', 'comments', 'reactions');