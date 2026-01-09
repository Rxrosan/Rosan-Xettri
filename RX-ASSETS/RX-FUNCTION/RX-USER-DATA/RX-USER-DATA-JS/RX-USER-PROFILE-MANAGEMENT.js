// User Profile Management
const RXUserProfileManagement = {
    // Initialize profile functionality
    init: function() {
        this.bindProfileEvents();
        this.loadCurrentUserData();
        this.initImageUpload();
    },

    // Bind profile events
    bindProfileEvents: function() {
        // Edit Profile
        const editProfileBtn = document.getElementById('editProfileBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        
        // Change Password
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const closePasswordModalBtn = document.getElementById('closePasswordModalBtn');
        const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
        const savePasswordBtn = document.getElementById('savePasswordBtn');
        
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.openEditModal());
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeEditModal());
        }
        
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        }
        
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => this.saveProfile());
        }
        
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.openChangePasswordModal());
        }
        
        if (closePasswordModalBtn) {
            closePasswordModalBtn.addEventListener('click', () => this.closeChangePasswordModal());
        }
        
        if (cancelPasswordBtn) {
            cancelPasswordBtn.addEventListener('click', () => this.closeChangePasswordModal());
        }
        
        if (savePasswordBtn) {
            savePasswordBtn.addEventListener('click', () => this.changePassword());
        }
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            const editModal = document.getElementById('editProfileModal');
            const passwordModal = document.getElementById('changePasswordModal');
            
            if (e.target === editModal) {
                this.closeEditModal();
            }
            if (e.target === passwordModal) {
                this.closeChangePasswordModal();
            }
        });
    },

    // Initialize image upload
    initImageUpload: function() {
        const uploadBtn = document.getElementById('uploadImageBtn');
        const fileInput = document.getElementById('imageUpload');
        
        if (uploadBtn && fileInput) {
            // Click on overlay to trigger file input
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
            
            // Handle file selection
            fileInput.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files[0]);
            });
            
            // Enable drag and drop
            const profileImageContainer = document.querySelector('.profile-image-container');
            profileImageContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                profileImageContainer.style.borderColor = '#ff4d4d';
            });
            
            profileImageContainer.addEventListener('dragleave', () => {
                profileImageContainer.style.borderColor = '#aa0707';
            });
            
            profileImageContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                profileImageContainer.style.borderColor = '#aa0707';
                
                if (e.dataTransfer.files.length) {
                    this.handleImageUpload(e.dataTransfer.files[0]);
                }
            });
        }
    },

    // Handle image upload
    handleImageUpload: function(file) {
        if (!file) return;
        
        // Validate file type
        if (!file.type.match('image.*')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('Image size should be less than 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const currentUser = RXUserData.getCurrentUser();
            if (!currentUser) return;
            
            // Convert to Base64 and save to localStorage
            const base64Image = e.target.result;
            
            // Save image to user data
            const updatedUser = RXUserData.updateUser(currentUser.id, {
                profileImage: base64Image
            });
            
            if (updatedUser) {
                // Update profile image display
                document.getElementById('profileImage').src = base64Image;
                this.showNotification('Profile image updated successfully', 'success');
            }
        };
        
        reader.readAsDataURL(file);
    },

    // Load current user data
    loadCurrentUserData: function() {
        const currentUser = RXUserData.getCurrentUser();
        if (currentUser && document.getElementById('profileSection').style.display !== 'none') {
            RXUserLogin.updateProfileDisplay(currentUser);
        }
    },

    // Open edit profile modal
    openEditModal: function() {
        const currentUser = RXUserData.getCurrentUser();
        if (!currentUser) {
            this.showNotification('Please login first', 'error');
            return;
        }
        
        // Fill form with current data
        document.getElementById('editFullName').value = currentUser.fullName || '';
        document.getElementById('editNickname').value = currentUser.nickname || '';
        document.getElementById('editEmail').value = currentUser.email || '';
        document.getElementById('editPhone').value = currentUser.phone || '';
        document.getElementById('editDOB').value = currentUser.dob || '';
        document.getElementById('editAddress').value = currentUser.address || '';
        // Role field removed as requested
        
        // Show modal
        document.getElementById('editProfileModal').classList.add('active');
    },

    // Close edit profile modal
    closeEditModal: function() {
        document.getElementById('editProfileModal').classList.remove('active');
    },

    // Open change password modal
    openChangePasswordModal: function() {
        document.getElementById('changePasswordModal').classList.add('active');
    },

    // Close change password modal
    closeChangePasswordModal: function() {
        document.getElementById('changePasswordModal').classList.remove('active');
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    },

    // Save profile changes
    saveProfile: function() {
        const currentUser = RXUserData.getCurrentUser();
        if (!currentUser) {
            this.showNotification('Please login first', 'error');
            return;
        }
        
        // Get form values
        const updatedData = {
            fullName: document.getElementById('editFullName').value.trim(),
            nickname: document.getElementById('editNickname').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            phone: document.getElementById('editPhone').value.trim(),
            dob: document.getElementById('editDOB').value,
            address: document.getElementById('editAddress').value.trim()
            // Role field removed as requested
        };
        
        // Validate
        if (!updatedData.fullName || !updatedData.nickname || !updatedData.email) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Update user data
        const updatedUser = RXUserData.updateUser(currentUser.id, updatedData);
        
        if (updatedUser) {
            // Update display
            RXUserLogin.updateProfileDisplay(updatedUser);
            this.closeEditModal();
            
            // Show success message
            this.showNotification('Profile updated successfully', 'success');
        } else {
            this.showNotification('Failed to update profile', 'error');
        }
    },

    // Change password
    changePassword: function() {
        const currentUser = RXUserData.getCurrentUser();
        if (!currentUser) {
            this.showNotification('Please login first', 'error');
            return;
        }
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Please fill in all password fields', 'error');
            return;
        }
        
        // Verify current password
        const isValidCurrent = RXUserPassword.verifyPassword(currentUser.id, currentPassword);
        if (!isValidCurrent) {
            this.showNotification('Current password is incorrect', 'error');
            return;
        }
        
        // Check if new password is different
        if (currentPassword === newPassword) {
            this.showNotification('New password must be different from current password', 'error');
            return;
        }
        
        // Check password strength (optional)
        if (newPassword.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return;
        }
        
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }
        
        // Update password
        const success = RXUserPassword.setPassword(currentUser.id, newPassword);
        
        if (success) {
            this.closeChangePasswordModal();
            this.showNotification('Password updated successfully', 'success');
        } else {
            this.showNotification('Failed to update password', 'error');
        }
    },

    // Show notification
    showNotification: function(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        notification.innerHTML = `
            <div class="notification-content ${type}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};