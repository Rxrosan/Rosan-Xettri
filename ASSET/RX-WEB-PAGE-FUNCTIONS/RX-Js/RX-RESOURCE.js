// ===== SUPABASE CONFIGURATION (REMOVED TO FIX DUPLICATE ERROR) =====
// Supabase is initialized elsewhere. We skip it here to prevent "Identifier already declared" error.

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
        title: "F2- KOREAN EXAM PRACTICE - WEB-APP | COMBINE SETS ", 
        description: "You can practice exam every time auto generate new questions randomly.", 
        link: "RX-KR-EXAM-MODEL-1.html?exam=file2", 
        icon: "fas fa-book",
        prices: { default: "Rs. 999/Month" }
    },
    {   
        id: "file3", 
        title: "F3- QR SCANNER", 
        description: "Scan QR codes instantly", 
        link: "RX-S-QR.html?exam=file3", 
        icon: "fas fa-qrcode",
        prices: { default: "Rs. 100" }
    },
    {   
        id: "file4", 
        title: "F4- TEXT TO IMAGE ", 
        description: "LOGIN PASSWORD = RX2061", 
        link: "RX-IMG-CONVERTER.html?exam=file4", 
        icon: "fas fa-pen",
        prices: { default: "Rs. 100" }
    },
    {   
        id: "file5", 
        title: "F5- KOREAN EXAM PRACTICE - WEB-APP | SET-1", 
        description: "You can practice exam with set question.", 
        link: "RX-KR-EXAM-MODEL-2.html?exam=file5", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100/set" }
    },
    {   
        id: "file6", 
        title: "F6- KOREAN EXAM PRACTICE - WEB-APP | SET-2 COMING SOON....", 
        description: "You can practice exam with set question.", 
        link: "RX-KR-EXAM-MODEL-2.html?exam=file6", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100/set" }
    },
    {   
        id: "file7", 
        title: "F7- KOREAN EXAM PRACTICE - WEB-APP | SET-3", 
        description: "You can practice exam with set question.", 
        link: "RX-KR-EXAM-MODEL-2.html?exam=file7", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100/set" }
    },
];

// Developer-Managed Stores
const stores = [
    {   id: "store_1", 
        name: "LEKHA-PADI", 
        content: ["file1"] 
    },
    {   id: "store_2", 
        name: "EPS-EXAM-QUESTION", 
        content: ["file2","file5","file6","file7"] 
    },
    {   id: "store_3", 
        name: "WEB-SOFTWARE", 
        content: ["file3", "file4"] 
    },
];

// Formspree endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzznawep';

