// RX-PROFILE-SYSTEM.js
// Fully isolated profile system

console.log('🛡️ RX Profile System - Isolated Version Initializing...');

// ============================================
// CONFIGURATION
// ============================================
const RX_STORAGE_KEY = 'rx_profile_system_v2';
let rxCurrentUser = null;
let rxProfileLink = null;

// Check if userDatabase exists
if (typeof userDatabase === 'undefined') {
    console.error('❌ ERROR: userDatabase is not defined!');
    console.error('Please make sure USER-DATABASE.js is loaded before PROFILE-SYSTEM.js');
    throw new Error('userDatabase not found. Load USER-DATABASE.js first.');
}

// ============================================
// STORAGE FUNCTIONS
// ============================================
function rxLoadUserFromStorage() {
    try {
        const saved = localStorage.getItem(RX_STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            const user = userDatabase.find(u => u.email === data.email);
            if (user && user.password === data.password) {
                rxCurrentUser = data.email;
                return true;
            }
        }
    } catch (e) {
        console.error('📦 Storage error:', e);
    }
    return false;
}

function rxSaveUserToStorage(email) {
    try {
        const user = userDatabase.find(u => u.email === email);
        if (user) {
            localStorage.setItem(RX_STORAGE_KEY, JSON.stringify({
                email: user.email,
                username: user.username,
                password: user.password
            }));
        }
    } catch (e) {
        console.error('📦 Storage error:', e);
    }
}

function rxClearUserFromStorage() {
    localStorage.removeItem(RX_STORAGE_KEY);
}

