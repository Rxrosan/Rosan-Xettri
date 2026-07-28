// ===== rx-core.js (Fully Corrected & Aligned) ===== //
(function() {
    'use strict';

    const core = {
        currentUser: null,
        tempRegistration: null,
        resetIdentifier: '',
        statusTimeout: null,

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
            
            // HTML सँग मिल्ने गरी सही IDs हरू राखिएको
            resetIdentifier: document.getElementById('resetIdentifier'),
            resetNickname: document.getElementById('resetNickname'),
            verifyDOB: document.getElementById('verifyDOB'),
            resetNewPassword: document.getElementById('resetNewPassword'),
            submitNewPasswordBtn: document.getElementById('submitNewPasswordBtn'),
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
                resetIdentifier: el.resetIdentifier ? el.resetIdentifier.value : '',
                resetNewPassword: el.resetNewPassword ? el.resetNewPassword.value : '',
                popupPassword: el.popupPassword ? el.popupPassword.value : '', 
                isPopupActive: isPopupOpen, 
                tempRegistration: core.tempRegistration, 
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

        // पपअप बन्द गर्न र स्क्रोल सक्षम पार्न नयाँ थपिएको फंक्सन
        closeConfirmPopup: function() {
            const el = core.elements;
            if (el.confirmPopup) {
                el.confirmPopup.classList.remove('active');
            }
            document.body.classList.remove('no-scroll');
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

        core.initPasswordToggles();
    });
})();