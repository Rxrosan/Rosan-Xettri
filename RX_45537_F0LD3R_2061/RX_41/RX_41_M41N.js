// ============================================================
// 11-main.js - Main Initialization (WITH AI MEMORY REBUILD)
// ============================================================

function setupInteractions() {
  const chatWindow = document.getElementById('rx-chat-window');
  const closeBtn = document.getElementById('rx-close-btn');
  const sendBtn = document.getElementById('rx-send-btn');
  const input = document.getElementById('rx-user-input');
  const header = document.getElementById('rx-chat-header');

  if (!chatWindow || !closeBtn || !sendBtn || !input || !header) return;

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
    clearMessageHistory();  // ✅ AI memory पनि clear हुन्छ
  });

  sendBtn.addEventListener('click', handleUserInput);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserInput(); });

  loadApiKey();
  loadModel();
  chatMode = loadChatMode();
  updateModeIndicator();

  if (loadWindowState()) {
    chatWindow.classList.add('show');
    loadMessagesFromHistory();
    // ✅ पुरानो chat बाट AI memory rebuild गर्ने
    rebuildAIContextFromHistory();
  }

  setupTrigger();
}

// ✅ localStorage को message history बाट AI conversation memory फेरि बनाउने
function rebuildAIContextFromHistory() {
  if (typeof clearAIConversationHistory === 'function') {
    clearAIConversationHistory();
  }
  
  const messages = loadMessageHistory();
  if (!messages || messages.length === 0) return;
  
  // welcome message छोडेर बाँकी सबै conversation memory मा हाल्ने
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
  
  // max limit भन्दा बढी भए trim
  while (conversationHistory.length > MAX_CONTEXT_MESSAGES) {
    conversationHistory.shift();
  }
}

async function handleUserInput() {
  const input = document.getElementById('rx-user-input');
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  input.value = '';
  await processCommand(text);
}

function init() {
  if (window.__RX_INIT__) return;
  window.__RX_INIT__ = true;

  injectCSS();
  injectHTML();
  setTimeout(setupInteractions, 100);
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}