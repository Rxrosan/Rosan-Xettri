// questions-manager.js - High Performance Mobile-Optimized
const QuestionsManager = {
    // Arrays are 3x faster than Objects for indexing on mobile
    questionsByNumber: Array(41).fill(null).map(() => []),
    selectedQuestions: Array(41).fill(null),
    questionErrors: Array(41).fill(null),
    totalQuestions: 40,
    loadedCount: 0,
    isLoading: false,

    init: function() {
        this.reset();
        localStorage.removeItem('examSelections');
        this.loadAllQuestions();
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

    loadAllQuestions: function() {
        this.isLoading = true;
        const promises = [];

        // Load all 40 files in parallel
        for (let i = 1; i <= this.totalQuestions; i++) {
            promises.push(this.loadQuestionFile(i));
        }

        // Wait for all to finish (or fail) naturally
        // No more blind 2000ms timeout
        Promise.allSettled(promises).then(() => {
            this.isLoading = false;
            this.finalizeLoading();
        });
    },

    loadQuestionFile: function(num) {
        return new Promise((resolve) => {
            const fileName = `RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-1-FILES/RX-EXAM-QUESTION-JS/qs-no-${num}.js`;
            const script = document.createElement('script');
            script.src = fileName;
            script.async = true; // True allows parallel download on mobile

            script.onload = () => {
                this.loadedCount++;
                // Micro-task to check if data was actually registered
                queueMicrotask(() => {
                    if (this.questionsByNumber[num].length === 0) {
                        this.questionErrors[num] = "Empty data";
                    }
                    resolve();
                });
            };

            script.onerror = () => {
                this.questionErrors[num] = "File missing";
                resolve(); // Resolve anyway to let the app continue
            };

            document.head.appendChild(script);
        });
    },

    registerQuestions: function(num, questionsArray) {
        if (num > 0 && num <= 40 && Array.isArray(questionsArray)) {
            this.questionsByNumber[num] = questionsArray;
            this.questionErrors[num] = null;
        }
    },

    finalizeLoading: function() {
        const qByNum = this.questionsByNumber;
        const selQ = this.selectedQuestions;

        for (let i = 1; i <= 40; i++) {
            const variations = qByNum[i];
            const vLen = variations.length;
            if (vLen > 0) {
                // Bitwise OR is faster than Math.floor for mobile
                selQ[i] = variations[(Math.random() * vLen) | 0];
            }
        }
        this.updateUI();
    },

    updateUI: function() {
        if (window.GridRenderer) {
            // Ensure UI update happens on the next animation frame
            requestAnimationFrame(() => {
                GridRenderer.updateGridColors();
                GridRenderer.updateStats();
            });
        }
    },

    getQuestion: function(num) {
        const error = this.questionErrors[num];
        if (error) return { id: num, hasError: true, error: { message: error } };
        return this.selectedQuestions[num] || { id: num, hasError: true, error: { message: 'Loading...' } };
    },

    getQuestionStatus: function(num) {
        if (this.questionErrors[num]) return { status: 'error', message: this.questionErrors[num] };
        if (this.selectedQuestions[num]) return { status: 'loaded' };
        if (this.isLoading) return { status: 'loading' };
        return { status: 'not-loaded' };
    },

    reselectQuestion: function(num) {
        const vars = this.questionsByNumber[num];
        if (!vars || vars.length === 0) return false;
        this.selectedQuestions[num] = vars[(Math.random() * vars.length) | 0];
        return true;
    },

    startFreshExam: function() {
        this.reset();
        this.loadAllQuestions();
        return 'exam-' + Date.now();
    }
};

// Global helper used by the individual question JS files
window.registerQuestionSet = function(num, questionsArray) {
    QuestionsManager.registerQuestions(num, questionsArray);
};

window.QuestionsManager = QuestionsManager;