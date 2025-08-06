import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseTest() {
  const [status, setStatus] = useState('Testing...');
  const [session, setSession] = useState(null);
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [loginResult, setLoginResult] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('Testing Supabase connection...');
      
      // Test basic connection
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        setStatus(`❌ Connection failed: ${error.message}`);
      } else {
        setStatus('✅ Supabase connected successfully');
      }

      // Test session
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  const testLogin = async () => {
    try {
      setLoginResult('Testing login...');
      
      // Add timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout after 10 seconds')), 10000)
      );
      
      const loginPromise = supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      const { data, error } = await Promise.race([loginPromise, timeoutPromise]);
      
      if (error) {
        setLoginResult(`❌ Login failed: ${error.message}`);
      } else {
        setLoginResult(`✅ Login successful: ${data.user?.email}`);
      }
    } catch (err) {
      setLoginResult(`❌ Login error: ${err.message}`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      left: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace',
      maxWidth: '300px'
    }}>
      <div><strong>Supabase Test:</strong></div>
      <div>{status}</div>
      <div>Session: {session ? 'Active' : 'None'}</div>
      
      <div style={{ marginTop: '10px' }}>
        <input
          type="email"
          placeholder="Test email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '4px 8px',
            marginBottom: '5px',
            fontSize: '11px'
          }}
        />
        <input
          type="password"
          placeholder="Test password"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '4px 8px',
            marginBottom: '5px',
            fontSize: '11px'
          }}
        />
        <button
          onClick={testLogin}
          style={{
            width: '100%',
            padding: '4px 8px',
            fontSize: '11px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Login
        </button>
      </div>
      
      {loginResult && (
        <div style={{ marginTop: '10px', fontSize: '10px', wordBreak: 'break-all' }}>
          {loginResult}
        </div>
      )}
    </div>
  );
} 