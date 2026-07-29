// ===== rx-login.js ===== //
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        // HTML elements हरू सिधै ID बाट तान्ने
        const loginEmailEl = document.getElementById('loginEmail');
        const loginPasswordEl = document.getElementById('loginPassword');
        const loginBtnEl = document.getElementById('loginBtn');
        const loginStatusEl = document.getElementById('loginStatus');

        // स्टेटस म्यासेज देखाउने फङ्सन
        function setStatus(message, type) {
            if (!loginStatusEl) return;
            loginStatusEl.textContent = message;
            loginStatusEl.className = 'login-status ' + type; // CSS class: error or success
        }

        function performLoginAction() {
            const email = loginEmailEl ? loginEmailEl.value.trim() : '';
            const password = loginPasswordEl ? loginPasswordEl.value.trim() : '';

            // १. इनपुट भ्यालिडेसन
            if (!email || !password) {
                setStatus('Please fill in all fields.', 'error');
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                setStatus('Please enter a valid email address.', 'error');
                return;
            }

            // २. user.js मा भएको allUsers एरे छ कि छैन चेक गर्ने र रीड गर्ने
            if (typeof allUsers === 'undefined' || !Array.isArray(allUsers)) {
                setStatus('System Error: User database (allUsers) not found.', 'error');
                console.error("Error: 'allUsers' array is missing. Make sure user.js is loaded before rx-login.js.");
                return;
            }

            // ३. युजरको ईमेल र पासवर्ड म्याच गराउने
            const user = allUsers.find(u => u.email === email && u.password === password);
            
            if (user) {
                setStatus('Login successful!', 'success');
                
                // ४. प्रोफाइल लोडर (profile-loader.js) लाई खबर गर्नका लागि localStorage मा डेटा सेभ गर्ने
                // यसले प्रोफाइल लोडरले पेज लोड हुने बित्तिकै कुन युजर हो भनेर 'सेन्स' गर्न सक्छ
                localStorage.setItem('loggedInUserEmail', user.email);
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // सेसन ट्र्याकिङका लागि sessionStorage पनि अपडेट गरिदिने
                sessionStorage.setItem('rxSession', JSON.stringify(user));
                sessionStorage.removeItem('rxPageState');
                
                // ५. प्रोफाइल पेजमा रिडाइरेक्ट गर्ने
                setTimeout(function() {
                    window.location.href = 'User-profile.html';
                }, 1500);
            } else {
                setStatus('Invalid email or password.', 'error');
            }
        }

        // इभेन्ट लिसनरहरू (बटन क्लिक र इन्टर की)
        if (loginBtnEl) loginBtnEl.addEventListener('click', performLoginAction);
        if (loginPasswordEl) loginPasswordEl.addEventListener('keypress', e => { if (e.key === 'Enter') performLoginAction(); });
        if (loginEmailEl) loginEmailEl.addEventListener('keypress', e => { if (e.key === 'Enter') performLoginAction(); });
    });
})();