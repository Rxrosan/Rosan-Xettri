// RX-STORE-SYSTEM.js
// Enhanced Store Management System with Contact Integration

// ==================== STORE DATA ====================
const contentCards = [
    {   
        id: "file1", 
        title: "F1- QUESTION-MODEL-1", 
        description: "LESSON A 1 - 10L", 
        link: "KR-EXAM.html?exam=file1", 
        icon: "fas fa-book",
        category: "EPS",
        color: "#4F46E5",
        columnLayout: "single", // single or double column
        prices: { 
            default: "Rs. 100",
            monthly: "Rs. 50/month",
            yearly: "Rs. 500/year"
        },
        publicIntro: "Basic question model for lessons 1-10. Includes multiple choice questions.",
        privateIntro: "Full access to 100+ questions with answers. Password: QM1-2024",
        password: "QM1-2024",
        features: ["100+ Questions", "Answer Key", "Progress Tracking", "PDF Download"]
    },
    
    {   
        id: "file2", 
        title: "F2- RX-QR-Scanner/Generator", 
        description: "Create and scan QR codes with personalized messages", 
        link: "ASSET/WEB-SOFTWARE/RX-S-QR.html", 
        icon: "fas fa-qrcode",
        category: "WEB-SOFTWARE",
        color: "#10B981",
        columnLayout: "single",
        prices: { 
            default: "Rs. 100",
            lifetime: "Rs. 200 (lifetime)"
        },
        publicIntro: "Basic QR code generator. Create simple QR codes for free.",
        privateIntro: "Advanced features: Custom colors, batch generation, analytics. Password: QR-TOOL",
        password: "QR-TOOL",
        features: ["Custom Colors", "Batch Generation", "Analytics", "API Access"]
    },
    
    {   
        id: "file3", 
        title: "F3- कपाली तमसुक", 
        description: "कपाली तमसुककाे नमूना र विस्तृत विवरण", 
        link: "LEKA-PADI.html?exam=file3", 
        icon: "fas fa-file-contract",
        category: "LEKHA-PADI",
        color: "#F59E0B",
        columnLayout: "double", // Double column for LEKHA-PADI
        prices: { 
            default: "Rs. 600",
            bundle: "Rs. 1500 (3 documents)"
        },
        publicIntro: "कपाली तमसुककाे सामान्य परिचय र स्वरूप।",
        privateIntro: "पूर्ण दस्तावेज: सम्पूर्ण नमूना, कानूनी व्याख्या, उदाहरणहरू। पासवर्ड: TAMS-001",
        password: "TAMS-001",
        features: ["पूर्ण नमूना", "कानूनी व्याख्या", "उदाहरणहरू", "PDF डाउनलोड"]
    },
    {   
        id: "file4", 
        title: "F4- QUESTION MODEL 2", 
        description: "LESSON A 11 - 20 L", 
        link: "KR-EXAM.html?exam=file4", 
        icon: "fas fa-book-open",
        category: "EPS",
        color: "#8B5CF6",
        columnLayout: "single",
        prices: { 
            default: "Rs. 100",
            monthly: "Rs. 50/month"
        },
        publicIntro: "Advanced question model for lessons 11-20.",
        privateIntro: "Complete set with 150+ questions. Password: QM2-2024",
        password: "QM2-2024",
        features: ["150+ Questions", "Detailed Solutions", "Timed Tests", "Performance Report"]
    },
    {   
        id: "file5", 
        title: "F5- QUESTION MODEL 3", 
        description: "ALL OVER BOOK RESOURCE", 
        link: "KR-EXAM.html?exam=file5", 
        icon: "fas fa-book-reader",
        category: "EPS",
        color: "#EC4899",
        columnLayout: "single",
        prices: { 
            default: "Rs. 100",
            complete: "Rs. 250 (all models)"
        },
        publicIntro: "Complete book resource covering all chapters.",
        privateIntro: "300+ questions with video solutions. Password: QM3-2024",
        password: "QM3-2024",
        features: ["300+ Questions", "Video Solutions", "Chapter Tests", "Mock Exams"]
    },
    {   
        id: "file6", 
        title: "F6- राजीनामा", 
        description: "सम्पूर्ण राजीनामा दस्तावेज", 
        link: "LEKA-PADI.html?exam=file6", 
        icon: "fas fa-file-signature",
        category: "LEKHA-PADI",
        color: "#F97316",
        columnLayout: "double",
        prices: { 
            default: "Rs. 600"
        },
        publicIntro: "राजीनामाकाे सामान्य स्वरूप र प्रयोग।",
        privateIntro: "विस्तृत राजीनामा: सबै प्रकार, कानूनी प्रक्रिया, नमूनाहरू। पासवर्ड: RAJI-002",
        password: "RAJI-002",
        features: ["सबै प्रकार", "कानूनी प्रक्रिया", "नमूनाहरू", "गाइडलाइन"]
    },
    {   
        id: "file11", 
        title: "F11- RX IMG CONVERTER", 
        description: "Convert images to text and vice versa", 
        link: "ASSET/WEB-SOFTWARE/RX-IMG-CONVERTER.html", 
        icon: "fas fa-exchange-alt",
        category: "WEB-SOFTWARE",
        color: "#0284C7",
        columnLayout: "single",
        prices: { 
            default: "Rs. 600",
            pro: "Rs. 1000 (pro version)"
        },
        publicIntro: "Basic image to text conversion tool.",
        privateIntro: "Advanced features: Batch processing, OCR, API access. Password: IMG-CONV",
        password: "IMG-CONV",
        features: ["Batch Processing", "OCR Support", "API Access", "Cloud Storage"]
    }
];

