import React, { useState, useEffect } from 'react';

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'light', name: 'Light', icon: '☀️', description: 'Clean & bright' },
    { id: 'dark', name: 'Dark', icon: '🌙', description: 'Blue & sleek' },
    { id: 'y2k', name: 'Girly', icon: '🌸', description: 'Pink & soft' },
    { id: 'grunge', name: 'Cybercore', icon: '💎', description: 'Glass & neon' }
  ];

  const handleThemeChange = (themeId) => {
    onThemeChange(themeId);
    setIsOpen(false);
  };

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div style={{ position: 'relative' }}>
      {/* Gear Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          color: 'var(--text)',
          background: '#f5f5f5',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        title="Theme Settings"
      >
        ⚙️
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          background: 'var(--card)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          border: '1px solid var(--border)',
          padding: '12px',
          minWidth: '200px',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text)',
            marginBottom: '12px',
            textAlign: 'center',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '8px'
          }}>
            Choose Theme
          </div>
          
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              style={{
                width: '100%',
                background: currentTheme === theme.id ? 'var(--primary)' : 'transparent',
                color: currentTheme === theme.id ? 'white' : 'var(--text)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (currentTheme !== theme.id) {
                  e.target.style.background = 'var(--gray)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentTheme !== theme.id) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>{theme.icon}</span>
              <div>
                <div style={{ fontWeight: '600' }}>{theme.name}</div>
                <div style={{ 
                  fontSize: '12px', 
                  opacity: 0.7,
                  color: currentTheme === theme.id ? 'white' : 'var(--text-secondary)'
                }}>
                  {theme.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSelector; 