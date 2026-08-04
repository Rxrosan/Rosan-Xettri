// init/init.js
function init() {
    if (typeof TEMPLATE_COLLECTION === 'undefined') {
        console.error('TEMPLATE_COLLECTION not found!');
        return;
    }

    if (localStorage.getItem(CONFIG.PERSISTENT_LOGIN_KEY) === 'true') {
        showMainContent();
    } else if (sessionStorage.getItem(CONFIG.SESSION_KEY)) {
        showMainContent();
    }
    
    initTheme();
    initWritingAnimationSetting();
    initWitnessBothPagesSetting();
    initPageMarginsSetting();
    initTemplateSetting();
    loadSelectedTemplate();
    setupEventListeners();
}