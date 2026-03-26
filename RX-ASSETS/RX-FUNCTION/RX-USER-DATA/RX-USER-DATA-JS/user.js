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
        access: ["file1", "file2", "file3", "file4","file5"],
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
        access: ["file1", "file2", "file3", "file4"],
        timedAccessConfig: {
            //"file1": { startDate: "2026-03-09", duration: 23 },
           // "file2": { startDate: "2026-03-09", duration: 23 },
        },
        dateOfBirth: "2005-11-17",
    },
    {
        id: "RX-M-01",
        userName: "JIWAN ",
        fullName: "JIWAN SUNAR",
        email: "fuchhayjiwan44@gmail.com",
        image: "ASSET/WEB-SOFTWARE/USER/IMG/ROHIT-KC.jpg",
        phone: "9814499030",
        address: "BANGANGA-10, KAPILVASTU",
        accountType: "MEMBER",
        password: "RX9814499030",
        access: ["file3", "file4"],
        timedAccessConfig: {
            //"file1": { startDate: "2026-03-09", duration: 23 },
           // "file2": { startDate: "2026-03-09", duration: 23 },
        },
        dateOfBirth: "2006-09-08",
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
        title: "F2- KOREAN EXAM PRACTICE - WEB-APP-MODEL-1", 
        description: "You can practice exam every time auto generate new questions randomly.", 
        link: "RX-KR-EXAM-MODEL-1.html?exam=file2", 
        icon: "fas fa-book",
        prices: { default: "Rs. 999/Month" }
    },
    {   
        id: "file3", 
        title: "F3- QR SCANNER", 
        description: "", 
        link: "RX-S-QR.html?exam=file3", 
        icon: "fas fa-pencil",
        prices: { default: "Rs. 100" }
    },
    {   
        id: "file4", 
        title: "F4- TEXT TO IMAGE ", 
        description: "LOGIN PASSWORD = RX2061", 
        link: "RX-IMG-CONVERTER.html?exam=file4", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100" }
    },
    {   
        id: "file5", 
        title: "F5- KOREAN EXAM PRACTICE - WEB-APP-MODEL-2", 
        description: "You can practice exam with set question.", 
        link: "RX-KR-EXAM-MODEL-2.html?exam=file5", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100/set" }
    },
];

// Developer-Managed Stores (Fixed - Cannot be edited)
const stores = [
    {   id: "store_1", 
        name: "LEKHA-PADI", 
        content: ["file1"] },
    {   id: "store_2", 
        name: "EPS-EXAM-QUESTION", 
        content: ["file2","file5"] },
    {   id: "store_3", 
        name: "WEB-SOFTWARE", 
        content: ["file3", "file4"] },
];

// Formspree endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzznawep';

