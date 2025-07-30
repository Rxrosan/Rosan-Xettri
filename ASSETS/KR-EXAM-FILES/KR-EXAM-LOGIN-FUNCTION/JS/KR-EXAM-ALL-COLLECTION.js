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
        { id: 1, title: "Question Model 1", content: "Korean Language Test Exam Model - Basic level with easy questions to get you started.", link: "KR-EXAM.html", category: "Basic | 1st Level" },
        { id: 2, title: "Question Model 2", content: "Korean Language Test Exam Model - Basic level with more challenging questions.", link: "KR-EXAM.html", category: "Basic | 3rd Level" },
        { id: 3, title: "Question Model 3", content: "Korean Language Test Exam Model - Basic level with medium difficulty questions.", link: "KR-EXAM.html", category: "Basic | 2nd Level" },
        { id: 4, title: "Question Model 4", content: "Korean Language Test Exam Model - Another basic level set for reinforcement.", link: "KR-EXAM.html", category: "Basic | 1st Level" },
        { id: 5, title: "Question Model 5", content: "Korean Language Test Exam Model - Advance 1-10 LESSON.", link: "KR-EXAM.html", category: "ADVANCE | 1-10 LESSON" }
    ];

    // --- DOM Elements ---
    const questionGrid = document.getElementById('question-grid');
    const profileBtn = document.getElementById('profile-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const profileModal = document.getElementById('profile-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const filterTabs = document.querySelector('.filter-tabs');
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
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto; padding-right: 15px;">${content}</div>
                <button class="modal-close">Close</button>
            </div>
        `;
        // Use querySelector on the new `modal` element to find the close button
        modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
        return modal;
    }

    function showModal(modal) {
        document.body.appendChild(modal);
        void modal.offsetWidth; // Trigger reflow to enable animation
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('visible');
        setTimeout(() => {
            if (modal && modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            document.body.style.overflow = '';
        }, 300); // Match animation duration
    }

    // === Restored Original English Modals As Requested ===
    function showPrivacyPolicy() {
        const content = `
            <p><strong>Last Updated:</strong> [2025/7/30]</p>
            <p>This privacy policy explains how we collect, use, and protect your personal information when you use our website.</p>
            <h4>1. Information We Collect</h4>
            <p>When you log in to our website, we collect the following information:</p>
              <ul>
                <li>Your name</li>
                <li>Phone number</li>
                <li>Access key</li>
              </ul>
            <h4>2. How We Use Information</h4>
             <p>We use the information we collect to:</p>
              <ul>
                <li>Verify your identity for access to the website</li>
                <li>Provide customer support</li>
                <li>Improve our services</li>
              </ul>
                <h4>Data Security</h4>
              <p>We implement appropriate security measures to protect your personal information. Your login details are stored locally in your browser's session storage and are not transmitted to our servers.</p>
              
              <h4>Changes to This Policy</h4>
              <p>We may update this privacy policy from time to time. Any changes will be posted on this page.</p>
        `;
        const modal = createModal('Privacy Policy', content);
        showModal(modal);
    }

    function showTermsOfUse() {
        const content = ` 
        <p><strong>Last Updated:</strong> [2025/7/30]</p>
            <h4>1. Acceptance of Terms</h4>
              <p>By accessing and using this website, you accept and agree to be bound by these Terms of Service.</p>
              
              <h4>1. Account Access</h4>
              <ul>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the confidentiality of your access key</li>
                <li>You are responsible for all activities that occur under your account</li>
              </ul>
              
              <h4>2. Prohibited Activities</h4>
              <p>You agree not to:</p>
              <ul>
                <li>Use the website for any illegal purpose</li>
                <li>Share your access key with others</li>
                <li>Attempt to gain unauthorized access to other accounts</li>
                <li>Disrupt or interfere with the security of the website</li>
              </ul>
              
              <h4>3. Intellectual Property</h4>
              <p>All content on this website, including models, designs, and materials, are the property of Rosan Xettri Studio and are protected by copyright laws.</p>
              
              <h4>4. Termination</h4>
              <p>We may terminate or suspend your access to the website immediately, without prior notice, for any violation of these Terms.</p>
              
              <h4>5. Limitation of Liability</h4>
              <p>Rosan Xettri Studio shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the website.</p>
              
              <h4>6. Changes to Terms</h4>
              <p>We reserve the right to modify these Terms at any time. Your continued use of the website constitutes acceptance of the modified Terms.</p>
        `;
        const modal = createModal('Terms of Use', content);
        showModal(modal);
    }

    function showContactUs() {
        const content = `
            <p>If you have any questions or need support, please reach out to us:</p>
            <ul>
                <li><strong><a href="https://www.facebook.com/Rosan.2061" target="_blank">Facebook page</a></li>
                <li><strong><a href="https://www.facebook.com/Rosan.2061" target="_blank">Facebook</a></li>
                <li><strong><a href="mailto:rosankc820@.com">Gmail</a></li>
                <li><strong><a>Banganga-10, kapilvastu</a></li>
            </ul>
        `;
        const modal = createModal('Contact Us', content);
        showModal(modal);
    }
    
    function createPurchaseModal() {
        const content = `
            <p>To purchase this question model and unlock the test, please contact our support team.</p>
            <div class="payment-details" style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #007bff;">
                <h4>Payment For Contact Details</h4>
                <p><strong><a href="https://www.facebook.com/Rosan.2061" target="_blank">Facebook page</a></p>
                <p><strong><a href="mailto:rosankc820@.com">Gmail</a></p>
            </div>
        `;
        // Note: The createModal function now returns the modal element
        return createModal('Purchase Question Model', content);
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

    // *** This function contains the main change for sessionStorage ***
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
                            ? `<a href="${question.link}" class="btn-action btn-view" data-exam-id="${question.id}">
                                <i class="fas fa-play"></i> Start Test
                              </a>`
                            : `<button class="btn-action btn-purchase" data-question-id="${question.id}">
                                <i class="fas fa-shopping-cart"></i> Purchase
                              </button>`
                        }
                    </div>
                </div>
            `;
            questionGrid.appendChild(card);
        });

        // Event listener for "Start Test" buttons (implements sessionStorage)
        document.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault(); 
                const examId = this.dataset.examId;
                sessionStorage.setItem('selectedExamId', examId);
                window.location.href = this.href;
            });
        });

        // Event listener for "Purchase" buttons
        document.querySelectorAll('.btn-purchase').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = createPurchaseModal();
                showModal(modal);
            });
        });
    }

    // --- Profile Modal and Logout ---
    function showProfileModal() {
        document.getElementById('profile-img').src = currentUser.link;
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-phone').textContent = currentUser.phone;
        document.getElementById('profile-key').textContent = currentUser.key;
        profileModal.classList.add('visible');
    }
    function hideProfileModal() { profileModal.classList.remove('visible'); }
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
        if (e.target.tagName === 'BUTTON' && e.target.classList.contains('tab-btn')) {
            document.querySelector('.tab-btn.active').classList.remove('active');
            e.target.classList.add('active');
            activeFilter = e.target.dataset.filter;
            renderQuestions();
        }
    });

    if (privacyPolicyLink) privacyPolicyLink.addEventListener('click', showPrivacyPolicy);
    if (termsOfUseLink) termsOfUseLink.addEventListener('click', showTermsOfUse);
    if (contactUsLink) contactUsLink.addEventListener('click', showContactUs);

    // --- Initialize ---
    renderQuestions();
});