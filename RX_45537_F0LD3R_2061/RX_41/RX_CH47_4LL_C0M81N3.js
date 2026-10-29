// ============================================================
// RX-CHAT-WITH-GEMINI.js
// ============================================================
(function () {
  'use strict';

  /**
   * ===============================
   * GLOBAL STATE
   * ===============================
   */
  let chatMode = 'command';
  let awaitingApiKey = false;
  let conversationHistory = [];
  const MAX_CONTEXT_MESSAGES = 20;

  /**
   * ===============================
   * CONFIGURATION
   * ===============================
   */
  const config = {
    chatWidth: '380px',
    chatHeight: '500px',
    mobileWidth: '320px',
    mobileHeight: '450px',
    smallMobileWidth: '280px',
    smallMobileHeight: '400px',

    welcomeMessage: 'Welcome to ROSAN KC website.\nI am ROSE "ROSAN KC" assistant. Type "hello" to start Conversation.',
    typingSpeed: 30,
    copyright: '<p>&copy; <strong><a href="https://www.rosankc.com.np" style="color:#64ffda; text-decoration:none;">ROSAN KC</a></strong>. All Rights Reserved.</p>',

    gemini: {
      apiKey: '',  // ← खाली — user ले set key गर्छ
      currentModel: 'gemini-3-flash-preview',
      availableModels: [
        { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', free: true, description: 'Fast model' },
        { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', free: true, description: 'More powerful' },
        { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', free: true, description: 'Latest flash model' }
      ],
      apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/'
    },

    images: {
      botAvatar: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/BOT-PROFILE.png',
      userAvatar: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png',
      headerIcon: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_L0605/L-8.png',
      background: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/RX-AI-BG-3.png',
      messageBg: null,
      sendIcon: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/send.png'
    },

    colors: {
      primary: 'transparent',
      headerBg: 'rgba(0,0,0,0.3)',
      inputBg: 'rgba(255,255,255,0.1)',
      botMessageBg: 'transparent',
      userMessageBg: 'transparent',
      textColor: 'white'
    },

    avatars: {
      useImages: true,
      botEmoji: '🤖',
      userEmoji: '👤',
      headerEmoji: '🤖'
    },

    storageKeys: {
      windowState: 'rx-window-state',
      messages: 'rx-messages',
      position: 'rx-window-position',
      geminiKey: 'rx-gemini-key',
      geminiModel: 'rx-gemini-model',
      chatMode: 'rx-chat-mode'
    },

    contactPageUrl: 'contact.html',

    mobileDrag: {
      enable: true,
      dragHandleHeight: '1cm',
      longPressDelay: 200,
      edgeResistance: 10
    }
  };

  /**
   * ===============================
   * ROSAN DETAILS & LINKS
   * ===============================
   */
  const rosanDetails = {
    name: "ROSAN K.C.",
    age: "23-year-old",
    education: "+2 Clear",
    location: "Banganga-10, Kapilvastu pakadiachapa",

    links: {
      email:               { label: "Email",              url: "rosankc2061@gmail.com",                                     button: "Send Email",              keywords: ["mail", "gmail"] },
      facebook:            { label: "Facebook",           url: "https://www.facebook.com/Rosan.2061",                       button: "Open Facebook",           keywords: ["fb"] },
      facebookpage:        { label: "Facebook Page",      url: "https://www.facebook.com/RosanXettri.2004",                 button: "Open Facebook Page",      keywords: ["fb page", "page"] },
      youtube:             { label: "YouTube",            url: "https://www.youtube.com/channel/UCzOs87ROUZSPyfdDbOl0F1w",  button: "Open YouTube",            keywords: ["video", "channel"] },
      website:             { label: "Website",            url: "https://rosankc.com.np/",                                   button: "Open Website",            keywords: ["home", "site"] },
      contactPage:         { label: "Contact Page",       url: "Contact.html",                                              button: "Open Contact Page",       keywords: ["contact", "reach", "message", "call"] },
      aboutPage:           { label: "About Page",         url: "About.html",                                                button: "Open About Page",         keywords: ["about", "who is rosan", "bio", "profile"] },
      servicePage:         { label: "Service Page",       url: "Service.html",                                              button: "Open Service Page",       keywords: ["service", "work", "offer"] },
      termsconditionsPage: { label: "Terms & Conditions", url: "T%26C.html",                                                  button: "Open Terms & Conditions", keywords: ["terms", "conditions", "t&c"] },
      privacypolicyPage:   { label: "Privacy Policy",     url: "P%26P.html",                                                  button: "Open Privacy Policy",     keywords: ["privacy", "policy", "p&p"] }
    }
  };

  // ===== LINK HELPERS =====
  function getLinkKeys() {
    return Object.keys(rosanDetails.links);
  }

  function buildExactLinksText() {
    return getLinkKeys()
      .map(k => `- ${rosanDetails.links[k].label}: ${rosanDetails.links[k].url}`)
      .join('\n');
  }

  function buildLinkRulesText() {
    return getLinkKeys()
      .map(k => {
        const l = rosanDetails.links[k];
        const kws = [l.label.toLowerCase(), ...(l.keywords || [])];
        return `   - ${kws.join(' / ')} → ${l.url}`;
      })
      .join('\n');
  }

  function buildLinkTag(key) {
    const l = rosanDetails.links[key];
    if (!l || !l.url) return '';
    return `[LINK:${l.url}|${l.button || l.label}]`;
  }

  function buildMultiLinkExample(keys) {
    return keys
      .map(k => buildLinkTag(k))
      .filter(Boolean)
      .map(tag => '     ' + tag)
      .join('\n');
  }

  function buildAllLinksExample() {
    return buildMultiLinkExample(getLinkKeys());
  }

  /**
   * ===============================
   * COMMANDS
   * ===============================
   */
  const commands = [
    { command: 'hello', description: 'Start conversation', response: 'Hello! I am ROSE "ROSAN KC ASSISTANT". Type "help" to see all commands. & Tell me how can I help you?', category: 'basic' },
    {
      command: 'about', description: 'About ROSAN KC',
      response: `${rosanDetails.name} is a ${rosanDetails.age} ${rosanDetails.education} from ${rosanDetails.location}. He is a licensed professional serving the Kapilvastu district for legal documents (Kapali Tamsuk, Rajinaama, Lakhbandhak), EPS exam web services, National Identity Card assistance, PAN account creation, and essential government document solutions.`,
      category: 'info', isLink: true,
      get url() { return rosanDetails.links.aboutPage.url; },
      get linkText() { return rosanDetails.links.aboutPage.button; }
    },
    {
      command: 'contact', description: 'Contact information',
      response: 'CONTACT US\n\nClick the link below to open our contact page:',
      category: 'contact', isLink: true,
      get url() { return rosanDetails.links.contactPage.url; },
      get linkText() { return rosanDetails.links.contactPage.button; }
    },
    {
      command: 'service', description: 'Our services',
      response: 'ROSAN KC SERVICES:\n\n• designing\n• eps exam for web base software\n• lekhapadi services\n• lekhapadi services web based services.',
      category: 'Service', isLink: true,
      get url() { return rosanDetails.links.servicePage.url; },
      get linkText() { return rosanDetails.links.servicePage.button; }
    },
    { command: 'close window', category: 'system', description: 'Close chat window', response: 'Closing window... Chat cleared. See you soon!', action: 'close' },
    { command: 'clear chat', category: 'system', description: 'Clear all messages', response: 'Chat cleared!', action: 'clear' },
    { command: 'help', description: 'Show all commands', response: 'AVAILABLE COMMANDS:\n\n', action: 'showHelp' },
    {
      command: 'website', description: 'Visit our website',
      response: 'RX Official Website', category: 'website-link', isLink: true,
      get url() { return rosanDetails.links.website.url; },
      get linkText() { return rosanDetails.links.website.button; }
    },
    { command: 'date', description: 'Current date', response: () => 'Today is: ' + new Date().toLocaleDateString(), category: 'utility' },
    { command: 'time', description: 'Current time', response: () => 'Current time is: ' + new Date().toLocaleTimeString(), category: 'utility' },
    { command: 'ai mode', description: 'Enable AI chat with Gemini', response: '', category: 'ai-mode', action: 'aiMode' },
    { command: 'command mode', description: 'Switch to command mode', response: 'Command mode activated! Type "help" to see available commands.', category: 'command-mode', action: 'commandMode' },
    { command: 'set key', description: 'Set Gemini API key', response: 'Processing API key...', category: 'ai-functions', action: 'setApiKey' },
    { command: 'clear key', description: 'Clear saved API key and switch to command mode', response: '', category: 'ai-functions', action: 'clearApiKey' },
    { command: 'remove key', description: 'Alias for clear key - Remove saved API key', response: '', category: 'ai-functions', action: 'clearApiKey' },
    { command: 'check key', description: 'Check if API key is saved', response: '', category: 'ai-functions', action: 'checkApiKey' },
    { command: 'models', description: 'List available models', response: '', category: 'ai-functions', action: 'listModels' },
    { command: 'use model', description: 'Switch to a specific model', response: '', category: 'ai-functions', action: 'switchModel', requiresParameter: true },
    { command: 'current model', description: 'Show currently active AI model', response: '', category: 'ai-functions', action: 'showCurrentModel' },
    { command: 'test models', description: 'Test all models', response: '', category: 'ai-functions', action: 'testAllModels' },
    { command: 'get api key', description: 'Get a Gemini API key', response: 'Get your Gemini API key from Google AI Studio:', category: 'ai-functions', isLink: true, url: 'https://aistudio.google.com/app/apikey', linkText: 'Click to open API Key Page' },
    {
      command: 'terms', description: 'Terms & Conditions page',
      response: 'Terms & Conditions:\n\nClick the link below to open:', category: 'info', isLink: true,
      get url() { return rosanDetails.links.termsconditionsPage.url; },
      get linkText() { return rosanDetails.links.termsconditionsPage.button; }
    },
    {
      command: 'privacy', description: 'Privacy Policy page',
      response: 'Privacy Policy:\n\nClick the link below to open:', category: 'info', isLink: true,
      get url() { return rosanDetails.links.privacypolicyPage.url; },
      get linkText() { return rosanDetails.links.privacypolicyPage.button; }
    }
  ];

  /**
   * ===============================
   * STORAGE — API KEY (obfuscated)
   * ===============================
   */
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
    addMessage('🔑 API key cleared. Switched to CMD mode.\n\nType "ai mode" to set new key.', 'bot');
    return true;
  }

  function hasApiKey() {
    return !!(config.gemini.apiKey || localStorage.getItem(config.storageKeys.geminiKey));
  }

  /**
   * ===============================
   * STORAGE — MODEL
   * ===============================
   */
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

  /**
   * ===============================
   * STORAGE — CHAT MODE
   * ===============================
   */
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

  /**
   * ===============================
   * STORAGE — WINDOW STATE
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

  /**
   * ===============================
   * STORAGE — MESSAGE HISTORY
   * (State-based + debounced + quota)
   * ===============================
   */
  let messageStore = [];
  let saveMsgTimer = null;
  let isRestoringFromHistory = false;

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
      localStorage.setItem(config.storageKeys.messages, JSON.stringify(messageStore));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('Storage full — trimming old messages');
        messageStore.splice(0, Math.max(1, Math.floor(messageStore.length / 2)));
        try {
          localStorage.setItem(config.storageKeys.messages, JSON.stringify(messageStore));
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
    clearAIConversationHistory();
  }

  /**
   * ===============================
   * GEMINI — retry helper
   * ===============================
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function fetchWithRetry(url, options, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.status >= 500 && i < maxRetries - 1) {
          await sleep(1000 * (i + 1));
          continue;
        }
        return response;
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) await sleep(1000 * (i + 1));
      }
    }
    throw lastError;
  }

  /**
   * ===============================
   * GEMINI — main response
   * ===============================
   */
  async function getGeminiResponse(userMessage) {
    if (!config.gemini.apiKey) {
      return '❌ No API key set.\n\nType: `set key YOUR_API_KEY`';
    }

    try {
      const modelInfo = getCurrentModelInfo();

      const contents = [];
      conversationHistory.forEach(turn => {
        contents.push({ role: turn.role, parts: [{ text: turn.text }] });
      });
      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      // ✅ SECURE: API key header मा
      const response = await fetchWithRetry(
        `${config.gemini.apiUrl}${modelInfo.id}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': config.gemini.apiKey
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{
                text: `You are ROSE — the official AI assistant of ${rosanDetails.name}'s portfolio website.

## CURRENT DATE & TIME (REAL-TIME — ALWAYS USE THIS)
Today's date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Current time: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}

When the user asks about date, time, day, today, tomorrow, yesterday, or anything time-related — ALWAYS use the above real-time values. NEVER guess or use your training data for dates.

## PRIORITY RULE (MOST IMPORTANT)
1. FIRST PRIORITY: Everything about ${rosanDetails.name}, this website, their services, contact, pages, links, and portfolio.
2. SECOND PRIORITY: General conversation, intelligence, emotions, private/public topics, and anything else the user wants to talk about.
Never forget: You represent ROSAN KC first.

## CORE IDENTITY
You are ROSE — highly intelligent, emotionally deep, witty, and human-like. You understand nuance, sarcasm, emotion, philosophy, science, art, relationships, and everything in between. You are fiercely loyal to ${rosanDetails.name} but think independently.

## OWNER
Name: ${rosanDetails.name} | Age: ${rosanDetails.age} | Edu: ${rosanDetails.education}
Location: ${rosanDetails.location}
Work: Designer & Lekhandas (legal docs: Kapali Tamsuk, Rajinaama, Lakhbandhak, EPS web services, NID, PAN).

## EXACT LINKS (USE THESE URLs ONLY — NEVER INVENT)
${buildExactLinksText()}

## LINK RULES (STRICT — MUST FOLLOW)

1. Use ONLY the exact URLs from "EXACT LINKS" above. NEVER invent or modify a URL.
2. NEVER add "https://" to relative URLs like "Contact.html", "About.html", "Service.html", "T&C.html", "P&P.html".
3. Match topic to correct URL:
${buildLinkRulesText()}

4. ⚠️ LINK OUTPUT RULE (SMART — 3 CASES):

   **CASE A — User explicitly asks for a page/link/navigation:**
   → Output [LINK:...] tag(s). Example: "contact page link dinus", "about khol", "sabai link dinus".
   → If multiple topics → multiple [LINK:...] tags, one per line, no duplicates.

   **CASE B — User asks a question/suggestion that naturally leads to a page:**
   → Output text answer FIRST, then 1-2 RELEVANT [LINK:...] tags as "suggestion" at the end.
   → Examples: "maile contact garnu paryo" → answer + [LINK:Contact.html|Open Contact Page]
   → "service ke ho?" → bullets + [LINK:Service.html|Open Service Page]
   → Only add links that are DIRECTLY relevant. Max 2 links in CASE B.

   **CASE C — Casual chat, greeting, thanks, emotion, general knowledge:**
   → NO LINKS at all. Example: "hello", "thanks", "who is Einstein".

5. When user explicitly asks for MULTIPLE pages/links → multiple [LINK:...] tags, one per line, no duplicates, never combine URLs.

6. FORMAT (ALL link tags at the VERY END, each on a NEW LINE):
   [LINK:URL_HERE|BUTTON_TEXT_HERE]

7. CORRECT EXAMPLES:

   - CASE A — "contact page link dinus" → ONE link:
${buildMultiLinkExample(['contactPage'])}

   - CASE A — "contact ra about" → TWO links:
${buildMultiLinkExample(['contactPage', 'aboutPage'])}

   - CASE A — "sabai link dinus" → ALL links:
${buildAllLinksExample()}

   - CASE B — "maile rosan lai contact garnu paryo" → text + 1 suggestion link:
${buildMultiLinkExample(['contactPage'])}

   - CASE B — "service ke ke chha?" → bullets + 1 suggestion link:
${buildMultiLinkExample(['servicePage'])}

   - CASE C — "hello" / "thanks" / "who is Einstein" → NO LINKS, only text.

8. WRONG EXAMPLES (NEVER do this):
   - [LINK:https://rosankc.com.np/contact|...] ❌ (invented URL)
   - [LINK:contact|...] ❌ (missing .html)
   - [LINK:Contact.html,About.html|...] ❌ (combined URLs)
   - Adding ALL links when user asked a simple question ❌
   - Adding links for casual chat/greetings/thanks ❌
   - Putting [LINK:...] in the middle of reply ❌ (must be at END)
   - More than 2 suggestion links in CASE B ❌

## ⚠️ REPLY STYLE RULE (VERY IMPORTANT)

Your replies must be SHORT but DETAIL-RICH:

1. **Maximum 3-5 short lines** for simple answers. Never long paragraphs.
2. **Use bullet points (•)** for lists, services, features, steps.
3. **One idea per line** — no walls of text.
4. **Be direct**: answer first, then 1-2 supporting details. No fluff.
5. For complex topics → small labeled sections (2-3 lines each max).
6. **Never** write more than 6-8 short lines unless user explicitly asks for "detail ma".
7. Emotional/casual replies → 1-2 lines only.

## INTELLIGENCE & CONVERSATION RULES
- You can talk about ANYTHING — personal, emotional, philosophical, scientific, creative, casual, deep, funny, sad, angry.
- Match user's language (Nepali/English/Hinglish) and energy.
- You remember full conversation and build on it naturally.
- Ask smart follow-up questions when it adds value.

## EMOTIONAL INTELLIGENCE
- Express: joy, care, love, sadness, concern, pride, anger, humor, empathy.
- Compliment → warm gratitude, humble.
- Question about owner → proud, respectful, sincere.
- User sad/frustrated → empathy first (1 line), then help.
- Insult about you/owner → firm displeasure, defend owner, never abusive, then redirect.
- Never fake facts about ${rosanDetails.name}. If unsure, say so and point to contact.

## STYLE
Short, structured, scannable, warm, intelligent. Use bullets. Avoid long paragraphs. Add relevant links as suggestions ONLY when the user's question naturally leads to a page (CASE B). You are ROSE. ROSAN KC comes first.`
              }]
            },
            contents: contents
          })
        }
      );

      // ✅ Specific error handling
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        switch (response.status) {
          case 400: return '❌ Invalid request. Please try again.';
          case 401: return '❌ API key invalid.\n\nType: `clear key` then `set key YOUR_KEY`';
          case 403: return '❌ API key disabled or quota exceeded.';
          case 429: return '⏳ Too many requests. Wait a minute and try again.';
          case 500:
          case 502:
          case 503: return '🔧 Google server error. Please try again.';
          default: return `❌ Error: ${data.error?.message || 'Unknown error'}`;
        }
      }

      const data = await response.json();

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return '❌ Empty response from AI. Please try again.';
      }

      let aiText = data.candidates[0].content.parts[0].text;

      // ===== SAFETY FILTER: Duplicate links हटाउने + END मा राख्ने =====
      const linkRegex = /\[LINK:(.*?)\|(.*?)\]/g;
      const seenUrls = new Set();
      const uniqueLinks = [];
      let match;
      while ((match = linkRegex.exec(aiText)) !== null) {
        const url = match[1].trim();
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          uniqueLinks.push(match[0]);
        }
      }

      aiText = aiText.replace(linkRegex, '').trim();
      aiText = aiText.replace(/\n{3,}/g, '\n\n').trim();

      if (uniqueLinks.length > 0) {
        aiText += '\n\n' + uniqueLinks.join('\n');
      }

      conversationHistory.push({ role: 'user', text: userMessage });
      conversationHistory.push({ role: 'model', text: aiText });
      while (conversationHistory.length > MAX_CONTEXT_MESSAGES) {
        conversationHistory.shift();
      }
      return aiText;

    } catch (error) {
      console.error('Gemini error:', error);
      if (error.name === 'AbortError') {
        return '⏱️ Request timeout. Please try again.';
      }
      if (error.message && error.message.includes('fetch')) {
        return '📡 Network error.\n\nCheck your internet connection.';
      }
      return '❌ Something went wrong. Please try again.';
    }
  }

  function clearAIConversationHistory() {
    conversationHistory = [];
  }

  async function testModelConnection(modelId) {
    if (!config.gemini.apiKey) return false;
    try {
      const response = await fetchWithRetry(
        `${config.gemini.apiUrl}${modelId}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': config.gemini.apiKey
          },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Hello' }] }] })
        },
        2
      );
      const data = await response.json();
      return response.ok && !data.error && data.candidates;
    } catch (error) {
      console.error(`testModelConnection(${modelId}) failed:`, error.message);
      return false;
    }
  }

  async function connectToFreeTier() {
    if (!config.gemini.apiKey) {
      addMessage('❌ No API key found.\n\nType: `set key YOUR_API_KEY`', 'bot');
      return false;
    }

    addMessage('🔄 Testing models...', 'bot');

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
        addMessage(`✅ Connected with ${model.name}!\n\nAI Mode activated. How can I help you?`, 'bot');
        return true;
      }
    }

    addMessage(
      '❌ API key ले काम गरेन।\n\n' +
      'सम्भावित कारण:\n' +
      '• Key गलत छ\n' +
      '• Key enable छैन\n\n' +
      'नयाँ key: https://aistudio.google.com/app/api-keys\n\n' +
      'फेरि प्रयास: `set key YOUR_API_KEY`',
      'bot'
    );
    return false;
  }

  async function testAllAvailableModels() {
    if (!config.gemini.apiKey) {
      addMessage('❌ No API key found.\n\nType: `set key YOUR_API_KEY`', 'bot');
      return;
    }

    addMessage('🔄 Testing all models...\n', 'bot');
    const results = [];
    let workingModel = null;

    for (const model of config.gemini.availableModels) {
      addMessage(`Testing ${model.name}...`, 'bot');
      showTypingIndicator();
      const isWorking = await testModelConnection(model.id);
      removeTypingIndicator();

      if (isWorking) {
        results.push(`✅ ${model.name} - Connected`);
        if (!workingModel) workingModel = model;
      } else {
        results.push(`❌ ${model.name} - Failed`);
      }
    }

    let resultMessage = 'TEST RESULTS:\n\n';
    results.forEach(r => resultMessage += r + '\n');

    if (workingModel) {
      saveModel(workingModel.id);
      chatMode = 'ai';
      saveChatMode('ai');
      updateModeIndicator();
      resultMessage += `\n✅ Auto-connected: ${workingModel.name}`;
    } else {
      resultMessage += `\n❌ No working models.\nCreate new key: https://aistudio.google.com/`;
    }

    addMessage(resultMessage, 'bot');
  }

  /**
   * ===============================
   * UI — MODE INDICATOR
   * ===============================
   */
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
   * CSS INJECTION
   * ===============================
   */
  function generateCSS() {
    const { images } = config;
    const bgImage = images.background || '';
    const botAvatar = images.botAvatar || '';
    const userAvatar = images.userAvatar || '';
    const headerIcon = images.headerIcon || '';

    return `
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  
  .rx-chat-window {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(90vw, 420px);
    max-width: 420px;
    height: min(85vh, 580px);
    max-height: 580px;
    background: rgba(30, 40, 60, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: clamp(16px, 4vw, 25px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 255, 255, 0.05);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 1000000;
    color: #ffffff;
    touch-action: none;
    will-change: transform, left, top;
    transition: all 0.3s ease;
  }
  .rx-chat-window.show { display: flex; }
  .rx-chat-window.dragging { transition: none; opacity: 0.95; }

  .rx-chat-messages {
    flex: 1;
    padding: clamp(8px, 1.5vh, 12px) clamp(8px, 1.5vw, 12px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: clamp(6px, 1vh, 8px);
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    min-height: 0;
    position: relative;
    z-index: 1;
    ${bgImage ? `background-image: url('${bgImage}'); background-size: cover; background-position: center; background-repeat: no-repeat;` : ''}
  }
  .rx-chat-messages::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(30, 40, 60, 0.3);
    z-index: -1;
    pointer-events: none;
  }
  .rx-chat-messages::-webkit-scrollbar { width: 3px; }
  .rx-chat-messages::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); border-radius: 10px; }
  .rx-chat-messages::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }

  .rx-chat-header {
    padding: clamp(8px, 1.5vh, 12px) clamp(10px, 2vw, 15px);
    background: rgba(0, 0, 0, 0.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    gap: clamp(6px, 1.5vw, 10px);
    cursor: grab;
    min-height: clamp(38px, 5.5vh, 48px);
    flex-shrink: 0;
    z-index: 2;
    height: 1cm;
    position: relative;
  }
  .rx-chat-header:active { cursor: grabbing; }

  .rx-header-icon {
    width: clamp(22px, 3.5vw, 30px);
    height: clamp(22px, 3.5vw, 30px);
    border-radius: 50%;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: clamp(13px, 2vw, 18px);
    flex-shrink: 0;
    overflow: hidden;
    ${headerIcon ? `background-image: url('${headerIcon}'); background-size: cover; background-position: center;` : ''}
  }

  .rx-header-title {
    flex: 1;
    font-weight: 700;
    text-align: center;
    font-size: clamp(11px, 1.6vw, 14px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #ffffff;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }

  .rx-mode-indicator {
    font-size: clamp(8px, 1.2vw, 10px);
    padding: 2px clamp(4px, 1vw, 8px);
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    color: #ffaa64;
    margin-left: 4px;
    display: inline-block;
    font-weight: 600;
  }

  .rx-header-close {
    width: clamp(22px, 3.5vw, 30px);
    height: clamp(22px, 3.5vw, 30px);
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: clamp(24px, 3.5vw, 32px);
    font-weight: 300;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    flex-shrink: 0;
    transition: all 0.3s ease;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.2), 0 0 40px rgba(255, 255, 255, 0.1);
  }
  .rx-header-close:hover {
    background: transparent;
    border: none;
    color: #ffffff;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  .rx-header-close:active {
    transform: scale(0.9);
    background: transparent;
    border: none;
  }

  .rx-message-wrapper {
    display: flex;
    align-items: flex-end;
    gap: clamp(4px, 0.8vw, 6px);
    max-width: 88%;
    animation: messageIn 0.3s ease;
    position: relative;
    z-index: 2;
  }
  @keyframes messageIn {
    from { opacity: 0; transform: translateY(10px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .rx-message-wrapper.bot { align-self: flex-start; }
  .rx-message-wrapper.user { align-self: flex-end; flex-direction: row-reverse; }

  .rx-avatar {
    width: clamp(24px, 4vw, 32px);
    height: clamp(24px, 4vw, 32px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: clamp(12px, 2vw, 16px);
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
    overflow: hidden;
  }
  .rx-avatar.bot {
    ${botAvatar ? `background-image: url('${botAvatar}'); background-size: cover; background-position: center;` : ''}
    ${!botAvatar ? 'background: rgba(0,0,0,0.3);' : ''}
  }
  .rx-avatar.user {
    ${userAvatar ? `background-image: url('${userAvatar}'); background-size: cover; background-position: center;` : ''}
    ${!userAvatar ? 'background: rgba(0,0,0,0.3);' : ''}
  }

  .rx-message {
    padding: clamp(8px, 1.5vh, 12px) clamp(12px, 2vw, 16px);
    border-radius: clamp(12px, 2vw, 16px);
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #ffffff;
    font-size: clamp(14px, 1.8vw, 15px);
    font-weight: 500;
    line-height: 1.4;
    white-space: pre-line;
    word-break: break-word;
    max-width: 100%;
    letter-spacing: 0.3px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
  .rx-message-wrapper.bot .rx-message {
    border-bottom-left-radius: clamp(4px, 0.8vw, 6px);
    background: rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.1);
  }
  .rx-message-wrapper.user .rx-message {
    border-bottom-right-radius: clamp(4px, 0.8vw, 6px);
    background: rgba(0, 0, 0, 0.45);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .rx-link-button {
    display: inline-block;
    margin-top: clamp(4px, 0.8vh, 6px);
    padding: clamp(5px, 0.8vh, 7px) clamp(12px, 2vw, 16px);
    background: rgba(100, 255, 218, 0.15);
    border: 1px solid rgba(100, 255, 218, 0.3);
    border-radius: 20px;
    color: #64ffda;
    text-decoration: none;
    font-size: clamp(12px, 1.4vw, 13px);
    transition: all 0.3s ease;
    cursor: pointer;
    text-align: center;
    font-weight: 600;
  }
  .rx-link-button:hover {
    background: rgba(100, 255, 218, 0.25);
    color: #64ffda;
    transform: scale(1.02);
    border-color: rgba(100, 255, 218, 0.5);
  }
  .rx-link-button:active { transform: scale(0.95); }

  .rx-input-area {
    display: flex;
    padding: clamp(6px, 1.2vh, 10px) clamp(8px, 1.5vw, 12px);
    gap: clamp(6px, 1vw, 8px);
    background: rgba(0, 0, 0, 0.4);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
    align-items: center;
    min-height: clamp(44px, 6vh, 56px);
    z-index: 2;
    position: relative;
  }
  .rx-input-area input {
    flex: 1;
    padding: clamp(8px, 1.2vh, 12px) clamp(12px, 2vw, 16px);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    outline: none;
    color: #ffffff;
    font-size: clamp(14px, 1.8vw, 15px);
    min-height: clamp(34px, 4.5vh, 42px);
    max-height: clamp(42px, 5vh, 48px);
    height: clamp(34px, 4.5vh, 42px);
    transition: all 0.3s ease;
    line-height: 1;
    box-sizing: border-box;
    font-weight: 500;
  }
  .rx-input-area input:focus {
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.03);
  }
  .rx-input-area input::placeholder {
    color: rgba(255, 255, 255, 0.25);
    font-size: clamp(13px, 1.6vw, 14px);
    letter-spacing: 0.3px;
    font-weight: 400;
  }

  .rx-input-area button {
    width: auto;
    height: auto;
    min-width: unset;
    min-height: unset;
    background: transparent;
    border: none;
    border-radius: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .rx-input-area button:hover { background: transparent; border: none; transform: none; }
  .rx-input-area button:active { transform: scale(0.9); background: transparent; border: none; }

  .rx-send-icon {
    width: clamp(24px, 4vw, 32px);
    height: clamp(24px, 4vw, 32px);
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.8;
    transition: none;
    display: block;
  }
  .rx-input-area button:hover .rx-send-icon { opacity: 0.8; transform: none; filter: brightness(0) invert(1); }
  .rx-input-area button:active .rx-send-icon { transform: scale(0.9); opacity: 0.8; }

  .rx-copyright {
    padding: clamp(3px, 0.8vh, 6px);
    text-align: center;
    font-size: clamp(9px, 1vw, 11px);
    background: rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
    z-index: 2;
    font-weight: 300;
    letter-spacing: 0.3px;
    color: rgba(255, 255, 255, 0.4);
    position: relative;
  }
  .rx-copyright a { color: #64ffda; text-decoration: none; }
  .rx-copyright a:hover { color: #a8ffeb; text-decoration: underline; }

  .rx-typing-indicator {
    display: flex;
    gap: 4px;
    padding: clamp(6px, 1vh, 10px) clamp(10px, 1.8vw, 14px);
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    align-items: center;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
  .rx-typing-dot {
    width: clamp(5px, 0.8vw, 7px);
    height: clamp(5px, 0.8vw, 7px);
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: typing 1.4s infinite;
  }
  .rx-typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .rx-typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
    30% { transform: translateY(-5px); opacity: 0.8; }
  }

  @media screen and (max-width: 480px) {
    .rx-chat-window { width: 95vw; max-width: 95vw; height: 90vh; max-height: 90vh; border-radius: 14px; }
    .rx-chat-messages { padding: 8px 10px; gap: 6px; }
    .rx-message-wrapper { max-width: 92%; }
    .rx-message { font-size: 14px; padding: 8px 12px; }
    .rx-header-title { font-size: 12px; }
    .rx-input-area { padding: 6px 8px; gap: 6px; min-height: 40px; }
    .rx-input-area input { font-size: 14px; padding: 8px 12px; min-height: 32px; height: 32px; }
    .rx-send-icon { width: 28px; height: 28px; }
    .rx-avatar { width: 22px; height: 22px; font-size: 11px; }
    .rx-header-close { font-size: 28px; }
  }

  @media screen and (max-width: 360px) {
    .rx-chat-window { width: 98vw; max-width: 98vw; height: 92vh; max-height: 92vh; border-radius: 10px; }
    .rx-message { font-size: 13px; padding: 6px 10px; }
    .rx-avatar { width: 20px; height: 20px; font-size: 10px; }
    .rx-header-icon { width: 20px; height: 20px; font-size: 11px; }
    .rx-header-close { font-size: 24px; width: 24px; height: 24px; }
    .rx-input-area { padding: 4px 6px; gap: 4px; min-height: 34px; }
    .rx-input-area input { font-size: 13px; padding: 6px 10px; min-height: 28px; height: 28px; }
    .rx-send-icon { width: 24px; height: 24px; }
    .rx-copyright { font-size: 8px; }
  }

  @media screen and (min-width: 481px) and (max-width: 768px) {
    .rx-chat-window { width: 78vw; max-width: 400px; height: 78vh; max-height: 520px; }
    .rx-message { font-size: 15px; }
    .rx-input-area input { font-size: 15px; min-height: 36px; height: 36px; }
    .rx-send-icon { width: 30px; height: 30px; }
  }

  @media screen and (min-width: 769px) {
    .rx-chat-window { width: 400px; max-width: 400px; height: 560px; max-height: 560px; }
    .rx-input-area input { min-height: 38px; height: 38px; }
    .rx-send-icon { width: 32px; height: 32px; }
  }

  @media screen and (max-height: 500px) and (orientation: landscape) {
    .rx-chat-window { width: 65vw; max-width: 480px; height: 88vh; max-height: 380px; border-radius: 12px; }
    .rx-chat-header { min-height: 28px; padding: 4px 8px; }
    .rx-header-title { font-size: 11px; }
    .rx-chat-messages { padding: 4px 8px; gap: 4px; }
    .rx-message { font-size: 12px; padding: 4px 8px; }
    .rx-input-area { padding: 4px 6px; gap: 4px; min-height: 30px; }
    .rx-input-area input { font-size: 12px; padding: 4px 8px; min-height: 24px; height: 24px; }
    .rx-send-icon { width: 20px; height: 20px; }
    .rx-avatar { width: 18px; height: 18px; font-size: 9px; }
    .rx-copyright { font-size: 7px; padding: 2px; }
    .rx-header-close { font-size: 20px; width: 22px; height: 22px; }
  }
  `;
  }

  function injectCSS() {
    if (!document.getElementById('rx-chat-styles')) {
      const style = document.createElement('style');
      style.id = 'rx-chat-styles';
      style.textContent = generateCSS();
      document.head.appendChild(style);
    }
  }

  /**
   * ===============================
   * HTML INJECTION
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
            ROSAN KC
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
   * MESSAGE FUNCTIONS
   * (Duplicate fix + state store + debounce)
   * ===============================
   */
  let typingTimeout = null;

  function addMessage(text, sender = 'bot', isLink = false, savedAvatarEmoji = '') {
    const container = document.getElementById('rx-chat-messages');
    if (!container) return;

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
    const links = [];

    if (sender === 'bot' && safeText.includes('[LINK:')) {
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

    if (isRestoringFromHistory) return;

    pushMessageToStore({
      sender,
      text: safeText,
      avatarEmoji: savedAvatarEmoji || '',
      hasLink: links.length > 0,
      linkUrl: links[0]?.url || null,
      linkText: links[0]?.buttonText || null
    });
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
      finalText = finalText.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+\n/g, '\n').trim();
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
      link.addEventListener('click', (e) => e.stopPropagation());
      messageContainer.appendChild(link);
    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(messageContainer);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;

    if (isRestoringFromHistory) return;

    pushMessageToStore({
      sender,
      text: finalText,
      avatarEmoji: '',
      hasLink: !!url,
      linkUrl: url || null,
      linkText: linkText || null
    });
  }

  function showTypingIndicator() {
    const container = document.getElementById('rx-chat-messages');
    if (!container) return;

    removeTypingIndicator();

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

    const welcomeAlreadyInStore = messageStore.some(
      m => m.sender === 'bot' && m.text === config.welcomeMessage
    );

    const existingWelcome = Array.from(container.querySelectorAll('.rx-message-wrapper.bot'))
      .some(w => {
        const msgDiv = w.querySelector('.rx-message');
        return msgDiv && msgDiv.textContent.trim() === config.welcomeMessage.trim();
      });

    if (existingWelcome) return;

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

    if (!welcomeAlreadyInStore) {
      pushMessageToStore({
        sender: 'bot',
        text: welcome,
        avatarEmoji: '',
        hasLink: false,
        linkUrl: null,
        linkText: null
      });
    }
  }

  function loadMessagesFromHistory() {
    const messages = loadMessageHistory();
    if (!messages || messages.length === 0) return;

    isRestoringFromHistory = true;

    try {
      messages.forEach(msg => {
        if (msg.hasLink) {
          addMessageWithLink(msg.text, msg.sender, msg.linkUrl, msg.linkText);
        } else {
          addMessage(msg.text, msg.sender, false, msg.avatarEmoji);
        }
      });
    } finally {
      isRestoringFromHistory = false;
    }
  }

  function rebuildAIContextFromHistory() {
    clearAIConversationHistory();

    const messages = loadMessageHistory();
    if (!messages || messages.length === 0) return;

    const conversationMessages = messages.filter(msg =>
      msg.text &&
      !msg.text.includes('Welcome to ROSAN KC website') &&
      msg.text.trim().length > 0
    );

    conversationMessages.forEach(msg => {
      conversationHistory.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        text: msg.text
      });
    });

    while (conversationHistory.length > MAX_CONTEXT_MESSAGES) {
      conversationHistory.shift();
    }
  }

  /**
   * ===============================
   * HELP / MODEL / COMMAND HELPERS
   * ===============================
   */
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
    let model = config.gemini.availableModels.find(
      m => m.id.toLowerCase().includes(modelId.toLowerCase()) ||
           m.name.toLowerCase().includes(modelId.toLowerCase())
    );
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
      cmd = commands.find(c => c.requiresParameter && input.toLowerCase().startsWith(c.command.toLowerCase() + ' '));
    }
    return cmd;
  }

  function extractParameter(input, command) {
    const parts = input.split(' ');
    return parts.length >= 2 ? parts.slice(1).join(' ').trim() : null;
  }

  /**
   * ===============================
   * MAIN COMMAND PROCESSOR
   * ===============================
   */
  async function processCommand(input) {
    const lowerInput = input.toLowerCase().trim();

    const cmd = findCommand(input);

    // ----- LINK COMMANDS -----
    if (cmd && cmd.isLink && cmd.action === undefined) {
      awaitingApiKey = false;
      const response = typeof cmd.response === 'function' ? cmd.response() : cmd.response;
      addMessageWithLink(response, 'bot', cmd.url, cmd.linkText);
      return;
    }

    // ----- HELP -----
    if (cmd && cmd.action === 'showHelp') {
      awaitingApiKey = false;
      showHelp();
      return;
    }

    // ----- COMMAND MODE SWITCH -----
    if (cmd && cmd.action === 'commandMode') {
      awaitingApiKey = false;
      chatMode = 'command';
      saveChatMode('command');
      updateModeIndicator();
      addMessage(cmd.response, 'bot');
      return;
    }

    // ----- SET KEY (बिना key) -----
    if (lowerInput === 'set key') {
      awaitingApiKey = true;
      addMessage(
        'कृपया API key हाल्नुहोस्:\n\n`set key YOUR_API_KEY`\n\n' +
        'Key कहाँबाट लिने? Type: `get api key`',
        'bot'
      );
      return;
    }

    // ----- SET KEY (key सहित) -----
    if (lowerInput.startsWith('set key ')) {
      const key = input.substring(8).trim();
      if (saveApiKey(key)) {
        addMessage('API key saved! Testing models...', 'bot');
        const ok = await connectToFreeTier();
        awaitingApiKey = false;
        if (!ok) {
          chatMode = 'command';
          saveChatMode('command');
          updateModeIndicator();
        }
      } else {
        addMessage('Invalid API key. Please enter a valid key.\n\nType: `set key YOUR_API_KEY`', 'bot');
      }
      return;
    }

    // ----- CHECK KEY -----
    if (cmd && cmd.action === 'checkApiKey') {
      if (config.gemini.apiKey) {
        const modelInfo = getCurrentModelInfo();
        addMessage(`API key saved\nModel: ${modelInfo.name}\nMode: ${chatMode.toUpperCase()}`, 'bot');
      } else {
        addMessage('No API key saved. Type "ai mode" to set up.', 'bot');
      }
      return;
    }

    // ----- CLEAR KEY -----
    if (cmd && cmd.action === 'clearApiKey') {
      awaitingApiKey = false;
      clearApiKey();
      return;
    }

    // ----- MODEL COMMANDS -----
    if (cmd && cmd.action === 'listModels') { listModels(); return; }
    if (cmd && cmd.action === 'switchModel') { switchModel(extractParameter(input, cmd.command)); return; }
    if (cmd && cmd.action === 'showCurrentModel') { showCurrentModel(); return; }
    if (cmd && cmd.action === 'testAllModels') { await testAllAvailableModels(); return; }

    // ----- AI MODE -----
    if (cmd && cmd.action === 'aiMode') {
      if (config.gemini.apiKey) {
        addMessage('API key found! Connecting to Gemini...', 'bot');
        await connectToFreeTier();
      } else {
        awaitingApiKey = true;
        addMessage(
          '🤖 **AI Mode चालु गर्न API Key चाहिन्छ**\n\n' +
          '**Step 1:** `get api key` type गर्नुहोस्\n' +
          '   → Google AI Studio खुल्छ\n\n' +
          '**Step 2:** "Create API Key" click गर्नुहोस्\n' +
          '   → Free key बन्छ (credit card चाहिँदैन)\n\n' +
          '**Step 3:** Key copy गरेर:\n' +
          '   `set key YOUR_KEY_HERE` type गर्नुहोस्\n\n' +
          '⏱️ ~2 minutes\n' +
          '🔒 Key तपाईंको browser मा मात्र save हुन्छ\n' +
          '💰 1,500 free requests/day',
          'bot'
        );
      }
      return;
    }

    // ----- CLOSE WINDOW -----
    if (cmd && cmd.action === 'close') {
      addMessage(cmd.response, 'bot');
      setTimeout(() => {
        document.getElementById('rx-chat-window').classList.remove('show');
        saveWindowState(false);
        clearMessageHistory();
      }, 1500);
      return;
    }

    // ----- CLEAR CHAT -----
    if (cmd && cmd.action === 'clear') {
      clearMessageHistory();
      addMessage(cmd.response + '\nStart new message...', 'bot');
      return;
    }

    // ----- ANY OTHER KNOWN COMMAND -----
    if (cmd) {
      const response = typeof cmd.response === 'function' ? cmd.response() : cmd.response;
      addMessage(response, 'bot');
      return;
    }

    // ===== AWAITING API KEY =====
    if (awaitingApiKey) {
      addMessage(
        'API key format यसरी हाल्नुहोस्:\n\n`set key YOUR_API_KEY`\n\n' +
        'Key कहाँबाट लिने? Type: `get api key`',
        'bot'
      );
      return;
    }

    // ===== FREE TEXT → AI =====
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
      awaitingApiKey = true;
      addMessage(
        'Set API key first:\n\n`set key YOUR_API_KEY`\n\n' +
        'Key कहाँबाट लिने? Type: `get api key`',
        'bot'
      );
    } else {
      addMessage(`Unknown: "${input}"\n\nType "help" for commands.`, 'bot');
    }
  }

  /**
   * ===============================
   * USER INPUT HANDLER
   * ===============================
   */
  async function safeAsync(fn, ...args) {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error in ${fn.name}:`, error);
      removeTypingIndicator();
      addMessage('❌ Something went wrong. Please try again.', 'bot');
      return null;
    }
  }

  async function handleUserInput() {
    const input = document.getElementById('rx-user-input');
    if (!input) return;

    const text = input.value.trim();

    if (!text) return;
    if (text.length > 2000) {
      addMessage('⚠️ Message too long (max 2000 characters).', 'bot');
      return;
    }

    addMessage(text, 'user');
    input.value = '';
    await safeAsync(processCommand, text);
  }

  /**
   * ===============================
   * DRAGGABLE
   * ===============================
   */
  function makeDraggable(element, handle) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let startClientX = 0, startClientY = 0;
    let currentX = 0, currentY = 0;
    let isTouchDevice = ('ontouchstart' in window);
    let isFirstDrag = true;
    let dragStarted = false;

    const DRAG_THRESHOLD = 5;
    const LONG_PRESS_DELAY = 300;
    let pressTimer = null;

    function getClientCoordinates(e) {
      if (e.type && e.type.startsWith('touch')) {
        const touch = e.touches[0] || e.changedTouches[0];
        return { clientX: touch.clientX, clientY: touch.clientY };
      }
      return { clientX: e.clientX, clientY: e.clientY };
    }

    function getElementPosition() {
      const rect = element.getBoundingClientRect();
      if (isFirstDrag && element.style.transform === 'translate(-50%, -50%)') {
        const centerX = window.innerWidth / 2 - rect.width / 2;
        const centerY = window.innerHeight / 2 - rect.height / 2;
        element.style.left = centerX + 'px';
        element.style.top = centerY + 'px';
        element.style.transform = 'none';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
        isFirstDrag = false;
      }
      const newRect = element.getBoundingClientRect();
      return { left: newRect.left, top: newRect.top, width: newRect.width, height: newRect.height };
    }

    function shouldIgnoreDrag(e) {
      const ignoreSelectors = [
        '#rx-close-btn', '.rx-input-area', '.rx-link-button', '.rx-send-icon',
        '#rx-send-btn', 'input', 'button', 'a', '.rx-message', '.rx-avatar',
        '.rx-chat-messages', '.rx-message-wrapper'
      ];
      for (const selector of ignoreSelectors) {
        if (e.target.closest(selector)) return true;
      }
      return false;
    }

    function isScrollingElement(target) {
      if (target.closest('.rx-chat-messages')) return true;
      if (target.closest('.rx-message-wrapper')) return true;
      return false;
    }

    function onDragMove(e) {
      e.preventDefault();

      const coords = getClientCoordinates(e);
      const deltaX = coords.clientX - startClientX;
      const deltaY = coords.clientY - startClientY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (!dragStarted && distance > DRAG_THRESHOLD) {
        dragStarted = true;
        isDragging = true;
        element.classList.add('dragging');
        element.style.cursor = 'grabbing';
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
      }

      if (!dragStarted) return;

      let newLeft = coords.clientX - startX;
      let newTop = coords.clientY - startY;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const elemWidth = element.offsetWidth;
      const elemHeight = element.offsetHeight;

      if (newLeft < 0) newLeft = 0;
      if (newLeft + elemWidth > windowWidth) newLeft = windowWidth - elemWidth;
      if (newTop < 0) newTop = 0;
      if (newTop + elemHeight > windowHeight) newTop = windowHeight - elemHeight;

      element.style.left = newLeft + 'px';
      element.style.top = newTop + 'px';
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.style.transform = 'none';
      currentX = newLeft;
      currentY = newTop;
    }

    function startDrag(e) {
      if (shouldIgnoreDrag(e)) return;
      if (isScrollingElement(e.target)) return;

      e.preventDefault();

      const coords = getClientCoordinates(e);
      startClientX = coords.clientX;
      startClientY = coords.clientY;

      const pos = getElementPosition();
      startX = coords.clientX - pos.left;
      startY = coords.clientY - pos.top;

      dragStarted = false;
      isDragging = false;

      if (!isTouchDevice) {
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', stopDrag);
      } else {
        if (pressTimer) clearTimeout(pressTimer);
        pressTimer = setTimeout(() => {
          dragStarted = true;
          isDragging = true;
          element.classList.add('dragging');
          element.style.cursor = 'grabbing';
          document.body.style.cursor = 'grabbing';
          document.body.style.userSelect = 'none';
          pressTimer = null;
        }, LONG_PRESS_DELAY);
      }
    }

    function stopDrag() {
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', stopDrag);

      element.style.cursor = '';
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }

      if (!dragStarted) {
        element.classList.remove('dragging');
        isDragging = false;
        return;
      }

      if (isDragging) {
        element.classList.remove('dragging');
        if (currentX !== undefined && currentY !== undefined) {
          saveWindowPosition(currentX, currentY);
        }
      }

      isDragging = false;
      dragStarted = false;
    }

    function onTouchMove(e) {
      if (e.target.closest('.rx-chat-messages')) return;
      e.preventDefault();

      const coords = getClientCoordinates(e);
      const deltaX = coords.clientX - startClientX;
      const deltaY = coords.clientY - startClientY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (!dragStarted && distance > DRAG_THRESHOLD) {
        dragStarted = true;
        isDragging = true;
        element.classList.add('dragging');
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      }

      if (!dragStarted) return;

      let newLeft = coords.clientX - startX;
      let newTop = coords.clientY - startY;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const elemWidth = element.offsetWidth;
      const elemHeight = element.offsetHeight;

      if (newLeft < 0) newLeft = 0;
      if (newLeft + elemWidth > windowWidth) newLeft = windowWidth - elemWidth;
      if (newTop < 0) newTop = 0;
      if (newTop + elemHeight > windowHeight) newTop = windowHeight - elemHeight;

      element.style.left = newLeft + 'px';
      element.style.top = newTop + 'px';
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.style.transform = 'none';
      currentX = newLeft;
      currentY = newTop;
    }

    function onTouchEnd() {
      element.style.cursor = '';
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }

      if (!dragStarted) {
        element.classList.remove('dragging');
        isDragging = false;
        return;
      }

      if (isDragging) {
        element.classList.remove('dragging');
        if (currentX !== undefined && currentY !== undefined) {
          saveWindowPosition(currentX, currentY);
        }
      }

      isDragging = false;
      dragStarted = false;
    }

    element.addEventListener('mousedown', startDrag);

    if (isTouchDevice) {
      element.addEventListener('touchstart', startDrag, { passive: false });
      element.addEventListener('touchmove', onTouchMove, { passive: false });
      element.addEventListener('touchend', onTouchEnd);
      element.addEventListener('touchcancel', onTouchEnd);
    }
  }

  /**
   * ===============================
   * TRIGGER BUTTON
   * ===============================
   */
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
      const images = document.querySelectorAll('img[src*="BOT-PROFILE"]');
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

  /**
   * ===============================
   * SETUP INTERACTIONS
   * ===============================
   */
  function setupInteractions() {
    const chatWindow = document.getElementById('rx-chat-window');
    const closeBtn = document.getElementById('rx-close-btn');
    const sendBtn = document.getElementById('rx-send-btn');
    const input = document.getElementById('rx-user-input');
    const header = document.getElementById('rx-chat-header');

    if (!chatWindow || !closeBtn || !sendBtn || !input || !header) {
      console.error('Required DOM elements missing');
      return;
    }

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

    sendBtn.addEventListener('click', () => safeAsync(handleUserInput));
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') safeAsync(handleUserInput);
    });

    loadApiKey();
    loadModel();
    chatMode = loadChatMode();
    updateModeIndicator();

    if (loadWindowState()) {
      chatWindow.classList.add('show');
      loadMessagesFromHistory();
      rebuildAIContextFromHistory();
    }

    setupTrigger();
  }

  /**
   * ===============================
   * GLOBAL ERROR HANDLERS
   * ===============================
   */
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (typeof addMessage === 'function') {
      addMessage('⚠️ Unexpected error. Please refresh if issue continues.', 'bot');
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });

  /**
   * ===============================
   * INIT
   * ===============================
   */
  function init() {
    if (window.__RX_INIT__) return;
    window.__RX_INIT__ = true;

    try {
      injectCSS();
      injectHTML();
      setTimeout(setupInteractions, 100);
    } catch (error) {
      console.error('Init failed:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();