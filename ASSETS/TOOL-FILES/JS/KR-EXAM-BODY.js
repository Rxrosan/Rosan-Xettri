// --- START OF FILE KR-EXAM-BODY.js ---

// ========== GLOBAL VARIABLES & CONFIGURATION ==========
let currentQuestion = 0;
const TOTAL_QUESTIONS = 40;
const EXAM_DURATION_MINUTES = 50;

// State management
const reviewedQuestions = new Set();
const completedQuestions = new Set();
const userAnswers = {};
let quizSubmitted = false;
// Renamed disabledAudios to playedAudioCounts to track plays per question
const playedAudioCounts = {}; // Stores {questionNumber: count}

// Timer variables
let timerInterval = null;
let targetTime;
const examDurationMs = EXAM_DURATION_MINUTES * 60 * 1000;
let timerPaused = false; // New flag to track timer state

// Student information
const studentInfo = {
  id: null, name: "", username: "", image: "", serial: "",
  startTime: null, endTime: null
};

// Audio variables
let currentAudio = null; // To keep track of the currently playing audio element

// Cached DOM Elements
const dom = {};

// ========== 1. INITIALIZATION & PAGE SETUP ==========
document.addEventListener("DOMContentLoaded", () => {
    cacheDOMElements();
    initializeExamPage();
    window.goToPrevious = goToPrevious;
    window.goToNext = goToNext;
    window.markForReview = markForReview;
    window.submitQuiz = submitQuiz;
    window.selectOption = selectOption;
    window.generateResultPDF = generateResultPDF;
    window.showContent = showContent;
    window.handleExitChoice = handleExitChoice;
});

function cacheDOMElements() {
    dom.timerBox = document.getElementById("floating-timer");
    dom.minimizedTimer = document.getElementById("minimized-timer");
    dom.countdownEl = document.getElementById("countdown");
    dom.minimizedTime = document.getElementById("minimized-time");
    dom.timerProgressBar = document.getElementById("timer-progress-bar");
    dom.contentDisplay = document.getElementById("content-display");
    dom.profileModalOverlay = document.getElementById("profile-modal-overlay");
    dom.readingGrid = document.getElementById("reading-questions");
    dom.listeningGrid = document.getElementById("listening-questions");
    dom.navigationControls = document.querySelector('.navigation-controls');
    dom.questionNavigation = document.querySelector('.question-navigation');
    dom.exitConfirmModal = document.getElementById("exit-confirm-modal");
    dom.exitConfirmMessage = document.getElementById("exit-confirm-message");
    dom.userProfileDisplay = document.getElementById('user-profile-display');
    dom.profileModalCloseBtn = document.getElementById('profile-modal-close-btn');
    dom.minimizeBtn = document.getElementById("minimize-btn");
    dom.closeBtn = document.getElementById("close-btn");
    dom.submitNowBtn = document.getElementById("submit-now-btn");
}

function initializeExamPage() {
    // FIXED: Changed to localStorage to get permanent user data.
    // The login check is now handled by RX-Protect.js.
    const userDataString = localStorage.getItem('currentUser');
    
    // This check is a safety fallback. If RX-Protect.js fails, this will still stop the exam.
    if (!userDataString) {
        console.error("CRITICAL: User data not found. RX-Protect.js might have failed.");
        document.body.innerHTML = '<p style="text-align:center;font-size:1.2rem;margin-top:2rem;">Authentication Error. Cannot load exam.</p>';
        return;
    }

    const user = JSON.parse(userDataString);
    
    if (user.image && user.image.startsWith("ASSETS/WEB-SOFTWARE/")) {
        user.image = user.image.replace("ASSETS/WEB-SOFTWARE/", "");
    }

    studentInfo.id = user.id;
    studentInfo.name = user.name;
    studentInfo.username = user.username;
    studentInfo.image = user.image;
    studentInfo.serial = `RX-${String(user.id).padStart(2, '0')}`;

    populateUserProfile();
    createQuestionNavigation();
    setupEventListeners();
    handleScreenResize();

    if (dom.timerBox) dom.timerBox.style.display = "none";
}

