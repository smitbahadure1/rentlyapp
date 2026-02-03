import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vnmzswpfwyxqkzdmoadt.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZsEtEV5WGM3Z88NH1MuyRA_PrpfszWE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    db: {
        schema: 'public'
    },
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
    global: {
        headers: {
            'x-client-info': 'rently-app'
        }
    }
});
