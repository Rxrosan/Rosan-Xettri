// submit-handler.js - Handles exam submission
const ExamSubmit = {
    submitExam: function() {
        if (confirm("Are you sure you want to finish the exam?")) {
            ExamTimer.stop();
            
            // Calculate score
            const score = this.calculateScore();
            
            // Save results
            this.saveResults(score);
            
            // Show results
            this.showResults(score);
            
            // Clear saved progress
            localStorage.removeItem('examProgress');
            
            // Mark exam as submitted to trigger new random questions next time
            QuestionsManager.markExamSubmitted();
            
            // Reset the exam state
            this.resetExamState();
        }
    },
    
    calculateScore: function() {
        let correct = 0;
        let answered = 0;
        
        // Check each answered question
        for (const [questionId, userAnswer] of Object.entries(UserState.userAnswers)) {
            const question = questions.find(q => q.id === parseInt(questionId));
            if (question && question.answer === userAnswer) {
                correct++;
            }
            answered++;
        }
        
        return {
            totalQuestions: 40,
            answered: answered,
            correct: correct,
            percentage: Math.round((correct / 40) * 100)
        };
    },
    
    saveResults: function(score) {
        const results = {
            userId: UserID.getUserId(),
            examId: UserID.getExamId(),
            userName: UserID.userName,
            score: score,
            answers: UserState.userAnswers,
            submittedAt: new Date().toISOString(),
            timeSpent: (50 * 60) - ExamTimer.getTimeRemaining()
        };
        
        // Save to localStorage
        localStorage.setItem('examResults', JSON.stringify(results));
        
        // In a real app, you would send this to a server
        console.log('Exam results saved:', results);
    },
    
    showResults: function(score) {
        // Show results in an alert without redirecting
        alert(`Exam Submitted Successfully!\n\n` +
              `Score: ${score.correct}/${score.totalQuestions}\n` +
              `Percentage: ${score.percentage}%\n` +
              `Questions Answered: ${score.answered}/40\n\n` +
              `You can review your answers or start a new exam.`);
        
        // Show the grid view after submission
        QuestionNav.toggleView();
    },
    
    autoSubmit: function() {
        // For automatic submission when time runs out
        console.log('Auto-submitting exam...');
        this.submitExam();
    },
    
    resetExamState: function() {
        // Reset all exam state
        UserState.reset();
        ExamTimer.timeLeft = 50 * 60;
        ExamTimer.isRunning = false;
        
        // Update display
        GridRenderer.updateGridColors();
        GridRenderer.updateStats();
        ExamTimer.updateDisplay();
    }
};