const defaultStores = [
    {   
        id: "store_1", 
        name: "LEKHA-PADI", 
        icon: "fas fa-file-alt",
        color: "#F59E0B",
        layout: "double", // Double column layout
        content: ["file3", "file6"] 
    },
    {   
        id: "store_2", 
        name: "EPS-EXAM-QUESTION", 
        icon: "fas fa-graduation-cap",
        color: "#4F46E5",
        layout: "single", // Single column layout
        content: ["file1","file4","file5"] 
    },
    {   
        id: "store_3", 
        name: "WEB-SOFTWARE", 
        icon: "fas fa-laptop-code",
        color: "#10B981",
        layout: "single", // Single column layout
        content: ["file2","file11"] 
    },
];

// ==================== USER ACCESS DATABASE ====================
const userAccessDB = [
    {
        userId: 1,
        username: "ROSAN KC",
        email: "rkc242855@gmail.com",
        access: ["file1", "file2", "file3", "file4", "file5", "file6", "file7", "file8", "file9", "file10", "file11"],
        timedAccessConfig: {},
        purchases: [
            { fileId: "file1", purchaseDate: "2025-01-01", type: "permanent", price: "Rs. 100" },
            { fileId: "file2", purchaseDate: "2025-01-01", type: "permanent", price: "Rs. 100" },
            { fileId: "file3", purchaseDate: "2025-01-01", type: "permanent", price: "Rs. 600" }
        ]
    },
    {
        userId: 2,
        username: "jane_smith",
        email: "jane@example.com",
        access: ["file1", "file4"],
        timedAccessConfig: {
            "file2": { startDate: "2025-11-10", duration: 75 },
            "file5": { startDate: "2025-11-10", duration: 75 },
            "file11": { startDate: "2025-11-10", duration: 75 }
        },
        purchases: [
            { fileId: "file1", purchaseDate: "2025-10-01", type: "permanent", price: "Rs. 100" },
            { fileId: "file2", purchaseDate: "2025-11-10", type: "temporary", price: "Rs. 100" },
            { fileId: "file4", purchaseDate: "2025-10-05", type: "permanent", price: "Rs. 100" },
            { fileId: "file5", purchaseDate: "2025-11-10", type: "temporary", price: "Rs. 100" },
            { fileId: "file11", purchaseDate: "2025-11-10", type: "temporary", price: "Rs. 600" }
        ]
    }
];

// ==================== PURCHASE MODAL ====================
class PurchaseModal {
    constructor() {
        this.modal = null;
        this.currentCard = null;
        this.init();
    }

    init() {
        this.createModal();
    }

    createModal() {
        const modalHTML = `
            <div class="purchase-modal-overlay" id="purchaseModalOverlay">
                <div class="purchase-modal">
                    <div class="modal-header">
                        <h3><i class="fas fa-shopping-cart"></i> Purchase Options</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body" id="purchaseModalBody">
                        <!-- Content will be loaded here -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('purchaseModalOverlay');
        
        this.modal.querySelector('.modal-close').addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open(card) {
        this.currentCard = card;
        this.renderContent();
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentCard = null;
    }

    renderContent() {
        const body = document.getElementById('purchaseModalBody');
        if (!this.currentCard) return;

        body.innerHTML = `
            <div class="product-info">
                <div class="product-header">
                    <i class="${this.currentCard.icon}" style="color: ${this.currentCard.color}"></i>
                    <div>
                        <h4>${this.currentCard.title}</h4>
                        <p class="product-id">ID: ${this.currentCard.id}</p>
                    </div>
                </div>
                
                <div class="price-options">
                    <h5>Select Package:</h5>
                    ${Object.entries(this.currentCard.prices).map(([key, value]) => `
                        <div class="price-option">
                            <input type="radio" name="priceOption" id="price_${key}" value="${key}">
                            <label for="price_${key}">
                                <span class="price-label">${key.toUpperCase()}</span>
                                <span class="price-value">${value}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
                
                <div class="contact-section">
                    <div class="contact-info">
                        <i class="fas fa-info-circle"></i>
                        <p>For purchasing, please contact us directly. We'll guide you through the payment process.</p>
                    </div>
                    
                    <div class="contact-options">
                        <h5>Contact Options:</h5>
                        <div class="contact-buttons">
                            <a href="Contact.html?product=${encodeURIComponent(this.currentCard.title)}" class="contact-btn primary">
                                <i class="fas fa-comments"></i> Contact Now
                            </a>
                            <button class="contact-btn secondary" id="copyDetailsBtn">
                                <i class="fas fa-copy"></i> Copy Details
                            </button>
                            <button class="contact-btn outline" id="emailBtn">
                                <i class="fas fa-envelope"></i> Email Us
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-contact" onclick="window.location.href='Contact.html?product=${encodeURIComponent(this.currentCard.title)}'">
                        <i class="fas fa-phone-alt"></i> Contact for Purchase
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        body.querySelector('.btn-cancel').addEventListener('click', () => this.close());
        body.querySelector('#copyDetailsBtn').addEventListener('click', () => this.copyDetails());
        body.querySelector('#emailBtn').addEventListener('click', () => this.sendEmail());
    }

    copyDetails() {
        const details = `
Product: ${this.currentCard.title}
ID: ${this.currentCard.id}
Price: ${this.currentCard.prices.default}
Category: ${this.currentCard.category}
        
Please contact us to purchase this product.
        `;
        
        navigator.clipboard.writeText(details).then(() => {
            this.showToast("Details copied to clipboard!");
        });
    }

    sendEmail() {
        const subject = `Purchase Inquiry: ${this.currentCard.title}`;
        const body = `
I'm interested in purchasing:
- Product: ${this.currentCard.title}
- ID: ${this.currentCard.id}
- Category: ${this.currentCard.category}
- Price: ${this.currentCard.prices.default}

Please provide payment details and access instructions.

Thank you.
        `;
        
        const mailtoLink = `mailto:rkc242855@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        }, 100);
    }
}

