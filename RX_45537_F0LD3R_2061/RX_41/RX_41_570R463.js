// ============================================================
// 03-storage.js - LocalStorage Helpers
// ============================================================

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

function saveChatMode(mode) {
  if (mode) {
    localStorage.setItem(config.storageKeys.chatMode, mode);
    return true;
  }
  return false;
}

function loadChatMode() {
  const savedMode = localStorage.getItem(config.storageKeys.chatMode);
  if (savedMode && (savedMode === 'ai' || savedMode === 'command')) {
    return savedMode;
  }
  return 'command';
}

function removeApiKey() {
  localStorage.removeItem(config.storageKeys.geminiKey);
  localStorage.removeItem(config.storageKeys.chatMode);
  config.gemini.apiKey = null;
}

function clearApiKey() {
  removeApiKey();
  if (typeof addMessage === 'function') {
    addMessage('API key cleared successfully. Switched to command mode. Type "ai mode" to set up a new API key.', 'bot');
  }
}

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

function saveMessageHistory() {
  const container = document.getElementById('rx-chat-messages');
  if (container) {
    const messages = [];
    container.querySelectorAll('.rx-message-wrapper').forEach(wrapper => {
      const sender = wrapper.classList.contains('bot') ? 'bot' : 'user';
      const messageDiv = wrapper.querySelector('.rx-message');
      const avatarDiv = wrapper.querySelector('.rx-avatar');
      const link = wrapper.querySelector('.rx-link-button');
      messages.push({
        sender: sender,
        text: messageDiv ? messageDiv.textContent : '',
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