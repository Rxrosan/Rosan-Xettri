// ============================================================
// 04-gemini.js - Gemini API Functions
// ============================================================

async function getGeminiResponse(userMessage) {
  if (!config.gemini.apiKey) {
    return 'No API key set. Please set your Gemini API key first using: set key YOUR_API_KEY';
  }

  try {
    const modelInfo = getCurrentModelInfo();
    
    const response = await fetch(`${config.gemini.apiUrl}${modelInfo.id}:generateContent?key=${config.gemini.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: `You are the official AI assistant for ${rosanDetails.name}'s portfolio website. 
            Bio: ${rosanDetails.age} ${rosanDetails.education} from ${rosanDetails.location}, passionate about designer  and lekhandas.
            Contact & Links Info: 
            - Email: ${rosanDetails.email}
            - Facebook: ${rosanDetails.facebook}
            - Facebookpage: ${rosanDetails.facebookpage}
            - YouTube: ${rosanDetails.youtube}
            - Website: ${rosanDetails.website}
            - Contact Page: ${rosanDetails.contactPage}
            - About Page: ${rosanDetails.aboutPage}
            - Services Page: ${rosanDetails.servicePage}
            
            IMPORTANT INSTRUCTION FOR LINKS: When a user asks for any link, website, facebook, social media, contact, about, or service page, you MUST include a special link formatting tag at the end of your text like this: 
            [LINK:URL_HERE|BUTTON_TEXT_HERE]
            `
          }]
        },
        contents: [{
          parts: [{
            text: userMessage
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (response.ok && data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return `Error: ${data.error?.message || 'Unknown error'}`;
    }
  } catch (error) {
    return 'Network error. Please check your connection.';
  }
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
      addMessage('No API key found. Please set your API key first using: set key YOUR_API_KEY', 'bot');
    }
    return false;
  }

  if (typeof addMessage === 'function') {
    addMessage('Testing models...', 'bot');
  }
  
  for (const model of config.gemini.availableModels) {
    if (typeof addMessage === 'function') {
      addMessage(`Testing ${model.name}...`, 'bot');
    }
    if (typeof showTypingIndicator === 'function') {
      showTypingIndicator();
    }
    const isWorking = await testModelConnection(model.id);
    if (typeof removeTypingIndicator === 'function') {
      removeTypingIndicator();
    }
    
    if (isWorking) {
      saveModel(model.id);
      chatMode = 'ai';
      saveChatMode('ai');
      if (typeof updateModeIndicator === 'function') {
        updateModeIndicator();
      }
      if (typeof addMessage === 'function') {
        addMessage(`Connected with ${model.name}! How can I help you?`, 'bot');
      }
      return true;
    }
  }
  
  if (typeof addMessage === 'function') {
    addMessage('Your API key works but needs to be enabled for Gemini API. Go to https://aistudio.google.com/ and create a new key.', 'bot');
  }
  return false;
}

async function testAllAvailableModels() {
  if (!config.gemini.apiKey) {
    if (typeof addMessage === 'function') {
      addMessage('No API key found. Please set your API key first using "set key YOUR_API_KEY"', 'bot');
    }
    return;
  }
  
  if (typeof addMessage === 'function') {
    addMessage('Testing all models...\n', 'bot');
  }
  const results = [];
  let workingModel = null;
  
  for (const model of config.gemini.availableModels) {
    if (typeof addMessage === 'function') {
      addMessage(`Testing ${model.name}...`, 'bot');
    }
    if (typeof showTypingIndicator === 'function') {
      showTypingIndicator();
    }
    const isWorking = await testModelConnection(model.id);
    if (typeof removeTypingIndicator === 'function') {
      removeTypingIndicator();
    }
    
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
    if (typeof updateModeIndicator === 'function') {
      updateModeIndicator();
    }
    resultMessage += `\nAuto-connected to: ${workingModel.name}`;
  } else {
    resultMessage += `\nNo working models found. Go to https://aistudio.google.com/ and create a new key.`;
  }
  
  if (typeof addMessage === 'function') {
    addMessage(resultMessage, 'bot');
  }
}

function getCurrentModelInfo() {
  return config.gemini.availableModels.find(m => m.id === config.gemini.currentModel) || config.gemini.availableModels[0];
}