// ===== rx-core.js (Complete Rewrite - No Duplicate Issues) ===== //
(function() {
    'use strict';

    // Prevent multiple initialization
    if (window._rxAuthInitialized) return;
    window._rxAuthInitialized = true;

    const core = {
        currentUser: null,
        tempRegistration: null,
        resetIdentifier: '',
        statusTimeout: null,
        _initialized: false,

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
            const el = this.elements;
            const isPopupOpen = el.confirmPopup ? el.confirmPopup.classList.contains('active') : false;

            const state = {
                currentPage: this.getCurrentPage(),
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
                tempRegistration: this.tempRegistration, 
                timestamp: Date.now()
            };
            sessionStorage.setItem('rxPageState', JSON.stringify(state));
        },

        getCurrentPage: function() {
            const el = this.elements;
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
            const el = this.elements;
            [el.loginSection, el.createSection, el.forgotSection].forEach(item => {
                if (item) item.classList.add('page-hidden');
            });
            const target = document.getElementById(pageId);
            if (target) target.classList.remove('page-hidden');
            
            if (!el.confirmPopup || !el.confirmPopup.classList.contains('active')) {
                this.clearAllStatus();
            }
            
            if (saveState) this.savePageState();
        },

        closeConfirmPopup: function() {
            const el = this.elements;
            if (el.confirmPopup) {
                el.confirmPopup.classList.remove('active');
            }
            document.body.classList.remove('no-scroll');
        },

        clearAllStatus: function() {
            const el = this.elements;
            [el.loginStatus, el.createStatus, el.resetStatus, el.popupStatus].forEach(item => {
                if (item) {
                    item.className = 'login-status';
                    item.style.display = 'none';
                    item.textContent = '';
                }
            });
            if (this.statusTimeout) {
                clearTimeout(this.statusTimeout);
                this.statusTimeout = null;
            }
        },

        setStatus: function(element, message, type) {
            if (!element) return;
            if (this.statusTimeout) clearTimeout(this.statusTimeout);
            
            element.textContent = message;
            element.className = 'login-status ' + type;
            element.style.display = 'block';
            
            this.savePageState();
            
            this.statusTimeout = setTimeout(function() {
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

        // Safe event listener attachment
        safeAddListener: function(element, event, handler) {
            if (!element) return;
            // Remove any existing listener
            element.removeEventListener(event, handler);
            // Add new listener
            element.addEventListener(event, handler);
            return element;
        },

        // Clean all event listeners from a button (clone technique)
        cleanButton: function(button) {
            if (!button) return null;
            const clone = button.cloneNode(true);
            button.parentNode.replaceChild(clone, button);
            return clone;
        }
    };

    window._rxAuth = core;

    // Initialize navigation links
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
        
        // Update element references after clone operations
        console.log('RX Core initialized successfully');
    });
})();