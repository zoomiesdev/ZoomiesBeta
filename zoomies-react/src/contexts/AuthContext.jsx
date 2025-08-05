import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { authService } from '../services/authService'
import { userService } from '../services/userService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile data from users table
  const fetchUserProfile = async (authUser) => {
    if (!authUser) return null
    
    console.log('Fetching profile for auth user:', authUser.id)
    
    try {
      const { data: profile, error } = await userService.getUserByAuthId(authUser.id)
      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
      
      console.log('Found profile:', profile)
      
      // Combine auth user with profile data
      return {
        ...authUser,
        ...profile
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
      return null
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session } = await authService.getSession()
      if (session?.user) {
        const fullUser = await fetchUserProfile(session.user)
        setUser(fullUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        if (session?.user) {
          const fullUser = await fetchUserProfile(session.user)
          console.log('Setting user:', fullUser)
          setUser(fullUser)
        } else {
          console.log('Setting user to null')
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, userData) => {
    const { data, error } = await authService.signUp(email, password, userData)
    return { data, error }
  }

  const signIn = async (email, password) => {
    console.log('Signing in with email:', email)
    const { data, error } = await authService.signIn(email, password)
    console.log('Sign in result:', { data, error })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await authService.signOut()
    return { error }
  }

  const refreshUser = async () => {
    if (user) {
      // Get the current session to ensure we have the latest auth user
      const { session } = await authService.getSession()
      if (session?.user) {
        const fullUser = await fetchUserProfile(session.user)
        setUser(fullUser)
      }
    }
  }

  const updateUserProfile = (updates) => {
    if (user) {
      setUser({
        ...user,
        ...updates
      })
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUser,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 