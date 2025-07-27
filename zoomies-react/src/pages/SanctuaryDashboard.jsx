import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data for sanctuary dashboard
const SANCTUARY_DATA = {
  name: 'Alveus Sanctuary',
  location: 'Austin, TX',
  logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=60&h=60&fit=crop&crop=center',
  coverPhoto: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=300&fit=crop&crop=center'
};

const FUNDRAISING_STATS = {
  totalRaised: 45230,
  monthlyGoal: 50000,
  activeCampaigns: 8,
  totalDonors: 1247,
  averageDonation: 36.25,
  monthlyGrowth: 12.5
};

const RECENT_DONATIONS = [
  { donor: 'Clara M.', amount: 50, animal: 'Stompy', time: '2 hours ago', type: 'Monthly' },
  { donor: 'Sam R.', amount: 25, animal: 'Luna', time: '4 hours ago', type: 'One-time' },
  { donor: 'Jess K.', amount: 100, animal: 'Bella', time: '1 day ago', type: 'Emergency' },
  { donor: 'Mike T.', amount: 75, animal: 'General Fund', time: '2 days ago', type: 'General' },
  { donor: 'Sarah L.', amount: 30, animal: 'Stompy', time: '3 days ago', type: 'Monthly' }
];

const ANIMAL_STATUS = [
  { name: 'Stompy', species: 'Goat', status: 'Active', followers: 1247, raised: 815, goal: 2000, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=60&h=60&fit=crop&crop=center' },
  { name: 'Luna', species: 'Cow', status: 'Recovering', followers: 892, raised: 1200, goal: 2500, image: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4?w=60&h=60&fit=crop&crop=center' },
  { name: 'Bella', species: 'Pig', status: 'Thriving', followers: 456, raised: 300, goal: 1000, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=60&h=60&fit=crop&crop=center' },
  { name: 'Max', species: 'Horse', status: 'Active', followers: 234, raised: 150, goal: 800, image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=60&h=60&fit=crop&crop=center' }
];

const UPCOMING_EVENTS = [
  { name: 'Volunteer Day', date: '2024-01-15', time: '9:00 AM', attendees: 24, type: 'Volunteer' },
  { name: 'Open House', date: '2024-01-20', time: '2:00 PM', attendees: 45, type: 'Public' },
  { name: 'Fundraising Gala', date: '2024-02-01', time: '7:00 PM', attendees: 120, type: 'Fundraiser' }
];

const ANALYTICS = {
  pageViews: 15420,
  uniqueVisitors: 8920,
  engagementRate: 68.5,
  socialShares: 2340,
  emailSubscribers: 567,
  volunteerHours: 1240
};

export default function SanctuaryDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderProgressBar = (current, max) => {
    const percentage = Math.min((current / max) * 100, 100);
    return (
      <div style={{ width: '100%', height: 8, background: 'var(--gray)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--pink))', borderRadius: 4 }} />
      </div>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="sanctuary-dashboard" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1rem' }}>
      {/* Header */}
      <div className="dashboard-header" style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={SANCTUARY_DATA.logo} alt="Sanctuary Logo" style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }} />
        <div className="header-info">
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>{SANCTUARY_DATA.name}</h1>
          <p style={{ margin: 0, color: 'var(--text)', opacity: 0.7 }}>Dashboard • {SANCTUARY_DATA.location}</p>
        </div>
        <div className="header-actions" style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <button className="button">📊 Export Report</button>
          <button className="button">⚙️ Settings</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)' }}>{formatCurrency(FUNDRAISING_STATS.totalRaised)}</div>
          <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>Total Raised</div>
        </div>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)' }}>{FUNDRAISING_STATS.activeCampaigns}</div>
          <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>Active Campaigns</div>
        </div>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)' }}>{FUNDRAISING_STATS.totalDonors}</div>
          <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>Total Donors</div>
        </div>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📈</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)' }}>+{FUNDRAISING_STATS.monthlyGrowth}%</div>
          <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>Monthly Growth</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--gray)' }}>
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'fundraising', label: 'Fundraising', icon: '💰' },
          { id: 'animals', label: 'Animals', icon: '🐾' },
          { id: 'events', label: 'Events', icon: '📅' },
          { id: 'analytics', label: 'Analytics', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text)',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 16,
              transition: 'background 0.2s, color 0.2s'
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'linear-gradient(90deg, var(--accent), var(--primary))';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text)';
              }
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Main Content */}
        <div className="main-content">
          {activeTab === 'overview' && (
            <>
              {/* Monthly Goal Progress */}
              <div className="card" style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: 20 }}>Monthly Fundraising Goal</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(FUNDRAISING_STATS.totalRaised)} raised</span>
                  <span style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>Goal: {formatCurrency(FUNDRAISING_STATS.monthlyGoal)}</span>
                </div>
                {renderProgressBar(FUNDRAISING_STATS.totalRaised, FUNDRAISING_STATS.monthlyGoal)}
                <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>
                  {Math.round((FUNDRAISING_STATS.totalRaised / FUNDRAISING_STATS.monthlyGoal) * 100)}% of goal reached
                </div>
              </div>

              {/* Recent Donations */}
              <div className="card" style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: 20 }}>Recent Donations</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {RECENT_DONATIONS.map((donation, index) => (
                    <div key={index} className="donation-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--gray)' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{donation.donor}</div>
                        <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>For {donation.animal} • {donation.time}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatCurrency(donation.amount)}</div>
                        <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.7 }}>{donation.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'fundraising' && (
            <div className="card" style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>Fundraising Campaigns</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {ANIMAL_STATUS.map(animal => (
                  <div key={animal.name} className="fundraising-campaign" style={{ background: 'var(--background)', borderRadius: 12, padding: 16 }}>
                    <div className="campaign-content" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <img src={animal.image} alt={animal.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
                      <div className="campaign-info" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 18 }}>{animal.name}</div>
                            <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>{animal.species} • {animal.followers} followers</div>
                          </div>
                          <span style={{ fontSize: 12, padding: '4px 8px', background: 'var(--primary)', color: '#fff', borderRadius: 12 }}>{animal.status}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>{formatCurrency(animal.raised)} raised of {formatCurrency(animal.goal)}</span>
                          <span style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>{Math.round((animal.raised / animal.goal) * 100)}%</span>
                        </div>
                        {renderProgressBar(animal.raised, animal.goal)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'animals' && (
            <div className="card" style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>Animal Management</h2>
              <div className="animals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                {ANIMAL_STATUS.map(animal => (
                  <div key={animal.name} className="animal-card" style={{ background: 'var(--background)', borderRadius: 12, padding: 16 }}>
                    <img src={animal.image} alt={animal.name} style={{ width: '100%', height: 120, borderRadius: 8, objectFit: 'cover', marginBottom: 12 }} />
                    <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{animal.name}</div>
                    <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7, marginBottom: 8 }}>{animal.species}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>{animal.followers} followers</span>
                      <span style={{ fontSize: 12, padding: '4px 8px', background: 'var(--primary)', color: '#fff', borderRadius: 12 }}>{animal.status}</span>
                    </div>
                    <div className="animal-actions" style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button className="button" style={{ flex: 1, fontSize: 12, padding: '6px 12px' }}>Edit</button>
                      <button className="button" style={{ flex: 1, fontSize: 12, padding: '6px 12px' }}>View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="card" style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>Upcoming Events</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {UPCOMING_EVENTS.map((event, index) => (
                  <div key={index} className="event-item" style={{ background: 'var(--background)', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 18 }}>{event.name}</div>
                      <span style={{ fontSize: 12, padding: '4px 8px', background: 'var(--accent)', color: '#fff', borderRadius: 12 }}>{event.type}</span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7, marginBottom: 8 }}>
                      {event.date} at {event.time} • {event.attendees} attendees
                    </div>
                    <div className="event-actions" style={{ display: 'flex', gap: 8 }}>
                      <button className="button" style={{ fontSize: 12, padding: '6px 12px' }}>Edit</button>
                      <button className="button" style={{ fontSize: 12, padding: '6px 12px' }}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="card" style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>Analytics Overview</h2>
              <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div style={{ background: 'var(--background)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>👁️</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--primary)' }}>{ANALYTICS.pageViews.toLocaleString()}</div>
                  <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>Page Views</div>
                </div>
                <div style={{ background: 'var(--background)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>👤</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--primary)' }}>{ANALYTICS.uniqueVisitors.toLocaleString()}</div>
                  <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>Unique Visitors</div>
                </div>
                <div style={{ background: 'var(--background)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--primary)' }}>{ANALYTICS.engagementRate}%</div>
                  <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>Engagement Rate</div>
                </div>
                <div style={{ background: 'var(--background)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>📧</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--primary)' }}>{ANALYTICS.emailSubscribers}</div>
                  <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>Email Subscribers</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Quick Actions */}
          <div className="quick-actions" style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 20 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="button" style={{ textAlign: 'center' }}>
                🐾 Add New Animal
              </button>
              <button className="button" style={{ textAlign: 'center' }}>
                💰 Create Fundraiser
              </button>
              <button className="button" style={{ textAlign: 'center' }}>
                📅 Schedule Event
              </button>
              <button className="button" style={{ textAlign: 'center' }}>
                📸 Post Update
              </button>
              <button className="button" style={{ textAlign: 'center' }}>
                📊 Generate Report
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity" style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 20 }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--gray)' }}>
                <div style={{ fontSize: 16 }}>💰</div>
                <div className="activity-content" style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, marginBottom: 2 }}>New donation: $50 from Clara M.</div>
                  <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.6 }}>2 hours ago</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--gray)' }}>
                <div style={{ fontSize: 16 }}>🐾</div>
                <div className="activity-content" style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, marginBottom: 2 }}>New follower: Stompy gained 12 followers</div>
                  <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.6 }}>4 hours ago</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--gray)' }}>
                <div style={{ fontSize: 16 }}>📅</div>
                <div className="activity-content" style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, marginBottom: 2 }}>Event created: Volunteer Day</div>
                  <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.6 }}>1 day ago</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--gray)' }}>
                <div style={{ fontSize: 16 }}>📸</div>
                <div className="activity-content" style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, marginBottom: 2 }}>New post: Luna's recovery update</div>
                  <div style={{ fontSize: 12, color: 'var(--text)', opacity: 0.6 }}>2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 