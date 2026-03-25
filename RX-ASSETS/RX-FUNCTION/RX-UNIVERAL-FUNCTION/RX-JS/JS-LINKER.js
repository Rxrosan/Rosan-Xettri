// EXAM-JS-LINKER.js - FIXED (Loads Only Once)

(function() {
    // Prevent multiple executions
    if (window.__JS_LINKER_LOADED) {
        console.log('JS-LINKER already loaded, skipping...');
        return;
    }
    window.__JS_LINKER_LOADED = true;

    /**
     * ===================================================================
     *                        CONFIGURATION
     * ===================================================================
     */
    const contentMapping = {
        'file3': {
            path: 'RX-ASSETS/RX-OTHER-SOFTWARE-FUNCTION/RX-JS/RX-SMART-QR-GENATOR.js',
            type: 'js',
            title: 'QR SCANNER'
        },
        'file4': {
            path: 'RX-ASSETS/RX-OTHER-SOFTWARE-FUNCTION/RX-JS/RX-IMG-CONVERTER.js',
            type: 'js',
            title: 'TEXT TO IMAGE'
        },
        'file5': {
            path: 'RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-2-FILES/RX-KR-EXAM-QUESTIONS-MODEL-2/KR-EXAM-QM-1/QUESTION/KR-EXAM-QM-1.js',
            type: 'js',
            title: 'TEXT TO IMAGE'
        },
    };

    const LOCAL_STORAGE_CONTENT_KEY = 'activeContentId';
    const LOCAL_STORAGE_USER_KEY = 'currentUser';

    // Track if we've already loaded content
    let contentLoaded = false;
    let scriptLoadAttempts = {};

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
    //                        ACCESS DENIED PAGE
    // ===================================================================

    function showAccessDenied(user, fileId, contentTitle) {
        // Don't show if already showing
        if (document.getElementById('access-denied-container')) {
            return;
        }
        
        // Clear the page but keep essential elements
        document.body.innerHTML = '';
        document.body.style.cssText = `
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const container = document.createElement('div');
        container.id = 'access-denied-container';
        container.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 90%;
            text-align: center;
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
            </div>
        `;
        
        document.body.appendChild(container);
    }

    // ===================================================================
    //                        SCRIPT LOADER (One Time Only)
    // ===================================================================

    function loadScript(src, contentId) {
        return new Promise((resolve, reject) => {
            // Check if script already loaded
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                console.log(`Script already loaded: ${src}`);
                resolve();
                return;
            }
            
            // Check if we already tried to load this script
            if (scriptLoadAttempts[src]) {
                console.log(`Already attempted to load: ${src}`);
                reject(new Error('Script already attempted'));
                return;
            }
            
            scriptLoadAttempts[src] = true;
            
            console.log(`Loading script: ${src}`);
            
            const script = document.createElement('script');
            script.src = src;
            script.setAttribute('data-content-id', contentId);
            
            script.onload = () => {
                console.log(`✅ Script loaded: ${src}`);
                contentLoaded = true;
                resolve();
            };
            
            script.onerror = () => {
                console.error(`❌ Failed to load: ${src}`);
                delete scriptLoadAttempts[src]; // Allow retry on error
                reject(new Error(`Failed to load: ${src}`));
            };
            
            document.head.appendChild(script);
        });
    }

    // ===================================================================
    //                        MAIN LOADER (One Time Only)
    // ===================================================================

    async function main() {
        // Prevent multiple executions of main
        if (window.__JS_LINKER_MAIN_RUNNING) {
            console.log('Main already running, skipping...');
            return;
        }
        window.__JS_LINKER_MAIN_RUNNING = true;
        
        // Don't run if content already loaded
        if (contentLoaded) {
            console.log('Content already loaded, skipping...');
            return;
        }

        console.log('🔧 JS-LINKER starting...');
        
        // Get current user
        const currentUser = getCurrentUser();
        console.log('Current user:', currentUser ? currentUser.userName : 'Guest');
        
        // Get content ID
        const contentId = getQueryParameter('content') || getQueryParameter('exam');
        console.log('Content ID:', contentId);
        
        if (!contentId) {
            console.log('No content ID');
            window.__JS_LINKER_MAIN_RUNNING = false;
            return;
        }
        
        const contentConfig = contentMapping[contentId];
        if (!contentConfig) {
            showNotification('Error', `No configuration for: ${contentId}`, 'error');
            window.__JS_LINKER_MAIN_RUNNING = false;
            return;
        }
        
        // Check access
        if (!hasAccessToFile(currentUser, contentId)) {
            showAccessDenied(currentUser, contentId, contentConfig.title);
            window.__JS_LINKER_MAIN_RUNNING = false;
            return;
        }
        
        // Show welcome notification only once
        if (!window.__WELCOME_SHOWN) {
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
            window.__WELCOME_SHOWN = true;
        }
        
        // Show the main content (only once)
        if (!window.__CONTENT_SHOWN) {
            const mainContent = document.getElementById('mainContent');
            const loginScreen = document.getElementById('loginScreen');
            
            if (mainContent) {
                mainContent.style.display = 'block';
                console.log('Showing mainContent');
            }
            
            if (loginScreen) {
                loginScreen.style.display = 'none';
                console.log('Hiding loginScreen');
            }
            window.__CONTENT_SHOWN = true;
        }
        
        // Load the script (only once)
        try {
            await loadScript(contentConfig.path, contentId);
            console.log('✅ Content loaded successfully');
            
            // Trigger DOMContentLoaded only once
            if (!window.__DOM_EVENT_TRIGGERED) {
                setTimeout(() => {
                    const event = new Event('DOMContentLoaded');
                    document.dispatchEvent(event);
                    console.log('DOMContentLoaded event triggered');
                }, 100);
                window.__DOM_EVENT_TRIGGERED = true;
            }
            
        } catch (error) {
            console.error('Failed to load script:', error);
            if (!window.__ERROR_SHOWN) {
                showNotification('Error', 'Failed to load content. Please try again.', 'error');
                window.__ERROR_SHOWN = true;
            }
        }
        
        window.__JS_LINKER_MAIN_RUNNING = false;
    }

    // Start only once with proper event handling
    function initialize() {
        // Remove any existing event listeners
        document.removeEventListener('DOMContentLoaded', initialize);
        window.removeEventListener('load', initialize);
        
        // Run main
        main().catch(console.error);
    }

    // Clear any pending timeouts
    const existingTimeouts = window.__JS_LINKER_TIMEOUTS;
    if (existingTimeouts) {
        existingTimeouts.forEach(clearTimeout);
    }
    window.__JS_LINKER_TIMEOUTS = [];

    // Start when ready (only once)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        // Use setTimeout to ensure it runs after everything else
        const timeoutId = setTimeout(initialize, 100);
        window.__JS_LINKER_TIMEOUTS.push(timeoutId);
    }

})();