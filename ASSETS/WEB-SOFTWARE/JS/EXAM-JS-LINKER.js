// EXAM-JS-LINKER.js - Dynamic Exam Question Loader with Persistence

(function() {
    /**
     * ===================================================================
     *                        CONFIGURATION
     * ===================================================================
     * 1. Map each exam ID to its specific JavaScript QUESTION file.
     * 2. Define the key for localStorage to store the active exam ID.
     *
     * NOTE: This script no longer loads the exam engine (KR-EXAM-BODY.js).
     * You must include it yourself in your HTML file like this:
     * <script src="ASSETS/TOOL-FILES/JS/KR-EXAM-BODY.js" defer></script>
     */

    // Mapping: Exam ID to the Question Script Path
    const examScriptMapping = {
        'file2': 'ASSETS/KR-EXAM-FILE/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-1/QUESTION/KR-EXAM-QM-1.js',
        'file8': 'ASSETS/KR-EXAM-FILE/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/QUESTION/KR-EXAM-QM-2.js',
        'file9': 'ASSETS/KR-EXAM-FILE/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-3/QUESTION/KR-EXAM-QM-3.js',
        // Add more exam IDs and their question script paths here:
        // 'your_new_exam_id': 'path/to/your/new/exam/questions.js',
    };

    // Key for storing the active exam ID in localStorage
    const LOCAL_STORAGE_EXAM_KEY = 'activeExamId';


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
        document.body.style.display = 'block'; // Ensure body is visible if it was hidden by other CSS
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
     * Attempts to get the exam ID, preferring URL parameter, then localStorage.
     * @returns {string|null} The determined exam ID.
     */
    function getPersistentExamId() {
        const urlExamId = getQueryParameter('exam');
        const storedExamId = localStorage.getItem(LOCAL_STORAGE_EXAM_KEY);

        if (urlExamId) {
            // If URL parameter exists, it overrides localStorage
            console.log(`Exam ID from URL: ${urlExamId}. Storing for persistence.`);
            localStorage.setItem(LOCAL_STORAGE_EXAM_KEY, urlExamId);
            return urlExamId;
        } else if (storedExamId) {
            // If no URL parameter, use the stored one
            console.log(`Exam ID from localStorage: ${storedExamId}.`);
            return storedExamId;
        }
        // No exam ID found anywhere
        return null;
    }

    /**
     * Removes the stored exam ID from localStorage.
     * This function should be called when the user explicitly "closes" the exam.
     */
    function clearPersistentExamId() {
        localStorage.removeItem(LOCAL_STORAGE_EXAM_KEY);
        console.log("Active exam ID cleared from localStorage.");
        // Optionally redirect to a generic page or show an exam selection screen
        // window.location.href = 'index.html'; // Example redirect
    }

    // Expose the clearPersistentExamId function globally if you need to call it from other scripts or UI.
    // Be cautious with global variables. A better approach might be to dispatch a custom event.
    window.clearActiveExam = clearPersistentExamId;


    /**
     * ===================================================================
     *                        MAIN LOADER LOGIC
     * ===================================================================
     */

    async function main() {
        // 1. Determine the exam ID to load, prioritizing URL then localStorage.
        const selectedExamId = getPersistentExamId();

        if (!selectedExamId) {
            const errorMessage = `No 'exam' parameter found in the URL and no active exam found in storage. Please provide an exam ID (e.g., KR-EXAM.html?exam=file2) or select an exam.`;
            console.error(errorMessage);
            displayError("Exam Not Specified", `Please select an exam to start. No exam ID found.`);
            return;
        }

        // 2. Find the corresponding question script path using the exam ID.
        const questionScriptPath = examScriptMapping[selectedExamId];

        if (!questionScriptPath) {
            const errorMessage = `No question script is mapped for exam ID: "${selectedExamId}". Check 'examScriptMapping' in EXAM-JS-LINKER.js.`;
            console.error(errorMessage);
            displayError("Exam Configuration Error", `The configuration for exam <strong>${selectedExamId}</strong> is missing or incorrect.<br>Please check the linker script's configuration.`);
            // Also clear the invalid ID from storage to prevent infinite error on refresh
            clearPersistentExamId();
            return;
        }

        // 3. Load ONLY the question script.
        try {
            console.log(`Loading exam questions for Exam ID: ${selectedExamId} from: ${questionScriptPath}`);
            await loadScript(questionScriptPath);
            console.log("Question script loaded successfully.");

            // 4. Clean up the URL for aesthetics, *after* the ID has been processed and stored.
            cleanUrl();

            // Optional: If you have a loading spinner, hide it here.
            // If your HTML initially hides the exam content, make it visible here.

        } catch (error) {
            console.error(error);
            displayError("Error Loading Exam File", `The question script could not be loaded. Please check the file path: <code>${questionScriptPath}</code>.<br>Details: ${error.message}`);
            // Clear the exam ID from localStorage if the script fails to load
            clearPersistentExamId();
        }
    }

    // --- Main execution ---
    document.addEventListener('DOMContentLoaded', main);

})();