// ============================================================
// 02-constants.js - Rosan Details & Commands 
// ============================================================

const rosanDetails = {
  name: "ROSAN K.C.",
  age: "23-year-old",
  education: "+2 Clear",
  location: "Banganga-10, Kapilvastu pakadiachapa",

  // ===== LINKS  =====

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

// ============================================================
// LINK HELPERS — सबै rosanDetails.links बाट
// ============================================================

function getLinkKeys() {
  return Object.keys(rosanDetails.links);
}

// EXACT LINKS text (prompt को लागि)
function buildExactLinksText() {
  return getLinkKeys()
    .map(k => `- ${rosanDetails.links[k].label}: ${rosanDetails.links[k].url}`)
    .join('\n');
}

// LINK RULES text (topic → url mapping)
function buildLinkRulesText() {
  return getLinkKeys()
    .map(k => {
      const l = rosanDetails.links[k];
      const kws = [l.label.toLowerCase(), ...(l.keywords || [])];
      return `   - ${kws.join(' / ')} → ${l.url}`;
    })
    .join('\n');
}

// एउटा key बाट [LINK:...] tag
function buildLinkTag(key) {
  const l = rosanDetails.links[key];
  if (!l || !l.url) return '';
  return `[LINK:${l.url}|${l.button || l.label}]`;
}

// दिइएका key हरूको multiple [LINK:] tags
function buildMultiLinkExample(keys) {
  return keys
    .map(k => buildLinkTag(k))
    .filter(Boolean)
    .map(tag => '     ' + tag)
    .join('\n');
}

// सबै links को example
function buildAllLinksExample() {
  return buildMultiLinkExample(getLinkKeys());
}

// ============================================================
// COMMANDS (सबै url/button rosanDetails.links बाट)
// ============================================================
const commands = [
  {
    command: 'hello',
    description: 'Start conversation',
    response: 'Hello! I am ROSE "ROSAN KC ASSISTANT". type "help" to see all commands. & Tell me how can i help you ?',
    category: 'basic'
  },
  {
    command: 'about',
    description: 'About ROSAN KC',
    response: `${rosanDetails.name} is a ${rosanDetails.age} ${rosanDetails.education} from ${rosanDetails.location}. He is a licensed professional serving the Kapilvastu district for legal documents (Kapali Tamsuk, Rajinaama, Lakhbandhak), EPS exam web services, National Identity Card assistance, PAN account creation, and essential government document solutions.`,
    category: 'info',
    isLink: true,
    get url() { return rosanDetails.links.aboutPage.url; },
    get linkText() { return rosanDetails.links.aboutPage.button; }
  },
  {
    command: 'contact',
    description: 'Contact information',
    response: 'CONTACT US\n\nClick the link below to open our contact page:',
    category: 'contact',
    isLink: true,
    get url() { return rosanDetails.links.contactPage.url; },
    get linkText() { return rosanDetails.links.contactPage.button; }
  },
  {
    command: 'service',
    description: 'Our services',
    response: 'ROSAN KC SERVICES:\n\n• designing\n• eps exam for web base software\n• lekhapadi services\n• lekhapadi services web based services.',
    category: 'Service',
    isLink: true,
    get url() { return rosanDetails.links.servicePage.url; },
    get linkText() { return rosanDetails.links.servicePage.button; }
  },
  {
    command: 'close window',
    category: 'system',
    description: 'Close chat window',
    response: 'Closing window... Chat cleared. See you soon!',
    action: 'close'
  },
  {
    command: 'clear chat',
    category: 'system',
    description: 'Clear all messages',
    response: 'Chat cleared!',
    action: 'clear'
  },
  {
    command: 'help',
    description: 'Show all commands',
    response: 'AVAILABLE COMMANDS:\n\n',
    action: 'showHelp'
  },
  {
    command: 'website',
    description: 'Visit our website',
    response: 'RX Official Website',
    category: 'website-link',
    isLink: true,
    get url() { return rosanDetails.links.website.url; },
    get linkText() { return rosanDetails.links.website.button; }
  },
  {
    command: 'date',
    description: 'Current date',
    response: () => 'Today is: ' + new Date().toLocaleDateString(),
    category: 'utility'
  },
  {
    command: 'time',
    description: 'Current time',
    response: () => 'Current time is: ' + new Date().toLocaleTimeString(),
    category: 'utility'
  },
  {
    command: 'ai mode',
    description: 'Enable AI chat with Gemini',
    response: '',
    category: 'ai-mode',
    action: 'aiMode'
  },
  {
    command: 'command mode',
    description: 'Switch to command mode',
    response: 'Command mode activated! Type "help" to see available commands.',
    category: 'command-mode',
    action: 'commandMode'
  },
  {
    command: 'set key',
    description: 'Set Gemini API key',
    response: 'Processing API key...',
    category: 'ai-functions',
    action: 'setApiKey'
  },
  {
    command: 'clear key',
    description: 'Clear saved API key and switch to command mode',
    response: '',
    category: 'ai-functions',
    action: 'clearApiKey'
  },
  {
    command: 'remove key',
    description: 'Alias for clear key - Remove saved API key',
    response: '',
    category: 'ai-functions',
    action: 'clearApiKey'
  },
  {
    command: 'check key',
    description: 'Check if API key is saved',
    response: '',
    category: 'ai-functions',
    action: 'checkApiKey'
  },
  {
    command: 'models',
    description: 'List available models',
    response: '',
    category: 'ai-functions',
    action: 'listModels'
  },
  {
    command: 'use model',
    description: 'Switch to a specific model',
    response: '',
    category: 'ai-functions',
    action: 'switchModel',
    requiresParameter: true
  },
  {
    command: 'current model',
    description: 'Show currently active AI model',
    response: '',
    category: 'ai-functions',
    action: 'showCurrentModel'
  },
  {
    command: 'test models',
    description: 'Test all models',
    response: '',
    category: 'ai-functions',
    action: 'testAllModels'
  },
  {
    command: 'get api key',
    description: 'Get a Gemini API key',
    response: 'Get your Gemini API key from Google AI Studio:',
    category: 'ai-functions',
    isLink: true,
    url: 'https://aistudio.google.com/app/apikey',
    linkText: 'Click to open API Key Page'
  },
  {
    command: 'terms',
    description: 'Terms & Conditions page',
    response: 'Terms & Conditions:\n\nClick the link below to open:',
    category: 'info',
    isLink: true,
    get url() { return rosanDetails.links.termsconditionsPage.url; },
    get linkText() { return rosanDetails.links.termsconditionsPage.button; }
  },
  {
    command: 'privacy',
    description: 'Privacy Policy page',
    response: 'Privacy Policy:\n\nClick the link below to open:',
    category: 'info',
    isLink: true,
    get url() { return rosanDetails.links.privacypolicyPage.url; },
    get linkText() { return rosanDetails.links.privacypolicyPage.button; }
  }
];