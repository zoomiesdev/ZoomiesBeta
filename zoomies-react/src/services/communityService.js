import { supabase } from '../lib/supabase';

export const communityService = {
  // Communities
  async getAllCommunities() {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('member_count', { ascending: false });
    return { data, error };
  },

  async getCommunityById(communityId) {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', communityId)
      .single();
    return { data, error };
  },

  async createCommunity(communityData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const community = {
      name: communityData.name,
      description: communityData.description,
      icon: communityData.icon || '🐾',
      color: communityData.color || '#FFB3E6',
      topics: communityData.topics || [],
      created_by: user.id
    };

    const { data, error } = await supabase
      .from('communities')
      .insert([community])
      .select()
      .single();

    if (!error && data) {
      // Auto-join the creator
      await this.joinCommunity(data.id);
    }

    return { data, error };
  },

  // Community Members
  async joinCommunity(communityId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    console.log('Joining community:', { communityId, userId: user.id });

    // First check if user is already a member
    const { data: existingMembers, error: checkError } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .limit(1);

    if (checkError) {
      console.log('Error checking membership:', checkError);
      return { data: null, error: checkError };
    }

    if (existingMembers && existingMembers.length > 0) {
      console.log('User already a member, returning existing membership');
      return { data: existingMembers[0], error: null };
    }

    console.log('User not a member, attempting to join...');
    const { data, error } = await supabase
      .from('community_members')
      .insert([{
        community_id: communityId,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      console.log('Join error:', error);
      // If it's a duplicate key error, try to get the existing membership
      if (error.code === '23505') {
        console.log('Duplicate key error, fetching existing membership...');
        const { data: retryData } = await supabase
          .from('community_members')
          .select('id')
          .eq('community_id', communityId)
          .eq('user_id', user.id)
          .limit(1);
        
        if (retryData && retryData.length > 0) {
          return { data: retryData[0], error: null };
        }
      }
    }

    console.log('Join result:', { data, error });
    return { data, error };
  },

  async leaveCommunity(communityId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // First check if user is a member
    const { data: existingMembers } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .limit(1);

    if (!existingMembers || existingMembers.length === 0) {
      return { error: null };
    }

    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', user.id);

    return { error };
  },

  async getCommunityMembers(communityId) {
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        *,
        users:user_id (id, username, profile_img)
      `)
      .eq('community_id', communityId);
    return { data, error };
  },

  async isMemberOfCommunity(communityId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: false };

    console.log('Checking membership:', { communityId, userId: user.id });

    // Use .limit(1) instead of .single() to avoid "no rows" error
    const { data, error } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .limit(1);

    const isMember = data && data.length > 0;
    console.log('Membership result:', { isMember, data, error });
    return { data: isMember, error };
  },

  async getUserJoinedCommunities() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: null };

    const { data, error } = await supabase
      .from('community_members')
      .select(`
        communities:community_id (
          id, name, description, icon, color, member_count, topics
        )
      `)
      .eq('user_id', user.id);

    return { 
      data: data?.map(item => item.communities).filter(Boolean) || [], 
      error 
    };
  },

  async getUserPosts() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: null };

    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        communities:community_id (name, icon, color),
        users:user_id (id, username, profile_img)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Posts
  async getPosts(communityId = null, limit = 20, offset = 0) {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        communities:community_id (name, icon, color),
        users:user_id (id, username, profile_img)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (communityId) {
      query = query.eq('community_id', communityId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async getPostById(postId) {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        communities:community_id (name, icon, color),
        users:user_id (id, username, profile_img)
      `)
      .eq('id', postId)
      .single();
    return { data, error };
  },

  async createPost(postData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const post = {
      community_id: postData.community_id,
      user_id: user.id,
      title: postData.title,
      content: postData.content,
      image_url: postData.image_url || null,
      topics: postData.topics || []
    };

    const { data, error } = await supabase
      .from('community_posts')
      .insert([post])
      .select()
      .single();

    return { data, error };
  },

  async updatePost(postId, updates) {
    const { data, error } = await supabase
      .from('community_posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    return { data, error };
  },

  async deletePost(postId) {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);

    return { error };
  },

  // Comments
  async getComments(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users:user_id (id, username, profile_img)
      `)
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    return { data, error };
  },

  async getReplies(commentId) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users:user_id (id, username, profile_img)
      `)
      .eq('parent_id', commentId)
      .order('created_at', { ascending: true });

    return { data, error };
  },

  async createComment(commentData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const comment = {
      post_id: commentData.post_id,
      user_id: user.id,
      parent_id: commentData.parent_id || null,
      content: commentData.content
    };

    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select()
      .single();

    return { data, error };
  },

  async updateComment(commentId, updates) {
    const { data, error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', commentId)
      .select()
      .single();

    return { data, error };
  },

  async deleteComment(commentId) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    return { error };
  },

  // Reactions
  async addReaction(reactionData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const reaction = {
      user_id: user.id,
      post_id: reactionData.post_id || null,
      comment_id: reactionData.comment_id || null,
      reaction_type: reactionData.reaction_type
    };

    const { data, error } = await supabase
      .from('reactions')
      .upsert([reaction], { onConflict: 'user_id,post_id,comment_id' })
      .select()
      .single();

    return { data, error };
  },

  async removeReaction(reactionData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', reactionData.post_id || null)
      .eq('comment_id', reactionData.comment_id || null);

    return { error };
  },

  async getUserReaction(postId, commentId = null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null };

    const { data, error } = await supabase
      .from('reactions')
      .select('reaction_type')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .eq('comment_id', commentId)
      .single();

    return { data, error };
  },

  // Topics
  async getAllTopics() {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('name');
    return { data, error };
  },

  async getCommunitiesByTopic(topicName) {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .contains('topics', [topicName]);
    return { data, error };
  },

  async getPostsByTopic(topicName) {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        communities:community_id (name, icon, color),
        users:user_id (id, username, profile_img)
      `)
      .contains('topics', [topicName])
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Trending
  async getTrendingPosts() {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        communities:community_id (name, icon, color),
        users:user_id (id, username, profile_img)
      `)
      .order('upvotes', { ascending: false })
      .limit(10);
    return { data, error };
  },

  // Search
  async searchCommunities(searchTerm) {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('member_count', { ascending: false });
    return { data, error };
  },

  async searchPosts(searchTerm) {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        communities:community_id (name, icon, color),
        users:user_id (id, username, profile_img)
      `)
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });
    return { data, error };
  }
}; 