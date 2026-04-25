export type SkinType = "oily" | "dry" | "combination" | "sensitive";
export type SkinTone = "fair" | "wheatish" | "medium" | "dusky" | "deep";
export type HairType = "straight" | "wavy" | "curly" | "coily";
export type StyleVibe = "casual" | "elegant" | "streetwear" | "ethnic" | "mix";
export type Budget = "under_500" | "500_2000" | "2000_5000" | "5000_plus";
export type AgeRange = "under_18" | "18_24" | "25_34" | "35_44" | "45_plus";
export type ClimateZone = "humid" | "dry" | "tropical" | "cold" | "moderate";

export interface BeautyProfile {
  id?: string;
  user_id: string;
  skin_type: SkinType | null;
  skin_tone: SkinTone | null;
  hair_type: HairType | null;
  style_vibe: StyleVibe | null;
  budget: Budget | null;
  age_range: AgeRange | null;
  climate_zone: ClimateZone | null;
  created_at?: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  image_url?: string | null;
  created_at: string;
}

export interface Feedback {
  id: string;
  message_id: string;
  user_id: string;
  type: "thumbs_up" | "thumbs_down";
  created_at: string;
}
