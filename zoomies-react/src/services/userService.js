import { supabase } from '../lib/supabase'

// User profile management
export const userService = {
  // Get all users
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get user by ID
  async getUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Get user by auth ID
  async getUserByAuthId(authId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single()
    return { data, error }
  },

  // Create new user profile
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    return { data, error }
  },

  // Create user profile using function (bypasses RLS)
  async createUserWithFunction(userData) {
    const { data, error } = await supabase
      .rpc('create_user_profile', {
        p_auth_id: userData.auth_id,
        p_username: userData.username,
        p_email: userData.email,
        p_bio: userData.bio || 'New Zoomies member! 🐾',
        p_avatar: userData.avatar,
        p_type: userData.type || 'user'
      })
    return { data, error }
  },

  // Update user profile
  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Update current user profile (by auth_id)
  async updateCurrentUser(updates) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')
    
    console.log('Updating current user with:', updates);
    
    // First try to update existing user
    let { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('auth_id', user.id)
      .select()
      .single()
    
    // If no user found, create one
    if (error && error.code === 'PGRST116') {
      console.log('User not found, creating new user profile...')
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          auth_id: user.id,
          username: user.email?.split('@')[0] || 'user',
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'New User',
          type: 'user',
          ...updates
        }])
        .select()
        .single()
      
      if (createError) {
        console.error('Error creating user:', createError)
        throw createError
      }
      
      return { data: newUser, error: null }
    }
    
    if (error) {
      console.error('Error updating user:', error)
      throw error
    }
    
    console.log('User updated successfully:', data);
    return { data, error }
  },

  // Get user posts
  async getUserPosts(userId) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Follow user
  async followUser(followerId, followedId) {
    const { data, error } = await supabase
      .from('follows')
      .insert([{
        follower_id: followerId,
        followed_id: followedId
      }])
    return { data, error }
  },

  // Unfollow user
  async unfollowUser(followerId, followedId) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('followed_id', followedId)
    return { error }
  }
} 