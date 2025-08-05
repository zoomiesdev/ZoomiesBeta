import { supabase } from '../lib/supabase'

// Animal/Ambassador management
export const animalService = {
  // Get all animals
  async getAnimals() {
    const { data, error } = await supabase
      .from('animals')
      .select('*')
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

  // Create new animal profile
  async createAnimal(animalData) {
    const { data, error } = await supabase
      .from('animals')
      .insert([animalData])
      .select()
      .single()
    return { data, error }
  },

  // Update animal profile
  async updateAnimal(animalId, updates) {
    const { data, error } = await supabase
      .from('animals')
      .update(updates)
      .eq('id', animalId)
      .select()
      .single()
    return { data, error }
  },

  // Get animal posts
  async getAnimalPosts(animalId) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('animal_id', animalId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Follow animal
  async followAnimal(userId, animalId) {
    const { data, error } = await supabase
      .from('animal_follows')
      .insert([{
        user_id: userId,
        animal_id: animalId
      }])
    return { data, error }
  },

  // Unfollow animal
  async unfollowAnimal(userId, animalId) {
    const { error } = await supabase
      .from('animal_follows')
      .delete()
      .eq('user_id', userId)
      .eq('animal_id', animalId)
    return { error }
  },

  // Get animal donations
  async getAnimalDonations(animalId) {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('animal_id', animalId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
} 