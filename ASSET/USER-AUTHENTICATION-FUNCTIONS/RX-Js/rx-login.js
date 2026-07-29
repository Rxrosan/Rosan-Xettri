// ===== rx-login.js (Fixed Login & Profile Loader) ===== //
(function() {
    'use strict';

    if (window._rxLoginInitialized) return;
    window._rxLoginInitialized = true;

    document.addEventListener('DOMContentLoaded', function() {
        const auth = window._rxAuth;
        if (!auth) return;

        async function performLoginAction(e) {
            if (e) e.preventDefault();
            
            const el = auth.elements;
            const email = el.loginEmail ? el.loginEmail.value.trim() : '';
            const password = el.loginPassword ? el.loginPassword.value.trim() : '';

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
                        // तपाइँको index.html को मुख्य कन्टेनर आईडी 'rx-display-area' हो, त्यसैले यसलाई पहिलो प्राथमिकता दिइएको छ
                        const displayArea = document.getElementById('rx-display-area') || document.getElementById('rxDisplayArea') || document.body;
                        
                        // यदि rxLoadProfilePage वा rxLoadContent फंक्शन अवस्थित छ भने त्यसलाई कल गर्ने
                        if (typeof window.rxLoadContent === 'function') {
                            window.rxLoadContent('USER PROFILE');
                        } else if (typeof window.rxLoadProfilePage === 'function') {
                            window.rxLoadProfilePage(displayArea);
                        } else if (typeof rxLoadProfilePage === 'function') {
                            rxLoadProfilePage(displayArea);
                        } else {
                            console.warn('rxLoadProfilePage function not found. Please ensure the profile script is loaded.');
                            alert('Login successful! Profile page loader not found.');
                        }
                    }, 1500);
                } else {
                    auth.setStatus(el.loginStatus, result.error || 'Invalid email or password.', 'error');
                }
            } catch (err) {
                console.error('Login error:', err);
                auth.setStatus(el.loginStatus, 'Server Connection Failed!', 'error');
            }
        }

        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'loginBtn') {
                performLoginAction(e);
            }
        });

        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (e.target && (e.target.id === 'loginEmail' || e.target.id === 'loginPassword')) {
                    performLoginAction(e);
                }
            }
        });

        console.log('Login module initialized');
    });
})();