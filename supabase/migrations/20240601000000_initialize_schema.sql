-- Create employees table
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  monthly_incentives NUMERIC DEFAULT 0,
  position TEXT,
  department TEXT,
  base_salary NUMERIC NOT NULL,
  join_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Create salary_components table
CREATE TABLE IF NOT EXISTS public.salary_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
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

-- Create advances table
CREATE TABLE IF NOT EXISTS public.advances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  remaining_amount NUMERIC NOT NULL,
  request_date DATE NOT NULL,
  expected_repayment_date DATE NOT NULL,
  actual_repayment_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'delayed')),
  notes TEXT
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'leave', 'late')),
  check_in TIME,
  check_out TIME,
  notes TEXT
);

-- Create leaves table
CREATE TABLE IF NOT EXISTS public.leaves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  type TEXT NOT NULL CHECK (type IN ('sick', 'annual', 'unpaid', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT
);

-- Create salary_formulas table
CREATE TABLE IF NOT EXISTS public.salary_formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  formula TEXT NOT NULL,
  variables JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false
);

-- Create performance_evaluations table
CREATE TABLE IF NOT EXISTS public.performance_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  evaluation_date DATE NOT NULL,
  criteria JSONB NOT NULL,
  overall_rating NUMERIC NOT NULL,
  overall_comments TEXT,
  evaluator TEXT
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_evaluations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.salary_components FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.advances FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.leaves FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.salary_formulas FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.performance_evaluations FOR SELECT USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.employees;
ALTER PUBLICATION supabase_realtime ADD TABLE public.salary_components;
ALTER PUBLICATION supabase_realtime ADD TABLE public.advances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaves;
ALTER PUBLICATION supabase_realtime ADD TABLE public.salary_formulas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.performance_evaluations;

-- Insert default salary formula
INSERT INTO public.salary_formulas (name, description, formula, variables, is_default)
VALUES (
  'الصيغة الأساسية',
  'صيغة حساب الراتب الأساسية مع مراعاة عدد أيام الشهر',
  'baseSalary + bonus + (overtimeHours * overtimeRate) - (absences * (monthlyIncentives > 0 ? dailyRateWithIncentives : dailyRate)) - deductions - advances - purchases',
  '{
    "baseSalary": "الراتب الأساسي",
    "bonus": "المكافآت",
    "overtimeHours": "ساعات الأوفرتايم",
    "overtimeRate": "معدل الساعة",
    "absences": "الغياب",
    "monthlyIncentives": "الحوافز الشهرية",
    "dailyRate": "قيمة اليوم",
    "dailyRateWithIncentives": "قيمة اليوم بالحوافز",
    "deductions": "الخصومات",
    "advances": "السلف",
    "purchases": "المشتريات"
  }',
  true
);
