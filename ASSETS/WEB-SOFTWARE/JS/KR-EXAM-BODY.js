// ========== GLOBAL VARIABLES ==========
let currentQuestion = 0;
const totalQuestions = 40;
const reviewedQuestions = new Set();
const completedQuestions = new Set();
const userAnswers = {};
let quizSubmitted = false;
const disabledAudios = new Set();
let timerInterval = null;
let targetTime;
const examDuration = 50 * 60 * 1000;

const studentInfo = {
  id: null, name: "", username: "", image: "",
  serial: "", startTime: null, endTime: null
};

// DOM Elements
const timerBox = document.getElementById("floating-timer");
const minimizedTimer = document.getElementById("minimized-timer");
const countdownEl = document.getElementById("countdown");
const minimizedTime = document.getElementById("minimized-time");
const timerProgressBar = document.getElementById("timer-progress-bar");
const contentDisplay = document.getElementById("content-display");
const lockOverlay = document.getElementById("lock-overlay");
const profileModalOverlay = document.getElementById("profile-modal-overlay");

// ========== 1. INITIALIZATION & USER AUTHENTICATION ==========

function initializeExamPage() {
    const userDataString = sessionStorage.getItem('currentUser');
    if (!userDataString) {
        alert("Authentication required. Redirecting to login page.");
        window.location.href = "https://rosankc.com.np/USER-LOGIN.html";
        return;
    }

    const user = JSON.parse(userDataString);

    // [RESTORED FIX] Correct the relative path for the user image
    if (user.image && user.image.startsWith("ASSETS/WEB-SOFTWARE/")) {
        user.image = user.image.replace("ASSETS/WEB-SOFTWARE/", "");
    }

    studentInfo.id = user.id;
    studentInfo.name = user.name;
    studentInfo.username = user.username;
    studentInfo.image = user.image; // The corrected path is now used
    studentInfo.serial = `RX-${String(user.id).padStart(2, '0')}`;

    populateUserProfile();
    createQuestionNavigation();
    setupEventListeners();
    handleScreenResize();

    timerBox.style.display = "none";
}

function populateUserProfile() {
    // Populate header image
    document.getElementById("user-profile-image").src = studentInfo.image;
    document.getElementById("welcome-user-name").textContent = `Welcome, ${studentInfo.name}!`;

    // Populate modal details
    document.getElementById("modal-profile-image").src = studentInfo.image;
    document.getElementById("modal-profile-name").textContent = studentInfo.name;
    document.getElementById("modal-profile-username").textContent = `@${studentInfo.username}`;
    document.getElementById("modal-profile-examid").textContent = studentInfo.serial;
}

function createQuestionNavigation() {
    const readingGrid = document.getElementById("reading-questions");
    const listeningGrid = document.getElementById("listening-questions");
    readingGrid.innerHTML = '';
    listeningGrid.innerHTML = '';
    for (let i = 1; i <= 20; i++) readingGrid.appendChild(createNumberButton(i));
    for (let i = 21; i <= 40; i++) listeningGrid.appendChild(createNumberButton(i));
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
    document.getElementById("minimize-btn").addEventListener("click", minimizeTimer);
    document.getElementById("close-btn").addEventListener("click", closeTimer);
    document.getElementById("minimized-timer").addEventListener("click", restoreTimer);
    // [MODIFIED] Button now calls submitQuiz directly, no confirmation
    document.getElementById("submit-now-btn")?.addEventListener("click", submitQuiz);
    
    makeDraggable(timerBox);
    makeDraggable(minimizedTimer);
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('resize', handleScreenResize);

    document.getElementById('user-profile-display').addEventListener('click', openProfileModal);
    document.getElementById('profile-modal-close-btn').addEventListener('click', closeProfileModal);
}

// ========== 2. PROFILE MODAL CONTROLS ==========

function openProfileModal() { if (profileModalOverlay) profileModalOverlay.style.display = 'flex'; }
function closeProfileModal() { if (profileModalOverlay) profileModalOverlay.style.display = 'none'; }

// ========== 3. EXAM FLOW & QUESTION DISPLAY ==========

function startExam() {
    studentInfo.startTime = new Date();
    startTimer();
}

