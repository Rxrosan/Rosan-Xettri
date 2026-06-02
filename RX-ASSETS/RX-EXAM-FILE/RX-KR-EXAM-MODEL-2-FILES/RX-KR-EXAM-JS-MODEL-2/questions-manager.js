// questions-manager.js - Ultra-Fast Performance Optimized
const QuestionsManager = {
    questionsByNumber: Array(41).fill(null).map(() => []), // Pre-allocate array
    selectedQuestions: Array(41).fill(null),
    questionErrors: {},
    totalQuestions: 40,
    loadedCount: 0,

    init: function() {
        this.reset();
        localStorage.removeItem('examSelections');
        
        // Direct loading for speed
        if (window.questions && Array.isArray(window.questions)) {
            this.processQuestionsArray(window.questions);
        } else {
            console.error('❌ Questions source missing');
            // No fallback object created here as requested
        }
        
        this.finalizeLoading();
        return this;
    },
    
    reset: function() {
        this.questionsByNumber = Array(41).fill(null).map(() => []);
        this.selectedQuestions = Array(41).fill(null);
        this.questionErrors = {};
        this.loadedCount = 0;
    },
    
    processQuestionsArray: function(questionsArray) {
        // Single loop pass is the fastest way to process data
        for (let i = 0, len = questionsArray.length; i < len; i++) {
            const q = questionsArray[i];
            const id = q.id;
            if (id > 0 && id <= this.totalQuestions) {
                this.questionsByNumber[id].push(q);
            }
        }
    },
    
    finalizeLoading: function() {
        // Map questions and pick variations in one quick pass
        for (let i = 1; i <= this.totalQuestions; i++) {
            const variations = this.questionsByNumber[i];
            if (variations.length > 0) {
                // Inline selection logic for speed
                const randomIndex = (variations.length === 1) ? 0 : Math.floor(Math.random() * variations.length);
                this.selectedQuestions[i] = variations[randomIndex];
                this.loadedCount++;
            } else {
                this.questionErrors[i] = { message: `Question ${i} missing` };
            }
        }
        this.updateUI();
    },
    
    updateUI: function() {
        if (window.GridRenderer) {
            // requestAnimationFrame is faster than setTimeout(100)
            requestAnimationFrame(() => {
                GridRenderer.updateGridColors();
                GridRenderer.updateStats();
            });
        }
    },
    
    getQuestion: function(num) {
        if (this.questionErrors[num]) return { id: num, hasError: true, error: this.questionErrors[num] };
        return this.selectedQuestions[num] || { id: num, hasError: true, error: { message: 'Not found' } };
    },
    
    getQuestionStatus: function(num) {
        if (this.questionErrors[num]) return { status: 'error', message: this.questionErrors[num].message };
        if (this.selectedQuestions[num]) return { status: 'loaded' };
        return { status: 'not-loaded', message: 'Empty' };
    },
    
    reselectQuestion: function(num) {
        const vars = this.questionsByNumber[num];
        if (!vars || vars.length === 0) return false;
        this.selectedQuestions[num] = vars[Math.floor(Math.random() * vars.length)];
        return true;
    },
    
    startFreshExam: function() {
        this.init();
        return 'exam-' + Date.now();
    },
    
    markExamSubmitted: function() {
        this.selectedQuestions = Array(41).fill(null);
        localStorage.removeItem('examSelections');
    }
};

window.QuestionsManager = QuestionsManager;