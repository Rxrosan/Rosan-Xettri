// Sample user data (for demonstration purposes)
const allUsers = [
    {
        id: "RX-A-01",
        userName: "ROSAN",
        fullName: "ROSAN KC",
        email: "rkc242855@gmail.com",
        image: "RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/A-1.png",
        phone: "9826482279",
        address: "BANGANGA-10, KAPILVASTU",
        accountType: "ADMIN",
        password: "Ro&@n2061",
        access: ["file1", "file2", "file3", "file4", ],
        timedAccessConfig: {},
        dateOfBirth: "2004-07-25",
    },
    {
        id: "RX-P-01",
        userName: "ROHIT",
        fullName: "Rohit kc",
        email: "rohitchattri71@gmail.com",
        image: "ASSET/WEB-SOFTWARE/USER/IMG/ROHIT-KC.jpg",
        phone: "9821948199",
        address: "BANGANGA-10, KAPILVASTU",
        accountType: "PARTNER",
        password: "RX9821948199",
        access: ["file1", "file2", "file3", "file4", ],
        timedAccessConfig: { },
        dateOfBirth: "2005-11-17",
    },
];

// Content Cards Database
const contentCards = [
    {   
        id: "file1", 
        title: "F1- LEKHAPADI ", 
        description: "ALL DOCUMENT COLLECTION : LOGIN PASSWORD = RX-2061", 
        link: "RX-LEKA-PADI.html?exam=file1", 
        icon: "fas fa-pencil",
        prices: { default: "Rs. 999/Month" }
    },
    {   
        id: "file2", 
        title: "F2- KOREAN EXAM PRACTICE", 
        description: "You can practice exam every time auto generate new questions randomly.", 
        link: "KR-EXAM.html", 
        icon: "fas fa-book",
        prices: { default: "Rs. 999/Month" }
    },
    {   
        id: "file3", 
        title: "F3- QR SCANNER", 
        description: "", 
        link: "RX-S-QR.html?exam=file3", 
        icon: "fas fa-pencil",
        prices: { default: "Rs. 100",}
    },
    {   
        id: "file4", 
        title: "F4- TEXT TO IMAGE ", 
        description: "LOGIN PASSWORD = RX2061", 
        link: "RX-IMG-CONVERTER.html?exam=file4", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100",}
    },
    
];

// Developer-Managed Stores (Fixed - Cannot be edited)
const stores = [
    {   id: "store_1", 
        name: "LEKHA-PADI", 
        content: ["file1",] },
    {   id: "store_2", 
        name: "EPS-EXAM-QUESTION", 
        content: ["file2",] },
    {   id: "store_3", 
        name: "WEB-SOFTWARE", 
        content: ["file3","file4"], },
];

