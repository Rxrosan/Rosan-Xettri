// settings/toggleWitnessBothPages.js
function toggleWitnessBothPages() {
    const witnessToggle = document.getElementById('witnessToggle');
    if (witnessToggle) {
        const isWitnessBothPages = witnessToggle.checked;
        CONFIG.WITNESS_BOTH_PAGES = isWitnessBothPages;
        localStorage.setItem(CONFIG.WITNESS_BOTH_PAGES_KEY, isWitnessBothPages);
    }
}