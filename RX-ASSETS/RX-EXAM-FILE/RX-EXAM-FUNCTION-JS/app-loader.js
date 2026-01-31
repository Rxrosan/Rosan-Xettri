// app-loader.js - COMPLETE REWRITE

const AppLoader = {
    init: function() {
        console.log('🚀 AppLoader.init() - Starting exam system');
        
        // Check if we should clear saved data
        this.checkAndClearSavedData();
        
        // Initialize ALL modules in correct order
        this.initializeModules();
        
        // Setup UI
        this.setupUI();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start with grid view
        this.showMenuScreen();
        
        // Initialize grid after questions load
        this.initializeGrid();
        
        // Start timer
        this.startTimer();
        
        // Initialize MediaController
        this.initMediaController();
        
        console.log('✅ AppLoader initialized successfully');
    },
    
    checkAndClearSavedData: function() {
        // Check if this is a fresh start
        const hasPreviousSession = localStorage.getItem('examSessionId');
        const urlParams = new URLSearchParams(window.location.search);
        const shouldClear = urlParams.has('clear') || !hasPreviousSession;
        
        if (shouldClear) {
            console.log('🧹 Clearing previous session data');
            this.clearAllSavedData();
            
            // Create new session ID
            const newSessionId = 'exam-' + Date.now();
            localStorage.setItem('examSessionId', newSessionId);
            console.log(`🆕 New session ID: ${newSessionId}`);
        } else {
            console.log('📚 Continuing previous session');
            // Load any saved progress
            this.loadSavedProgress();
        }
    },
    
    clearAllSavedData: function() {
        // Clear localStorage items
        const itemsToClear = [
            'examProgress',
            'questionSelections',
            'lastExamSubmitted'
        ];
        
        itemsToClear.forEach(item => {
            localStorage.removeItem(item);
        });
        
        console.log('✅ Session data cleared');
    },
    
    loadSavedProgress: function() {
        try {
            const savedProgress = localStorage.getItem('examProgress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                console.log('📥 Loading saved progress:', progress);
                
                // Load saved answers into UserState
                if (progress.answers && UserState) {
                    UserState.userAnswers = progress.answers;
                    console.log(`📊 Loaded ${Object.keys(progress.answers).length} saved answers`);
                }
                
                // Load current question
                if (progress.currentQuestion && UserState) {
                    UserState.currentQuestionId = progress.currentQuestion;
                }
            }
        } catch (error) {
            console.error('❌ Error loading saved progress:', error);
        }
    },
    
    initializeModules: function() {
        console.log('🛠️ Initializing modules...');
        
        // Initialize UserState FIRST
        if (typeof UserState !== 'undefined') {
            UserState.init();
            console.log('✅ UserState initialized');
        }
        
        // Initialize QuestionsManager
        if (typeof QuestionsManager !== 'undefined') {
            QuestionsManager.init();
            console.log('✅ QuestionsManager initialized');
        }
    },
    
    initMediaController: function() {
        // Initialize MediaController after everything is loaded
        setTimeout(() => {
            if (typeof MediaController !== 'undefined') {
                MediaController.init();
                console.log('✅ MediaController initialized');
            }
        }, 1500);
    },
    
    setupUI: function() {
        // Set username
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) {
            userNameEl.textContent = 'Rosan kc';
        }
        
        // Setup timer display
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.textContent = '50:00';
        }
        
        // Setup stats
        this.updateStatsDisplay();
    },
    
    setupEventListeners: function() {
        console.log('🔗 Setting up event listeners');
        
        // Prevent accidental page refresh/close during exam
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        // Auto-save progress periodically
        setInterval(this.autoSaveProgress.bind(this), 30000); // Every 30 seconds
        
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Handle page load completion
        window.addEventListener('load', this.handlePageLoad.bind(this));
    },
    
    handleBeforeUnload: function(e) {
        if (typeof ExamTimer !== 'undefined' && ExamTimer.isRunning && 
            typeof UserState !== 'undefined' && Object.keys(UserState.userAnswers).length > 0) {
            
            // Auto-save before leaving
            this.autoSaveProgress();
            
            // Show warning
            e.preventDefault();
            e.returnValue = 'You have unsaved answers. Are you sure you want to leave?';
            return e.returnValue;
        }
    },
    
    handleVisibilityChange: function() {
        if (document.hidden) {
            // Tab switched away - auto save
            this.autoSaveProgress();
            console.log('📱 Tab switched away - auto-saved progress');
        }
    },
    
    handlePageLoad: function() {
        console.log('📄 Page fully loaded');
        // Additional initialization after everything is loaded
        setTimeout(() => {
            this.finalizeInitialization();
        }, 1000);
    },
    
    autoSaveProgress: function() {
        if (typeof UserState === 'undefined' || UserState.examSubmitted) return;
        
        const progress = {
            answers: UserState.userAnswers,
            currentQuestion: UserState.currentQuestionId,
            timestamp: new Date().toISOString(),
            sessionId: localStorage.getItem('examSessionId')
        };
        
        try {
            localStorage.setItem('examProgress', JSON.stringify(progress));
            console.log('💾 Auto-saved progress');
        } catch (error) {
            console.error('❌ Error auto-saving:', error);
        }
    },
    
    updateStatsDisplay: function() {
        // Initial stats update
        setTimeout(() => {
            if (typeof GridRenderer !== 'undefined') {
                GridRenderer.updateStats();
            }
        }, 500);
    },
    
    showMenuScreen: function() {
        const menuScreen = document.getElementById('menuScreen');
        const questionScreen = document.getElementById('questionScreen');
        const navFooter = document.getElementById('navFooter');
        
        if (menuScreen) menuScreen.style.display = 'flex';
        if (questionScreen) questionScreen.style.display = 'none';
        if (navFooter) navFooter.style.display = 'none';
        
        // Update grid to show answered questions
        setTimeout(() => {
            if (typeof GridRenderer !== 'undefined') {
                GridRenderer.updateGridColors();
            }
        }, 100);
        
        console.log('📊 Showing menu screen (grid view)');
    },
    
    showQuestionScreen: function() {
        const menuScreen = document.getElementById('menuScreen');
        const questionScreen = document.getElementById('questionScreen');
        const navFooter = document.getElementById('navFooter');
        
        if (menuScreen) menuScreen.style.display = 'none';
        if (questionScreen) questionScreen.style.display = 'flex';
        if (navFooter) navFooter.style.display = 'flex';
        
        console.log('📖 Showing question screen');
    },
    
    initializeGrid: function() {
        // Wait for questions to load, then initialize grid
        setTimeout(() => {
            if (typeof GridRenderer !== 'undefined') {
                GridRenderer.init();
                
                // Verify state
                if (typeof UserState !== 'undefined') {
                    const answersCount = Object.keys(UserState.userAnswers).length;
                    console.log(`🔍 Initial state: ${answersCount} answers loaded`);
                    
                    if (answersCount > 0) {
                        console.log('📝 Answers found, grid will show them as answered');
                    }
                }
            } else {
                console.error('❌ GridRenderer not available');
            }
        }, 2000);
    },
    
    startTimer: function() {
        // Wait a bit then start timer
        setTimeout(() => {
            if (typeof ExamTimer !== 'undefined') {
                ExamTimer.init();
                console.log('⏰ Timer started');
            }
        }, 3000);
    },
    
    finalizeInitialization: function() {
        console.log('🎉 Finalizing initialization...');
        
        // Double-check all modules are ready
        const modules = [
            { name: 'UserState', obj: UserState },
            { name: 'QuestionsManager', obj: QuestionsManager },
            { name: 'GridRenderer', obj: GridRenderer },
            { name: 'QuestionLoader', obj: QuestionLoader },
            { name: 'SelectionHandler', obj: SelectionHandler },
            { name: 'ExamTimer', obj: ExamTimer },
            { name: 'MediaController', obj: MediaController }
        ];
        
        modules.forEach(module => {
            if (module.obj) {
                console.log(`✅ ${module.name} is ready`);
            } else {
                console.warn(`⚠️ ${module.name} is not available`);
            }
        });
        
        // Final stats update
        this.updateStatsDisplay();
        
        // Show welcome message
        this.showWelcomeMessage();
    },
    
    showWelcomeMessage: function() {
        if (typeof UserState !== 'undefined') {
            const answeredCount = Object.keys(UserState.userAnswers).length;
            if (answeredCount > 0) {
                console.log(`👋 Welcome back! You have ${answeredCount} saved answers`);
            } else {
                console.log('👋 Welcome! Start your exam');
            }
        }
    },
    
    // Public methods for other modules to call
    navigateToQuestion: function(questionId) {
        if (questionId >= 1 && questionId <= 40) {
            console.log(`🔗 Navigating to question ${questionId}`);
            
            // Save current state before navigation
            this.autoSaveProgress();
            
            // Stop any playing audio
            if (typeof MediaController !== 'undefined') {
                MediaController.stopAllAudio();
            }
            
            // Load the question
            if (typeof QuestionLoader !== 'undefined') {
                QuestionLoader.loadQuestion(questionId, true);
                this.showQuestionScreen();
            }
        }
    },
    
    navigateToGrid: function() {
        console.log('🔗 Navigating to grid view');
        this.showMenuScreen();
        this.autoSaveProgress();
        
        // Stop any playing audio
        if (typeof MediaController !== 'undefined') {
            MediaController.stopAllAudio();
        }
    },
    
    submitExam: function() {
        console.log('📤 Submitting exam...');
        
        // Stop timer
        if (typeof ExamTimer !== 'undefined') {
            ExamTimer.stop();
        }
        
        // Stop all audio
        if (typeof MediaController !== 'undefined') {
            MediaController.stopAllAudio();
        }
        
        // Save final progress
        this.autoSaveProgress();
        
        // Call submit handler
        if (typeof ExamSubmit !== 'undefined') {
            ExamSubmit.submitExam();
        }
        
        // Clear session data after submission
        setTimeout(() => {
            this.clearAllSavedData();
        }, 1000);
    },
    
    // Debug/development helper
    debugState: function() {
        console.group('🔍 Debug State');
        if (typeof UserState !== 'undefined') {
            console.log('UserState:', UserState);
            console.log('User Answers:', UserState.userAnswers);
            console.log('Current Question:', UserState.currentQuestionId);
            console.log('Total Answers:', Object.keys(UserState.userAnswers).length);
        }
        console.groupEnd();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    
    // Small delay to ensure all scripts are loaded
    setTimeout(() => {
        AppLoader.init();
    }, 100);
});

// Make AppLoader globally available
window.AppLoader = AppLoader;