// ============================================================
// 10-trigger.js - Trigger Button Setup
// ============================================================

function setupTrigger() {
  const chatWindow = document.getElementById('rx-chat-window');
  if (!chatWindow) return;

  const triggerSelector = '.RX-SMART-BUTTON-menu-item.RX-item-9[data-link=""]';
  
  function openChatWindow() {
    chatWindow.classList.add('show');
    saveWindowState(true);
    const messageContainer = document.getElementById('rx-chat-messages');
    if (messageContainer && messageContainer.children.length === 0) {
      showWelcomeSequence();
    }
  }

  function attachToTrigger() {
    const trigger = document.querySelector(triggerSelector);
    if (trigger) {
      trigger.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openChatWindow(); });
      return true;
    }
    const images = document.querySelectorAll('img[src*="BOT-PROFILE-1.png"]');
    for (const img of images) {
      const parent = img.closest('.RX-SMART-BUTTON-menu-item');
      if (parent) {
        parent.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openChatWindow(); });
        return true;
      }
    }
    return false;
  }

  if (!attachToTrigger()) {
    const observer = new MutationObserver(() => {
      if (attachToTrigger()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}