// selection-handler.js - Handles option selection
const SelectionHandler = {
    selectOption: function(choice) {
        const currentId = UserState.currentQuestionId;
        
        // Clear any previous answer for this question
        const previousAnswer = UserState.getAnswerForQuestion(currentId);
        
        // Only proceed if it's a different selection or clearing
        if (previousAnswer !== choice) {
            UserState.setUserAnswer(currentId, choice);
            
            // Update UI for the selected option
            this.updateOptionUI(choice);
            
            // Update grid and stats
            GridRenderer.updateGridColors();
        } else {
            // If clicking same option again, deselect it
            UserState.clearUserAnswer(currentId);
            this.clearOptionUI();
            GridRenderer.updateGridColors();
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