// ===== USER MANAGEMENT MODULE =====
const UserManager = (() => {
    // Create a guest user
    const createGuestUser = () => {
        return {
            id: "GUEST",
            isGuest: true,
            userName: "GUEST",
            fullName: "RX STUDIO",
            email: "guest@rxstudio.com",
            image: "ASSET/WEB-SOFTWARE/USER/IMG/USER.png",
            phone: "-",
            address: "-",
            accountType: "GUEST",
            access: [],
            timedAccessConfig: {
                "file3": { startDate: "2026-01-01", duration: 375 },
                "file4": { startDate: "2026-01-01", duration: 375 },
            },
            dateOfBirth: null
        };
    };
    
    // Save user data to localStorage
    const saveUserData = (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (!user.isGuest) {
            localStorage.setItem('hasLoggedInBefore', 'true');
        }
    };

    // Get user data from localStorage
    const getUserData = () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    };

    // Check if user has logged in before
    const hasUserLoggedInBefore = () => {
        return localStorage.getItem('hasLoggedInBefore') === 'true';
    };

    // Get current logged-in user
    const getCurrentUser = () => {
        return getUserData();
    };

    // Update UI with user data (for USER.html)
    const updateUIWithUserData = (user) => {
        // Check if we're on USER.html page
        const isUserPage = document.getElementById('profileSection') !== null;
        
        if (isUserPage) {
            // Update USER.html elements with correct IDs
            const profileImg = document.getElementById('profile-img');
            const profileFullname = document.getElementById('profile-fullname');
            const profileUsername = document.getElementById('profile-username');
            const dropdownName = document.getElementById('dropdown-name');
            const username = document.getElementById('username');
            const dropdownEmail = document.getElementById('dropdown-email');
            const dropdownPhone = document.getElementById('dropdown-phone');
            const dropdownAddress = document.getElementById('dropdown-address');
            const dropdownAccountType = document.getElementById('dropdown-account-type');
            const dropdownUserId = document.getElementById('dropdown-user-id');
            const detailDOB = document.getElementById('detailDOB');
            
            if (profileImg) profileImg.src = user.image || 'RX-ASSETS/RX-IMAGE/RX-USER/default-profile.png';
            if (profileFullname) profileFullname.textContent = user.fullName || 'N/A';
            if (profileUsername) profileUsername.textContent = '@' + (user.userName || 'username');
            
            if (dropdownName) dropdownName.textContent = user.fullName || 'N/A';
            if (username) username.textContent = user.userName || 'N/A';
            if (dropdownEmail) dropdownEmail.textContent = user.email || 'N/A';
            if (dropdownPhone) dropdownPhone.textContent = user.phone || 'N/A';
            if (dropdownAddress) dropdownAddress.textContent = user.address || 'N/A';
            if (dropdownAccountType) dropdownAccountType.textContent = user.accountType || 'N/A';
            if (dropdownUserId) dropdownUserId.textContent = user.id || 'N/A';
            if (detailDOB) detailDOB.textContent = (user.dateOfBirth && user.dateOfBirth !== 'null') ? user.dateOfBirth : 'Not set';
        } else {
            // Update dashboard elements
            const usernameEl = document.getElementById('username');
            const profileImgEl = document.getElementById('profile-img');
            const dropdownImgEl = document.getElementById('dropdown-img');
            const dropdownNameEl = document.getElementById('dropdown-name');
            const dropdownEmailEl = document.getElementById('dropdown-email');
            const dropdownPhoneEl = document.getElementById('dropdown-phone');
            const dropdownAddressEl = document.getElementById('dropdown-address');
            const dropdownUserIdEl = document.getElementById('dropdown-user-id');
            const dropdownAccountTypeEl = document.getElementById('dropdown-account-type');
            
            if (usernameEl) usernameEl.textContent = user.isGuest ? 'GUEST' : user.userName;
            if (profileImgEl) profileImgEl.src = user.image;
            if (dropdownImgEl) dropdownImgEl.src = user.image;
            if (dropdownNameEl) dropdownNameEl.textContent = user.fullName;
            if (dropdownEmailEl) dropdownEmailEl.textContent = user.email;
            if (dropdownPhoneEl) dropdownPhoneEl.textContent = user.phone;
            if (dropdownAddressEl) dropdownAddressEl.textContent = user.address;
            if (dropdownUserIdEl) dropdownUserIdEl.textContent = user.id;
            if (dropdownAccountTypeEl) dropdownAccountTypeEl.textContent = user.accountType;
        }

        // Show/hide admin settings link
        const adminSettingsLink = document.getElementById('admin-settings-link');
        if (adminSettingsLink) {
            adminSettingsLink.style.display = user.accountType === "ADMIN" ? 'flex' : 'none';
        }
        
        // Show/hide login/profile sections on USER.html
        const loginSection = document.getElementById('loginSection');
        const profileSection = document.getElementById('profileSection');
        
        if (loginSection && profileSection) {
            if (user && !user.isGuest) {
                loginSection.style.display = 'none';
                profileSection.style.display = 'block';
            } else {
                loginSection.style.display = 'flex';
                profileSection.style.display = 'none';
            }
        }
    };

    // Login user with credentials
    const loginUser = (email, password) => {
        const foundUser = allUsers.find(user => user.email === email && user.password === password);
        if (foundUser) {
            saveUserData(foundUser);
            updateUIWithUserData(foundUser);

            // Clear login form fields
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            if (emailInput) emailInput.value = '';
            if (passwordInput) passwordInput.value = '';

            // Show notification
            const loginStatus = document.getElementById('loginStatus');
            if (loginStatus) {
                loginStatus.textContent = 'Login successful!';
                loginStatus.className = 'login-status success';
            }
            
            if (typeof NotificationManager !== 'undefined') {
                if (foundUser.accountType === "ADMIN") {
                    NotificationManager.showNotification("Welcome Admin!", "You have successfully logged in as an administrator.", "success", 8000);
                } else {
                    NotificationManager.showNotification("Welcome Back!", `You have successfully logged in as ${foundUser.fullName}.`, "success");
                }
            }

            return true;
        } else {
            // Show error
            const loginStatus = document.getElementById('loginStatus');
            if (loginStatus) {
                loginStatus.textContent = 'Invalid email or password';
                loginStatus.className = 'login-status error';
            } else {
                alert("Invalid email or password.");
            }
            return false;
        }
    };

    // Logout user and return to guest mode
    const logoutUser = () => {
        const guestUser = createGuestUser();
        saveUserData(guestUser);
        updateUIWithUserData(guestUser);
        
        if (typeof NotificationManager !== 'undefined') {
            NotificationManager.showNotification("Logged Out", "You have been logged out. Please login to access your account.", "warning");
        }
    };

    // Initialize user state
    const initUser = () => {
        let user = getUserData();

        if (!user || user.isGuest) { 
            user = createGuestUser();
            saveUserData(user);
            
            // Only show guest notification if user has never logged in before and NotificationManager exists
            if (!hasUserLoggedInBefore() && typeof NotificationManager !== 'undefined') {
                NotificationManager.showNotification("You are logged in as Guest", "To access your real account, please login", "warning");
            }
        } else {
            if (!hasUserLoggedInBefore() && typeof NotificationManager !== 'undefined') {
                NotificationManager.showNotification("Welcome Back!", `You are logged in as ${user.fullName}.`, "success", 3000);
            }
        }

        updateUIWithUserData(user);
    };

    // Check if user has access to a file
    const hasAccessToFile = (userId, fileId) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return false;
        
        if (user.access && user.access.includes(fileId)) return true;
        
        const fileConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
        if (fileConfig && fileConfig.startDate && fileConfig.duration) {
            const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`);
            const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000);
            return timedAccessEnd > Date.now();
        }
        
        return false;
    };

    // Get remaining time for timed access
    const getRemainingTime = (userId, fileId) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return 0;
        
        const fileConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
        if (fileConfig && fileConfig.startDate && fileConfig.duration) {
            const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`);
            const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000);
            const remaining = timedAccessEnd - Date.now();
            return remaining > 0 ? remaining : 0;
        }
        
        return 0;
    };

    return {
        initUser,
        loginUser,
        logoutUser,
        getCurrentUser,
        hasUserLoggedInBefore,
        hasAccessToFile,
        getRemainingTime
    };
})();

