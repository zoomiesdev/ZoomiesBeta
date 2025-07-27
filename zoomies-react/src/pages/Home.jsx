import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data for feed posts
const FEED_POSTS = [
  {
    id: 1,
    user: 'Clara',
    avatar: 'https://placehold.co/40x40?text=C',
    content: 'Just donated $50 to help Stompy get his medical treatment! 🐐💕',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
    likes: 124,
    comments: 23,
    time: '2m ago',
    type: 'donation'
  },
  {
    id: 2,
    user: 'Alveus Sanctuary',
    avatar: 'https://placehold.co/40x40?text=A',
    content: 'Stompy had a great day today! He loves headbutts and to climb and explore! 🐐✨',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
    likes: 892,
    comments: 156,
    time: '1h ago',
    type: 'update'
  },
  {
    id: 3,
    user: 'Sam',
    avatar: 'https://placehold.co/40x40?text=S',
    content: 'Shared my rescue story today. Every animal deserves a chance at a happy life! 🐾',
    image: null,
    likes: 67,
    comments: 12,
    time: '3h ago',
    type: 'story'
  },
  {
    id: 4,
    user: 'Gentle Barn',
    avatar: 'https://placehold.co/40x40?text=G',
    content: 'Luna is recovering well from her surgery. Thank you to everyone who donated! 🐄💖',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center',
    likes: 445,
    comments: 89,
    time: '5h ago',
    type: 'update'
  }
];

// Mock data for stories
const STORIES = [
  { id: 1, user: 'Clara', avatar: 'https://placehold.co/60x60?text=C', hasNew: true },
  { id: 2, user: 'Sam', avatar: 'https://placehold.co/60x60?text=S', hasNew: true },
  { id: 3, user: 'Jess', avatar: 'https://placehold.co/60x60?text=J', hasNew: false },
  { id: 4, user: 'Mike', avatar: 'https://placehold.co/60x60?text=M', hasNew: true },
  { id: 5, user: 'Sarah', avatar: 'https://placehold.co/60x60?text=S', hasNew: false },
];

const URGENT_CAMPAIGNS = [
  {
    id: 'stompy',
    name: 'Stompy',
    species: 'Goat',
    sanctuary: 'Alveus Sanctuary',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop&crop=center',
    raised: 815,
    goal: 2000,
    urgency: 'Medical treatment needed',
    timeLeft: '3 days',
    followers: 1247
  },
  {
    id: 'luna',
    name: 'Luna',
    species: 'Cow',
    sanctuary: 'Gentle Barn',
    image: 'https://picsum.photos/200/200?random=1',
    raised: 1200,
    goal: 2500,
    urgency: 'Surgery required',
    timeLeft: '1 day',
    followers: 892
  }
];

