// EXAM-JS-LINKER.js - Dynamic Exam Question Loader

(function() {
    /**
     * ===================================================================
     *                        CONFIGURATION
     * ===================================================================
     * 1. Map your HTML filenames to their corresponding exam ID.
     * 2. Map each exam ID to its specific JavaScript QUESTION file.
     *
     * NOTE: This script no longer loads the exam engine (KR-EXAM-BODY.js).
     * You must include it yourself in your HTML file like this:
     * <script src="ASSETS/TOOL-FILES/JS/KR-EXAM-BODY.js" defer></script>
     */

    // Mapping 1: HTML page file name to the correct Exam ID
    const pageToExamIdMapping = {
        'KR-EXAM.html': 'file2',
        'KR-EXAM-RX-NEW-FUNCTION.html': 'file8',
        // 'another-exam-page.html': 'file_another_exam', // Example for a future exam
    };

    // Mapping 2: Exam ID to the Question Script Path
    const examScriptMapping = {
        'file2': 'ASSETS/KR-EXAM-FILE/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-1/QUESTION/KR-EXAM-QM-1.js',
        'file8': 'ASSETS/KR-EXAM-FILE/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-2/QUESTION/KR-EXAM-QM-2.js',
        // 'file_another_exam': 'path/to/another_questions.js', // Example for a future exam
    };


    /**
     * ===================================================================
     *                        LOADER LOGIC
     *                 (Do not edit below this line)
     * ===================================================================
     */
    
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
    }

    /**
     * Main asynchronous function to orchestrate the script loading process.
     */
    async function main() {
        // 1. Determine the current HTML page.
        const path = window.location.pathname;
        const currentPage = path.split("/").pop();

        // 2. Find the correct exam ID from the page filename.
        const selectedExamId = pageToExamIdMapping[currentPage];

        if (!selectedExamId) {
            const errorMessage = `This HTML page ("${currentPage}") is not configured in 'pageToExamIdMapping'.`;
            console.error(errorMessage);
            displayError("Exam Configuration Error", `This page is not configured to load an exam.`);
            return;
        }

        // 3. Find the corresponding question script path.
        const questionScriptPath = examScriptMapping[selectedExamId];

        if (!questionScriptPath) {
            const errorMessage = `No question script is mapped for exam ID: "${selectedExamId}". Check 'examScriptMapping'.`;
            console.error(errorMessage);
            displayError("Exam Configuration Error", `The configuration for exam <strong>${selectedExamId}</strong> is missing.`);
            return;
        }

        // 4. Load ONLY the question script.
        try {
            console.log(`Page: ${currentPage} -> Exam ID: ${selectedExamId}`);
            console.log(`Loading question set: ${questionScriptPath}`);
            await loadScript(questionScriptPath);
            console.log("Question script loaded successfully.");

        } catch (error) {
            console.error(error);
            displayError("Error Loading Exam File", `The question script could not be found. Please check the file path.`);
        }
    }

    // --- Main execution ---
    document.addEventListener('DOMContentLoaded', main);

})();