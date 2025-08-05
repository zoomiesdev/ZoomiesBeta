-- Add sanctuary-specific fields to users table
ALTER TABLE users 
ADD COLUMN sanctuary_name TEXT,
ADD COLUMN sanctuary_description TEXT,
ADD COLUMN sanctuary_website TEXT,
ADD COLUMN sanctuary_phone TEXT,
ADD COLUMN verification_documents TEXT[],
ADD COLUMN sanctuary_photos TEXT[],
ADD COLUMN verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- Add comments to document the new fields
COMMENT ON COLUMN users.sanctuary_name IS 'Name of the sanctuary/shelter';
COMMENT ON COLUMN users.sanctuary_description IS 'Description of the sanctuary';
COMMENT ON COLUMN users.sanctuary_website IS 'Website URL of the sanctuary';
COMMENT ON COLUMN users.sanctuary_phone IS 'Phone number of the sanctuary';
COMMENT ON COLUMN users.verification_documents IS 'Array of verification document URLs';
COMMENT ON COLUMN users.sanctuary_photos IS 'Array of sanctuary photo URLs';
COMMENT ON COLUMN users.verification_status IS 'Status of sanctuary verification'; 