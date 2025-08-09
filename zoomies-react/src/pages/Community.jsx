import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { communityService } from '../services/communityService';
import { storageService } from '../services/storageService';

export default function Community() {
  const { user } = useAuth();
  const { topic, communityId, postId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(topic || null);
  const [selectedCommunity, setSelectedCommunity] = useState(communityId || null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('trending'); // 'trending', 'recent', 'communities'
  const [isDark, setIsDark] = useState(false);
  
  // Modal states
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isMemberOfSelectedCommunity, setIsMemberOfSelectedCommunity] = useState(false);
  const [communityMemberships, setCommunityMemberships] = useState({});
  
  // Form states
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    community_id: '',
    topics: [],
    image: null
  });
  
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    icon: '🐾',
    color: '#FFB3E6',
    topics: []
  });

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

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load data based on selected topic/community/viewMode
  useEffect(() => {
    if (selectedTopic) {
      loadTopicData();
    } else if (selectedCommunity) {
      loadCommunityData();
    } else if (viewMode === 'joined-communities') {
      loadJoinedCommunities();
    } else if (viewMode === 'my-posts') {
      loadMyPosts();
    } else if (viewMode === 'communities') {
      // Load all communities when on communities filter tab
      loadAllCommunities();
    } else {
      loadPosts();
    }
  }, [selectedTopic, selectedCommunity, viewMode]);

  // Check membership status when selected community changes
  useEffect(() => {
    const checkSelectedCommunityMembership = async () => {
      if (user && selectedCommunity) {
        const { data } = await communityService.isMemberOfCommunity(selectedCommunity);
        setIsMemberOfSelectedCommunity(data);
      } else {
        setIsMemberOfSelectedCommunity(false);
      }
    };
    checkSelectedCommunityMembership();
  }, [user, selectedCommunity]);

  // Check membership status for all communities
  useEffect(() => {
    const checkAllCommunityMemberships = async () => {
      console.log('Checking memberships for user:', user?.id);
      if (user && communities.length > 0) {
        const memberships = {};
        for (const community of communities) {
          const { data } = await communityService.isMemberOfCommunity(community.id);
          memberships[community.id] = data;
        }
        console.log('Memberships:', memberships);
        setCommunityMemberships(memberships);
      }
    };
    checkAllCommunityMemberships();
  }, [user, communities]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('Loading initial data...');
      const [communitiesRes, topicsRes, trendingRes] = await Promise.all([
        communityService.getAllCommunities(),
        communityService.getAllTopics(),
        communityService.getTrendingPosts()
      ]);

      console.log('Initial data results:', { communitiesRes, topicsRes, trendingRes });

      if (!communitiesRes.error) setCommunities(communitiesRes.data || []);
      if (!topicsRes.error) setTopics(topicsRes.data || []);
      if (!trendingRes.error) setTrendingPosts(trendingRes.data || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const { data, error } = await communityService.getPosts();
      if (!error) setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadTopicData = async () => {
    try {
      const [communitiesRes, postsRes] = await Promise.all([
        communityService.getCommunitiesByTopic(selectedTopic),
        communityService.getPostsByTopic(selectedTopic)
      ]);

      if (!communitiesRes.error) setCommunities(communitiesRes.data || []);
      if (!postsRes.error) setPosts(postsRes.data || []);
    } catch (error) {
      console.error('Error loading topic data:', error);
    }
  };

  const loadCommunityData = async () => {
    try {
      const { data, error } = await communityService.getPosts(selectedCommunity);
      if (!error) setPosts(data || []);
    } catch (error) {
      console.error('Error loading community data:', error);
    }
  };

  const loadJoinedCommunities = async () => {
    try {
      const { data, error } = await communityService.getUserJoinedCommunities();
      if (!error) setCommunities(data || []);
    } catch (error) {
      console.error('Error loading joined communities:', error);
    }
  };

  const loadMyPosts = async () => {
    try {
      const { data, error } = await communityService.getUserPosts();
      if (!error) setPosts(data || []);
    } catch (error) {
      console.error('Error loading my posts:', error);
    }
  };

  const loadAllCommunities = async () => {
    try {
      const { data, error } = await communityService.getAllCommunities();
      if (!error) setCommunities(data || []);
    } catch (error) {
      console.error('Error loading all communities:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      let imageUrl = null;
      if (newPost.image) {
        console.log('Uploading image...');
        const { url } = await storageService.uploadFile(newPost.image, 'community-posts');
        imageUrl = url;
        console.log('Image uploaded:', imageUrl);
      }

      console.log('Creating post with data:', {
        ...newPost,
        community_id: selectedCommunity || newPost.community_id,
        image_url: imageUrl
      });

      const { data, error } = await communityService.createPost({
        ...newPost,
        community_id: selectedCommunity || newPost.community_id,
        image_url: imageUrl
      });

      console.log('Post creation result:', { data, error });

      if (error) {
        console.error('Error creating post:', error);
        alert('Error creating post: ' + (error.message || error));
        return;
      }

      if (data) {
        console.log('Post created successfully:', data);
        setShowCreatePost(false);
        setNewPost({ title: '', content: '', community_id: '', topics: [], image: null });
        
        // Refresh the posts
        if (selectedCommunity) {
          console.log('Reloading community data...');
          await loadCommunityData();
        } else {
          console.log('Reloading posts...');
          await loadPosts();
        }
        
        console.log('Post data reloaded');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + error.message);
    }
  };

  const handleCreateCommunity = async () => {
    try {
      const { error } = await communityService.createCommunity(newCommunity);
      if (!error) {
        setShowCreateCommunity(false);
        setNewCommunity({ name: '', description: '', icon: '🐾', color: '#FFB3E6', topics: [] });
        loadInitialData();
      }
    } catch (error) {
      console.error('Error creating community:', error);
    }
  };

  const handleJoinLeaveCommunity = async (communityId, isCurrentlyMember) => {
    try {
      if (isCurrentlyMember) {
        // Leave community
        console.log('Leaving community:', communityId);
        const { error } = await communityService.leaveCommunity(communityId);
        console.log('Leave result:', { error });
        if (!error) {
          // Refresh data to update member counts
          if (viewMode === 'communities') {
            loadAllCommunities();
          } else if (viewMode === 'joined-communities') {
            loadJoinedCommunities();
          } else {
            loadInitialData();
          }
          // Update membership status for selected community
          if (selectedCommunity === communityId) {
            setIsMemberOfSelectedCommunity(false);
          }
          // Update community memberships state
          setCommunityMemberships(prev => ({
            ...prev,
            [communityId]: false
          }));
          // Force refresh membership data
          setTimeout(() => {
            const checkMembership = async () => {
              const { data } = await communityService.isMemberOfCommunity(communityId);
              setCommunityMemberships(prev => ({
                ...prev,
                [communityId]: data
              }));
            };
            checkMembership();
          }, 100);
        }
      } else {
        // Join community
        console.log('Joining community:', communityId);
        const { error } = await communityService.joinCommunity(communityId);
        console.log('Join result:', { error });
        if (!error) {
          // Refresh data to update member counts
          if (viewMode === 'communities') {
            loadAllCommunities();
          } else if (viewMode === 'joined-communities') {
            loadJoinedCommunities();
          } else {
            loadInitialData();
          }
          // Update membership status for selected community
          if (selectedCommunity === communityId) {
            setIsMemberOfSelectedCommunity(true);
          }
          // Update community memberships state
          setCommunityMemberships(prev => ({
            ...prev,
            [communityId]: true
          }));
          // Force refresh membership data
          setTimeout(() => {
            const checkMembership = async () => {
              const { data } = await communityService.isMemberOfCommunity(communityId);
              setCommunityMemberships(prev => ({
                ...prev,
                [communityId]: data
              }));
            };
            checkMembership();
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error joining/leaving community:', error);
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      const { data: existingReaction } = await communityService.getUserReaction(postId);
      
      if (existingReaction?.reaction_type === reactionType) {
        await communityService.removeReaction({ post_id: postId });
      } else {
        await communityService.addReaction({ post_id: postId, reaction_type: reactionType });
      }
      
      loadPosts();
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const renderPost = (post) => (
    <div key={post.id} style={{
      background: 'var(--card)',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      border: '1px solid var(--border)'
    }}>
      {/* Post Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <img 
          src={post.users?.profile_img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.users?.username}`}
          alt={post.users?.username}
          style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }}
        />
        <div style={{ flex: 1 }}>
          <Link to={`/user/${post.users?.username}`} style={{ 
            color: 'var(--text)', 
            textDecoration: 'none', 
            fontWeight: 600,
            fontSize: 14
          }}>
            {post.users?.username}
          </Link>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {formatTimeAgo(post.created_at)} • {post.communities?.name}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <h3 style={{ margin: '0 0 8px 0', fontSize: 18, color: 'var(--text)' }}>
        {post.title}
      </h3>
      {post.content && (
        <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {post.content}
        </p>
      )}
      {post.image_url && (
        <img 
          src={post.image_url} 
          alt="Post image"
          style={{ 
            width: '100%', 
            maxHeight: 400, 
            objectFit: 'cover', 
            borderRadius: 8,
            marginBottom: 12
          }}
        />
      )}

      {/* Post Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button 
          onClick={() => handleReaction(post.id, 'upvote')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: 14
          }}
        >
          ⬆️ {post.upvotes}
        </button>
        <button 
          onClick={() => handleReaction(post.id, 'downvote')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: 14
          }}
        >
          ⬇️ {post.downvotes}
        </button>
        <button 
          onClick={() => {
            setSelectedPost(post);
            setShowPostDetail(true);
          }}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: 14
          }}
        >
          💬 {post.comment_count}
        </button>
      </div>
    </div>
  );

  const renderCommunity = (community) => {
    const isSelected = selectedCommunity === community.id;
    
    return (
      <div 
        key={community.id} 
        onClick={() => {
          setSelectedCommunity(community.id);
          setSelectedTopic(null);
          setViewMode('recent');
        }}
        style={{
          background: isSelected ? 'var(--primary)' : 'var(--card)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          transform: isSelected ? 'translateY(-2px)' : 'none',
          boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 24, marginRight: 8 }}>{community.icon}</span>
          <div style={{ flex: 1 }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: 16, 
              color: isSelected ? 'white' : 'var(--text)' 
            }}>
              {community.name}
            </h4>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: 12, 
              color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' 
            }}>
              {community.member_count} members
            </p>
          </div>
          {user && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleJoinLeaveCommunity(community.id, communityMemberships[community.id] || false);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: (communityMemberships[community.id] || false) ? '1px solid var(--border)' : '1px solid var(--primary)',
                background: (communityMemberships[community.id] || false) ? 'var(--card)' : 'var(--primary)',
                color: (communityMemberships[community.id] || false) ? 'var(--text-secondary)' : 'white',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              {(communityMemberships[community.id] || false) ? 'Leave' : 'Join'}
            </button>
          )}
        </div>
        <p style={{ 
          margin: 0, 
          fontSize: 13, 
          color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' 
        }}>
          {community.description}
        </p>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      


      {/* Left Sidebar */}
      <div style={{
        width: 280,
        background: 'var(--card)',
        borderRight: '1px solid var(--border)',
        padding: '24px 0',
        position: 'fixed',
        top: 100,
        left: 0,
        height: 'calc(100vh - 100px)',
        overflowY: 'auto'
      }}>
        {/* Search */}
        <div style={{ padding: '0 24px', marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '200px',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
              fontSize: 14
            }}
          />
        </div>

                {/* Navigation */}
        <div style={{ padding: '0 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Home Button - Always visible */}
            <button
              onClick={() => {
                setSelectedTopic(null);
                setSelectedCommunity(null);
                setViewMode('trending');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: (!selectedTopic && !selectedCommunity && viewMode === 'trending') ? 'var(--primary)' : 'var(--card)',
                color: (!selectedTopic && !selectedCommunity && viewMode === 'trending') ? 'white' : 'var(--text)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: (!selectedTopic && !selectedCommunity && viewMode === 'trending') ? '600' : '500',
                transition: 'all 0.2s ease',
                boxShadow: (!selectedTopic && !selectedCommunity && viewMode === 'trending') ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (!(!selectedTopic && !selectedCommunity && viewMode === 'trending')) {
                  e.target.style.background = 'var(--background)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!(!selectedTopic && !selectedCommunity && viewMode === 'trending')) {
                  e.target.style.background = 'var(--card)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }
              }}
            >
              <span style={{ fontSize: 16 }}>🏠</span>
              Home
            </button>
            
            {/* Signed In Navigation */}
            {user ? (
              <>
                <button
                  onClick={() => {
                    setSelectedTopic(null);
                    setSelectedCommunity(null);
                    setViewMode('joined-communities');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: (!selectedTopic && !selectedCommunity && viewMode === 'joined-communities') ? 'var(--primary)' : 'var(--card)',
                    color: (!selectedTopic && !selectedCommunity && viewMode === 'joined-communities') ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: (!selectedTopic && !selectedCommunity && viewMode === 'joined-communities') ? '600' : '500',
                    transition: 'all 0.2s ease',
                    boxShadow: (!selectedTopic && !selectedCommunity && viewMode === 'joined-communities') ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!(!selectedTopic && !selectedCommunity && viewMode === 'joined-communities')) {
                      e.target.style.background = 'var(--background)';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!selectedTopic && !selectedCommunity && viewMode === 'joined-communities')) {
                      e.target.style.background = 'var(--card)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }
                  }}
                >
                  <span style={{ fontSize: 16 }}>👥</span>
                  Joined Communities
                </button>
                
                <button
                  onClick={() => {
                    setSelectedTopic(null);
                    setSelectedCommunity(null);
                    setViewMode('my-posts');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: (!selectedTopic && !selectedCommunity && viewMode === 'my-posts') ? 'var(--primary)' : 'var(--card)',
                    color: (!selectedTopic && !selectedCommunity && viewMode === 'my-posts') ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: (!selectedTopic && !selectedCommunity && viewMode === 'my-posts') ? '600' : '500',
                    transition: 'all 0.2s ease',
                    boxShadow: (!selectedTopic && !selectedCommunity && viewMode === 'my-posts') ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!(!selectedTopic && !selectedCommunity && viewMode === 'my-posts')) {
                      e.target.style.background = 'var(--background)';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!selectedTopic && !selectedCommunity && viewMode === 'my-posts')) {
                      e.target.style.background = 'var(--card)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }
                  }}
                >
                  <span style={{ fontSize: 16 }}>📝</span>
                  My Posts
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectedTopic(null);
                    setSelectedCommunity(null);
                    setViewMode('trending');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: (!selectedTopic && !selectedCommunity && viewMode === 'trending') ? 'var(--primary)' : 'var(--card)',
                    color: (!selectedTopic && !selectedCommunity && viewMode === 'trending') ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: (!selectedTopic && !selectedCommunity && viewMode === 'trending') ? '600' : '500',
                    transition: 'all 0.2s ease',
                    boxShadow: (!selectedTopic && !selectedCommunity && viewMode === 'trending') ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!(!selectedTopic && !selectedCommunity && viewMode === 'trending')) {
                      e.target.style.background = 'var(--background)';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!selectedTopic && !selectedCommunity && viewMode === 'trending')) {
                      e.target.style.background = 'var(--card)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }
                  }}
                >
                  <span style={{ fontSize: 16 }}>🔥</span>
                  Trending
                </button>
                
                <button
                  onClick={() => {
                    setSelectedTopic(null);
                    setSelectedCommunity(null);
                    setViewMode('recent');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: (!selectedTopic && !selectedCommunity && viewMode === 'recent') ? 'var(--primary)' : 'var(--card)',
                    color: (!selectedTopic && !selectedCommunity && viewMode === 'recent') ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: (!selectedTopic && !selectedCommunity && viewMode === 'recent') ? '600' : '500',
                    transition: 'all 0.2s ease',
                    boxShadow: (!selectedTopic && !selectedCommunity && viewMode === 'recent') ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!(!selectedTopic && !selectedCommunity && viewMode === 'recent')) {
                      e.target.style.background = 'var(--background)';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!selectedTopic && !selectedCommunity && viewMode === 'recent')) {
                      e.target.style.background = 'var(--card)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }
                  }}
                >
                  <span style={{ fontSize: 16 }}>📅</span>
                  Recent
                </button>
              </>
            )}
            

          </div>
        </div>

        {/* Topics */}
        <div style={{ padding: '0 24px', marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 16, color: 'var(--text)' }}>Topics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topics.map(topic => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: selectedTopic === topic.name ? 'none' : '1px solid var(--border)',
                  background: selectedTopic === topic.name ? 'var(--primary)' : 'var(--card)',
                  color: selectedTopic === topic.name ? 'white' : 'var(--text)',
                  cursor: 'pointer',
                  fontSize: 14,
                  textAlign: 'left',
                  fontWeight: selectedTopic === topic.name ? '600' : '500',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedTopic === topic.name ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  if (selectedTopic !== topic.name) {
                    e.target.style.background = 'var(--background)';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTopic !== topic.name) {
                    e.target.style.background = 'var(--card)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  }
                }}
              >
                <span style={{ fontSize: 16 }}>{topic.icon}</span>
                {topic.name}
              </button>
            ))}
          </div>
        </div>

        {/* Communities */}
        <div style={{ padding: '0 24px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 16, color: 'var(--text)' }}>Communities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {communities.slice(0, 5).map(renderCommunity)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: 280, flex: 1, padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, color: 'var(--text)' }}>
              {selectedCommunity ? 
                communities.find(c => c.id === selectedCommunity)?.name : 
                selectedTopic ? `${selectedTopic}` : 'Community'
              }
            </h1>
            {selectedCommunity ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <span style={{ fontSize: 20 }}>
                  {communities.find(c => c.id === selectedCommunity)?.icon}
                </span>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {communities.find(c => c.id === selectedCommunity)?.member_count} members
                </p>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {communities.find(c => c.id === selectedCommunity)?.description}
                </p>
              </div>
            ) : selectedTopic && (
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
                {topics.find(t => t.name === selectedTopic)?.description}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {user && (
              <>
                {selectedCommunity ? (
                  <>
                    {isMemberOfSelectedCommunity ? (
                      <button
                        onClick={() => setShowCreatePost(true)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 8,
                          border: 'none',
                          background: 'var(--primary)',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        Create Post
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinLeaveCommunity(selectedCommunity, false)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 8,
                          border: 'none',
                          background: 'var(--primary)',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        Join Community
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => setShowCreateCommunity(true)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--card)',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontSize: 14
                    }}
                  >
                    Create Community
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* View Mode Tabs - Only show on main community page */}
        {!selectedTopic && !selectedCommunity && (!user || viewMode === 'trending' || viewMode === 'recent' || viewMode === 'communities') && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {['trending', 'recent', 'communities'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: viewMode === mode ? 'var(--primary)' : 'transparent',
                  color: viewMode === mode ? 'white' : 'var(--text)',
                  cursor: 'pointer',
                  fontSize: 14,
                  textTransform: 'capitalize'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Loading...
          </div>
        ) : viewMode === 'trending' ? (
          <div>
            {trendingPosts.length > 0 ? (
              trendingPosts.map(renderPost)
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No trending posts yet. Be the first to create one!
              </div>
            )}
          </div>
        ) : viewMode === 'joined-communities' ? (
          <div>
            {communities.length > 0 ? (
              communities.map(renderCommunity)
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <div style={{ 
                  background: 'var(--card)', 
                  borderRadius: 12, 
                  padding: 24, 
                  border: '2px dashed var(--border)',
                  maxWidth: 400,
                  margin: '0 auto'
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
                  <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>No joined communities</h3>
                  <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)' }}>
                    Join some communities to see them here!
                  </p>
                  <button
                    onClick={() => setViewMode('communities')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 6,
                      border: 'none',
                      background: 'var(--primary)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 14
                    }}
                  >
                    Browse Communities
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : viewMode === 'my-posts' ? (
          <div>
            {posts.length > 0 ? (
              posts.map(renderPost)
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <div style={{ 
                  background: 'var(--card)', 
                  borderRadius: 12, 
                  padding: 24, 
                  border: '2px dashed var(--border)',
                  maxWidth: 400,
                  margin: '0 auto'
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
                  <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>No posts yet</h3>
                  <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)' }}>
                    Create your first post to see it here!
                  </p>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 6,
                      border: 'none',
                      background: 'var(--primary)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 14
                    }}
                  >
                    Create Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : viewMode === 'communities' ? (
          <div>
            {communities.length > 0 ? (
              communities.map(renderCommunity)
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <div style={{ 
                  background: 'var(--card)', 
                  borderRadius: 12, 
                  padding: 24, 
                  border: '2px dashed var(--border)',
                  maxWidth: 400,
                  margin: '0 auto'
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
                  <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>No communities found</h3>
                  <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)' }}>
                    Create the first community to get started!
                  </p>
                  <button
                    onClick={() => setShowCreateCommunity(true)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 6,
                      border: 'none',
                      background: 'var(--primary)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: 14
                    }}
                  >
                    Create Community
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : viewMode === 'recent' ? (
          <div>
            {posts.length > 0 ? (
              posts.map(renderPost)
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <div style={{ 
                  background: 'var(--card)', 
                  borderRadius: 12, 
                  padding: 24, 
                  border: '2px dashed var(--border)',
                  maxWidth: 400,
                  margin: '0 auto'
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>
                    {selectedCommunity ? '📝' : '🏠'}
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>
                    {selectedCommunity ? 'No posts yet' : 'No content yet'}
                  </h3>
                  <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)' }}>
                    {selectedCommunity ? 
                      'Be the first to create a post in this community!' : 
                      'Be the first to create a post!'
                    }
                  </p>
                  {selectedCommunity && user ? (
                    isMemberOfSelectedCommunity ? (
                      <button
                        onClick={() => setShowCreatePost(true)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 6,
                          border: 'none',
                          background: 'var(--primary)',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        Add the first post!
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinLeaveCommunity(selectedCommunity, false)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 6,
                          border: 'none',
                          background: 'var(--primary)',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: 14
                        }}
                      >
                        Join to post
                      </button>
                    )
                  ) : selectedCommunity ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                      Sign in to join and create posts
                    </p>
                  ) : (
                    <button
                      onClick={() => setShowCreatePost(true)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 6,
                        border: 'none',
                        background: 'var(--primary)',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: 14
                      }}
                    >
                      Add the first post!
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <div style={{ 
              background: 'var(--card)', 
              borderRadius: 12, 
              padding: 24, 
              border: '2px dashed var(--border)',
              maxWidth: 400,
              margin: '0 auto'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>No content yet</h3>
              <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)' }}>
                Use the navigation to browse different sections
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: 12,
            padding: 24,
            width: '90%',
            maxWidth: 500,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: 'var(--text)' }}>
              {selectedCommunity ? `Post in ${communities.find(c => c.id === selectedCommunity)?.name}` : 'Create Post'}
            </h2>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)' }}>Title</label>
              <input
                type="text"
                placeholder="What's your post about?"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)' }}>Content</label>
              <textarea
                placeholder="Share your thoughts..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={3}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Photo Upload */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)' }}>Photo (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setNewPost(prev => ({ ...prev, image: file }));
                }}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  boxSizing: 'border-box'
                }}
              />
              {newPost.image && (
                <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                  Selected: {newPost.image.name}
                </p>
              )}
            </div>

            {/* Topic Tags */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)' }}>Topics (optional)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      const isSelected = newPost.topics.includes(topic.name);
                      setNewPost(prev => ({
                        ...prev,
                        topics: isSelected 
                          ? prev.topics.filter(t => t !== topic.name)
                          : [...prev.topics, topic.name]
                      }));
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 16,
                      border: newPost.topics.includes(topic.name) ? 'none' : '1px solid var(--border)',
                      background: newPost.topics.includes(topic.name) ? topic.color : 'var(--card)',
                      color: newPost.topics.includes(topic.name) ? 'white' : 'var(--text)',
                      fontSize: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {topic.icon} {topic.name}
                  </button>
                ))}
              </div>
              {newPost.topics.length > 0 && (
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                  Selected: {newPost.topics.join(', ')}
                </p>
              )}
            </div>

            {/* Community Selector - Only show if not in a specific community */}
            {!selectedCommunity && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)' }}>Community</label>
                <select
                  value={newPost.community_id}
                  onChange={(e) => setNewPost(prev => ({ ...prev, community_id: e.target.value }))}
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--text)',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select a community</option>
                  {communities.filter(community => communityMemberships[community.id]).map(community => (
                    <option key={community.id} value={community.id}>
                      {community.icon} {community.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleCreatePost}
                disabled={!newPost.title.trim() || !newPost.content.trim() || (!selectedCommunity && !newPost.community_id)}
                style={{
                  padding: '12px 24px',
                  borderRadius: 6,
                  border: 'none',
                  background: (!newPost.title.trim() || !newPost.content.trim() || (!selectedCommunity && !newPost.community_id)) 
                    ? 'var(--border)' : 'var(--primary)',
                  color: 'white',
                  cursor: (!newPost.title.trim() || !newPost.content.trim() || (!selectedCommunity && !newPost.community_id)) 
                    ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                Create Post
              </button>
              <button
                onClick={() => {
                  setShowCreatePost(false);
                  setNewPost({ title: '', content: '', community_id: '', topics: [], image: null });
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Community Modal */}
      {showCreateCommunity && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: 12,
            padding: 24,
            width: '90%',
            maxWidth: 500,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: 'var(--text)' }}>Create Community</h2>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)' }}>Name</label>
              <input
                type="text"
                value={newCommunity.name}
                onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text)' }}>Description</label>
              <textarea
                value={newCommunity.description}
                onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleCreateCommunity}
                style={{
                  padding: '12px 24px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'var(--primary)',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Create Community
              </button>
              <button
                onClick={() => setShowCreateCommunity(false)}
                style={{
                  padding: '12px 24px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 