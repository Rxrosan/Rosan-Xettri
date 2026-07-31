(function() {
    'use strict';

    const SUPABASE_URL = "https://xorxoovezlgqcaeyqpdp.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_5_yPXUnjJVe3dy13X5nkXQ_afJ7rCvM";
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Side Panel Toggle Logic
    const openSidePanelBtn = document.getElementById('openSidePanelBtn');
    const closePanelBtn = document.getElementById('closePanel');
    const sidePanel = document.getElementById('sidePanel');
    const panelOverlay = document.getElementById('panelOverlay');
    const panelLogoutItem = document.getElementById('panelLogoutItem');
    const sidePanelLogoutBtn = document.getElementById('sidePanelLogoutBtn');

    if (openSidePanelBtn) {
        openSidePanelBtn.addEventListener('click', () => {
            sidePanel.classList.add('active');
            panelOverlay.classList.add('active');
        });
    }

    if (closePanelBtn) closePanelBtn.addEventListener('click', closePanel);
    if (panelOverlay) panelOverlay.addEventListener('click', closePanel);

    function closePanel() {
        if (sidePanel) sidePanel.classList.remove('active');
        if (panelOverlay) panelOverlay.classList.remove('active');
    }

    document.addEventListener('DOMContentLoaded', async function() {
        // Tab switching elements
        const tabUsersBtn = document.getElementById('tabUsersBtn');
        const tabSettingsBtn = document.getElementById('tabSettingsBtn');
        const sectionUserManagement = document.getElementById('sectionUserManagement');
        const sectionSystemSettings = document.getElementById('sectionSystemSettings');

        if (tabUsersBtn && tabSettingsBtn) {
            tabUsersBtn.addEventListener('click', () => {
                tabUsersBtn.classList.add('active');
                tabSettingsBtn.classList.remove('active');
                if (sectionUserManagement) sectionUserManagement.style.display = 'grid';
                if (sectionSystemSettings) sectionSystemSettings.style.display = 'none';
            });

            tabSettingsBtn.addEventListener('click', () => {
                tabSettingsBtn.classList.add('active');
                tabUsersBtn.classList.remove('active');
                if (sectionSystemSettings) sectionSystemSettings.style.display = 'block';
                if (sectionUserManagement) sectionUserManagement.style.display = 'none';
            });
        }

        // System Settings Save handler simulation
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        const settingsFormStatus = document.getElementById('settingsFormStatus');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                settingsFormStatus.textContent = 'Saving system configurations...';
                settingsFormStatus.className = 'status-msg';
                setTimeout(() => {
                    settingsFormStatus.textContent = 'System settings updated successfully!';
                    settingsFormStatus.className = 'status-msg success';
                }, 600);
            });
        }

        const adminLoginModal = document.getElementById('adminLoginModal');
        const submitAdminLoginBtn = document.getElementById('submitAdminLoginBtn');
        const loginEmailInput = document.getElementById('loginEmailInput');
        const loginPasswordInput = document.getElementById('loginPasswordInput');
        const loginModalStatus = document.getElementById('loginModalStatus');

        const userListContainer = document.getElementById('userListContainer');
        const userSearchInput = document.getElementById('userSearchInput');
        const editUserId = document.getElementById('editUserId');
        const editName = document.getElementById('editName');
        const editEmail = document.getElementById('editEmail');
        const editPhone = document.getElementById('editPhone');
        const editAddress = document.getElementById('editAddress');
        const editRole = document.getElementById('editRole');
        const editDob = document.getElementById('editDob');
        const editIdDisplay = document.getElementById('editIdDisplay');
        
        const previewName = document.getElementById('previewName');
        const previewEmail = document.getElementById('previewEmail');
        const adminAvatarBox = document.getElementById('adminAvatarBox');
        const activeRoleBadge = document.getElementById('activeRoleBadge');

        const enableEditBtn = document.getElementById('enableEditBtn');
        const updateUserBtn = document.getElementById('updateUserBtn');
        const openDeleteModalBtn = document.getElementById('openDeleteModalBtn');
        const adminFormStatus = document.getElementById('adminFormStatus');

        const adminDeleteModal = document.getElementById('adminDeleteModal');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const adminAuthPassword = document.getElementById('adminAuthPassword');
        const modalStatus = document.getElementById('modalStatus');

        let allUsers = [];
        let selectedUser = null;
        let currentUser = null;

        function checkSession() {
            const sessionData = sessionStorage.getItem('rxSession');
            if (sessionData) {
                try {
                    currentUser = JSON.parse(sessionData);
                    if (currentUser.role && currentUser.role.toUpperCase() === 'ADMIN') {
                        if (adminLoginModal) adminLoginModal.style.display = 'none';
                        if (panelLogoutItem) panelLogoutItem.style.display = 'block';
                        fetchAllUsers();
                        return;
                    }
                } catch (e) {
                    sessionStorage.removeItem('rxSession');
                }
            }
            if (adminLoginModal) adminLoginModal.style.display = 'flex';
        }

        checkSession();

        if (submitAdminLoginBtn) {
            submitAdminLoginBtn.addEventListener('click', async function() {
                const email = loginEmailInput.value.trim();
                const password = loginPasswordInput.value.trim();

                if (!email || !password) {
                    loginModalStatus.textContent = 'Please fill in all fields.';
                    loginModalStatus.className = 'status-msg error';
                    return;
                }

                try {
                    loginModalStatus.textContent = 'Authenticating...';
                    loginModalStatus.className = 'status-msg';

                    const { data, error } = await supabaseClient
                        .from('users')
                        .select('*')
                        .eq('email', email)
                        .eq('password', password)
                        .eq('role', 'ADMIN')
                        .single();

                    if (error || !data) {
                        throw new Error('Invalid Admin credentials!');
                    }

                    sessionStorage.setItem('rxSession', JSON.stringify(data));
                    currentUser = data;
                    
                    loginModalStatus.textContent = 'Login successful!';
                    loginModalStatus.className = 'status-msg success';

                    setTimeout(() => {
                        if (adminLoginModal) adminLoginModal.style.display = 'none';
                        if (panelLogoutItem) panelLogoutItem.style.display = 'block';
                        fetchAllUsers();
                    }, 800);

                } catch (err) {
                    loginModalStatus.textContent = err.message || 'Login failed.';
                    loginModalStatus.className = 'status-msg error';
                }
            });
        }

        if (sidePanelLogoutBtn) {
            sidePanelLogoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('rxSession');
                window.location.reload();
            });
        }

        async function fetchAllUsers() {
            try {
                const { data, error } = await supabaseClient
                    .from('users')
                    .select('*')
                    .order('id', { ascending: true });

                if (error) throw error;
                allUsers = data || [];
                renderUserList(allUsers);

                if (allUsers.length > 0 && (!selectedUser || !allUsers.some(u => u.id === selectedUser.id))) {
                    selectUser(allUsers[0]);
                }
            } catch (err) {
                if (userListContainer) {
                    userListContainer.innerHTML = `<p style="color:#ff4444; font-size:13px; padding:15px; text-align:center;">Error loading users.</p>`;
                }
            }
        }

        function renderUserList(usersToRender) {
            if (!userListContainer) return;
            userListContainer.innerHTML = '';
            
            if (usersToRender.length === 0) {
                userListContainer.innerHTML = `<p style="color:var(--text-muted); font-size: 0.85rem; padding: 15px; text-align:center;">No users found.</p>`;
                return;
            }

            usersToRender.forEach(user => {
                const metadata = user.raw_user_meta_data || user.user_metadata || {};
                // FIXED: Directly picking avatar_url column from Supabase schema
                const userImage = user.avatar_url || user.profile_image || user.image || metadata.avatar_url || metadata.picture || '';
                const uName = user.name || metadata.full_name || 'No Name';

                const div = document.createElement('div');
                div.className = `user-list-item ${selectedUser && selectedUser.id === user.id ? 'active' : ''}`;
                div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="user-thumb">
                            ${userImage ? `<img src="${userImage}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                            <i class="fa-solid fa-user" style="${userImage ? 'display:none;' : ''}"></i>
                        </div>
                        <div style="overflow: hidden; flex: 1;">
                            <div class="u-name">${uName}</div>
                            <div class="u-email">${user.email || user.phone || 'No Contact'}</div>
                        </div>
                    </div>
                `;
                div.addEventListener('click', () => {
                    selectUser(user);
                    document.querySelectorAll('.user-list-item').forEach(el => el.classList.remove('active'));
                    div.classList.add('active');
                });
                userListContainer.appendChild(div);
            });
        }

        if (userSearchInput) {
            userSearchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                const filtered = allUsers.filter(user => {
                    const metadata = user.raw_user_meta_data || user.user_metadata || {};
                    const name = (user.name || metadata.full_name || '').toLowerCase();
                    const email = (user.email || '').toLowerCase();
                    const phone = (user.phone || '').toLowerCase();
                    return name.includes(query) || email.includes(query) || phone.includes(query);
                });
                renderUserList(filtered);
            });
        }

        function selectUser(user) {
            selectedUser = user;
            const metadata = user.raw_user_meta_data || user.user_metadata || {};
            const userImage = user.avatar_url || user.profile_image || user.image || metadata.avatar_url || metadata.picture || '';

            if (editUserId) editUserId.value = user.id;
            if (editIdDisplay) editIdDisplay.value = user.id;
            if (editName) editName.value = user.name || metadata.full_name || '';
            if (editEmail) editEmail.value = user.email || '';
            if (editPhone) editPhone.value = user.phone || '';
            if (editAddress) editAddress.value = user.address || metadata.address || '';
            if (editRole) editRole.value = user.role || 'user';
            if (editDob) editDob.value = user.dob || metadata.dob || '';

            if (previewName) previewName.textContent = user.name || metadata.full_name || 'Unnamed User';
            if (previewEmail) previewEmail.textContent = user.email || user.phone || 'No contact email';
            
            if (activeRoleBadge) {
                activeRoleBadge.textContent = user.role || 'user';
                activeRoleBadge.className = `role-badge ${(user.role || '').toUpperCase()}`;
            }

            if (adminAvatarBox) {
                if (userImage) {
                    adminAvatarBox.innerHTML = `<img src="${userImage}" alt="Profile Image" onerror="this.style.display='none';">`;
                } else {
                    adminAvatarBox.innerHTML = `<i class="fa-solid fa-user"></i>`;
                }
            }

            setFormEditable(false);
            if (adminFormStatus) adminFormStatus.textContent = '';
        }

        function setFormEditable(isEditable) {
            const fields = document.querySelectorAll('#adminUserForm input:not(#editIdDisplay), #adminUserForm select');
            fields.forEach(field => field.disabled = !isEditable);

            if (isEditable) {
                if (enableEditBtn) enableEditBtn.style.display = 'none';
                if (updateUserBtn) updateUserBtn.style.display = 'inline-flex';
                if (openDeleteModalBtn) openDeleteModalBtn.style.display = 'inline-flex';
            } else {
                if (enableEditBtn) enableEditBtn.style.display = 'inline-flex';
                if (updateUserBtn) updateUserBtn.style.display = 'none';
                if (openDeleteModalBtn) openDeleteModalBtn.style.display = 'none';
            }
        }

        if (enableEditBtn) {
            enableEditBtn.addEventListener('click', () => {
                if (!selectedUser) return;
                setFormEditable(true);
            });
        }

        if (updateUserBtn) {
            updateUserBtn.addEventListener('click', async function() {
                if (!selectedUser) return;

                const updatedData = {
                    name: editName.value.trim(),
                    email: editEmail.value.trim(),
                    phone: editPhone.value.trim(),
                    address: editAddress.value.trim(),
                    role: editRole.value.trim(),
                    dob: editDob.value
                };

                try {
                    adminFormStatus.textContent = 'Updating...';
                    adminFormStatus.className = 'status-msg';

                    const { error } = await supabaseClient
                        .from('users')
                        .update(updatedData)
                        .eq('id', selectedUser.id);

                    if (error) throw error;

                    adminFormStatus.textContent = 'User updated successfully!';
                    adminFormStatus.className = 'status-msg success';
                    
                    setFormEditable(false);
                    await fetchAllUsers();
                } catch (err) {
                    adminFormStatus.textContent = err.message || 'Update failed.';
                    adminFormStatus.className = 'status-msg error';
                }
            });
        }

        if (openDeleteModalBtn) {
            openDeleteModalBtn.addEventListener('click', () => {
                if (!selectedUser) return;
                if (adminAuthPassword) adminAuthPassword.value = '';
                if (modalStatus) modalStatus.textContent = '';
                if (adminDeleteModal) adminDeleteModal.style.display = 'flex';
            });
        }

        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => {
                if (adminDeleteModal) adminDeleteModal.style.display = 'none';
            });
        }

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', async function() {
                const password = adminAuthPassword.value.trim();

                if (!password) {
                    modalStatus.textContent = 'Please enter admin password.';
                    modalStatus.className = 'status-msg error';
                    return;
                }

                try {
                    modalStatus.textContent = 'Verifying...';
                    modalStatus.className = 'status-msg';

                    const { data: adminCheck, error: authError } = await supabaseClient
                        .from('users')
                        .select('*')
                        .eq('id', currentUser.id)
                        .eq('password', password)
                        .single();

                    if (authError || !adminCheck) {
                        modalStatus.textContent = 'Incorrect Admin Password!';
                        modalStatus.className = 'status-msg error';
                        return;
                    }

                    modalStatus.textContent = 'Deleting permanently...';
                    
                    const { error: deleteError } = await supabaseClient
                        .from('users')
                        .delete()
                        .eq('id', selectedUser.id);

                    if (deleteError) throw deleteError;

                    modalStatus.textContent = 'User deleted successfully!';
                    modalStatus.className = 'status-msg success';

                    setTimeout(() => {
                        if (adminDeleteModal) adminDeleteModal.style.display = 'none';
                        selectedUser = null;
                        fetchAllUsers();
                    }, 1200);

                } catch (err) {
                    modalStatus.textContent = err.message || 'Deletion failed.';
                    modalStatus.className = 'status-msg error';
                }
            });
        }
    });
})();