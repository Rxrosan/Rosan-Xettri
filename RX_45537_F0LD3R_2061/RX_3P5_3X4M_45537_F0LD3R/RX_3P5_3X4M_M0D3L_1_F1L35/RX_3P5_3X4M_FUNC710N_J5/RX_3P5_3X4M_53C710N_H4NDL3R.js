// selection-handler.js - COMPLETE UPDATED VERSION

const SelectionHandler = {
    selectOption: function(choice) {
        const currentId = UserState.currentQuestionId;
        console.log(`🎯 Selecting option ${choice} for Q${currentId}`);
        
        // Get current saved answer
        const previousAnswer = UserState.getAnswerForQuestion(currentId);
        
        // If clicking the same option, deselect it
        if (previousAnswer === choice) {
            console.log(`🗑️ Deselecting option ${choice} for Q${currentId}`);
            UserState.clearUserAnswer(currentId);
            this.clearOptionUI();
        } else {
            // Select new option
            console.log(`💾 Saving answer ${choice} for Q${currentId}`);
            UserState.setUserAnswer(currentId, choice);
            
            // Update UI for the selected option
            this.updateOptionUI(choice);
        }
        
        // Update grid and stats
        GridRenderer.updateGridColors();
        
        // Auto-save progress
        if (typeof AppLoader !== 'undefined') {
            AppLoader.autoSaveProgress();
        }
    },
    
    updateOptionUI: function(selectedChoice) {
        const optionCards = document.querySelectorAll('.option-card');
        
        optionCards.forEach((card, index) => {
            const optionNumber = index + 1;
            const circle = card.querySelector('.circle-idx');
            
            if (optionNumber === selectedChoice) {
                card.style.background = "#e3f2fd";
                circle.style.background = "#4dbce9";
                circle.style.color = "#fff";
            } else {
                card.style.background = "#fff";
                circle.style.background = "transparent";
                circle.style.color = "#4dbce9";
            }
        });
    },
    
    clearOptionUI: function() {
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            card.style.background = "#fff";
            const circle = card.querySelector('.circle-idx');
            circle.style.background = "transparent";
            circle.style.color = "#4dbce9";
        });
    },
    
    clearSelection: function() {
        const currentId = UserState.currentQuestionId;
        UserState.clearUserAnswer(currentId);
        this.clearOptionUI();
        GridRenderer.updateGridColors();
    }
};