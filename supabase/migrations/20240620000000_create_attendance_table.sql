-- Create attendance table if it doesn't exist
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'leave', 'late')),
  notes TEXT,
  UNIQUE(employee_id, date)
);

-- Enable row level security
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create policy for full access
DROP POLICY IF EXISTS "Allow full access to attendance";
CREATE POLICY "Allow full access to attendance"
  ON attendance
  USING (true)
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE attendance;
