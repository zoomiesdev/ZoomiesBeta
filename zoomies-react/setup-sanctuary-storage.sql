-- Create storage bucket for sanctuary uploads
-- Note: This needs to be done in the Supabase Dashboard under Storage

-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Storage in the sidebar
-- 3. Click "Create a new bucket"
-- 4. Name it: sanctuary-uploads
-- 5. Make it public (so images can be accessed)
-- 6. Set up RLS policies

-- RLS Policies for sanctuary-uploads bucket
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload sanctuary files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'sanctuary-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update sanctuary files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'sanctuary-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete sanctuary files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'sanctuary-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to sanctuary files
CREATE POLICY "Public can view sanctuary files" ON storage.objects
  FOR SELECT USING (bucket_id = 'sanctuary-uploads'); 