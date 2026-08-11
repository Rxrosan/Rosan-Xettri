// settings/toggleTheme.js
function toggleTheme() {
    const isLight = dom.themeToggle ? dom.themeToggle.checked : false;
    const theme = isLight ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.THEME_KEY, theme);
}