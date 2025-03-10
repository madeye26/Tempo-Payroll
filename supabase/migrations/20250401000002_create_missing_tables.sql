-- Create employees table if it doesn't exist
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  monthly_incentives NUMERIC DEFAULT 0,
  position TEXT,
  department TEXT,
  base_salary NUMERIC NOT NULL,
  join_date DATE NOT NULL,
  status TEXT DEFAULT 'active'
);

-- Create salary_components table if it doesn't exist
CREATE TABLE IF NOT EXISTS salary_components (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  employee_id UUID REFERENCES employees(id),
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  bonus NUMERIC DEFAULT 0,
  allowances NUMERIC DEFAULT 0,
  deductions NUMERIC DEFAULT 0,
  purchases NUMERIC DEFAULT 0,
  loans NUMERIC DEFAULT 0,
  absences INTEGER DEFAULT 0,
  overtime_hours NUMERIC DEFAULT 0,
  penalty_days INTEGER DEFAULT 0,
  net_salary NUMERIC NOT NULL
);

-- Create advances table if it doesn't exist
CREATE TABLE IF NOT EXISTS advances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  employee_id UUID REFERENCES employees(id),
  amount NUMERIC NOT NULL,
  remaining_amount NUMERIC NOT NULL,
  request_date DATE NOT NULL,
  expected_repayment_date DATE NOT NULL,
  actual_repayment_date DATE,
  status TEXT DEFAULT 'pending',
  notes TEXT
);

-- Create attendance table if it doesn't exist
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  employee_id UUID REFERENCES employees(id),
  date DATE NOT NULL,
  status TEXT NOT NULL,
  check_in TIME,
  check_out TIME,
  notes TEXT
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Employees can be read by anyone" ON employees;
CREATE POLICY "Employees can be read by anyone" ON employees FOR SELECT USING (true);

DROP POLICY IF EXISTS "Employees can be modified by anyone" ON employees;
CREATE POLICY "Employees can be modified by anyone" ON employees USING (true);

DROP POLICY IF EXISTS "Salary components can be read by anyone" ON salary_components;
CREATE POLICY "Salary components can be read by anyone" ON salary_components FOR SELECT USING (true);

DROP POLICY IF EXISTS "Salary components can be modified by anyone" ON salary_components;
CREATE POLICY "Salary components can be modified by anyone" ON salary_components USING (true);

DROP POLICY IF EXISTS "Advances can be read by anyone" ON advances;
CREATE POLICY "Advances can be read by anyone" ON advances FOR SELECT USING (true);

DROP POLICY IF EXISTS "Advances can be modified by anyone" ON advances;
CREATE POLICY "Advances can be modified by anyone" ON advances USING (true);

DROP POLICY IF EXISTS "Attendance can be read by anyone" ON attendance;
CREATE POLICY "Attendance can be read by anyone" ON attendance FOR SELECT USING (true);

DROP POLICY IF EXISTS "Attendance can be modified by anyone" ON attendance;
CREATE POLICY "Attendance can be modified by anyone" ON attendance USING (true);

-- Enable realtime for all tables
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        -- Add tables to existing publication if not already members
        IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'employees') THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE employees;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'salary_components') THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE salary_components;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'advances') THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE advances;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'attendance') THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE attendance;
        END IF;
    ELSE
        -- Create publication if it doesn't exist
        CREATE PUBLICATION supabase_realtime FOR TABLE employees, salary_components, advances, attendance;
    END IF;
END
$$;