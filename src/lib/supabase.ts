import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 싱글톤 패턴으로 클라이언트를 한 번만 생성합니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);