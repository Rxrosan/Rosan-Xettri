// ============================================================
// 06-ui.js - UI Injection
// ============================================================

function injectHTML() {
  if (!document.getElementById('rx-chat-window')) {
    const { avatars } = config;
    const html = `
    <div class="rx-chat-window" id="rx-chat-window">
      <div class="rx-chat-header" id="rx-chat-header">
        <div class="rx-header-icon" id="rx-header-icon">${!config.images.headerIcon ? avatars.headerEmoji : ''}</div>
        <div class="rx-header-title">
          ROSAN XETTRI STUDIO
          <span class="rx-mode-indicator" id="rx-mode-indicator">CMD</span>
        </div>
        <div class="rx-header-close" id="rx-close-btn">×</div>
      </div>
      <div class="rx-chat-messages" id="rx-chat-messages"></div>
      <div class="rx-input-area">
        <input type="text" placeholder="Aa..." id="rx-user-input">
        <button id="rx-send-btn">
          <img src="${config.images.sendIcon}" alt="send" class="rx-send-icon">
        </button>
      </div>
      <div class="rx-copyright">${config.copyright}</div>
    </div>
    `;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
  }
}

function updateModeIndicator() {
  const indicator = document.getElementById('rx-mode-indicator');
  if (indicator) {
    if (chatMode === 'ai' && config.gemini.apiKey) {
      const modelInfo = getCurrentModelInfo();
      indicator.textContent = 'AI';
      indicator.style.color = '#64ffda';
      indicator.title = `Using: ${modelInfo.name}`;
    } else {
      indicator.textContent = 'CMD';
      indicator.style.color = '#ffaa64';
      indicator.title = 'Command Mode';
    }
  }
}