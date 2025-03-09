-- Create improved users table with better auth support if not exists
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'accountant', 'viewer')),
  password_hash VARCHAR(255),
  last_login TIMESTAMP,
  login_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user permissions table for more granular access control
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, permission_name)
);

-- Create user sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Create user activity log table
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skip adding users table to realtime since it's already a member
-- ALTER PUBLICATION supabase_realtime ADD TABLE users;

-- Create default admin user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com') THEN
    INSERT INTO users (email, name, role, password_hash, created_at)
    VALUES ('admin@example.com', 'المدير', 'admin', 'password123', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'manager@example.com') THEN
    INSERT INTO users (email, name, role, password_hash, created_at)
    VALUES ('manager@example.com', 'مدير الموارد البشرية', 'manager', 'password123', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'accountant@example.com') THEN
    INSERT INTO users (email, name, role, password_hash, created_at)
    VALUES ('accountant@example.com', 'المحاسب', 'accountant', 'password123', NOW());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'viewer@example.com') THEN
    INSERT INTO users (email, name, role, password_hash, created_at)
    VALUES ('viewer@example.com', 'مستخدم عادي', 'viewer', 'password123', NOW());
  END IF;
END
$$;
