// ========== GLOBAL VARIABLES ==========
let currentQuestion = 1;
const totalQuestions = 40;
const reviewedQuestions = new Set();
const completedQuestions = new Set();
const userAnswers = {};
let quizSubmitted = false;
const disabledAudios = new Set();
let timerInterval;
let targetTime;
const examDuration = 50 * 60 * 1000; // 50 minutes in milliseconds

// Student information
const studentInfo = {
  name: "",
  age: "",
  serial: "",
  startTime: null,
  endTime: null
};

// DOM Elements
const countdownEl = document.getElementById("countdown");
const timerBox = document.getElementById("floating-timer");
const minimizedTimer = document.getElementById("minimized-timer");
const minimizeBtn = document.getElementById("minimize-btn");
const closeBtn = document.getElementById("close-btn");
const lockOverlay = document.getElementById("lock-overlay");
const submitBtn = document.getElementById("submit-btn");
const minimizedTime = document.getElementById("minimized-time");
const timerProgressBar = document.getElementById("timer-progress-bar");
const readingQuestionsGrid = document.getElementById("reading-questions");
const listeningQuestionsGrid = document.getElementById("listening-questions");
const examContainer = document.querySelector(".exam-container");
const contentDisplay = document.getElementById("content-display");

// ========== SCREEN SIZE MANAGEMENT ==========
function handleScreenResize() {
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 1024;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  // Dynamic base font size (between 12px and 16px)
  const baseFontSize = Math.min(
    Math.max(viewportWidth * 0.015, 12), 
    16
  );
  document.documentElement.style.fontSize = `${baseFontSize}px`;
  
  // Adjust layout containers
  if (isMobile) {
    examContainer.style.flexDirection = "column";
    examContainer.style.height = "auto";
    document.body.style.overflow = "auto";
    
    if (!quizSubmitted) {
      timerBox.style.display = "block";
      minimizedTimer.classList.add("hidden");
    }
  } else {
    examContainer.style.flexDirection = "row";
    examContainer.style.height = "100vh";
  }
  
  // Responsive question grid buttons
  const questionBtns = document.querySelectorAll(".number-btn");
  const btnSize = isMobile ? 
    Math.min(viewportWidth * 0.08, 40) :
    Math.min(viewportWidth * 0.04, 50);
  
  questionBtns.forEach(btn => {
    btn.style.width = `${btnSize}px`;
    btn.style.height = `${btnSize}px`;
    btn.style.fontSize = `${btnSize * 0.5}px`;
  });
  
  // Image sizing
  const questionImages = document.querySelectorAll(".question-image");
  questionImages.forEach(img => {
    img.style.maxHeight = `${Math.min(300, viewportHeight * 0.4)}px`;
    img.style.maxWidth = `${Math.min(500, viewportWidth * 0.8)}px`;
  });
  
  // Audio player sizing
  const audioPlayers = document.querySelectorAll(".question-audio");
  audioPlayers.forEach(audio => {
    audio.style.width = `${Math.min(viewportWidth * 0.9, 400)}px`;
  });
  
  // Content area padding
  contentDisplay.style.padding = isMobile ? "1rem" : "2rem";
}

// ========== ENHANCED DRAGGABLE TIMER ==========
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let isDragging = false;
  let dragStartTime = 0;
  const dragThreshold = 5; // pixels
  const clickThreshold = 200; // milliseconds
  
  const dragMouseDown = (e) => {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    dragStartTime = Date.now();
    
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementDragTouch;
    
    element.classList.add("dragging-active");
  };
  
  const elementDrag = (e) => {
    e = e || window.event;
    e.preventDefault();
    
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    if (Math.abs(pos1) > dragThreshold || Math.abs(pos2) > dragThreshold) {
      isDragging = true;
    }
    
    const newTop = element.offsetTop - pos2;
    const newLeft = element.offsetLeft - pos1;
    const maxTop = window.innerHeight - element.offsetHeight;
    const maxLeft = window.innerWidth - element.offsetWidth;
    
    element.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
    element.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
  };
  
  const elementDragTouch = (e) => {
    const touch = e.touches[0];
    pos1 = pos3 - touch.clientX;
    pos2 = pos4 - touch.clientY;
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    
    if (Math.abs(pos1) > dragThreshold || Math.abs(pos2) > dragThreshold) {
      isDragging = true;
    }
    
    const newTop = element.offsetTop - pos2;
    const newLeft = element.offsetLeft - pos1;
    const maxTop = window.innerHeight - element.offsetHeight;
    const maxLeft = window.innerWidth - element.offsetWidth;
    
    element.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
    element.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
  };
  
  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
    
    element.classList.remove("dragging-active");
    
    const dragDuration = Date.now() - dragStartTime;
    if (!isDragging || (dragDuration < clickThreshold && 
        Math.abs(pos1) < dragThreshold && Math.abs(pos2) < dragThreshold)) {
      // Handle click if needed
    }
    
    isDragging = false;
  };
  
  element.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    dragStartTime = Date.now();
    element.classList.add("dragging-active");
    
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementDragTouch;
  }, { passive: false });
  
  element.addEventListener("mousedown", dragMouseDown);
  
  element.addEventListener("selectstart", (e) => {
    if (isDragging) e.preventDefault();
  });
}