// ===== NOTIFICATION MODULE =====
const NotificationManager = (() => {
    let timeoutId = null;
    
    // Show notification
    const showNotification = (title, message, type = "warning", duration = 5000) => {
        const notification = document.getElementById('guest-notification');
        if (!notification) {
            // Fallback to alert if notification element doesn't exist
            console.log(`${title}: ${message}`);
            alert(`${title}: ${message}`);
            return;
        }
        
        const icon = notification.querySelector('i');
        const notificationTitle = document.getElementById('notification-title');
        const notificationMessage = document.getElementById('notification-message');

        notification.classList.remove('show');
        notification.style.borderLeftColor = '';

        if (notificationTitle) notificationTitle.textContent = title;
        if (notificationMessage) notificationMessage.textContent = message;

        if (type === "warning") {
            if (icon) icon.className = 'fas fa-info-circle';
            if (icon) icon.style.color = 'var(--warning)';
            notification.style.borderLeftColor = 'var(--warning)';
        } else if (type === "success") {
            if (icon) icon.className = 'fas fa-check-circle';
            if (icon) icon.style.color = 'var(--success)';
            notification.style.borderLeftColor = 'var(--success)';
        } else if (type === "info") {
            if (icon) icon.className = 'fas fa-info-circle';
            if (icon) icon.style.color = 'var(--accent)';
            notification.style.borderLeftColor = 'var(--accent)';
        } else if (type === "danger") {
            if (icon) icon.className = 'fas fa-exclamation-circle';
            if (icon) icon.style.color = '#f87171';
            notification.style.borderLeftColor = '#f87171';
        }

        notification.classList.add('show');

        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            hideNotification();
        }, duration);
    };

    // Hide notification
    const hideNotification = () => {
        const notification = document.getElementById('guest-notification');
        if (notification) {
            notification.classList.remove('show');
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return {
        showNotification,
        hideNotification
    };
})();

