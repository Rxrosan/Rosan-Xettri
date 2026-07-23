// ===== rx-forgot-password.js ===== //
(function() {
    'use strict';

    const SUPABASE_URL = "https://xorxoovezlgqcaeyqpdp.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_5_yPXUnjJVe3dy13X5nkXQ_afJ7rCvM";

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

        const findAccountSection = document.getElementById('findAccountSection');
        const resetIdentifier = document.getElementById('resetIdentifier');
        const resetNickname = document.getElementById('resetNickname'); 
        const findAccountBtn = document.getElementById('findAccountBtn');

        const accountVerifiedSection = document.getElementById('accountVerifiedSection');
        const userAvatarImg = document.getElementById('userAvatarImg'); // Profile Image Element
        const userProfileLink = document.getElementById('userProfileLink');
        const foundUserName = document.getElementById('foundUserName');
        const verifyDOB = document.getElementById('verifyDOB');
        const processDobBtn = document.getElementById('processDobBtn');

        const passwordSection = document.getElementById('passwordSection');
        const resetNewPassword = document.getElementById('resetNewPassword');
        const submitNewPasswordBtn = document.getElementById('submitNewPasswordBtn');

        const confirmPopup = document.getElementById('confirmPopup');
        const popupPassword = document.getElementById('popupPassword');
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const popupStatus = document.getElementById('popupStatus');
        const popupClose = document.getElementById('popupClose');
        const resetStatus = document.getElementById('resetStatus');

        let verifiedUserData = null;

        window._rxForgot = {
            resetForgotForm: function() {
                if (resetIdentifier) resetIdentifier.value = '';
                if (resetNickname) resetNickname.value = '';
                if (verifyDOB) verifyDOB.value = '';
                if (resetNewPassword) resetNewPassword.value = '';
                if (popupPassword) popupPassword.value = '';
                if (userAvatarImg) { userAvatarImg.src = ''; userAvatarImg.style.display = 'none'; }
                
                if (findAccountSection) findAccountSection.classList.remove('page-hidden');
                if (accountVerifiedSection) accountVerifiedSection.classList.add('page-hidden');
                if (passwordSection) passwordSection.classList.remove('active');
                if (resetStatus) { resetStatus.style.display = 'none'; resetStatus.textContent = ''; }
                verifiedUserData = null;
                if (typeof auth.syncPasswordToggles === 'function') auth.syncPasswordToggles();
            }
        };

        // 1. Find Account Button Click (Email/Phone + Name Match)
        if (findAccountBtn) {
            findAccountBtn.addEventListener('click', async function() {
                const identifier = resetIdentifier.value.trim();
                const inputName = resetNickname.value.trim();

                if (!identifier || !inputName) {
                    auth.setStatus(resetStatus, 'Please enter email/phone and your name.', 'error');
                    return;
                }

                try {
                    const client = getSupabaseClient();
                    if (!client) {
                        auth.setStatus(resetStatus, 'Database client connecting...', 'error');
                        return;
                    }

                    auth.setStatus(resetStatus, 'Searching account...', 'info');

                    let query = client.from('users').select('*');
                    if (identifier.includes('@')) {
                        query = query.ilike('email', identifier);
                    } else {
                        query = query.eq('phone', identifier);
                    }

                    const { data, error } = await query;

                    if (error || !data || data.length === 0) {
                        auth.setStatus(resetStatus, 'No account found with this information.', 'error');
                        return;
                    }

                    const user = data[0];
                    
                    if (!user.name || user.name.trim().toLowerCase() !== inputName.toLowerCase()) {
                        auth.setStatus(resetStatus, 'Name does not match with this account.', 'error');
                        return;
                    }

                    verifiedUserData = user;
                    auth.setStatus(resetStatus, 'Account found successfully!', 'success');

                    setTimeout(() => {
                        if (findAccountSection) findAccountSection.classList.add('page-hidden');
                        if (accountVerifiedSection) accountVerifiedSection.classList.remove('page-hidden');
                        
                        // Show Profile Image if avatar_url exists
                        if (userAvatarImg) {
                            if (user.avatar_url) {
                                userAvatarImg.src = user.avatar_url;
                                userAvatarImg.style.display = 'block';
                            } else {
                                userAvatarImg.style.display = 'none';
                            }
                        }

                        if (foundUserName) foundUserName.value = user.name || '';
                        if (userProfileLink) {
                            userProfileLink.href = `User-profile.html?id=${user.id || ''}`;
                            userProfileLink.textContent = `Profile Link: ${user.name}`;
                        }
                        resetStatus.style.display = 'none';
                    }, 800);

                } catch (err) {
                    console.error("Error:", err);
                    auth.setStatus(resetStatus, 'Database connection error.', 'error');
                }
            });
        }

        // 2. Process DOB Button Click
        if (processDobBtn) {
            processDobBtn.addEventListener('click', function() {
                const inputDob = verifyDOB.value;
                if (!inputDob) {
                    auth.setStatus(resetStatus, 'Please select your Date of Birth.', 'error');
                    return;
                }

                if (!verifiedUserData || verifiedUserData.dob !== inputDob) {
                    auth.setStatus(resetStatus, 'Date of Birth does not match.', 'error');
                    return;
                }

                auth.setStatus(resetStatus, 'DOB verified successfully!', 'success');

                setTimeout(() => {
                    if (accountVerifiedSection) accountVerifiedSection.classList.add('page-hidden');
                    if (passwordSection) passwordSection.classList.add('active');
                    resetStatus.style.display = 'none';
                    if (typeof auth.syncPasswordToggles === 'function') auth.syncPasswordToggles();
                }, 800);
            });
        }

        // 3. Submit New Password Button Click -> Opens Popup
        if (submitNewPasswordBtn) {
            submitNewPasswordBtn.addEventListener('click', function() {
                const newPass = resetNewPassword.value.trim();
                if (!newPass || newPass.length < 6) {
                    auth.setStatus(resetStatus, 'Password must be at least 6 characters.', 'error');
                    return;
                }

                if (confirmPopup) {
                    confirmPopup.classList.add('active');
                    document.body.classList.add('no-scroll');
                    if (popupPassword) popupPassword.value = '';
                    if (popupStatus) { popupStatus.style.display = 'none'; popupStatus.textContent = ''; }
                    if (typeof auth.syncPasswordToggles === 'function') auth.syncPasswordToggles();
                }
            });
        }

        if (popupClose) {
            popupClose.addEventListener('click', function() {
                confirmPopup.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        }

        // 4. Change Password inside Popup (Final DB Update)
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', async function() {
                const confirmPass = popupPassword.value.trim();
                const newPass = resetNewPassword.value.trim();

                if (!confirmPass) {
                    auth.setStatus(popupStatus, 'Please re-enter your password.', 'error');
                    return;
                }
                if (confirmPass !== newPass) {
                    auth.setStatus(popupStatus, 'Passwords do not match!', 'error');
                    return;
                }

                try {
                    const client = getSupabaseClient();
                    const identifierKey = verifiedUserData.email ? 'email' : 'phone';
                    const identifierVal = verifiedUserData.email || verifiedUserData.phone;

                    const { error } = await client
                        .from('users')
                        .update({ password: newPass })
                        .eq(identifierKey, identifierVal);

                    if (!error) {
                        auth.setStatus(popupStatus, 'Password changed successfully!', 'success');
                        setTimeout(() => {
                            confirmPopup.classList.remove('active');
                            document.body.classList.remove('no-scroll');
                            auth.showPage('loginSection');
                            window._rxForgot.resetForgotForm();
                            auth.setStatus(auth.elements.loginStatus, 'Password reset! Please login.', 'success');
                        }, 1500);
                    } else {
                        auth.setStatus(popupStatus, error.message || 'Update failed.', 'error');
                    }
                } catch (err) {
                    auth.setStatus(popupStatus, 'Server connection error.', 'error');
                }
            });
        }
    });
})();