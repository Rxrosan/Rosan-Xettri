// init/initTheme.js
function initTheme() {
    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    if (dom.themeToggle) dom.themeToggle.checked = savedTheme === 'light';
}