
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

    // Fetch user access from Supabase (NOW FETCHING THE 'access' COLUMN)
    async function fetchUserAccess(userId) {
        if (!supabaseClient) {
            console.warn('⚠️ Supabase client not available');
            return null;
        }

        try {
            console.log('🔄 Fetching access data for user:', userId);

            // 🔥 FIXED: Fetching the correct 'access' column
            const { data, error } = await supabaseClient
                .from('users')
                .select('access') 
                .eq('id', userId)
                .single();

            if (error) {
                console.error('❌ Supabase error fetching user access:', error);
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

    // Process access data (SIMPLIFIED FOR THE SIMPLE STRING LIST)
    function processAccessData(data) {
        // If null or undefined, return empty defaults
        if (!data || !data.access || !Array.isArray(data.access)) {
            return { access: [], config: {} };
        }

        // Because we are using a simple string list, we just return it directly.
        // No expiry checks needed. This gives permanent, unlimited access.
        console.log('✅ Unlimited/Permanent access granted for files:', data.access);
        
        return { 
            access: data.access, 
            config: {} 
        };
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
            // Process the data (Now returns the array directly)
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
                            `You have unlimited access to ${processed.access.length} file(s).`,
                            'info',
                            4000
                        );
                    }
                }
            }
        } else {
            console.log('ℹ️ No Supabase access data found, keeping local access.');
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
