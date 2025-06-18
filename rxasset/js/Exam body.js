// Combined and Enhanced Exam Script

// ========== GLOBAL VARIABLES ==========
let currentQuestion = 1;
const reviewedQuestions = new Set();
const completedQuestions = new Set();
const userAnswers = {}; // { questionNumber: "a" | "b" | ... }
let quizSubmitted = false;
const disabledAudios = new Set(); // Track which audios have been disabled
let timerInterval;
let targetTime;

// Student information and exam details
const studentInfo = {
  name: "",
  age: "",
  serial: "",
  startTime: null,
  endTime: null
};

// DOM Elements
const countdownEl = document.getElementById("countdown");
const minimizeBtn = document.getElementById("minimize-btn");
const timerBox = document.getElementById("floating-timer");
const minimizedCircle = document.getElementById("minimized-circle");
const lockOverlay = document.getElementById("lock-overlay");
const submitBtn = document.getElementById("submit-btn");

// Timer Settings
let isWarningGiven = false;
let isManuallySubmitted = false;
const warningThreshold = 5000; // 5 seconds warning

// ========== INITIALIZATION ==========
function initExam() {
  // Generate serial number (RX-001 to RX-999)
  const serialNumber = "RX-" + Math.floor(Math.random() * 999 + 1).toString().padStart(3, '0');
  document.getElementById('exam-serial').value = serialNumber;
  
  // Set up start exam button
  document.getElementById('start-exam-btn').addEventListener('click', startExam);
  
  // Initially hide the timer
  timerBox.style.display = 'none';
  
  // Set up drag functionality
  setupDraggableElements();
  
  // Set up submit button
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      isManuallySubmitted = true;
      submitQuiz();
    });
  }
}

// ========== EXAM TIMER FUNCTIONS ==========
function startTimer(durationMinutes = 40) {
  targetTime = new Date().getTime() + durationMinutes * 60 * 1000;
  timerBox.style.display = 'block';
  timerInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  if (isManuallySubmitted) {
    clearInterval(timerInterval);
    return;
  }

  const now = new Date().getTime();
  const distance = targetTime - now;

  if (distance <= 0) {
    clearInterval(timerInterval);
    countdownEl.innerText = "00:00:00";
    
    if (!quizSubmitted) {
      lockOverlay.style.display = "flex";
      setTimeout(() => {
        if (!quizSubmitted) {
          submitQuiz();
        }
      }, 2000); // Auto-submit after 2 seconds if user doesn't click anything
    }
    return;
  }

  const hours = Math.floor(distance / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdownEl.innerText =
    `${String(hours).padStart(2, '0')}:` +
    `${String(minutes).padStart(2, '0')}:` +
    `${String(seconds).padStart(2, '0')}`;

  // Warning when time is running out
  if (distance <= warningThreshold && !isWarningGiven) {
    isWarningGiven = true;
    showTimeWarning();
  }
}

function showTimeWarning() {
  // Visual warning when time is almost up
  timerBox.style.animation = "pulse 0.5s infinite alternate";
  setTimeout(() => {
    timerBox.style.animation = "";
  }, 5000);
}

// ========== DRAG FUNCTIONALITY ==========
function setupDraggableElements() {
  timerBox.style.position = "fixed";
  minimizedCircle.style.position = "fixed";
  makeDraggable(timerBox);
  makeDraggable(minimizedCircle);

  // Minimize/Expand functionality
  minimizeBtn.addEventListener("click", () => {
    timerBox.classList.add("hidden");
    minimizedCircle.classList.remove("hidden");
  });
  
  minimizedCircle.addEventListener("click", () => {
    timerBox.classList.remove("hidden");
    minimizedCircle.classList.add("hidden");
  });
}

function makeDraggable(el) {
  let isDragging = false, offsetX = 0, offsetY = 0;

  el.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    el.style.width = rect.width + "px";
    el.style.height = rect.height + "px";
    el.style.transition = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.right = "auto";
    el.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    el.style.transition = "";
  });

  // Touch support
  el.addEventListener("touchstart", (e) => {
    isDragging = true;
    const touch = e.touches[0];
    const rect = el.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;
    el.style.width = rect.width + "px";
    el.style.height = rect.height + "px";
    el.style.transition = "none";
  });

  document.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.right = "auto";
    el.style.bottom = "auto";
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
    el.style.transition = "";
  });
}

