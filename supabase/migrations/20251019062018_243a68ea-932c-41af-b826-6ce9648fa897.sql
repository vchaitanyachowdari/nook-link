-- Remove public storage policies that create security gaps
-- Keep only authenticated policies for proper access control

-- Drop the problematic public SELECT policy
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Remove duplicate public policies for INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- The authenticated policies will remain:
-- - Users can view own avatars (SELECT)
-- - Users can upload own avatars (INSERT)
-- - Users can update own avatars (UPDATE)
-- - Users can delete own avatars (DELETE)