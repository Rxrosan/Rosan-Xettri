// EXAM-JS-LINKER.js - Dynamic Content Loader with Persistence

(function() {
    /**
     * ===================================================================
     *                        CONFIGURATION
     * ===================================================================
     * 1. Map each content ID to its specific file (JS or HTML).
     * 2. Define the key for localStorage to store the active content ID.
     *
     * NOTE: This script can load both exam questions (JS) and HTML content.
     */

    // Mapping: Content ID to the File Path and Type
    const contentMapping = {
        // Exam question files (JS)
        'file1': {
            path: 'RX-ASSETS/RX-FUNCTION/RX-UNIVERAL-FUNCTION/RX-JS/RX-SMART-BUTTON.js',
            type: 'js'
        },
         'file2': {
            path: 'RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-1-FILES/RX-EXAM-FUNCTION-JS/questions-manager.js',
            type: 'js'
        },
        'file3': {
            path: 'RX-ASSETS/RX-OTHER-SOFTWARE-FUNCTION/RX-JS/RX-SMART-QR-GENATOR.js',
            type: 'js'
        },
        'file4': {
            path: 'RX-ASSETS/RX-FUNCTION/RX-UNIVERAL-FUNCTION/RX-JS/RX-SMART-BUTTON.js',
            type: 'js'
        },
        'file5': {
            path: 'RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-2-FILES/RX-KR-EXAM-QUESTIONS-MODEL-2/SET-1.js',
            type: 'js'
        },
        'file6': {
            path: 'RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-2-FILES/RX-KR-EXAM-QUESTIONS-MODEL-2/SET-2.js',
            type: 'js'
        },
        'file7': {
            path: 'RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-2-FILES/RX-KR-EXAM-QUESTIONS-MODEL-2/SET-3.js',
            type: 'js'
        },

        // HTML content files - add your HTML content mappings here
        // 'html-content-1': {
        //     path: 'path/to/your/content.html',
        //     type: 'html',
        //     target: 'content-container' // ID of element to insert HTML into
        // },
        // Add more content IDs and their file paths here
    };

    // Key for storing the active content ID in localStorage
    const LOCAL_STORAGE_CONTENT_KEY = 'activeContentId';

    // Key for storing user data
    const LOCAL_STORAGE_USER_KEY = 'currentUser';

    /**
     * ===================================================================
     *                        UTILITY FUNCTIONS
     * ===================================================================
     */

    /**
     * Extracts a query parameter from the URL.
     * @param {string} name - The name of the query parameter to extract (e.g., 'exam').
     * @returns {string|null} The value of the parameter, or null if not found.
     */
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * Loads a script dynamically into the document.
     * @param {string} src - The source path of the script to load.
     * @returns {Promise} - A promise that resolves on success and rejects on error.
     */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve(src);
            script.onerror = () => reject(new Error(`The script at ${src} could not be loaded.`));
            document.head.appendChild(script);
        });
    }

    /**
     * Loads HTML content dynamically into a target element.
     * @param {string} src - The source path of the HTML to load.
     * @param {string} target - The ID of the element to insert HTML into.
     * @returns {Promise} - A promise that resolves on success and rejects on error.
     */
    function loadHTML(src, target) {
        return new Promise((resolve, reject) => {
            fetch(src)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    const container = document.getElementById(target);
                    if (container) {
                        container.innerHTML = html;
                        resolve(src);
                    } else {
                        reject(new Error(`Target element with ID '${target}' not found.`));
                    }
                })
                .catch(error => reject(new Error(`Failed to load HTML from ${src}: ${error.message}`)));
        });
    }

    /**
     * Displays a user-friendly error message on the screen.
     * @param {string} title - The main title for the error message.
     * @param {string} message - The detailed error description.
     */
    function displayError(title, message) {
        document.body.innerHTML = `<div style="text-align: center; margin-top: 50px; padding: 20px; border: 1px solid #ffcc00; background-color: #fffacd; border-radius: 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin-left: auto; margin-right: auto;">
                                        <h2 style="color: #da7f00; margin-bottom: 15px;">${title}</h2>
                                        <p style="font-size: 1.1em; line-height: 1.6;">${message}</p>
                                        <p style="font-size: 0.9em; color: #666; margin-top: 20px;">If you continue to experience issues, please contact support.</p>
                                   </div>`;
        document.body.style.display = 'block';
        document.body.style.margin = '0';
        document.body.style.height = '100vh';
        document.body.style.display = 'flex';
        document.body.style.alignItems = 'center';
        document.body.style.justifyContent = 'center';
    }

    /**
     * Cleans the URL by removing query parameters without reloading the page.
     */
    function cleanUrl() {
        if (window.history.replaceState) {
            const cleanPath = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanPath }, '', cleanPath);
            console.log("URL cleaned: Query parameters removed from address bar.");
        }
    }

    /**
     * Attempts to get the content ID, preferring URL parameter, then localStorage.
     * @returns {string|null} The determined content ID.
     */
    function getPersistentContentId() {
        const urlContentId = getQueryParameter('content') || getQueryParameter('exam'); // Support both 'content' and 'exam' parameters
        const storedContentId = localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);

        if (urlContentId) {
            // If URL parameter exists, it overrides localStorage
            console.log(`Content ID from URL: ${urlContentId}. Storing for persistence.`);
            localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, urlContentId);
            return urlContentId;
        } else if (storedContentId) {
            // If no URL parameter, use the stored one
            console.log(`Content ID from localStorage: ${storedContentId}.`);
            return storedContentId;
        }
        // No content ID found anywhere
        return null;
    }

    /**
     * Removes the stored content ID from localStorage.
     * This function should be called when the user explicitly "closes" the content.
     */
    function clearPersistentContentId() {
        localStorage.removeItem(LOCAL_STORAGE_CONTENT_KEY);
        console.log("Active content ID cleared from localStorage.");
    }

    /**
     * Gets the current user from localStorage
     * @returns {Object|null} The current user object or null if not found
     */
    function getCurrentUser() {
        const userData = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Checks if a user has access to a specific content file
     * @param {Object} user - The user object
     * @param {string} fileId - The file ID to check access for
     * @returns {boolean} True if user has access, false otherwise
     */
    function hasAccessToFile(user, fileId) {
        if (!user) return false;
        
        // Check permanent access
        if (user.access && user.access.includes(fileId)) return true;
        
        // Check timed access
        const fileConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
        if (fileConfig && fileConfig.startDate && fileConfig.duration) {
            const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`);
            const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000);
            return timedAccessEnd > Date.now();
        }
        
        return false;
    }

    /**
     * Gets the remaining time for timed access in a formatted string
     * @param {Object} user - The user object
     * @param {string} fileId - The file ID to check
     * @returns {string} Formatted remaining time or empty string if no timed access
     */
    function getRemainingTimeFormatted(user, fileId) {
        if (!user) return "";
        
        const fileConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
        if (fileConfig && fileConfig.startDate && fileConfig.duration) {
            const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`);
            const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000);
            const remaining = timedAccessEnd - Date.now();
            
            if (remaining > 0) {
                const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
                const h = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((remaining % (1000 * 60)) / 1000);
                return `${d}d ${h}h ${m}m ${s}s`;
            }
        }
        
        return "";
    }

    // Expose the clear function globally
    window.clearActiveContent = clearPersistentContentId;

    /**
     * ===================================================================
     *                        MAIN LOADER LOGIC
     * ===================================================================
     */

    async function main() {
        // 1. Get the current user
        const currentUser = getCurrentUser();
        
        // 2. Determine the content ID to load, prioritizing URL then localStorage.
        const selectedContentId = getPersistentContentId();

        if (!selectedContentId) {
            const errorMessage = `No 'content' or 'exam' parameter found in the URL and no active content found in storage. Please provide a content ID (e.g., index.html?content=file2) or select content.`;
            console.error(errorMessage);
            displayError("Content Not Specified", `Please select content to start. No content ID found.`);
            return;
        }

        // 3. Find the corresponding content configuration
        const contentConfig = contentMapping[selectedContentId];

        if (!contentConfig) {
            const errorMessage = `No content is mapped for ID: "${selectedContentId}". Check 'contentMapping' in EXAM-JS-LINKER.js.`;
            console.error(errorMessage);
            displayError("Content Configuration Error", `The configuration for content <strong>${selectedContentId}</strong> is missing or incorrect.<br>Please check the linker script's configuration.`);
            // Clear the invalid ID from storage to prevent infinite error on refresh
            clearPersistentContentId();
            return;
        }

        // 4. Check if user has access to this content
        if (currentUser && !hasAccessToFile(currentUser, selectedContentId)) {
            const remainingTime = getRemainingTimeFormatted(currentUser, selectedContentId);
            let errorMessage = `You do not have access to this content.`;
            
            if (remainingTime) {
                errorMessage = `Your access to this content has expired.`;
            }
            
            console.error(`Access denied for user ${currentUser.userName} to content ${selectedContentId}`);
            displayError("Access Denied", errorMessage);
            
            // Clear the content ID from storage
            clearPersistentContentId();
            return;
        }

        // 5. Load the content based on its type
        try {
            console.log(`Loading content for ID: ${selectedContentId} from: ${contentConfig.path}`);
            if (currentUser) {
                console.log(`User: ${currentUser.userName} (${currentUser.id})`);
                
                // Log access type
                if (currentUser.access && currentUser.access.includes(selectedContentId)) {
                    console.log("Access type: Permanent");
                } else {
                    const remainingTime = getRemainingTimeFormatted(currentUser, selectedContentId);
                    if (remainingTime) {
                        console.log(`Access type: Timed (Remaining: ${remainingTime})`);
                    }
                }
            } else {
                console.log("User: Guest (no user data found)");
            }
            
            // Load based on content type
            if (contentConfig.type === 'js') {
                await loadScript(contentConfig.path);
                console.log("Script loaded successfully.");
            } else if (contentConfig.type === 'html') {
                if (!contentConfig.target) {
                    throw new Error("No target specified for HTML content");
                }
                await loadHTML(contentConfig.path, contentConfig.target);
                console.log("HTML content loaded successfully.");
            } else {
                throw new Error(`Unsupported content type: ${contentConfig.type}`);
            }

            // 6. Clean up the URL for aesthetics
            cleanUrl();

        } catch (error) {
            console.error(error);
            displayError("Error Loading File", `The content could not be loaded. Please check the file path: <code>${contentConfig.path}</code>.<br>Details: ${error.message}`);
            // Clear the content ID from localStorage if the content fails to load
            clearPersistentContentId();
        }
    }

    // --- Main execution ---
    document.addEventListener('DOMContentLoaded', main);

})();