// ========== TIMER FUNCTIONS ==========
function startTimer() {
  targetTime = Date.now() + examDuration;
  timerBox.style.display = "block";
  minimizedTimer.classList.add("hidden");
  
  positionTimer();
  
  timerInterval = setInterval(updateCountdown, 1000);
  updateCountdown();
}

function positionTimer() {
  const margin = 20;
  const timerWidth = timerBox.offsetWidth;
  const timerHeight = timerBox.offsetHeight;
  
  timerBox.style.top = `auto`;
  timerBox.style.bottom = `${margin}px`;
  timerBox.style.right = `${margin}px`;
  timerBox.style.left = `auto`;
  
  if (parseInt(timerBox.style.right) + timerWidth > window.innerWidth) {
    timerBox.style.right = `${margin}px`;
    timerBox.style.left = `auto`;
  }
  
  if (parseInt(timerBox.style.bottom) + timerHeight > window.innerHeight) {
    timerBox.style.bottom = `${margin}px`;
    timerBox.style.top = `auto`;
  }
}

function updateCountdown() {
  const now = Date.now();
  const distance = targetTime - now;
  
  if (distance <= 0) {
    clearInterval(timerInterval);
    countdownEl.textContent = "00:00:00";
    minimizedTime.textContent = "00:00";
    timerProgressBar.style.width = "0%";
    
    if (!quizSubmitted) {
      showTimeUpOverlay();
    }
    return;
  }
  
  const hours = Math.floor(distance / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  countdownEl.textContent = timeString;
  
  const minimizedString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  minimizedTime.textContent = minimizedString;
  
  const progressPercent = (distance / examDuration) * 100;
  timerProgressBar.style.width = `${progressPercent}%`;
  
  if (distance < 5 * 60 * 1000) {
    timerBox.style.border = "2px solid var(--danger-color)";
    countdownEl.style.color = "var(--danger-color)";
    minimizedTimer.style.backgroundColor = "var(--danger-color)";
    
    if (distance < 60 * 1000) {
      const blinkState = Math.floor(now / 500) % 2 === 0;
      countdownEl.style.opacity = blinkState ? "0.7" : "1";
      minimizedTimer.style.opacity = blinkState ? "0.7" : "1";
    }
  } else if (distance < 15 * 60 * 1000) {
    timerBox.style.border = "2px solid var(--warning-color)";
    countdownEl.style.color = "var(--warning-color)";
    minimizedTimer.style.backgroundColor = "var(--warning-color)";
  } else {
    timerBox.style.border = "2px solid var(--primary-color)";
    countdownEl.style.color = "var(--primary-color)";
    minimizedTimer.style.backgroundColor = "var(--primary-color)";
  }
}

function minimizeTimer() {
  timerBox.classList.add("hidden");
  minimizedTimer.classList.remove("hidden");
  
  // Position minimized timer
  const margin = 10;
  minimizedTimer.style.bottom = `${margin}px`;
  minimizedTimer.style.right = `${margin}px`;
}

function restoreTimer() {
  timerBox.classList.remove("hidden");
  minimizedTimer.classList.add("hidden");
  positionTimer();
}

function closeTimer() {
  timerBox.classList.add("hidden");
  minimizedTimer.classList.add("hidden");
}

function showTimeUpOverlay() {
  lockOverlay.classList.remove("hidden");
  setTimeout(() => {
    if (!quizSubmitted) {
      submitQuiz();
    }
  }, 10000);
}

// ========== EXAM INITIALIZATION ==========
function initExam() {
  generateSerialNumber();
  createQuestionNavigation();
  setupEventListeners();
  
  timerBox.style.display = "none";
  minimizedTimer.classList.add("hidden");
  
  handleScreenResize();
  
  window.addEventListener("resize", () => {
    handleScreenResize();
    if (timerBox.style.display !== "none") {
      positionTimer();
    }
  });
  
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("touchmove", (e) => {
    if (e.target.classList.contains("dragging-active")) {
      e.preventDefault();
    }
  }, { passive: false });
}

function generateSerialNumber() {
  const randomNum = Math.floor(Math.random() * 999) + 1;
  const serial = `RX-${randomNum.toString().padStart(3, "0")}`;
  document.getElementById("exam-serial").value = serial;
  studentInfo.serial = serial;
}

function createQuestionNavigation() {
  for (let i = 1; i <= 20; i++) {
    readingQuestionsGrid.appendChild(createNumberButton(i));
  }
  
  for (let i = 21; i <= 40; i++) {
    listeningQuestionsGrid.appendChild(createNumberButton(i));
  }
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
  document.getElementById("start-exam-btn").addEventListener("click", startExam);
  minimizeBtn.addEventListener("click", minimizeTimer);
  closeBtn.addEventListener("click", closeTimer);
  minimizedTimer.addEventListener("click", restoreTimer);
  
  if (submitBtn) {
    submitBtn.addEventListener("click", submitQuiz);
  }
  
  makeDraggable(timerBox);
  makeDraggable(minimizedTimer);
  
  document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  });
  
  // Add beforeunload event listener for page refresh prevention
  window.addEventListener('beforeunload', handleBeforeUnload);
}

