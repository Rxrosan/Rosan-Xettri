// --- USER DATABASE WITH FIXED, DATE-BASED TIMED ACCESS ---
// 'access': Holds card IDs for PERMANENT access.
// 'timedAccessConfig': Defines temporary access for specific cards.
//   - startDate: "YYYY-MM-DD". The exact day the access period begins.
//   - duration: The number of days the access is valid from the startDate.
const users = [
    {
        id: 1,
        username: "ROSAN",
        password: "RX9826482279",
        name: "ROSAN KC",
        image: "ASSETS/TOOL-FILES/USER/ROSAN-KC.jpg",
        access: ["file1","file2","file3","file4","file5","file6","file7"], // Permanent access card lnk here
        timedAccessConfig: {
            //"file1": { startDate: "2025-08-15", duration: 30 },  // Access starts Aug 15th for 30 days
            //"file2": { startDate: "2025-08-10", duration: 90 },  // Access starts Aug 10th for 90 days
            //"file3": { startDate: "2025-08-01", duration: 365 }, // Access for all of 2025
            //"file4": { startDate: "2025-08-01", duration: 365 }, // Access for all of 2025
            //"file5": { startDate: "2025-08-01", duration: 365 }, // Access for all of 2025
            //"file7": { startDate: "2025-08-20", duration: 10 }   // Starts Aug 20th
        }
    },
    {
        id: 2,
        username: "RITA",
        password: "RX9807483578",
        name: "Rita Rana Magar",
        image: "ASSETS/TOOL-FILES/USER/Rita-Magar.jpg",
        access: [], // Permanent access card lnk here
        timedAccessConfig: {
            "file2": { startDate: "2025-08-18", duration: 365 }, // Rita's access started Aug 1st
            "file3": { startDate: "2025-08-18", duration: 365 },
            "file4": { startDate: "2025-08-18", duration: 365 },
            "file5": { startDate: "2025-08-18", duration: 365 },
            "file6": { startDate: "2025-08-18", duration: 365 }
        }
    },
    {
        id: 3,
        username: "KESHAB",
        password: "RX9748780170",
        name: "Keshab Disuwa Magar",
        image: "ASSETS/TOOL-FILES/USER/Keshab-Disuwa-Magar.jpg",
        access: [], // Permanent access card lnk here
        timedAccessConfig: {
            "file2": { startDate: "2025-08-18", duration: 365 },
            "file3": { startDate: "2025-08-18", duration: 365 },
            "file4": { startDate: "2025-08-18", duration: 365 },
            "file5": { startDate: "2025-08-18", duration: 365 },
            "file6": { startDate: "2025-08-18", duration: 365 }
        }
    },
];

// --- CONTENT CARDS DATABASE ---
const contentCards = [
    {   id: "file1", 
        title: "KAPALI-TAMSUK", 
        description: "Login Code : RX-2061", 
        link: "ASSETS/WEB-SOFTWARE/RX-STUDIO-KAPALI_TAMSUK_GENERATOR.html", 
        icon: "fas fa-pen" },

    {   id: "file2", 
        title: "QUESTION-MODEL-1", 
        description: "LESSON A 1 - 10L", 
        link: "KR-EXAM.html", 
        icon: "fas fa-book" },

    {   id: "file3", 
        title: "LIVE-WEATHER", 
        description: "A platform where you can check the environmental conditions in your area.", 
        link: "ASSETS/WEB-SOFTWARE/RX-Weather.html", 
        icon: "fas fa-cloud" },

    {   id: "file4", 
        title: "RX-GALLERY", 
        description: "Login Code : RX2061", 
        link: "ASSETS/WEB-SOFTWARE/RX-GALLERY.html", 
        icon: "fas fa-image" },

    {   id: "file5", 
        title: "RX-QR-Scanner/Generator", 
        description: "You can create personalized messages using a QR code with this app.", 
        link: "ASSETS/WEB-SOFTWARE/RX-S-QR.html", 
        icon: "fas fa-qrcode" },

    {   id: "file6", 
        title: "RX-CALENDER", 
        description: "English Calendar – Allows you to add tasks and notes for future work schedules.", 
        link: "ASSETS/WEB-SOFTWARE/RX-Calendar.html", 
        icon: "fas fa-calendar" },

    {   id: "file7", 
        title: "KAPALI-TAMSUK", 
        description: "Old Version | Login Code: RX-2061", 
        link: "ASSETS/WEB-SOFTWARE/Kapali.html", 
        icon: "fas fa-pencil" }
];

// --- DEVELOPER-MANAGED STORES ---
const defaultStores = [
    {   id: "store_1", 
        name: "LEKHA-PADI", 
        content: ["file1", "file7"] },

    {   id: "store_2", 
        name: "EPS-EXAM-QUESTION", 
        content: ["file2"] },

    {   id: "store_3", 
        name: "WEB-SOFTWARE", 
        content: ["file3", "file4", "file5", "file6"] },
];

// --- GLOBAL VARIABLES ---
let currentUser = null;
let stores = [];
let currentStoreId = null;
let countdownInterval = null;