// ===== ADMIN PANEL MODULE =====
const AdminPanelManager = (() => {
    const renderMemberList = () => {
        const memberListUl = document.getElementById('member-list');
        if (!memberListUl) return;
        
        memberListUl.innerHTML = '';

        allUsers.forEach(user => {
            if (user.accountType !== "ADMIN") {
                const li = document.createElement('li');
                li.dataset.userId = user.id;
                li.innerHTML = `
                    <img src="${user.image}" alt="${user.fullName}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; margin-right: 10px;">
                    <span>${user.fullName} (${user.userName})</span>
                `;
                li.addEventListener('click', () => selectUser(user.id));
                memberListUl.appendChild(li);
            }
        });
    };

    const displayUserDetails = (userId) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) {
            const header = document.getElementById('selected-user-header');
            if (header) header.textContent = 'User not found.';
            const details = document.getElementById('selected-user-details');
            if (details) details.style.display = 'none';
            return;
        }

        const header = document.getElementById('selected-user-header');
        if (header) header.textContent = `Details for ${user.fullName}`;
        
        const details = document.getElementById('selected-user-details');
        if (details) details.style.display = 'block';

        const userIdEl = document.getElementById('admin-user-id');
        const fullNameEl = document.getElementById('admin-full-name');
        const emailEl = document.getElementById('admin-email');
        const phoneEl = document.getElementById('admin-phone');
        const addressEl = document.getElementById('admin-address');
        const accountTypeEl = document.getElementById('admin-account-type');
        const profileImgEl = document.getElementById('admin-profile-img');
        
        if (userIdEl) userIdEl.textContent = user.id;
        if (fullNameEl) fullNameEl.textContent = user.fullName;
        if (emailEl) emailEl.textContent = user.email;
        if (phoneEl) phoneEl.textContent = user.phone;
        if (addressEl) addressEl.textContent = user.address;
        if (accountTypeEl) accountTypeEl.textContent = user.accountType;
        if (profileImgEl) profileImgEl.src = user.image;

        // Update selected class in sidebar
        document.querySelectorAll('#member-list li').forEach(item => {
            item.classList.remove('selected');
            if (item.dataset.userId === userId) {
                item.classList.add('selected');
            }
        });
    };

    const selectUser = (userId) => {
        displayUserDetails(userId);
    };

    const openAdminPanel = () => {
        const currentUser = UserManager.getCurrentUser();
        if (currentUser && currentUser.accountType === "ADMIN") {
            renderMemberList();
            const header = document.getElementById('selected-user-header');
            if (header) header.textContent = 'Select a Member to View Details';
            const details = document.getElementById('selected-user-details');
            if (details) details.style.display = 'none';
            document.querySelectorAll('#member-list li').forEach(item => item.classList.remove('selected'));
            
            const modal = document.getElementById('admin-panel-modal');
            if (modal) modal.style.display = 'block';
        } else {
            if (typeof NotificationManager !== 'undefined') {
                NotificationManager.showNotification("Access Denied", "You do not have administrative privileges.", "danger", 4000);
            }
        }
    };

    const closeAdminPanel = () => {
        const modal = document.getElementById('admin-panel-modal');
        if (modal) modal.style.display = 'none';
    };

    return {
        openAdminPanel,
        closeAdminPanel
    };
})();

