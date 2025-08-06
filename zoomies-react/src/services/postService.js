import { supabase } from '../lib/supabase'

export const postService = {
  // Get posts for a specific user
  async getUserPosts(userId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!posts_user_id_fkey (
          id,
          username,
          name,
          avatar
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get all posts (for timeline)
  async getAllPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!posts_user_id_fkey (
          id,
          username,
          name,
          avatar
        )
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get posts for a specific animal
  async getPostsByAnimal(animalId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!posts_user_id_fkey (
          id,
          username,
          name,
          avatar
        )
      `)
      .eq('animal_id', animalId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Create a new post
  async createPost(postData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')
    
    // Get the user's profile to get the user_id
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()
    
    if (userError) throw userError
    
    const post = {
      user_id: userProfile.id,
      content: postData.content,
      image_url: postData.image_url || null,
      animal_id: postData.animal_id || null,
      type: 'post'
    }
    
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select(`
        *,
        users!posts_user_id_fkey (
          id,
          username,
          name,
          avatar
        )
      `)
      .single()
    
    return { data, error }
  },

  // Update a post
  async updatePost(postId, updates) {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single()
    
    return { data, error }
  },

  // Delete a post
  async deletePost(postId) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
    
    return { error }
  },

  // Like a post
  async likePost(postId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')
    
    // Get the user's profile to get the user_id
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()
    
    if (userError) throw userError
    
    const { data, error } = await supabase
      .from('post_likes')
      .insert([{
        post_id: postId,
        user_id: userProfile.id
      }])
    
    return { data, error }
  },

  // Unlike a post
  async unlikePost(postId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')
    
    // Get the user's profile to get the user_id
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()
    
    if (userError) throw userError
    
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userProfile.id)
    
    return { error }
  }
} 