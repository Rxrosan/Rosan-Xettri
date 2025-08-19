// JS_LINKER.js - Dynamic Exam Script Loader

(function() {
    /**
     * ===================================================================
     *                        CONFIGURATION
     * ===================================================================
     * This is the only section you need to edit.
     * Map the 'id' from a contentCard in USER-LOGIN.js to the
     * correct JavaScript question file path.
     */
    const examScriptMapping = {
        //  'Card ID' : 'Path to the Question Script'
        // ----------------------------------------------------------------
        'file2': 'ASSETS/KR-EXAM-FILE/KR-EXAM-QUESTION-FILE/KR-EXAM-QM-1/QUESTION/KR-EXAM-QM-1.js',
        // 'file_another_exam': 'path/to/another_exam_questions.js', // Example for a future exam
        // 'file_advanced_test': 'path/to/advanced_test.js'      // Example for a future exam
    };

    /**
     * ===================================================================
     *                        LOADER LOGIC
     *                 (Do not edit below this line)
     * ===================================================================
     */
    
    // Path to the main exam engine script
    const examBodyScriptPath = 'ASSETS/TOOL-FILES/JS/KR-EXAM-BODY.js';

    /**
     * Loads a script dynamically into the document.
     * @param {string} src - The source path of the script to load.
     * @param {function} [callback] - An optional function to run after the script loads successfully.
     */
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            if (callback) {
                callback();
            }
        };
        script.onerror = () => {
            console.error(`Error: The script at ${src} could not be loaded.`);
            document.body.innerHTML = `<div style="text-align: center; margin-top: 50px;">
                                            <h2>Error Loading Exam</h2>
                                            <p>The required script file could not be found: <strong>${src}</strong></p>
                                            <p>Please check the file path and your network connection.</p>
                                       </div>`;
        };
        document.body.appendChild(script);
    }

    // --- Main execution ---
    
    // 1. Get the ID of the exam the user clicked on the dashboard.
    const selectedExamId = localStorage.getItem('selectedExamId');

    if (!selectedExamId) {
        console.error("No exam ID found. Was an exam selected from the dashboard?");
        document.body.innerHTML = `<div style="text-align: center; margin-top: 50px;">
                                        <h2>No Exam Selected</h2>
                                        <p>Please go back to the dashboard and select an exam to begin.</p>
                                   </div>`;
        return;
    }

    // 2. Find the corresponding question script path from the mapping.
    const questionScriptPath = examScriptMapping[selectedExamId];

    if (!questionScriptPath) {
        console.error(`No question script is mapped for the exam ID: "${selectedExamId}". Check the mapping in JS_LINKER.js.`);
        document.body.innerHTML = `<div style="text-align: center; margin-top: 50px;">
                                        <h2>Exam Configuration Error</h2>
                                        <p>The selected exam (ID: ${selectedExamId}) is not configured correctly.</p>
                                   </div>`;
        return;
    }

    // 3. Load the scripts in the correct order: Questions first, then the exam engine.
    console.log(`Loading question set: ${questionScriptPath}`);
    loadScript(questionScriptPath, () => {
        console.log(`Loading exam engine: ${examBodyScriptPath}`);
        loadScript(examBodyScriptPath);
    });

})();