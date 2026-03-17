export type Kudo = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
  sender_avatar_url?: string;
  // New fields (Viết Kudo feature)
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
