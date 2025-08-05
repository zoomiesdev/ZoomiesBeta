import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

export default function UserProfileEdit({ onClose, onSave }) {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    avatar: '',
    cover_photo: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        avatar: user.avatar || '',
        cover_photo: user.cover_photo || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll use a placeholder. In a real app, you'd upload to Supabase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await userService.updateUser(user.id, formData);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Profile updated successfully!');
        updateUserProfile(formData); // Update user data without causing logout
        onSave?.();
        setTimeout(() => {
          onClose?.();
        }, 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        background: 'var(--card)',
        borderRadius: 16,
        padding: '40px 32px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: 500,
        width: '100%'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Please log in to edit your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 16,
      padding: '40px 32px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      maxWidth: 500,
      width: '100%'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ margin: 0, color: 'var(--text)', fontSize: 24 }}>Edit Profile</h2>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>
          Update your Zoomies profile information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Avatar Section */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            margin: '0 auto 16px',
            background: 'var(--gray)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '3px solid var(--border)'
          }}>
            {formData.avatar ? (
              <img 
                src={formData.avatar} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: 40 }}>👤</span>
            )}
          </div>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload" style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500
          }}>
            Change Avatar
          </label>
        </div>

        {/* Username */}
        <div style={{ marginBottom: 20 }}>
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
            style={{
              width: 'calc(100% - 32px)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: 16,
              fontFamily: 'inherit'
            }}
            placeholder="Enter your username..."
            maxLength={30}
          />
        </div>

        {/* Bio */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 8, 
            color: 'var(--text)',
            fontWeight: 500 
          }}>
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            style={{
              width: 'calc(100% - 32px)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: 16,
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            placeholder="Tell us about yourself..."
            maxLength={500}
          />
          <div style={{ 
            textAlign: 'right', 
            fontSize: 12, 
            color: 'var(--text-secondary)',
            marginTop: 4
          }}>
            {formData.bio.length}/500
          </div>
        </div>

        {/* Location */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 8, 
            color: 'var(--text)',
            fontWeight: 500 
          }}>
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            style={{
              width: 'calc(100% - 32px)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: 16
            }}
            placeholder="Where are you located?"
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

        {success && (
          <div style={{
            background: 'rgba(76, 175, 80, 0.1)',
            color: '#4caf50',
            padding: '12px 16px',
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 14
          }}>
            {success}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px 16px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px 16px',
              background: 'var(--gray)',
              color: 'var(--text)',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 