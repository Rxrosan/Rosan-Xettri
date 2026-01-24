// timer.js - Handles exam timer
const ExamTimer = {
    timeLeft: 50 * 60, // 50 minutes in seconds
    timerInterval: null,
    isRunning: false,
    
    init: function() {
        this.updateDisplay();
        this.start();
    },
    
    start: function() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.timerInterval = setInterval(() => {
            this.tick();
        }, 1000);
    },
    
    tick: function() {
        if (this.timeLeft <= 0) {
            this.stop();
            ExamSubmit.submitExam(); // This will show alert without redirect
            return;
        }
        
        this.timeLeft--;
        this.updateDisplay();
        
        // Auto-save progress every 30 seconds
        if (this.timeLeft % 30 === 0) {
            this.autoSave();
        }
    },
    
    stop: function() {
        this.isRunning = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },
    
    updateDisplay: function() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timerEl = document.getElementById('timer');
        
        if (timerEl) {
            timerEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            // Add warning class when less than 5 minutes
            if (this.timeLeft < 5 * 60) {
                timerEl.style.color = '#e74c3c';
                timerEl.style.fontWeight = 'bold';
            } else {
                timerEl.style.color = ''; // Reset color
                timerEl.style.fontWeight = '';
            }
        }
    },
    
    addTime: function(seconds) {
        this.timeLeft += seconds;
        this.updateDisplay();
    },
    
    getTimeRemaining: function() {
        return this.timeLeft;
    },
    
    getFormattedTime: function() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    
    autoSave: function() {
        // Save user progress to localStorage
        const progress = {
            answers: UserState.userAnswers,
            currentQuestion: UserState.currentQuestionId,
            timeRemaining: this.timeLeft,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('examProgress', JSON.stringify(progress));
    },
    
    loadSavedProgress: function() {
        const saved = localStorage.getItem('examProgress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                
                // Restore time if within reasonable limits
                if (progress.timeRemaining && progress.timeRemaining > 0) {
                    this.timeLeft = progress.timeRemaining;
                }
                
                return true;
            } catch (e) {
                console.error('Error loading saved progress:', e);
            }
        }
        return false;
    }
};