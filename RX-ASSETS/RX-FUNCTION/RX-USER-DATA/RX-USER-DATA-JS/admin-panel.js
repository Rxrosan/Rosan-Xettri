// ===== ADMIN PANEL MODULE (Fully Secured, All Users List & Responsive) =====
(function () {
    'use strict';

    // 1. Inject Admin Panel CSS (Responsive for PC and Mobile)
    const injectAdminCSS = () => {
        if (document.getElementById('rx-admin-panel-styles')) return;

        const style = document.createElement('style');
        style.id = 'rx-admin-panel-styles';
        style.textContent = `
            .rx-admin-modal, .rx-admin-modal * { box-sizing: border-box !important; }
            .rx-admin-modal {
                display: none; position: fixed; z-index: 999999; left: 0; top: 0;
                width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px); padding: 10px; align-items: center; justify-content: center;
            }
            .rx-admin-modal .modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                color: #fff; padding: 15px; border-radius: 16px; width: 100%; max-width: 1000px;
                height: 92vh; max-height: 680px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
                position: relative; border: 1px solid rgba(255, 255, 255, 0.12); display: flex; flex-direction: column;
            }
            .rx-admin-modal .close {
                position: absolute; right: 12px; top: 12px; color: #ffffff; font-size: 22px;
                font-weight: bold; cursor: pointer; width: 32px; height: 32px; display: flex;
                align-items: center; justify-content: center; border-radius: 50%; background: rgba(255, 255, 255, 0.1);
            }
            .rx-admin-modal .close:hover { background: rgba(255, 255, 255, 0.2); }
            .admin-panel-title {
                text-align: center; margin-top: 0; margin-bottom: 12px; font-size: clamp(1rem, 2vw, 1.3rem);
                font-weight: 700; color: #4facfe; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 8px;
            }
            .admin-container { display: flex; flex-direction: row; gap: 12px; flex: 1; min-height: 0; overflow: hidden; }
            .admin-sidebar {
                width: 270px; min-width: 230px; background: rgba(255, 255, 255, 0.04);
                border-radius: 12px; padding: 10px; border: 1px solid rgba(255, 255, 255, 0.08);
                display: flex; flex-direction: column; gap: 8px;
            }
            .admin-sidebar h3 { margin: 0; font-size: 0.9rem; color: #64ffda; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 6px; }
            .search-box-container { position: relative; width: 100%; }
            .search-box-container input {
                width: 100%; padding: 7px 10px 7px 30px; background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; color: #fff; font-size: 0.8rem; outline: none;
            }
            .search-box-container input:focus { border-color: #4facfe; box-shadow: 0 0 5px rgba(79, 172, 254, 0.4); }
            .search-box-container i { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: rgba(255, 255, 255, 0.5); font-size: 0.8rem; }
            #member-list { list-style: none; padding: 0; margin: 0; overflow-y: auto; flex: 1; }
            #member-list li {
                padding: 8px; margin-bottom: 6px; border-radius: 8px; background: rgba(255, 255, 255, 0.03);
                cursor: pointer; display: flex; align-items: center; border: 1px solid rgba(255, 255, 255, 0.05);
            }
            #member-list li img { width: 35px; height: 35px; border-radius: 50%; object-fit: cover; margin-right: 8px; flex-shrink: 0; }
            #member-list li:hover { background: rgba(79, 172, 254, 0.15); border-color: rgba(79, 172, 254, 0.4); }
            #member-list li.selected { background: linear-gradient(90deg, rgba(79, 172, 254, 0.25) 0%, rgba(0, 242, 254, 0.1) 100%); border-left: 4px solid #00f2fe; }
            .user-item-info { display: flex; flex-direction: column; overflow: hidden; width: 100%; }
            .user-item-name { font-size: 0.85rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .user-item-id { font-size: 0.7rem; color: #64ffda; }
            .admin-details { flex: 1; background: rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 12px; border: 1px solid rgba(255, 255, 255, 0.08); overflow-y: auto; display: flex; flex-direction: column; }
            .admin-details h3 { margin-top: 0; font-size: 1rem; color: #4facfe; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 8px; }
            .profile-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; padding: 8px 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 10px; }
            .profile-header img { width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 2px solid #00f2fe; }
            .user-info h4 { margin: 0; font-size: 0.95rem; font-weight: 600; color: #fff; }
            .user-info p { margin: 2px 0 0 0; font-size: 0.68rem; color: #64ffda; background: rgba(100, 255, 218, 0.1); padding: 2px 6px; border-radius: 8px; display: inline-block; border: 1px solid rgba(100, 255, 218, 0.2); text-transform: uppercase; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 10px; }
            .info-item { background: rgba(0, 0, 0, 0.25); padding: 8px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); }
            .info-label { font-size: 0.7rem; color: rgba(255, 255, 255, 0.6); margin-bottom: 3px; display: flex; align-items: center; gap: 5px; }
            .info-label i { color: #4facfe; }
            .info-value { font-size: 0.8rem; font-weight: 500; color: #fff; word-break: break-all; }
            .no-user-selected { display: flex; align-items: center; justify-content: center; flex: 1; min-height: 180px; text-align: center; color: rgba(255, 255, 255, 0.5); }

            /* Mobile Responsive Styling */
            @media screen and (max-width: 768px) {
                .rx-admin-modal { padding: 5px; }
                .rx-admin-modal .modal-content { height: 96vh; max-height: none; padding: 10px; border-radius: 10px; }
                .admin-container { flex-direction: column; gap: 8px; overflow-y: auto; }
                .admin-sidebar { width: 100%; min-width: 0; max-height: 190px; }
                .admin-details { max-height: none; }
                .info-grid { grid-template-columns: 1fr; gap: 6px; }
            }
        `;
        document.head.appendChild(style);
    };

    // 2. Inject Admin Panel HTML Modal
    const injectAdminHTML = () => {
        if (document.getElementById('admin-panel-modal')) return;

        const modalHTML = `
            <div id="admin-panel-modal" class="rx-admin-modal">
                <div class="modal-content">
                    <span class="close" id="closeAdminModal">&times;</span>
                    <h2 class="admin-panel-title"><i class="fas fa-user-shield"></i> ADMIN PANEL - USER MANAGEMENT</h2>
                    
                    <div class="admin-container">
                        <div class="admin-sidebar">
                            <h3><i class="fas fa-users"></i> MEMBERS LIST</h3>
                            <div class="search-box-container">
                                <i class="fas fa-search"></i>
                                <input type="text" id="admin-user-search" placeholder="Search ID, Name or Email...">
                            </div>
                            <ul id="member-list"></ul>
                        </div>
                        
                        <div class="admin-details">
                            <h3 id="selected-user-header">Select Profile to View</h3>
                            
                            <div id="selected-user-details" style="display: none;">
                                <div class="profile-header">
                                    <img id="admin-profile-img" src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/T-0.jpg" alt="Profile">
                                    <div class="user-info">
                                        <h4 id="admin-full-name"></h4>
                                        <p id="admin-account-type"></p>
                                    </div>
                                </div>
                                
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label"><i class="fas fa-id-card"></i> User ID</div>
                                        <div class="info-value" id="admin-user-id"></div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label"><i class="fas fa-user"></i> Name / Username</div>
                                        <div class="info-value" id="admin-username"></div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label"><i class="fas fa-envelope"></i> Email</div>
                                        <div class="info-value" id="admin-email"></div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label"><i class="fas fa-phone"></i> Phone</div>
                                        <div class="info-value" id="admin-phone"></div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label"><i class="fas fa-map-marker-alt"></i> Address</div>
                                        <div class="info-value" id="admin-address"></div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label"><i class="fas fa-calendar-alt"></i> Date of Birth</div>
                                        <div class="info-value" id="admin-dob"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="no-user-selected" class="no-user-selected">
                                <div>
                                    <i class="fas fa-mouse-pointer" style="font-size: 1.8rem; color: #4facfe; margin-bottom: 8px;"></i>
                                    <p style="font-size: 0.85rem;">Select a profile from list to view full details</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    };

    // Helper: वास्तविक एडमिन हो/होइन जाँच्ने
    const checkIsLoggedInAdmin = () => {
        try {
            const sessionData = sessionStorage.getItem("rxSession") || localStorage.getItem("rxSession");
            if (!sessionData) return false;
            const user = JSON.parse(sessionData);
            const role = String(user.role || '').trim().toLowerCase();
            return role === 'admin';
        } catch (e) {
            return false;
        }
    };

    // एडमिन लिङ्क भिजिबिलिटी नियन्त्रण गर्ने
    const toggleAdminLinkVisibility = () => {
        const adminLink = document.getElementById('admin-settings-link');
        if (adminLink) {
            if (checkIsLoggedInAdmin()) {
                adminLink.style.display = 'block';
            } else {
                adminLink.style.display = 'none';
            }
        }
    };

    // 3. Admin Manager Logic
    const AdminPanelManager = (() => {
        let fetchedUsers = [];
        let selectedUserId = null;

        const fetchAllUsers = async () => {
            const memberListUl = document.getElementById('member-list');
            if (memberListUl) {
                memberListUl.innerHTML = `<li style="justify-content:center; color:#64ffda; font-size:0.8rem;">Fetching all users...</li>`;
            }

            try {
                const client = window.supabaseClient || window.supabase;

                if (client && typeof client.from === 'function') {
                    const { data, error } = await client
                        .from('users')
                        .select('*')
                        .order('id', { ascending: true });

                    if (error) throw error;
                    fetchedUsers = data || [];
                } else {
                    const activeSession = sessionStorage.getItem("rxSession") || localStorage.getItem("rxSession");
                    if (activeSession) {
                        fetchedUsers = [JSON.parse(activeSession)];
                    }
                }
            } catch (err) {
                console.error("Error loading users from Supabase:", err);
            }
        };

        const renderMemberList = (filterQuery = '') => {
            const memberListUl = document.getElementById('member-list');
            if (!memberListUl) return;

            memberListUl.innerHTML = '';
            const query = filterQuery.toLowerCase().trim();

            const filteredUsers = fetchedUsers.filter(user => {
                if (!query) return true;
                const userId = String(user.id || '').toLowerCase();
                const userName = String(user.name || '').toLowerCase();
                const userEmail = String(user.email || '').toLowerCase();

                return userId.includes(query) || userName.includes(query) || userEmail.includes(query);
            });

            if (filteredUsers.length === 0) {
                memberListUl.innerHTML = `<li style="justify-content:center; color:rgba(255,255,255,0.5); cursor:default; font-size: 0.75rem;">No users found</li>`;
                
                const details = document.getElementById('selected-user-details');
                const noUser = document.getElementById('no-user-selected');
                if (details) details.style.display = 'none';
                if (noUser) noUser.style.display = 'flex';
                return;
            }

            filteredUsers.forEach(user => {
                const li = document.createElement('li');
                li.dataset.userId = user.id;
                li.title = `${user.name || 'User'} (ID: ${user.id})`;

                const userAvatar = user.avatar_url || 'RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/T-0.jpg';
                const userNameText = user.name || user.email || 'User';

                li.innerHTML = `
                    <img src="${userAvatar}" alt="${userNameText}" onerror="this.src='RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/T-0.jpg'">
                    <div class="user-item-info">
                        <span class="user-item-name">${userNameText}</span>
                        <span class="user-item-id">ID: ${user.id}</span>
                    </div>
                `;
                li.addEventListener('click', () => selectUser(user.id));
                memberListUl.appendChild(li);
            });

            if (filteredUsers.length > 0 && !selectedUserId) {
                selectUser(filteredUsers[0].id);
            }
        };

        const displayUserDetails = (userId) => {
            const user = fetchedUsers.find(u => String(u.id) === String(userId));
            const details = document.getElementById('selected-user-details');
            const noUser = document.getElementById('no-user-selected');
            const header = document.getElementById('selected-user-header');

            if (!user) {
                if (header) header.textContent = 'User not found.';
                if (details) details.style.display = 'none';
                if (noUser) noUser.style.display = 'flex';
                return;
            }

            selectedUserId = user.id;

            if (header) header.textContent = `Details for ${user.name || 'User'}`;
            if (details) details.style.display = 'block';
            if (noUser) noUser.style.display = 'none';

            document.getElementById('admin-user-id').textContent = user.id || 'N/A';
            document.getElementById('admin-full-name').textContent = user.name || 'N/A';
            document.getElementById('admin-username').textContent = user.name || 'N/A';
            document.getElementById('admin-email').textContent = user.email || 'N/A';
            document.getElementById('admin-phone').textContent = user.phone || 'N/A';
            document.getElementById('admin-address').textContent = user.address || 'N/A';
            document.getElementById('admin-account-type').textContent = user.role || 'USER';
            document.getElementById('admin-dob').textContent = user.dob || 'Not Set';
            
            const profileImg = document.getElementById('admin-profile-img');
            if (profileImg) {
                profileImg.src = user.avatar_url || 'RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/T-0.jpg';
            }

            document.querySelectorAll('#member-list li').forEach(item => {
                if (String(item.dataset.userId) === String(userId)) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        };

        const selectUser = (userId) => {
            displayUserDetails(userId);
        };

        const openAdminPanel = async () => {
            if (!checkIsLoggedInAdmin()) {
                alert('Access Denied: Only Admin can open this panel!');
                return;
            }

            const modal = document.getElementById('admin-panel-modal');
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }

            const searchInput = document.getElementById('admin-user-search');
            if (searchInput) searchInput.value = '';

            selectedUserId = null;
            await fetchAllUsers();
            renderMemberList();
        };

        const closeAdminPanel = () => {
            const modal = document.getElementById('admin-panel-modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };

        return { openAdminPanel, closeAdminPanel, renderMemberList, toggleAdminLinkVisibility };
    })();

    // 4. Attach Events on DOM Load
    document.addEventListener('DOMContentLoaded', () => {
        injectAdminCSS();
        injectAdminHTML();

        AdminPanelManager.toggleAdminLinkVisibility();

        const closeBtn = document.getElementById('closeAdminModal');
        if (closeBtn) closeBtn.addEventListener('click', AdminPanelManager.closeAdminPanel);

        const adminLink = document.getElementById('admin-settings-link');
        if (adminLink) {
            adminLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (checkIsLoggedInAdmin()) {
                    AdminPanelManager.openAdminPanel();
                } else {
                    alert('Unauthorized access!');
                    adminLink.style.display = 'none';
                }
            });
        }

        const searchInput = document.getElementById('admin-user-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                AdminPanelManager.renderMemberList(e.target.value);
            });
        }
    });

    window.AdminPanelManager = AdminPanelManager;
})();