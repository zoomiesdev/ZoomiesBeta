-- Add user type field to users table
ALTER TABLE users 
ADD COLUMN type TEXT DEFAULT 'user' CHECK (type IN ('user', 'sanctuary', 'admin'));

-- Add comment to document the new field
COMMENT ON COLUMN users.type IS 'User type: user, sanctuary, or admin';

-- Update existing users to have type 'user' if not set
UPDATE users SET type = 'user' WHERE type IS NULL; 