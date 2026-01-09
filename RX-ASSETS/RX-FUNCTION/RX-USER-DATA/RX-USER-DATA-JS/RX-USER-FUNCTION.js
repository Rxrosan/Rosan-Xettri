// User Login Functions
const RXUserLogin = {
    // Initialize login functionality
    init: function() {
        this.bindEvents();
        this.checkAutoLogin();
    },

    // Bind login/logout events
    bindEvents: function() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.login());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Allow login on Enter key in login inputs
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && 
                document.getElementById('loginSection') && 
                document.getElementById('loginSection').style.display !== 'none') {
                this.login();
            }
        });
    },

    // Check if user is already logged in
    checkAutoLogin: function() {
        const currentUser = RXUserData.getCurrentUser();
        if (currentUser) {
            this.showProfile(currentUser);
        }
    },

    // Login function
    login: function() {
        const credential = document.getElementById('loginNickname').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Validation
        if (!credential) {
            this.showLoginStatus('Please enter nickname or email', 'error');
            return;
        }
        
        if (!password) {
            this.showLoginStatus('Please enter password', 'error');
            return;
        }
        
        // Find user by nickname or email
        const user = RXUserData.getUserByCredentials(credential);
        
        if (!user) {
            this.showLoginStatus('User not found', 'error');
            return;
        }
        
        // Verify password
        const isValidPassword = RXUserPassword.verifyPassword(user.id, password);
        
        if (!isValidPassword) {
            this.showLoginStatus('Invalid password', 'error');
            return;
        }
        
        // Login successful
        RXUserData.setCurrentUser(user.id);
        this.showProfile(user);
        this.showLoginStatus('Login successful!', 'success');
        
        // Clear form
        document.getElementById('loginNickname').value = '';
        document.getElementById('loginPassword').value = '';
    },

    // Logout function
    logout: function() {
        RXUserData.clearCurrentUser();
        this.showLoginForm();
        
        // Close side panel if open
        const sidePanel = document.getElementById('sidePanel');
        const overlay = document.getElementById('panelOverlay');
        if (sidePanel && overlay) {
            sidePanel.classList.remove('active');
            overlay.classList.remove('active');
        }
        
        this.showLoginStatus('Logged out successfully', 'success');
    },

    // Show profile section
    showProfile: function(user) {
        const loginSection = document.getElementById('loginSection');
        const profileSection = document.getElementById('profileSection');
        
        if (loginSection) loginSection.style.display = 'none';
        if (profileSection) profileSection.style.display = 'block';
        
        // Update profile data
        this.updateProfileDisplay(user);
    },

    // Show login form
    showLoginForm: function() {
        const loginSection = document.getElementById('loginSection');
        const profileSection = document.getElementById('profileSection');
        
        if (loginSection) loginSection.style.display = 'flex';
        if (profileSection) profileSection.style.display = 'none';
    },

    // Update profile display with user data
    updateProfileDisplay: function(user) {
        if (!user) return;
        
        // Update left side
        const profileImage = document.getElementById('profileImage');
        const userFullName = document.getElementById('userFullName');
        const userNickname = document.getElementById('userNickname');
        const userRoleBadge = document.getElementById('userRoleBadge');
        
        if (profileImage) {
            profileImage.src = user.profileImage || 'RX-ASSETS/RX-IMAGE/RX-USER/default-profile.png';
        }
        
        if (userFullName) userFullName.textContent = user.fullName;
        
        if (userNickname) {
            userNickname.textContent = user.nickname.startsWith('@') ? user.nickname : `@${user.nickname}`;
        }
        
        if (userRoleBadge) {
            userRoleBadge.innerHTML = `<i class="fas fa-crown"></i> ${RXUserData.getRoleDisplayName(user.role).toUpperCase()}`;
        }
        
        // Update right side details
        const detailElements = {
            'detailRole': RXUserData.getRoleDisplayName(user.role),
            'detailNickname': user.nickname.startsWith('@') ? user.nickname : `@${user.nickname}`,
            'detailEmail': user.email,
            'detailPhone': user.phone,
            'detailDOB': this.formatDate(user.dob),
            'detailAddress': user.address,
            'detailJoined': this.formatDate(user.joinDate || user.createdAt || '2024-01-01')
        };
        
        Object.keys(detailElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = detailElements[id];
        });
    },

    // Format date for display
    formatDate: function(dateString) {
        if (!dateString) return 'Not set';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    },

    // Show login status message
    showLoginStatus: function(message, type) {
        const statusDiv = document.getElementById('loginStatus');
        if (!statusDiv) return;
        
        statusDiv.textContent = message;
        statusDiv.className = `login-status ${type}`;
        statusDiv.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
};