-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create auth.users table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  encrypted_password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  raw_app_meta_data JSONB,
  raw_user_meta_data JSONB,
  is_super_admin BOOLEAN,
  role TEXT,
  email_confirmed_at TIMESTAMP WITH TIME ZONE,
  banned_until TIMESTAMP WITH TIME ZONE,
  confirmation_token TEXT,
  confirmation_sent_at TIMESTAMP WITH TIME ZONE,
  recovery_token TEXT,
  recovery_sent_at TIMESTAMP WITH TIME ZONE,
  email_change_token_new TEXT,
  email_change TEXT,
  email_change_sent_at TIMESTAMP WITH TIME ZONE,
  phone TEXT,
  phone_confirmed_at TIMESTAMP WITH TIME ZONE,
  phone_change TEXT,
  phone_change_token TEXT,
  phone_change_sent_at TIMESTAMP WITH TIME ZONE,
  invited_at TIMESTAMP WITH TIME ZONE,
  confirmation_token_expires_at TIMESTAMP WITH TIME ZONE,
  email_change_token_current TEXT,
  email_change_confirm_status SMALLINT,
  reauthentication_token TEXT,
  reauthentication_sent_at TIMESTAMP WITH TIME ZONE,
  is_sso_user BOOLEAN DEFAULT FALSE
);

-- Ensure public.users table exists and has proper foreign key
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  avatar TEXT,
  permissions JSONB
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DROP POLICY IF EXISTS "Users can be read by anyone" ON public.users;
CREATE POLICY "Users can be read by anyone" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can be modified by anyone" ON public.users;
CREATE POLICY "Users can be modified by anyone" ON public.users USING (true);

-- Enable realtime for users table
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
