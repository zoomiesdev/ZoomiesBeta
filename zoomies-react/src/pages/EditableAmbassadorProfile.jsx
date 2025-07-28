import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StompyBanner from '../assets/StompyBanner.png';
import StompyProfilePic from '../assets//StompyProfilePic.png';
import LunaBanner from '../assets/LunaBanner.png';
import LunaProfilePic from '../assets/LunaProfilePic.png';

// Sample data for the ambassador
const animal = {
  name: 'Stompy the Goat',
  species: 'Goat',
  sanctuary: 'Alveus Sanctuary',
  profileImg: StompyProfilePic,
  coverImg: StompyBanner,
  about: "Hi I'm Stompy and I'm a goat who loves headbutts and snacks. I was rescued from a difficult situation and now I live happily at Alveus Sanctuary where I get all the love and care I need.",
  joined: 'August 2023',
  donation: {
    raised: 815,
    goal: 2000
  },
  supporters: [
    { name: 'Pawfect Coffee Co.', amount: 2000 },
    { name: 'Linda S.', amount: 1500 },
    { name: 'CryptoCat DAO', amount: 1250 }
  ],
  gallery: [
    'https://placehold.co/300x300?text=Stompy+1',
    'https://placehold.co/300x300?text=Stompy+2',
    'https://placehold.co/300x300?text=Stompy+3',
    'https://placehold.co/300x300?text=Stompy+4',
    'https://placehold.co/300x300?text=Stompy+5',
    'https://placehold.co/300x300?text=Stompy+6',
    'https://placehold.co/300x300?text=Stompy+7',
    'https://placehold.co/300x300?text=Stompy+8',
    'https://placehold.co/300x300?text=Stompy+9'
  ],
  comments: [
    { user: 'Clara', text: "Stunned by Stompy's beauty! ♥" },
    { user: 'James', text: '👑 1 ♥' },
    { user: 'Emily', text: 'You go, Stomp!' }
  ]
};

const animalStats = {
  feeling: 'Silly',
  feelingEmoji: '🤪',
  feelingUpdate: '2 hours ago',
  age: '3 years',
  location: 'Alveus Sanctuary',
  rescueDate: 'August 2023',
  followers: 1247,
  personality: ['Playful', 'Curious', 'Friendly'],
  needs: ['Medical checkup', 'New toys', 'Special diet']
};

const timelinePosts = [
  {
    id: 1,
    user: animal.name,
    avatar: animal.profileImg,
    date: '2 hours ago',
    content: 'Just had a big bowl of insects — thanks Name for the $25 treat!',
    reactions: { like: 12, love: 8, laugh: 3 },
    comments: [
      { user: 'Clara', text: 'So cute! ♥' },
      { user: 'James', text: 'Love seeing you happy!' }
    ]
  },
  {
    id: 2,
    user: animal.name,
    avatar: animal.profileImg,
    date: '5 hours ago',
    content: 'Thanks Name for the $255 donation yabababadaddboooo',
    reactions: { like: 15, love: 12, laugh: 2 },
    comments: [
      { user: 'Emily', text: 'You deserve it!' }
    ]
  }
];

