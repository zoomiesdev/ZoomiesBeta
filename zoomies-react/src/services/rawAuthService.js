import { supabase } from '../lib/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const rawAuthService = {
  // Sign in with email and password using raw fetch
  async signIn(email, password) {
    try {
      console.log('Raw auth service: signing in with', { email, password: '***' });
      
      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'X-Client-Info': 'supabase-js/2.53.0'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Raw auth service: sign in successful');
        // Store the access token in localStorage
        if (data.access_token) {
          localStorage.setItem('supabase.auth.token', data.access_token);
        }
        return { data, error: null };
      } else {
        console.log('Raw auth service: sign in failed', data);
        return { data: null, error: data };
      }
    } catch (err) {
      console.error('Raw auth service: exception', err);
      return { data: null, error: err };
    }
  },

  // Get current session using raw fetch
  async getSession() {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      if (!token) {
        console.log('Raw auth service: no token found');
        return { session: null };
      }
      
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Raw auth service: session found', data);
        return { session: { user: data } };
      } else {
        console.log('Raw auth service: session invalid, clearing token');
        localStorage.removeItem('supabase.auth.token');
        return { session: null };
      }
    } catch (err) {
      console.error('Raw auth service: get session error', err);
      return { session: null };
    }
  },

  // Sign out using raw fetch
  async signOut() {
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      });
      
      // Clear local storage
      localStorage.removeItem('supabase.auth.token');
      
      return { error: null };
    } catch (err) {
      console.error('Raw auth service: sign out error', err);
      return { error: err };
    }
  }
}; 