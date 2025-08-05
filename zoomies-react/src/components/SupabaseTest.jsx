import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .limit(1);

      if (error) {
        setConnectionStatus('❌ Connection Failed');
        setError(error.message);
      } else {
        setConnectionStatus('✅ Connected to Supabase!');
        setError(null);
      }
    } catch (err) {
      setConnectionStatus('❌ Connection Failed');
      setError(err.message);
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      background: 'var(--card)',
      borderRadius: '12px',
      border: '1px solid var(--border)'
    }}>
      <h3>🔗 Supabase Connection Test</h3>
      <p><strong>Status:</strong> {connectionStatus}</p>
      {error && (
        <div style={{ 
          background: '#fee', 
          padding: '10px', 
          borderRadius: '8px', 
          marginTop: '10px',
          color: '#c33'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <button 
        onClick={testConnection}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Test Connection Again
      </button>
    </div>
  );
} 