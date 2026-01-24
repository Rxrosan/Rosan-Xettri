        // Configuration
        const PASSWORD = "RXSTUDIO2061";
        const QUESTIONS = [
            {
                id: 1,
                title: "KOREAN LANGUAGE PRACTICE EXAM",
                content: "Korean Language Test Exam Model - all randomly generate exam that for practice",
                link: "KR-EXAM-PC.html",
                category: "SUPPORT | PC / TAB "
            },
            {
                id: 2,
                title: "KOREAN LANGUAGE PRACTICE EXAM",
                content: "Korean Language Test Exam Model - all randomly generate exam that for practice",
                link: "#",
                category: " SUPPORT | MOBILE "
            },
            
           
        ];

        // DOM Elements
        const dom = {
            loginScreen: document.getElementById('login-screen'),
            questionBank: document.getElementById('question-bank'),
            passwordInput: document.getElementById('password-input'),
            loginBtn: document.getElementById('login-btn'),
            loginText: document.getElementById('login-text'),
            loginLoader: document.getElementById('login-loader'),
            errorMessage: document.getElementById('error-message'),
            logoutBtn: document.getElementById('logout-btn'),
            questionGrid: document.getElementById('question-grid'),
            forgotPasswordBtn: document.getElementById('forgot-password'),
            forgotPasswordModal: document.getElementById('forgot-password-modal'),
            closeModalBtn: document.getElementById('close-modal-btn'),
            loginBox: document.querySelector('.login-box'),
            scrollToTopBtn: document.getElementById('scroll-to-top')
        };

        // State
        let state = {
            isAuthenticated: sessionStorage.getItem('isAuthenticated') === 'true'
        };

        // Check authentication status on page load
        document.addEventListener('DOMContentLoaded', function() {
            if (state.isAuthenticated) {
                showQuestionBank();
            } else {
                showLoginScreen();
            }
            
            // Initialize scroll to top button visibility
            checkScrollPosition();
        });

        // Event Listeners
        dom.loginBtn.addEventListener('click', handleLogin);
        dom.logoutBtn.addEventListener('click', handleLogout);
        dom.forgotPasswordBtn.addEventListener('click', showForgotPasswordModal);
        dom.closeModalBtn.addEventListener('click', hideForgotPasswordModal);
        dom.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
        
        // Scroll to top button
        dom.scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', checkScrollPosition);

        // Functions
        async function handleLogin() {
            const password = dom.passwordInput.value.trim();
            
            if (!password) {
                showError("Please enter a password");
                return;
            }
            
            // Show loading state
            dom.loginText.classList.add('hidden');
            dom.loginLoader.classList.remove('hidden');
            dom.loginBtn.disabled = true;
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (password === PASSWORD) {
                state.isAuthenticated = true;
                sessionStorage.setItem('isAuthenticated', 'true');
                showQuestionBank();
            } else {
                showError("Incorrect password. Please try again.");
                dom.passwordInput.value = '';
            }
            
            // Reset button state
            dom.loginText.classList.remove('hidden');
            dom.loginLoader.classList.add('hidden');
            dom.loginBtn.disabled = false;
        }

        function handleLogout() {
            state.isAuthenticated = false;
            sessionStorage.removeItem('isAuthenticated');
            dom.passwordInput.value = '';
            dom.errorMessage.textContent = '';
            dom.errorMessage.classList.add('hidden');
            showLoginScreen();
        }

        function showQuestionBank() {
            dom.errorMessage.classList.add('hidden');
            dom.loginScreen.classList.add('hidden');
            dom.questionBank.classList.remove('hidden');
            
            // Add subtle animation to cards
            const cards = document.querySelectorAll('.question-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
            
            // Focus on first question for better keyboard navigation
            if (cards.length > 0) {
                cards[0].focus();
            }
        }

        function showLoginScreen() {
            dom.loginScreen.classList.remove('hidden');
            dom.questionBank.classList.add('hidden');
            dom.passwordInput.focus();
        }

        function showForgotPasswordModal() {
            dom.forgotPasswordModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function hideForgotPasswordModal() {
            dom.forgotPasswordModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function showError(message) {
            dom.errorMessage.textContent = message;
            dom.errorMessage.classList.remove('hidden');
            
            // Shake animation for error
            dom.loginBox.classList.add('shake');
            setTimeout(() => {
                dom.loginBox.classList.remove('shake');
            }, 500);
        }

        function renderQuestions() {
            dom.questionGrid.innerHTML = '';
            
            QUESTIONS.forEach((question, index) => {
                const card = document.createElement('div');
                card.className = 'question-card';
                card.style.animationDelay = `${index * 0.1}s`;
                card.tabIndex = 0; // Make cards focusable for keyboard navigation
                
                card.innerHTML = `
                    <div class="card-content">
                        <h3>${question.title}</h3>
                        <p>${question.content}</p>
                        <div class="card-footer">
                            <span class="category-badge">${question.category}</span>
                            <a href="${question.link}" class="btn-view">
                                <i class="fas fa-play"></i> Start Test
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
        
        function checkScrollPosition() {
            if (window.scrollY > 300) {
                dom.scrollToTopBtn.classList.remove('hidden');
            } else {
                dom.scrollToTopBtn.classList.add('hidden');
            }
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === dom.forgotPasswordModal) {
                hideForgotPasswordModal();
            }
        });

        // Initialize
        renderQuestions();