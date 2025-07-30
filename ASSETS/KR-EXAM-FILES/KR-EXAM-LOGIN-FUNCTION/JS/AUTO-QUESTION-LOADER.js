document.addEventListener('DOMContentLoaded', function() {
    /**
     * This script automatically loads the relevant exam question JavaScript file
     * based on an ID stored in the browser's sessionStorage. This prevents users
     * from modifying the ID in the URL.
     */

    // 1. Get the saved exam ID from sessionStorage instead of the URL
    const questionId = sessionStorage.getItem('selectedExamId');

    // 2. Proceed only if the 'questionId' was found in sessionStorage
    if (questionId) {
        // 3. Prepare the base name of the JS file based on the question ID
        // Example: if id=1, the baseName will be 'KR-EXAM-QM-1'
        const baseName = `KR-EXAM-QM-${questionId}`;
        
        // 4. Construct the correct path for the corresponding question script
        const scriptPath = `ASSETS/KR-EXAM-FILES/KR-EXAM-QUESTION-FILE/${baseName}/QUESTION/${baseName}.js`;

        // 5. Create a new <script> element
        const script = document.createElement('script');
        script.src = scriptPath;
        script.async = true; // Load the script asynchronously

        // Show a message in the console when the script loads successfully
        script.onload = function() {
            console.log(`Question script loaded successfully: ${scriptPath}`);
            // Optional: Once used, you can remove the ID from storage so it's not reused on a simple page reload.
            // sessionStorage.removeItem('selectedExamId');
        };

        // Show an error message if the script fails to load
        script.onerror = function() {
            console.error(`Error: Could not load the question script (${scriptPath}). Please ensure the file path is correct.`);
            alert(`Failed to load exam questions. Please return to the main page and try again.`);
        };

        // 6. Append the script to the document's body to start loading it
        document.body.appendChild(script);

    } else {
        // If no ID is found in sessionStorage, show an error
        console.error('No exam was selected. Cannot start the exam.');
        const contentDisplay = document.getElementById('content-display');
        if (contentDisplay) {
            contentDisplay.innerHTML = `
                <div class="welcome-message" style="color: red;">
                    <h2>Error: Invalid Exam</h2>
                    <p>No question model selected. Please go back to the question list and select an exam to start.</p>
                    <a href="KR-EXAM-ALL-COLLECTION.html" class="btn-primary" style="text-decoration: none;">Go Back</a>
                </div>`;
        }
    }
});