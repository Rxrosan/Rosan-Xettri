// ============================================================
// 11-main.js - Main Initialization
// FIXED: Global error handler + input validation + safe async
// ============================================================

// ✅ Global error handlers (सबैभन्दा पहिले)
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  if (typeof addMessage === 'function') {
    addMessage('⚠️ Unexpected error. Please refresh if issue continues.', 'bot');
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// ✅ Safe async wrapper
async function safeAsync(fn, ...args) {
  try {
    return await fn(...args);
  } catch (error) {
    console.error(`Error in ${fn.name}:`, error);
    if (typeof removeTypingIndicator === 'function') removeTypingIndicator();
    if (typeof addMessage === 'function') {
      addMessage('❌ Something went wrong. Please try again.', 'bot');
    }
    return null;
  }
}

function setupInteractions() {
  const chatWindow = document.getElementById('rx-chat-window');
  const closeBtn = document.getElementById('rx-close-btn');
  const sendBtn = document.getElementById('rx-send-btn');
  const input = document.getElementById('rx-user-input');
  const header = document.getElementById('rx-chat-header');

  if (!chatWindow || !closeBtn || !sendBtn || !input || !header) {
    console.error('Required DOM elements missing');
    return;
  }

  makeDraggable(chatWindow, header);

  const savedPos = loadWindowPosition();
  if (savedPos) {
    chatWindow.style.left = savedPos.left + 'px';
    chatWindow.style.top = savedPos.top + 'px';
    chatWindow.style.right = 'auto';
    chatWindow.style.bottom = 'auto';
    chatWindow.style.transform = 'none';
  }

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('show');
    saveWindowState(false);
    clearMessageHistory();
  });

  sendBtn.addEventListener('click', () => safeAsync(handleUserInput));
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') safeAsync(handleUserInput);
  });

  loadApiKey();
  loadModel();
  chatMode = loadChatMode();
  updateModeIndicator();

  if (loadWindowState()) {
    chatWindow.classList.add('show');
    loadMessagesFromHistory();
    rebuildAIContextFromHistory();
  }

  setupTrigger();
}

function rebuildAIContextFromHistory() {
  if (typeof clearAIConversationHistory === 'function') clearAIConversationHistory();
  
  const messages = loadMessageHistory();
  if (!messages || messages.length === 0) return;
  
  const conversationMessages = messages.filter(msg => 
    msg.text && 
    !msg.text.includes('Welcome to ROSAN KC website') &&
    msg.text.trim().length > 0
  );
  
  conversationMessages.forEach(msg => {
    if (typeof conversationHistory !== 'undefined') {
      conversationHistory.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        text: msg.text
      });
    }
  });
  
  while (conversationHistory.length > MAX_CONTEXT_MESSAGES) {
    conversationHistory.shift();
  }
}

async function handleUserInput() {
  const input = document.getElementById('rx-user-input');
  if (!input) return;
  
  const text = input.value.trim();
  
  // ✅ Input validation
  if (!text) return;
  if (text.length > 2000) {
    addMessage('⚠️ Message too long (max 2000 characters).', 'bot');
    return;
  }

  addMessage(text, 'user');
  input.value = '';
  await processCommand(text);
}

function init() {
  if (window.__RX_INIT__) return;
  window.__RX_INIT__ = true;

  try {
    injectCSS();
    injectHTML();
    setTimeout(setupInteractions, 100);
  } catch (error) {
    console.error('Init failed:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}