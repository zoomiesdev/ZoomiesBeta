-- Create storage bucket for showcase images
-- Note: This needs to be done in the Supabase Dashboard under Storage

-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Storage in the sidebar
-- 3. Click "Create a new bucket"
-- 4. Name it: showcase-images
-- 5. Make it public (so images can be accessed)
-- 6. Set up RLS policies

-- RLS Policies for showcase-images bucket
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload showcase images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'showcase-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update showcase images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'showcase-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete showcase images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'showcase-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to showcase images
CREATE POLICY "Public can view showcase images" ON storage.objects
  FOR SELECT USING (bucket_id = 'showcase-images'); 