// ===== USER SESSION MANAGER ===== //
const UserSession = {
    currentUser: null,
    userAccess: [],

    getCurrentUser() {
        try {
            const session = sessionStorage.getItem('rxSession');
            if (session) {
                this.currentUser = JSON.parse(session);
                return this.currentUser;
            }
            const localSession = localStorage.getItem('currentUser');
            if (localSession) {
                this.currentUser = JSON.parse(localSession);
                return this.currentUser;
            }
            return null;
        } catch (error) {
            console.error("Error getting current user:", error);
            return null;
        }
    },

    isLoggedIn() {
        const user = this.getCurrentUser();
        return user && user.id && user.id !== 'GUEST' && !user.isGuest;
    },

    getUserAccess() {
        const user = this.getCurrentUser();
        if (!user) return [];
        
        if (user.access && Array.isArray(user.access)) {
            this.userAccess = user.access;
            return user.access;
        }
        
        if (user.accountType === 'ADMIN' || user.account_type === 'Admin' || user.role === 'admin') {
            this.userAccess = ['file1', 'file2', 'file3', 'file4', 'file5', 'file6', 'file7'];
            return this.userAccess;
        }
        
        return [];
    },

    hasAccess(fileId) {
        const access = this.getUserAccess();
        const user = this.getCurrentUser();
        if (user && (user.accountType === 'ADMIN' || user.account_type === 'Admin' || user.role === 'admin')) {
            return true;
        }
        return access.includes(fileId);
    },

    getUserProfile() {
        const user = this.getCurrentUser();
        if (!user) return null;
        return {
            id: user.id || 'GUEST',
            name: user.full_name || user.fullName || user.name || 'Guest',
            email: user.email || '-',
            phone: user.phone || '-',
            address: user.address || '-',
            accountType: user.accountType || user.account_type || user.role || 'USER',
            image: user.image || 'ASSET/WEB-SOFTWARE/USER/IMG/USER.png',
            access: this.getUserAccess(),
            isLoggedIn: this.isLoggedIn()
        };
    },

    displayUserInfo() {
        const user = this.getCurrentUser();
        if (!user || user.isGuest) {
            this.showGuestUI();
            return;
        }

        const usernameEl = document.getElementById('username');
        const profileImgEl = document.getElementById('profile-img');
        const dropdownNameEl = document.getElementById('dropdown-name');
        const dropdownEmailEl = document.getElementById('dropdown-email');
        const dropdownPhoneEl = document.getElementById('dropdown-phone');
        const dropdownAddressEl = document.getElementById('dropdown-address');
        const dropdownUserIdEl = document.getElementById('dropdown-user-id');
        const dropdownAccountTypeEl = document.getElementById('dropdown-account-type');

        if (usernameEl) usernameEl.textContent = user.full_name || user.fullName || user.name || 'User';
        if (profileImgEl) profileImgEl.src = user.image || 'ASSET/WEB-SOFTWARE/USER/IMG/USER.png';
        if (dropdownNameEl) dropdownNameEl.textContent = user.full_name || user.fullName || user.name || 'Guest';
        if (dropdownEmailEl) dropdownEmailEl.textContent = user.email || '-';
        if (dropdownPhoneEl) dropdownPhoneEl.textContent = user.phone || '-';
        if (dropdownAddressEl) dropdownAddressEl.textContent = user.address || '-';
        if (dropdownUserIdEl) dropdownUserIdEl.textContent = user.id || 'GUEST';
        
        if (dropdownAccountTypeEl) {
            const accType = user.accountType || user.account_type || user.role || 'USER';
            dropdownAccountTypeEl.textContent = accType;
            if (accType === 'ADMIN' || accType === 'Admin') {
                dropdownAccountTypeEl.style.color = '#ff6b6b';
            } else if (accType === 'PREMIUM') {
                dropdownAccountTypeEl.style.color = '#ffd93d';
            } else {
                dropdownAccountTypeEl.style.color = '#64ffda'; // Neon
            }
        }

        const loginSection = document.getElementById('loginSection');
        const profileSection = document.getElementById('profileSection');
        if (loginSection) loginSection.style.display = 'none';
        if (profileSection) profileSection.style.display = 'block';
    },

    showGuestUI() {
        const loginSection = document.getElementById('loginSection');
        const profileSection = document.getElementById('profileSection');
        if (loginSection) loginSection.style.display = 'flex';
        if (profileSection) profileSection.style.display = 'none';

        const usernameEl = document.getElementById('username');
        if (usernameEl) usernameEl.textContent = 'GUEST';
        
        const profileImgEl = document.getElementById('profile-img');
        if (profileImgEl) profileImgEl.src = 'ASSET/WEB-SOFTWARE/USER/IMG/USER.png';
    },

    init() {
        this.getCurrentUser();
        this.getUserAccess();
        this.displayUserInfo();
        console.log('✅ User Session Manager initialized');
    }
};

