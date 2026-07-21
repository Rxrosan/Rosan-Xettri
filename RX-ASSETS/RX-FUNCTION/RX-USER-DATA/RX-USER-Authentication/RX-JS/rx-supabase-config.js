// rx-supabase-config.js

const SUPABASE_URL = "https://xorxoovezlgqcaeyqpdp.supabase.co"; // आफ्नो Project URL यहाँ राख्नुहोस्
const SUPABASE_ANON_KEY = "sb_publishable_5_yPXUnjJVe3dy13X5nkXQ_afJ7rCvM";

// Supabase Client initialize गर्ने
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase Client initialized successfully!");