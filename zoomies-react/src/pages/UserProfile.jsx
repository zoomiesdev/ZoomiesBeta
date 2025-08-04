import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CameraPixel from './CameraPixel.png';
import MoviePixel from './MoviePixel.png';

// Mock data for user profile
const USER_DATA = {
  name: 'Lianna Graham',
  username: '@liannagraham',
  avatar: 'https://picsum.photos/100/100?random=2',
  coverPhoto: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=300&fit=crop&crop=center',
  bio: 'Passionate animal advocate and sanctuary supporter. Making the world better for all creatures, one donation at a time! 🐾',
  location: 'San Francisco, CA',
  joinedDate: 'March 2023',
  totalDonated: 1250,
  animalsHelped: 47,
  followers: 892,
  following: 156,
  level: 8,
  xp: 2840,
  nextLevelXp: 3200,
  feeling: 'Happy',
  feelingEmoji: '😊',
  feelingDescription: 'Feeling great today!'
};

const BADGES = [
  { name: 'Donor', icon: '💖', description: 'Made first donation', earned: '2024-01-15' },
  { name: 'Event Attendee', icon: '🎟️', description: 'Attended 5 events', earned: '2024-02-20' },
  { name: 'Advocate', icon: '📢', description: 'Shared 50+ posts', earned: '2024-03-10' },
  { name: 'Premium', icon: '🌟', description: 'Premium member', earned: '2024-04-01' },
  { name: 'Fundraiser', icon: '💰', description: 'Raised $500+', earned: '2024-05-15' },
  { name: 'Volunteer', icon: '🤝', description: 'Volunteered 20+ hours', earned: '2024-06-01' }
];

