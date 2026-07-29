// events/setupEventListeners.js
function setupEventListeners() {
    if (dom.loginBtn) {
        dom.loginBtn.addEventListener('click', () => {
            if (dom.accessCodeInput && dom.accessCodeInput.value === CONFIG.ACCESS_CODE) {
                sessionStorage.setItem(CONFIG.SESSION_KEY, 'true');
                localStorage.setItem(CONFIG.PERSISTENT_LOGIN_KEY, 'true');
                showMainContent();
            } else {
                alert('Invalid access code. Please try again.');
            }
        });
    }

    if (dom.accessCodeInput) {
        dom.accessCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && dom.loginBtn) {
                dom.loginBtn.click();
            }
        });
    }

    if (dom.generateBtn) dom.generateBtn.addEventListener('click', handleGenerate);
    if (dom.resetBtn) dom.resetBtn.addEventListener('click', clearInputs);
    if (dom.editBtn) dom.editBtn.addEventListener('click', () => {
        updateUIState('editing');
        initInputHover();
    });
    if (dom.copyBtn) dom.copyBtn.addEventListener('click', handleCopyToClipboard);
    if (dom.printBtn) dom.printBtn.addEventListener('click', handlePrint);
    if (dom.shareBtn) dom.shareBtn.addEventListener('click', handleShare);

    if (dom.termsLink) {
        dom.termsLink.addEventListener('click', () => {
            if (dom.termsModal) dom.termsModal.classList.add('active');
        });
    }
    
    if (dom.privacyLink) {
        dom.privacyLink.addEventListener('click', () => {
            if (dom.privacyModal) dom.privacyModal.classList.add('active');
        });
    }
    
    if (dom.closeTerms) {
        dom.closeTerms.addEventListener('click', () => {
            if (dom.termsModal) dom.termsModal.classList.remove('active');
        });
    }
    
    if (dom.closePrivacy) {
        dom.closePrivacy.addEventListener('click', () => {
            if (dom.privacyModal) dom.privacyModal.classList.remove('active');
        });
    }

    if (dom.settingsBtn) dom.settingsBtn.addEventListener('click', toggleSettingsPopup);
    if (dom.homeOption) dom.homeOption.addEventListener('click', goToHome);
    if (dom.logoutOption) dom.logoutOption.addEventListener('click', logout);
    if (dom.themeToggle) dom.themeToggle.addEventListener('change', toggleTheme);
    if (dom.animationToggle) dom.animationToggle.addEventListener('change', toggleWritingAnimation);

    window.addEventListener('click', (e) => {
        if (e.target === dom.termsModal && dom.termsModal) {
            dom.termsModal.classList.remove('active');
        }
        if (e.target === dom.privacyModal && dom.privacyModal) {
            dom.privacyModal.classList.remove('active');
        }
        if (dom.settingsBtn && dom.settingsPopup && 
            !dom.settingsBtn.contains(e.target) && 
            !dom.settingsPopup.contains(e.target)) {
            dom.settingsPopup.classList.remove('active');
        }
    });

    document.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            saveInputsToLocalStorage();
        }
    });
    
}