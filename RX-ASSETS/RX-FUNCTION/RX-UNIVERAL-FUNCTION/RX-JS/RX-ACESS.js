// RX-ACESS.js - ACCESS CONTROL ONLY (Works with existing login system)

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
            description: 'Access to LEKHAPADI content'
        },
        'file2': {
            title: 'EXAM QUESTIONS',
            description: 'Access to EXAM QUESTIONS content'
        },
    };

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
            const userData = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }

    function hasAccessToFile(user, fileId) {
        if (!user) return false;
        
        if (user.isGuest) {
            const guestConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
            if (guestConfig && guestConfig.startDate && guestConfig.duration) {
                const startDate = new Date(`${guestConfig.startDate}T00:00:00Z`);
                const timedAccessEnd = startDate.getTime() + (guestConfig.duration * 24 * 60 * 60 * 1000);
                return timedAccessEnd > Date.now();
            }
            return false;
        }
        
        if (user.access && Array.isArray(user.access) && user.access.includes(fileId)) {
            return true;
        }
        
        const fileConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
        if (fileConfig && fileConfig.startDate && fileConfig.duration) {
            const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`);
            const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000);
            return timedAccessEnd > Date.now();
        }
        
        return false;
    }

    // ===================================================================
    //                        NOTIFICATION SYSTEM
    // ===================================================================

    function showNotification(title, message, type = 'info') {
        // Remove existing notification
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
    //                        ACCESS DENIED OVERLAY
    // ===================================================================

    function showAccessDenied(user, fileId, contentTitle) {
        // Don't show if already showing
        if (document.getElementById('access-denied-overlay')) {
            return;
        }
        
        // Create overlay - DON'T clear the page
        const overlay = document.createElement('div');
        overlay.id = 'access-denied-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        const container = document.createElement('div');
        container.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 90%;
            text-align: center;
            animation: fadeIn 0.3s ease;
        `;
        
        let message = '';
        if (user && user.isGuest) {
            message = `
                <h2 style="color: #333; margin-bottom: 20px;">🔒 Guest Access Limited</h2>
                <p style="color: #666; margin-bottom: 15px; line-height: 1.6;">
                    You are currently logged in as <strong>Guest</strong>.
                </p>
                <p style="color: #666; margin-bottom: 25px; line-height: 1.6;">
                    This content (${contentTitle}) requires additional access rights.
                    Please login with an account that has access to this content.
                </p>
            `;
        } else {
            message = `
                <h2 style="color: #f44336; margin-bottom: 20px;">🚫 Access Denied</h2>
                <p style="color: #666; margin-bottom: 25px; line-height: 1.6;">
                    You don't have access to <strong>${contentTitle}</strong>.
                    Please purchase access or contact support.
                </p>
            `;
        }
        
        container.innerHTML = `
            ${message}
            <div style="margin-top: 30px;">
                <button onclick="window.location.href='https://rosankc.com.np'" style="
                    background: #2196F3;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    margin: 0 10px;
                ">Go to Home</button>
                <button onclick="window.location.href='https://rosankc.com.np/Resource.html'" style="
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    margin: 0 10px;
                ">Go to Resource</button>
                <button onclick="this.closest('#access-denied-overlay').remove()" style="
                    background: #f44336;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    margin: 10px 0 0 0;
                    width: 100%;
                ">Close</button>
            </div>
        `;
        
        // Add animation style if not exists
        if (!document.getElementById('overlay-styles')) {
            const style = document.createElement('style');
            style.id = 'overlay-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        
        // DON'T hide the login screen or main content
        // Let the existing system handle that
    }

    // ===================================================================
    //                        MAIN ACCESS CONTROL
    // ===================================================================

    function checkAccessAndNotify() {
        console.log('🔧 Access Control checking...');
        
        // Get current user
        const currentUser = getCurrentUser();
        console.log('Current user:', currentUser ? currentUser.userName : 'No user');
        
        // Get content ID from URL
        const contentId = getQueryParameter('content') || getQueryParameter('exam');
        console.log('Content ID:', contentId);
        
        // If no content ID, do nothing - let the existing system work
        if (!contentId) {
            console.log('No content ID found - using existing login system');
            return true;
        }
        
        const contentConfig = contentMapping[contentId];
        if (!contentConfig) {
            showNotification('Error', `No configuration for: ${contentId}`, 'error');
            return true;
        }
        
        // Check access
        if (!hasAccessToFile(currentUser, contentId)) {
            showAccessDenied(currentUser, contentId, contentConfig.title);
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
    //                        INITIALIZATION
    // ===================================================================

    function initialize() {
        console.log('RX-ACESS initializing...');
        
        // Wait for everything to load
        setTimeout(function() {
            // Check if we have the required elements
            const loginScreen = document.getElementById('loginScreen');
            const mainContent = document.getElementById('mainContent');
            
            if (!loginScreen || !mainContent) {
                console.error('Required elements not found!');
                return;
            }
            
            // Run access check
            checkAccessAndNotify();
        }, 1000); // 1 second delay to ensure everything is loaded
    }

    // Start when page is fully loaded
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }

    // Export function for manual access checking if needed
    window.checkFileAccess = function(fileId) {
        const currentUser = getCurrentUser();
        const contentConfig = contentMapping[fileId];
        
        if (!contentConfig) return false;
        return hasAccessToFile(currentUser, fileId);
    };

})();