// ========== PAGE REFRESH PREVENTION ==========
function handleBeforeUnload(e) {
  if (quizSubmitted) return;
  
  if (studentInfo.startTime && !studentInfo.endTime) {
    e.preventDefault();
    e.returnValue = '';
    
    // Show custom confirmation dialog
    showRefreshConfirmation();
  }
}

function showRefreshConfirmation() {
  const confirmationHtml = `
    <div id="refresh-confirmation" class="refresh-confirmation-overlay">
      <div class="refresh-confirmation-box">
        <h3>Warning!</h3>
        <p>Are you sure you want to refresh the page? All your progress will be lost.</p>
        <div class="confirmation-buttons">
          <button id="confirm-refresh" class="btn btn-danger">Yes, Refresh</button>
          <button id="cancel-refresh" class="btn btn-primary">No, Continue Exam</button>
        </div>
      </div>
    </div>
  `;
  
  const overlay = document.createElement('div');
  overlay.innerHTML = confirmationHtml;
  document.body.appendChild(overlay);
  
  document.getElementById('confirm-refresh').addEventListener('click', () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.location.reload();
  });
  
  document.getElementById('cancel-refresh').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
}

// ========== QUESTION DISPLAY ==========
function showContent(questionNumber) {
  if (questionNumber < 1 || questionNumber > totalQuestions) return;
  
  currentQuestion = questionNumber;
  const question = questions[questionNumber - 1];
  
  if (!question) {
    contentDisplay.innerHTML = `<div class="question-container"><p>Question not found.</p></div>`;
    return;
  }
  
  let html = `
    <div class="question-container">
      <div class="question-header">
        <span class="question-number">Question ${questionNumber}</span>
      </div>
      <div class="question-text">${question.question}</div>
  `;
  
  if (question.image) {
    html += `
      <div class="question-media">
        <img src="${question.image}" alt="Question image" class="question-image">
      </div>
    `;
  }
  
  if (question.audio && !disabledAudios.has(questionNumber)) {
    html += `
      <div class="question-media">
        <audio id="audio-${questionNumber}" controls class="question-audio">
          <source src="${question.audio}">
          Your browser does not support audio elements.
        </audio>
      </div>
    `;
  } else if (question.audio) {
    html += `<p class="warning"><i class="fas fa-info-circle"></i> Audio already played</p>`;
  }
  
  html += `<ul class="options-list">`;
  for (const [key, value] of Object.entries(question.options)) {
    const isSelected = userAnswers[questionNumber] === key;
    html += `
      <li class="option-item ${isSelected ? "selected" : ""}">
        <label class="option-label">
          <input type="radio" name="q${questionNumber}" value="${key}" 
                 onchange="selectOption(${questionNumber}, '${key}')" 
                 ${isSelected ? "checked" : ""} class="option-input">
          <span class="option-text"><strong>${key.toUpperCase()}.</strong> ${value}</span>
        </label>
      </li>
    `;
  }
  html += `</ul>`;
  
  if (quizSubmitted) {
    const userAnswer = userAnswers[questionNumber];
    const isCorrect = userAnswer === question.answer;
    
    html += `
      <div class="explanation">
        <div class="explanation-title">Answer Explanation</div>
        <p><strong>Your answer:</strong> ${userAnswer || "Not answered"}</p>
        <p><strong>Correct answer:</strong> ${question.answer}</p>
        <p class="${isCorrect ? "success" : "danger"}">
          <i class="fas ${isCorrect ? "fa-check-circle" : "fa-times-circle"}"></i>
          ${isCorrect ? "Correct" : "Incorrect"}
        </p>
        <p>${question.explanation}</p>
      </div>
    `;
  }
  
  html += `</div>`;
  contentDisplay.innerHTML = html;
  
  updateQuestionNavigation();
  
  if (question.audio && !disabledAudios.has(questionNumber)) {
    setupAudioPlayback(questionNumber);
  }
  
  contentDisplay.scrollTo(0, 0);
}

