// ============================================================
// 07-message.js - Message Functions (MULTIPLE LINKS SUPPORT)
// ============================================================

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
  const links = [];  // ← multiple links array

  // ===== Multiple [LINK:...] parse गर्ने =====
  if (sender === 'bot' && typeof text === 'string' && text.includes('[LINK:')) {
    const linkRegex = /\[LINK:(.*?)\|(.*?)\]/g;
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      links.push({ url: match[1], buttonText: match[2] });
    }
    // सबै [LINK:...] हटाउने
    processedText = text.replace(linkRegex, '').trim();
  }

  wrapper.appendChild(avatar);

  const messageContainer = document.createElement('div');
  messageContainer.className = 'rx-message';
  messageContainer.style.whiteSpace = 'pre-line';
  
  const textDiv = document.createElement('div');
  textDiv.textContent = typeof processedText === 'function' ? processedText() : processedText;
  messageContainer.appendChild(textDiv);

  // ===== सबै links add गर्ने (multiple) =====
  if (links.length > 0) {
    const linkContainer = document.createElement('div');
    linkContainer.className = 'rx-link-container';
    linkContainer.style.display = 'flex';
    linkContainer.style.flexWrap = 'wrap';
    linkContainer.style.gap = '6px';
    linkContainer.style.marginTop = '8px';

    links.forEach(linkData => {
      const link = document.createElement('a');
      link.href = linkData.url;
      link.className = 'rx-link-button';
      link.textContent = linkData.buttonText || 'Open Link';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.addEventListener('click', (e) => { e.stopPropagation(); });
      linkContainer.appendChild(link);
    });

    messageContainer.appendChild(linkContainer);
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
  let finalText = text;
  if (typeof finalText === 'string') {
    finalText = finalText
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n')
      .trim();
  }
  textDiv.textContent = finalText;
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

function loadMessagesFromHistory() {
  const messages = loadMessageHistory();
  if (messages) {
    messages.forEach(msg => {
      if (msg.hasLink) {
        addMessageWithLink(msg.text, msg.sender, msg.linkUrl, msg.linkText);
      } else {
        addMessage(msg.text, msg.sender, false, msg.avatarEmoji);
      }
    });
  }
}