// ===== STORE MANAGEMENT MODULE =====
const StoreManager = (() => {
    let currentStoreId = stores.length > 0 ? stores[0].id : null;
    let countdownInterval = null;

    const renderStoreNavigation = () => {
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
    };

    const switchStore = (storeId) => {
        currentStoreId = storeId;
        const store = stores.find(s => s.id === storeId);
        if (store) {
            const storeTitle = document.getElementById('storeTitle');
            if (storeTitle) storeTitle.innerHTML = `${store.name}`;
            renderStoreNavigation();
            renderContentCards();
        }
    };

    const renderContentCards = () => {
        const cardsContainer = document.getElementById('contentCards');
        if (!cardsContainer) return;

        cardsContainer.innerHTML = '';
        
        const store = stores.find(s => s.id === currentStoreId);
        if (!store || store.content.length === 0) {
            cardsContainer.innerHTML = '<p class="no-content">No content available in this store.</p>';
            return;
        }
        
        const storeContent = contentCards.filter(card => store.content.includes(card.id));
        const currentUser = UserManager.getCurrentUser();

        storeContent.forEach(card => {
            const permanentAccess = currentUser.access && currentUser.access.includes(card.id);
            
            let timedAccessEnd = null;
            const cardConfig = currentUser.timedAccessConfig ? currentUser.timedAccessConfig[card.id] : null;

            if (cardConfig && cardConfig.startDate && cardConfig.duration) {
                const startDate = new Date(`${cardConfig.startDate}T00:00:00Z`);
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
                
                if (card.link.includes("KR-EXAM.html")) {
                    buttonHtml = `<a href="#" onclick="prepareAndLaunchExam('${card.id}', '${card.link}')"><i class="fas fa-external-link-alt"></i> Open</a>`;
                } else {
                    buttonHtml = `<a href="${card.link}"><i class="fas fa-external-link-alt"></i> Open</a>`;
                }
            } else {
                if (isExpired) {
                    detailsHtml = `<p class="time-limit-expired">Your timed access has expired.</p>`;
                    buttonHtml = `<button class="purchase-btn" onclick="requestAccess('${card.id}', true)"><i class="fas fa-envelope"></i> Request Renewal</button>`;
                } else {
                    const price = getPriceForUser(card, currentUser);
                    detailsHtml = `<p>Purchase to get access.</p><div class="price">${price}</div>`;
                    buttonHtml = `<button class="purchase-btn" onclick="requestAccess('${card.id}', false)"><i class="fas fa-shopping-cart"></i> Purchase Access</button>`;
                }
            }
            cardElement.innerHTML = `<i class="${card.icon || 'fas fa-file'} card-icon"></i><h3>${card.title}</h3>${detailsHtml}${!hasAccess ? '<div class="lock-icon"><i class="fas fa-lock"></i></div>' : ''}${buttonHtml}`;
            cardsContainer.appendChild(cardElement);
        });

        startCountdownTimers();
    };

    const getPriceForUser = (card, user) => {
        if (!card.prices) return "Not for sale";
        if (user && card.prices[user.id]) return card.prices[user.id];
        return card.prices.default || "Contact for price";
    };

    const startCountdownTimers = () => {
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(updateCountdowns, 1000);
    };

    const updateCountdowns = () => {
        const countdownElements = document.querySelectorAll('.countdown');
        countdownElements.forEach(el => {
            const expirationTime = parseInt(el.getAttribute('data-expiration'), 10);
            const remaining = expirationTime - Date.now();
            if (remaining <= 0) {
                el.innerHTML = "Expired";
                if (!el.classList.contains('expired')) {
                    el.classList.add('expired');
                    setTimeout(renderContentCards, 1500);
                }
                return;
            }
            const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const h = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((remaining % (1000 * 60)) / 1000);
            el.innerHTML = `<b>${d}</b>d <b>${h}</b>h <b>${m}</b>m <b>${s}</b>s`;
        });
    };

    const prepareAndLaunchExam = (examId, examUrl) => {
        if (!examId || !examUrl) {
            console.error("Cannot launch exam: Missing examId or examUrl.");
            return;
        }
        console.log(`Preparing to launch exam. ID: ${examId}`);
        localStorage.setItem('selectedExamId', examId);
        window.location.href = examUrl;
    };

    const requestAccess = (contentId, isRenewal) => {
        const card = contentCards.find(c => c.id === contentId);
        if (!card) {
            console.error("Card data not found for ID:", contentId);
            return;
        }

        const modalTitleEl = document.getElementById('modalTitle');
        const modalPriceEl = document.getElementById('modalPrice');
        const facebookLink = document.getElementById('facebookContactLink');
        const emailLink = document.getElementById('emailContactLink');

        if (!modalTitleEl || !modalPriceEl || !facebookLink || !emailLink) {
            alert("Error: The contact modal HTML is missing or has incorrect IDs. Please check the dashboard file.");
            return;
        }

        const price = getPriceForUser(card, UserManager.getCurrentUser());
        let subject = '';

        if (isRenewal) {
            modalTitleEl.textContent = `Request Renewal: ${card.title}`;
            modalPriceEl.textContent = `Please contact us to discuss renewal options.`;
            subject = `Renewal Inquiry for ${card.title} (User: ${UserManager.getCurrentUser().userName})`;
        } else {
            modalTitleEl.textContent = `Purchase Access: ${card.title}`;
            modalPriceEl.textContent = `Price: ${price}`;
            subject = `Purchase Inquiry for ${card.title} (User: ${UserManager.getCurrentUser().userName})`;
        }

        facebookLink.href = "https://www.facebook.com/RosanXettri.2004"; 
        emailLink.href = `mailto:rkc242855@gmail.com?subject=${encodeURIComponent(subject)}`;
        
        showModal('purchaseModal');
    };

    // Initialize stores (just sets currentStoreId)
    const initializeStores = () => {
        if (stores.length > 0 && !currentStoreId) {
            currentStoreId = stores[0].id;
        }
    };

    return {
        initializeStores,
        renderStoreNavigation,
        renderContentCards,
        prepareAndLaunchExam,
        requestAccess
    };
})();