function setupAudioPlayback(questionNumber) {
  const audioElement = document.getElementById(`audio-${questionNumber}`);
  let playCount = 0;
  
  // Disable all interactive elements
  const disableElements = () => {
    const interactiveElements = document.querySelectorAll(`
      button, 
      input[type="radio"], 
      input[type="checkbox"],
      .question-audio
    `);
    
    interactiveElements.forEach(element => {
      if (!element.classList.contains('question-audio')) {
        element.disabled = true;
        element.style.opacity = '0.5';
        element.style.cursor = 'not-allowed';
      }
      element.style.pointerEvents = 'none';
    });
  };
  
  // Enable all interactive elements
  const enableElements = () => {
    const interactiveElements = document.querySelectorAll(`
      button, 
      input[type="radio"], 
      input[type="checkbox"],
      .question-audio
    `);
    
    interactiveElements.forEach(element => {
      element.disabled = false;
      element.style.opacity = '1';
      element.style.cursor = 'pointer';
      element.style.pointerEvents = 'auto';
    });

    // Restore audio controls
    if (audioElement) {
      audioElement.style.pointerEvents = 'auto';
    }
  };
  
  const endedHandler = function() {
    playCount++;
    
    if (playCount >= 2) {
      enableElements();
      disabledAudios.add(questionNumber);
      audioElement.removeEventListener("ended", endedHandler);
      audioElement.removeEventListener("play", playHandler);
      showContent(questionNumber);
    } else {
      // Prepare for second playback
      setTimeout(() => {
        audioElement.currentTime = 0;
        disableElements();
        audioElement.play().catch(e => console.error("Audio play failed:", e));
      }, 300);
    }
  };
  
  const playHandler = function() {
    disableElements();
    audioElement.addEventListener("ended", endedHandler);
  };
  
  // Only setup event listeners, don't autoplay
  audioElement.addEventListener("play", playHandler);
  
  // Make audio controls work for first play
  audioElement.style.pointerEvents = 'auto';
  audioElement.controls = true;
}

function updateQuestionNavigation() {
  const allButtons = document.querySelectorAll(".number-btn");
  
  allButtons.forEach(button => {
    const questionNum = parseInt(button.dataset.question);
    button.classList.remove("current", "answered", "marked");
    
    if (questionNum === currentQuestion) {
      button.classList.add("current");
    } else if (reviewedQuestions.has(questionNum)) {
      button.classList.add("marked");
    } else if (completedQuestions.has(questionNum)) {
      button.classList.add("answered");
    }
  });
}

