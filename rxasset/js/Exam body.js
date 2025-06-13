let currentQuestion = 1;
const reviewedQuestions = new Set();
const completedQuestions = new Set();
const userAnswers = {}; // { questionNumber: "a" | "b" | ... }
let quizSubmitted = false;
const disabledAudios = new Set(); // Track which audios have been disabled

// Show question content and options
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
}

// Save user's selected answer
function selectOption(questionNumber, selected) {
  userAnswers[questionNumber] = selected;
  completedQuestions.add(questionNumber);
  reviewedQuestions.delete(questionNumber);
  updateNumberHighlight();
}

// Highlight answered/reviewed questions
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

// Navigation
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

// Submit and Show Result Summary
function submitQuiz() {
  quizSubmitted = true;
  clearInterval(timerInterval); // Stop the timer
  countdownEl.innerText = "00:00:00"; // Reset timer display
  lockOverlay.style.display = "none"; // Hide popup if open

  let total = questions.length;
  let attempted = Object.keys(userAnswers).length;
  let correct = 0;
  let incorrect = 0;

  for (let i = 1; i <= total; i++) {
    const selected = userAnswers[i];
    const correctAns = questions[i - 1].answer;
    if (selected) {
      if (selected === correctAns) correct++;
      else incorrect++;
    }
  }

  const left = total - attempted;

  // Show popup summary
  alert(
    `📊 Quiz Summary:
Total Questions: ${total}
Attempted: ${attempted}
Left: ${left}
✅ Correct: ${correct}
❌ Incorrect: ${incorrect}`
  );

  // Show full review below current content
  const reviewSection = document.getElementById('content-display');
  let reviewHTML = `<h2>📘 Full Review</h2>`;

  questions.forEach((q, index) => {
    const qNum = index + 1;
    const selected = userAnswers[qNum] || 'None';
    const correctAns = q.answer;
    const isCorrect = selected === correctAns;

    reviewHTML += `
      <div style="border:1px solid #ccc; border-radius:8px; margin:10px 0; padding:10px;">
        <strong>Question ${qNum}</strong>
        <p>${q.question}</p>
    `;

    if (q.image) {
      reviewHTML += `<img src="${q.image}" alt="Image" style="max-width:100px; margin: 5px 0;" />`;
    }

    if (q.audio) {
      reviewHTML += `<audio controls style="margin:5px 0; width:100%;"><source src="${q.audio}"></audio>`;
    }

    reviewHTML += `
      <p><strong>Your Answer:</strong> ${selected}</p>
      <p><strong>Correct Answer:</strong> ${correctAns}</p>
      <p style="color: ${isCorrect ? 'green' : 'red'};"><strong>${isCorrect ? '✔ Correct' : '✘ Incorrect'}</strong></p>
      <p><em>Explanation: ${q.explanation}</em></p>
      </div>
    `;
  });

  reviewSection.innerHTML = reviewHTML;
}