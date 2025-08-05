import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ZoomiesHeader from './components/ZoomiesHeader';
import AmbassadorProfilePage from './pages/AmbassadorProfilePage';
import AmbassadorProfilePageCopy from './pages/AmbassadorProfilePageCopy';
import AmbassadorProfilePageOld from './pages/AmbassadorProfilePageOld';
import EditableAmbassadorProfile from './pages/EditableAmbassadorProfile';
import SampleUserProfile from './pages/SampleUserProfile';
import AmbassadorHub from './pages/AmbassadorHub';
import Home from './pages/Home';
import Community from './pages/Community';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';
import SanctuaryDashboard from './pages/SanctuaryDashboard';
import Premium from './pages/Premium';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="tv-stripes-background" style={{ minHeight: '100vh', color: 'var(--text)' }}>
          <ZoomiesHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ambassador-hub" element={<AmbassadorHub />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sanctuary-dashboard" element={<SanctuaryDashboard />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/ambassadors/:id" element={<AmbassadorProfilePage />} />
            <Route path="/ambassadors-copy/:id" element={<AmbassadorProfilePageCopy />} />
            <Route path="/ambassadors-old/:id" element={<AmbassadorProfilePageOld />} />
            <Route path="/edit-ambassador/:id" element={<EditableAmbassadorProfile />} />
            <Route path="/user/:username" element={<SampleUserProfile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
