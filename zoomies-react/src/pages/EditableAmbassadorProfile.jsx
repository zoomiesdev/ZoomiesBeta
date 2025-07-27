import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ANIMALS = {
  stompy: {
    name: 'Stompy the Goat',
    species: 'Goat',
    sanctuary: 'Alveus Sanctuary',
    joined: 'August 2023',
    about: "Hi I'm Stompy and I'm an ostrich blah blah I was found in blah blah blah. My favorite food is blah blah bugs.",
    coverImg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=250&fit=crop&crop=center',
    profileImg: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=center',
    donation: { raised: 815, goal: 2000 },
    gallery: [
      'https://placehold.co/150x100?text=1',
      'https://placehold.co/150x100?text=2',
      'https://placehold.co/150x100?text=3',
    ],
    posts: [
      {
        id: 1,
        type: 'status',
        content: 'Just had the best headbutt session with my friends! 🐐',
        timestamp: '2 hours ago',
        reactions: { heart: 12, laugh: 3, wow: 1 },
        comments: [
          { user: 'Clara', text: 'Stunned by Stompy\'s beauty! ♥' },
          { user: 'James', text: '👑 1 ♥' },
          { user: 'Emily', text: 'You go, Stomp!' },
        ]
      },
      {
        id: 2,
        type: 'photo',
        content: 'Exploring the new climbing structure!',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        timestamp: '1 day ago',
        reactions: { heart: 8, laugh: 2 },
        comments: [
          { user: 'Sam', text: 'So adventurous!' },
        ]
      }
    ],
    supporters: [
      { name: 'Pawfect Coffee Co.', amount: 2000 },
      { name: 'Linda S.', amount: 1500 },
      { name: 'CryptoCat DAO', amount: 1250 },
    ],
  },
  luna: {
    name: 'Luna the Cow',
    species: 'Cow',
    sanctuary: 'Gentle Barn',
    joined: 'May 2022',
    about: "Luna loves sunbathing and making new friends. She was rescued from a dairy farm and now enjoys a peaceful life.",
    coverImg: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1200&h=250&fit=crop&crop=center',
    profileImg: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4?w=100&h=100&fit=crop&crop=center',
    donation: { raised: 1200, goal: 2500 },
    gallery: [
      'https://placehold.co/150x100?text=Luna1',
      'https://placehold.co/150x100?text=Luna2',
      'https://placehold.co/150x100?text=Luna3',
    ],
    posts: [
      {
        id: 1,
        type: 'status',
        content: 'Perfect day for sunbathing! ☀️',
        timestamp: '3 hours ago',
        reactions: { heart: 15, laugh: 2 },
        comments: [
          { user: 'Sam', text: 'Luna is the sweetest!' },
          { user: 'Jess', text: 'So glad she\'s safe now.' },
        ]
      }
    ],
    supporters: [
      { name: 'Happy Hooves', amount: 900 },
      { name: 'Moo Friends', amount: 700 },
    ],
  },
  bella: {
    name: 'Bella the Pig',
    species: 'Pig',
    sanctuary: 'Sunny Acres',
    joined: 'March 2021',
    about: "Bella is a playful pig who loves mud baths and belly rubs. She was rescued from a factory farm.",
    coverImg: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=250&fit=crop&crop=center',
    profileImg: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=100&h=100&fit=crop&crop=center',
    donation: { raised: 600, goal: 1800 },
    gallery: [
      'https://placehold.co/150x100?text=Bella1',
      'https://placehold.co/150x100?text=Bella2',
      'https://placehold.co/150x100?text=Bella3',
    ],
    posts: [
      {
        id: 1,
        type: 'status',
        content: 'Mud bath time! 🐷💦',
        timestamp: '5 hours ago',
        reactions: { heart: 10, laugh: 5 },
        comments: [
          { user: 'Megan', text: 'Bella is adorable!' },
        ]
      }
    ],
    supporters: [
      { name: 'Piggy Pals', amount: 400 },
    ],
  },
  max: {
    name: 'Max the Horse',
    species: 'Horse',
    sanctuary: 'Freedom Reins',
    joined: 'January 2020',
    about: "Max is a gentle giant who loves apples and running in open fields. He was rescued from neglect.",
    coverImg: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=1200&h=250&fit=crop&crop=center',
    profileImg: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=100&h=100&fit=crop&crop=center',
    donation: { raised: 2000, goal: 3000 },
    gallery: [
      'https://placehold.co/150x100?text=Max1',
      'https://placehold.co/150x100?text=Max2',
      'https://placehold.co/150x100?text=Max3',
    ],
    posts: [
      {
        id: 1,
        type: 'status',
        content: 'Morning run in the field! 🐎',
        timestamp: '1 day ago',
        reactions: { heart: 20, wow: 3 },
        comments: [
          { user: 'Alex', text: 'Max is so majestic!' },
        ]
      }
    ],
    supporters: [
      { name: 'Horse Heroes', amount: 1500 },
    ],
  },
};

