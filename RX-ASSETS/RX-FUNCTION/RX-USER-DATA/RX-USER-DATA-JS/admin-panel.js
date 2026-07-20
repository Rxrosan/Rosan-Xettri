// ===== ADMIN PANEL MODULE (Dynamic User ID Visibility on Search) =====
(function () {
    // 1. Inject Admin Panel CSS
    const injectAdminCSS = () => {
        if (document.getElementById('rx-admin-panel-styles')) return;

        const style = document.createElement('style');
        style.id = 'rx-admin-panel-styles';
        style.textContent = `
            /* Global Box Sizing Reset for Modal */
            .rx-admin-modal,
            .rx-admin-modal * {
                box-sizing: border-box !important;
            }

            /* Modal Backdrop - Flex Centered */
            .rx-admin-modal {
                display: none;
                position: fixed;
                z-index: 999999;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                padding: 15px;
                align-items: center;
                justify-content: center;
            }

            /* Modal Content Container */
            .rx-admin-modal .modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                color: #fff;
                padding: 20px;
                border-radius: 16px;
                width: 100%;
                max-width: 1000px;
                height: 90vh;
                max-height: 650px;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
                position: relative;
                border: 1px solid rgba(255, 255, 255, 0.12);
                display: flex;
                flex-direction: column;
                margin: auto;
            }

            /* Static Close Button */
            .rx-admin-modal .close {
                position: absolute;
                right: 15px;
                top: 15px;
                color: #ffffff;
                font-size: 22px;
                font-weight: bold;
                cursor: pointer;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                z-index: 10;
                user-select: none;
                transition: none !important;
                animation: none !important;
                transform: none !important;
            }

            .rx-admin-modal .close:hover {
                background: rgba(255, 255, 255, 0.1) !important;
                transform: none !important;
            }

            .admin-panel-title {
                text-align: center;
                margin-top: 0;
                margin-bottom: 15px;
                font-size: clamp(1.1rem, 2.5vw, 1.4rem);
                font-weight: 700;
                color: #4facfe;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 10px;
                padding-right: 35px;
            }

            /* Main Flexible Grid Layout */
            .admin-container {
                display: flex;
                flex-direction: row;
                gap: 15px;
                flex: 1;
                min-height: 0;
                overflow: hidden;
            }

            /* Sidebar & Search Box */
            .admin-sidebar {
                width: 280px;
                min-width: 250px;
                background: rgba(255, 255, 255, 0.04);
                border-radius: 12px;
                padding: 12px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .admin-sidebar h3 {
                margin: 0;
                font-size: 0.95rem;
                color: #64ffda;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 8px;
            }

            /* Search Box Style */
            .search-box-container {
                position: relative;
                width: 100%;
            }

            .search-box-container input {
                width: 100%;
                padding: 8px 12px 8px 32px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                color: #fff;
                font-size: 0.85rem;
                outline: none;
            }

            .search-box-container input:focus {
                border-color: #4facfe;
                box-shadow: 0 0 5px rgba(79, 172, 254, 0.4);
            }

            .search-box-container i {
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: rgba(255, 255, 255, 0.5);
                font-size: 0.8rem;
            }

            /* Scrollable Member List */
            #member-list {
                list-style: none;
                padding: 0;
                margin: 0;
                overflow-y: auto;
                flex: 1;
            }

            #member-list li {
                padding: 10px;
                margin-bottom: 8px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.03);
                cursor: pointer;
                display: flex;
                align-items: center;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            #member-list li img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
                margin-right: 10px;
            }

            #member-list li:hover {
                background: rgba(79, 172, 254, 0.15);
                border-color: rgba(79, 172, 254, 0.4);
            }

            #member-list li.selected {
                background: linear-gradient(90deg, rgba(79, 172, 254, 0.25) 0%, rgba(0, 242, 254, 0.1) 100%);
                border-left: 4px solid #00f2fe;
            }

            .user-item-info {
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .user-item-name {
                font-size: 0.85rem;
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .user-item-id {
                font-size: 0.72rem;
                color: #64ffda;
            }

            /* Details Section */
            .admin-details {
                flex: 1;
                background: rgba(255, 255, 255, 0.04);
                border-radius: 12px;
                padding: 15px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                overflow-y: auto;
                display: flex;
                flex-direction: column;
            }

            .admin-details h3 {
                margin-top: 0;
                font-size: 1.1rem;
                color: #4facfe;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 10px;
            }

            /* Profile Header Horizontal */
            .profile-header {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: flex-start !important;
                gap: 15px !important;
                margin-bottom: 12px !important;
                padding: 10px 14px !important;
                background: rgba(255, 255, 255, 0.03) !important;
                border: 1px solid rgba(255, 255, 255, 0.06) !important;
                border-radius: 10px !important;
                text-align: left !important;
            }

            .profile-header img {
                width: 50px !important;
                height: 50px !important;
                min-width: 50px !important;
                min-height: 50px !important;
                border-radius: 50% !important;
                object-fit: cover !important;
                object-position: center !important;
                border: 2px solid #00f2fe !important;
                margin: 0 !important;
                flex-shrink: 0 !important;
            }

            .user-info {
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-start !important;
                justify-content: center !important;
                gap: 2px !important;
            }

            .user-info h4 {
                margin: 0 !important;
                font-size: 1rem !important;
                font-weight: 600 !important;
                color: #fff !important;
            }

            .user-info p {
                margin: 0 !important;
                font-size: 0.72rem !important;
                color: #64ffda !important;
                background: rgba(100, 255, 218, 0.1) !important;
                padding: 2px 8px !important;
                border-radius: 10px !important;
                display: inline-block !important;
                border: 1px solid rgba(100, 255, 218, 0.2) !important;
                text-transform: uppercase !important;
                letter-spacing: 0.5px !important;
            }

            /* Info Grid - 2 Column Default */
            .info-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-bottom: 15px;
            }

            .info-item {
                background: rgba(0, 0, 0, 0.25);
                padding: 10px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            .info-label {
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.6);
                margin-bottom: 4px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .info-label i {
                color: #4facfe;
            }

            .info-value {
                font-size: 0.85rem;
                font-weight: 500;
                color: #fff;
                word-break: break-all;
            }

            /* Access Files Section & Table */
            .access-files-section {
                margin-top: auto;
                background: rgba(0, 0, 0, 0.25);
                padding: 12px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            .access-files-section h4 {
                margin-top: 0;
                color: #64ffda;
                margin-bottom: 10px;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .rx-access-table-wrapper {
                overflow-x: auto;
                width: 100%;
            }

            .rx-access-table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
                font-size: 0.78rem;
            }

            .rx-access-table th {
                background: rgba(255, 255, 255, 0.05);
                color: #4facfe;
                padding: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                font-weight: 600;
                white-space: nowrap;
            }

            .rx-access-table td {
                padding: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.04);
                color: #fff;
                white-space: nowrap;
            }

            /* Custom Dynamic Badges */
            .badge-permanent {
                background: rgba(0, 242, 254, 0.12);
                color: #00f2fe;
                border: 1px solid rgba(0, 242, 254, 0.3);
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 600;
            }

            .badge-temporary {
                background: rgba(255, 193, 7, 0.12);
                color: #ffc107;
                border: 1px solid rgba(255, 193, 7, 0.3);
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 600;
            }

            .badge-active {
                background: rgba(46, 213, 115, 0.15);
                color: #2ed573;
                border: 1px solid rgba(46, 213, 115, 0.3);
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 600;
            }

            .badge-expired {
                background: rgba(255, 71, 87, 0.15);
                color: #ff4757;
                border: 1px solid rgba(255, 71, 87, 0.3);
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 600;
            }

            .no-user-selected {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
                min-height: 200px;
                text-align: center;
                color: rgba(255, 255, 255, 0.5);
            }

            /* Scrollbar styling */
            #member-list::-webkit-scrollbar,
            .admin-details::-webkit-scrollbar,
            .rx-access-table-wrapper::-webkit-scrollbar {
                width: 5px;
                height: 5px;
            }
            #member-list::-webkit-scrollbar-thumb,
            .admin-details::-webkit-scrollbar-thumb,
            .rx-access-table-wrapper::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
            }

            /* Mobile Layout Styles */
            @media (max-width: 768px) {
                .rx-admin-modal .modal-content {
                    height: 95vh;
                    max-height: none;
                    padding: 12px;
                }

                .admin-container {
                    flex-direction: column;
                    gap: 10px;
                    overflow-y: auto;
                }

                .admin-sidebar {
                    width: 100%;
                    min-width: 100%;
                    padding: 8px;
                    flex-direction: column;
                    gap: 8px;
                }

                .admin-sidebar h3 {
                    display: none;
                }

                .search-box-container {
                    width: 100%;
                }

                .search-box-container input {
                    padding: 8px 12px 8px 32px;
                    font-size: 0.8rem;
                }

                #member-list {
                    display: flex !important;
                    flex-direction: row !important;
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    gap: 12px !important;
                    align-items: center !important;
                    width: 100% !important;
                    padding: 8px 4px !important;
                }

                .user-item-info {
                    display: none !important;
                }

                #member-list li {
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    border: none !important;
                    background: transparent !important;
                    width: 48px !important;
                    height: 48px !important;
                    min-width: 48px !important;
                    min-height: 48px !important;
                    flex-shrink: 0 !important;
                }

                #member-list li img {
                    width: 48px !important;
                    height: 48px !important;
                    min-width: 48px !important;
                    min-height: 48px !important;
                    max-width: 48px !important;
                    max-height: 48px !important;
                    border-radius: 50% !important;
                    object-fit: cover !important;
                    object-position: center !important;
                    display: block !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: 2px solid rgba(255, 255, 255, 0.25) !important;
                    transition: all 0.2s ease;
                }

                #member-list li.selected img {
                    border: 2.5px solid #00f2fe !important;
                    box-shadow: 0 0 10px rgba(0, 242, 254, 0.9) !important;
                    transform: scale(1.05);
                }

                .admin-details {
                    overflow-y: visible;
                    padding: 10px;
                }

                .info-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 8px;
                }

                .info-item {
                    padding: 8px;
                }

                .info-label {
                    font-size: 0.7rem;
                }

                .info-value {
                    font-size: 0.78rem;
                }

                .profile-header {
                    gap: 12px !important;
                    padding: 8px 10px !important;
                    margin-bottom: 10px !important;
                }

                .profile-header img {
                    width: 42px !important;
                    height: 42px !important;
                    min-width: 42px !important;
                    min-height: 42px !important;
                }

                .user-info h4 {
                    font-size: 0.9rem !important;
                }

                .user-info p {
                    font-size: 0.68rem !important;
                    padding: 1px 6px !important;
                }
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
                    <h2 class="admin-panel-title"><i class="fas fa-user-shield"></i> ADMIN PANEL</h2>
                    
                    <div class="admin-container">
                        <div class="admin-sidebar">
                            <h3><i class="fas fa-users"></i> MEMBERS LIST</h3>
                            
                            <div class="search-box-container">
                                <i class="fas fa-search"></i>
                                <input type="text" id="admin-user-search" placeholder="Search ID or Name...">
                            </div>

                            <ul id="member-list"></ul>
                        </div>
                        
                        <div class="admin-details">
                            <h3 id="selected-user-header">Select Profile to View</h3>
                            
                            <div id="selected-user-details" style="display: none;">
                                <div class="profile-header">
                                    <img id="admin-profile-img" src="" alt="Profile">
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
                                        <div class="info-label"><i class="fas fa-user"></i> Username</div>
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
                                
                                <div class="access-files-section">
                                    <h4><i class="fas fa-folder-open"></i> ACCESS FILES</h4>
                                    <div id="access-files-container"></div>
                                </div>
                            </div>
                            
                            <div id="no-user-selected" class="no-user-selected">
                                <div>
                                    <i class="fas fa-mouse-pointer" style="font-size: 2rem; color: #4facfe; margin-bottom: 10px;"></i>
                                    <p>Select a profile from list to view details</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    };

    // 3. Smart Parser: Permanent र Timed Access दुवै निष्कासन गर्ने
    const extractUserAccessFiles = (user) => {
        let fileList = [];
        const now = Date.now();

        if (!user) return fileList;

        // १. Permanent Access (user.access)
        if (Array.isArray(user.access)) {
            user.access.forEach(item => {
                if (item) {
                    fileList.push({
                        id: String(item),
                        type: 'PERMANENT',
                        status: 'PERMANENT',
                        remark: 'Permanent'
                    });
                }
            });
        }

        // २. Timed Access Configuration Parser (user.timedAccessConfig)
        const timedConfigs = user.timedAccessConfig || user.timedAccess || user.tempAccessConfig;
        if (timedConfigs && typeof timedConfigs === 'object') {
            Object.keys(timedConfigs).forEach(fileId => {
                const config = timedConfigs[fileId];

                // Check if already parsed as Permanent
                if (!fileList.some(f => f.id === String(fileId))) {
                    if (config && typeof config === 'object') {
                        let expTime = null;

                        // Calculate expiry from startDate + duration
                        if (config.startDate && config.duration) {
                            const startMs = new Date(`${config.startDate}T00:00:00Z`).getTime();
                            const durationMs = Number(config.duration) * 24 * 60 * 60 * 1000;
                            expTime = startMs + durationMs;
                        } else if (config.expiry || config.exp || config.expireDate) {
                            expTime = new Date(config.expiry || config.exp || config.expireDate).getTime();
                        }

                        if (expTime && !isNaN(expTime)) {
                            const isExpired = expTime <= now;
                            const dateStr = new Date(expTime).toISOString().split('T')[0];
                            fileList.push({
                                id: String(fileId),
                                type: 'TIMED',
                                status: isExpired ? 'EXPIRED' : 'ACTIVE',
                                remark: isExpired ? `Expired (${dateStr})` : `Exp: ${dateStr}`
                            });
                        } else {
                            fileList.push({
                                id: String(fileId),
                                type: 'TIMED',
                                status: 'ACTIVE',
                                remark: 'Timed'
                            });
                        }
                    } else if (typeof config === 'string') {
                        const expDate = new Date(config);
                        if (!isNaN(expDate.getTime())) {
                            const isExpired = expDate.getTime() <= now;
                            fileList.push({
                                id: String(fileId),
                                type: 'TIMED',
                                status: isExpired ? 'EXPIRED' : 'ACTIVE',
                                remark: isExpired ? `Expired (${expDate.toISOString().split('T')[0]})` : `Exp: ${expDate.toISOString().split('T')[0]}`
                            });
                        }
                    }
                }
            });
        }

        return fileList;
    };

    // 4. Admin Manager Logic
    const AdminPanelManager = (() => {
        let selectedUserId = null;

        const renderMemberList = (filterQuery = '') => {
            const memberListUl = document.getElementById('member-list');
            if (!memberListUl) return;

            memberListUl.innerHTML = '';

            if (typeof allUsers === 'undefined' || !Array.isArray(allUsers)) return;

            const query = filterQuery.toLowerCase().trim();

            const filteredUsers = allUsers.filter(user => {
                if (user.accountType === "ADMIN") return false;
                if (!query) return true;

                const userId = String(user.id || '').toLowerCase();
                const fullName = String(user.fullName || '').toLowerCase();
                const userName = String(user.userName || '').toLowerCase();

                return userId.includes(query) || fullName.includes(query) || userName.includes(query);
            });

            if (filteredUsers.length === 0) {
                memberListUl.innerHTML = `<li style="justify-content:center; color:rgba(255,255,255,0.5); cursor:default; font-size: 0.75rem;">No user found</li>`;
                
                const details = document.getElementById('selected-user-details');
                const noUser = document.getElementById('no-user-selected');
                if (details) details.style.display = 'none';
                if (noUser) noUser.style.display = 'flex';
                return;
            }

            filteredUsers.forEach(user => {
                const li = document.createElement('li');
                li.dataset.userId = user.id;
                li.title = `${user.fullName} (${user.id})`;

                // यदि query empty छैन भने मात्र ID देखाउने, empty छ भने खाली नाम मात्र देखाउने
                const idDisplayHTML = query.length > 0 
                    ? `<span class="user-item-id">ID: ${user.id}</span>` 
                    : ``;

                li.innerHTML = `
                    <img src="${user.image || 'RX-ASSETS/RX-IMAGE/RX-USER/default-profile.png'}" alt="${user.fullName}">
                    <div class="user-item-info">
                        <span class="user-item-name">${user.fullName}</span>
                        ${idDisplayHTML}
                    </div>
                `;
                li.addEventListener('click', () => selectUser(user.id));
                memberListUl.appendChild(li);
            });

            const stillExists = filteredUsers.some(u => String(u.id) === String(selectedUserId));
            if (stillExists) {
                displayUserDetails(selectedUserId);
            } else if (filteredUsers.length > 0) {
                selectUser(filteredUsers[0].id);
            }
        };

        const displayUserDetails = (userId) => {
            if (typeof allUsers === 'undefined') return;
            const user = allUsers.find(u => String(u.id) === String(userId));

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

            if (header) header.textContent = `Details for ${user.fullName}`;
            if (details) details.style.display = 'block';
            if (noUser) noUser.style.display = 'none';

            // Populate User Fields
            document.getElementById('admin-user-id').textContent = user.id || 'N/A';
            document.getElementById('admin-full-name').textContent = user.fullName || 'N/A';
            document.getElementById('admin-username').textContent = user.userName || 'N/A';
            document.getElementById('admin-email').textContent = user.email || 'N/A';
            document.getElementById('admin-phone').textContent = user.phone || 'N/A';
            document.getElementById('admin-address').textContent = user.address || 'N/A';
            document.getElementById('admin-account-type').textContent = user.accountType || 'N/A';
            document.getElementById('admin-dob').textContent = user.dateOfBirth || 'Not set';
            document.getElementById('admin-profile-img').src = user.image || 'RX-ASSETS/RX-IMAGE/RX-USER/default-profile.png';

            // Extract & Display Files (Permanent + Timed)
            const accessContainer = document.getElementById('access-files-container');
            if (accessContainer) {
                const allFileItems = extractUserAccessFiles(user);

                if (allFileItems.length > 0) {
                    let rowsHTML = allFileItems.map((item, index) => {
                        let typeBadge = item.type === 'PERMANENT' 
                            ? `<span class="badge-permanent">PERMANENT</span>` 
                            : `<span class="badge-temporary">TIMED</span>`;

                        let statusBadge = item.status === 'PERMANENT' 
                            ? `<span class="badge-permanent">PERMANENT</span>`
                            : item.status === 'ACTIVE' 
                            ? `<span class="badge-active">ACTIVE</span>` 
                            : `<span class="badge-expired">EXPIRED</span>`;

                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td><strong>${item.id}</strong></td>
                                <td>${typeBadge}</td>
                                <td>${statusBadge}</td>
                                <td><span style="font-size: 0.8rem; color: rgba(255,255,255,0.85);">${item.remark}</span></td>
                            </tr>
                        `;
                    }).join('');

                    accessContainer.innerHTML = `
                        <div class="rx-access-table-wrapper">
                            <table class="rx-access-table">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>File ID</th>
                                        <th>Access Type</th>
                                        <th>Status</th>
                                        <th>Action/Remaining</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rowsHTML}
                                </tbody>
                            </table>
                        </div>
                    `;
                } else {
                    accessContainer.innerHTML = `<p style="margin:0; color: rgba(255,255,255,0.5); font-size: 0.8rem; font-style: italic;">No access files available for this user.</p>`;
                }
            }

            // Highlight selected list item
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

        const openAdminPanel = () => {
            const modal = document.getElementById('admin-panel-modal');
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }

            const searchInput = document.getElementById('admin-user-search');
            if (searchInput) searchInput.value = '';

            selectedUserId = null;
            renderMemberList();
        };

        const closeAdminPanel = () => {
            const modal = document.getElementById('admin-panel-modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };

        return { openAdminPanel, closeAdminPanel, renderMemberList };
    })();

    // 5. Attach Events on DOM Load
    document.addEventListener('DOMContentLoaded', () => {
        injectAdminCSS();
        injectAdminHTML();

        // Close button click
        const closeBtn = document.getElementById('closeAdminModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', AdminPanelManager.closeAdminPanel);
        }

        // Admin Link Click
        const adminLink = document.getElementById('admin-settings-link');
        if (adminLink) {
            adminLink.addEventListener('click', (e) => {
                e.preventDefault();
                AdminPanelManager.openAdminPanel();
            });
        }

        // Realtime Search Input & Clear Event
        const searchInput = document.getElementById('admin-user-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                AdminPanelManager.renderMemberList(e.target.value);
            });
        }
    });

    window.AdminPanelManager = AdminPanelManager;
})();