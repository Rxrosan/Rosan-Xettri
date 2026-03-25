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
        
        this.reset();
        
        // Clear only exam selections
        localStorage.removeItem('examSelections');
        
        // Load all question files
        this.loadAllQuestions();
        
        return this;
    },
    
    reset: function() {
        this.questionsByNumber = {};
        this.selectedQuestions = {};
        this.questionErrors = {};
        this.loadedCount = 0;
        this.isNewExamSession = true;
        this.currentExamSessionId = 'exam-' + Date.now();
        console.log('🔄 QuestionsManager reset');
    },
    
    loadAllQuestions: function() {
        console.log('📚 Loading question files...');
        this.isLoading = true;
        
        for (let i = 1; i <= this.totalQuestions; i++) {
            this.loadQuestionFile(i);
        }
        
        setTimeout(() => {
            this.isLoading = false;
            this.finalizeLoading();
        }, 2000);
    },
    
    loadQuestionFile: function(questionNumber) {
        const fileName = `RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-1-FILES/RX-EXAM-QUESTION-JS/qs-no-${questionNumber}.js`;
        
        const script = document.createElement('script');
        script.src = fileName;
        script.async = false;
        script.dataset.questionNumber = questionNumber;
        
        script.onload = () => {
            console.log(`✅ Loaded: qs-no-${questionNumber}.js`);
            this.loadedCount++;
            
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
    
    registerQuestions: function(questionNumber, questionsArray) {
        console.log(`📝 Registering Q${questionNumber}`);
        
        if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
            console.error(`❌ Q${questionNumber}: Invalid questions array`);
            this.questionErrors[questionNumber] = {
                error: 'Invalid format',
                message: 'Question file format error'
            };
            return;
        }
        
        this.questionsByNumber[questionNumber] = questionsArray;
        delete this.questionErrors[questionNumber];
        
        console.log(`✅ Q${questionNumber}: ${questionsArray.length} variations available`);
    },
    
    selectQuestionForDisplay: function(questionNumber) {
        const questions = this.questionsByNumber[questionNumber];
        
        if (!questions || questions.length === 0) {
            console.warn(`⚠️ Cannot select Q${questionNumber}: No questions`);
            return false;
        }
        
        if (this.selectedQuestions[questionNumber]) {
            console.log(`🎯 Q${questionNumber}: Using existing selection`);
            return true;
        }
        
        const randomIndex = Math.floor(Math.random() * questions.length);
        this.selectedQuestions[questionNumber] = questions[randomIndex];
        
        console.log(`🎲 Q${questionNumber}: Randomly selected variation ${randomIndex + 1}`);
        return true;
    },
    
    finalizeLoading: function() {
        console.log('📊 Loading complete:');
        console.log(`   Files loaded: ${this.loadedCount}/40`);
        console.log(`   Questions available: ${Object.keys(this.questionsByNumber).length}/40`);
        console.log(`   Selected questions: ${Object.keys(this.selectedQuestions).length}`);
        
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
    
    getQuestion: function(questionNumber) {
        if (this.questionErrors[questionNumber]) {
            return {
                id: questionNumber,
                hasError: true,
                error: this.questionErrors[questionNumber]
            };
        }
        
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
    
    reselectQuestion: function(questionNumber) {
        console.log(`🔄 Reselecting random question for Q${questionNumber}`);
        
        const questions = this.questionsByNumber[questionNumber];
        if (!questions || questions.length === 0) return false;
        
        const randomIndex = Math.floor(Math.random() * questions.length);
        this.selectedQuestions[questionNumber] = questions[randomIndex];
        
        console.log(`🎯 Q${questionNumber}: New variation ${randomIndex + 1}`);
        return true;
    },
    
    startFreshExam: function() {
        console.log('🆕 Starting fresh exam');
        this.reset();
        this.selectedQuestions = {};
        return this.currentExamSessionId;
    },
    
    markExamSubmitted: function() {
        console.log('📤 Exam marked as submitted in QuestionsManager');
        this.selectedQuestions = {};
        localStorage.removeItem('examSelections');
    }
};

function registerQuestionSet(questionNumber, questionsArray) {
    if (typeof QuestionsManager !== 'undefined') {
        QuestionsManager.registerQuestions(questionNumber, questionsArray);
    } else {
        console.error(`❌ QuestionsManager not ready`);
        window[`_pendingQuestion${questionNumber}`] = questionsArray;
    }
}

window.QuestionsManager = QuestionsManager;
window.registerQuestionSet = registerQuestionSet;