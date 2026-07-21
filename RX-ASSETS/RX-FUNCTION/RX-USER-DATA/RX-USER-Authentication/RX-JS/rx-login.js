// ===== rx-login.js ===== //
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const auth = window._rxAuth;
        if (!auth) return;

        const el = auth.elements;

        async function performLoginAction() {
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
                const response = await fetch('https://rosan-xettri.onrender.com/api/login', {
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
                auth.setStatus(el.loginStatus, 'Server Connection Failed!', 'error');
            }
        }

        if (el.loginBtn) el.loginBtn.addEventListener('click', performLoginAction);
        if (el.loginPassword) el.loginPassword.addEventListener('keypress', e => { if (e.key === 'Enter') performLoginAction(); });
        if (el.loginEmail) el.loginEmail.addEventListener('keypress', e => { if (e.key === 'Enter') performLoginAction(); });
    });
})();