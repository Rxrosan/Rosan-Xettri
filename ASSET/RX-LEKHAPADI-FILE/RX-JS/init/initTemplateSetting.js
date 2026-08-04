// init/initTemplateSetting.js
function initTemplateSetting() {
    if (!document.getElementById('templateOption') && dom.settingsPopup) {
        const templateOption = document.createElement('div');
        templateOption.className = 'settings-option';
        templateOption.id = 'templateOption';
        templateOption.innerHTML = `Select Document`;
        templateOption.addEventListener('click', showTemplateSelectionPopup);
        
        if (dom.logoutOption) {
            dom.settingsPopup.insertBefore(templateOption, dom.logoutOption);
        } else {
            dom.settingsPopup.appendChild(templateOption);
        }
    }
}