// EXAM-JS-LINKER.js - Dynamic Exam Question Loader

(function() {
    /**
     * ===================================================================
     *                        CONFIGURATION
     * ===================================================================
     * 1. Map each exam ID to its specific JavaScript QUESTION file.
     *    (No longer mapping HTML filenames directly, as one HTML file
     *     will be used for multiple exams via URL parameters).
     *
     * NOTE: This script no longer loads the exam engine (KR-EXAM-BODY.js).
     * You must include it yourself in your HTML file like this:
     * <script src="ASSETS/TOOL-FILES/JS/KR-EXAM-BODY.js" defer></script>
     */

    // Mapping: Exam ID to the Question Script Path
    const examScriptMapping = {
        'file2': 'ASSETS/KR-EXAM-FILE/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-1/QUESTION/KR-EXAM-QM-1.js',
        'file8': 'ASSETS/KR-EXAM-FILE/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/QUESTION/KR-EXAM-QM-2.js',
        // Add more exam IDs and their question script paths here:
        // 'your_new_exam_id': 'path/to/your/new/exam/questions.js',
    };


    /**
     * ===================================================================
     *                        LOADER LOGIC
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
        document.body.innerHTML = `<div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
                                        <h2>${title}</h2>
                                        <p>${message}</p>
                                   </div>`;
        document.body.style.display = 'block'; // Ensure body is visible if it was hidden by other CSS
    }

    /**
     * Main asynchronous function to orchestrate the script loading process.
     */
    async function main() {
        // 1. Get the exam ID from the URL query parameter (e.g., ?exam=file2)
        const selectedExamId = getQueryParameter('exam');

        if (!selectedExamId) {
            const errorMessage = `No 'exam' parameter found in the URL. Please provide an exam ID (e.g., KR-EXAM.html?exam=file2).`;
            console.error(errorMessage);
            displayError("Exam Not Specified", `Please select an exam to start. No exam ID found in the URL.`);
            return;
        }

        // 2. Find the corresponding question script path using the exam ID.
        const questionScriptPath = examScriptMapping[selectedExamId];

        if (!questionScriptPath) {
            const errorMessage = `No question script is mapped for exam ID: "${selectedExamId}". Check 'examScriptMapping' in EXAM-JS-LINKER.js.`;
            console.error(errorMessage);
            displayError("Exam Configuration Error", `The configuration for exam <strong>${selectedExamId}</strong> is missing or incorrect.`);
            return;
        }

        // 3. Load ONLY the question script.
        try {
            console.log(`Attempting to load Exam ID: ${selectedExamId}`);
            console.log(`Loading question set from: ${questionScriptPath}`);
            await loadScript(questionScriptPath);
            console.log("Question script loaded successfully.");

            // Optional: You might want to remove a loading spinner or show the exam content here
            // if your HTML initially hides the exam content.

        } catch (error) {
            console.error(error);
            displayError("Error Loading Exam File", `The question script could not be loaded. Please check the file path: <code>${questionScriptPath}</code>.`);
        }
    }

    // --- Main execution ---
    document.addEventListener('DOMContentLoaded', main);

})();