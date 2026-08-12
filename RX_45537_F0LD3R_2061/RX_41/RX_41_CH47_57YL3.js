export const chatStyles = `
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
.rx-chat-window {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 380px; height: 500px;
  background: rgba(30, 40, 60, 0.95);
  background-size: cover; background-position: center; backdrop-filter: blur(10px);
  border-radius: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.2); display: none; flex-direction: column;
  overflow: hidden; z-index: 1000000; color: white;
  touch-action: none; will-change: transform, left, top;
}
.rx-chat-window.show { display: flex; }
.rx-chat-window.dragging { transition: none; opacity: 0.95; }
.rx-chat-header {
  padding: 15px; background: rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.2); display: flex;
  align-items: center; gap: 10px; cursor: grab; height: 1cm;
}
.rx-header-icon {
  width: 0.8cm; height: 0.8cm; border-radius: 50%; background: transparent;
  display: flex; align-items: center; justify-content: center; color: white;
  border: 2px solid rgba(255,255,255,0.5);
}
.rx-header-title { flex: 1; font-weight: bold; text-align: center; font-size: 14px; }
.rx-mode-indicator {
  font-size: 10px; padding: 2px 6px; background: rgba(0,0,0,0.3);
  border-radius: 12px; color: #ffaa64; margin-left: 5px; border: 1px solid rgba(255,255,255,0.2);
}
.rx-header-close {
  width: 0.8cm; height: 0.8cm; border-radius: 50%; background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3); color: white; font-size: 18px;
  cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;
}
.rx-chat-messages {
  flex: 1; padding: 15px; overflow-y: auto; display: flex;
  flex-direction: column; gap: 10px; -webkit-overflow-scrolling: touch;
}
.rx-message-wrapper { display: flex; align-items: flex-end; gap: 8px; max-width: 85%; }
.rx-message-wrapper.bot { align-self: flex-start; }
.rx-message-wrapper.user { align-self: flex-end; flex-direction: row-reverse; }
.rx-avatar {
  width: 32px; height: 32px; border-radius: 50%; display: flex;
  align-items: center; justify-content: center; color: white; font-size: 16px;
  border: 2px solid rgba(255,255,255,0.3); flex-shrink: 0; overflow: hidden;
}
.rx-message {
  padding: 10px 15px; border-radius: 18px; background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2); color: white;
  font-size: 0.9rem; line-height: 1.4; white-space: pre-line; word-break: break-word;
}
.rx-link-button {
  display: inline-block; margin-top: 8px; padding: 8px 15px;
  background: rgba(100, 255, 218, 0.2); border: 1px solid #64ffda;
  border-radius: 20px; color: #64ffda; text-decoration: none; font-size: 0.9rem;
}
.rx-link-button:hover { background: #64ffda; color: #000; }
.rx-input-area {
  display: flex; padding: 12px; gap: 8px; background: rgba(0,0,0,0.3);
  border-top: 1px solid rgba(255,255,255,0.2);
}
.rx-input-area input {
  flex: 1; padding: 12px 18px; background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2); border-radius: 25px; outline: none;
  color: white; font-size: 0.9rem;
}
.rx-input-area button {
  width: 45px; height: 45px; border-radius: 50%; border: none;
  background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.rx-send-icon { width: 100%; height: 100%; object-fit: contain; filter: brightness(0) invert(1); }
.rx-copyright {
  padding: 6px; text-align: center; font-size: 0.7rem; color: rgba(255,255,255,0.5);
  background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.1);
}
.rx-typing-indicator { display: flex; gap: 4px; padding: 12px 16px; background: rgba(255,255,255,0.1); border-radius: 18px; }
.rx-typing-dot { width: 6px; height: 6px; background: white; border-radius: 50%; animation: typing 1.4s infinite; }
@keyframes typing { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-6px); opacity: 1; } }
`;