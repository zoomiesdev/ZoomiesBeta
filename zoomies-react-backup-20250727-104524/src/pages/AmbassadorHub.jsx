import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ANIMALS = {
  stompy: {
    name: 'Stompy the Goat',
    species: 'Goat',
    sanctuary: 'Alveus Sanctuary',
    profileImg: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=center',
    coverImg: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop&crop=center',
    donation: { raised: 815, goal: 2000 },
    featured: true,
    story: 'Stompy loves headbutts and to climb and explore!',
    followers: 1247
  },
  luna: {
    name: 'Luna the Cow',
    species: 'Cow',
    sanctuary: 'Gentle Barn',
    profileImg: 'https://picsum.photos/100/100?random=1',
    coverImg: 'https://picsum.photos/400/200?random=1',
    donation: { raised: 1200, goal: 2500 },
    featured: true,
    story: 'Luna is the gentlest soul you\'ll ever meet.',
    followers: 892
  },
  bella: {
    name: 'Bella the Pig',
    species: 'Pig',
    sanctuary: 'Sunny Acres',
    profileImg: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=100&h=100&fit=crop&crop=center',
    coverImg: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=200&fit=crop&crop=center',
    donation: { raised: 600, goal: 1800 },
    featured: false,
    story: 'Bella loves belly rubs and mud baths!',
    followers: 456
  },
  max: {
    name: 'Max the Horse',
    species: 'Horse',
    sanctuary: 'Freedom Reins',
    profileImg: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=100&h=100&fit=crop&crop=center',
    coverImg: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=200&fit=crop&crop=center',
    donation: { raised: 2000, goal: 3000 },
    featured: true,
    story: 'Max is a retired racehorse who loves carrots.',
    followers: 2034
  },
};

