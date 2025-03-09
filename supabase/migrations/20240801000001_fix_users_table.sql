-- Create users table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'accountant', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
CREATE POLICY "Users can view all users"
  ON public.users FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert users" ON public.users;
CREATE POLICY "Users can insert users"
  ON public.users FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update users" ON public.users;
CREATE POLICY "Users can update users"
  ON public.users FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Users can delete users" ON public.users;
CREATE POLICY "Users can delete users"
  ON public.users FOR DELETE
  USING (true);

-- Enable realtime
alter publication supabase_realtime add table public.users;
