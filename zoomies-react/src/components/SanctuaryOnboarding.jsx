import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { storageService } from '../services/storageService';

export default function SanctuaryOnboarding({ isOpen, onClose, onComplete }) {
  const { signUp, updateUserProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);

  // Form data for each step
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Sanctuary Details
    sanctuaryName: '',
    location: '',
    description: '',
    website: '',
    phone: '',
    
    // Step 3: Verification
    verificationDocuments: [],
    sanctuaryPhotos: [],
    
    // Step 4: First Animal
    animalName: '',
    animalSpecies: '',
    animalDescription: '',
    animalPhotos: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (field, files) => {
    try {
      // For now, just store the file names as placeholders
      // TODO: Implement actual file upload when storage is set up
      const fileNames = Array.from(files).map(file => file.name);
      setFormData(prev => ({ ...prev, [field]: fileNames }));
      console.log(`Files selected for ${field}:`, fileNames);
      
      // Show success message
      setError('');
      alert(`Files uploaded successfully: ${fileNames.join(', ')}`);
    } catch (error) {
      console.error('File upload error:', error);
      setError('Failed to upload files. Please try again.');
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all fields.');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match.');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters.');
          return false;
        }
        break;
      case 2:
        if (!formData.sanctuaryName || !formData.location || !formData.description) {
          setError('Please fill in all required fields.');
          return false;
        }
        break;
      case 3:
        // Make verification optional for now
        // if (formData.verificationDocuments.length === 0) {
        //   setError('Please upload at least one verification document.');
        //   return false;
        // }
        break;
      case 4:
        if (!formData.animalName || !formData.animalSpecies || !formData.animalDescription) {
          setError('Please fill in all animal details.');
          return false;
        }
        break;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError('');

    try {
      // Create sanctuary account
      const { data, error } = await signUp(formData.email, formData.password, {
        type: 'sanctuary',
        sanctuary_name: formData.sanctuaryName,
        location: formData.location,
        description: formData.description,
        website: formData.website,
        phone: formData.phone,
        verification_documents: formData.verificationDocuments,
        sanctuary_photos: formData.sanctuaryPhotos
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Show email confirmation message
      setShowEmailConfirmation(true);
    } catch (error) {
      console.error('Onboarding error:', error);
      setError('Failed to create sanctuary account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (showEmailConfirmation) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1003,
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
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📧</div>
          <h2 style={{ margin: '0 0 16px 0', color: 'var(--text)', fontSize: 24 }}>
            Check Your Email!
          </h2>
          <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.5 }}>
            We've sent a confirmation email to <strong>{formData.email}</strong>
          </p>
          <p style={{ margin: '0 0 32px 0', color: 'var(--text-secondary)', fontSize: 14 }}>
            Click the link in the email to verify your sanctuary account and complete your setup.
          </p>
          <button
            onClick={() => {
              onClose();
              // Show success message
              alert('Sanctuary account created successfully! Please check your email to verify your account.');
            }}
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
            Got it!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
              zIndex: 1003,
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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text)', fontSize: 24, fontWeight: 700 }}>
              Sanctuary Onboarding
            </h2>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontSize: 14 }}>
              Step {currentStep} of 4
            </p>
          </div>
          <button 
            onClick={onClose}
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

        {/* Progress Bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ 
            width: '100%', 
            height: 4, 
            background: 'var(--border)', 
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(currentStep / 4) * 100}%`, 
              height: '100%', 
              background: 'var(--primary)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'var(--danger)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        {/* Step Content */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: 18 }}>
              Create Your Account
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
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
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 14
                }}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: 18 }}>
              Sanctuary Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                placeholder="Sanctuary name *"
                value={formData.sanctuaryName}
                onChange={(e) => handleInputChange('sanctuaryName', e.target.value)}
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
                placeholder="Location *"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
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
                placeholder="Tell us about your sanctuary *"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
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
              <input
                type="url"
                placeholder="Website (optional)"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
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
                type="tel"
                placeholder="Phone number (optional)"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 14
                }}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: 18 }}>
              Verification (Optional)
            </h3>
            <p style={{ margin: '0 0 20px 0', color: 'var(--text-secondary)', fontSize: 14 }}>
              Upload verification documents to help us verify your sanctuary. This step is optional for now.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontWeight: 500 }}>
                  Verification Documents *
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('verificationDocuments', Array.from(e.target.files))}
                  style={{ display: 'none' }}
                  id="verification-docs"
                />
                <label htmlFor="verification-docs" style={{
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
                  📄 Upload verification documents (licenses, permits, etc.)
                </label>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontWeight: 500 }}>
                  Sanctuary Photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload('sanctuaryPhotos', Array.from(e.target.files))}
                  style={{ display: 'none' }}
                  id="sanctuary-photos"
                />
                <label htmlFor="sanctuary-photos" style={{
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
                  📸 Upload photos of your sanctuary
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: 18 }}>
              Add Your First Animal
            </h3>
            <p style={{ margin: '0 0 20px 0', color: 'var(--text-secondary)', fontSize: 14 }}>
              Let's get started by adding your first animal profile!
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                placeholder="Animal name *"
                value={formData.animalName}
                onChange={(e) => handleInputChange('animalName', e.target.value)}
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
                value={formData.animalSpecies}
                onChange={(e) => handleInputChange('animalSpecies', e.target.value)}
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
                value={formData.animalDescription}
                onChange={(e) => handleInputChange('animalDescription', e.target.value)}
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
                  onChange={(e) => handleFileUpload('animalPhotos', Array.from(e.target.files))}
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
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: 32,
          gap: 12
        }}>
          {currentStep > 1 && (
            <button
              onClick={handleBack}
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
              Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={loading}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--primary)',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--primary)',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Creating Account...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 