// ============================================
// FULLY ISOLATED STYLES (All RX- prefixed)
// ============================================
function rxInjectStyles() {
    if (document.getElementById('rx-isolated-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'rx-isolated-styles';
    style.innerHTML = `
        /* ========== RX ISOLATED OVERLAY ========== */
        .rx-overlay-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 999999;
        }
        
        /* ========== RX POPUP ========== */
        .rx-popup-container {
            background: #0f172a;
            border-radius: 12px;
            width: 800px;
            max-width: 95vw;
            max-height: 90vh;
            overflow: hidden;
            border: 1px solid #1e293b;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        .rx-popup-header {
            background: #1e293b;
            padding: 20px 30px;
            border-bottom: 1px solid #334155;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .rx-popup-title {
            color: #e2e8f0;
            font-size: 22px;
            font-weight: 600;
            margin: 0;
        }
        
        .rx-popup-close {
            background: #dc2626;
            border: none;
            color: white;
            width: 60px;
            height: 30px;
            border-radius: 8px;
            font-size: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .rx-popup-content {
            padding: 30px;
            overflow-y: auto;
            max-height: calc(90vh - 80px);
        }
        
        /* ========== RX PROFILE LAYOUT ========== */
        .rx-profile-container {
            display: flex;
            gap: 40px;
        }
        
        .rx-profile-sidebar {
            width: 180px;
            flex-shrink: 0;
            text-align: center;
        }
        
        .rx-profile-avatar {
            width: 150px;
            height: 150px;
            border-radius: 10px;
            object-fit: cover;
            border: 3px solid #1e40af;
            margin-bottom: 15px;
        }
        
        .rx-user-badge {
            background: #1e40af;
            color: white;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 10px;
        }
        
        .rx-nickname-display {
            color: #60a5fa;
            font-size: 20px;
            font-weight: 700;
            margin: 10px 0;
            padding: 5px;
            border-radius: 6px;
            background: rgba(96, 165, 250, 0.1);
        }
        
        .rx-account-badge {
            background: #7c3aed;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 10px;
            display: block;
        }
        
        .rx-profile-main {
            flex: 1;
        }
        
        .rx-section-heading {
            color: #e2e8f0;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #1e40af;
        }
        
        /* ========== RX DETAILS GRID ========== */
        .rx-details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .rx-detail-card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 12px 15px;
        }
        
        .rx-detail-label {
            color: #94a3b8;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        
        .rx-detail-value {
            color: #e2e8f0;
            font-size: 14px;
            font-weight: 500;
        }
        
        /* ========== RX MENU DISPLAY ========== */
        .rx-menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 15px;
            background: rgba(30, 64, 175, 0.1);
            border-radius: 8px;
            margin: 5px 0;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none !important;
            color: inherit !important;
        }
        
        .rx-menu-item:hover {
            background: rgba(30, 64, 175, 0.2);
            transform: translateX(5px);
        }
        
        .rx-menu-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #1e40af;
        }
        
        .rx-menu-info {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        
        .rx-menu-nickname {
            color: #60a5fa;
            font-size: 14px;
            font-weight: 600;
        }
        
        .rx-menu-text {
            color: #94a3b8;
            font-size: 11px;
            font-weight: 500;
        }
        
        /* ========== RX BUTTONS ========== */
        .rx-btn-logout {
            background: #dc2626;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .rx-btn-login {
            background: #1e40af;
            color: white;
            border: none;
            padding: 14px 35px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin: 0 auto;
        }
        
        /* ========== RX LOGIN FORM ========== */
        .rx-login-box {
            background: #1e293b;
            padding: 30px;
            border-radius: 10px;
            margin-top: 20px;
            display: none;
        }
        
        .rx-form-row {
            margin-bottom: 20px;
        }
        
        .rx-form-label {
            color: #e2e8f0;
            font-size: 14px;
            margin-bottom: 8px;
            display: block;
        }
        
        .rx-form-input {
            width: 100%;
            background: #0f172a;
            border: 1px solid #334155;
            color: #e2e8f0;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 14px;
        }
        
        .rx-form-input:focus {
            outline: none;
            border-color: #1e40af;
        }
        
        .rx-form-actions {
            display: flex;
            gap: 15px;
            margin-top: 25px;
        }
        
        .rx-btn-submit {
            background: #059669;
            color: white;
            border: none;
            padding: 14px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            flex: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .rx-btn-cancel {
            background: #475569;
            color: white;
            border: none;
            padding: 14px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .rx-error-message {
            color: #dc2626;
            background: rgba(220, 38, 38, 0.1);
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            margin: 15px 0;
            display: none;
        }
        
        /* ========== RX FLOATING BUTTON ========== */
        .rx-floating-btn {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background: #1e40af !important;
            color: white !important;
            border: none !important;
            padding: 12px 24px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            z-index: 999998 !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            transition: all 0.3s !important;
            font-family: system-ui, -apple-system, sans-serif !important;
        }
        
        .rx-floating-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(0,0,0,0.4) !important;
        }
        
        /* ========== RX RESPONSIVE ========== */
        @media (max-width: 768px) {
            .rx-profile-container {
                flex-direction: column;
            }
            
            .rx-profile-sidebar {
                width: 100%;
                text-align: center;
            }
            
            .rx-details-grid {
                grid-template-columns: 1fr;
            }
            
            .rx-form-actions {
                flex-direction: column;
            }
            
            .rx-popup-container {
                margin: 10px;
            }
        }
        
        /* ========== RX UTILITIES ========== */
        .rx-text-center {
            text-align: center;
        }
        
        .rx-mt-20 {
            margin-top: 20px;
        }
        
        .rx-mb-30 {
            margin-bottom: 30px;
        }
        
        .rx-hidden {
            display: none !important;
        }
        
        .rx-visible {
            display: block !important;
        }
    `;
    
    document.head.appendChild(style);
    console.log('🎨 RX Styles injected (fully isolated)');
}

// ============================================
// MENU DISPLAY FUNCTIONS
// ============================================
function rxUpdateMenuDisplay() {
    console.log('🔄 Updating RX menu display...');
    
    if (!rxProfileLink) {
        console.log('⚠️ RX Profile link not found');
        return;
    }
    
    const panelItem = rxProfileLink.closest('.panel-item');
    if (!panelItem) {
        console.log('⚠️ Panel item not found');
        return;
    }
    
    // Clear existing content
    panelItem.innerHTML = '';
    
    if (rxCurrentUser) {
        const user = userDatabase.find(u => u.email === rxCurrentUser);
        if (user) {
            const nickname = user.nickname || user.username.split(' ')[0];
            
            panelItem.innerHTML = `
                <a href="#" class="panel-link rx-menu-item" id="rx-menu-link">
                    <img src="${user.profileImage}" 
                         class="rx-menu-avatar" 
                         alt="${user.username}"
                         onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=1e40af&color=fff&size=32'">
                    <div class="rx-menu-info">
                        <span class="rx-menu-nickname">${nickname}</span>
                        <span class="rx-menu-text">View Profile</span>
                    </div>
                </a>
            `;
            
            // Add click event
            const newLink = panelItem.querySelector('#rx-menu-link');
            newLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                rxOpenPopup();
                return false;
            });
            
            console.log('✅ Menu updated with user:', nickname);
        }
    } else {
        // Show default "MY PROFILE" text
        panelItem.innerHTML = `
            <a href="#" class="panel-link" id="rx-default-link">
                MY PROFILE
            </a>
        `;
        
        // Re-attach event listener
        const newLink = panelItem.querySelector('#rx-default-link');
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            rxOpenPopup();
            return false;
        });
        
        // Add RX styling to default link
        newLink.style.cssText = `
            cursor: pointer;
            transition: opacity 0.2s;
            text-decoration: none;
            display: block;
            padding: 8px 15px;
        `;
        
        newLink.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
        });
        
        newLink.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
        
        console.log('✅ Menu reset to default');
    }
}

