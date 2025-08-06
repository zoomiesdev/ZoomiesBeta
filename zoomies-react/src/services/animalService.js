import { supabase } from '../lib/supabase'

export const animalService = {
  // Get all animals
  async getAllAnimals() {
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get animals by sanctuary
  async getAnimalsBySanctuary(sanctuaryId) {
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('sanctuary', sanctuaryId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get animal by ID
  async getAnimalById(animalId) {
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('id', animalId)
      .single()
    return { data, error }
  },

  // Create new animal
  async createAnimal(animalData) {
    try {
      console.log('Creating animal with data:', animalData)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')
      
      console.log('Authenticated user:', user.id)
      
      // Get the user's profile to get the sanctuary info
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('id, sanctuary_name')
        .eq('auth_id', user.id)
        .single()
      
      if (userError) {
        console.error('Error getting user profile:', userError)
        throw userError
      }
      
      console.log('User profile:', userProfile)
      
      const animal = {
        name: animalData.name,
        animal_type: animalData.animal_type,
        species: animalData.species,
        sanctuary: userProfile.sanctuary_name,
        about: animalData.description,
        profile_img: animalData.profile_img || null,
        cover_img: animalData.cover_img || null,
        donation_goal: animalData.donation_goal || 0,
        donation_raised: 0,
        status: 'Active'
      }
      
      console.log('Animal object to insert:', animal)
      
      const { data, error } = await supabase
        .from('animals')
        .insert([animal])
        .select()
        .single()
      
      if (error) {
        console.error('Error inserting animal:', error)
      } else {
        console.log('Animal created successfully:', data)
      }
      
      return { data, error }
    } catch (error) {
      console.error('Error in createAnimal:', error)
      return { data: null, error }
    }
  },

  // Update animal
  async updateAnimal(animalId, updates) {
    console.log('Updating animal:', animalId, 'with updates:', updates);
    
    const { data, error } = await supabase
      .from('animals')
      .update(updates)
      .eq('id', animalId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating animal:', error);
    } else {
      console.log('Animal updated successfully:', data);
    }
    
    return { data, error }
  },

  // Delete animal
  async deleteAnimal(animalId) {
    const { error } = await supabase
      .from('animals')
      .delete()
      .eq('id', animalId)
    
    return { error }
  },

  // Follow animal
  async followAnimal(animalId) {
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
      .from('animal_follows')
      .insert([{
        user_id: userProfile.id,
        animal_id: animalId
      }])
    
    return { data, error }
  },

  // Unfollow animal
  async unfollowAnimal(animalId) {
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
      .from('animal_follows')
      .delete()
      .eq('user_id', userProfile.id)
      .eq('animal_id', animalId)
    
    return { error }
  },

  // Get featured animals
  async getFeaturedAnimals() {
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
    return { data, error }
  }
} 