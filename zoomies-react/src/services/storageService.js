import { supabase } from '../lib/supabase'

export const storageService = {
  // Upload file to Supabase Storage
  async uploadFile(file, bucket = 'showcase-images', path = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = path || fileName
      
      console.log('Uploading file to storage:', {
        bucket,
        filePath,
        fileSize: file.size,
        fileType: file.type
      })
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        console.error('Storage upload error:', error)
        throw error
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)
      
      console.log('File uploaded successfully:', publicUrl)
      return { url: publicUrl, path: filePath }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  },

  // Delete file from Supabase Storage
  async deleteFile(path, bucket = 'showcase-images') {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])
      
      if (error) {
        console.error('Storage delete error:', error)
        throw error
      }
      
      console.log('File deleted successfully:', path)
      return { success: true }
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  }
} 