function populateUserProfile() {
    document.getElementById("user-profile-image").src = studentInfo.image;
    document.getElementById("welcome-user-name").textContent = `Welcome, ${studentInfo.name}!`;
    document.getElementById("modal-profile-image").src = studentInfo.image;
    document.getElementById("modal-profile-name").textContent = studentInfo.name;
    document.getElementById("modal-profile-username").textContent = `@${studentInfo.username}`;
    document.getElementById("modal-profile-examid").textContent = studentInfo.serial;
}

function createQuestionNavigation() {
    dom.readingGrid.innerHTML = '';
    dom.listeningGrid.innerHTML = '';
    for (let i = 1; i <= 20; i++) dom.readingGrid.appendChild(createNumberButton(i));
    for (let i = 21; i <= TOTAL_QUESTIONS; i++) dom.listeningGrid.appendChild(createNumberButton(i));
}

function createNumberButton(number) {
    const btn = document.createElement("button");
    btn.className = "number-btn";
    btn.textContent = number;
    btn.dataset.question = number;
    btn.addEventListener("click", () => showContent(number));
    return btn;
}

function setupEventListeners() {
    dom.minimizeBtn?.addEventListener("click", minimizeTimer);
    dom.closeBtn?.addEventListener("click", closeTimer);
    dom.minimizedTimer?.addEventListener("click", restoreTimer);
    dom.submitNowBtn?.addEventListener("click", submitQuiz);
    makeDraggable(dom.timerBox);
    makeDraggable(dom.minimizedTimer);
    // Add the event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('resize', handleScreenResize);
    dom.userProfileDisplay?.addEventListener('click', openProfileModal);
    dom.profileModalCloseBtn?.addEventListener('click', closeProfileModal);
}

// ========== 2. PROFILE MODAL & UI CONTROLS ==========
function openProfileModal() { if (dom.profileModalOverlay) dom.profileModalOverlay.style.display = 'flex'; }
function closeProfileModal() { if (dom.profileModalOverlay) dom.profileModalOverlay.style.display = 'none'; }
function setExamControlsDisabled(disabled) {
    document.querySelectorAll('.number-btn, .navigation-controls button, .options-list input, #submit-now-btn')
        .forEach(control => { 
            if (control) {
                control.disabled = disabled; 
                // Add/remove a class for visual feedback
                if (disabled) {
                    control.classList.add('disabled-control');
                } else {
                    control.classList.remove('disabled-control');
                }
            }
        });
}

// ========== 3. EXAM FLOW & QUESTION DISPLAY ==========
function startExam() {
    studentInfo.startTime = new Date();
    startTimer();
}

function showContent(questionNumber) {
    if (quizSubmitted || questionNumber < 1 || questionNumber > TOTAL_QUESTIONS) return;
    if (currentQuestion === 0) startExam();
    
    // Clear any playing audio when changing questions
    clearAudio();
    
    currentQuestion = questionNumber;
    
    if (typeof questions === 'undefined' || !questions.length) {
        dom.contentDisplay.innerHTML = `<div class="question-container"><p class="danger">Error: Question data file (KR-EXAM-QM-1.js) could not be loaded.</p></div>`;
        return;
    }
    const question = questions[questionNumber - 1];
    if (!question) {
        dom.contentDisplay.innerHTML = `<div class="question-container"><p class="warning">Error: Question ${questionNumber} data is missing.</p></div>`;
        return;
    }
    dom.contentDisplay.innerHTML = buildQuestionHTML(question, questionNumber);
    updateQuestionNavigation();
    handleScreenResize();
    dom.contentDisplay.scrollTo(0, 0);

    // After rendering, if there's an audio, ensure its event listeners are correctly set up
    const audioEl = document.getElementById(`audio-${questionNumber}`);
    if (audioEl) {
        // Ensure this is called only once per audio element or its state is managed correctly
        // We now rely on 'onplay' and 'ended' events attached dynamically.
    }
}

