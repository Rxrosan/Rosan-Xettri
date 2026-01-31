// timer.js - Handles exam timer with auto-submit
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
            // Auto-submit when time is up (no confirmation needed)
            console.log('⏰ Time is up! Auto-submitting exam...');
            ExamSubmit.submitExam(false); // false means no confirmation modal
            return;
        }
        
        this.timeLeft--;
        this.updateDisplay();
        
        // Auto-save progress every 30 seconds
        if (this.timeLeft % 30 === 0) {
            this.autoSave();
        }
        
        // Add warning style when less than 5 minutes
        if (this.timeLeft === 5 * 60) {
            this.showTimeWarning();
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
            const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timerEl.textContent = timeStr;
            
            // Add warning class when less than 5 minutes
            if (this.timeLeft < 5 * 60) {
                timerEl.style.color = '#e74c3c';
                timerEl.style.fontWeight = 'bold';
                timerEl.style.animation = 'pulse 1s infinite';
            } else {
                timerEl.style.color = '';
                timerEl.style.fontWeight = '';
                timerEl.style.animation = '';
            }
        }
    },
    
    showTimeWarning: function() {
        // Show warning message when 5 minutes left
        const warningMsg = document.createElement('div');
        warningMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
            z-index: 999;
            animation: slideInRight 0.5s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        
        warningMsg.innerHTML = `
            <strong>⏰ TIME WARNING!</strong><br>
            Only 5 minutes remaining!
        `;
        
        document.body.appendChild(warningMsg);
        
        // Remove warning after 5 seconds
        setTimeout(() => {
            if (document.body.contains(warningMsg)) {
                document.body.removeChild(warningMsg);
                document.head.removeChild(style);
            }
        }, 5000);
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
    }
};