// ==================== STORE MANAGEMENT CLASS ====================
class StoreManager {
    constructor() {
        this.currentUser = null;
        this.currentStore = null;
        this.userAccess = null;
        this.purchaseModal = new PurchaseModal();
        this.init();
    }

    init() {
        this.loadUser();
        this.setupTabs();
        this.renderStoreTabs();
        this.showStore('store_1');
        this.setupProfileIntegration();
    }

    loadUser() {
        // Try to get from profile system
        if (typeof currentUser !== 'undefined' && currentUser) {
            const userData = userDatabase.find(u => u.email === currentUser);
            this.userAccess = userAccessDB.find(u => u.email === currentUser);
            if (userData) {
                this.currentUser = userData;
                localStorage.setItem('storeCurrentUser', JSON.stringify(userData));
            }
        }
        
        // Fallback to localStorage
        if (!this.currentUser) {
            const saved = localStorage.getItem('storeCurrentUser');
            if (saved) {
                const userData = JSON.parse(saved);
                this.currentUser = userData;
                this.userAccess = userAccessDB.find(u => u.email === userData.email);
            }
        }
    }

    setupProfileIntegration() {
        // Listen for profile system events
        if (typeof window.RXProfileSystem !== 'undefined') {
            window.RXProfileSystem.onLogin = (user) => {
                this.currentUser = user;
                this.userAccess = userAccessDB.find(u => u.email === user.email);
                this.updateUserDisplay();
                this.renderStoreContent();
            };
            
            window.RXProfileSystem.onLogout = () => {
                this.currentUser = null;
                this.userAccess = null;
                localStorage.removeItem('storeCurrentUser');
                this.updateUserDisplay();
                this.renderStoreContent();
            };
        }
    }

    updateUserDisplay() {
        const userDisplay = document.getElementById('userDisplay');
        if (!userDisplay) return;

        if (this.currentUser) {
            userDisplay.innerHTML = `
                <div class="profile-header">
                    <div class="profile-main">
                        <img src="${this.currentUser.profileImage}" alt="${this.currentUser.username}" class="profile-avatar">
                        <div class="profile-info">
                            <h3 class="profile-name">${this.currentUser.username}</h3>
                            <div class="profile-details">
                                <span class="profile-badge id-badge">
                                    <i class="fas fa-id-card"></i> ID: ${this.currentUser.id}
                                </span>
                                <span class="profile-badge type-badge ${this.currentUser.accountType.toLowerCase()}">
                                    <i class="fas fa-user-tag"></i> ${this.currentUser.accountType}
                                </span>
                                <span class="profile-badge access-badge">
                                    <i class="fas fa-key"></i> ${this.getAccessCount()} Files Accessible
                                </span>
                            </div>
                        </div>
                    </div>
                    <button class="profile-action-btn" id="viewProfileBtn">
                        <i class="fas fa-user-circle"></i> View Profile
                    </button>
                </div>
            `;

            document.getElementById('viewProfileBtn').addEventListener('click', () => {
                if (typeof openRXProfile === 'function') {
                    openRXProfile();
                }
            });
        } else {
            userDisplay.innerHTML = `
                <div class="profile-header guest">
                    <div class="profile-main">
                        <div class="profile-avatar guest">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="profile-info">
                            <h3 class="profile-name">Guest User</h3>
                            <p class="guest-message">Please login to access premium content and make purchases</p>
                        </div>
                    </div>
                    <button class="profile-action-btn login-btn" id="loginBtn">
                        <i class="fas fa-sign-in-alt"></i> Login / Register
                    </button>
                </div>
            `;

            document.getElementById('loginBtn').addEventListener('click', () => {
                if (typeof openRXProfile === 'function') {
                    openRXProfile();
                } else {
                    window.location.href = '#login';
                }
            });
        }
    }

