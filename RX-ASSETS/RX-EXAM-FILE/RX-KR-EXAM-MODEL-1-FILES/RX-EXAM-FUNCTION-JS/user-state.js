// user-state.js - Manages global user state
const UserState = {
    currentQuestionId: 1,
    userAnswers: {},
    examSubmitted: false,
    isInitialized: false,
    
    init: function() {
        console.log('🔄 UserState.init() - Starting fresh exam session');
        
        // PRESERVE LOGIN - Only clear exam data
        this.currentQuestionId = 1;
        this.userAnswers = {};
        this.examSubmitted = false;
        
        // Clear only exam-specific localStorage
        this.clearExamStorageOnly();
        
        this.isInitialized = true;
        console.log('✅ UserState initialized - Login preserved');
    },
    
    clearExamStorageOnly: function() {
        // Only remove exam-related localStorage items
        const examKeys = [
            'examProgress',
            'examSelections',
            'examAudioStates',
            'examSession',
            'examSubmitted',
            'examTimer'
        ];
        
        examKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                console.log(`🧹 Removed exam key: ${key}`);
            }
        });
        
        // Keep these login/session keys ALWAYS:
        const preserveKeys = [
            'userToken',
            'userSession',
            'loginState',
            'userId',
            'userName',
            'authToken',
            'isLoggedIn',
            'rememberMe',
            'sessionId'
        ];
        
        console.log('✅ Exam storage cleared (login preserved)');
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
        if (!this.examSubmitted) {
            this.userAnswers[questionId] = answer;
            // Save to exam storage
            this.saveExamProgress();
            console.log(`💾 Answer saved for Q${questionId}: ${answer}`);
        }
    },
    
    saveExamProgress: function() {
        const examProgress = {
            answers: this.userAnswers,
            currentQuestion: this.currentQuestionId,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('examProgress', JSON.stringify(examProgress));
    },
    
    clearUserAnswer: function(questionId) {
        delete this.userAnswers[questionId];
        this.saveExamProgress();
        console.log(`🗑️ Answer cleared for Q${questionId}`);
    },
    
    getAnswerForQuestion: function(questionId) {
        return this.userAnswers[questionId];
    },
    
    markExamSubmitted: function() {
        this.examSubmitted = true;
        this.clearExamStorageOnly();
        console.log('📤 Exam marked as submitted');
    }
};