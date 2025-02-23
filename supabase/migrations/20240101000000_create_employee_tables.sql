-- Create employees table
create table public.employees (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text unique not null,
  position text not null,
  department text not null,
  base_salary numeric not null,
  join_date date not null,
  status text not null default 'active' check (status in ('active', 'inactive'))
);

-- Create salary_components table 
create table public.salary_components (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  employee_id uuid references public.employees(id) on delete cascade not null,
  month text not null check (month in ('January','February','March','April','May','June','July','August','September','October','November','December')),
  year integer not null,
  bonus numeric default 0,
  allowances numeric default 0,
  deductions numeric default 0,
  purchases numeric default 0,
  loans numeric default 0,
  net_salary numeric not null,
  unique(employee_id, month, year)
);

-- Add RLS policies
alter table public.employees enable row level security;
alter table public.salary_components enable row level security;

-- Allow authenticated users to read all records
create policy "Allow authenticated users to read employees"
  on public.employees
  for select
  to authenticated
  using (true);

create policy "Allow authenticated users to read salary components"
  on public.salary_components
  for select 
  to authenticated
  using (true);

-- Allow authenticated users to insert/update/delete
create policy "Allow authenticated users to modify employees"
  on public.employees
  for all
  to authenticated
  using (true);

create policy "Allow authenticated users to modify salary components"
  on public.salary_components
  for all
  to authenticated
  using (true);