    getAccessCount() {
        if (!this.userAccess) return 0;
        let count = this.userAccess.access.length;
        Object.keys(this.userAccess.timedAccessConfig || {}).forEach(fileId => {
            if (!this.userAccess.access.includes(fileId)) {
                const accessInfo = this.getAccessInfo(fileId);
                if (accessInfo && accessInfo.status === 'active') {
                    count++;
                }
            }
        });
        return count;
    }

    setupTabs() {
        const storeTabs = document.getElementById('storeTabs');
        if (!storeTabs) return;

        storeTabs.innerHTML = defaultStores.map(store => `
            <button class="store-tab" data-store="${store.id}" style="--store-color: ${store.color}">
                <div class="tab-icon">
                    <i class="${store.icon}"></i>
                </div>
                <div class="tab-content">
                    <span class="tab-name">${store.name}</span>
                    <span class="tab-count">${store.content.length} items</span>
                </div>
            </button>
        `).join('');

        storeTabs.querySelectorAll('.store-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const storeId = e.currentTarget.dataset.store;
                this.showStore(storeId);
            });
        });
    }

    showStore(storeId) {
        this.currentStore = defaultStores.find(s => s.id === storeId);
        if (!this.currentStore) return;

        document.querySelectorAll('.store-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.store === storeId);
        });

        this.renderStoreContent();
    }

    renderStoreContent() {
        const storeContent = document.getElementById('storeContent');
        if (!storeContent) return;

        const storeCards = this.currentStore.content.map(fileId => 
            contentCards.find(card => card.id === fileId)
        ).filter(card => card);

        const layoutClass = this.currentStore.layout === 'double' ? 'cards-grid-double' : 'cards-grid-single';

        storeContent.innerHTML = `
            <div class="store-header">
                <div class="store-title-section">
                    <h2 class="store-title">
                        <i class="${this.currentStore.icon}" style="color: ${this.currentStore.color}"></i>
                        ${this.currentStore.name}
                    </h2>
                    <p class="store-subtitle">Browse and purchase ${storeCards.length} items</p>
                </div>
                <div class="store-filters">
                    <div class="filter-badge">
                        <i class="fas fa-layer-group"></i>
                        ${this.currentStore.layout === 'double' ? 'Double Column' : 'Single Column'}
                    </div>
                    <div class="filter-badge">
                        <i class="fas fa-check-circle"></i>
                        ${this.getUserAccessCount(storeCards)} Accessible
                    </div>
                </div>
            </div>
            
            <div class="${layoutClass}" id="cardsContainer">
                ${storeCards.map(card => this.renderCard(card)).join('')}
            </div>
        `;

        this.setupCardEvents(storeCards);
    }

    getUserAccessCount(cards) {
        if (!this.userAccess) return 0;
        return cards.filter(card => this.checkAccess(card.id)).length;
    }

    renderCard(card) {
        const hasAccess = this.checkAccess(card.id);
        const accessInfo = this.getAccessInfo(card.id);
        const isExpired = accessInfo && accessInfo.status === 'expired';
        const cardClass = this.currentStore.layout === 'double' ? 'content-card-double' : 'content-card-single';

        return `
            <div class="${cardClass}" id="card-${card.id}" style="--card-color: ${card.color}">
                <div class="card-header">
                    <div class="card-badge">
                        <i class="${card.icon}"></i>
                        <span class="card-category">${card.category}</span>
                    </div>
                    <div class="card-id">${card.id}</div>
                </div>
                
                <div class="card-body">
                    <h3 class="card-title">${card.title}</h3>
                    <p class="card-description">${card.description}</p>
                    
                    <div class="intro-section">
                        <div class="intro-toggle">
                            <button class="intro-btn active" data-type="public">Preview</button>
                            <button class="intro-btn" data-type="private" ${hasAccess && !isExpired ? '' : 'disabled'}>
                                ${hasAccess && !isExpired ? 'Details' : 'Locked'}
                            </button>
                        </div>
                        
                        <div class="intro-content public-intro active">
                            <h4><i class="fas fa-eye"></i> Preview</h4>
                            <p>${card.publicIntro}</p>
                            ${!hasAccess ? `
                                <div class="preview-limit">
                                    <i class="fas fa-lock"></i>
                                    <span>Full content available after purchase</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${hasAccess && !isExpired ? `
                            <div class="intro-content private-intro">
                                <h4><i class="fas fa-unlock"></i> Full Details</h4>
                                <p>${card.privateIntro}</p>
                                
                                ${card.features ? `
                                    <div class="features-list">
                                        <h5><i class="fas fa-star"></i> Features:</h5>
                                        <ul>
                                            ${card.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                                
                                ${card.password ? `
                                    <div class="password-section">
                                        <h5><i class="fas fa-key"></i> Access Password:</h5>
                                        <div class="password-display">
                                            <code>${card.password}</code>
                                            <button class="copy-password" data-password="${card.password}">
                                                <i class="fas fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                    
                    ${accessInfo ? this.renderAccessInfo(accessInfo) : ''}
                </div>
                
                <div class="card-footer">
                    <div class="price-section">
                        <span class="price-label">Price:</span>
                        <span class="price-value">${card.prices.default}</span>
                    </div>
                    
                    <div class="action-buttons">
                        ${hasAccess && !isExpired ? `
                            <button class="btn-open" data-card="${card.id}">
                                <i class="fas fa-external-link-alt"></i> Open
                            </button>
                        ` : `
                            <button class="btn-purchase" data-card="${card.id}">
                                <i class="fas fa-shopping-cart"></i> Purchase
                            </button>
                        `}
                        
                        ${isExpired ? `
                            <button class="btn-renew" data-card="${card.id}">
                                <i class="fas fa-redo"></i> Renew
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderAccessInfo(accessInfo) {
        if (accessInfo.status === 'permanent') {
            return `
                <div class="access-status permanent">
                    <i class="fas fa-crown"></i>
                    <span>Permanent Access</span>
                    <span class="status-badge">OWNED</span>
                </div>
            `;
        } else if (accessInfo.status === 'active') {
            return `
                <div class="access-status active">
                    <i class="fas fa-clock"></i>
                    <span>Access expires in ${accessInfo.daysLeft} days</span>
                    <div class="countdown-container">
                        <div class="countdown-bar">
                            <div class="countdown-progress" style="width: ${100 - accessInfo.percentage}%"></div>
                        </div>
                        <span class="countdown-text">${accessInfo.daysLeft} days left</span>
                    </div>
                </div>
            `;
        } else if (accessInfo.status === 'expired') {
            return `
                <div class="access-status expired">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Access expired ${accessInfo.daysExpired} days ago</span>
                </div>
            `;
        }
        return '';
    }

    setupCardEvents(cards) {
        cards.forEach(card => {
            const cardElement = document.getElementById(`card-${card.id}`);
            if (!cardElement) return;

            // Intro toggle
            const introBtns = cardElement.querySelectorAll('.intro-btn');
            const introContents = cardElement.querySelectorAll('.intro-content');
            
            introBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const type = btn.dataset.type;
                    
                    introBtns.forEach(b => b.classList.remove('active'));
                    introContents.forEach(c => c.classList.remove('active'));
                    
                    btn.classList.add('active');
                    cardElement.querySelector(`.${type}-intro`).classList.add('active');
                });
            });

            // Copy password
            const copyBtn = cardElement.querySelector('.copy-password');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const password = copyBtn.dataset.password;
                    navigator.clipboard.writeText(password).then(() => {
                        this.showNotification('Password copied to clipboard!');
                    });
                });
            }

            // Action buttons
            const openBtn = cardElement.querySelector('.btn-open');
            const purchaseBtn = cardElement.querySelector('.btn-purchase');
            const renewBtn = cardElement.querySelector('.btn-renew');

            if (openBtn) openBtn.addEventListener('click', () => this.openCard(card));
            if (purchaseBtn) purchaseBtn.addEventListener('click', () => this.purchaseCard(card));
            if (renewBtn) renewBtn.addEventListener('click', () => this.renewCard(card));
        });
    }

    checkAccess(cardId) {
        if (!this.userAccess) return false;
        
        if (this.userAccess.access.includes(cardId)) return true;
        
        const timedAccess = this.userAccess.timedAccessConfig?.[cardId];
        if (timedAccess) {
            const endDate = new Date(timedAccess.startDate);
            endDate.setDate(endDate.getDate() + timedAccess.duration);
            return new Date() <= endDate;
        }
        
        return false;
    }

    getAccessInfo(cardId) {
        if (!this.userAccess) return null;
        
        if (this.userAccess.access.includes(cardId)) {
            return { status: 'permanent', type: 'permanent' };
        }
        
        const timedAccess = this.userAccess.timedAccessConfig?.[cardId];
        if (timedAccess) {
            const startDate = new Date(timedAccess.startDate);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + timedAccess.duration);
            const today = new Date();
            
            if (today > endDate) {
                const daysExpired = Math.floor((today - endDate) / (1000 * 60 * 60 * 24));
                return { status: 'expired', type: 'temporary', daysExpired };
            } else {
                const totalDays = timedAccess.duration;
                const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
                const daysLeft = Math.max(0, totalDays - daysPassed);
                const percentage = Math.min(100, (daysPassed / totalDays) * 100);
                
                return {
                    status: 'active',
                    type: 'temporary',
                    daysLeft,
                    daysPassed,
                    percentage,
                    endDate: endDate.toISOString().split('T')[0]
                };
            }
        }
        
        return null;
    }

    openCard(card) {
        if (this.checkAccess(card.id)) {
            window.location.href = card.link;
        } else {
            this.showNotification('Please purchase this content to access it.');
        }
    }

    purchaseCard(card) {
        if (!this.currentUser) {
            this.showNotification('Please login to make a purchase.');
            if (typeof openRXProfile === 'function') {
                setTimeout(() => openRXProfile(), 1000);
            }
            return;
        }
        this.purchaseModal.open(card);
    }

    renewCard(card) {
        if (!this.currentUser) {
            this.showNotification('Please login to renew access.');
            return;
        }
        
        const subject = `Renewal Request: ${card.title}`;
        const body = `
User: ${this.currentUser.username}
Email: ${this.currentUser.email}
User ID: ${this.currentUser.id}

Product: ${card.title}
ID: ${card.id}
Price: ${card.prices.default}

Requesting renewal of access.
        `;
        
        const mailtoLink = `mailto:rkc242855@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'store-notification';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }
}

// ==================== CSS STYLES ====================
const storeStyles = `
<style>
/* Store System Styles */
:root {
    --primary-color: #4F46E5;
    --secondary-color: #10B981;
    --accent-color: #F59E0B;
    --dark-bg: #0F172A;
    --card-bg: #1E293B;
    --text-light: #F1F5F9;
    --text-muted: #94A3B8;
    --border-color: #334155;
    --success-color: #10B981;
    --warning-color: #F59E0B;
    --danger-color: #EF4444;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
}

.store-container {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    background: var(--dark-bg);
    color: var(--text-light);
    min-height: 100vh;
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
}

/* Profile Header */
.profile-header {
    background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
    border-radius: var(--radius-lg);
    padding: 25px 30px;
    margin-bottom: 30px;
    border: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.profile-header.guest {
    background: linear-gradient(135deg, #1E293B 0%, #1a202c 100%);
}

.profile-main {
    display: flex;
    align-items: center;
    gap: 20px;
}

.profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-lg);
    border: 3px solid var(--primary-color);
    object-fit: cover;
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
}

.profile-avatar.guest {
    background: var(--card-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: var(--text-muted);
    border-color: var(--text-muted);
}

.profile-info {
    flex: 1;
}

.profile-name {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 10px 0;
    color: var(--text-light);
}

.guest-message {
    color: var(--text-muted);
    margin: 5px 0 0 0;
    font-size: 14px;
}

.profile-details {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 10px;
}

.profile-badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.id-badge {
    background: rgba(79, 70, 229, 0.1);
    color: var(--primary-color);
    border: 1px solid rgba(79, 70, 229, 0.3);
}

.type-badge {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success-color);
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.type-badge.admin {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger-color);
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.access-badge {
    background: rgba(245, 158, 11, 0.1);
    color: var(--warning-color);
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.profile-action-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    font-size: 15px;
}

.profile-action-btn:hover {
    background: #4338CA;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
}

.profile-action-btn.login-btn {
    background: var(--success-color);
}

.profile-action-btn.login-btn:hover {
    background: #0D9668;
}

/* Store Tabs */
.store-tabs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
}

@media (max-width: 768px) {
    .store-tabs {
        grid-template-columns: 1fr;
    }
}

.store-tab {
    background: var(--card-bg);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
    text-align: left;
}

.store-tab:hover {
    border-color: var(--store-color, var(--primary-color));
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.store-tab.active {
    background: var(--store-color, var(--primary-color));
    border-color: var(--store-color, var(--primary-color));
    color: white;
    box-shadow: 0 10px 30px rgba(var(--store-color-rgb, 79, 70, 229), 0.4);
}

.tab-icon {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
}

.store-tab.active .tab-icon {
    background: rgba(255, 255, 255, 0.2);
}

.tab-content {
    flex: 1;
}

.tab-name {
    font-size: 18px;
    font-weight: 700;
    display: block;
    margin-bottom: 5px;
}

.tab-count {
    font-size: 14px;
    opacity: 0.9;
}

/* Store Header */
.store-header {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid var(--border-color);
}

.store-title-section {
    margin-bottom: 20px;
}

.store-title {
    font-size: 32px;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 15px;
    color: var(--text-light);
}

.store-subtitle {
    color: var(--text-muted);
    font-size: 16px;
    margin: 0;
}

.store-filters {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.filter-badge {
    background: var(--card-bg);
    padding: 8px 16px;
    border-radius: var(--radius-md);
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted);
}

/* Cards Grid */
.cards-grid-single {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 25px;
}

.cards-grid-double {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 25px;
}

@media (max-width: 1200px) {
    .cards-grid-double {
        grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
    }
}

@media (max-width: 992px) {
    .cards-grid-single,
    .cards-grid-double {
        grid-template-columns: 1fr;
    }
}

/* Content Cards */
.content-card-single,
.content-card-double {
    background: var(--card-bg);
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border-color);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
    display: flex;
    flex-direction: column;
}

.content-card-single:hover,
.content-card-double:hover {
    transform: translateY(-8px);
    border-color: var(--card-color, var(--primary-color));
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.content-card-double {
    min-height: 500px;
}

.card-header {
    background: linear-gradient(135deg, var(--card-color, var(--primary-color)) 0%, 
                  color-mix(in srgb, var(--card-color, var(--primary-color)) 70%, black 30%) 100%);
    padding: 20px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
}

.card-badge i {
    font-size: 22px;
}

.card-category {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: rgba(255, 255, 255, 0.2);
    padding: 6px 14px;
    border-radius: 20px;
}

.card-id {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-family: monospace;
    background: rgba(255, 255, 255, 0.1);
    padding: 4px 10px;
    border-radius: 6px;
}

.card-body {
    padding: 25px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.card-title {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 12px 0;
    color: var(--text-light);
}

.card-description {
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 20px;
    font-size: 15px;
}

/* Intro Section */
.intro-section {
    flex: 1;
    margin: 20px 0;
}

.intro-toggle {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    padding: 8px;
    border-radius: var(--radius-md);
}

.intro-btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
}

.intro-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
}

.intro-btn.active {
    background: var(--card-color, var(--primary-color));
    color: white;
}

.intro-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.intro-content {
    display: none;
    animation: fadeIn 0.3s ease;
}

.intro-content.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.public-intro h4,
.private-intro h4 {
    font-size: 16px;
    margin: 0 0 15px 0;
    color: var(--text-light);
    display: flex;
    align-items: center;
    gap: 10px;
}

.public-intro p,
.private-intro p {
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 20px;
    font-size: 15px;
}

.preview-limit {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: var(--radius-md);
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--warning-color);
    font-size: 14px;
}

