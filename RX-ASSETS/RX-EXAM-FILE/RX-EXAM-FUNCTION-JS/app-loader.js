// app-loader.js - Initializes the entire application
const AppLoader = {
    init: function() {
        console.log('🎬 AppLoader.init() - Starting FRESH exam');
        
        // Force clear all localStorage on every fresh start
        this.clearAllSavedData();
        
        // Initialize modules (No UserID.init())
        UserState.init();
        // Removed: UserID.init();
        QuestionsManager.init();
        
        // Set username directly (no need for id.js)
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) {
            userNameEl.textContent = 'Rosan kc'; // Directly set username
        }
        
        // Start with GRID MENU SCREEN
        this.showMenuScreen();
        
        // Initialize grid after questions load
        setTimeout(() => {
            GridRenderer.init();
            
            // Verify no answers are present
            const answersCount = Object.keys(UserState.userAnswers).length;
            if (answersCount > 0) {
                console.warn(`⚠️ Found ${answersCount} answers, clearing...`);
                UserState.reset();
                GridRenderer.updateGridColors();
            }
            
            // Verify no questions are pre-selected
            const selectedCount = Object.keys(QuestionsManager.selectedQuestions).length;
            if (selectedCount > 0) {
                console.warn(`⚠️ Found ${selectedCount} pre-selected questions`);
            }
            
        }, 1500); // Give time for questions to load
        
        // Initialize timer
        ExamTimer.init();
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('✅ Exam system ready - FRESH start');
    },
    
    clearAllSavedData: function() {
        console.log('🧹 Clearing all saved data...');
        const itemsToClear = [
            'examProgress',
            'questionSelections',
            'lastExamSubmitted',
            'examSessionId',
            'examUserId'
        ];
        
        itemsToClear.forEach(item => {
            localStorage.removeItem(item);
        });
        
        console.log('✅ All saved data cleared');
    },
    
    showMenuScreen: function() {
        document.getElementById('menuScreen').style.display = 'flex';
        document.getElementById('questionScreen').style.display = 'none';
        document.getElementById('navFooter').style.display = 'none';
    },
    
    setupEventListeners: function() {
        // Prevent accidental refresh
        window.addEventListener('beforeunload', (e) => {
            if (ExamTimer.isRunning) {
                e.preventDefault();
                e.returnValue = 'Your exam will be lost if you leave.';
                return e.returnValue;
            }
        });
        
        // Add refresh handler to clear data
        window.addEventListener('load', () => {
            // Add a clear parameter to URL
            if (!window.location.search.includes('clear')) {
                window.history.replaceState({}, '', window.location.pathname + '?clear=' + Date.now());
            }
        });
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    AppLoader.init();
});
