(function() {
    'use strict';

    // --- Configuration ---
    const UNAUTHORIZED_ATTEMPTS_LIMIT = 3; // Number of attempts before a temporary block.
    const BLOCK_DURATION_MINUTES = 5;      // How long the user is blocked for.
    const COLLECTION_PAGE_URL = 'KR-EXAM-ALL-COLLECTION.html';
    const LOGIN_PAGE_URL = 'KR-EXAM-ALL-COLLECTION-LOGIN.html';

    // --- Robust Loader Configuration ---
    const POLL_INTERVAL_MS = 50;           // Check for data every 50 milliseconds.
    const MAX_POLL_ATTEMPTS = 60;          // Attempt for 3 seconds (60 * 50ms) before timing out.

    /**
     * Halts page execution and shows a critical error message.
     * This now only runs after the script has timed out waiting for data.
     */
    function showConfigurationError() {
        console.error('Cheeker.js Timeout: The `USERS` variable was not found after 3 seconds. Please ensure the user data file is correctly linked and loaded.');
        document.body.innerHTML = `<div style="text-align: center; padding: 50px; font-family: sans-serif; color: #d9534f;"><h1>Application Error</h1><p>A critical data file (USERS) could not be loaded. Please contact support.</p></div>`;
    }

    /**
     * The main security logic that runs only AFTER the data is confirmed to be loaded.
     */
    function validateAccess() {
        // --- 1. Identify User and Handle Not Being Logged In ---
        const loggedInUserPhone = localStorage.getItem('loggedInUserPhone');
        if (!loggedInUserPhone) {
            window.location.href = LOGIN_PAGE_URL;
            return;
        }

        const currentUser = USERS.find(u => u.phone === loggedInUserPhone);
        if (!currentUser) {
            localStorage.removeItem('loggedInUserPhone');
            window.location.href = LOGIN_PAGE_URL;
            return;
        }

        // --- 2. Check for and Enforce Temporary Block ---
        const blockInfo = JSON.parse(localStorage.getItem('userBlockInfo') || '{}');
        if (blockInfo.phone === currentUser.phone && new Date().getTime() < blockInfo.unblockTime) {
            const remainingMinutes = Math.ceil((blockInfo.unblockTime - new Date().getTime()) / 60000);
            document.body.innerHTML = `
                <div style="text-align: center; padding: 50px; font-family: sans-serif; color: #333;">
                    <h1 style="color: #d9534f;">Access Temporarily Blocked</h1>
                    <p>Due to multiple attempts to access un-purchased content, your account is blocked.</p>
                    <p>Please try again in <strong>${remainingMinutes} minute(s)</strong>.</p>
                </div>`;
            return;
        } else if (blockInfo.phone === currentUser.phone) {
            localStorage.removeItem('userBlockInfo'); // The block has expired.
        }

        // --- 3. Identify Current Question and Verify Purchase ---

        // FIX: Check if ALL_QUESTIONS is defined. If not, we cannot check purchases, so we exit gracefully.
        // This prevents the script from crashing if the question data file is missing.
        if (typeof ALL_QUESTIONS === 'undefined') {
            console.log("Cheeker.js: 'ALL_QUESTIONS' data not found. Skipping purchase check.");
            return;
        }

        const currentPath = window.location.pathname.split('/').pop();
        const currentQuestion = ALL_QUESTIONS.find(q => q.link === currentPath);

        // If the current page isn't a question page, do nothing.
        if (!currentQuestion) {
            return;
        }

        const hasPurchased = currentUser.purchases.some(p => p.questionId === currentQuestion.id);

        if (hasPurchased) {
            localStorage.removeItem('unauthorizedAccessWarning');
            console.log(`Cheeker.js: Access granted for ${currentUser.name} to ${currentQuestion.title}.`);
        } else {
            handleUnauthorizedAccess(currentUser, currentQuestion);
        }
    }

    /**
     * Manages redirection, warnings, and blocking for unauthorized users.
     */
    function handleUnauthorizedAccess(user, question) {
        let attempts = parseInt(localStorage.getItem('unauthorizedAttempts') || '0', 10) + 1;
        localStorage.setItem('unauthorizedAttempts', attempts.toString());
        console.warn(`Cheeker.js: UNAUTHORIZED access attempt #${attempts} by ${user.name} for "${question.title}".`);

        if (attempts >= UNAUTHORIZED_ATTEMPTS_LIMIT) {
            const unblockTime = new Date().getTime() + BLOCK_DURATION_MINUTES * 60 * 1000;
            const blockInfo = { phone: user.phone, unblockTime: unblockTime };
            localStorage.setItem('userBlockInfo', JSON.stringify(blockInfo));
            localStorage.removeItem('unauthorizedAttempts');
            console.error(`Cheeker.js: User ${user.name} has been BLOCKED for ${BLOCK_DURATION_MINUTES} minutes.`);
        }

        const warningMessage = `You have not purchased "${question.title}". Please purchase it to gain access.`;
        localStorage.setItem('unauthorizedAccessWarning', warningMessage);
        window.location.href = COLLECTION_PAGE_URL;
    }

    /**
     * This is the new entry point. It waits for the necessary data to be loaded
     * before running the main validation logic.
     */
    function initializeChecker() {
        let attempts = 0;
        const intervalId = setInterval(() => {
            // FIX: Only wait for the 'USERS' variable. 'validateAccess' is now robust
            // enough to handle cases where 'ALL_QUESTIONS' might be undefined.
            if (typeof USERS !== 'undefined') {
                // SUCCESS! Data is loaded.
                clearInterval(intervalId); // Stop polling
                validateAccess();         // Run the actual security check
            } else {
                // Data not ready yet, keep trying.
                attempts++;
                if (attempts > MAX_POLL_ATTEMPTS) {
                    // FAILURE! Timed out.
                    clearInterval(intervalId); // Stop polling
                    showConfigurationError(); // Show the error message
                }
            }
        }, POLL_INTERVAL_MS);
    }

    // Attach the robust initializer to the DOMContentLoaded event.
    document.addEventListener('DOMContentLoaded', initializeChecker);

})();