function showContent(questionNumber) {
    if (quizSubmitted) return;
    if (currentQuestion === 0) startExam();
    if (questionNumber < 1 || questionNumber > totalQuestions) return;
    
    currentQuestion = questionNumber;
    
    if (typeof questions === 'undefined' || !questions.length) {
        contentDisplay.innerHTML = `<div class="question-container"><p class="danger">Error: Question data file (KR-EXAM-QM-1.js) could not be loaded.</p></div>`;
        return;
    }
    const question = questions[questionNumber - 1];
    
    let html = `<div class="question-container">
        <div class="question-header"><span class="question-number">Question ${questionNumber}</span></div>
        <div class="question-text">${question.question}</div>`;
    if (question.image) html += `<div class="question-media"><img src="${question.image}" alt="Question image" class="question-image"></div>`;
    if (question.audio) {
        if (!disabledAudios.has(questionNumber)) {
            html += `<div class="question-media"><audio id="audio-${questionNumber}" controls class="question-audio" onplay="setupAudioPlayback(${questionNumber})"><source src="${question.audio}"></audio></div>`;
        } else {
            html += `<p class="warning"><i class="fas fa-info-circle"></i> Audio already played</p>`;
        }
    }
    html += `<ul class="options-list">`;
    for (const [key, value] of Object.entries(question.options)) {
        const isSelected = userAnswers[questionNumber] === key;
        html += `<li class="option-item ${isSelected ? "selected" : ""}"><label class="option-label"><input type="radio" name="q${questionNumber}" value="${key}" onchange="selectOption(${questionNumber}, '${key}')" ${isSelected ? "checked" : ""}>
                 <span class="option-text"><strong>${key.toUpperCase()}.</strong> ${value}</span></label></li>`;
    }
    html += `</ul></div>`;
    
    contentDisplay.innerHTML = html;
    updateQuestionNavigation();
    handleScreenResize();
    contentDisplay.scrollTo(0, 0);
}

function selectOption(questionNumber, selectedOption) {
    userAnswers[questionNumber] = selectedOption;
    completedQuestions.add(questionNumber);
    reviewedQuestions.delete(questionNumber);
    updateQuestionNavigation();
}

function updateQuestionNavigation() {
    document.querySelectorAll(".number-btn").forEach(button => {
        const questionNum = parseInt(button.dataset.question);
        button.classList.remove("current", "answered", "marked");
        if (questionNum === currentQuestion) button.classList.add("current");
        else if (completedQuestions.has(questionNum)) button.classList.add("answered");
        else if (reviewedQuestions.has(questionNum)) button.classList.add("marked");
    });
}

function setExamControlsDisabled(disabled) {
    const controls = [
        ...document.querySelectorAll('.number-btn'),
        ...document.querySelectorAll('.navigation-controls button'),
        ...document.querySelectorAll('.options-list input'),
        document.getElementById('submit-now-btn')
    ];
    controls.forEach(control => { if (control) control.disabled = disabled; });
}

function setupAudioPlayback(questionNumber) {
    const audio = document.getElementById(`audio-${questionNumber}`);
    setExamControlsDisabled(true);
    audio.style.pointerEvents = 'none';

    if (audio.dataset.listenerAttached) return;

    audio.addEventListener('ended', () => {
        disabledAudios.add(questionNumber);
        setExamControlsDisabled(false);
        if(currentQuestion === questionNumber) showContent(questionNumber);
    });
    audio.dataset.listenerAttached = 'true';
}

// ========== 4. NAVIGATION & SUBMISSION ==========

function goToPrevious() { if (currentQuestion > 1) showContent(currentQuestion - 1); }
function goToNext() { if (currentQuestion < totalQuestions) showContent(currentQuestion + 1); }
function markForReview() {
    if (currentQuestion === 0) return;
    reviewedQuestions.add(currentQuestion);
    completedQuestions.delete(currentQuestion);
    updateQuestionNavigation();
    goToNext();
}

function submitQuiz() {
    if (quizSubmitted) return;
    quizSubmitted = true;
    clearInterval(timerInterval);
    studentInfo.endTime = new Date();
    window.removeEventListener('beforeunload', handleBeforeUnload);
    displayResults(calculateResults());
}

// ========== 5. RESULTS & REPORTING ==========