// ========== EXAM START FUNCTION ==========
function startExam() {
  const name = document.getElementById('student-name').value.trim();
  const age = document.getElementById('student-age').value.trim();
  
  if (!name || !age) {
    alert("Please fill in all required fields");
    return;
  }
  
  // Store student info
  studentInfo.name = name;
  studentInfo.age = age;
  studentInfo.serial = document.getElementById('exam-serial').value;
  studentInfo.startTime = new Date();
  
  // Hide registration modal
  document.getElementById('registration-modal').style.display = 'none';
  
  // Start the timer (40 minutes by default)
  startTimer(40);
  
  // Show first question
  showContent(1);
}

// ========== QUESTION DISPLAY FUNCTIONS ==========
function showContent(num) {
  const q = questions[num - 1];
  const contentDisplay = document.getElementById('content-display');

  if (!q) {
    contentDisplay.innerHTML = `<p>Question not found.</p>`;
    return;
  }

  currentQuestion = num;

  let html = `<h2>Question ${num}</h2><p>${q.question}</p>`;

  if (q.image) {
    html += `<img src="${q.image}" alt="Question Image" style="max-width:100%; margin:10px 0; border-radius:8px;" />`;
  }

  if (q.audio) {
    html += `
      <audio id="audio-${num}" controls style="margin:10px 0; width:100%; ${disabledAudios.has(num) ? 'display:none;' : ''}">
        <source src="${q.audio}">
        Your browser does not support the audio element.
      </audio>
      ${disabledAudios.has(num) ? '<p>Audio already played</p>' : ''}
    `;
  }

  html += `<ul style="list-style:none; padding:0;">`;
  for (const [key, value] of Object.entries(q.options)) {
    const isSelected = userAnswers[num] === key;
    html += `
      <li style="margin: 5px 0;">
        <label style="cursor:pointer;">
          <input type="radio" name="q${num}" value="${key}" onchange="selectOption(${num}, '${key}')" ${isSelected ? 'checked' : ''}>
          <strong>${key.toUpperCase()}.</strong> ${value}
        </label>
      </li>
    `;
  }
  html += `</ul>`;

  if (quizSubmitted) {
    html += `
      <p><strong>Your Answer:</strong> ${userAnswers[num] || 'None'}</p>
      <p><strong>Correct Answer:</strong> ${q.answer}</p>
      <p style="margin-top:10px;"><em><strong>Explanation:</strong> ${q.explanation}</em></p>
    `;
  }

  contentDisplay.innerHTML = html;
  updateNumberHighlight();

  // Auto-play audio 2 times after user clicks play
  if (q.audio && !disabledAudios.has(num)) {
    setupAudioPlayback(num);
  }
}

function setupAudioPlayback(num) {
  const audioElement = document.getElementById(`audio-${num}`);
  let playCount = 0;

  const endedHandler = function() {
    playCount++;
    if (playCount < 2) {
      audioElement.currentTime = 0;
      audioElement.play();
    } else {
      // Disable this audio for future plays
      disabledAudios.add(num);
      // Remove event listeners to prevent memory leak
      audioElement.removeEventListener('ended', endedHandler);
      audioElement.removeEventListener('play', playHandler);
      // Refresh display to hide audio
      showContent(num);
    }
  };

  const playHandler = function() {
    // When user clicks play → start tracking ended event
    audioElement.removeEventListener('play', playHandler); // Only once
    audioElement.addEventListener('ended', endedHandler);
  };

  // Wait for user to click play
  audioElement.addEventListener('play', playHandler);
}

