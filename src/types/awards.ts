export type AwardCategory = {
  id: string;
  name: string;
  description: string;
  badge_image_url: string;
  prize_value: number;
  sort_order: number;
  created_at: string;
};

export type PrizeTier = {
  label: string;
  value: string;
};

export type AwardDetailCategory = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
  unitType: string;
  prizeTiers: PrizeTier[];
};
