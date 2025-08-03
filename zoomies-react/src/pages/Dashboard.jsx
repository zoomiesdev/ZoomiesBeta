import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollNumber from '../components/ScrollNumber';

// Mock data for enhanced user profile
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
  nextLevelXp: 3200
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

const ACTIVITY_FEED = [
  { type: 'donation', content: 'Donated $50 to Stompy', time: '2 hours ago', icon: '💖' },
  { type: 'post', content: 'Just visited Alveus Sanctuary! The animals are doing amazing. #sanctuarylife', time: '1 day ago', icon: '📸' },
  { type: 'achievement', content: 'Earned the "Fundraiser" badge!', time: '3 days ago', icon: '🏆' },
  { type: 'event', content: 'Registered for "Walk for Animals" event', time: '1 week ago', icon: '🎟️' },
  { type: 'fundraiser', content: 'Started fundraiser for Luna\'s surgery', time: '2 weeks ago', icon: '💰' }
];

const DONATIONS = [
  { to: 'Stompy', amount: 50, date: '2024-07-01', type: 'Monthly' },
  { to: 'Luna', amount: 25, date: '2024-06-15', type: 'One-time' },
  { to: 'Bella', amount: 100, date: '2024-06-01', type: 'Emergency' },
  { to: 'Alveus Sanctuary', amount: 75, date: '2024-05-20', type: 'General' }
];

const FUNDRAISERS = [
  { name: 'Help Luna Get Surgery', goal: 2500, raised: 1800, daysLeft: 5, image: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4?w=200&h=120&fit=crop&crop=center' },
  { name: 'Stompy\'s Medical Fund', goal: 2000, raised: 815, daysLeft: 12, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=120&fit=crop&crop=center' }
];

const LEADERBOARD = [
  { name: 'Clara', rank: 1, amount: 200, avatar: 'https://placehold.co/32x32?text=C' },
  { name: 'You', rank: 2, amount: 150, avatar: USER_DATA.avatar },
  { name: 'Sam', rank: 3, amount: 90, avatar: 'https://placehold.co/32x32?text=S' },
  { name: 'Jess', rank: 4, amount: 75, avatar: 'https://placehold.co/32x32?text=J' },
  { name: 'Mike', rank: 5, amount: 60, avatar: 'https://placehold.co/32x32?text=M' }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  const handleSaveEdit = () => {
    setProfile((prev) => ({
      ...prev,
      name: editState.name,
      bio: editState.bio,
      avatar: editState.avatar,
      coverPhoto: editState.coverPhoto
    }));
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
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
            {/* Buttons */}
            <div className="modal-buttons" style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center' }}>
              <button onClick={handleCancelEdit} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveEdit} className="button" style={{ background: 'linear-gradient(90deg, var(--primary), var(--pink))', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 20, padding: '10px 32px', boxShadow: '0 2px 8px rgba(252,151,202,0.08)' }}>Save</button>
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