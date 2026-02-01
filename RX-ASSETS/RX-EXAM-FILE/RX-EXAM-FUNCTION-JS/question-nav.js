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
        
        // HIDE FOOTER WITH NAVIGATION BUTTONS
        const navFooter = document.getElementById('navFooter');
        navFooter.style.display = 'none';
        navFooter.style.visibility = 'hidden';
        
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