export default function AmbassadorHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedSanctuary, setSelectedSanctuary] = useState('all');
  const [viewMode, setViewMode] = useState('featured'); // 'featured' or 'all'
  const [isDark, setIsDark] = useState(false);

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

  // Get unique species and sanctuaries for filter options
  const species = ['all', ...new Set(Object.values(ANIMALS).map(animal => animal.species))];
  const sanctuaries = ['all', ...new Set(Object.values(ANIMALS).map(animal => animal.sanctuary))];

  // Filter animals based on search and filters
  const filteredAnimals = Object.entries(ANIMALS).filter(([id, animal]) => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.sanctuary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = selectedSpecies === 'all' || animal.species === selectedSpecies;
    const matchesSanctuary = selectedSanctuary === 'all' || animal.sanctuary === selectedSanctuary;
    const matchesViewMode = viewMode === 'all' || (viewMode === 'featured' && animal.featured);
    
    return matchesSearch && matchesSpecies && matchesSanctuary && matchesViewMode;
  });

  const featuredAnimals = Object.entries(ANIMALS).filter(([id, animal]) => animal.featured);

  return (
    <div className="ambassador-hub" style={{ background: 'var(--background)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        padding: '24px 32px',
        textAlign: 'center',
        color: 'var(--white)'
      }}>
        <h1 style={{ fontFamily: 'Calistoga, serif', fontWeight: 300, fontSize: 36, marginBottom: 8 }}>
          Meet Our Ambassador Animals
        </h1>
        <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 24 }}>
          Support these amazing animals and help them thrive in their sanctuaries.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="ambassador-filters" style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
        {/* View Mode Tabs */}
        <div className="ambassador-tabs" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ 
            display: 'flex', 
            background: isDark ? 'var(--card)' : '#fff', 
            borderRadius: 12, 
            padding: 4 
          }}>
            <button
              onClick={() => setViewMode('featured')}
              className="button"
              style={{
                padding: '8px 24px',
                borderRadius: 8,
                background: viewMode === 'featured' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'featured' ? '#fff' : 'var(--text)',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              🌟 Featured
            </button>
            <button
              onClick={() => setViewMode('all')}
              className="button"
              style={{
                padding: '8px 24px',
                borderRadius: 8,
                background: viewMode === 'all' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'all' ? '#fff' : 'var(--text)',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              🐾 All Animals
            </button>
          </div>
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', maxWidth: 150, marginRight: 48 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'block', textAlign: 'left' }}>Search</label>
            <input
              type="text"
              placeholder="Search animals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 36px',
                fontSize: 14,
                border: '1.5px solid var(--border)',
                borderRadius: 8,
                background: 'var(--background)',
                color: 'var(--text)',
                outline: 'none'
              }}
            />
            <span style={{
              position: 'absolute',
              left: 12,
              top: '70%',
              transform: 'translateY(-50%)',
              fontSize: 12,
              color: 'var(--text)',
              opacity: 0.6,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '20px',
              marginTop: 1
            }}>
              🔍
            </span>
          </div>
          {/* Species Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 1 }}>Species</label>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                border: '1.5px solid var(--border)',
                borderRadius: 8,
                background: 'var(--background)',
                color: 'var(--text)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {species.map(species => (
                <option key={species} value={species}>
                  {species === 'all' ? 'All Species' : species}
                </option>
              ))}
            </select>
          </div>
          {/* Sanctuary Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 1 }}>Sanctuary</label>
            <select
              value={selectedSanctuary}
              onChange={(e) => setSelectedSanctuary(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                border: '1.5px solid var(--border)',
                borderRadius: 8,
                background: 'var(--background)',
                color: 'var(--text)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {sanctuaries.map(sanctuary => (
                <option key={sanctuary} value={sanctuary}>
                  {sanctuary === 'all' ? 'All Sanctuaries' : sanctuary}
                </option>
              ))}
            </select>
          </div>
          {/* Clear Filters Button */}
          <div style={{ display: 'flex', alignItems: 'end', paddingTop: 10 }}>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecies('all');
                setSelectedSanctuary('all');
              }}
              className="button"
              style={{ 
                padding: '8px 16px', 
                fontSize: 14,
                background: isDark ? '#2A2A2A' : '#fff',
                color: 'var(--text)'
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
        {/* Results Count */}
        <div style={{ textAlign: 'center', marginBottom: 32, color: 'var(--text)', fontSize: 14 }}>
          Showing {filteredAnimals.length} of {Object.keys(ANIMALS).length} animals
        </div>
      </div>
      {/* Animals Grid */}
      <div className="ambassador-grid" style={{ padding: '0 32px 32px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {filteredAnimals.map(([id, animal]) => (
          <div key={id} className="ambassador-card" style={{ 
            background: 'var(--card)', 
            borderRadius: 16, 
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)', 
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}>
            {/* Cover Image */}
            <div style={{ position: 'relative', height: 160 }}>
              <img 
                src={animal.coverImg} 
                alt={animal.name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }} 
              />
              {animal.featured && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'var(--primary)',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  ⭐ Featured
                </div>
              )}
            </div>
            {/* Content */}
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <img 
                  src={animal.profileImg} 
                  alt={animal.name} 
                  style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    marginRight: 12
                  }} 
                />
                <div>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 600 }}>{animal.name}</h2>
                  <p style={{ color: 'var(--primary)', margin: 0, fontSize: 14, fontWeight: 600 }}>{animal.species}</p>
                </div>
              </div>
              <p style={{ color: 'var(--text)', margin: '0 0 16px 0', fontSize: 14, opacity: 0.8 }}>
                {animal.sanctuary}
              </p>
              <p style={{ color: 'var(--text)', margin: '0 0 16px 0', fontSize: 14, lineHeight: 1.4 }}>
                {animal.story}
              </p>
              {/* Progress Bar */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text)', opacity: 0.7 }}>${animal.donation.raised.toLocaleString()}</span>
                  <span style={{ color: 'var(--text)', opacity: 0.7 }}>{Math.round((animal.donation.raised/animal.donation.goal)*100)}%</span>
                </div>
                <div style={{ width: '100%', background: isDark ? '#2A2A2A' : 'var(--gray)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${Math.round((animal.donation.raised/animal.donation.goal)*100)}%`, 
                      background: 'linear-gradient(90deg, var(--primary), var(--pink))', 
                      height: '100%', 
                      borderRadius: 6 
                    }}
                  ></div>
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/ambassadors/${id}`} className="button" style={{ 
                  padding: '8px 16px', 
                  fontSize: 14,
                  flex: 1,
                  textAlign: 'center',
                  background: 'linear-gradient(90deg, var(--accent), var(--primary))',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 20
                }}>
                  View Profile
                </Link>
                <button className="button" style={{ 
                  padding: '8px 16px', 
                  fontSize: 14,
                  background: 'var(--primary)',
                  color: '#fff',
                  flex: 1
                }}>
                  Donate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* No Results Message */}
      {filteredAnimals.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text)' }}>
          <h3 style={{ marginBottom: 16 }}>No animals found</h3>
          <p style={{ opacity: 0.7 }}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
} 