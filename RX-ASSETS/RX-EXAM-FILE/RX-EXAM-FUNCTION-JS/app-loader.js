// app-loader.js - COMPLETE REWRITE
const AppLoader = {
    init: function() {
        console.log('🚀 AppLoader.init() - Starting exam system');
        
        // PROTECT LOGIN DATA - Only clear exam data
        this.clearExamDataOnly();
        
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
        
        console.log('✅ AppLoader initialized successfully (login preserved)');
    },
    
    clearExamDataOnly: function() {
        // Only clear exam-specific localStorage
        const examKeys = [
            'examProgress',
            'examSelections',
            'examSession',
            'examTimer',
            'examAudioStates'
        ];
        
        examKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Create new exam session
        const newSessionId = 'exam-' + Date.now();
        localStorage.setItem('examSession', newSessionId);
        
        console.log('✅ Exam data cleared (login preserved)');
    },
    
    loadSavedProgress: function() {
        try {
            const savedProgress = localStorage.getItem('examProgress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                console.log('📥 Loading saved exam progress:', progress);
                
                if (progress.answers && UserState) {
                    UserState.userAnswers = progress.answers;
                    console.log(`📊 Loaded ${Object.keys(progress.answers).length} saved answers`);
                }
                
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
        
        if (typeof UserState !== 'undefined') {
            UserState.init();
            console.log('✅ UserState initialized');
        }
        
        if (typeof QuestionsManager !== 'undefined') {
            QuestionsManager.init();
            console.log('✅ QuestionsManager initialized');
        }
    },
    
    initMediaController: function() {
        setTimeout(() => {
            if (typeof MediaController !== 'undefined') {
                MediaController.init();
                console.log('✅ MediaController initialized');
            }
        }, 1500);
    },
    
    setupUI: function() {
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) {
            userNameEl.textContent = 'Rosan kc';
        }
        
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.textContent = '50:00';
        }
        
        this.updateStatsDisplay();
    },
    
    setupEventListeners: function() {
        console.log('🔗 Setting up event listeners');
        
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        setInterval(this.autoSaveProgress.bind(this), 30000);
        
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        window.addEventListener('load', this.handlePageLoad.bind(this));
    },
    
    handleBeforeUnload: function(e) {
        if (typeof ExamTimer !== 'undefined' && ExamTimer.isRunning && 
            typeof UserState !== 'undefined' && Object.keys(UserState.userAnswers).length > 0) {
            
            this.autoSaveProgress();
            
            e.preventDefault();
            e.returnValue = 'You have unsaved answers. Are you sure you want to leave?';
            return e.returnValue;
        }
    },
    
    handleVisibilityChange: function() {
        if (document.hidden) {
            this.autoSaveProgress();
            console.log('📱 Tab switched away - auto-saved progress');
        }
    },
    
    handlePageLoad: function() {
        console.log('📄 Page fully loaded');
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
            sessionId: localStorage.getItem('examSession')
        };
        
        try {
            localStorage.setItem('examProgress', JSON.stringify(progress));
            console.log('💾 Auto-saved exam progress');
        } catch (error) {
            console.error('❌ Error auto-saving:', error);
        }
    },
    
    updateStatsDisplay: function() {
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
        setTimeout(() => {
            if (typeof GridRenderer !== 'undefined') {
                GridRenderer.init();
                
                if (typeof UserState !== 'undefined') {
                    const answersCount = Object.keys(UserState.userAnswers).length;
                    console.log(`🔍 Initial state: ${answersCount} answers loaded`);
                }
            } else {
                console.error('❌ GridRenderer not available');
            }
        }, 2000);
    },
    
    startTimer: function() {
        setTimeout(() => {
            if (typeof ExamTimer !== 'undefined') {
                ExamTimer.init();
                console.log('⏰ Timer started');
            }
        }, 3000);
    },
    
    finalizeInitialization: function() {
        console.log('🎉 Finalizing initialization...');
        
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
        
        this.updateStatsDisplay();
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
    
    navigateToQuestion: function(questionId) {
        if (questionId >= 1 && questionId <= 40) {
            console.log(`🔗 Navigating to question ${questionId}`);
            
            this.autoSaveProgress();
            
            if (typeof MediaController !== 'undefined') {
                MediaController.stopAllAudio();
            }
            
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
        
        if (typeof MediaController !== 'undefined') {
            MediaController.stopAllAudio();
        }
    },
    
    submitExam: function() {
        console.log('📤 Submitting exam...');
        
        if (typeof ExamTimer !== 'undefined') {
            ExamTimer.stop();
        }
        
        if (typeof MediaController !== 'undefined') {
            MediaController.stopAllAudio();
        }
        
        this.autoSaveProgress();
        
        if (typeof ExamSubmit !== 'undefined') {
            ExamSubmit.submitExam();
        }
        
        setTimeout(() => {
            this.clearExamDataOnly();
        }, 1000);
    },
    
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    
    setTimeout(() => {
        AppLoader.init();
    }, 100);
});

window.AppLoader = AppLoader;