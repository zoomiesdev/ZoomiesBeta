import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ZoomiesHeader from './components/ZoomiesHeader';
import AmbassadorProfilePage from './pages/AmbassadorProfilePage';
import AmbassadorProfilePageCopy from './pages/AmbassadorProfilePageCopy';
import AmbassadorProfilePageOld from './pages/AmbassadorProfilePageOld';
import AmbassadorHub from './pages/AmbassadorHub';
import Home from './pages/Home';
import Community from './pages/Community';
import UserProfile from './pages/UserProfile';
import SanctuaryDashboard from './pages/SanctuaryDashboard';
import Premium from './pages/Premium';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text)' }}>
        <ZoomiesHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ambassador-hub" element={<AmbassadorHub />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/sanctuary-dashboard" element={<SanctuaryDashboard />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/ambassadors/:id" element={<AmbassadorProfilePage />} />
          <Route path="/ambassadors-copy/:id" element={<AmbassadorProfilePageCopy />} />
          <Route path="/ambassadors-old/:id" element={<AmbassadorProfilePageOld />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
