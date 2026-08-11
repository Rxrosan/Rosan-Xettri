// ===== RX-SUPABASE-ACCESS.js =====
// This file handles Supabase integration for user access control
// Load this file AFTER RX-RESOURCE.js

(function() {
    'use strict';

    // ===== SUPABASE CONFIGURATION =====
    const SUPABASE_URL = 'https://svwwbxbyutiieflxnoeb.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_OBPxBVADXRdtjYEC_ZFcEw_95NR5UXA';

    let supabaseClient = null;
    let autoRefreshInterval = null;

    // ===== INITIALIZE SUPABASE CLIENT =====
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

    // ===== FETCH USER ACCESS FROM SUPABASE =====
    async function fetchUserAccess(userId) {
        if (!supabaseClient) {
            console.warn('⚠️ Supabase client not available');
            return null;
        }

        try {
            console.log('🔄 Fetching access data for user:', userId);

            // Fetch BOTH access and timed_access_config columns
            const { data, error } = await supabaseClient
                .from('users')
                .select('access, timed_access_config') 
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

    // ===== PROCESS ACCESS DATA =====
    function processAccessData(data) {
        if (!data) {
            return { access: [], config: {} };
        }

        // 1. Get permanent access array
        let permanentAccess = [];
        if (data.access && Array.isArray(data.access)) {
            permanentAccess = data.access;
        }

        // 2. Get timed access config
        let timedConfig = {};
        let timedFiles = [];

        if (data.timed_access_config) {
            let configData = data.timed_access_config;
            
            // Parse if string
            if (typeof configData === 'string') {
                try {
                    configData = JSON.parse(configData);
                } catch (e) {
                    console.warn('⚠️ Failed to parse timed_access_config:', e);
                    configData = null;
                }
            }

            // Process array format: [{"file": "file2", "access_days": 7, "purchase_date": "2026-08-05"}]
            if (Array.isArray(configData)) {
                configData.forEach(item => {
                    if (item && item.file) {
                        timedFiles.push(item.file);
                        timedConfig[item.file] = {
                            purchase_date: item.purchase_date || new Date().toISOString().split('T')[0],
                            access_days: parseInt(item.access_days) || 30
                        };
                    }
                });
            } 
            // Process object format: {"file2": {"purchase_date": "2026-08-05", "access_days": 7}}
            else if (typeof configData === 'object' && configData !== null) {
                Object.keys(configData).forEach(fileId => {
                    const item = configData[fileId];
                    timedFiles.push(fileId);
                    timedConfig[fileId] = {
                        purchase_date: item.purchase_date || new Date().toISOString().split('T')[0],
                        access_days: parseInt(item.access_days) || 30
                    };
                });
            }
        }

        // 3. COMBINE: Merge permanent + timed access
        const allAccessFiles = [...new Set([...permanentAccess, ...timedFiles])];

        console.log('📁 Permanent access:', permanentAccess);
        console.log('⏰ Timed access files:', timedFiles);
        console.log('📋 Combined access:', allAccessFiles);
        console.log('⚙️ Timed config:', timedConfig);

        return { 
            access: allAccessFiles,
            config: timedConfig
        };
    }

    // ===== MAIN REFRESH FUNCTION =====
    async function refreshUserAccess() {
        const user = window.UserSession ? window.UserSession.getCurrentUser() : null;
        
        if (!user || user.isGuest || !user.id) {
            console.log('ℹ️ No logged-in user, skipping Supabase access fetch');
            return;
        }

        const userId = user.id;
        console.log('🔄 Refreshing access for user:', userId);

        const data = await fetchUserAccess(userId);
        
        if (data) {
            const processed = processAccessData(data);
            
            if (window.UserSession) {
                const currentUser = window.UserSession.getCurrentUser();
                const oldAccess = currentUser?.access || [];
                
                // Update UserSession with combined access and config
                window.UserSession.updateAccess(processed.access, processed.config);
                
                console.log('✅ User access updated successfully!');
                console.log(`📊 Total accessible files: ${processed.access.length}`);
                console.log(`⏰ Timed config for: ${Object.keys(processed.config).join(', ') || 'None'}`);
                
                // Show notification if access changed
                if (oldAccess.length !== processed.access.length) {
                    if (window.NotificationManager && typeof NotificationManager.showNotification === 'function') {
                        let message = `You have access to ${processed.access.length} file(s).`;
                        const timedCount = Object.keys(processed.config).length;
                        if (timedCount > 0) {
                            message += ` ${timedCount} file(s) have time-based access.`;
                        }
                        NotificationManager.showNotification(
                            'Access Updated',
                            message,
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

    // ===== START AUTO REFRESH =====
    function startAutoRefresh() {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
        }
        
        autoRefreshInterval = setInterval(async () => {
            console.log('⏰ Auto-refreshing user access...');
            await refreshUserAccess();
        }, 300000); // 5 minutes
    }

    // ===== STOP AUTO REFRESH =====
    function stopAutoRefresh() {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
            console.log('⏹️ Auto-refresh stopped');
        }
    }

    // ===== INITIALIZE =====
    async function init() {
        console.log('🚀 Initializing RX-SUPABASE-ACCESS...');

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

    // ===== EVENT LISTENERS =====
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

    // ===== EXPOSE GLOBALLY =====
    window.RXSupabaseAccess = {
        init: init,
        refreshUserAccess: refreshUserAccess,
        fetchUserAccess: fetchUserAccess,
        processAccessData: processAccessData,
        stopAutoRefresh: stopAutoRefresh,
        startAutoRefresh: startAutoRefresh
    };

    // ===== AUTO-INIT =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('✅ RX-RESOURCE-ACCESS.js loaded');
})();