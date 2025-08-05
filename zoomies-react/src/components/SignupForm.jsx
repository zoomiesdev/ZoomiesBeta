import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

export default function SignupForm({ onSwitchToLogin, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Sign up with Supabase Auth
      const { data, error } = await signUp(formData.email, formData.password, {
        username: formData.username,
        full_name: formData.fullName
      });

      if (error) {
        setError(error.message);
      } else {
        console.log('Auth signup successful:', data);
        
        // Wait a moment for the session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create user profile in our users table
        const userData = {
          auth_id: data.user.id,
          username: formData.username,
          email: formData.email,
          bio: 'New Zoomies member! 🐾',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`
        };

        console.log('Creating user profile with data:', userData);
        const { data: profileData, error: profileError } = await userService.createUserWithFunction(userData);
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
          setError(`Profile setup failed: ${profileError.message}`);
        } else {
          console.log('Profile created successfully:', profileData);
          onClose?.();
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 16,
      padding: '40px 32px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      maxWidth: 400,
      width: '100%'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ margin: 0, color: 'var(--text)', fontSize: 24 }}>Join Zoomies!</h2>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>
          Create your account to start helping animals
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 8, 
            color: 'var(--text)',
            fontWeight: 500 
          }}>
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={{
              width: 'calc(100% - 32px)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: 16
            }}
            placeholder="Enter your full name"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 8, 
            color: 'var(--text)',
            fontWeight: 500 
          }}>
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              width: 'calc(100% - 32px)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: 16
            }}
            placeholder="Choose a username"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 8, 
            color: 'var(--text)',
            fontWeight: 500 
          }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: 'calc(100% - 32px)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: 16
            }}
            placeholder="Enter your email"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 8, 
            color: 'var(--text)',
            fontWeight: 500 
          }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: 'calc(100% - 32px)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: 16
            }}
            placeholder="Create a password"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 8, 
            color: 'var(--text)',
            fontWeight: 500 
          }}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              width: 'calc(100% - 32px)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: 16
            }}
            placeholder="Confirm your password"
          />
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            color: '#ff6b6b',
            padding: '12px 16px',
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: 16
          }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'underline'
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
} 