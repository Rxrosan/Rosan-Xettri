// ===== rx-registration.js ===== //
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        // Core global namespace check
        const auth = window._rxAuth;
        if (!auth) return;

        const el = auth.elements;


        if (el.regDOB) {
            const todayObj = new Date();
            const maxYear = todayObj.getFullYear() - 18;
            const month = String(todayObj.getMonth() + 1).padStart(2, '0');
            const day = String(todayObj.getDate()).padStart(2, '0');
            
            // क्यालेन्डरमा १८ वर्ष पुग्ने अधिकतम र सन् १९०० को न्यूनतम सीमा तोक्ने
            el.regDOB.max = `${maxYear}-${month}-${day}`;
            el.regDOB.min = "1900-01-01";
        }

        /**
         * २. अकाउन्ट क्रिएट बटन इभेन्ट (Form Submission & Validation)
         */
        if (el.createAccountBtn) {
            el.createAccountBtn.addEventListener('click', function() {
                // इनपुट भ्यालुहरू तान्ने र खाली ठाउँ हटाउने
                const name = el.regName.value.trim();
                const email = el.regEmail.value.trim();
                const address = el.regAddress.value.trim();
                const phone = el.regPhone.value.trim();
                const dob = el.regDOB ? el.regDOB.value : ''; 
                const password = el.regPassword.value.trim();

                // क) सबै फिल्डहरू भरिएको हुनुपर्ने भ्यालिडेसन
                if (!name || !email || !address || !phone || !dob || !password) {
                    auth.setStatus(el.createStatus, 'Please fill in all fields.', 'error');
                    return;
                }
                
                // ख) Reasonable Date Validation (अवैध वर्ष जस्तै ०२०० वा १९०० भन्दा पुरानो रोक्ने)
                const birthDate = new Date(dob);
                const birthYear = birthDate.getFullYear();
                const today = new Date();
                const currentYear = today.getFullYear();

                if (isNaN(birthDate.getTime()) || birthYear < 1900 || birthDate > today) {
                    auth.setStatus(el.createStatus, 'Please enter valid date of birth.', 'error');
                    return;
                }

                // ग) उमेर भ्यालिडेसन (कम्तीमा १८ वर्ष पुगेको हुनुपर्ने सटीक हिसाब)
                let age = currentYear - birthYear;
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age < 18) {
                    auth.setStatus(el.createStatus, 'You must be at least 18 years old to register.', 'error');
                    return;
                }

                // घ) अन्य सामान्य फिल्ड भ्यालिडेसनहरू
                if (name.length < 2) {
                    auth.setStatus(el.createStatus, 'Name must be at least 2 characters.', 'error');
                    return;
                }
                if (!email.includes('@') || !email.includes('.')) {
                    auth.setStatus(el.createStatus, 'Please enter a valid email address.', 'error');
                    return;
                }
                if (phone.length < 10) {
                    auth.setStatus(el.createStatus, 'Please enter a valid phone number.', 'error');
                    return;
                }
                if (auth.registeredUsers.some(u => u.email === email)) {
                    auth.setStatus(el.createStatus, 'Email already registered.', 'error');
                    return;
                }
                if (password.length < 6) {
                    auth.setStatus(el.createStatus, 'Password must be at least 6 characters.', 'error');
                    return;
                }

                // सबै कुरा सही भएमा डाटालाई टेम्पोररि सेभ गर्ने र कन्फर्म पपअप खोल्ने
                auth.tempRegistration = { name, email, address, phone, dob, password };
                el.confirmPopup.classList.add('active');
                
                // 🔒 पपअप खुल्दा ब्याकग्राउन्ड स्क्रोल लक गर्ने क्लास थप्ने
                document.body.classList.add('no-scroll');

                el.popupPassword.value = '';
                el.popupStatus.style.display = 'none';
                auth.savePageState(); 
            });
        }

        /**
         * ३. पपअप भित्रको कन्फर्म बटन इभेन्ट (Final Database Saving)
         */
        if (el.popupConfirmBtn) {
            el.popupConfirmBtn.addEventListener('click', function() {
                const confirmPass = el.popupPassword.value.trim();
                
                if (!auth.tempRegistration) {
                    auth.setStatus(el.popupStatus, 'Error: No registration data found.', 'error');
                    return;
                }
                if (!confirmPass) {
                    auth.setStatus(el.popupStatus, 'Please re-enter your password.', 'error');
                    return;
                }
                if (confirmPass !== auth.tempRegistration.password) {
                    auth.setStatus(el.popupStatus, 'Password mismatch!', 'error');
                    return;
                }

                // नयाँ युजर अब्जेक्ट (जसमा DOB पनि समावेश छ)
                const newUser = {
                    name: auth.tempRegistration.name,
                    email: auth.tempRegistration.email,
                    address: auth.tempRegistration.address,
                    phone: auth.tempRegistration.phone,
                    dob: auth.tempRegistration.dob, 
                    password: auth.tempRegistration.password,
                    role: 'user',
                    createdAt: new Date().toISOString()
                };

                // लोकल स्टोरेज (Database) मा सेभ गर्ने
                auth.registeredUsers.push(newUser);
                localStorage.setItem('rxUsers', JSON.stringify(auth.registeredUsers));
                auth.setStatus(el.popupStatus, 'Account created successfully!', 'success');

                // सफल भएपछि लगइन पेजमा लैजाने र फारम क्लियर गर्ने
                setTimeout(function() {
                    auth.closeConfirmPopup(); // यसले ब्याकग्राउन्ड स्क्रोल स्वतः फिक्स गर्छ (`no-scroll` हटाउँछ)
                    auth.showPage('loginSection');
                    
                    el.loginEmail.value = newUser.email;
                    el.loginPassword.value = '';
                    auth.setStatus(el.loginStatus, 'Account created! Please login.', 'success');
                    
                    // क्रिएट अकाउन्ट फारम पूर्ण क्लियर
                    el.regName.value = '';
                    el.regEmail.value = '';
                    el.regAddress.value = '';
                    el.regPhone.value = '';
                    if (el.regDOB) el.regDOB.value = ''; 
                    el.regPassword.value = '';
                    sessionStorage.removeItem('rxPageState');
                }, 1500);
            });
        }

        /**
         * ४. पपअप भित्र इन्टर की (Enter key) थिच्दा पनि सबमिट हुने लजिक
         */
        if (el.popupPassword) {
            el.popupPassword.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') el.popupConfirmBtn.click();
            });
        }
    });
})();