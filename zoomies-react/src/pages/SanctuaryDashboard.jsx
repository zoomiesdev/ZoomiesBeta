import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { animalService } from '../services/animalService';
import { storageService } from '../services/storageService';

export default function SanctuaryDashboard() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAnimal, setShowAddAnimal] = useState(false);
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    species: '',
    description: '',
    photos: []
  });

  useEffect(() => {
    if (user) {
      loadAnimals();
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

  const handleAddAnimal = async () => {
    try {
      setLoading(true);
      
      // Upload photos if any
      let photoUrls = [];
      if (newAnimal.photos.length > 0) {
        for (const file of newAnimal.photos) {
          const { url } = await storageService.uploadFile(file, 'animal-photos');
          photoUrls.push(url);
        }
      }

      const animalData = {
        name: newAnimal.name,
        species: newAnimal.species,
        description: newAnimal.description,
        profile_img: photoUrls[0] || null,
        cover_img: photoUrls[1] || null
      };

      const { data, error } = await animalService.createAnimal(animalData);
      
      if (error) {
        console.error('Error creating animal:', error);
        alert('Failed to create animal profile. Please try again.');
      } else {
        console.log('Animal created successfully:', data);
        setShowAddAnimal(false);
        setNewAnimal({ name: '', species: '', description: '', photos: [] });
        loadAnimals();
      }
    } catch (error) {
      console.error('Error creating animal:', error);
      alert('Failed to create animal profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (files) => {
    setNewAnimal(prev => ({ ...prev, photos: Array.from(files) }));
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
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, color: 'var(--text)', fontSize: 32, fontWeight: 700 }}>
          Sanctuary Dashboard
        </h1>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontSize: 16 }}>
          Manage your animal profiles and sanctuary information
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 16, 
        marginBottom: 32 
      }}>
        <div style={{
          background: 'var(--card)',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
            {animals.length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Animal Profiles
          </div>
        </div>
        
        <div style={{
          background: 'var(--card)',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)', marginBottom: 8 }}>
            {animals.filter(a => a.status === 'Active').length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Active Animals
          </div>
        </div>
      </div>

      {/* Add Animal Button */}
      <div style={{ marginBottom: 24 }}>
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

      {/* Animals Grid */}
      {loading ? (
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
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Start by adding your first animal profile
          </p>
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
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
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
              
              <input
                type="text"
                placeholder="Species *"
                value={newAnimal.species}
                onChange={(e) => setNewAnimal(prev => ({ ...prev, species: e.target.value }))}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 14
                }}
              />
              
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
                  Animal Photos
                </label>
                <input
                  type="file"
                  multiple
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
                  📸 Upload photos of this animal
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
                disabled={loading || !newAnimal.name || !newAnimal.species || !newAnimal.description}
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