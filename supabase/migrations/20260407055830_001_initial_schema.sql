-- Custom types
CREATE TYPE public.post_status AS ENUM ('active', 'archived', 'deleted');
CREATE TYPE public.notification_type AS ENUM ('like', 'comment', 'follow');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE CHECK (username ~ '^[a-zA-Z0-9_]{3,30}$'),
  display_name TEXT NOT NULL CHECK (char_length(display_name) >= 1 AND char_length(display_name) <= 50),
  bio TEXT DEFAULT '' CHECK (char_length(bio) <= 500),
  avatar_url TEXT,
  cover_url TEXT,
  website TEXT,
  location TEXT,
  interests TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  image_url TEXT,
  status public.post_status DEFAULT 'active',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 1000),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Likes
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, post_id)
);

-- Follows
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (follower_id, following_id)
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL,
  reference_id UUID,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_likes_post_id ON public.likes(post_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, read);
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Profiles
CREATE POLICY profiles_select ON public.profiles FOR SELECT USING (true);
CREATE POLICY profiles_insert ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies: Posts
CREATE POLICY posts_select ON public.posts FOR SELECT USING (true);
CREATE POLICY posts_insert ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY posts_update ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY posts_delete ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies: Comments
CREATE POLICY comments_select ON public.comments FOR SELECT USING (true);
CREATE POLICY comments_insert ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY comments_delete ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies: Likes
CREATE POLICY likes_select ON public.likes FOR SELECT USING (true);
CREATE POLICY likes_insert ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY likes_delete ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies: Follows
CREATE POLICY follows_select ON public.follows FOR SELECT USING (true);
CREATE POLICY follows_insert ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY follows_delete ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies: Notifications
CREATE POLICY notifications_select ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_update ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY notifications_delete ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Functions: handle_updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Functions: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Novo Usuario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Functions: handle_like_count
CREATE OR REPLACE FUNCTION public.handle_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Functions: handle_comment_count
CREATE OR REPLACE FUNCTION public.handle_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Functions: create_like_notification
CREATE OR REPLACE FUNCTION public.create_like_notification()
RETURNS TRIGGER AS $$
DECLARE
  post_owner UUID;
BEGIN
  SELECT user_id INTO post_owner FROM public.posts WHERE id = NEW.post_id;
  IF post_owner IS NOT NULL AND post_owner != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, actor_id, type, reference_id)
    VALUES (post_owner, NEW.user_id, 'like', NEW.post_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Functions: create_comment_notification
CREATE OR REPLACE FUNCTION public.create_comment_notification()
RETURNS TRIGGER AS $$
DECLARE
  post_owner UUID;
BEGIN
  SELECT user_id INTO post_owner FROM public.posts WHERE id = NEW.post_id;
  IF post_owner IS NOT NULL AND post_owner != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, actor_id, type, reference_id)
    VALUES (post_owner, NEW.user_id, 'comment', NEW.post_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Functions: create_follow_notification
CREATE OR REPLACE FUNCTION public.create_follow_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, actor_id, type)
  VALUES (NEW.following_id, NEW.follower_id, 'follow');
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_count();

CREATE TRIGGER on_like_created
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.create_like_notification();

CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_count();

CREATE TRIGGER on_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.create_comment_notification();

CREATE TRIGGER on_follow_created
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.create_follow_notification();

-- Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 2097152, '{"image/jpeg","image/png","image/webp","image/gif"}'),
  ('covers', 'covers', true, 4194304, '{"image/jpeg","image/png","image/webp","image/gif"}'),
  ('posts', 'posts', true, 5242880, '{"image/jpeg","image/png","image/webp","image/gif"}')
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies: Avatars
CREATE POLICY avatars_select ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY avatars_insert ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = storage.foldername(name)[1]);
CREATE POLICY avatars_update ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = storage.foldername(name)[1]);
CREATE POLICY avatars_delete ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = storage.foldername(name)[1]);

-- Storage Policies: Covers
CREATE POLICY covers_select ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY covers_insert ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = storage.foldername(name)[1]);
CREATE POLICY covers_update ON storage.objects FOR UPDATE USING (bucket_id = 'covers' AND auth.uid()::text = storage.foldername(name)[1]);
CREATE POLICY covers_delete ON storage.objects FOR DELETE USING (bucket_id = 'covers' AND auth.uid()::text = storage.foldername(name)[1]);

-- Storage Policies: Posts
CREATE POLICY posts_storage_select ON storage.objects FOR SELECT USING (bucket_id = 'posts');
CREATE POLICY posts_storage_insert ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'posts' AND auth.uid()::text = storage.foldername(name)[1]);
CREATE POLICY posts_storage_delete ON storage.objects FOR DELETE USING (bucket_id = 'posts' AND auth.uid()::text = storage.foldername(name)[1]);
