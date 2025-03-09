-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'accountant', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on activity_logs table
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
CREATE POLICY "Admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update users" ON public.users;
CREATE POLICY "Admins can update users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
CREATE POLICY "Admins can delete users"
  ON public.users FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for activity_logs table
DROP POLICY IF EXISTS "Users can insert their own logs" ON public.activity_logs;
CREATE POLICY "Users can insert their own logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own logs" ON public.activity_logs;
CREATE POLICY "Users can view their own logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all logs" ON public.activity_logs;
CREATE POLICY "Admins can view all logs"
  ON public.activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enable realtime for these tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table activity_logs;
