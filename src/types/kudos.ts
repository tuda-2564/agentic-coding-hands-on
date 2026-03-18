export type Kudo = {
  id: string;
  sender_id: string;
  receiver_id: string;
  /** @deprecated Use `content` instead */
  message: string;
  content?: string;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
  sender_avatar_url?: string;
  recipient_ids?: string[];
  badge_id?: string;
  hashtags?: string[];
  image_urls?: string[];
};

export type Badge = {
  id: string;
  name: string;
  icon_url: string | null;
  description: string | null;
};

export type Colleague = {
  id: string;
  full_name: string;
  avatar_url: string | null;
};

export type KudoSubmitPayload = {
  recipient_ids: string[];
  badge_id: string;
  content: string;
  hashtags: string[];
  image_urls: string[];
};

// --- Kudos Live Board types ---

export type KudoReceiver = {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  department?: string;
  star_count?: number;
  danh_hieu?: string;
};

export type KudoHighlight = Kudo & {
  heart_count: number;
  sender_full_name: string;
  sender_avatar_url: string | null;
  sender_department?: string;
  sender_star_count?: number;
  sender_danh_hieu?: string;
  receivers: KudoReceiver[];
  is_liked_by_me?: boolean;
};

export type KudoLike = {
  id: string;
  user_id: string;
  kudo_id: string;
  created_at: string;
};

export type KudoStats = {
  kudos_received: number;
  kudos_sent: number;
  hearts_received: number;
  secret_boxes_opened: number;
  secret_boxes_unopened: number;
};

export type SpotlightEntry = {
  user_id: string;
  full_name: string;
  kudos_count: number;
};

export type SunnerGift = {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  description: string;
};

export type SunnerRanking = {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  rank_change: string;
};

export type Department = {
  id: string;
  name: string;
};

export type HashtagItem = {
  name: string;
};
