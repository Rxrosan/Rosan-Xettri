// ===== rx-registration.js (Complete Rewrite) ===== //
(function() {
    'use strict';

    // Prevent duplicate initialization
    if (window._rxRegistrationInitialized) return;
    window._rxRegistrationInitialized = true;

    document.addEventListener('DOMContentLoaded', function() {
        const auth = window._rxAuth;
        if (!auth) return;

        const el = auth.elements;

        // Set DOB max date
        if (el.regDOB) {
            const todayObj = new Date();
            const maxYear = todayObj.getFullYear() - 18;
            const month = String(todayObj.getMonth() + 1).padStart(2, '0');
            const day = String(todayObj.getDate()).padStart(2, '0');
            el.regDOB.max = `${maxYear}-${month}-${day}`;
            el.regDOB.min = "1900-01-01";
        }

        // ===== CREATE ACCOUNT BUTTON ===== //
        if (el.createAccountBtn) {
            // Clean all existing listeners
            const cleanBtn = auth.cleanButton(el.createAccountBtn);
            if (cleanBtn) {
                el.createAccountBtn = cleanBtn;
            }

            const createHandler = function(e) {
                e.preventDefault();
                
                if (this._processing) return;
                this._processing = true;

                const name = el.regName ? el.regName.value.trim() : '';
                const email = el.regEmail ? el.regEmail.value.trim() : '';
                const address = el.regAddress ? el.regAddress.value.trim() : '';
                const phone = el.regPhone ? el.regPhone.value.trim() : '';
                const dob = el.regDOB ? el.regDOB.value : ''; 
                const password = el.regPassword ? el.regPassword.value.trim() : '';

                if (!name || !email || !address || !phone || !dob || !password) {
                    auth.setStatus(el.createStatus, 'Please fill in all fields.', 'error');
                    this._processing = false;
                    return;
                }
                
                const birthDate = new Date(dob);
                const birthYear = birthDate.getFullYear();
                const today = new Date();
                const currentYear = today.getFullYear();

                if (isNaN(birthDate.getTime()) || birthYear < 1900 || birthDate > today) {
                    auth.setStatus(el.createStatus, 'Please enter valid date of birth.', 'error');
                    this._processing = false;
                    return;
                }

                let age = currentYear - birthYear;
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age < 18) {
                    auth.setStatus(el.createStatus, 'You must be at least 18 years old to register.', 'error');
                    this._processing = false;
                    return;
                }

                if (name.length < 2) {
                    auth.setStatus(el.createStatus, 'Name must be at least 2 characters.', 'error');
                    this._processing = false;
                    return;
                }
                if (!email.includes('@') || !email.includes('.')) {
                    auth.setStatus(el.createStatus, 'Please enter a valid email address.', 'error');
                    this._processing = false;
                    return;
                }
                if (phone.length < 10) {
                    auth.setStatus(el.createStatus, 'Please enter a valid phone number.', 'error');
                    this._processing = false;
                    return;
                }
                if (password.length < 6) {
                    auth.setStatus(el.createStatus, 'Password must be at least 6 characters.', 'error');
                    this._processing = false;
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
                this._processing = false;
            };

            el.createAccountBtn.addEventListener('click', createHandler);
        }

        // ===== POPUP CONFIRM BUTTON ===== //
        if (el.popupConfirmBtn) {
            // Clean all existing listeners
            const cleanBtn = auth.cleanButton(el.popupConfirmBtn);
            if (cleanBtn) {
                el.popupConfirmBtn = cleanBtn;
            }

            const confirmHandler = async function(e) {
                e.preventDefault();
                
                if (this._processing) {
                    console.log('Already processing, ignoring duplicate click');
                    return;
                }
                this._processing = true;

                try {
                    const confirmPass = el.popupPassword ? el.popupPassword.value.trim() : '';
                    
                    if (!auth.tempRegistration) {
                        auth.setStatus(el.popupStatus, 'Error: No registration data found.', 'error');
                        this._processing = false;
                        return;
                    }
                    if (!confirmPass) {
                        auth.setStatus(el.popupStatus, 'Please re-enter your password.', 'error');
                        this._processing = false;
                        return;
                    }
                    if (confirmPass !== auth.tempRegistration.password) {
                        auth.setStatus(el.popupStatus, 'Password mismatch!', 'error');
                        this._processing = false;
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
                            
                            el.popupConfirmBtn._processing = false;
                        }, 1500);
                    } else {
                        auth.setStatus(el.popupStatus, result.error || 'Registration failed.', 'error');
                        this._processing = false;
                    }
                } catch (err) {
                    console.error('Registration error:', err);
                    auth.setStatus(el.popupStatus, 'Server Connection Failed.', 'error');
                    this._processing = false;
                }
            };

            el.popupConfirmBtn.addEventListener('click', confirmHandler);
        }

        // ===== POPUP PASSWORD ENTER KEY ===== //
        if (el.popupPassword) {
            const cleanInput = el.popupPassword.cloneNode(true);
            el.popupPassword.parentNode.replaceChild(cleanInput, el.popupPassword);
            el.popupPassword = cleanInput;

            el.popupPassword.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && el.popupConfirmBtn) {
                    e.preventDefault();
                    if (!el.popupConfirmBtn._processing) {
                        el.popupConfirmBtn.click();
                    }
                }
            });
        }

        // ===== POPUP CLOSE BUTTON ===== //
        if (el.popupClose) {
            const cleanClose = el.popupClose.cloneNode(true);
            el.popupClose.parentNode.replaceChild(cleanClose, el.popupClose);
            el.popupClose = cleanClose;

            el.popupClose.addEventListener('click', function(e) {
                e.preventDefault();
                auth.closeConfirmPopup();
            });
        }

        console.log('Registration module initialized');
    });
})();