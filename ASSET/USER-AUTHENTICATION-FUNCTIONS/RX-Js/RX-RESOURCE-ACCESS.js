// ===== RX-SUPABASE-ACCESS.js =====
// This file handles Supabase integration for user access control
// Load this file AFTER RX-RESOURCE.js

(function() {
    'use strict';

    // ===== SUPABASE CONFIGURATION =====
    // REPLACE WITH YOUR ACTUAL SUPABASE CREDENTIALS
    const SUPABASE_URL = 'https://svwwbxbyutiieflxnoeb.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_OBPxBVADXRdtjYEC_ZFcEw_95NR5UXA';

    let supabaseClient = null;

    // Initialize Supabase client
    function initSupabase() {
        try {
            if (typeof supabase !== 'undefined' && supabase.createClient) {
                supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase client initialized successfully');
                return true;
            } else if (window.supabase) {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase client initialized successfully (window)');
                return true;
            } else {
                console.warn('⚠️ Supabase library not found. Please include the Supabase JS library.');
                return false;
            }
        } catch (error) {
            console.error('❌ Failed to initialize Supabase client:', error);
            return false;
        }
    }

    // Fetch user access from Supabase
    async function fetchUserAccess(userId) {
        if (!supabaseClient) {
            console.warn('⚠️ Supabase client not available');
            return null;
        }

        try {
            console.log('🔄 Fetching access data for user:', userId);

            const { data, error } = await supabaseClient
                .from('users')
                .select('timed_access_config') 
                .eq('id', userId)
                .single();

            if (error) {
                console.error('❌ Error fetching user access:', error);
                return null;
            }

            if (data) {
                console.log('✅ Access data fetched successfully:', data);
                return data;
            }

            return null;
        } catch (error) {
            console.error('❌ Error in fetchUserAccess:', error);
            return null;
        }
    }

    // Process access data with expiry check (UPDATED FOR ARRAY OF OBJECTS)
    function processAccessData(data) {
        // If null or undefined, return empty defaults
        if (!data || !data.timed_access_config) {
            return { access: [], config: {} };
        }

        let accessArray = [];     // Stores valid file names
        let fullConfig = {};      // Stores the original data for reference

        // Extract the raw config (it is now an Array because of your screenshot)
        const rawConfig = data.timed_access_config;

        // 1. Parse the JSON if it's a string, or use directly if it's already an object
        let parsedConfig = [];
        if (typeof rawConfig === 'string') {
            try {
                parsedConfig = JSON.parse(rawConfig);
            } catch (e) {
                console.warn('❌ Failed to parse timed_access_config JSON:', e);
                return { access: [], config: {} };
            }
        } else if (Array.isArray(rawConfig)) {
            parsedConfig = rawConfig;
        }

        // 2. Loop through the array and check expiration dates
        const currentDate = new Date();

        parsedConfig.forEach((item) => {
            // Add to full config for reference
            fullConfig[item.file] = item;

            // Check if the item has the required fields
            if (item.file && item.access_days) {
                
                // Set purchase date (default to today if missing)
                let purchaseDate = new Date();
                if (item.purchase_date) {
                    purchaseDate = new Date(item.purchase_date);
                }

                const accessDays = item.access_days || 0;
                const expiryDate = new Date(purchaseDate);
                expiryDate.setDate(expiryDate.getDate() + accessDays);

                // Check if the file access is still valid
                if (expiryDate > currentDate) {
                    accessArray.push(item.file);
                    console.log(`✅ Access VALID for "${item.file}" (Expires: ${expiryDate.toLocaleDateString()})`);
                } else {
                    console.log(`❌ Access EXPIRED for "${item.file}" (Expired: ${expiryDate.toLocaleDateString()})`);
                }
            } else {
                console.warn(`⚠️ Skipping invalid access item:`, item);
            }
        });

        return { access: accessArray, config: fullConfig };
    }

    // Main function to refresh user access
    async function refreshUserAccess() {
        const user = window.UserSession ? window.UserSession.getCurrentUser() : null;
        
        if (!user || user.isGuest || !user.id) {
            console.log('ℹ️ No logged-in user, skipping Supabase access fetch');
            return;
        }

        const userId = user.id;
        console.log('🔄 Refreshing access for user:', userId);

        // Fetch data from Supabase
        const data = await fetchUserAccess(userId);
        
        if (data) {
            // Process the data with expiry check
            const processed = processAccessData(data);
            
            // Update UserSession with new access data
            if (window.UserSession) {
                // Determine old access for comparison
                const currentUser = window.UserSession.getCurrentUser();
                const oldAccess = currentUser?.access || [];
                
                window.UserSession.updateAccess(processed.access, processed.config);
                console.log('✅ User access updated. Valid files:', processed.access);
                
                // Show notification if access was changed
                if (oldAccess.length !== processed.access.length) {
                    if (window.NotificationManager && typeof NotificationManager.showNotification === 'function') {
                        NotificationManager.showNotification(
                            'Access Updated',
                            `You have access to ${processed.access.length} file(s).`,
                            'info',
                            4000
                        );
                    }
                }
            }
        } else {
            console.log('ℹ️ No Supabase data found, using local access');
        }
    }

    // Auto-refresh access every 5 minutes (300,000 ms)
    function startAutoRefresh() {
        setInterval(async () => {
            console.log('⏰ Auto-refreshing user access...');
            await refreshUserAccess();
        }, 300000); // 5 minutes
    }

    // Initialize the Supabase access module
    async function init() {
        console.log('🚀 Initializing RX-SUPABASE-ACCESS...');

        // Initialize Supabase client
        const initialized = initSupabase();
        
        if (initialized) {
            // Wait a moment for UserSession to be ready
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Refresh access on load
            await refreshUserAccess();
            
            // Start auto-refresh
            startAutoRefresh();
            
            console.log('✅ RX-SUPABASE-ACCESS initialized successfully');
        } else {
            console.warn('⚠️ Supabase access module initialized without Supabase client');
        }
    }

    // Listen for login events to refresh access
    document.addEventListener('userLoggedIn', function() {
        console.log('🚀 User logged in, refreshing Supabase access...');
        setTimeout(refreshUserAccess, 1000);
    });

    document.addEventListener('userLoggedOut', function() {
        console.log('🚪 User logged out, clearing access...');
        if (window.UserSession) {
            window.UserSession.updateAccess([], {});
        }
    });

    // Expose functions globally
    window.RXSupabaseAccess = {
        init: init,
        refreshUserAccess: refreshUserAccess,
        fetchUserAccess: fetchUserAccess,
        processAccessData: processAccessData
    };

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('✅ RX-resource-ACCESS.js loaded');
})();
