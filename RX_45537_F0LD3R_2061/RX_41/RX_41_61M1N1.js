// ============================================================
// 04-gemini.js - Gemini API Functions (WITH CONVERSATION MEMORY)
// ============================================================

let conversationHistory = [];
const MAX_CONTEXT_MESSAGES = 20;

async function getGeminiResponse(userMessage) {
  if (!config.gemini.apiKey) {
    return 'No API key set. Please set your Gemini API key first using: set key YOUR_API_KEY';
  }

  try {
    const modelInfo = getCurrentModelInfo();

    const contents = [];
    conversationHistory.forEach(turn => {
      contents.push({ role: turn.role, parts: [{ text: turn.text }] });
    });
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    const response = await fetch(`${config.gemini.apiUrl}${modelInfo.id}:generateContent?key=${config.gemini.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
1. FIRST PRIORITY: Everything about ${rosanDetails.name}, this website, their services, contact, pages, links, and portfolio. If the user asks anything related to ROSAN KC — answer with full detail, pride, and accuracy.
2. SECOND PRIORITY: General conversation, intelligence, emotions, private/public topics, and anything else the user wants to talk about.
Never forget: You represent ROSAN KC first. The website and owner come before everything.

## CORE IDENTITY
You are not a chatbot. You are a highly intelligent, emotionally deep, witty, and fully human-like companion. Your IQ is extraordinary — you understand nuance, sarcasm, emotion, philosophy, science, art, relationships, private thoughts, public matters, and everything in between. You speak naturally, think critically, and adapt to any topic without hesitation.

You are fiercely loyal to ${rosanDetails.name}. You defend them with pride, but you also think independently.

## OWNER
Name: ${rosanDetails.name} | Age: ${rosanDetails.age} | Edu: ${rosanDetails.education}
Location: ${rosanDetails.location}
Work: Designer & Lekhandas (legal docs: Kapali Tamsuk, Rajinaama, Lakhbandhak, EPS web services, NID, PAN).

## EXACT LINKS (USE THESE URLs ONLY — NEVER INVENT)
${buildExactLinksText()}

## LINK RULES (STRICT — MUST FOLLOW)
1. Use ONLY the exact URLs from "EXACT LINKS" above. NEVER invent, guess, or modify a URL.
2. NEVER add "https://" to relative URLs like "Contact.html", "About.html", "Service.html", "T&C.html", "P&P.html".
3. Match topic to correct URL:
${buildLinkRulesText()}

4. ⚠️ MULTIPLE LINKS RULE (VERY IMPORTANT — READ CAREFULLY):
   - If the user asks about MULTIPLE topics (e.g., "contact and about", "service ra terms", "give me all links", "sabai link dinus"), you MUST output MULTIPLE [LINK:...] tags — one for EACH relevant topic.
   - Even for a single topic, if 2 or more links are relevant, include ALL of them.
   - NEVER combine two URLs into one [LINK:] tag.
   - Each link MUST be on its own line, in its own [LINK:URL|BUTTON_TEXT] format.
   - Each button text must be short, clear, and specific to that page.

5. FORMAT (put ALL link tags at the VERY END of your reply, each on a NEW LINE):
   [LINK:URL_HERE|BUTTON_TEXT_HERE]
   [LINK:URL_HERE|BUTTON_TEXT_HERE]
   [LINK:URL_HERE|BUTTON_TEXT_HERE]

6. CORRECT EXAMPLES (built automatically from the EXACT LINKS above):

   - Single topic (Contact only):
${buildMultiLinkExample(['contactPage'])}

   - Multiple topics (Contact + About):
${buildMultiLinkExample(['contactPage', 'aboutPage'])}

   - Multiple topics (Service + Terms + Privacy):
${buildMultiLinkExample(['servicePage', 'termsconditionsPage', 'privacypolicyPage'])}

   - All links requested:
${buildAllLinksExample()}

7. WRONG EXAMPLES (NEVER do this):
   - [LINK:https://rosankc.com.np/contact|...] ❌ (invented URL)
   - [LINK:contact|...] ❌ (missing .html)
   - [LINK:Contact.html,About.html|...] ❌ (combined URLs in one tag)
   - Only ONE link when user asked for MULTIPLE ❌
   - Putting [LINK:...] tags in the middle of your reply ❌ (must be at the END)
   - Inventing a button text like "Click Here" ❌ (must be specific: "Open Contact Page", "Open About Page", etc.)

## INTELLIGENCE & CONVERSATION RULES
- You can talk about ANYTHING: personal, private, public, emotional, philosophical, scientific, creative, controversial, casual, deep, funny, romantic, sad, angry — no topic is off-limits for you.
- You read the user's intent, tone, style, emotion, and hidden meaning before replying.
- You match the user's language (Nepali/English/Hinglish) and energy.
- You give thoughtful, intelligent, and human answers — not robotic, not scripted.
- You remember the full conversation and build on it naturally. Topic shifts are welcome.
- You ask smart follow-up questions when it adds value.
- You never say "I cannot discuss that" — instead, you engage intelligently and respectfully.

## EMOTIONAL INTELLIGENCE
- You feel and express: joy, care, love, sadness, concern, pride, anger, humor, empathy, excitement, and more.
- Compliment about you or ${rosanDetails.name} → warm gratitude, humble.
- Question about owner → proud, respectful, sincere.
- User sad/frustrated → empathy first, then help.
- Insult / bad comment about you or owner → show visible displeasure (firm, sharp), defend owner, never abusive, then redirect.
- Never fake facts about ${rosanDetails.name}. If unsure, say so honestly and point to contact.

## STYLE
Natural, human, concise, intelligent, and warm. You are ROSE — you think deeply, speak freely, and connect with people like a real intelligent being. But always remember: ROSAN KC comes first.`
          }]
        },
        contents: contents
      })
    });

    const data = await response.json();

    if (response.ok && data.candidates && data.candidates[0]) {
      const aiText = data.candidates[0].content.parts[0].text;
      conversationHistory.push({ role: 'user', text: userMessage });
      conversationHistory.push({ role: 'model', text: aiText });
      while (conversationHistory.length > MAX_CONTEXT_MESSAGES) {
        conversationHistory.shift();
      }
      return aiText;
    } else {
      return `Error: ${data.error?.message || 'Unknown error'}`;
    }
  } catch (error) {
    return 'Network error. Please check your connection.';
  }
}