// --- DYNAMIC STORE MANAGEMENT ---
function initializeStores() {
    const savedStores = JSON.parse(localStorage.getItem('lekhapadi_stores')) || [];
    stores = defaultStores.map(devStore => {
        const savedStore = savedStores.find(s => s.id === devStore.id);
        return { ...devStore, name: savedStore ? savedStore.name : devStore.name };
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
        if (store.id === currentStoreId) button.classList.add('active');
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
        if (storeTitle) storeTitle.innerHTML = `<i class="fas fa-store"></i> ${store.name}`;
        renderStoreNavigation();
        renderContentCards();
    }
}

// --- CONTENT RENDERING AND ACCESS LOGIC ---
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

    storeContent.forEach(card => {
        const permanentAccess = currentUser.access && currentUser.access.includes(card.id);
        
        // Calculate expiration from the fixed start date in the user's config
        let timedAccessEnd = null;
        const cardConfig = currentUser.timedAccessConfig ? currentUser.timedAccessConfig[card.id] : null;

        if (cardConfig && cardConfig.startDate && cardConfig.duration) {
            const startDate = new Date(`${cardConfig.startDate}T00:00:00Z`); // Use UTC for consistency
            timedAccessEnd = startDate.getTime() + (cardConfig.duration * 24 * 60 * 60 * 1000);
        }

        const isExpired = timedAccessEnd && timedAccessEnd <= Date.now();
        const hasAccess = permanentAccess || (timedAccessEnd && !isExpired);

        const cardElement = document.createElement('div');
        cardElement.className = `card ${hasAccess ? '' : 'locked'}`;
        let detailsHtml = '';
        let buttonHtml = '';

        if (hasAccess) {
            detailsHtml = `<p>${card.description}</p>`;
            if (timedAccessEnd && !permanentAccess) {
                detailsHtml += `<div class="countdown-container"><p>Time Remaining:</p><p class="countdown" data-expiration="${timedAccessEnd}" id="countdown-${card.id}"></p></div>`;
            }
            buttonHtml = `<a href="${card.link}"><i class="fas fa-external-link-alt"></i> Open</a>`;
        } else {
            if (isExpired) {
                detailsHtml = `<p class="time-limit-expired">Your configured access has expired.</p>`;
                buttonHtml = `<button class="purchase-btn" onclick="requestAccess('${card.id}')"><i class="fas fa-envelope"></i> Request Renewal</button>`;
            } else {
                detailsHtml = `<p>Access for this module is not configured for your account.</p>`;
                // The button is disabled because access must be granted by the admin in the code
                buttonHtml = `<button class="purchase-btn" onclick="requestAccess('${card.id}')" disabled><i class="fas fa-lock"></i> Not Available</button>`;
            }
        }
        cardElement.innerHTML = `<i class="${card.icon || 'fas fa-file'} card-icon"></i><h3>${card.title}</h3>${detailsHtml}${!hasAccess ? '<div class="lock-icon"><i class="fas fa-lock"></i></div>' : ''}${buttonHtml}`;
        cardsContainer.appendChild(cardElement);
    });

    startCountdownTimers();
}

// --- COUNTDOWN TIMER FUNCTIONS ---
function startCountdownTimers() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdowns, 1000);
}

function updateCountdowns() {
    const countdownElements = document.querySelectorAll('.countdown');
    if (countdownElements.length === 0) {
        clearInterval(countdownInterval);
        return;
    }
    countdownElements.forEach(el => {
        const expirationTime = parseInt(el.getAttribute('data-expiration'), 10);
        const remaining = expirationTime - Date.now();
        if (remaining <= 0) {
            el.innerHTML = "Expired";
            if (!el.classList.contains('expired')) {
                el.classList.add('expired');
                setTimeout(renderContentCards, 2000); // Re-render to update the card state
            }
            return;
        }
        const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const h = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((remaining % (1000 * 60)) / 1000);
        el.innerHTML = `<b>${d}</b>d <b>${h}</b>h <b>${m}</b>m <b>${s}</b>s`;
    });
}

// --- CORE APPLICATION FUNCTIONS ---
function setupProfileDropdown() {
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (!profileDropdown) return;
    const profileBtn = profileDropdown.querySelector('.profile-btn');
    profileBtn.addEventListener('click', e => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });
    document.addEventListener('click', e => {
        if (!profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });
}

function loginAsGuest() {
    currentUser = { 
        id: 0, 
        username: "guest", 
        name: "Guest User", 
        image: "ASSETS/TOOL-FILES/USER/USER.png", 
        timedAccessConfig: {

        "file3": { startDate: "2025-08-18", duration: 365 },  // Access starts Aug 15th for 30 days
        "file4": { startDate: "2025-08-18", duration: 365 },  // Access starts Aug 10th for 90 days
        "file5": { startDate: "2025-08-18", duration: 365 }, // Access for all of 2025
        "file6": { startDate: "2025-08-18", duration: 365 }, // Access for all of 2025

    } };
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
        clearInterval(countdownInterval); // Stop the countdown timer on logout
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

    document.getElementById('welcomeMessage').innerHTML = `<i class="fas fa-home"></i> Welcome : ${currentUser.name || currentUser.username}`;
    document.getElementById('profileName').textContent = currentUser.name || "No name";
    document.getElementById('profileUsername').textContent = `@${currentUser.username}`;
    document.getElementById('profileImg').src = currentUser.image || "https://via.placeholder.com/80";
    
    initializeStores();
    if (currentStoreId) switchStore(currentStoreId);
    setupProfileDropdown();
}

// --- MODAL AND STORE MANAGER FUNCTIONS ---
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
        if (store && newName) store.name = newName;
    });
    localStorage.setItem('lekhapadi_stores', JSON.stringify(stores));
    closeStoreManager();
    renderStoreNavigation();
    if (currentStoreId) switchStore(currentStoreId);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
    document.body.style.overflow = 'auto';
}

function requestAccess(contentId) {
    const card = contentCards.find(c => c.id === contentId);
    if (card) {
        // The purchase modal is now a contact modal for requesting access
        document.getElementById('modalTitle').textContent = `Request Access for: ${card.title}`;
        showModal('contactModal');
    }
}

// --- GLOBAL EVENT LISTENERS ---
window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) closeModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});