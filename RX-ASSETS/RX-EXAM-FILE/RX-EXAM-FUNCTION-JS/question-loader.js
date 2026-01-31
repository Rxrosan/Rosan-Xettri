// question-loader.js - COMPLETE UPDATED VERSION

const QuestionLoader = {
    loadQuestion: function(id, scrollReset = true) {
        console.log(`📖 Loading question ${id}`);
        
        // Get the question
        const question = QuestionsManager.getQuestion(id);
        
        if (!question) {
            this.showErrorMessage(id, 'Question not found');
            return;
        }
        
        if (question.hasError) {
            this.showErrorMessage(id, question.error.message);
            return;
        }
        
        UserState.currentQuestionId = id;
        
        // Hide menu, show question screen
        document.getElementById('menuScreen').style.display = 'none';
        document.getElementById('questionScreen').style.display = 'flex';
        document.getElementById('navFooter').style.display = 'flex';
        
        // Load fresh content
        this.loadQuestionContent(question, id);
        
        // Load options WITH saved answer
        this.loadOptions(question);
        
        // Reset scroll
        if (scrollReset) {
            const questionContent = document.getElementById('questionContent');
            const optionsContainer = document.getElementById('optionsContainer');
            if (questionContent) questionContent.scrollTop = 0;
            if (optionsContainer) optionsContainer.scrollTop = 0;
        }
        
        // Update grid
        GridRenderer.updateGridColors();
        
        // Initialize media controls AFTER content loads
        setTimeout(() => {
            if (typeof MediaController !== 'undefined') {
                MediaController.update();
            }
        }, 100);
    },
    
    showErrorMessage: function(questionNumber, message) {
        alert(`Error loading Question ${questionNumber}:\n\n${message}`);
        document.getElementById('menuScreen').style.display = 'flex';
        document.getElementById('questionScreen').style.display = 'none';
        document.getElementById('navFooter').style.display = 'none';
    },
    
    loadQuestionContent: function(question, questionNumber) {
        const leftPane = document.getElementById('questionContent');
        if (!leftPane) return;
        
        leftPane.innerHTML = `
            <div class="instr-container">
                ${MediaHelper.getMediaHTML(question.instruction)}
            </div>
            <div class="body-container">
                ${MediaHelper.getMediaHTML(question.questionBody)}
            </div>
        `;
    },
    
    loadOptions: function(question) {
        const rightPane = document.getElementById('optionsContainer');
        if (!rightPane) return;
        
        // Get saved answer for this question
        const savedAnswer = UserState.getAnswerForQuestion(UserState.currentQuestionId);
        console.log(`🔍 Loading Q${UserState.currentQuestionId}, saved answer: ${savedAnswer}`);
        
        let optionsHTML = `<div class="options-wrapper" style="padding-bottom:30px;">`;
        
        question.options.forEach((option, index) => {
            const optionNumber = index + 1;
            const isSelected = (savedAnswer === optionNumber);
            
            optionsHTML += `
                <div class="option-card" id="card-${optionNumber}" onclick="SelectionHandler.selectOption(${optionNumber})" 
                     style="display:flex; align-items:center; gap:15px; padding:15px; border-bottom:1px solid #eee; cursor:pointer; transition:background 0.2s; background:${isSelected ? '#e3f2fd' : '#fff'};">
                    
                    <div class="circle-idx" style="width:34px; height:34px; border:2px solid #4dbce9; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:bold; color:${isSelected ? '#fff' : '#4dbce9'}; background:${isSelected ? '#4dbce9' : 'transparent'};">
                        ${optionNumber}
                    </div>
                    
                    <div class="opt-media" style="flex:1;">
                        ${MediaHelper.getMediaHTML(option)}
                    </div>
                </div>`;
        });
        
        optionsHTML += `</div>`;
        rightPane.innerHTML = optionsHTML;
        
        // If there's a saved answer, highlight it
        if (savedAnswer) {
            console.log(`✅ Restoring saved answer ${savedAnswer} for Q${UserState.currentQuestionId}`);
        }
    }
};