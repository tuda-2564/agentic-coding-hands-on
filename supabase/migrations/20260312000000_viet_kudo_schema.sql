-- ============================================================
-- Migration: Viết Kudo feature schema
-- Created: 2026-03-12
-- ============================================================

-- ============================================================
-- 1. badges table
-- ============================================================
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon_url text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "badges_public_read"
  ON badges FOR SELECT
  USING (true);

-- ============================================================
-- 2. Extend kudos table with new columns
--    receiver_id / receiver_name are KEPT for KudosLiveBoard
--    backward compatibility (POST /api/kudos populates them
--    with recipient_ids[0])
-- ============================================================
ALTER TABLE kudos
  ADD COLUMN IF NOT EXISTS recipient_ids uuid[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS badge_id uuid REFERENCES badges(id),
  ADD COLUMN IF NOT EXISTS hashtags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';

-- ============================================================
-- 3. user_profiles view
--    SECURITY DEFINER so authenticated users can query
--    auth.users via this view (used by GET /api/users/search)
-- ============================================================
CREATE OR REPLACE VIEW user_profiles
  WITH (security_invoker = false)
AS
  SELECT
    id,
    email,
    raw_user_meta_data->>'full_name' AS full_name,
    raw_user_meta_data->>'avatar_url' AS avatar_url
  FROM auth.users;

-- Grant SELECT to authenticated role
GRANT SELECT ON user_profiles TO authenticated;

-- ============================================================
-- 4. notifications table
--    Stores @mention notifications created by POST /api/kudos
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kudo_id uuid NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'mention',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_owner_read"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_owner_update"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON notifications (user_id, created_at DESC);
