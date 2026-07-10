        // Wait for DOM to load and user.js to initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Override AdminPanelManager to ensure it works
            if (typeof AdminPanelManager !== 'undefined') {
                // Store original openAdminPanel
                const originalOpenAdminPanel = AdminPanelManager.openAdminPanel;
                
                // Override with working version
                AdminPanelManager.openAdminPanel = function() {
                    const currentUser = UserManager.getCurrentUser();
                    if (currentUser && currentUser.accountType === "ADMIN") {
                        renderMemberList();
                        document.getElementById('selected-user-header').innerHTML = 'Select a Member to View Details';
                        document.getElementById('selected-user-details').style.display = 'none';
                        document.getElementById('no-user-selected').style.display = 'flex';
                        
                        // Remove selected class from all list items
                        document.querySelectorAll('#member-list li').forEach(item => {
                            item.classList.remove('selected');
                        });
                        
                        const modal = document.getElementById('admin-panel-modal');
                        if (modal) {
                            modal.style.display = 'block';
                            document.body.style.overflow = 'hidden';
                        }
                    } else {
                        if (typeof NotificationManager !== 'undefined') {
                            NotificationManager.showNotification("Access Denied", "You do not have administrative privileges.", "danger", 4000);
                        }
                    }
                };
                
                // Add close method
                AdminPanelManager.closeAdminPanel = function() {
                    const modal = document.getElementById('admin-panel-modal');
                    if (modal) {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                };
            }
            
            // Function to render member list
            window.renderMemberList = function() {
                const memberListUl = document.getElementById('member-list');
                if (!memberListUl) return;
                
                memberListUl.innerHTML = '';

                // Use the global allUsers array from user.js
                if (typeof allUsers !== 'undefined') {
                    allUsers.forEach(user => {
                        if (user.accountType !== "ADMIN") {
                            const li = document.createElement('li');
                            li.dataset.userId = user.id;
                            li.innerHTML = `
                                <img src="${user.image || 'RX-ASSETS/RX-IMAGE/RX-USER/default-profile.png'}" alt="${user.fullName}">
                                <span>${user.fullName} (${user.userName}) - ${user.accountType}</span>
                            `;
                            li.addEventListener('click', () => selectUser(user.id));
                            memberListUl.appendChild(li);
                        }
                    });
                }
            };

            // Function to calculate remaining days
            window.calculateRemainingDays = function(startDate, duration) {
                const start = new Date(startDate);
                const end = new Date(start);
                end.setDate(end.getDate() + duration);
                const today = new Date();
                
                const remainingTime = end - today;
                const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
                
                return remainingDays;
            };

            // Function to check if access is expired
            window.isAccessExpired = function(startDate, duration) {
                const start = new Date(startDate);
                const end = new Date(start);
                end.setDate(end.getDate() + duration);
                const today = new Date();
                
                return today > end;
            };

            // Function to format date
            window.formatDate = function(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                });
            };

            // Function to select and display user
            window.selectUser = function(userId) {
                if (typeof allUsers === 'undefined') return;
                
                const user = allUsers.find(u => u.id === userId);
                if (!user) return;

                document.getElementById('selected-user-header').innerHTML = `Details for ${user.fullName}`;
                document.getElementById('selected-user-details').style.display = 'block';
                document.getElementById('no-user-selected').style.display = 'none';

                // Update user details
                document.getElementById('admin-full-name').textContent = user.fullName || 'N/A';
                document.getElementById('admin-username').textContent = user.userName || 'N/A';
                document.getElementById('admin-email').textContent = user.email || 'N/A';
                document.getElementById('admin-phone').textContent = user.phone || 'N/A';
                document.getElementById('admin-address').textContent = user.address || 'N/A';
                document.getElementById('admin-account-type').textContent = user.accountType || 'N/A';
                document.getElementById('admin-user-id').textContent = user.id || 'N/A';
                document.getElementById('admin-dob').textContent = (user.dateOfBirth && user.dateOfBirth !== 'null') ? user.dateOfBirth : 'Not set';
                document.getElementById('admin-profile-img').src = user.image || 'RX-ASSETS/RX-IMAGE/RX-USER/default-profile.png';

                // Create access files table
                const accessContainer = document.getElementById('access-files-container');
                let tableHTML = '';

                // Collect all files with their access types
                const accessFiles = [];

                // Add permanent access files
                if (user.access && user.access.length > 0) {
                    user.access.forEach(fileId => {
                        accessFiles.push({
                            id: fileId,
                            type: 'permanent',
                            startDate: null,
                            duration: null
                        });
                    });
                }

                // Add timed access files
                if (user.timedAccessConfig && Object.keys(user.timedAccessConfig).length > 0) {
                    Object.entries(user.timedAccessConfig).forEach(([fileId, config]) => {
                        accessFiles.push({
                            id: fileId,
                            type: 'timed',
                            startDate: config.startDate,
                            duration: config.duration
                        });
                    });
                }

                if (accessFiles.length > 0) {
                    tableHTML = `
                        <table class="access-files-table">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>File ID</th>
                                    <th>Access Type</th>
                                    <th>Status</th>
                                    <th>Action / Remaining</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    accessFiles.forEach((file, index) => {
                        const sn = index + 1;
                        const fileId = file.id;
                        
                        // Access Type Badge
                        let typeBadge = '';
                        if (file.type === 'permanent') {
                            typeBadge = '<span class="access-type-badge permanent">PERMANENT</span>';
                        } else {
                            typeBadge = '<span class="access-type-badge timed">TIMED</span>';
                        }

                        // Status and Action
                        let statusBadge = '';
                        let actionHtml = '';

                        if (file.type === 'permanent') {
                            statusBadge = '<span class="status-badge permanent">PERMANENT</span>';
                            actionHtml = '<span class="remaining-days permanent"><i class="fas fa-infinity"></i> Permanent</span>';
                        } else {
                            const expired = isAccessExpired(file.startDate, file.duration);
                            if (expired) {
                                statusBadge = '<span class="status-badge expired">EXPIRED</span>';
                                actionHtml = '<span class="remaining-days expired"><i class="fas fa-times-circle"></i> Expired</span>';
                            } else {
                                const remainingDays = calculateRemainingDays(file.startDate, file.duration);
                                statusBadge = '<span class="status-badge active">ACTIVE</span>';
                                actionHtml = `
                                    <span class="remaining-days">
                                        <i class="fas fa-clock"></i> ${remainingDays} days left
                                        <small>(${formatDate(file.startDate)})</small>
                                    </span>
                                `;
                            }
                        }

                        tableHTML += `
                            <tr>
                                <td>${sn}</td>
                                <td class="file-id-cell">${fileId}</td>
                                <td>${typeBadge}</td>
                                <td>${statusBadge}</td>
                                <td>${actionHtml}</td>
                            </tr>
                        `;
                    });

                    tableHTML += `
                            </tbody>
                        </table>
                    `;
                } else {
                    tableHTML = `
                        <div class="no-files">
                            <i class="fas fa-folder-open"></i> No access files found for this user
                        </div>
                    `;
                }

                accessContainer.innerHTML = tableHTML;

                // Update selected class in sidebar
                document.querySelectorAll('#member-list li').forEach(item => {
                    item.classList.remove('selected');
                    if (item.dataset.userId === userId) {
                        item.classList.add('selected');
                    }
                });
            };

            // Override closeModal function
            window.closeModal = function() {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
                document.body.style.overflow = 'auto';
            };

            // Ensure admin link click works
            const adminLink = document.getElementById('admin-settings-link');
            if (adminLink) {
                adminLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (typeof AdminPanelManager !== 'undefined') {
                        AdminPanelManager.openAdminPanel();
                    }
                });
            }
        });