// grid-renderer.js - Handles question grid rendering
const GridRenderer = {
    init: function() {
        console.log('🎨 GridRenderer.init() - Creating fresh grid');
        this.renderGrid();
    },
    
    renderGrid: function() {
        const readGrid = document.getElementById('readGrid');
        const listenGrid = document.getElementById('listenGrid');
        
        if (!readGrid || !listenGrid) return;
        
        // Clear existing grids
        readGrid.innerHTML = '';
        listenGrid.innerHTML = '';
        
        // Create fresh question boxes
        for (let i = 1; i <= 40; i++) {
            const box = document.createElement('div');
            box.className = 'qnum';
            box.textContent = i;
            box.dataset.id = i;
            
            // Add click event
            box.addEventListener('click', () => {
                this.handleQuestionClick(i);
            });
            
            // Add to appropriate grid
            if (i <= 20) {
                readGrid.appendChild(box);
            } else {
                listenGrid.appendChild(box);
            }
        }
        
        this.updateGridColors();
    },
    
    handleQuestionClick: function(questionNumber) {
        // Check question status
        const status = QuestionsManager.getQuestionStatus(questionNumber);
        
        if (status.status === 'error') {
            alert(`Question ${questionNumber} Error:\n\n${status.message}`);
            return;
        }
        
        if (status.status === 'loading' || status.status === 'not-loaded') {
            alert(`Question ${questionNumber} is loading. Please wait...`);
            return;
        }
        
        // Load the question (fresh, no pre-selection)
        QuestionLoader.loadQuestion(questionNumber, true);
    },
    
    updateGridColors: function() {
        const allBoxes = document.querySelectorAll('.qnum');
        
        allBoxes.forEach(box => {
            const id = parseInt(box.dataset.id);
            
            // Reset to default
            box.className = 'qnum';
            
            // Check question status
            const status = QuestionsManager.getQuestionStatus(id);
            if (status.status === 'error') {
                box.classList.add('error');
                box.title = status.message;
            }
            
            // Check if answered (should be none on fresh load)
            if (UserState.userAnswers[id]) {
                box.classList.add('answered');
            }
            
            // Check if current question
            if (id === UserState.currentQuestionId) {
                box.classList.add('active');
            }
        });
        
        this.updateStats();
    },
    
    updateStats: function() {
        const solvedCount = Object.keys(UserState.userAnswers).length;
        const solvedEl = document.getElementById('solved-count');
        const unsolvedEl = document.getElementById('unsolved-count');
        
        if (solvedEl) solvedEl.textContent = solvedCount;
        if (unsolvedEl) unsolvedEl.textContent = 40 - solvedCount;
        
        console.log(`📊 Stats: ${solvedCount} answered, ${40 - solvedCount} unanswered`);
    }
};