function buildQuestionHTML(question, questionNumber) {
    const userAnswer = userAnswers[questionNumber];
    let mediaHTML = '';
    if (question.image) {
        mediaHTML += `<div class="question-media"><img src="${question.image}" alt="Question media for question ${questionNumber}" class="question-image" onerror="console.error('IMAGE NOT FOUND: Check the path for ${question.image}'); this.alt='Image not found';"></div>`;
    }
    if (question.audio) {
        const currentPlayCount = playedAudioCounts[questionNumber] || 0;
        const maxPlayCount = 2; // Defined here for clarity, can be a global const
        if (currentPlayCount < maxPlayCount) {
            mediaHTML += `<div class="question-media"><audio id="audio-${questionNumber}" controls class="question-audio" onplay="setupAudioPlayback(${questionNumber})"><source src="${question.audio}">Your browser does not support the audio element.</audio></div>`;
        } else {
            mediaHTML += `<p class="warning"><i class="fas fa-info-circle"></i> Audio for this question has been played ${maxPlayCount} times.</p>`;
        }
    }
    const optionsHTML = Object.entries(question.options).map(([key, value]) => {
        const isSelected = userAnswer === key;
        return `<li class="option-item ${isSelected ? "selected" : ""}"><label class="option-label"><input type="radio" name="q${questionNumber}" value="${key}" onchange="selectOption(${questionNumber}, '${key}')" ${isSelected ? "checked" : ""}> <span class="option-text"><strong>${key.toUpperCase()}.</strong> ${value || ''}</span></label></li>`;
    }).join('');
    return `<div class="question-container"><div class="question-header"><span class="question-number">Question ${questionNumber}</span></div><div class="question-text">${question.question || ''}</div>${mediaHTML}<ul class="options-list">${optionsHTML}</ul></div>`;
}

function selectOption(questionNumber, selectedOption) {
    userAnswers[questionNumber] = selectedOption;
    completedQuestions.add(questionNumber);
    reviewedQuestions.delete(questionNumber);
    updateQuestionNavigation();
}

function updateQuestionNavigation() {
    document.querySelectorAll(".number-btn").forEach(button => {
        const questionNum = parseInt(button.dataset.question, 10);
        button.classList.remove("current", "answered", "marked");
        if (questionNum === currentQuestion) button.classList.add("current");
        else if (completedQuestions.has(questionNum)) button.classList.add("answered");
        else if (reviewedQuestions.has(questionNum)) button.classList.add("marked");
    });
}

function clearAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.removeEventListener('ended', handleAudioEndEvent); // Clean up old listener
        currentAudio = null;
        // Ensure timer is resumed if it was paused for this audio
        if (timerPaused) {
            startTimer(); // Restart timer, it will update targetTime
            timerPaused = false;
        }
        setExamControlsDisabled(false); // Re-enable controls if they were disabled by audio
    }
}

function setupAudioPlayback(questionNumber) {
    const audio = document.getElementById(`audio-${questionNumber}`);
    if (!audio || currentAudio === audio) return; // Prevent re-setting if already playing

    // Stop any currently playing audio
    clearAudio(); 
    currentAudio = audio; // Set this as the current audio

    // Pause the exam timer
    clearInterval(timerInterval);
    timerPaused = true;
    
    // Disable all exam controls
    setExamControlsDisabled(true);
    audio.style.pointerEvents = 'none'; // Prevent direct interaction with audio controls during enforced playback

    // Initialize play count for this question
    playedAudioCounts[questionNumber] = playedAudioCounts[questionNumber] || 0;
    const maxPlayCount = 2; // Max plays per question
    
    // Define the event handler for audio 'ended'
    const handleAudioEndEvent = () => {
        playedAudioCounts[questionNumber]++;
        
        if (playedAudioCounts[questionNumber] < maxPlayCount) {
            // Wait for 5 seconds before allowing replay
            setTimeout(() => {
                audio.currentTime = 0;
                audio.play().catch(e => console.error("Error playing audio after delay:", e));
            }, 5000); // 5 second delay
        } else {
            // Final playback completed, re-enable everything
            currentAudio = null; // Clear current audio reference
            setExamControlsDisabled(false);
            
            // Resume the exam timer
            startTimer();
            timerPaused = false;
            
            // Refresh the question display to show the disabled audio message
            if (currentQuestion === questionNumber) {
                showContent(questionNumber);
            }
            
            // Clean up event listener
            audio.removeEventListener('ended', handleAudioEndEvent);
        }
    };
    
    // Attach the event listener
    audio.addEventListener('ended', handleAudioEndEvent);
}


