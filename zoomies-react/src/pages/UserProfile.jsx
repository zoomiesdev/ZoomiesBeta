import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { storageService } from '../services/storageService';
import { postService } from '../services/postService';

// Empty data for new users
const FOLLOWED_ANIMALS = [];
const FOLLOWED_SANCTUARIES = [];
const FUNDRAISERS = [];
const POSTS = [];

export default function UserProfile() {
  const { user, updateUserProfile } = useAuth();
  
  // User data state
  const [userData, setUserData] = useState({
    name: user?.name || 'New User',
    username: user?.username || 'newuser',
    bio: user?.bio || 'Welcome to Zoomies! 🐾',
    location: user?.location || 'Location not set',
    joinedDate: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently',
    avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=newuser',
    coverPhoto: user?.cover_photo || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=300&fit=crop&crop=center'
  });

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: userData.name,
    bio: userData.bio,
    location: userData.location,
    headerType: 'image',
    headerColor: '#4A90E2'
  });

  // Image states
  const [selectedImage, setSelectedImage] = useState(null);
  const [headerImage, setHeaderImage] = useState(userData.coverPhoto);
  
  // Showcase image states
  const [showcasePicture, setShowcasePicture] = useState(user?.showcase_picture || null);
  const [showcaseGif, setShowcaseGif] = useState(user?.showcase_gif || null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadingGif, setUploadingGif] = useState(false);

  // Customize profile states
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizeData, setCustomizeData] = useState({
    backgroundType: 'inherit',
    backgroundColor: 'inherit',
    backgroundImage: null,
    buttonColor: 'var(--primary)',
    headerTextColor: 'var(--text)',
    bodyTextColor: 'var(--text-secondary)',
    leftSidebarWidgets: ['feelings'],
    rightSidebarWidgets: ['following', 'showcasePicture']
  });
  const [profileLayout, setProfileLayout] = useState({
    showAbout: true,
    showFeeling: true,
    showFollowedAnimals: true,
    showFollowedSanctuaries: true
  });

  // Post states
  const [posts, setPosts] = useState(POSTS);
  const [newPost, setNewPost] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // Feeling states
  const [currentFeeling, setCurrentFeeling] = useState('Happy');
  const [currentFeelingEmoji, setCurrentFeelingEmoji] = useState('😊');
  const [currentFeelingDescription, setCurrentFeelingDescription] = useState('Feeling great today!');
  const [isEditingFeeling, setIsEditingFeeling] = useState(false);
  const [newFeeling, setNewFeeling] = useState('');
  const [newFeelingEmoji, setNewFeelingEmoji] = useState('😊');
  const [newFeelingDescription, setNewFeelingDescription] = useState('');

  // Tab states
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || 'New User',
        username: user.username || 'newuser',
        bio: user.bio || 'Welcome to Zoomies! 🐾',
        location: user.location || 'Location not set',
        joinedDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently',
        avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=newuser',
        coverPhoto: user.cover_photo || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=300&fit=crop&crop=center'
      });
      setHeaderImage(user.cover_photo || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=300&fit=crop&crop=center');
      
      // Load showcase images
      console.log('Loading showcase images from user data:', {
        showcase_picture: user.showcase_picture,
        showcase_gif: user.showcase_gif,
        user_id: user.id
      });
      if (user.showcase_picture && user.showcase_picture !== 'test-picture-url') {
        console.log('Setting showcase picture:', user.showcase_picture);
        setShowcasePicture(user.showcase_picture);
      }
      if (user.showcase_gif && user.showcase_gif !== 'test-gif-url') {
        console.log('Setting showcase gif:', user.showcase_gif);
        setShowcaseGif(user.showcase_gif);
      }
      
      // Load customize data if it exists
      if (user.customize_data) {
        setCustomizeData(prev => ({
          ...prev,
          ...user.customize_data
        }));
      } else {
        // Set default customize data for new users
        setCustomizeData({
          backgroundType: 'inherit',
          backgroundColor: 'inherit',
          backgroundImage: null,
          buttonColor: 'var(--primary)',
          headerTextColor: 'var(--text)',
          bodyTextColor: 'var(--text-secondary)',
          leftSidebarWidgets: ['feelings'],
          rightSidebarWidgets: ['following', 'showcasePicture']
        });
      }
      
      // Load feeling data if it exists
      if (user.feeling) {
        setCurrentFeeling(user.feeling);
      }
      if (user.feeling_emoji) {
        setCurrentFeelingEmoji(user.feeling_emoji);
      }
      if (user.feeling_description) {
        setCurrentFeelingDescription(user.feeling_description);
      }
      
      // Load posts from database
      loadUserPosts();
    }
  }, [user]);

  const loadUserPosts = async () => {
    try {
      const { data: postsData, error } = await postService.getUserPosts(user.id);
      if (error) {
        console.error('Error loading posts:', error);
        return;
      }
      
      // Transform database posts to match local format
      const transformedPosts = postsData.map(post => ({
        id: post.id,
        content: post.content,
        image: post.image_url,
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        time: new Date(post.created_at).toLocaleDateString(),
        user: {
          name: post.users?.name || userData.name,
          avatar: post.users?.avatar || userData.avatar
        }
      }));
      
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  // Edit profile handlers
  const handleEditProfile = () => {
    setEditData({
      name: userData.name,
      bio: userData.bio,
      location: userData.location,
      headerType: 'image',
      headerColor: '#4A90E2'
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeaderImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updates = {
        name: editData.name,
        bio: editData.bio,
        location: editData.location,
        avatar: selectedImage || userData.avatar,
        cover_photo: headerImage || userData.coverPhoto
      };

      await userService.updateCurrentUser(updates);
      
      setUserData(prev => ({
        ...prev,
        ...updates
      }));

      updateUserProfile(updates);
      setIsEditing(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setHeaderImage(userData.coverPhoto);
  };

  // Customize profile handlers
  const handleCustomizeProfile = () => {
    setIsCustomizing(true);
  };

  const handleSaveCustomize = async () => {
    try {
      // Prepare updates object
      const updates = {
        customize_data: customizeData
      };
      
      // Also save showcase image URLs if they exist
      if (showcasePicture) updates.showcase_picture = showcasePicture;
      if (showcaseGif) updates.showcase_gif = showcaseGif;
      
      console.log('Saving showcase images:', {
        showcase_picture: showcasePicture || 'null',
        showcase_gif: showcaseGif || 'null',
        updates
      });
      
      // Save to database
      await userService.updateCurrentUser(updates);

      // Update context
      updateUserProfile(updates);

      setIsCustomizing(false);
    } catch (error) {
      console.error('Error saving customize data:', error);
    }
  };

  const handleCancelCustomize = () => {
    setIsCustomizing(false);
  };

  // Background image handler
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

  // Post handlers
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

  const handleShowcasePictureChange = async (event) => {
    const file = event.target.files[0];
    console.log('Picture file selected:', file);
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Picture file is too large. Please select a file smaller than 5MB.');
        return;
      }
      
      setUploadingPicture(true);
      try {
        // Try storage first, fallback to data URL
        console.log('Attempting to upload picture to storage...');
        try {
          const { url } = await storageService.uploadFile(file, 'showcase-images');
          console.log('Picture uploaded to storage successfully:', url);
          setShowcasePicture(url);
          
          // Save to database immediately
          console.log('Saving picture URL to database:', url);
          const result = await userService.updateCurrentUser({ showcase_picture: url });
          console.log('Picture saved to database:', result);
          updateUserProfile({ showcase_picture: url });
        } catch (storageError) {
          console.error('Storage upload failed, using data URL fallback:', storageError);
          // Fallback to data URL
          const reader = new FileReader();
          reader.onload = async (e) => {
            console.log('Picture loaded as data URL, length:', e.target.result.length);
            setShowcasePicture(e.target.result);
            
            // Save data URL to database
            console.log('Saving picture data URL to database');
            const result = await userService.updateCurrentUser({ showcase_picture: e.target.result });
            console.log('Picture data URL saved to database:', result);
            updateUserProfile({ showcase_picture: e.target.result });
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error('Error uploading picture:', error);
        alert('Failed to upload picture. Please try again.');
      } finally {
        setUploadingPicture(false);
      }
    }
  };

  const handleShowcaseGifChange = async (event) => {
    const file = event.target.files[0];
    console.log('GIF file selected:', file);
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('GIF file is too large. Please select a file smaller than 5MB.');
        return;
      }
      
      setUploadingGif(true);
      try {
        // Try storage first, fallback to data URL
        console.log('Attempting to upload GIF to storage...');
        try {
          const { url } = await storageService.uploadFile(file, 'showcase-images');
          console.log('GIF uploaded to storage successfully:', url);
          setShowcaseGif(url);
          
          // Save to database immediately
          console.log('Saving GIF URL to database:', url);
          const result = await userService.updateCurrentUser({ showcase_gif: url });
          console.log('GIF saved to database:', result);
          updateUserProfile({ showcase_gif: url });
        } catch (storageError) {
          console.error('Storage upload failed, using data URL fallback:', storageError);
          // Fallback to data URL
          const reader = new FileReader();
          reader.onload = async (e) => {
            console.log('GIF loaded as data URL, length:', e.target.result.length);
            setShowcaseGif(e.target.result);
            
            // Save data URL to database
            console.log('Saving GIF data URL to database');
            const result = await userService.updateCurrentUser({ showcase_gif: e.target.result });
            console.log('GIF data URL saved to database:', result);
            updateUserProfile({ showcase_gif: e.target.result });
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error('Error uploading GIF:', error);
        alert('Failed to upload GIF. Please try again.');
      } finally {
        setUploadingGif(false);
      }
    }
  };

  const handleOpenCreatePost = () => {
    setShowCreatePostModal(true);
  };

  const handleCloseCreatePost = () => {
    setShowCreatePostModal(false);
    setNewPost('');
    setPostImage(null);
  };

  const handleAddPost = async () => {
    if (newPost.trim() || postImage) {
      try {
        // Upload image to storage if exists
        let imageUrl = null;
        if (postImage) {
          // Convert data URL to file if needed
          let file = postImage;
          if (postImage.startsWith('data:')) {
            // Convert data URL to file
            const response = await fetch(postImage);
            const blob = await response.blob();
            file = new File([blob], 'post-image.jpg', { type: 'image/jpeg' });
          }
          
          const { url } = await storageService.uploadFile(file, 'post-images');
          imageUrl = url;
        }
        
        // Create post in database
        const postData = {
          content: newPost,
          image_url: imageUrl
        };
        
        const { data: newPostData, error } = await postService.createPost(postData);
        
        if (error) {
          console.error('Error creating post:', error);
          alert('Failed to create post. Please try again.');
          return;
        }
        
        // Add to local state
        const post = {
          id: newPostData.id,
          content: newPostData.content,
          image: newPostData.image_url,
          likes: newPostData.likes_count || 0,
          comments: newPostData.comments_count || 0,
          time: 'Just now',
          user: {
            name: newPostData.users?.name || userData.name,
            avatar: newPostData.users?.avatar || userData.avatar
          }
        };
        
        setPosts([post, ...posts]);
        setNewPost('');
        setPostImage(null);
        setShowCreatePostModal(false);
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
      }
    }
  };

  // Feeling handlers
  const handleEditFeeling = () => {
    setNewFeeling(currentFeeling);
    setNewFeelingEmoji(currentFeelingEmoji);
    setNewFeelingDescription(currentFeelingDescription);
    setIsEditingFeeling(true);
  };

  const handleSaveFeeling = async () => {
    try {
      const feelingData = {
        feeling: newFeeling,
        feeling_emoji: newFeelingEmoji,
        feeling_description: newFeelingDescription
      };

      // Save feeling data to database
      await userService.updateCurrentUser(feelingData);

      // Update local state
      setCurrentFeeling(newFeeling);
      setCurrentFeelingEmoji(newFeelingEmoji);
      setCurrentFeelingDescription(newFeelingDescription);

      // Update context
      updateUserProfile(feelingData);

      setIsEditingFeeling(false);
      setNewFeeling('');
      setNewFeelingEmoji('😊');
      setNewFeelingDescription('');
    } catch (error) {
      console.error('Error saving feeling data:', error);
    }
  };

  const handleCancelFeeling = () => {
    setIsEditingFeeling(false);
    setNewFeeling('');
    setNewFeelingEmoji('😊');
    setNewFeelingDescription('');
  };

  const handleSaveShowcaseImages = async () => {
    try {
      const updates = {};
      if (showcasePicture) updates.showcase_picture = showcasePicture;
      if (showcaseGif) updates.showcase_gif = showcaseGif;
      
      console.log('Saving showcase images to database:', updates);
      
      if (Object.keys(updates).length > 0) {
        const result = await userService.updateCurrentUser(updates);
        console.log('Database update result:', result);
        updateUserProfile(updates);
      }
    } catch (error) {
      console.error('Error saving showcase images:', error);
    }
  };



  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--background)',
      paddingTop: 0
    }}>
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="edit-modal" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(24, 23, 28, 0.35)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: '2.5rem 2rem 2rem 2rem',
            minWidth: 350,
            maxWidth: 400,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: 'var(--primary)' }}>
              Edit Profile
            </div>
            
            {/* Avatar */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                color: 'var(--text)',
                fontWeight: 500 
              }}>
                Profile Picture
              </label>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img 
                  src={selectedImage || userData.avatar} 
                  alt="Avatar" 
                  style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--border)'
                  }} 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    opacity: 0, 
                    cursor: 'pointer' 
                  }} 
                />
              </div>
              <label style={{ 
                display: 'block', 
                marginTop: 8, 
                fontSize: 12, 
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}>
                Change Avatar
              </label>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 20, width: '100%' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                color: 'var(--text)',
                fontWeight: 500 
              }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                style={{
                  width: 'calc(100% - 32px)',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 16,
                  fontFamily: 'inherit'
                }}
                placeholder="Enter your name..."
                maxLength={50}
              />
            </div>

            {/* Bio */}
            <div style={{ marginBottom: 20, width: '100%' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                color: 'var(--text)',
                fontWeight: 500 
              }}>
                Bio
              </label>
              <textarea
                name="bio"
                value={editData.bio}
                onChange={handleEditChange}
                style={{
                  width: 'calc(100% - 32px)',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 16,
                  fontFamily: 'inherit',
                  minHeight: 80,
                  resize: 'vertical'
                }}
                placeholder="Tell us about yourself..."
                maxLength={200}
              />
            </div>

            {/* Location */}
            <div style={{ marginBottom: 20, width: '100%' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                color: 'var(--text)',
                fontWeight: 500 
              }}>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={editData.location}
                onChange={handleEditChange}
                style={{
                  width: 'calc(100% - 32px)',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 16,
                  fontFamily: 'inherit'
                }}
                placeholder="Enter your location..."
                maxLength={50}
              />
            </div>

            {/* Header Customization */}
            <div style={{ width: '100%', marginBottom: 18 }}>
              <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: 'block' }}>Header</label>
              
              {/* Header Type Toggle */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  onClick={() => setEditData(prev => ({ ...prev, headerType: 'image' }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--gray)',
                    background: editData.headerType === 'image' ? 'var(--primary)' : 'transparent',
                    color: editData.headerType === 'image' ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  Image
                </button>
                <button
                  onClick={() => setEditData(prev => ({ ...prev, headerType: 'color' }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--gray)',
                    background: editData.headerType === 'color' ? 'var(--primary)' : 'transparent',
                    color: editData.headerType === 'color' ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  Color
                </button>
              </div>

              {/* Image Header Option */}
              {editData.headerType === 'image' && (
                <div className="cover-preview" style={{ position: 'relative', width: '100%', height: 90, background: '#f8f6ff', borderRadius: 12, overflow: 'hidden', marginBottom: 8, border: '1px solid var(--gray)' }}>
                  <img src={headerImage} alt="Header Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <input type="file" accept="image/*" onChange={handleHeaderImageChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                  <span style={{ position: 'absolute', bottom: 6, right: 10, background: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: '2px 8px', fontSize: 12, color: 'var(--primary)' }}>Change</span>
                </div>
              )}

              {/* Color Header Option */}
              {editData.headerType === 'color' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: '100%',
                    height: 90,
                    background: editData.headerColor,
                    borderRadius: 12,
                    border: '1px solid var(--gray)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600
                  }}>
                    Header Color
                  </div>
                  <input
                    type="color"
                    value={editData.headerColor}
                    onChange={(e) => setEditData(prev => ({ ...prev, headerColor: e.target.value }))}
                    style={{ width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button 
                onClick={handleCancelEdit}
                style={{
                  flex: 1,
                  background: 'none',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  padding: '12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  background: 'linear-gradient(90deg, var(--primary), var(--pink))',
                  border: 'none',
                  color: 'white',
                  padding: '12px',
                  borderRadius: 8,
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

      {/* Customize Profile Modal */}
      {isCustomizing && (
        <div className="customize-modal" style={{
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
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: '2.5rem 2rem 2rem 2rem',
            minWidth: 600,
            maxWidth: 700,
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 22, color: 'var(--text)' }}>
                Customize Profile
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
            
            {/* Background Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>
                Background
              </h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  onClick={() => setCustomizeData(prev => ({ ...prev, backgroundType: 'inherit' }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: customizeData?.backgroundType === 'inherit' ? 'var(--primary)' : 'transparent',
                    color: customizeData?.backgroundType === 'inherit' ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  Inherit
                </button>
                <button
                  onClick={() => setCustomizeData(prev => ({ ...prev, backgroundType: 'color' }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: customizeData?.backgroundType === 'color' ? 'var(--primary)' : 'transparent',
                    color: customizeData?.backgroundType === 'color' ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  Color
                </button>
                <button
                  onClick={() => setCustomizeData(prev => ({ ...prev, backgroundType: 'image' }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: customizeData?.backgroundType === 'image' ? 'var(--primary)' : 'transparent',
                    color: customizeData?.backgroundType === 'image' ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  Image
                </button>
              </div>
              
              {/* Inherit Background Option */}
              {customizeData?.backgroundType === 'inherit' && (
                <div style={{ 
                  padding: '16px', 
                  background: 'var(--background)', 
                  borderRadius: 8, 
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: 14
                }}>
                  Uses the theme gradient background
                </div>
              )}

              {/* Color Background Option */}
              {customizeData?.backgroundType === 'color' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: '100%',
                    height: 40,
                    background: customizeData?.backgroundColor || 'var(--primary)',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600
                  }}>
                    Background Color
                  </div>
                  <input
                    type="color"
                    value={customizeData?.backgroundColor || '#4A90E2'}
                    onChange={(e) => setCustomizeData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    style={{ width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                </div>
              )}

              {/* Image Background Option */}
              {customizeData?.backgroundType === 'image' && (
                <div style={{ position: 'relative', width: '100%', height: 120, background: '#f8f6ff', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  {customizeData?.backgroundImage ? (
                    <img 
                      src={customizeData.backgroundImage} 
                      alt="Background Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%',
                      color: 'var(--text-secondary)',
                      fontSize: 14
                    }}>
                      Click to upload background image
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleBackgroundImageChange} 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      opacity: 0, 
                      cursor: 'pointer' 
                    }} 
                  />
                  {customizeData?.backgroundImage && (
                    <button
                      onClick={() => setCustomizeData(prev => ({ ...prev, backgroundImage: null }))}
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
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Colors Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>
                Colors
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 14, color: 'var(--text)', minWidth: 100 }}>Button Color:</span>
                      <div style={{
                        width: '100%',
                        height: 30,
                        background: customizeData?.buttonColor || 'var(--primary)',
                        borderRadius: 6,
                        border: '1px solid var(--border)'
                      }} />
                      <input
                        type="color"
                        value={customizeData?.buttonColor || '#4A90E2'}
                        onChange={(e) => setCustomizeData(prev => ({ ...prev, buttonColor: e.target.value }))}
                        style={{ width: 30, height: 30, border: 'none', borderRadius: 6, cursor: 'pointer' }}
                      />
                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 14, color: 'var(--text)', minWidth: 100 }}>Header Text:</span>
                      <div style={{
                        width: '100%',
                        height: 30,
                        background: customizeData?.headerTextColor || 'var(--text)',
                        borderRadius: 6,
                        border: '1px solid var(--border)'
                      }} />
                      <input
                        type="color"
                        value={customizeData?.headerTextColor || '#000000'}
                        onChange={(e) => setCustomizeData(prev => ({ ...prev, headerTextColor: e.target.value }))}
                        style={{ width: 30, height: 30, border: 'none', borderRadius: 6, cursor: 'pointer' }}
                      />
                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 14, color: 'var(--text)', minWidth: 100 }}>Body Text:</span>
                      <div style={{
                        width: '100%',
                        height: 30,
                        background: customizeData?.bodyTextColor || 'var(--text-secondary)',
                        borderRadius: 6,
                        border: '1px solid var(--border)'
                      }} />
                      <input
                        type="color"
                        value={customizeData?.bodyTextColor || '#000000'}
                        onChange={(e) => setCustomizeData(prev => ({ ...prev, bodyTextColor: e.target.value }))}
                        style={{ width: 30, height: 30, border: 'none', borderRadius: 6, cursor: 'pointer' }}
                      />
                    </div>
              </div>
            </div>

            {/* Sidebar Widgets Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>
                Sidebar Widgets
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Left Sidebar */}
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
                    Left
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { id: 'feelings', label: 'Feelings Widget', icon: '😊' },
                      { id: 'bestFriends', label: 'Best Friends', icon: '👥' },
                      { id: 'musicPlayer', label: 'Music Player', icon: '🎵' },
                      { id: 'showcaseGif', label: 'Showcase Gif', icon: '🎬' },
                      { id: 'showcasePic', label: 'Showcase Pic', icon: '🖼️' }
                    ].map(widget => (
                      <label key={widget.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8,
                        padding: '8px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        background: customizeData?.leftSidebarWidgets?.includes(widget.id) ? 'var(--primary)' : 'transparent',
                        color: customizeData?.leftSidebarWidgets?.includes(widget.id) ? 'white' : 'var(--text)',
                        fontSize: 12
                      }}>
                        <input
                          type="checkbox"
                          checked={customizeData?.leftSidebarWidgets?.includes(widget.id) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustomizeData(prev => ({
                                ...prev,
                                leftSidebarWidgets: [...(prev.leftSidebarWidgets || []), widget.id]
                              }));
                            } else {
                              setCustomizeData(prev => ({
                                ...prev,
                                leftSidebarWidgets: (prev.leftSidebarWidgets || []).filter(id => id !== widget.id)
                              }));
                            }
                          }}
                          style={{ margin: 0 }}
                        />
                        <span>{widget.icon}</span>
                        {widget.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Right Sidebar */}
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
                    Right
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { id: 'feelings', label: 'Feelings Widget', icon: '😊' },
                      { id: 'recentActivity', label: 'Recent Activity', icon: '📝' },
                      { id: 'following', label: 'Following', icon: '👥' },
                      { id: 'musicPlayer', label: 'Music Player', icon: '🎵' },
                      { id: 'showcaseGif', label: 'Showcase Gif', icon: '🎬' },
                      { id: 'showcasePicture', label: 'Showcase Picture', icon: '🖼️' }
                    ].map(widget => (
                      <label key={widget.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8,
                        padding: '8px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        background: customizeData?.rightSidebarWidgets?.includes(widget.id) ? 'var(--primary)' : 'transparent',
                        color: customizeData?.rightSidebarWidgets?.includes(widget.id) ? 'white' : 'var(--text)',
                        fontSize: 12
                      }}>
                        <input
                          type="checkbox"
                          checked={customizeData?.rightSidebarWidgets?.includes(widget.id) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustomizeData(prev => ({
                                ...prev,
                                rightSidebarWidgets: [...(prev.rightSidebarWidgets || []), widget.id]
                              }));
                            } else {
                              setCustomizeData(prev => ({
                                ...prev,
                                rightSidebarWidgets: (prev.rightSidebarWidgets || []).filter(id => id !== widget.id)
                              }));
                            }
                          }}
                          style={{ margin: 0 }}
                        />
                        <span>{widget.icon}</span>
                        {widget.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div style={{ 
              display: 'flex', 
              gap: 12, 
              justifyContent: 'flex-end',
              marginTop: 20,
              paddingTop: 20,
              borderTop: '1px solid var(--border)'
            }}>
              <button 
                onClick={handleCancelCustomize}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  padding: '10px 20px',
                  borderRadius: 8,
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
                  background: 'linear-gradient(90deg, var(--primary), var(--pink))',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 8,
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

      {/* Edit Feeling Modal */}
      {isEditingFeeling && (
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
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: '2rem',
            minWidth: 400,
            maxWidth: 500,
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>
                Edit Feeling
              </div>
              <button 
                onClick={handleCancelFeeling}
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

            {/* Feeling Emoji Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>
                Feeling Emoji
              </h3>
              <div style={{ 
                fontSize: 48, 
                textAlign: 'center', 
                marginBottom: 16,
                padding: '16px',
                background: 'var(--background)',
                borderRadius: 12,
                border: '1px solid var(--border)'
              }}>
                {newFeelingEmoji}
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(6, 1fr)', 
                gap: 8,
                maxHeight: 200,
                overflow: 'auto'
              }}>
                {[
                  '🤪', '😊', '🙂', '🥰', '😘', '😴',
                  '😎', '🤗', '😌', '👑', '😄', '😝',
                  '🤏', '🙂', '😇', '🤠', '👻', '🤖',
                  '🐱', '🐶', '🐰', '🐼', '🐨', '🐯',
                  '🦊', '🐸', '🐵', '🐷', '🐮', '🐷',
                  '🦁', '🐯', '🐸', '🐵', '🐷', '🐮'
                ].map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setNewFeelingEmoji(emoji)}
                    style={{
                      fontSize: 24,
                      padding: '8px',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      background: newFeelingEmoji === emoji ? 'var(--primary)' : 'transparent',
                      color: newFeelingEmoji === emoji ? 'white' : 'var(--text)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Feeling Input Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>
                Feeling
              </h3>
              <input
                type="text"
                value={newFeeling}
                onChange={(e) => setNewFeeling(e.target.value)}
                placeholder="How are you feeling?"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Description Input Section */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--text)', fontSize: 16, fontWeight: 600 }}>
                Description
              </h3>
              <input
                type="text"
                value={newFeelingDescription}
                onChange={(e) => setNewFeelingDescription(e.target.value)}
                placeholder="Describe your feeling..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={handleCancelFeeling}
                style={{
                  flex: 1,
                  background: 'none',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  padding: '12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveFeeling}
                style={{
                  flex: 1,
                  background: 'linear-gradient(90deg, var(--primary), var(--pink))',
                  border: 'none',
                  color: 'white',
                  padding: '12px',
                  borderRadius: 8,
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

            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <img 
                src={userData.avatar} 
                alt="Avatar" 
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} 
              />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>
                  {userData.name}
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
            <textarea
              placeholder={`What's on your mind, ${userData.name.split(' ')[0]}?`}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              style={{
                width: '100%',
                minHeight: 120,
                padding: '16px',
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

            {/* Media Preview */}
            {postImage && (
              <div style={{ position: 'relative', marginTop: 16 }}>
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

            {/* Add Media Section */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                Add to your post
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handlePostImageChange}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: 14
                  }}>
                    📷 Photo/Video
                  </div>
                </label>
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="file"
                    accept="image/gif,video/*"
                    onChange={handlePostImageChange}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: 14
                  }}>
                    🎬 GIF
                  </div>
                </label>
              </div>
            </div>

            {/* Post Button */}
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleAddPost}
                disabled={!newPost.trim() && !postImage}
                style={{
                  background: newPost.trim() || postImage ? 'var(--primary)' : 'var(--text-secondary)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: newPost.trim() || postImage ? 'pointer' : 'not-allowed',
                  opacity: newPost.trim() || postImage ? 1 : 0.5
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div>
        {/* Cover Photo */}
        <div style={{ 
          height: 200, 
          background: `url(${headerImage || userData.coverPhoto})`, 
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
              src={selectedImage || userData.avatar} 
              alt={userData.name}
              style={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                border: '4px solid var(--card)',
                objectFit: 'cover'
              }} 
            />
            <div style={{ color: 'white', marginBottom: 10 }}>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>{userData.name}</h1>
              <p style={{ margin: '4px 0', fontSize: 16, opacity: 0.9 }}>{userData.username}</p>
              <p style={{ margin: '4px 0', fontSize: 14, opacity: 0.8 }}>{userData.location} • Joined {userData.joinedDate}</p>
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
            <button 
              onClick={handleEditProfile}
              className="button" 
              style={{ 
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
              }}
            >
              Edit Profile
            </button>
            <button 
              onClick={handleCustomizeProfile}
              className="button" 
              style={{ 
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
              }}
            >
              Customize
            </button>

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
              Share
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '24px 20px',
          display: 'grid',
          gridTemplateColumns: '300px 1fr 300px',
          gap: 24,
          background: customizeData?.backgroundType === 'image' && customizeData?.backgroundImage 
            ? `url(${customizeData.backgroundImage})` 
            : customizeData?.backgroundType === 'color' && customizeData?.backgroundColor !== 'inherit' 
              ? customizeData?.backgroundColor 
              : 'inherit',
          backgroundSize: customizeData?.backgroundType === 'image' && customizeData?.backgroundImage ? 'cover' : 'auto',
          backgroundPosition: customizeData?.backgroundType === 'image' && customizeData?.backgroundImage ? 'center' : 'auto',
          backgroundRepeat: customizeData?.backgroundType === 'image' && customizeData?.backgroundImage ? 'no-repeat' : 'auto'
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
              <h3 style={{ margin: '0 0 16px 0', color: customizeData?.headerTextColor || 'var(--text)' }}>About</h3>
              <p style={{ 
                margin: '0 0 20px 0', 
                color: customizeData?.bodyTextColor || 'var(--text-secondary)', 
                lineHeight: 1.6,
                fontSize: 14
              }}>
                {userData.bio}
              </p>
              
              {/* Follower/Following Count */}
              <div style={{ 
                display: 'flex', 
                gap: 24, 
                justifyContent: 'center',
                paddingTop: 16,
                borderTop: '1px solid var(--border)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 24, 
                    fontWeight: 700, 
                    color: customizeData?.headerTextColor || 'var(--text)',
                    marginBottom: 4
                  }}>
                    0
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: customizeData?.bodyTextColor || 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Followers
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: 24, 
                    fontWeight: 700, 
                    color: customizeData?.headerTextColor || 'var(--text)',
                    marginBottom: 4
                  }}>
                    0
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: customizeData?.bodyTextColor || 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Following
                  </div>
                </div>
              </div>
            </div>

            {/* Feelings Widget */}
            {customizeData?.leftSidebarWidgets?.includes('feelings') && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, color: customizeData?.headerTextColor || 'var(--text)', fontSize: 16, fontWeight: 600 }}>
                    {userData.name} Is Feeling:
                  </h3>
                  <button
                    onClick={handleEditFeeling}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: 16,
                      padding: 4
                    }}
                  >
                    ✏️
                  </button>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #f8f6ff, #e8e4ff)', 
                  borderRadius: 12, 
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <span style={{ fontSize: 32 }}>{currentFeelingEmoji}</span>
                  <div>
                    <div style={{ 
                      fontSize: 16, 
                      fontWeight: 600, 
                      color: customizeData?.bodyTextColor || 'var(--text)',
                      marginBottom: 4
                    }}>
                      {currentFeeling}
                    </div>
                    <div style={{ 
                      fontSize: 14, 
                      color: customizeData?.bodyTextColor || 'var(--text-secondary)' 
                    }}>
                      {currentFeelingDescription}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Best Friends Widget */}
            {customizeData?.leftSidebarWidgets?.includes('bestFriends') && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', color: customizeData?.headerTextColor || 'var(--text)' }}>Best Friends</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: 0 }}>No best friends yet</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                    Add your best friends here!
                  </p>
                </div>
              </div>
            )}

            {/* Music Player Widget */}
            {customizeData?.leftSidebarWidgets?.includes('musicPlayer') && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', color: customizeData?.headerTextColor || 'var(--text)' }}>Music Player</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: 0 }}>No music playing</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                    Connect your music account!
                  </p>
                </div>
              </div>
            )}

            {/* Showcase Gif Widget */}
            {customizeData?.leftSidebarWidgets?.includes('showcaseGif') && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  {showcaseGif ? (
                    <div>
                      <img 
                        src={showcaseGif} 
                        alt="Showcase GIF" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: 200, 
                          borderRadius: 8,
                          marginBottom: 12
                        }} 
                      />
                      <button
                        onClick={() => document.getElementById('showcase-gif-upload').click()}
                        disabled={uploadingGif}
                        style={{
                          background: uploadingGif ? 'var(--text-secondary)' : 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: uploadingGif ? 'not-allowed' : 'pointer',
                          marginRight: 8
                        }}
                      >
                        {uploadingGif ? 'Uploading...' : 'Change GIF'}
                      </button>
                      <button
                        onClick={() => setShowcaseGif(null)}
                        style={{
                          background: 'var(--danger)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: '0 0 12px 0' }}>No gif selected</p>
                      <button
                        onClick={() => document.getElementById('showcase-gif-upload').click()}
                        disabled={uploadingGif}
                        style={{
                          background: uploadingGif ? 'var(--text-secondary)' : 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: uploadingGif ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {uploadingGif ? 'Uploading...' : 'Upload GIF'}
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/gif,video/*"
                  onChange={handleShowcaseGifChange}
                  style={{ display: 'none' }}
                  id="showcase-gif-upload"
                />
              </div>
            )}

            {/* Showcase Pic Widget */}
            {customizeData?.leftSidebarWidgets?.includes('showcasePic') && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  {showcasePicture ? (
                    <div>
                      <img 
                        src={showcasePicture} 
                        alt="Showcase Picture" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: 200, 
                          borderRadius: 8,
                          marginBottom: 12
                        }} 
                      />
                      <button
                        onClick={() => document.getElementById('showcase-picture-upload').click()}
                        disabled={uploadingPicture}
                        style={{
                          background: uploadingPicture ? 'var(--text-secondary)' : 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: uploadingPicture ? 'not-allowed' : 'pointer',
                          marginRight: 8
                        }}
                      >
                        {uploadingPicture ? 'Uploading...' : 'Change Picture'}
                      </button>
                      <button
                        onClick={() => setShowcasePicture(null)}
                        style={{
                          background: 'var(--danger)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: '0 0 12px 0' }}>No picture selected</p>
                      <button
                        onClick={() => document.getElementById('showcase-picture-upload').click()}
                        disabled={uploadingPicture}
                        style={{
                          background: uploadingPicture ? 'var(--text-secondary)' : 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: uploadingPicture ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {uploadingPicture ? 'Uploading...' : 'Upload Picture'}
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleShowcasePictureChange}
                  style={{ display: 'none' }}
                  id="showcase-picture-upload"
                />
              </div>
            )}
          </div>

          {/* Center Content */}
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
                { id: 'badges', label: 'Badges' },
                { id: 'gallery', label: 'Gallery' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '16px 24px',
                    background: activeTab === tab.id ? customizeData?.buttonColor || 'var(--primary)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : customizeData?.bodyTextColor || 'var(--text)',
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

            {/* Add Post */}
            <div style={{ 
              background: 'var(--card)',
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <img 
                  src={userData.avatar} 
                  alt="Avatar" 
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
                    What's on your mind, {userData.name.split(' ')[0]}?
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
                    background: customizeData?.buttonColor || 'linear-gradient(90deg, var(--primary), var(--pink))',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: newPost.trim() || postImage ? 'pointer' : 'not-allowed',
                    opacity: newPost.trim() || postImage ? 1 : 0.5
                  }}
                >
                  Post
                </button>
              </div>
            </div>

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
                  <h3 style={{ margin: '0 0 16px 0', color: customizeData?.headerTextColor || 'var(--text)' }}>Timeline</h3>
                  {posts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {posts.map((post) => (
                        <div key={post.id} style={{ 
                          padding: 16, 
                          border: '1px solid var(--border)', 
                          borderRadius: 8 
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <img 
                              src={userData.avatar} 
                              alt="Avatar" 
                              style={{ 
                                width: 32, 
                                height: 32, 
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }} 
                            />
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 500, color: customizeData?.bodyTextColor || 'var(--text)' }}>
                                {userData.name}
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                {post.time}
                              </div>
                            </div>
                          </div>
                          
                          <p style={{ margin: '0 0 12px 0', color: customizeData?.bodyTextColor || 'var(--text)', lineHeight: 1.5 }}>
                            {post.content}
                          </p>
                          
                          {post.image && (
                            <img 
                              src={post.image} 
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
                              ❤️ {post.likes}
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
                              💬 {post.comments}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: 0 }}>No posts yet</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                        Share your first post to start your journey!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'badges' && (
                <div>
                  <h3 style={{ margin: '0 0 16px 0', color: customizeData?.headerTextColor || 'var(--text)' }}>Badges</h3>
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: 0 }}>No badges earned yet</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                      Complete challenges to earn badges!
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div>
                  <h3 style={{ margin: '0 0 16px 0', color: customizeData?.headerTextColor || 'var(--text)' }}>Gallery</h3>
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: 0 }}>No photos yet</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                      Share photos to build your gallery!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Feelings Widget */}
            {customizeData?.rightSidebarWidgets?.includes('feelings') && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, color: customizeData?.headerTextColor || 'var(--text)', fontSize: 16, fontWeight: 600 }}>
                    {userData.name} Is Feeling:
                  </h3>
                  <button
                    onClick={handleEditFeeling}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: 16,
                      padding: 4
                    }}
                  >
                    ✏️
                  </button>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #f8f6ff, #e8e4ff)', 
                  borderRadius: 12, 
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <span style={{ fontSize: 32 }}>{currentFeelingEmoji}</span>
                  <div>
                    <div style={{ 
                      fontSize: 16, 
                      fontWeight: 600, 
                      color: customizeData?.bodyTextColor || 'var(--text)',
                      marginBottom: 4
                    }}>
                      {currentFeeling}
                    </div>
                    <div style={{ 
                      fontSize: 14, 
                      color: customizeData?.bodyTextColor || 'var(--text-secondary)' 
                    }}>
                      {currentFeelingDescription}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity Widget */}
            {customizeData?.rightSidebarWidgets?.includes('recentActivity') && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', color: customizeData?.headerTextColor || 'var(--text)' }}>Recent Activity</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: 0 }}>No recent activity</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                    Your activity will appear here
                  </p>
                </div>
              </div>
            )}

            {/* Following Widget */}
            {customizeData?.rightSidebarWidgets?.includes('following') && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', color: customizeData?.headerTextColor || 'var(--text)' }}>Following</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: 0 }}>Not following anyone yet</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                    Start following people!
                  </p>
                </div>
              </div>
            )}

            {/* Music Player Widget */}
            {customizeData?.rightSidebarWidgets?.includes('musicPlayer') && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', color: customizeData?.headerTextColor || 'var(--text)' }}>Music Player</h3>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: 0 }}>No music playing</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                    Connect your music account!
                  </p>
                </div>
              </div>
            )}

            {/* Showcase Gif Widget */}
            {customizeData?.rightSidebarWidgets?.includes('showcaseGif') && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  {showcaseGif ? (
                    <div>
                      <img 
                        src={showcaseGif} 
                        alt="Showcase GIF" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: 200, 
                          borderRadius: 8,
                          marginBottom: 12
                        }} 
                      />
                      <button
                        onClick={() => document.getElementById('showcase-gif-upload-right').click()}
                        disabled={uploadingGif}
                        style={{
                          background: uploadingGif ? 'var(--text-secondary)' : 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: uploadingGif ? 'not-allowed' : 'pointer',
                          marginRight: 8
                        }}
                      >
                        {uploadingGif ? 'Uploading...' : 'Change GIF'}
                      </button>
                      <button
                        onClick={() => setShowcaseGif(null)}
                        style={{
                          background: 'var(--danger)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: '0 0 12px 0' }}>No gif selected</p>
                      <button
                        onClick={() => document.getElementById('showcase-gif-upload-right').click()}
                        disabled={uploadingGif}
                        style={{
                          background: uploadingGif ? 'var(--text-secondary)' : 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: uploadingGif ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {uploadingGif ? 'Uploading...' : 'Upload GIF'}
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/gif,video/*"
                  onChange={handleShowcaseGifChange}
                  style={{ display: 'none' }}
                  id="showcase-gif-upload-right"
                />
              </div>
            )}

            {/* Showcase Picture Widget */}
            {customizeData?.rightSidebarWidgets?.includes('showcasePicture') && (
              <div style={{ 
                background: 'var(--card)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  {showcasePicture ? (
                    <div>
                      <img 
                        src={showcasePicture} 
                        alt="Showcase Picture" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: 200, 
                          borderRadius: 8,
                          marginBottom: 12
                        }} 
                      />
                      <button
                        onClick={() => document.getElementById('showcase-picture-upload-right').click()}
                        disabled={uploadingPicture}
                        style={{
                          background: uploadingPicture ? 'var(--text-secondary)' : 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: uploadingPicture ? 'not-allowed' : 'pointer',
                          marginRight: 8
                        }}
                      >
                        {uploadingPicture ? 'Uploading...' : 'Change Picture'}
                      </button>
                      <button
                        onClick={() => setShowcasePicture(null)}
                        style={{
                          background: 'var(--danger)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: customizeData?.bodyTextColor || 'var(--text-secondary)', margin: '0 0 12px 0' }}>No picture selected</p>
                      <button
                        onClick={() => document.getElementById('showcase-picture-upload-right').click()}
                        disabled={uploadingPicture}
                        style={{
                          background: uploadingPicture ? 'var(--text-secondary)' : 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: 6,
                          fontSize: 12,
                          cursor: uploadingPicture ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {uploadingPicture ? 'Uploading...' : 'Upload Picture'}
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleShowcasePictureChange}
                  style={{ display: 'none' }}
                  id="showcase-picture-upload-right"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}