// ========== ANSWER HANDLING FUNCTIONS ==========
function selectOption(questionNumber, selected) {
  userAnswers[questionNumber] = selected;
  completedQuestions.add(questionNumber);
  reviewedQuestions.delete(questionNumber);
  updateNumberHighlight();
}

function updateNumberHighlight() {
  const allImages = document.querySelectorAll('.number-grid img');

  allImages.forEach((img, index) => {
    const number = index + 1;
    img.style.border = 'none';
    img.style.boxShadow = 'none';

    if (reviewedQuestions.has(number)) {
      img.style.border = '3px solid red';
    } else if (completedQuestions.has(number)) {
      img.style.border = '3px solid green';
    }

    if (number === currentQuestion) {
      img.style.boxShadow = '0 0 8px #00f';
    }
  });
}

// ========== NAVIGATION FUNCTIONS ==========
function goToPrevious() {
  if (currentQuestion > 1) showContent(currentQuestion - 1);
}

function goToNext() {
  if (currentQuestion < questions.length) showContent(currentQuestion + 1);
}

function markForReview() {
  reviewedQuestions.add(currentQuestion);
  completedQuestions.delete(currentQuestion);
  goToNext();
}

// ========== QUIZ SUBMISSION FUNCTIONS ==========
function submitQuiz() {
  // Prevent multiple submissions
  if (quizSubmitted) return;
  
  // Set end time
  studentInfo.endTime = new Date();
  
  // Stop the timer
  clearInterval(timerInterval);
  countdownEl.innerText = "00:00:00";
  lockOverlay.style.display = "none";
  
  // Mark as submitted
  quizSubmitted = true;
  isManuallySubmitted = true;
  
  // Calculate results
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
  const duration = Math.floor((studentInfo.endTime - studentInfo.startTime) / 60000); // in minutes
  const dateTime = formatDateTime(studentInfo.endTime);
  
  // Display results
  displayResults(total, attempted, left, correct, incorrect, score, duration, dateTime);
}

