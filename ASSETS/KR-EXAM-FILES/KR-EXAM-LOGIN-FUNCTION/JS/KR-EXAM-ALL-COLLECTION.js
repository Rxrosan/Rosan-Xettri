document.addEventListener('DOMContentLoaded', function() {
    // --- User and Auth Management ---
    const loggedInUserPhone = localStorage.getItem('loggedInUserPhone');
    if (!loggedInUserPhone) {
        window.location.href = 'KR-EXAM-ALL-COLLECTION-LOGIN.html';
        return;
    }

    const currentUser = USERS.find(u => u.phone === loggedInUserPhone);
    if (!currentUser) {
        localStorage.removeItem('loggedInUserPhone');
        window.location.href = 'KR-EXAM-ALL-COLLECTION-LOGIN.html';
        return;
    }

    // --- Show the app ---
    document.getElementById('app-root').style.display = 'block';
    
    // --- Configuration ---
    const ALL_QUESTIONS = [
        { id: 1, title: "Question Model 1", content: "Korean Language Test Exam Model - Basic level with easy questions to get you started.", link: "KR-EXAM-QM-1.html", category: "Basic | 1st Level" },
        { id: 2, title: "Question Model 2", content: "Korean Language Test Exam Model - Basic level with more challenging questions.", link: "KR-EXAM-QM-2.html", category: "Basic | 3rd Level" },
        { id: 3, title: "Question Model 3", content: "Korean Language Test Exam Model - Basic level with medium difficulty questions.", link: "KR-EXAM-QM-3.html", category: "Basic | 2nd Level" },
        { id: 4, title: "Question Model 4", content: "Korean Language Test Exam Model - Another basic level set for reinforcement.", link: "KR-EXAM-QM-4.html", category: "Basic | 1st Level" },
        { id: 5, title: "Question Model 5", content: "Korean Language Test Exam Model - Advance 1-10 LESSON.", link: "KR-EXAM-QM-5.html", category: "ADVANCE | 1-10 LESSON" }
    ];

    // --- DOM Elements ---
    const questionGrid = document.getElementById('question-grid');
    const profileBtn = document.getElementById('profile-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const profileModal = document.getElementById('profile-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const filterTabs = document.querySelector('.filter-tabs');
    const appRoot = document.getElementById('app-root');
    const privacyPolicyLink = document.getElementById('privacy-policy-link');
    const termsOfUseLink = document.getElementById('terms-of-use-link');
    const contactUsLink = document.getElementById('contact-us-link');

    let activeFilter = 'all';

    // --- Modal Functions ---
    function createModal(title, content, className = 'modal-content') {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="${className}">
                <h2>${title}</h2>
                <div class="modal-body">
                    ${content}
                </div>
                <button class="modal-close">Close</button>
            </div>
        `;
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                closeModal(modal);
            }
        });
        
        return modal;
    }

    function showModal(modal) {
        document.body.appendChild(modal);
        // Trigger reflow
        void modal.offsetWidth;
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('visible');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            document.body.style.overflow = '';
        }, 300);
    }

    // --- Specific Modal Content ---
    function showPrivacyPolicy() {
        const content = `
            <h3>1. Information We Collect</h3>
            <p>We collect information you provide directly to us...</p>
            <h3>2. How We Use Your Information</h3>
            <p>We use the information we collect to...</p>
        `;
        const modal = createModal('Privacy Policy', content, 'policy-modal-content');
        showModal(modal);
    }

    function showTermsOfUse() {
        const content = `
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing or using our services...</p>
            <h3>2. Account Responsibilities</h3>
            <p>You are responsible for...</p>
        `;
        const modal = createModal('Terms of Use', content, 'policy-modal-content');
        showModal(modal);
    }

    function showContactUs() {
        const content = `
            <div class="contact-links">
                <a href="https://facebook.com/yourpage" target="_blank" class="contact-link facebook">
                    <i class="fab fa-facebook-f"></i> Facebook
                </a>
                <a href="mailto:support@example.com" class="contact-link gmail">
                    <i class="fas fa-envelope"></i> Email
                </a>
            </div>
        `;
        const modal = createModal('Contact Us', content, 'policy-modal-content');
        showModal(modal);
    }

    function createPurchaseModal() {
        const content = `
            <p>To purchase this question bank, please contact our admin team:</p>
            <div class="contact-links">
                <a href="https://facebook.com/yourpage" target="_blank" class="contact-link facebook">
                    <i class="fab fa-facebook-f"></i> Facebook
                </a>
                <a href="mailto:admin@example.com" class="contact-link gmail">
                    <i class="fas fa-envelope"></i> Email
                </a>
            </div>
        `;
        return createModal('Purchase Question', content, 'purchase-modal-content');
    }

    // --- Other Functions ---
    function checkPurchaseExpiry(purchase) {
        if (purchase.purchaseType === 'lifetime') return true;
        
        const purchaseDate = new Date(purchase.purchaseDate);
        const now = new Date();
        let expiryDate = new Date(purchaseDate);

        if (purchase.purchaseType === 'day') {
            expiryDate.setDate(purchaseDate.getDate() + 1);
        } else if (purchase.purchaseType === 'month') {
            expiryDate.setMonth(purchaseDate.getMonth() + 1);
        }
        
        return now < expiryDate;
    }

    function renderQuestions() {
        if (!questionGrid) return;
        questionGrid.innerHTML = '';
        
        const activePurchases = currentUser.purchases.filter(checkPurchaseExpiry);
        const activePurchaseIds = new Set(activePurchases.map(p => p.questionId));
        
        let questionsToRender = activeFilter === 'purchased' 
            ? ALL_QUESTIONS.filter(q => activePurchaseIds.has(q.id)) 
            : ALL_QUESTIONS;
        
        if (questionsToRender.length === 0) {
            questionGrid.innerHTML = `<p class="no-questions">No questions found in this category.</p>`;
            return;
        }

        questionsToRender.forEach(question => {
            const isPurchased = activePurchaseIds.has(question.id);
            const card = document.createElement('div');
            card.className = 'question-card';
            card.innerHTML = `
                <div class="card-content">
                    <h3>${question.title}</h3>
                    <p>${question.content}</p>
                    <div class="card-footer">
                        <span class="category-badge">${question.category}</span>
                        ${isPurchased 
                            ? `<a href="${question.link}" class="btn-action btn-view">
                                <i class="fas fa-play"></i> Start Test
                              </a>`
                            : `<button class="btn-action btn-purchase">
                                <i class="fas fa-shopping-cart"></i> Purchase
                              </button>`
                        }
                    </div>
                </div>
            `;
            questionGrid.appendChild(card);
        });

        // Add purchase button event listeners
        document.querySelectorAll('.btn-purchase').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = createPurchaseModal();
                showModal(modal);
            });
        });
    }

    function showProfileModal() {
        document.getElementById('profile-img').src = currentUser.link;
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-phone').textContent = currentUser.phone;
        document.getElementById('profile-key').textContent = currentUser.key;
        profileModal.classList.add('visible');
    }

    function hideProfileModal() {
        profileModal.classList.remove('visible');
    }

    function logout() {
        localStorage.removeItem('loggedInUserPhone');
        window.location.href = 'KR-EXAM-ALL-COLLECTION-LOGIN.html';
    }

    // --- Event Listeners ---
    profileBtn.addEventListener('click', showProfileModal);
    modalCloseBtn.addEventListener('click', hideProfileModal);
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) hideProfileModal();
    });
    logoutBtn.addEventListener('click', logout);

    filterTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            document.querySelector('.tab-btn.active').classList.remove('active');
            e.target.classList.add('active');
            activeFilter = e.target.dataset.filter;
            renderQuestions();
        }
    });

    privacyPolicyLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showPrivacyPolicy();
    });

    termsOfUseLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showTermsOfUse();
    });

    contactUsLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showContactUs();
    });

    // --- Initialize ---
    renderQuestions();
});