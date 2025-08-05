import React, { useState } from 'react';
import AuthModal from './AuthModal';
import SanctuaryOnboarding from './SanctuaryOnboarding';

export default function UserTypeSelection({ isOpen, onClose }) {
  const [showRegularSignup, setShowRegularSignup] = useState(false);
  const [showSanctuaryOnboarding, setShowSanctuaryOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleRegularSignup = () => {
    setShowRegularSignup(true);
  };

  const handleSanctuarySignup = () => {
    setShowSanctuaryOnboarding(true);
  };

  const handleComplete = () => {
    setShowSanctuaryOnboarding(false);
    // Redirect to sanctuary dashboard or show success message
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          background: 'var(--card)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          padding: '32px',
          minWidth: 500,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Close Button */}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: 0,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
          
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ margin: 0, color: 'var(--text)', fontSize: 24, fontWeight: 700 }}>
              Join Zoomies
            </h2>
            <p style={{ margin: '12px 0 0 0', color: 'var(--text-secondary)', fontSize: 16 }}>
              Choose how you'd like to get started
            </p>
          </div>

          {/* User Type Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Regular User Option */}
            <button
              onClick={handleRegularSignup}
              style={{
                padding: '24px',
                borderRadius: 12,
                border: '2px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--text)',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.background = 'var(--card)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.background = 'var(--background)';
              }}
            >
              <div style={{ fontSize: 48 }}>👤</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                  Regular User
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  Connect with animals, follow sanctuaries, and support causes
                </div>
              </div>
            </button>

            {/* Sanctuary Option */}
            <button
              onClick={handleSanctuarySignup}
              style={{
                padding: '24px',
                borderRadius: 12,
                border: '2px solid var(--primary)',
                background: 'var(--primary)',
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--secondary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--primary)';
              }}
            >
              <div style={{ fontSize: 48 }}>🏠</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                  Sanctuary/Shelter
                </div>
                <div style={{ fontSize: 14, opacity: 0.9 }}>
                  Create animal profiles, share updates, and raise funds
                </div>
              </div>
            </button>
          </div>

          {/* Login Option */}
          <div style={{ 
            marginTop: 16, 
            paddingTop: 16, 
            borderTop: '1px solid var(--border)',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: 14 }}>
              Already have an account?
            </p>
            <button
              onClick={handleLogin}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: '1px solid var(--primary)',
                background: 'transparent',
                color: 'var(--primary)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--primary)';
              }}
            >
              Sign In
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              marginTop: 24,
              padding: '12px 24px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Regular Signup Modal */}
      <AuthModal 
        isOpen={showRegularSignup} 
        onClose={() => {
          setShowRegularSignup(false);
          onClose();
        }}
        userType="user"
        initialMode="signup"
      />

      {/* Sanctuary Onboarding Modal */}
      <SanctuaryOnboarding
        isOpen={showSanctuaryOnboarding}
        onClose={() => {
          setShowSanctuaryOnboarding(false);
          onClose();
        }}
        onComplete={handleComplete}
      />

      {/* Login Modal */}
      <AuthModal 
        isOpen={showLogin} 
        onClose={() => {
          setShowLogin(false);
          onClose();
        }}
        userType="user"
        initialMode="login"
      />
    </>
  );
} 