import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoBlack from '../assets/LogoBlack.png';
import logoWhite from '../assets/LogoWhite.png';
import homeIcon from '../assets/HomeIcon.png';
import homeIconWhite from '../assets/HomeIconWhite.png';
import animalsIcon from '../assets/AnimalsIcon.png';
import animalsIconWhite from '../assets/AnimalsIconWhite.png';
import communityIcon from '../assets/CommunityIcon.png';
import communityIconWhite from '../assets/CommunityIconWhite.png';
import premiumIcon from '../assets/PremiumIcon.png';
import premiumIconWhite from '../assets/PremiumIconWhite.png';

export default function ZoomiesHeader() {
  // Placeholder login state
  const [user, setUser] = useState(null); // null or { name, avatar, type }
  const [theme, setTheme] = useState('light');
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState('/');
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const loginRef = useRef(null);

  const handleUserLogin = () => setUser({ name: 'Lianne', avatar: 'https://placehold.co/32x32?text=L', type: 'user' });
  const handleSanctuaryLogin = () => setUser({ name: 'Alveus Sanctuary', avatar: 'https://placehold.co/32x32?text=A', type: 'sanctuary' });
  const handleLogout = () => setUser(null);
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Close search, profile, or login dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchOpen && searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (profileDropdownOpen && profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (loginDropdownOpen && loginRef.current && !loginRef.current.contains(e.target)) {
        setLoginDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [searchOpen, profileDropdownOpen, loginDropdownOpen]);

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
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem', 
        background: 'var(--card, #fff)', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        height: '60px'
      }}>
        {/* Left side: Logo and Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={isDark ? logoWhite : logoBlack} alt="Zoomies Logo" style={{ 
            width: 53, 
            height: 56, 
            objectFit: 'cover'
          }} />
          <span style={{ 
            fontFamily: "'VT323', monospace", 
            fontSize: 24, 
            color: 'var(--primary, #fc97ca)', 
            letterSpacing: 0.1,
            fontWeight: normal,
            display: 'flex',
            alignItems: 'center',
            lineHeight: 1,
            marginTop: '6px',
            textTransform: 'uppercase'
          }}>
            zoomies
          </span>
        </div>

        {/* Center: Navigation Icons */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 32,
          marginLeft: 'auto',
          marginRight: 'auto'
        }} className="desktop-nav-icons">
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 40, 
            height: 40, 
            borderRadius: '50%',
            background: 'transparent',
            color: 'var(--text, #18171C)',
            textDecoration: 'none',
            fontSize: 18,
            transition: 'all 0.2s',
            position: 'relative',
            cursor: 'pointer'
                    }} 
          onClick={() => setCurrentPage('/')} 
          onMouseEnter={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1.1)';
            const rect = e.target.getBoundingClientRect();
            setTooltip({ 
              show: true, 
              text: 'Home', 
              x: rect.left + rect.width / 2, 
              y: rect.bottom + 8 
            });
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1)';
            setTooltip({ show: false, text: '', x: 0, y: 0 });
          }}
          title="Home">
            <img src={isDark ? homeIconWhite : homeIcon} alt="Home" style={{ width: 40, height: 40 }} />
            {currentPage === '/' && (
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '3px',
                background: 'var(--primary, #fc97ca)',
                borderRadius: '2px'
              }} />
            )}
          </Link>
          <Link to="/ambassador-hub" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 40, 
            height: 40, 
            borderRadius: '50%',
            background: 'transparent',
            color: 'var(--text, #18171C)',
            textDecoration: 'none',
            fontSize: 18,
            transition: 'all 0.2s',
            position: 'relative',
            cursor: 'pointer'
          }}
          onClick={() => setCurrentPage('/ambassador-hub')} 
          onMouseEnter={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1.1)';
            const rect = e.target.getBoundingClientRect();
            setTooltip({ 
              show: true, 
              text: 'Ambassadors', 
              x: rect.left + rect.width / 2, 
              y: rect.bottom + 8 
            });
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1)';
            setTooltip({ show: false, text: '', x: 0, y: 0 });
          }}
          title="Ambassadors">
            <img src={isDark ? animalsIconWhite : animalsIcon} alt="Animals" style={{ width: 40, height: 40 }} />
            {currentPage === '/ambassador-hub' && (
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '3px',
                background: 'var(--primary, #fc97ca)',
                borderRadius: '2px'
              }} />
            )}
          </Link>
          <Link to="/community" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 40, 
            height: 40, 
            borderRadius: '50%',
            background: 'transparent',
            color: 'var(--text, #18171C)',
            textDecoration: 'none',
            fontSize: 18,
            transition: 'all 0.2s',
            position: 'relative',
            cursor: 'pointer'
          }}
          onClick={() => setCurrentPage('/community')} 
          onMouseEnter={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1.1)';
            const rect = e.target.getBoundingClientRect();
            setTooltip({ 
              show: true, 
              text: 'Community', 
              x: rect.left + rect.width / 2, 
              y: rect.bottom + 8 
            });
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1)';
            setTooltip({ show: false, text: '', x: 0, y: 0 });
          }}
          title="Community">
            <img src={isDark ? communityIconWhite : communityIcon} alt="Community" style={{ width: 40, height: 40 }} />
            {currentPage === '/community' && (
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '3px',
                background: 'var(--primary, #fc97ca)',
                borderRadius: '2px'
              }} />
            )}
          </Link>
          <Link to="/premium" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 40, 
            height: 40, 
            borderRadius: '50%',
            background: 'transparent',
            color: 'var(--text, #18171C)',
            textDecoration: 'none',
            fontSize: 18,
            transition: 'all 0.2s',
            position: 'relative',
            cursor: 'pointer'
          }}
          onClick={() => setCurrentPage('/premium')} 
          onMouseEnter={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1.1)';
            const rect = e.target.getBoundingClientRect();
            setTooltip({ 
              show: true, 
              text: 'Pricing', 
              x: rect.left + rect.width / 2, 
              y: rect.bottom + 8 
            });
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'scale(1)';
            setTooltip({ show: false, text: '', x: 0, y: 0 });
          }}
                      title="Pricing">
                          <img src={isDark ? premiumIconWhite : premiumIcon} alt="Pricing" style={{ width: 40, height: 40 }} />
            {currentPage === '/premium' && (
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '3px',
                background: 'var(--primary, #fc97ca)',
                borderRadius: '2px'
              }} />
            )}
          </Link>
        </div>

        {/* Right side: Search, Theme, Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="header-right-actions">
          {/* Search Icon Bubble or Expanded Input */}
          {searchOpen ? (
            <form
              ref={searchRef}
              onSubmit={e => { e.preventDefault(); setSearchOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--background, #F8F6FF)',
                borderRadius: 20,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                padding: '0 0.5rem 0 1rem',
                width: 180,
                height: 40
              }}
            >
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Search Zoomies..."
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: 15,
                  outline: 'none',
                  color: 'var(--text, #18171C)'
                }}
                onBlur={() => setSearchOpen(false)}
              />
              <button type="submit" style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary, #fc97ca)',
                fontSize: 18,
                cursor: 'pointer',
                padding: '0 0.5rem'
              }}>🔍</button>
            </form>
          ) : (
            <button
              ref={searchRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--background, #F8F6FF)',
                border: 'none',
                color: 'var(--text, #18171C)',
                fontSize: 16,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Search"
              onClick={() => setSearchOpen(true)}
            >
              🔍
            </button>
          )}

          {/* Theme Toggle Bubble */}
          <button onClick={toggleTheme} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--background, #F8F6FF)',
            border: 'none',
            color: 'var(--text, #18171C)',
            fontSize: 16,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Login/User Profile Bubble with Dropdown */}
          <div ref={user ? profileRef : loginRef} style={{ position: 'relative' }}>
            {user ? (
              <button
                onClick={() => setProfileDropdownOpen(v => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--primary, #fc97ca)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 14,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  overflow: 'hidden',
                  position: 'relative',
                  padding: 0
                }}
                title={user.name}
              >
                <img src={user.avatar} alt={user.name} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }} />
                <span style={{
                  position: 'absolute',
                  right: 2,
                  bottom: 2,
                  fontSize: 13,
                  color: '#fff',
                  pointerEvents: 'none',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>▼</span>
              </button>
            ) : (
              <button
                onClick={() => setLoginDropdownOpen(v => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--primary, #fc97ca)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title="Login"
              >
                👤
              </button>
            )}
            {/* Login Dropdown */}
            {!user && loginDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 48,
                right: 0,
                background: 'var(--card, #fff)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                borderRadius: 10,
                minWidth: 170,
                zIndex: 20,
                padding: '0.5rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 0
              }}>
                <button style={{
                  padding: '0.75rem 1.25rem',
                  color: 'var(--text, #18171C)',
                  background: 'none',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: 15,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  borderBottom: '1px solid var(--border, #eee)'
                }} onClick={() => { handleUserLogin(); setLoginDropdownOpen(false); }}>
                  Login as User
                </button>
                <button style={{
                  padding: '0.75rem 1.25rem',
                  color: 'var(--primary, #fc97ca)',
                  background: 'none',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: 15,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }} onClick={() => { handleSanctuaryLogin(); setLoginDropdownOpen(false); }}>
                  Login as Sanctuary
                </button>
              </div>
            )}
            {/* Profile Dropdown */}
            {user && profileDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 48,
                right: 0,
                background: 'var(--card, #fff)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                borderRadius: 10,
                minWidth: 150,
                zIndex: 20,
                padding: '0.5rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 0
              }}>
                <Link to={user.type === 'sanctuary' ? '/sanctuary-dashboard' : '/profile'} style={{
                  padding: '0.75rem 1.25rem',
                  color: 'var(--text, #18171C)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: 15,
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  borderBottom: '1px solid var(--border, #eee)'
                }} onClick={() => setProfileDropdownOpen(false)}>
                  {user.type === 'sanctuary' ? 'View Dashboard' : 'View Profile'}
                </Link>
                <button style={{
                  padding: '0.75rem 1.25rem',
                  color: 'var(--text, #18171C)',
                  background: 'none',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: 15,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  borderBottom: '1px solid var(--border, #eee)'
                }} onClick={() => setProfileDropdownOpen(false)}>
                  Settings
                </button>
                <button style={{
                  padding: '0.75rem 1.25rem',
                  color: 'var(--primary, #fc97ca)',
                  background: 'none',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: 15,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }} onClick={() => { handleLogout(); setProfileDropdownOpen(false); }}>
                  Logout
                </button>
              </div>
            )}
          </div>
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

      {/* Custom Tooltip */}
      {tooltip.show && (
        <div style={{
          position: 'fixed',
          left: tooltip.x - 50,
          top: tooltip.y,
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500',
          zIndex: 1000,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          minWidth: '100px'
        }}>
          {tooltip.text}
        </div>
      )}

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