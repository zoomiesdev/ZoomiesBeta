import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { animalService } from '../services/animalService';
import StompyBanner from '../assets/StompyBanner.png';
import StompyProfilePic from '../assets/StompyProfilePic.png';
import LunaBanner from '../assets/LunaBanner.png';
import LunaProfilePic from '../assets/LunaProfilePic.png';
import MaxBanner from '../assets/MaxBanner.png';
import MaxProfilePic from '../assets/MaxProfilePic.png';

export default function AmbassadorHub() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Load animals from database
  useEffect(() => {
    const loadAnimals = async () => {
      try {
        setLoading(true);
        console.log('Loading animals from database...');
        const { data, error } = await animalService.getAllAnimals();
        if (error) {
          console.error('Error loading animals:', error);
        } else {
          console.log('Animals loaded successfully:', data);
          setAnimals(data || []);
        }
      } catch (error) {
        console.error('Error loading animals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnimals();
  }, []);

  // Get unique species and sanctuaries for filter options
  const species = ['all', ...new Set(animals.map(animal => animal.animal_type || animal.species))];
  const sanctuaries = ['all', ...new Set(animals.map(animal => animal.sanctuary))];

  // Filter animals based on search and filters
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (animal.animal_type || animal.species).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.sanctuary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = selectedSpecies === 'all' || (animal.animal_type || animal.species) === selectedSpecies;
    const matchesSanctuary = selectedSanctuary === 'all' || animal.sanctuary === selectedSanctuary;
    const matchesViewMode = viewMode === 'all' || (viewMode === 'featured' && animal.featured);
    
    return matchesSearch && matchesSpecies && matchesSanctuary && matchesViewMode;
  });

  console.log('Animals state:', animals);
  console.log('Filtered animals:', filteredAnimals);

  const featuredAnimals = animals.filter(animal => animal.featured);

  return (
    <div className="ambassador-hub" style={{ minHeight: '100vh' }}>
      {/* Search and Filter Section */}
      <div className="ambassador-filters" style={{ padding: '24px 32px 16px', maxWidth: 1200, margin: '0 auto' }}>
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
              className="button pixel-font"
              style={{
                padding: '8px 24px',
                borderRadius: 8,
                background: viewMode === 'featured' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'featured' ? '#fff' : 'var(--text)',
                fontSize: 18,
                fontWeight: 'normal'
              }}
            >
              🌟 Featured
            </button>
            <button
              onClick={() => setViewMode('all')}
              className="button pixel-font"
              style={{
                padding: '8px 24px',
                borderRadius: 8,
                background: viewMode === 'all' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'all' ? '#fff' : 'var(--text)',
                fontSize: 18,
                fontWeight: 'normal'
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
            <label className="pixel-header" style={{ fontSize: 12, fontWeight: 'normal', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'block', textAlign: 'left' }}>Search</label>
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
                background: '#f5f5f5',
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
            <label className="pixel-header" style={{ fontSize: 12, fontWeight: 'normal', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 1 }}>Species</label>
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
            <label className="pixel-header" style={{ fontSize: 12, fontWeight: 'normal', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 1 }}>Sanctuary</label>
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
              className="button pixel-header"
              style={{ 
                padding: '8px 16px', 
                fontSize: 14,
                background: isDark ? '#2A2A2A' : '#fff',
                color: 'var(--text)',
                fontWeight: 'normal'
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
        {/* Results Count */}
        <div style={{ textAlign: 'center', marginBottom: 16, color: 'var(--text)', fontSize: 14 }}>
          Showing {filteredAnimals.length} of {animals.length} animals
        </div>
      </div>
            {/* Animals Grid */}
      <div className="ambassador-grid" style={{ padding: '0 32px 32px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Loading animals...
          </div>
        ) : filteredAnimals.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No animals found. {animals.length === 0 ? 'No animals have been added yet.' : 'Try adjusting your filters.'}
          </div>
        ) : (
          filteredAnimals.map((animal) => (
            <div key={animal.id} className="ambassador-card" style={{ 
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
                  src={animal.cover_img || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop&crop=center'} 
                  alt={animal.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
                {animal.featured && (
                  <div className="pixel-header" style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'var(--primary)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 'normal'
                  }}>
                    ⭐ Featured
                  </div>
                )}
              </div>
              {/* Content */}
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <img 
                    src={animal.profile_img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${animal.name}`} 
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
                    <h2 className="pixel-header" style={{ margin: '0 0 4px 0', fontSize: 20, fontWeight: 'normal' }}>{animal.name}</h2>
                    <p style={{ color: 'var(--primary)', margin: 0, fontSize: 14, fontWeight: 600 }}>{animal.animal_type || animal.species}</p>
                  </div>
                </div>
                <p style={{ color: 'var(--text)', margin: '0 0 16px 0', fontSize: 14, opacity: 0.8 }}>
                  {animal.sanctuary}
                </p>
                <p style={{ color: 'var(--text)', margin: '0 0 16px 0', fontSize: 14, lineHeight: 1.4 }}>
                  {animal.about || 'No description available.'}
                </p>
                {/* Progress Bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text)', opacity: 0.7 }}>${(animal.donation_raised || 0).toLocaleString()}</span>
                    <span style={{ color: 'var(--text)', opacity: 0.7 }}>{animal.donation_goal > 0 ? Math.round(((animal.donation_raised || 0)/animal.donation_goal)*100) : 0}%</span>
                  </div>
                  <div style={{ width: '100%', background: isDark ? '#2A2A2A' : 'var(--gray)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${animal.donation_goal > 0 ? Math.round(((animal.donation_raised || 0)/animal.donation_goal)*100) : 0}%`,  
                        background: 'linear-gradient(90deg, var(--primary), var(--pink))', 
                        height: '100%', 
                        borderRadius: 6 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/animal/${animal.id}`} className="button pixel-font" style={{ 
                  padding: '8px 16px', 
                  fontSize: 16,
                  flex: 1,
                  textAlign: 'center',
                  background: 'linear-gradient(90deg, var(--accent), var(--primary))',
                  color: 'var(--button-text, #fff)',
                  border: 'none',
                  borderRadius: 20
                }}>
                  View Profile
                </Link>
                <button className="button pixel-font" style={{ 
                  padding: '8px 16px', 
                  fontSize: 16,
                  background: 'var(--primary)',
                  color: 'var(--button-text, #fff)',
                  flex: 1
                }}>
                  Donate
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* No Results Message */}
      {filteredAnimals.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text)' }}>
          <h3 className="pixel-header" style={{ marginBottom: 16, fontWeight: 'normal' }}>No animals found</h3>
          <p style={{ opacity: 0.7 }}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
} 