.features-list {
    margin: 25px 0;
}

.features-list h5 {
    font-size: 15px;
    margin: 0 0 15px 0;
    color: var(--text-light);
    display: flex;
    align-items: center;
    gap: 10px;
}

.features-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.features-list li {
    color: var(--text-muted);
    margin-bottom: 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.features-list li i {
    color: var(--success-color);
    font-size: 12px;
}

.password-section {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: var(--radius-md);
    padding: 20px;
    margin-top: 25px;
}

.password-section h5 {
    font-size: 15px;
    margin: 0 0 15px 0;
    color: var(--success-color);
    display: flex;
    align-items: center;
    gap: 10px;
}

.password-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.2);
    padding: 12px 20px;
    border-radius: var(--radius-sm);
}

.password-display code {
    font-family: monospace;
    font-size: 16px;
    color: var(--text-light);
    letter-spacing: 1px;
}

.copy-password {
    background: var(--success-color);
    color: white;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.copy-password:hover {
    background: #0D9668;
    transform: scale(1.1);
}

/* Access Status */
.access-status {
    padding: 18px;
    border-radius: var(--radius-md);
    margin: 20px 0;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.access-status.permanent {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: var(--success-color);
}

.access-status.active {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: var(--warning-color);
}

.access-status.expired {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: var(--danger-color);
}

.status-badge {
    background: var(--success-color);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    margin-left: auto;
}

.countdown-container {
    flex: 1;
    margin-left: 20px;
}

.countdown-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 6px;
}

.countdown-progress {
    height: 100%;
    background: linear-gradient(90deg, var(--warning-color), #FBBF24);
    border-radius: 3px;
    transition: width 0.3s ease;
}

.countdown-text {
    font-size: 12px;
    text-align: right;
    color: var(--text-muted);
    display: block;
}

/* Card Footer */
.card-footer {
    padding: 20px 25px;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.1);
}

.price-section {
    display: flex;
    align-items: center;
    gap: 10px;
}

.price-label {
    color: var(--text-muted);
    font-size: 14px;
}

.price-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--card-color, var(--primary-color));
}

