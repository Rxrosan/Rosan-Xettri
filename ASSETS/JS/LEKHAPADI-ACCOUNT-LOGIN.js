// User database
const users = [
    {
        id: 1,
        username: "Rosan2061",
        password: "RX2061",
        name: "ROSAN KC",
        image: "LEKHA_PADI_ASSETS/IMG/RO S AN KC.jpg",
        access: ["1", "2"]
    }
];

// Content cards organized by store
const contentCards = {
    store1: [
        { 
            id: "1", 
            title: "KAPALI-TAMSUK", 
            description: "Login Code : RX-2061", 
            link: "LEKHA_PADI_WEB-SOFTWARE/RX-STUDIO-KAPALI_TAMSUK_GENERATOR.html",
            icon: "fas fa-star"
        }
    ],
    store2: [
        { 
            id: "2", 
            title: "STORE 2 ITEM", 
            description: "Special content for Store 2", 
            link: "KR-EXAM.html",
            icon: "fas fa-gem"
        }
    ]
};

let currentUser = null;
let currentStore = 'store1';

// Initialize profile dropdown
function setupProfileDropdown() {
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (!profileDropdown) return;

    const profileBtn = profileDropdown.querySelector('.profile-btn');
    const dropdownContent = profileDropdown.querySelector('.dropdown-content');

    // Close dropdown initially
    profileDropdown.classList.remove('active');
    profileBtn.setAttribute('aria-expanded', 'false');
    dropdownContent.setAttribute('aria-hidden', 'true');

    // Toggle dropdown on button click
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = profileDropdown.classList.toggle('active');
        profileBtn.setAttribute('aria-expanded', isExpanded);
        dropdownContent.setAttribute('aria-hidden', !isExpanded);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
            profileBtn.setAttribute('aria-expanded', 'false');
            dropdownContent.setAttribute('aria-hidden', 'true');
        }
    });

    // Close dropdown on Escape key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            profileDropdown.classList.remove('active');
            profileBtn.setAttribute('aria-expanded', 'false');
            dropdownContent.setAttribute('aria-hidden', 'true');
        }
    });

    // Prevent dropdown close when clicking inside it
    dropdownContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// Switch between stores
function switchStore(storeId) {
    currentStore = storeId;
    // Update active button styling
    document.querySelectorAll('.store-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(storeId));
    });
    renderContentCards();
}

// Show modal function
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Close modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Login as guest
function loginAsGuest() {
    currentUser = {
        id: 0,
        username: "guest",
        name: "Guest User",
        image: "LEKHA_PADI_ASSETS/IMG/USER.png",
        access: []
    };
    redirectToDashboard();
}

// Login as user
function loginAsUser(username, password) {
    const form = document.getElementById('userLoginForm');
    const button = form ? form.querySelector('button') : null;
    const originalText = button ? button.innerHTML : null;
    
    if (button) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        button.disabled = true;
    }

    setTimeout(() => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = user;
            redirectToDashboard();
        } else {
            alert("Invalid username or password");
            if (button) {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }
    }, 800);
}

// Logout function
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        window.location.href = "LEKHAPADI-ACCOUNT-LOGIN.html";
    }
}

// Redirect to dashboard
function redirectToDashboard() {
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    window.location.href = "LEKHAPADI-ACCOUNT-DASHBOARD.html";
}

// Load dashboard content
function loadDashboard() {
    const userData = sessionStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = "LEKHAPADI-ACCOUNT-LOGIN.html";
        return;
    }
    
    currentUser = JSON.parse(userData);
    
    // Update welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.innerHTML = `<i class="fas fa-home"></i> Welcome, ${currentUser.name || currentUser.username}!`;
    }
    
    // Load profile info
    const profileImg = document.getElementById('profileImg');
    const profileName = document.getElementById('profileName');
    const profileUsername = document.getElementById('profileUsername');
    
    if (profileName) profileName.textContent = currentUser.name || "No name";
    if (profileUsername) profileUsername.textContent = `@${currentUser.username}`;
    
    if (profileImg) {
        profileImg.src = currentUser.image || "https://via.placeholder.com/80";
        profileImg.alt = currentUser.name || "Profile";
    }
    
    // Load content cards and setup interactive elements
    renderContentCards();
    setupProfileDropdown();
}

// Render content cards for current store
function renderContentCards() {
    const cardsContainer = document.getElementById('contentCards');
    if (!cardsContainer) return;
    
    cardsContainer.innerHTML = '';
    
    const currentStoreCards = contentCards[currentStore] || [];
    
    if (currentStoreCards.length === 0) {
        cardsContainer.innerHTML = '<p class="no-content">No content available in this store.</p>';
        return;
    }
    
    currentStoreCards.forEach(card => {
        const hasAccess = currentUser.access.includes(card.id);
        const cardElement = document.createElement('div');
        cardElement.className = `card ${hasAccess ? '' : 'locked'}`;

        const descriptionHtml = currentUser.username !== 'guest' ? `<p>${card.description}</p>` : '<p>Purchase to unlock the code.</p>';
        
        if (hasAccess) {
            cardElement.innerHTML = `
                <i class="${card.icon || 'fas fa-file'} card-icon"></i>
                <h3>${card.title}</h3>
                ${descriptionHtml}
                <a href="${card.link}"><i class="fas fa-external-link-alt"></i> Open</a>
            `;
        } else {
            cardElement.innerHTML = `
                <i class="${card.icon || 'fas fa-file'} card-icon"></i>
                <h3>${card.title}</h3>
                ${descriptionHtml}
                <div class="lock-icon"><i class="fas fa-lock"></i></div>
                <button class="purchase-btn" onclick="purchaseContent('${card.id}')">
                    <i class="fas fa-shopping-cart"></i> Purchase Access
                </button>
            `;
        }
        
        cardsContainer.appendChild(cardElement);
    });
}

// Purchase content function
function purchaseContent(contentId) {
    const card = contentCards[currentStore].find(c => c.id === contentId);
    if (card) {
        showModal('purchaseModal');
        document.getElementById('modalTitle').textContent = card.title;
    }
}

// Close all modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        // Disabled to only allow closing via close button
        // closeModal(e.target.id);
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Disabled to only allow closing via close button
        // const openModals = document.querySelectorAll('.modal[style="display: block;"]');
        // openModals.forEach(modal => closeModal(modal.id));
    }
});