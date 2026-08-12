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
      apiKey: '',
      currentModel: 'gemini-3-flash-preview',
      availableModels: [
        { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', free: true, description: 'Fast model' },
        { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', free: true, description: 'More powerful' },
        { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', free: true, description: 'Latest flash model' }
      ],
      apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/'
    },
    
    // Custom Images
    images: {
      botAvatar: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/BOT-PROFILE.png',
      userAvatar: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png',
      headerIcon: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/BOT-PROFILE.png',
      background: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/RX-AI-BG-3.png',
      messageBg: null,
      sendIcon: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/send.png'
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
      chatMode: 'rx-chat-mode'
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
   * ROSAN DETAILS & COMMAND SYSTEM
   * ===============================
   */
  const rosanDetails = {
    name: "ROSAN K.C.",
    age: "23-year-old",
    education: "+2 Clear",
    location: "Banganga-10, Kapilvastu pakadiachapa",
    email: "rosankc2061@gmail.com",
    facebook: "https://www.facebook.com/Rosan.2061",
    facebookpage: "https://www.facebook.com/RosanXettri.2004",
    youtube: "https://www.youtube.com/channel/UCzOs87ROUZSPyfdDbOl0F1w",
    website: "https://rosankc.com.np/",
    contactPage: "Contact.html",
    aboutPage: "About.html",
    servicePage: "Service.html"
  };

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
      response: `${rosanDetails.name} is a ${rosanDetails.age} ${rosanDetails.education} from ${rosanDetails.location}. He is a licensed professional serving the Kapilvastu district for legal documents (Kapali Tamsuk, Rajinaama, Lakhbandhak), EPS exam web services, National Identity Card assistance, PAN account creation, and essential government document solutions.`,
      category: 'info',
      isLink: true,
      url: rosanDetails.aboutPage,
      linkText: 'Click to open About Page'
    },
    { 
      command: 'contact', 
      description: 'Contact information',
      response: 'CONTACT US\n\nClick the link below to open our contact page:',
      category: 'contact',
      isLink: true,
      url: rosanDetails.contactPage,
      linkText: 'Click to open Contact Page'
    },
    { 
      command: 'service', 
      description: 'Our services',
      response: 'RX SERVICES:\n\n• designing \n• eps exam for web base software\n• lekhapadi services \n• lekhapadi services web based services.',
      category: 'Service',
      isLink: true,
      url: rosanDetails.servicePage,
      linkText: 'Click to open Service Page'
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
      url: rosanDetails.website,
      linkText: 'Click to open Website'
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
      linkText: 'Click to open API Key Page'
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
   * Gemini AI Functions
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
          system_instruction: {
            parts: [{
              text: `You are the official AI assistant for ${rosanDetails.name}'s portfolio website. 
              Bio: ${rosanDetails.age} ${rosanDetails.education} from ${rosanDetails.location}, passionate about designer  and lekhandas.
              Contact & Links Info: 
              - Email: ${rosanDetails.email}
              - Facebook: ${rosanDetails.facebook}
              - Facebookpage: ${rosanDetails.facebookpage}
              - YouTube: ${rosanDetails.youtube}
              - Website: ${rosanDetails.website}
              - Contact Page: ${rosanDetails.contactPage}
              - About Page: ${rosanDetails.aboutPage}
              - Services Page: ${rosanDetails.servicePage}
              
              IMPORTANT INSTRUCTION FOR LINKS: When a user asks for any link, website, facebook, social media, contact, about, or service page, you MUST include a special link formatting tag at the end of your text like this: 
              [LINK:URL_HERE|BUTTON_TEXT_HERE]
              `
            }]
          },
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
        return `Error: ${data.error?.message || 'Unknown error'}`;
      }
    } catch (error) {
      return 'Network error. Please check your connection.';
    }
  }

  async function testModelConnection(modelId) {
    if (!config.gemini.apiKey) return false;
    try {
      const response = await fetch(`${config.gemini.apiUrl}${modelId}:generateContent?key=${config.gemini.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Hello' }] }] })
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
    
    for (const model of config.gemini.availableModels) {
      addMessage(`Testing ${model.name}...`, 'bot');
      showTypingIndicator();
      const isWorking = await testModelConnection(model.id);
      removeTypingIndicator();
      
      if (isWorking) {
        saveModel(model.id);
        chatMode = 'ai';
        saveChatMode('ai');
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
        if (!workingModel) workingModel = model;
      } else {
        results.push(`${model.name} - Failed`);
      }
    }
    
    let resultMessage = 'TEST RESULTS:\n\n';
    results.forEach(r => resultMessage += r + '\n');
    
    if (workingModel) {
      saveModel(workingModel.id);
      chatMode = 'ai';
      saveChatMode('ai');
      updateModeIndicator();
      resultMessage += `\nAuto-connected to: ${workingModel.name}`;
    } else {
      resultMessage += `\nNo working models found. Go to https://aistudio.google.com/ and create a new key.`;
    }
    
    addMessage(resultMessage, 'bot');
  }

  /**
   * ===============================
   * State Management
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
        const messages = JSON.parse(saved);
        messages.forEach(msg => {
          if (msg.hasLink) {
            addMessageWithLink(msg.text, msg.sender, msg.linkUrl, msg.linkText);
          } else {
            addMessage(msg.text, msg.sender, false, msg.avatarEmoji);
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
   * CSS Injection - UPDATED WITH NEW DESIGN
   * ===============================
   */
  function generateCSS() {
    const { images, colors } = config;
    return `
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    
    /* ===== CHAT WINDOW ===== */
    .rx-chat-window {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: ${config.chatWidth}; height: ${config.chatHeight};
      background: ${colors.headerBg || 'rgba(30, 40, 60, 0.95)'};
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.2); display: none; flex-direction: column;
      overflow: hidden; z-index: 1000000; color: ${colors.textColor || 'white'};
      touch-action: none; will-change: transform, left, top;
    }
    .rx-chat-window.show { display: flex; }
    .rx-chat-window.dragging { transition: none; opacity: 0.95; }
    
    /* ===== HEADER - COMPACT ===== */
    .rx-chat-header {
      padding: 8px 12px; background: ${colors.headerBg || 'rgba(0,0,0,0.4)'};
      border-bottom: 1px solid rgba(255,255,255,0.15); display: flex;
      align-items: center; gap: 8px; cursor: grab; min-height: 40px; flex-shrink: 0;
    }
    .rx-chat-header:active { cursor: grabbing; }
    
    .rx-header-icon {
      width: 28px; height: 28px; border-radius: 50%; background: transparent;
      display: flex; align-items: center; justify-content: center; color: white;
      border: 2px solid rgba(255,255,255,0.3); flex-shrink: 0; overflow: hidden;
      ${images.headerIcon ? `background-image: url('${images.headerIcon}'); background-size: cover; background-position: center;` : ''}
    }
    .rx-header-title { 
      flex: 1; font-weight: 700; text-align: center; font-size: 13px; 
      color: #ffffff; text-shadow: 0 2px 10px rgba(0,0,0,0.5);
      letter-spacing: 0.3px;
    }
    .rx-mode-indicator {
      font-size: 9px; padding: 2px 8px; background: rgba(0,0,0,0.3);
      border-radius: 12px; color: #ffaa64; margin-left: 4px; 
      border: 1px solid rgba(255,255,255,0.15); font-weight: 600;
    }
    
    /* ===== CLOSE BUTTON - ONLY ICON (NO BG) ===== */
    .rx-header-close {
      width: 28px; height: 28px;
      background: transparent; border: none;
      color: #ffffff; font-size: 24px; font-weight: 300;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      z-index: 10; flex-shrink: 0; transition: all 0.3s ease;
      text-shadow: 0 0 20px rgba(255,255,255,0.2);
    }
    .rx-header-close:hover { 
      background: transparent; border: none;
      color: #ffffff; transform: scale(1.15);
      text-shadow: 0 0 30px rgba(255,255,255,0.4);
    }
    .rx-header-close:active { transform: scale(0.9); background: transparent; border: none; }
    
    /* ===== MESSAGES AREA - BACKGROUND IMAGE ONLY HERE ===== */
    .rx-chat-messages {
      flex: 1; padding: 12px 14px; overflow-y: auto; display: flex;
      flex-direction: column; gap: 6px; -webkit-overflow-scrolling: touch;
      position: relative; min-height: 0;
      ${images.background ? `background-image: url('${images.background}'); background-size: cover; background-position: center; background-repeat: no-repeat;` : ''}
    }
    .rx-chat-messages::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(30, 40, 60, 0.25); z-index: -1; pointer-events: none;
    }
    .rx-chat-messages::-webkit-scrollbar { width: 3px; }
    .rx-chat-messages::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
    .rx-chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
    
    /* ===== MESSAGES ===== */
    .rx-message-wrapper { display: flex; align-items: flex-end; gap: 6px; max-width: 88%; animation: messageIn 0.3s ease; position: relative; z-index: 2; }
    @keyframes messageIn { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .rx-message-wrapper.bot { align-self: flex-start; }
    .rx-message-wrapper.user { align-self: flex-end; flex-direction: row-reverse; }
    
    /* ===== AVATAR ===== */
    .rx-avatar {
      width: 28px; height: 28px; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; color: white; font-size: 14px;
      border: 2px solid rgba(255,255,255,0.2); flex-shrink: 0; overflow: hidden;
      background: rgba(0,0,0,0.3);
    }
    .rx-avatar.bot { ${images.botAvatar ? `background-image: url('${images.botAvatar}'); background-size: cover; background-position: center;` : ''} }
    .rx-avatar.user { ${images.userAvatar ? `background-image: url('${images.userAvatar}'); background-size: cover; background-position: center;` : ''} }
    
    /* ===== MESSAGE BUBBLE ===== */
    .rx-message {
      padding: 8px 14px; border-radius: 16px; 
      background: rgba(0, 0, 0, 0.4); 
      border: 1px solid rgba(255,255,255,0.1); 
      color: ${colors.textColor || 'white'};
      font-size: 0.85rem; line-height: 1.5; white-space: pre-line; word-break: break-word;
      backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .rx-message-wrapper.bot .rx-message { 
      border-bottom-left-radius: 4px; 
      background: rgba(0, 0, 0, 0.35);
    }
    .rx-message-wrapper.user .rx-message { 
      border-bottom-right-radius: 4px; 
      background: rgba(0, 0, 0, 0.45);
    }
    
    /* ===== LINK BUTTON ===== */
    .rx-link-button {
      display: inline-block; margin-top: 6px; padding: 6px 14px;
      background: rgba(100, 255, 218, 0.15); border: 1px solid rgba(100, 255, 218, 0.3);
      border-radius: 20px; color: #64ffda; text-decoration: none; font-size: 0.8rem;
      transition: all 0.3s ease; cursor: pointer; text-align: center; font-weight: 600;
    }
    .rx-link-button:hover { background: rgba(100, 255, 218, 0.25); transform: scale(1.02); border-color: rgba(100, 255, 218, 0.5); }
    .rx-link-button:active { transform: scale(0.95); }
    
    /* ===== INPUT AREA - COMPACT ===== */
    .rx-input-area {
      display: flex; padding: 6px 10px; gap: 6px; 
      background: rgba(0, 0, 0, 0.4); 
      border-top: 1px solid rgba(255,255,255,0.08);
      flex-shrink: 0; align-items: center; min-height: 44px;
    }
    .rx-input-area input {
      flex: 1; padding: 8px 14px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; outline: none;
      color: ${colors.textColor || 'white'}; font-size: 0.85rem;
      min-height: 32px; height: 32px; transition: all 0.3s ease;
    }
    .rx-input-area input:focus { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.08); }
    .rx-input-area input::placeholder { color: rgba(255,255,255,0.2); font-size: 0.8rem; }
    
    /* ===== SEND BUTTON ===== */
    .rx-input-area button {
      width: 32px; height: 32px; min-width: 32px; min-height: 32px;
      border-radius: 50%; border: 1px solid rgba(255,255,255,0.12);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.05); transition: all 0.3s ease; padding: 0;
    }
    .rx-input-area button:hover { background: rgba(255,255,255,0.12); transform: scale(1.05); border-color: rgba(255,255,255,0.25); }
    .rx-input-area button:active { transform: scale(0.9); }
    .rx-send-icon { width: 18px; height: 18px; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.6; transition: all 0.3s ease; }
    .rx-input-area button:hover .rx-send-icon { opacity: 1; transform: rotate(5deg); }
    
    /* ===== COPYRIGHT - COMPACT ===== */
    .rx-copyright {
      padding: 4px 8px; text-align: center; font-size: 0.6rem; 
      color: rgba(255,255,255,0.3); background: rgba(0, 0, 0, 0.25);
      border-top: 1px solid rgba(255,255,255,0.04); flex-shrink: 0;
      letter-spacing: 0.3px;
    }
    .rx-copyright a { color: #64ffda; text-decoration: none; }
    .rx-copyright a:hover { color: #a8ffeb; text-decoration: underline; }
    
    /* ===== TYPING INDICATOR ===== */
    .rx-typing-indicator { 
      display: flex; gap: 4px; padding: 8px 14px; 
      background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px; align-items: center;
      backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
    }
    .rx-typing-dot { 
      width: 5px; height: 5px; background: rgba(255,255,255,0.3); 
      border-radius: 50%; animation: typing 1.4s infinite; 
    }
    .rx-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .rx-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing { 0%,60%,100% { transform: translateY(0); opacity: 0.3; } 30% { transform: translateY(-5px); opacity: 0.8; } }

    /* ======================================== */
    /* ===== RESPONSIVE BREAKPOINTS ===== */
    /* ======================================== */
    @media screen and (max-width: 480px) {
      .rx-chat-window { width: 95vw; max-width: 95vw; height: 90vh; max-height: 90vh; border-radius: 14px; }
      .rx-chat-messages { padding: 8px 10px; gap: 5px; }
      .rx-message-wrapper { max-width: 92%; }
      .rx-message { font-size: 0.8rem; padding: 6px 12px; }
      .rx-header-title { font-size: 12px; }
      .rx-input-area { padding: 4px 8px; gap: 5px; min-height: 38px; }
      .rx-input-area input { font-size: 0.8rem; padding: 6px 12px; min-height: 28px; height: 28px; }
      .rx-input-area button { width: 28px; height: 28px; min-width: 28px; min-height: 28px; }
      .rx-send-icon { width: 16px; height: 16px; }
      .rx-avatar { width: 24px; height: 24px; font-size: 12px; }
      .rx-header-close { font-size: 22px; width: 24px; height: 24px; }
      .rx-copyright { font-size: 0.5rem; padding: 3px 6px; }
    }

    @media screen and (max-width: 360px) {
      .rx-chat-window { width: 98vw; max-width: 98vw; height: 92vh; max-height: 92vh; border-radius: 10px; }
      .rx-message { font-size: 0.75rem; padding: 5px 10px; }
      .rx-avatar { width: 20px; height: 20px; font-size: 10px; }
      .rx-header-icon { width: 22px; height: 22px; font-size: 11px; }
      .rx-header-close { font-size: 20px; width: 22px; height: 22px; }
      .rx-input-area { padding: 3px 6px; gap: 4px; min-height: 32px; }
      .rx-input-area input { font-size: 0.75rem; padding: 4px 10px; min-height: 24px; height: 24px; }
      .rx-input-area button { width: 24px; height: 24px; min-width: 24px; min-height: 24px; }
      .rx-send-icon { width: 14px; height: 14px; }
      .rx-copyright { font-size: 0.45rem; padding: 2px 4px; }
    }

    @media screen and (min-width: 481px) and (max-width: 768px) {
      .rx-chat-window { width: 78vw; max-width: 400px; height: 78vh; max-height: 520px; }
      .rx-input-area input { font-size: 0.85rem; min-height: 30px; height: 30px; }
      .rx-input-area button { width: 30px; height: 30px; min-width: 30px; min-height: 30px; }
    }

    @media screen and (min-width: 769px) {
      .rx-chat-window { width: 400px; max-width: 400px; height: 560px; max-height: 560px; }
      .rx-input-area input { min-height: 34px; height: 34px; }
      .rx-input-area button { width: 34px; height: 34px; min-width: 34px; min-height: 34px; }
    }

    @media screen and (max-height: 500px) and (orientation: landscape) {
      .rx-chat-window { width: 65vw; max-width: 480px; height: 88vh; max-height: 380px; border-radius: 12px; }
      .rx-chat-header { min-height: 28px; padding: 4px 10px; }
      .rx-header-title { font-size: 11px; }
      .rx-chat-messages { padding: 4px 8px; gap: 4px; }
      .rx-message { font-size: 0.7rem; padding: 4px 8px; }
      .rx-input-area { padding: 3px 6px; gap: 4px; min-height: 28px; }
      .rx-input-area input { font-size: 0.7rem; padding: 3px 8px; min-height: 22px; height: 22px; }
      .rx-input-area button { width: 22px; height: 22px; min-width: 22px; min-height: 22px; }
      .rx-send-icon { width: 12px; height: 12px; }
      .rx-avatar { width: 18px; height: 18px; font-size: 9px; }
      .rx-copyright { font-size: 0.45rem; padding: 2px 4px; }
      .rx-header-close { font-size: 18px; width: 20px; height: 20px; }
    }
    `;
  }

  function injectCSS() {
    const existingStyle = document.getElementById('rx-chat-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
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
      <div class="rx-chat-window" id="rx-chat-window">
        <div class="rx-chat-header" id="rx-chat-header">
          <div class="rx-header-icon" id="rx-header-icon">${!config.images.headerIcon ? avatars.headerEmoji : ''}</div>
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
   * Message Functions (Unified & Fixed)
   * ===============================
   */
  function addMessage(text, sender = 'bot', isLink = false, savedAvatarEmoji = '') {
    const container = document.getElementById('rx-chat-messages');
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.className = `rx-message-wrapper ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = `rx-avatar ${sender}`;
    if (!config.avatars.useImages) {
      avatar.textContent = savedAvatarEmoji || (sender === 'bot' ? config.avatars.botEmoji : config.avatars.userEmoji);
    }

    let processedText = text;
    let linkUrl = null;
    let linkButtonText = null;

    if (sender === 'bot' && typeof text === 'string' && text.includes('[LINK:')) {
      const match = text.match(/\[LINK:(.*?)\|(.*?)\]/);
      if (match) {
        linkUrl = match[1];
        linkButtonText = match[2];
        processedText = text.replace(match[0], '').trim();
      }
    }

    wrapper.appendChild(avatar);

    const messageContainer = document.createElement('div');
    messageContainer.className = 'rx-message';
    messageContainer.style.whiteSpace = 'pre-line';
    
    const textDiv = document.createElement('div');
    textDiv.textContent = typeof processedText === 'function' ? processedText() : processedText;
    messageContainer.appendChild(textDiv);

    if (linkUrl) {
      const link = document.createElement('a');
      link.href = linkUrl;
      link.className = 'rx-link-button';
      link.textContent = linkButtonText || 'Open Link';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.addEventListener('click', (e) => { e.stopPropagation(); });
      messageContainer.appendChild(link);
    }

    wrapper.appendChild(messageContainer);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
    saveMessageHistory();
  }

  function addMessageWithLink(text, sender, url, linkText) {
    const container = document.getElementById('rx-chat-messages');
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.className = `rx-message-wrapper ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = `rx-avatar ${sender}`;
    if (!config.avatars.useImages) {
      avatar.textContent = sender === 'bot' ? config.avatars.botEmoji : config.avatars.userEmoji;
    }

    const messageContainer = document.createElement('div');
    messageContainer.className = 'rx-message';
    messageContainer.style.whiteSpace = 'pre-line';

    const textDiv = document.createElement('div');
    textDiv.textContent = text;
    messageContainer.appendChild(textDiv);

    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.className = 'rx-link-button';
      link.textContent = linkText || 'Open Link';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.addEventListener('click', (e) => { e.stopPropagation(); });
      messageContainer.appendChild(link);
    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(messageContainer);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
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
    if (!config.avatars.useImages) avatar.textContent = config.avatars.botEmoji;

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
    if (!config.avatars.useImages) avatar.textContent = config.avatars.botEmoji;
    
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
    config.gemini.availableModels.forEach((model) => {
      const isCurrent = model.id === config.gemini.currentModel;
      modelList += `${isCurrent ? '✓' : '•'} ${model.name}\n   ${model.description}\n\n`;
    });
    modelList += 'To switch models, type: use model MODEL_NAME\nTo test all models, type: test models';
    addMessage(modelList, 'bot');
  }

  function switchModel(modelId) {
    if (!modelId) {
      addMessage('Please specify a model. Format: use model MODEL_NAME', 'bot');
      return;
    }
    let model = config.gemini.availableModels.find(m => m.id.toLowerCase().includes(modelId.toLowerCase()) || m.name.toLowerCase().includes(modelId.toLowerCase()));
    if (model) {
      saveModel(model.id);
      const modelInfo = getCurrentModelInfo();
      addMessage(`Switched to ${modelInfo.name}`, 'bot');
      updateModeIndicator();
    } else {
      addMessage('Model not found. Type "models" to see available options.', 'bot');
    }
  }

  function showCurrentModel() {
    const modelInfo = getCurrentModelInfo();
    addMessage(`Current Model: ${modelInfo.name}`, 'bot');
  }

  function findCommand(input) {
    let cmd = commands.find(c => input.toLowerCase() === c.command.toLowerCase());
    if (!cmd) {
      cmd = commands.find(c => input.toLowerCase().startsWith(c.command.toLowerCase() + ' ') && c.requiresParameter);
    }
    return cmd;
  }

  function extractParameter(input, command) {
    const parts = input.split(' ');
    return parts.length >= 2 ? parts.slice(1).join(' ').trim() : null;
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
        addMessage(cmd.response, 'bot');
        setTimeout(() => {
          document.getElementById('rx-chat-window').classList.remove('show');
          saveWindowState(false);
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
          addMessage('API key found! Connecting to Gemini...', 'bot');
          await connectToFreeTier();
        } else {
          awaitingApiKey = true;
          addMessage('Enter your Gemini API key:\n\nFormat: set key YOUR_API_KEY\n\nGet a key: type "get api key"', 'bot');
        }
      }
      else if (cmd.action === 'commandMode') {
        chatMode = 'command';
        saveChatMode('command');
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
      else if (cmd.action === 'listModels') { listModels(); }
      else if (cmd.action === 'switchModel') { switchModel(extractParameter(input, cmd.command)); }
      else if (cmd.action === 'showCurrentModel') { showCurrentModel(); }
      else if (cmd.action === 'testAllModels') { await testAllAvailableModels(); }
      else if (cmd.isLink) {
        const response = typeof cmd.response === 'function' ? cmd.response() : cmd.response;
        addMessageWithLink(response, 'bot', cmd.url, cmd.linkText);
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
   * DRAGGABLE - FIXED (No border escape, No long press)
   * ===============================
   */
  function makeDraggable(element, handle) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let currentX, currentY;
    let isTouchDevice = ('ontouchstart' in window);

    function getClientCoordinates(e) {
      if (e.type && e.type.startsWith('touch')) {
        const touch = e.touches[0] || e.changedTouches[0];
        return { clientX: touch.clientX, clientY: touch.clientY };
      }
      return { clientX: e.clientX, clientY: e.clientY };
    }

    function getBoundaryLimits() {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight;
      
      return {
        minX: 0,
        maxX: viewportWidth - elementWidth,
        minY: 0,
        maxY: viewportHeight - elementHeight
      };
    }

    function startDrag(e) {
      if (e.target.closest('#rx-close-btn') || 
          e.target.closest('.rx-input-area') || 
          e.target.closest('.rx-link-button') ||
          e.target.closest('a')) {
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
      element.classList.add('dragging');
      element.style.transition = 'none';
    }

    function onDrag(e) {
      if (!isDragging) return;
      e.preventDefault();
      
      const coords = getClientCoordinates(e);
      const limits = getBoundaryLimits();
      
      let newLeft = coords.clientX - startX;
      let newTop = coords.clientY - startY;
      
      newLeft = Math.max(limits.minX, Math.min(limits.maxX, newLeft));
      newTop = Math.max(limits.minY, Math.min(limits.maxY, newTop));
      
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
      
      element.classList.remove('dragging');
      element.style.transition = '';
      
      if (currentX !== undefined && currentY !== undefined) {
        saveWindowPosition(currentX, currentY);
      }
      
      isDragging = false;
    }

    // Mouse Events
    handle.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);

    // Touch Events - NO LONG PRESS
    if (isTouchDevice) {
      handle.addEventListener('touchstart', startDrag, { passive: false });
      handle.addEventListener('touchmove', onDrag, { passive: false });
      handle.addEventListener('touchend', stopDrag, { passive: false });
      handle.addEventListener('touchcancel', stopDrag, { passive: false });
    }

    // Window Resize - Keep in bounds
    window.addEventListener('resize', function() {
      const rect = element.getBoundingClientRect();
      const limits = getBoundaryLimits();
      
      let newLeft = rect.left;
      let newTop = rect.top;
      
      if (newLeft < limits.minX) newLeft = limits.minX;
      if (newLeft > limits.maxX) newLeft = limits.maxX;
      if (newTop < limits.minY) newTop = limits.minY;
      if (newTop > limits.maxY) newTop = limits.maxY;
      
      if (newLeft !== rect.left || newTop !== rect.top) {
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
        element.style.transform = 'none';
        saveWindowPosition(newLeft, newTop);
      }
    });
  }

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
      clearMessageHistory();
    });

    sendBtn.addEventListener('click', handleUserInput);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserInput(); });

    loadApiKey();
    loadModel();
    chatMode = loadChatMode();
    updateModeIndicator();

    if (loadWindowState()) {
      chatWindow.classList.add('show');
      loadMessageHistory();
    }

    setupTrigger();
  }

  function init() {
    if (window.__RX_INIT__) return;
    window.__RX_INIT__ = true;

    injectCSS();
    injectHTML();
    setTimeout(setupInteractions, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();