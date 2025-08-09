-- Create storage bucket for community posts
-- Run this in your Supabase SQL editor

-- Create the community-posts bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-posts',
  'community-posts', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the community-posts bucket
CREATE POLICY "Anyone can view community post images" ON storage.objects
FOR SELECT USING (bucket_id = 'community-posts');

CREATE POLICY "Authenticated users can upload community post images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'community-posts' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own community post images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'community-posts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
) WITH CHECK (
  bucket_id = 'community-posts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own community post images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'community-posts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);