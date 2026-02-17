// RX-COMMAND-SYSTEM-EMERGENCY-FIX.js
// 100% Working version with exact trigger matching
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
    welcomeMessage: 'Welcome to RX STUDIO \n\nTo cuntinue type hello or help ',
    typingSpeed: 30,
    copyright: ' <p>&copy; <strong><a href="https://www.rosankc.com.np" style="color:#64ffda; text-decoration:none;">RX STUDIO</a></strong>. All Rights Reserved.</p>',
    
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
      primary: 'ltransprent',
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
      position: 'rx-window-position'
    },
    
    // Contact Page URL
    contactPageUrl: 'contact.html'
  };

  /**
   * ===============================
   * COMMAND SYSTEM - ENHANCED
   * ===============================
   */
  const commands = [
    { 
      command: 'hello', 
      description: 'Start conversation',
      response: 'Hello! I am RX STUDIO ASSISTANT. Type "help" to see all available commands.',
      category: 'basic'
    },
    { 
      command: 'about', 
      description: 'About RX Studio',
      response: 'Rosan Khattri Chettri is a 22-year-old BBS third-year student from Banganga-10, Kapilvastu. He is passionate about design and web development, creating visually appealing and user-friendly digital experiences. Dedicated to continuous learning, he strives to grow creatively and technically while making a positive impact in the digital world.',
      category: 'info',
      isLink: true,
      url: 'About.html',
      linkText: 'click to open about Page'
    },
    { 
      command: 'contact', 
      description: 'Contact information',
      response: 'CONTACT US\n\nClick the link below to open our contact page:',
      category: 'contact',
      isLink: true,
      url: 'Contact.html',
      linkText: 'click to open Contact Page'
    },
    { 
      command: 'service', 
      description: 'Our services',
      response: 'RX SERVICES:\n\n• Web Development\n• Mobile App Development\n• UI/UX Design\n• Cloud Solutions',
      category: 'Service',
      isLink: true,
      url: 'Service.html',
      linkText: 'click to open service Page'
    },
    { 
      command: 'close window', 
      category: 'system',
      description: 'Close chat window',
      response: 'Closing window... See you soon!',
      action: 'close'
    },
    { 
      command: 'clear chat', 
      category: 'system',
      description: 'Clear all messages',
      response: 'cleared!',
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
      linkText: 'click to open Website'
    },
    { 
      command: 'date', 
      description: 'Current date',
      response: 'Today is: ' + new Date().toLocaleDateString(),
      category: 'utility'
    }
  ];

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
    document.getElementById('rx-chat-messages').innerHTML = '';
  }

  /**
   * ===============================
   * CSS Injection - ENHANCED for responsive
   * ===============================
   */
  function generateCSS() {
    const { images, colors } = config;
    
    return `
    * {
      box-sizing: border-box;
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
    }

    .rx-chat-window.show {
      display: flex;
    }

    .rx-chat-header {
      padding: 15px;
      background: ${colors.headerBg || 'rgba(0,0,0,0.3)'};
      border-bottom: 1px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: move;
      height: 1cm;
    }

    .rx-header-icon {
      width: 0.8cm;
      height: 0.8cm;
      border-radius: 50%;
      background:transprent;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      border: 2px solid rgba(255,255,255,0.5);
      ${images.headerIcon ? `background-image: url('${images.headerIcon}'); background-size: cover; background-position: center;` : ''}
    }

    .rx-header-title {
      flex: 1;
      font-weight: bold;
      text-align: center;
      color: ${colors.textColor || 'white'};
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
    }

    .rx-header-close:hover {
      background: rgba(255,255,255,0.3);
    }

    .rx-chat-messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: ${images.messageBg ? `url('${images.messageBg}') repeat` : 'transparent'};
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
      background: transprent;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      flex-shrink: 0;
      overflow: hidden;
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
    }

    .rx-message-wrapper.bot .rx-message {
      border-bottom-left-radius: 4px;
      background: ${colors.botMessageBg || 'rgba(255,255,255,0.1)'};
    }

    .rx-message-wrapper.user .rx-message {
      background: transprent;
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
    }

    .rx-link-button:hover {
      background: #64ffda;
      color: #000;
    }

    .rx-input-area {
      display: flex;
      padding: 12px;
      gap: 8px;
      background: ${colors.headerBg || 'rgba(0,0,0,0.3)'};
      border-top: 1px solid rgba(255,255,255,0.2);
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
    }

    .rx-input-area button:hover {
      transform: scale(1.1);
    }

    .rx-send-icon {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }

    .rx-copyright {
      padding: 6px;
      text-align: center;
      font-size: 0.7rem;
      color: rgba(255,255,255,0.5);
      background: ${colors.headerBg || 'rgba(0,0,0,0.3)'};
      border-top: 1px solid rgba(255,255,255,0.1);
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

    /* Responsive Design - Auto screen size detection */
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
          <div class="rx-header-title">ROSAN XETTRI STUDIO</div>
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
   * Message Functions - ENHANCED
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
    message.textContent = text;

    wrapper.appendChild(avatar);
    wrapper.appendChild(message);
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
    
    if (config.avatars.useImages) {
      avatar.textContent = '';
    } else {
      avatar.textContent = sender === 'bot' ? config.avatars.botEmoji : config.avatars.userEmoji;
    }

    const messageContainer = document.createElement('div');
    messageContainer.className = 'rx-message';
    messageContainer.style.whiteSpace = 'pre-line';
    
    const textDiv = document.createElement('div');
    textDiv.textContent = text;
    
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
      helpText += `${cat.toUpperCase()}:\n`;
      categories[cat].forEach(cmd => {
        helpText += `  • ${cmd.command} - ${cmd.description}\n`;
      });
      helpText += '\n';
    }
    
    addMessage(helpText, 'bot');
  }

  function findCommand(input) {
    return commands.find(cmd => cmd.command.toLowerCase() === input.toLowerCase().trim());
  }

  function processCommand(input) {
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
      else if (cmd.isLink) {
        addMessageWithLink(cmd.response, 'bot', cmd.url, cmd.linkText);
        setTimeout(() => {
          window.open(cmd.url, '_blank');
        }, 500);
      }
      else {
        addMessage(cmd.response, 'bot');
      }
    } else {
      addMessage(`Unknown command: "${input}"\n\nType "help" to see all commands.`, 'bot');
    }
  }

  function handleUserInput() {
    const input = document.getElementById('rx-user-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    showTypingIndicator();
    
    setTimeout(() => {
      removeTypingIndicator();
      processCommand(text);
    }, 800);
  }

  /**
   * ===============================
   * Drag Functions
   * ===============================
   */
  function makeDraggable(element, handle) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      
      e.preventDefault();
      
      const rect = element.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      
      isDragging = true;
      element.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      
      let newLeft = e.clientX - startX;
      let newTop = e.clientY - startY;
      
      newLeft = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newLeft));
      newTop = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newTop));
      
      element.style.left = newLeft + 'px';
      element.style.top = newTop + 'px';
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.style.transform = 'none';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.style.cursor = '';
        
        const left = parseInt(element.style.left) || 0;
        const top = parseInt(element.style.top) || 0;
        saveWindowPosition(left, top);
      }
    });
  }

  /**
   * ===============================
   * EXACT TRIGGER MATCHING - FIXED FOR YOUR HTML
   * ===============================
   */
  function setupTrigger() {
    const chatWindow = document.getElementById('rx-chat-window');
    if (!chatWindow) return;

    const triggerSelector = '.RX-SMART-BUTTON-menu-item.RX-item-4[data-link=""]';
    
    function openChatWindow() {
      console.log('RX Chat: Opening window');
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
        console.log('RX Chat: Found trigger with direct selector');
        
        trigger.removeEventListener('click', openChatWindow);
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('RX Chat: Trigger clicked');
          openChatWindow();
        });
        
        return true;
      }
      
      const images = document.querySelectorAll('img[src*="BOT-PROFILE-1.png"]');
      for (const img of images) {
        const parent = img.closest('.RX-SMART-BUTTON-menu-item');
        if (parent) {
          console.log('RX Chat: Found trigger by image source');
          
          parent.removeEventListener('click', openChatWindow);
          parent.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('RX Chat: Trigger clicked');
            openChatWindow();
          });
          
          return true;
        }
      }
      
      const altImages = document.querySelectorAll('img[alt="chat"]');
      for (const img of altImages) {
        const parent = img.closest('.RX-SMART-BUTTON-menu-item');
        if (parent) {
          console.log('RX Chat: Found trigger by alt text');
          
          parent.removeEventListener('click', openChatWindow);
          parent.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('RX Chat: Trigger clicked');
            openChatWindow();
          });
          
          return true;
        }
      }
      
      return false;
    }

    if (!attachToTrigger()) {
      console.log('RX Chat: Trigger not found, watching for it...');
      
      const observer = new MutationObserver(() => {
        if (attachToTrigger()) {
          console.log('RX Chat: Trigger found and attached');
          observer.disconnect();
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      let attempts = 0;
      const interval = setInterval(() => {
        if (attachToTrigger()) {
          console.log('RX Chat: Trigger found via interval');
          clearInterval(interval);
          observer.disconnect();
        }
        
        attempts++;
        if (attempts > 20) {
          clearInterval(interval);
          console.log('RX Chat: Stopped looking for trigger');
        }
      }, 500);
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
      clearMessageHistory();
    });

    sendBtn.addEventListener('click', handleUserInput);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserInput();
    });

    if (loadWindowState()) {
      chatWindow.classList.add('show');
      loadMessageHistory();
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