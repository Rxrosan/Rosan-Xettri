/**
 * name-update.js
 * Automatically updates the header with the currently logged-in user's full name.
 */

(function() {
    function updateHeaderName() {
        // 1. Check if UserManager exists from user.js
        if (typeof UserManager !== 'undefined') {
            const currentUser = UserManager.getCurrentUser();
            
            if (currentUser && currentUser.fullName) {
                // 2. Find the target element
                const headerRight = document.querySelector('.header-right');
                
                if (headerRight) {
                    // 3. Update the text content
                    headerRight.textContent = currentUser.fullName;
                }
            }
        }
    }

    // Run the update when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateHeaderName);
    } else {
        updateHeaderName();
    }
})();