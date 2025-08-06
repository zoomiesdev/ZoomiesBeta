const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const rawUserService = {
  // Get user by auth ID using raw fetch
  async getUserByAuthId(authId) {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      const response = await fetch(`${supabaseUrl}/rest/v1/users?auth_id=eq.${authId}&select=*`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return { data: data[0] || null, error: null };
      } else {
        return { data: null, error: { message: `HTTP ${response.status}` } };
      }
    } catch (err) {
      console.error('Raw user service: getUserByAuthId error', err);
      return { data: null, error: err };
    }
  },

  // Update current user profile using raw fetch
  async updateCurrentUser(updates) {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      if (!token) {
        throw new Error('No authenticated user');
      }
      
      // First get the current user from the token
      const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to get current user');
      }
      
      const authUser = await userResponse.json();
      console.log('Raw user service: updating current user with:', updates);
      
      // Try to update existing user
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/users?auth_id=eq.${authUser.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updates)
      });
      
      if (updateResponse.ok) {
        const data = await updateResponse.json();
        console.log('Raw user service: user updated successfully:', data);
        return { data: data[0], error: null };
      } else if (updateResponse.status === 404) {
        // User not found, create new user
        console.log('Raw user service: user not found, creating new user...');
        
        const userType = authUser.user_metadata?.type || 'user';
        
        const createResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            auth_id: authUser.id,
            username: authUser.email?.split('@')[0] || 'user',
            email: authUser.email || '',
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'New User',
            type: userType,
            // Add sanctuary fields if it's a sanctuary user
            ...(userType === 'sanctuary' && {
              sanctuary_name: authUser.user_metadata?.sanctuary_name || '',
              sanctuary_description: authUser.user_metadata?.sanctuary_description || '',
              sanctuary_website: authUser.user_metadata?.sanctuary_website || '',
              sanctuary_phone: authUser.user_metadata?.sanctuary_phone || '',
              verification_documents: authUser.user_metadata?.verification_documents || [],
              sanctuary_photos: authUser.user_metadata?.sanctuary_photos || [],
              verification_status: 'pending'
            }),
            ...updates
          })
        });
        
        if (createResponse.ok) {
          const data = await createResponse.json();
          console.log('Raw user service: new user created:', data);
          return { data: data[0], error: null };
        } else {
          const errorData = await createResponse.json();
          console.error('Raw user service: create user error:', errorData);
          return { data: null, error: errorData };
        }
      } else {
        const errorData = await updateResponse.json();
        console.error('Raw user service: update user error:', errorData);
        return { data: null, error: errorData };
      }
    } catch (err) {
      console.error('Raw user service: updateCurrentUser error', err);
      return { data: null, error: err };
    }
  }
}; 