// ========== ANSWER HANDLING ==========
function selectOption(questionNumber, selectedOption) {
  userAnswers[questionNumber] = selectedOption;
  completedQuestions.add(questionNumber);
  reviewedQuestions.delete(questionNumber);
  updateQuestionNavigation();
}

// ========== NAVIGATION CONTROLS ==========
function goToPrevious() {
  if (currentQuestion > 1) showContent(currentQuestion - 1);
}

function goToNext() {
  if (currentQuestion < totalQuestions) showContent(currentQuestion + 1);
}

function markForReview() {
  reviewedQuestions.add(currentQuestion);
  completedQuestions.delete(currentQuestion);
  updateQuestionNavigation();
  goToNext();
}

// ========== QUIZ SUBMISSION ==========
function submitQuiz() {
  if (quizSubmitted) return;
  
  clearInterval(timerInterval);
  studentInfo.endTime = new Date();
  quizSubmitted = true;
  lockOverlay.classList.add("hidden");
  
  // Remove the beforeunload event listener
  window.removeEventListener('beforeunload', handleBeforeUnload);
  
  const results = calculateResults();
  displayResults(results);
  
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  }
}

function calculateResults() {
  const total = questions.length;
  let attempted = 0;
  let correct = 0;
  let incorrect = 0;
  
  for (let i = 1; i <= total; i++) {
    if (userAnswers[i]) {
      attempted++;
      if (userAnswers[i] === questions[i - 1].answer) {
        correct++;
      } else {
        incorrect++;
      }
    }
  }
  
  const left = total - attempted;
  const score = Math.round((correct / total) * 100);
  const duration = Math.floor((studentInfo.endTime - studentInfo.startTime) / 1000);
  const dateTime = formatDateTime(studentInfo.endTime);
  
  return {
    total,
    attempted,
    left,
    correct,
    incorrect,
    score,
    duration,
    dateTime
  };
}

