// RX-CHAT-WITH-GEMINI-MANUAL-API.js
// RX STUDIO Chat with Optional Gemini AI Integration
(function () {
  'use strict';

  /**
   * ===============================
   * CONFIGURATION
   * ===============================
   */
  const config = {
    // Window Settings - Responsive sizes
    chatWidth: '380px',
    chatHeight: '500px',
    mobileWidth: '320px',
    mobileHeight: '450px',
    smallMobileWidth: '280px',
    smallMobileHeight: '400px',
    
    // Messages
    welcomeMessage: 'Welcome to RX STUDIO\nI am your assistant. Type "hello" to start Conversation.',
    typingSpeed: 30,
    copyright: '<p>&copy; <strong><a href="https://www.rosankc.com.np" style="color:#64ffda; text-decoration:none;">RX STUDIO</a></strong>. All Rights Reserved.</p>',
    
    // Gemini API Configuration - Just 3 models
    gemini: {
      apiKey: null, // Can be pre-filled here auto-connects in AI mode.
      currentModel: 'gemini-3-flash-preview', // Default to fastest model
      availableModels: [
        { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', free: true, description: 'Fast model' },
        { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', free: true, description: 'More powerful' },
        { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', free: true, description: 'Latest flash model' }
      ],
      apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/'
    },
    
    // Custom Images
    images: {
      botAvatar: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/BOT-PROFILE.png',
      userAvatar: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/user.png',
      headerIcon: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/BOT-PROFILE.png',
      background: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/RX-AI-BG-3.png',
      messageBg: null,
      sendIcon: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/send.png'
    },
    
    // Custom Colors
    colors: {
      primary: 'transprent',
      headerBg: 'rgba(0,0,0,0.3)',
      inputBg: 'rgba(255,255,255,0.1)',
      botMessageBg: 'transprent',
      userMessageBg: 'transprent',
      textColor: 'white',
    },
    
    // Avatar Settings
    avatars: {
      useImages: true,
      botEmoji: '🤖',
      userEmoji: '👤',
      headerEmoji: '🤖'
    },
    
    // Storage Keys
    storageKeys: {
      windowState: 'rx-window-state',
      messages: 'rx-messages',
      position: 'rx-window-position',
      geminiKey: 'rx-gemini-key',
      geminiModel: 'rx-gemini-model',
      chatMode: 'rx-chat-mode' // New storage key for chat mode
    },
    
    // Contact Page URL
    contactPageUrl: 'contact.html',
    
    // Mobile drag settings
    mobileDrag: {
      enable: true,
      dragHandleHeight: '1cm',
      longPressDelay: 200,
      edgeResistance: 10
    }
  };

  /**
   * ===============================
   * COMMAND SYSTEM
   * ===============================
   */
  const commands = [
    { 
      command: 'hello', 
      description: 'Start conversation',
      response: 'Hello! I am RX STUDIO ASSISTANT. type "help" to see all comands.',
      category: 'basic'
    },
    { 
      command: 'about', 
      description: 'About RX Studio',
      response: 'Rosan Khattri Chettri is a 22-year-old BBS third-year student from Banganga-10, Kapilvastu. He is passionate about design and web development, creating visually appealing and user-friendly digital experiences. Dedicated to continuous learning, he strives to grow creatively and technically while making a positive impact in the digital world.',
      category: 'info',
      isLink: true,
      url: 'About.html',
      linkText: 'auto redrict on page if not open click to open about Page'
    },
    { 
      command: 'contact', 
      description: 'Contact information',
      response: 'CONTACT US\n\nClick the link below to open our contact page:',
      category: 'contact',
      isLink: true,
      url: 'Contact.html',
      linkText: 'auto redrict on page if not open click to open Contact Page'
    },
    { 
      command: 'service', 
      description: 'Our services',
      response: 'RX SERVICES:\n\n• Web Development\n• Mobile App Development\n• UI/UX Design\n• Cloud Solutions',
      category: 'Service',
      isLink: true,
      url: 'Service.html',
      linkText: 'auto redrict on page if not open click to open service Page'
    },
    { 
      command: 'close window', 
      category: 'system',
      description: 'Close chat window',
      response: 'Closing window... Chat cleared. See you soon!',
      action: 'close'
    },
    { 
      command: 'clear chat', 
      category: 'system',
      description: 'Clear all messages',
      response: 'Chat cleared!',
      action: 'clear'
    },
    { 
      command: 'help', 
      description: 'Show all commands',
      response: 'AVAILABLE COMMANDS:\n\n',
      action: 'showHelp'
    },
    { 
      command: 'website', 
      description: 'Visit our website',
      response: 'RX Official Website',
      category: 'website-link',
      isLink: true,
      url: 'https://rosankc.com.np/',
      linkText: 'auto redrict on page if not open click to open Website'
    },
    { 
      command: 'date', 
      description: 'Current date',
      response: () => 'Today is: ' + new Date().toLocaleDateString(),
      category: 'utility'
    },
    { 
      command: 'time', 
      description: 'Current time',
      response: () => 'Current time is: ' + new Date().toLocaleTimeString(),
      category: 'utility'
    },
    { 
      command: 'ai mode', 
      description: 'Enable AI chat with Gemini',
      response: '',
      category: 'ai-mode',
      action: 'aiMode'
    },
    { 
      command: 'command mode', 
      description: 'Switch to command mode',
      response: 'Command mode activated! Type "help" to see available commands.',
      category: 'command-mode',
      action: 'commandMode'
    },
    { 
      command: 'set key', 
      description: 'Set Gemini API key',
      response: 'Processing API key...',
      category: 'ai-functions',
      action: 'setApiKey'
    },
    { 
      command: 'clear key', 
      description: 'Clear saved API key and switch to command mode',
      response: '',
      category: 'ai-functions',
      action: 'clearApiKey'
    },
    { 
      command: 'remove key', 
      description: 'Alias for clear key - Remove saved API key',
      response: '',
      category: 'ai-functions',
      action: 'clearApiKey'
    },
    { 
      command: 'check key', 
      description: 'Check if API key is saved',
      response: '',
      category: 'ai-functions',
      action: 'checkApiKey'
    },
    { 
      command: 'models', 
      description: 'List available models',
      response: '',
      category: 'ai-functions',
      action: 'listModels'
    },
    { 
      command: 'use model', 
      description: 'Switch to a specific model',
      response: '',
      category: 'ai-functions',
      action: 'switchModel',
      requiresParameter: true
    },
    { 
      command: 'current model', 
      description: 'Show currently active AI model',
      response: '',
      category: 'ai-functions',
      action: 'showCurrentModel'
    },
    { 
      command: 'test models', 
      description: 'Test all models',
      response: '',
      category: 'ai-functions',
      action: 'testAllModels'
    },
    { 
      command: 'get api key', 
      description: 'Get a Gemini API key',
      response: 'Get your Gemini API key from Google AI Studio:',
      category: 'ai-functions',
      isLink: true,
      url: 'https://aistudio.google.com/app/apikey',
      linkText: 'auto redrict on page if not open click to open API Key Page'
    },
  
  ];

  // Chat mode: 'ai' or 'command'
  let chatMode = 'command';
  let awaitingApiKey = false;

  /**
   * ===============================
   * API Key & Model Management
   * ===============================
   */
  function saveApiKey(key) {
    if (key && key.trim()) {
      localStorage.setItem(config.storageKeys.geminiKey, key.trim());
      config.gemini.apiKey = key.trim();
      return true;
    }
    return false;
  }

  function loadApiKey() {
    // First check if API key is pre-filled in config
    if (config.gemini.apiKey) {
      return config.gemini.apiKey;
    }
    
    // Otherwise check localStorage
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

  // New functions for chat mode persistence
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
    return 'command'; // Default to command mode
  }

  function removeApiKey() {
    localStorage.removeItem(config.storageKeys.geminiKey);
    localStorage.removeItem(config.storageKeys.chatMode); // Also clear mode when key is removed
    config.gemini.apiKey = null;
    chatMode = 'command';
    awaitingApiKey = false;
    updateModeIndicator();
  }

  function clearApiKey() {
    removeApiKey();
    addMessage('API key cleared successfully. Switched to command mode. Type "ai mode" to set up a new API key.', 'bot');
  }

  function getCurrentModelInfo() {
    return config.gemini.availableModels.find(m => m.id === config.gemini.currentModel) || config.gemini.availableModels[0];
  }

  function updateModeIndicator() {
    const indicator = document.getElementById('rx-mode-indicator');
    if (indicator) {
      if (chatMode === 'ai' && config.gemini.apiKey) {
        const modelInfo = getCurrentModelInfo();
        indicator.textContent = 'AI';
        indicator.style.color = '#64ffda';
        indicator.title = `Using: ${modelInfo.name}`;
      } else {
        indicator.textContent = 'CMD';
        indicator.style.color = '#ffaa64';
        indicator.title = 'Command Mode';
      }
    }
  }

  /**
   * ===============================
   * Gemini AI Functions - Like HTML version
   * ===============================
   */
  async function getGeminiResponse(userMessage) {
    if (!config.gemini.apiKey) {
      return 'No API key set. Please set your Gemini API key first using: set key YOUR_API_KEY';
    }

    try {
      const modelInfo = getCurrentModelInfo();
      
      const response = await fetch(`${config.gemini.apiUrl}${modelInfo.id}:generateContent?key=${config.gemini.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: userMessage
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (response.ok && data.candidates && data.candidates[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Gemini API Error:', data);
        
        if (data.error?.message?.includes('API key')) {
          return 'Invalid API key. Please check your key and try again.';
        } else if (data.error?.message?.includes('not found')) {
          return `Model "${modelInfo.name}" is not available. Try "test models" to find a working model.`;
        } else {
          return `Error: ${data.error?.message || 'Unknown error'}`;
        }
      }
    } catch (error) {
      console.error('Connection Error:', error);
      return 'Network error. Please check your connection.';
    }
  }

  async function testModelConnection(modelId) {
    if (!config.gemini.apiKey) return false;
    
    try {
      const response = await fetch(`${config.gemini.apiUrl}${modelId}:generateContent?key=${config.gemini.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello'
            }]
          }]
        })
      });

      const data = await response.json();
      return response.ok && !data.error && data.candidates;
    } catch (error) {
      return false;
    }
  }

  async function connectToFreeTier() {
    if (!config.gemini.apiKey) {
      addMessage('No API key found. Please set your API key first using: set key YOUR_API_KEY', 'bot');
      return false;
    }

    addMessage('Testing models...', 'bot');
    
    // Try each model in order
    for (const model of config.gemini.availableModels) {
      addMessage(`Testing ${model.name}...`, 'bot');
      
      showTypingIndicator();
      const isWorking = await testModelConnection(model.id);
      removeTypingIndicator();
      
      if (isWorking) {
        saveModel(model.id);
        chatMode = 'ai';
        saveChatMode('ai'); // Save the AI mode state
        updateModeIndicator();
        addMessage(`Connected with ${model.name}! How can I help you?`, 'bot');
        return true;
      }
    }
    
    addMessage('Your API key works but needs to be enabled for Gemini API. Go to https://aistudio.google.com/ and create a new key.', 'bot');
    return false;
  }

  async function testAllAvailableModels() {
    if (!config.gemini.apiKey) {
      addMessage('No API key found. Please set your API key first using "set key YOUR_API_KEY"', 'bot');
      return;
    }
    
    addMessage('Testing all models...\n', 'bot');
    
    const results = [];
    let workingModel = null;
    
    for (const model of config.gemini.availableModels) {
      addMessage(`Testing ${model.name}...`, 'bot');
      
      showTypingIndicator();
      const isWorking = await testModelConnection(model.id);
      removeTypingIndicator();
      
      if (isWorking) {
        results.push(`${model.name} - Connected`);
        if (!workingModel) {
          workingModel = model;
        }
      } else {
        results.push(`${model.name} - Failed`);
      }
    }
    
    let resultMessage = 'TEST RESULTS:\n\n';
    results.forEach(r => resultMessage += r + '\n');
    
    if (workingModel) {
      saveModel(workingModel.id);
      chatMode = 'ai';
      saveChatMode('ai'); // Save the AI mode state
      updateModeIndicator();
      resultMessage += `\nAuto-connected to: ${workingModel.name}`;
    } else {
      resultMessage += `\nNo working models found. Go to https://aistudio.google.com/ and create a new key.`;
    }
    
    addMessage(resultMessage, 'bot');
  }

  /**
   * ===============================
   * State Management - Keep on refresh, clear only on close
   * ===============================
   */
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
      try {
        return JSON.parse(saved);
      } catch (e) {}
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
          text: messageDiv.textContent,
          isLink: messageDiv.classList.contains('crystal-link'),
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
        const messages = JSON.parse(saved);
        messages.forEach(msg => {
          if (msg.hasLink) {
            addMessageWithLink(msg.text, msg.sender, msg.linkUrl, msg.linkText);
          } else {
            addMessage(msg.text, msg.sender, msg.isLink, msg.avatarEmoji);
          }
        });
      } catch (e) {}
    }
  }

  function clearMessageHistory() {
    localStorage.removeItem(config.storageKeys.messages);
    const container = document.getElementById('rx-chat-messages');
    if (container) container.innerHTML = '';
  }

  /**
   * ===============================
   * CSS Injection (Keep all your existing CSS)
   * ===============================
   */
  function generateCSS() {
    const { images, colors } = config;
    
    return `
    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }

    .rx-chat-window {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${config.chatWidth};
      height: ${config.chatHeight};
      background: ${colors.headerBg || 'rgba(30, 40, 60, 0.95)'};
      ${images.background ? `background-image: url('${images.background}');` : ''}
      background-size: cover;
      background-position: center;
      backdrop-filter: blur(10px);
      border-radius: 25px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 1000000;
      color: ${colors.textColor || 'white'};
      touch-action: none;
      will-change: transform, left, top;
    }

    .rx-chat-window.show {
      display: flex;
    }

    .rx-chat-window.dragging {
      transition: none;
      opacity: 0.95;
      box-shadow: 0 25px 60px rgba(0,0,0,0.6);
    }

    .rx-chat-header {
      padding: 15px;
      background: ${colors.headerBg || 'rgba(0,0,0,0.3)'};
      border-bottom: 1px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: move;
      cursor: grab;
      height: 1cm;
      touch-action: none;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }

    .rx-chat-header:active {
      cursor: grabbing;
    }

    .rx-header-icon {
      width: 0.8cm;
      height: 0.8cm;
      border-radius: 50%;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      border: 2px solid rgba(255,255,255,0.5);
      ${images.headerIcon ? `background-image: url('${images.headerIcon}'); background-size: cover; background-position: center;` : ''}
      pointer-events: none;
    }

    .rx-header-title {
      flex: 1;
      font-weight: bold;
      text-align: center;
      color: ${colors.textColor || 'white'};
      pointer-events: none;
      font-size: 14px;
    }

    .rx-mode-indicator {
      font-size: 10px;
      padding: 2px 6px;
      background: rgba(0,0,0,0.3);
      border-radius: 12px;
      color: #ffaa64;
      margin-left: 5px;
      border: 1px solid rgba(255,255,255,0.2);
      cursor: help;
    }

    .rx-header-close {
      width: 0.8cm;
      height: 0.8cm;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      pointer-events: auto;
      -webkit-tap-highlight-color: rgba(255,255,255,0.2);
    }

    .rx-header-close:hover {
      background: rgba(255,255,255,0.3);
    }

    .rx-header-close:active {
      transform: scale(0.95);
    }

    .rx-chat-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: ${images.messageBg ? `url('${images.messageBg}') repeat` : 'transparent'};
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
    }

    .rx-message-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      max-width: 85%;
    }

    .rx-message-wrapper.bot {
      align-self: flex-start;
    }

    .rx-message-wrapper.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .rx-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      flex-shrink: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .rx-avatar.bot {
      ${images.botAvatar ? `background-image: url('${images.botAvatar}'); background-size: cover; background-position: center;` : ''}
    }

    .rx-avatar.user {
      ${images.userAvatar ? `background-image: url('${images.userAvatar}'); background-size: cover; background-position: center;` : ''}
    }

    .rx-message {
      padding: 10px 15px;
      border-radius: 18px;
      background: ${images.messageBg ? `url('${images.messageBg}') repeat` : 'rgba(255,255,255,0.1)'};
      border: 1px solid rgba(255,255,255,0.2);
      color: ${colors.textColor || 'white'};
      font-size: 0.9rem;
      line-height: 1.4;
      white-space: pre-line;
      backdrop-filter: blur(5px);
      word-break: break-word;
    }

    .rx-message-wrapper.bot .rx-message {
      border-bottom-left-radius: 4px;
      background: ${colors.botMessageBg || 'rgba(255,255,255,0.1)'};
    }

    .rx-message-wrapper.user .rx-message {
      background: transparent;
      border-bottom-right-radius: 4px;
    }

    .rx-link-button {
      display: inline-block;
      margin-top: 8px;
      padding: 8px 15px;
      background: rgba(100, 255, 218, 0.2);
      border: 1px solid #64ffda;
      border-radius: 20px;
      color: #64ffda;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      pointer-events: auto;
      -webkit-tap-highlight-color: rgba(100, 255, 218, 0.3);
    }

    .rx-link-button:hover {
      background: #64ffda;
      color: #000;
    }

    .rx-link-button:active {
      transform: scale(0.95);
      background: #64ffda;
      color: #000;
    }

    .rx-input-area {
      display: flex;
      padding: 12px;
      gap: 8px;
      background: ${colors.headerBg || 'rgba(0,0,0,0.3)'};
      border-top: 1px solid rgba(255,255,255,0.2);
      pointer-events: auto;
    }

    .rx-input-area input {
      flex: 1;
      padding: 12px 18px;
      background: ${colors.inputBg || 'rgba(255,255,255,0.1)'};
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 25px;
      outline: none;
      color: ${colors.textColor || 'white'};
      font-size: 0.9rem;
      -webkit-appearance: none;
      appearance: none;
      touch-action: manipulation;
    }

    .rx-input-area input::placeholder {
      color: rgba(255,255,255,0.5);
    }

    .rx-input-area input:focus {
      border-color: rgba(255,255,255,0.5);
    }

    .rx-input-area button {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      padding: 0;
      overflow: hidden;
      -webkit-tap-highlight-color: rgba(255,255,255,0.2);
      touch-action: manipulation;
    }

    .rx-input-area button:hover {
      transform: scale(1.1);
    }

    .rx-input-area button:active {
      transform: scale(0.95);
    }

    .rx-send-icon {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: brightness(0) invert(1);
      pointer-events: none;
    }

    .rx-copyright {
      padding: 6px;
      text-align: center;
      font-size: 0.7rem;
      color: rgba(255,255,255,0.5);
      background: ${colors.headerBg || 'rgba(0,0,0,0.3)'};
      border-top: 1px solid rgba(255,255,255,0.1);
      pointer-events: none;
    }

    .rx-copyright a {
      pointer-events: auto;
      -webkit-tap-highlight-color: rgba(100, 255, 218, 0.3);
    }

    .rx-typing-indicator {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background: ${images.messageBg ? `url('${images.messageBg}') repeat` : 'rgba(255,255,255,0.1)'};
      border-radius: 18px;
      border-bottom-left-radius: 4px;
      backdrop-filter: blur(5px);
    }

    .rx-typing-dot {
      width: 6px;
      height: 6px;
      background: ${colors.textColor || 'white'};
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }

    @keyframes typing {
      0%,60%,100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-6px); opacity: 1; }
    }

    /* Responsive Design */
    @media screen and (max-width: 480px) {
      .rx-chat-window {
        width: ${config.mobileWidth};
        height: ${config.mobileHeight};
        border-radius: 20px;
      }
      
      .rx-message-wrapper {
        max-width: 90%;
      }
      
      .rx-message {
        font-size: 0.85rem;
        padding: 8px 12px;
      }
      
      .rx-input-area input {
        padding: 10px 15px;
        font-size: 0.85rem;
      }
      
      .rx-input-area button {
        width: 40px;
        height: 40px;
        font-size: 18px;
      }
      
      .rx-header-title {
        font-size: 12px;
      }
    }

    @media screen and (max-width: 360px) {
      .rx-chat-window {
        width: ${config.smallMobileWidth};
        height: ${config.smallMobileHeight};
        border-radius: 15px;
      }
      
      .rx-message-wrapper {
        max-width: 95%;
      }
      
      .rx-avatar {
        width: 28px;
        height: 28px;
        font-size: 14px;
      }
      
      .rx-copyright {
        font-size: 0.65rem;
        padding: 4px;
      }
    }

    @media screen and (min-width: 481px) and (max-width: 768px) {
      .rx-chat-window {
        width: 400px;
        height: 520px;
      }
    }

    @media screen and (min-width: 769px) and (max-width: 1024px) {
      .rx-chat-window {
        width: 420px;
        height: 540px;
      }
    }

    @media screen and (min-width: 1440px) {
      .rx-chat-window {
        width: 450px;
        height: 600px;
      }
      
      .rx-message {
        font-size: 1rem;
        padding: 12px 18px;
      }
    }

    /* Touch device optimizations */
    @media (hover: none) and (pointer: coarse) {
      .rx-chat-header {
        cursor: default;
      }
      
      .rx-chat-header.drag-active {
        background: rgba(255,255,255,0.1);
      }
      
      .rx-input-area button:hover {
        transform: none;
      }
      
      .rx-link-button:hover {
        background: rgba(100, 255, 218, 0.2);
        color: #64ffda;
      }
      
      .rx-header-close {
        width: 1cm;
        height: 1cm;
        font-size: 24px;
      }
      
      .rx-header-close:active {
        background: rgba(255,255,255,0.3);
      }
      
      .rx-input-area input {
        font-size: 16px;
      }
    }

    /* Landscape orientation */
    @media (max-height: 500px) and (orientation: landscape) {
      .rx-chat-window {
        height: 85vh;
        width: ${config.mobileWidth};
      }
      
      .rx-chat-header {
        height: 0.8cm;
      }
      
      .rx-chat-messages {
        padding: 10px;
      }
      
      .rx-input-area {
        padding: 8px;
      }
      
      .rx-input-area input {
        padding: 8px 15px;
      }
      
      .rx-input-area button {
        width: 35px;
        height: 35px;
      }
    }

    /* Prevent text selection while dragging */
    .rx-chat-window.dragging * {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
      pointer-events: none;
    }

    .rx-chat-window.dragging .rx-header-close,
    .rx-chat-window.dragging .rx-input-area,
    .rx-chat-window.dragging .rx-link-button {
      pointer-events: none;
    }
    `;
  }

  function injectCSS() {
    const style = document.createElement('style');
    style.id = 'rx-chat-styles';
    style.textContent = generateCSS();
    document.head.appendChild(style);
  }

  /**
   * ===============================
   * HTML Injection
   * ===============================
   */
  function injectHTML() {
    if (!document.getElementById('rx-chat-window')) {
      const { avatars } = config;
      
      const html = `
      <!-- Chat Window -->
      <div class="rx-chat-window" id="rx-chat-window">
        <div class="rx-chat-header" id="rx-chat-header">
          <div class="rx-header-icon" id="rx-header-icon">
            ${!config.images.headerIcon ? avatars.headerEmoji : ''}
          </div>
          <div class="rx-header-title">
            ROSAN XETTRI STUDIO
            <span class="rx-mode-indicator" id="rx-mode-indicator">CMD</span>
          </div>
          <div class="rx-header-close" id="rx-close-btn">×</div>
        </div>

        <div class="rx-chat-messages" id="rx-chat-messages"></div>

        <div class="rx-input-area">
          <input type="text" placeholder="Aa..." id="rx-user-input">
          <button id="rx-send-btn">
            <img src="${config.images.sendIcon}" alt="send" class="rx-send-icon">
          </button>
        </div>

        <div class="rx-copyright">${config.copyright}</div>
      </div>
      `;
      
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);
    }
  }

  /**
   * ===============================
   * Message Functions
   * ===============================
   */
  function addMessage(text, sender = 'bot', isLink = false, savedAvatarEmoji = '') {
    const container = document.getElementById('rx-chat-messages');
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.className = `rx-message-wrapper ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = `rx-avatar ${sender}`;
    
    if (config.avatars.useImages) {
      avatar.textContent = '';
    } else {
      avatar.textContent = savedAvatarEmoji || (sender === 'bot' ? config.avatars.botEmoji : config.avatars.userEmoji);
    }

    const message = document.createElement('div');
    message.className = 'rx-message';
    if (isLink) message.classList.add('crystal-link');
    message.style.whiteSpace = 'pre-line';
    
    if (typeof text === 'function') {
      message.textContent = text();
    } else {
      message.textContent = text;
    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(message);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
    
    // Save message history after adding new message
    saveMessageHistory();
  }

  function addMessageWithLink(text, sender, url, linkText) {
    const container = document.getElementById('rx-chat-messages');
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.className = `rx-message-wrapper ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = `rx-avatar ${sender}`;
    
    if (config.avatars.useImages) {
      avatar.textContent = '';
    } else {
      avatar.textContent = sender === 'bot' ? config.avatars.botEmoji : config.avatars.userEmoji;
    }

    const messageContainer = document.createElement('div');
    messageContainer.className = 'rx-message';
    messageContainer.style.whiteSpace = 'pre-line';
    
    const textDiv = document.createElement('div');
    
    if (typeof text === 'function') {
      textDiv.textContent = text();
    } else {
      textDiv.textContent = text;
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.className = 'rx-link-button';
    link.textContent = linkText || 'Open Link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    messageContainer.appendChild(textDiv);
    messageContainer.appendChild(link);
    
    wrapper.appendChild(avatar);
    wrapper.appendChild(messageContainer);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
    
    // Save message history after adding new message
    saveMessageHistory();
  }

  function showTypingIndicator() {
    const container = document.getElementById('rx-chat-messages');
    if (!container) return;

    const indicator = document.createElement('div');
    indicator.className = 'rx-message-wrapper bot';
    indicator.id = 'rx-typing';
    
    const avatar = document.createElement('div');
    avatar.className = 'rx-avatar bot';
    if (!config.avatars.useImages) {
      avatar.textContent = config.avatars.botEmoji;
    }

    const typing = document.createElement('div');
    typing.className = 'rx-typing-indicator';
    typing.innerHTML = '<span class="rx-typing-dot"></span><span class="rx-typing-dot"></span><span class="rx-typing-dot"></span>';

    indicator.appendChild(avatar);
    indicator.appendChild(typing);
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('rx-typing');
    if (indicator) indicator.remove();
  }

  function showWelcomeSequence() {
    let i = 0;
    const welcome = config.welcomeMessage;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'rx-message-wrapper bot';
    
    const avatar = document.createElement('div');
    avatar.className = 'rx-avatar bot';
    if (!config.avatars.useImages) {
      avatar.textContent = config.avatars.botEmoji;
    }
    
    const message = document.createElement('div');
    message.className = 'rx-message';
    
    wrapper.appendChild(avatar);
    wrapper.appendChild(message);
    document.getElementById('rx-chat-messages').appendChild(wrapper);
    
    function typeWriter() {
      if (i < welcome.length) {
        message.textContent += welcome.charAt(i);
        i++;
        setTimeout(typeWriter, config.typingSpeed);
      }
    }
    typeWriter();
    
    // Save welcome message to history
    saveMessageHistory();
  }

  function showHelp() {
    let helpText = 'AVAILABLE COMMANDS:\n\n';
    const categories = {};
    
    commands.forEach(cmd => {
      if (cmd.command !== 'help') {
        if (!categories[cmd.category]) categories[cmd.category] = [];
        categories[cmd.category].push(cmd);
      }
    });
    
    for (let cat in categories) {
      helpText += `🔹 ${cat.toUpperCase()}:\n`;
      categories[cat].forEach(cmd => {
        helpText += `   • ${cmd.command} - ${cmd.description}\n`;
      });
      helpText += '\n';
    }
    
    helpText += '\nCurrent mode: ' + chatMode.toUpperCase();
    if (config.gemini.apiKey) {
      const modelInfo = getCurrentModelInfo();
      helpText += ` (${modelInfo.name})`;
    } else {
      helpText += '\nType "ai mode" to set up AI chat with your Gemini API key.';
    }
    
    addMessage(helpText, 'bot');
  }

  function listModels() {
    let modelList = 'MODELS:\n\n';
    
    config.gemini.availableModels.forEach((model, index) => {
      const isCurrent = model.id === config.gemini.currentModel;
      modelList += `${isCurrent ? '✓' : '•'} ${model.name}\n`;
      modelList += `   ${model.description}\n`;
      if (isCurrent) modelList += '   (currently active)\n';
      modelList += '\n';
    });
    
    modelList += '\nTo switch models, type: use model MODEL_NAME';
    modelList += '\nTo test all models, type: test models';
    addMessage(modelList, 'bot');
  }

  function switchModel(modelId) {
    if (!modelId) {
      addMessage('Please specify a model. Format: use model MODEL_NAME\n\nType "models" to see available models.', 'bot');
      return;
    }
    
    let model = config.gemini.availableModels.find(m => m.id.toLowerCase().includes(modelId.toLowerCase()) || 
                                                        m.name.toLowerCase().includes(modelId.toLowerCase()));
    
    if (model) {
      saveModel(model.id);
      const modelInfo = getCurrentModelInfo();
      addMessage(`Switched to ${modelInfo.name}`, 'bot');
      updateModeIndicator();
      
      if (chatMode === 'ai' && config.gemini.apiKey) {
        setTimeout(async () => {
          addMessage(`Testing ${modelInfo.name}...`, 'bot');
          showTypingIndicator();
          const isConnected = await testModelConnection(model.id);
          removeTypingIndicator();
          
          if (isConnected) {
            addMessage(`${modelInfo.name} is working!`, 'bot');
          } else {
            addMessage(`${modelInfo.name} failed. Try another model.`, 'bot');
          }
        }, 500);
      }
    } else {
      addMessage(`Model not found. Type "models" to see available options.`, 'bot');
    }
  }

  function showCurrentModel() {
    const modelInfo = getCurrentModelInfo();
    addMessage(`Current Model: ${modelInfo.name}`, 'bot');
  }

  function findCommand(input) {
    let cmd = commands.find(c => input.toLowerCase() === c.command.toLowerCase());
    
    if (!cmd) {
      cmd = commands.find(c => 
        input.toLowerCase().startsWith(c.command.toLowerCase() + ' ') && 
        c.requiresParameter
      );
    }
    
    return cmd;
  }

  function extractParameter(input, command) {
    const parts = input.split(' ');
    if (parts.length >= 2) {
      return parts.slice(1).join(' ').trim();
    }
    return null;
  }

  async function processCommand(input) {
    if (awaitingApiKey) {
      if (input.toLowerCase().startsWith('set key ')) {
        const key = input.substring(8).trim();
        if (saveApiKey(key)) {
          addMessage('API key saved! Testing models...', 'bot');
          await connectToFreeTier();
        } else {
          addMessage('Invalid API key.', 'bot');
        }
        awaitingApiKey = false;
        return;
      } else {
        addMessage('Please use: set key YOUR_API_KEY', 'bot');
        return;
      }
    }

    const cmd = findCommand(input);
    
    if (cmd) {
      if (cmd.action === 'close') {
        const response = typeof cmd.response === 'function' ? cmd.response() : cmd.response;
        addMessage(response, 'bot');
        setTimeout(() => {
          document.getElementById('rx-chat-window').classList.remove('show');
          saveWindowState(false);
          // Clear messages and history on close
          clearMessageHistory();
        }, 1500);
      }
      else if (cmd.action === 'clear') {
        clearMessageHistory();
        addMessage(cmd.response, 'bot');
      }
      else if (cmd.action === 'showHelp') {
        showHelp();
      }
      else if (cmd.action === 'aiMode') {
        if (config.gemini.apiKey) {
          // Auto-connect if API key exists (either pre-filled or saved)
          addMessage('API key found! Connecting to Gemini...', 'bot');
          await connectToFreeTier();
        } else {
          awaitingApiKey = true;
          addMessage('Enter your Gemini API key:\n\nFormat: set key YOUR_API_KEY\n\nGet a key: type "get api key"', 'bot');
        }
      }
      else if (cmd.action === 'commandMode') {
        chatMode = 'command';
        saveChatMode('command'); // Save the command mode state
        awaitingApiKey = false;
        updateModeIndicator();
        addMessage(cmd.response, 'bot');
      }
      else if (cmd.action === 'setApiKey') {
        addMessage('Use: set key YOUR_API_KEY', 'bot');
      }
      else if (cmd.action === 'clearApiKey') {
        clearApiKey();
      }
      else if (cmd.action === 'checkApiKey') {
        if (config.gemini.apiKey) {
          const modelInfo = getCurrentModelInfo();
          addMessage(`API key saved\nModel: ${modelInfo.name}\nMode: ${chatMode.toUpperCase()}`, 'bot');
        } else {
          addMessage('No API key saved. Type "ai mode" to set up.', 'bot');
        }
      }
      else if (cmd.action === 'listModels') {
        listModels();
      }
      else if (cmd.action === 'switchModel') {
        const parameter = extractParameter(input, cmd.command);
        switchModel(parameter);
      }
      else if (cmd.action === 'showCurrentModel') {
        showCurrentModel();
      }
      else if (cmd.action === 'testAllModels') {
        await testAllAvailableModels();
      }
      else if (cmd.isLink) {
        const response = typeof cmd.response === 'function' ? cmd.response() : cmd.response;
        addMessageWithLink(response, 'bot', cmd.url, cmd.linkText);
        setTimeout(() => {
          window.open(cmd.url, '_blank');
        }, 500);
      }
      else {
        const response = typeof cmd.response === 'function' ? cmd.response() : cmd.response;
        addMessage(response, 'bot');
      }
    } else {
      if (chatMode === 'ai' && config.gemini.apiKey) {
        showTypingIndicator();
        try {
          const aiResponse = await getGeminiResponse(input);
          removeTypingIndicator();
          addMessage(aiResponse, 'bot');
        } catch (error) {
          removeTypingIndicator();
          addMessage('Error. Please try again.', 'bot');
        }
      } else if (chatMode === 'ai' && !config.gemini.apiKey) {
        addMessage('Set API key first: set key YOUR_API_KEY', 'bot');
      } else {
        addMessage(`Unknown: "${input}"\n\nType "help" for commands.`, 'bot');
      }
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

  /**
   * ===============================
   * Draggable Function
   * ===============================
   */
  function makeDraggable(element, handle) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let currentX, currentY;
    let dragStartTime;
    let isTouchDevice = ('ontouchstart' in window);
    let longPressTimer;

    function getClientCoordinates(e) {
      if (e.type.startsWith('touch')) {
        const touch = e.touches[0] || e.changedTouches[0];
        return {
          clientX: touch.clientX,
          clientY: touch.clientY
        };
      }
      return {
        clientX: e.clientX,
        clientY: e.clientY
      };
    }

    function startDrag(e) {
      if (e.target.closest('#rx-close-btn') || 
          e.target.closest('.rx-input-area') ||
          e.target.closest('.rx-link-button')) {
        return;
      }

      e.preventDefault();
      
      const coords = getClientCoordinates(e);
      const rect = element.getBoundingClientRect();
      
      startX = coords.clientX - rect.left;
      startY = coords.clientY - rect.top;
      
      startLeft = rect.left;
      startTop = rect.top;
      
      isDragging = true;
      dragStartTime = Date.now();
      
      element.classList.add('dragging');
      
      if (isTouchDevice) {
        element.style.transition = 'none';
        document.body.style.overflow = 'hidden';
      }
    }

    function onDrag(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      
      const coords = getClientCoordinates(e);
      
      let newLeft = coords.clientX - startX;
      let newTop = coords.clientY - startY;
      
      newLeft = Math.max(config.mobileDrag.edgeResistance, 
                Math.min(window.innerWidth - element.offsetWidth - config.mobileDrag.edgeResistance, newLeft));
      newTop = Math.max(config.mobileDrag.edgeResistance, 
               Math.min(window.innerHeight - element.offsetHeight - config.mobileDrag.edgeResistance, newTop));
      
      element.style.left = newLeft + 'px';
      element.style.top = newTop + 'px';
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.style.transform = 'none';
      
      currentX = newLeft;
      currentY = newTop;
    }

    function stopDrag(e) {
      if (!isDragging) return;
      
      const dragDuration = Date.now() - dragStartTime;
      
      if (isTouchDevice && dragDuration < config.mobileDrag.longPressDelay) {
        element.classList.remove('dragging');
        isDragging = false;
        
        if (isTouchDevice) {
          document.body.style.overflow = '';
          element.style.transition = '';
        }
        return;
      }
      
      e.preventDefault();
      
      element.classList.remove('dragging');
      
      if (isTouchDevice) {
        document.body.style.overflow = '';
        element.style.transition = '';
      }
      
      if (currentX !== undefined && currentY !== undefined) {
        saveWindowPosition(currentX, currentY);
      } else {
        const left = parseInt(element.style.left) || 0;
        const top = parseInt(element.style.top) || 0;
        saveWindowPosition(left, top);
      }
      
      isDragging = false;
      
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    }

    handle.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);

    if (isTouchDevice) {
      handle.addEventListener('touchstart', (e) => {
        longPressTimer = setTimeout(() => {
          if (!isDragging) {
            handle.classList.add('drag-active');
            startDrag(e);
          }
        }, config.mobileDrag.longPressDelay);
      }, { passive: false });

      handle.addEventListener('touchmove', (e) => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
          handle.classList.remove('drag-active');
        }
        
        if (isDragging) {
          e.preventDefault();
          onDrag(e);
        }
      }, { passive: false });

      handle.addEventListener('touchend', (e) => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
          handle.classList.remove('drag-active');
        }
        
        if (isDragging) {
          e.preventDefault();
          stopDrag(e);
        }
      });

      handle.addEventListener('touchcancel', (e) => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
          handle.classList.remove('drag-active');
        }
        
        if (isDragging) {
          stopDrag(e);
        }
      });
    }

    handle.addEventListener('touchstart', (e) => {
      if (!e.target.closest('#rx-close-btn') && 
          !e.target.closest('.rx-input-area') &&
          !e.target.closest('.rx-link-button')) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  /**
   * ===============================
   * Trigger Setup
   * ===============================
   */
  function setupTrigger() {
    const chatWindow = document.getElementById('rx-chat-window');
    if (!chatWindow) return;

    const triggerSelector = '.RX-SMART-BUTTON-menu-item.RX-item-9[data-link=""]';
    
    function openChatWindow() {
      console.log('RX Chat: Opening window');
      chatWindow.classList.add('show');
      saveWindowState(true);
      
      const messageContainer = document.getElementById('rx-chat-messages');
      if (messageContainer && messageContainer.children.length === 0) {
        showWelcomeSequence();
        
        const savedKey = loadApiKey();
        const savedModel = loadModel();
        
        if (savedKey) {
          const modelInfo = getCurrentModelInfo();
          setTimeout(() => {
            addMessage(`loaded : ${modelInfo.name}`, 'bot');
          }, 2000);
        }
      }
    }

    function attachToTrigger() {
      const trigger = document.querySelector(triggerSelector);
      if (trigger) {
        console.log('RX Chat: Found trigger');
        
        trigger.removeEventListener('click', openChatWindow);
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openChatWindow();
        });
        
        return true;
      }
      
      const images = document.querySelectorAll('img[src*="BOT-PROFILE-1.png"]');
      for (const img of images) {
        const parent = img.closest('.RX-SMART-BUTTON-menu-item');
        if (parent) {
          console.log('RX Chat: Found trigger by image');
          
          parent.removeEventListener('click', openChatWindow);
          parent.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openChatWindow();
          });
          
          return true;
        }
      }
      
      return false;
    }

    if (!attachToTrigger()) {
      console.log('RX Chat: Watching for trigger...');
      
      const observer = new MutationObserver(() => {
        if (attachToTrigger()) {
          console.log('RX Chat: Trigger attached');
          observer.disconnect();
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * ===============================
   * Setup
   * ===============================
   */
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
      // Clear messages on close
      clearMessageHistory();
    });

    sendBtn.addEventListener('click', handleUserInput);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserInput();
    });

    // Load saved state - IMPORTANT: This now checks for pre-filled config key first
    loadApiKey();
    loadModel();
    
    // Load and set the saved chat mode
    chatMode = loadChatMode();
    
    updateModeIndicator();

    if (loadWindowState()) {
      chatWindow.classList.add('show');
      // Load saved message history when window opens
      loadMessageHistory();
      
      // If we're in AI mode and have an API key, show a restoration message
      if (chatMode === 'ai' && config.gemini.apiKey) {
        const modelInfo = getCurrentModelInfo();
        setTimeout(() => {
          addMessage(`AI mode restored with ${modelInfo.name}. How can I help you?`, 'bot');
        }, 1000);
      }
    }

    setupTrigger();
  }

  /**
   * ===============================
   * Initialize
   * ===============================
   */
  function init() {
    if (window.__RX_INIT__) return;
    window.__RX_INIT__ = true;

    console.log('RX Chat: Initializing...');
    
    injectCSS();
    injectHTML();

    setTimeout(() => {
      setupInteractions();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();