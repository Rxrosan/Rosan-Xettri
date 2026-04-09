// questions-manager.js - FIXED: Uses set-3.js directly
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
        
        // Load questions from window.questions (set-3.js)
        this.loadQuestionsFromWindow();
        
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
    
    loadQuestionsFromWindow: function() {
        console.log('📚 Loading questions from window.questions...');
        
        // Check if questions are available from set-3.js
        if (window.questions && Array.isArray(window.questions)) {
            console.log(`✅ Found ${window.questions.length} questions in window.questions`);
            this.processQuestionsArray(window.questions);
            this.finalizeLoading();
        } else {
            console.error('❌ window.questions not found! Make sure set-3.js is loaded before questions-manager.js');
            this.createFallbackQuestions();
            this.finalizeLoading();
        }
    },
    
    processQuestionsArray: function(questionsArray) {
        console.log('📝 Processing questions array...');
        
        // Group questions by their ID (each ID can have multiple variations)
        const questionsById = {};
        
        questionsArray.forEach(question => {
            const id = question.id;
            if (!questionsById[id]) {
                questionsById[id] = [];
            }
            questionsById[id].push(question);
        });
        
        // Register each question number with its variations
        for (let i = 1; i <= this.totalQuestions; i++) {
            if (questionsById[i] && questionsById[i].length > 0) {
                this.questionsByNumber[i] = questionsById[i];
                this.loadedCount++;
                console.log(`✅ Q${i}: ${questionsById[i].length} variation(s) loaded`);
            } else {
                console.warn(`⚠️ Q${i}: No questions found`);
                this.questionErrors[i] = {
                    error: 'Missing',
                    message: `Question ${i} not found`
                };
            }
        }
        
        console.log(`📊 Processed: ${this.loadedCount}/40 questions available`);
    },
    
    createFallbackQuestions: function() {
        console.log('🔄 Creating fallback questions for all 40 questions');
        
        for (let i = 1; i <= this.totalQuestions; i++) {
            this.questionsByNumber[i] = [
                {
                    id: i,
                    instruction: { text: `${i}. 다음 질문에 맞는 답을 고르십시오.`, image: null, audio: null },
                    questionBody: { text: `문제 ${i}의 내용입니다.`, image: null, audio: null },
                    options: [
                        { text: "선택지 1", image: null, audio: null },
                        { text: "선택지 2", image: null, audio: null },
                        { text: "선택지 3", image: null, audio: null },
                        { text: "선택지 4", image: null, audio: null }
                    ],
                    answer: 1
                }
            ];
            this.loadedCount++;
        }
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
        
        console.log(`🎲 Q${questionNumber}: Selected variation ${randomIndex + 1} of ${questions.length}`);
        return true;
    },
    
    finalizeLoading: function() {
        console.log('📊 Finalizing loading...');
        console.log(`   Questions available: ${Object.keys(this.questionsByNumber).length}/40`);
        
        // Auto-select all questions that have data
        for (let i = 1; i <= this.totalQuestions; i++) {
            if (this.questionsByNumber[i] && !this.selectedQuestions[i]) {
                this.selectQuestionForDisplay(i);
            }
        }
        
        console.log(`   Selected questions: ${Object.keys(this.selectedQuestions).length}/40`);
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
            return {
                status: 'loaded',
                message: `${this.questionsByNumber[questionNumber].length} variation(s)`,
                selected: !!this.selectedQuestions[questionNumber]
            };
        }
        
        return { status: 'not-loaded', message: 'Question not found' };
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
        this.loadQuestionsFromWindow();
        return this.currentExamSessionId;
    },
    
    markExamSubmitted: function() {
        console.log('📤 Exam marked as submitted');
        this.selectedQuestions = {};
        localStorage.removeItem('examSelections');
    }
};

window.QuestionsManager = QuestionsManager;