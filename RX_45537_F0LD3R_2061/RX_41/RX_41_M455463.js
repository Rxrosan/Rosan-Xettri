// ============================================================
// 07-message.js - Message Functions
// ============================================================

let typingTimeout = null;

//  Duplicate रोक्ने flag
let isRestoringFromHistory = false;

function addMessage(text, sender = 'bot', isLink = false, savedAvatarEmoji = '', savedLinks = null) {
  const container = document.getElementById('rx-chat-messages');
  if (!container) return;

  //  Validate
  if (text === null || text === undefined) return;
  const safeText = String(text);
  if (safeText.trim().length === 0) return;

  const wrapper = document.createElement('div');
  wrapper.className = `rx-message-wrapper ${sender}`;

  const avatar = document.createElement('div');
  avatar.className = `rx-avatar ${sender}`;
  if (!config.avatars.useImages) {
    avatar.textContent = savedAvatarEmoji || (sender === 'bot' ? config.avatars.botEmoji : config.avatars.userEmoji);
  }

  let processedText = safeText;
  let links = [];

  //  History बाट restore गर्दा savedLinks प्रयोग गर्ने
  if (isRestoringFromHistory && Array.isArray(savedLinks)) {
    links = savedLinks;
    // text बाट [LINK:...] हटाउने (यदि छ भने)
    processedText = safeText.replace(/\[LINK:(.*?)\|(.*?)\]/g, '').trim();
  } else if (sender === 'bot' && safeText.includes('[LINK:')) {
    //  नयाँ message — text बाट links निकाल्ने
    const linkRegex = /\[LINK:(.*?)\|(.*?)\]/g;
    let match;
    while ((match = linkRegex.exec(safeText)) !== null) {
      links.push({ url: match[1], buttonText: match[2] });
    }
    processedText = safeText.replace(linkRegex, '').trim();
  }

  wrapper.appendChild(avatar);

  const messageContainer = document.createElement('div');
  messageContainer.className = 'rx-message';
  messageContainer.style.whiteSpace = 'pre-line';

  const textDiv = document.createElement('div');
  textDiv.textContent = processedText;
  messageContainer.appendChild(textDiv);

  //  सबै links render गर्ने (multiple links support)
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
      link.addEventListener('click', (e) => e.stopPropagation());
      linkContainer.appendChild(link);
    });

    messageContainer.appendChild(linkContainer);
  }

  wrapper.appendChild(messageContainer);
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;

  //  History restore गर्दा store मा फेरि नथप्ने
  if (isRestoringFromHistory) {
    return;
  }

  //  State मा थप + debounced save (सबै links store गर्ने)
  if (typeof pushMessageToStore === 'function') {
    pushMessageToStore({
      sender,
      text: safeText,
      avatarEmoji: savedAvatarEmoji || '',
      hasLink: links.length > 0,
      links: links.length > 0 ? links : null,  //  सबै links array store
      //  Backward compatibility — पहिलो link पनि राख्ने
      linkUrl: links[0]?.url || null,
      linkText: links[0]?.buttonText || null
    });
  } else {
    saveMessageHistory();
  }
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

  const links = [];
  if (url) {
    links.push({ url, buttonText: linkText || 'Open Link' });
    const link = document.createElement('a');
    link.href = url;
    link.className = 'rx-link-button';
    link.textContent = linkText || 'Open Link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.addEventListener('click', (e) => e.stopPropagation());
    messageContainer.appendChild(link);
  }

  wrapper.appendChild(avatar);
  wrapper.appendChild(messageContainer);
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;

  //  History restore गर्दा store मा फेरि नथप्ने
  if (isRestoringFromHistory) {
    return;
  }

  if (typeof pushMessageToStore === 'function') {
    pushMessageToStore({
      sender,
      text: finalText,
      avatarEmoji: '',
      hasLink: !!url,
      links: links.length > 0 ? links : null,  //  links array
      linkUrl: url || null,
      linkText: linkText || null
    });
  } else {
    saveMessageHistory();
  }
}

function showTypingIndicator() {
  const container = document.getElementById('rx-chat-messages');
  if (!container) return;

  removeTypingIndicator();  //  duplicate रोक्ने

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

  //  Safety timeout
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => removeTypingIndicator(), 45000);
}

function removeTypingIndicator() {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
  const indicator = document.getElementById('rx-typing');
  if (indicator) indicator.remove();
}

function showWelcomeSequence() {
  const container = document.getElementById('rx-chat-messages');
  if (!container) return;

  //  पहिलो पटक हो कि पुरानो history बाट हो check गर्ने
  const welcomeAlreadyInStore = messageStore.some(
    m => m.sender === 'bot' && m.text === config.welcomeMessage
  );

  //  DOM मा पहिले नै छ कि check
  const existingWelcome = Array.from(container.querySelectorAll('.rx-message-wrapper.bot'))
    .some(w => {
      const msgDiv = w.querySelector('.rx-message');
      return msgDiv && msgDiv.textContent.trim() === config.welcomeMessage.trim();
    });

  if (existingWelcome) return;  //  duplicate रोक्ने

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
  container.appendChild(wrapper);

  function typeWriter() {
    if (i < welcome.length) {
      message.textContent += welcome.charAt(i);
      i++;
      setTimeout(typeWriter, config.typingSpeed);
    }
  }
  typeWriter();

  //  Store मा पहिले नै छ भने फेरि नथप्ने
  if (!welcomeAlreadyInStore && typeof pushMessageToStore === 'function') {
    pushMessageToStore({
      sender: 'bot',
      text: welcome,
      avatarEmoji: '',
      hasLink: false,
      links: null,
      linkUrl: null,
      linkText: null
    });
  }
}

function loadMessagesFromHistory() {
  const messages = loadMessageHistory();
  if (!messages || messages.length === 0) return;

  //  History restore mode ON — store मा फेरि नथप्ने
  isRestoringFromHistory = true;

  try {
    messages.forEach(msg => {
      //  नयाँ format: links array
      if (Array.isArray(msg.links) && msg.links.length > 0) {
        addMessage(msg.text, msg.sender, false, msg.avatarEmoji, msg.links);
      }
      //  पुरानो format: hasLink + linkUrl (single link)
      else if (msg.hasLink && msg.linkUrl) {
        addMessageWithLink(msg.text, msg.sender, msg.linkUrl, msg.linkText);
      }
      //  सामान्य message
      else {
        addMessage(msg.text, msg.sender, false, msg.avatarEmoji);
      }
    });
  } finally {
    //  Restore mode OFF — अब normal message store हुन्छ
    isRestoringFromHistory = false;
  }
}