export default function EditableAmbassadorProfile() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [isDark, setIsDark] = useState(false);
  const [reactions, setReactions] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showFeelingEdit, setShowFeelingEdit] = useState(false);
  const [editState, setEditState] = useState({
    name: animal.name,
    about: animal.about,
    profileImg: animal.profileImg,
    coverImg: animal.coverImg,
    feeling: animalStats.feeling,
    feelingEmoji: animalStats.feelingEmoji
  });
  const [newPost, setNewPost] = useState({
    content: '',
    image: null,
    gif: null,
    poll: null,
    feeling: animalStats.feeling,
    feelingEmoji: animalStats.feelingEmoji
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollQuestion, setPollQuestion] = useState('');

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    updateTheme();
    window.addEventListener('themechange', updateTheme);
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      window.removeEventListener('themechange', updateTheme);
      observer.disconnect();
    };
  }, []);

  const handleReact = (postIdx, type) => {
    setReactions(prev => ({
      ...prev,
      [postIdx]: { ...prev[postIdx], [type]: (prev[postIdx]?.[type] || 0) + 1 }
    }));
  };

  const handleCommentInput = (postIdx, value) => {
    setCommentInputs(prev => ({ ...prev, [postIdx]: value }));
  };

  const handleAddComment = (postIdx) => {
    if (commentInputs[postIdx]?.trim()) {
      timelinePosts[postIdx].comments.push({
        user: 'You',
        text: commentInputs[postIdx]
      });
      setCommentInputs(prev => ({ ...prev, [postIdx]: '' }));
    }
  };

  const handleEditProfile = () => {
    setEditState({
      name: animal.name,
      about: animal.about,
      profileImg: animal.profileImg,
      coverImg: animal.coverImg,
      feeling: animalStats.feeling,
      feelingEmoji: animalStats.feelingEmoji
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditState(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setEditState(prev => ({ ...prev, [name]: url }));
    }
  };

  const handleSaveEdit = () => {
    // Update the animal data with edited values
    animal.name = editState.name;
    animal.about = editState.about;
    animal.profileImg = editState.profileImg;
    animal.coverImg = editState.coverImg;
    animalStats.feeling = editState.feeling;
    animalStats.feelingEmoji = editState.feelingEmoji;
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleSaveFeeling = () => {
    animalStats.feeling = newPost.feeling;
    animalStats.feelingEmoji = newPost.feelingEmoji;
    setShowFeelingEdit(false);
  };

  const handleCancelFeeling = () => {
    setNewPost(prev => ({
      ...prev,
      feeling: animalStats.feeling,
      feelingEmoji: animalStats.feelingEmoji
    }));
    setShowFeelingEdit(false);
  };

  const handleEmojiSelect = (emoji) => {
    setNewPost(prev => ({ ...prev, feelingEmoji: emoji }));
    setEditState(prev => ({ ...prev, feelingEmoji: emoji }));
  };

  const handleAddPost = () => {
    if (newPost.content.trim()) {
      timelinePosts.unshift({
        id: Date.now(),
        user: animal.name,
        avatar: animal.profileImg,
        date: 'Just now',
        content: newPost.content,
        reactions: { like: 0, love: 0, laugh: 0 },
        comments: []
      });
      setNewPost(prev => ({ ...prev, content: '' }));
      setShowPostModal(false);
    }
  };

  const handleProfileFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditState(prev => ({ ...prev, profileImg: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditState(prev => ({ ...prev, coverImg: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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

  return (
      <div style={{ 
      minHeight: '100vh', 
      background: 'var(--background)',
      paddingTop: 0
    }}>
      {/* Edit Profile Modal */}
      {showEditModal && (
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
            padding: '2.5rem 2rem 2rem 2rem',
            minWidth: 400,
            maxWidth: 500,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: 'var(--primary)' }}>
          Edit Profile
      </div>

            {/* Cover Image */}
            <div style={{ width: '100%', marginBottom: 18 }}>
              <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: 'block' }}>Cover Image</label>
              <div style={{ position: 'relative', width: '100%', height: 90, background: '#f8f6ff', borderRadius: 12, overflow: 'hidden', marginBottom: 8, border: '1px solid var(--gray)' }}>
                <img src={editState.coverImg} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <input type="file" accept="image/*" name="coverImg" onChange={handleBannerFileChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                <span style={{ position: 'absolute', bottom: 6, right: 10, background: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: '2px 8px', fontSize: 12, color: 'var(--primary)' }}>Change</span>
            </div>
            </div>

            {/* Profile Image */}
            <div style={{ width: '100%', marginBottom: 18 }}>
              <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: 'block' }}>Profile Picture</label>
              <div style={{ position: 'relative', width: 70, height: 70, margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                <img src={editState.profileImg} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <input type="file" accept="image/*" name="profileImg" onChange={handleProfileFileChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                <span style={{ position: 'absolute', bottom: 2, right: 6, background: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: '2px 8px', fontSize: 12, color: 'var(--primary)' }}>Change</span>
          </div>
        </div>

            {/* Name */}
            <div style={{ width: '100%', marginBottom: 18 }}>
              <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: 'block' }}>Name</label>
              <input type="text" name="name" value={editState.name} onChange={handleEditChange} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gray)', fontSize: 16 }} />
      </div>

            {/* About */}
            <div style={{ width: '100%', marginBottom: 18 }}>
              <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: 'block' }}>About</label>
              <textarea name="about" value={editState.about} onChange={handleEditChange} style={{ width: '100%', minHeight: 60, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gray)', fontSize: 15, resize: 'vertical' }} />
            </div>

            {/* Feeling */}
            <div style={{ width: '100%', marginBottom: 18 }}>
              <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: 'block' }}>Current Feeling</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" name="feelingEmoji" value={editState.feelingEmoji} onChange={handleEditChange} style={{ width: 60, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gray)', fontSize: 16, textAlign: 'center' }} />
                <input type="text" name="feeling" value={editState.feeling} onChange={handleEditChange} style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--gray)', fontSize: 16 }} />
        </div>
      </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center' }}>
              <button onClick={handleCancelEdit} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveEdit} className="button" style={{ background: 'linear-gradient(90deg, var(--primary), var(--pink))', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 20, padding: '10px 32px', boxShadow: '0 2px 8px rgba(252,151,202,0.08)' }}>Save</button>
          </div>
          </div>
        </div>
      )}

      {/* Emoji Picker Modal */}
      {showEmojiPicker && (
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
                onClick={() => setShowEmojiPicker(false)}
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
                <span style={{ fontSize: 32 }}>{editState.feelingEmoji}</span>
                <button 
                  onClick={() => setShowEmojiPicker(true)}
              style={{ 
                    background: 'linear-gradient(90deg, var(--primary), var(--pink))',
                    border: 'none',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Choose Emoji
                </button>
            </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(6, 1fr)', 
                gap: 8,
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {['🤪', '😊', '😄', '😍', '🥰', '😴', '😎', '🤗', '😌', '🤩', '😋', '😝', '🤔', '😏', '😇', '🤠', '👻', '🤖', '🐱', '🐶', '🐰', '🐼', '🐨', '🐯'].map((emoji, index) => (
            <button 
                    key={index}
                    onClick={() => handleEmojiSelect(emoji)}
              style={{ 
                      background: editState.feelingEmoji === emoji ? 'var(--primary)' : 'none',
                      border: editState.feelingEmoji === emoji ? 'none' : '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 20,
                      cursor: 'pointer',
                      padding: 8,
                display: 'flex', 
                alignItems: 'center', 
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      color: editState.feelingEmoji === emoji ? 'white' : 'var(--text)'
                    }}
                    onMouseEnter={(e) => {
                      if (editState.feelingEmoji !== emoji) {
                        e.target.style.background = 'var(--primary)';
                        e.target.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (editState.feelingEmoji !== emoji) {
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
                Feeling Description
              </label>
              <input
                type="text"
                value={editState.feeling}
                onChange={(e) => setEditState(prev => ({ ...prev, feeling: e.target.value }))}
                placeholder="How are you feeling?"
              style={{ 
                  width: '100%',
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
                onClick={() => setShowEmojiPicker(false)}
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
                  onClick={() => {
                    animalStats.feeling = editState.feeling;
                    animalStats.feelingEmoji = editState.feelingEmoji;
                    setShowEmojiPicker(false);
                  }}
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
            maxWidth: 500,
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
                src={animal.profileImg} 
                alt={animal.name} 
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  objectFit: 'cover' 
                }} 
              />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{animal.name}</div>
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
                placeholder={`What's on your mind, ${animal.name.split(' ')[0]}?`}
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

            {/* Poll Preview */}
            {newPost.poll && (
              <div style={{ 
                marginBottom: 20, 
                padding: '16px',
                border: '1px solid var(--border)',
                borderRadius: 8,
                background: 'var(--background)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>📊 Poll</span>
                  <button 
                    onClick={() => setNewPost(prev => ({ ...prev, poll: null }))}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff4444',
                      cursor: 'pointer',
                      fontSize: 16
                    }}
                  >
                    ×
                  </button>
            </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                  {newPost.poll.question}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {newPost.poll.options.map((option, index) => (
                    <div key={index} style={{
                      padding: '8px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      background: 'var(--card)'
                    }}>
                      {option}
                    </div>
                  ))}
                </div>
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
                   onClick={() => document.getElementById('post-image-upload').click()}
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
                  onClick={() => document.getElementById('post-gif-upload').click()}
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
                
                <button 
                  onClick={() => setShowPollCreator(true)}
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
                  <span style={{ color: '#f7b928', fontSize: 18 }}>📊</span>
                  Poll
                </button>
               </div>
             </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              accept="image/*"
              onChange={handlePostImageChange}
              style={{ display: 'none' }}
              id="post-image-upload"
            />
            <input
              type="file"
              accept="image/gif,video/*"
              onChange={handlePostGifChange}
              style={{ display: 'none' }}
              id="post-gif-upload"
            />

            {/* Post Button */}
              <button 
                onClick={() => {
                  handleAddPost();
                  setShowPostModal(false);
                }}
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

      {/* Poll Creator Modal */}
      {showPollCreator && (
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
            maxWidth: 500,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, color: 'var(--text)' }}>Create Poll</h3>
              <button 
                onClick={() => setShowPollCreator(false)}
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

            {/* Poll Question */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ 
                display: 'block', 
                        fontSize: 14,
                fontWeight: 600, 
                color: 'var(--text)', 
                        marginBottom: 8
              }}>
                Poll Question
                </label>
                <input
                  type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask a question..."
                  style={{
                    width: '100%',
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

            {/* Poll Options */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ 
                display: 'block', 
                fontSize: 14, 
                fontWeight: 600, 
                color: 'var(--text)', 
                marginBottom: 12 
              }}>
                Poll Options
                </label>
              {pollOptions.map((option, index) => (
                <div key={index} style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...pollOptions];
                      newOptions[index] = e.target.value;
                      setPollOptions(newOptions);
                    }}
                    placeholder={`Option ${index + 1}`}
                  style={{
                      flex: 1,
                      padding: '8px 12px',
                    border: '1px solid var(--border)',
                      borderRadius: 6,
                      fontSize: 14,
                    background: 'var(--background)',
                    color: 'var(--text)',
                      outline: 'none'
                    }}
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() => {
                        const newOptions = pollOptions.filter((_, i) => i !== index);
                        setPollOptions(newOptions);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff4444',
                        cursor: 'pointer',
                        padding: '8px',
                        fontSize: 16
                      }}
                    >
                      ×
                    </button>
                  )}
              </div>
              ))}
              {pollOptions.length < 6 && (
                <button
                  onClick={() => setPollOptions([...pollOptions, ''])}
                  style={{
                    background: 'none',
                    border: '1px dashed var(--border)',
                    color: 'var(--text-secondary)',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 14,
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  + Add Option
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: 12, 
              justifyContent: 'flex-end',
              marginTop: 20,
              paddingTop: 20,
              borderTop: '1px solid var(--border)'
            }}>
              <button 
                onClick={() => setShowPollCreator(false)}
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
                onClick={() => {
                  if (pollQuestion.trim() && pollOptions.some(opt => opt.trim())) {
                    setNewPost(prev => ({ 
                      ...prev, 
                      poll: {
                        question: pollQuestion,
                        options: pollOptions.filter(opt => opt.trim()),
                        votes: pollOptions.filter(opt => opt.trim()).map(() => 0)
                      }
                    }));
                    setShowPollCreator(false);
                    setPollQuestion('');
                    setPollOptions(['', '']);
                  }
                }}
                disabled={!pollQuestion.trim() || !pollOptions.some(opt => opt.trim())}
                style={{
                  background: pollQuestion.trim() && pollOptions.some(opt => opt.trim()) ? 'linear-gradient(90deg, var(--primary), var(--pink))' : 'var(--border)',
                  border: 'none',
                  color: pollQuestion.trim() && pollOptions.some(opt => opt.trim()) ? 'white' : 'var(--text-secondary)',
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: pollQuestion.trim() && pollOptions.some(opt => opt.trim()) ? 'pointer' : 'not-allowed'
                }}
              >
                Add Poll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cover Photo */}
        <div style={{
        height: 300, 
        background: `url(${animal.coverImg})`, 
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
            src={animal.profileImg} 
            alt={animal.name}
            style={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%', 
              border: '4px solid var(--card)',
              objectFit: 'cover'
            }} 
          />
          <div style={{ color: 'white', marginBottom: 10 }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>{animal.name}</h1>
            <p style={{ margin: '4px 0', fontSize: 16, opacity: 0.9 }}>{animal.species} @ {animal.sanctuary}</p>
            <p style={{ margin: '4px 0', fontSize: 14, opacity: 0.8 }}>Loves headbutts and snacks</p>
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
            onClick={() => window.open('/ambassador-profile', '_blank')}
            className="button" 
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Fundraising Bar */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0 24px' }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: 16,
          padding: '24px', 
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)' }}>${animal.donation.raised} raised</div>
            <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>/ ${animal.donation.goal} goal</div>
            <div style={{ flex: 1 }}>
              <div style={{ width: '100%', height: 8, background: 'var(--gray)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((animal.donation.raised/animal.donation.goal)*100)}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: 4 }} />
              </div>
            </div>
            <div style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 600 }}>{Math.round((animal.donation.raised/animal.donation.goal)*100)}%</div>
          </div>
          {/* Donation Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {[10, 25, 50].map(amount => (
              <button key={amount} className="button" style={{ 
                background: 'var(--primary)', 
                color: '#fff', 
                border: 'none',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                ${amount}
              </button>
            ))}
            <button className="button" style={{ 
              background: 'transparent', 
              color: 'var(--primary)', 
              border: '2px solid var(--primary)',
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Custom
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        padding: '0 24px 24px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: 24
      }}>
        {/* Main Content */}
        <div>
          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '2px solid var(--border)',
            marginBottom: 24
          }}>
            {['Timeline', 'Gallery', 'Comments'].map((tab, index) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === tab.toLowerCase() ? 'var(--primary)' : 'var(--text)',
                  borderBottom: activeTab === tab.toLowerCase() ? '3px solid var(--primary)' : '3px solid transparent',
                  fontWeight: 600,
                  fontSize: 16,
                  padding: '12px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
            </div>

          {/* Tab Content */}
          {activeTab === 'timeline' && (
              <div>
              {/* Feeling Widget */}
              <div style={{ 
                background: 'var(--card)', 
                borderRadius: 16, 
                padding: 20, 
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 32 }}>{animalStats.feelingEmoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--primary)' }}>
                      {animal.name} is feeling: {animalStats.feeling}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Updated {animalStats.feelingUpdate}
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowEmojiPicker(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 18,
                      color: 'var(--text-secondary)',
                      padding: 8,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✏️
                  </button>
                </div>
              </div>

              {/* New Post Section */}
                  <div style={{
                background: 'var(--card)', 
                borderRadius: 16, 
                padding: 20, 
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--background)', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => setShowPostModal(true)}>
                  <img 
                    src={animal.profileImg} 
                    alt={animal.name} 
                    style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      objectFit: 'cover' 
                    }} 
                  />
                  <div style={{ flex: 1, color: 'var(--text-secondary)', fontSize: 16 }}>
                    What's on your mind, {animal.name.split(' ')[0]}?
                  </div>
                </div>
                
                {/* Post Options Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                        <button
                    onClick={() => setShowPostModal(true)}
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
                      fontSize: 14
                    }}
                  >
                    <span style={{ color: '#45bd62', fontSize: 18 }}>📷</span>
                    Photo/Video
                  </button>
                  <button 
                    onClick={() => setShowPostModal(true)}
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
                      fontSize: 14
                    }}
                  >
                    <span style={{ color: '#f7b928', fontSize: 18 }}>😊</span>
                    Feeling
                        </button>
                    </div>
                  </div>

              {/* Timeline Posts */}
              {timelinePosts.map((post, idx) => (
                <div key={post.id} style={{ 
                  background: 'var(--card)', 
                  borderRadius: 16, 
                  padding: 20, 
                  marginBottom: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <img src={post.avatar} alt={post.user} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{post.user}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{post.date}</div>
              </div>
                  </div>
                  <div style={{ marginBottom: 16, color: 'var(--text)' }}>{post.content}</div>
                  
                  {/* Reactions */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    {Object.entries(post.reactions).map(([type, count]) => (
                      <button
                        key={type}
                        onClick={() => handleReact(idx, type)}
                        className="button"
                        style={{ 
                          background: 'var(--background)', 
                          border: '1px solid var(--border)',
                          padding: '4px 8px',
                          borderRadius: 12,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        {type === 'like' ? '👍' : type === 'love' ? '❤️' : '😂'} {count}
                      </button>
                    ))}
                  </div>

                  {/* Comments */}
                  <div style={{ marginTop: 12 }}>
                    {post.comments.map((comment, i) => (
                      <div key={i} style={{ 
                        background: 'var(--background)', 
                        padding: '8px 12px', 
                        borderRadius: 8, 
                        marginBottom: 8 
                      }}>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{comment.user}:</span>
                        <span style={{ color: 'var(--text)' }}> {comment.text}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[idx] || ''}
                        onChange={(e) => handleCommentInput(idx, e.target.value)}
                  style={{
                          flex: 1, 
                          padding: '8px 12px', 
                    borderRadius: 8,
                          border: '1px solid var(--border)',
                    background: 'var(--background)',
                          color: 'var(--text)'
                  }}
                />
              <button 
                        onClick={() => handleAddComment(idx)}
                        className="button"
                style={{
                          background: 'var(--primary)', 
                          color: '#fff',
                          border: 'none',
                          padding: '8px 16px',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                        Post
              </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <div style={{ 
                background: 'var(--card)', 
                borderRadius: 16, 
                padding: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>Photo Gallery</h2>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: 16 
                }}>
                  {animal.gallery.map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt={`${animal.name} ${i+1}`} 
                      style={{ 
                        width: '100%', 
                        aspectRatio: '1/1', 
                        objectFit: 'cover', 
                        borderRadius: 12,
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <div style={{ 
                background: 'var(--card)', 
                borderRadius: 16, 
                padding: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>Comments</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {animal.comments.map((comment, i) => (
                    <div key={i} style={{ 
                      background: 'var(--background)', 
                      padding: '12px 16px', 
                      borderRadius: 12 
                    }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                        {comment.user}
                      </div>
                      <div style={{ color: 'var(--text)' }}>{comment.text}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                style={{
                  flex: 1,
                      padding: '8px 12px', 
                      borderRadius: 8, 
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text)'
                    }}
                  />
                  <button className="button" style={{ 
                    background: 'var(--primary)', 
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}>
                    Post
              </button>
            </div>
          </div>
        </div>
      )}
        </div>

        {/* Sidebar */}
        <div>
          {/* About Widget */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: 16, 
            padding: 24, 
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 20 }}>About {animal.name.split(' ')[0]}</h2>
            <p style={{ color: 'var(--text)', marginBottom: 16 }}>{animal.about}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><strong>Age:</strong><br />{animalStats.age}</div>
              <div><strong>Location:</strong><br />{animalStats.location}</div>
              <div><strong>Rescued:</strong><br />{animalStats.rescueDate}</div>
              <div><strong>Followers:</strong><br />{animalStats.followers.toLocaleString()}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Personality:</strong>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {animalStats.personality.map(trait => (
                  <span key={trait} style={{ 
                    padding: '4px 8px', 
                    background: 'linear-gradient(90deg, var(--accent), var(--primary))', 
                    color: '#fff', 
                    borderRadius: 12, 
                    fontSize: 12, 
                    fontWeight: 600 
                  }}>
                    {trait}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <strong>Current Needs:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: 'var(--text)' }}>
                {animalStats.needs.map(need => (
                  <li key={need} style={{ marginBottom: 4 }}>{need}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top Supporters Widget */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: 16, 
            padding: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 20 }}>Top Supporters 🏆</h2>
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              {animal.supporters.map((supporter, i) => (
                <li key={i} style={{ 
                  marginBottom: 8, 
                  color: 'var(--text)',
                  fontSize: 14
                }}>
                  <strong>{supporter.name}</strong> – ${supporter.amount.toLocaleString()}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 