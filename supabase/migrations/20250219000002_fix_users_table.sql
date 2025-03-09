-- First check if the users table exists and has the required columns
DO $$
DECLARE
  column_exists BOOLEAN;
BEGIN
  -- Check if password_hash column exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) INTO column_exists;

  -- If password_hash column doesn't exist, add it
  IF NOT column_exists THEN
    ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
  END IF;

  -- Check if last_login column exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'last_login'
  ) INTO column_exists;

  -- If last_login column doesn't exist, add it
  IF NOT column_exists THEN
    ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
  END IF;

  -- Check if login_count column exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'login_count'
  ) INTO column_exists;

  -- If login_count column doesn't exist, add it
  IF NOT column_exists THEN
    ALTER TABLE users ADD COLUMN login_count INTEGER DEFAULT 0;
  END IF;

  -- Check if is_active column exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_active'
  ) INTO column_exists;

  -- If is_active column doesn't exist, add it
  IF NOT column_exists THEN
    ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;

  -- Check if updated_at column exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'updated_at'
  ) INTO column_exists;

  -- If updated_at column doesn't exist, add it
  IF NOT column_exists THEN
    ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END
$$;

-- Create user permissions table for more granular access control if not exists
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, permission_name)
);

-- Create user sessions table for tracking active sessions if not exists
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

-- Create password reset tokens table if not exists
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Create user activity log table if not exists
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing users with password_hash if they don't have it
UPDATE users
SET password_hash = 'password123'
WHERE password_hash IS NULL;