function calculateResults() {
    let attempted = 0, correct = 0;
    for (let i = 1; i <= totalQuestions; i++) {
        if (userAnswers[i] && questions[i - 1]) {
            attempted++;
            if (userAnswers[i] === questions[i - 1].answer) correct++;
        }
    }
    const score = Math.round((correct / totalQuestions) * 100);
    const duration = Math.floor(((studentInfo.endTime || new Date()) - studentInfo.startTime) / 1000);
    return {
        total: totalQuestions, attempted, correct, incorrect: attempted - correct,
        left: totalQuestions - attempted, score, duration,
        dateTime: formatDateTime(new Date())
    };
}

function displayResults(results) {
    let resultsHtml = `<div class="result-container">
        <div class="result-header"><h1 class="result-title">Exam Results</h1></div>
        <div class="result-meta">
            <div class="meta-item"><div class="meta-label">Student Name</div><div class="meta-value">${studentInfo.name}</div></div>
            <div class="meta-item"><div class="meta-label">Exam ID</div><div class="meta-value">${studentInfo.serial}</div></div>
            <div class="meta-item"><div class="meta-label">Date</div><div class="meta-value">${results.dateTime.date}</div></div>
            <div class="meta-item"><div class="meta-label">Duration</div><div class="meta-value">${Math.floor(results.duration / 60)}m ${results.duration % 60}s</div></div>
        </div>
        <div class="result-summary">
            <div class="summary-item"><div class="summary-value">${results.total}</div><div class="summary-label">Total</div></div>
            <div class="summary-item"><div class="summary-value">${results.attempted}</div><div class="summary-label">Attempted</div></div>
            <div class="summary-item"><div class="summary-value">${results.correct}</div><div class="summary-label">Correct</div></div>
            <div class="summary-item"><div class="summary-value">${results.incorrect}</div><div class="summary-label">Incorrect</div></div>
            <div class="summary-item"><div class="summary-value">${results.score}%</div><div class="summary-label">Score</div></div>
        </div>
        <a href="#" onclick="generateResultPDF()" class="download-btn"><i class="fas fa-download"></i> Download Detailed Result</a>
    </div>`;
    
    resultsHtml += generateDetailedReviewHTML();
    
    contentDisplay.innerHTML = resultsHtml;
    document.querySelector('.navigation-controls').style.display = 'none';
    document.querySelector('.question-navigation').style.display = 'none'; // Hide question numbers on result
    contentDisplay.scrollTo(0, 0);
}

function generateDetailedReviewHTML() {
    let reviewHtml = '<div class="detailed-review-container"><h2>Detailed Question Review</h2>';
    for (let i = 1; i <= totalQuestions; i++) {
        const question = questions[i - 1];
        if (!question) continue;

        const userAnswer = userAnswers[i];
        const correctAnswer = question.answer;
        const isCorrect = userAnswer === correctAnswer;
        const isAttempted = userAnswer !== undefined;

        reviewHtml += `<div class="review-question-container">
            <div class="question-header"><span class="question-number">Question ${i}</span></div>
            <div class="question-text">${question.question}</div>`;

        if (question.image) reviewHtml += `<div class="question-media"><img src="${question.image}" alt="Question image" class="question-image"></div>`;
        if (question.audio) reviewHtml += `<div class="question-media"><audio controls class="question-audio"><source src="${question.audio}"></audio></div>`;

        reviewHtml += `<ul class="options-list">`;
        for (const [key, value] of Object.entries(question.options)) {
            let itemClass = 'option-item-review';
            if (isAttempted && key === userAnswer) itemClass += isCorrect ? ' correct' : ' incorrect';
            else if (key === correctAnswer) itemClass += ' correct-answer';
            
            const isChecked = key === userAnswer ? "checked" : "";
            reviewHtml += `<li class="${itemClass}"><label class="option-label"><input type="radio" name="review-q${i}" ${isChecked} disabled> <span class="option-text"><strong>${key.toUpperCase()}.</strong> ${value}</span></label></li>`;
        }
        reviewHtml += `</ul>`;

        if (!isAttempted) reviewHtml += `<p class="review-status not-attempted">Not Attempted. The correct answer is highlighted.</p>`;
        else if (isCorrect) reviewHtml += `<p class="review-status correct">Your answer was correct.</p>`;
        else reviewHtml += `<p class="review-status incorrect">Your answer was incorrect. The correct answer is highlighted.</p>`;
        
        reviewHtml += `</div>`;
    }
    reviewHtml += '</div>';
    return reviewHtml;
}

