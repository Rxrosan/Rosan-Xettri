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
        prices: { default: "Rs. 999/Month" },
        extraDetails: " This is a comprehensive document collection for LEKHAPADI preparation.\n• Includes all past papers\n• Study materials\n• Practice tests\n• Perfect for exam preparation"
    },
    {   
        id: "file2", 
        title: "F2- KOREAN EXAM PRACTICE - WEB-APP | COMBINE SETS ", 
        description: "You can practice exam every time auto generate new questions randomly.", 
        link: "RX-KR-EXAM-MODEL-1.html?exam=file2", 
        icon: "fas fa-book",
        prices: { default: "Rs. 999/Month" },
        extraDetails: " Practice Korean exams with randomly generated questions from combined sets.\n• Covers all topics\n• Varying difficulty levels\n• Track your progress\n• Improve your score"
    },
    {   
        id: "file3", 
        title: "F3- QR SCANNER", 
        description: "Scan QR codes instantly", 
        link: "RX-S-QR.html?exam=file3", 
        icon: "fas fa-qrcode",
        prices: { default: "Rs. 100" },
        extraDetails: " Quick and easy QR code scanner.\n• Supports all QR code formats\n• History tracking\n• Batch scanning features"
    },
    {   
        id: "file4", 
        title: "F4- TEXT TO IMAGE ", 
        description: "LOGIN PASSWORD = RX2061", 
        link: "RX-IMG-CONVERTER.html?exam=file4", 
        icon: "fas fa-pen",
        prices: { default: "Rs. 100" },
        extraDetails: " Convert text to image with custom fonts, colors, and styles.\n• Multiple export formats\n• Batch conversion available\n• Customizable output"
    },
    {   
        id: "file5", 
        title: "F5- KOREAN EXAM PRACTICE - WEB-APP | SET-1", 
        description: "You can practice exam with set question.", 
        link: "RX-KR-EXAM-MODEL-2.html?exam=file5", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100/set" },
        extraDetails: " Practice Korean exam with Set-1 questions.\n• Focused practice on specific topics\n• Detailed answer explanations\n• Progress tracking"
    },
    {   
        id: "file6", 
        title: "F6- KOREAN EXAM PRACTICE - WEB-APP | SET-2 COMING SOON....", 
        description: "You can practice exam with set question.", 
        link: "RX-KR-EXAM-MODEL-2.html?exam=file6", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100/set" },
        extraDetails: " Set-2 Korean exam practice coming soon.\n• Advanced questions\n• New topics\n• Stay tuned for updates"
    },
    {   
        id: "file7", 
        title: "F7- KOREAN EXAM PRACTICE - WEB-APP | SET-3", 
        description: "You can practice exam with set question.", 
        link: "RX-KR-EXAM-MODEL-2.html?exam=file7", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100/set" },
        extraDetails: " Set-3 Korean exam practice with comprehensive question bank.\n• Full coverage of all exam topics\n• Multiple question types\n• Performance analytics"
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
    userAccessConfig: {},

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
        
        // Check if access is already loaded from Supabase
        if (this.userAccess && this.userAccess.length > 0) {
            return this.userAccess;
        }
        
        if (user.access && Array.isArray(user.access)) {
            this.userAccess = user.access;
            return user.access;
        }
        
        if (user.accountType === 'ADMIN' || user.account_type === 'Admin' || user.role === 'admin') {
            this.userAccess = [];
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
        
        // Check if file is in access array
        const hasFileAccess = access.includes(fileId);
        
        // If access config exists, check expiry
        if (hasFileAccess && this.userAccessConfig && this.userAccessConfig[fileId]) {
            const config = this.userAccessConfig[fileId];
            if (config && config.purchase_date && config.access_days) {
                const currentDate = new Date();
                const purchaseDate = new Date(config.purchase_date);
                const accessDays = config.access_days || 30;
                const expiryDate = new Date(purchaseDate);
                expiryDate.setDate(expiryDate.getDate() + accessDays);
                
                if (expiryDate <= currentDate) {
                    // Access expired
                    return false;
                }
            }
        }
        
        return hasFileAccess;
    },

    // Update access from Supabase (called by RX-SUPABASE-ACCESS.js)
    updateAccess(accessData, accessConfig) {
        this.userAccess = accessData || [];
        this.userAccessConfig = accessConfig || {};
        
        // Update session
        if (this.currentUser) {
            this.currentUser.access = this.userAccess;
            this.currentUser.accessConfig = this.userAccessConfig;
            sessionStorage.setItem('rxSession', JSON.stringify(this.currentUser));
        }
        
        // Refresh UI
        if (window.StoreManager) {
            window.StoreManager.renderContentCards();
        }
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
            access: [],
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
                dropdownAccountTypeEl.style.color = '#64ffda';
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
        console.log(' User Session Manager initialized');
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

// ===== EXTRA DETAILS MODAL =====
const ExtraDetailsManager = {
    createModal() {
        if (document.getElementById('rx-extra-details-modal')) return;

        const modalHTML = `
            <div id="rx-extra-details-modal" class="rx-extra-modal" style="display: none;">
                <div class="rx-extra-modal-content">
                    <div class="rx-extra-modal-header">
                        <h2 id="rx-extra-modal-title">Extra Details</h2>
                        <span class="rx-extra-close" onclick="ExtraDetailsManager.closeModal()">&times;</span>
                    </div>
                    <div class="rx-extra-modal-body" id="rx-extra-modal-body">
                        <div id="rx-extra-details-content"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        if (!document.getElementById('extra-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'extra-modal-styles';
            style.textContent = `
                .rx-extra-modal {
                    display: none;
                    position: fixed;
                    z-index: 10001;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                    animation: fadeIn 0.3s ease;
                    justify-content: center;
                    align-items: center;
                }
                .rx-extra-modal-content {
                    background-color: #ffffff;
                    padding: 20px 24px 24px 24px;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 420px;
                    color: #333333;
                    animation: slideDown 0.3s ease;
                    border: 1px solid #d0dbe8;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    margin: auto;
                }
                @keyframes slideDown {
                    from { transform: translateY(-30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .rx-extra-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #d0dbe8;
                    padding-bottom: 10px;
                    margin-bottom: 12px;
                    flex-shrink: 0;
                }
                .rx-extra-modal-header h2 {
                    color: #1a4480;
                    font-size: 18px;
                    margin: 0;
                    font-weight: 700;
                }
                .rx-extra-close {
                    font-size: 28px;
                    cursor: pointer;
                    color: #aaa;
                    transition: color 0.3s;
                    line-height: 1;
                    padding: 0 4px;
                }
                .rx-extra-close:hover {
                    color: #e74c3c;
                }
                .rx-extra-modal-body {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 4px;
                    max-height: 60vh;
                }
                .rx-extra-modal-body::-webkit-scrollbar {
                    width: 6px;
                }
                .rx-extra-modal-body::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                .rx-extra-modal-body::-webkit-scrollbar-thumb {
                    background: #1a4480;
                    border-radius: 3px;
                }
                .rx-extra-modal-body::-webkit-scrollbar-thumb:hover {
                    background: #0056b3;
                }
                #rx-extra-details-content {
                    color: #555555;
                    line-height: 1.7;
                    font-size: 14px;
                }
                #rx-extra-details-content .detail-icon {
                    font-size: 32px;
                    color: #1a4480;
                    display: block;
                    margin-bottom: 10px;
                    text-align: center;
                }
                #rx-extra-details-content .detail-title {
                    font-size: 17px;
                    font-weight: 700;
                    color: #1a4480;
                    margin-bottom: 8px;
                    text-align: center;
                }
                #rx-extra-details-content .detail-description {
                    color: #555555;
                    font-size: 14px;
                    line-height: 1.7;
                    margin-bottom: 10px;
                }
                #rx-extra-details-content .detail-features {
                    margin-top: 10px;
                    padding: 10px 14px;
                    background: #f8fafc;
                    border-radius: 6px;
                    border: 1px solid #d0dbe8;
                    list-style: none;
                    padding-left: 14px;
                }
                #rx-extra-details-content .detail-features li {
                    margin-bottom: 5px;
                    color: #555555;
                    font-size: 13px;
                    padding-left: 18px;
                    position: relative;
                    line-height: 1.6;
                }
                #rx-extra-details-content .detail-features li:before {
                    content: "•";
                    color: #1a4480;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    font-size: 16px;
                }
                #rx-extra-details-content .detail-price-section {
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid #d0dbe8;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                }
                #rx-extra-details-content .detail-price-section strong {
                    color: #1a4480;
                    font-size: 14px;
                }
                #rx-extra-details-content .detail-price-section span {
                    color: #0056b3;
                    font-weight: bold;
                    font-size: 15px;
                }
                @media (max-width: 600px) {
                    .rx-extra-modal-content {
                        padding: 16px 18px 18px 18px;
                        max-width: 95%;
                        max-height: 85vh;
                    }
                    .rx-extra-modal-header h2 {
                        font-size: 16px;
                    }
                    .rx-extra-modal-body {
                        max-height: 55vh;
                    }
                    #rx-extra-details-content {
                        font-size: 13px;
                    }
                    #rx-extra-details-content .detail-title {
                        font-size: 16px;
                    }
                    #rx-extra-details-content .detail-icon {
                        font-size: 28px;
                    }
                    #rx-extra-details-content .detail-features li {
                        font-size: 12px;
                    }
                }
                @media (max-width: 400px) {
                    .rx-extra-modal-content {
                        padding: 12px 14px 14px 14px;
                        max-width: 98%;
                    }
                    .rx-extra-modal-header h2 {
                        font-size: 15px;
                    }
                    .rx-extra-modal-body {
                        max-height: 50vh;
                    }
                    #rx-extra-details-content {
                        font-size: 12px;
                    }
                    #rx-extra-details-content .detail-title {
                        font-size: 15px;
                    }
                    #rx-extra-details-content .detail-features li {
                        font-size: 12px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },

    showModal(cardId) {
        this.createModal();
        const card = contentCards.find(c => c.id === cardId);
        if (!card) {
            NotificationManager.showNotification("Error", "Content not found!", "danger");
            return;
        }

        const content = document.getElementById('rx-extra-details-content');
        if (!content) return;

        // Check if user has access
        const hasAccess = UserSession.hasAccess(cardId);

        // Build features HTML
        let featuresHtml = '';
        if (card.extraDetails) {
            const lines = card.extraDetails.split('\n').filter(line => line.trim());
            if (lines.length > 1) {
                featuresHtml = `
                    <ul class="detail-features">
                        ${lines.map(line => `<li>${line.trim()}</li>`).join('')}
                    </ul>
                `;
            } else {
                featuresHtml = `<p class="detail-description">${card.extraDetails}</p>`;
            }
        }

        // Only show description if user has access
        let descriptionHtml = '';
        if (hasAccess) {
            descriptionHtml = `<p class="detail-description">${card.description || ''}</p>`;
        }

        content.innerHTML = `
            <div class="detail-icon">
                <i class="${card.icon || 'fas fa-file'}"></i>
            </div>
            <div class="detail-title">${card.title}</div>
            ${descriptionHtml}
            ${featuresHtml}
            <div class="detail-price-section">
                <strong>Price:</strong> 
                <span>${card.prices?.default || 'Contact for price'}</span>
            </div>
        `;

        document.getElementById('rx-extra-modal-title').textContent = `Details :`;
        const modal = document.getElementById('rx-extra-details-modal');
        modal.style.display = 'flex';
        
        // Reset scroll position
        const body = document.getElementById('rx-extra-modal-body');
        if (body) body.scrollTop = 0;
    },

    closeModal() {
        const modal = document.getElementById('rx-extra-details-modal');
        if (modal) modal.style.display = 'none';
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
                        <h2 id="rx-modal-title" class="rx-modal-title-left">Purchase Access</h2>
                        <span class="rx-close" onclick="PaymentManager.closeModal()">&times;</span>
                    </div>
                    <div class="rx-modal-body">
                        <form id="rx-payment-form" action="${FORMSPREE_ENDPOINT}" method="POST" onsubmit="return PaymentManager.handleFormSubmit(event)">
                            <input type="hidden" name="_subject" id="rx-form-subject" value="New Purchase Request">
                            <input type="hidden" name="_template" value="table">
                            <input type="hidden" name="_gotcha" style="display:none !important">
                            
                            <!-- File Information - Single Line -->
                            <div class="rx-file-info">
                                <div class="rx-file-info-item">
                                    <label><i class="fas fa-file-alt"></i> File:</label>
                                    <span id="rx-file-name-display">---</span>
                                </div>
                            </div>

                            <!-- User Information - Center with Scroll -->
                            <div class="rx-section rx-user-section">
                                <h3><i class="fas fa-user"></i> Your Information</h3>
                                <div class="rx-user-details-scroll">
                                    <div class="rx-form-grid">
                                        <div class="rx-form-group">
                                            <label>Full Name</label>
                                            <input type="text" id="rx-user-name" name="user_name" readonly class="rx-auto-field">
                                        </div>
                                        <div class="rx-form-group">
                                            <label>User ID</label>
                                            <input type="text" id="rx-user-id" name="user_id" readonly class="rx-auto-field">
                                        </div>
                                        <div class="rx-form-group">
                                            <label>Email</label>
                                            <input type="email" id="rx-user-email" name="user_email" readonly class="rx-auto-field">
                                        </div>
                                        <div class="rx-form-group">
                                            <label>Phone</label>
                                            <input type="text" id="rx-user-phone" name="user_phone" readonly class="rx-auto-field">
                                        </div>
                                        <div class="rx-form-group rx-form-group-full">
                                            <label>Address</label>
                                            <input type="text" id="rx-user-address" name="user_address" readonly class="rx-auto-field" value="-">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Bottom Section: Price Left, Buttons Right -->
                            <div class="rx-form-footer">
                                <div class="rx-price-display">
                                    <span class="rx-price-label">Price:</span>
                                    <span id="rx-file-price" class="rx-price-value">---</span>
                                </div>
                                <div class="rx-form-actions">
                                    <button type="button" class="rx-btn rx-btn-cancel" onclick="PaymentManager.closeModal()"><i class="fas fa-times"></i> Cancel</button>
                                    <button type="submit" id="rx-submit-btn" class="rx-btn rx-btn-submit"><i class="fas fa-paper-plane"></i> Submit</button>
                                </div>
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
            style.textContent = `
                .rx-modal {
                    display: none;
                    position: fixed;
                    z-index: 9999;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                    justify-content: center;
                    align-items: center;
                    animation: fadeIn 0.3s ease;
                }
                .rx-modal.show {
                    display: flex !important;
                }
                .rx-modal-content {
                    background-color: #ffffff;
                    padding: 0;
                    border-radius: 12px;
                    width: 92%;
                    max-width: 560px;
                    color: #333333;
                    animation: slideDown 0.3s ease;
                    border: 1px solid #d0dbe8;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    margin: auto;
                    overflow: hidden;
                }
                @keyframes slideDown {
                    from { transform: translateY(-30px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* Header: File Name Left, Close Right */
                .rx-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid #d0dbe8;
                    background: #f8fafc;
                    flex-shrink: 0;
                }
                .rx-modal-title-left {
                    color: #1a4480;
                    font-size: 16px;
                    margin: 0;
                    font-weight: 700;
                    flex: 1;
                    word-break: break-word;
                    padding-right: 10px;
                    line-height: 1.3;
                }
                .rx-close {
                    font-size: 28px;
                    cursor: pointer;
                    color: #aaa;
                    transition: color 0.3s;
                    line-height: 1;
                    padding: 0 4px;
                    flex-shrink: 0;
                }
                .rx-close:hover {
                    color: #e74c3c;
                }

                /* Modal Body */
                .rx-modal-body {
                    padding: 16px 20px 0 20px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                /* File Info - Single Line */
                .rx-file-info {
                    background: #f0f4f9;
                    border-radius: 6px;
                    padding: 8px 14px;
                    margin-bottom: 12px;
                    border: 1px solid #d0dbe8;
                    flex-shrink: 0;
                }
                .rx-file-info-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    flex-wrap: wrap;
                }
                .rx-file-info-item label {
                    color: #1a4480;
                    font-weight: 600;
                    margin: 0;
                    white-space: nowrap;
                }
                .rx-file-info-item label i {
                    margin-right: 4px;
                }
                .rx-file-info-item span {
                    color: #333333;
                    font-weight: 500;
                    word-break: break-word;
                }

                /* User Section with Scroll - 2 Columns Always */
                .rx-user-section {
                    flex: 1;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 12px;
                }
                .rx-user-section h3 {
                    color: #1a4480;
                    font-size: 15px;
                    margin: 0 0 8px 0;
                    font-weight: 600;
                    flex-shrink: 0;
                }
                .rx-user-section h3 i {
                    margin-right: 6px;
                }
                .rx-user-details-scroll {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 4px;
                    max-height: 220px;
                    min-height: 120px;
                }
                .rx-user-details-scroll::-webkit-scrollbar {
                    width: 5px;
                }
                .rx-user-details-scroll::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                .rx-user-details-scroll::-webkit-scrollbar-thumb {
                    background: #1a4480;
                    border-radius: 3px;
                }
                .rx-user-details-scroll::-webkit-scrollbar-thumb:hover {
                    background: #0056b3;
                }
                
                /* Always 2 columns - even on mobile */
                .rx-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                .rx-form-group-full {
                    grid-column: 1 / -1;
                }
                .rx-form-group {
                    display: flex;
                    flex-direction: column;
                }
                .rx-form-group label {
                    margin-bottom: 3px;
                    font-size: 12px;
                    color: #666666;
                    font-weight: 500;
                }
                .rx-form-group input {
                    padding: 8px 10px;
                    border: 1px solid #d0dbe8;
                    border-radius: 5px;
                    background: #f8fafc;
                    color: #333333;
                    font-size: 13px;
                    transition: border-color 0.3s;
                    width: 100%;
                    box-sizing: border-box;
                }
                .rx-form-group input:focus {
                    outline: none;
                    border-color: #1a4480;
                    background: #ffffff;
                }
                .rx-form-group input[readonly] {
                    cursor: default;
                    background: #f8fafc;
                }

                /* Footer: Price Left, Buttons Right */
                .rx-form-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0 16px 0;
                    border-top: 1px solid #d0dbe8;
                    margin-top: 4px;
                    flex-shrink: 0;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .rx-price-display {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #f0f4f9;
                    padding: 6px 14px;
                    border-radius: 6px;
                    border: 1px solid #d0dbe8;
                }
                .rx-price-label {
                    color: #666666;
                    font-size: 13px;
                    font-weight: 500;
                }
                .rx-price-value {
                    color: #0056b3;
                    font-size: 16px;
                    font-weight: 700;
                }
                .rx-form-actions {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .rx-btn {
                    padding: 8px 18px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.3s;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .rx-btn-submit {
                    background: #1a4480;
                    color: #ffffff;
                }
                .rx-btn-submit:hover {
                    background: #0056b3;
                    transform: scale(1.02);
                    box-shadow: 0 4px 12px rgba(26, 68, 128, 0.3);
                }
                .rx-btn-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }
                .rx-btn-cancel {
                    background: #f8fafc;
                    color: #1a4480;
                    border: 1px solid #d0dbe8;
                }
                .rx-btn-cancel:hover {
                    background: #ffffff;
                    border-color: #1a4480;
                    transform: scale(1.02);
                }

                /* Success Popup Styles */
                .rx-success-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10002;
                    display: none;
                    justify-content: center;
                    align-items: center;
                    animation: fadeIn 0.3s ease;
                }
                .rx-success-popup-overlay.show {
                    display: flex;
                }
                .rx-success-popup {
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 30px 35px;
                    max-width: 450px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: popIn 0.4s ease;
                    position: relative;
                    border-top: 4px solid #2ecc71;
                }
                @keyframes popIn {
                    0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                .rx-success-popup .success-icon {
                    font-size: 52px;
                    color: #2ecc71;
                    margin-bottom: 12px;
                    display: block;
                    animation: bounceIn 0.6s ease;
                }
                @keyframes bounceIn {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.2); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }
                .rx-success-popup h3 {
                    color: #1a4480;
                    font-size: 20px;
                    margin-bottom: 8px;
                    font-weight: 700;
                }
                .rx-success-popup .success-message {
                    color: #555555;
                    font-size: 15px;
                    line-height: 1.6;
                    margin-bottom: 4px;
                }
                .rx-success-popup .success-message strong {
                    color: #1a4480;
                    font-weight: 700;
                }
                .rx-success-popup .success-sub-message {
                    color: #888888;
                    font-size: 13px;
                    line-height: 1.5;
                    margin-top: 6px;
                    padding-top: 10px;
                    border-top: 1px solid #d0dbe8;
                }
                .rx-success-popup .success-timer {
                    margin-top: 12px;
                    color: #999;
                    font-size: 12px;
                }

                /* Responsive - Keep 2 columns on mobile */
                @media (max-width: 600px) {
                    .rx-modal-content {
                        width: 95%;
                        max-width: 100%;
                        max-height: 92vh;
                        border-radius: 10px;
                    }
                    .rx-modal-header {
                        padding: 12px 16px;
                    }
                    .rx-modal-title-left {
                        font-size: 14px;
                    }
                    .rx-modal-body {
                        padding: 12px 16px 0 16px;
                    }
                    .rx-user-details-scroll {
                        max-height: 180px;
                        min-height: 100px;
                    }
                    /* Keep 2 columns on mobile */
                    .rx-form-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 8px;
                    }
                    .rx-form-group label {
                        font-size: 11px;
                    }
                    .rx-form-group input {
                        font-size: 12px;
                        padding: 6px 8px;
                    }
                    .rx-form-footer {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 10px;
                        padding: 10px 0 14px 0;
                    }
                    .rx-price-display {
                        justify-content: center;
                        padding: 6px 12px;
                    }
                    .rx-form-actions {
                        justify-content: center;
                    }
                    .rx-btn {
                        padding: 8px 16px;
                        font-size: 13px;
                        justify-content: center;
                        flex: 1;
                    }
                    .rx-success-popup {
                        padding: 25px 20px;
                        max-width: 95%;
                    }
                    .rx-success-popup .success-icon {
                        font-size: 42px;
                    }
                    .rx-success-popup h3 {
                        font-size: 18px;
                    }
                    .rx-success-popup .success-message {
                        font-size: 14px;
                    }
                }
                @media (max-width: 400px) {
                    .rx-modal-header {
                        padding: 10px 12px;
                    }
                    .rx-modal-title-left {
                        font-size: 13px;
                    }
                    .rx-modal-body {
                        padding: 10px 12px 0 12px;
                    }
                    .rx-user-details-scroll {
                        max-height: 150px;
                        min-height: 80px;
                    }
                    /* Keep 2 columns on very small screens */
                    .rx-form-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 6px;
                    }
                    .rx-file-info {
                        padding: 6px 10px;
                    }
                    .rx-file-info-item {
                        font-size: 12px;
                    }
                    .rx-form-group input {
                        font-size: 11px;
                        padding: 5px 6px;
                    }
                    .rx-form-group label {
                        font-size: 10px;
                    }
                    .rx-price-value {
                        font-size: 14px;
                    }
                    .rx-btn {
                        font-size: 12px;
                        padding: 6px 12px;
                    }
                    .rx-success-popup {
                        padding: 20px 16px;
                    }
                    .rx-success-popup .success-icon {
                        font-size: 36px;
                    }
                    .rx-success-popup h3 {
                        font-size: 16px;
                    }
                    .rx-success-popup .success-message {
                        font-size: 13px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Create success popup HTML if it doesn't exist
        if (!document.getElementById('rx-success-popup-overlay')) {
            const popupHTML = `
                <div id="rx-success-popup-overlay" class="rx-success-popup-overlay">
                    <div class="rx-success-popup">
                        <i class="fas fa-check-circle success-icon"></i>
                        <h3>Request Submitted Successfully!</h3>
                        <div class="success-message" id="rx-success-message">
                            The file: <strong id="rx-success-file-name">---</strong> has been submitted for <strong id="rx-success-action-type">purchase</strong>.
                        </div>
                        <div class="success-sub-message">
                            Please wait until an authorized person contacts you back.
                        </div>
                        <div class="success-timer">Closing in <span id="rx-success-timer">3</span> seconds...</div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', popupHTML);
        }
    },

    handleFormSubmit(event) {
        event.preventDefault();
        const form = document.getElementById('rx-payment-form');
        const formData = new FormData(form);
        const fileDisplay = document.getElementById('rx-file-name-display');
        const fileTitle = fileDisplay ? fileDisplay.textContent : 'Unknown File';
        const modalTitle = document.getElementById('rx-modal-title');
        const actionType = modalTitle ? modalTitle.textContent : 'purchase';
        const actionText = actionType.toLowerCase().includes('renew') ? 'renew' : 'purchase';

        // Show loading state
        const submitBtn = document.getElementById('rx-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        // Send form data using fetch
        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success popup
                this.showSuccessPopup(fileTitle, actionText);
                this.closeModal();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            NotificationManager.showNotification('Error', 'Failed to submit request. Please try again.', 'danger', 4000);
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });

        return false;
    },

    showSuccessPopup(fileName, actionType) {
        this.createPaymentModal();
        
        const overlay = document.getElementById('rx-success-popup-overlay');
        const fileNameSpan = document.getElementById('rx-success-file-name');
        const actionSpan = document.getElementById('rx-success-action-type');
        const timerSpan = document.getElementById('rx-success-timer');

        if (fileNameSpan) fileNameSpan.textContent = fileName || 'Unknown File';
        if (actionSpan) actionSpan.textContent = actionType || 'purchase';
        if (overlay) {
            overlay.classList.add('show');
        }

        // Auto close after 3 seconds
        let countdown = 6;
        if (timerSpan) timerSpan.textContent = countdown;

        const timerInterval = setInterval(() => {
            countdown--;
            if (timerSpan) timerSpan.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(timerInterval);
                this.closeSuccessPopup();
            }
        }, 1000);
    },

    closeSuccessPopup() {
        const overlay = document.getElementById('rx-success-popup-overlay');
        if (overlay) {
            overlay.classList.remove('show');
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

        // Set modal title
        const titleEl = document.getElementById('rx-modal-title');
        const actionText = isRenewal ? 'Renew' : 'Purchase';
        if (titleEl) titleEl.textContent = `${actionText}: ${card.title}`;

        // Set file name display
        const fileDisplay = document.getElementById('rx-file-name-display');
        if (fileDisplay) fileDisplay.textContent = card.title;

        // Set price
        const priceEl = document.getElementById('rx-file-price');
        if (priceEl) priceEl.textContent = this.getPriceForUser(card, currentUser);

        // Set user info
        const userName = document.getElementById('rx-user-name');
        const userId = document.getElementById('rx-user-id');
        const userEmail = document.getElementById('rx-user-email');
        const userPhone = document.getElementById('rx-user-phone');
        const userAddress = document.getElementById('rx-user-address');

        if (userName) userName.value = currentUser.full_name || currentUser.fullName || currentUser.name || 'GUEST';
        if (userId) userId.value = currentUser.id || 'GUEST';
        if (userEmail) userEmail.value = currentUser.email || '-';
        if (userPhone) userPhone.value = currentUser.phone || '-';
        if (userAddress) userAddress.value = currentUser.address || '-';

        // Show modal
        const modal = document.getElementById('rx-payment-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    },

    closeModal() {
        const modal = document.getElementById('rx-payment-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
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

        // ===== CLEAR OLD TIMER SO IT DOESN'T STACK UP =====
        if (window.activeTimerRef) {
            clearTimeout(window.activeTimerRef);
            window.activeTimerRef = null;
        }

        storeContent.forEach(card => {
            const hasAccess = UserSession.hasAccess(card.id);
            const price = PaymentManager.getPriceForUser(card, currentUser);
            
            const cardElement = document.createElement('div');
            cardElement.className = `card ${hasAccess ? '' : 'locked'}`;
            
            let detailsHtml = '';
            let actionHtml = '';

            if (hasAccess) {
                // ==========================================================
                // NO ICON, NO SECONDS, STATIC EVERY 60 SECONDS
                // ==========================================================
                let expiryDate = null;
                let isActiveTimer = false;

                if (UserSession.userAccessConfig && UserSession.userAccessConfig[card.id]) {
                    const config = UserSession.userAccessConfig[card.id];
                    if (config && config.purchase_date && config.access_days) {
                        const currentDate = new Date();
                        const purchaseDate = new Date(config.purchase_date);
                        const accessDays = config.access_days || 30;
                        expiryDate = new Date(purchaseDate);
                        expiryDate.setDate(expiryDate.getDate() + accessDays);
                        
                        if (expiryDate > currentDate) {
                            isActiveTimer = true;
                        }
                    }
                }

                let timerHtml = '';
                
                if (isActiveTimer && expiryDate) {
                    // Calculate difference
                    const now = new Date().getTime();
                    const distance = expiryDate.getTime() - now;
                    
                    // NO SECONDS HERE
                    const minutes = Math.floor((distance / (1000 * 60)) % 60);
                    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

                    let timeString = '';
                    if (days > 0) timeString += days + 'd ';
                    timeString += String(hours).padStart(2, '0') + 'h ' + 
                                 String(minutes).padStart(2, '0') + 'm';

                    // REMOVED THE ⏳ ICON
                    timerHtml = `
                        <span style="font-family: monospace; font-weight:700; color:#1a4480; font-size:14px;">
                            ${timeString}
                        </span>
                    `;
                } else {
                    timerHtml = `<span style="color:#856404; font-size:13px; font-weight:600;">Unlimited</span>`;
                }

                detailsHtml = `
                    <p class="card-description">${card.description || ''}</p>
                    <div class="card-access-info" style="padding: 8px 12px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#2ecc71;font-weight:600;">
                                <i class="fas fa-check-circle"></i> Access Granted
                            </span>
                            ${timerHtml}
                        </div>
                        <span style="color:#555555;font-size:12px;display:block;margin-top:4px; border-top:1px solid #f0f0f0; padding-top:4px;">
                            <i class="fas fa-user"></i> ${currentUser?.full_name || currentUser?.name || 'User'}
                            <span style="display:block;font-size:11px;color:#888;">ID: ${currentUser?.id || 'N/A'}</span>
                        </span>
                    </div>
                `;

                actionHtml = `
                    <div class="card-actions">
                        <span class="card-price">${price}</span>
                        <a href="${card.link}" class="open-btn"><i class="fas fa-external-link-alt"></i> Open</a>
                    </div>
                `;
            } else if (isLoggedIn) {
                detailsHtml = `
                    <div class="card-access-info">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#e74c3c;font-weight:600;">
                                <i class="fas fa-lock"></i> Purchase Required
                            </span>
                        </div>
                        <span style="color:#555555;font-size:12px;display:block;margin-top:4px;">
                            <i class="fas fa-info-circle"></i> Purchase to access
                        </span>
                    </div>
                `;
                actionHtml = `
                    <div class="card-actions">
                        <span class="card-price">${price}</span>
                        <button class="purchase-btn" onclick="handlePurchaseRequest('${card.id}', false)"><i class="fas fa-shopping-cart"></i> Purchase</button>
                    </div>
                `;
            } else {
                detailsHtml = `
                    <div class="card-access-info">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#e74c3c;font-weight:600;">
                                <i class="fas fa-lock"></i> Login Required
                            </span>
                        </div>
                        <span style="color:#555555;font-size:12px;display:block;margin-top:4px;">
                            <i class="fas fa-info-circle"></i> Login to view details
                        </span>
                    </div>
                `;
                actionHtml = `
                    <div class="card-actions">
                        <span class="card-price">${price}</span>
                        <button class="purchase-btn login-required" onclick="NotificationManager.showNotification('Login Required', 'Please login first to view file details and purchase.', 'warning', 4000)">
                            <i class="fas fa-lock"></i> Login
                        </button>
                    </div>
                `;
            }

            // Build card
            cardElement.innerHTML = `
                <div class="card-header">
                    <div class="card-header-left">
                        <i class="${card.icon || 'fas fa-file'} card-icon"></i>
                        <button class="extra-details-btn" onclick="ExtraDetailsManager.showModal('${card.id}')" title="View Extra Details">
                            <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                    ${!hasAccess ? '<div class="lock-icon"><i class="fas fa-lock"></i></div>' : ''}
                </div>
                <h3>${card.title}</h3>
                ${detailsHtml}
                ${actionHtml}
            `;
            cardsContainer.appendChild(cardElement);
        });

        // ==========================================================
        // REFRESH EVERY 60 SECONDS (1 Minute)
        // ==========================================================
        window.activeTimerRef = setTimeout(() => {
            if (typeof StoreManager !== 'undefined' && StoreManager.renderContentCards) {
                StoreManager.renderContentCards();
            }
        }, 60000); // 60000 milliseconds = 1 minute
    },

    initializeStores() {
        if (!document.getElementById('store-styles')) {
            const style = document.createElement('style');
            style.id = 'store-styles';
            style.textContent = `
                .store-navigation { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; justify-content: center; padding: 8px 0; }
                .store-btn { padding: 10px 20px; background: #f8fafc; color: #1a4480; border: 1px solid #d0dbe8; border-radius: 6px; cursor: pointer; transition: all 0.3s; font-size: 14px; font-weight: 600; }
                .store-btn:hover { background: #ffffff; border-color: #1a4480; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(26, 68, 128, 0.1); }
                .store-btn.active { background: #1a4480; color: #ffffff; border-color: #1a4480; font-weight: bold; box-shadow: 0 4px 12px rgba(26, 68, 128, 0.25); }
                .store-title { text-align: center; margin: 15px 0; color: #1a4480; font-size: 22px; }
                .content-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 15px 0; }
                
                .card { background: #ffffff; padding: 16px; border-radius: 10px; border: 1px solid #d0dbe8; transition: all 0.3s; position: relative; display: flex; flex-direction: column; min-height: 180px; }
                .card:hover { transform: translateY(-4px); border-color: #1a4480; box-shadow: 0 8px 25px rgba(26, 68, 128, 0.08); }
                .card.locked { opacity: 0.85; }
                .card.locked:hover { opacity: 1; }
                
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; width: 100%; }
                .card-header-left { display: flex; align-items: center; gap: 8px; }
                .card-icon { font-size: 28px; color: #1a4480; display: block; }
                .extra-details-btn { background: transparent; border: none; color: #1a4480; font-size: 18px; cursor: pointer; padding: 2px 4px; transition: all 0.3s; border-radius: 50%; z-index: 10; position: relative; display: flex; align-items: center; justify-content: center; }
                .extra-details-btn:hover { background: #f0f4f9; transform: scale(1.1); color: #0056b3; }
                
                .lock-icon { color: #e74c3c; font-size: 16px; background: #fff; padding: 2px; border-radius: 50%; z-index: 5; flex-shrink: 0; }
                
                .card h3 { color: #1a4480; margin-bottom: 6px; font-size: 15px; font-weight: 700; word-break: break-word; line-height: 1.3; }
                .card .card-description { color: #555555; font-size: 13px; margin-bottom: 8px; line-height: 1.5; flex-grow: 1; }
                .card .card-access-info { margin: 6px 0 10px; padding: 8px 12px; background: #f8fafc; border-radius: 6px; border: 1px solid #d0dbe8; font-size: 13px; }
                .card .card-access-info i { margin-right: 4px; }
                
                .card-actions { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: auto; padding-top: 10px; border-top: 1px solid #d0dbe8; flex-wrap: wrap; }
                .card-actions .card-price { font-size: 14px; font-weight: 700; color: #0056b3; white-space: nowrap; }
                
                .purchase-btn { background: #1a4480; color: #ffffff; border: none; padding: 6px 14px; border-radius: 5px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-size: 12px; white-space: nowrap; }
                .purchase-btn:hover { background: #0056b3; transform: scale(1.02); box-shadow: 0 4px 12px rgba(26, 68, 128, 0.3); }
                .purchase-btn.login-required { background: #f8fafc; color: #1a4480; border: 1px solid #d0dbe8; }
                .purchase-btn.login-required:hover { background: #e74c3c; color: #ffffff; border-color: #e74c3c; }
                
                .open-btn { display: inline-block; background: #1a4480; color: #ffffff; padding: 6px 14px; border-radius: 5px; text-decoration: none; font-weight: 600; transition: all 0.3s; font-size: 12px; white-space: nowrap; }
                .open-btn:hover { background: #0056b3; transform: scale(1.02); }
                .open-btn i { margin-right: 4px; }
                
                /* Responsive */
                @media (max-width: 1024px) {
                    .content-cards { grid-template-columns: repeat(3, 1fr); gap: 14px; }
                }
                @media (max-width: 900px) {
                    .content-cards { grid-template-columns: repeat(2, 1fr); gap: 14px; }
                    .card { padding: 14px; min-height: 160px; }
                    .card h3 { font-size: 14px; }
                    .card .card-description { font-size: 12px; }
                    .card .card-access-info { font-size: 12px; }
                    .card-icon { font-size: 24px; }
                    .extra-details-btn { font-size: 16px; }
                }
                @media (max-width: 600px) {
                    .content-cards { grid-template-columns: 1fr; gap: 12px; padding: 10px 0; }
                    .card { padding: 14px; min-height: auto; }
                    .store-btn { padding: 8px 14px; font-size: 13px; }
                    .store-title { font-size: 19px; }
                    .card h3 { font-size: 15px; }
                    .card .card-description { font-size: 13px; }
                    .card .card-access-info { font-size: 13px; }
                    .card-actions .card-price { font-size: 14px; }
                    .purchase-btn, .open-btn { padding: 6px 14px; font-size: 12px; }
                    .card-icon { font-size: 26px; }
                    .extra-details-btn { font-size: 18px; }
                    .lock-icon { font-size: 16px; }
                }
                @media (max-width: 400px) {
                    .content-cards { gap: 10px; padding: 5px 0; }
                    .card { padding: 12px; }
                    .card h3 { font-size: 14px; }
                    .card .card-description { font-size: 12px; }
                    .card .card-access-info { font-size: 12px; }
                    .card-actions .card-price { font-size: 13px; }
                    .purchase-btn, .open-btn { padding: 5px 12px; font-size: 11px; }
                    .card-icon { font-size: 22px; }
                    .extra-details-btn { font-size: 16px; }
                    .store-btn { padding: 6px 12px; font-size: 12px; }
                    .store-title { font-size: 17px; }
                    .lock-icon { font-size: 14px; }
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

    rxDisplayArea.style.alignItems = "center";
    rxDisplayArea.style.justifyContent = "flex-start";
    rxDisplayArea.style.padding = "15px";
    rxDisplayArea.style.background = "#ffffff";
    rxDisplayArea.style.width = "100%";
    rxDisplayArea.style.minHeight = "100vh";
    
    rxDisplayArea.innerHTML = `
        <div style="width: 100%; max-width: 1200px; margin: 0 auto; text-align: left;">
            <h2 style="width: 100%; text-align: center; margin-bottom: 15px; color: #1a4480; font-size: clamp(22px, 2.5vw, 32px);">
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

    UserSession.init();

    try {
        if (typeof StoreManager !== 'undefined') {
            StoreManager.initializeStores();
            console.log(" Resources loaded successfully!");
        } else {
            console.error(" StoreManager not found!");
        }
    } catch (error) {
        console.error(" Error initializing stores:", error);
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
window.ExtraDetailsManager = ExtraDetailsManager;
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

console.log(' RX-RESOURCE.js - loaded.');