const FOLLOWED_ANIMALS = [
  { name: 'Stompy', type: 'Goat', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=60&h=60&fit=crop&crop=center', sanctuary: 'Alveus Sanctuary', status: 'Active' },
  { name: 'Luna', type: 'Cow', image: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4?w=60&h=60&fit=crop&crop=center', sanctuary: 'Gentle Barn', status: 'Recovering' },
  { name: 'Bella', type: 'Pig', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=60&h=60&fit=crop&crop=center', sanctuary: 'Farm Sanctuary', status: 'Thriving' }
];

const FOLLOWED_SANCTUARIES = [
  { name: 'Alveus Sanctuary', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=60&h=60&fit=crop&crop=center', location: 'Austin, TX', animals: 47 },
  { name: 'Gentle Barn', image: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4?w=60&h=60&fit=crop&crop=center', location: 'Santa Clarita, CA', animals: 89 },
  { name: 'Farm Sanctuary', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=60&h=60&fit=crop&crop=center', location: 'Watkins Glen, NY', animals: 156 }
];

const USER_POSTS = [
  { 
    id: 1, 
    content: 'Just visited Alveus Sanctuary today! The animals are doing amazing. Stompy was so happy to see us! 🐐 #sanctuarylife', 
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
    time: '2 hours ago',
    likes: 24,
    comments: 8,
    shares: 3
  },
  { 
    id: 2, 
    content: 'Volunteering at the local animal shelter this weekend. Every little bit helps! 🐕 #volunteer #animalwelfare', 
    image: null,
    time: '1 day ago',
    likes: 18,
    comments: 5,
    shares: 2
  },
  { 
    id: 3, 
    content: 'Look at this adorable kitten I met today! She was so playful and full of energy. Can\'t wait to see her find her forever home! 😺', 
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&crop=center',
    time: '3 days ago',
    likes: 42,
    comments: 12,
    shares: 7
  },
  { 
    id: 4, 
    content: 'Started my fundraiser for Luna\'s surgery! Please help if you can. Every donation counts! 💕', 
    image: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4?w=400&h=300&fit=crop&crop=center',
    time: '1 week ago',
    likes: 56,
    comments: 15,
    shares: 12
  }
];

const GALLERY_IMAGES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop&crop=center', caption: 'Stompy at Alveus' },
  { id: 2, url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop&crop=center', caption: 'Adorable kitten' },
  { id: 3, url: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4?w=300&h=300&fit=crop&crop=center', caption: 'Luna the cow' },
  { id: 4, url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300&h=300&fit=crop&crop=center', caption: 'Bella the pig' },
  { id: 5, url: 'https://images.unsplash.com/photo-1543852786-1cf6624b998d?w=300&h=300&fit=crop&crop=center', caption: 'Volunteering day' },
  { id: 6, url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300&h=300&fit=crop&crop=center', caption: 'Sanctuary visit' },
  { id: 7, url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop&crop=center', caption: 'Dog training' },
  { id: 8, url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=300&fit=crop&crop=center', caption: 'Cat cuddles' },
  { id: 9, url: 'https://images.unsplash.com/photo-1529429617124-5b1096d02c13?w=300&h=300&fit=crop&crop=center', caption: 'Rescue mission' }
];

const FUNDRAISERS = [
  { name: 'Help Luna Get Surgery', goal: 2500, raised: 1800, daysLeft: 5, image: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4?w=200&h=120&fit=crop&crop=center' },
  { name: 'Stompy\'s Medical Fund', goal: 2000, raised: 815, daysLeft: 12, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=120&fit=crop&crop=center' }
];

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [profile, setProfile] = useState({
    ...USER_DATA
  });
  const [editState, setEditState] = useState({
    name: profile.name,
    bio: profile.bio,
    avatar: profile.avatar,
    coverPhoto: profile.coverPhoto,
    avatarFile: null,
    coverFile: null,
    headerType: 'image', // 'image' or 'color'
    headerColor: '#6366f1',
    headerImage: profile.coverPhoto
  });
  const [newPost, setNewPost] = useState({
    content: '',
    image: null,
    gif: null,
    poll: null
  });
  const [showFeelingEdit, setShowFeelingEdit] = useState(false);
  const [feelingEditState, setFeelingEditState] = useState({
    feeling: profile.feeling,
    feelingEmoji: profile.feelingEmoji,
    feelingDescription: profile.feelingDescription
  });
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [customizeState, setCustomizeState] = useState({
    backgroundType: 'color', // 'color' or 'image'
    backgroundColor: '#ffffff',
    backgroundImage: null,
    textColor: '#18171C',
    buttonColor: '#6366f1',
    headerColor: '#18171C',
    leftSidebarWidgets: ['feelings', 'bestFriends'],
    rightSidebarWidgets: ['quickStats', 'recentActivity']
  });

  const handleEditProfile = () => {
    setEditState({
      name: profile.name,
      bio: profile.bio,
      avatar: profile.avatar,
      coverPhoto: profile.coverPhoto,
      avatarFile: null,
      coverFile: null,
      headerType: 'image',
      headerColor: '#6366f1',
      headerImage: profile.coverPhoto
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditState((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setEditState((prev) => ({ ...prev, [name]: url, [`${name}File`]: files[0] }));
    }
  };

  const handleHeaderImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditState(prev => ({ 
          ...prev, 
          headerImage: e.target.result,
          headerType: 'image'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    setProfile((prev) => ({
      ...prev,
      name: editState.name,
      bio: editState.bio,
      avatar: editState.avatar,
      coverPhoto: editState.coverPhoto,
      headerType: editState.headerType,
      headerColor: editState.headerColor,
      headerImage: editState.headerImage
    }));
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  // Post creation handlers
  const handlePostImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPost(prev => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostGifChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPost(prev => ({ ...prev, gif: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPost = () => {
    if (newPost.content.trim()) {
      // Add post to timeline (in a real app, this would save to backend)
      console.log('New post:', newPost);
      setNewPost({
        content: '',
        image: null,
        gif: null,
        poll: null
      });
      setShowPostModal(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setFeelingEditState(prev => ({ ...prev, feelingEmoji: emoji }));
  };

  const handleSaveFeeling = () => {
    setProfile(prev => ({
      ...prev,
      feeling: feelingEditState.feeling,
      feelingEmoji: feelingEditState.feelingEmoji,
      feelingDescription: feelingEditState.feelingDescription
    }));
    setShowFeelingEdit(false);
  };

  const handleCancelFeeling = () => {
    setFeelingEditState({
      feeling: profile.feeling,
      feelingEmoji: profile.feelingEmoji,
      feelingDescription: profile.feelingDescription
    });
    setShowFeelingEdit(false);
  };

  const handleBackgroundImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomizeState(prev => ({ 
          ...prev, 
          backgroundImage: e.target.result,
          backgroundType: 'image'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomize = () => {
    // Save the customization settings
    setShowCustomizeModal(false);
  };

  const handleCancelCustomize = () => {
    setCustomizeState({
      backgroundType: 'color',
      backgroundColor: '#ffffff',
      backgroundImage: null,
      textColor: '#18171C',
      buttonColor: '#6366f1',
      headerColor: '#18171C',
      leftSidebarWidgets: ['feelings', 'bestFriends'],
      rightSidebarWidgets: ['quickStats', 'recentActivity']
    });
    setShowCustomizeModal(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--background)',
      paddingTop: 0
    }}>
      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="edit-modal" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(24, 23, 28, 0.35)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: '2.5rem 2rem 2rem 2rem',
            minWidth: 350,
            maxWidth: 400,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: 'var(--primary)' }}>
              Edit Profile
            </div>
            {/* Header Customization */}
            <div style={{ width: '100%', marginBottom: 18 }}>
              <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: 'block' }}>Header</label>
              
              {/* Header Type Toggle */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  onClick={() => setEditState(prev => ({ ...prev, headerType: 'image' }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--gray)',
                    background: editState.headerType === 'image' ? 'var(--primary)' : 'transparent',
                    color: editState.headerType === 'image' ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  Image
                </button>
                <button
                  onClick={() => setEditState(prev => ({ ...prev, headerType: 'color' }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--gray)',
                    background: editState.headerType === 'color' ? 'var(--primary)' : 'transparent',
                    color: editState.headerType === 'color' ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  Color
                </button>
              </div>

              {/* Image Header Option */}
              {editState.headerType === 'image' && (
              <div className="cover-preview" style={{ position: 'relative', width: '100%', height: 90, background: '#f8f6ff', borderRadius: 12, overflow: 'hidden', marginBottom: 8, border: '1px solid var(--gray)' }}>
                  <img src={editState.headerImage} alt="Header Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <input type="file" accept="image/*" onChange={handleHeaderImageChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                <span style={{ position: 'absolute', bottom: 6, right: 10, background: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: '2px 8px', fontSize: 12, color: 'var(--primary)' }}>Change</span>
              </div>
              )}

              {/* Color Header Option */}
              {editState.headerType === 'color' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: '100%',
                    height: 90,
                    background: editState.headerColor,
                    borderRadius: 12,
                    border: '1px solid var(--gray)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600
                  }}>
                    Header Color
                  </div>
                  <input
                    type="color"
                    value={editState.headerColor}
                    onChange={(e) => setEditState(prev => ({ ...prev, headerColor: e.target.value }))}
                    style={{
                      width: 50,
                      height: 50,
                      border: '1px solid var(--gray)',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  />
                </div>
              )}
            </div>
            {/* Avatar */}
            <div style={{ width: '100%', marginBottom: 18 }}>
              <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: 'block' }}>Profile Picture</label>
              <div className="avatar-preview" style={{ position: 'relative', width: 70, height: 70, margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                <img src={editState.avatar} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <input type="file" accept="image/*" name="avatar" onChange={handleImageChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                <span style={{ position: 'absolute', bottom: 2, right: 6, background: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: '2px 8px', fontSize: 12, color: 'var(--primary)' }}>Change</span>
              </div>
            </div>
            {/* Name */}
            <div style={{ width: '100%', marginBottom: 18 }}>
              <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: 'block' }}>Name</label>
              <input type="text" name="name" value={editState.name} onChange={handleEditChange} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gray)', fontSize: 16 }} />
            </div>
            {/* Bio */}
            <div style={{ width: '100%', marginBottom: 24 }}>
              <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: 'block' }}>Bio</label>
              <textarea name="bio" value={editState.bio} onChange={handleEditChange} style={{ width: '100%', minHeight: 60, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gray)', fontSize: 15, resize: 'vertical' }} />
            </div>
            {/* Buttons */}
            <div className="modal-buttons" style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center' }}>
              <button onClick={handleCancelEdit} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveEdit} className="button" style={{ background: 'linear-gradient(90deg, var(--primary), var(--pink))', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 20, padding: '10px 32px', boxShadow: '0 2px 8px rgba(252,151,202,0.08)' }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: '2rem',
            maxWidth: 800,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, color: 'var(--text)' }}>Create Post</h3>
              <button 
                onClick={() => setShowPostModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: 0,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            
            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  objectFit: 'cover' 
                }} 
              />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{profile.name}</div>
                <button style={{
                  background: 'var(--background)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  border: '1px solid var(--border)',
                  fontSize: 12
                }}>
                  🌐 Public ▼
                </button>
              </div>
            </div>

            {/* Post Content */}
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder={`What's on your mind, ${profile.name.split(' ')[0]}?`}
              style={{
                width: '100%',
                minHeight: 120,
                border: 'none',
                background: 'transparent',
                color: 'var(--text)',
                fontSize: 16,
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: 20
              }}
            />
            
            {/* Post Image Preview */}
            {newPost.image && (
              <div style={{ marginBottom: 20, position: 'relative' }}>
                <img 
                  src={newPost.image} 
                  alt="Post preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: 300, 
                    borderRadius: 8,
                    objectFit: 'cover'
                  }} 
                />
                <button 
                  onClick={() => setNewPost(prev => ({ ...prev, image: null }))}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Post GIF Preview */}
            {newPost.gif && (
              <div style={{ marginBottom: 20, position: 'relative' }}>
                <img 
                  src={newPost.gif} 
                  alt="GIF preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: 300, 
                    borderRadius: 8,
                    objectFit: 'cover'
                  }} 
                />
                <button 
                  onClick={() => setNewPost(prev => ({ ...prev, gif: null }))}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Add to your post section */}
            <div style={{ 
              padding: '16px 0',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              marginBottom: 20
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                Add to your post
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <button 
                  onClick={() => document.getElementById('user-post-image-upload').click()}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 14,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--background)';
                    e.target.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = 'var(--text-secondary)';
                  }}
                >
                  <span style={{ color: '#45bd62', fontSize: 18 }}>📷</span>
                  Photo/Video
                </button>
                
                <button 
                  onClick={() => document.getElementById('user-post-gif-upload').click()}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 14,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--background)';
                    e.target.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = 'var(--text-secondary)';
                  }}
                >
                  <span style={{ color: '#1877f2', fontSize: 18 }}>🎬</span>
                  GIF
                </button>
              </div>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              accept="image/*"
              onChange={handlePostImageChange}
              style={{ display: 'none' }}
              id="user-post-image-upload"
            />
            <input
              type="file"
              accept="image/gif,video/*"
              onChange={handlePostGifChange}
              style={{ display: 'none' }}
              id="user-post-gif-upload"
            />

            {/* Post Button */}
            <button
              onClick={handleAddPost}
              disabled={!newPost.content.trim()}
              style={{ 
                width: '100%',
                padding: '12px',
                background: newPost.content.trim() ? 'var(--primary)' : 'var(--border)',
                color: newPost.content.trim() ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: newPost.content.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Feeling Edit Modal */}
      {showFeelingEdit && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: '2rem',
            maxWidth: 400,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, color: 'var(--text)' }}>Edit Feeling</h3>
              <button 
                onClick={handleCancelFeeling}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: 0,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Feeling Emoji Section */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 14, 
                fontWeight: 600, 
                color: 'var(--text)', 
                marginBottom: 12 
              }}>
                Feeling Emoji
              </label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 16, 
                marginBottom: 16
              }}>
                <span style={{ fontSize: 32 }}>{feelingEditState.feelingEmoji}</span>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(6, 1fr)', 
                gap: 8,
                maxHeight: '200px',
                overflow: 'auto',
                width: '100%'
              }}>
                {['🤪', '😊', '😄', '😍', '🥰', '😴', '😎', '🤗', '😌', '🤩', '😋', '😝', '🤔', '😏', '😇', '🤠', '👻', '🤖', '🐱', '🐶', '🐰', '🐼', '🐨', '🐯'].map((emoji, index) => (
                  <button 
                    key={index}
                    onClick={() => handleEmojiSelect(emoji)}
                    style={{ 
                      background: feelingEditState.feelingEmoji === emoji ? 'var(--primary)' : 'none',
                      border: feelingEditState.feelingEmoji === emoji ? 'none' : '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 20,
                      cursor: 'pointer',
                      padding: 8,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      color: feelingEditState.feelingEmoji === emoji ? 'white' : 'var(--text)'
                    }}
                    onMouseEnter={(e) => {
                      if (feelingEditState.feelingEmoji !== emoji) {
                        e.target.style.background = 'var(--primary)';
                        e.target.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (feelingEditState.feelingEmoji !== emoji) {
                        e.target.style.background = 'none';
                        e.target.style.color = 'var(--text)';
                      }
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Feeling Description Section */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 14, 
                fontWeight: 600, 
                color: 'var(--text)', 
                marginBottom: 8 
              }}>
                Feeling
              </label>
              <input
                type="text"
                value={feelingEditState.feeling}
                onChange={(e) => setFeelingEditState(prev => ({ ...prev, feeling: e.target.value }))}
                placeholder="How are you feeling?"
                style={{
                  width: '90%',
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 16,
                  background: 'var(--background)',
                  color: 'var(--text)',
                  outline: 'none'
                }}
              />
            </div>
            
            {/* Feeling Description Section */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 14, 
                fontWeight: 600, 
                color: 'var(--text)', 
                marginBottom: 8 
              }}>
                Description
              </label>
                  <input
                    type="text"
                value={feelingEditState.feelingDescription}
                onChange={(e) => setFeelingEditState(prev => ({ ...prev, feelingDescription: e.target.value }))}
                placeholder="Add a description..."
                    style={{
                  width: '90%',
                  padding: '12px 16px',
                      border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 16,
                      background: 'var(--background)',
                      color: 'var(--text)',
                      outline: 'none'
                    }}
                  />
            </div>
            
            {/* Save Button */}
            <div style={{ 
              display: 'flex', 
              gap: 12, 
              justifyContent: 'flex-end',
              marginTop: 20,
              paddingTop: 20,
              borderTop: '1px solid var(--border)'
            }}>
              <button 
                onClick={handleCancelFeeling}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveFeeling}
                style={{
                  background: 'linear-gradient(90deg, var(--primary), var(--pink))',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize Modal */}
      {showCustomizeModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: '2rem',
            maxWidth: 800,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, color: 'var(--text)' }}>Customize Profile</h3>
              <button 
                onClick={handleCancelCustomize}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: 0,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Background Section */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 14, 
                fontWeight: 600, 
                color: 'var(--text)', 
                marginBottom: 12 
              }}>
                Background
              </label>
              
              {/* Background Type Toggle */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <button
                  onClick={() => setCustomizeState(prev => ({ ...prev, backgroundType: 'color' }))}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: customizeState.backgroundType === 'color' ? 'var(--primary)' : 'transparent',
                    color: customizeState.backgroundType === 'color' ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  Color
                </button>
                <button
                  onClick={() => setCustomizeState(prev => ({ ...prev, backgroundType: 'image' }))}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: customizeState.backgroundType === 'image' ? 'var(--primary)' : 'transparent',
                    color: customizeState.backgroundType === 'image' ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  Image
                </button>
              </div>

              {/* Color Background Option */}
              {customizeState.backgroundType === 'color' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 120,
                    height: 60,
                    background: customizeState.backgroundColor,
                    borderRadius: 8,
                    border: '2px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: 12
                  }}>
                    Background
                  </div>
                  <input
                    type="color"
                    value={customizeState.backgroundColor}
                    onChange={(e) => setCustomizeState(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    style={{
                      width: 60,
                      height: 40,
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  />
                </div>
              )}

              {/* Image Background Option */}
              {customizeState.backgroundType === 'image' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 120,
                    height: 60,
                    background: customizeState.backgroundImage ? `url(${customizeState.backgroundImage})` : 'var(--background)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 8,
                    border: '2px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: 12
                  }}>
                    {customizeState.backgroundImage ? '' : 'Upload Image'}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageChange}
                    style={{
                      width: 200,
                      height: 40,
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: '8px',
                      fontSize: 12
                    }}
                  />
                </div>
              )}
            </div>

            {/* Colors Section */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 14, 
                fontWeight: 600, 
                color: 'var(--text)', 
                marginBottom: 12 
              }}>
                Colors
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {/* Button Color */}
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
                    Button Color
                  </label>
                  <input
                    type="color"
                    value={customizeState.buttonColor}
                    onChange={(e) => setCustomizeState(prev => ({ ...prev, buttonColor: e.target.value }))}
                    style={{
                      width: '100%',
                      height: 40,
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  />
                </div>
                
                {/* Header Text Color */}
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
                    Header Text
                  </label>
                  <input
                    type="color"
                    value={customizeState.headerColor}
                    onChange={(e) => setCustomizeState(prev => ({ ...prev, headerColor: e.target.value }))}
                    style={{
                      width: '100%',
                      height: 40,
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  />
                </div>
                
                {/* Body Text Color */}
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
                    Body Text
                  </label>
                  <input
                    type="color"
                    value={customizeState.textColor}
                    onChange={(e) => setCustomizeState(prev => ({ ...prev, textColor: e.target.value }))}
                    style={{
                      width: '100%',
                      height: 40,
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Widgets Section */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 14, 
                fontWeight: 600, 
                color: 'var(--text)', 
                marginBottom: 12 
              }}>
                Sidebar Widgets
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Left Sidebar */}
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
                    Left 
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { id: 'feelings', label: 'Feelings Widget', icon: '😊' },
                      { id: 'bestFriends', label: 'Best Friends', icon: '👥' },
                      { id: 'musicPlayer', label: 'Music Player', icon: '🎵' },
                      { id: 'showcaseGif', label: 'Showcase Gif', icon: '🎬' },
                      { id: 'showcasePicture', label: 'Showcase Pic', icon: '🖼️' },
                      { id: 'customHtml', label: 'Custom HTML', icon: '⚙️' }
                    ].map(widget => (
                      <label key={widget.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8,
                        padding: '8px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        background: customizeState.leftSidebarWidgets.includes(widget.id) ? 'var(--primary)' : 'var(--card)',
                        color: customizeState.leftSidebarWidgets.includes(widget.id) ? 'white' : 'var(--text)',
                        fontSize: 12
                      }}>
                        <input
                          type="checkbox"
                          checked={customizeState.leftSidebarWidgets.includes(widget.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustomizeState(prev => ({
                                ...prev,
                                leftSidebarWidgets: [...prev.leftSidebarWidgets, widget.id]
                              }));
                            } else {
                              setCustomizeState(prev => ({
                                ...prev,
                                leftSidebarWidgets: prev.leftSidebarWidgets.filter(id => id !== widget.id)
                              }));
                            }
                          }}
                          style={{ margin: 0 }}
                        />
                        <span>{widget.icon}</span>
                        {widget.label}
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Right Sidebar */}
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
                    Right 
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { id: 'feelings', label: 'Feelings Widget', icon: '😊' },
                      { id: 'recentActivity', label: 'Recent Activity', icon: '📝' },
                      { id: 'following', label: 'Following', icon: '👥' },
                      { id: 'musicPlayer', label: 'Music Player', icon: '🎵' },
                      { id: 'showcaseGif', label: 'Showcase Gif', icon: '🎬' },
                      { id: 'showcasePicture', label: 'Showcase Picture', icon: '🖼️' }
                    ].map(widget => (
                      <label key={widget.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8,
                        padding: '8px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        background: customizeState.rightSidebarWidgets.includes(widget.id) ? 'var(--primary)' : 'var(--card)',
                        color: customizeState.rightSidebarWidgets.includes(widget.id) ? 'white' : 'var(--text)',
                        fontSize: 12
                      }}>
                        <input
                          type="checkbox"
                          checked={customizeState.rightSidebarWidgets.includes(widget.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustomizeState(prev => ({
                                ...prev,
                                rightSidebarWidgets: [...prev.rightSidebarWidgets, widget.id]
                              }));
                            } else {
                              setCustomizeState(prev => ({
                                ...prev,
                                rightSidebarWidgets: prev.rightSidebarWidgets.filter(id => id !== widget.id)
                              }));
                            }
                          }}
                          style={{ margin: 0 }}
                        />
                        <span>{widget.icon}</span>
                        {widget.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div style={{ 
              display: 'flex', 
              gap: 12, 
              justifyContent: 'flex-end',
              marginTop: 20,
              paddingTop: 20,
              borderTop: '1px solid var(--border)'
            }}>
              <button 
                onClick={handleCancelCustomize}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveCustomize}
                style={{
                  background: 'linear-gradient(90deg, var(--primary), var(--pink))',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cover Photo */}
      <div style={{ 
        height: 200, 
        background: profile.headerType === 'color' 
          ? profile.headerColor 
          : `url(${profile.headerImage || profile.coverPhoto})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute', 
          bottom: 20, 
          left: 20, 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: 20 
        }}>
          <img 
            src={profile.avatar} 
            alt={profile.name}
            style={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%', 
              border: '4px solid var(--card)',
              objectFit: 'cover'
            }} 
          />
          <div style={{ color: 'white', marginBottom: 10 }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>{profile.name}</h1>
            <p style={{ margin: '4px 0', fontSize: 16, opacity: 0.9 }}>{profile.username}</p>
            <p style={{ margin: '4px 0', fontSize: 14, opacity: 0.8 }}>{profile.location} • Joined {profile.joinedDate}</p>
            </div>
          </div>
        
        {/* Action Buttons */}
        <div style={{ 
          position: 'absolute', 
          bottom: 20, 
          right: 20, 
          display: 'flex', 
          gap: 12 
        }}>
          <button 
            onClick={handleEditProfile}
            className="button" 
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}
          >
            Edit Profile
          </button>
          <button 
            onClick={() => setShowCustomizeModal(true)}
            className="button" 
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}
          >
            Customize
          </button>
          <button className="button" style={{ 
            background: 'rgba(255,255,255,0.2)', 
            color: 'white', 
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s'
          }}>
            Share
          </button>
        </div>
      </div>

            {/* Profile Content */}
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: '300px 1fr 300px',
        gap: 24,
        background: customizeState.backgroundType === 'color' 
          ? customizeState.backgroundColor 
          : customizeState.backgroundImage 
            ? `url(${customizeState.backgroundImage})` 
            : '#ffffff',
        backgroundSize: customizeState.backgroundType === 'image' ? 'cover' : 'auto',
        backgroundPosition: customizeState.backgroundType === 'image' ? 'center' : 'auto'
      }}>
        {/* Left Sidebar */}
        <div>
          {/* About Section */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: 12, 
            padding: 24, 
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: customizeState.headerColor, fontSize: 18 }}>About</h3>
            <p style={{ 
              color: customizeState.textColor, 
              fontSize: 14, 
              lineHeight: 1.6, 
              margin: '0 0 20px 0' 
            }}>
              {profile.bio}
            </p>
            
            {/* Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 16, 
              paddingTop: 20,
              borderTop: '1px solid var(--border)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: customizeState.buttonColor }}>{profile.followers}</div>
                <div style={{ fontSize: 12, color: customizeState.textColor }}>Followers</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: customizeState.buttonColor }}>{profile.following}</div>
                <div style={{ fontSize: 12, color: customizeState.textColor }}>Following</div>
              </div>
            </div>
          </div>

                    {/* Feelings Widget */}
          {customizeState.leftSidebarWidgets.includes('feelings') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, color: customizeState.headerColor, fontSize: 16 }}>{profile.name.split(' ')[0]} Is Feeling:</h3>
                <button 
                  onClick={() => setShowFeelingEdit(true)}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    padding: 4,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }} 
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--text-secondary)';
                  }}
                >
                  ✏️
                </button>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                padding: '12px',
                background: 'var(--background)',
                borderRadius: 8,
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: 24 }}>{profile.feelingEmoji}</div>
                <div>
                  <div style={{ color: customizeState.textColor, fontWeight: 500, fontSize: 12 }}>{profile.feeling}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{profile.feelingDescription}</div>
                </div>
              </div>
            </div>
          )}

          {/* Best Friends Widget */}
          {customizeState.leftSidebarWidgets.includes('bestFriends') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: customizeState.headerColor, fontSize: 16 }}>Best Friends</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Sarah', 'Mike', 'Emma'].map((friend, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: `hsl(${index * 120}, 70%, 60%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 600
                    }}>
                      {friend.charAt(0)}
                    </div>
                    <span style={{ color: customizeState.textColor, fontSize: 14 }}>{friend}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Music Player Widget */}
          {customizeState.leftSidebarWidgets.includes('musicPlayer') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: customizeState.headerColor, fontSize: 16 }}>🎵 Now Playing</h3>
              <div style={{ 
                background: 'var(--background)', 
                borderRadius: 8, 
                padding: 12,
                border: '1px solid var(--border)'
              }}>
                <div style={{ color: customizeState.textColor, fontWeight: 600, fontSize: 12 }}>Animal Sanctuary Vibes</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 10 }}>Peaceful Nature Sounds</div>
                <div style={{ 
                  width: '100%', 
                  height: 4, 
                  background: 'var(--border)', 
                  borderRadius: 2, 
                  marginTop: 8,
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '65%', 
                    height: '100%', 
                    background: customizeState.buttonColor,
                    borderRadius: 2
                  }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Showcase GIF Widget */}
          {customizeState.leftSidebarWidgets.includes('showcaseGif') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: customizeState.headerColor, fontSize: 16 }}>🎬 Showcase GIF</h3>
              <div style={{ 
                width: '100%', 
                height: 120, 
                background: 'var(--background)', 
                borderRadius: 8,
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: 12
              }}>
                Upload GIF
              </div>
            </div>
          )}

          {/* Showcase Picture Widget */}
          {customizeState.leftSidebarWidgets.includes('showcasePicture') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: customizeState.headerColor, fontSize: 16 }}>🖼️ Showcase Picture</h3>
              <div style={{ 
                width: '100%', 
                height: 120, 
                background: 'var(--background)', 
                borderRadius: 8,
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: 12
              }}>
                Upload Picture
              </div>
            </div>
          )}

          {/* Custom HTML Widget */}
          {customizeState.leftSidebarWidgets.includes('customHtml') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: customizeState.headerColor, fontSize: 16 }}>⚙️ Custom Widget</h3>
              <div style={{ 
                background: 'var(--background)', 
                borderRadius: 8, 
                padding: 12,
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: 12
              }}>
                <div style={{ marginBottom: 8 }}>Add your custom HTML here</div>
                <textarea 
                  placeholder="Enter custom HTML..."
                  style={{
                    width: '100%',
                    height: 80,
                    border: 'none',
                    background: 'transparent',
                    color: customizeState.textColor,
                    fontSize: 10,
                    resize: 'none',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}
      </div>

        {/* Main Timeline */}
        <div>

      {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: 0, 
            marginBottom: 24,
            background: 'var(--card)',
            borderRadius: 12,
            padding: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            {['timeline', 'badges', 'gallery', 'fundraisers'].map(tab => (
          <button
                key={tab}
                onClick={() => setActiveTab(tab)}
            style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: activeTab === tab ? customizeState.buttonColor : 'transparent',
                  color: activeTab === tab ? 'white' : customizeState.textColor,
              border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
              fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: 12, 
            padding: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
          {activeTab === 'timeline' && (
              <div>
                {/* Post Creation Area */}
                <div style={{ 
                  background: 'var(--background)', 
                  borderRadius: 12, 
                  padding: 20, 
                  marginBottom: 24, 
                  border: '1px solid var(--border)'
                }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <img 
                      src={profile.avatar} 
                      alt={profile.name} 
                      style={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }} 
                    />
                  <div style={{ flex: 1 }}>
                    <div 
                      onClick={() => setShowPostModal(true)}
                      style={{
                        width: '95%',
                                    minHeight: 40,
                        border: 'none',
                        background: 'transparent',
                        fontSize: 16,
                        resize: 'vertical',
                        outline: 'none',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                                    color: customizeState.textColor,
                        cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    border: '1px solid var(--border)'
                      }}
                    >
                                  What's on your mind, {profile.name.split(' ')[0]}?
                    </div>
                  </div>
                </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                    <button 
                      onClick={() => setShowPostModal(true)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontSize: 16,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          color: 'var(--text-secondary)',
                          padding: '8px 12px',
                          borderRadius: 6,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--card)';
                          e.target.style.color = 'var(--text)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'none';
                          e.target.style.color = 'var(--text-secondary)';
                        }}
                      >
                        <img 
                          src={CameraPixel} 
                          alt="Camera" 
                          style={{ width: 24, height: 24 }}
                        />
                        Photo/Video
                    </button>
                    <button 
                      onClick={() => setShowPostModal(true)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontSize: 16,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          color: 'var(--text-secondary)',
                          padding: '8px 12px',
                          borderRadius: 6,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--card)';
                          e.target.style.color = 'var(--text)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'none';
                          e.target.style.color = 'var(--text-secondary)';
                        }}
                      >
                        <img 
                          src={MoviePixel} 
                          alt="Movie" 
                          style={{ width: 20, height: 20 }}
                        />
                        GIF
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowPostModal(true)}
                    className="button" 
                      style={{ 
                        padding: '8px 16px', 
                        fontSize: 14,
                        background: customizeState.buttonColor,
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                  >
                    Post
                  </button>
                </div>
              </div>
              
                <h3 style={{ margin: '0 0 20px 0', color: customizeState.headerColor }}>Posts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {USER_POSTS.map((post) => (
                    <div key={post.id} style={{ 
                      background: 'var(--background)', 
                      borderRadius: 12, 
                      padding: 16,
                      border: '1px solid var(--border)'
                    }}>
                      {/* Post Header */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 12, 
                        marginBottom: 12 
                      }}>
                        <img 
                          src={profile.avatar} 
                          alt={profile.name}
                          style={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }} 
                        />
                        <div>
                          <div style={{ color: customizeState.headerColor, fontWeight: 600, fontSize: 14 }}>{profile.name}</div>
                          <div style={{ color: customizeState.textColor, fontSize: 12 }}>{post.time}</div>
                  </div>
                </div>

                      {/* Post Content */}
                      <p style={{ 
                        color: customizeState.textColor, 
                        fontSize: 14, 
                        lineHeight: 1.5, 
                        margin: '0 0 12px 0' 
                      }}>
                        {post.content}
                      </p>
                      
                      {/* Post Image */}
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt="Post"
                          style={{ 
                            width: '100%', 
                            height: 200, 
                            objectFit: 'cover',
                            borderRadius: 8,
                            marginBottom: 12
                          }} 
                        />
                      )}
                      
                      {/* Post Actions */}
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        paddingTop: 12,
                        borderTop: '1px solid var(--border)'
                      }}>
                        <button className="button" style={{ 
                          background: 'transparent', 
                          color: 'var(--text)', 
                          padding: '8px 12px', 
                        fontSize: 14,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}>
                          ❤️ {post.likes}
                        </button>
                        <button className="button" style={{ 
                          background: 'transparent', 
                          color: 'var(--text)', 
                          padding: '8px 12px', 
                          fontSize: 14,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}>
                          💬 {post.comments}
                        </button>
                        <button className="button" style={{ 
                          background: 'transparent', 
                          color: 'var(--text)', 
                          padding: '8px 12px', 
                          fontSize: 14,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}>
                          🔄 {post.shares}
                        </button>
                    </div>
                  </div>
                  ))}
                  </div>
                </div>
          )}

          {activeTab === 'badges' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)' }}>Badges Earned</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  {BADGES.map((badge, index) => (
                    <div key={index} style={{ 
                      background: 'var(--background)', 
                      borderRadius: 8, 
                      padding: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}>
                      <div style={{ fontSize: 32 }}>{badge.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{badge.name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 4 }}>{badge.description}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Earned {badge.earned}</div>
                    </div>
                  </div>
                ))}
                  </div>
                </div>
          )}

            {activeTab === 'gallery' && (
                    <div>
                <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)' }}>Photo Gallery</h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: 16 
                }}>
                  {GALLERY_IMAGES.map((image) => (
                    <div key={image.id} style={{ 
                      background: 'var(--background)', 
                      borderRadius: 8, 
                      overflow: 'hidden',
                      border: '1px solid var(--border)'
                    }}>
                      <img 
                        src={image.url} 
                        alt={image.caption}
                        style={{ 
                          width: '100%', 
                          height: 200, 
                          objectFit: 'cover'
                        }} 
                      />
                      <div style={{ padding: 12 }}>
                        <p style={{ 
                          color: 'var(--text)', 
                          fontSize: 14, 
                          margin: 0,
                          textAlign: 'center'
                        }}>
                          {image.caption}
                        </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fundraisers' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)' }}>Active Fundraisers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {FUNDRAISERS.map((fundraiser, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      gap: 16,
                      padding: '16px',
                      background: 'var(--background)',
                      borderRadius: 8
                    }}>
                      <img 
                        src={fundraiser.image} 
                        alt={fundraiser.name}
                        style={{ 
                          width: 80, 
                          height: 60, 
                          borderRadius: 8,
                          objectFit: 'cover'
                        }} 
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>{fundraiser.name}</h4>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                            <span style={{ color: 'var(--text)' }}>${fundraiser.raised} / ${fundraiser.goal}</span>
                  </div>
                          <div style={{ 
                            width: '100%', 
                            height: 6, 
                            background: 'var(--gray)', 
                            borderRadius: 3,
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${(fundraiser.raised / fundraiser.goal) * 100}%`, 
                              height: '100%', 
                              background: 'var(--primary)',
                              borderRadius: 3
                            }} />
                </div>
                  </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                          {fundraiser.daysLeft} days left
                </div>
                  </div>
                </div>
                ))}
                  </div>
            </div>
          )}
                </div>
              </div>



        {/* Right Sidebar */}
        <div>
          {/* Quick Stats Widget */}
          {customizeState.rightSidebarWidgets.includes('quickStats') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: customizeState.headerColor, fontSize: 16 }}>Quick Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: customizeState.textColor, fontSize: 14 }}>Level</span>
                  <span style={{ color: customizeState.buttonColor, fontWeight: 600, fontSize: 14 }}>{profile.level}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: customizeState.textColor, fontSize: 14 }}>XP</span>
                  <span style={{ color: customizeState.buttonColor, fontWeight: 600, fontSize: 14 }}>{profile.xp}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: customizeState.textColor, fontSize: 14 }}>Total Donated</span>
                  <span style={{ color: customizeState.buttonColor, fontWeight: 600, fontSize: 14 }}>${profile.totalDonated}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: customizeState.textColor, fontSize: 14 }}>Animals Helped</span>
                  <span style={{ color: customizeState.buttonColor, fontWeight: 600, fontSize: 14 }}>{profile.animalsHelped}</span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Widget */}
          {customizeState.rightSidebarWidgets.includes('recentActivity') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: customizeState.headerColor, fontSize: 16 }}>Recent Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: customizeState.buttonColor }}></div>
                  <span style={{ color: customizeState.textColor, fontSize: 12 }}>Donated to Luna's surgery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: customizeState.buttonColor }}></div>
                  <span style={{ color: customizeState.textColor, fontSize: 12 }}>Visited Alveus Sanctuary</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: customizeState.buttonColor }}></div>
                  <span style={{ color: customizeState.textColor, fontSize: 12 }}>Shared a post</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: customizeState.buttonColor }}></div>
                  <span style={{ color: customizeState.textColor, fontSize: 12 }}>Earned "Donor" badge</span>
                </div>
              </div>
            </div>
          )}

          {/* Following List Widget */}
          {customizeState.rightSidebarWidgets.includes('followingList') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: customizeState.headerColor, fontSize: 16 }}>Following</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {FOLLOWED_ANIMALS.slice(0, 3).map((animal, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img 
                      src={animal.image} 
                      alt={animal.name}
                      style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: customizeState.textColor, fontWeight: 500, fontSize: 12 }}>{animal.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{animal.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Music Player Widget */}
          {customizeState.rightSidebarWidgets.includes('musicPlayer') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: customizeState.headerColor, fontSize: 16 }}>🎵 Now Playing</h3>
              <div style={{ 
                background: 'var(--background)', 
                borderRadius: 8, 
                padding: 12,
                border: '1px solid var(--border)'
              }}>
                <div style={{ color: customizeState.textColor, fontWeight: 600, fontSize: 12 }}>Animal Sanctuary Vibes</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 10 }}>Peaceful Nature Sounds</div>
                <div style={{ 
                  width: '100%', 
                  height: 4, 
                  background: 'var(--border)', 
                  borderRadius: 2, 
                  marginTop: 8,
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '65%', 
                    height: '100%', 
                    background: customizeState.buttonColor,
                    borderRadius: 2
                  }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Showcase GIF Widget */}
          {customizeState.rightSidebarWidgets.includes('showcaseGif') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ 
                width: '100%', 
                height: 120, 
                background: 'var(--background)', 
                borderRadius: 8,
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: 12
              }}>
                Upload GIF
              </div>
            </div>
          )}

          {/* Custom HTML Widget */}
          {customizeState.rightSidebarWidgets.includes('customHtml') && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: customizeState.headerColor, fontSize: 16 }}>⚙️ Custom Widget</h3>
              <div style={{ 
                background: 'var(--background)', 
                borderRadius: 8, 
                padding: 12,
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: 12
              }}>
                <div style={{ marginBottom: 8 }}>Add your custom HTML here</div>
                <textarea 
                  placeholder="Enter custom HTML..."
                  style={{
                    width: '100%',
                    height: 80,
                    border: 'none',
                    background: 'transparent',
                    color: customizeState.textColor,
                    fontSize: 10,
                    resize: 'none',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 