// ===== NOTIFICATION MODULE =====
const NotificationManager = {
    timeoutId: null,
    
    showNotification(title, message, type = "warning", duration = 3000) {
        let notification = document.getElementById('guest-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'guest-notification';
            notification.className = 'guest-notification';
            notification.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <div class="notification-content">
                    <div id="notification-title" class="notification-title">${title}</div>
                    <div id="notification-message" class="notification-message">${message}</div>
                </div>
            `;
            document.body.appendChild(notification);
            
            const style = document.createElement('style');
            style.textContent = `
                .guest-notification {
                    position: fixed; bottom: 20px; right: 20px; background: #1a1a2e; color: white;
                    padding: 15px 20px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                    display: flex; align-items: center; gap: 15px; transform: translateX(400px);
                    transition: transform 0.3s ease; z-index: 10000; border-left: 4px solid; max-width: 350px;
                }
                .guest-notification.show { transform: translateX(0); }
                .guest-notification i { font-size: 24px; }
                .notification-content { flex: 1; }
                .notification-title { font-weight: bold; margin-bottom: 5px; font-size: 16px; }
                .notification-message { font-size: 14px; opacity: 0.9; }
            `;
            document.head.appendChild(style);
        }
        
        const icon = notification.querySelector('i');
        const notificationTitle = document.getElementById('notification-title');
        const notificationMessage = document.getElementById('notification-message');

        notification.classList.remove('show');
        if (notificationTitle) notificationTitle.textContent = title;
        if (notificationMessage) notificationMessage.textContent = message;

        const colors = { warning: '#fbbf24', success: '#4ade80', info: '#64ffda', danger: '#f87171' };
        const icons = { warning: 'fa-info-circle', success: 'fa-check-circle', info: 'fa-info-circle', danger: 'fa-exclamation-circle' };

        if (icon) {
            icon.className = `fas ${icons[type] || 'fa-info-circle'}`;
            icon.style.color = colors[type] || colors.info;
        }
        notification.style.borderLeftColor = colors[type] || colors.info;
        notification.classList.add('show');

        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => { 
            notification.classList.remove('show'); 
        }, duration);
    },

    hideNotification() {
        const notification = document.getElementById('guest-notification');
        if (notification) notification.classList.remove('show');
        if (this.timeoutId) { 
            clearTimeout(this.timeoutId); 
            this.timeoutId = null; 
        }
    }
};

// ===== PAYMENT MODULE =====
const PaymentManager = {
    createPaymentModal() {
        if (document.getElementById('rx-payment-modal')) return;

        const modalHTML = `
            <div id="rx-payment-modal" class="rx-modal" style="display: none;">
                <div class="rx-modal-content">
                    <div class="rx-modal-header">
                        <h2 id="rx-modal-title">Purchase Access</h2>
                        <span class="rx-close" onclick="PaymentManager.closeModal()">&times;</span>
                    </div>
                    <div class="rx-modal-body">
                        <form id="rx-payment-form" action="${FORMSPREE_ENDPOINT}" method="POST">
                            <input type="hidden" name="_subject" id="rx-form-subject" value="New Purchase Request">
                            <input type="hidden" name="_template" value="table">
                            <input type="hidden" name="_gotcha" style="display:none !important">
                            <div class="rx-section">
                                <h3><i class="fas fa-file-alt"></i> File Information</h3>
                                <div class="rx-form-grid">
                                    <div class="rx-form-group"><label>File Name</label><input type="text" id="rx-file-name" name="file_name" readonly class="rx-auto-field"></div>
                                    <div class="rx-form-group"><label>Price</label><input type="text" id="rx-file-price" name="file_price" readonly class="rx-auto-field"></div>
                                </div>
                            </div>
                            <div class="rx-section">
                                <h3><i class="fas fa-user"></i> Your Information</h3>
                                <div class="rx-form-grid">
                                    <div class="rx-form-group"><label>Full Name</label><input type="text" id="rx-user-name" name="user_name" readonly class="rx-auto-field"></div>
                                    <div class="rx-form-group"><label>User ID</label><input type="text" id="rx-user-id" name="user_id" readonly class="rx-auto-field"></div>
                                    <div class="rx-form-group"><label>Email</label><input type="email" id="rx-user-email" name="user_email" readonly class="rx-auto-field"></div>
                                    <div class="rx-form-group"><label>Phone</label><input type="text" id="rx-user-phone" name="user_phone" readonly class="rx-auto-field"></div>
                                </div>
                            </div>
                            <div class="rx-form-actions">
                                <button type="submit" id="rx-submit-btn" class="rx-btn rx-btn-submit"><i class="fas fa-paper-plane"></i> Submit Request</button>
                                <button type="button" class="rx-btn rx-btn-cancel" onclick="PaymentManager.closeModal()"><i class="fas fa-times"></i> Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        if (!document.getElementById('modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            // CHANGE 1: Notification/Payment Modal को Background र Text आदि White/Blue भयो
            style.textContent = `
                .rx-modal { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); }
                .rx-modal-content { background-color: #ffffff; margin: 5% auto; padding: 20px; border-radius: 10px; width: 90%; max-width: 600px; color: #333333; animation: slideDown 0.3s ease; border: 1px solid #d0dbe8; }
                @keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .rx-modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d0dbe8; padding-bottom: 15px; }
                .rx-close { font-size: 28px; cursor: pointer; color: #aaa; transition: color 0.3s; }
                .rx-close:hover { color: #e74c3c; }
                .rx-modal-body { padding: 20px 0; }
                .rx-section { margin-bottom: 20px; }
                .rx-section h3 { margin-bottom: 15px; color: #1a4480; font-size: 18px; }
                .rx-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .rx-form-group { display: flex; flex-direction: column; }
                .rx-form-group label { margin-bottom: 5px; font-size: 14px; color: #666666; }
                .rx-form-group input { padding: 10px; border: 1px solid #d0dbe8; border-radius: 5px; background: #ffffff; color: #333333; font-size: 14px; }
                .rx-form-group input:focus { outline: none; border-color: #1a4480; }
                .rx-form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
                .rx-btn { padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; transition: all 0.3s; }
                .rx-btn-submit { background: #1a4480; color: #ffffff; font-weight: bold; }
                .rx-btn-submit:hover { background: #0056b3; transform: scale(1.02); }
                .rx-btn-cancel { background: #f8fafc; color: #1a4480; border: 1px solid #d0dbe8; }
                .rx-btn-cancel:hover { background: #ffffff; border-color: #1a4480; }
                @media (max-width: 600px) { .rx-form-grid { grid-template-columns: 1fr; } }
            `;
            document.head.appendChild(style);
        }
    },

    getPriceForUser(card, user) {
        if (!card || !card.prices) return "Not for sale";
        if (user && !user.isGuest && card.prices[user.id]) return card.prices[user.id];
        return card.prices.default || "Contact for price";
    },

    showPurchaseModal(contentId, isRenewal = false) {
        this.createPaymentModal();
        const card = contentCards.find(c => c.id === contentId);
        if (!card) {
            NotificationManager.showNotification("Error", "Content not found!", "danger");
            return;
        }

        const currentUser = UserSession.getCurrentUser();
        if (!currentUser || currentUser.isGuest) {
            NotificationManager.showNotification("Notice", "Please login to purchase or request access.", "warning", 4000);
            return;
        }

        document.getElementById('rx-modal-title').textContent = isRenewal ? `Renew Access: ${card.title}` : `Purchase Access: ${card.title}`;
        document.getElementById('rx-file-name').value = card.title;
        document.getElementById('rx-file-price').value = this.getPriceForUser(card, currentUser);
        document.getElementById('rx-user-name').value = currentUser.full_name || currentUser.fullName || currentUser.name || 'GUEST';
        document.getElementById('rx-user-id').value = currentUser.id || 'GUEST';
        document.getElementById('rx-user-email').value = currentUser.email || '-';
        document.getElementById('rx-user-phone').value = currentUser.phone || '-';

        document.getElementById('rx-payment-modal').style.display = 'block';
    },

    closeModal() {
        const modal = document.getElementById('rx-payment-modal');
        if (modal) modal.style.display = 'none';
    }
};

// ===== STORE MANAGEMENT MODULE =====
const StoreManager = {
    currentStoreId: stores.length > 0 ? stores[0].id : null,

    renderStoreNavigation() {
        const navContainer = document.getElementById('storeNavigation');
        if (!navContainer) {
            console.warn("Store navigation container not found");
            return;
        }
        navContainer.innerHTML = '';
        stores.forEach(store => {
            const button = document.createElement('button');
            button.className = `store-btn ${store.id === this.currentStoreId ? 'active' : ''}`;
            button.textContent = store.name;
            button.onclick = () => this.switchStore(store.id);
            navContainer.appendChild(button);
        });
    },

    switchStore(storeId) {
        this.currentStoreId = storeId;
        const store = stores.find(s => s.id === storeId);
        if (store) {
            const storeTitle = document.getElementById('storeTitle');
            if (storeTitle) storeTitle.innerHTML = `<span>${store.name}</span>`;
            this.renderStoreNavigation();
            this.renderContentCards();
        }
    },

    renderContentCards() {
        const cardsContainer = document.getElementById('contentCards');
        if (!cardsContainer) {
            console.warn("Content cards container not found");
            return;
        }

        cardsContainer.innerHTML = '';
        const store = stores.find(s => s.id === this.currentStoreId);
        if (!store) {
            cardsContainer.innerHTML = '<p style="text-align: center; color: #666666;">No store selected</p>';
            return;
        }
        
        const storeContent = contentCards.filter(card => store.content.includes(card.id));
        const currentUser = UserSession.getCurrentUser();
        const isLoggedIn = UserSession.isLoggedIn();

        if (storeContent.length === 0) {
            cardsContainer.innerHTML = '<p style="text-align: center; color: #666666; padding: 40px;">No content available in this store</p>';
            return;
        }

        storeContent.forEach(card => {
            const hasAccess = UserSession.hasAccess(card.id);
            const cardElement = document.createElement('div');
            cardElement.className = `card ${hasAccess ? '' : 'locked'}`;
            
            let detailsHtml = '';
            let buttonHtml = '';

            if (hasAccess) {
                detailsHtml = `<p>${card.description || ''}</p>`;
                buttonHtml = `<a href="${card.link}"><i class="fas fa-external-link-alt"></i> Open</a>`;
            } else {
                const price = PaymentManager.getPriceForUser(card, currentUser);
                detailsHtml = `
                    <p>${card.description || 'Purchase to get access.'}</p>
                    <div class="price">${price}</div>
                `;
                
                if (isLoggedIn) {
                    buttonHtml = `<button class="purchase-btn" onclick="handlePurchaseRequest('${card.id}', false)"><i class="fas fa-shopping-cart"></i> Purchase Access</button>`;
                } else {
                    buttonHtml = `<button class="purchase-btn login-required" onclick="NotificationManager.showNotification('Login Required', 'Please login first to view file details and purchase.', 'warning', 4000)"><i class="fas fa-lock"></i> Login to View Details</button>`;
                }
            }

            cardElement.innerHTML = `
                <i class="${card.icon || 'fas fa-file'} card-icon"></i>
                <h3>${card.title}</h3>
                ${detailsHtml}
                ${!hasAccess ? '<div class="lock-icon"><i class="fas fa-lock"></i></div>' : ''}
                ${buttonHtml}
            `;
            cardsContainer.appendChild(cardElement);
        });
    },

    initializeStores() {
        if (!document.getElementById('store-styles')) {
            const style = document.createElement('style');
            style.id = 'store-styles';
            // CHANGE 2: Card र Store Buttons को Dark Theme लाई White/Blue Theme मा बदलियो
            style.textContent = `
                .store-navigation { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; justify-content: center; padding: 10px; }
                .store-btn { padding: 12px 24px; background: #f8fafc; color: #1a4480; border: 1px solid #d0dbe8; border-radius: 8px; cursor: pointer; transition: all 0.3s; font-size: 16px; font-weight: 600; }
                .store-btn:hover { background: #ffffff; border-color: #1a4480; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(26, 68, 128, 0.1); }
                .store-btn.active { background: #1a4480; color: #ffffff; border-color: #1a4480; font-weight: bold; box-shadow: 0 4px 12px rgba(26, 68, 128, 0.25); }
                .store-title { text-align: center; margin: 20px 0; color: #1a4480; font-size: 24px; }
                .content-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 20px; }
                .card { background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #d0dbe8; transition: all 0.3s; position: relative; }
                .card:hover { transform: translateY(-5px); border-color: #1a4480; box-shadow: 0 10px 30px rgba(26, 68, 128, 0.08); }
                .card.locked { opacity: 0.8; }
                .card.locked:hover { opacity: 1; }
                .card-icon { font-size: 40px; color: #1a4480; margin-bottom: 15px; display: block; }
                .card h3 { color: #1a4480; margin-bottom: 10px; font-size: 18px; font-weight: 700; }
                .card p { color: #555555; font-size: 14px; margin-bottom: 10px; line-height: 1.5; }
                .card .price { color: #0056b3; font-weight: bold; font-size: 18px; margin: 10px 0; padding: 5px 10px; background: rgba(26, 68, 128, 0.06); border-radius: 5px; display: inline-block; border: 1px solid rgba(26, 68, 128, 0.1); }
                .lock-icon { position: absolute; top: 15px; right: 15px; color: #e74c3c; font-size: 20px; }
                .purchase-btn { background: #1a4480; color: #ffffff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: all 0.3s; width: 100%; font-size: 16px; }
                .purchase-btn:hover { background: #0056b3; transform: scale(1.02); box-shadow: 0 4px 12px rgba(26, 68, 128, 0.3); }
                .purchase-btn.login-required { background: #f8fafc; color: #1a4480; border: 1px solid #d0dbe8; }
                .purchase-btn.login-required:hover { background: #e74c3c; color: #ffffff; border-color: #e74c3c; }
                .card a { display: inline-block; background: #1a4480; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; width: 100%; text-align: center; transition: all 0.3s; }
                .card a:hover { background: #0056b3; transform: scale(1.02); }
                .card a i { margin-right: 8px; }
                @media (max-width: 768px) { 
                    .content-cards { grid-template-columns: 1fr; padding: 10px; }
                    .store-btn { padding: 10px 16px; font-size: 14px; }
                }
            `;
            document.head.appendChild(style);
        }

        this.renderStoreNavigation();
        const store = stores.find(s => s.id === this.currentStoreId);
        if (store) {
            const storeTitle = document.getElementById('storeTitle');
            if (storeTitle) storeTitle.innerHTML = `<span>${store.name}</span>`;
        }
        this.renderContentCards();
    }
};

// ===== RESOURCE PAGE LOADER =====
function rxLoadResourcePage(rxDisplayArea) {
    if (!rxDisplayArea) {
        console.error("Display area not provided!");
        return;
    }

    // Clear and setup display area
    rxDisplayArea.style.alignItems = "center";
    rxDisplayArea.style.justifyContent = "flex-start";
    rxDisplayArea.style.padding = "20px";
    rxDisplayArea.style.background = "#ffffff"; // CHANGE 3: Background लाई White (सेतो) बनाइयो
    rxDisplayArea.style.width = "100%";
    rxDisplayArea.style.minHeight = "100vh";
    
    // Inject HTML directly
    rxDisplayArea.innerHTML = `
        <div style="width: 100%; max-width: 1200px; margin: 0 auto; text-align: left;">
            <h2 style="width: 100%; text-align: center; margin-bottom: 20px; color: #1a4480;">
                <i class="fas fa-cubes" style="color: #1a4480;"></i> Resources & Assets
            </h2>
            <div id="storeNavigation" class="store-navigation"></div>
            <h3 id="storeTitle" class="store-title"><span>----</span></h3>
            <div id="contentCards" class="content-cards">
                <div style="text-align: center; color: #666666; padding: 40px; grid-column: 1/-1;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #1a4480; display: block; margin-bottom: 15px;"></i>
                    Loading resources...
                </div>
            </div>
        </div>
    `;

    // FAST INITIALIZATION - Load immediately
    UserSession.init();

    // Initialize stores immediately
    try {
        if (typeof StoreManager !== 'undefined') {
            StoreManager.initializeStores();
            console.log("✅ Resources loaded successfully!");
        } else {
            console.error("❌ StoreManager not found!");
        }
    } catch (error) {
        console.error("❌ Error initializing stores:", error);
    }
}

// ===== GLOBAL HELPERS =====
window.handlePurchaseRequest = (contentId, isRenewal) => PaymentManager.showPurchaseModal(contentId, isRenewal);
window.closeModal = () => PaymentManager.closeModal();

// ===== EXPOSE GLOBALLY =====
window.StoreManager = StoreManager;
window.UserSession = UserSession;
window.NotificationManager = NotificationManager;
window.PaymentManager = PaymentManager;
window.contentCards = contentCards;
window.stores = stores;
window.rxLoadResourcePage = rxLoadResourcePage;

// ===== AUTO-INITIALIZE WITH FAST LOADING =====
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            UserSession.init();
            const displayArea = document.getElementById('rxDisplayArea');
            if (displayArea && typeof rxLoadResourcePage === 'function') {
                if (!displayArea.querySelector('#storeNavigation')) {
                    rxLoadResourcePage(displayArea);
                }
            }
        });
    } else {
        UserSession.init();
        const displayArea = document.getElementById('rxDisplayArea');
        if (displayArea && typeof rxLoadResourcePage === 'function') {
            if (!displayArea.querySelector('#storeNavigation')) {
                rxLoadResourcePage(displayArea);
            }
        }
    }
})();

console.log('✅ RX-RESOURCE.js - loaded.');