// submit-handler.js - Updated with review mode instead of results modal

const ExamSubmit = {
    submitExam: function() {
        this.showConfirmationModal();
    },
    
    showConfirmationModal: function() {
        this.removeExistingModals();
        
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'confirm-modal';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            animation: fadeIn 0.3s ease;
        `;
        
        modalContent.innerHTML = `
            <div style="
                width: 70px;
                height: 70px;
                background: #ff6b6b;
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 30px;
                font-weight: bold;
            ">!</div>
            
            <h3 style="
                color: #2c3e50;
                margin: 0 0 15px 0;
                font-size: 24px;
                font-weight: 600;
            ">Submit Exam?</h3>
            
            <p style="
                color: #7f8c8d;
                margin-bottom: 25px;
                line-height: 1.5;
                font-size: 16px;
            ">
                Are you sure you want to submit your exam?<br>
                Once submitted, you cannot continue.
            </p>
            
            <div style="display: flex; gap: 15px;">
                <button id="cancel-btn" style="
                    flex: 1;
                    background: #95a5a6;
                    color: white;
                    border: none;
                    padding: 14px;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s;
                ">Cancel</button>
                
                <button id="confirm-btn" style="
                    flex: 1;
                    background: #2ecc71;
                    color: white;
                    border: none;
                    padding: 14px;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s;
                ">Submit</button>
            </div>
        `;
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            
            #cancel-btn:hover {
                background: #7f8c8d;
                transform: translateY(-2px);
            }
            
            #confirm-btn:hover {
                background: #27ae60;
                transform: translateY(-2px);
            }
            
            @media (max-width: 480px) {
                #confirm-modal > div {
                    padding: 25px 20px !important;
                }
                
                #confirm-modal h3 {
                    font-size: 22px !important;
                }
                
                #confirm-modal p {
                    font-size: 15px !important;
                }
                
                #confirm-modal button {
                    padding: 12px !important;
                    font-size: 15px !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.closeModal(modalOverlay, style);
        });
        
        document.getElementById('confirm-btn').addEventListener('click', () => {
            this.closeModal(modalOverlay, style);
            this.processSubmission();
        });
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal(modalOverlay, style);
            }
        });
    },
    
    processSubmission: function() {
        if (typeof ExamTimer !== 'undefined') ExamTimer.stop();
        
        const score = this.calculateScore();
        this.saveResults(score);
        
        // Get all questions data for review
        const questionsData = {};
        for (let i = 1; i <= 40; i++) {
            const q = typeof QuestionsManager !== 'undefined' ? QuestionsManager.getQuestion(i) : null;
            questionsData[i] = (q && !q.hasError) ? q : { hasError: true };
        }
        
        // Go directly to review mode (no results modal)
        if (typeof ExamReview !== 'undefined') {
            ExamReview.initReview(score, UserState.userAnswers, questionsData);
        } else {
            // Fallback if review handler not loaded
            console.warn('ExamReview not found, showing alert instead');
            alert(`Exam Submitted!\n\nYour Score: ${score.percentage}% (${score.correct}/40)\n\nReview mode not available.`);
            this.clearExamData();
            window.location.reload();
        }
        
        // Clear exam data
        this.clearExamData();
    },
    
    calculateScore: function() {
        let correct = 0;
        
        for (const [questionId, userAnswer] of Object.entries(UserState.userAnswers)) {
            const question = QuestionsManager.getQuestion(parseInt(questionId));
            if (question && !question.hasError && question.answer === userAnswer) {
                correct++;
            }
        }
        
        return {
            totalQuestions: 40,
            correct: correct,
            percentage: Math.round((correct / 40) * 100)
        };
    },
    
    saveResults: function(score) {
        const results = {
            examName: 'EPS-TOPIK Exam',
            score: score,
            submittedAt: new Date().toLocaleString()
        };
        localStorage.setItem('examResults', JSON.stringify(results));
    },
    
    clearExamData: function() {
        // Only clear exam-specific data
        const examKeys = [
            'examProgress',
            'examSelections',
            'examAudioStates',
            'examSession',
            'examTimer'
        ];
        
        examKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        console.log('✅ Exam data cleared (login preserved)');
        if (typeof QuestionsManager !== 'undefined') {
            QuestionsManager.markExamSubmitted();
        }
    },
    
    removeExistingModals: function() {
        const modals = ['confirm-modal', 'results-modal'];
        modals.forEach(id => {
            const modal = document.getElementById(id);
            if (modal) document.body.removeChild(modal);
        });
        
        const styles = document.querySelectorAll('style');
        styles.forEach(style => {
            if (style.textContent && (style.textContent.includes('modal') || 
                style.textContent.includes('fadeIn') || 
                style.textContent.includes('slideUp'))) {
                document.head.removeChild(style);
            }
        });
    },
    
    closeModal: function(modal, style) {
        if (modal) document.body.removeChild(modal);
        if (style) document.head.removeChild(style);
    }
};