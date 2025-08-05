import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthModal({ isOpen, onClose, userType = "user", initialMode = "login" }) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1002,
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        position: 'relative',
        maxWidth: 400,
        width: '100%',
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        transition: 'all 0.3s ease-out'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -50,
            right: 0,
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            color: 'white',
            fontSize: 24,
            cursor: 'pointer',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          ×
        </button>

        {/* Auth form */}
        {isLogin ? (
          <LoginForm 
            onSwitchToSignup={() => setIsLogin(false)}
            onClose={onClose}
          />
        ) : (
          <SignupForm 
            onSwitchToLogin={() => setIsLogin(true)}
            onClose={onClose}
            userType={userType}
          />
        )}
      </div>
    </div>
  );
} 