// ===== NOTIFICATION MODULE =====
const NotificationManager = (() => {
    let timeoutId = null;
    
    const showNotification = (title, message, type = "warning", duration = 5000) => {
        // Try to find notification element
        let notification = document.getElementById('guest-notification');
        
        // If notification element doesn't exist, create it
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
            
            // Add styles for notification
            const style = document.createElement('style');
            style.textContent = `
                .guest-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #1a1a2e;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    z-index: 10000;
                    border-left: 4px solid;
                    max-width: 350px;
                }
                .guest-notification.show {
                    transform: translateX(0);
                }
                .guest-notification i {
                    font-size: 24px;
                }
                .notification-content {
                    flex: 1;
                }
                .notification-title {
                    font-weight: bold;
                    margin-bottom: 5px;
                    font-size: 16px;
                }
                .notification-message {
                    font-size: 14px;
                    opacity: 0.9;
                }
                @media (max-width: 480px) {
                    .guest-notification {
                        bottom: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        const icon = notification.querySelector('i');
        const notificationTitle = document.getElementById('notification-title');
        const notificationMessage = document.getElementById('notification-message');

        notification.classList.remove('show');
        notification.style.borderLeftColor = '';

        if (notificationTitle) notificationTitle.textContent = title;
        if (notificationMessage) notificationMessage.textContent = message;

        const colors = {
            warning: '#fbbf24',
            success: '#4ade80',
            info: '#64ffda',
            danger: '#f87171'
        };

        const icons = {
            warning: 'fa-info-circle',
            success: 'fa-check-circle',
            info: 'fa-info-circle',
            danger: 'fa-exclamation-circle'
        };

        if (icon) {
            icon.className = `fas ${icons[type] || 'fa-info-circle'}`;
            icon.style.color = colors[type] || colors.info;
        }
        notification.style.borderLeftColor = colors[type] || colors.info;
        notification.classList.add('show');

        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    };

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

    return { showNotification, hideNotification };
})();

// ===== PAYMENT MODULE =====
const PaymentManager = (() => {
    // Create the payment modal HTML dynamically
    const createPaymentModal = () => {
        if (document.getElementById('rx-payment-modal')) return;

        const modalHTML = `
            <div id="rx-payment-modal" class="rx-modal" style="display: none;">
                <div class="rx-modal-content">
                    <div class="rx-modal-header">
                        <h2 id="rx-modal-title">Purchase Access</h2>
                        <span class="rx-close" onclick="PaymentManager.closeModal()">&times;</span>
                    </div>
                    
                    <div class="rx-modal-body">
                        <form id="rx-payment-form">
                            <input type="hidden" name="_subject" id="rx-form-subject" value="New Purchase Request">
                            <input type="hidden" name="_template" value="table">
                            <input type="hidden" name="_gotcha" style="display:none !important">
                            
                            <div class="rx-section">
                                <h3><i class="fas fa-file-alt"></i> File Information</h3>
                                <div class="rx-form-grid">
                                    <div class="rx-form-group">
                                        <label>File Name</label>
                                        <input type="text" id="rx-file-name" name="file_name" readonly class="rx-auto-field">
                                    </div>
                                    <div class="rx-form-group">
                                        <label>Price</label>
                                        <input type="text" id="rx-file-price" name="file_price" readonly class="rx-auto-field">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="rx-section">
                                <h3><i class="fas fa-user"></i> Your Information</h3>
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
                                </div>
                            </div>
                            
                            <div class="rx-section">
                                <h3><i class="fas fa-exchange-alt"></i> Transaction Details</h3>
                                <div class="rx-form-grid">
                                    <div class="rx-form-group">
                                        <label>Transaction Type</label>
                                        <input type="text" id="rx-transaction-type" name="transaction_type" readonly class="rx-auto-field">
                                    </div>
                                    <div class="rx-form-group">
                                        <label>Date</label>
                                        <input type="text" id="rx-transaction-date" name="transaction_date" readonly class="rx-auto-field">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="rx-section">
                                <h3><i class="fas fa-pencil-alt"></i> Additional Notes</h3>
                                <div class="rx-form-group">
                                    <label for="rx-remark">Remark (Optional)</label>
                                    <textarea id="rx-remark" name="remark" rows="4" placeholder="Enter any special requests or additional information..."></textarea>
                                </div>
                            </div>
                            
                            <div id="rx-response-message" class="rx-response-message" style="display: none;"></div>
                            
                            <div class="rx-form-actions">
                                <button type="submit" id="rx-submit-btn" class="rx-btn rx-btn-submit">
                                    <i class="fas fa-paper-plane"></i> Submit Request
                                </button>
                                <button type="button" class="rx-btn rx-btn-cancel" onclick="PaymentManager.closeModal()">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add modal styles
        addPaymentStyles();
    };

    // Add payment styles
    const addPaymentStyles = () => {
        if (document.getElementById('rx-payment-styles')) return;

        const style = document.createElement('style');
        style.id = 'rx-payment-styles';
        style.textContent = `
            .rx-modal {
                display: none;
                position: fixed;
                z-index: 999999;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
                animation: rxFadeIn 0.3s ease;
            }

            @keyframes rxFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .rx-modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                color: #fff;
                margin: 20px auto;
                padding: 0;
                border-radius: 20px;
                width: 95%;
                max-width: 700px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: rxSlideIn 0.4s ease;
            }

            @keyframes rxSlideIn {
                from {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .rx-modal-header {
                padding: 25px 30px;
                border-bottom: 2px solid rgba(255, 255, 255, 0.1);
                position: relative;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 20px 20px 0 0;
            }

            .rx-modal-header h2 {
                margin: 0;
                font-size: 1.8rem;
                font-weight: 600;
                color: #fff;
            }

            .rx-close {
                position: absolute;
                right: 25px;
                top: 20px;
                color: #fff;
                font-size: 32px;
                font-weight: bold;
                cursor: pointer;
                opacity: 0.7;
                transition: all 0.3s ease;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
            }

            .rx-close:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }

            .rx-modal-body {
                padding: 30px;
            }

            .rx-section {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 25px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .rx-section h3 {
                margin: 0 0 20px 0;
                font-size: 1.2rem;
                color: #4facfe;
                display: flex;
                align-items: center;
                gap: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 12px;
            }

            .rx-section h3 i {
                font-size: 1.3rem;
                color: #00f2fe;
            }

            .rx-form-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
            }

            .rx-form-group {
                margin-bottom: 15px;
            }

            .rx-form-group label {
                display: block;
                margin-bottom: 8px;
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.85rem;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .rx-form-group input,
            .rx-form-group textarea {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }

            .rx-form-group input:focus,
            .rx-form-group textarea:focus {
                outline: none;
                border-color: #4facfe;
                background: rgba(255, 255, 255, 0.1);
            }

            .rx-form-group input[readonly] {
                background: rgba(255, 255, 255, 0.02);
                border-color: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.7);
                cursor: default;
            }

            .rx-form-group textarea {
                resize: vertical;
                min-height: 100px;
                font-family: inherit;
            }

            .rx-response-message {
                padding: 15px 20px;
                border-radius: 12px;
                margin: 20px 0;
                text-align: center;
                font-weight: 500;
            }

            .rx-response-message.success {
                background: rgba(76, 175, 80, 0.2);
                border: 2px solid #4CAF50;
                color: #fff;
            }

            .rx-response-message.error {
                background: rgba(244, 67, 54, 0.2);
                border: 2px solid #f44336;
                color: #fff;
            }

            .rx-response-message i {
                margin-right: 10px;
                font-size: 1.2rem;
            }

            .rx-form-actions {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }

            .rx-btn {
                flex: 1;
                padding: 15px 20px;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .rx-btn i {
                font-size: 1.1rem;
            }

            .rx-btn-submit {
                background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
                color: #fff;
            }

            .rx-btn-submit:hover:not(:disabled) {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(79, 172, 254, 0.5);
            }

            .rx-btn-submit:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .rx-btn-cancel {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border: 2px solid rgba(255, 255, 255, 0.1);
            }

            .rx-btn-cancel:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: translateY(-3px);
            }

            .fa-spinner {
                animation: rxSpin 1s linear infinite;
            }

            @keyframes rxSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            @media (max-width: 768px) {
                .rx-modal-content {
                    margin: 10px auto;
                    width: 98%;
                }
                .rx-modal-header { padding: 20px; }
                .rx-modal-header h2 { font-size: 1.4rem; }
                .rx-modal-body { padding: 20px; }
                .rx-section { padding: 15px; }
                .rx-form-grid { grid-template-columns: 1fr; }
                .rx-form-actions { flex-direction: column; }
            }
        `;
        document.head.appendChild(style);
    };

    // Get price for user
    const getPriceForUser = (card, user) => {
        if (!card || !card.prices) return "Not for sale";
        if (user && card.prices[user.id]) return card.prices[user.id];
        return card.prices.default || "Contact for price";
    };

    // Format current date
    const getCurrentDate = () => {
        const now = new Date();
        return now.toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Show purchase modal
    const showPurchaseModal = (contentId, isRenewal = false) => {
        createPaymentModal();

        const card = contentCards.find(c => c.id === contentId);
        if (!card) {
            NotificationManager.showNotification("Error", "Content not found!", "danger", 4000);
            return false;
        }

        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) {
            NotificationManager.showNotification("Error", "Please login first!", "warning", 4000);
            return false;
        }

        const modal = document.getElementById('rx-payment-modal');
        const title = document.getElementById('rx-modal-title');
        const fileName = document.getElementById('rx-file-name');
        const filePrice = document.getElementById('rx-file-price');
        const userName = document.getElementById('rx-user-name');
        const userId = document.getElementById('rx-user-id');
        const userEmail = document.getElementById('rx-user-email');
        const userPhone = document.getElementById('rx-user-phone');
        const transactionType = document.getElementById('rx-transaction-type');
        const transactionDate = document.getElementById('rx-transaction-date');
        const remark = document.getElementById('rx-remark');
        const subject = document.getElementById('rx-form-subject');

        const price = getPriceForUser(card, currentUser);

        if (title) title.textContent = isRenewal ? `Renew Access: ${card.title}` : `Purchase Access: ${card.title}`;
        if (fileName) fileName.value = card.title;
        if (filePrice) filePrice.value = price;
        if (userName) userName.value = currentUser.fullName || 'N/A';
        if (userId) userId.value = currentUser.id || 'N/A';
        if (userEmail) userEmail.value = currentUser.email || 'N/A';
        if (userPhone) userPhone.value = currentUser.phone || 'N/A';
        if (transactionType) transactionType.value = isRenewal ? 'Renewal Request' : 'Purchase Request';
        if (transactionDate) transactionDate.value = getCurrentDate();
        if (remark) remark.value = '';
        if (subject) subject.value = `${isRenewal ? 'Renewal' : 'Purchase'} Request - ${card.title} - ${currentUser.userName}`;

        const form = document.getElementById('rx-payment-form');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                await handleFormSubmit(e, card, isRenewal);
            };
        }

        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        return true;
    };

    // Handle form submission
    const handleFormSubmit = async (e, card, isRenewal) => {
        const form = e.target;
        const submitBtn = document.getElementById('rx-submit-btn');
        const responseMessage = document.getElementById('rx-response-message');
        const remark = document.getElementById('rx-remark');
        const currentUser = UserManager.getCurrentUser();

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        if (responseMessage) {
            responseMessage.style.display = 'none';
        }

        try {
            const formData = new FormData(form);
            formData.append('submitted_at', new Date().toISOString());
            formData.append('content_id', card.id);

            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                if (responseMessage) {
                    responseMessage.style.display = 'block';
                    responseMessage.className = 'rx-response-message success';
                    responseMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <strong>Request Sent Successfully!</strong><br>
                        We'll contact you at ${currentUser?.email || 'your email'} within 24 hours.
                    `;
                }
                if (remark) remark.value = '';
                setTimeout(() => closeModal(), 4000);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            if (responseMessage) {
                responseMessage.style.display = 'block';
                responseMessage.className = 'rx-response-message error';
                responseMessage.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <strong>Submission Failed!</strong><br>
                    Please try again or email rkc242855@gmail.com
                `;
            }
        } finally {
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';
                }
            }, 3000);
        }
    };

    // Close modal
    const closeModal = () => {
        const modal = document.getElementById('rx-payment-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    return {
        getPriceForUser,
        showPurchaseModal,
        closeModal
    };
})();

