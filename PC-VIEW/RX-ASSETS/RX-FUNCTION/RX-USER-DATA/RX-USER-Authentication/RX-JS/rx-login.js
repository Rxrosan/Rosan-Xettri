// ===== rx-login.js (Complete Rewrite) ===== //
(function() {
    'use strict';

    if (window._rxLoginInitialized) return;
    window._rxLoginInitialized = true;

    document.addEventListener('DOMContentLoaded', function() {
        const auth = window._rxAuth;
        if (!auth) return;

        const el = auth.elements;

        async function performLoginAction(e) {
            if (e) e.preventDefault();
            
            const email = el.loginEmail.value.trim();
            const password = el.loginPassword.value.trim();

            if (!email || !password) {
                auth.setStatus(el.loginStatus, 'Please fill in all fields.', 'error');
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                auth.setStatus(el.loginStatus, 'Please enter a valid email address.', 'error');
                return;
            }

            try {
                const response = await fetch('https://rx-backend-95ow.onrender.com/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    auth.setStatus(el.loginStatus, 'Login successful!', 'success');
                    auth.currentUser = result.user;
                    sessionStorage.setItem('rxSession', JSON.stringify(result.user));
                    sessionStorage.removeItem('rxPageState');
                    
                    setTimeout(function() {
                        window.location.href = 'User-profile.html';
                    }, 1500);
                } else {
                    auth.setStatus(el.loginStatus, result.error || 'Invalid email or password.', 'error');
                }
            } catch (err) {
                console.error('Login error:', err);
                auth.setStatus(el.loginStatus, 'Server Connection Failed!', 'error');
            }
        }

        // Login button
        if (el.loginBtn) {
            const cleanBtn = auth.cleanButton(el.loginBtn);
            if (cleanBtn) {
                el.loginBtn = cleanBtn;
            }
            el.loginBtn.addEventListener('click', performLoginAction);
        }

        // Enter key on password field
        if (el.loginPassword) {
            const cleanPass = el.loginPassword.cloneNode(true);
            el.loginPassword.parentNode.replaceChild(cleanPass, el.loginPassword);
            el.loginPassword = cleanPass;
            el.loginPassword.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performLoginAction(e);
            });
        }

        // Enter key on email field
        if (el.loginEmail) {
            const cleanEmail = el.loginEmail.cloneNode(true);
            el.loginEmail.parentNode.replaceChild(cleanEmail, el.loginEmail);
            el.loginEmail = cleanEmail;
            el.loginEmail.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performLoginAction(e);
            });
        }

        console.log('Login module initialized');
    });
})();