function formatDateTime(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  return {
    date: `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
    time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
    fullDateTime: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  };
}

function displayResults(total, attempted, left, correct, incorrect, score, duration, dateTime) {
  const contentDisplay = document.getElementById('content-display');
  contentDisplay.innerHTML = `
    <div class="result-header">
      <h2>Rosan Xettri Studio</h2>
      <h3>Korean Language Exam Result</h3>
      <div class="result-meta">
        <div><strong>Student:</strong> ${studentInfo.name}</div>
        <div><strong>Age:</strong> ${studentInfo.age}</div>
        <div><strong>Exam ID:</strong> ${studentInfo.serial}</div>
        <div><strong>Date:</strong> ${dateTime.date}</div>
        <div><strong>Time:</strong> ${dateTime.time}</div>
        <div><strong>Duration:</strong> ${duration} minutes</div>
      </div>
    </div>
    
    <div class="result-summary">
      <div class="result-summary-item">
        <div class="result-summary-value">${total}</div>
        <div>Total Questions</div>
      </div>
      <div class="result-summary-item">
        <div class="result-summary-value">${attempted}</div>
        <div>Attempted</div>
      </div>
      <div class="result-summary-item">
        <div class="result-summary-value">${left}</div>
        <div>Left</div>
      </div>
      <div class="result-summary-item">
        <div class="result-summary-value">${correct}</div>
        <div>Correct</div>
      </div>
      <div class="result-summary-item">
        <div class="result-summary-value">${incorrect}</div>
        <div>Incorrect</div>
      </div>
      <div class="result-summary-item">
        <div class="result-summary-value">${score}%</div>
        <div>Score</div>
      </div>
    </div>
    
    <h3 style="margin: 20px 0 10px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Detailed Review</h3>
    
    <div id="question-review"></div>
    
    <button id="download-result" onclick="generateResultPDF()" style="padding: 10px 20px; background: #d1041f; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;">Download Result as PDF</button>
  `;
  
  // Add detailed question review
  const questionReview = document.getElementById('question-review');
  questions.forEach((q, index) => {
    const qNum = index + 1;
    const selected = userAnswers[qNum] || 'Not attempted';
    const isCorrect = selected === q.answer;
    
    questionReview.innerHTML += `
      <div class="question-item" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
        <h4 style="margin-bottom: 10px; color: #d1041f;">Question ${qNum}</h4>
        <p style="margin-bottom: 8px;">${q.question}</p>
        ${q.image ? `<img src="${q.image}" style="max-width: 200px; margin: 8px 0; border-radius: 4px;">` : ''}
        <p style="margin: 5px 0;"><strong>Your answer:</strong> ${selected}</p>
        <p style="margin: 5px 0;"><strong>Correct answer:</strong> ${q.answer}</p>
        <p style="margin: 5px 0; color: ${isCorrect ? 'green' : 'red'}">
          <strong>${isCorrect ? '✓ Correct' : '✗ Incorrect'}</strong>
        </p>
        <p style="margin: 5px 0; font-style: italic;">Explanation: ${q.explanation}</p>
      </div>
    `;
  });
}

// ========== PDF GENERATION ==========
function generateResultPDF() {
  const { name, age, serial, startTime, endTime } = studentInfo;
  const duration = Math.floor((endTime - startTime) / 60000); // in minutes
  const dateTime = formatDateTime(endTime);
  
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
  
  // Create a new window with the result content
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Exam Result - ${serial}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { color: #d1041f; margin-bottom: 5px; }
          .header h2 { color: #555; margin-top: 0; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; }
          .meta div { margin-bottom: 10px; }
          .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
          .summary-item { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .summary-value { font-size: 24px; font-weight: bold; color: #d1041f; margin-bottom: 5px; }
          .details { margin-top: 30px; }
          .question-item { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
          @media print {
            body { font-size: 12px; }
            .summary { grid-template-columns: repeat(2, 1fr); }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rosan Xettri Studio</h1>
          <h2>Korean Language Exam Result</h2>
        </div>
        
        <div class="meta">
          <div><strong>Student:</strong> ${name}</div>
          <div><strong>Age:</strong> ${age}</div>
          <div><strong>Exam ID:</strong> ${serial}</div>
          <div><strong>Date:</strong> ${dateTime.date}</div>
          <div><strong>Time:</strong> ${dateTime.time}</div>
          <div><strong>Duration:</strong> ${duration} minutes</div>
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <div class="summary-value">${total}</div>
            <div>Total Questions</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${attempted}</div>
            <div>Attempted</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${left}</div>
            <div>Left</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${correct}</div>
            <div>Correct</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${incorrect}</div>
            <div>Incorrect</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${score}%</div>
            <div>Score</div>
          </div>
        </div>
        
        <div class="details">
          <h3>Detailed Results</h3>
          ${questions.map((q, index) => {
            const qNum = index + 1;
            const selected = userAnswers[qNum] || 'Not attempted';
            const isCorrect = selected === q.answer;
            return `
              <div class="question-item">
                <h4>Question ${qNum}</h4>
                <p>${q.question}</p>
                ${q.image ? `<img src="${q.image}" style="max-width: 150px; margin: 5px 0;">` : ''}
                <p><strong>Your answer:</strong> ${selected}</p>
                <p><strong>Correct answer:</strong> ${q.answer}</p>
                <p style="color: ${isCorrect ? 'green' : 'red'}"><strong>${isCorrect ? '✓ Correct' : '✗ Incorrect'}</strong></p>
                <p><em>Explanation: ${q.explanation}</em></p>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="footer">
          Generated by Rosan Xettri Studio - ${dateTime.fullDateTime}
        </div>
        
        <script>
          // Automatically trigger print dialog when PDF is loaded
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// ========== INITIALIZE EXAM WHEN PAGE LOADS ==========
document.addEventListener('DOMContentLoaded', initExam);