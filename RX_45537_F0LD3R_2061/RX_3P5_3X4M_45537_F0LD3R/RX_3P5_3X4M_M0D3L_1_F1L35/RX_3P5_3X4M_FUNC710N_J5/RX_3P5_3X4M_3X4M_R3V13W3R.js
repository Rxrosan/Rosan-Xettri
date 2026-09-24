// review-handler.js - REVIEW MODE WITH AUDIO ENABLED & PROPER HIGHLIGHTING

const ExamReview = {
    reviewData: null,
    isReviewMode: false,
    menuPopup: null,
    contentPopup: null,
    
    // Initialize review after exam submission
    initReview: function(results, userAnswers, questionsData) {
        console.log(' Initializing review mode with audio');
        
        this.reviewData = {
            results: results,
            userAnswers: userAnswers,
            questionsData: questionsData,
            correctMap: this.buildCorrectnessMap(userAnswers, questionsData)
        };
        
        this.isReviewMode = true;
        
        // Mark that exam is submitted in UserState
        if (typeof UserState !== 'undefined') {
            UserState.examSubmitted = true;
        }
        
        // Transform the existing UI into review mode
        this.enterReviewMode();
    },
    
    // Build map of correct/incorrect answers
    buildCorrectnessMap: function(userAnswers, questionsData) {
        const map = {};
        for (let i = 1; i <= 40; i++) {
            const userAnswer = userAnswers[i];
            const question = questionsData[i];
            
            if (userAnswer && question && !question.hasError) {
                map[i] = {
                    isCorrect: (question.answer === userAnswer),
                    userAnswer: userAnswer,
                    correctAnswer: question.answer,
                    hasAnswer: true
                };
            } else {
                map[i] = {
                    isCorrect: false,
                    userAnswer: userAnswer || null,
                    correctAnswer: question ? question.answer : null,
                    hasAnswer: !!userAnswer
                };
            }
        }
        return map;
    },
    
    // Enter review mode - modify existing UI
    enterReviewMode: function() {
        console.log(' Entering review mode with audio enabled');
        
        // Show menu screen (grid view)
        const menuScreen = document.getElementById('menuScreen');
        const questionScreen = document.getElementById('questionScreen');
        const navFooter = document.getElementById('navFooter');
        
        if (menuScreen) menuScreen.style.display = 'flex';
        if (questionScreen) questionScreen.style.display = 'none';
        if (navFooter) navFooter.style.display = 'none';
        
        // Replace submit button with menu button
        this.replaceSubmitWithMenu();
        
        // Update grid with correct/wrong colors
        this.updateReviewGrid();
        
        // Update stats bar for review mode
        this.updateStatsBarForReview();
        
        // Override QuestionLoader to load questions in review mode with audio
        this.overrideQuestionLoader();
        
        // Override GridRenderer for review mode
        this.overrideGridRenderer();
        
        // Re-initialize MediaController for audio in review mode
        this.initReviewAudio();
        
        console.log(' Review mode activated with audio');
    },
    
    // Initialize audio for review mode
    initReviewAudio: function() {
        setTimeout(() => {
            if (typeof MediaController !== 'undefined') {
                // Reset audio states to allow replay in review mode
                MediaController.audioStates.clear();
                MediaController.currentAudio = null;
                MediaController.isAudioPlaying = false;
                
                // Re-initialize MediaController
                MediaController.init();
                console.log(' Audio enabled for review mode');
            }
        }, 500);
    },
    
    // Replace the submit button with menu button
    replaceSubmitWithMenu: function() {
        const finishBtn = document.querySelector('.btn-finish');
        if (finishBtn) {
            finishBtn.textContent = 'MENU';
            finishBtn.style.background = '#2c3e50';
            finishBtn.style.color = 'white';
            
            const newBtn = finishBtn.cloneNode(true);
            finishBtn.parentNode.replaceChild(newBtn, finishBtn);
            newBtn.onclick = () => this.showMenuPopup();
        }
    },
    
    // Update stats bar for review mode
    updateStatsBarForReview: function() {
        const solvedEl = document.getElementById('solved-count');
        const unsolvedEl = document.getElementById('unsolved-count');
        
        if (solvedEl) {
            solvedEl.textContent = this.reviewData.results.correct;
            const solvedSpan = solvedEl.parentElement;
            if (solvedSpan && solvedSpan.childNodes[0] && solvedSpan.childNodes[0].nodeType === 3) {
                solvedSpan.childNodes[0].textContent = 'Correct: ';
            }
        }
        
        if (unsolvedEl) {
            unsolvedEl.textContent = 40 - this.reviewData.results.correct;
            const unsolvedSpan = unsolvedEl.parentElement;
            if (unsolvedSpan && unsolvedSpan.childNodes[0] && unsolvedSpan.childNodes[0].nodeType === 3) {
                unsolvedSpan.childNodes[0].textContent = 'Wrong/Unanswered: ';
            }
        }
        
        // Add score badge
        const statsBar = document.querySelector('.stats-bar');
        if (statsBar && !document.getElementById('reviewScoreBadge')) {
            const scoreSpan = document.createElement('span');
            scoreSpan.id = 'reviewScoreBadge';
            scoreSpan.style.cssText = `
                background: #2ecc71;
                padding: 2px 10px;
                border-radius: 20px;
                font-weight: bold;
            `;
            scoreSpan.innerHTML = ` Score: ${this.reviewData.results.percentage}%`;
            statsBar.appendChild(scoreSpan);
        }
    },
    
    // Update grid with correct/wrong colors
    updateReviewGrid: function() {
        const allBoxes = document.querySelectorAll('.qnum');
        
        allBoxes.forEach(box => {
            const id = parseInt(box.dataset.id);
            const correctness = this.reviewData.correctMap[id];
            
            // Reset classes and styles
            box.classList.remove('answered', 'review-correct', 'review-wrong', 'review-unanswered', 'active');
            box.style.background = '';
            box.style.border = '';
            box.style.boxShadow = '';
            
            // Add review-specific classes
            if (!correctness.hasAnswer) {
                box.classList.add('review-unanswered');
                box.style.background = '#fef9e7';
                box.style.border = '2px solid #f39c12';
                box.title = `Question ${id}: Not answered`;
            } else if (correctness.isCorrect) {
                box.classList.add('review-correct', 'answered');
                box.style.background = '#d5f5e3';
                box.style.border = '2px solid #27ae60';
                box.title = `Question ${id}: Correct (Answer: ${this.getOptionLetter(correctness.userAnswer)})`;
            } else {
                box.classList.add('review-wrong');
                box.style.background = '#fadbd8';
                box.style.border = '2px solid #e74c3c';
                box.title = `Question ${id}: Wrong (Your: ${this.getOptionLetter(correctness.userAnswer)} | Correct: ${this.getOptionLetter(correctness.correctAnswer)})`;
            }
            
            // Highlight current question
            if (id === UserState.currentQuestionId) {
                box.classList.add('active');
                box.style.boxShadow = '0 0 0 3px #3498db';
                box.style.position = 'relative';
                box.style.zIndex = '1';
            }
        });
    },
    
    getOptionLetter: function(optionNum) {
        if (!optionNum) return '—';
        const letters = ['', '①', '②', '③', '④'];
        return letters[optionNum] || optionNum;
    },
    
    // Override QuestionLoader for review mode with audio
    overrideQuestionLoader: function() {
        const self = this;
        
        QuestionLoader.loadQuestion = function(id, scrollReset = true) {
            console.log(`Loading review for question ${id} with audio`);
            
            const question = self.reviewData.questionsData[id];
            const correctness = self.reviewData.correctMap[id];
            
            if (!question || question.hasError) {
                self.showReviewErrorMessage(id);
                return;
            }
            
            // Stop any playing audio
            if (typeof MediaController !== 'undefined') {
                MediaController.stopAllAudio();
            }
            
            // Update current question ID
            if (typeof UserState !== 'undefined') {
                UserState.currentQuestionId = id;
            }
            
            // Show question screen
            document.getElementById('menuScreen').style.display = 'none';
            document.getElementById('questionScreen').style.display = 'flex';
            
            // Show footer
            const navFooter = document.getElementById('navFooter');
            navFooter.style.display = 'flex';
            navFooter.style.visibility = 'visible';
            
            // Load question content with audio enabled
            self.loadReviewQuestionContentWithAudio(question, id);
            
            // Load options with review highlighting and preserved selection
            self.loadReviewOptionsWithSelection(question, correctness);
            
            // Reset scroll
            if (scrollReset) {
                const questionContent = document.getElementById('questionContent');
                const optionsContainer = document.getElementById('optionsContainer');
                if (questionContent) questionContent.scrollTop = 0;
                if (optionsContainer) optionsContainer.scrollTop = 0;
            }
            
            // Update grid highlighting
            self.updateReviewGrid();
            
            // Initialize audio for this question
            setTimeout(() => {
                if (typeof MediaController !== 'undefined') {
                    MediaController.updateForQuestion(id);
                }
            }, 200);
        };
        
        // Override toggleView
        if (typeof QuestionNav !== 'undefined') {
            const originalToggleView = QuestionNav.toggleView;
            QuestionNav.toggleView = function() {
                // Stop audio when returning to grid
                if (typeof MediaController !== 'undefined') {
                    MediaController.stopAllAudio();
                }
                document.getElementById('questionScreen').style.display = 'none';
                const navFooter = document.getElementById('navFooter');
                navFooter.style.display = 'none';
                navFooter.style.visibility = 'hidden';
                document.getElementById('menuScreen').style.display = 'flex';
                self.updateReviewGrid();
            };
        }
    },
    
    // Load question content with audio enabled
    loadReviewQuestionContentWithAudio: function(question, questionNumber) {
        const leftPane = document.getElementById('questionContent');
        if (!leftPane) return;
        
        leftPane.innerHTML = `
            <div class="review-banner" style="background:#3498db; color:white; padding:8px 12px; border-radius:8px; margin-bottom:15px; text-align:center; font-weight:bold;">
                REVIEW MODE - Question ${questionNumber}
            </div>
            <div class="instr-container">
                ${this.getMediaHTMLWithAudio(question.instruction)}
            </div>
            <div class="body-container">
                ${this.getMediaHTMLWithAudio(question.questionBody)}
            </div>
        `;
    },
    
    // Load options with review highlighting AND preserved selection (blue indicator)
    loadReviewOptionsWithSelection: function(question, correctness) {
        const rightPane = document.getElementById('optionsContainer');
        if (!rightPane) return;
        
        const userAnswer = correctness.userAnswer;
        const correctAnswer = correctness.correctAnswer;
        
        let optionsHTML = `<div class="options-wrapper" style="padding-bottom:30px;">`;
        
        // Add answer summary
        optionsHTML += `
            <div class="review-answer-summary" style="background:#f8f9fa; padding:12px; border-radius:10px; margin-bottom:20px; text-align:center; font-size:14px;">
                ${this.getAnswerSummaryHTML(correctness)}
            </div>
        `;
        
        question.options.forEach((option, index) => {
            const optionNumber = index + 1;
            
            // Check if this was the user's selected answer (for blue highlight)
            const isUserSelected = (userAnswer === optionNumber);
            const isCorrectAnswer = (correctAnswer === optionNumber);
            
            // Determine background color
            let bgColor = '#fff';
            let borderColor = '#eee';
            let borderWidth = '1px';
            
            if (isUserSelected && isCorrectAnswer) {
                // User selected correctly - green background, blue circle
                bgColor = '#d5f5e3';
                borderColor = '#27ae60';
                borderWidth = '2px';
            } else if (isUserSelected && !isCorrectAnswer) {
                // User selected wrong - red background, blue circle
                bgColor = '#fadbd8';
                borderColor = '#e74c3c';
                borderWidth = '2px';
            } else if (isCorrectAnswer) {
                // Correct answer not selected by user - blue border, light blue background
                bgColor = '#e8f4fd';
                borderColor = '#3498db';
                borderWidth = '2px';
            }
            
            optionsHTML += `
                <div class="option-card review-option" data-opt="${optionNumber}" style="margin-bottom:10px; border-radius:10px; background:${bgColor}; border:${borderWidth} solid ${borderColor}; cursor:default;">
                    <div style="display:flex; align-items:center; gap:15px; padding:15px;">
                        <div class="circle-idx" style="width:34px; height:34px; border:2px solid #4dbce9; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:bold; background:${isUserSelected ? '#4dbce9' : 'transparent'}; color:${isUserSelected ? '#fff' : '#4dbce9'};">
                            ${optionNumber}
                        </div>
                        <div class="opt-media" style="flex:1;">
                            ${this.getMediaHTMLWithAudio(option)}
                        </div>
                        <div style="display:flex; gap:8px;">
                            ${isCorrectAnswer ? '<span style="background:#27ae60; color:white; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:bold;"> ✔️</span>' : ''}
                            ${isUserSelected && !isCorrectAnswer ? '<span style="background:#e74c3c; color:white; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:bold;">❌</span>' : ''}
                            ${isUserSelected && isCorrectAnswer ? '<span style="background:#27ae60; color:white; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:bold;">✔️</span>' : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        optionsHTML += `</div>`;
        rightPane.innerHTML = optionsHTML;
    },
    
    // Get media HTML with audio enabled (for review mode)
    getMediaHTMLWithAudio: function(obj) {
        if (!obj) return '';
        let html = '';
        
        if (obj.text) {
            html += `<div class="content-text" style="font-size:16px; font-weight:500; margin-bottom:5px;">${obj.text}</div>`;
        }
        
        if (obj.image) {
            html += `<img src="${obj.image}" class="content-image" style="max-width:260px; display:block; margin:10px 0; border:1px solid #ddd; padding:5px; background:#fff; border-radius:4px; cursor:pointer;" onclick="ExamReview.openImageModal('${obj.image}')" title="Tap to view larger">`;
        }
        
        if (obj.audio) {
            // Audio enabled with MediaController support
            const audioId = 'audio-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            html += `<div class="content-audio" style="margin:15px 0;">
                <audio id="${audioId}" style="display:none;" preload="auto">
                    <source src="${obj.audio}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>`;
        }
        
        return html;
    },
    
    getAnswerSummaryHTML: function(correctness) {
        if (!correctness.hasAnswer) {
            return `<span style="color:#f39c12;"> You did not answer this question</span>`;
        } else if (correctness.isCorrect) {
            return `<span style="color:#27ae60;">Correct! You selected option ${this.getOptionLetter(correctness.userAnswer)}</span>`;
        } else {
            return `<span style="color:#e74c3c;"> Wrong! You selected option ${this.getOptionLetter(correctness.userAnswer)}. Correct answer is option ${this.getOptionLetter(correctness.correctAnswer)}</span>`;
        }
    },
    
    // Image modal
    openImageModal: function(src) {
        let modal = document.getElementById('reviewImageModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'reviewImageModal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.95);
                display: none;
                justify-content: center;
                align-items: center;
                padding: 12px;
                box-sizing: border-box;
                z-index: 20000;
                overflow: hidden;
            `;
            modal.innerHTML = `
                <div style="position:relative; max-width:100%; max-height:100%; display:flex; align-items:center; justify-content:center;">
                    <button style="position:absolute; top:-40px; right:0; background:#e74c3c; color:white; border:none; width:35px; height:35px; border-radius:50%; font-size:20px; cursor:pointer;">×</button>
                    <img id="reviewModalImage" style="max-width:100%; max-height:80vh; width:auto; height:auto; object-fit:contain; border-radius:8px;">
                </div>
            `;
            document.body.appendChild(modal);
            
            const closeBtn = modal.querySelector('button');
            closeBtn.onclick = () => { modal.style.display = 'none'; };
            // Outside click does NOT close image modal
        }
        
        const img = modal.querySelector('#reviewModalImage');
        if (img) img.src = src;
        modal.style.display = 'flex';
    },
    
    // Override GridRenderer
    overrideGridRenderer: function() {
        const self = this;
        
        GridRenderer.handleQuestionClick = function(questionNumber) {
            const question = self.reviewData.questionsData[questionNumber];
            if (!question || question.hasError) {
                alert(`Question ${questionNumber} could not be loaded for review.`);
                return;
            }
            QuestionLoader.loadQuestion(questionNumber, true);
            document.getElementById('navFooter').style.display = 'flex';
        };
        
        GridRenderer.updateGridColors = function() {
            self.updateReviewGrid();
        };
        
        GridRenderer.updateStats = function() {
            // Stats handled by review mode
        };
    },
    
    // Show menu popup (with scrollable body)
    showMenuPopup: function() {
        this.removeMenuPopup();
        
        this.menuPopup = document.createElement('div');
        this.menuPopup.id = 'reviewMenuPopup';
        this.menuPopup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 30000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            box-sizing: border-box;
            overflow: hidden;
        `;
        
        this.menuPopup.innerHTML = `
            <div class="review-popup-card" style="background: white; border-radius: 16px; width: 100%; max-width: 380px; max-height: 100%; overflow: hidden; display: flex; flex-direction: column; animation: popupSlideIn 0.3s ease; box-sizing: border-box;">
                <div style="background: #2c3e50; padding: 12px 44px 12px 18px; color: white; text-align: center; position: relative; flex-shrink: 0;">
                    <h3 style="margin: 0; font-size: 16px; line-height: 1.3;">MENU OPTIONS</h3>
                    <button id="menuPopupCloseBtn" style="position: absolute; top: 50%; right: 8px; transform: translateY(-50%); background: transparent; color: white; border: none; font-size: 24px; line-height: 1; cursor: pointer; padding: 0 8px; font-weight: 300;">×</button>
                </div>
                <div class="review-scroll-body" style="padding: 14px 14px; overflow-y: auto; -webkit-overflow-scrolling: touch; touch-action: pan-y; overscroll-behavior: contain; flex: 1; min-height: 0;">
                    <div style="display: flex; flex-direction: row; gap: 8px; justify-content: center;">
                        <button id="reviewNewExamBtn" style="flex: 1; min-width: 0; padding: 12px 6px; background: #3498db; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; white-space: nowrap; box-sizing: border-box;">
                             New Exam
                        </button>
                        <button id="reviewExitBtn" style="flex: 1; min-width: 0; padding: 12px 6px; background: #95a5a6; color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; white-space: nowrap; box-sizing: border-box;">
                             Exit
                        </button>
                    </div>
                    <div style="margin-top: 12px; text-align: center; font-size: 11px; color: #7f8c8d; line-height: 1.6;">
                        <span style="cursor: pointer; text-decoration: underline;" onclick="ExamReview.openTerms()">Terms & Condition</span>
                        <span style="margin: 0 6px;"> </span>
                        <span style="cursor: pointer; text-decoration: underline;" onclick="ExamReview.openPrivacy()">Privacy & Policy</span>
                    </div>
                </div>
            </div>
        `;
        
        if (!document.getElementById('popupAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'popupAnimationStyle';
            style.textContent = `
                @keyframes popupSlideIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @media (max-width: 360px) {
                    #reviewMenuPopup button {
                        font-size: 11px !important;
                        padding: 10px 4px !important;
                    }
                    #reviewMenuPopup h3 {
                        font-size: 14px !important;
                    }
                }
                @media (max-height: 450px) {
                    #reviewMenuPopup h3 {
                        font-size: 14px !important;
                    }
                    #reviewMenuPopup button {
                        font-size: 12px !important;
                        padding: 10px 6px !important;
                    }
                }
                /* Slim custom scrollbar */
                .review-scroll-body::-webkit-scrollbar {
                    width: 6px;
                }
                .review-scroll-body::-webkit-scrollbar-track {
                    background: transparent;
                }
                .review-scroll-body::-webkit-scrollbar-thumb {
                    background: #c0c6cc;
                    border-radius: 3px;
                }
                .review-scroll-body::-webkit-scrollbar-thumb:hover {
                    background: #95a5a6;
                }
                .review-scroll-body {
                    scrollbar-width: thin;
                    scrollbar-color: #c0c6cc transparent;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(this.menuPopup);
        
        document.getElementById('menuPopupCloseBtn').onclick = () => {
            this.removeMenuPopup();
        };
        
        document.getElementById('reviewNewExamBtn').onclick = () => {
            this.removeMenuPopup();
            this.startNewExam();
        };
        
        document.getElementById('reviewExitBtn').onclick = () => {
            this.removeMenuPopup();
            this.exitToResource();
        };
    },
    
    // Open Terms & Condition (hides menu, shows content popup)
    openTerms: function() {
        this.hideMenuPopup();
        this.showContentPopup(
            'Terms & Condition',
            `
                <p style="margin: 0 0 12px 0;">Welcome to our exam application. By accessing or using this service, you agree to be bound by the following terms and conditions.</p>
                <p style="margin: 0 0 12px 0;"><strong>1. Use of Service</strong><br>This application is provided for educational and assessment purposes only. You agree to use it in compliance with all applicable laws and regulations.</p>
                <p style="margin: 0 0 12px 0;"><strong>2. User Responsibilities</strong><br>You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.</p>
                <p style="margin: 0 0 12px 0;"><strong>3. Intellectual Property</strong><br>All content, including questions, images, and audio, is the property of the application owner and is protected by copyright laws.</p>
                <p style="margin: 0 0 12px 0;"><strong>4. Limitation of Liability</strong><br>We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of this application.</p>
                <p style="margin: 0 0 12px 0;"><strong>5. Changes to Terms</strong><br>We reserve the right to modify these terms at any time. Continued use of the application constitutes acceptance of the updated terms.</p>
                <p style="margin: 0 0 12px 0;"><strong>6. Contact</strong><br>If you have any questions about these terms, please contact our support team.</p>
                <p style="margin: 0;"><strong>7. Governing Law</strong><br>These terms shall be governed by and construed in accordance with applicable local laws.</p>
            `
        );
    },
    
    // Open Privacy & Policy (hides menu, shows content popup)
    openPrivacy: function() {
        this.hideMenuPopup();
        this.showContentPopup(
            'Privacy & Policy',
            `
                <p style="margin: 0 0 12px 0;">Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>
                <p style="margin: 0 0 12px 0;"><strong>1. Information We Collect</strong><br>We may collect basic usage data such as exam progress, answers, and performance statistics to improve the application.</p>
                <p style="margin: 0 0 12px 0;"><strong>2. How We Use Information</strong><br>Collected data is used solely for educational purposes, performance tracking, and improving the user experience.</p>
                <p style="margin: 0 0 12px 0;"><strong>3. Data Storage</strong><br>Your data is stored locally on your device and is not shared with third parties without your consent.</p>
                <p style="margin: 0 0 12px 0;"><strong>4. Cookies</strong><br>This application may use local storage to remember your progress. You can clear this data at any time through your browser settings.</p>
                <p style="margin: 0 0 12px 0;"><strong>5. Your Rights</strong><br>You have the right to access, modify, or delete your personal data at any time.</p>
                <p style="margin: 0 0 12px 0;"><strong>6. Security</strong><br>We take reasonable measures to protect your information from unauthorized access or disclosure.</p>
                <p style="margin: 0;"><strong>7. Updates to This Policy</strong><br>We may update this privacy policy from time to time. Continued use of the application constitutes acceptance of the updated policy.</p>
            `
        );
    },
    
    // Show content popup (Terms/Privacy) - with smooth scrollable body
    showContentPopup: function(title, bodyHTML) {
        this.removeContentPopup();
        
        this.contentPopup = document.createElement('div');
        this.contentPopup.id = 'reviewContentPopup';
        this.contentPopup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 31000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            box-sizing: border-box;
            overflow: hidden;
        `;
        
        this.contentPopup.innerHTML = `
            <div class="review-popup-card" style="background: white; border-radius: 16px; width: 100%; max-width: 420px; max-height: 100%; overflow: hidden; display: flex; flex-direction: column; animation: popupSlideIn 0.3s ease; box-sizing: border-box;">
                <div style="background: #2c3e50; padding: 12px 44px 12px 18px; color: white; text-align: center; position: relative; flex-shrink: 0;">
                    <h3 style="margin: 0; font-size: 15px; line-height: 1.3;">${title}</h3>
                    <button id="contentPopupCloseBtn" style="position: absolute; top: 50%; right: 8px; transform: translateY(-50%); background: transparent; color: white; border: none; font-size: 24px; line-height: 1; cursor: pointer; padding: 0 8px; font-weight: 300;">×</button>
                </div>
                <div class="review-scroll-body" style="padding: 14px 16px; overflow-y: auto; font-size: 13px; line-height: 1.6; color: #34495e; -webkit-overflow-scrolling: touch; touch-action: pan-y; overscroll-behavior: contain; word-wrap: break-word; overflow-wrap: break-word; flex: 1; min-height: 0;">
                    ${bodyHTML}
                </div>
            </div>
        `;
        
        document.body.appendChild(this.contentPopup);
        
        document.getElementById('contentPopupCloseBtn').onclick = () => {
            this.closeContentPopup();
        };
    },
    
    // Close content popup and re-show menu popup
    closeContentPopup: function() {
        this.removeContentPopup();
        this.showMenuPopup();
    },
    
    removeContentPopup: function() {
        if (this.contentPopup) {
            this.contentPopup.remove();
            this.contentPopup = null;
        }
    },
    
    // Hide menu popup without removing from DOM (so we can restore it)
    hideMenuPopup: function() {
        if (this.menuPopup) {
            this.menuPopup.style.display = 'none';
        }
    },
    
    // Restore menu popup display
    restoreMenuPopup: function() {
        if (this.menuPopup) {
            this.menuPopup.style.display = 'flex';
        }
    },
    
    removeMenuPopup: function() {
        if (this.menuPopup) {
            this.menuPopup.remove();
            this.menuPopup = null;
        }
    },
    
    startNewExam: function() {
        console.log('Starting new exam');
        const examKeys = ['examProgress', 'examSelections', 'examAudioStates', 'examSession', 'examTimer', 'examResults'];
        examKeys.forEach(key => localStorage.removeItem(key));
        
        if (typeof UserState !== 'undefined') {
            UserState.userAnswers = {};
            UserState.currentQuestionId = 1;
            UserState.examSubmitted = false;
            UserState.clearExamStorageOnly();
        }
        
        if (typeof QuestionsManager !== 'undefined') {
            QuestionsManager.selectedQuestions = {};
            QuestionsManager.startFreshExam();
        }
        
        window.location.reload();
    },
    
    exitToResource: function() {
        console.log(' Exiting to resource page');
        window.location.href = 'Resource.html';
    },
    
    showReviewErrorMessage: function(questionNumber) {
        alert(`Question ${questionNumber} could not be loaded for review.`);
        document.getElementById('menuScreen').style.display = 'flex';
        document.getElementById('questionScreen').style.display = 'none';
        document.getElementById('navFooter').style.display = 'none';
    }
};

// Hook into ExamSubmit
if (typeof ExamSubmit !== 'undefined') {
    const originalProcessSubmission = ExamSubmit.processSubmission;
    ExamSubmit.processSubmission = function() {
        if (typeof ExamTimer !== 'undefined') ExamTimer.stop();
        
        const score = this.calculateScore();
        this.saveResults(score);
        
        const questionsData = {};
        for (let i = 1; i <= 40; i++) {
            const q = QuestionsManager.getQuestion(i);
            questionsData[i] = (q && !q.hasError) ? q : { hasError: true };
        }
        
        ExamReview.initReview(score, UserState.userAnswers, questionsData);
        this.clearExamData();
    };
    
    const originalSubmitExam = ExamSubmit.submitExam;
    ExamSubmit.submitExam = function() {
        if (ExamReview.isReviewMode) {
            ExamReview.showMenuPopup();
        } else {
            originalSubmitExam.call(this);
        }
    };
}

// Add CSS for review mode
const reviewCSS = document.createElement('style');
reviewCSS.textContent = `
    .qnum.review-correct {
        background: #d5f5e3 !important;
        border: 2px solid #27ae60 !important;
    }
    .qnum.review-wrong {
        background: #fadbd8 !important;
        border: 2px solid #e74c3c !important;
    }
    .qnum.review-unanswered {
        background: #fef9e7 !important;
        border: 2px solid #f39c12 !important;
    }
    .qnum.active {
        box-shadow: 0 0 0 3px #3498db !important;
        position: relative;
        z-index: 1;
    }
    .review-banner {
        background: #3498db;
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        margin-bottom: 15px;
        text-align: center;
        font-weight: bold;
    }
    .review-answer-summary {
        background: #f8f9fa;
        padding: 12px;
        border-radius: 10px;
        margin-bottom: 20px;
        text-align: center;
        font-size: 14px;
    }
    #reviewScoreBadge {
        animation: fadeIn 0.5s ease;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(10px); }
        to { opacity: 1; transform: translateX(0); }
    }
    .btn-finish {
        transition: all 0.3s ease;
    }
    .btn-finish:hover {
        transform: scale(1.02);
        opacity: 0.95;
    }
`;
document.head.appendChild(reviewCSS);

window.ExamReview = ExamReview;