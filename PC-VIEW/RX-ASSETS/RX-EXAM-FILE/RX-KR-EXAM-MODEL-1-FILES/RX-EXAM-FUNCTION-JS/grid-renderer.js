// grid-renderer.js - Ultra-Fast Performance Optimized
const GridRenderer = {
    elements: {
        readGrid: null,
        listenGrid: null,
        boxes: [] // Use array for faster indexing than object
    },
    
    // Track previous state to skip unnecessary DOM updates
    _prevState: {
        currentId: null,
        answeredCount: 0
    },

    init: function() {
        this.elements.readGrid = document.getElementById('readGrid');
        this.elements.listenGrid = document.getElementById('listenGrid');
        
        if (!this.elements.readGrid || !this.elements.listenGrid) return;

        this.setupEventListeners();
        this.renderGrid();
    },

    setupEventListeners: function() {
        const handleClick = (e) => {
            const box = e.target.closest('.qnum');
            if (box) this.handleQuestionClick(Number(box.dataset.id));
        };
        // Use capture: false for slightly better performance in standard bubbling
        this.elements.readGrid.addEventListener('click', handleClick);
        this.elements.listenGrid.addEventListener('click', handleClick);
    },
    
    renderGrid: function() {
        let readHTML = '';
        let listenHTML = '';
        
        // String concatenation is significantly faster than createElement + appendChild 
        // for bulk operations in modern engines
        for (let i = 1; i <= 40; i++) {
            const html = `<div class="qnum" data-id="${i}">${i}</div>`;
            if (i <= 20) readHTML += html;
            else listenHTML += html;
        }
        
        this.elements.readGrid.innerHTML = readHTML;
        this.elements.listenGrid.innerHTML = listenHTML;
        
        // Fast-cache the references
        const allBoxes = document.querySelectorAll('.qnum');
        allBoxes.forEach(box => {
            this.elements.boxes[box.dataset.id] = box;
        });
        
        this.updateGridColors();
    },
    
    handleQuestionClick: function(questionNumber) {
        const status = QuestionsManager.getQuestionStatus(questionNumber);
        
        if (status.status === 'error') {
            return alert(`Question ${questionNumber} Error:\n\n${status.message}`);
        }
        
        if (status.status === 'loading' || status.status === 'not-loaded') {
            return alert(`Question ${questionNumber} is loading...`);
        }
        
        QuestionLoader.loadQuestion(questionNumber, true);
        
        const footer = document.getElementById('navFooter');
        if (footer && footer.style.display !== 'flex') footer.style.display = 'flex';
    },
    
    updateGridColors: function() {
        // Run inside requestAnimationFrame to ensure sync with browser refresh rate
        // and prevent "Layout Thrashing"
        requestAnimationFrame(() => {
            const currentId = UserState.currentQuestionId;
            const answers = UserState.userAnswers;
            const solvedCount = Object.keys(answers).length;

            // Optimization: Skip loop if nothing could have changed
            // (Optional: can be expanded based on your state logic)

            for (let i = 1; i <= 40; i++) {
                const box = this.elements.boxes[i];
                if (!box) continue;

                const status = QuestionsManager.getQuestionStatus(i);
                const isAnswered = !!answers[i];
                const isActive = i === currentId;
                const isError = status.status === 'error';

                // PERFORMANCE: Check current class state before touching DOM
                // This prevents the browser from recalculating styles if nothing changed
                if (box._lastActive !== isActive) {
                    box.classList.toggle('active', isActive);
                    box._lastActive = isActive;
                }
                if (box._lastAnswered !== isAnswered) {
                    box.classList.toggle('answered', isAnswered);
                    box._lastAnswered = isAnswered;
                }
                if (box._lastError !== isError) {
                    box.classList.toggle('error', isError);
                    box._lastError = isError;
                    if (isError) box.title = status.message;
                }
            }
            
            this.updateStats(solvedCount);
        });
    },
    
    updateStats: function(solvedCount) {
        // Only update DOM if the numbers actually changed
        if (this._prevState.answeredCount === solvedCount) return;

        const solvedEl = document.getElementById('solved-count');
        const unsolvedEl = document.getElementById('unsolved-count');
        
        if (solvedEl) solvedEl.textContent = solvedCount;
        if (unsolvedEl) unsolvedEl.textContent = 40 - solvedCount;
        
        this._prevState.answeredCount = solvedCount;
    }
};