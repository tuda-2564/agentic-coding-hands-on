-- ============================================================
-- Migration: campaigns + award_categories tables
-- Created: 2026-03-22
-- ============================================================

-- ============================================================
-- 1. campaigns table
-- ============================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  theme text NOT NULL DEFAULT '',
  event_date timestamptz NOT NULL,
  description text DEFAULT '',
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_public_read"
  ON campaigns FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- 2. award_categories table
-- ============================================================
CREATE TABLE IF NOT EXISTS award_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  badge_image_url text DEFAULT '',
  prize_value integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE award_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "award_categories_public_read"
  ON award_categories FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- 3. Seed SAA 2025 campaign (event date: 2026-03-29)
-- ============================================================
INSERT INTO campaigns (name, theme, event_date, description, is_active)
VALUES (
  'Sun* Annual Awards 2025',
  'ROOT FURTHER',
  '2026-03-29T00:00:00+07:00',
  'Sun* Annual Awards 2025 (SAA 2025) với chủ đề "ROOT FURTHER" là sự kiện thường niên vinh danh những cá nhân và tập thể xuất sắc nhất của Sun*. Đây là dịp để chúng ta cùng nhìn lại hành trình một năm nỗ lực, cống hiến và trưởng thành, đồng thời tôn vinh những giá trị cốt lõi đã định hình nên con người Sun*.',
  true
);

-- ============================================================
-- 4. Seed award categories
-- ============================================================
INSERT INTO award_categories (name, description, badge_image_url, prize_value, sort_order) VALUES
  ('Top Talent', 'Vinh danh những cá nhân xuất sắc toàn diện với năng lực chuyên môn vững vàng và hiệu suất vượt trội.', '/images/awards/top-talent.png', 7000000, 1),
  ('Top Project', 'Vinh danh các tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng.', '/images/awards/best-project.png', 15000000, 2),
  ('Top Project Leader', 'Vinh danh những nhà quản lý dự án xuất sắc với tư duy Aim High – Be Agile.', '/images/awards/culture-champion.png', 7000000, 3),
  ('Best Manager', 'Vinh danh những nhà lãnh đạo tiêu biểu dẫn dắt đội ngũ tạo ra kết quả vượt kỳ vọng.', '/images/awards/best-manager.png', 10000000, 4),
  ('Signature 2025 - Creator', 'Vinh danh cá nhân hoặc tập thể mang tư duy chủ động và tiên phong trong hành động.', '/images/awards/innovation.png', 5000000, 5),
  ('MVP', 'Vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun*.', '/images/awards/mvp.png', 15000000, 6);
