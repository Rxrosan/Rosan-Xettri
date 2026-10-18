// ============================================================
// 08-command.js - Command Processing (REWRITTEN)
// ============================================================

let chatMode = 'command';
let awaitingApiKey = false;

// ============================================================
// HELP
// ============================================================
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

// ============================================================
// MODEL HELPERS
// ============================================================
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

// ============================================================
// COMMAND LOOKUP
// ============================================================
function findCommand(input) {
  let cmd = commands.find(c => input.toLowerCase() === c.command.toLowerCase());
  if (!cmd) {
    cmd = commands.find(
      c => c.requiresParameter && input.toLowerCase().startsWith(c.command.toLowerCase() + ' ')
    );
  }
  return cmd;
}

function extractParameter(input, command) {
  const parts = input.split(' ');
  return parts.length >= 2 ? parts.slice(1).join(' ').trim() : null;
}

// ============================================================
// MAIN COMMAND PROCESSOR
// ============================================================
async function processCommand(input) {
  const lowerInput = input.toLowerCase().trim();

  // ============================================================
  // STEP 1: ALWAYS CHECK COMMANDS FIRST
  // (यसले AI mode, CMD mode, awaitingApiKey — सबैमा काम गर्छ)
  // ============================================================
  const cmd = findCommand(input);

  // ----- LINK COMMANDS (get api key, about, contact, service, website, terms, privacy) -----
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
      ' कृपया API key हाल्नुहोस्:\n\n`set key YOUR_API_KEY`\n\n' +
      ' Key कहाँबाट लिने? Type: `get api key`',
      'bot'
    );
    return;
  }

  // ----- SET KEY (key सहित) -----
  if (lowerInput.startsWith('set key ')) {
    const key = input.substring(8).trim();
    if (saveApiKey(key)) {
      addMessage(' API key saved! Testing models...', 'bot');
      const ok = await connectToFreeTier();
      awaitingApiKey = false;
      if (!ok) {
        // Key save भयो तर model fail → AI mode OFF राख्ने
        chatMode = 'command';
        saveChatMode('command');
        updateModeIndicator();
      }
    } else {
      addMessage(' Invalid API key. Please enter a valid key.\n\nType: `set key YOUR_API_KEY`', 'bot');
    }
    return;
  }

  // ----- CHECK KEY -----
  if (cmd && cmd.action === 'checkApiKey') {
    if (config.gemini.apiKey) {
      const modelInfo = getCurrentModelInfo();
      addMessage(` API key saved\nModel: ${modelInfo.name}\nMode: ${chatMode.toUpperCase()}`, 'bot');
    } else {
      addMessage(' No API key saved. Type "ai mode" to set up.', 'bot');
    }
    return;
  }

  // ----- CLEAR KEY / REMOVE KEY -----
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
        ' AI Mode for activating  **first API Key** needed.\n\n' +
        ' Step 1: typing `get api key` and get you gemini api key\n' +
        ' Step 2: type `set key YOUR_API_KEY` and upload your api key\n\n' +
        'After uploaded your Key AI mode auto-connect ',
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
    addMessage(cmd.response + '\nStart new massage...', 'bot');
    return;
  }

  // ----- ANY OTHER KNOWN COMMAND (hello, date, time, आदि) -----
  if (cmd) {
    const response = typeof cmd.response === 'function' ? cmd.response() : cmd.response;
    addMessage(response, 'bot');
    return;
  }

  // ============================================================
  // STEP 2: AWAITING API KEY STATE (केवल unknown input मा)
  // ============================================================
  if (awaitingApiKey) {
    addMessage(
      ' API key format यसरी हाल्नुहोस्:\n\n`set key YOUR_API_KEY`\n\n' +
      ' Key कहाँबाट लिने? Type: `get api key`',
      'bot'
    );
    return;
  }

  // ============================================================
  // STEP 3: FREE TEXT → AI (key छ भने) वा key माग्ने
  // ============================================================
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
      ' Set API key first:\n\n`set key YOUR_API_KEY`\n\n' +
      ' Key कहाँबाट लिने? Type: `get api key`',
      'bot'
    );
  } else {
    addMessage(`Unknown: "${input}"\n\nType "help" for commands.`, 'bot');
  }
}