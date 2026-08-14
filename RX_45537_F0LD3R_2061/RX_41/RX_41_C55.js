// ============================================================
// 05-css.js - Liquid Theme with Background ONLY in Messages Area
// Close Button - Only Icon (No Background, No Border, No Hover)
// Send Button - Only Image (No Background, No Shape)
// ============================================================

function generateCSS() {
  const { images } = config;
  
  const bgImage = images.background || '';
  const botAvatar = images.botAvatar || '';
  const userAvatar = images.userAvatar || '';
  const headerIcon = images.headerIcon || '';
  
  return `
  * { 
    box-sizing: border-box; 
    -webkit-tap-highlight-color: transparent; 
  }
  
  /* ======================================== */
  /* ===== CHAT WINDOW - LIQUID/GLASSMORPHISM THEME ===== */
  /* ======================================== */
  .rx-chat-window {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(90vw, 420px);
    max-width: 420px;
    height: min(85vh, 580px);
    max-height: 580px;
    
    /* ===== LIQUID GLASS BACKGROUND (SOLID, NO IMAGE HERE) ===== */
    background: rgba(30, 40, 60, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    /* ===== WHITE BORDER ===== */
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: clamp(16px, 4vw, 25px);
    
    /* ===== SOFT GLOW SHADOW ===== */
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.5),
      0 0 30px rgba(255, 255, 255, 0.05);
    
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

  /* ======================================== */
  /* ===== MESSAGES AREA - BACKGROUND IMAGE ONLY HERE ===== */
  /* ======================================== */
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
    
    /* ===== BACKGROUND IMAGE ONLY IN MESSAGES AREA ===== */
    ${bgImage ? `background-image: url('${bgImage}'); background-size: cover; background-position: center; background-repeat: no-repeat;` : ''}
  }
  
  /* ===== OVERLAY FOR BETTER READABILITY ===== */
  .rx-chat-messages::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(30, 40, 60, 0.3);
    z-index: -1;
    pointer-events: none;
  }
  
  .rx-chat-messages::-webkit-scrollbar {
    width: 3px;
  }
  .rx-chat-messages::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  .rx-chat-messages::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }

  /* ======================================== */
  /* ===== HEADER - LIQUID DARK ===== */
  /* ======================================== */
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

  /* ======================================== */
  /* ===== HEADER TITLE - WHITE ===== */
  /* ======================================== */
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

  /* ======================================== */
  /* ===== CLOSE BUTTON - ONLY ICON (NO BG, NO BORDER, NO HOVER) ===== */
  /* ======================================== */
  .rx-header-close {
    width: clamp(22px, 3.5vw, 30px);
    height: clamp(22px, 3.5vw, 30px);
    
    /* ===== NO BACKGROUND ===== */
    background: transparent;
    
    /* ===== NO BORDER ===== */
    border: none;
    
    /* ===== ONLY WHITE TEXT ===== */
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
    
    /* ===== WHITE GLOW ===== */
    text-shadow: 
      0 0 20px rgba(255, 255, 255, 0.2),
      0 0 40px rgba(255, 255, 255, 0.1);
  }
  
  /* ===== NO HOVER BACKGROUND, NO BORDER ===== */
  .rx-header-close:hover { 
    background: transparent;
    border: none;
    color: #ffffff;
    text-shadow: 
      0 0 30px rgba(255, 255, 255, 0.4),
      0 0 60px rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  .rx-header-close:active { 
    transform: scale(0.9);
    background: transparent;
    border: none;
  }

  /* ===== MESSAGES ===== */
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

  /* ===== AVATAR - LIQUID BORDER ===== */
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

  /* ======================================== */
  /* ===== MESSAGE BUBBLE - LIQUID GLASS ===== */
  /* ======================================== */
  .rx-message {
    padding: clamp(8px, 1.5vh, 12px) clamp(12px, 2vw, 16px);
    border-radius: clamp(12px, 2vw, 16px);
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #ffffff;
    font-size: clamp(14px, 1.8vw, 15px);
    font-weight: 500;
    line-height: 1.7;
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

  /* ===== LINK BUTTON - LIQUID ===== */
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

  /* ======================================== */
  /* ===== INPUT AREA - LIQUID DARK ===== */
  /* ======================================== */
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

  /* ======================================== */
  /* ===== SEND BUTTON - ONLY IMAGE (NO SHAPE, NO BG, NO BORDER) ===== */
  /* ======================================== */
  .rx-input-area button {
    width: auto;
    height: auto;
    min-width: unset;
    min-height: unset;
    
    /* ===== NO BACKGROUND, NO BORDER, NO SHAPE ===== */
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
  
  /* ===== NO HOVER EFFECT ===== */
  .rx-input-area button:hover {
    background: transparent;
    border: none;
    transform: none;
  }
  
  .rx-input-area button:active {
    transform: scale(0.9);
    background: transparent;
    border: none;
  }

  .rx-send-icon {
    width: clamp(24px, 4vw, 32px);
    height: clamp(24px, 4vw, 32px);
    object-fit: contain;
    
    /* ===== WHITE ICON ===== */
    filter: brightness(0) invert(1);
    opacity: 0.8;
    transition: none;
    display: block;
  }
  
  /* ===== NO HOVER EFFECT ON ICON ===== */
  .rx-input-area button:hover .rx-send-icon {
    opacity: 0.8;
    transform: none;
    filter: brightness(0) invert(1);
  }
  
  .rx-input-area button:active .rx-send-icon {
    transform: scale(0.9);
    opacity: 0.8;
  }

  /* ======================================== */
  /* ===== COPYRIGHT - LIQUID ===== */
  /* ======================================== */
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
  .rx-copyright a {
    color: #64ffda;
    text-decoration: none;
  }
  .rx-copyright a:hover { 
    color: #a8ffeb;
    text-decoration: underline;
  }

  /* ===== TYPING INDICATOR - LIQUID ===== */
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

  /* ======================================== */
  /* ===== RESPONSIVE BREAKPOINTS (UNCHANGED) ===== */
  /* ======================================== */

  @media screen and (max-width: 480px) {
    .rx-chat-window {
      width: 95vw;
      max-width: 95vw;
      height: 90vh;
      max-height: 90vh;
      border-radius: 14px;
    }
    .rx-chat-messages { padding: 8px 10px; gap: 6px; }
    .rx-message-wrapper { max-width: 92%; }
    .rx-message { font-size: 14px; padding: 8px 12px; }
    .rx-header-title { font-size: 12px; }
    .rx-input-area { padding: 6px 8px; gap: 6px; min-height: 40px; }
    .rx-input-area input { font-size: 14px; padding: 8px 12px; min-height: 32px; height: 32px; }
    .rx-input-area button { padding: 0; }
    .rx-send-icon { width: 28px; height: 28px; }
    .rx-avatar { width: 22px; height: 22px; font-size: 11px; }
    .rx-header-close { font-size: 28px; }
  }

  @media screen and (max-width: 360px) {
    .rx-chat-window {
      width: 98vw;
      max-width: 98vw;
      height: 92vh;
      max-height: 92vh;
      border-radius: 10px;
    }
    .rx-message { font-size: 13px; padding: 6px 10px; }
    .rx-avatar { width: 20px; height: 20px; font-size: 10px; }
    .rx-header-icon { width: 20px; height: 20px; font-size: 11px; }
    .rx-header-close { font-size: 24px; width: 24px; height: 24px; }
    .rx-input-area { padding: 4px 6px; gap: 4px; min-height: 34px; }
    .rx-input-area input { font-size: 13px; padding: 6px 10px; min-height: 28px; height: 28px; }
    .rx-input-area button { padding: 0; }
    .rx-send-icon { width: 24px; height: 24px; }
    .rx-copyright { font-size: 8px; }
  }

  @media screen and (min-width: 481px) and (max-width: 768px) {
    .rx-chat-window { width: 78vw; max-width: 400px; height: 78vh; max-height: 520px; }
    .rx-message { font-size: 15px; }
    .rx-input-area input { font-size: 15px; min-height: 36px; height: 36px; }
    .rx-input-area button { padding: 0; }
    .rx-send-icon { width: 30px; height: 30px; }
  }

  @media screen and (min-width: 769px) {
    .rx-chat-window { width: 400px; max-width: 400px; height: 560px; max-height: 560px; }
    .rx-input-area input { min-height: 38px; height: 38px; }
    .rx-input-area button { padding: 0; }
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
    .rx-input-area button { padding: 0; }
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