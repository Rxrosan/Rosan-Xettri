// ============================================================
// QUESTIONS MANAGER - NO AUTO-SELECTION VERSION
// ============================================================

const QuestionsManager = {
    questionsByNumber: {},
    selectedQuestions: {},
    questionErrors: {},
    currentExamSessionId: null,
    isNewExamSession: true,
    isLoading: false,
    loadedCount: 0,
    totalQuestions: 40,
    
    init: function() {
        console.log('🚀 QuestionsManager.init() - Starting fresh');
        
        // ALWAYS start fresh - clear everything
        this.reset();
        
        // Clear any saved selections
        localStorage.removeItem('questionSelections');
        localStorage.removeItem('examSessionId');
        
        // Load all question files (no auto-selection)
        this.loadAllQuestions();
        
        return this;
    },
    
    reset: function() {
        this.questionsByNumber = {};
        this.selectedQuestions = {}; // EMPTY - no auto-selection
        this.questionErrors = {};
        this.loadedCount = 0;
        this.isNewExamSession = true;
        this.currentExamSessionId = 'fresh-' + Date.now();
        console.log('🔄 QuestionsManager reset - No questions selected');
    },
    
    loadAllQuestions: function() {
        console.log('📚 Loading question files (no auto-selection)...');
        this.isLoading = true;
        
        // Load each question file
        for (let i = 1; i <= this.totalQuestions; i++) {
            this.loadQuestionFile(i);
        }
        
        // Check loading status after delay
        setTimeout(() => {
            this.isLoading = false;
            this.finalizeLoading();
        }, 2000);
    },
    
    loadQuestionFile: function(questionNumber) {
        const fileName = `RX-ASSETS/RX-EXAM-FILE/RX-EXAM-QUESTION-JS/qs-no-${questionNumber}.js`;
        
        const script = document.createElement('script');
        script.src = fileName;
        script.async = false;
        script.dataset.questionNumber = questionNumber;
        
        script.onload = () => {
            console.log(`✅ Loaded: qs-no-${questionNumber}.js`);
            this.loadedCount++;
            
            // Check if questions were registered
            setTimeout(() => {
                if (!this.questionsByNumber[questionNumber]) {
                    console.warn(`⚠️ Q${questionNumber}: File loaded but no questions`);
                    this.questionErrors[questionNumber] = {
                        error: 'No questions',
                        message: 'File loaded but no questions found'
                    };
                }
            }, 100);
        };
        
        script.onerror = () => {
            console.error(`❌ Failed: qs-no-${questionNumber}.js`);
            this.questionErrors[questionNumber] = {
                error: 'File error',
                message: 'Could not load question file'
            };
        };
        
        document.head.appendChild(script);
    },
    
    // ============================================================
    // REGISTRATION - NO AUTO-SELECTION
    // ============================================================
    
    registerQuestions: function(questionNumber, questionsArray) {
        console.log(`📝 Registering Q${questionNumber} (no auto-select)`);
        
        if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
            console.error(`❌ Q${questionNumber}: Invalid questions array`);
            this.questionErrors[questionNumber] = {
                error: 'Invalid format',
                message: 'Question file format error'
            };
            return;
        }
        
        // Store questions but DO NOT auto-select
        this.questionsByNumber[questionNumber] = questionsArray;
        delete this.questionErrors[questionNumber];
        
        console.log(`✅ Q${questionNumber}: ${questionsArray.length} variations available`);
        
        // IMPORTANT: DO NOT select any question automatically
        // Questions will be selected only when needed
    },
    
    // Select question ONLY when explicitly requested
    selectQuestionForDisplay: function(questionNumber) {
        const questions = this.questionsByNumber[questionNumber];
        
        if (!questions || questions.length === 0) {
            console.warn(`⚠️ Cannot select Q${questionNumber}: No questions`);
            return false;
        }
        
        // If already selected, keep it
        if (this.selectedQuestions[questionNumber]) {
            console.log(`🎯 Q${questionNumber}: Using existing selection`);
            return true;
        }
        
        // Select random question for display
        const randomIndex = Math.floor(Math.random() * questions.length);
        this.selectedQuestions[questionNumber] = questions[randomIndex];
        
        console.log(`🎲 Q${questionNumber}: Randomly selected variation ${randomIndex + 1}`);
        return true;
    },
    
    finalizeLoading: function() {
        console.log('📊 Loading complete:');
        console.log(`   Files loaded: ${this.loadedCount}/40`);
        console.log(`   Questions available: ${Object.keys(this.questionsByNumber).length}/40`);
        console.log(`   Selected questions: ${Object.keys(this.selectedQuestions).length} (should be 0)`);
        
        // Update UI
        this.updateUI();
    },
    
    updateUI: function() {
        if (typeof GridRenderer !== 'undefined') {
            setTimeout(() => {
                GridRenderer.updateGridColors();
                GridRenderer.updateStats();
            }, 100);
        }
    },
    
    // ============================================================
    // PUBLIC API
    // ============================================================
    
    getQuestion: function(questionNumber) {
        // Check for errors
        if (this.questionErrors[questionNumber]) {
            return {
                id: questionNumber,
                hasError: true,
                error: this.questionErrors[questionNumber]
            };
        }
        
        // If not selected yet, select one now
        if (!this.selectedQuestions[questionNumber]) {
            const success = this.selectQuestionForDisplay(questionNumber);
            if (!success) {
                return {
                    id: questionNumber,
                    hasError: true,
                    error: { message: 'Question not available' }
                };
            }
        }
        
        return this.selectedQuestions[questionNumber];
    },
    
    getQuestionStatus: function(questionNumber) {
        if (this.questionErrors[questionNumber]) {
            return {
                status: 'error',
                message: this.questionErrors[questionNumber].message
            };
        }
        
        if (this.questionsByNumber[questionNumber]) {
            const isSelected = !!this.selectedQuestions[questionNumber];
            return {
                status: 'loaded',
                message: `${this.questionsByNumber[questionNumber].length} variations`,
                selected: isSelected
            };
        }
        
        if (this.isLoading) {
            return { status: 'loading', message: 'Loading...' };
        }
        
        return { status: 'not-loaded', message: 'File not found' };
    },
    
    // Force new random selection for a question
    reselectQuestion: function(questionNumber) {
        console.log(`🔄 Reselecting random question for Q${questionNumber}`);
        
        const questions = this.questionsByNumber[questionNumber];
        if (!questions || questions.length === 0) return false;
        
        const randomIndex = Math.floor(Math.random() * questions.length);
        this.selectedQuestions[questionNumber] = questions[randomIndex];
        
        console.log(`🎯 Q${questionNumber}: New variation ${randomIndex + 1}`);
        return true;
    },
    
    // Start fresh exam
    startFreshExam: function() {
        console.log('🆕 Starting fresh exam');
        this.reset();
        // Clear all selections
        this.selectedQuestions = {};
        return this.currentExamSessionId;
    }
};

// Global registration function
function registerQuestionSet(questionNumber, questionsArray) {
    if (typeof QuestionsManager !== 'undefined') {
        QuestionsManager.registerQuestions(questionNumber, questionsArray);
    } else {
        console.error(`❌ QuestionsManager not ready`);
        // Store for later
        window[`_pendingQuestion${questionNumber}`] = questionsArray;
    }
}

// Make globally available
window.QuestionsManager = QuestionsManager;
window.registerQuestionSet = registerQuestionSet;