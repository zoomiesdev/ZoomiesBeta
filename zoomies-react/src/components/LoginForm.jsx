import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginForm({ onSwitchToSignup, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        onClose?.();
      }
    } catch (err) {
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
        <h2 style={{ margin: 0, color: 'var(--text)', fontSize: 24 }}>Welcome Back!</h2>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>
          Sign in to your Zoomies account
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div style={{ marginBottom: 24 }}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            placeholder="Enter your password"
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
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
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
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
} 