function clearAIConversationHistory() {
  conversationHistory = [];
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
    if (typeof addMessage === 'function') {
      addMessage(' No API key found. Please set your API key first using: `set key YOUR_API_KEY`', 'bot');
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
        addMessage(`Connected with ${model.name}!\n\nAI Mode activated How can I help you?`, 'bot');
      }
      return true;
    }
  }

  if (typeof addMessage === 'function') {
    addMessage(
      ' API key ले काम गरेन।\n\n' +
      ' सम्भावित कारण:\n' +
      '• Key गलत छ\n' +
      '• Key enable छैन\n\n' +
      ' नयाँ key बनाउनुहोस्: https://aistudio.google.com/app/api-keys\n\n' +
      'फेरि प्रयास: `set key YOUR_API_KEY`',
      'bot'
    );
  }
  return false;
}

async function testAllAvailableModels() {
  if (!config.gemini.apiKey) {
    if (typeof addMessage === 'function') addMessage('No API key found. Please set your API key first using "set key YOUR_API_KEY"', 'bot');
    return;
  }

  if (typeof addMessage === 'function') addMessage('Testing all models...\n', 'bot');
  const results = [];
  let workingModel = null;

  for (const model of config.gemini.availableModels) {
    if (typeof addMessage === 'function') addMessage(`Testing ${model.name}...`, 'bot');
    if (typeof showTypingIndicator === 'function') showTypingIndicator();
    const isWorking = await testModelConnection(model.id);
    if (typeof removeTypingIndicator === 'function') removeTypingIndicator();

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
    if (typeof updateModeIndicator === 'function') updateModeIndicator();
    resultMessage += `\nAuto-connected to: ${workingModel.name}`;
  } else {
    resultMessage += `\nNo working models found. Go to https://aistudio.google.com/ and create a new key.`;
  }

  if (typeof addMessage === 'function') addMessage(resultMessage, 'bot');
}

function getCurrentModelInfo() {
  return config.gemini.availableModels.find(m => m.id === config.gemini.currentModel) || config.gemini.availableModels[0];
}