// Global functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Make StoreManager functions globally available
window.prepareAndLaunchExam = StoreManager.prepareAndLaunchExam;
window.requestAccess = StoreManager.requestAccess;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user state
    if (typeof UserManager !== 'undefined') {
        UserManager.initUser();
    }

    // Initialize stores if on dashboard
    if (document.getElementById('storeNavigation')) {
        StoreManager.initializeStores();
        StoreManager.renderStoreNavigation();
        StoreManager.renderContentCards();
    }

    // Set up event listeners for USER.html
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            UserManager.loginUser(email, password);
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            UserManager.logoutUser();
        });
    }

    const menuToggle = document.getElementById('menuToggle');
    const closePanel = document.getElementById('closePanel');
    const panelOverlay = document.getElementById('panelOverlay');
    const sidePanel = document.getElementById('sidePanel');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (sidePanel) sidePanel.classList.add('active');
            if (panelOverlay) panelOverlay.classList.add('active');
        });
    }
    
    if (closePanel) {
        closePanel.addEventListener('click', function() {
            if (sidePanel) sidePanel.classList.remove('active');
            if (panelOverlay) panelOverlay.classList.remove('active');
        });
    }
    
    if (panelOverlay) {
        panelOverlay.addEventListener('click', function() {
            if (sidePanel) sidePanel.classList.remove('active');
            if (panelOverlay) panelOverlay.classList.remove('active');
        });
    }

    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const loginBtn = document.getElementById('loginBtn');
                if (loginBtn) loginBtn.click();
            }
        });
    }

    // Admin settings link
    const adminLink = document.getElementById('admin-settings-link');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof AdminPanelManager !== 'undefined') {
                AdminPanelManager.openAdminPanel();
            }
        });
    }

    // Close modal when clicking on close button or outside
    const closeButtons = document.querySelectorAll('.close, .close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
});