function generateResultPDF() {
    const results = calculateResults();
    const reviewHtml = generateDetailedReviewHTML();
    const printWindow = window.open("", "_blank");

    const styles = `
        body{font-family:Arial,sans-serif;margin:20px}
        .header{text-align:center;margin-bottom:20px}
        .meta, .summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:20px;border-bottom:1px solid #ccc;padding-bottom:10px}
        .summary-item div:first-child{font-size:1.5em;font-weight:bold}
        .detailed-review-container{margin-top:30px}
        .review-question-container{border:1px solid #eee;padding:15px;margin-bottom:15px;page-break-inside:avoid}
        .question-image{max-width:200px;max-height:200px;display:block;margin:10px 0}
        .options-list{list-style:none;padding:0}
        .option-item-review{padding:8px;border-radius:5px;margin-bottom:5px}
        .option-item-review.correct{background-color:#d4edda!important;border:1px solid #c3e6cb!important}
        .option-item-review.incorrect{background-color:#f8d7da!important;border:1px solid #f5c6cb!important}
        .option-item-review.correct-answer{background-color:#fff3cd!important;border:1px solid #ffeeba!important}
        @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
    `;
    const summaryHtml = `<div class="meta"><div><strong>Student:</strong> ${studentInfo.name}</div><div><strong>Exam ID:</strong> ${studentInfo.serial}</div><div><strong>Date:</strong> ${results.dateTime.fullDateTime}</div><div><strong>Duration:</strong> ${Math.floor(results.duration/60)}m ${results.duration%60}s</div></div><div class="summary"><div class="summary-item"><div>${results.score}%</div><p>Score</p></div><div class="summary-item"><div>${results.correct}/${results.total}</div><p>Correct</p></div><div class="summary-item"><div>${results.attempted}</div><p>Attempted</p></div></div>`;

    printWindow.document.write(`<html><head><title>Exam Result - ${studentInfo.serial}</title><style>${styles}</style></head><body><div class="header"><h1>Rosan Xettri Studio</h1><h2>Korean Language Exam Result</h2></div>${summaryHtml}${reviewHtml}<script>setTimeout(()=>{window.print();window.close()},500)</script></body></html>`);
    printWindow.document.close();
}

function formatDateTime(date) {
    const d = new Date(date);
    return { date: d.toLocaleDateString(), time: d.toLocaleTimeString(), fullDateTime: d.toLocaleString() };
}

// ========== 6. UTILITY & HELPER FUNCTIONS ==========

function handleScreenResize() {
    const isMobile = window.innerWidth <= 768;
    document.querySelectorAll(".question-image").forEach(img => img.style.maxHeight = isMobile ? '200px' : '300px');
}

function handleBeforeUnload(e) {
    if (studentInfo.startTime && !quizSubmitted) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your exam progress will be lost.';
    }
}

function makeDraggable(element) {
    if (!element) return;
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragMouseDown = (e) => { e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; };
    const elementDrag = (e) => { e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; element.style.top = (element.offsetTop - pos2) + "px"; element.style.left = (element.offsetLeft - pos1) + "px"; };
    const closeDragElement = () => { document.onmouseup = null; document.onmousemove = null; };
    element.onmousedown = dragMouseDown;
}

function startTimer() {
    targetTime = Date.now() + examDuration;
    timerBox.style.display = "block";
    timerInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const distance = targetTime - Date.now();
    if (distance <= 0) {
        clearInterval(timerInterval);
        submitQuiz();
        return;
    }
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    countdownEl.textContent = timeString;
    minimizedTime.textContent = timeString;
    timerProgressBar.style.width = `${(distance / examDuration) * 100}%`;
    if (distance < 5 * 60 * 1000) countdownEl.style.color = 'var(--danger-color)';
}

function minimizeTimer() { timerBox.classList.add("hidden"); minimizedTimer.classList.remove("hidden"); }
function restoreTimer() { timerBox.classList.remove("hidden"); minimizedTimer.classList.add("hidden"); }
function closeTimer() { timerBox.style.display = 'none'; minimizedTimer.style.display = 'none'; }

// ========== 7. PAGE LOAD ENTRY POINT ==========
document.addEventListener("DOMContentLoaded", () => {
    initializeExamPage();
    window.goToPrevious = goToPrevious;
    window.goToNext = goToNext;
    window.markForReview = markForReview;
    window.submitQuiz = submitQuiz; // Global function is now the direct submit
    window.selectOption = selectOption;
    window.generateResultPDF = generateResultPDF;
});