export default function EditableAmbassadorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(ANIMALS[id] || ANIMALS['stompy']);
  const [isDark, setIsDark] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: animal.name,
    about: animal.about,
    donationGoal: animal.donation.goal
  });

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

  const handleAddPost = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: Date.now(),
        type: 'status',
        content: newPostContent,
        timestamp: 'Just now',
        reactions: { heart: 0, laugh: 0, wow: 0 },
        comments: []
      };
      
      setAnimal(prev => ({
        ...prev,
        posts: [newPost, ...prev.posts]
      }));
      setNewPostContent('');
    }
  };

  const handleSaveEdit = () => {
    setAnimal(prev => ({
      ...prev,
      name: editData.name,
      about: editData.about,
      donation: {
        ...prev.donation,
        goal: editData.donationGoal
      }
    }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      name: animal.name,
      about: animal.about,
      donationGoal: animal.donation.goal
    });
    setIsEditing(false);
  };

  const handleReact = (postIdx, type) => {
    setAnimal(prev => ({
      ...prev,
      posts: prev.posts.map((post, idx) => 
        idx === postIdx 
          ? { ...post, reactions: { ...post.reactions, [type]: (post.reactions[type] || 0) + 1 } }
          : post
      )
    }));
  };

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      {/* Header with Edit Button */}
      <div style={{ 
        background: 'var(--card)', 
        padding: '16px 24px', 
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 16,
            cursor: 'pointer',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          ← Back
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          {isEditing ? (
            <>
              <button 
                onClick={handleSaveEdit}
                className="button"
                style={{ padding: '8px 16px', fontSize: 14 }}
              >
                Save Changes
              </button>
              <button 
                onClick={handleCancelEdit}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: 'pointer',
                  color: 'var(--text)'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="button"
              style={{ padding: '8px 16px', fontSize: 14 }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Cover Image */}
      <div style={{ position: 'relative', height: 250, overflow: 'hidden' }}>
        <img 
          src={animal.coverImg} 
          alt={`${animal.name} cover`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Profile Info */}
      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          {/* Profile Image */}
          <img 
            src={animal.profileImg} 
            alt={animal.name}
            style={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '4px solid var(--card)',
              marginTop: -60
            }}
          />
          
          {/* Profile Details */}
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    background: 'var(--background)',
                    color: 'var(--text)'
                  }}
                />
                <textarea
                  value={editData.about}
                  onChange={(e) => setEditData(prev => ({ ...prev, about: e.target.value }))}
                  rows={4}
                  style={{
                    fontSize: 16,
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '12px',
                    background: 'var(--background)',
                    color: 'var(--text)',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <label style={{ fontSize: 14, fontWeight: 600 }}>Donation Goal: $</label>
                  <input
                    type="number"
                    value={editData.donationGoal}
                    onChange={(e) => setEditData(prev => ({ ...prev, donationGoal: parseInt(e.target.value) }))}
                    style={{
                      fontSize: 16,
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      background: 'var(--background)',
                      color: 'var(--text)',
                      width: 100
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
                  {animal.name}
                </h1>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  {animal.species} • {animal.sanctuary} • Joined {animal.joined}
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text)' }}>
                  {animal.about}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Donation Progress */}
        <div style={{ 
          background: 'var(--card)', 
          padding: 24, 
          borderRadius: 12, 
          marginBottom: 32,
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>
            Fundraising Progress
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Raised</span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              ${animal.donation.raised.toLocaleString()} / ${animal.donation.goal.toLocaleString()}
            </span>
          </div>
          <div style={{ 
            width: '100%', 
            height: 8, 
            background: 'var(--border)', 
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(animal.donation.raised / animal.donation.goal) * 100}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              borderRadius: 4
            }} />
          </div>
        </div>

        {/* New Post Section */}
        <div style={{ 
          background: 'var(--card)', 
          padding: 24, 
          borderRadius: 12, 
          marginBottom: 32,
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>
            Post Update for {animal.name}
          </h3>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder={`What's ${animal.name} up to today?`}
            rows={3}
            style={{
              width: '100%',
              fontSize: 16,
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 12,
              background: 'var(--background)',
              color: 'var(--text)',
              resize: 'vertical',
              marginBottom: 16
            }}
          />
          <button 
            onClick={handleAddPost}
            disabled={!newPostContent.trim()}
            className="button"
            style={{ 
              padding: '10px 20px', 
              fontSize: 14,
              opacity: newPostContent.trim() ? 1 : 0.5
            }}
          >
            Post Update
          </button>
        </div>

        {/* Posts Timeline */}
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--text)' }}>
            Recent Updates
          </h3>
          {animal.posts.map((post, idx) => (
            <div key={post.id} style={{ 
              background: 'var(--card)', 
              padding: 24, 
              borderRadius: 12, 
              marginBottom: 16,
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <img 
                  src={animal.profileImg} 
                  alt={animal.name}
                  style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    marginRight: 12
                  }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{animal.name}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{post.timestamp}</div>
                </div>
              </div>
              
              <p style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 16, color: 'var(--text)' }}>
                {post.content}
              </p>
              
              {post.image && (
                <img 
                  src={post.image} 
                  alt="Post"
                  style={{ 
                    width: '100%', 
                    maxWidth: 400, 
                    borderRadius: 8, 
                    marginBottom: 16 
                  }}
                />
              )}
              
              {/* Reactions */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                {Object.entries(post.reactions).map(([type, count]) => (
                  <button
                    key={type}
                    onClick={() => handleReact(idx, type)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {type === 'heart' ? '❤️' : type === 'laugh' ? '😂' : '😮'} {count}
                  </button>
                ))}
              </div>
              
              {/* Comments */}
              {post.comments.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  {post.comments.map((comment, commentIdx) => (
                    <div key={commentIdx} style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{comment.user}</span>
                      <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>{comment.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 