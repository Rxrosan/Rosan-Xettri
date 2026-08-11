// init/initWitnessBothPages.js
function initWitnessBothPagesSetting() {
    const witnessBothPages = localStorage.getItem(CONFIG.WITNESS_BOTH_PAGES_KEY) === 'true';
    
    if (!document.getElementById('witnessToggle') && dom.settingsPopup) {
        const witnessOption = document.createElement('div');
        witnessOption.className = 'settings-option';
        witnessOption.innerHTML = `
            <div class="witness-toggle">
                <span>Witness on all Pages</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="witnessToggle">
                    <span class="slider"></span>
                </label>
            </div>
        `;
        
        if (dom.logoutOption) {
            dom.settingsPopup.insertBefore(witnessOption, dom.logoutOption);
        } else {
            dom.settingsPopup.appendChild(witnessOption);
        }
        
        document.getElementById('witnessToggle').addEventListener('change', toggleWitnessBothPages);
    }
    
    const witnessToggle = document.getElementById('witnessToggle');
    if (witnessToggle) {
        witnessToggle.checked = witnessBothPages;
    }
    
    CONFIG.WITNESS_BOTH_PAGES = witnessBothPages;
}