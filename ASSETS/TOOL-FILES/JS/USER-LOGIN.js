// User database
const users = [
    {
        id: 1,
        username: "ROSAN",
        password: "RX2061",
        name: "ROSAN KC",
        image: "ASSETS/TOOL-FILES/USER-LOGIN-IMG/ROSAN-KC.jpg",
        access: ["file1","file2","file3","file4","file5","file6"] // User access card id
    },
    {
        id: 4,
        username: "KESHAB",
        password: "RX@KDM",
        name: "Keshab Disuwa Magar",
        image: "ASSETS/TOOL-FILES/USER-LOGIN-IMG/Keshab-Disuwa-Magar.jpg",
        access: ["file2","file3","file4","file5","file6"] // User access card id
    },
    {
        id: 3,
        username: "RITA",
        password: "RX@RRM",
        name: "Rita Rana Magar",
        image: "ASSETS/TOOL-FILES/USER-LOGIN-IMG/Rita-Magar.jpg",
        access: ["file2","file3","file4","file5","file6"] // User access card id
    }
];

// Content cards database
const contentCards = [
    { 
        id: "file1", 
        title: "KAPALI-TAMSUK", 
        description: "Login Code : RX-2061", 
        link: "ASSETS/WEB-SOFTWARE/RX-STUDIO-KAPALI_TAMSUK_GENERATOR.html",
        icon: "fas fa-pen"
    },
    { 
        id: "file2", 
        title: "QUESTION-MODEL-1", 
        description: "LESSON A 1 - 10L", 
        link: "KR-EXAM.html",
        icon: "fas fa-book"
    },
    { 
        id: "file3", 
        title: "LIVE-WEATHER", 
        description: "A platform where you can check the environmental conditions in your area.", 
        link: "ASSETS/WEB-SOFTWARE/RX-Weather.html",
        icon: "fas fa-cloud"
    },
    { 
        id: "file4", 
        title: "RX-GALLERY", 
        description: "Login Code : RX2061", 
        link: "ASSETS/WEB-SOFTWARE/RX-GALLERY.html",
        icon: "fas fa-image"
    },
    { 
        id: "file5", 
        title: "RX-QR-Scanner/Generator", 
        description: "You can create personalized messages using a QR code with this app, and the generated QR can also be read directly through this web application. Note: Do not clear your browser data. Doing so will result in the loss of your stored information.", 
        link: "ASSETS/WEB-SOFTWARE/RX-S-QR.html",
        icon: "fas fa-qrcode"
    },
    { 
        id: "file6", 
        title: "RX-CALENDER", 
        description: "English Calendar – Allows you to add tasks and notes for future work schedules. Note: This feature works online only. Note: Do not clear your browser data. Doing so will result in the loss of your stored information.", 
        link: "ASSETS/WEB-SOFTWARE/RX-Calendar.html",
        icon: "fas fa-calendar"
    },
    { 
        id: "file7", 
        title: "KAPALI-TAMSUK", 
        description: "Old Version | Login Code: RX-2061 | No updates or special features available.", 
        link: "ASSETS/WEB-SOFTWARE/Kapali.html",
        icon: "fas fa-pencil"
    }
];

// --- DEVELOPER-MANAGED STORES ---
// To add, remove, or change the content of stores, edit this array.
// The `id` should be unique. The `content` array holds the 'id's of items from contentCards.
const defaultStores = [
    {
        id: "store_1", // Use a simple, permanent ID
        name: "LEKHA-PADI",
        content: ["file1","file7"]
    },
    {
        id: "store_2",
        name: "EPS-EXAM-QUESTION",
        content: ["file2"]
    },
    {
        id: "store_3",
        name: "WEB-SOFTWARE",
        content: ["file3","file4","file5","file6"]
    },
];

let currentUser = null;
let stores = [];
let currentStoreId = null;

// --- DYNAMIC STORE MANAGEMENT ---

function initializeStores() {
    const savedStores = JSON.parse(localStorage.getItem('lekhapadi_stores')) || [];
    
    // Sync developer-defined stores with saved stores from local storage
    // This ensures that stores added/removed by the developer are reflected,
    // while user-renamed stores are preserved.
    stores = defaultStores.map(devStore => {
        const savedStore = savedStores.find(s => s.id === devStore.id);
        return {
            ...devStore, // Start with the developer's definition (for content)
            name: savedStore ? savedStore.name : devStore.name, // Use saved name if it exists
        };
    });

    localStorage.setItem('lekhapadi_stores', JSON.stringify(stores));
    
    if (stores.length > 0 && !currentStoreId) {
        currentStoreId = stores[0].id;
    }
}

function renderStoreNavigation() {
    const navContainer = document.getElementById('storeNavigation');
    if (!navContainer) return;
    
    navContainer.innerHTML = '';
    
    stores.forEach(store => {
        const button = document.createElement('button');
        button.className = 'store-btn';
        button.textContent = store.name;
        button.onclick = () => switchStore(store.id);
        if (store.id === currentStoreId) {
            button.classList.add('active');
        }
        navContainer.appendChild(button);
    });

    const manageButton = document.createElement('button');
    manageButton.className = 'store-btn manage-btn';
    manageButton.innerHTML = '<i class="fas fa-cog"></i> Manage Stores';
    manageButton.onclick = openStoreManager;
    navContainer.appendChild(manageButton);
}

