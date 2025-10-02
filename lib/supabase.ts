import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Business = {
  id: string;
  user_id: string;
  name: string;
  website: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  business_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_published: boolean;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: 'free' | 'paid';
  status: string;
  created_at: string;
  updated_at: string;
};

export type Email = {
  id: string;
  user_id: string;
  business_id: string;
  recipient_email: string;
  status: 'sent' | 'pending' | 'failed';
  created_at: string;
};