// ============================================
// POPUP FUNCTIONS
// ============================================
function rxCreatePopup() {
    if (document.getElementById('rx-isolated-overlay')) {
        console.log('ℹ️ RX Popup already exists');
        return;
    }
    
    console.log('🛠️ Creating RX popup...');
    
    const overlay = document.createElement('div');
    overlay.id = 'rx-isolated-overlay';
    overlay.className = 'rx-overlay-container';
    
    overlay.innerHTML = `
        <div class="rx-popup-container">
            <div class="rx-popup-header">
                <h2 class="rx-popup-title">MY PROFILE</h2>
                <button class="rx-popup-close" id="rx-close-btn">CLOSE</button>
            </div>
            <div class="rx-popup-content" id="rx-content-area">
                Loading...
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    console.log('✅ RX Popup created');
    
    // Add close functionality
    const closeBtn = overlay.querySelector('#rx-close-btn');
    closeBtn.addEventListener('click', rxClosePopup);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            rxClosePopup();
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            rxClosePopup();
        }
    });
}

function rxOpenPopup() {
    console.log('🚀 Opening RX popup...');
    const overlay = document.getElementById('rx-isolated-overlay');
    
    if (!overlay) {
        console.error('❌ RX Popup not found!');
        return;
    }
    
    overlay.style.display = 'flex';
    rxShowProfileContent();
    console.log('✅ RX Popup opened');
}

function rxClosePopup() {
    console.log('🔒 Closing RX popup...');
    const overlay = document.getElementById('rx-isolated-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// ============================================
// PROFILE CONTENT
// ============================================
function rxShowProfileContent() {
    console.log('📄 Showing RX profile content...');
    const content = document.getElementById('rx-content-area');
    
    if (!content) {
        console.error('❌ RX Content element not found!');
        return;
    }
    
    if (rxCurrentUser) {
        const user = userDatabase.find(u => u.email === rxCurrentUser);
        if (user) {
            const nickname = user.nickname || user.username.split(' ')[0];
            
            content.innerHTML = `
                <div class="rx-profile-container">
                    <div class="rx-profile-sidebar">
                        <img src="${user.profileImage}" 
                             class="rx-profile-avatar" 
                             alt="${user.username}"
                             onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=1e40af&color=fff&size=150'">
                        <div class="rx-user-badge">ID: ${user.id}</div>
                        <div class="rx-nickname-display">${nickname}</div>
                        <div class="rx-account-badge">${user.accountType}</div>
                    </div>
                    
                    <div class="rx-profile-main">
                        <div class="rx-section-heading">Personal Information</div>
                        <div class="rx-details-grid">
                            <div class="rx-detail-card">
                                <div class="rx-detail-label">Full Name</div>
                                <div class="rx-detail-value">${user.username}</div>
                            </div>
                            <div class="rx-detail-card">
                                <div class="rx-detail-label">Nickname</div>
                                <div class="rx-detail-value" style="color: #60a5fa; font-weight: 700;">${nickname}</div>
                            </div>
                            <div class="rx-detail-card">
                                <div class="rx-detail-label">Email</div>
                                <div class="rx-detail-value">${user.email}</div>
                            </div>
                            <div class="rx-detail-card">
                                <div class="rx-detail-label">Phone</div>
                                <div class="rx-detail-value">${user.phone}</div>
                            </div>
                            <div class="rx-detail-card">
                                <div class="rx-detail-label">Date of Birth</div>
                                <div class="rx-detail-value">${user.dateOfBirth}</div>
                            </div>
                        </div>
                        
                        <div class="rx-section-heading">Address Information</div>
                        <div class="rx-detail-card rx-mb-30">
                            <div class="rx-detail-label">Full Address</div>
                            <div class="rx-detail-value">${user.address}</div>
                        </div>
                        
                        <div class="rx-section-heading">Account Information</div>
                        <div class="rx-details-grid">
                            <div class="rx-detail-card">
                                <div class="rx-detail-label">Account Type</div>
                                <div class="rx-detail-value">${user.accountType}</div>
                            </div>
                            <div class="rx-detail-card">
                                <div class="rx-detail-label">Status</div>
                                <div class="rx-detail-value" style="color: #10b981;">
                                    <span style="display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 8px;"></span>
                                    Active
                                </div>
                            </div>
                        </div>
                        
                        <button class="rx-btn-logout" id="rx-logout-action">
                            🚪 Logout
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('rx-logout-action').addEventListener('click', function() {
                rxCurrentUser = null;
                rxClearUserFromStorage();
                rxUpdateMenuDisplay();
                rxShowProfileContent();
                console.log('👋 User logged out');
            });
        }
    } else {
        content.innerHTML = `
            <div class="rx-text-center" style="padding: 40px 20px;" id="rx-login-prompt">
                <h3 style="color: #dc2626; margin-bottom: 20px;">Login Required</h3>
                <p style="color: #94a3b8; margin-bottom: 30px;">Please login to view your profile details.</p>
                <p style="color: #94a3b8; margin-bottom: 30px;">If you haven't created an account please contact us through the given contact option on website.</p>
                <button class="rx-btn-login" id="rx-show-login-form">
                    🔐 Login Now
                </button>
            </div>
            
            <div class="rx-login-box" id="rx-login-container">
                <h3 style="color: #e2e8f0; text-align: center; margin-bottom: 25px;">
                    👤 Account Login
                </h3>
                <form id="rx-login-form">
                    <div class="rx-form-row">
                        <label class="rx-form-label">
                            👤 Username
                        </label>
                        <input type="text" class="rx-form-input" id="rx-input-username" required placeholder="Enter username">
                    </div>
                    <div class="rx-form-row">
                        <label class="rx-form-label">
                            ✉️ Email Address
                        </label>
                        <input type="email" class="rx-form-input" id="rx-input-email" required placeholder="Enter email">
                    </div>
                    <div class="rx-form-row">
                        <label class="rx-form-label">
                            🔒 Password
                        </label>
                        <input type="password" class="rx-form-input" id="rx-input-password" required placeholder="Enter password">
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 10px; margin: 20px 0;">
                        <input type="checkbox" id="rx-check-remember" checked>
                        <label for="rx-check-remember" style="color: #94a3b8; font-size: 14px;">
                            💾 Remember me
                        </label>
                    </div>
                    
                    <div class="rx-error-message" id="rx-error-display">Invalid credentials!</div>
                    
                    <div class="rx-form-actions">
                        <button type="submit" class="rx-btn-submit" id="rx-btn-submit">
                            ✅ Login
                        </button>
                        <button type="button" class="rx-btn-cancel" id="rx-btn-cancel">
                            ❌ Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Setup login form
        const loginContainer = document.getElementById('rx-login-container');
        const showLoginBtn = document.getElementById('rx-show-login-form');
        const cancelBtn = document.getElementById('rx-btn-cancel');
        const loginForm = document.getElementById('rx-login-form');
        const errorDisplay = document.getElementById('rx-error-display');
        const loginPrompt = document.getElementById('rx-login-prompt');
        
        showLoginBtn.addEventListener('click', function() {
            loginContainer.style.display = 'block';
            showLoginBtn.style.display = 'none';
            loginPrompt.style.display = 'none';
        });
        
        cancelBtn.addEventListener('click', function() {
            loginContainer.style.display = 'none';
            showLoginBtn.style.display = 'flex';
            loginPrompt.style.display = 'block';
            errorDisplay.style.display = 'none';
            loginForm.reset();
        });
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('rx-input-username').value.trim();
            const email = document.getElementById('rx-input-email').value.trim();
            const password = document.getElementById('rx-input-password').value.trim();
            const remember = document.getElementById('rx-check-remember').checked;
            
            const user = userDatabase.find(u => u.email === email);
            
            if (user && user.username === username && user.password === password) {
                rxCurrentUser = email;
                if (remember) {
                    rxSaveUserToStorage(email);
                }
                rxUpdateMenuDisplay();
                rxShowProfileContent();
                errorDisplay.style.display = 'none';
                
                // Show welcome message
                setTimeout(() => {
                    const nickname = user.nickname || user.username.split(' ')[0];
                    alert(`🎉 Welcome back, ${nickname}!`);
                }, 100);
            } else {
                errorDisplay.style.display = 'block';
            }
        });
    }
}

// ============================================
// FIND PROFILE LINK
// ============================================
function rxFindProfileLink() {
    console.log('🔍 Looking for MY PROFILE link...');
    
    let foundLink = null;
    
    // Look for "MY PROFILE" text
    const elements = document.querySelectorAll('*');
    for (let element of elements) {
        if (element.textContent && element.textContent.trim() === 'MY PROFILE') {
            console.log('✅ Found MY PROFILE element');
            foundLink = element;
            break;
        }
    }
    
    // Look for .panel-link class
    if (!foundLink) {
        const panelLinks = document.querySelectorAll('.panel-link');
        if (panelLinks.length > 0) {
            console.log('✅ Found .panel-link element');
            foundLink = panelLinks[0];
        }
    }
    
    if (foundLink) {
        rxProfileLink = foundLink;
        
        // Store original HTML to restore if needed
        if (!rxProfileLink.dataset.original) {
            rxProfileLink.dataset.original = rxProfileLink.outerHTML;
        }
        
        console.log('✅ RX Profile link setup complete');
        
        // Update menu display initially
        rxUpdateMenuDisplay();
        
        return true;
    }
    
    return false;
}

// ============================================
// FLOATING BUTTON
// ============================================
function rxCreateFloatingButton() {
    console.log('➕ Creating RX floating button...');
    
    if (document.getElementById('rx-floating-button')) {
        console.log('ℹ️ RX Floating button already exists');
        return;
    }
    
    const button = document.createElement('button');
    button.id = 'rx-floating-button';
    button.className = 'rx-floating-btn';
    button.textContent = rxCurrentUser ? 'MY PROFILE' : 'LOGIN';
    button.title = 'Open Profile Panel';
    
    button.addEventListener('click', rxOpenPopup);
    
    document.body.appendChild(button);
    console.log('✅ RX Floating button created');
}

// ============================================
// INITIALIZATION
// ============================================
function rxInitializeSystem() {
    console.log('🚀 Initializing RX Profile System...');
    
    // 1. Load saved user
    if (rxLoadUserFromStorage()) {
        console.log('📥 User loaded from storage:', rxCurrentUser);
    } else {
        console.log('📭 No user found in storage');
    }
    
    // 2. Inject isolated styles
    rxInjectStyles();
    
    // 3. Create popup
    rxCreatePopup();
    
    // 4. Try to find and setup profile link
    const foundLink = rxFindProfileLink();
    
    // 5. If no link found, create floating button
    if (!foundLink) {
        console.log('⚠️ No profile link found, creating floating button');
        rxCreateFloatingButton();
    } else {
        console.log('✅ Profile link found and setup');
    }
    
    console.log('🎉 RX Profile System Initialized Successfully!');
    console.log('👉 Click "MY PROFILE" or the nickname in menu to open profile');
}

// ============================================
// START IMMEDIATELY
// ============================================
console.log('📦 RX Profile System script loaded');

// Start initialization immediately
try {
    rxInitializeSystem();
} catch (error) {
    console.error('❌ RX Initialization failed:', error);
}

// DOMContentLoaded listener as backup
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏗️ DOM loaded - ensuring RX system is ready');
    if (!document.getElementById('rx-isolated-overlay')) {
        console.log('🔄 Re-initializing RX system...');
        try {
            rxInitializeSystem();
        } catch (e) {
            console.error('❌ RX Re-initialization failed:', e);
        }
    }
});

// ============================================
// DEBUG FUNCTIONS
// ============================================
// Global functions for debugging (isolated with rx prefix)
window.rxOpenProfile = rxOpenPopup;
window.rxCheckStatus = function() {
    console.log('📊 RX Profile System Status:');
    console.log('- Overlay exists:', !!document.getElementById('rx-isolated-overlay'));
    console.log('- Current user:', rxCurrentUser || 'None');
    console.log('- Profile link found:', !!rxProfileLink);
    console.log('- Styles injected:', !!document.getElementById('rx-isolated-styles'));
    console.log('- Floating button:', !!document.getElementById('rx-floating-button'));
};
window.rxLogout = function() {
    rxCurrentUser = null;
    rxClearUserFromStorage();
    rxUpdateMenuDisplay();
    rxShowProfileContent();
    console.log('👋 Manual logout complete');
};

// Add cleanup function
window.rxCleanup = function() {
    const elements = document.querySelectorAll('[id^="rx-"], [class^="rx-"]');
    elements.forEach(el => el.remove());
    console.log('🧹 RX elements cleaned up');
};