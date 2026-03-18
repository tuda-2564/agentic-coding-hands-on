-- ============================================================
-- Migration: Kudos Live Board feature schema
-- Created: 2026-03-17
-- Adds: kudo_likes, departments, secret_boxes tables,
--        heart_count trigger, RPC functions
-- ============================================================

-- ============================================================
-- 1. kudo_likes table
-- ============================================================
CREATE TABLE IF NOT EXISTS kudo_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kudo_id uuid NOT NULL REFERENCES kudos(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, kudo_id)
);

ALTER TABLE kudo_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kudo_likes_public_read"
  ON kudo_likes FOR SELECT
  USING (true);

CREATE POLICY "kudo_likes_auth_insert"
  ON kudo_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "kudo_likes_auth_delete"
  ON kudo_likes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_kudo_likes_kudo_id
  ON kudo_likes (kudo_id);

CREATE INDEX IF NOT EXISTS idx_kudo_likes_user_id
  ON kudo_likes (user_id);

-- ============================================================
-- 2. heart_count column + trigger on kudos
-- ============================================================
ALTER TABLE kudos
  ADD COLUMN IF NOT EXISTS heart_count integer DEFAULT 0;

-- Function to update heart_count on kudos when likes change
CREATE OR REPLACE FUNCTION update_heart_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE kudos SET heart_count = heart_count + 1 WHERE id = NEW.kudo_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE kudos SET heart_count = heart_count - 1 WHERE id = OLD.kudo_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_heart_count
  AFTER INSERT OR DELETE ON kudo_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_heart_count();

-- ============================================================
-- 3. departments table
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "departments_public_read"
  ON departments FOR SELECT
  USING (true);

-- ============================================================
-- 4. secret_boxes table
-- ============================================================
CREATE TABLE IF NOT EXISTS secret_boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opened boolean DEFAULT false,
  gift_description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE secret_boxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "secret_boxes_owner_read"
  ON secret_boxes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "secret_boxes_owner_update"
  ON secret_boxes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_secret_boxes_user_id
  ON secret_boxes (user_id);

-- ============================================================
-- 5. RPC: get_kudo_stats
-- ============================================================
CREATE OR REPLACE FUNCTION get_kudo_stats(p_user_id uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'kudos_received', (
      SELECT COUNT(*) FROM kudos WHERE p_user_id = ANY(recipient_ids)
    ),
    'kudos_sent', (
      SELECT COUNT(*) FROM kudos WHERE sender_id = p_user_id
    ),
    'hearts_received', (
      SELECT COALESCE(SUM(k.heart_count), 0)
      FROM kudos k
      WHERE p_user_id = ANY(k.recipient_ids)
    ),
    'secret_boxes_opened', (
      SELECT COUNT(*) FROM secret_boxes WHERE user_id = p_user_id AND opened = true
    ),
    'secret_boxes_unopened', (
      SELECT COUNT(*) FROM secret_boxes WHERE user_id = p_user_id AND opened = false
    )
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 6. RPC: get_spotlight_data
-- ============================================================
CREATE OR REPLACE FUNCTION get_spotlight_data()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total', (SELECT COUNT(*) FROM kudos),
    'entries', COALESCE((
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT
          up.id AS user_id,
          up.full_name,
          COUNT(*) AS kudos_count
        FROM kudos k, unnest(k.recipient_ids) AS rid
        JOIN user_profiles up ON up.id = rid
        GROUP BY up.id, up.full_name
        ORDER BY kudos_count DESC
        LIMIT 500
      ) t
    ), '[]'::json)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 7. Index for kudos ordering + pagination
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_kudos_created_at_desc
  ON kudos (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_kudos_heart_count_desc
  ON kudos (heart_count DESC);
