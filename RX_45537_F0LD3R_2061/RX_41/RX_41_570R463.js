// ============================================================
// 03-storage.js - LocalStorage Helpers
// FIXED: Debounced save + message state store + quota handling
// ============================================================

// ===== API KEY (obfuscated) =====
function saveApiKey(key) {
  if (!key || !key.trim()) return false;
  const trimmed = key.trim();
  if (trimmed.length < 20) return false;
  try {
    localStorage.setItem(config.storageKeys.geminiKey, btoa(trimmed));
    config.gemini.apiKey = trimmed;
    return true;
  } catch (e) {
    console.error('Save key failed:', e);
    return false;
  }
}

function loadApiKey() {
  if (config.gemini.apiKey) return config.gemini.apiKey;
  const saved = localStorage.getItem(config.storageKeys.geminiKey);
  if (saved) {
    try {
      const decoded = atob(saved);
      config.gemini.apiKey = decoded;
      return decoded;
    } catch (e) {
      console.error('Load key failed:', e);
      return null;
    }
  }
  return null;
}

function clearApiKey() {
  localStorage.removeItem(config.storageKeys.geminiKey);
  localStorage.removeItem(config.storageKeys.chatMode);
  config.gemini.apiKey = null;
  chatMode = 'command';
  localStorage.setItem(config.storageKeys.chatMode, 'command');
  if (typeof updateModeIndicator === 'function') updateModeIndicator();
  if (typeof addMessage === 'function') {
    addMessage('🔑 API key cleared. Switched to CMD mode.\n\nType "ai mode" to set new key.', 'bot');
  }
  return true;
}

function hasApiKey() {
  return !!(config.gemini.apiKey || localStorage.getItem(config.storageKeys.geminiKey));
}

// ===== MODEL =====
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
    const exists = config.gemini.availableModels.some(m => m.id === savedModel);
    if (exists) {
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

// ===== CHAT MODE =====
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

// ===== WINDOW STATE =====
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

// ===== MESSAGE HISTORY (State-based + Debounced) =====
let messageStore = [];
let saveMsgTimer = null;

function pushMessageToStore(msg) {
  messageStore.push(msg);
  saveMessageHistoryDebounced();
}

function saveMessageHistoryDebounced() {
  if (saveMsgTimer) clearTimeout(saveMsgTimer);
  saveMsgTimer = setTimeout(() => {
    saveMessageHistory();
    saveMsgTimer = null;
  }, 500);
}

function saveMessageHistory() {
  try {
    localStorage.setItem(
      config.storageKeys.messages,
      JSON.stringify(messageStore)
    );
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn('Storage full — trimming old messages');
      messageStore.splice(0, Math.max(1, Math.floor(messageStore.length / 2)));
      try {
        localStorage.setItem(
          config.storageKeys.messages,
          JSON.stringify(messageStore)
        );
      } catch (e2) {
        console.error('Storage still full:', e2);
      }
    } else {
      console.error('Save failed:', e);
    }
  }
}

function loadMessageHistory() {
  const saved = localStorage.getItem(config.storageKeys.messages);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      messageStore = parsed || [];
      return parsed;
    } catch (e) {
      return null;
    }
  }
  return null;
}

function clearMessageHistory() {
  localStorage.removeItem(config.storageKeys.messages);
  messageStore = [];
  const container = document.getElementById('rx-chat-messages');
  if (container) container.innerHTML = '';
  if (typeof clearAIConversationHistory === 'function') {
    clearAIConversationHistory();
  }
}

// ===== RESET =====
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
  messageStore = [];
  
  if (typeof clearAIConversationHistory === 'function') clearAIConversationHistory();
  if (typeof updateModeIndicator === 'function') updateModeIndicator();
  if (typeof addMessage === 'function') addMessage('🗑️ All data cleared. Switched to CMD mode.', 'bot');
}

// ===== UTILS =====
function getStorageStats() {
  let total = 0;
  const keys = [];
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const size = localStorage[key].length * 2;
      total += size;
      keys.push({ key, size: size / 1024 });
    }
  }
  return { totalKB: (total / 1024).toFixed(2), keys };
}

if (typeof window !== 'undefined') {
  window.__storageDebug = {
    getStats: getStorageStats,
    resetAll: resetAllStorage,
    hasApiKey,
    getCurrentMode: () => chatMode
  };
}