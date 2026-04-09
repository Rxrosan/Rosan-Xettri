// RX-ACESS.js - ACCESS CONTROL ONLY (Works with existing login system and user.js)

(function() {
    // Prevent multiple executions
    if (window.__RXACESS_LOADED) {
        console.log('RXACESS already loaded, skipping...');
        return;
    }
    window.__RXACESS_LOADED = true;

    /**
     * ===================================================================
     *                        CONFIGURATION
     * ===================================================================
     */
    const contentMapping = {
        'file1': {
            title: 'LEKHAPADI',
            description: 'Access to LEKHAPADI content',
            requiresAccess: true
        },
        'file2': {
            title: 'EXAM QUESTIONS',
            description: 'Access to EXAM QUESTIONS content',
            requiresAccess: true
        },
        'file5': {
            title: 'EXAM QUESTIONS',
            description: 'You can practice exam with set question.',
            requiresAccess: true
        },
    };

    // PROTECT ALL ACCESS - This will block the page for any user without access
    const PROTECTED_PAGE = true;

    const LOCAL_STORAGE_USER_KEY = 'currentUser';

    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // ===================================================================
    //                        USER FUNCTIONS
    // ===================================================================

    function getCurrentUser() {
        try {
            // First try to use UserManager if available
            if (window.UserManager && typeof window.UserManager.getCurrentUser === 'function') {
                return window.UserManager.getCurrentUser();
            }
            
            // Fallback to direct localStorage access
            const userData = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (e) {
            console.error('Error getting user data:', e);
            return null;
        }
    }

    function getAccessReason(user, fileId) {
        if (!user) return "No user logged in";
        
        if (user.isGuest) {
            const guestConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
            if (guestConfig) {
                if (guestConfig.startDate && guestConfig.duration) {
                    const startDate = new Date(`${guestConfig.startDate}T00:00:00Z`);
                    const timedAccessEnd = startDate.getTime() + (guestConfig.duration * 24 * 60 * 60 * 1000);
                    if (timedAccessEnd <= Date.now()) {
                        return "Your guest access has expired";
                    }
                }
            }
            return "Guest accounts have limited access";
        }
        
        if (user.access && Array.isArray(user.access)) {
            if (!user.access.includes(fileId)) {
                return "This file is not in your access list";
            }
        }
        
        const fileConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
        if (fileConfig && fileConfig.startDate && fileConfig.duration) {
            const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`);
            const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000);
            if (timedAccessEnd <= Date.now()) {
                return "Your timed access has expired";
            }
        }
        
        return "You don't have permission to access this content";
    }

    function hasAccessToAnyFile(user) {
        if (!user) {
            console.log('No user found - no access');
            return false;
        }
        
        // If user is admin, they have access to everything
        if (user.accountType === "ADMIN" || user.accountType === "PARTNER") {
            console.log('Admin/Partner user - has access');
            return true;
        }
        
        // Check if user has access to file1 (LEKHAPADI) specifically
        // Since this is the LEKHAPADI page, we should check if they have access to file1
        if (hasAccessToFile(user, 'file1')) {
            console.log('User has access to LEKHAPADI');
            return true;
        }
        
        // Check all files as fallback
        for (const fileId in contentMapping) {
            if (hasAccessToFile(user, fileId)) {
                console.log(`User has access to ${fileId}`);
                return true;
            }
        }
        
        console.log('User has no access to any file');
        return false;
    }

    function hasAccessToFile(user, fileId) {
        if (!user) return false;
        
        // Admin and Partner have full access
        if (user.accountType === "ADMIN" || user.accountType === "PARTNER") {
            return true;
        }
        
        // Guest user check
        if (user.isGuest) {
            // Check if guest has timed access to this specific file
            const guestConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
            if (guestConfig && guestConfig.startDate && guestConfig.duration) {
                const startDate = new Date(`${guestConfig.startDate}T00:00:00Z`);
                const timedAccessEnd = startDate.getTime() + (guestConfig.duration * 24 * 60 * 60 * 1000);
                const hasAccess = timedAccessEnd > Date.now();
                console.log(`Guest access to ${fileId}: ${hasAccess ? 'Yes' : 'No (expired)'}`);
                return hasAccess;
            }
            console.log(`Guest has no access to ${fileId}`);
            return false;
        }
        
        // Check permanent access array
        if (user.access && Array.isArray(user.access)) {
            if (user.access.includes(fileId)) {
                console.log(`User has permanent access to ${fileId}`);
                return true;
            }
        }
        
        // Check timed access config
        const fileConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
        if (fileConfig && fileConfig.startDate && fileConfig.duration) {
            const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`);
            const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000);
            const hasAccess = timedAccessEnd > Date.now();
            console.log(`Timed access to ${fileId}: ${hasAccess ? 'Yes' : 'No (expired)'}`);
            return hasAccess;
        }
        
        console.log(`No access to ${fileId}`);
        return false;
    }

    // ===================================================================
    //                        NOTIFICATION SYSTEM
    // ===================================================================

    function showNotification(title, message, type = 'info') {
        // Try to use NotificationManager from user.js first
        if (window.NotificationManager && typeof window.NotificationManager.showNotification === 'function') {
            window.NotificationManager.showNotification(title, message, type, 5000);
            return;
        }
        
        // Fallback to custom notification
        const existing = document.getElementById('access-notification');
        if (existing) existing.remove();
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        const notification = document.createElement('div');
        notification.id = 'access-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: white;
            border-left: 5px solid ${colors[type] || colors.info};
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
            font-family: Arial, sans-serif;
        `;
        
        notification.innerHTML = `
            <strong style="color: ${colors[type] || colors.info}; display: block; margin-bottom: 5px; font-size: 16px;">
                ${title}
            </strong>
            <p style="margin: 0; color: #666; font-size: 14px;">${message}</p>
        `;
        
        // Add animation style if not exists
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ===================================================================
    //                        ACCESS DENIED OVERLAY - PERFECTLY CENTERED
    // ===================================================================

    function showAccessDenied(user, fileId, contentTitle, reason) {
        // Don't show if already showing
        if (document.getElementById('access-denied-overlay')) {
            return;
        }
        
        console.log('🔴 SHOWING ACCESS DENIED - BLOCKING PAGE');
        console.log('User:', user?.userName || 'Unknown');
        console.log('File:', fileId || 'Unknown');
        console.log('Reason:', reason);
        
        // IMMEDIATELY hide ALL content
        const allElements = document.body.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.style) {
                el.style.display = 'none';
            }
        });
        
        // Format user info
        const userName = user?.userName || 'Guest';
        const userType = user?.isGuest ? 'Guest' : (user?.accountType || 'User');
        const userEmail = user?.email || 'Not logged in';
        
        // Format file info
        const fileName = contentTitle || (fileId ? contentMapping[fileId]?.title : 'this page') || 'Unknown';
        const fileId_display = fileId || 'N/A';
        
        // Create overlay with PERFECT CENTERING and SMALLER FONTS
        const overlay = document.createElement('div');
        overlay.id = 'access-denied-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 999999;
            display: flex !important;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            margin: 0;
            padding: 16px;
            box-sizing: border-box;
            overflow-y: auto;
            pointer-events: auto;
        `;
        
        const container = document.createElement('div');
        container.style.cssText = `
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            padding: 24px;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            max-width: 440px;
            width: 100%;
            margin: auto;
            text-align: center;
            animation: fadeInScale 0.4s ease;
            border: 1px solid rgba(255,255,255,0.3);
            pointer-events: auto;
            display: block !important;
        `;
        
        container.innerHTML = `
            <div style="margin-bottom: 16px;">
                <div style="font-size: 15px; margin-bottom: 8px;">ACESS LOCKED</div>
                <h2 style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 20px; font-weight: 600; line-height: 1.3;">${contentTitle || 'Access Denied'}</h2>
                <div style="width: 40px; height: 2px; background: linear-gradient(90deg, #f44336, #ff9800); margin: 12px auto;"></div>
            </div>
            
            <div style="background: #f5f5f5; border-radius: 16px; padding: 16px; margin-bottom: 16px; text-align: left;">
                <h3 style="color: #333; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7;">Access Details</h3>
                
                <div style="margin-bottom: 8px; padding: 10px 12px; background: white; border-radius: 12px; border-left: 3px solid #667eea;">
                    <div style="display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px;">
                        <strong style="color: #667eea; font-size: 12px; min-width: 50px;">User:</strong>
                        <span style="color: #333; font-size: 13px; font-weight: 500;">${userName}</span>
                        <span style="color: #888; font-size: 11px; margin-left: 4px;">(${userType})</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 8px; padding: 10px 12px; background: white; border-radius: 12px; border-left: 3px solid #667eea;">
                    <div style="display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px;">
                        <strong style="color: #667eea; font-size: 12px; min-width: 50px;">Email:</strong>
                        <span style="color: #333; font-size: 13px; word-break: break-word; flex: 1;">${userEmail}</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 8px; padding: 10px 12px; background: white; border-radius: 12px; border-left: 3px solid #f44336;">
                    <div style="display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px;">
                        <strong style="color: #f44336; font-size: 12px; min-width: 50px;">File ID:</strong>
                        <span style="color: #333; font-size: 13px;">${fileId_display}</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 8px; padding: 10px 12px; background: white; border-radius: 12px; border-left: 3px solid #f44336;">
                    <div style="display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px;">
                        <strong style="color: #f44336; font-size: 12px; min-width: 50px;">File:</strong>
                        <span style="color: #333; font-size: 13px; word-break: break-word;">${fileName}</span>
                    </div>
                </div>
                
                <div style="padding: 10px 12px; background: #fff0f0; border-radius: 12px; border-left: 3px solid #f44336;">
                    <div style="display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px;">
                        <strong style="color: #f44336; font-size: 12px; min-width: 50px;">Reason:</strong>
                        <span style="color: #d32f2f; font-size: 13px; word-break: break-word; font-weight: 500;">${reason || 'Access permission required'}</span>
                    </div>
                </div>
            </div>
            
            <p style="color: #888; margin: 0 0 16px 0; font-size: 13px;">
                Redirecting to Resource page in <span id="countdown" style="font-weight: bold; color: #667eea; font-size: 15px; min-width: 24px; display: inline-block;">3</span>s
            </p>
            
            <button onclick="window.location.href='https://rosankc.com.np/Resource.html'" style="
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 40px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                width: 100%;
                max-width: 240px;
                margin: 0 auto;
                transition: all 0.2s ease;
                box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                display: block;
                letter-spacing: 0.3px;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(76, 175, 80, 0.4)';" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(76, 175, 80, 0.3)';">Go to Resource</button>
        `;
        
        // Add animation styles
        if (!document.getElementById('overlay-styles')) {
            const style = document.createElement('style');
            style.id = 'overlay-styles';
            style.textContent = `
                @keyframes fadeInScale {
                    0% { opacity: 0; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                #countdown { 
                    animation: pulse 1s infinite; 
                }
            `;
            document.head.appendChild(style);
        }
        
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        
        // Block all interactions
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'none';
        overlay.style.pointerEvents = 'auto';
        
        // Start countdown and redirect (3 seconds)
        let seconds = 1;
        const countdownElement = document.getElementById('countdown');
        
        const countdownInterval = setInterval(() => {
            seconds--;
            if (countdownElement) {
                countdownElement.textContent = seconds;
            }
            
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                window.location.href = 'https://rosankc.com.np/Resource.html';
            }
        }, 1000);
    }

    // ===================================================================
    //                        MAIN ACCESS CONTROL
    // ===================================================================

    function checkAccessAndNotify() {
        console.log('🔧 Access Control checking...');
        
        // Get current user
        const currentUser = getCurrentUser();
        console.log('Current user:', currentUser ? currentUser.userName : 'No user');
        console.log('User details:', currentUser);
        
        // Get content ID from URL
        const contentId = getQueryParameter('content') || getQueryParameter('exam');
        console.log('Content ID:', contentId);
        
        // CASE 1: No content ID in URL (just RX-LEKA-PADI.html)
        if (!contentId) {
            console.log('No content ID - checking if user can access LEKHAPADI page');
            
            // Check if user has access to file1 (LEKHAPADI)
            const hasAccessToLekhapadi = currentUser ? hasAccessToFile(currentUser, 'file1') : false;
            console.log('Has access to LEKHAPADI (file1):', hasAccessToLekhapadi);
            
            if (!hasAccessToLekhapadi) {
                console.log('❌ BLOCKING: User cannot access LEKHAPADI page');
                
                // Get reason for denial
                const reason = getAccessReason(currentUser, 'file1');
                
                showAccessDenied(
                    currentUser,
                    'file1',
                    'LEKHAPADI',
                    reason
                );
                return false;
            }
            
            console.log('✅ User has access to LEKHAPADI page');
            
            // Show the login screen but keep main content hidden
            const loginScreen = document.getElementById('loginScreen');
            const mainContent = document.getElementById('mainContent');
            
            if (loginScreen) {
                loginScreen.style.display = 'block';
            }
            if (mainContent) {
                mainContent.style.display = 'none';
            }
            
            return true;
        }
        
        // CASE 2: Content ID in URL
        const contentConfig = contentMapping[contentId];
        if (!contentConfig) {
            showNotification('Error', `No configuration for: ${contentId}`, 'error');
            return true;
        }
        
        // Check if user has access to this specific file
        const hasAccess = hasAccessToFile(currentUser, contentId);
        
        if (!hasAccess) {
            console.log('❌ Access denied for:', contentConfig.title);
            
            // Get reason for denial
            const reason = getAccessReason(currentUser, contentId);
            
            showAccessDenied(
                currentUser,
                contentId,
                contentConfig.title,
                reason
            );
            return false;
        }
        
        // Access granted - show welcome notification
        if (currentUser && !currentUser.isGuest) {
            showNotification(
                `Welcome ${currentUser.userName}!`,
                `You have access to ${contentConfig.title}`,
                'success'
            );
        } else if (currentUser && currentUser.isGuest) {
            showNotification(
                'Guest Access',
                'You are viewing content with guest access. Login for full access.',
                'info'
            );
        }
        
        console.log('✅ Access granted for:', contentConfig.title);
        return true;
    }

    // ===================================================================
    //                        IMMEDIATE INITIALIZATION
    // ===================================================================

    function initialize() {
        console.log('🚀 RX-ACESS initializing IMMEDIATELY...');
        
        // Run check immediately
        checkAccessAndNotify();
    }

    // Run as early as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Also run on load as backup
    window.addEventListener('load', function() {
        if (!document.getElementById('access-denied-overlay')) {
            checkAccessAndNotify();
        }
    });

    // Export function for manual access checking
    window.checkFileAccess = function(fileId) {
        const currentUser = getCurrentUser();
        return hasAccessToFile(currentUser, fileId);
    };

})();