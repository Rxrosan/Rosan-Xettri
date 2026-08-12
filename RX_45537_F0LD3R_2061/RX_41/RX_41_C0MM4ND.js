// ============================================================
// 08-command.js - Command Processing
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