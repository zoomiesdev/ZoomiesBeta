import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ANIMALS = {};

export default function AmbassadorProfilePageOld() {
  const { id } = useParams();
  const animal = null;
  
  // If no animal data, show empty state
  if (!animal) {
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
        <h1 style={{ color: 'var(--text)', margin: 0 }}>No Animal Found</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>This animal profile is not available.</p>
      </div>
    );
  }
  const [custom, setCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
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

  return (
    <div className="ambassador-profile" style={{ background: 'var(--background)' }}>
      {/* Cover and Profile Hero */}
      <div style={{ position: 'relative', width: '100%', height: 260, background: `url(${animal.coverImg}) center/cover no-repeat` }}>
        <div style={{ position: 'absolute', left: '50%', bottom: -70, transform: 'translateX(-50%)', zIndex: 2 }}>
          <img
            src={animal.profileImg}
            alt={animal.name}
            style={{ width: 140, height: 140, borderRadius: '50%', border: '6px solid var(--background)', objectFit: 'cover', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
          />
        </div>
      </div>
      {/* Centered Profile Info and Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 90, marginBottom: 12}}>
        <h1 style={{ fontFamily: 'Calistoga, serif', fontSize: 40, margin: 0, color: 'var(--text)' }}>{animal.name}</h1>
        <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 20, marginBottom: 24 }}>
          {animal.sanctuary} <span style={{ color: 'var(--pink)', fontWeight: 400 }}>• {animal.species}</span>
        </div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 8 }}>
          <button className="button" style={{ color: isDark ? 'var(--text)' : '#fff', fontSize: 20, minWidth: 120, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="gift">🎁</span> Donate
          </button>
          <button className="button" style={{ color: isDark ? 'var(--text)' : '#fff', fontSize: 20, minWidth: 120, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="heart">💖</span> Follow
          </button>
          <button className="button" style={{ background: isDark ? 'var(--accent)' : 'var(--pink)', color: isDark ? 'var(--text)' : '#fff', fontSize: 20, minWidth: 120, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="link">🔗</span> Share
          </button>
        </div>
      </div>
      {/* Fundraising Progress Bar */}
      <div style={{ maxWidth: 750, margin: '0 auto', marginBottom: 32 }}>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: '0.75rem 2.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>
            ${animal.donation.raised} raised of ${animal.donation.goal} goal ({Math.round((animal.donation.raised/animal.donation.goal)*100)}%)
          </div>
          <div style={{ width: '100%', background: 'var(--gray)', borderRadius: 10, height: 10, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: `${Math.round((animal.donation.raised/animal.donation.goal)*100)}%`, background: 'linear-gradient(90deg, var(--primary), var(--pink))', height: '100%', borderRadius: 10, transition: 'width 0.4s' }}></div>
          </div>
          {/* Donation Amount Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {[5, 15, 25].map(amount => (
              <button key={amount} className="button" style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15, borderRadius: 18, minWidth: 48, padding: '0.3rem 0.9rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                ${amount}
              </button>
            ))}
            <button className="button" style={{ background: isDark ? 'var(--accent)' : 'var(--pink)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 18, minWidth: 60, padding: '0.3rem 1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} onClick={() => setCustom(c => !c)}>
              Custom
            </button>
          </div>
          {custom && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>$</span>
              <input
                type="number"
                min="1"
                value={customValue}
                onChange={e => setCustomValue(e.target.value)}
                style={{ border: '1px solid var(--primary)', borderRadius: 8, padding: '0.5rem 1rem', fontSize: 16, width: 100 }}
                placeholder="Amount"
              />
              <button className="button" style={{ color: '#fff', fontWeight: 700, fontSize: 16, borderRadius: 12, padding: '0.5rem 1.25rem' }}>Donate</button>
            </div>
          )}
        </div>
      </div>
      {/* Profile Tabs with Full-Width Border */}
      <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 0, marginTop: 0, borderBottom: '2.5px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48 }}>
          {['Timeline', 'About', 'Donations', 'Photos', 'More'].map((tab, i) => (
            <a
              key={tab}
              href="#"
              className={i === 0 ? 'active' : ''}
              style={{
                color: i === 0 ? 'var(--primary)' : 'var(--text)',
                borderBottom: i === 0 ? '3px solid var(--primary)' : '3px solid transparent',
                fontWeight: 600,
                fontSize: 20,
                padding: '0.75rem 1.75rem',
                background: 'none',
                transition: 'all 0.2s',
                textDecoration: 'none',
                margin: 0,
                display: 'inline-block',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.background = 'rgba(182,230,255,0.10)';
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.color = 'var(--text)';
                  e.currentTarget.style.background = 'none';
                }
              }}
            >
              {tab}
            </a>
          ))}
        </div>
      </div>
      {/* Main Content (Timeline, About, etc.) */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
        <div className="content" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, padding: 32 }}>
          <div>
            <div className="card" style={{ background: 'var(--card, #1a1a1a)', padding: 24, borderRadius: 16, marginBottom: 24 }}>
              <h2>About {animal.name.split(' ')[0]}</h2>
              <p>{animal.about}</p>
              <p><strong>Joined:</strong> {animal.joined}</p>
              <button className="button" style={{ color: isDark ? 'var(--text)' : '#fff' }}>Learn More</button>
            </div>
            {/* Improved Photo Gallery */}
            <div className="gallery" style={{ background: 'var(--card, #1a1a1a)', padding: 24, borderRadius: 16, marginBottom: 24 }}>
              <h2>Photo Gallery</h2>
              <div className="photo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
                {(animal.gallery.slice(0, 9)).map((img, i) => (
                  <img key={i} src={img} alt={`${animal.name} ${i+1}`} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
                ))}
              </div>
              <a href="#" style={{ display: 'block', marginTop: 16, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', textAlign: 'right' }}>See all photos</a>
            </div>
            <div className="comments" style={{ background: 'var(--card, #1a1a1a)', padding: 24, borderRadius: 16, marginBottom: 24 }}>
              <h2>Comments</h2>
              {animal.comments.map((c, i) => (
                <p key={i}><strong>{c.user}:</strong> {c.text}</p>
              ))}
              <div style={{ marginTop: 16, display: 'flex' }}>
                <input type="text" placeholder="Add a comment..." style={{ flex: 1, padding: '0.5rem', borderRadius: '6px 0 0 6px', border: '1.5px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
                <button className="button" style={{ borderRadius: '0 6px 6px 0' }}>Post</button>
              </div>
            </div>
            <div className="leaderboard" style={{ background: 'var(--card, #1a1a1a)', padding: 24, borderRadius: 16 }}>
              <h2>Top Supporters 🏆 </h2>
              <ol>
                {animal.supporters.map((s, i) => (
                  <li key={i}><strong>{s.name}</strong> – ${s.amount.toLocaleString()}</li>
                ))}
              </ol>
            </div>
          </div>
          <div>
            <div className="status" style={{ background: 'var(--card, #1a1a1a)', padding: 24, borderRadius: 16, marginBottom: 24 }}>
              <h2>🤪 {animal.name.split(' ')[0]} is feeling: <span style={{ color: 'var(--primary, #fc97ca)' }}>Silly</span></h2>
              <div className="status-box" style={{ background: 'var(--gray, #222)', padding: 16, borderRadius: 12, marginBottom: 16 }}>Just had a big bowl of insects — thanks Name for the $25 treat!</div>
            </div>
            <div className="status" style={{ background: 'var(--card, #1a1a1a)', padding: 24, borderRadius: 16, marginBottom: 24 }}>
              <p><strong>🎥 Video - 3 hours ago</strong></p>
              <img src="https://placehold.co/100x50?text=Video+Placeholder" alt="Video placeholder" style={{ width: '100%', borderRadius: 8, marginBottom: 12 }} />
              <div className="status-box" style={{ background: 'var(--gray, #222)', padding: 16, borderRadius: 12, marginBottom: 12 }}>Check out Stompy's latest antics in the pasture!</div>
              <div className="reactions" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 8 }}>
                <button className="button">👍</button>
                <button className="button">😂</button>
                <button className="button">😍</button>
                <button className="button">😢</button>
              </div>
              <div className="comment-box" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <input type="text" placeholder="Add a comment..." style={{ width: 200, padding: '0.5rem', borderRadius: '6px 0 0 6px', border: '1.5px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
                <button className="button" style={{ borderRadius: '0 6px 6px 0' }}>Post</button>
              </div>
            </div>
            {/* Add more status/posts as needed */}
          </div>
        </div>
      </div>
    </div>
  );
} 