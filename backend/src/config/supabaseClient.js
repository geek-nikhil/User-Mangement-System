require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Using anon key for client-side like ops, but in backend we might need service role if bypassing RLS often.
// For this test, we assume standard usage or service role if needed for admin tasks.
// IMPORTANT: For a real backend admin, we should ideally use the SERVICE_ROLE_KEY.
// However, the instructions imply using the JS client generally. 
// We will use SUPABASE_URL and SUPABASE_KEY from env.

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
