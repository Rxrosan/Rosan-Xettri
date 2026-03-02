// SMART-BTN-ADVANCE-DESIGN-L.js
// RX-SMART-BUTTON — Rewritten, responsive, fully functional
(function () {
  'use strict';

  /**
   * ===============================
   * Configuration / Themes
   * ===============================
   */
  const themes = {
    blue: {
      name: 'blue',
      centerGradient:
        'radial-gradient(circle at 30% 30%, rgba(173,216,230,0.9) 0%, rgba(70,130,180,0.7) 100%)',
      glow: '0 0 15px rgba(173,216,230,0.6)',
      border: '1px solid rgba(173,216,230,0.4)',
      iconHighlight: 'rgba(173,216,230,0.7)',
    },
    silver: {
      name: 'silver',
      centerGradient:
        'radial-gradient(circle at 30% 30%, rgba(220,220,220,0.9) 0%, rgba(169,169,169,0.7) 100%)',
      glow: '0 0 15px rgba(220,220,220,0.6)',
      border: '1px solid rgba(220,220,220,0.4)',
      iconHighlight: 'rgba(220,220,220,0.7)',
    },
  };

  let themeKeys = Object.keys(themes);
  let currentThemeIndex = 0;

  // Hide timer state
  let hideTimer = null;
  let hideUntil = null;

  /**
   * ===============================
   * CSS Injection (responsive & liquid glass)
   * ===============================
   */
  const css = `
  :root{
    --rx-circle-size:2.2cm;
    --rx-menu-item-size:1.6cm;
    --rx-center-size:0.9cm;
    --rx-menu-distance:4.2cm;
    --rx-glass-blur:4px;
    --rx-glass-border:1px solid rgba(255,255,255,0.15);
    --rx-glass-highlight: 0 0 15px rgba(173,216,230,0.6);
    --rx-center-gradient: ${themes.blue.centerGradient};
    --rx-icon-highlight: ${themes.blue.iconHighlight};
  }

  .RX-SMART-BUTTON-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100000;
    display: block;
    touch-action: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .RX-SMART-BUTTON-circle {
    width: var(--rx-circle-size);
    height: var(--rx-circle-size);
    border-radius: 50%;
    position: relative;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    background: radial-gradient(circle at 65% 35%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.1) 70%);
    box-shadow: var(--rx-glass-highlight), inset 0 0 14px rgba(255,255,255,0.06);
    border: var(--rx-glass-border);
    backdrop-filter: blur(var(--rx-glass-blur));
    -webkit-backdrop-filter: blur(var(--rx-glass-blur));
  }

  .RX-SMART-BUTTON-circle:active { transform: scale(0.98); }

  .RX-SMART-BUTTON-center-point {
    width: var(--rx-center-size);
    height: var(--rx-center-size);
    border-radius:50%;
    background: var(--rx-center-gradient);
    box-shadow: inset 0 0 10px rgba(255,255,255,0.45);
    border: var(--rx-glass-border);
    transition: background 0.3s ease, opacity 0.25s ease;
  }

  .RX-SMART-BUTTON-menu-item {
    position: absolute;
    width: var(--rx-menu-item-size);
    height: var(--rx-menu-item-size);
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:50%;
    background: rgba(255,255,255,0.12);
    border: var(--rx-glass-border);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    opacity:0;
    transform: scale(0) rotate(0deg);
    transition: transform 0.55s cubic-bezier(0.17,0.67,0.32,1.3), opacity 0.3s ease;
    pointer-events: none;
    box-shadow: 0 0 10px rgba(255,255,255,0.12), inset 0 0 8px rgba(255,255,255,0.06);
  }

  .RX-SMART-BUTTON-menu-item img {
    width: 56%;
    height: 56%;
    object-fit:contain;
    transition: transform 0.16s ease, filter 0.16s ease;
  }

  .RX-SMART-BUTTON-circle.expanded .RX-SMART-BUTTON-menu-item {
    opacity:1;
    transform: scale(1);
    pointer-events: auto;
  }

  /* positions for up to 12 items */
  .RX-SMART-BUTTON-circle.expanded .RX-item-1  { transform: rotate(30deg) translateX(var(--rx-menu-distance)) rotate(-30deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-2  { transform: rotate(60deg) translateX(var(--rx-menu-distance)) rotate(-60deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-3  { transform: rotate(90deg) translateX(var(--rx-menu-distance)) rotate(-90deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-4  { transform: rotate(120deg) translateX(var(--rx-menu-distance)) rotate(-120deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-5  { transform: rotate(150deg) translateX(var(--rx-menu-distance)) rotate(-150deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-6  { transform: rotate(180deg) translateX(var(--rx-menu-distance)) rotate(-180deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-7  { transform: rotate(210deg) translateX(var(--rx-menu-distance)) rotate(-210deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-8  { transform: rotate(240deg) translateX(var(--rx-menu-distance)) rotate(-240deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-9  { transform: rotate(270deg) translateX(var(--rx-menu-distance)) rotate(-270deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-10 { transform: rotate(300deg) translateX(var(--rx-menu-distance)) rotate(-300deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-11 { transform: rotate(330deg) translateX(var(--rx-menu-distance)) rotate(-330deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-12 { transform: rotate(360deg) translateX(var(--rx-menu-distance)) rotate(-360deg) scale(1); }

  .RX-SMART-BUTTON-menu-item:hover {
    background: rgba(255,255,255,0.22);
    box-shadow: 0 0 18px var(--rx-glass-highlight), inset 0 0 12px rgba(255,255,255,0.12);
  }
  .RX-SMART-BUTTON-menu-item:hover img { transform: scale(1.08); filter: brightness(1.05); }

  /* Popup overlay and popup (note: overlay click will not close popup per user request) */
  .RX-popup-overlay {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 100001;
    background: rgba(0,0,0,0.45);
    display:none;
    justify-content:center;
    align-items:center;
  }

  .RX-popup-overlay.show { display:flex; }

  .RX-hide-settings-popup {
    min-width: 280px;
    max-width: 92%;
    padding: 18px;
    border-radius: 12px;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: var(--rx-glass-border);
    box-shadow: 0 8px 30px rgba(0,0,0,0.45);
    color: white;
    z-index: 100002;
  }

  .RX-hide-settings-popup h3 {
    margin:0 0 12px 0;
    font-size:18px;
    text-align:center;
  }
  .RX-time-inputs { display:flex; gap:10px; justify-content:center; margin-bottom:14px; flex-wrap:wrap; }
  .RX-time-input { display:flex; flex-direction:column; align-items:center; min-width:60px; }
  .RX-time-input label { font-size:12px; margin-bottom:6px; color:#fff; opacity:0.95; }
  .RX-time-input input {
    width:68px; padding:8px; border-radius:8px; border:var(--rx-glass-border);
    background: rgba(255,255,255,0.07); color:white; text-align:center;
  }
  .RX-popup-buttons { display:flex; gap:10px; justify-content:center; margin-top:6px; }
  .RX-popup-btn {
    padding:8px 12px; border-radius:8px; border:var(--rx-glass-border);
    background: rgba(255,255,255,0.12); color:white; cursor:pointer;
  }
  .RX-popup-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,0.35); }

  /* Small screens */
  @media (max-width: 768px) {
    :root { --rx-circle-size:2cm; --rx-menu-item-size:1.4cm; --rx-center-size:0.8cm; --rx-menu-distance:3.8cm; --rx-glass-blur:3px; }
    .RX-popup-btn { padding:7px 10px; }
  }
  @media (max-width: 480px) {
    :root { --rx-circle-size:1.8cm; --rx-menu-item-size:1.2cm; --rx-center-size:0.7cm; --rx-menu-distance:3.2cm; }
  }
  `;

  function injectCSS() {
    const style = document.createElement('style');
    style.id = 'rx-smart-button-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * ===============================
   * HTML Injection
   * ===============================
   */
  const injectedHTML = `
  <div class="RX-SMART-BUTTON-container" aria-hidden="false">
    <div class="RX-SMART-BUTTON-circle" role="button" aria-label="Smart button">
      <div class="RX-SMART-BUTTON-center-point" aria-hidden="true"></div>

      <!-- Menu items -->
      <div class="RX-SMART-BUTTON-menu-item RX-item-2" data-link="USER.html"><img src="RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/user.png" alt="user"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-3" data-link="https://rosanxettristudio.netlify.app/"><img src="RX-ASSETS/RX-IMAGE/RX-LOGO/L-6.gif" alt="logo"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-5" data-link="mailto:rkc242855@gmail.com"><img src="RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/email.png" alt="email"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-9" data-link=""><img src="RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/BOT-PROFILE-1.png" alt="chat"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-6" data-link="https://www.youtube.com/@RX_E-SPORTS"><img src="RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/youtube.png" alt="youtube"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-8" data-link="Resource.html"><img src="RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/store.png" alt="store"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-7" data-link=""><img src="RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/RX-MUSIC.png" alt="music"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-4" data-link="https://x.com/Rx_Rosan"><img src="RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/xcorp.png" alt="xcorp"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-10" data-link="https://rosankc.com.np/"><img src="RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/home.png" alt="home"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-11" data-link="About.html"><img src="RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/about.png" alt="about"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-12" data-link="Service.html"><img src="RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/service.png" alt="service"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-1" data-link="Contact.html"><img src="RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/contact.png" alt="contact"></div>
    </div>
  </div>

  <div class="RX-popup-overlay" id="RX-popup-overlay" aria-hidden="true">
    <div class="RX-hide-settings-popup" id="RX-hide-settings-popup" role="dialog" aria-modal="true" aria-labelledby="RX-hide-title">
      <h3 id="RX-hide-title">Hide RX Smart Button</h3>
      <div class="RX-time-inputs">
        <div class="RX-time-input">
          <label for="RX-hide-hours">Hours</label>
          <input type="number" id="RX-hide-hours" min="0" max="24" placeholder="0" value="0" />
        </div>
        <div class="RX-time-input">
          <label for="RX-hide-minutes">Minutes</label>
          <input type="number" id="RX-hide-minutes" min="0" max="59" placeholder="0" value="0" />
        </div>
        <div class="RX-time-input">
          <label for="RX-hide-seconds">Seconds</label>
          <input type="number" id="RX-hide-seconds" min="0" max="59" placeholder="30" value="30" />
        </div>
      </div>
      <div class="RX-popup-buttons">
        <button class="RX-popup-btn" id="RX-save-hide">Save & Hide</button>
        <button class="RX-popup-btn" id="RX-cancel-hide">Cancel</button>
      </div>
    </div>
  </div>
  `;

  function injectHTML() {
    if (!document.querySelector('.RX-SMART-BUTTON-container')) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = injectedHTML;
      document.body.appendChild(wrapper);
    }
  }

  /**
   * ===============================
   * Theme functions
   * - applyTheme(themeName) - applies and saves
   * - cycleTheme() - cycles to next theme
   * ===============================
   */
  function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;
    document.documentElement.style.setProperty('--rx-glass-highlight', theme.glow);
    document.documentElement.style.setProperty('--rx-glass-border', theme.border);
    document.documentElement.style.setProperty('--rx-center-gradient', theme.centerGradient);
    document.documentElement.style.setProperty('--rx-icon-highlight', theme.iconHighlight);

    localStorage.setItem('RX-SMART-BUTTON-theme', themeName);
    currentThemeIndex = themeKeys.indexOf(themeName);
    if (currentThemeIndex === -1) currentThemeIndex = 0;
  }

  function cycleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themeKeys.length;
    const newTheme = themeKeys[currentThemeIndex];
    applyTheme(newTheme);
  }

  /**
   * ===============================
   * State persistence (position, expanded, theme, hide-until)
   * ===============================
   */
  function saveState() {
    const container = document.querySelector('.RX-SMART-BUTTON-container');
    const circle = document.querySelector('.RX-SMART-BUTTON-circle');
    if (!container || !circle) return;
    const state = {
      left: container.style.left || null,
      top: container.style.top || null,
      expanded: circle.classList.contains('expanded'),
      theme: localStorage.getItem('RX-SMART-BUTTON-theme') || themeKeys[currentThemeIndex],
    };
    localStorage.setItem('RX-SMART-BUTTON-state', JSON.stringify(state));
  }

  function loadStateAndApply() {
    // Theme
    const savedTheme = localStorage.getItem('RX-SMART-BUTTON-theme');
    if (savedTheme && themes[savedTheme]) {
      applyTheme(savedTheme);
    } else {
      applyTheme(themeKeys[currentThemeIndex]);
    }

    // Hide timer
    const hideItem = localStorage.getItem('RX-SMART-BUTTON-hide-until');
    if (hideItem) {
      const timeVal = parseInt(hideItem, 10);
      if (!Number.isNaN(timeVal)) {
        hideUntil = timeVal;
        startHideTimer(); // this will hide if needed
      } else {
        localStorage.removeItem('RX-SMART-BUTTON-hide-until');
      }
    }

    // Position & expanded
    const savedState = localStorage.getItem('RX-SMART-BUTTON-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const container = document.querySelector('.RX-SMART-BUTTON-container');
        const circle = document.querySelector('.RX-SMART-BUTTON-circle');
        if (parsed.theme) applyTheme(parsed.theme);
        if (container && parsed.left && parsed.top) {
          container.style.left = parsed.left;
          container.style.top = parsed.top;
          container.style.right = 'auto';
          container.style.bottom = 'auto';
        }
        if (circle && parsed.expanded) {
          setTimeout(() => circle.classList.add('expanded'), 80);
        }
      } catch (err) {
        console.error('Failed to parse RX saved state:', err);
      }
    }
  }

  /**
   * ===============================
   * Show/Hide Smart Button and Timer
   * ===============================
   */
  function hideSmartButton() {
    const container = document.querySelector('.RX-SMART-BUTTON-container');
    const circle = document.querySelector('.RX-SMART-BUTTON-circle');
    if (container) container.style.display = 'none';
    if (circle) circle.classList.remove('expanded');
  }

  function showSmartButton() {
    const container = document.querySelector('.RX-SMART-BUTTON-container');
    if (container) container.style.display = 'block';
    saveState();
  }

  function startHideTimer() {
    // Clear any existing timer
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    if (!hideUntil) return;
    const now = Date.now();
    const left = hideUntil - now;

    if (left > 0) {
      // Immediately hide
      hideSmartButton();
      hideTimer = setTimeout(() => {
        showSmartButton();
        localStorage.removeItem('RX-SMART-BUTTON-hide-until');
        hideUntil = null;
        hideTimer = null;
      }, left);
    } else {
      // Time already passed
      localStorage.removeItem('RX-SMART-BUTTON-hide-until');
      hideUntil = null;
      showSmartButton();
    }
  }

  /**
   * ===============================
   * Popup controls (show/hide)
   * NOTE: overlay click will NOT close popup (per user request)
   * Popup only closed via Cancel or Save
   * While circle is expanded, long-press will NOT open popup (per user request)
   * ===============================
   */
  function showHidePopup() {
    const overlay = document.getElementById('RX-popup-overlay');
    const popup = document.getElementById('RX-hide-settings-popup');
    if (!overlay || !popup) return;

    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    // prevent background scrolling while popup open
    document.body.style.overflow = 'hidden';
  }

  function closeHidePopup() {
    const overlay = document.getElementById('RX-popup-overlay');
    const popup = document.getElementById('RX-hide-settings-popup');
    if (!overlay || !popup) return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /**
   * ===============================
   * Interaction setup (click, long-press, drag, menu items)
   * ===============================
   */
  function setupInteractions() {
    const circle = document.querySelector('.RX-SMART-BUTTON-circle');
    const container = document.querySelector('.RX-SMART-BUTTON-container');

    if (!circle || !container) return;

    // Prevent click vs drag conflict
    let isDragging = false;
    let wasDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let offsetX = 0;
    let offsetY = 0;

    // Long-press detection
    let longPressTimer = null;
    const LONG_PRESS_MS = 3000;

    // Helper to cancel long press
    function clearLongPressTimer() {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    }

    // Click (toggle expand) — avoid if we were dragging or long-press triggered
    circle.addEventListener('click', function (e) {
      // if dragging just happened, ignore this click
      if (wasDragging) {
        wasDragging = false;
        return;
      }

      // Only toggle when clicking on main circle or center (not on menu item)
      if (e.target.classList.contains('RX-SMART-BUTTON-menu-item') || e.target.closest('.RX-SMART-BUTTON-menu-item')) {
        // menu item click handled separately
        return;
      }

      this.classList.toggle('expanded');
      saveState();
    });

    // Double-click center to cycle theme (non-intrusive)
    const centerPoint = circle.querySelector('.RX-SMART-BUTTON-center-point');
    if (centerPoint) {
      centerPoint.addEventListener('dblclick', (e) => {
        cycleTheme();
      });
    }

    // Long press to open hide popup — but only if NOT expanded
    function startLongPress() {
      clearLongPressTimer();
      longPressTimer = setTimeout(() => {
        // If currently expanded, do NOT open popup (per new requirement)
        if (circle.classList.contains('expanded')) return;
        showHidePopup();
      }, LONG_PRESS_MS);
    }

    // Desktop mouse events for long press + drag
    circle.addEventListener('mousedown', function (e) {
      // start drag preparation
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      const rect = container.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      isDragging = false;
      wasDragging = false;

      // Start long press (only if not expanded)
      if (!circle.classList.contains('expanded')) startLongPress();

      function onMouseMove(ev) {
        const dx = ev.clientX - dragStartX;
        const dy = ev.clientY - dragStartY;
        const moveThreshold = 6; // px
        if (!isDragging && Math.hypot(dx, dy) > moveThreshold) {
          isDragging = true;
          wasDragging = true;
          clearLongPressTimer();
        }
        if (isDragging) {
          ev.preventDefault();
          const left = ev.clientX - offsetX;
          const top = ev.clientY - offsetY;
          container.style.left = Math.max(6, Math.min(window.innerWidth - container.offsetWidth - 6, left)) + 'px';
          container.style.top = Math.max(6, Math.min(window.innerHeight - container.offsetHeight - 6, top)) + 'px';
          container.style.right = 'auto';
          container.style.bottom = 'auto';
        }
      }

      function onMouseUp() {
        clearLongPressTimer();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        // mark we were dragging briefly to suppress next click
        if (wasDragging) {
          setTimeout(() => { wasDragging = false; }, 120);
        }
        saveState();
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    // Touch events for drag + long-press
    circle.addEventListener('touchstart', function (e) {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      dragStartX = touch.clientX;
      dragStartY = touch.clientY;
      const rect = container.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;

      isDragging = false;
      wasDragging = false;

      if (!circle.classList.contains('expanded')) startLongPress();

      function onTouchMove(ev) {
        if (!ev.touches || ev.touches.length === 0) return;
        const t = ev.touches[0];
        const dx = t.clientX - dragStartX;
        const dy = t.clientY - dragStartY;
        const moveThreshold = 6;
        if (!isDragging && Math.hypot(dx, dy) > moveThreshold) {
          isDragging = true;
          wasDragging = true;
          clearLongPressTimer();
        }
        if (isDragging) {
          ev.preventDefault();
          const left = t.clientX - offsetX;
          const top = t.clientY - offsetY;
          container.style.left = Math.max(6, Math.min(window.innerWidth - container.offsetWidth - 6, left)) + 'px';
          container.style.top = Math.max(6, Math.min(window.innerHeight - container.offsetHeight - 6, top)) + 'px';
          container.style.right = 'auto';
          container.style.bottom = 'auto';
        }
      }

      function onTouchEnd() {
        clearLongPressTimer();
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        if (wasDragging) {
          setTimeout(() => { wasDragging = false; }, 120);
        }
        saveState();
      }

      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }, { passive: false });

    // Menu items click handling (open links)
    document.querySelectorAll('.RX-SMART-BUTTON-menu-item').forEach((item) => {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        const link = this.getAttribute('data-link');
        if (!link || link === '#') return;
        if (link.startsWith('http') || link.startsWith('mailto')) {
          window.open(link, '_blank', 'noopener');
        } else {
          window.location.href = link;
        }
      });
    });

    // Accessibility: keyboard toggle (space/enter)
    circle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        circle.classList.toggle('expanded');
        saveState();
      }
    });
  }

  /**
   * ===============================
   * Popup button wiring (Save & Cancel)
   * - overlay click will be swallowed (no close)
   * - only Cancel or Save closes the popup
   * ===============================
   */
  function setupPopupControls() {
    const saveBtn = document.getElementById('RX-save-hide');
    const cancelBtn = document.getElementById('RX-cancel-hide');
    const overlay = document.getElementById('RX-popup-overlay');

    if (!saveBtn || !cancelBtn || !overlay) return;

    // overlay should NOT close popup on click (per requirement)
    overlay.addEventListener('click', (e) => {
      // Do nothing intentionally — prevents accidental closing
      e.stopPropagation();
    });

    // Save & Hide
    saveBtn.addEventListener('click', () => {
      const hours = parseInt(document.getElementById('RX-hide-hours').value || '0', 10) || 0;
      const minutes = parseInt(document.getElementById('RX-hide-minutes').value || '0', 10) || 0;
      const seconds = parseInt(document.getElementById('RX-hide-seconds').value || '0', 10) || 0;
      const ms = (hours * 3600 + minutes * 60 + seconds) * 1000;

      if (ms > 0) {
        hideUntil = Date.now() + ms;
        localStorage.setItem('RX-SMART-BUTTON-hide-until', hideUntil.toString());
        startHideTimer();
      } else {
        // if zero, we don't hide — just close popup
      }
      closeHidePopup();
    });

    // Cancel only closes popup and does NOT change hide timer
    cancelBtn.addEventListener('click', () => {
      closeHidePopup();
    });

    // Prevent keyboard ESC from closing popup to satisfy "only Cancel closes"
    window.addEventListener('keydown', (e) => {
      const overlayVisible = overlay.classList.contains('show');
      if (overlayVisible && e.key === 'Escape') {
        e.preventDefault();
        // do nothing — require Cancel button
      }
    });
  }

  /**
   * ===============================
   * Initialization
   * ===============================
   */
  function init() {
    // Avoid double-init
    if (window.__RX_SMART_BUTTON_INITIALIZED__) return;
    window.__RX_SMART_BUTTON_INITIALIZED__ = true;

    injectCSS();
    injectHTML();

    // Small delay so elements exist
    setTimeout(() => {
      loadStateAndApply();
      setupInteractions();
      setupPopupControls();

      // Ensure save on unload
      window.addEventListener('beforeunload', saveState);
    }, 40);
  }

  // DOM Ready or fallback
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Extra safety: run once more shortly after load (no duplication thanks to flag)
  setTimeout(init, 600);
})();
