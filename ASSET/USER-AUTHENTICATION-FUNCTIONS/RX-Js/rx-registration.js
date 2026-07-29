// ===== rx-registration.js (Complete Working Code) ===== //
(function() {
    'use strict';

    if (window._rxRegistrationInitialized) return;
    window._rxRegistrationInitialized = true;

    document.addEventListener('DOMContentLoaded', function() {
        const auth = window._rxAuth;
        if (!auth) return;

        document.addEventListener('click', async function(e) {
            const el = auth.elements;

            // Date max config check
            const regDOBElement = document.getElementById('regDOB');
            if (regDOBElement && !regDOBElement.max) {
                const todayObj = new Date();
                const maxYear = todayObj.getFullYear() - 18;
                const month = String(todayObj.getMonth() + 1).padStart(2, '0');
                const day = String(todayObj.getDate()).padStart(2, '0');
                regDOBElement.max = `${maxYear}-${month}-${day}`;
                regDOBElement.min = "1900-01-01";
            }

            // ===== CREATE ACCOUNT BUTTON CLICK ===== //
            if (e.target && e.target.id === 'createAccountBtn') {
                e.preventDefault();

                const name = el.regName ? el.regName.value.trim() : '';
                const email = el.regEmail ? el.regEmail.value.trim() : '';
                const address = el.regAddress ? el.regAddress.value.trim() : '';
                const phone = el.regPhone ? el.regPhone.value.trim() : '';
                const dob = el.regDOB ? el.regDOB.value : ''; 
                const password = el.regPassword ? el.regPassword.value.trim() : '';

                if (!name || !email || !address || !phone || !dob || !password) {
                    auth.setStatus(el.createStatus, 'Please fill in all fields.', 'error');
                    return;
                }
                
                const birthDate = new Date(dob);
                const birthYear = birthDate.getFullYear();
                const today = new Date();
                const currentYear = today.getFullYear();

                if (isNaN(birthDate.getTime()) || birthYear < 1900 || birthDate > today) {
                    auth.setStatus(el.createStatus, 'Please enter valid date of birth.', 'error');
                    return;
                }

                let age = currentYear - birthYear;
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age < 18) {
                    auth.setStatus(el.createStatus, 'You must be at least 18 years old to register.', 'error');
                    return;
                }

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
                if (password.length < 6) {
                    auth.setStatus(el.createStatus, 'Password must be at least 6 characters.', 'error');
                    return;
                }

                auth.tempRegistration = { name, email, address, phone, dob, password };
                
                if (el.confirmPopup) {
                    el.confirmPopup.classList.add('active');
                    document.body.classList.add('no-scroll');
                }

                if (el.popupPassword) el.popupPassword.value = '';
                if (el.popupStatus) {
                    el.popupStatus.style.display = 'none';
                    el.popupStatus.textContent = '';
                }
                
                if (typeof auth.syncPasswordToggles === 'function') {
                    auth.syncPasswordToggles();
                }
                
                auth.savePageState();
            }

            // ===== POPUP CONFIRM BUTTON CLICK ===== //
            if (e.target && e.target.id === 'popupConfirmBtn') {
                e.preventDefault();

                try {
                    const confirmPass = el.popupPassword ? el.popupPassword.value.trim() : '';
                    
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

                    const newUser = {
                        name: auth.tempRegistration.name,
                        email: auth.tempRegistration.email,
                        address: auth.tempRegistration.address,
                        phone: auth.tempRegistration.phone,
                        dob: auth.tempRegistration.dob, 
                        password: auth.tempRegistration.password,
                        role: 'user'
                    };

                    auth.setStatus(el.popupStatus, 'Processing registration...', 'info');

                    const response = await fetch('https://rx-backend-95ow.onrender.com/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newUser)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        auth.setStatus(el.popupStatus, 'Account created successfully!', 'success');

                        setTimeout(function() {
                            auth.closeConfirmPopup();
                            auth.showPage('loginSection');
                            
                            if (el.loginEmail) el.loginEmail.value = newUser.email;
                            if (el.loginPassword) el.loginPassword.value = '';
                            auth.setStatus(auth.elements.loginStatus, 'Account created! Please login.', 'success');
                            
                            if (el.regName) el.regName.value = '';
                            if (el.regEmail) el.regEmail.value = '';
                            if (el.regAddress) el.regAddress.value = '';
                            if (el.regPhone) el.regPhone.value = '';
                            if (el.regDOB) el.regDOB.value = ''; 
                            if (el.regPassword) el.regPassword.value = '';
                            sessionStorage.removeItem('rxPageState');
                        }, 1500);
                    } else {
                        auth.setStatus(el.popupStatus, result.error || 'Registration failed.', 'error');
                    }
                } catch (err) {
                    console.error('Registration error:', err);
                    auth.setStatus(el.popupStatus, 'Server Connection Failed.', 'error');
                }
            }

            // ===== POPUP CLOSE BUTTON CLICK ===== //
            if (e.target && e.target.id === 'popupClose') {
                e.preventDefault();
                auth.closeConfirmPopup();
            }
        });

        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target && e.target.id === 'popupPassword') {
                e.preventDefault();
                const confirmBtn = document.getElementById('popupConfirmBtn');
                if (confirmBtn) confirmBtn.click();
            }
        });

        console.log('Registration module initialized');
    });
})();