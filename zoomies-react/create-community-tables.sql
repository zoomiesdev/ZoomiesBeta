-- Create Community System Tables
-- Run this in your Supabase SQL editor

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT '🐾',
  color TEXT DEFAULT '#FFB3E6',
  banner_image TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT true,
  rules TEXT[] DEFAULT '{}',
  topics TEXT[] DEFAULT '{}'
);

-- Community members table
CREATE TABLE IF NOT EXISTS community_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  topics TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_pinned BOOLEAN DEFAULT false
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reactions table (for upvotes/downvotes)
CREATE TABLE IF NOT EXISTS reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  reaction_type TEXT CHECK (reaction_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id, comment_id)
);

-- Topics table for categorization
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '🐾',
  color TEXT DEFAULT '#FFB3E6',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default topics
INSERT INTO topics (name, icon, color, description) VALUES
  ('Animal Care', '🐾', '#FFB3E6', 'Tips and advice for taking care of animals'),
  ('Pet Pics', '📸', '#E6B6FF', 'Share adorable photos of your pets'),
  ('Sanctuary AMAs', '🏠', '#B6E6FF', 'Ask me anything with sanctuary owners'),
  ('Adoption Tips', '💝', '#FFE6B6', 'Advice for adopting and fostering'),
  ('Rescue Stories', '🆘', '#E6FFB6', 'Heartwarming rescue and rehabilitation stories'),
  ('Training Tips', '🎓', '#FFB6E6', 'Training and behavior advice'),
  ('Health & Wellness', '🏥', '#B6FFE6', 'Veterinary care and health discussions'),
  ('Behavior Issues', '🤔', '#E6B6FF', 'Help with behavioral problems');

-- Insert default communities
INSERT INTO communities (name, description, icon, color, topics) VALUES
  ('General Animal Care', 'General discussions about animal care and welfare', '🐾', '#FFB3E6', ARRAY['Animal Care', 'Health & Wellness']),
  ('Pet Photography', 'Share and discuss pet photos', '📸', '#E6B6FF', ARRAY['Pet Pics']),
  ('Sanctuary Life', 'Behind the scenes at animal sanctuaries', '🏠', '#B6E6FF', ARRAY['Sanctuary AMAs', 'Rescue Stories']),
  ('Adoption Support', 'Support for those adopting or fostering', '💝', '#FFE6B6', ARRAY['Adoption Tips', 'Behavior Issues']),
  ('Training Corner', 'Training tips and behavior advice', '🎓', '#FFB6E6', ARRAY['Training Tips', 'Behavior Issues']);

-- Enable RLS
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for communities
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'communities' AND policyname = 'Anyone can read communities') THEN
    CREATE POLICY "Anyone can read communities" ON communities FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'communities' AND policyname = 'Authenticated users can create communities') THEN
    CREATE POLICY "Authenticated users can create communities" ON communities FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'communities' AND policyname = 'Community creators can update communities') THEN
    CREATE POLICY "Community creators can update communities" ON communities FOR UPDATE USING (created_by = auth.uid());
  END IF;
END $$;

-- RLS Policies for community_members
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_members' AND policyname = 'Anyone can read community members') THEN
    CREATE POLICY "Anyone can read community members" ON community_members FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_members' AND policyname = 'Authenticated users can join communities') THEN
    CREATE POLICY "Authenticated users can join communities" ON community_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_members' AND policyname = 'Users can leave communities') THEN
    CREATE POLICY "Users can leave communities" ON community_members FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;

-- RLS Policies for community_posts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts' AND policyname = 'Anyone can read posts') THEN
    CREATE POLICY "Anyone can read posts" ON community_posts FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts' AND policyname = 'Community members can create posts') THEN
    CREATE POLICY "Community members can create posts" ON community_posts FOR INSERT WITH CHECK (
      auth.uid() IS NOT NULL AND
      EXISTS (
        SELECT 1 FROM community_members 
        WHERE community_id = community_posts.community_id 
        AND user_id = auth.uid()
      )
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts' AND policyname = 'Post authors can update posts') THEN
    CREATE POLICY "Post authors can update posts" ON community_posts FOR UPDATE USING (user_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts' AND policyname = 'Post authors can delete posts') THEN
    CREATE POLICY "Post authors can delete posts" ON community_posts FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;

-- RLS Policies for comments
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Anyone can read comments') THEN
    CREATE POLICY "Anyone can read comments" ON comments FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Authenticated users can create comments') THEN
    CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Comment authors can update comments') THEN
    CREATE POLICY "Comment authors can update comments" ON comments FOR UPDATE USING (user_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Comment authors can delete comments') THEN
    CREATE POLICY "Comment authors can delete comments" ON comments FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;

-- RLS Policies for reactions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reactions' AND policyname = 'Anyone can read reactions') THEN
    CREATE POLICY "Anyone can read reactions" ON reactions FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reactions' AND policyname = 'Authenticated users can create reactions') THEN
    CREATE POLICY "Authenticated users can create reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reactions' AND policyname = 'Users can update their reactions') THEN
    CREATE POLICY "Users can update their reactions" ON reactions FOR UPDATE USING (user_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reactions' AND policyname = 'Users can delete their reactions') THEN
    CREATE POLICY "Users can delete their reactions" ON reactions FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;

-- RLS Policies for topics
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'topics' AND policyname = 'Anyone can read topics') THEN
    CREATE POLICY "Anyone can read topics" ON topics FOR SELECT USING (true);
  END IF;
END $$;

-- Functions to update counts
CREATE OR REPLACE FUNCTION update_post_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.reaction_type = 'upvote' THEN
      UPDATE community_posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
    ELSIF NEW.reaction_type = 'downvote' THEN
      UPDATE community_posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.reaction_type = 'upvote' THEN
      UPDATE community_posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
    ELSIF OLD.reaction_type = 'downvote' THEN
      UPDATE community_posts SET downvotes = downvotes - 1 WHERE id = OLD.post_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Remove old reaction
    IF OLD.reaction_type = 'upvote' THEN
      UPDATE community_posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
    ELSIF OLD.reaction_type = 'downvote' THEN
      UPDATE community_posts SET downvotes = downvotes - 1 WHERE id = OLD.post_id;
    END IF;
    -- Add new reaction
    IF NEW.reaction_type = 'upvote' THEN
      UPDATE community_posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
    ELSIF NEW.reaction_type = 'downvote' THEN
      UPDATE community_posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_reaction_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_post_reaction_count();

-- Function to update comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comment_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comment_count();

-- Function to update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities SET member_count = member_count - 1 WHERE id = OLD.community_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_member_count_trigger
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_community_member_count(); 