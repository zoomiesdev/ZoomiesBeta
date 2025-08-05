-- Create storage bucket for animal photos
-- Note: This needs to be done in the Supabase Dashboard under Storage

-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Storage in the sidebar
-- 3. Click "Create a new bucket"
-- 4. Name it: animal-photos
-- 5. Make it public (so images can be accessed)
-- 6. Set up RLS policies

-- RLS Policies for animal-photos bucket
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload animal photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'animal-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update animal photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'animal-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete animal photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'animal-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to animal photos
CREATE POLICY "Public can view animal photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'animal-photos'); 