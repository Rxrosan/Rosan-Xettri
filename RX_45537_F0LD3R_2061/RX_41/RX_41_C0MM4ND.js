// ============================================================
// 08-command.js - Command Processing (WITH AI KEY GATE + FIX)
// ============================================================

let chatMode = 'command';
let awaitingApiKey = false;

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
  const lowerInput = input.toLowerCase().trim();
  
  // ============================================================
  //  API KEY AWAITING STATE (FIXED)
  // ============================================================
  if (awaitingApiKey) {
    //  पहिले command जाँच — user ले अरू command type गरे पनि काम गर्ने
    const cmd = findCommand(input);
    
    //  "get api key" link command → awaiting state भए पनि link देखाउने
    if (cmd && cmd.isLink && cmd.action === undefined) {
      awaitingApiKey = false;  // state reset — फेरि ai mode बाट सुरु गर्न
      const response = typeof cmd.response === 'function' ? cmd.response() : cmd.response;
      addMessageWithLink(response, 'bot', cmd.url, cmd.linkText);
      return;
    }
    
    //  "command mode" → awaiting state बन्द गर्ने
    if (cmd && cmd.action === 'commandMode') {
      awaitingApiKey = false;
      chatMode = 'command';
      saveChatMode('command');
      updateModeIndicator();
      addMessage(cmd.response, 'bot');
      return;
    }
    
    //  "help" → सहयोग देखाउने
    if (cmd && cmd.action === 'showHelp') {
      awaitingApiKey = false;
      showHelp();
      return;
    }
    
    //  set key प्रक्रिया
    if (lowerInput.startsWith('set key ')) {
      const key = input.substring(8).trim();
      if (saveApiKey(key)) {
        addMessage(' API key saved! Testing models...', 'bot');
        const ok = await connectToFreeTier();
        awaitingApiKey = false;
        if (!ok) {
          // Key save भयो तर model fail → AI mode ON नगर्ने
          chatMode = 'command';
          saveChatMode('command');
          updateModeIndicator();
        }
      } else {
        addMessage(' Invalid API key. Please enter a valid key.\n\nType: `set key YOUR_API_KEY`', 'bot');
      }
      return;
    }
    
    //  अन्य केही → सरल warning (get api key link सहित)
    addMessage(
      ' API key format यसरी हाल्नुहोस्:\n\n`set key YOUR_API_KEY`\n\n' +
      ' Key कहाँबाट लिने? Type: `get api key`',
      'bot'
    );
    return;
  }

  // ============================================================
  // 🎯 सामान्य COMMAND PROCESSING
  // ============================================================
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
      addMessage(cmd.response + '\nStart new massage...', 'bot');
    }
    else if (cmd.action === 'showHelp') {
      showHelp();
    }
    else if (cmd.action === 'aiMode') {
      //  API key छ भने मात्र AI mode attempt
      if (config.gemini.apiKey) {
        addMessage('API key found! Connecting to Gemini...', 'bot');
        await connectToFreeTier();
      } else {
        //  API key छैन → AI mode ON नगर्ने, पहिले key माग्ने
        awaitingApiKey = true;
        addMessage(
          ' AI Mode for activating  **first API Key** needed.\n\n' +
          ' Step 1: typing `get api key` and get you gemini api key\n' +
          ' Step 2: type `set key YOUR_API_KEY` and upload your api key\n\n' +
          'After uploaded your Key AI mode auto-connect ',
          'bot'
        );
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
      awaitingApiKey = true;
      addMessage(
        ' कृपया API key हाल्नुहोस्:\n\n`set key YOUR_API_KEY`\n\n' +
        ' Key कहाँबाट लिने? Type: `get api key`',
        'bot'
      );
    }
    else if (cmd.action === 'clearApiKey') {
      clearApiKey();
    }
    else if (cmd.action === 'checkApiKey') {
      if (config.gemini.apiKey) {
        const modelInfo = getCurrentModelInfo();
        addMessage(` API key saved\nModel: ${modelInfo.name}\nMode: ${chatMode.toUpperCase()}`, 'bot');
      } else {
        addMessage(' No API key saved. Type "ai mode" to set up.', 'bot');
      }
    }
    else if (cmd.action === 'listModels') { listModels(); }
    else if (cmd.action === 'switchModel') { switchModel(extractParameter(input, cmd.command)); }
    else if (cmd.action === 'showCurrentModel') { showCurrentModel(); }
    else if (cmd.action === 'testAllModels') { await testAllAvailableModels(); }
    else if (cmd.isLink) {
      //  get api key, about, contact, service, website — सबै link commands
      const response = typeof cmd.response === 'function' ? cmd.response() : cmd.response;
      addMessageWithLink(response, 'bot', cmd.url, cmd.linkText);
    }
    else {
      const response = typeof cmd.response === 'function' ? cmd.response() : cmd.response;
      addMessage(response, 'bot');
    }
  } else {
    // AI mode मा key नभए reply नगर्ने, key माग्ने
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
}