// ===== USER MANAGEMENT MODULE =====
const UserManager = (() => {
    // Create a guest user
    const createGuestUser = () => {
        return {
            id: "GUEST",
            isGuest: true,
            userName: "GUEST",
            fullName: "RX STUDIO",
            email: "-",
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

    // Update UI with user data
    const updateUIWithUserData = (user) => {
        // Check if we're on USER.html page
        const isUserPage = document.getElementById('profileSection') !== null;
        
        if (isUserPage) {
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

        const adminSettingsLink = document.getElementById('admin-settings-link');
        if (adminSettingsLink) {
            adminSettingsLink.style.display = user.accountType === "ADMIN" ? 'flex' : 'none';
        }
        
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

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            if (emailInput) emailInput.value = '';
            if (passwordInput) passwordInput.value = '';

            const loginStatus = document.getElementById('loginStatus');
            if (loginStatus) {
                loginStatus.textContent = 'Login successful!';
                loginStatus.className = 'login-status success';
            }
            
            NotificationManager.showNotification("Welcome Back!", `You have successfully logged in as ${foundUser.fullName}.`, "success");
            return true;
        } else {
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
        NotificationManager.showNotification("Logged Out", "You have been logged out. Please login to access your account.", "warning");
    };

    // Initialize user state
    const initUser = () => {
        let user = getUserData();
        if (!user || user.isGuest) { 
            user = createGuestUser();
            saveUserData(user);
            if (!hasUserLoggedInBefore()) {
                NotificationManager.showNotification("You are logged in as Guest", "To access your real account, please login", "warning");
            }
        } else {
            if (!hasUserLoggedInBefore()) {
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
            NotificationManager.showNotification("Access Denied", "You do not have administrative privileges.", "danger", 4000);
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
                    buttonHtml = `<button class="purchase-btn" onclick="handlePurchaseRequest('${card.id}', true)"><i class="fas fa-envelope"></i> Request Renewal</button>`;
                } else {
                    const price = PaymentManager.getPriceForUser(card, currentUser);
                    detailsHtml = `<p>Purchase to get access.</p><div class="price">${price}</div>`;
                    buttonHtml = `<button class="purchase-btn" onclick="handlePurchaseRequest('${card.id}', false)"><i class="fas fa-shopping-cart"></i> Purchase Access</button>`;
                }
            }
            cardElement.innerHTML = `<i class="${card.icon || 'fas fa-file'} card-icon"></i><h3>${card.title}</h3>${detailsHtml}${!hasAccess ? '<div class="lock-icon"><i class="fas fa-lock"></i></div>' : ''}${buttonHtml}`;
            cardsContainer.appendChild(cardElement);
        });

        startCountdownTimers();
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
        if (!examId || !examUrl) return;
        localStorage.setItem('selectedExamId', examId);
        window.location.href = examUrl;
    };

    const initializeStores = () => {
        if (stores.length > 0 && !currentStoreId) {
            currentStoreId = stores[0].id;
        }
    };

    return {
        initializeStores,
        renderStoreNavigation,
        renderContentCards,
        prepareAndLaunchExam
    };
})();

// Global function to handle purchase requests with guest check
function handlePurchaseRequest(contentId, isRenewal) {
    const currentUser = UserManager.getCurrentUser();
    
    // Check if user is guest
    if (currentUser && (currentUser.isGuest === true || currentUser.id === "GUEST" || currentUser.accountType === "GUEST")) {
        NotificationManager.showNotification(
            "Login Required", 
            "Please login to your personal account to make a purchase. Guest accounts cannot make purchases.", 
            "warning", 
            6000
        );
        return;
    }
    
    // If not guest, show purchase modal
    PaymentManager.showPurchaseModal(contentId, isRenewal);
}

// Global functions for backward compatibility
function requestAccess(contentId, isRenewal) {
    handlePurchaseRequest(contentId, isRenewal);
}

function closeModal() {
    PaymentManager.closeModal();
}

function prepareAndLaunchExam(examId, examUrl) {
    StoreManager.prepareAndLaunchExam(examId, examUrl);
}

// Make functions globally available
window.prepareAndLaunchExam = prepareAndLaunchExam;
window.requestAccess = requestAccess;
window.handlePurchaseRequest = handlePurchaseRequest;
window.closeModal = closeModal;
window.PaymentManager = PaymentManager;
window.UserManager = UserManager;
window.NotificationManager = NotificationManager;
window.AdminPanelManager = AdminPanelManager;
window.StoreManager = StoreManager;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user state
    UserManager.initUser();

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
            
            // Refresh content cards after login
            if (document.getElementById('storeNavigation')) {
                setTimeout(() => StoreManager.renderContentCards(), 100);
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            UserManager.logoutUser();
            
            // Refresh content cards after logout
            if (document.getElementById('storeNavigation')) {
                setTimeout(() => StoreManager.renderContentCards(), 100);
            }
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
            AdminPanelManager.openAdminPanel();
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('rx-modal')) {
            PaymentManager.closeModal();
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