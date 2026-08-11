// settings/logout.js
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        sessionStorage.removeItem(CONFIG.SESSION_KEY);
        localStorage.removeItem(CONFIG.PERSISTENT_LOGIN_KEY);
        location.reload();
    }
}