// ========== 4. NAVIGATION & SUBMISSION ==========
function goToPrevious() { 
    clearAudio(); // Stop audio if active
    if (currentQuestion > 1) showContent(currentQuestion - 1); 
}
function goToNext() { 
    clearAudio(); // Stop audio if active
    if (currentQuestion < TOTAL_QUESTIONS) showContent(currentQuestion + 1); 
}

function markForReview() {
    if (currentQuestion === 0) return;
    reviewedQuestions.add(currentQuestion);
    completedQuestions.delete(currentQuestion);
    updateQuestionNavigation();
    goToNext();
}

function submitQuiz() {
    if (quizSubmitted) return;
    clearAudio(); // Stop any playing audio before submission
    quizSubmitted = true;
    clearInterval(timerInterval);
    timerPaused = false;
    studentInfo.endTime = new Date();
    // Remove the event listener to prevent the confirmation from showing after explicit submission
    window.removeEventListener('beforeunload', handleBeforeUnload);
    const results = calculateResults();
    displayResults(results);
}

// ========== 5. RESULTS & REPORTING ==========
function calculateResults() {
    let attempted = 0, correct = 0;
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
        if (userAnswers[i] && questions[i - 1]) {
            attempted++;
            if (userAnswers[i] === questions[i - 1].answer) {
                correct++;
            }
        }
    }
    const score = Math.round((correct / TOTAL_QUESTIONS) * 100);
    // Ensure duration calculation is robust even if endTime isn't set (shouldn't happen with submitQuiz)
    const duration = Math.floor(((studentInfo.endTime || new Date()) - studentInfo.startTime) / 1000);
    return {
        total: TOTAL_QUESTIONS, attempted, correct, incorrect: attempted - correct,
        left: TOTAL_QUESTIONS - attempted, score, duration,
        dateTime: formatDateTime(new Date())
    };
}

function displayResults(results) {
    const summaryHtml = buildResultsSummaryHTML(results);
    const reviewHtml = generateDetailedReviewHTML();
    dom.contentDisplay.innerHTML = summaryHtml + reviewHtml;
    if (dom.navigationControls) dom.navigationControls.style.display = 'none';
    if (dom.questionNavigation) dom.questionNavigation.style.display = 'none';
    dom.contentDisplay.scrollTo(0, 0);
    closeTimer();
}

function buildResultsSummaryHTML(results) {
    const durationStr = `${Math.floor(results.duration / 60)}m ${results.duration % 60}s`;
    return `<div class="result-container"><div class="result-header"><h1 class="result-title">Exam Results</h1></div><div class="result-meta"><div class="meta-item"><div class="meta-label">Student Name</div><div class="meta-value">${studentInfo.name}</div></div><div class="meta-item"><div class="meta-label">Exam ID</div><div class="meta-value">${studentInfo.serial}</div></div><div class="meta-item"><div class="meta-label">Date</div><div class="meta-value">${results.dateTime.date}</div></div><div class="meta-item"><div class="meta-label">Duration</div><div class="meta-value">${durationStr}</div></div></div><div class="result-summary"><div class="summary-item"><div class="summary-value">${results.total}</div><div class="summary-label">Total</div></div><div class="summary-item"><div class="summary-value">${results.attempted}</div><div class="summary-label">Attempted</div></div><div class="summary-item"><div class="summary-value">${results.correct}</div><div class="summary-label">Correct</div></div><div class="summary-item"><div class="summary-value">${results.incorrect}</div><div class="summary-label">Incorrect</div></div><div class="summary-item"><div class="summary-value">${results.score}%</div><div class="summary-label">Score</div></div></div><a href="#" onclick="generateResultPDF()" class="download-btn"><i class="fas fa-download"></i> Download Detailed Result</a></div>`;
}

