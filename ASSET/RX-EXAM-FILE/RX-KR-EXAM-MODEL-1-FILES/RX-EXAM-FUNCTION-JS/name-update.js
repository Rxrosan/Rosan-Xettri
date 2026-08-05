/**
 * name-update.js
 * Automatically updates the header with the currently logged-in user's full name.
 * Works with sessionStorage-based authentication from profile-loader.js
 */

(function() {
    'use strict';

    function updateHeaderName() {
        // 1. Try to get user from sessionStorage (used by profile-loader.js)
        let currentUser = null;
        let userName = null;
        
        try {
            const savedSession = sessionStorage.getItem("rxSession");
            if (savedSession) {
                currentUser = JSON.parse(savedSession);
                
                // Get the name from various possible fields
                userName = currentUser.full_name || 
                          currentUser.fullName || 
                          currentUser.user_name || 
                          currentUser.username || 
                          currentUser.name || 
                          currentUser.email || 
                          'User';
            }
        } catch (e) {
            console.warn("Error reading sessionStorage:", e);
        }

        // 2. If no user found, try UserManager (for backward compatibility)
        if (!currentUser && typeof UserManager !== 'undefined') {
            try {
                const user = UserManager.getCurrentUser();
                if (user) {
                    userName = user.fullName || user.name || user.username || user.email || 'User';
                }
            } catch (e) {
                console.warn("Error reading UserManager:", e);
            }
        }

        // 3. If still no user found, show default
        if (!userName) {
            userName = 'Guest';
        }

        // 4. Find and update the target element
        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            headerRight.textContent = userName;
        }

        // 5. Also update any other name display elements if they exist
        const nameElements = document.querySelectorAll('.user-name, .profile-name, .dropdown-name, #dropdown-name, #profile-fullname, #username');
        nameElements.forEach(el => {
            if (el && el !== headerRight) {
                el.textContent = userName;
            }
        });

        console.log("Header name updated to:", userName);
    }

    // Run the update when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            updateHeaderName();
            
            // Also update when session changes
            window.addEventListener('storage', function(e) {
                if (e.key === 'rxSession') {
                    updateHeaderName();
                }
            });
        });
    } else {
        updateHeaderName();
    }

    // Expose function to be called from other scripts (like profile-loader.js)
    window.rxUpdateHeaderName = updateHeaderName;

})();