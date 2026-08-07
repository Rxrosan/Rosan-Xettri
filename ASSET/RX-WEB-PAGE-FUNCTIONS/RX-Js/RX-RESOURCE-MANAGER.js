// ===== RX-RESOURCE-MANAGER.js =====
// Enhanced version with User & Admin modes
// Auto-fetches from Supabase

(function() {
    'use strict';

    // ===== SUPABASE CONFIGURATION =====
    const SUPABASE_URL = 'https://svwwbxbyutiieflxnoeb.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_OBPxBVADXRdtjYEC_ZFcEw_95NR5UXA';

    let supabaseClient = null;
    let autoRefreshInterval = null;
    let currentMode = 'user';
    let isAdminModeActive = false;
    let adminPasswordVerified = false;
    let selectedUserId = null;
    let allUsersData = [];
    let isEditMode = false;
    let isResourceEditMode = false;
    let currentEditingUser = null;
    let isInitialized = false;

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
                console.warn('⚠️ Supabase library not found.');
                return false;
            }
        } catch (error) {
            console.error('❌ Failed to initialize Supabase client:', error);
            return false;
        }
    }

    // ===== CHECK IF USER IS LOGGED IN =====
    function isUserLoggedIn() {
        try {
            var sessionData = sessionStorage.getItem('rxSession');
            if (sessionData) {
                var user = JSON.parse(sessionData);
                if (user && user.id && !user.isGuest) {
                    return true;
                }
            }
        } catch(e) {}
        
        try {
            var localData = localStorage.getItem('currentUser');
            if (localData) {
                var user2 = JSON.parse(localData);
                if (user2 && user2.id && !user2.isGuest) {
                    return true;
                }
            }
        } catch(e) {}
        
        if (window.UserSession) {
            try {
                var user3 = window.UserSession.getCurrentUser();
                if (user3 && user3.id && !user3.isGuest) {
                    return true;
                }
            } catch(e) {}
        }
        
        return false;
    }

    // ===== GET CURRENT USER =====
    function getCurrentUser() {
        try {
            var sessionData = sessionStorage.getItem('rxSession');
            if (sessionData) {
                return JSON.parse(sessionData);
            }
        } catch(e) {}
        
        try {
            var localData = localStorage.getItem('currentUser');
            if (localData) {
                return JSON.parse(localData);
            }
        } catch(e) {}
        
        if (window.UserSession) {
            try {
                return window.UserSession.getCurrentUser();
            } catch(e) {}
        }
        
        return null;
    }

    // ===== FETCH SINGLE USER FROM SUPABASE =====
    async function fetchUserData(userId) {
        if (!supabaseClient) return null;
        try {
            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Error fetching user:', error);
            return null;
        }
    }

    // ===== FETCH ALL USERS =====
    async function fetchAllUsers() {
        if (!supabaseClient) return [];
        try {
            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .order('full_name', { ascending: true, nullsLast: true });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('❌ Error fetching all users:', error);
            return [];
        }
    }

    // ===== FETCH USER ACCESS =====
    async function fetchUserAccess(userId) {
        if (!supabaseClient) return null;
        try {
            const { data, error } = await supabaseClient
                .from('users')
                .select('access, timed_access_config')
                .eq('id', userId)
                .single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Error fetching user access:', error);
            return null;
        }
    }

    // ===== UPDATE USER =====
    async function updateUser(userId, updates) {
        if (!supabaseClient) return null;
        try {
            const { data, error } = await supabaseClient
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Error updating user:', error);
            return null;
        }
    }

    // ===== PROCESS ACCESS DATA =====
    function processAccessData(data) {
        if (!data) {
            return { access: [], config: {}, permanentAccess: [], timedFiles: [] };
        }

        let permanentAccess = [];
        if (data.access && Array.isArray(data.access)) {
            permanentAccess = data.access;
        }

        let timedConfig = {};
        let timedFiles = [];

        if (data.timed_access_config) {
            let configData = data.timed_access_config;
            if (typeof configData === 'string') {
                try { configData = JSON.parse(configData); } catch(e) { configData = null; }
            }

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
            } else if (typeof configData === 'object' && configData !== null) {
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

        const allAccessFiles = [...new Set([...permanentAccess, ...timedFiles])];

        return { 
            access: allAccessFiles,
            config: timedConfig,
            permanentAccess: permanentAccess,
            timedFiles: timedFiles
        };
    }

    // ===== CALCULATE REMAINING DAYS =====
    function getRemainingDays(fileId, config) {
        if (!config || !config[fileId]) return null;
        const item = config[fileId];
        if (!item || !item.purchase_date || !item.access_days) return null;
        
        const currentDate = new Date();
        const purchaseDate = new Date(item.purchase_date);
        const accessDays = parseInt(item.access_days) || 30;
        const expiryDate = new Date(purchaseDate);
        expiryDate.setDate(expiryDate.getDate() + accessDays);
        
        const diffTime = expiryDate - currentDate;
        if (diffTime <= 0) return 0;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // ===== CHECK IF ACCESS EXPIRED =====
    function isAccessExpired(fileId, config) {
        if (!config || !config[fileId]) return false;
        const remaining = getRemainingDays(fileId, config);
        if (remaining === null) return false;
        return remaining <= 0;
    }

    // ===== VERIFY ADMIN PASSWORD =====
    async function verifyAdminPassword(password) {
        try {
            const user = getCurrentUser();
            if (!user || !user.email) {
                return { success: false, message: 'User not found' };
            }

            const response = await fetch('https://rx-backend-95ow.onrender.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, password: password })
            });

            const result = await response.json();
            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, message: result.error || 'Invalid password' };
            }
        } catch (error) {
            console.error('❌ Admin password verification error:', error);
            return { success: false, message: 'Server connection error' };
        }
    }

    // ===== GET CONTENT CARDS =====
    function getContentCards() {
        return window.contentCards || [];
    }

    // ===== RENDER LOGIN REQUIRED =====
    function renderLoginRequired() {
        const displayArea = document.getElementById('rx-display-area');
        if (!displayArea) return;

        displayArea.innerHTML = `
            <div class="rx-login-required">
                <div class="rx-login-card">
                    <i class="fas fa-lock"></i>
                    <h2>Please Login First</h2>
                    <p>You need to login to manage your accessible resources.</p>
                    <button onclick="if(typeof rxLoadAuthPage === 'function') rxLoadAuthPage(document.getElementById('rx-display-area')); else if(typeof rxLoadContent === 'function') rxLoadContent('AUTHENTICATION');" 
                            class="rx-login-btn">
                        <i class="fas fa-sign-in-alt"></i> Login Now
                    </button>
                    <p class="rx-login-hint">
                        <i class="fas fa-info-circle"></i> After login, your accessible resources will appear here.
                    </p>
                </div>
            </div>
        `;
    }

    // ===== RENDER USER MODE =====
    function renderUserMode(userData, processedData) {
        const displayArea = document.getElementById('rx-display-area');
        if (!displayArea) return;

        const userName = userData.full_name || userData.user_name || 'User';
        const userInitial = userName.charAt(0).toUpperCase();
        const userImage = userData.image || userData.avatar_url || 'ASSET/WEB-SOFTWARE/USER/IMG/USER.png';
        const isAdmin = userData.account_type === 'Admin' || userData.account_type === 'admin';

        const accessibleFiles = processedData.access || [];
        const contentCards = getContentCards();
        const fileDetails = contentCards.filter(card => accessibleFiles.includes(card.id));

        let filesHtml = '';
        if (fileDetails.length === 0) {
            filesHtml = `
                <div class="rx-no-files">
                    <i class="fas fa-folder-open"></i>
                    <p>No files accessible</p>
                    <span>Purchase a file to gain access</span>
                </div>
            `;
        } else {
            filesHtml = `<div class="rx-file-cards-grid">`;
            fileDetails.forEach(card => {
                const isExpired = isAccessExpired(card.id, processedData.config);
                const remainingDays = getRemainingDays(card.id, processedData.config);
                const isTimed = processedData.config && processedData.config[card.id];
                const isPermanent = processedData.permanentAccess && processedData.permanentAccess.includes(card.id);

                let statusClass = '';
                let statusText = '';
                let expiryText = '';

                if (isPermanent) {
                    statusClass = 'rx-permanent-card';
                    statusText = '<span class="rx-file-card-status rx-status-permanent">Permanent</span>';
                    expiryText = '<span class="rx-file-card-expiry"><i class="fas fa-infinity"></i> Unlimited</span>';
                } else if (isTimed && !isExpired) {
                    statusClass = 'rx-timed-card';
                    statusText = '<span class="rx-file-card-status rx-status-timed">Timed</span>';
                    expiryText = `<span class="rx-file-card-expiry"><i class="fas fa-hourglass-half"></i> ${remainingDays} days left</span>`;
                } else if (isTimed && isExpired) {
                    statusClass = 'rx-expired-card';
                    statusText = '<span class="rx-file-card-status rx-status-expired">Expired</span>';
                    expiryText = '<span class="rx-file-card-expiry rx-expired-text"><i class="fas fa-exclamation-triangle"></i> Access Expired</span>';
                } else {
                    statusClass = 'rx-locked-card';
                    statusText = '<span class="rx-file-card-status rx-status-locked">Locked</span>';
                    expiryText = '<span class="rx-file-card-expiry">Purchase required</span>';
                }

                const isAccessible = !isExpired && (isPermanent || isTimed);

                filesHtml += `
                    <div class="rx-file-card ${statusClass}">
                        <div class="rx-file-card-header">
                            <div class="rx-file-card-title">
                                <i class="${card.icon || 'fas fa-file'}"></i>
                                <h4>${card.title}</h4>
                            </div>
                            ${statusText}
                        </div>
                        <div class="rx-file-card-desc">${card.description || ''}</div>
                        <div class="rx-file-card-footer">
                            ${expiryText}
                            ${isAccessible ? 
                                `<a href="${card.link}" class="rx-file-card-action"><i class="fas fa-external-link-alt"></i> Open</a>` : 
                                `<button onclick="if(window.PaymentManager) window.PaymentManager.showPurchaseModal('${card.id}')" class="rx-file-card-action rx-btn-purchase"><i class="fas fa-shopping-cart"></i> Purchase</button>`
                            }
                        </div>
                    </div>
                `;
            });
            filesHtml += `</div>`;
        }

        displayArea.innerHTML = `
            <div class="rx-resource-container">
                <div class="rx-top-header">
                    <div class="rx-header-left">
                        <div class="rx-user-avatar-lg">
                            ${userImage && userImage !== 'ASSET/WEB-SOFTWARE/USER/IMG/USER.png' ? 
                                `<img src="${userImage}" alt="${userName}">` : 
                                userInitial}
                        </div>
                        <div class="rx-user-info">
                            <h1>${userName}</h1>
                            <span class="rx-user-role">${userData.account_type || 'User'}</span>
                        </div>
                    </div>
                    <div class="rx-header-right">
                        ${isAdmin ? `
                            <button onclick="window.RXResourceManager && window.RXResourceManager.switchToAdminMode()" class="rx-btn-admin">
                                <i class="fas fa-user-shield"></i> Admin
                            </button>
                        ` : ''}
                        <button onclick="window.RXResourceManager && window.RXResourceManager.handleLogout()" class="rx-btn-logout">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>

                <div class="rx-files-section">
                    <div class="rx-files-header">
                        <h3><i class="fas fa-folder-open"></i> Your Accessible Files</h3>
                        <span class="rx-file-count">${fileDetails.length}</span>
                    </div>
                    ${filesHtml}
                </div>
            </div>
        `;
    }

    // ===== RENDER ADMIN MODE =====
    function renderAdminMode(allUsers, currentAdmin) {
        const displayArea = document.getElementById('rx-display-area');
        if (!displayArea) return;

        if (!isUserLoggedIn()) {
            renderLoginRequired();
            return;
        }

        const adminName = currentAdmin ? (currentAdmin.full_name || currentAdmin.user_name || 'Admin') : 'Admin';
        const adminInitial = adminName.charAt(0).toUpperCase();
        const adminImage = currentAdmin?.image || currentAdmin?.avatar_url;
        const isMobile = window.innerWidth <= 768;

        // Build user list items
        let userListItems = '';
        if (!allUsers || allUsers.length === 0) {
            userListItems = `<p class="rx-no-users">No users found</p>`;
        } else {
            allUsers.forEach(userItem => {
                const userImage = userItem.image || userItem.avatar_url;
                const initial = (userItem.full_name || userItem.user_name || 'U').charAt(0).toUpperCase();
                const role = userItem.account_type || 'user';
                const roleColor = role === 'Admin' ? '#e67e22' : role === 'member' ? '#2ecc71' : '#3498db';
                const isSelected = selectedUserId === userItem.id;
                
                let accessCount = 0;
                if (userItem.access && Array.isArray(userItem.access)) {
                    accessCount = userItem.access.length;
                }
                if (userItem.timed_access_config) {
                    let timed = userItem.timed_access_config;
                    if (typeof timed === 'string') {
                        try { timed = JSON.parse(timed); } catch(e) { timed = []; }
                    }
                    if (Array.isArray(timed)) {
                        accessCount += timed.length;
                    } else if (typeof timed === 'object') {
                        accessCount += Object.keys(timed).length;
                    }
                }

                if (isMobile) {
                    userListItems += `
                        <div onclick="window.RXResourceManager && window.RXResourceManager.selectUser('${userItem.id}')" 
                             class="rx-user-horizontal-item ${isSelected ? 'rx-active' : ''}">
                            <div class="rx-user-avatar-sm">
                                ${userImage && userImage !== 'ASSET/WEB-SOFTWARE/USER/IMG/USER.png' ? 
                                    `<img src="${userImage}" alt="${initial}">` : 
                                    initial}
                            </div>
                            <div class="rx-user-name-sm">${userItem.full_name || userItem.user_name || 'No Name'}</div>
                            <div class="rx-user-access-badge">${accessCount}</div>
                            <div class="rx-user-role-dot" style="background:${roleColor};"></div>
                        </div>
                    `;
                } else {
                    userListItems += `
                        <div onclick="window.RXResourceManager && window.RXResourceManager.selectUser('${userItem.id}')" 
                             class="rx-user-list-item ${isSelected ? 'rx-active' : ''}">
                            <div class="rx-user-list-avatar">
                                ${userImage && userImage !== 'ASSET/WEB-SOFTWARE/USER/IMG/USER.png' ? 
                                    `<img src="${userImage}" alt="${initial}">` : 
                                    initial}
                            </div>
                            <div class="rx-user-list-info">
                                <div class="rx-user-list-name">${userItem.full_name || userItem.user_name || 'No Name'}</div>
                                <div class="rx-user-list-meta">${userItem.id} · ${role}</div>
                            </div>
                            <div class="rx-user-list-badge">${accessCount}</div>
                            <div class="rx-user-list-dot" style="background:${roleColor};"></div>
                        </div>
                    `;
                }
            });
        }

        // PC View
        const pcViewHtml = `
            <div class="rx-admin-layout">
                <div class="rx-admin-left-panel">
                    <div class="rx-admin-panel-header">
                        <span><i class="fas fa-users"></i> Users <span class="rx-user-count">${allUsers ? allUsers.length : 0}</span></span>
                        <button onclick="window.RXResourceManager && window.RXResourceManager.refreshAllUsers()" class="rx-refresh-btn-sm">
                            <i class="fas fa-sync"></i>
                        </button>
                    </div>
                    <div class="rx-admin-search">
                        <input type="text" id="adminUserSearch" placeholder="Search users..." onkeyup="window.RXResourceManager && window.RXResourceManager.filterUsers(this.value)">
                    </div>
                    <div class="rx-admin-user-list" id="adminUserList">
                        ${userListItems}
                    </div>
                </div>

                <div class="rx-admin-right-panel">
                    <div id="adminDetailPlaceholder" class="rx-placeholder">
                        <i class="fas fa-user-circle"></i>
                        <h3>Select a User</h3>
                        <p>Choose a user from the list to view and manage their profile</p>
                    </div>
                    <div id="adminDetailContent" style="display:none;"></div>
                </div>
            </div>
        `;

        // Mobile View
        const mobileViewHtml = `
            <div class="rx-admin-mobile-layout">
                <div class="rx-user-list-section">
                    <div class="rx-user-list-header">
                        <span><i class="fas fa-users"></i> Users <span class="rx-user-count">${allUsers ? allUsers.length : 0}</span></span>
                        <div style="display:flex; gap:6px; align-items:center;">
                            <input type="text" id="adminUserSearchMobile" placeholder="Search..." onkeyup="window.RXResourceManager && window.RXResourceManager.filterUsersMobile(this.value)" style="padding:4px 8px; border:1px solid var(--rx-border); border-radius:4px; font-size:12px; width:120px;">
                            <button onclick="window.RXResourceManager && window.RXResourceManager.refreshAllUsers()" class="rx-refresh-btn-sm">
                                <i class="fas fa-sync"></i>
                            </button>
                        </div>
                    </div>
                    <div class="rx-user-list-wrapper" id="adminUserListMobile">
                        <div class="rx-user-horizontal-list">
                            ${userListItems}
                        </div>
                    </div>
                </div>

                <div class="rx-detail-panel-admin" id="adminDetailPanel">
                    <div id="adminDetailPlaceholderMobile" class="rx-placeholder">
                        <i class="fas fa-user-circle"></i>
                        <h3>Select a User</h3>
                        <p>Choose a user from the list above to view and manage their profile</p>
                    </div>
                    <div id="adminDetailContentMobile" style="display:none;"></div>
                </div>
            </div>
        `;

        displayArea.innerHTML = `
            <div class="rx-resource-container">
                <div class="rx-top-header rx-admin-header-top">
                    <div class="rx-header-left">
                        <div class="rx-user-avatar-lg">
                            ${adminImage && adminImage !== 'ASSET/WEB-SOFTWARE/USER/IMG/USER.png' ? 
                                `<img src="${adminImage}" alt="${adminName}">` : 
                                adminInitial}
                        </div>
                        <div class="rx-user-info">
                            <h1>${adminName}</h1>
                            <span class="rx-user-role rx-admin-role">Admin Panel</span>
                        </div>
                    </div>
                    <div class="rx-header-right">
                        <button onclick="window.RXResourceManager && window.RXResourceManager.switchToUserMode()" class="rx-btn-user-mode">
                            <i class="fas fa-user"></i> User Mode
                        </button>
                        <button onclick="window.RXResourceManager && window.RXResourceManager.handleLogout()" class="rx-btn-logout">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>

                ${isMobile ? mobileViewHtml : pcViewHtml}
            </div>
        `;

        // Re-apply selected user highlight
        if (selectedUserId) {
            setTimeout(() => {
                const isMobileView = window.innerWidth <= 768;
                if (isMobileView) {
                    const items = document.querySelectorAll('.rx-user-horizontal-item');
                    items.forEach(item => item.classList.remove('rx-active'));
                    const selected = document.querySelector(`.rx-user-horizontal-item[onclick*="selectUser('${selectedUserId}')"]`);
                    if (selected) selected.classList.add('rx-active');
                } else {
                    const items = document.querySelectorAll('.rx-user-list-item');
                    items.forEach(item => item.classList.remove('rx-active'));
                    const selected = document.querySelector(`.rx-user-list-item[onclick*="selectUser('${selectedUserId}')"]`);
                    if (selected) selected.classList.add('rx-active');
                }
            }, 100);
        }
    }

    // ===== RENDER USER DETAIL =====
    async function renderUserDetail(userId) {
        const userData = await fetchUserData(userId);
        if (!userData) {
            const isMobile = window.innerWidth <= 768;
            const placeholderId = isMobile ? 'adminDetailPlaceholderMobile' : 'adminDetailPlaceholder';
            const contentId = isMobile ? 'adminDetailContentMobile' : 'adminDetailContent';
            
            const placeholder = document.getElementById(placeholderId);
            const content = document.getElementById(contentId);
            if (placeholder) placeholder.style.display = 'flex';
            if (content) content.style.display = 'none';
            return;
        }

        const accessData = await fetchUserAccess(userId);
        const processed = accessData ? processAccessData(accessData) : { access: [], config: {}, permanentAccess: [], timedFiles: [] };
        const contentCards = getContentCards();
        const fileDetails = contentCards.filter(card => processed.access.includes(card.id));

        let filesHtml = '';
        if (fileDetails.length === 0) {
            filesHtml = `<p class="rx-no-access-text">No files accessible</p>`;
        } else {
            filesHtml = `<div class="rx-admin-file-list">`;
            fileDetails.forEach(card => {
                const isExpired = isAccessExpired(card.id, processed.config);
                const remainingDays = getRemainingDays(card.id, processed.config);
                const isTimed = processed.config && processed.config[card.id];
                const isPermanent = processed.permanentAccess && processed.permanentAccess.includes(card.id);

                let statusText = '';
                let statusColor = '';
                let statusIcon = '';
                if (isPermanent) {
                    statusText = 'Permanent';
                    statusColor = '#2ecc71';
                    statusIcon = 'fa-infinity';
                } else if (isTimed && !isExpired) {
                    statusText = `${remainingDays} days left`;
                    statusColor = '#f39c12';
                    statusIcon = 'fa-hourglass-half';
                } else if (isTimed && isExpired) {
                    statusText = 'Expired';
                    statusColor = '#e74c3c';
                    statusIcon = 'fa-exclamation-triangle';
                } else {
                    statusText = 'No access';
                    statusColor = '#888';
                    statusIcon = 'fa-lock';
                }

                filesHtml += `
                    <div class="rx-admin-file-item">
                        <span class="rx-admin-file-name"><i class="${card.icon || 'fas fa-file'}"></i> ${card.title}</span>
                        <span class="rx-admin-file-status" style="color:${statusColor};">
                            <i class="fas ${statusIcon}"></i> ${statusText}
                        </span>
                    </div>
                `;
            });
            filesHtml += `</div>`;
        }

        const detailViewHtml = `
            <div id="userDetailView">
                <div class="rx-admin-profile-header">
                    <div class="rx-admin-profile-info">
                        <span class="rx-admin-user-role-badge" style="background:${userData.account_type === 'Admin' ? '#e67e22' : userData.account_type === 'member' ? '#2ecc71' : '#3498db'};">
                            ${userData.account_type || 'user'}
                        </span>
                        <h2>${userData.full_name || userData.user_name || 'No Name'}</h2>
                        <span class="rx-admin-user-id">${userData.id}</span>
                    </div>
                    <div class="rx-admin-profile-actions">
                        <button onclick="window.RXResourceManager && window.RXResourceManager.showEditProfile('${userId}')" class="rx-btn-edit-profile">
                            <i class="fas fa-edit"></i> Edit Profile
                        </button>
                        <button onclick="window.RXResourceManager && window.RXResourceManager.showEditResources('${userId}')" class="rx-btn-edit-resources">
                            <i class="fas fa-folder-open"></i> Edit Resources
                        </button>
                    </div>
                </div>

                <div class="rx-admin-detail-grid">
                    <div class="rx-admin-detail-item">
                        <span class="rx-admin-detail-label">Full Name</span>
                        <span class="rx-admin-detail-value">${userData.full_name || '-'}</span>
                    </div>
                    <div class="rx-admin-detail-item">
                        <span class="rx-admin-detail-label">Username</span>
                        <span class="rx-admin-detail-value">${userData.user_name || '-'}</span>
                    </div>
                    <div class="rx-admin-detail-item">
                        <span class="rx-admin-detail-label">Address</span>
                        <span class="rx-admin-detail-value">${userData.address || '-'}</span>
                    </div>
                    <div class="rx-admin-detail-item">
                        <span class="rx-admin-detail-label">Email</span>
                        <span class="rx-admin-detail-value">${userData.email || '-'}</span>
                    </div>
                    <div class="rx-admin-detail-item">
                        <span class="rx-admin-detail-label">Phone</span>
                        <span class="rx-admin-detail-value">${userData.phone || '-'}</span>
                    </div>
                    <div class="rx-admin-detail-item">
                        <span class="rx-admin-detail-label">Account Type</span>
                        <span class="rx-admin-detail-value">${userData.account_type || 'user'}</span>
                    </div>
                    <div class="rx-admin-detail-item">
                        <span class="rx-admin-detail-label">Date of Birth</span>
                        <span class="rx-admin-detail-value">${userData.dateofbirth || '-'}</span>
                    </div>
                    <div class="rx-admin-detail-item">
                        <span class="rx-admin-detail-label">User ID</span>
                        <span class="rx-admin-detail-value">${userData.id}</span>
                    </div>
                    <div class="rx-admin-detail-item">
                        <span class="rx-admin-detail-label">Status</span>
                        <span class="rx-admin-detail-value" style="color:${userData.account_type === 'Admin' ? '#e67e22' : '#2ecc71'};">${userData.account_type === 'Admin' ? 'Administrator' : 'Active'}</span>
                    </div>
                </div>

                <div class="rx-admin-access-section">
                    <h4><i class="fas fa-key"></i> File Access (${fileDetails.length})</h4>
                    ${filesHtml}
                </div>
            </div>
        `;

        const isMobile = window.innerWidth <= 768;
        const placeholderId = isMobile ? 'adminDetailPlaceholderMobile' : 'adminDetailPlaceholder';
        const contentId = isMobile ? 'adminDetailContentMobile' : 'adminDetailContent';
        
        const placeholder = document.getElementById(placeholderId);
        const content = document.getElementById(contentId);
        
        if (placeholder) placeholder.style.display = 'none';
        if (content) {
            content.style.display = 'block';
            content.innerHTML = detailViewHtml;
        }
    }

    // ===== SHOW EDIT PROFILE =====
    function showEditProfile(userId) {
        const container = document.getElementById('userDetailView');
        if (!container) {
            const mobileContainer = document.querySelector('#adminDetailContentMobile #userDetailView');
            if (mobileContainer) {
                showEditProfileInContainer(userId, mobileContainer);
            }
            return;
        }
        showEditProfileInContainer(userId, container);
    }

    function showEditProfileInContainer(userId, container) {
        if (!container) return;
        
        if (document.getElementById('editResourcesView')) {
            if (!confirm('You are currently editing resources. Do you want to switch to profile edit?')) {
                return;
            }
        }
        
        fetchUserData(userId).then(userData => {
            if (!userData) return;
            
            const editProfileHtml = `
                <div id="editProfileView">
                    <div class="rx-edit-header">
                        <h3><i class="fas fa-edit"></i> Edit Profile</h3>
                        <button onclick="window.RXResourceManager && window.RXResourceManager.cancelEdit('${userId}')" class="rx-edit-cancel-btn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                    <div class="rx-edit-grid">
                        <div class="rx-edit-field">
                            <label>Full Name</label>
                            <input type="text" id="editFullName" value="${userData.full_name || ''}">
                        </div>
                        <div class="rx-edit-field">
                            <label>Username</label>
                            <input type="text" id="editUserName" value="${userData.user_name || ''}">
                        </div>
                        <div class="rx-edit-field">
                            <label>Email</label>
                            <input type="email" id="editEmail" value="${userData.email || ''}">
                        </div>
                        <div class="rx-edit-field">
                            <label>Phone</label>
                            <input type="text" id="editPhone" value="${userData.phone || ''}">
                        </div>
                        <div class="rx-edit-field">
                            <label>Address</label>
                            <input type="text" id="editAddress" value="${userData.address || ''}">
                        </div>
                        <div class="rx-edit-field">
                            <label>Date of Birth</label>
                            <input type="date" id="editDob" value="${userData.dateofbirth || ''}">
                        </div>
                        <div class="rx-edit-field">
                            <label>Account Type</label>
                            <select id="editAccountType">
                                <option value="user" ${userData.account_type === 'user' ? 'selected' : ''}>User</option>
                                <option value="member" ${userData.account_type === 'member' ? 'selected' : ''}>Member</option>
                                <option value="Admin" ${userData.account_type === 'Admin' ? 'selected' : ''}>Admin</option>
                            </select>
                        </div>
                        <div class="rx-edit-field">
                            <label>User ID</label>
                            <input type="text" value="${userData.id}" readonly>
                        </div>
                    </div>
                    <div class="rx-edit-actions">
                        <button onclick="window.RXResourceManager && window.RXResourceManager.saveUserEdit('${userId}')" class="rx-btn-save">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button onclick="window.RXResourceManager && window.RXResourceManager.cancelEdit('${userId}')" class="rx-btn-cancel">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </div>
            `;
            
            container.innerHTML = editProfileHtml;
            isEditMode = true;
            isResourceEditMode = false;
        });
    }

    // ===== SHOW EDIT RESOURCES =====
    function showEditResources(userId) {
        const container = document.getElementById('userDetailView');
        if (!container) {
            const mobileContainer = document.querySelector('#adminDetailContentMobile #userDetailView');
            if (mobileContainer) {
                showEditResourcesInContainer(userId, mobileContainer);
            }
            return;
        }
        showEditResourcesInContainer(userId, container);
    }

    function showEditResourcesInContainer(userId, container) {
        if (!container) return;
        
        if (document.getElementById('editProfileView')) {
            if (!confirm('You are currently editing profile. Do you want to switch to resource edit?')) {
                return;
            }
        }
        
        fetchUserData(userId).then(userData => {
            if (!userData) return;
            
            const accessData = fetchUserAccess(userId);
            accessData.then(data => {
                const processed = data ? processAccessData(data) : { access: [], config: {}, permanentAccess: [], timedFiles: [] };
                const contentCards = getContentCards();
                const fileDetails = contentCards.filter(card => processed.access.includes(card.id));
                const availableFiles = contentCards.filter(card => !processed.access.includes(card.id));
                
                let currentResourcesHtml = '';
                if (fileDetails.length === 0) {
                    currentResourcesHtml = '<span class="rx-no-resources">No resources</span>';
                } else {
                    fileDetails.forEach(card => {
                        currentResourcesHtml += `
                            <span class="rx-resource-tag">
                                ${card.title}
                                <button onclick="window.RXResourceManager && window.RXResourceManager.removeUserAccess('${userId}','${card.id}')" 
                                        class="rx-resource-remove-btn">
                                    <i class="fas fa-times"></i>
                                </button>
                            </span>
                        `;
                    });
                }
                
                const editResourcesHtml = `
                    <div id="editResourcesView">
                        <div class="rx-edit-header">
                            <h3><i class="fas fa-folder-open"></i> Edit Resources</h3>
                            <button onclick="window.RXResourceManager && window.RXResourceManager.cancelEdit('${userId}')" class="rx-edit-cancel-btn">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                        
                        <div class="rx-current-resources">
                            <label>Current Resources:</label>
                            <div class="rx-resource-tags">
                                ${currentResourcesHtml}
                            </div>
                        </div>

                        <div class="rx-add-resource">
                            <label>Add New Resource:</label>
                            <div class="rx-add-resource-row">
                                <select id="resourceAddSelect">
                                    <option value="">Select resource...</option>
                                    ${availableFiles.map(card => 
                                        `<option value="${card.id}">${card.title}</option>`
                                    ).join('')}
                                </select>
                                <input type="number" id="resourceAccessDays" placeholder="Days" min="1">
                                <button onclick="window.RXResourceManager && window.RXResourceManager.addResourceToUser('${userId}')" class="rx-btn-add-resource">
                                    <i class="fas fa-plus"></i> Add
                                </button>
                            </div>
                            <small>Leave days empty for permanent access</small>
                        </div>
                    </div>
                `;
                
                container.innerHTML = editResourcesHtml;
                isResourceEditMode = true;
                isEditMode = false;
            });
        });
    }

    // ===== CANCEL EDIT =====
    function cancelEdit(userId) {
        if (!confirm('Discard changes and return to user details?')) return;
        
        isEditMode = false;
        isResourceEditMode = false;
        renderUserDetail(userId);
    }

    // ===== SAVE USER EDIT =====
    async function saveUserEdit(userId) {
        const updates = {
            full_name: document.getElementById('editFullName').value,
            user_name: document.getElementById('editUserName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            address: document.getElementById('editAddress').value,
            dateofbirth: document.getElementById('editDob').value,
            account_type: document.getElementById('editAccountType').value
        };

        const result = await updateUser(userId, updates);
        if (result) {
            alert('✅ User updated successfully!');
            isEditMode = false;
            await refreshAllUsers();
            await renderUserDetail(userId);
            const users = await fetchAllUsers();
            allUsersData = users;
            renderAdminMode(users, getCurrentUser());
        } else {
            alert('❌ Failed to update user. Please try again.');
        }
    }

    // ===== ADD RESOURCE TO USER =====
    async function addResourceToUser(userId) {
        const select = document.getElementById('resourceAddSelect');
        const daysInput = document.getElementById('resourceAccessDays');
        const fileId = select.value;
        const days = daysInput.value;

        if (!fileId) {
            alert('Please select a resource');
            return;
        }

        await addUserAccess(userId);
    }

    // ===== ADD USER ACCESS =====
    async function addUserAccess(userId) {
        const select = document.getElementById('resourceAddSelect');
        const daysInput = document.getElementById('resourceAccessDays');
        const fileId = select.value;
        const days = daysInput.value;

        if (!fileId) {
            alert('Please select a file');
            return;
        }

        const userData = await fetchUserData(userId);
        if (!userData) {
            alert('User not found');
            return;
        }

        const accessData = await fetchUserAccess(userId);
        const processed = accessData ? processAccessData(accessData) : { access: [], config: {}, permanentAccess: [], timedFiles: [] };

        try {
            if (days === "" || parseInt(days) === 0) {
                const newAccess = [...processed.permanentAccess, fileId];
                const { error } = await supabaseClient
                    .from('users')
                    .update({ access: newAccess })
                    .eq('id', userId);
                if (error) throw error;
                alert('✅ Permanent access added');
            } else {
                let timedConfig = userData.timed_access_config || [];
                if (typeof timedConfig === 'string') {
                    try { timedConfig = JSON.parse(timedConfig); } catch(e) { timedConfig = []; }
                }
                if (!Array.isArray(timedConfig)) timedConfig = [];
                
                const filtered = timedConfig.filter(t => t.file !== fileId);
                const newTimed = [...filtered, { 
                    file: fileId, 
                    access_days: parseInt(days), 
                    purchase_date: new Date().toISOString().split('T')[0] 
                }];
                
                const { error } = await supabaseClient
                    .from('users')
                    .update({ timed_access_config: newTimed })
                    .eq('id', userId);
                if (error) throw error;
                alert(`✅ Timed access added (${days} days)`);
            }

            await refreshAllUsers();
            await renderUserDetail(userId);
            const users = await fetchAllUsers();
            allUsersData = users;
            renderAdminMode(users, getCurrentUser());
            
            if (document.getElementById('resourceAddSelect')) document.getElementById('resourceAddSelect').value = '';
            if (document.getElementById('resourceAccessDays')) document.getElementById('resourceAccessDays').value = '';
            
        } catch (error) {
            console.error('Error adding access:', error);
            alert('❌ Failed to add access. Please try again.');
        }
    }

    // ===== REMOVE USER ACCESS =====
    async function removeUserAccess(userId, fileId) {
        if (!confirm(`Remove access to "${fileId}" for this user?`)) return;

        const userData = await fetchUserData(userId);
        if (!userData) {
            alert('User not found');
            return;
        }

        const accessData = await fetchUserAccess(userId);
        const processed = accessData ? processAccessData(accessData) : { access: [], config: {}, permanentAccess: [], timedFiles: [] };

        try {
            const newPermanent = processed.permanentAccess.filter(f => f !== fileId);
            
            let timedConfig = userData.timed_access_config || [];
            if (typeof timedConfig === 'string') {
                try { timedConfig = JSON.parse(timedConfig); } catch(e) { timedConfig = []; }
            }
            if (!Array.isArray(timedConfig)) timedConfig = [];
            const newTimed = timedConfig.filter(t => t.file !== fileId);

            const { error } = await supabaseClient
                .from('users')
                .update({ 
                    access: newPermanent,
                    timed_access_config: newTimed 
                })
                .eq('id', userId);
            
            if (error) throw error;
            
            alert('✅ Access removed successfully!');
            await refreshAllUsers();
            await renderUserDetail(userId);
            const users = await fetchAllUsers();
            allUsersData = users;
            renderAdminMode(users, getCurrentUser());
        } catch (error) {
            console.error('Error removing access:', error);
            alert('❌ Failed to remove access. Please try again.');
        }
    }

    // ===== FILTER USERS (PC) =====
    function filterUsers(searchTerm) {
        const users = allUsersData || [];
        if (!users || users.length === 0) return;

        const term = searchTerm.toLowerCase().trim();
        const filtered = users.filter(u => 
            (u.full_name || '').toLowerCase().includes(term) ||
            (u.user_name || '').toLowerCase().includes(term) ||
            (u.email || '').toLowerCase().includes(term) ||
            (u.id || '').toLowerCase().includes(term)
        );

        const userList = document.getElementById('adminUserList');
        if (!userList) return;

        if (filtered.length === 0) {
            userList.innerHTML = `<p class="rx-no-users">No users found</p>`;
            return;
        }

        let html = '';
        filtered.forEach(user => {
            const userImage = user.image || user.avatar_url;
            const initial = (user.full_name || user.user_name || 'U').charAt(0).toUpperCase();
            const role = user.account_type || 'user';
            const roleColor = role === 'Admin' ? '#e67e22' : role === 'member' ? '#2ecc71' : '#3498db';
            const isSelected = selectedUserId === user.id;
            
            let accessCount = 0;
            if (user.access && Array.isArray(user.access)) {
                accessCount = user.access.length;
            }
            if (user.timed_access_config) {
                let timed = user.timed_access_config;
                if (typeof timed === 'string') {
                    try { timed = JSON.parse(timed); } catch(e) { timed = []; }
                }
                if (Array.isArray(timed)) {
                    accessCount += timed.length;
                } else if (typeof timed === 'object') {
                    accessCount += Object.keys(timed).length;
                }
            }

            html += `
                <div onclick="window.RXResourceManager && window.RXResourceManager.selectUser('${user.id}')" 
                     class="rx-user-list-item ${isSelected ? 'rx-active' : ''}">
                    <div class="rx-user-list-avatar">
                        ${userImage && userImage !== 'ASSET/WEB-SOFTWARE/USER/IMG/USER.png' ? 
                            `<img src="${userImage}" alt="${initial}">` : 
                            initial}
                    </div>
                    <div class="rx-user-list-info">
                        <div class="rx-user-list-name">${user.full_name || user.user_name || 'No Name'}</div>
                        <div class="rx-user-list-meta">${user.id} · ${role}</div>
                    </div>
                    <div class="rx-user-list-badge">${accessCount}</div>
                    <div class="rx-user-list-dot" style="background:${roleColor};"></div>
                </div>
            `;
        });
        userList.innerHTML = html;
    }

    // ===== FILTER USERS (Mobile) =====
    function filterUsersMobile(searchTerm) {
        const users = allUsersData || [];
        if (!users || users.length === 0) return;

        const term = searchTerm.toLowerCase().trim();
        const filtered = users.filter(u => 
            (u.full_name || '').toLowerCase().includes(term) ||
            (u.user_name || '').toLowerCase().includes(term) ||
            (u.email || '').toLowerCase().includes(term) ||
            (u.id || '').toLowerCase().includes(term)
        );

        const wrapper = document.querySelector('.rx-user-list-wrapper');
        if (!wrapper) return;

        if (filtered.length === 0) {
            wrapper.innerHTML = `<p class="rx-no-users" style="padding:10px; text-align:center;">No users found</p>`;
            return;
        }

        let html = `<div class="rx-user-horizontal-list">`;
        filtered.forEach(user => {
            const userImage = user.image || user.avatar_url;
            const initial = (user.full_name || user.user_name || 'U').charAt(0).toUpperCase();
            const role = user.account_type || 'user';
            const roleColor = role === 'Admin' ? '#e67e22' : role === 'member' ? '#2ecc71' : '#3498db';
            const isSelected = selectedUserId === user.id;
            
            let accessCount = 0;
            if (user.access && Array.isArray(user.access)) {
                accessCount = user.access.length;
            }
            if (user.timed_access_config) {
                let timed = user.timed_access_config;
                if (typeof timed === 'string') {
                    try { timed = JSON.parse(timed); } catch(e) { timed = []; }
                }
                if (Array.isArray(timed)) {
                    accessCount += timed.length;
                } else if (typeof timed === 'object') {
                    accessCount += Object.keys(timed).length;
                }
            }

            html += `
                <div onclick="window.RXResourceManager && window.RXResourceManager.selectUser('${user.id}')" 
                     class="rx-user-horizontal-item ${isSelected ? 'rx-active' : ''}">
                    <div class="rx-user-avatar-sm">
                        ${userImage && userImage !== 'ASSET/WEB-SOFTWARE/USER/IMG/USER.png' ? 
                            `<img src="${userImage}" alt="${initial}">` : 
                            initial}
                    </div>
                    <div class="rx-user-name-sm">${user.full_name || user.user_name || 'No Name'}</div>
                    <div class="rx-user-access-badge">${accessCount}</div>
                    <div class="rx-user-role-dot" style="background:${roleColor};"></div>
                </div>
            `;
        });
        html += `</div>`;
        wrapper.innerHTML = html;
    }

    // ===== SELECT USER =====
    async function selectUser(userId) {
        if (isEditMode || isResourceEditMode) {
            if (!confirm('You have unsaved changes. Do you want to discard them?')) {
                return;
            }
        }
        
        selectedUserId = userId;
        
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            const items = document.querySelectorAll('.rx-user-horizontal-item');
            items.forEach(item => item.classList.remove('rx-active'));
            const selected = document.querySelector(`.rx-user-horizontal-item[onclick*="selectUser('${userId}')"]`);
            if (selected) selected.classList.add('rx-active');
        } else {
            const items = document.querySelectorAll('.rx-user-list-item');
            items.forEach(item => item.classList.remove('rx-active'));
            const selected = document.querySelector(`.rx-user-list-item[onclick*="selectUser('${userId}')"]`);
            if (selected) selected.classList.add('rx-active');
        }

        isEditMode = false;
        isResourceEditMode = false;
        await renderUserDetail(userId);
    }

    // ===== REFRESH ALL USERS =====
    async function refreshAllUsers() {
        const users = await fetchAllUsers();
        allUsersData = users;
        if (isAdminModeActive) {
            renderAdminMode(users, getCurrentUser());
        }
        return users;
    }

    // ===== REFRESH USER ACCESS =====
    async function refreshUserAccess() {
        if (!isUserLoggedIn()) {
            return;
        }

        const userData = await fetchUserData(getCurrentUser().id);
        if (!userData) {
            return;
        }

        const data = await fetchUserAccess(userData.id);
        const processed = data ? processAccessData(data) : { access: [], config: {}, permanentAccess: [], timedFiles: [] };
        
        if (window.UserSession) {
            window.UserSession.updateAccess(processed.access, processed.config);
            window.UserSession.userAccessConfig = processed.config;
            window.UserSession.permanentAccess = processed.permanentAccess;
            window.UserSession.timedFiles = processed.timedFiles;
        }

        if (currentMode === 'user' && !isAdminModeActive) {
            renderUserMode(userData, processed);
        }
    }

    // ===== SWITCH TO ADMIN MODE =====
    function switchToAdminMode() {
        if (isAdminModeActive) {
            refreshAllUsers();
            return;
        }
        
        if (!isUserLoggedIn()) {
            renderLoginRequired();
            return;
        }
        
        const user = getCurrentUser();
        if (!(user.account_type === 'Admin' || user.account_type === 'admin')) {
            alert('You are not authorized as admin');
            return;
        }

        showAdminPasswordPopup();
    }

    // ===== SWITCH TO USER MODE =====
    function switchToUserMode() {
        isAdminModeActive = false;
        currentMode = 'user';
        adminPasswordVerified = false;
        selectedUserId = null;
        isEditMode = false;
        isResourceEditMode = false;
        currentEditingUser = null;
        refreshUserAccess();
    }

    // ===== SHOW ADMIN PASSWORD POPUP =====
    function showAdminPasswordPopup() {
        const existing = document.getElementById('adminPasswordPopup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'adminPasswordPopup';
        popup.className = 'rx-password-popup';
        popup.innerHTML = `
            <div class="rx-password-popup-content">
                <i class="fas fa-user-shield"></i>
                <h3>Enter Admin Password</h3>
                <p>Enter your account password to access admin panel</p>
                <div class="rx-password-input-wrapper">
                    <input type="password" id="adminPasswordInput" placeholder="Enter password">
                    <div class="rx-password-error" id="adminPasswordError">Invalid password. Please try again.</div>
                </div>
                <div class="rx-password-actions">
                    <button onclick="document.getElementById('adminPasswordPopup').remove()" class="rx-btn-cancel-popup">Cancel</button>
                    <button onclick="window.RXResourceManager && window.RXResourceManager.verifyAndEnterAdmin()" class="rx-btn-verify">
                        <i class="fas fa-check"></i> Verify
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        setTimeout(() => {
            const input = document.getElementById('adminPasswordInput');
            if (input) input.focus();
        }, 100);

        document.getElementById('adminPasswordInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.RXResourceManager && window.RXResourceManager.verifyAndEnterAdmin();
            }
        });
    }

    // ===== VERIFY AND ENTER ADMIN =====
    async function verifyAndEnterAdmin() {
        const passwordInput = document.getElementById('adminPasswordInput');
        const errorEl = document.getElementById('adminPasswordError');
        
        if (!passwordInput) return;
        
        const password = passwordInput.value.trim();
        if (!password) {
            if (errorEl) {
                errorEl.style.display = 'block';
                errorEl.textContent = 'Please enter your password';
            }
            return;
        }

        const result = await verifyAdminPassword(password);
        
        if (result.success) {
            adminPasswordVerified = true;
            isAdminModeActive = true;
            currentMode = 'admin';
            
            const popup = document.getElementById('adminPasswordPopup');
            if (popup) popup.remove();
            
            const users = await fetchAllUsers();
            allUsersData = users;
            renderAdminMode(users, getCurrentUser());
        } else {
            if (errorEl) {
                errorEl.style.display = 'block';
                errorEl.textContent = result.message || 'Invalid password. Please try again.';
            }
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.focus();
            }
        }
    }

    // ===== HANDLE LOGOUT =====
    function handleLogout() {
        sessionStorage.removeItem('rxSession');
        sessionStorage.removeItem('rxPageState');
        localStorage.removeItem('currentUser');
        
        isAdminModeActive = false;
        currentMode = 'user';
        adminPasswordVerified = false;
        selectedUserId = null;
        isEditMode = false;
        isResourceEditMode = false;
        currentEditingUser = null;
        
        if (window.UserSession) {
            window.UserSession.updateAccess([], {});
        }
        
        const event = new Event('userLoggedOut');
        document.dispatchEvent(event);
        renderLoginRequired();
    }

    // ===== START AUTO REFRESH =====
    function startAutoRefresh() {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
        }
        
        autoRefreshInterval = setInterval(async () => {
            if (isAdminModeActive) {
                await refreshAllUsers();
            } else {
                await refreshUserAccess();
            }
        }, 300000);
    }

    // ===== HANDLE WINDOW RESIZE =====
    function handleResize() {
        if (isAdminModeActive && allUsersData.length > 0) {
            renderAdminMode(allUsersData, getCurrentUser());
        }
    }

    // ===== INITIALIZE =====
    async function init() {
        if (isInitialized) {
            console.log('ℹ️ Resource Manager already initialized');
            return;
        }

        console.log('🚀 Initializing RX-RESOURCE-MANAGER...');

        const displayArea = document.getElementById('rx-display-area');
        if (!displayArea) {
            console.log('ℹ️ No display area found, skipping init');
            return;
        }

        if (!displayArea.querySelector('.rx-resource-manager')) {
            console.log('ℹ️ Resource manager content not loaded, skipping init');
            return;
        }

        if (!isUserLoggedIn()) {
            console.log('ℹ️ User not logged in, showing login required');
            renderLoginRequired();
            isInitialized = true;
            return;
        }

        const initialized = initSupabase();
        
        if (initialized) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (isUserLoggedIn()) {
                await refreshUserAccess();
            }
            
            startAutoRefresh();
            isInitialized = true;
            console.log('✅ RX-RESOURCE-MANAGER initialized successfully');
        } else {
            renderLoginRequired();
            isInitialized = true;
        }
    }

    // ===== RESET INITIALIZATION =====
    function resetInit() {
        isInitialized = false;
        console.log('🔄 Resource Manager reset for re-initialization');
    }

    // ===== EVENT LISTENERS =====
    document.addEventListener('userLoggedIn', function() {
        setTimeout(() => {
            isAdminModeActive = false;
            currentMode = 'user';
            adminPasswordVerified = false;
            selectedUserId = null;
            isEditMode = false;
            isResourceEditMode = false;
            currentEditingUser = null;
            refreshUserAccess();
        }, 1000);
    });

    document.addEventListener('userLoggedOut', function() {
        isAdminModeActive = false;
        currentMode = 'user';
        adminPasswordVerified = false;
        selectedUserId = null;
        isEditMode = false;
        isResourceEditMode = false;
        currentEditingUser = null;
        if (window.UserSession) {
            window.UserSession.updateAccess([], {});
        }
        renderLoginRequired();
    });

    window.addEventListener('resize', handleResize);

    // ===== EXPOSE GLOBALLY =====
    window.RXResourceManager = {
        init: init,
        resetInit: resetInit,
        refreshUserAccess: refreshUserAccess,
        refreshAllUsers: refreshAllUsers,
        selectUser: selectUser,
        filterUsers: filterUsers,
        filterUsersMobile: filterUsersMobile,
        switchToAdminMode: switchToAdminMode,
        switchToUserMode: switchToUserMode,
        verifyAndEnterAdmin: verifyAndEnterAdmin,
        showAdminPasswordPopup: showAdminPasswordPopup,
        handleLogout: handleLogout,
        renderUserMode: renderUserMode,
        renderAdminMode: renderAdminMode,
        renderLoginRequired: renderLoginRequired,
        showEditProfile: showEditProfile,
        showEditResources: showEditResources,
        cancelEdit: cancelEdit,
        saveUserEdit: saveUserEdit,
        addUserAccess: addUserAccess,
        addResourceToUser: addResourceToUser,
        removeUserAccess: removeUserAccess,
        renderUserDetail: renderUserDetail,
        getRemainingDays: getRemainingDays,
        isAccessExpired: isAccessExpired,
        selectedUserId: selectedUserId,
        allUsersData: allUsersData,
        getCurrentUser: getCurrentUser,
        isUserLoggedIn: isUserLoggedIn,
        isInitialized: isInitialized,
        handleResize: handleResize
    };

    window.handleLogout = handleLogout;

    // ===== AUTO-INIT =====
    function checkAndInit() {
        const displayArea = document.getElementById('rx-display-area');
        if (displayArea && displayArea.querySelector('.rx-resource-manager')) {
            init();
        } else {
            console.log('ℹ️ Resource manager not active, skipping auto-init');
            resetInit();
        }
    }

    const observer = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].type === 'childList') {
                var displayArea = document.getElementById('rx-display-area');
                if (displayArea && displayArea.querySelector('.rx-resource-manager') && !isInitialized) {
                    console.log('🔄 Resource manager detected, initializing...');
                    init();
                    break;
                }
            }
        }
    });

    var displayArea = document.getElementById('rx-display-area');
    if (displayArea) {
        observer.observe(displayArea, { childList: true, subtree: true });
    } else {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndInit);
    } else {
        checkAndInit();
    }

    console.log('✅ RX-RESOURCE-MANAGER.js loaded');
})();