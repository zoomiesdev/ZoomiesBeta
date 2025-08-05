import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// Mock data for sample user profiles
const SAMPLE_USERS = {};

const BADGES = [
  { name: 'Donor', icon: '💖', description: 'Made first donation', earned: '2024-01-15' },
  { name: 'Event Attendee', icon: '🎟️', description: 'Attended 5 events', earned: '2024-02-20' },
  { name: 'Advocate', icon: '📢', description: 'Shared 50+ posts', earned: '2024-03-10' },
  { name: 'Volunteer', icon: '🤝', description: 'Volunteered 20+ hours', earned: '2024-06-01' }
];

const FOLLOWED_ANIMALS = [];

const FOLLOWED_SANCTUARIES = [];

const ACTIVITY_FEED = [];

const DONATIONS = [];

const FUNDRAISERS = [];

const USER_POSTS = [];

const GALLERY_IMAGES = [];

export default function SampleUserProfile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('timeline');
  
  // Get user data based on username parameter
  const userData = SAMPLE_USERS[username];
  
  // If no user data, show empty state
  if (!userData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16
      }}>
        <h1 style={{ color: 'var(--text)', margin: 0 }}>No User Found</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>This user profile is not available.</p>
      </div>
    );
  }

  const renderProgressBar = (current, max) => {
    const percentage = (current / max) * 100;
    return (
      <div style={{ width: '100%', height: 8, background: 'var(--gray)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: 4 }} />
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--background)',
      paddingTop: 0
    }}>
      {/* Cover Photo */}
      <div style={{ 
        height: 300, 
        background: `url(${userData.coverPhoto})`, 
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
            src={userData.avatar} 
            alt={userData.name}
            style={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%', 
              border: '4px solid var(--card)',
              objectFit: 'cover'
            }} 
          />
          <div style={{ color: 'white', marginBottom: 10 }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>{userData.name}</h1>
            <p style={{ margin: '4px 0', fontSize: 16, opacity: 0.9 }}>{userData.username}</p>
            <p style={{ margin: '4px 0', fontSize: 14, opacity: 0.8 }}>{userData.location} • Joined {userData.joinedDate}</p>
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
            Follow
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
        gridTemplateColumns: '1fr 300px',
        gap: 24
      }}>
        {/* Main Content */}
        <div>
          {/* Bio Section */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: 12, 
            padding: 24, 
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <p style={{ 
              color: 'var(--text)', 
              fontSize: 16, 
              lineHeight: 1.6, 
              margin: '0 0 16px 0' 
            }}>
              {userData.bio}
            </p>
            
            {/* Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 16, 
              marginTop: 20,
              paddingTop: 20,
              borderTop: '1px solid var(--border)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)' }}>{userData.followers}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Followers</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)' }}>{userData.following}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Following</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)' }}>Level {userData.level}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Level</div>
              </div>
            </div>
          </div>

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
                  background: activeTab === tab ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--text)',
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
                <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)' }}>Posts</h3>
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
                          src={userData.avatar} 
                          alt={userData.name}
                          style={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }} 
                        />
                        <div>
                          <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 14 }}>{userData.name}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{post.time}</div>
                        </div>
                      </div>
                      
                      {/* Post Content */}
                      <p style={{ 
                        color: 'var(--text)', 
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

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Feelings Card */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: 12, 
            padding: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>{userData.name.split(' ')[0]} Is Feeling:</h3>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              padding: '12px',
              background: 'var(--background)',
              borderRadius: 8,
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: 32 }}>{userData.feelingEmoji}</div>
              <div>
                <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: 14 }}>{userData.feeling}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{userData.feelingDescription}</div>
              </div>
            </div>
          </div>



          {/* Followed Animals */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: 12, 
            padding: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Followed Animals</h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 12,
              maxHeight: 200,
              overflowY: 'auto'
            }}>
              {FOLLOWED_ANIMALS.map((animal, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12,
                  padding: '8px 0'
                }}>
                  <img 
                    src={animal.image} 
                    alt={animal.name}
                    style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: 14 }}>{animal.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{animal.type} • {animal.sanctuary}</div>
                  </div>
                  <span style={{ 
                    fontSize: 10, 
                    padding: '2px 6px', 
                    borderRadius: 4,
                    background: animal.status === 'Active' ? '#4CAF50' : animal.status === 'Recovering' ? '#FF9800' : '#2196F3',
                    color: 'white'
                  }}>
                    {animal.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Followed Sanctuaries */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: 12, 
            padding: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Followed Sanctuaries</h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 12,
              maxHeight: 200,
              overflowY: 'auto'
            }}>
              {FOLLOWED_SANCTUARIES.map((sanctuary, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12,
                  padding: '8px 0'
                }}>
                  <img 
                    src={sanctuary.image} 
                    alt={sanctuary.name}
                    style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: 14 }}>{sanctuary.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{sanctuary.location} • {sanctuary.animals} animals</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 