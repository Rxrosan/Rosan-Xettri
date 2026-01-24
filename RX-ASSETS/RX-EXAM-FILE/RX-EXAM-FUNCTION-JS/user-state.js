// user-state.js - Manages global user state
const UserState = {
    currentQuestionId: 1,
    userAnswers: {},
    examSubmitted: false,
    isInitialized: false,
    
    init: function() {
        console.log('🔄 UserState.init() - Starting fresh session');
        
        // ALWAYS start fresh - no saved progress
        this.reset();
        
        // Clear any saved progress from localStorage
        localStorage.removeItem('examProgress');
        localStorage.removeItem('questionSelections');
        localStorage.removeItem('lastExamSubmitted');
        localStorage.removeItem('examSessionId');
        
        this.isInitialized = true;
        console.log('✅ UserState initialized - Fresh session started');
    },
    
    reset: function() {
        this.currentQuestionId = 1;
        this.userAnswers = {};
        this.examSubmitted = false;
        console.log('🔄 UserState reset to initial values');
    },
    
    getCurrentQuestionId: function() {
        return this.currentQuestionId;
    },
    
    setCurrentQuestionId: function(id) {
        this.currentQuestionId = id;
    },
    
    getUserAnswers: function() {
        return this.userAnswers;
    },
    
    setUserAnswer: function(questionId, answer) {
        // Only save if exam is not submitted
        if (!this.examSubmitted) {
            this.userAnswers[questionId] = answer;
            // DO NOT auto-save to localStorage - we want fresh start on refresh
            console.log(`💾 Answer saved for Q${questionId}: ${answer}`);
        }
    },
    
    clearUserAnswer: function(questionId) {
        delete this.userAnswers[questionId];
        console.log(`🗑️ Answer cleared for Q${questionId}`);
    },
    
    getAnswerForQuestion: function(questionId) {
        return this.userAnswers[questionId];
    },
    
    markExamSubmitted: function() {
        this.examSubmitted = true;
        this.reset();
        console.log('📤 Exam marked as submitted - All answers cleared');
    }
};