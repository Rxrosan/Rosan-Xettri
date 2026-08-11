// questions-manager.js - Mobile-First High Performance Optimized
const QuestionsManager = {
    // Pre-allocate with a simple array. Arrays are faster than Objects on mobile.
    questionsByNumber: [],
    selectedQuestions: [],
    questionErrors: [],
    totalQuestions: 40,
    loadedCount: 0,

    init: function() {
        // Use a standard for-loop to initialize. map/fill is slower on older mobile Safari/Chrome.
        this.questionsByNumber = new Array(41);
        this.selectedQuestions = new Array(41);
        this.questionErrors = new Array(41);
        
        for (let i = 0; i <= 40; i++) {
            this.questionsByNumber[i] = [];
            this.selectedQuestions[i] = null;
            this.questionErrors[i] = null;
        }

        localStorage.removeItem('examSelections');
        
        // Execute loading in a "non-blocking" way for mobile
        // This prevents the mobile browser from freezing during load
        if (window.questions) {
            this.processQuestionsArray(window.questions);
            this.finalizeLoading();
        } else {
            // Check again in 50ms in case set-3.js is still parsing (common on slow mobile)
            setTimeout(() => {
                if (window.questions) {
                    this.processQuestionsArray(window.questions);
                    this.finalizeLoading();
                }
            }, 50);
        }
        
        return this;
    },
    
    reset: function() {
        for (let i = 0; i <= 40; i++) {
            this.questionsByNumber[i] = [];
            this.selectedQuestions[i] = null;
            this.questionErrors[i] = null;
        }
        this.loadedCount = 0;
    },
    
    processQuestionsArray: function(questionsArray) {
        // Cached length for performance
        const len = questionsArray.length;
        const qByNum = this.questionsByNumber;
        const total = this.totalQuestions;

        for (let i = 0; i < len; i++) {
            const q = questionsArray[i];
            const id = q.id;
            // Direct array access is the fastest possible way to sort data
            if (id > 0 && id <= total) {
                qByNum[id].push(q);
            }
        }
    },
    
    finalizeLoading: function() {
        const qByNum = this.questionsByNumber;
        const selQ = this.selectedQuestions;
        const errors = this.questionErrors;
        let count = 0;

        for (let i = 1; i <= 40; i++) {
            const variations = qByNum[i];
            const vLen = variations.length;
            
            if (vLen > 0) {
                // Inline random selection - Optimized for mobile Math.random
                if (vLen === 1) {
                    selQ[i] = variations[0];
                } else {
                    selQ[i] = variations[(Math.random() * vLen) | 0]; // Bitwise OR is faster than Math.floor
                }
                count++;
            } else {
                errors[i] = "Question " + i + " missing";
            }
        }
        this.loadedCount = count;
        this.updateUI();
    },
    
    updateUI: function() {
        // Use a tiny timeout to let the mobile browser finish internal tasks 
        // before we tell the GridRenderer to draw
        setTimeout(() => {
            if (window.GridRenderer) {
                GridRenderer.updateGridColors();
                GridRenderer.updateStats();
            }
        }, 0);
    },
    
    getQuestion: function(num) {
        if (this.questionErrors[num]) return { id: num, hasError: true, error: { message: this.questionErrors[num] } };
        return this.selectedQuestions[num] || { id: num, hasError: true, error: { message: 'Not found' } };
    },
    
    getQuestionStatus: function(num) {
        if (this.questionErrors[num]) return { status: 'error', message: this.questionErrors[num] };
        if (this.selectedQuestions[num]) return { status: 'loaded' };
        return { status: 'not-loaded' };
    },
    
    reselectQuestion: function(num) {
        const vars = this.questionsByNumber[num];
        if (!vars || vars.length === 0) return false;
        this.selectedQuestions[num] = vars[(Math.random() * vars.length) | 0];
        return true;
    },
    
    startFreshExam: function() {
        this.init();
        return 'exam-' + Date.now();
    },
    
    markExamSubmitted: function() {
        this.selectedQuestions.fill(null);
        localStorage.removeItem('examSelections');
    }
};

window.QuestionsManager = QuestionsManager;