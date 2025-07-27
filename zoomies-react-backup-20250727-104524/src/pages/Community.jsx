import React, { useState, useEffect } from 'react';

const SECTIONS = [
  'Animal Care',
  'Pet Pics',
  'Sanctuary AMAs',
  'Adoption Tips',
  'Rescue Stories',
];

const TOPICS = [
  { name: 'Animal Care', icon: '🐾', color: '#FFB3E6' },
  { name: 'Pet Pics', icon: '📸', color: '#E6B6FF' },
  { name: 'Sanctuary AMAs', icon: '🏠', color: '#B6E6FF' },
  { name: 'Adoption Tips', icon: '💝', color: '#FFE6B6' },
  { name: 'Rescue Stories', icon: '🆘', color: '#E6FFB6' },
  { name: 'Training Tips', icon: '🎓', color: '#FFB6E6' },
  { name: 'Health & Wellness', icon: '🏥', color: '#B6FFE6' },
  { name: 'Behavior Issues', icon: '🤔', color: '#E6B6FF' },
];

const RECENT_COMMUNITIES = [
  { name: '/AnimalCare', members: '12.5k', avatar: '🐾' },
  { name: '/PetPics', members: '8.2k', avatar: '📸' },
  { name: '/SanctuaryLife', members: '5.1k', avatar: '🏠' },
  { name: '/AdoptionStories', members: '3.8k', avatar: '💝' },
  { name: '/RescueHeroes', members: '7.3k', avatar: '🆘' },
];

const TRENDING_POSTS = [
  { id: 1, section: 'Rescue Stories', title: 'We saved 10 ducklings!', user: 'Megan', time: '5h ago', image: 'https://placehold.co/300x200?text=Ducklings', upvotes: 15, source: 'r/RescueHeroes' },
  { id: 2, section: 'Sanctuary AMAs', title: 'Ask us anything about goats!', user: 'AlveusSanctuary', time: '3h ago', image: 'https://placehold.co/300x200?text=Goats', upvotes: 20, source: 'r/SanctuaryLife' },
  { id: 3, section: 'Pet Pics', title: 'My cat in a box 🐱', user: 'Sam', time: '1h ago', image: 'https://placehold.co/300x200?text=Cat+Box', upvotes: 8, source: 'r/PetPics' },
  { id: 4, section: 'Health & Wellness', title: 'Vaccination schedule for kittens', user: 'Dr. Sarah', time: '7h ago', image: 'https://placehold.co/300x200?text=Kittens', upvotes: 18, source: 'r/AnimalCare' },
  { id: 5, section: 'Training Tips', title: 'Teaching my dog to sit properly', user: 'Alex', time: '6h ago', image: 'https://placehold.co/300x200?text=Dog+Training', upvotes: 9, source: 'r/TrainingTips' },
];

const POSTS = [
  { id: 1, section: 'Animal Care', title: 'Best food for senior dogs?', user: 'Clara', time: '2h ago', tags: ['care', 'dogs'], upvotes: 12, comments: 3, mod: false },
  { id: 2, section: 'Pet Pics', title: 'My cat in a box 🐱', user: 'Sam', time: '1h ago', tags: ['pics', 'cats'], upvotes: 8, comments: 2, mod: false },
  { id: 3, section: 'Sanctuary AMAs', title: 'Ask us anything about goats!', user: 'AlveusSanctuary', time: '3h ago', tags: ['AMA', 'goats'], upvotes: 20, comments: 7, mod: true },
  { id: 4, section: 'Adoption Tips', title: 'How to introduce a new bunny?', user: 'Jess', time: '4h ago', tags: ['adoption', 'bunnies'], upvotes: 5, comments: 1, mod: false },
  { id: 5, section: 'Rescue Stories', title: 'We saved 10 ducklings!', user: 'Megan', time: '5h ago', tags: ['rescue', 'ducks'], upvotes: 15, comments: 4, mod: false },
  { id: 6, section: 'Training Tips', title: 'Teaching my dog to sit properly', user: 'Alex', time: '6h ago', tags: ['training', 'dogs'], upvotes: 9, comments: 2, mod: false },
  { id: 7, section: 'Health & Wellness', title: 'Vaccination schedule for kittens', user: 'Dr. Sarah', time: '7h ago', tags: ['health', 'cats'], upvotes: 18, comments: 5, mod: true },
];

