-- Create activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR NOT NULL,
  action VARCHAR NOT NULL,
  description TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing activity logs
DROP POLICY IF EXISTS "Users can view activity logs" ON activity_logs;
CREATE POLICY "Users can view activity logs"
  ON activity_logs FOR SELECT
  USING (true);

-- Create policy for inserting activity logs
DROP POLICY IF EXISTS "Users can insert activity logs" ON activity_logs;
CREATE POLICY "Users can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (true);

-- Enable realtime for activity_logs table
ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
