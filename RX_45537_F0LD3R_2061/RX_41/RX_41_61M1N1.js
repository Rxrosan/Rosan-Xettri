// ============================================================
// 04-gemini.js - Gemini API Functions
// ============================================================

let conversationHistory = [];
const MAX_CONTEXT_MESSAGES = 20;

// ===== Retry helper =====
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      
      if (response.status >= 500 && i < maxRetries - 1) {
        await sleep(1000 * (i + 1));
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) await sleep(1000 * (i + 1));
    } finally {
      clearTimeout(timeoutId);  // सधैं clear — leak छैन
    }
  }
  throw lastError;
}

async function getGeminiResponse(userMessage) {
  if (!config.gemini.apiKey) {
    return 'No API key set.\n\nType: `set key YOUR_API_KEY`';
  }

  try {
    const modelInfo = getCurrentModelInfo();

    const contents = [];
    conversationHistory.forEach(turn => {
      contents.push({ role: turn.role, parts: [{ text: turn.text }] });
    });
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    // SECURE: API key header मा (URL मा होइन)
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

4. LINK OUTPUT RULE (SMART — 3 CASES):

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
   - [LINK:https://rosankc.com.np/contact|...] (invented URL)
   - [LINK:contact|...]  (missing .html)
   - [LINK:Contact.html,About.html|...]  (combined URLs)
   - Adding ALL links when user asked a simple question 
   - Adding links for casual chat/greetings/thanks 
   - Putting [LINK:...] in the middle of reply  (must be at END)
   - More than 2 suggestion links in CASE B 

## REPLY STYLE RULE (VERY IMPORTANT)

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

    //  Specific error handling
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      switch (response.status) {
        case 400: return ' Invalid request. Please try again.';
        case 401: return ' API key invalid.\n\nType: `clear key` then `set key YOUR_KEY`';
        case 403: return ' API key disabled or quota exceeded.';
        case 429: return ' Too many requests. Wait a minute and try again.';
        case 500:
        case 502:
        case 503: return ' Google server error. Please try again.';
        default: return ` Error: ${data.error?.message || 'Unknown error'}`;
      }
    }

    const data = await response.json();

    //  Validate response structure
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return ' Empty response from AI. Please try again.';
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
      return ' Request timeout. Please try again.';
    }
    if (error.message && error.message.includes('fetch')) {
      return ' Network error.\n\nCheck your internet connection.';
    }
    return ' Something went wrong. Please try again.';
  }
}

function clearAIConversationHistory() {
  conversationHistory = [];
}

//  testModelConnection() मा पनि retry logic
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
      2  //  Test गर्दा 2 retry मात्र
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
    if (typeof addMessage === 'function') {
      addMessage(' No API key found.\n\nType: `set key YOUR_API_KEY`', 'bot');
    }
    return false;
  }

  if (typeof addMessage === 'function') addMessage(' Testing models...', 'bot');

  for (const model of config.gemini.availableModels) {
    if (typeof addMessage === 'function') addMessage(`Testing ${model.name}...`, 'bot');
    if (typeof showTypingIndicator === 'function') showTypingIndicator();
    const isWorking = await testModelConnection(model.id);
    if (typeof removeTypingIndicator === 'function') removeTypingIndicator();

    if (isWorking) {
      saveModel(model.id);
      chatMode = 'ai';
      saveChatMode('ai');
      if (typeof updateModeIndicator === 'function') updateModeIndicator();
      if (typeof addMessage === 'function') {
        addMessage(` Connected with ${model.name}!\n\nAI Mode activated. How can I help you?`, 'bot');
      }
      return true;
    }
  }

  if (typeof addMessage === 'function') {
    addMessage(
      ' API key ले काम गरेन।\n\n' +
      'सम्भावित कारण:\n' +
      '• Key गलत छ\n' +
      '• Key enable छैन\n\n' +
      'नयाँ key: https://aistudio.google.com/app/api-keys\n\n' +
      'फेरि प्रयास: `set key YOUR_API_KEY`',
      'bot'
    );
  }
  return false;
}

async function testAllAvailableModels() {
  if (!config.gemini.apiKey) {
    if (typeof addMessage === 'function') addMessage(' No API key found.\n\nType: `set key YOUR_API_KEY`', 'bot');
    return;
  }

  if (typeof addMessage === 'function') addMessage(' Testing all models...\n', 'bot');
  const results = [];
  let workingModel = null;

  for (const model of config.gemini.availableModels) {
    if (typeof addMessage === 'function') addMessage(`Testing ${model.name}...`, 'bot');
    if (typeof showTypingIndicator === 'function') showTypingIndicator();
    const isWorking = await testModelConnection(model.id);
    if (typeof removeTypingIndicator === 'function') removeTypingIndicator();

    if (isWorking) {
      results.push(` ${model.name} - Connected`);
      if (!workingModel) workingModel = model;
    } else {
      results.push(` ${model.name} - Failed`);
    }
  }

  let resultMessage = 'TEST RESULTS:\n\n';
  results.forEach(r => resultMessage += r + '\n');

  if (workingModel) {
    saveModel(workingModel.id);
    chatMode = 'ai';
    saveChatMode('ai');
    if (typeof updateModeIndicator === 'function') updateModeIndicator();
    resultMessage += `\n Auto-connected: ${workingModel.name}`;
  } else {
    resultMessage += `\n No working models.\nCreate new key: https://aistudio.google.com/`;
  }

  if (typeof addMessage === 'function') addMessage(resultMessage, 'bot');
}

//  getCurrentModelInfo() — यही file मा रहन्छ (single source of truth)
function getCurrentModelInfo() {
  return config.gemini.availableModels.find(m => m.id === config.gemini.currentModel) || config.gemini.availableModels[0];
}