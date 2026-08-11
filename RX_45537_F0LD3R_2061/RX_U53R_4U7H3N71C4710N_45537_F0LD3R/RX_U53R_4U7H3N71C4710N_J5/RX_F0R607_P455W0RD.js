// ===== rx-forgot-password.js (Complete Working Code) ===== //
(function() {
    'use strict';

    const SUPABASE_URL = "https://svwwbxbyutiieflxnoeb.supabase.co"; 
    const SUPABASE_ANON_KEY = "sb_publishable_OBPxBVADXRdtjYEC_ZFcEw_95NR5UXA";

    function loadSupabaseScript(callback) {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.async = true;
        script.onload = callback;
        document.head.appendChild(script);
    }

    function getSupabaseClient() {
        if (window.supabaseClient) return window.supabaseClient;
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            return window.supabaseClient;
        }
        return null;
    }

    document.addEventListener('DOMContentLoaded', function() {
        loadSupabaseScript(function() {
            console.log("Supabase loaded for forgot password.");
        });

        const auth = window._rxAuth;
        if (!auth) return;

        let verifiedUserData = null;

        window._rxForgot = {
            resetForgotForm: function() {
                const el = auth.elements;
                if (el.resetIdentifier) el.resetIdentifier.value = '';
                if (el.resetNickname) el.resetNickname.value = '';
                if (el.verifyDOB) el.verifyDOB.value = '';
                if (el.resetNewPassword) el.resetNewPassword.value = '';
                if (el.popupPassword) el.popupPassword.value = '';
                const avatarImg = document.getElementById('userAvatarImg');
                if (avatarImg) { avatarImg.src = ''; avatarImg.style.display = 'none'; }
                
                const findSec = document.getElementById('findAccountSection');
                const verifiedSec = document.getElementById('accountVerifiedSection');
                const passSec = document.getElementById('passwordSection');
                
                if (findSec) findSec.classList.remove('page-hidden');
                if (verifiedSec) verifiedSec.classList.add('page-hidden');
                if (passSec) passSec.classList.remove('active');
                if (el.resetStatus) { el.resetStatus.style.display = 'none'; el.resetStatus.textContent = ''; }
                verifiedUserData = null;
                if (typeof auth.syncPasswordToggles === 'function') auth.syncPasswordToggles();
            }
        };

        document.addEventListener('click', async function(e) {
            const el = auth.elements;

            // 1. Find Account Button Click
            if (e.target && e.target.id === 'findAccountBtn') {
                const identifier = el.resetIdentifier ? el.resetIdentifier.value.trim().toLowerCase() : '';
                const inputName = el.resetNickname ? el.resetNickname.value.trim() : '';

                if (!identifier || !inputName) {
                    auth.setStatus(el.resetStatus, 'Please enter email/phone and your name.', 'error');
                    return;
                }

                try {
                    const client = getSupabaseClient();
                    if (!client) {
                        auth.setStatus(el.resetStatus, 'Database client connecting...', 'error');
                        return;
                    }

                    auth.setStatus(el.resetStatus, 'Searching account...', 'info');

                    let query = client.from('users').select('*');
                    if (identifier.includes('@')) {
                        query = query.eq('email', identifier);
                    } else {
                        query = query.eq('phone', identifier);
                    }

                    const { data, error } = await query;

                    if (error) {
                        auth.setStatus(el.resetStatus, 'Database query error.', 'error');
                        return;
                    }

                    if (!data || data.length === 0) {
                        auth.setStatus(el.resetStatus, 'No account found with this email/phone.', 'error');
                        return;
                    }

                    const user = data[0];
                    const dbName = user.full_name || user.name || user.user_name || '';

                    if (dbName.trim().toLowerCase() !== inputName.toLowerCase()) {
                        auth.setStatus(el.resetStatus, 'Name does not match 100% with this account.', 'error');
                        return;
                    }

                    verifiedUserData = user;
                    auth.setStatus(el.resetStatus, 'Account found successfully!', 'success');

                    setTimeout(() => {
                        const findSec = document.getElementById('findAccountSection');
                        const verifiedSec = document.getElementById('accountVerifiedSection');
                        const userAvatarImg = document.getElementById('userAvatarImg');
                        const foundUserName = document.getElementById('foundUserName');

                        if (findSec) findSec.classList.add('page-hidden');
                        if (verifiedSec) verifiedSec.classList.remove('page-hidden');
                        
                        if (userAvatarImg) {
                            if (user.image) {
                                userAvatarImg.src = user.image;
                                userAvatarImg.style.display = 'block';
                            } else {
                                userAvatarImg.style.display = 'none';
                            }
                        }

                        if (foundUserName) foundUserName.value = dbName; 
                        if (el.resetStatus) el.resetStatus.style.display = 'none';
                    }, 800);

                } catch (err) {
                    console.error("Error:", err);
                    auth.setStatus(el.resetStatus, 'Database connection error.', 'error');
                }
            }

            // 2. Process DOB Button Click
            if (e.target && e.target.id === 'processDobBtn') {
                const inputDob = el.verifyDOB ? el.verifyDOB.value.trim() : '';
                if (!inputDob) {
                    auth.setStatus(el.resetStatus, 'Please select your Date of Birth.', 'error');
                    return;
                }

                if (!verifiedUserData) {
                    auth.setStatus(el.resetStatus, 'Session expired. Please search account again.', 'error');
                    return;
                }

                const dbDobValue = verifiedUserData.dateofbirth || verifiedUserData.dob || '';
                if (String(dbDobValue).trim() !== inputDob) {
                    auth.setStatus(el.resetStatus, 'Date of Birth does not match.', 'error');
                    return;
                }

                auth.setStatus(el.resetStatus, 'DOB verified successfully!', 'success');

                setTimeout(() => {
                    const verifiedSec = document.getElementById('accountVerifiedSection');
                    const passwordSection = document.getElementById('passwordSection');

                    if (verifiedSec) verifiedSec.classList.add('page-hidden');
                    if (passwordSection) passwordSection.classList.add('active');
                    if (el.resetStatus) el.resetStatus.style.display = 'none';
                    if (typeof auth.syncPasswordToggles === 'function') auth.syncPasswordToggles();
                }, 800);
            }

            // 3. Submit New Password -> Open Popup
            if (e.target && e.target.id === 'submitNewPasswordBtn') {
                const newPass = el.resetNewPassword ? el.resetNewPassword.value.trim() : '';
                if (!newPass || newPass.length < 6) {
                    auth.setStatus(el.resetStatus, 'Password must be at least 6 characters.', 'error');
                    return;
                }

                if (el.confirmPopup) {
                    el.confirmPopup.classList.add('active');
                    document.body.classList.add('no-scroll');
                    if (el.popupPassword) el.popupPassword.value = '';
                    if (el.popupStatus) { el.popupStatus.style.display = 'none'; el.popupStatus.textContent = ''; }
                    if (typeof auth.syncPasswordToggles === 'function') auth.syncPasswordToggles();
                }
            }

            // 4. Confirm Password inside Popup & Send to Backend
            if (e.target && e.target.id === 'popupConfirmBtn') {
                const confirmPass = el.popupPassword ? el.popupPassword.value.trim() : '';
                const newPass = el.resetNewPassword ? el.resetNewPassword.value.trim() : '';

                if (!confirmPass) {
                    auth.setStatus(el.popupStatus, 'Please re-enter your password.', 'error');
                    return;
                }
                if (confirmPass !== newPass) {
                    auth.setStatus(el.popupStatus, 'Passwords do not match!', 'error');
                    return;
                }

                if (!verifiedUserData) {
                    auth.setStatus(el.popupStatus, 'Session expired. Please start over.', 'error');
                    return;
                }

                try {
                    auth.setStatus(el.popupStatus, 'Processing data...', 'info');
                    const identifierVal = verifiedUserData.email || verifiedUserData.phone;

                    const response = await fetch('https://rx-backend-95ow.onrender.com/api/reset-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            identifier: identifierVal, 
                            newPassword: newPass 
                        })
                    });

                    const result = await response.json();

                    if (response.ok) {
                        auth.setStatus(el.popupStatus, 'Password changed successfully!', 'success');
                        setTimeout(() => {
                            if (el.confirmPopup) el.confirmPopup.classList.remove('active');
                            document.body.classList.remove('no-scroll');
                            auth.showPage('loginSection');
                            window._rxForgot.resetForgotForm();
                            auth.setStatus(auth.elements.loginStatus, 'Password reset! Please login.', 'success');
                        }, 1500);
                    } else {
                        auth.setStatus(el.popupStatus, result.error || 'Password update failed.', 'error');
                    }
                } catch (err) {
                    console.error("Error:", err);
                    auth.setStatus(el.popupStatus, 'Server connection error.', 'error');
                }
            }
        });
    });
})();