// question-nav.js - Handles question navigation
const QuestionNav = {
    prevQ: function() {
        if (UserState.currentQuestionId > 1) {
            QuestionLoader.loadQuestion(UserState.currentQuestionId - 1, true);
        }
    },
    
    nextQ: function() {
        if (UserState.currentQuestionId < 40) {
            QuestionLoader.loadQuestion(UserState.currentQuestionId + 1, true);
        }
    },
    
    toggleView: function() {
        // Hide question screen
        document.getElementById('questionScreen').style.display = 'none';
        // Hide navigation footer
        document.getElementById('navFooter').style.display = 'none';
        // Show menu screen
        document.getElementById('menuScreen').style.display = 'flex';
        
        // Update grid to reflect any changes
        GridRenderer.updateGridColors();
        GridRenderer.updateStats();
    },
    
    jumpToQuestion: function(id) {
        if (id >= 1 && id <= 40) {
            QuestionLoader.loadQuestion(id, true);
        }
    }
};