export default function Home() {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [isDark, setIsDark] = useState(false);

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

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Sidebar content
  const sponsors = [
    { name: 'PetCo', logo: 'https://placehold.co/80x40?text=PetCo' },
    { name: 'Chewy', logo: 'https://placehold.co/80x40?text=Chewy' },
    { name: 'Local Vet', logo: 'https://placehold.co/80x40?text=Vet' }
  ];
  const featured = URGENT_CAMPAIGNS[0];
  const trendingCommunities = [
    { name: 'Animal Care', avatar: 'https://placehold.co/40x40?text=AC', members: 3200 },
    { name: 'Rescue Stories', avatar: 'https://placehold.co/40x40?text=RS', members: 2100 },
    { name: 'Fundraising Tips', avatar: 'https://placehold.co/40x40?text=FT', members: 1800 },
    { name: 'Sanctuary Life', avatar: 'https://placehold.co/40x40?text=SL', members: 950 }
  ];
  const trendingContent = [
    { id: 'stompy', name: 'Stompy', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=center', likes: 1247 },
    { id: 'luna', name: 'Luna', image: 'https://picsum.photos/100/100?random=1', likes: 892 },
    { id: 'bella', name: 'Bella', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=100&h=100&fit=crop&crop=center', likes: 456 },
    { id: 'max', name: 'Max', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=100&h=100&fit=crop&crop=center', likes: 2034 }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2.5fr',
      gap: 32,
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 1rem',
      background: 'var(--background)'
    }}>
      {/* Sidebar */}
      <aside style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        position: 'sticky',
        top: 24,
        alignSelf: 'flex-start',
        minWidth: 260,
        marginTop: 24
      }}>
        {/* Thanks to our Sponsors */}
        <div style={{ background: 'var(--card)', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: 0, fontSize: 16, color: 'var(--primary)' }}>Thanks to our Sponsors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {sponsors.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={s.logo} alt={s.name} style={{ width: 80, height: 40, objectFit: 'contain', background: '#f8f8f8', borderRadius: 6 }} />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Trending Communities */}
        <div style={{ background: 'var(--card)', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: 0, fontSize: 16, color: 'var(--primary)' }}>Trending Communities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
            {trendingCommunities.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={c.avatar} alt={c.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#f8f8f8' }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.members.toLocaleString()} members</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Trending Content */}
        <div style={{ background: 'var(--card)', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: 0, fontSize: 16, color: 'var(--primary)' }}>Trending Content</h3>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, overflowX: 'auto' }}>
            {trendingContent.map(animal => (
              <div key={animal.id} style={{ minWidth: 90, textAlign: 'center' }}>
                <img src={animal.image} alt={animal.name} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginBottom: 6 }} />
                <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>{animal.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>❤️ {animal.likes}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Featured Campaign/Animal */}
        <div style={{ background: 'var(--card)', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: 0, fontSize: 16, color: 'var(--primary)' }}>Featured Campaign</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <img src={featured.image} alt={featured.name} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>{featured.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{featured.species} • {featured.sanctuary}</div>
              <div style={{ fontSize: 12, color: 'var(--primary)' }}>{featured.urgency}</div>
            </div>
          </div>
          <Link to={`/ambassadors/${featured.id}`} className="button" style={{ marginTop: 12, display: 'inline-block', padding: '6px 12px', fontSize: 12, background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)', color: 'var(--white)', borderRadius: 6, boxShadow: '0 2px 8px rgba(255, 107, 107, 0.2)' }}>View Campaign</Link>
        </div>
      </aside>

      {/* Main Feed Area */}
      <main style={{ minWidth: 0 }}>
        {/* Welcome Header */}
        <div style={{ 
          background: 'var(--card)', 
          padding: '1.5rem 1rem', 
          textAlign: 'center', 
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <h1 style={{ 
            fontFamily: 'Calistoga, serif', 
            fontSize: 32, 
            margin: '0 0 0.5rem 0', 
            color: 'var(--primary)'
          }}>
            Welcome to Zoomies
          </h1>
          <p style={{ 
            fontSize: 16, 
            margin: '0 0 1rem 0', 
            color: 'var(--text-secondary)',
            maxWidth: 500,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Empowering animal sanctuaries and uniting animal lovers through joyful fundraising and community.
          </p>
          {/* Community Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 16, 
            marginTop: 16,
            padding: '12px',
            background: 'var(--card)',
            borderRadius: 12
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--primary)' }}>$45,230</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Raised Today</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--primary)' }}>1,247</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Animals Helped</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--primary)' }}>8,934</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Supporters</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--primary)' }}>156</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Sanctuaries</div>
            </div>
          </div>
        </div>

        {/* Feed Posts */}
        <div style={{ padding: '1rem' }}>
          {FEED_POSTS.map(post => (
            <div key={post.id} style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              marginBottom: 16, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              overflow: 'hidden'
            }}>
              {/* Post Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                padding: '16px 16px 12px 16px' 
              }}>
                <img src={post.avatar} alt={post.user} style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%' 
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{post.user}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{post.time}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>•••</div>
              </div>

              {/* Post Content */}
              <div style={{ padding: '0 16px 12px 16px' }}>
                <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.4 }}>{post.content}</p>
              </div>

              {/* Post Image */}
              {post.image && (
                <img src={post.image} alt="Post" style={{ 
                  width: '100%', 
                  height: 300, 
                  objectFit: 'cover' 
                }} />
              )}

              {/* Post Actions */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 16, 
                padding: '12px 16px',
                borderTop: '1px solid var(--border)'
              }}>
                <button 
                  onClick={() => handleLike(post.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: likedPosts.has(post.id) ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: 14
                  }}
                >
                  {likedPosts.has(post.id) ? '❤️' : '🤍'} {post.likes}
                </button>
                <button style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: 14
                }}>
                  💬 {post.comments}
                </button>
                <button style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: 14
                }}>
                  📤 Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Urgent Campaigns Section */}
        <div style={{ 
          margin: '1rem', 
          padding: '1.5rem', 
          background: 'var(--card)', 
          borderRadius: 12, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🚨</span>
            <h2 style={{ margin: 0, fontFamily: 'Calistoga, serif', fontWeight: 300, color: 'var(--text)' }}>Urgent Campaigns</h2>
          </div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '8px 0' }}>
            {URGENT_CAMPAIGNS.map(campaign => (
              <div key={campaign.id} style={{ 
                minWidth: 280, 
                background: 'var(--background)', 
                borderRadius: 12, 
                padding: 16, 
                border: '2px solid var(--primary)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <img src={campaign.image} alt={campaign.name} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: 18, color: 'var(--text)' }}>{campaign.name}</h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: 14, color: 'var(--primary)', fontWeight: 600 }}>{campaign.species} • {campaign.sanctuary}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{campaign.urgency}</p>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>${campaign.raised.toLocaleString()} raised</span>
                    <span style={{ color: 'var(--primary)' }}>{Math.round((campaign.raised/campaign.goal)*100)}%</span>
                  </div>
                  <div style={{ background: 'var(--gray)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.round((campaign.raised/campaign.goal)*100)}%`, 
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)', 
                      height: '100%' 
                    }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏰ {campaign.timeLeft} left</span>
                    <Link to={`/ambassadors/${campaign.id}`} className="button" style={{ 
                      padding: '6px 12px', 
                      fontSize: 12,
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)',
                      color: 'var(--white)',
                      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.2)'
                    }}>
                      Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ 
          margin: '1rem', 
          padding: '2rem', 
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)', 
          borderRadius: 12, 
          textAlign: 'center', 
          color: 'var(--white)' 
        }}>
          <h2 style={{ fontFamily: 'Calistoga, serif', fontWeight: 300, marginBottom: 16 }}>Join the Movement</h2>
          <p style={{ marginBottom: 24, opacity: 0.9 }}>Be part of a community that's making a real difference in animals' lives.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/ambassador-hub" className="button" style={{ 
              background: 'var(--white)', 
              color: 'var(--primary)',
              boxShadow: '0 2px 8px rgba(255, 255, 255, 0.2)',
              transition: 'all 0.2s'
            }}>
              Find Animals to Support
            </Link>
            <Link to="/community" className="button" style={{ 
              background: 'transparent', 
              border: '2px solid var(--white)', 
              color: 'var(--white)',
              transition: 'all 0.2s'
            }}>
              Join the Community
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 