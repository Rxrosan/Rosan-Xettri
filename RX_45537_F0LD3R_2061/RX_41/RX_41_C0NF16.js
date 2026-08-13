// ============================================================
// 01-config.js - Configuration
// ============================================================

const config = {
  chatWidth: '380px',
  chatHeight: '500px',
  mobileWidth: '320px',
  mobileHeight: '450px',
  smallMobileWidth: '280px',
  smallMobileHeight: '400px',
  
  welcomeMessage: 'Welcome to RX STUDIO\nI am your assistant. Type "hello" to start Conversation.',
  typingSpeed: 30,
  copyright: '<p>&copy; <strong><a href="https://www.rosankc.com.np" style="color:#64ffda; text-decoration:none;">RX STUDIO</a></strong>. All Rights Reserved.</p>',
  
  gemini: {
    apiKey: 'AQ.Ab8RN6IrRb1T5Gl3pCPLDFCJ7DhrrsYi7Xc--0eVqxUrZ3ah7g',
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
    headerIcon: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/BOT-PROFILE.png',
    background: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/RX-AI-BG-3.png',
    messageBg: null,
    sendIcon: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/send.png'
  },
  
  colors: {
    primary: 'transprent',
    headerBg: 'rgba(0,0,0,0.3)',
    inputBg: 'rgba(255,255,255,0.1)',
    botMessageBg: 'transprent',
    userMessageBg: 'transprent',
    textColor: 'white',
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