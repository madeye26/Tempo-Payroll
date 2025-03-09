-- Create activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id),
  type TEXT NOT NULL CHECK (type IN ('auth', 'employee', 'salary', 'advance', 'attendance', 'report', 'setting')),
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'view', 'login', 'logout', 'export')),
  description TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable row level security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view all activity logs" ON public.activity_logs;
CREATE POLICY "Users can view all activity logs"
  ON public.activity_logs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert activity logs" ON public.activity_logs;
CREATE POLICY "Users can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (true);

-- Enable realtime
alter publication supabase_realtime add table public.activity_logs;