// Add CSS for admin panel enhancements and notifications
const style = document.createElement('style');
style.textContent = `
:root {
    --warning: #fbbf24;
    --success: #4ade80;
    --accent: #64ffda;
    --danger: #f87171;
}

.detail-section {
    margin-top: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: 100%;
    box-sizing: border-box;
}

.detail-section h4 {
    margin-top: 0;
    color: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 8px;
    font-size: clamp(1.1rem, 2.5vw, 1.3rem);
}

.access-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
}

.access-table table {
    width: 100%;
    min-width: 500px;
}

.access-table th, .access-table td {
    padding: clamp(6px, 2vw, 12px) clamp(8px, 2vw, 12px);
    text-align: left;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
    font-size: clamp(0.8rem, 2vw, 0.9rem);
}

.access-table th {
    background-color: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    font-weight: bold;
    color: rgba(255, 255, 255, 0.9);
    font-size: clamp(0.85rem, 2vw, 0.95rem);
}

.access-table tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.05);
}

.access-table .active {
    color: #4ade80;
    font-weight: bold;
}

.access-table .expired {
    color: #f87171;
    font-weight: bold;
}

.countdown-container {
    margin-top: 10px;
    padding: clamp(8px, 2vw, 12px);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
}

.countdown {
    font-family: monospace;
    font-size: clamp(0.8rem, 2.5vw, 0.9rem);
    color: rgba(255, 255, 255, 0.8);
    word-break: break-all;
}

.countdown.expired {
    color: #f87171;
    font-weight: bold;
}

.time-limit-expired {
    color: #f87171;
    font-weight: bold;
    font-size: clamp(0.85rem, 2.5vw, 1rem);
}

.login-status.success {
    color: #4ade80;
    margin-top: 10px;
    text-align: center;
}

.login-status.error {
    color: #f87171;
    margin-top: 10px;
    text-align: center;
}

/* Mobile First Responsive Design */
@media (max-width: 768px) {
    .detail-section {
        margin-top: 15px;
        padding: 12px;
        border-radius: 6px;
    }
    
    .access-table {
        margin-top: 8px;
        border-radius: 4px;
    }
    
    .access-table th, .access-table td {
        padding: 6px 8px;
        font-size: 0.8rem;
    }
    
    .access-table th {
        font-size: 0.82rem;
    }
    
    .countdown-container {
        margin-top: 8px;
        padding: 8px;
    }
}

@media (max-width: 480px) {
    .detail-section {
        margin-top: 12px;
        padding: 10px;
        border-radius: 4px;
    }
    
    .detail-section h4 {
        font-size: 1rem;
        padding-bottom: 6px;
    }
    
    .access-table th, .access-table td {
        padding: 4px 6px;
        font-size: 0.75rem;
    }
    
    .access-table th {
        font-size: 0.77rem;
    }
    
    .countdown {
        font-size: 0.75rem;
    }
    
    .time-limit-expired {
        font-size: 0.8rem;
    }
}

/* Tablet and Small Desktop */
@media (min-width: 769px) and (max-width: 1024px) {
    .detail-section {
        padding: 18px;
    }
    
    .access-table th, .access-table td {
        padding: 10px 14px;
    }
}

/* Large Desktop */
@media (min-width: 1025px) {
    .detail-section {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .access-table {
        max-width: 100%;
    }
}

/* Extra Small Devices */
@media (max-width: 360px) {
    .detail-section {
        padding: 8px;
        margin-top: 10px;
    }
    
    .detail-section h4 {
        font-size: 0.9rem;
    }
    
    .access-table th, .access-table td {
        padding: 3px 4px;
        font-size: 0.7rem;
    }
    
    .countdown {
        font-size: 0.7rem;
    }
}

/* High DPI Screens */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .detail-section {
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    }
    
    .access-table th {
        backdrop-filter: blur(15px);
    }
    
    .countdown-container {
        backdrop-filter: blur(15px);
    }
}

/* Landscape Mobile */
@media (max-width: 768px) and (orientation: landscape) {
    .detail-section {
        padding: 10px;
    }
    
    .access-table {
        max-height: 200px;
        overflow-y: auto;
    }
    
    .access-table th, .access-table td {
        padding: 4px 6px;
    }
}

/* Print Styles */
@media print {
    .detail-section {
        background: white;
        border: 1px solid #000;
        color: #000;
    }
    
    .detail-section h4 {
        color: #000;
        border-bottom-color: #000;
    }
    
    .access-table th, .access-table td {
        color: #000;
        border-color: #000;
    }
    
    .access-table th {
        background-color: #f0f0f0;
    }
    
    .countdown-container {
        background-color: #f0f0f0;
        border-color: #000;
    }
    
    .countdown {
        color: #000;
    }
}
`;
document.head.appendChild(style);

// ModalManager if not defined
if (typeof ModalManager === 'undefined') {
    window.ModalManager = {
        showModal: (id) => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        },
        hideModal: (id) => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    };
}