function generateDetailedReviewHTML() {
    let reviewHtml = '<div class="detailed-review-container"><h2>Detailed Question Review</h2>';
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
        const question = questions[i - 1];
        if (!question) continue;
        const userAnswer = userAnswers[i];
        const correctAnswer = question.answer;
        const isCorrect = userAnswer === correctAnswer;
        const isAttempted = userAnswer !== undefined;
        let questionReviewHTML = `<div class="review-question-container"><div class="question-header"><span class="question-number">Question ${i}</span></div><div class="question-text">${question.question}</div>`;
        if (question.image) questionReviewHTML += `<div class="question-media"><img src="${question.image}" alt="Question image" class="question-image"></div>`;
        if (question.audio) questionReviewHTML += `<div class="question-media"><audio controls class="question-audio"><source src="${question.audio}"></audio></div>`;
        questionReviewHTML += `<ul class="options-list">`;
        for (const [key, value] of Object.entries(question.options)) {
            let itemClass = 'option-item-review';
            if (key === correctAnswer) itemClass += ' correct-answer';
            if (isAttempted && key === userAnswer) itemClass += isCorrect ? ' correct' : ' incorrect';
            const isChecked = key === userAnswer ? "checked" : "";
            questionReviewHTML += `<li class="${itemClass}"><label class="option-label"><input type="radio" name="review-q${i}" ${isChecked} disabled> <span class="option-text"><strong>${key.toUpperCase()}.</strong> ${value}</span></label></li>`;
        }
        questionReviewHTML += `</ul>`;
        if (!isAttempted) questionReviewHTML += `<p class="review-status not-attempted">Not Attempted. The correct answer is highlighted.</p>`;
        else if (isCorrect) questionReviewHTML += `<p class="review-status correct">Your answer was correct.</p>`;
        else questionReviewHTML += `<p class="review-status incorrect">Your answer was incorrect. The correct answer is highlighted.</p>`;
        questionReviewHTML += `</div>`;
        reviewHtml += questionReviewHTML;
    }
    reviewHtml += '</div>';
    return reviewHtml;
}

