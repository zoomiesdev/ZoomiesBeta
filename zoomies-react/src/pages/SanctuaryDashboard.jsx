import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { animalService } from '../services/animalService';
import { storageService } from '../services/storageService';

export default function SanctuaryDashboard() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('animals');
  const [showAddAnimal, setShowAddAnimal] = useState(false);
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    animalType: '',
    species: '',
    description: '',
    photos: []
  });

  // Mock data for stats and fundraising
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeCampaigns: 0,
    totalDonors: 0,
    monthlyGrowth: 0,
    monthlyGoal: 5000,
    recentDonations: []
  });

  useEffect(() => {
    if (user) {
      loadAnimals();
      loadStats();
    }
  }, [user]);

  const loadAnimals = async () => {
    try {
      const { data, error } = await animalService.getAnimalsBySanctuary(user.sanctuary_name);
      if (error) {
        console.error('Error loading animals:', error);
      } else {
        setAnimals(data || []);
      }
    } catch (error) {
      console.error('Error loading animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    // Mock stats for now - would be real API calls
    setStats({
      totalRaised: 0,
      activeCampaigns: animals.length,
      totalDonors: 0,
      monthlyGrowth: 0,
      monthlyGoal: 5000,
      recentDonations: []
    });
  };

  const handleAddAnimal = async () => {
    try {
      console.log('Starting animal creation...');
      console.log('Form data:', newAnimal);
      setLoading(true);
      
      // Upload photos if any
      let photoUrls = [];
      if (newAnimal.photos.length > 0) {
        console.log('Uploading', newAnimal.photos.length, 'photo(s)...');
        for (const file of newAnimal.photos) {
          try {
            console.log('Uploading file:', file.name, file.size);
            const { url } = await storageService.uploadFile(file, 'animal-photos');
            photoUrls.push(url);
            console.log('Photo uploaded successfully:', url);
          } catch (uploadError) {
            console.error('Photo upload failed:', uploadError);
            // Continue without photos if upload fails
          }
        }
      }

      const animalData = {
        name: newAnimal.name,
        animal_type: newAnimal.animalType,
        species: newAnimal.species,
        description: newAnimal.description,
        profile_img: photoUrls[0] || null,
        cover_img: null // Only using profile image for now
      };

      console.log('Calling animalService.createAnimal with:', animalData);
      const { data, error } = await animalService.createAnimal(animalData);
      
      if (error) {
        console.error('Error creating animal:', error);
        alert(`Failed to create animal profile: ${error.message || 'Unknown error'}`);
      } else {
        console.log('Animal created successfully:', data);
        setShowAddAnimal(false);
        setNewAnimal({ name: '', animalType: '', species: '', description: '', photos: [] });
        loadAnimals();
        loadStats(); // Refresh stats
        
        // Navigate to the new animal's profile
        window.location.href = `#/animal/${data.id}`;
      }
    } catch (error) {
      console.error('Error creating animal:', error);
      alert(`Failed to create animal profile: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (files) => {
    setNewAnimal(prev => ({ ...prev, photos: Array.from(files) }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const renderProgressBar = (current, max) => {
    const percentage = Math.min((current / max) * 100, 100);
    return (
      <div style={{ 
        width: '100%', 
        height: 8, 
        background: 'var(--border)', 
        borderRadius: 4, 
        overflow: 'hidden',
        marginTop: 8
      }}>
        <div style={{ 
          width: `${percentage}%`, 
          height: '100%', 
          background: 'linear-gradient(90deg, var(--primary), var(--secondary))', 
          borderRadius: 4 
        }} />
      </div>
    );
  };

  if (!user) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Loading...</h2>
        <p>Please wait while we load your sanctuary dashboard.</p>
      </div>
    );
  }

  if (user.type !== 'sanctuary') {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>This dashboard is only available for sanctuary accounts.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        background: 'var(--card)', 
        borderRadius: 16, 
        padding: 24, 
        marginBottom: 24, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 16 
      }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          color: 'white'
        }}>
          🏠
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: 'var(--text)' }}>
            {user.sanctuary_name || 'Your Sanctuary'}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Dashboard • {user.location || 'Your Location'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--text)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--card)';
            e.target.style.color = 'var(--text)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
          >
            📊 Export Report
          </button>
          <button style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--text)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--card)';
            e.target.style.color = 'var(--text)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 16, 
        marginBottom: 24 
      }}>
        <div style={{
          background: 'var(--card)',
          borderRadius: 16,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>
            {formatCurrency(stats.totalRaised)}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Total Raised</div>
        </div>
        
        <div style={{
          background: 'var(--card)',
          borderRadius: 16,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>
            {stats.activeCampaigns}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Active Campaigns</div>
        </div>
        
        <div style={{
          background: 'var(--card)',
          borderRadius: 16,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>
            {stats.totalDonors}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Total Donors</div>
        </div>
        
        <div style={{
          background: 'var(--card)',
          borderRadius: 16,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📈</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>
            +{stats.monthlyGrowth}%
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Monthly Growth</div>
        </div>
      </div>



      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: 4, 
        marginBottom: 24, 
        borderBottom: '2px solid var(--border)',
        padding: '0 4px'
      }}>
        {[
          { id: 'animals', label: 'Animals', icon: '🐾' },
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'fundraising', label: 'Fundraising', icon: '💰' },
          { id: 'analytics', label: 'Analytics', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--primary)' : 'var(--background)',
              color: activeTab === tab.id ? 'white' : 'var(--text)',
              border: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid var(--border)',
              borderBottom: '2px solid var(--background)',
              padding: '14px 24px',
              borderRadius: '12px 12px 0 0',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 15,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
              transform: activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
              position: 'relative',
              marginBottom: '-2px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.background = 'var(--primary)';
                e.target.style.color = 'white';
                e.target.style.border = '2px solid var(--primary)';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.background = 'var(--background)';
                e.target.style.color = 'var(--text)';
                e.target.style.border = '2px solid var(--border)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Main Content */}
        <div>
          {activeTab === 'animals' && (
            <div>
              {loading && animals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>Loading animals...</div>
                </div>
              ) : animals.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  background: 'var(--card)',
                  borderRadius: 12,
                  border: '2px dashed var(--border)'
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
                  <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>
                    No animals yet
                  </h3>
                  <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)' }}>
                    Start by adding your first animal profile
                  </p>
                  <button
                    onClick={() => setShowAddAnimal(true)}
                    style={{
                      padding: '12px 24px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'var(--primary)',
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    + Add Animal Profile
                  </button>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: 20 
                }}>
                  {animals.map(animal => (
                    <div key={animal.id} style={{
                      background: 'var(--card)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    }}
                    onClick={() => window.location.href = `#/animal/${animal.id}`}
                    >
                      <div style={{
                        height: 200,
                        background: animal.profile_img ? `url(${animal.profile_img})` : 'var(--background)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 48,
                        color: 'var(--text-secondary)'
                      }}>
                        {!animal.profile_img && '🐾'}
                      </div>
                      <div style={{ padding: 20 }}>
                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)', fontSize: 18 }}>
                          {animal.name}
                        </h3>
                        <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: 14 }}>
                          {animal.species}
                        </p>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
                          {animal.about}
                        </p>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginTop: 16 
                        }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                            background: animal.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                            color: 'white'
                          }}>
                            {animal.status}
                          </span>
                          <button style={{
                            padding: '6px 12px',
                            borderRadius: 6,
                            border: '1px solid var(--border)',
                            background: 'var(--background)',
                            color: 'var(--text)',
                            fontSize: 12,
                            cursor: 'pointer'
                          }}>
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'overview' && (
            <div>
              {/* Monthly Fundraising Goal */}
              <div style={{ 
                background: 'var(--card)', 
                borderRadius: 16, 
                padding: 24, 
                marginBottom: 24 
              }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: 20, color: 'var(--text)' }}>
                  Monthly Fundraising Goal
                </h2>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: 8 
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {formatCurrency(stats.totalRaised)} raised
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    Goal: {formatCurrency(stats.monthlyGoal)}
                  </span>
                </div>
                {renderProgressBar(stats.totalRaised, stats.monthlyGoal)}
                <div style={{ 
                  marginTop: 12, 
                  fontSize: 14, 
                  color: 'var(--text-secondary)' 
                }}>
                  {Math.round((stats.totalRaised / stats.monthlyGoal) * 100)}% of goal reached
                </div>
              </div>

              {/* Recent Donations */}
              <div style={{ 
                background: 'var(--card)', 
                borderRadius: 16, 
                padding: 24 
              }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: 20, color: 'var(--text)' }}>
                  Recent Donations
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {stats.recentDonations.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                      No recent donations yet
                    </p>
                  ) : (
                    stats.recentDonations.map((donation, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '12px 0', 
                        borderBottom: '1px solid var(--border)' 
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                            {donation.donor}
                          </div>
                          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                            For {donation.animal} • {donation.time}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                            {formatCurrency(donation.amount)}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            {donation.type}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fundraising' && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 16, 
              padding: 24 
            }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 24, color: 'var(--text)' }}>
                Fundraising Campaigns
              </h2>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
                Fundraising features coming soon!
              </p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 16, 
              padding: 24 
            }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: 24, color: 'var(--text)' }}>
                Analytics Overview
              </h2>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
                Analytics features coming soon!
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Quick Actions */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: 16, 
            padding: 24,
            marginBottom: 24
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 20, color: 'var(--text)' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => setShowAddAnimal(true)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--primary)',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  justifyContent: 'flex-start'
                }}
              >
                🐾 Add New Animal
              </button>
              <button style={{
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--text)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                justifyContent: 'flex-start',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--card)';
                e.target.style.color = 'var(--text)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
              >
                💰 Create Fundraiser
              </button>
              <button style={{
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--text)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                justifyContent: 'flex-start',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--card)';
                e.target.style.color = 'var(--text)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
              >
                📅 Schedule Event
              </button>
              <button style={{
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--text)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                justifyContent: 'flex-start',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--card)';
                e.target.style.color = 'var(--text)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
              >
                📸 Post Update
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: 16, 
            padding: 24
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 20, color: 'var(--text)' }}>
              Recent Activity
            </h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              padding: '32px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📝</div>
              <div style={{ fontSize: 16, color: 'var(--text)', marginBottom: 8, fontWeight: 500 }}>
                No recent activity
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Your recent activities will appear here as you use the dashboard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Animal Modal */}
      {showAddAnimal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
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
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, color: 'var(--text)', fontSize: 24, fontWeight: 700 }}>
                Add Animal Profile
              </h2>
              <button 
                onClick={() => setShowAddAnimal(false)}
                style={{
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
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                placeholder="Animal name *"
                value={newAnimal.name}
                onChange={(e) => setNewAnimal(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 14
                }}
              />
              
              <div style={{ display: 'flex', gap: 12 }}>
                <select
                  value={newAnimal.animalType}
                  onChange={(e) => setNewAnimal(prev => ({ ...prev, animalType: e.target.value }))}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--text)',
                    fontSize: 14,
                    flex: 1
                  }}
                >
                  <option value="">Select animal type *</option>
                  <option value="Dog">🐕 Dog</option>
                  <option value="Cat">🐱 Cat</option>
                  <option value="Pig">🐷 Pig</option>
                  <option value="Lizard">🦎 Lizard</option>
                  <option value="Horse">🐎 Horse</option>
                  <option value="Cattle">🐄 Cattle</option>
                  <option value="Insect">🦋 Insect</option>
                  <option value="Bird">🐦 Bird</option>
                  <option value="Amphibian">🐸 Amphibian</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Specific breed/species"
                  value={newAnimal.species}
                  onChange={(e) => setNewAnimal(prev => ({ ...prev, species: e.target.value }))}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--text)',
                    fontSize: 14,
                    flex: 1
                  }}
                />
              </div>
              
              <textarea
                placeholder="Tell us about this animal *"
                value={newAnimal.description}
                onChange={(e) => setNewAnimal(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 14,
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontWeight: 500 }}>
                  Animal Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  style={{ display: 'none' }}
                  id="animal-photos"
                />
                <label htmlFor="animal-photos" style={{
                  display: 'block',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '2px dashed var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text-secondary)',
                  fontSize: 14,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                  📸 Upload profile picture for this animal
                </label>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 12,
              marginTop: 24
            }}>
              <button
                onClick={() => setShowAddAnimal(false)}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddAnimal}
                disabled={loading || !newAnimal.name || !newAnimal.animalType || !newAnimal.description}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--primary)',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: (loading || !newAnimal.name || !newAnimal.species || !newAnimal.description) ? 0.5 : 1
                }}
              >
                {loading ? 'Creating...' : 'Add Animal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 