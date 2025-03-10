-- Fix users table to ensure it works with auth
ALTER TABLE IF EXISTS public.users
  ALTER COLUMN id TYPE UUID USING id::uuid;

-- Make sure the users table has the correct foreign key reference
ALTER TABLE IF EXISTS public.users
  DROP CONSTRAINT IF EXISTS users_id_fkey,
  ADD CONSTRAINT users_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make sure the email column is unique
ALTER TABLE IF EXISTS public.users
  DROP CONSTRAINT IF EXISTS users_email_key,
  ADD CONSTRAINT users_email_key UNIQUE (email);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar') THEN
    ALTER TABLE public.users ADD COLUMN avatar TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'permissions') THEN
    ALTER TABLE public.users ADD COLUMN permissions TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_active') THEN
    ALTER TABLE public.users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'login_count') THEN
    ALTER TABLE public.users ADD COLUMN login_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_login') THEN
    ALTER TABLE public.users ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
    ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Enable realtime for users table
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
