// rx-supabase-config.js

const SUPABASE_URL = "https://svwwbxbyutiieflxnoeb.supabase.co"; // आफ्नो Project URL यहाँ राख्नुहोस्
const SUPABASE_ANON_KEY = "sb_publishable_OBPxBVADXRdtjYEC_ZFcEw_95NR5UXA";

// Supabase Client initialize गर्ने
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase Client initialized successfully!");