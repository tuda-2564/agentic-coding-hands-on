-- ============================================================
-- Migration: Create badges table + seed data
-- Created: 2026-03-22
-- ============================================================

-- 1. Create badges table (if not exists from prior migration)
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon_url text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists to avoid error on re-run
DO $$ BEGIN
  DROP POLICY IF EXISTS "badges_public_read" ON badges;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

CREATE POLICY "badges_public_read"
  ON badges FOR SELECT
  USING (true);

-- 2. Seed badge data for Viết Kudo danh hiệu selector
INSERT INTO badges (name, icon_url, description) VALUES
  ('Dedicated', NULL, 'Tận tâm và cống hiến hết mình cho công việc'),
  ('Inspiring', NULL, 'Truyền cảm hứng cho đồng nghiệp xung quanh'),
  ('Teamwork', NULL, 'Tinh thần đồng đội và hợp tác xuất sắc'),
  ('Innovation', NULL, 'Sáng tạo và đổi mới trong công việc'),
  ('Leadership', NULL, 'Khả năng dẫn dắt và định hướng đội ngũ'),
  ('Problem Solver', NULL, 'Giải quyết vấn đề hiệu quả và nhanh chóng'),
  ('Mentor', NULL, 'Hướng dẫn và hỗ trợ đồng nghiệp phát triển'),
  ('Go-getter', NULL, 'Luôn chủ động và không ngại thử thách'),
  ('Quality Champion', NULL, 'Cam kết chất lượng cao trong mọi sản phẩm'),
  ('Culture Builder', NULL, 'Xây dựng và lan tỏa văn hóa tích cực')
ON CONFLICT DO NOTHING;
