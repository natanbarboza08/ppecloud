import { createClient } from '@supabase/supabase-js';
// 1. Puxa as variáveis do arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
import.meta.env.VITE_SUPABASE_ANON_KEY;
// 2. Cria a conexão mágica
export const supabase = createClient(supabaseUrl,
supabaseKey);
// 3. Exporta como Composable (Padrão Vue 3)
export function useSupabase() {
return { supabase };
}