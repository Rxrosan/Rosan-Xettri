// init/initPageMarginsSetting.js
function initPageMarginsSetting() {
    const savedMargins = localStorage.getItem(CONFIG.PAGE_MARGINS_KEY);
    CONFIG.PAGE_MARGINS = savedMargins ? JSON.parse(savedMargins) : {};
    
    if (!document.getElementById('marginOption') && dom.settingsPopup) {
        const marginOption = document.createElement('div');
        marginOption.className = 'settings-option';
        marginOption.id = 'marginOption';
        marginOption.innerHTML = `Manage Page Margins`;
        marginOption.addEventListener('click', showMarginManagementPopup);
        
        if (dom.logoutOption) {
            dom.settingsPopup.insertBefore(marginOption, dom.logoutOption);
        } else {
            dom.settingsPopup.appendChild(marginOption);
        }
    }
}