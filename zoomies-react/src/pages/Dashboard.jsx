import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import ScrollNumber from '../components/ScrollNumber';

export default function Dashboard() {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // If no user is authenticated, show a message
  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 20
      }}>
        <h2 style={{ color: 'var(--text)', margin: 0 }}>Please log in to view your dashboard</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Sign in to see your Zoomies dashboard</p>
      </div>
    );
  }

  // Use actual user data or default values for new users
  const USER_DATA = {
    name: user.full_name || user.username || 'New User',
    username: `@${user.username || 'newuser'}`,
    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'user'}`,
    coverPhoto: user.cover_photo || 'https://placehold.co/800x300?text=Cover',
    bio: user.bio || 'New Zoomies member! 🐾',
    location: user.location || 'Location not set',
    joinedDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
    totalDonated: user.total_donated || 0,
    animalsHelped: user.animals_helped || 0,
    followers: user.followers || 0,
    following: user.following || 0,
    level: user.level || 1,
    xp: user.xp || 0,
    nextLevelXp: user.next_level_xp || 100
  };

const BADGES = [];

const FOLLOWED_ANIMALS = [];

const FOLLOWED_SANCTUARIES = [];

const ACTIVITY_FEED = [];

const DONATIONS = [];

const FUNDRAISERS = [];

const LEADERBOARD = [];

  const [profile, setProfile] = useState({
    ...USER_DATA
  });
  const [editState, setEditState] = useState({
    name: profile.name,
    bio: profile.bio,
    avatar: profile.avatar,
    coverPhoto: profile.coverPhoto,
    avatarFile: null,
    coverFile: null
  });

  const renderProgressBar = (current, max) => {
    const percentage = (current / max) * 100;
    return (
      <div style={{ width: '100%', height: 8, background: 'var(--gray)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: 4 }} />
      </div>
    );
  };

  const handleEditProfile = () => {
    setEditState({
      name: profile.name,
      bio: profile.bio,
      avatar: profile.avatar,
      coverPhoto: profile.coverPhoto,
      avatarFile: null,
      coverFile: null
    });
    setShowEditModal(true);
    setSaveError('');
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

  const handleSaveEdit = async () => {
    setSaving(true);
    setSaveError('');
    
    try {
      // Prepare the update data
      const updateData = {
        bio: editState.bio
      };
      
      // Add avatar if changed
      if (editState.avatar && editState.avatar !== profile.avatar) {
        updateData.avatar = editState.avatar;
      }
      
      // Add cover photo if changed
      if (editState.coverPhoto && editState.coverPhoto !== profile.coverPhoto) {
        updateData.cover_photo = editState.coverPhoto;
      }
      
      // Update the user profile in the database
      const { error } = await userService.updateUser(user.id, updateData);
      
      if (error) {
        setSaveError(error.message);
        console.error('Error updating profile:', error);
      } else {
        // Update the user context with the new data
        updateUserProfile(updateData);
        setShowEditModal(false);
        setEditState({
          name: profile.name,
          bio: profile.bio,
          avatar: profile.avatar,
          coverPhoto: profile.coverPhoto,
          avatarFile: null,
          coverFile: null
        });
      }
    } catch (err) {
      setSaveError('An unexpected error occurred');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setSaveError('');
  };

  return (
    <div className="dashboard" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem 0 1rem' }}>
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
            {/* Cover Image */}
            <div style={{ width: '100%', marginBottom: 18 }}>
              <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: 'block' }}>Header Image</label>
              <div className="cover-preview" style={{ position: 'relative', width: '100%', height: 90, background: '#f8f6ff', borderRadius: 12, overflow: 'hidden', marginBottom: 8, border: '1px solid var(--gray)' }}>
                <img src={editState.coverPhoto} alt="Header Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <input type="file" accept="image/*" name="coverPhoto" onChange={handleImageChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                <span style={{ position: 'absolute', bottom: 6, right: 10, background: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: '2px 8px', fontSize: 12, color: 'var(--primary)' }}>Change</span>
              </div>
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
            {/* Error Message */}
            {saveError && (
              <div style={{
                background: 'rgba(255, 107, 107, 0.1)',
                color: '#ff6b6b',
                padding: '12px 16px',
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 14,
                textAlign: 'center'
              }}>
                {saveError}
              </div>
            )}

            {/* Buttons */}
            <div className="modal-buttons" style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center' }}>
              <button 
                onClick={handleCancelEdit}
                disabled={saving}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: saving ? 'var(--text-secondary)' : 'var(--primary)', 
                  fontWeight: 600, 
                  fontSize: 16, 
                  cursor: saving ? 'not-allowed' : 'pointer' 
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                disabled={saving}
                className="button" 
                style={{ 
                  background: saving ? 'var(--gray)' : 'linear-gradient(90deg, var(--primary), var(--pink))', 
                  color: '#fff', 
                  fontWeight: 600, 
                  fontSize: 16, 
                  border: 'none', 
                  borderRadius: 20, 
                  padding: '10px 32px', 
                  boxShadow: '0 2px 8px rgba(252,151,202,0.08)',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Tabs */}
      <div className="tabs" style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--gray)' }}>
        {[
          { id: 'stats', label: 'Stats', icon: '📊' },
          { id: 'badges', label: 'Badges', icon: '🏆' },
          { id: 'following', label: 'Following', icon: '👥' },
          { id: 'donations', label: 'Donations', icon: '💖' },
          { id: 'fundraisers', label: 'Fundraisers', icon: '💰' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text)',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 16,
              transition: 'background 0.2s, color 0.2s'
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'linear-gradient(90deg, var(--accent), var(--primary))';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text)';
              }
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Main Content */}
        <div>
          {activeTab === 'stats' && (
            <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>Statistics</h2>
              
              {/* Stats Grid */}
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 32 }}>
                <div style={{ textAlign: 'center', background: 'var(--background)', borderRadius: 12, padding: 24 }}>
                  <div style={{ fontSize: 32, fontWeight: 600, color: 'var(--primary)' }}>
                    $<ScrollNumber value={profile.totalDonated} duration={2000} delay={300} />
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--text)', opacity: 0.7, marginTop: 8 }}>Total Donated</div>
                </div>
                <div style={{ textAlign: 'center', background: 'var(--background)', borderRadius: 12, padding: 24 }}>
                  <div style={{ fontSize: 32, fontWeight: 600, color: 'var(--primary)' }}>
                    <ScrollNumber value={profile.animalsHelped} duration={2000} delay={500} />
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--text)', opacity: 0.7, marginTop: 8 }}>Animals Helped</div>
                </div>
                <div style={{ textAlign: 'center', background: 'var(--background)', borderRadius: 12, padding: 24 }}>
                  <div style={{ fontSize: 32, fontWeight: 600, color: 'var(--primary)' }}>
                    <ScrollNumber value={profile.followers} duration={2000} delay={700} />
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--text)', opacity: 0.7, marginTop: 8 }}>Followers</div>
                </div>
                <div style={{ textAlign: 'center', background: 'var(--background)', borderRadius: 12, padding: 24 }}>
                  <div style={{ fontSize: 32, fontWeight: 600, color: 'var(--primary)' }}>
                    <ScrollNumber value={profile.following} duration={2000} delay={900} />
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--text)', opacity: 0.7, marginTop: 8 }}>Following</div>
                </div>
              </div>

              {/* Level Progress */}
              <div style={{ background: 'var(--background)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 20 }}>Level Progress</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 600 }}>Level {profile.level}</span>
                  <span style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>
                    {profile.xp} / {profile.nextLevelXp} XP
                  </span>
                </div>
                {renderProgressBar(profile.xp, profile.nextLevelXp)}
                <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7, marginTop: 8 }}>
                  {profile.nextLevelXp - profile.xp} XP to next level
                </div>
              </div>

              {/* Leaderboard */}
              <div style={{ background: 'var(--background)', borderRadius: 12, padding: 24 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 20 }}>Top Donors This Month</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {LEADERBOARD.map((user, index) => (
                    <div key={user.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--gray)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 600,
                        color: index < 3 ? '#fff' : 'var(--text)'
                      }}>
                        {index + 1}
                      </div>
                      <img src={user.avatar} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.7 }}>${user.amount} donated</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>Earned Badges</h2>
              <div className="badges-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {BADGES.map(badge => (
                  <div key={badge.name} className="badge-card" style={{ background: 'var(--background)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{badge.icon}</div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{badge.name}</div>
                    <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7, marginBottom: 8 }}>{badge.description}</div>
                    <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.5 }}>Earned {badge.earned}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'following' && (
            <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>Following</h2>
              
              <h3 style={{ margin: '20px 0 12px 0', fontSize: 18 }}>Animals</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {FOLLOWED_ANIMALS.map(animal => (
                  <div key={animal.name} className="following-item" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={animal.image} alt={animal.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                    <div className="item-info" style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{animal.name}</div>
                      <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>{animal.type} • {animal.sanctuary}</div>
                    </div>
                    <span style={{ fontSize: 12, padding: '4px 8px', background: 'var(--primary)', color: '#fff', borderRadius: 12 }}>{animal.status}</span>
                  </div>
                ))}
              </div>

              <h3 style={{ margin: '20px 0 12px 0', fontSize: 18 }}>Sanctuaries</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {FOLLOWED_SANCTUARIES.map(sanctuary => (
                  <div key={sanctuary.name} className="following-item" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={sanctuary.image} alt={sanctuary.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                    <div className="item-info" style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{sanctuary.name}</div>
                      <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>{sanctuary.location} • {sanctuary.animals} animals</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>Donation History</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {DONATIONS.map((donation, index) => (
                  <div key={index} className="donation-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--gray)' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>${donation.amount} to {donation.to}</div>
                      <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>{donation.date}</div>
                    </div>
                    <span style={{ fontSize: 12, padding: '4px 8px', background: 'var(--accent)', color: '#fff', borderRadius: 12 }}>{donation.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fundraisers' && (
            <div style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>My Fundraisers</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {FUNDRAISERS.map((fundraiser, index) => (
                  <div key={index} className="fundraiser-item" style={{ background: 'var(--background)', borderRadius: 12, padding: 16 }}>
                    <div className="fundraiser-content" style={{ display: 'flex', gap: 16 }}>
                      <img src={fundraiser.image} alt={fundraiser.name} style={{ width: 80, height: 60, borderRadius: 8, objectFit: 'cover' }} />
                      <div className="fundraiser-info" style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{fundraiser.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>${fundraiser.raised} raised of ${fundraiser.goal}</span>
                          <span style={{ fontSize: 12, color: 'var(--text)', opacity: 0.7 }}>{fundraiser.daysLeft} days left</span>
                        </div>
                        {renderProgressBar(fundraiser.raised, fundraiser.goal)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Activity Feed */}
          <div className="activity-feed" style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 20 }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ACTIVITY_FEED.map((activity, index) => (
                <div key={index} className="activity-item" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--gray)' }}>
                  <div style={{ fontSize: 16 }}>{activity.icon}</div>
                  <div className="activity-content" style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, marginBottom: 2 }}>{activity.content}</div>
                    <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.6 }}>{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions" style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 20 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link to="/ambassador-hub" className="button" style={{ textAlign: 'center', textDecoration: 'none' }}>
                🐾 Support an Animal
              </Link>
              <Link to="/community" className="button" style={{ textAlign: 'center', textDecoration: 'none' }}>
                👥 Join Community
              </Link>
              <button className="button" style={{ textAlign: 'center' }}>
                💰 Start Fundraiser
              </button>
              <button className="button" style={{ textAlign: 'center' }}>
                📸 Share Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 