export default function Community() {
  const [selectedSection, setSelectedSection] = useState('all');
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

  const filteredPosts = selectedSection === 'all' 
    ? POSTS 
    : POSTS.filter(post => post.section === selectedSection);

  return (
    <div className="community-root" style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'var(--background)',
      overflowX: 'hidden'
    }}>
      {/* Left Sidebar */}
      <div style={{ 
        width: 280, 
        minWidth: 280,
        background: 'var(--card)', 
        borderRight: '1px solid var(--border)',
        padding: '24px 0',
        position: 'fixed',
        top: 100,
        left: 0,
        height: 'calc(100vh - 80px)',
        overflowY: 'auto',
        flexShrink: 0,
        zIndex: 50
      }}>
        {/* Search Bar */}
        <div style={{ padding: '0 24px', marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search communities..."
              style={{
                width: '180px',
                padding: '12px 16px 12px 40px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--text)',
                fontSize: 14,
                outline: 'none'
              }}
            />
            <span style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 16,
              color: 'var(--text-secondary)',
              opacity: 0.6
            }}>
              🔍
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <div style={{ padding: '0 24px', marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Navigation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button 
              className="button" 
              style={{ 
                justifyContent: 'flex-start', 
                background: selectedSection === 'all' ? 'linear-gradient(90deg, var(--accent), var(--primary))' : 'transparent',
                color: selectedSection === 'all' ? '#fff' : 'var(--text)',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 16,
                fontWeight: 500
              }}
              onClick={() => setSelectedSection('all')}
            >
              🏠 Home
            </button>
            <button 
              className="button" 
              style={{ 
                justifyContent: 'flex-start', 
                background: 'transparent',
                color: 'var(--text)',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 16,
                fontWeight: 500
              }}
            >
              🔥 Popular
            </button>
            <button 
              className="button" 
              style={{ 
                justifyContent: 'flex-start', 
                background: 'transparent',
                color: 'var(--text)',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 16,
                fontWeight: 500
              }}
            >
              💬 Discussions
            </button>
          </div>
        </div>

        {/* Recent Communities */}
        <div style={{ padding: '0 24px', marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Recent Communities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {RECENT_COMMUNITIES.map((community, index) => (
              <button 
                key={index}
                className="button" 
                style={{ 
                  justifyContent: 'flex-start', 
                  background: 'transparent',
                  color: 'var(--text)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                <span style={{ fontSize: 16, marginRight: 8 }}>{community.avatar}</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 600 }}>{community.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{community.members} members</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div style={{ padding: '0 24px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Topics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOPICS.map((topic, index) => (
              <button 
                key={index}
                className="button" 
                style={{ 
                  justifyContent: 'flex-start', 
                  background: selectedSection === topic.name ? 'linear-gradient(90deg, var(--accent), var(--primary))' : (isDark ? 'var(--background)' : 'transparent'),
                  color: selectedSection === topic.name ? '#fff' : 'var(--text)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 14,
                  fontWeight: 500
                }}
                onClick={() => setSelectedSection(topic.name)}
              >
                <span style={{ fontSize: 16, marginRight: 8 }}>{topic.icon}</span>
                {topic.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px', minWidth: 0, marginLeft: 280 }}>
        {/* Mobile Category Bar */}
        <div className="category-bar" style={{
          display: 'none',
          overflowX: 'auto',
          gap: 8,
          padding: '8px 0 12px 0',
          marginBottom: 16,
          borderBottom: '1px solid var(--border)'
        }}>
          <button
            className="button"
            style={{
              minWidth: 80,
              background: selectedSection === 'all' ? 'var(--primary)' : 'var(--background)',
              color: selectedSection === 'all' ? 'var(--background)' : 'var(--text)',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
            onClick={() => setSelectedSection('all')}
          >
            🏠 All
          </button>
          {TOPICS.map((topic, idx) => (
            <button
              key={topic.name}
              className="button"
              style={{
                minWidth: 80,
                background: selectedSection === topic.name ? 'var(--primary)' : 'var(--background)',
                color: selectedSection === topic.name ? 'var(--background)' : 'var(--text)',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              onClick={() => setSelectedSection(topic.name)}
            >
              <span style={{ fontSize: 16 }}>{topic.icon}</span> {topic.name}
            </button>
          ))}
          {/* Mobile Search Bar */}
          <div style={{
            width: '100%',
            marginTop: 8,
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Search posts..."
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--text)',
                fontSize: 16,
                outline: 'none'
              }}
            />
            <span style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 16,
              color: 'var(--text)',
              opacity: 0.6
            }}>
              🔍
            </span>
          </div>
        </div>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Trending Posts Scroll */}
          <div style={{ marginBottom: 32, position: 'relative' }}>
            <div className="trending-scroll" style={{ 
              display: 'flex', 
              gap: 16, 
              overflowX: 'auto', 
              paddingBottom: 8,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              maxWidth: '100%',
              position: 'relative'
            }}
            ref={(el) => {
              if (el) {
                el.addEventListener('wheel', (e) => {
                  e.preventDefault();
                  el.scrollLeft += e.deltaY;
                });
              }
            }}>
              {TRENDING_POSTS.map(post => (
                <div key={post.id} style={{ 
                  minWidth: 240, 
                  maxWidth: 280,
                  background: 'var(--card)', 
                  borderRadius: 12, 
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  flexShrink: 0
                }}>
                  <img 
                    src={post.image} 
                    alt={post.title}
                    style={{ 
                      width: '100%', 
                      height: 140, 
                      objectFit: 'cover' 
                    }} 
                  />
                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ 
                        background: 'var(--primary)', 
                        color: 'var(--background)', 
                        borderRadius: 6, 
                        padding: '2px 8px', 
                        fontSize: 12, 
                        fontWeight: 600 
                      }}>
                        {post.section}
                      </span>
                    </div>
                    <h3 style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: 16, 
                      fontWeight: 600, 
                      color: 'var(--text)',
                      lineHeight: 1.3
                    }}>
                      {post.title}
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      fontSize: 12,
                      color: 'var(--text)',
                      opacity: 0.7
                    }}>
                      <span>{post.source}</span>
                      <span>▲ {post.upvotes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Scroll Arrow */}
            <button 
              className="button"
              style={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 10
              }}
              onClick={(e) => {
                e.preventDefault();
                const container = e.currentTarget.previousElementSibling;
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
            >
              →
            </button>
          </div>

          {/* Sort Options */}
          <div className="sort-options" style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
            <button className="button" style={{ background: 'var(--primary)', color: 'var(--background)', padding: '8px 16px', fontSize: 14 }}>Best</button>
            <button className="button" style={{ background: isDark ? '#2A2A2A' : 'transparent', color: 'var(--text)', padding: '8px 16px', fontSize: 14 }}>New</button>
            <button className="button" style={{ background: isDark ? '#2A2A2A' : 'transparent', color: 'var(--text)', padding: '8px 16px', fontSize: 14 }}>Top</button>
            <button className="button" style={{ background: isDark ? '#2A2A2A' : 'transparent', color: 'var(--text)', padding: '8px 16px', fontSize: 14 }}>Rising</button>
          </div>

          {/* Posts */}
          <div className="post-list" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredPosts.map(post => (
              <div key={post.id} className="post-card" style={{ 
                background: 'var(--card)', 
                borderRadius: 12, 
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)', 
                padding: 16,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16
              }}>
                {/* Upvote Button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 40 }}>
                  <button className="button" style={{ 
                    minWidth: 32, 
                    minHeight: 32, 
                    borderRadius: 8, 
                    fontSize: 16, 
                    color: 'var(--primary)', 
                    background: 'transparent',
                    padding: 0
                  }}>
                    ▲
                  </button>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{post.upvotes}</span>
                  <button className="button" style={{ 
                    minWidth: 32, 
                    minHeight: 32, 
                    borderRadius: 8, 
                    fontSize: 16, 
                    color: 'var(--text)', 
                    background: 'transparent',
                    padding: 0
                  }}>
                    ▼
                  </button>
                </div>

                {/* Post Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ 
                      background: 'var(--primary)', 
                      color: 'var(--background)', 
                      borderRadius: 6, 
                      padding: '2px 8px', 
                      fontSize: 12, 
                      fontWeight: 600 
                    }}>
                      {post.section}
                    </span>
                    {post.mod && (
                      <span style={{ 
                        background: 'var(--accent)', 
                        color: 'var(--text)', 
                        borderRadius: 6, 
                        padding: '2px 8px', 
                        fontSize: 12, 
                        fontWeight: 600 
                      }}>
                        MOD
                      </span>
                    )}
                  </div>
                  
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>
                    {post.title}
                  </h3>
                  
                  <div style={{ color: 'var(--text)', fontSize: 14, marginBottom: 12, opacity: 0.7 }}>
                    Posted by <strong>u/{post.user}</strong> • {post.time}
                  </div>
                  
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{ 
                        background: 'var(--gray)', 
                        color: 'var(--text)', 
                        borderRadius: 6, 
                        padding: '2px 8px', 
                        fontSize: 12 
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <button className="button" style={{ 
                      background: 'transparent', 
                      color: 'var(--text)', 
                      padding: '4px 8px', 
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      💬 {post.comments} comments
                    </button>
                    <button className="button" style={{ 
                      background: 'transparent', 
                      color: 'var(--text)', 
                      padding: '4px 8px', 
                      fontSize: 14 
                    }}>
                      Share
                    </button>
                    <button className="button" style={{ 
                      background: 'transparent', 
                      color: 'var(--text)', 
                      padding: '4px 8px', 
                      fontSize: 14 
                    }}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredPosts.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: 48, 
                color: 'var(--text)', 
                opacity: 0.7 
              }}>
                <h3>No posts yet in this section.</h3>
                <p>Be the first to start a discussion!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 