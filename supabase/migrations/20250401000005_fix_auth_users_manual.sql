-- Create a function to insert users into auth.users
CREATE OR REPLACE FUNCTION create_auth_user(email TEXT, password TEXT, name TEXT, role TEXT)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Generate a new UUID
  new_user_id := gen_random_uuid();
  
  -- Insert into auth.users
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    email,
    crypt(password, gen_salt('bf')),
    now(),
    jsonb_build_object('name', name, 'role', role),
    now(),
    now()
  );
  
  -- Insert into public.users
  INSERT INTO public.users (
    id,
    email,
    name,
    role,
    created_at,
    is_active
  ) VALUES (
    new_user_id,
    email,
    name,
    role,
    now(),
    true
  );
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create initial admin user if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@example.com') THEN
    PERFORM create_auth_user('admin@example.com', 'password123', 'المدير', 'admin');
  END IF;
END
$$;