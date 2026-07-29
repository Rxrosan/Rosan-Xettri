// RX COMPLETE MANAGER - Full Access Control System
// All old functions preserved, just merged into one file

const RXCompleteManager = (function() {
    // ==================== CONFIGURATION (from RX-WEB-RESOURCE.js) ====================
    const QUESTIONS = [
        {
            id: 1,
            title: "KOREAN LANGUAGE PRACTICE EXAM",
            content: "Korean Language Test Exam Model - all randomly generate exam that for practice",
            link: "KR-EXAM.html",
            category: "RX STUDIO",
        },
        {
            id: 2,
            title: "LEKHAPADI-METRIAL / WEB-SOFTWARE",
            content: "#",
            link: "RX-LEKA-PADI.html",
            category: "RX STUDIO"
        },
        {
            id: 3,
            title: "RX-QR-Scanner/Generator",
            content: "You can create personalized messages using a QR code with this app.",
            link: "RX-ASSETS/RX-OTHER-SOFTWARE-FUNCTION/RX-S-QR.html",
            category: "RX STUDIO",
        },
        {
            id: 4,
            title: "RX IMG CONVERTER",
            content: "Easily encode images to text and decode back to images  | LOGIN CODE : RX2061 ",
            link: "RX-ASSETS/RX-OTHER-SOFTWARE-FUNCTION/RX-IMG-CONVERTER.html",
            category: "RX STUDIO",
        },
        
    ];

    // DOM Elements (from RX-WEB-RESOURCE.js)
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

    // State - from RX-WEB-RESOURCE.js
    let state = {
        currentUser: null
    };

    // ==================== ACCESS CONFIGURATION (from RX-ACESS-MANAGER.js) ====================
    let accessConfig = {
        1: {
            accessType: 'permanent',
            resources: {
                1: { purchased: '2024-01-01', price: 0, expiresDays: null },
                2: { purchased: '2024-01-01', price: 0, expiresDays: null },
                3: { purchased: '2024-01-01', price: 0, expiresDays: null },
                4: { purchased: '2024-01-01', price: 0, expiresDays: null },
            }
        }
    };

    // Resource pricing information (from RX-ACESS-MANAGER.js)
    const resourcePrices = {
        1: { basePrice: 999, currency: "Rs ", days: 30 },
        2: { basePrice: 2999, currency: "Rs ", days: 30 },
        3: { basePrice: 299, currency: "Rs ", days: 30 },
        4: { basePrice: 299, currency: "Rs ", days: 30 },
    };

    // Formspree configuration (from RX-ACESS-MANAGER.js)
    const FORMPREE_ENDPOINT = "https://formspree.io/f/xzznawep";
    
    // ==================== ACCESS MANAGER STATE (from RX-ACESS-MANAGER.js) ====================
    let isInitialized = false;
    let checkInterval = null;
    let loginStateCheckInterval = null;
    let currentUserId = null;

    // ==================== FUNCTIONS FROM RX-WEB-RESOURCE.js (PRESERVED) ====================

    // Check authentication status on page load (from RX-WEB-RESOURCE.js)
    function checkLoginStatus() {
        // Get user from localStorage (persistent)
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

    // Handle logout (from RX-WEB-RESOURCE.js)
    function handleLogout() {
        // Clear user from localStorage
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

    // Show question bank (from RX-WEB-RESOURCE.js)
    function showQuestionBank() {
        if (!state.currentUser) {
            showLoginScreen();
            return;
        }
        
        if (dom.loginScreen) dom.loginScreen.classList.add('hidden');
        if (dom.questionBank) dom.questionBank.classList.remove('hidden');
        
        renderQuestions();
    }

    // Show login screen (from RX-WEB-RESOURCE.js)
    function showLoginScreen() {
        if (dom.loginScreen) dom.loginScreen.classList.remove('hidden');
        if (dom.questionBank) dom.questionBank.classList.add('hidden');
    }

    // Update side panel user (from RX-WEB-RESOURCE.js)
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

    // Render questions (from RX-WEB-RESOURCE.js) - MODIFIED only to remove "Loading..." text
    function renderQuestions() {
        if (!dom.questionGrid) return;
        
        dom.questionGrid.innerHTML = '';
        
        QUESTIONS.forEach((question, index) => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.tabIndex = 0;
            
            // MODIFIED: Removed "Loading..." text, now empty
            card.innerHTML = `
                <div class="card-content">
                    <h3>${question.title}</h3>
                    <p>${question.content}</p>
                    <div class="card-footer">
                        <span class="category-badge">${question.category}</span>
                        <a href="${question.link}">
                           <!-- Empty - Access manager will populate -->
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

    // Check scroll position (from RX-WEB-RESOURCE.js)
    function checkScrollPosition() {
        if (!dom.scrollToTopBtn) return;
        
        if (window.scrollY > 300) {
            dom.scrollToTopBtn.classList.remove('hidden');
        } else {
            dom.scrollToTopBtn.classList.add('hidden');
        }
    }

    // Show message (from RX-WEB-RESOURCE.js)
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

    // ==================== FUNCTIONS FROM RX-ACESS-MANAGER.js (PRESERVED) ====================

    // Initialize function (from RX-ACESS-MANAGER.js)
    function init() {
        if (isInitialized) return;
        
        console.log('RX Access Manager: Initializing...');
        loadFromLocalStorage();
        injectStyles();
        
        // Get initial user ID
        currentUserId = getCurrentUserId();
        console.log('RX Access Manager: Initial user ID:', currentUserId);
        
        // Start monitoring login state
        startLoginStateMonitor();
        
        // Setup access control after a short delay to ensure everything is loaded
        setTimeout(() => {
            console.log('RX Access Manager: Setting up access control...');
            setupAccessControl();
        }, 1000);
        
        isInitialized = true;
        return this;
    }

    // Get current user ID - Improved version (from RX-ACESS-MANAGER.js)
    function getCurrentUserId() {
        try {
            // First check if RXUserData is available
            if (window.RXUserData && typeof window.RXUserData.getCurrentUser === 'function') {
                const user = window.RXUserData.getCurrentUser();
                if (user && user.id) {
                    console.log('RX Access Manager: Found user via RXUserData:', user.id);
                    return user.id;
                }
            }
            
            // Fallback: Check localStorage directly
            const userId = localStorage.getItem('rxCurrentUserId');
            if (userId) {
                console.log('RX Access Manager: Found user ID in localStorage:', userId);
                return parseInt(userId);
            }
            
            console.log('RX Access Manager: No user found');
            return null;
        } catch (e) {
            console.warn('RX Access Manager: Error getting user ID:', e);
            return null;
        }
    }

    // Monitor login state changes (from RX-ACESS-MANAGER.js)
    function startLoginStateMonitor() {
        if (loginStateCheckInterval) {
            clearInterval(loginStateCheckInterval);
        }
        
        loginStateCheckInterval = setInterval(() => {
            const newUserId = getCurrentUserId();
            
            // Check if user state changed
            if (newUserId !== currentUserId) {
                console.log('RX Access Manager: User state changed from', currentUserId, 'to', newUserId);
                currentUserId = newUserId;
                
                // Force update cards when login state changes
                setTimeout(() => {
                    forceUpdateCards();
                }, 500);
            }
        }, 1000);
    }

    // Force update all cards (from RX-ACESS-MANAGER.js)
    function forceUpdateCards() {
        console.log('RX Access Manager: Force updating cards for user:', currentUserId);
        
        // Remove processed class from all cards
        document.querySelectorAll('.question-card.access-processed').forEach(card => {
            card.classList.remove('access-processed');
        });
        
        // Reprocess cards
        processQuestionCards();
    }

    // Load configuration from localStorage (from RX-ACESS-MANAGER.js)
    function loadFromLocalStorage() {
        try {
            const savedConfig = localStorage.getItem('rxAccessConfigV3');
            if (savedConfig) {
                const parsed = JSON.parse(savedConfig);
                // Merge with default config
                accessConfig = { ...accessConfig, ...parsed };
            }
        } catch (e) {
            console.error('RX Access Manager: Error loading config:', e);
        }
    }

    // Save configuration to localStorage (from RX-ACESS-MANAGER.js)
    function saveToLocalStorage() {
        try {
            localStorage.setItem('rxAccessConfigV3', JSON.stringify(accessConfig));
        } catch (e) {
            console.error('RX Access Manager: Error saving config:', e);
        }
    }

    // Check if user has access to resource (from RX-ACESS-MANAGER.js)
    function hasAccess(userId, resourceId) {
        if (!userId) return false;
        
        const userAccess = accessConfig[userId];
        if (!userAccess || !userAccess.resources) return false;
        
        const resource = userAccess.resources[resourceId];
        if (!resource) return false;
        
        // Check if expired (days-based)
        if (resource.expiresDays) {
            const today = new Date();
            const purchasedDate = new Date(resource.purchased);
            const expiryDate = new Date(purchasedDate);
            expiryDate.setDate(purchasedDate.getDate() + resource.expiresDays);
            return today <= expiryDate;
        }
        
        return true;
    }

    // Get resource price (from RX-ACESS-MANAGER.js)
    function getResourcePrice(resourceId) {
        return resourcePrices[resourceId] || { basePrice: 999, currency: "₹", days: 30 };
    }

    // Calculate remaining days (from RX-ACESS-MANAGER.js)
    function getRemainingDays(userId, resourceId) {
        if (!userId) return 0;
        
        const userAccess = accessConfig[userId];
        if (!userAccess || !userAccess.resources) return 0;
        
        const resource = userAccess.resources[resourceId];
        if (!resource || !resource.expiresDays) return 0;
        
        const today = new Date();
        const purchasedDate = new Date(resource.purchased);
        const expiryDate = new Date(purchasedDate);
        expiryDate.setDate(purchasedDate.getDate() + resource.expiresDays);
        
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return Math.max(0, diffDays);
    }

    // Get user's resource access status (from RX-ACESS-MANAGER.js)
    function getUserResourceStatus(userId, resourceId) {
        if (!userId) {
            return { hasAccess: false, price: getResourcePrice(resourceId).basePrice };
        }
        
        const userAccess = accessConfig[userId];
        if (!userAccess || !userAccess.resources) {
            return { hasAccess: false, price: getResourcePrice(resourceId).basePrice };
        }
        
        const resource = userAccess.resources[resourceId];
        if (!resource) {
            return { hasAccess: false, price: getResourcePrice(resourceId).basePrice };
        }
        
        // Check expiry (days-based)
        if (resource.expiresDays) {
            const today = new Date();
            const purchasedDate = new Date(resource.purchased);
            const expiryDate = new Date(purchasedDate);
            expiryDate.setDate(purchasedDate.getDate() + resource.expiresDays);
            const isExpired = today > expiryDate;
            const remainingDays = getRemainingDays(userId, resourceId);
            
            return {
                hasAccess: !isExpired,
                isExpired: isExpired,
                purchased: resource.purchased,
                expiresDays: resource.expiresDays,
                remainingDays: remainingDays,
                price: resource.price,
                needsRenewal: isExpired || remainingDays < 7 // Warn when less than 7 days left
            };
        }
        
        return {
            hasAccess: true,
            isExpired: false,
            purchased: resource.purchased,
            expiresDays: null,
            remainingDays: null,
            price: resource.price,
            needsRenewal: false
        };
    }

    // Setup access control (from RX-ACESS-MANAGER.js)
    function setupAccessControl() {
        console.log('RX Access Manager: Setting up access control for user:', currentUserId);
        
        // Stop any existing interval
        if (checkInterval) {
            clearInterval(checkInterval);
        }
        
        // Process cards immediately
        processQuestionCards();
        
        // Set up periodic check for new cards
        checkInterval = setInterval(() => {
            const unprocessedCards = document.querySelectorAll('.question-card:not(.access-processed)');
            if (unprocessedCards.length > 0) {
                console.log('RX Access Manager: Found new cards, processing...');
                processQuestionCards();
            }
        }, 2000);
    }

    // Process question cards (from RX-ACESS-MANAGER.js)
    function processQuestionCards() {
        const questionGrid = document.getElementById('question-grid');
        if (!questionGrid) {
            console.log('RX Access Manager: No question grid found');
            return;
        }
        
        console.log('RX Access Manager: Processing cards for user ID:', currentUserId);
        
        const cards = questionGrid.querySelectorAll('.question-card');
        
        if (cards.length === 0) {
            console.log('RX Access Manager: No cards found');
            return;
        }
        
        cards.forEach((card, index) => {
            if (card.classList.contains('access-processed')) return;
            
            const resourceId = index + 1;
            const existingLink = card.querySelector('a[href]');
            if (!existingLink) return;
            
            const originalHref = existingLink.getAttribute('href') || existingLink.href;
            const linkText = existingLink.textContent || existingLink.innerHTML;
            
            // Get access status - use currentUserId directly
            let accessStatus = { hasAccess: false, price: 999 };
            if (currentUserId) {
                accessStatus = getUserResourceStatus(currentUserId, resourceId);
                console.log(`RX Access Manager: Resource ${resourceId} access for user ${currentUserId}:`, accessStatus.hasAccess);
            }
            
            // Modify the card
            modifyCard(card, resourceId, originalHref, linkText, accessStatus, currentUserId);
            card.classList.add('access-processed');
        });
        
        console.log(`RX Access Manager: Processed ${cards.length} cards`);
    }

    // Modify individual card (from RX-ACESS-MANAGER.js)
    function modifyCard(card, resourceId, originalLink, linkText, accessStatus, userId) {
        const footer = card.querySelector('.card-footer');
        if (!footer) return;
        
        const existingBtn = footer.querySelector('.btn-view, a[href]');
        if (!existingBtn) return;
        
        const priceInfo = getResourcePrice(resourceId);
        const title = card.querySelector('h3')?.textContent || `Resource ${resourceId}`;
        
        // Remove existing button but keep its position
        const buttonContainer = existingBtn.parentNode;
        
        // Create and add new button based on access
        let newButton;
        
        if (!userId) {
            // Not logged in
            newButton = createLoginButton();
            addAccessBadge(card, 'Login Required', '#4cc9f0');
        } else if (accessStatus.hasAccess) {
            // Has access
            newButton = createOpenButton(originalLink);
            const badgeColor = accessStatus.remainingDays < 7 ? '#ffa500' : '#28a745';
            const badgeText = accessStatus.remainingDays < 7 ? 
                `${accessStatus.remainingDays}d left` : 'Access';
            addAccessBadge(card, badgeText, badgeColor);
        } else if (accessStatus.needsRenewal) {
            // Needs renewal
            newButton = createRenewButton(resourceId, title);
            addAccessBadge(card, 'Expired', '#ff6b6b');
            addPriceTag(card, priceInfo);
        } else {
            // No access
            newButton = createPurchaseButton(resourceId, title);
            addAccessBadge(card, 'Locked', '#764ba2');
            addPriceTag(card, priceInfo);
        }
        
        // Replace the existing button
        existingBtn.replaceWith(newButton);
    }

    // Create login button (from RX-ACESS-MANAGER.js)
    function createLoginButton() {
        const btn = document.createElement('button');
        btn.className = 'access-btn access-login-btn';
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> LOGIN TO ACCESS';
        btn.onclick = function() {
            window.location.href = 'USER.html';
        };
        return btn;
    }

    // Create open button (from RX-ACESS-MANAGER.js)
    function createOpenButton(link) {
        const btn = document.createElement('a');
        btn.className = 'access-btn access-open-btn';
        btn.href = link;
        btn.innerHTML = '<i class="fas fa-play"></i> OPEN';
        return btn;
    }

    // Create purchase button (from RX-ACESS-MANAGER.js)
    function createPurchaseButton(resourceId, title) {
        const btn = document.createElement('button');
        btn.className = 'access-btn access-purchase-btn';
        btn.innerHTML = '<i class="fas fa-shopping-cart"></i> PURCHASE';
        btn.onclick = function() {
            showFormspreePopup(resourceId, title, false);
        };
        return btn;
    }

    // Create renew button (from RX-ACESS-MANAGER.js)
    function createRenewButton(resourceId, title) {
        const btn = document.createElement('button');
        btn.className = 'access-btn access-renew-btn';
        btn.innerHTML = '<i class="fas fa-redo"></i> RENEW ACCESS';
        btn.onclick = function() {
            showFormspreePopup(resourceId, title, true);
        };
        return btn;
    }

    // Add access badge (from RX-ACESS-MANAGER.js)
    function addAccessBadge(card, text, color) {
        let badge = card.querySelector('.access-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'access-badge';
            card.style.position = 'relative';
            card.appendChild(badge);
        }
        badge.textContent = text;
        badge.style.backgroundColor = color;
    }

    // Add price tag (from RX-ACESS-MANAGER.js)
    function addPriceTag(card, priceInfo) {
        let priceTag = card.querySelector('.access-price-tag');
        if (!priceTag) {
            priceTag = document.createElement('div');
            priceTag.className = 'access-price-tag';
            card.appendChild(priceTag);
        }
        priceTag.innerHTML = `
            <span class="access-price">${priceInfo.currency}${priceInfo.basePrice}</span>
            <span class="access-duration">/${priceInfo.days}d</span>
        `;
    }

    // Show Formspree purchase popup (from RX-ACESS-MANAGER.js)
    function showFormspreePopup(resourceId, title, isRenewal) {
        console.log('Showing Formspree popup for resource:', resourceId, title);
        
        // Remove existing popup
        const existingPopup = document.getElementById('access-purchase-popup');
        if (existingPopup) existingPopup.remove();
        
        const priceInfo = getResourcePrice(resourceId);
        const userStatus = currentUserId ? getUserResourceStatus(currentUserId, resourceId) : null;
        const currentUser = getCurrentUserInfo();
        
        const popup = document.createElement('div');
        popup.id = 'access-purchase-popup';
        popup.className = 'access-popup';
        
        popup.innerHTML = `
            <div class="access-popup-overlay"></div>
            <div class="access-popup-container">
                <div class="access-popup-header">
                    <h3><i class="fas ${isRenewal ? 'fa-redo' : 'fa-shopping-cart'}"></i> ${isRenewal ? 'Renew Access' : 'Purchase Access'}</h3>
                    <button class="access-popup-close">&times;</button>
                </div>
                <div class="access-popup-body">
                    <div class="access-resource-info">
                        <h4>${title}</h4>
                        <div class="access-price-display">
                            <span class="access-price-large">${priceInfo.currency}${priceInfo.basePrice}</span>
                            <span class="access-duration">/${priceInfo.days} days</span>
                        </div>
                        ${userStatus && userStatus.isExpired ? 
                            `<p class="access-expiry-info"><i class="fas fa-clock"></i> Access expired</p>` : 
                            userStatus && userStatus.remainingDays ? 
                            `<p class="access-expiry-info"><i class="fas fa-clock"></i> ${userStatus.remainingDays} days remaining</p>` : 
                            ''}
                    </div>
                    
                    <div class="access-form-container">
                        <form id="access-purchase-form" class="access-form">
                            <input type="hidden" name="resource_id" value="${resourceId}">
                            <input type="hidden" name="resource_title" value="${title}">
                            <input type="hidden" name="resource_price" value="${priceInfo.currency}${priceInfo.basePrice}">
                            <input type="hidden" name="resource_duration" value="${priceInfo.days} days">
                            <input type="hidden" name="action_type" value="${isRenewal ? 'renew' : 'purchase'}">
                            
                            <div class="form-group">
                                <label for="user_name"><i class="fas fa-user"></i> Full Name</label>
                                <input type="text" id="user_name" name="name" 
                                       value="${currentUser.name || ''}" 
                                       required placeholder="Your full name">
                            </div>
                            
                            <div class="form-group">
                                <label for="user_email"><i class="fas fa-envelope"></i> Email Address</label>
                                <input type="email" id="user_email" name="email" 
                                       value="${currentUser.email || ''}" 
                                       required placeholder="Your email address">
                            </div>
                            
                            <div class="form-group">
                                <label for="user_phone"><i class="fas fa-phone"></i> Phone Number</label>
                                <input type="tel" id="user_phone" name="phone" 
                                       value="${currentUser.phone || ''}" 
                                       placeholder="Your phone number (optional)">
                            </div>
                            
                            <div class="form-group">
                                <label for="user_message"><i class="fas fa-comment"></i> Message</label>
                                <textarea id="user_message" name="message" rows="3" 
                                          placeholder="Any additional notes or requests...">I would like to ${isRenewal ? 'renew' : 'purchase'} access to "${title}" for ${priceInfo.currency}${priceInfo.basePrice} (${priceInfo.days} days).</textarea>
                            </div>
                            
                            <div class="form-submit-area">
                                <button type="submit" class="access-btn-primary submit-btn">
                                    <i class="fas fa-paper-plane"></i> SEND PURCHASE REQUEST
                                </button>
                                <div class="form-loading">
                                    <i class="fas fa-spinner fa-spin"></i> Sending request...
                                </div>
                                <div class="form-success">
                                    <i class="fas fa-check-circle"></i> Request sent successfully!
                                </div>
                                <div class="form-error">
                                    <i class="fas fa-exclamation-circle"></i> Error sending request. Please try again.
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="access-popup-footer">
                    <button class="access-btn-secondary close-popup">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Initialize form state - hide all status messages initially
        const form = popup.querySelector('#access-purchase-form');
        const loadingEl = form.querySelector('.form-loading');
        const successEl = form.querySelector('.form-success');
        const errorEl = form.querySelector('.form-error');
        
        loadingEl.style.display = 'none';
        successEl.style.display = 'none';
        errorEl.style.display = 'none';
        
        // Add form submit handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitFormspreeRequest(form, resourceId, title, isRenewal);
        });
        
        // Add event listeners
        popup.querySelector('.access-popup-close').addEventListener('click', () => popup.remove());
        popup.querySelector('.access-popup-overlay').addEventListener('click', () => popup.remove());
        popup.querySelector('.close-popup').addEventListener('click', () => popup.remove());
        
        // Close on Escape
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                popup.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }

    // Get current user info (from RX-ACESS-MANAGER.js)
    function getCurrentUserInfo() {
        try {
            if (window.RXUserData && typeof window.RXUserData.getCurrentUser === 'function') {
                const user = window.RXUserData.getCurrentUser();
                if (user) {
                    return {
                        name: user.name || user.username || '',
                        email: user.email || '',
                        phone: user.phone || ''
                    };
                }
            }
            
            // Fallback to localStorage
            return {
                name: localStorage.getItem('rxUserName') || '',
                email: localStorage.getItem('rxUserEmail') || '',
                phone: localStorage.getItem('rxUserPhone') || ''
            };
        } catch (e) {
            console.warn('Error getting user info:', e);
            return { name: '', email: '', phone: '' };
        }
    }

    // Submit Formspree request (from RX-ACESS-MANAGER.js)
    function submitFormspreeRequest(form, resourceId, title, isRenewal) {
        const submitBtn = form.querySelector('.submit-btn');
        const loadingEl = form.querySelector('.form-loading');
        const successEl = form.querySelector('.form-success');
        const errorEl = form.querySelector('.form-error');
        
        // Hide all states first
        submitBtn.style.display = 'none';
        loadingEl.style.display = 'none';
        successEl.style.display = 'none';
        errorEl.style.display = 'none';
        
        // Show loading state
        loadingEl.style.display = 'flex';
        
        // Collect form data
        const formData = new FormData(form);
        
        // Add timestamp and user ID
        formData.append('timestamp', new Date().toISOString());
        if (currentUserId) {
            formData.append('user_id', currentUserId);
        }
        
        // Send to Formspree
        fetch(FORMPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                loadingEl.style.display = 'none';
                successEl.style.display = 'flex';
                
                // Show notification with custom color
                showNotificationMessage(
                    '✅ Request sent successfully! We will contact you shortly.',
                    '#28a745' // Green color
                );
                
                // Auto-close popup after 3 seconds
                setTimeout(() => {
                    const popup = document.getElementById('access-purchase-popup');
                    if (popup) popup.remove();
                }, 3000);
                
                // Reset form
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Formspree submission error:', error);
            
            // Show error message
            loadingEl.style.display = 'none';
            errorEl.style.display = 'flex';
            submitBtn.style.display = 'flex';
            
            // Show error notification with custom color
            showNotificationMessage(
                '❌ Failed to send request. Please try again.',
                '#dc3545' // Red color
            );
        });
    }

    // Show notification message with custom color (from RX-ACESS-MANAGER.js)
    function showNotificationMessage(message, color) {
        // Remove existing notification
        const existingNotification = document.querySelector('.rx-notification');
        if (existingNotification) existingNotification.remove();
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'rx-notification';
        notification.innerHTML = `
            <div class="rx-notification-content">
                <span class="rx-notification-text">${message}</span>
                <button class="rx-notification-close">&times;</button>
            </div>
        `;
        
        // Apply custom color
        notification.style.backgroundColor = color;
        
        document.body.appendChild(notification);
        
        // Add close button event
        notification.querySelector('.rx-notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Inject CSS styles (from RX-ACESS-MANAGER.js)
    function injectStyles() {
        if (document.getElementById('access-manager-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'access-manager-styles';
        
        styles.textContent = `
            /* RX Access Manager Styles */
            .access-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 4px 10px;
                background: #667eea;
                color: white;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                z-index: 10;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .access-price-tag {
                position: absolute;
                bottom: 60px;
                right: 15px;
                background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 4px;
                box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
                z-index: 10;
            }
            
            .access-price {
                font-size: 16px;
            }
            
            .access-duration {
                font-size: 12px;
                opacity: 0.9;
            }
            
            /* Button Styles */
            .access-btn {
                padding: 10px 20px !important;
                border: none !important;
                border-radius: 6px !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 8px !important;
                transition: all 0.3s ease !important;
                text-decoration: none !important;
                margin-left: auto !important;
            }
            
            .access-login-btn {
                background: linear-gradient(135deg, #4cc9f0 0%, #64ffda 100%) !important;
                color: #333 !important;
            }
            
            .access-login-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 5px 15px rgba(76, 201, 240, 0.3) !important;
            }
            
            .access-open-btn {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
                color: white !important;
            }
            
            .access-open-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3) !important;
            }
            
            .access-purchase-btn {
                background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%) !important;
                color: white !important;
            }
            
            .access-purchase-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3) !important;
            }
            
            .access-renew-btn {
                background: linear-gradient(135deg, #6b6bff 0%, #8e53ff 100%) !important;
                color: white !important;
            }
            
            .access-renew-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 5px 15px rgba(107, 107, 255, 0.3) !important;
            }
            
            /* Popup Styles - Responsive */
            .access-popup {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                z-index: 99999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                animation: accessFadeIn 0.3s ease !important;
                padding: 15px !important;
                box-sizing: border-box !important;
            }
            
            @keyframes accessFadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .access-popup-overlay {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0, 0, 0, 0.7) !important;
                backdrop-filter: blur(5px) !important;
            }
            
            .access-popup-container {
                position: relative !important;
                background: white !important;
                border-radius: 12px !important;
                width: 100% !important;
                max-width: 500px !important;
                max-height: 90vh !important;
                overflow-y: auto !important;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
                z-index: 10 !important;
            }
            
            .access-popup-header {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                padding: 20px !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                border-radius: 12px 12px 0 0 !important;
            }
            
            .access-popup-header h3 {
                margin: 0 !important;
                font-size: 18px !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
            }
            
            .access-popup-close {
                background: none !important;
                border: none !important;
                color: white !important;
                font-size: 28px !important;
                cursor: pointer !important;
                line-height: 1 !important;
                padding: 0 !important;
                width: 30px !important;
                height: 30px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                border-radius: 50% !important;
                transition: background 0.2s !important;
                flex-shrink: 0 !important;
            }
            
            .access-popup-close:hover {
                background: rgba(255, 255, 255, 0.2) !important;
            }
            
            .access-popup-body {
                padding: 20px !important;
            }
            
            .access-resource-info {
                text-align: center !important;
                margin-bottom: 20px !important;
                padding-bottom: 20px !important;
                border-bottom: 1px solid #eee !important;
            }
            
            .access-resource-info h4 {
                margin: 0 0 15px 0 !important;
                color: #333 !important;
                font-size: 20px !important;
                word-wrap: break-word !important;
            }
            
            .access-price-display {
                display: inline-flex !important;
                align-items: baseline !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                padding: 10px 20px !important;
                border-radius: 50px !important;
                margin-top: 10px !important;
                flex-wrap: wrap !important;
                justify-content: center !important;
            }
            
            .access-price-large {
                font-size: 28px !important;
                font-weight: 700 !important;
            }
            
            .access-expiry-info {
                color: #ff6b6b !important;
                font-weight: 600 !important;
                margin-top: 10px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 8px !important;
                font-size: 14px !important;
            }
            
            /* Form Styles */
            .access-form-container {
                margin-top: 20px !important;
            }
            
            .access-form {
                background: #f8f9fa !important;
                padding: 20px !important;
                border-radius: 8px !important;
                border: 1px solid #e9ecef !important;
            }
            
            .form-group {
                margin-bottom: 16px !important;
            }
            
            .form-group label {
                display: block !important;
                margin-bottom: 6px !important;
                color: #555 !important;
                font-weight: 600 !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                font-size: 14px !important;
            }
            
            .form-group input,
            .form-group textarea {
                width: 100% !important;
                padding: 12px !important;
                border: 2px solid #e9ecef !important;
                border-radius: 6px !important;
                font-size: 14px !important;
                transition: all 0.3s !important;
                box-sizing: border-box !important;
                font-family: inherit !important;
            }
            
            .form-group input:focus,
            .form-group textarea:focus {
                outline: none !important;
                border-color: #667eea !important;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            }
            
            .form-submit-area {
                margin-top: 20px !important;
                text-align: center !important;
                position: relative !important;
                min-height: 50px !important;
            }
            
            .form-loading,
            .form-success,
            .form-error {
                padding: 12px !important;
                border-radius: 6px !important;
                margin-top: 10px !important;
                font-weight: 600 !important;
                display: none !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 10px !important;
                font-size: 14px !important;
            }
            
            .form-loading {
                background: #fff3cd !important;
                color: #856404 !important;
            }
            
            .form-success {
                background: #d4edda !important;
                color: #155724 !important;
            }
            
            .form-error {
                background: #f8d7da !important;
                color: #721c24 !important;
            }
            
            .access-popup-footer {
                display: flex !important;
                gap: 15px !important;
                padding: 20px !important;
                border-top: 1px solid #eee !important;
            }
            
            .access-btn-primary, .access-btn-secondary {
                flex: 1 !important;
                padding: 14px !important;
                border: none !important;
                border-radius: 8px !important;
                font-size: 16px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 10px !important;
                text-decoration: none !important;
                transition: all 0.3s !important;
                min-height: 48px !important;
            }
            
            .access-btn-primary {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
                color: white !important;
            }
            
            .access-btn-primary:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3) !important;
            }
            
            .access-btn-secondary {
                background: #f8f9fa !important;
                color: #666 !important;
                border: 2px solid #e9ecef !important;
            }
            
            .access-btn-secondary:hover {
                background: #e9ecef !important;
            }
            
            /* Notification Styles */
            .rx-notification {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                max-width: 400px !important;
                background: #28a745 !important;
                color: white !important;
                border-radius: 8px !important;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2) !important;
                z-index: 100000 !important;
                transform: translateY(100px) !important;
                opacity: 0 !important;
                transition: all 0.3s ease !important;
                overflow: hidden !important;
            }
            
            .rx-notification.show {
                transform: translateY(0) !important;
                opacity: 1 !important;
            }
            
            .rx-notification-content {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 16px 20px !important;
            }
            
            .rx-notification-text {
                font-size: 14px !important;
                font-weight: 500 !important;
                line-height: 1.4 !important;
                flex: 1 !important;
                margin-right: 15px !important;
            }
            
            .rx-notification-close {
                background: none !important;
                border: none !important;
                color: white !important;
                font-size: 24px !important;
                cursor: pointer !important;
                line-height: 1 !important;
                padding: 0 !important;
                width: 24px !important;
                height: 24px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                border-radius: 50% !important;
                transition: background 0.2s !important;
                flex-shrink: 0 !important;
            }
            
            .rx-notification-close:hover {
                background: rgba(255, 255, 255, 0.2) !important;
            }
            
            /* Ensure cards are positioned relative */
            .question-card {
                position: relative !important;
            }
            
            /* Hide original buttons */
            .card-footer .btn-view {
                display: none !important;
            }
            
            /* Responsive Design */
            @media (max-width: 768px) {
                .access-popup {
                    padding: 10px !important;
                }
                
                .access-popup-header {
                    padding: 16px !important;
                }
                
                .access-popup-header h3 {
                    font-size: 16px !important;
                }
                
                .access-popup-body {
                    padding: 16px !important;
                }
                
                .access-resource-info h4 {
                    font-size: 18px !important;
                }
                
                .access-price-large {
                    font-size: 24px !important;
                }
                
                .access-form {
                    padding: 16px !important;
                }
                
                .access-btn-primary, .access-btn-secondary {
                    font-size: 14px !important;
                    padding: 12px !important;
                    min-height: 44px !important;
                }
                
                .access-popup-footer {
                    padding: 16px !important;
                }
                
                .rx-notification {
                    bottom: 10px !important;
                    right: 10px !important;
                    left: 10px !important;
                    max-width: none !important;
                }
                
                .rx-notification-content {
                    padding: 14px 16px !important;
                }
                
                .rx-notification-text {
                    font-size: 13px !important;
                }
                
                .access-badge {
                    font-size: 10px !important;
                    padding: 3px 8px !important;
                }
                
                .access-price-tag {
                    bottom: 50px !important;
                    right: 10px !important;
                    padding: 4px 8px !important;
                    font-size: 12px !important;
                }
                
                .access-btn {
                    padding: 8px 16px !important;
                    font-size: 12px !important;
                }
            }
            
            @media (max-width: 480px) {
                .access-popup-header h3 {
                    font-size: 15px !important;
                }
                
                .access-resource-info h4 {
                    font-size: 16px !important;
                }
                
                .access-price-display {
                    padding: 8px 16px !important;
                }
                
                .access-price-large {
                    font-size: 22px !important;
                }
                
                .access-form {
                    padding: 12px !important;
                }
                
                .form-group input,
                .form-group textarea {
                    padding: 10px !important;
                    font-size: 13px !important;
                }
                
                .access-btn-primary, .access-btn-secondary {
                    font-size: 13px !important;
                    padding: 10px !important;
                }
                
                .rx-notification {
                    bottom: 10px !important;
                    left: 10px !important;
                    right: 10px !important;
                }
            }
        `;
        
        document.head.appendChild(styles);
        console.log('RX Access Manager: Styles injected');
    }

    // Grant access function (from RX-ACESS-MANAGER.js)
    function grantAccess(userId, resourceId, price, durationDays) {
        if (!accessConfig[userId]) {
            accessConfig[userId] = {
                accessType: 'mixed',
                resources: {}
            };
        }
        
        // If renewing, add days to existing expiry
        let expiresDays = durationDays;
        const existingAccess = accessConfig[userId]?.resources[resourceId];
        if (existingAccess && existingAccess.expiresDays) {
            const remainingDays = getRemainingDays(userId, resourceId);
            expiresDays = (remainingDays > 0 ? remainingDays : 0) + durationDays;
        }
        
        accessConfig[userId].resources[resourceId] = {
            purchased: new Date().toISOString().split('T')[0],
            price: price,
            expiresDays: expiresDays
        };
        
        saveToLocalStorage();
        forceUpdateCards();
        return true;
    }

    // Refresh login state (from RX-ACESS-MANAGER.js)
    function refreshLoginState() {
        console.log('RX Access Manager: Manually refreshing login state');
        currentUserId = getCurrentUserId();
        forceUpdateCards();
    }

    // ==================== INITIALIZATION ====================

    // Auto-initialize with proper timing (from RX-ACESS-MANAGER.js)
    function initializeAccessManager() {
        console.log('RX Access Manager: Starting initialization...');
        
        // First, check if we're on a page that needs access control
        const isResourcePage = window.location.pathname.includes('Resource.html') || 
                              window.location.pathname.includes('Dashboard.html');
        
        if (!isResourcePage) {
            console.log('RX Access Manager: Not a resource page, skipping');
            return;
        }
        
        // Initialize after all scripts are loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => RXCompleteManager.init(), 1500);
            });
        } else {
            setTimeout(() => RXCompleteManager.init(), 1500);
        }
    }

    // ==================== PUBLIC API ====================
    return {
        // From RX-WEB-RESOURCE.js
        checkLoginStatus: checkLoginStatus,
        handleLogout: handleLogout,
        showQuestionBank: showQuestionBank,
        showLoginScreen: showLoginScreen,
        updateSidePanelUser: updateSidePanelUser,
        renderQuestions: renderQuestions,
        checkScrollPosition: checkScrollPosition,
        showMessage: showMessage,
        
        // From RX-ACESS-MANAGER.js
        init: init,
        hasAccess: hasAccess,
        getUserResourceStatus: getUserResourceStatus,
        getResourcePrice: getResourcePrice,
        showPurchasePopup: showFormspreePopup,
        grantAccess: grantAccess,
        forceUpdate: forceUpdateCards,
        refreshLoginState: refreshLoginState,
        getCurrentUserId: getCurrentUserId,
        getRemainingDays: getRemainingDays,
        showNotification: showNotificationMessage
    };
})();

// Start initialization
(function() {
    console.log('RX Complete Manager: Script loaded and ready');
    
    // Check if we're on a page that needs access control
    const isResourcePage = window.location.pathname.includes('Resource.html') || 
                          window.location.pathname.includes('Dashboard.html') ||
                          document.getElementById('question-grid') !== null;
    
    if (isResourcePage) {
        // Initialize after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => RXCompleteManager.init(), 1000);
                // Also run checkLoginStatus from the resource manager
                setTimeout(() => RXCompleteManager.checkLoginStatus(), 500);
            });
        } else {
            setTimeout(() => RXCompleteManager.init(), 1000);
            setTimeout(() => RXCompleteManager.checkLoginStatus(), 500);
        }
    }
})();

// Make globally available with both names for compatibility
window.RXCompleteManager = RXCompleteManager;
window.RXAccessManager = RXCompleteManager; // For backward compatibility