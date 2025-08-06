import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { animalService } from '../services/animalService';
import { storageService } from '../services/storageService';
import { postService } from '../services/postService';

export default function AnimalProfile() {
  const { animalId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    animal_type: '',
    species: '',
    about: '',
    donation_goal: 0,
    profile_img: null,
    cover_img: null,
    age: '',
    rescued_date: '',
    personality: [],
    current_needs: []
  });
  
  // Post form state
  const [postForm, setPostForm] = useState({
    content: '',
    image: null
  });

  // Donation form state
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  
  // Post states
  const [newPost, setNewPost] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  
  // Tab states
  const [activeTab, setActiveTab] = useState('timeline');
  
  // Comment states
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  
  // Customize profile states
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizeData, setCustomizeData] = useState({
    backgroundType: 'inherit',
    backgroundColor: 'inherit',
    backgroundImage: null,
    buttonColor: 'var(--primary)',
    headerTextColor: '#ffffff',
    bodyTextColor: 'var(--text-secondary)',
    leftSidebarWidgets: [],
    rightSidebarWidgets: []
  });

  useEffect(() => {
    loadAnimal();
    loadPosts();
    loadComments();
  }, [animalId, user]);

  const loadAnimal = async () => {
    try {
      const { data, error } = await animalService.getAnimalById(animalId);
      if (error) {
        console.error('Error loading animal:', error);
        return;
      }
      
      setAnimal(data);
      setEditForm({
        name: data.name || '',
        animal_type: data.animal_type || '',
        species: data.species || '',
        about: data.about || '',
        donation_goal: data.donation_goal || 0,
        profile_img: data.profile_img,
        cover_img: data.cover_img,
        age: data.age || '',
        rescued_date: data.rescued_date || '',
        personality: data.personality || ['Playful', 'Curious', 'Friendly'],
        current_needs: data.current_needs || ['Medical checkup', 'New toys', 'Special diet']
      });
      
      // Load existing customization data
      if (data.customization) {
        setCustomizeData(prev => ({
          ...prev,
          ...data.customization
        }));
      }
      
      // Check if current user is the owner (only if user is loaded)
      if (user) {
        setIsOwner(user.sanctuary_name === data.sanctuary);
      } else {
        setIsOwner(false);
      }
    } catch (error) {
      console.error('Error loading animal:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const { data, error } = await postService.getPostsByAnimal(animalId);
      if (!error) {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleEditAnimal = async () => {
    try {
      setLoading(true);
      
      console.log('Starting animal update with editForm:', editForm);
      
      // Upload new images if any
      let profileImg = editForm.profile_img;
      let coverImg = editForm.cover_img;
      
      if (editForm.profile_img instanceof File) {
        console.log('Uploading profile image...');
        try {
          const { url } = await storageService.uploadFile(editForm.profile_img, 'showcase-images');
          profileImg = url;
          console.log('Profile image uploaded:', url);
        } catch (error) {
          console.error('Failed to upload profile image:', error);
          alert('Failed to upload profile image. Please try again.');
          return;
        }
      }
      
      if (editForm.cover_img instanceof File) {
        console.log('Uploading cover image...');
        try {
          const { url } = await storageService.uploadFile(editForm.cover_img, 'showcase-images');
          coverImg = url;
          console.log('Cover image uploaded:', url);
        } catch (error) {
          console.error('Failed to upload cover image:', error);
          alert('Failed to upload cover image. Please try again.');
          return;
        }
      }
      
      const updates = {
        name: editForm.name,
        animal_type: editForm.animal_type,
        species: editForm.species,
        about: editForm.about,
        donation_goal: editForm.donation_goal,
        profile_img: profileImg,
        cover_img: coverImg,
        age: editForm.age,
        rescued_date: editForm.rescued_date,
        personality: editForm.personality,
        current_needs: editForm.current_needs
      };
      
      console.log('Sending updates to database:', updates);
      const { data, error } = await animalService.updateAnimal(animalId, updates);
      
      if (error) {
        alert(`Failed to update animal: ${error.message}`);
      } else {
        setAnimal(data);
        setShowEditModal(false);
        alert('Animal profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating animal:', error);
      alert('Failed to update animal profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      
      let imageUrl = null;
      if (postForm.image) {
        const { url } = await storageService.uploadFile(postForm.image, 'post-images');
        imageUrl = url;
      }
      
      const postData = {
        content: postForm.content,
        image_url: imageUrl,
        animal_id: animalId
      };
      
      const { data, error } = await postService.createPost(postData);
      
      if (error) {
        alert(`Failed to create post: ${error.message}`);
      } else {
        setShowPostModal(false);
        setPostForm({ content: '', image: null });
        loadPosts(); // Refresh posts
        alert('Post created successfully!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (files, type) => {
    const file = files[0];
    if (type === 'profile') {
      setEditForm(prev => ({ ...prev, profile_img: file }));
    } else if (type === 'cover') {
      setEditForm(prev => ({ ...prev, cover_img: file }));
    } else if (type === 'post') {
      setPostForm(prev => ({ ...prev, image: file }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };
  
  // Post creation functions
  const handleOpenCreatePost = () => {
    setShowCreatePostModal(true);
  };
  
  const handleCloseCreatePost = () => {
    setShowCreatePostModal(false);
    setNewPost('');
    setPostImage(null);
  };
  
  const handlePostImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPostImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddPost = async () => {
    if (!newPost.trim() && !postImage) return;
    
    try {
      setIsAddingPost(true);
      
      let imageUrl = null;
      if (postImage) {
        // Convert data URL to blob and upload
        const response = await fetch(postImage);
        const blob = await response.blob();
        const file = new File([blob], 'post-image.jpg', { type: 'image/jpeg' });
        const { url } = await storageService.uploadFile(file, 'post-images');
        imageUrl = url;
      }
      
      const postData = {
        content: newPost,
        image_url: imageUrl,
        animal_id: animalId
      };
      
      const { data, error } = await postService.createPost(postData);
      
      if (error) {
        alert(`Failed to create post: ${error.message}`);
      } else {
        setPosts(prev => [data, ...prev]);
        setNewPost('');
        setPostImage(null);
        setShowCreatePostModal(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsAddingPost(false);
    }
  };
  
  // Customization functions
  const handleCustomizeProfile = () => {
    setIsCustomizing(true);
  };
  
  const handleSaveCustomize = async () => {
    try {
      // Save customization data to animal profile
      const updates = {
        customization: customizeData
      };
      
      const { data, error } = await animalService.updateAnimal(animalId, updates);
      
      if (error) {
        alert(`Failed to save customization: ${error.message}`);
      } else {
        setAnimal(data);
        setIsCustomizing(false);
        alert('Customization saved successfully!');
      }
    } catch (error) {
      console.error('Error saving customization:', error);
      alert('Failed to save customization');
    }
  };
  
  const handleCancelCustomize = () => {
    setIsCustomizing(false);
    // Reset to original data
    setCustomizeData({
      backgroundType: 'inherit',
      backgroundColor: 'inherit',
      backgroundImage: null,
      buttonColor: 'var(--primary)',
      headerTextColor: '#ffffff',
      bodyTextColor: 'var(--text-secondary)',
      leftSidebarWidgets: [],
      rightSidebarWidgets: []
    });
  };
  
  const handleBackgroundImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomizeData(prev => ({
          ...prev,
          backgroundImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Personality and needs editing functions
  const handleAddPersonality = () => {
    const newTrait = prompt('Enter a personality trait:');
    if (newTrait && newTrait.trim()) {
      setEditForm(prev => ({
        ...prev,
        personality: [...prev.personality, newTrait.trim()]
      }));
    }
  };
  
  const handleRemovePersonality = (index) => {
    setEditForm(prev => ({
      ...prev,
      personality: prev.personality.filter((_, i) => i !== index)
    }));
  };
  
  const handleAddNeed = () => {
    const newNeed = prompt('Enter a current need:');
    if (newNeed && newNeed.trim()) {
      setEditForm(prev => ({
        ...prev,
        current_needs: [...prev.current_needs, newNeed.trim()]
      }));
    }
  };
  
  const handleRemoveNeed = (index) => {
    setEditForm(prev => ({
      ...prev,
      current_needs: prev.current_needs.filter((_, i) => i !== index)
    }));
  };
  
  // Comment functions
  const loadComments = async () => {
    try {
      // For now, we'll use mock comments. In a real app, you'd fetch from the database
      const mockComments = [
        {
          id: 1,
          user_name: 'Sarah Johnson',
          user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          content: 'What a beautiful animal! I love seeing updates about them.',
          created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: 2,
          user_name: 'Mike Chen',
          user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
          content: 'Thank you for taking such good care of them!',
          created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        }
      ];
      setComments(mockComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };
  
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setIsAddingComment(true);
      
      // For now, we'll add to local state. In a real app, you'd save to the database
      const newCommentObj = {
        id: Date.now(),
        user_name: user?.name || 'Anonymous',
        user_avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous',
        content: newComment,
        created_at: new Date().toISOString()
      };
      
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
      
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setIsAddingComment(false);
    }
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

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Loading animal profile...</h2>
      </div>
    );
  }

  if (!animal) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Animal not found</h2>
        <p>This animal profile doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--background)',
      paddingTop: 0
    }}>
      {/* Back Button */}
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 100,
        background: 'rgba(0,0,0,0.5)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: 40,
        height: 40,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
      }}
      onClick={() => navigate(-1)}
      >
        ←
      </div>

      {/* Main Content */}
      <div>
        {/* Cover Photo */}
        <div style={{ 
          height: 200, 
          background: `url(${animal.cover_img || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=300&fit=crop&crop=center'})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{ 
            position: 'absolute', 
            bottom: 20, 
            left: 20, 
            display: 'flex', 
            alignItems: 'flex-end', 
            gap: 20 
          }}>
            <img 
              src={animal.profile_img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${animal.name}`} 
              alt={animal.name}
              style={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                border: '4px solid var(--card)',
                objectFit: 'cover'
              }} 
            />
            <div style={{ marginBottom: 10 }}>
              <h1 style={{ 
                margin: 0, 
                fontSize: 28, 
                fontWeight: 600,
                color: animal.customization?.headerTextColor || 'white'
              }}>{animal.name}</h1>
              <p style={{ 
                margin: '4px 0', 
                fontSize: 16, 
                opacity: 0.9,
                color: animal.customization?.headerTextColor || 'white'
              }}>{animal.animal_type} • {animal.species}</p>
              <p style={{ 
                margin: '4px 0', 
                fontSize: 14, 
                opacity: 0.8,
                color: animal.customization?.headerTextColor || 'white'
              }}>{animal.sanctuary} • {animal.status}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{ 
            position: 'absolute', 
            bottom: 20, 
            right: 20, 
            display: 'flex', 
            gap: 12 
          }}>
            {isOwner ? (
              <>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="button" 
                  style={{ 
                    background: animal.customization?.buttonColor || 'rgba(255,255,255,0.2)', 
                    color: 'white', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s'
                  }}
                >
                  Edit Profile
                </button>
                <button 
                  onClick={handleCustomizeProfile}
                  className="button" 
                  style={{ 
                    background: animal.customization?.buttonColor || 'rgba(255,255,255,0.2)', 
                    color: 'white', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s'
                  }}
                >
                  Customize
                </button>
              </>
            ) : (
              <button className="button" style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s'
              }}>
                Follow
              </button>
            )}
          </div>
        </div>

        {/* Fundraising Section - Full Width */}
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '0 20px 24px 20px'
        }}>
          <div style={{ 
            background: 'var(--card)',
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Progress Section */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: 8
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ 
                      fontWeight: 700, 
                      fontSize: 18, 
                      color: 'var(--primary)',
                      fontFamily: 'inherit'
                    }}>
                      {formatCurrency(animal.donation_raised || 0)}
                    </span>
                    <span style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: 14,
                      fontWeight: 500
                    }}>
                      raised
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6,
                    background: 'var(--background)',
                    padding: '4px 8px',
                    borderRadius: 12,
                    border: '1px solid var(--border)'
                  }}>
                    <span style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: 12 
                    }}>
                      / {formatCurrency(animal.donation_goal || 0)} goal
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div style={{ 
                  width: '100%', 
                  height: 6, 
                  background: 'var(--border)', 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  marginBottom: 4,
                  position: 'relative'
                }}>
                  <div style={{ 
                    width: `${Math.min(((animal.donation_raised || 0) / (animal.donation_goal || 1)) * 100, 100)}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))', 
                    borderRadius: 3,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    fontSize: 11, 
                    color: 'var(--text-secondary)',
                    fontWeight: 500
                  }}>
                    Progress
                  </span>
                  <span style={{ 
                    fontSize: 12, 
                    fontWeight: 700, 
                    color: 'var(--primary)'
                  }}>
                    {Math.round(((animal.donation_raised || 0) / (animal.donation_goal || 1)) * 100)}%
                  </span>
                </div>
              </div>
              
              {/* Donation Buttons */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                {isOwner ? (
                  <button
                    onClick={() => setShowEditModal(true)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 16,
                      border: 'none',
                      background: animal.customization?.buttonColor || 'var(--primary)',
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    Set Goal
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      style={{
                        padding: '4px 8px',
                        borderRadius: 12,
                        border: 'none',
                        background: animal.customization?.buttonColor || 'var(--primary)',
                        color: 'white',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
                      }}
                      onClick={() => {
                        alert(`Thank you for your $10 donation to ${animal.name}!`);
                      }}
                    >
                      $10
                    </button>
                    <button
                      style={{
                        padding: '4px 8px',
                        borderRadius: 12,
                        border: 'none',
                        background: animal.customization?.buttonColor || 'var(--primary)',
                        color: 'white',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
                      }}
                      onClick={() => {
                        alert(`Thank you for your $25 donation to ${animal.name}!`);
                      }}
                    >
                      $25
                    </button>
                    <button
                      style={{
                        padding: '4px 8px',
                        borderRadius: 12,
                        border: 'none',
                        background: animal.customization?.buttonColor || 'var(--primary)',
                        color: 'white',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
                      }}
                      onClick={() => {
                        alert(`Thank you for your $50 donation to ${animal.name}!`);
                      }}
                    >
                      $50
                    </button>
                    <button
                      style={{
                        padding: '4px 8px',
                        borderRadius: 12,
                        border: '1px solid var(--primary)',
                        background: 'white',
                        color: 'var(--primary)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                        e.target.style.background = 'var(--primary)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
                        e.target.style.background = 'white';
                        e.target.style.color = 'var(--primary)';
                      }}
                      onClick={() => setShowDonationModal(true)}
                    >
                      Custom
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '0 20px 24px 20px',
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: 24
        }}>
          {/* Left Sidebar */}
          <div>
            {/* About Section */}
            <div style={{ 
              background: 'var(--card)',
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>About</h3>
              
              {/* Description */}
              <div style={{ marginBottom: 20 }}>
                {editing ? (
                  <textarea
                    value={editForm.about}
                    onChange={(e) => setEditForm(prev => ({ ...prev, about: e.target.value }))}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text)',
                      fontSize: 14,
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Describe the animal..."
                  />
                ) : (
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--text-secondary)', 
                    lineHeight: 1.6,
                    fontSize: 14
                  }}>
                    {animal.about || 'No description available.'}
                  </p>
                )}
              </div>
              
              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 16,
                marginBottom: 20
              }}>
                <div>
                  <div style={{ 
                    fontSize: 12, 
                    color: animal.customization?.bodyTextColor || 'var(--text-secondary)', 
                    fontWeight: 600,
                    marginBottom: 4
                  }}>
                    Age:
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.age}
                      onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: '1px solid var(--border)',
                        background: 'var(--background)',
                        color: 'var(--text)',
                        fontSize: 14,
                        fontWeight: 500
                      }}
                    />
                  ) : (
                    <div style={{ 
                      fontSize: 14, 
                      color: 'var(--text)',
                      fontWeight: 500
                    }}>
                      {animal.age || 'Unknown'}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ 
                    fontSize: 12, 
                    color: animal.customization?.bodyTextColor || 'var(--text-secondary)', 
                    fontWeight: 600,
                    marginBottom: 4
                  }}>
                    Rescued:
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.rescued_date}
                      onChange={(e) => setEditForm(prev => ({ ...prev, rescued_date: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: '1px solid var(--border)',
                        background: 'var(--background)',
                        color: 'var(--text)',
                        fontSize: 14,
                        fontWeight: 500
                      }}
                    />
                  ) : (
                    <div style={{ 
                      fontSize: 14, 
                      color: 'var(--text)',
                      fontWeight: 500
                    }}>
                      {animal.rescued_date || 'Unknown'}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ 
                    fontSize: 12, 
                    color: animal.customization?.bodyTextColor || 'var(--text-secondary)', 
                    fontWeight: 600,
                    marginBottom: 4
                  }}>
                    Location:
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    color: 'var(--text)',
                    fontWeight: 500
                  }}>
                    {animal.sanctuary}
                  </div>
                </div>
                <div>
                  <div style={{ 
                    fontSize: 12, 
                    color: animal.customization?.bodyTextColor || 'var(--text-secondary)', 
                    fontWeight: 600,
                    marginBottom: 4
                  }}>
                    Followers:
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    color: 'var(--text)',
                    fontWeight: 500
                  }}>
                    {animal.followers || 0}
                  </div>
                </div>
              </div>
              
              {/* Personality */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ 
                  fontSize: 12, 
                  color: 'var(--text-secondary)', 
                  fontWeight: 600,
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  Personality:
                  {editing && (
                    <button
                      onClick={handleAddPersonality}
                      style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: 10,
                        cursor: 'pointer'
                      }}
                    >
                      + Add
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(editing ? editForm.personality : animal.personality)?.map((trait, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'white',
                        background: 'linear-gradient(90deg, #4A90E2, #9B59B6)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {trait}
                      {editing && (
                        <button
                          onClick={() => handleRemovePersonality(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: 10,
                            padding: 0,
                            marginLeft: 4
                          }}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  )) || (
                    <>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'white',
                        background: 'linear-gradient(90deg, #4A90E2, #9B59B6)',
                        border: 'none'
                      }}>
                        Playful
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'white',
                        background: 'linear-gradient(90deg, #4A90E2, #9B59B6)',
                        border: 'none'
                      }}>
                        Curious
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'white',
                        background: 'linear-gradient(90deg, #4A90E2, #9B59B6)',
                        border: 'none'
                      }}>
                        Friendly
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Current Needs */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ 
                  fontSize: 12, 
                  color: 'var(--text-secondary)', 
                  fontWeight: 600,
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  Current Needs:
                  {editing && (
                    <button
                      onClick={handleAddNeed}
                      style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: 10,
                        cursor: 'pointer'
                      }}
                    >
                      + Add
                    </button>
                  )}
                </div>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: 16,
                  color: 'var(--text)',
                  fontSize: 14,
                  lineHeight: 1.5
                }}>
                  {(editing ? editForm.current_needs : animal.current_needs)?.map((need, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {need}
                      {editing && (
                        <button
                          onClick={() => handleRemoveNeed(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: 12,
                            padding: 0
                          }}
                        >
                          ×
                        </button>
                      )}
                    </li>
                  )) || (
                    <>
                      <li>Medical checkup</li>
                      <li>New toys</li>
                      <li>Special diet</li>
                    </>
                  )}
                </ul>
              </div>
              

            </div>

            {/* Top Supporters */}
            <div style={{ 
              background: 'var(--card)',
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Top Supporters</h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 12 
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12 
                }}>
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" 
                    alt="Sarah"
                    style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                      Sarah Johnson
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      $150 donated
                    </div>
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12 
                }}>
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=mike" 
                    alt="Mike"
                    style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                      Mike Chen
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      $75 donated
                    </div>
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12 
                }}>
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=emma" 
                    alt="Emma"
                    style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                      Emma Wilson
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      $50 donated
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {/* Tabs */}
            <div style={{ 
              display: 'flex', 
              gap: 0, 
              marginBottom: 24,
              background: 'var(--card)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              {[
                { id: 'timeline', label: 'Timeline' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'comments', label: 'Comments' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '16px 24px',
                    background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'var(--text)',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Add Post - Only for Owners on Timeline */}
            {isOwner && activeTab === 'timeline' && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <img 
                    src={animal.profile_img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${animal.name}`} 
                    alt={animal.name}
                    style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      onClick={handleOpenCreatePost}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: 'var(--background)',
                        color: 'var(--text-secondary)',
                        fontSize: 14,
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      What's on your mind, {animal?.name || 'Animal'}?
                    </div>
                  </div>
                </div>
                
                {postImage && (
                  <div style={{ position: 'relative', marginBottom: 16 }}>
                    <img 
                      src={postImage} 
                      alt="Post preview" 
                      style={{ 
                        width: '100%', 
                        maxHeight: 200, 
                        borderRadius: 8,
                        objectFit: 'cover'
                      }} 
                    />
                    <button
                      onClick={() => setPostImage(null)}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <label style={{ cursor: 'pointer' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePostImageChange}
                        style={{ display: 'none' }}
                      />
                      <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>📷 Photo</span>
                    </label>
                  </div>
                  <button
                    onClick={handleAddPost}
                    disabled={!newPost.trim() && !postImage}
                    style={{
                      background: (!newPost.trim() && !postImage) ? 'var(--text-secondary)' : 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: (!newPost.trim() && !postImage) ? 'not-allowed' : 'pointer',
                      opacity: (!newPost.trim() && !postImage) ? 0.5 : 1
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}

            {/* Tab Content */}
            <div style={{ 
              background: 'var(--card)',
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              {activeTab === 'timeline' && (
                <div>
                  <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Timeline</h3>
                  {posts.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: 'var(--text-secondary)'
                    }}>
                      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📝</div>
                      <p>No updates yet. {isOwner && 'Share the first update!'}</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {posts.map(post => (
                        <div key={post.id} style={{
                          padding: 16,
                          border: '1px solid var(--border)',
                          borderRadius: 12,
                          background: 'var(--background)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <img 
                              src={animal.profile_img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${animal.name}`} 
                              alt={animal.name}
                              style={{ 
                                width: 32, 
                                height: 32, 
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }} 
                            />
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                                {animal.name}
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                {new Date(post.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <p style={{ margin: '0 0 12px 0', color: 'var(--text)', lineHeight: 1.5 }}>
                            {post.content}
                          </p>
                          
                          {post.image_url && (
                            <img 
                              src={post.image_url} 
                              alt="Post" 
                              style={{ 
                                width: '100%', 
                                borderRadius: 8,
                                marginBottom: 12
                              }} 
                            />
                          )}
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <button style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: 'var(--text-secondary)', 
                              cursor: 'pointer',
                              fontSize: 12,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}>
                              ❤️ 0
                            </button>
                            <button style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: 'var(--text-secondary)', 
                              cursor: 'pointer',
                              fontSize: 12,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}>
                              💬 0
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'gallery' && (
                <div>
                  <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Gallery</h3>
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🖼️</div>
                    <p>No photos in gallery yet.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'comments' && (
                <div>
                  <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Comments</h3>
                  
                  {/* Add Comment */}
                  <div style={{ 
                    background: 'var(--background)', 
                    borderRadius: 12, 
                    padding: 16, 
                    marginBottom: 20,
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <img 
                        src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous'} 
                        alt="Your avatar"
                        style={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }} 
                      />
                      <div style={{ flex: 1 }}>
                        <textarea
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 6,
                            border: '1px solid var(--border)',
                            background: 'var(--card)',
                            color: 'var(--text)',
                            fontSize: 14,
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isAddingComment}
                        style={{
                          background: (!newComment.trim() || isAddingComment) ? 'var(--text-secondary)' : 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: (!newComment.trim() || isAddingComment) ? 'not-allowed' : 'pointer',
                          opacity: (!newComment.trim() || isAddingComment) ? 0.5 : 1
                        }}
                      >
                        {isAddingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Comments List */}
                  {comments.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: 'var(--text-secondary)'
                    }}>
                      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>💬</div>
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {comments.map(comment => (
                        <div key={comment.id} style={{
                          padding: 16,
                          border: '1px solid var(--border)',
                          borderRadius: 12,
                          background: 'var(--background)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <img 
                              src={comment.user_avatar} 
                              alt={comment.user_name}
                              style={{ 
                                width: 32, 
                                height: 32, 
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }} 
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                                  {comment.user_name}
                                </span>
                                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p style={{ 
                                margin: 0, 
                                color: 'var(--text)', 
                                lineHeight: 1.5,
                                fontSize: 14
                              }}>
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
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
                Edit Animal Profile
              </h2>
              <button 
                onClick={() => setShowEditModal(false)}
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
              {/* Profile Picture and Cover Image */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                {/* Profile Picture */}
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontWeight: 500 }}>
                    Profile Picture
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12,
                    padding: '12px',
                    border: '2px dashed var(--border)',
                    borderRadius: 8,
                    background: 'var(--background)'
                  }}>
                    <img 
                      src={
                        editForm.profile_img instanceof File 
                          ? URL.createObjectURL(editForm.profile_img)
                          : editForm.profile_img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${editForm.name || 'Animal'}`
                      }
                      alt="Profile preview"
                      style={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--border)'
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files, 'profile')}
                        style={{ display: 'none' }}
                        id="edit-profile-pic"
                      />
                      <label htmlFor="edit-profile-pic" style={{
                        display: 'block',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                        background: 'var(--primary)',
                        color: 'white',
                        fontSize: 12,
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontWeight: 500
                      }}>
                        📸 Change
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Cover Image */}
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontWeight: 500 }}>
                    Cover Image
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12,
                    padding: '12px',
                    border: '2px dashed var(--border)',
                    borderRadius: 8,
                    background: 'var(--background)'
                  }}>
                    <img 
                      src={
                        editForm.cover_img instanceof File 
                          ? URL.createObjectURL(editForm.cover_img)
                          : editForm.cover_img || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=100&fit=crop&crop=center'
                      }
                      alt="Cover preview"
                      style={{ 
                        width: 80, 
                        height: 40, 
                        borderRadius: 6,
                        objectFit: 'cover',
                        border: '2px solid var(--border)'
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files, 'cover')}
                        style={{ display: 'none' }}
                        id="edit-cover-pic"
                      />
                      <label htmlFor="edit-cover-pic" style={{
                        display: 'block',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                        background: 'var(--primary)',
                        color: 'white',
                        fontSize: 12,
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontWeight: 500
                      }}>
                        📸 Change
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <input
                type="text"
                placeholder="Animal name *"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
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
                  value={editForm.animal_type}
                  onChange={(e) => setEditForm(prev => ({ ...prev, animal_type: e.target.value }))}
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
                  value={editForm.species}
                  onChange={(e) => setEditForm(prev => ({ ...prev, species: e.target.value }))}
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
              
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  type="text"
                  placeholder="Age (e.g., 3 years)"
                  value={editForm.age}
                  onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
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
                <input
                  type="text"
                  placeholder="Rescued date (e.g., Jan 2024)"
                  value={editForm.rescued_date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, rescued_date: e.target.value }))}
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
                value={editForm.about}
                onChange={(e) => setEditForm(prev => ({ ...prev, about: e.target.value }))}
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
              
              {/* Personality Section */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontWeight: 500 }}>
                  Personality Traits
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {editForm.personality?.map((trait, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'white',
                        background: 'linear-gradient(90deg, #4A90E2, #9B59B6)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {trait}
                      <button
                        onClick={() => handleRemovePersonality(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: 10,
                          padding: 0,
                          marginLeft: 4
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={handleAddPersonality}
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  + Add Personality Trait
                </button>
              </div>
              
              {/* Current Needs Section */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontWeight: 500 }}>
                  Current Needs
                </label>
                <div style={{ marginBottom: 8 }}>
                  {editForm.current_needs?.map((need, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      marginBottom: 4,
                      padding: '4px 8px',
                      background: 'var(--background)',
                      borderRadius: 4
                    }}>
                      <span style={{ fontSize: 14, color: 'var(--text)' }}>• {need}</span>
                      <button
                        onClick={() => handleRemoveNeed(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontSize: 12,
                          padding: 0
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddNeed}
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  + Add Current Need
                </button>
              </div>
              

              

            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 12,
              marginTop: 24
            }}>
              <button
                onClick={() => setShowEditModal(false)}
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
                onClick={handleEditAnimal}
                disabled={loading || !editForm.name || !editForm.animal_type || !editForm.about}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--primary)',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: (loading || !editForm.name || !editForm.animal_type || !editForm.about) ? 0.5 : 1
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
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
                Post Update
              </h2>
              <button 
                onClick={() => setShowPostModal(false)}
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
              <textarea
                placeholder="Share an update about this animal..."
                value={postForm.content}
                onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
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
                  Add Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files, 'post')}
                  style={{ display: 'none' }}
                  id="post-image"
                />
                <label htmlFor="post-image" style={{
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
                  📸 Add photo to your post
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
                onClick={() => setShowPostModal(false)}
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
                onClick={handleCreatePost}
                disabled={loading || !postForm.content.trim()}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--primary)',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: (loading || !postForm.content.trim()) ? 0.5 : 1
                }}
              >
                {loading ? 'Posting...' : 'Post Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize Profile Modal */}
      {isCustomizing && (
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
            padding: '24px',
            minWidth: 600,
            maxWidth: 800,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>
                Customize {animal?.name}'s Profile
              </div>
              <button 
                onClick={handleCancelCustomize}
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

            {/* Customization Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Background Settings */}
              <div>
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>
                  Background
                </h3>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontSize: 14 }}>
                    Background Type
                  </label>
                  <select
                    value={customizeData.backgroundType}
                    onChange={(e) => setCustomizeData(prev => ({ ...prev, backgroundType: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text)',
                      fontSize: 14
                    }}
                  >
                    <option value="inherit">Default</option>
                    <option value="color">Solid Color</option>
                    <option value="image">Image</option>
                  </select>
                </div>

                {customizeData.backgroundType === 'color' && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontSize: 14 }}>
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={customizeData.backgroundColor}
                      onChange={(e) => setCustomizeData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      style={{
                        width: '100%',
                        height: 40,
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                )}

                {customizeData.backgroundType === 'image' && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontSize: 14 }}>
                      Background Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundImageChange}
                      style={{ display: 'none' }}
                      id="background-image"
                    />
                    <label htmlFor="background-image" style={{
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: 6,
                      border: '2px dashed var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text-secondary)',
                      fontSize: 14,
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}>
                      📸 Upload background image
                    </label>
                  </div>
                )}
              </div>

              {/* Color Settings */}
              <div>
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>
                  Colors
                </h3>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontSize: 14 }}>
                    Button Color
                  </label>
                  <input
                    type="color"
                    value={customizeData.buttonColor}
                    onChange={(e) => setCustomizeData(prev => ({ ...prev, buttonColor: e.target.value }))}
                    style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontSize: 14 }}>
                    Header Text Color
                  </label>
                  <input
                    type="color"
                    value={customizeData.headerTextColor || '#ffffff'}
                    onChange={(e) => setCustomizeData(prev => ({ ...prev, headerTextColor: e.target.value }))}
                    style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontSize: 14 }}>
                    Body Text Color
                  </label>
                  <input
                    type="color"
                    value={customizeData.bodyTextColor}
                    onChange={(e) => setCustomizeData(prev => ({ ...prev, bodyTextColor: e.target.value }))}
                    style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Widget Settings */}
            <div style={{ marginTop: 24 }}>
              <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>
                Widgets
              </h3>
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                color: 'var(--text-secondary)',
                background: 'var(--background)',
                borderRadius: 8,
                border: '1px dashed var(--border)'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🔧</div>
                <p>Widget customization coming soon!</p>
                <p style={{ fontSize: 12, margin: '8px 0 0 0' }}>
                  You'll be able to customize sidebar widgets here
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 12,
              marginTop: 24
            }}>
              <button
                onClick={handleCancelCustomize}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomize}
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePostModal && (
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
            padding: '24px',
            minWidth: 500,
            maxWidth: 600,
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>
                Create Post
              </div>
              <button 
                onClick={handleCloseCreatePost}
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

            {/* Animal Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <img 
                src={animal.profile_img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${animal.name}`} 
                alt={animal.name}
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} 
              />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>
                  {animal.name}
                </div>
                <button style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  🌐 Public ▼
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div style={{ marginBottom: 20 }}>
              <textarea
                placeholder="What's on your mind, {animal.name}?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 14,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Post Image Preview */}
            {postImage && (
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <img 
                  src={postImage} 
                  alt="Post preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: 300, 
                    borderRadius: 8,
                    objectFit: 'cover'
                  }} 
                />
                <button
                  onClick={() => setPostImage(null)}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePostImageChange}
                    style={{ display: 'none' }}
                  />
                  <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>📷 Photo</span>
                </label>
              </div>
              <button
                onClick={handleAddPost}
                disabled={!newPost.trim() && !postImage}
                style={{
                  background: (!newPost.trim() && !postImage) ? 'var(--text-secondary)' : 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: (!newPost.trim() && !postImage) ? 'not-allowed' : 'pointer',
                  opacity: (!newPost.trim() && !postImage) ? 0.5 : 1
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {showDonationModal && (
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
            minWidth: 400,
            maxWidth: 500,
            width: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, color: 'var(--text)', fontSize: 24, fontWeight: 700 }}>
                Donate to {animal.name}
              </h2>
              <button 
                onClick={() => setShowDonationModal(false)}
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
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontWeight: 500 }}>
                  Donation Amount
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)',
                    fontSize: 16
                  }}>
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 32px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text)',
                      fontSize: 16,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)', fontWeight: 500 }}>
                  Message (Optional)
                </label>
                <textarea
                  placeholder="Leave a message for this animal..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--text)',
                    fontSize: 14,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                gap: 12,
                marginTop: 8
              }}>
                <button
                  onClick={() => setShowDonationModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--text)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle donation logic here
                    alert(`Thank you for your $${donationAmount} donation to ${animal.name}!`);
                    setShowDonationModal(false);
                    setDonationAmount('');
                  }}
                  disabled={!donationAmount || parseFloat(donationAmount) <= 0}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    opacity: (!donationAmount || parseFloat(donationAmount) <= 0) ? 0.5 : 1
                  }}
                >
                  Donate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 