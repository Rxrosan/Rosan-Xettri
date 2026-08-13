// ============================================================
// 03-storage.js - LocalStorage Helpers (FULLY REWRITTEN)
// ============================================================

// ===== API KEY MANAGEMENT =====
function saveApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(config.storageKeys.geminiKey, key.trim());
    config.gemini.apiKey = key.trim();
    return true;
  }
  return false;
}

function loadApiKey() {
  if (config.gemini.apiKey) {
    return config.gemini.apiKey;
  }
  const savedKey = localStorage.getItem(config.storageKeys.geminiKey);
  if (savedKey) {
    config.gemini.apiKey = savedKey;
    return savedKey;
  }
  return null;
}

function removeApiKey() {
  localStorage.removeItem(config.storageKeys.geminiKey);
  localStorage.removeItem(config.storageKeys.chatMode);
  config.gemini.apiKey = null;
}

function clearApiKey() {
  // 1. Remove API key from storage and config
  localStorage.removeItem(config.storageKeys.geminiKey);
  localStorage.removeItem(config.storageKeys.chatMode);
  config.gemini.apiKey = null;
  
  // 2. FORCE SWITCH TO COMMAND MODE
  chatMode = 'command';
  localStorage.setItem(config.storageKeys.chatMode, 'command');
  
  // 3. Update UI indicator
  if (typeof updateModeIndicator === 'function') {
    updateModeIndicator();
  }
  
  // 4. Show confirmation message
  if (typeof addMessage === 'function') {
    addMessage(' API key cleared. Switched to CMD mode. Type "ai mode" to set up new key.', 'bot');
  }
  
  return true;
}

function hasApiKey() {
  return !!(config.gemini.apiKey || localStorage.getItem(config.storageKeys.geminiKey));
}

// ===== MODEL MANAGEMENT =====
function saveModel(modelId) {
  if (modelId) {
    localStorage.setItem(config.storageKeys.geminiModel, modelId);
    config.gemini.currentModel = modelId;
    return true;
  }
  return false;
}

function loadModel() {
  const savedModel = localStorage.getItem(config.storageKeys.geminiModel);
  if (savedModel) {
    const modelExists = config.gemini.availableModels.some(m => m.id === savedModel);
    if (modelExists) {
      config.gemini.currentModel = savedModel;
      return savedModel;
    }
  }
  config.gemini.currentModel = config.gemini.availableModels[0].id;
  return config.gemini.currentModel;
}

function getCurrentModelInfo() {
  return config.gemini.availableModels.find(m => m.id === config.gemini.currentModel) || config.gemini.availableModels[0];
}

// ===== CHAT MODE MANAGEMENT =====
function saveChatMode(mode) {
  if (mode && (mode === 'ai' || mode === 'command')) {
    localStorage.setItem(config.storageKeys.chatMode, mode);
    chatMode = mode;
    return true;
  }
  return false;
}

function loadChatMode() {
  const savedMode = localStorage.getItem(config.storageKeys.chatMode);
  if (savedMode && (savedMode === 'ai' || savedMode === 'command')) {
    chatMode = savedMode;
    return savedMode;
  }
  chatMode = 'command';
  localStorage.setItem(config.storageKeys.chatMode, 'command');
  return 'command';
}

function switchToCommandMode() {
  chatMode = 'command';
  localStorage.setItem(config.storageKeys.chatMode, 'command');
  if (typeof updateModeIndicator === 'function') {
    updateModeIndicator();
  }
  return true;
}

function switchToAIMode() {
  if (!hasApiKey()) {
    if (typeof addMessage === 'function') {
      addMessage(' No API key found. Please set your API key first using: set key YOUR_API_KEY', 'bot');
    }
    return false;
  }
  chatMode = 'ai';
  localStorage.setItem(config.storageKeys.chatMode, 'ai');
  if (typeof updateModeIndicator === 'function') {
    updateModeIndicator();
  }
  return true;
}

// ===== WINDOW STATE MANAGEMENT =====
function saveWindowState(isOpen) {
  localStorage.setItem(config.storageKeys.windowState, isOpen ? 'open' : 'closed');
}

function loadWindowState() {
  return localStorage.getItem(config.storageKeys.windowState) === 'open';
}

function saveWindowPosition(left, top) {
  localStorage.setItem(config.storageKeys.position, JSON.stringify({ left, top }));
}

function loadWindowPosition() {
  const saved = localStorage.getItem(config.storageKeys.position);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return null;
}

// ===== MESSAGE HISTORY MANAGEMENT =====
function saveMessageHistory() {
  const container = document.getElementById('rx-chat-messages');
  if (container) {
    const messages = [];
    container.querySelectorAll('.rx-message-wrapper').forEach(wrapper => {
      const sender = wrapper.classList.contains('bot') ? 'bot' : 'user';
      const messageDiv = wrapper.querySelector('.rx-message');
      const avatarDiv = wrapper.querySelector('.rx-avatar');
      const link = wrapper.querySelector('.rx-link-button');
      
      // Get full message text including link if present
      let fullText = '';
      const textDivs = messageDiv ? messageDiv.querySelectorAll('div') : [];
      textDivs.forEach(div => {
        fullText += div.textContent + '\n';
      });
      fullText = fullText.trim();
      
      messages.push({
        sender: sender,
        text: fullText || (messageDiv ? messageDiv.textContent : ''),
        avatarEmoji: avatarDiv ? avatarDiv.textContent : '',
        hasLink: !!link,
        linkUrl: link ? link.href : null,
        linkText: link ? link.textContent : null
      });
    });
    localStorage.setItem(config.storageKeys.messages, JSON.stringify(messages));
  }
}

function loadMessageHistory() {
  const saved = localStorage.getItem(config.storageKeys.messages);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return null;
}

function clearMessageHistory() {
  localStorage.removeItem(config.storageKeys.messages);
  const container = document.getElementById('rx-chat-messages');
  if (container) container.innerHTML = '';
}

// ===== COMPLETE RESET =====
function resetAllStorage() {
  localStorage.removeItem(config.storageKeys.geminiKey);
  localStorage.removeItem(config.storageKeys.geminiModel);
  localStorage.removeItem(config.storageKeys.chatMode);
  localStorage.removeItem(config.storageKeys.windowState);
  localStorage.removeItem(config.storageKeys.messages);
  localStorage.removeItem(config.storageKeys.position);
  
  config.gemini.apiKey = null;
  config.gemini.currentModel = config.gemini.availableModels[0].id;
  chatMode = 'command';
  
  if (typeof updateModeIndicator === 'function') {
    updateModeIndicator();
  }
  
  if (typeof addMessage === 'function') {
    addMessage(' All data cleared. Switched to CMD mode.', 'bot');
  }
}

// ===== UTILITY FUNCTIONS =====
function getStorageStats() {
  let total = 0;
  let keys = [];
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const size = localStorage[key].length * 2; // UTF-16
      total += size;
      keys.push({ key, size: size / 1024 });
    }
  }
  return {
    totalKB: (total / 1024).toFixed(2),
    keys: keys
  };
}

// ===== EXPOSE FOR DEBUGGING =====
if (typeof window !== 'undefined') {
  window.__storageDebug = {
    getStats: getStorageStats,
    resetAll: resetAllStorage,
    hasApiKey: hasApiKey,
    getCurrentMode: () => chatMode
  };
}