function generateResultPDF() {
    const results = calculateResults();
    const reviewHtml = generateDetailedReviewHTML();
    const printWindow = window.open("", "_blank");
    const styles = `body{font-family:Arial,sans-serif;margin:20px} .header{text-align:center;margin-bottom:20px} .meta, .summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:20px;border-bottom:1px solid #ccc;padding-bottom:10px} .summary-item div:first-child{font-size:1.5em;font-weight:bold} .detailed-review-container{margin-top:30px} .review-question-container{border:1px solid #eee;padding:15px;margin-bottom:15px;page-break-inside:avoid} .question-image{max-width:200px;max-height:200px;display:block;margin:10px 0} .options-list{list-style:none;padding:0} .option-item-review{padding:8px;border-radius:5px;margin-bottom:5px} .option-item-review.correct{background-color:#d4edda!important;border:1px solid #c3e6cb!important} .option-item-review.incorrect{background-color:#f8d7da!important;border:1px solid #f5c6cb!important} .option-item-review.correct-answer{background-color:#d1ecf1!important;border:1px solid #bee5eb!important} @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}`;
    const durationStr = `${Math.floor(results.duration/60)}m ${results.duration%60}s`;
    const summaryHtml = `<div class="meta"><div><strong>Student:</strong> ${studentInfo.name}</div><div><strong>Exam ID:</strong> ${studentInfo.serial}</div><div><strong>Date:</strong> ${results.dateTime.fullDateTime}</div><div><strong>Duration:</strong> ${durationStr}</div></div><div class="summary"><div class="summary-item"><div>${results.score}%</div><p>Score</p></div><div class="summary-item"><div>${results.correct}/${results.total}</div><p>Correct</p></div><div class="summary-item"><div>${results.attempted}</div><p>Attempted</p></div></div>`;
    printWindow.document.write(`<html><head><title>Exam Result - ${studentInfo.serial}</title><style>${styles}</style></head><body><div class="header"><h1>Rosan Xettri Studio</h1><h2>Korean Language Exam Result</h2></div>${summaryHtml}${reviewHtml}</body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
}

// ========== 6. UTILITY & HELPER FUNCTIONS ==========
function formatDateTime(date) {
    const d = new Date(date);
    return { date: d.toLocaleDateString(), time: d.toLocaleTimeString(), fullDateTime: d.toLocaleString() };
}

function handleScreenResize() {
    const isMobile = window.innerWidth <= 768;
    document.querySelectorAll(".question-image").forEach(img => img.style.maxHeight = isMobile ? '200px' : '300px');
}

function handleBeforeUnload(e) {
    if (studentInfo.startTime && !quizSubmitted) {
        // Prevent default browser behavior without setting returnValue
        // Setting returnValue to an empty string for some browsers.
        e.preventDefault();
        e.returnValue = ''; // Setting to empty string is crucial here

        // Show your custom modal
        showExitConfirmationModal();

        // This ensures the browser's default dialog is suppressed in most cases,
        // while still giving us a chance to show our custom modal.
        // The actual navigation away will be handled by handleExitChoice
        // if the user confirms.
    }
}

function showExitConfirmationModal() {
    if (dom.exitConfirmModal) {
        dom.exitConfirmMessage.textContent = `Hi ${studentInfo.name}, are you sure you want to leave? Your exam progress will be lost if you exit or refresh.`;
        dom.exitConfirmModal.style.display = 'flex';
        setTimeout(() => {
            dom.exitConfirmModal.classList.add('active');
        }, 10);
    }
}

function handleExitChoice(shouldExit) {
    if (dom.exitConfirmModal) {
        dom.exitConfirmModal.classList.remove('active');
        setTimeout(() => {
            dom.exitConfirmModal.style.display = 'none';
        }, 300);
    }
    
    if (shouldExit) {
        // IMPORTANT: If the user confirms to exit, we must remove the beforeunload listener
        // IMMEDIATELY before changing location. This tells the browser that the user's
        // choice has been handled, and it shouldn't show its own prompt.
        window.removeEventListener('beforeunload', handleBeforeUnload);
        
        // Actually leave the page
        window.location.href = 'about:blank'; // Or your desired exit page
    } else {
        // User chose not to exit
        // Resume timer if it was paused by audio
        if (timerPaused) {
            startTimer(); // This will restart the timer with the correct targetTime
            timerPaused = false;
        }
        setExamControlsDisabled(false); // Re-enable controls if they were disabled
    }
}
function makeDraggable(element) {
    if (!element) return;
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragMouseDown = (e) => {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };
    const elementDrag = (e) => {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    };
    const closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
    };
    element.onmousedown = dragMouseDown;
}

// ========== 7. TIMER FUNCTIONS ==========
function startTimer() {
    if (!timerPaused) { // Only update targetTime if timer wasn't paused
        targetTime = Date.now() + examDurationMs - ((Date.now() - studentInfo.startTime.getTime()) % examDurationMs);
    }
    clearInterval(timerInterval); // Clear any existing interval before starting a new one
    timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Call immediately to avoid initial delay
}

function updateCountdown() {
    if (timerPaused) return; // Do not update if timer is paused

    const distance = targetTime - Date.now();
    if (distance <= 0) {
        clearInterval(timerInterval);
        alert("Time is up! The exam will be submitted automatically.");
        submitQuiz();
        return;
    }
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    dom.countdownEl.textContent = timeString;
    dom.minimizedTime.textContent = timeString;
    dom.timerProgressBar.style.width = `${(distance / examDurationMs) * 100}%`;
    if (distance < 5 * 60 * 1000) {
        dom.countdownEl.style.color = 'var(--danger-color)';
    } else {
        dom.countdownEl.style.color = ''; // Reset color if not in danger zone
    }
}

function minimizeTimer() { dom.timerBox.classList.add("hidden"); dom.minimizedTimer.classList.remove("hidden"); }
function restoreTimer() { dom.timerBox.classList.remove("hidden"); dom.minimizedTimer.classList.add("hidden"); }
function closeTimer() { 
    if (dom.timerBox) dom.timerBox.style.display = 'none'; 
    if (dom.minimizedTimer) dom.minimizedTimer.style.display = 'none'; 
    clearInterval(timerInterval);
    timerPaused = false;
}

// --- END OF FILE KR-EXAM-BODY.js ---