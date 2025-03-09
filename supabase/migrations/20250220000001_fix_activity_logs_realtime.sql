-- Fix for activity_logs table realtime publication
-- First check if the table is already in the publication
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'activity_logs'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    -- Only add the table if it's not already in the publication
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs';
  END IF;
END
$$;