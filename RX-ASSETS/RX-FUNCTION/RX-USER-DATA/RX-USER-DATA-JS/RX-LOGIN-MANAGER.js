// Universal Login Manager - Runs on all pages
const RXLoginManager = {
    // Check login status on any page
    checkLoginStatus: function() {
        const currentUser = RXUserData.getCurrentUser();
        
        // Update UI elements if they exist
        this.updateSidePanel(currentUser);
        
        // If on resource page, handle resource access
        if (window.location.pathname.includes('Resource.html') || 
            window.location.pathname.includes('Dashboard.html')) {
            this.handleResourceAccess(currentUser);
        }
        
        return currentUser;
    },
    
    // Update side panel user info
    updateSidePanel: function(user) {
        const panelUserImage = document.getElementById('panelUserImage');
        const panelUserInfo = document.getElementById('panelUserInfo');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (!panelUserImage || !panelUserInfo) return;
        
        if (user) {
            // Logged in
            panelUserImage.src = user.profileImage || 'RX-ASSETS/RX-IMAGE/RX-LOGO/L-6.gif';
            panelUserInfo.innerHTML = `
                <h4>${user.fullName || 'User'}</h4>
                <p>@${user.nickname || 'user'}</p>
            `;
            
            if (logoutBtn) {
                logoutBtn.style.display = 'flex';
            }
        } else {
            // Not logged in
            panelUserImage.src = 'RX-ASSETS/RX-IMAGE/RX-LOGO/L-6.gif';
            panelUserInfo.innerHTML = `
                <h4>GUEST</h4>
                <p>Click to login</p>
            `;
            
            if (logoutBtn) {
                logoutBtn.style.display = 'none';
            }
        }
    },
    
    // Handle resource page access
    handleResourceAccess: function(user) {
        const loginScreen = document.getElementById('login-screen');
        const questionBank = document.getElementById('question-bank');
        
        if (!loginScreen || !questionBank) return;
        
        if (user) {
            loginScreen.classList.add('hidden');
            questionBank.classList.remove('hidden');
        } else {
            loginScreen.classList.remove('hidden');
            questionBank.classList.add('hidden');
        }
    },
    
    // Logout function
    logout: function() {
        RXUserData.clearCurrentUser();
        localStorage.removeItem('rxLoginTime');
        
        // Update UI
        this.updateSidePanel(null);
        
        // Handle resource page
        if (window.location.pathname.includes('Resource.html') || 
            window.location.pathname.includes('Dashboard.html')) {
            this.handleResourceAccess(null);
        }
        
        // Close side panel if open
        const sidePanel = document.getElementById('sidePanel');
        const overlay = document.getElementById('panelOverlay');
        if (sidePanel && overlay) {
            sidePanel.classList.remove('active');
            overlay.classList.remove('active');
        }
        
        // Show message
        this.showMessage('Logged out successfully', 'info');
        
        // Reload if on resource page
        if (window.location.pathname.includes('Resource.html') || 
            window.location.pathname.includes('Dashboard.html')) {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    },
    
    // Show message
    showMessage: function(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'info' ? '#4cc9f0' : '#64ffda'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 500;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    RXLoginManager.checkLoginStatus();
    
    // Bind logout button if exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => RXLoginManager.logout());
    }
});