.action-buttons {
    display: flex;
    gap: 12px;
}

.btn-open, .btn-purchase, .btn-renew {
    padding: 14px 28px;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    min-width: 140px;
    justify-content: center;
    transition: all 0.3s ease;
}

.btn-open {
    background: var(--success-color);
    color: white;
}

.btn-open:hover {
    background: #0D9668;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-purchase {
    background: var(--primary-color);
    color: white;
}

.btn-purchase:hover {
    background: #4338CA;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
}

.btn-renew {
    background: var(--danger-color);
    color: white;
}

.btn-renew:hover {
    background: #DC2626;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

/* Purchase Modal */
.purchase-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    padding: 20px;
}

.purchase-modal {
    background: var(--card-bg);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow: hidden;
    border: 1px solid var(--border-color);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
}

.modal-header {
    background: linear-gradient(135deg, var(--primary-color) 0%, #4338CA 100%);
    padding: 20px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.modal-close {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
}

.modal-body {
    padding: 25px;
    overflow-y: auto;
    max-height: calc(90vh - 80px);
}

.product-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
}

.product-header i {
    font-size: 32px;
}

.product-header h4 {
    margin: 0;
    font-size: 20px;
    color: var(--text-light);
}

.product-id {
    color: var(--text-muted);
    font-size: 13px;
    margin-top: 5px;
}

.price-options {
    margin: 25px 0;
}

.price-options h5 {
    color: var(--text-light);
    margin: 0 0 15px 0;
    font-size: 16px;
}

.price-option {
    margin-bottom: 12px;
}

.price-option input {
    display: none;
}

.price-option label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.3s ease;
}

