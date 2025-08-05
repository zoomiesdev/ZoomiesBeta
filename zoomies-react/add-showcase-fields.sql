-- Add showcase image fields to users table
ALTER TABLE users 
ADD COLUMN showcase_picture TEXT,
ADD COLUMN showcase_gif TEXT;

-- Add comment to document the new fields
COMMENT ON COLUMN users.showcase_picture IS 'URL to user''s showcase picture';
COMMENT ON COLUMN users.showcase_gif IS 'URL to user''s showcase gif'; 