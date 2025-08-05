-- Test if showcase fields exist in users table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('showcase_picture', 'showcase_gif')
ORDER BY column_name; 