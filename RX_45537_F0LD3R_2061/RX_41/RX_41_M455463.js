// ============================================================
// 07-message.js - Message Functions
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