function formatDateTime(date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  return {
    date: `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
    time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
    fullDateTime: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  };
}

function displayResults(results) {
  let html = `
    <div class="result-container">
      <div class="result-header">
        <h1 class="result-title">Exam Results</h1>
        <h2 class="result-subtitle">Korean Language Exam</h2>
      </div>
      
      <div class="result-meta">
        <div class="meta-item">
          <div class="meta-label">Student Name</div>
          <div class="meta-value">${studentInfo.name}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Age</div>
          <div class="meta-value">${studentInfo.age}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Exam ID</div>
          <div class="meta-value">${studentInfo.serial}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Date</div>
          <div class="meta-value">${results.dateTime.date}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Time</div>
          <div class="meta-value">${results.dateTime.time}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Duration</div>
          <div class="meta-value">${Math.floor(results.duration / 60)} min ${results.duration % 60} sec</div>
        </div>
      </div>
      
      <div class="result-summary">
        <div class="summary-item">
          <div class="summary-value">${results.total}</div>
          <div class="summary-label">Total Questions</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${results.attempted}</div>
          <div class="summary-label">Attempted</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${results.left}</div>
          <div class="summary-label">Left</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${results.correct}</div>
          <div class="summary-label">Correct</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${results.incorrect}</div>
          <div class="summary-label">Incorrect</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${results.score}%</div>
          <div class="summary-label">Score</div>
        </div>
      </div>
      
      <div class="result-details">
        <h3 class="details-title">Detailed Review</h3>
        <div class="question-review">
  `;
  
  questions.forEach((q, index) => {
    const qNum = index + 1;
    const userAnswer = userAnswers[qNum] || "Not answered";
    const isCorrect = userAnswer === q.answer;
    
    html += `
      <div class="review-item">
        <h4 class="review-question">Question ${qNum}</h4>
        <p class="review-question-text">${q.question}</p>
        ${q.image ? `<img src="${q.image}" class="question-image" style="max-width: 200px; max-height: 150px;">` : ""}
        <p class="review-answer"><strong>Your answer:</strong> ${userAnswer}</p>
        <p class="review-answer"><strong>Correct answer:</strong> ${q.answer}</p>
        <p class="${isCorrect ? "review-correct" : "review-incorrect"}">
          <i class="fas ${isCorrect ? "fa-check" : "fa-times"}"></i>
          ${isCorrect ? "Correct" : "Incorrect"}
        </p>
        <p class="review-explanation"><strong>Explanation:</strong> ${q.explanation}</p>
      </div>
    `;
  });
  
  html += `
        </div>
      </div>
      
      <a href="#" onclick="generateResultPDF()" class="download-btn">
        <i class="fas fa-download"></i> Download Result
      </a>
    </div>
  `;
  
  contentDisplay.innerHTML = html;
  contentDisplay.scrollTo(0, 0);
}

function generateResultPDF() {
  const results = calculateResults();
  const printWindow = window.open("", "_blank");
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Exam Result - ${studentInfo.serial}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { color: #d1041f; margin-bottom: 5px; }
          .header h2 { color: #555; margin-top: 0; }
          .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
          .meta-item { padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
          .meta-label { font-size: 12px; color: #777; }
          .meta-value { font-weight: bold; }
          .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
          .summary-item { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .summary-value { font-size: 24px; font-weight: bold; color: #d1041f; margin-bottom: 5px; }
          .review-item { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
          .review-question { color: #d1041f; margin-bottom: 5px; }
          .correct { color: #28a745; }
          .incorrect { color: #dc3545; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
          @media print {
            body { font-size: 12px; }
            .meta, .summary { grid-template-columns: repeat(2, 1fr); }
            .review-item { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rosan Xettri Studio</h1>
          <h2>Korean Language Exam Result</h2>
        </div>
        
        <div class="meta">
          <div class="meta-item">
            <div class="meta-label">Student Name</div>
            <div class="meta-value">${studentInfo.name}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Age</div>
            <div class="meta-value">${studentInfo.age}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Exam ID</div>
            <div class="meta-value">${studentInfo.serial}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Date</div>
            <div class="meta-value">${results.dateTime.date}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Time</div>
            <div class="meta-value">${results.dateTime.time}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Duration</div>
            <div class="meta-value">${Math.floor(results.duration / 60)} min ${results.duration % 60} sec</div>
          </div>
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <div class="summary-value">${results.total}</div>
            <div>Total Questions</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${results.attempted}</div>
            <div>Attempted</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${results.left}</div>
            <div>Left</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${results.correct}</div>
            <div>Correct</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${results.incorrect}</div>
            <div>Incorrect</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${results.score}%</div>
            <div>Score</div>
          </div>
        </div>
        
        <h3>Detailed Review</h3>
        
        ${questions.map((q, index) => {
          const qNum = index + 1;
          const userAnswer = userAnswers[qNum] || "Not answered";
          const isCorrect = userAnswer === q.answer;
          
          return `
            <div class="review-item">
              <h4 class="review-question">Question ${qNum}</h4>
              <p>${q.question}</p>
              ${q.image ? `<img src="${q.image}" style="max-width: 200px; max-height: 150px; margin: 5px 0;">` : ""}
              <p><strong>Your answer:</strong> ${userAnswer}</p>
              <p><strong>Correct answer:</strong> ${q.answer}</p>
              <p class="${isCorrect ? "correct" : "incorrect"}">
                <strong>${isCorrect ? "✓ Correct" : "✗ Incorrect"}</strong>
              </p>
              <p><em>Explanation: ${q.explanation}</em></p>
            </div>
          `;
        }).join("")}
        
        <div class="footer">
          Generated by Rosan Xettri Studio - ${results.dateTime.fullDateTime}
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 200);
          };
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}

// ========== START EXAM ==========
function startExam() {
  const name = document.getElementById("student-name").value.trim();
  const age = document.getElementById("student-age").value.trim();
  
  if (!name || !age) {
    alert("Please fill in all required fields");
    return;
  }
  
  studentInfo.name = name;
  studentInfo.age = age;
  studentInfo.startTime = new Date();
  
  document.getElementById("registration-modal").style.display = "none";
  startTimer();
  showContent(1);
  
  if (screen.orientation && screen.orientation.lock) {
    try {
      screen.orientation.lock("portrait");
    } catch (e) {
      console.log("Orientation lock not supported");
    }
  }
}

// Initialize the exam when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initExam();
  
  // Expose functions to global scope for HTML onclick handlers
  window.goToPrevious = goToPrevious;
  window.goToNext = goToNext;
  window.markForReview = markForReview;
  window.submitQuiz = submitQuiz;
  window.selectOption = selectOption;
  window.generateResultPDF = generateResultPDF;
});