.price-option input:checked + label {
    border-color: var(--primary-color);
    background: rgba(79, 70, 229, 0.1);
}

.price-label {
    font-weight: 600;
    color: var(--text-light);
}

.price-value {
    font-weight: 700;
    color: var(--primary-color);
    font-size: 18px;
}

.contact-section {
    background: rgba(255, 255, 255, 0.03);
    border-radius: var(--radius-md);
    padding: 20px;
    margin: 25px 0;
}

.contact-info {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    color: var(--warning-color);
}

.contact-info i {
    font-size: 20px;
    flex-shrink: 0;
}

.contact-info p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
}

.contact-options h5 {
    color: var(--text-light);
    margin: 0 0 15px 0;
    font-size: 16px;
}

.contact-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
}

.contact-btn {
    padding: 12px;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    text-decoration: none;
    border: none;
}

.contact-btn.primary {
    background: var(--primary-color);
    color: white;
}

.contact-btn.secondary {
    background: var(--success-color);
    color: white;
}

.contact-btn.outline {
    background: transparent;
    border: 2px solid var(--border-color);
    color: var(--text-muted);
}

.contact-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.modal-footer {
    display: flex;
    gap: 15px;
    margin-top: 25px;
}

.btn-cancel, .btn-contact {
    flex: 1;
    padding: 16px;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 15px;
    transition: all 0.3s ease;
    border: none;
}

