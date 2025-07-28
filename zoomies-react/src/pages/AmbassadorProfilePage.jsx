import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import StompyBanner from '../assets/StompyBanner.png';
import StompyProfilePic from '../assets/StompyProfilePic.png';
import LunaBanner from '../assets/LunaBanner.png';
import LunaProfilePic from '../assets/LunaProfilePic.png';
import MaxBanner from '../assets/MaxBanner.png';
import MaxProfilePic from '../assets/MaxProfilePic.png';

const ANIMALS = {
  stompy: {
    name: 'Stompy the Goat',
    species: 'Goat',
    sanctuary: 'Alveus Sanctuary',
    profileImg: StompyProfilePic,
    coverImg: StompyBanner,
    about: "Hi I'm Stompy and I'm a goat who loves headbutts and snacks. I was rescued from a difficult situation and now I live happily at Alveus Sanctuary where I get all the love and care I need.",
    joined: 'August 2023',
    donation: { raised: 815, goal: 2000 },
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
    ],
    timelinePosts: [
      {
        id: 1,
        user: 'Stompy the Goat',
        avatar: StompyProfilePic,
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
        user: 'Stompy the Goat',
        avatar: StompyProfilePic,
        date: '5 hours ago',
        content: 'Thanks Name for the $255 donation yabababadaddboooo',
        reactions: { like: 15, love: 12, laugh: 2 },
        comments: [
          { user: 'Emily', text: 'You deserve it!' }
        ]
      }
    ]
  },
  luna: {
    name: 'Luna the Cow',
    species: 'Cow',
    sanctuary: 'Gentle Barn',
    profileImg: LunaProfilePic,
    coverImg: LunaBanner,
    about: "Luna is the gentlest soul you'll ever meet.",
    joined: 'May 2022',
    donation: { raised: 1200, goal: 2500 },
    supporters: [
      { name: 'Gentle Friends', amount: 900 },
      { name: 'Moo Crew', amount: 600 },
      { name: 'Linda S.', amount: 400 }
    ],
    gallery: [
      'https://placehold.co/300x300?text=Luna+1',
      'https://placehold.co/300x300?text=Luna+2',
      'https://placehold.co/300x300?text=Luna+3'
    ],
    comments: [
      { user: 'Sam', text: "Luna is so sweet!" },
      { user: 'Jess', text: 'Love her story!' }
    ],
    timelinePosts: [
      {
        id: 1,
        user: 'Luna the Cow',
        avatar: LunaProfilePic,
        date: '1 hour ago',
        content: 'Enjoyed a sunny nap in the pasture today! 🌞',
        reactions: { like: 10, love: 7, laugh: 1 },
        comments: [
          { user: 'Jess', text: 'So peaceful!' }
        ]
      },
      {
        id: 2,
        user: 'Luna the Cow',
        avatar: LunaProfilePic,
        date: '3 hours ago',
        content: 'Thank you to the Moo Crew for the fresh hay!',
        reactions: { like: 8, love: 5, laugh: 0 },
        comments: [
          { user: 'Sam', text: 'Yay Luna!' }
        ]
      }
    ]
  },
  bella: {
    name: 'Bella the Pig',
    species: 'Pig',
    sanctuary: 'Sunny Acres',
    profileImg: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=100&h=100&fit=crop&crop=center',
    coverImg: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=200&fit=crop&crop=center',
    about: 'Bella loves belly rubs and mud baths!',
    joined: 'March 2021',
    donation: { raised: 600, goal: 1800 },
    supporters: [
      { name: 'Piggy Pals', amount: 300 },
      { name: 'Sunny Acres', amount: 200 }
    ],
    gallery: [
      'https://placehold.co/300x300?text=Bella+1',
      'https://placehold.co/300x300?text=Bella+2'
    ],
    comments: [
      { user: 'Alex', text: 'Bella is adorable!' }
    ],
    timelinePosts: [
      {
        id: 1,
        user: 'Bella the Pig',
        avatar: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=100&h=100&fit=crop&crop=center',
        date: '4 hours ago',
        content: 'Had the best mud bath ever today! 🐷',
        reactions: { like: 6, love: 3, laugh: 2 },
        comments: [
          { user: 'Alex', text: 'Living the dream!' }
        ]
      }
    ]
  },
  max: {
    name: 'Max the Horse',
    species: 'Horse',
    sanctuary: 'Freedom Reins',
    profileImg: MaxProfilePic,
    coverImg: MaxBanner,
    about: 'Max is a retired racehorse who loves carrots.',
    joined: 'July 2020',
    donation: { raised: 2000, goal: 3000 },
    supporters: [
      { name: 'Horse Heroes', amount: 1200 },
      { name: 'Freedom Reins', amount: 800 }
    ],
    gallery: [
      'https://placehold.co/300x300?text=Max+1',
      'https://placehold.co/300x300?text=Max+2'
    ],
    comments: [
      { user: 'Taylor', text: 'Max is a champ!' }
    ],
    timelinePosts: [
      {
        id: 1,
        user: 'Max the Horse',
        avatar: MaxProfilePic,
        date: '6 hours ago',
        content: 'Went for a gallop and got extra carrots! 🥕',
        reactions: { like: 9, love: 4, laugh: 1 },
        comments: [
          { user: 'Taylor', text: 'Go Max!' }
        ]
      }
    ]
  }
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

export default function AmbassadorProfilePage() {
  const { id } = useParams();
  const animal = ANIMALS[id];
  const [activeTab, setActiveTab] = useState('timeline');
  const [isDark, setIsDark] = useState(false);
  const [reactions, setReactions] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

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
      animal.timelinePosts[postIdx].comments.push({
        user: 'You',
        text: commentInputs[postIdx]
      });
      setCommentInputs(prev => ({ ...prev, [postIdx]: '' }));
    }
  };

  if (!animal) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--background)',
        paddingTop: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--text)'
      }}>
        <h1>Animal Not Found</h1>
        <p>The animal with ID "{id}" does not exist.</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--background)',
      paddingTop: 0
    }}>
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
            💗 Follow
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
            🎁 Donate
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
                </div>
              </div>

              {/* Timeline Posts */}
              {animal.timelinePosts.map((post, idx) => (
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