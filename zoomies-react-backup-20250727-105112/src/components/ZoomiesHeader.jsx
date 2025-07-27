import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoBlack from '../assets/LogoBlack.png';
import logoWhite from '../assets/LogoWhite.png';

export default function ZoomiesHeader() {
  // Placeholder login state
  const [user, setUser] = useState(null); // null or { name, avatar, type }
  const [theme, setTheme] = useState('light');
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleUserLogin = () => setUser({ name: 'Lianne', avatar: 'https://placehold.co/32x32?text=L', type: 'user' });
  const handleSanctuaryLogin = () => setUser({ name: 'Alveus Sanctuary', avatar: 'https://placehold.co/32x32?text=A', type: 'sanctuary' });
  const handleLogout = () => setUser(null);
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Apply theme to document root (for CSS vars)
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    <>
      <header className="zoomies-header" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.5rem 2rem', background: 'var(--card, #fff)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src={isDark ? logoWhite : logoBlack} alt="Zoomies Logo" style={{ 
            width: 80, 
            height: 86, 
            objectFit: 'cover'
          }} />
          <span style={{ fontFamily: 'Calistoga, serif', fontSize: 25, color: 'var(--primary, #fc97ca)', letterSpacing: 1 }}>Zoomies</span>
          <nav className="desktop-nav" style={{ display: 'flex', gap: 24, fontSize: 18 }}>
            <Link to="/" style={{ color: 'var(--text, #18171C)', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
            <Link to="/ambassador-hub" style={{ color: 'var(--text, #18171C)', textDecoration: 'none', fontWeight: 500 }}>Animals</Link>
            <Link to="/community" style={{ color: 'var(--text, #18171C)', textDecoration: 'none', fontWeight: 500 }}>Community</Link>
            <Link to="/premium" style={{ color: 'var(--text, #18171C)', textDecoration: 'none', fontWeight: 500 }}>Premium</Link>
          </nav>
        </div>
        <form className="desktop-search" style={{ flex: 1, maxWidth: 240, margin: '0 1.25rem', display: 'flex', alignItems: 'center', background: 'var(--background, #F8F6FF)', borderRadius: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <input type="text" placeholder="Search Zoomies..." style={{ flex: 1, border: 'none', background: 'transparent', padding: '0.5rem 1rem', fontSize: 16, outline: 'none', color: 'var(--text, #18171C)' }} />
          <button type="submit" style={{ background: 'none', border: 'none', padding: '0 1rem', cursor: 'pointer', color: 'var(--primary, #fc97ca)', fontSize: 16 }}></button>
        </form>
        <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={toggleTheme} className="button" style={{ 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 20, 
            padding: '0.5rem 1rem', 
            fontSize: 18, 
            cursor: 'pointer', 
            marginRight: 8,
            boxShadow: '0 2px 8px rgba(255, 107, 107, 0.2)',
            transition: 'all 0.2s'
          }} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to={user.type === 'sanctuary' ? '/sanctuary-dashboard' : '/profile'} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <img src={user.avatar} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                <span style={{ color: 'var(--primary, #fc97ca)', fontWeight: 600 }}>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="button" style={{ border: 'none', borderRadius: 20, padding: '0.5rem 1rem', fontWeight: 600, marginLeft: 8, cursor: 'pointer' }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleUserLogin} className="button" style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 20, 
                padding: '0.5rem 1rem', 
                fontWeight: 600, 
                fontSize: 14, 
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.2)',
                transition: 'all 0.2s'
              }}>User</button>
              <button onClick={handleSanctuaryLogin} className="button" style={{ 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 20, 
                padding: '0.5rem 1rem', 
                fontWeight: 600, 
                fontSize: 14, 
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.2)',
                transition: 'all 0.2s'
              }}>Sanctuary</button>
            </div>
          )}
        </div>
        
        {/* Mobile hamburger button */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: 'var(--text)',
            padding: '0.5rem'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
            display: 'none'
          }}
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile menu */}
      <div 
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: 0,
          right: mobileMenuOpen ? 0 : '-300px',
          width: '280px',
          height: '100vh',
          background: 'var(--card)',
          boxShadow: '0 0 20px rgba(0,0,0,0.2)',
          zIndex: 100,
          transition: 'right 0.3s ease',
          padding: '2rem 1rem',
          display: 'none'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
          {/* Mobile search */}
          <form style={{ display: 'flex', alignItems: 'center', background: 'var(--background)', borderRadius: 12, padding: '0.5rem', marginBottom: 16 }}>
            <input 
              type="text" 
              placeholder="Search Zoomies..." 
              style={{ 
                flex: 1, 
                border: 'none', 
                background: 'transparent', 
                padding: '0.5rem', 
                fontSize: 16, 
                outline: 'none', 
                color: 'var(--text)' 
              }} 
            />
            <button 
              type="submit" 
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: '0.5rem', 
                cursor: 'pointer', 
                color: 'var(--primary)', 
                fontSize: 16 
              }}
            >
              🔍
            </button>
          </form>

          {/* Mobile navigation */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Link 
              to="/" 
              onClick={toggleMobileMenu}
              style={{ 
                color: 'var(--text)', 
                textDecoration: 'none', 
                fontWeight: 500, 
                fontSize: 18,
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--gray)'
              }}
            >
              🏠 Home
            </Link>
            <Link 
              to="/ambassador-hub" 
              onClick={toggleMobileMenu}
              style={{ 
                color: 'var(--text)', 
                textDecoration: 'none', 
                fontWeight: 500, 
                fontSize: 18,
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--gray)'
              }}
            >
              🐾 Animals
            </Link>
            <Link 
              to="/community" 
              onClick={toggleMobileMenu}
              style={{ 
                color: 'var(--text)', 
                textDecoration: 'none', 
                fontWeight: 500, 
                fontSize: 18,
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--gray)'
              }}
            >
              👥 Community
            </Link>
            <Link 
              to="/premium" 
              onClick={toggleMobileMenu}
              style={{ 
                color: 'var(--text)', 
                textDecoration: 'none', 
                fontWeight: 500, 
                fontSize: 18,
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--gray)'
              }}
            >
              ⭐ Premium
            </Link>
          </nav>

          {/* Mobile login/logout - moved up */}
          <div style={{ marginTop: 16 }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 0' }}>
                  <img src={user.avatar} alt={user.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                  <div>
                    <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 16 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.7 }}>{user.type === 'sanctuary' ? 'Sanctuary' : 'User'}</div>
                  </div>
                </div>
                <Link 
                  to={user.type === 'sanctuary' ? '/sanctuary-dashboard' : '/profile'} 
                  onClick={toggleMobileMenu}
                  className="button"
                  style={{ 
                    width: '100%',
                    textAlign: 'center',
                    textDecoration: 'none',
                    background: 'var(--primary)',
                    color: '#fff',
                    padding: '0.75rem',
                    borderRadius: 12,
                    fontWeight: 600
                  }}
                >
                  View Profile
                </Link>
                <button 
                  onClick={() => { handleLogout(); toggleMobileMenu(); }} 
                  className="button" 
                  style={{ 
                    width: '100%',
                    border: 'none', 
                    borderRadius: 12, 
                    padding: '0.75rem', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    background: 'var(--gray)',
                    color: 'var(--text)'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button 
                  onClick={() => { handleUserLogin(); toggleMobileMenu(); }} 
                  className="button" 
                  style={{ 
                    width: '100%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 12, 
                    padding: '0.75rem', 
                    fontWeight: 600, 
                    fontSize: 16, 
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(255, 107, 107, 0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  👤 Login as User
                </button>
                <button 
                  onClick={() => { handleSanctuaryLogin(); toggleMobileMenu(); }} 
                  className="button" 
                  style={{ 
                    width: '100%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 12, 
                    padding: '0.75rem', 
                    fontWeight: 600, 
                    fontSize: 16, 
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(255, 107, 107, 0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  🏠 Login as Sanctuary
                </button>
              </div>
            )}
          </div>

          {/* Mobile theme toggle - moved down */}
          <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--gray)' }}>
            <button 
              onClick={toggleTheme} 
              className="button" 
              style={{ 
                width: '100%',
                border: 'none', 
                borderRadius: 12, 
                padding: '0.75rem', 
                fontSize: 16, 
                cursor: 'pointer',
                marginBottom: 16,
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--light-pink) 100%)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.2)',
                transition: 'all 0.2s'
              }} 
              title="Toggle theme"
            >
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 