// Configuration
const QUESTIONS = [
    {
        id: 1,
        title: "KOREAN LANGUAGE PRACTICE EXAM",
        content: "Korean Language Test Exam Model - all randomly generate exam that for practice",
        link: "KR-EXAM-PC.html",
        category: "SUPPORT | PC / TAB "
    },
];

// DOM Elements
const dom = {
    loginScreen: document.getElementById('login-screen'),
    questionBank: document.getElementById('question-bank'),
    logoutBtn: document.getElementById('logout-btn'),
    questionGrid: document.getElementById('question-grid'),
    loginBox: document.querySelector('.login-box'),
    scrollToTopBtn: document.getElementById('scroll-to-top'),
    panelUserImage: document.getElementById('panelUserImage'),
    panelUserInfo: document.getElementById('panelUserInfo'),
    panelUserProfile: document.getElementById('panelUserProfile'),
    panelProfileLink: document.querySelector('.panel-profile-link')
};

// State - REMOVE sessionStorage check here
let state = {
    currentUser: null
};

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    // Initialize scroll to top button visibility
    checkScrollPosition();
});

// Event Listeners
if (dom.logoutBtn) {
    dom.logoutBtn.addEventListener('click', handleLogout);
}

// Scroll to top button
if (dom.scrollToTopBtn) {
    dom.scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Show/hide scroll to top button based on scroll position
window.addEventListener('scroll', checkScrollPosition);

// Functions
function checkLoginStatus() {
    // Get user from localStorage (persistent) - FIXED
    const currentUser = RXUserData.getCurrentUser();
    state.currentUser = currentUser;
    
    if (currentUser) {
        showQuestionBank();
        updateSidePanelUser(currentUser);
    } else {
        showLoginScreen();
        updateSidePanelUser(null);
    }
}

function handleLogout() {
    // Clear user from localStorage - FIXED
    RXUserData.clearCurrentUser();
    localStorage.removeItem('rxLoginTime');
    
    state.currentUser = null;
    showLoginScreen();
    updateSidePanelUser(null);
    
    // Show logout message
    showMessage("Logged out successfully", "info");
    
    // Close side panel
    const sidePanel = document.getElementById('sidePanel');
    const overlay = document.getElementById('panelOverlay');
    if (sidePanel && overlay) {
        sidePanel.classList.remove('active');
        overlay.classList.remove('active');
    }
}

function showQuestionBank() {
    if (!state.currentUser) {
        showLoginScreen();
        return;
    }
    
    if (dom.loginScreen) dom.loginScreen.classList.add('hidden');
    if (dom.questionBank) dom.questionBank.classList.remove('hidden');
    
    renderQuestions();
}

function showLoginScreen() {
    if (dom.loginScreen) dom.loginScreen.classList.remove('hidden');
    if (dom.questionBank) dom.questionBank.classList.add('hidden');
}

function updateSidePanelUser(user) {
    if (!dom.panelUserImage || !dom.panelUserInfo || !dom.panelProfileLink) return;
    
    if (user) {
        // Update user image
        dom.panelUserImage.src = user.profileImage || 'RX-ASSETS/RX-IMAGE/RX-LOGO/L-6.gif';
        
        // Update user info
        dom.panelUserInfo.innerHTML = `
            <h4>${user.fullName || 'User'}</h4>
            <p>@${user.nickname || 'user'}</p>
        `;
        
        // Make profile clickable to go to USER.html
        dom.panelProfileLink.href = 'USER.html';
        
        // Show logout button
        if (dom.logoutBtn) {
            dom.logoutBtn.style.display = 'flex';
        }
    } else {
        // Show guest/default state
        dom.panelUserImage.src = 'RX-ASSETS/RX-IMAGE/RX-LOGO/L-6.gif';
        dom.panelUserInfo.innerHTML = `
            <h4>GUEST</h4>
            <p>Click to login</p>
        `;
        
        // Make profile clickable to go to login page
        dom.panelProfileLink.href = 'USER.html';
        
        // Hide logout button
        if (dom.logoutBtn) {
            dom.logoutBtn.style.display = 'none';
        }
    }
}

function renderQuestions() {
    if (!dom.questionGrid) return;
    
    dom.questionGrid.innerHTML = '';
    
    QUESTIONS.forEach((question, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.tabIndex = 0;
        
        card.innerHTML = `
            <div class="card-content">
                <h3>${question.title}</h3>
                <p>${question.content}</p>
                <div class="card-footer">
                    <span class="category-badge">${question.category}</span>
                    <a href="${question.link}" class="btn-view">
                        <i class="fas fa-play"></i> Start Test
                    </a>
                </div>
            </div>
        `;
        
        // Add keyboard support for cards
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                window.location.href = question.link;
            }
        });
        
        dom.questionGrid.appendChild(card);
    });
}

function checkScrollPosition() {
    if (!dom.scrollToTopBtn) return;
    
    if (window.scrollY > 300) {
        dom.scrollToTopBtn.classList.remove('hidden');
    } else {
        dom.scrollToTopBtn.classList.add('hidden');
    }
}

function showMessage(message, type) {
    // Create temporary message element
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
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Initialize
renderQuestions();
