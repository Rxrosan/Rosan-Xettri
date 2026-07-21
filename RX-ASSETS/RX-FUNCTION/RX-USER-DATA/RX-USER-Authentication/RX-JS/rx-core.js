// ===== rx-core.js ===== //
(function() {
    'use strict';

    const core = {
        generatedOtp: '',
        otpTimerInterval: null,
        otpRemainingSeconds: 0,
        otpStartTimestamp: null,
        otpTotalDuration: 60,
        currentUser: null,
        tempRegistration: null,
        resetIdentifier: '',
        isOtpVerified: false,
        statusTimeout: null,
        isOtpSending: false,

        elements: {
            loginSection: document.getElementById('loginSection'),
            createSection: document.getElementById('createSection'),
            forgotSection: document.getElementById('forgotSection'),
            loginEmail: document.getElementById('loginEmail'),
            loginPassword: document.getElementById('loginPassword'),
            loginBtn: document.getElementById('loginBtn'),
            loginStatus: document.getElementById('loginStatus'),
            regName: document.getElementById('regName'),
            regEmail: document.getElementById('regEmail'),
            regAddress: document.getElementById('regAddress'),
            regPhone: document.getElementById('regPhone'),
            regDOB: document.getElementById('regDOB'), 
            regPassword: document.getElementById('regPassword'),
            createAccountBtn: document.getElementById('createAccountBtn'),
            createStatus: document.getElementById('createStatus'),
            resetEmail: document.getElementById('resetEmail'),
            resetOtp: document.getElementById('resetOtp'),
            sendOtpBtn: document.getElementById('sendOtpBtn'),
            resetNewPassword: document.getElementById('resetNewPassword'),
            resetConfirmPassword: document.getElementById('resetConfirmPassword'),
            resetPasswordBtn: document.getElementById('resetPasswordBtn'),
            resetStatus: document.getElementById('resetStatus'),
            passwordSection: document.getElementById('passwordSection'),
            confirmPopup: document.getElementById('confirmPopup'), 
            popupPassword: document.getElementById('popupPassword'),
            popupConfirmBtn: document.getElementById('popupConfirmBtn'),
            popupStatus: document.getElementById('popupStatus'),
            popupClose: document.getElementById('popupClose')       
        },

        savePageState: function() {
            const el = core.elements;
            const isPopupOpen = el.confirmPopup ? el.confirmPopup.classList.contains('active') : false;

            const state = {
                currentPage: core.getCurrentPage(),
                loginEmail: el.loginEmail ? el.loginEmail.value : '',
                loginPassword: el.loginPassword ? el.loginPassword.value : '',
                regName: el.regName ? el.regName.value : '',
                regEmail: el.regEmail ? el.regEmail.value : '',
                regAddress: el.regAddress ? el.regAddress.value : '',
                regPhone: el.regPhone ? el.regPhone.value : '',
                regDOB: el.regDOB ? el.regDOB.value : '', 
                regPassword: el.regPassword ? el.regPassword.value : '',
                resetEmail: el.resetEmail ? el.resetEmail.value : '',
                resetOtp: el.resetOtp ? el.resetOtp.value : '',
                resetNewPassword: el.resetNewPassword ? el.resetNewPassword.value : '',
                resetConfirmPassword: el.resetConfirmPassword ? el.resetConfirmPassword.value : '',
                popupPassword: el.popupPassword ? el.popupPassword.value : '', 
                isPopupActive: isPopupOpen, 
                tempRegistration: core.tempRegistration, 
                isOtpVerified: core.isOtpVerified,
                resetIdentifier: core.resetIdentifier,
                generatedOtp: core.generatedOtp,
                otpRemainingSeconds: core.otpRemainingSeconds,
                otpStartTimestamp: core.otpStartTimestamp,
                otpTotalDuration: core.otpTotalDuration,
                timestamp: Date.now()
            };
            sessionStorage.setItem('rxPageState', JSON.stringify(state));
        },

        getCurrentPage: function() {
            const el = core.elements;
            if (el.loginSection && !el.loginSection.classList.contains('page-hidden')) {
                return 'loginSection';
            } else if (el.createSection && !el.createSection.classList.contains('page-hidden')) {
                return 'createSection';
            } else if (el.forgotSection && !el.forgotSection.classList.contains('page-hidden')) {
                return 'forgotSection';
            }
            return 'loginSection';
        },

        restorePageState: function() {
            const savedState = sessionStorage.getItem('rxPageState');
            if (!savedState) return null;

            try {
                const state = JSON.parse(savedState);
                if (Date.now() - state.timestamp > 1800000) {
                    sessionStorage.removeItem('rxPageState');
                    return null;
                }

                const el = core.elements;
                if (el.loginEmail && state.loginEmail !== undefined) el.loginEmail.value = state.loginEmail;
                if (el.loginPassword && state.loginPassword !== undefined) el.loginPassword.value = state.loginPassword;
                if (el.regName && state.regName !== undefined) el.regName.value = state.regName;
                if (el.regEmail && state.regEmail !== undefined) el.regEmail.value = state.regEmail;
                if (el.regAddress && state.regAddress !== undefined) el.regAddress.value = state.regAddress;
                if (el.regPhone && state.regPhone !== undefined) el.regPhone.value = state.regPhone;
                if (el.regDOB && state.regDOB !== undefined) el.regDOB.value = state.regDOB; 
                if (el.regPassword && state.regPassword !== undefined) el.regPassword.value = state.regPassword;
                if (el.resetEmail && state.resetEmail !== undefined) el.resetEmail.value = state.resetEmail;
                if (el.resetOtp && state.resetOtp !== undefined) el.resetOtp.value = state.resetOtp;
                if (el.resetNewPassword && state.resetNewPassword !== undefined) el.resetNewPassword.value = state.resetNewPassword;
                if (el.resetConfirmPassword && state.resetConfirmPassword !== undefined) el.resetConfirmPassword.value = state.resetConfirmPassword;
                if (el.popupPassword && state.popupPassword !== undefined) el.popupPassword.value = state.popupPassword;

                if (state.tempRegistration) core.tempRegistration = state.tempRegistration; 

                if (state.isPopupActive && el.confirmPopup) {
                    el.confirmPopup.classList.add('active');
                    document.body.classList.add('no-scroll');
                }

                if (state.isOtpVerified !== undefined) core.isOtpVerified = state.isOtpVerified;
                if (state.resetIdentifier !== undefined) core.resetIdentifier = state.resetIdentifier;
                if (state.generatedOtp !== undefined) core.generatedOtp = state.generatedOtp;
                if (state.otpTotalDuration !== undefined) core.otpTotalDuration = state.otpTotalDuration;
                
                if (window._rxForgot && typeof window._rxForgot.stopOtpTimer === 'function') {
                    window._rxForgot.stopOtpTimer();
                }
                
                if (state.otpStartTimestamp && !core.isOtpVerified) {
                    const elapsedSeconds = Math.floor((Date.now() - state.otpStartTimestamp) / 1000);
                    const remaining = Math.max(0, state.otpTotalDuration - elapsedSeconds);
                    
                    if (remaining > 0 && window._rxForgot) {
                        core.otpStartTimestamp = state.otpStartTimestamp;
                        if (el.sendOtpBtn && !core.isOtpVerified) {
                            el.sendOtpBtn.disabled = true;
                            el.sendOtpBtn.textContent = 'WAIT ' + remaining + 's';
                            el.sendOtpBtn.className = 'login-btn cooldown';
                        }
                        window._rxForgot.startOtpCountdownFrom(remaining);
                    } else {
                        core.otpRemainingSeconds = 0;
                        core.otpStartTimestamp = null;
                        if (window._rxForgot) window._rxForgot.resetOtpButtonToResend();
                    }
                }

                if (core.isOtpVerified) {
                    if (el.passwordSection) el.passwordSection.classList.add('active');
                    if (el.resetOtp) el.resetOtp.disabled = true;
                    if (el.sendOtpBtn) {
                        el.sendOtpBtn.disabled = true;
                        el.sendOtpBtn.textContent = ' VERIFIED';
                        el.sendOtpBtn.className = 'login-btn verified';
                    }
                }

                if (!state.isPopupActive) core.clearAllStatus();
                setTimeout(core.syncPasswordToggles, 100);

                core.savePageState(); 
                return state.currentPage;

            } catch (e) {
                sessionStorage.removeItem('rxPageState');
                return null;
            }
        },

        showPage: function(pageId, saveState = true) {
            const el = core.elements;
            [el.loginSection, el.createSection, el.forgotSection].forEach(item => {
                if (item) item.classList.add('page-hidden');
            });
            const target = document.getElementById(pageId);
            if (target) target.classList.remove('page-hidden');
            
            if (!el.confirmPopup || !el.confirmPopup.classList.contains('active')) {
                core.clearAllStatus();
            }
            
            if (saveState) core.savePageState();
        },

        clearAllStatus: function() {
            const el = core.elements;
            [el.loginStatus, el.createStatus, el.resetStatus, el.popupStatus].forEach(item => {
                if (item) {
                    item.className = 'login-status';
                    item.style.display = 'none';
                    item.textContent = '';
                }
            });
            if (core.statusTimeout) {
                clearTimeout(core.statusTimeout);
                core.statusTimeout = null;
            }
        },

        setStatus: function(element, message, type) {
            if (!element) return;
            if (core.statusTimeout) clearTimeout(core.statusTimeout);
            
            element.textContent = message;
            element.className = 'login-status ' + type;
            element.style.display = 'block';
            
            core.savePageState();
            
            core.statusTimeout = setTimeout(function() {
                element.className = 'login-status';
                element.style.display = 'none';
                element.textContent = '';
                core.statusTimeout = null;
                core.savePageState();
            }, 3000);
        },

        initPasswordToggles: function() {
            document.querySelectorAll('.password-toggle').forEach(function(button) {
                button.removeEventListener('click', core.handleToggle);
                button.addEventListener('click', core.handleToggle);
            });
        },

        handleToggle: function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = this;
            const input = document.getElementById(button.getAttribute('data-target'));
            if (!input) return;
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                if (icon) icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                if (icon) icon.className = 'fas fa-eye';
            }
            
            input.focus();
            core.savePageState();
        },

        syncPasswordToggles: function() {
            document.querySelectorAll('.password-wrapper').forEach(function(wrapper) {
                const input = wrapper.querySelector('input');
                const toggle = wrapper.querySelector('.password-toggle');
                if (input && toggle) {
                    const icon = toggle.querySelector('i');
                    if (input.type === 'text' && icon) icon.className = 'fas fa-eye-slash';
                    else if (input.type === 'password' && icon) icon.className = 'fas fa-eye';
                }
            });
        },

        closeConfirmPopup: function() {
            const popup = core.elements.confirmPopup;
            if (popup) {
                popup.classList.remove('active');
                document.body.classList.remove('no-scroll');
                core.tempRegistration = null; 
                if (core.elements.popupPassword) core.elements.popupPassword.value = '';
                if (core.elements.popupStatus) {
                    core.elements.popupStatus.style.display = 'none';
                    core.elements.popupStatus.textContent = '';
                }
                core.savePageState();
            }
        }
    };

    window._rxAuth = core;

    document.addEventListener('DOMContentLoaded', function() {
        const gotoCreate = document.getElementById('gotoCreate');
        const gotoForgot = document.getElementById('gotoForgot');
        const gotoLoginFromCreate = document.getElementById('gotoLoginFromCreate');
        const gotoForgotFromCreate = document.getElementById('gotoForgotFromCreate');
        const gotoLoginFromForgot = document.getElementById('gotoLoginFromForgot');
        const gotoCreateFromForgot = document.getElementById('gotoCreateFromForgot');

        if (gotoCreate) gotoCreate.addEventListener('click', e => { e.preventDefault(); core.showPage('createSection'); });
        if (gotoForgot) gotoForgot.addEventListener('click', e => { e.preventDefault(); core.showPage('forgotSection'); if(window._rxForgot) window._rxForgot.resetForgotForm(); });
        if (gotoLoginFromCreate) gotoLoginFromCreate.addEventListener('click', e => { e.preventDefault(); core.showPage('loginSection'); });
        if (gotoForgotFromCreate) gotoForgotFromCreate.addEventListener('click', e => { e.preventDefault(); core.showPage('forgotSection'); if(window._rxForgot) window._rxForgot.resetForgotForm(); });
        if (gotoLoginFromForgot) gotoLoginFromForgot.addEventListener('click', e => { e.preventDefault(); core.showPage('loginSection'); });
        if (gotoCreateFromForgot) gotoCreateFromForgot.addEventListener('click', e => { e.preventDefault(); core.showPage('createSection'); });

        const inputsToWatch = [
            core.elements.loginEmail, core.elements.loginPassword,
            core.elements.regName, core.elements.regEmail, core.elements.regAddress, core.elements.regPhone, core.elements.regDOB, core.elements.regPassword,
            core.elements.resetEmail, core.elements.resetOtp, core.elements.resetNewPassword, core.elements.resetConfirmPassword,
            core.elements.popupPassword
        ];
        inputsToWatch.forEach(input => {
            if (input) input.addEventListener('input', () => core.savePageState());
        });

        if (core.elements.popupClose) {
            core.elements.popupClose.addEventListener('click', e => { e.preventDefault(); core.closeConfirmPopup(); });
        }

        core.initPasswordToggles();
    });
})();