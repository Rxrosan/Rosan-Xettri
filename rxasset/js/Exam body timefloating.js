const countdownEl = document.getElementById("countdown");
const minimizeBtn = document.getElementById("minimize-btn");
const timerBox = document.getElementById("floating-timer");
const minimizedCircle = document.getElementById("minimized-circle");
const lockOverlay = document.getElementById("lock-overlay");
const submitBtn = document.getElementById("submit-btn");

// Timer Settings
let targetTime = new Date().getTime() + 60 * 40 * 1000; // 40 minute countdown
let isWarningGiven = false;
let isManuallySubmitted = false;
const warningThreshold = 5000;

// Countdown Logic
function updateCountdown() {
  if (isManuallySubmitted) return; // Stop updating if already submitted manually

  const now = new Date().getTime();
  const distance = targetTime - now;

  if (distance <= 0) {
    clearInterval(timerInterval);
    countdownEl.innerText = "00:00:00";

    if (!isManuallySubmitted) {
      // Only show popup if not already submitted
      lockOverlay.style.display = "flex";
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

  // Warning
  if (distance <= warningThreshold && !isWarningGiven) {
    isWarningGiven = true;
    showWarning(); // optional
  }
}

// ➖ Minimize / Expand
minimizeBtn.addEventListener("click", () => {
  timerBox.classList.add("hidden");
  minimizedCircle.classList.remove("hidden");
});
minimizedCircle.addEventListener("click", () => {
  timerBox.classList.remove("hidden");
  minimizedCircle.classList.add("hidden");
});

// 🖱️ + 👆 Drag & Touch Support
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

timerBox.style.position = "fixed";
minimizedCircle.style.position = "fixed";
makeDraggable(timerBox);
makeDraggable(minimizedCircle);

// Start Timer
const timerInterval = setInterval(updateCountdown, 1000);
