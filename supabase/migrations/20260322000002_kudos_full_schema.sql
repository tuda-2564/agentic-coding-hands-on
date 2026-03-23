-- ============================================================
-- Migration: Full kudos schema (kudos + notifications + user_profiles)
-- Created: 2026-03-22
-- ============================================================

-- 1. kudos table
CREATE TABLE IF NOT EXISTS kudos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  receiver_name text,
  message text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  -- Extended columns for Viết Kudo
  recipient_ids uuid[] DEFAULT '{}',
  badge_id uuid REFERENCES badges(id),
  hashtags text[] DEFAULT '{}',
  image_urls text[] DEFAULT '{}'
);

ALTER TABLE kudos ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "kudos_read" ON kudos;
  DROP POLICY IF EXISTS "kudos_insert" ON kudos;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

CREATE POLICY "kudos_read"
  ON kudos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "kudos_insert"
  ON kudos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- 2. notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kudo_id uuid NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'mention',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "notifications_owner_read" ON notifications;
  DROP POLICY IF EXISTS "notifications_owner_update" ON notifications;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

CREATE POLICY "notifications_owner_read"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_owner_update"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON notifications (user_id, created_at DESC);

-- 3. user_profiles view (for search)
CREATE OR REPLACE VIEW user_profiles
  WITH (security_invoker = false)
AS
  SELECT
    id,
    email,
    raw_user_meta_data->>'full_name' AS full_name,
    raw_user_meta_data->>'avatar_url' AS avatar_url
  FROM auth.users;

GRANT SELECT ON user_profiles TO authenticated;