function switchStore(storeId) {
    currentStoreId = storeId;
    const store = stores.find(s => s.id === storeId);
    
    if (store) {
        const storeTitle = document.getElementById('storeTitle');
        if (storeTitle) {
            storeTitle.innerHTML = `<i class="fas fa-store"></i> ${store.name}`;
        }
        renderStoreNavigation(); // Re-render to update active class
        renderContentCards();
    }
}

function renderContentCards() {
    const cardsContainer = document.getElementById('contentCards');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = '';
    const store = stores.find(s => s.id === currentStoreId);

    if (!store || store.content.length === 0) {
        cardsContainer.innerHTML = '<p class="no-content">No content available in this store.</p>';
        return;
    }
    
    const storeContent = contentCards.filter(card => store.content.includes(card.id));

    if (storeContent.length === 0) {
        cardsContainer.innerHTML = '<p class="no-content">No content defined for this store.</p>';
        return;
    }

    storeContent.forEach(card => {
        const hasAccess = currentUser.access.includes(card.id);
        const cardElement = document.createElement('div');
        cardElement.className = `card ${hasAccess ? '' : 'locked'}`;
        
        // MODIFIED LOGIC: Show description only if user has access.
        const descriptionHtml = hasAccess ? `<p>${card.description}</p>` : '<p>Purchase to see the details.</p>';
        
        if (hasAccess) {
            cardElement.innerHTML = `<i class="${card.icon || 'fas fa-file'} card-icon"></i><h3>${card.title}</h3>${descriptionHtml}<a href="${card.link}"><i class="fas fa-external-link-alt"></i> Open</a>`;
        } else {
            cardElement.innerHTML = `<i class="${card.icon || 'fas fa-file'} card-icon"></i><h3>${card.title}</h3>${descriptionHtml}<div class="lock-icon"><i class="fas fa-lock"></i></div><button class="purchase-btn" onclick="purchaseContent('${card.id}')"><i class="fas fa-shopping-cart"></i> Purchase Access</button>`;
        }
        cardsContainer.appendChild(cardElement);
    });
}

// --- STORE MANAGER MODAL FUNCTIONS (RENAMING ONLY) ---

function openStoreManager() {
    const modal = document.getElementById('storeManagerModal');
    if (modal) {
        renderStoreManagerList();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeStoreManager() {
    const modal = document.getElementById('storeManagerModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function renderStoreManagerList() {
    const listContainer = document.getElementById('storeManagerList');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    stores.forEach(store => {
        const li = document.createElement('li');
        // The input field allows renaming, but there is no delete button.
        li.innerHTML = `<i class="fas fa-store"></i> <input type="text" value="${store.name}" data-id="${store.id}" placeholder="Store Name">`;
        listContainer.appendChild(li);
    });
}

function saveStoreChanges() {
    const inputs = document.querySelectorAll('#storeManagerList input[type="text"]');
    inputs.forEach(input => {
        const storeId = input.getAttribute('data-id');
        const newName = input.value.trim();
        const store = stores.find(s => s.id === storeId);
        if (store && newName) {
            store.name = newName;
        }
    });

    localStorage.setItem('lekhapadi_stores', JSON.stringify(stores));
    
    closeStoreManager();
    renderStoreNavigation();
    if (currentStoreId) {
        switchStore(currentStoreId);
    }
}

// --- CORE APPLICATION FUNCTIONS ---

function setupProfileDropdown() {
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (!profileDropdown) return;
    const profileBtn = profileDropdown.querySelector('.profile-btn');
    const dropdownContent = profileDropdown.querySelector('.dropdown-content');

    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });
}

function loginAsGuest() {
    currentUser = { id: 0, username: "guest", name: "Guest User", image: "ASSETS/TOOL-FILES/USER-LOGIN-IMG/USER.png", access: ["file3","file4","file5","file6"] };
    redirectToDashboard();
}

function loginAsUser(username, password) {
    const button = document.querySelector('#userLoginForm button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    button.disabled = true;

    setTimeout(() => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = user;
            redirectToDashboard();
        } else {
            alert("Invalid username or password");
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }, 800);
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        sessionStorage.removeItem('currentUser');
        window.location.href = "USER-LOGIN.html";
    }
}

function redirectToDashboard() {
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    window.location.href = "USER-DASHBOARD.html";
}

function loadDashboard() {
    const userData = sessionStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = "USER-LOGIN.html";
        return;
    }
    
    currentUser = JSON.parse(userData);
    
    document.getElementById('welcomeMessage').innerHTML = `<i class="fas fa-home"></i> Welcome, ${currentUser.name || currentUser.username}!`;
    document.getElementById('profileName').textContent = currentUser.name || "No name";
    document.getElementById('profileUsername').textContent = `@${currentUser.username}`;
    document.getElementById('profileImg').src = currentUser.image || "https://via.placeholder.com/80";
    
    initializeStores();
    if (currentStoreId) {
        switchStore(currentStoreId);
    }
    
    setupProfileDropdown();
}

// --- GENERAL MODAL FUNCTIONS ---

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = 'block';
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
    document.body.style.overflow = 'auto';
}

function purchaseContent(contentId) {
    const card = contentCards.find(c => c.id === contentId);
    if (card) {
        document.getElementById('modalTitle').textContent = card.title;
        showModal('purchaseModal');
    }
}

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});