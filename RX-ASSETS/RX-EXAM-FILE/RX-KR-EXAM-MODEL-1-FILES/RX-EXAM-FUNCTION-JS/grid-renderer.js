// grid-renderer.js - Optimized for Performance

const GridRenderer = {
    // Cache for DOM elements to avoid repetitive lookups
    elements: {
        readGrid: null,
        listenGrid: null,
        boxes: {} // Stores references to the 40 question divs
    },

    init: function() {
        console.log('🎨 GridRenderer.init() - Initializing');
        this.elements.readGrid = document.getElementById('readGrid');
        this.elements.listenGrid = document.getElementById('listenGrid');
        
        if (!this.elements.readGrid || !this.elements.listenGrid) return;

        // Attach event listeners to parents (Event Delegation)
        this.setupEventListeners();
        this.renderGrid();
    },

    setupEventListeners: function() {
        const handleClick = (e) => {
            const box = e.target.closest('.qnum');
            if (box) {
                this.handleQuestionClick(parseInt(box.dataset.id));
            }
        };

        this.elements.readGrid.addEventListener('click', handleClick);
        this.elements.listenGrid.addEventListener('click', handleClick);
    },
    
    renderGrid: function() {
        // Clear existing content efficiently
        this.elements.readGrid.textContent = '';
        this.elements.listenGrid.textContent = '';
        
        // Use Fragments to minimize browser reflows
        const readFrag = document.createDocumentFragment();
        const listenFrag = document.createDocumentFragment();
        
        for (let i = 1; i <= 40; i++) {
            const box = document.createElement('div');
            box.className = 'qnum';
            box.textContent = i;
            box.dataset.id = i;
            
            // Store reference for lightning-fast updates later
            this.elements.boxes[i] = box;
            
            if (i <= 20) {
                readFrag.appendChild(box);
            } else {
                listenFrag.appendChild(box);
            }
        }
        
        // Single DOM update for the whole grid
        this.elements.readGrid.appendChild(readFrag);
        this.elements.listenGrid.appendChild(listenFrag);
        
        this.updateGridColors();
    },
    
    handleQuestionClick: function(questionNumber) {
        const status = QuestionsManager.getQuestionStatus(questionNumber);
        
        if (status.status === 'error') {
            alert(`Question ${questionNumber} Error:\n\n${status.message}`);
            return;
        }
        
        if (status.status === 'loading' || status.status === 'not-loaded') {
            alert(`Question ${questionNumber} is loading. Please wait...`);
            return;
        }
        
        // Load the question
        QuestionLoader.loadQuestion(questionNumber, true);
        
        // Ensure footer is visible
        const footer = document.getElementById('navFooter');
        if (footer) footer.style.display = 'flex';
    },
    
    updateGridColors: function() {
        const currentId = UserState.currentQuestionId;
        const answers = UserState.userAnswers;

        // Use the cached references instead of querySelectorAll
        for (let i = 1; i <= 40; i++) {
            const box = this.elements.boxes[i];
            if (!box) continue;

            const status = QuestionsManager.getQuestionStatus(i);
            
            // Update classes using classList (faster than overwriting className)
            box.classList.toggle('error', status.status === 'error');
            box.classList.toggle('answered', !!answers[i]);
            box.classList.toggle('active', i === currentId);
            
            if (status.status === 'error') box.title = status.message;
        }
        
        this.updateStats();
    },
    
    updateStats: function() {
        const solvedCount = Object.keys(UserState.userAnswers).length;
        const solvedEl = document.getElementById('solved-count');
        const unsolvedEl = document.getElementById('unsolved-count');
        
        if (solvedEl) solvedEl.textContent = solvedCount;
        if (unsolvedEl) unsolvedEl.textContent = 40 - solvedCount;
    }
};