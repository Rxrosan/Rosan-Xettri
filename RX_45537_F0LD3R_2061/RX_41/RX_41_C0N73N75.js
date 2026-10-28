// ============================================================
// 02-constants.js - Rosan Details & Commands (AUTO LINKS)
// ============================================================

const rosanDetails = {
  name: "ROSAN K.C.",
  age: "23-year-old",
  education: "+2 Clear",
  location: "Banganga-10, Kapilvastu pakadiachapa",
  email: "rosankc2061@gmail.com",
  facebook: "https://www.facebook.com/Rosan.2061",
  facebookpage: "https://www.facebook.com/RosanXettri.2004",
  youtube: "https://www.youtube.com/channel/UCzOs87ROUZSPyfdDbOl0F1w",
  website: "https://rosankc.com.np/",
  contactPage: "Contact.html",
  aboutPage: "About.html",
  servicePage: "Service.html",
  termsconditionsPage: "T&C.html",
  privacypolicyPage: "P&P.html"
};

// ============================================================
// AUTO LINK SYSTEM
// rosanDetails मा link थप्नुहोस् — prompt auto-update हुन्छ
// ============================================================

// यी key हरू link होइनन् — skip गर्ने
const NON_LINK_KEYS = ['name', 'age', 'education', 'location'];

// key बाट human-readable label
function keyToLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase())
    .trim();
}

// key बाट keywords (auto + custom aliases)
function keyToKeywords(key) {
  const label = keyToLabel(key).toLowerCase();
  const base = [label];
  
  const aliases = {
    email: ['mail', 'gmail'],
    facebook: ['fb'],
    facebookpage: ['fb page', 'page'],
    youtube: ['video', 'channel'],
    website: ['home', 'site'],
    contactpage: ['contact', 'reach', 'message', 'call'],
    aboutpage: ['about', 'who is rosan', 'bio', 'profile'],
    servicepage: ['service', 'work', 'offer'],
    termsconditionspage: ['terms', 'conditions', 't&c'],
    privacypolicypage: ['privacy', 'policy', 'p&p']
  };
  
  const keyLower = key.toLowerCase();
  const extra = aliases[keyLower] || [];
  return [...new Set([...base, ...extra])];
}

// सबै link keys निकाल्ने
function getLinkKeys() {
  return Object.keys(rosanDetails)
    .filter(key => !NON_LINK_KEYS.includes(key))
    .filter(key => rosanDetails[key]);
}

// Prompt को लागि EXACT LINKS text
function buildExactLinksText() {
  return getLinkKeys()
    .map(key => `- ${keyToLabel(key)}: ${rosanDetails[key]}`)
    .join('\n');
}

// Prompt को लागि LINK RULES text
function buildLinkRulesText() {
  return getLinkKeys()
    .map(key => `   - ${keyToKeywords(key).join(' / ')} → ${rosanDetails[key]}`)
    .join('\n');
}

// ============================================================
// COMMANDS (जस्ताको तस्तै)
// ============================================================
const commands = [
  { 
    command: 'hello', 
    description: 'Start conversation',
    response: 'Hello! I am ROSE "ROSAN KC ASSISTANT". type "help" to see all comands. & Tell me how can i help you ?',
    category: 'basic'
  },
  { 
    command: 'about', 
    description: 'About ROSAN KC',
    response: `${rosanDetails.name} is a ${rosanDetails.age} ${rosanDetails.education} from ${rosanDetails.location}. He is a licensed professional serving the Kapilvastu district for legal documents (Kapali Tamsuk, Rajinaama, Lakhbandhak), EPS exam web services, National Identity Card assistance, PAN account creation, and essential government document solutions.`,
    category: 'info',
    isLink: true,
    url: rosanDetails.aboutPage,
    linkText: 'Click to open About Page'
  },
  { 
    command: 'contact', 
    description: 'Contact information',
    response: 'CONTACT US\n\nClick the link below to open our contact page:',
    category: 'contact',
    isLink: true,
    url: rosanDetails.contactPage,
    linkText: 'Click to open Contact Page'
  },
  { 
    command: 'service', 
    description: 'Our services',
    response: 'ROSAN KC SERVICES:\n\n• designing \n• eps exam for web base software\n• lekhapadi services \n• lekhapadi services web based services.',
    category: 'Service',
    isLink: true,
    url: rosanDetails.servicePage,
    linkText: 'Click to open Service Page'
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
    url: rosanDetails.website,
    linkText: 'Click to open Website'
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
  url: rosanDetails.termsconditionsPage,
  linkText: 'Click to open Terms & Conditions'
  },
  { 
  command: 'privacy', 
  description: 'Privacy Policy page',
  response: 'Privacy Policy:\n\nClick the link below to open:',
  category: 'info',
  isLink: true,
  url: rosanDetails.privacypolicyPage,
  linkText: 'Click to open Privacy Policy'
  }, 
];