// ============================================================
// 10-trigger.js - Trigger Button Setup 
// ============================================================

function setupTrigger() {
  const chatWindow = document.getElementById('rx-chat-window');
  if (!chatWindow) return;

  const triggerSelector = '.RX-SMART-BUTTON-menu-item.RX-item-9[data-link=""]';

  // ===== OPEN CHAT WINDOW (idempotent) =====
  function openChatWindow() {
    chatWindow.classList.add('show');
    saveWindowState(true);

    const messageContainer = document.getElementById('rx-chat-messages');
    if (messageContainer && messageContainer.children.length === 0) {
      if (typeof showWelcomeSequence === 'function') {
        showWelcomeSequence();
      }
    }
  }

  // ===== ATTACH CLICK HANDLER (with duplicate guard) =====
  function bindClick(element) {
    if (!element) return false;

    // पहिले नै attach भइसकेको छ भने फेरि नगर्ने
    if (element.dataset.rxTriggerAttached === '1') return true;
    element.dataset.rxTriggerAttached = '1';

    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openChatWindow();
    });

    return true;
  }

  // ===== TRIGGER खोज्ने र bind गर्ने =====
  function attachToTrigger() {
    // 1) Direct selector बाट
    const trigger = document.querySelector(triggerSelector);
    if (trigger) {
      return bindClick(trigger);
    }

    // 2) Fallback: BOT-PROFILE image भएको parent बाट
    const images = document.querySelectorAll('img[src*="BOT-PROFILE.png"]');
    for (const img of images) {
      const parent = img.closest('.RX-SMART-BUTTON-menu-item');
      if (parent) {
        return bindClick(parent);
      }
    }

    return false;
  }

  // ===== पहिलो प्रयास =====
  if (attachToTrigger()) return;

  // ===== Fallback: MutationObserver (limit सहित) =====
  let attempts = 0;
  const MAX_ATTEMPTS = 50;

  const observer = new MutationObserver(() => {
    attempts++;
    if (attachToTrigger() || attempts >= MAX_ATTEMPTS) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Safety: 10 सेकेन्ड पछि observer बन्द (memory leak रोक्न)
  setTimeout(() => observer.disconnect(), 10000);
}