.btn-cancel {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-muted);
    border: 1px solid var(--border-color);
}

.btn-contact {
    background: linear-gradient(135deg, var(--success-color) 0%, #0D9668 100%);
    color: white;
}

.btn-cancel:hover, .btn-contact:hover {
    transform: translateY(-2px);
}

/* Notifications */
.store-notification, .toast-notification {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: var(--success-color);
    color: white;
    padding: 16px 24px;
    border-radius: var(--radius-md);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 12px;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 10001;
}

.store-notification.show, .toast-notification.show {
    transform: translateY(0);
    opacity: 1;
}

.toast-notification {
    background: var(--primary-color);
}

/* Responsive Design */
@media (max-width: 768px) {
    .store-container {
        padding: 15px;
    }
    
    .profile-header {
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }
    
    .profile-main {
        flex-direction: column;
        text-align: center;
    }
    
    .profile-details {
        justify-content: center;
    }
    
    .profile-action-btn {
        width: 100%;
        justify-content: center;
    }
    
    .store-title {
        font-size: 24px;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .cards-grid-single,
    .cards-grid-double {
        gap: 20px;
    }
    
    .card-footer {
        flex-direction: column;
        gap: 20px;
    }
    
    .price-section {
        width: 100%;
        justify-content: center;
    }
    
    .action-buttons {
        width: 100%;
    }
    
    .btn-open, .btn-purchase, .btn-renew {
        width: 100%;
    }
    
    .contact-buttons {
        grid-template-columns: 1fr;
    }
    
    .modal-footer {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .cards-grid-single,
    .cards-grid-double {
        grid-template-columns: 1fr;
    }
    
    .intro-toggle {
        flex-direction: column;
    }
    
    .purchase-modal {
        margin: 0;
        border-radius: 0;
        max-height: 100vh;
    }
}
</style>
`;

// ==================== INITIALIZATION ====================
document.head.insertAdjacentHTML('beforeend', storeStyles);

// Create HTML structure
document.addEventListener('DOMContentLoaded', () => {
    const storeContainer = document.getElementById('storeContainer') || document.body;
    storeContainer.insertAdjacentHTML('beforeend', `
        <div class="store-container">
            <div id="userDisplay"></div>
            <div class="store-tabs" id="storeTabs"></div>
            <div id="storeContent"></div>
        </div>
    `);
    
    // Initialize store manager
    window.storeManager = new StoreManager();
});

// ==================== GLOBAL UTILITIES ====================
window.RXStore = {
    addCard: (card) => {
        contentCards.push(card);
        console.log(`Card added: ${card.title}`);
        window.storeManager?.renderStoreContent();
    },
    
    removeCard: (cardId) => {
        const index = contentCards.findIndex(c => c.id === cardId);
        if (index !== -1) {
            contentCards.splice(index, 1);
            console.log(`Card removed: ${cardId}`);
            window.storeManager?.renderStoreContent();
        }
    },
    
    addStore: (store) => {
        defaultStores.push(store);
        console.log(`Store added: ${store.name}`);
        window.storeManager?.setupTabs();
    },
    
    removeStore: (storeId) => {
        const index = defaultStores.findIndex(s => s.id === storeId);
        if (index !== -1) {
            defaultStores.splice(index, 1);
            console.log(`Store removed: ${storeId}`);
            window.storeManager?.setupTabs();
        }
    },
    
    loginUser: (userId) => {
        const userData = userDatabase.find(u => u.id == userId);
        if (userData) {
            localStorage.setItem('storeCurrentUser', JSON.stringify(userData));
            window.location.reload();
        }
    },
    
    logoutUser: () => {
        localStorage.removeItem('storeCurrentUser');
        window.location.reload();
    },
    
    getAllCards: () => contentCards,
    getAllStores: () => defaultStores,
    getCurrentUser: () => window.storeManager?.currentUser
};

console.log("RX Store System v3.0 loaded with Contact Integration!");