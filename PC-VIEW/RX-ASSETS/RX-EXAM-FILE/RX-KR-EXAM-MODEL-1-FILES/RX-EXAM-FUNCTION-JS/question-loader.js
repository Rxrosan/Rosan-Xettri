// question-loader.js - COMPLETE UPDATED VERSION WITH FULLSCREEN

const QuestionLoader = {
    // Fullscreen variables
    isFullscreenSupported: false,
    isFullscreenActive: false,
    
    initFullscreen: function() {
        console.log('🔲 Initializing fullscreen mode...');
        
        // Check if fullscreen API is available
        this.isFullscreenSupported = document.fullscreenEnabled || 
                                    document.webkitFullscreenEnabled || 
                                    document.mozFullScreenEnabled || 
                                    document.msFullscreenEnabled;
        
        if (this.isFullscreenSupported) {
            this.setupFullscreen();
        } else {
            console.log('⚠️ Fullscreen API not supported, using mobile workarounds');
            this.setupMobileFullscreen();
        }
        
        // Setup mobile optimizations
        this.setupMobileOptimizations();
        
        // Hide address bar on mobile
        this.hideAddressBar();
    },
    
    setupFullscreen: function() {
        // Request fullscreen on first question load
        const originalLoadQuestion = this.loadQuestion;
        this.loadQuestion = function(id, scrollReset = true) {
            // Request fullscreen if not active
            if (!this.isFullscreenActive && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                this.requestFullscreen();
            }
            return originalLoadQuestion.call(this, id, scrollReset);
        }.bind(this);
        
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('MSFullscreenChange', this.handleFullscreenChange.bind(this));
    },
    
    requestFullscreen: function() {
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
            element.requestFullscreen().catch(e => {
                console.log('Fullscreen request failed:', e);
            });
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        
        this.isFullscreenActive = true;
        document.body.classList.add('fullscreen-active');
        console.log('📱 Fullscreen requested');
    },
    
    handleFullscreenChange: function() {
        this.isFullscreenActive = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        
        console.log(`🔄 Fullscreen changed: ${this.isFullscreenActive ? 'Active' : 'Inactive'}`);
        
        // Update body class
        if (this.isFullscreenActive) {
            document.body.classList.add('fullscreen-active');
        } else {
            document.body.classList.remove('fullscreen-active');
        }
    },
    
    setupMobileFullscreen: function() {
        // For mobile devices without fullscreen API
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            console.log('📱 Mobile device detected, using mobile fullscreen workarounds');
            
            // Add fullscreen class to body
            document.body.classList.add('mobile-fullscreen');
            
            // Hide address bar
            window.addEventListener('load', () => {
                setTimeout(() => {
                    window.scrollTo(0, 1);
                }, 100);
            });
        }
    },
    
    setupMobileOptimizations: function() {
        // Prevent zooming with double-tap
        let lastTouchEnd = 0;
        
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent pull-to-refresh
        document.addEventListener('touchmove', (e) => {
            if (e.target.tagName !== 'TEXTAREA' && 
                e.target.tagName !== 'INPUT' && 
                e.target.getAttribute('contenteditable') !== 'true') {
                // Allow scrolling in content areas only
                if (!e.target.closest('.pane') && !e.target.closest('.grid-dual-pane')) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        // Fix viewport height for mobile
        this.fixMobileViewportHeight();
        
        // Lock orientation to portrait on mobile
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('portrait').catch(() => {
                console.log('⚠️ Could not lock orientation');
            });
        }
    },
    
    fixMobileViewportHeight: function() {
        // Fix for mobile viewport height
        function setVH() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        // Initial set
        setVH();
        
        // Update on resize and orientation change
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 300);
        });
    },
    
    hideAddressBar: function() {
        // Scroll to hide address bar on mobile
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.scrollTo(0, 1);
            }, 0);
        });
        
        // On resize, scroll if needed
        window.addEventListener('resize', () => {
            setTimeout(() => {
                window.scrollTo(0, 1);
            }, 100);
        });
    },
    
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
        
        // SHOW FOOTER WITH NAVIGATION BUTTONS
        const navFooter = document.getElementById('navFooter');
        navFooter.style.display = 'flex';
        navFooter.style.visibility = 'visible';
        
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
        
        // Request fullscreen on mobile devices when loading first question
        if (id === 1 && !this.isFullscreenActive && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            setTimeout(() => {
                this.requestFullscreen();
            }, 500);
        }
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

// Initialize fullscreen when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        QuestionLoader.initFullscreen();
    }, 1000);
});

// Also trigger fullscreen on any user interaction
document.addEventListener('click', function() {
    if (QuestionLoader.isFullscreenSupported && !QuestionLoader.isFullscreenActive && 
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        QuestionLoader.requestFullscreen();
    }
});

// Prevent context menu on long press (for mobile)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Auto-hide address bar on iOS
if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.addEventListener('touchstart', function() {
        setTimeout(function() {
            window.scrollTo(0, 1);
        }, 100);
    });
}