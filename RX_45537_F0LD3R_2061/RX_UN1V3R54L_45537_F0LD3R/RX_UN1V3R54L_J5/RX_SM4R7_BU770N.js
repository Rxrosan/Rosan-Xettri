
//==========================================================// 
//                       RX_SMART_BUTTON                    //
// =========================================================//
(function () {
  'use strict';

  // ============================================================
  // THEMES (blue / silver) with custom center logo
  // ============================================================
  const themes = {
    blue: {
      name: 'blue',
      centerGradient: 'radial-gradient(circle at 30% 30%, rgba(173,216,230,0.9) 0%, rgba(70,130,180,0.7) 100%)',
      glow: '0 0 15px rgba(173,216,230,0.6)',
      border: '1px solid rgba(173,216,230,0.4)',
      iconHighlight: 'rgba(173,216,230,0.7)',
      centerLogoUrl: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_L0605/L-1.gif',
      fallbackLogo: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_L0605/L-1.gif'
    },
    silver: {
      name: 'silver',
      centerGradient: 'radial-gradient(circle at 30% 30%, rgba(220,220,220,0.9) 0%, rgba(169,169,169,0.7) 100%)',
      glow: '0 0 15px rgba(220,220,220,0.6)',
      border: '1px solid rgba(220,220,220,0.4)',
      iconHighlight: 'rgba(220,220,220,0.7)',
      centerLogoUrl: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_L0605/L-1.gif',
      fallbackLogo: 'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_L0605/L-1.gif'
    }
  };

  let themeKeys = Object.keys(themes);
  let currentThemeIndex = 0;
  let hideTimer = null;
  let hideUntil = null;
  let currentCenterImg = null;

  // ============================================================
  // CSS (includes bounce keyframes + drag-prevention)
  // ============================================================
  const css = `
  :root {
    --rx-circle-size: 2.2cm;
    --rx-menu-item-size: 1.6cm;
    --rx-center-size: 0.9cm;
    --rx-menu-distance: 4.2cm;
    --rx-glass-blur: 4px;
    --rx-glass-border: 1px solid rgba(255,255,255,0.15);
    --rx-glass-highlight: 0 0 15px rgba(173,216,230,0.6);
    --rx-center-gradient: ${themes.blue.centerGradient};
    --rx-icon-highlight: ${themes.blue.iconHighlight};
  }

  /* ----- prevent text selection while dragging ----- */
  .RX-SMART-BUTTON-container,
  .RX-SMART-BUTTON-circle,
  .RX-SMART-BUTTON-container * {
    user-select: none !important;
    -webkit-user-select: none !important;
    -webkit-touch-callout: none !important;
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
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    background: radial-gradient(circle at 65% 35%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.1) 70%);
    box-shadow: var(--rx-glass-highlight), inset 0 0 14px rgba(255,255,255,0.06);
    border: var(--rx-glass-border);
    backdrop-filter: blur(var(--rx-glass-blur));
    -webkit-backdrop-filter: blur(var(--rx-glass-blur));
    touch-action: none;
  }
  .RX-SMART-BUTTON-circle:active { transform: scale(0.98); }

  /* ----- center point with logo image ----- */
  .RX-SMART-BUTTON-center-point {
    width: var(--rx-center-size);
    height: var(--rx-center-size);
    border-radius: 50%;
    background: var(--rx-center-gradient);
    box-shadow: inset 0 0 10px rgba(255,255,255,0.45);
    border: var(--rx-glass-border);
    transition: background 0.3s ease, opacity 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    touch-action: none;
  }
  .RX-center-logo-img {
    width: 70%;
    height: 70%;
    object-fit: contain;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
    transition: opacity 0.2s ease;
  }

  /* ----- menu items with BOUNCE animation (from bounce.html) ----- */
  .RX-SMART-BUTTON-menu-item {
    position: absolute;
    width: var(--rx-menu-item-size);
    height: var(--rx-menu-item-size);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    border: var(--rx-glass-border);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    opacity: 0;
    transform: translate(0, 0) scale(0.4);
    transition: opacity 0.25s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
    box-shadow: 0 0 10px rgba(255,255,255,0.12), inset 0 0 8px rgba(255,255,255,0.06);
    touch-action: none;
  }
  .RX-SMART-BUTTON-menu-item img {
    width: 56%;
    height: 56%;
    object-fit: contain;
    transition: transform 0.16s ease, filter 0.16s ease;
    pointer-events: none;
  }
  .RX-SMART-BUTTON-menu-item:hover {
    background: rgba(255,255,255,0.22);
    box-shadow: 0 0 18px var(--rx-glass-highlight), inset 0 0 12px rgba(255,255,255,0.12);
  }
  .RX-SMART-BUTTON-menu-item:hover img { transform: scale(1.08); filter: brightness(1.05); }

  /* ----- EXPANDED state: items fly in with BOUNCE (position + scale) ----- */
  .RX-SMART-BUTTON-circle.expanded .RX-SMART-BUTTON-menu-item {
    opacity: 1;
    transform: translate(0, 0) scale(1);
    pointer-events: auto;
  }

  /* positions – up to 24 items (bounce positions) */
  .RX-SMART-BUTTON-circle.expanded .RX-item-1  { transform: rotate(15deg) translateX(var(--rx-menu-distance)) rotate(-15deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-2  { transform: rotate(45deg) translateX(var(--rx-menu-distance)) rotate(-45deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-3  { transform: rotate(75deg) translateX(var(--rx-menu-distance)) rotate(-75deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-4  { transform: rotate(105deg) translateX(var(--rx-menu-distance)) rotate(-105deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-5  { transform: rotate(135deg) translateX(var(--rx-menu-distance)) rotate(-135deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-6  { transform: rotate(165deg) translateX(var(--rx-menu-distance)) rotate(-165deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-7  { transform: rotate(195deg) translateX(var(--rx-menu-distance)) rotate(-195deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-8  { transform: rotate(225deg) translateX(var(--rx-menu-distance)) rotate(-225deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-9  { transform: rotate(255deg) translateX(var(--rx-menu-distance)) rotate(-255deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-10 { transform: rotate(285deg) translateX(var(--rx-menu-distance)) rotate(-285deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-11 { transform: rotate(315deg) translateX(var(--rx-menu-distance)) rotate(-315deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-12 { transform: rotate(345deg) translateX(var(--rx-menu-distance)) rotate(-345deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-13 { transform: rotate(30deg) translateX(var(--rx-menu-distance)) rotate(-30deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-14 { transform: rotate(60deg) translateX(var(--rx-menu-distance)) rotate(-60deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-15 { transform: rotate(90deg) translateX(var(--rx-menu-distance)) rotate(-90deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-16 { transform: rotate(120deg) translateX(var(--rx-menu-distance)) rotate(-120deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-17 { transform: rotate(150deg) translateX(var(--rx-menu-distance)) rotate(-150deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-18 { transform: rotate(180deg) translateX(var(--rx-menu-distance)) rotate(-180deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-19 { transform: rotate(210deg) translateX(var(--rx-menu-distance)) rotate(-210deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-20 { transform: rotate(240deg) translateX(var(--rx-menu-distance)) rotate(-240deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-21 { transform: rotate(270deg) translateX(var(--rx-menu-distance)) rotate(-270deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-22 { transform: rotate(300deg) translateX(var(--rx-menu-distance)) rotate(-300deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-23 { transform: rotate(330deg) translateX(var(--rx-menu-distance)) rotate(-330deg) scale(1); }
  .RX-SMART-BUTTON-circle.expanded .RX-item-24 { transform: rotate(360deg) translateX(var(--rx-menu-distance)) rotate(-360deg) scale(1); }

  /* ----- popup overlay (bounce on open) ----- */
  .RX-popup-overlay {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 100001;
    background: rgba(0,0,0,0.45);
    display: none;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px);
  }
  .RX-popup-overlay.show { display: flex; }
  .RX-hide-settings-popup {
    min-width: 280px;
    max-width: 92%;
    padding: 22px 20px 20px;
    border-radius: 16px;
    background: rgba(255,255,255,0.10);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: var(--rx-glass-border);
    box-shadow: 0 12px 40px rgba(0,0,0,0.55);
    color: white;
    z-index: 100002;
    animation: popupBounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes popupBounceIn {
    0% { opacity: 0; transform: scale(0.7) translateY(20px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  .RX-hide-settings-popup h3 {
    margin: 0 0 14px 0;
    font-size: 18px;
    text-align: center;
    font-weight: 500;
    letter-spacing: 0.3px;
  }
  .RX-time-inputs { display: flex; gap: 10px; justify-content: center; margin-bottom: 16px; flex-wrap: wrap; }
  .RX-time-input { display: flex; flex-direction: column; align-items: center; min-width: 60px; }
  .RX-time-input label { font-size: 12px; margin-bottom: 6px; color: #fff; opacity: 0.9; }
  .RX-time-input input {
    width: 68px; padding: 8px; border-radius: 8px; border: var(--rx-glass-border);
    background: rgba(255,255,255,0.08); color: white; text-align: center;
    outline: none;
  }
  .RX-time-input input:focus { border-color: rgba(173,216,230,0.6); }
  .RX-popup-buttons { display: flex; gap: 12px; justify-content: center; margin-top: 6px; }
  .RX-popup-btn {
    padding: 8px 16px; border-radius: 8px; border: var(--rx-glass-border);
    background: rgba(255,255,255,0.10); color: white; cursor: pointer;
    transition: 0.15s ease;
    font-size: 14px;
  }
  .RX-popup-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.35); background: rgba(255,255,255,0.18); }

  /* responsive */
  @media (max-width: 768px) {
    :root { --rx-circle-size:2cm; --rx-menu-item-size:1.4cm; --rx-center-size:0.8cm; --rx-menu-distance:3.8cm; --rx-glass-blur:3px; }
    .RX-popup-btn { padding:6px 12px; }
  }
  @media (max-width: 480px) {
    :root { --rx-circle-size:1.8cm; --rx-menu-item-size:1.2cm; --rx-center-size:0.7cm; --rx-menu-distance:3.2cm; }
  }
  `;

  // ============================================================
  // INJECT CSS
  // ============================================================
  function injectCSS() {
    const style = document.createElement('style');
    style.id = 'rx-smart-button-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ============================================================
  // HTML (with 24 menu items – 12 blue + 12 silver)
  // ============================================================
  const injectedHTML = `
  <div class="RX-SMART-BUTTON-container" aria-hidden="false">
    <div class="RX-SMART-BUTTON-circle" role="button" aria-label="Smart button">
      <div class="RX-SMART-BUTTON-center-point" aria-hidden="true">
        <img class="RX-center-logo-img" id="RX-center-logo-img" alt="center logo" src="">
      </div>

      <!-- Blue items (1-12) -->
      <div class="RX-SMART-BUTTON-menu-item RX-item-1 blue-item" data-link="Contact.html"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/contact.png" alt="contact"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-2 blue-item" data-link="User-profile.html"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="user"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-3 blue-item" data-link="#"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_L0605/L-6.gif" alt="logo"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-4 blue-item" data-link="https://x.com/Rx_Rosan"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/xcorp.png" alt="xcorp"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-5 blue-item" data-link="mailto:rkc242855@gmail.com"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/email.png" alt="email"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-6 blue-item" data-link="https://www.youtube.com/@RX_E-SPORTS"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/youtube.png" alt="youtube"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-7 blue-item" data-link=""><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/RX-MUSIC.png" alt="music"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-8 blue-item" data-link="Resource.html"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/store.png" alt="store"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-9 blue-item" data-link=""><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/BOT-PROFILE-1.png" alt="chat"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-10 blue-item" data-link="https://rosankc.com.np/"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/home.png" alt="home"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-11 blue-item" data-link="About.html"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/about.png" alt="about"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-12 blue-item" data-link="Service.html"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/service.png" alt="service"></div>

      <!-- Silver items (13-24) hidden by default -->
      <div class="RX-SMART-BUTTON-menu-item RX-item-13 silver-item" data-link="https://rosankc.com.np" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/BOT-PROFILE.png" alt="item13"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-14 silver-item" data-link="#" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="item14"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-15 silver-item" data-link="#" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="item15"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-16 silver-item" data-link="#" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="item16"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-17 silver-item" data-link="#" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="item17"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-18 silver-item" data-link="#" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="item18"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-19 silver-item" data-link="#" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="item19"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-20 silver-item" data-link="#" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="item20"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-21 silver-item" data-link="#" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="item21"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-22 silver-item" data-link="#" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="item22"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-23 silver-item" data-link="#" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="item23"></div>
      <div class="RX-SMART-BUTTON-menu-item RX-item-24 silver-item" data-link="#" style="display: none;"><img src="RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/user.png" alt="item24"></div>
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

  // ============================================================
  // CENTER LOGO
  // ============================================================
  function setCenterLogo(themeName) {
    const theme = themes[themeName];
    if (!theme) return;
    const centerImg = document.getElementById('RX-center-logo-img');
    if (!centerImg) return;
    const logoUrl = theme.centerLogoUrl;
    const applyFallback = () => {
      centerImg.src = theme.fallbackLogo;
      centerImg.style.opacity = '1';
    };
    if (logoUrl && logoUrl.trim() !== '') {
      centerImg.src = logoUrl;
      centerImg.onload = () => { centerImg.style.opacity = '1'; centerImg.onerror = null; };
      centerImg.onerror = () => { console.warn('[RX] logo fallback'); applyFallback(); };
    } else {
      applyFallback();
    }
  }

  // ============================================================
  // TOGGLE MENU ITEMS (blue / silver)
  // ============================================================
  function toggleMenuItems(themeName) {
    const blueItems = document.querySelectorAll('.blue-item');
    const silverItems = document.querySelectorAll('.silver-item');
    if (themeName === 'blue') {
      blueItems.forEach(item => item.style.display = 'flex');
      silverItems.forEach(item => item.style.display = 'none');
    } else if (themeName === 'silver') {
      blueItems.forEach(item => item.style.display = 'none');
      silverItems.forEach(item => item.style.display = 'flex');
    }
  }

  // ============================================================
  // THEME
  // ============================================================
  function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;
    document.documentElement.style.setProperty('--rx-glass-highlight', theme.glow);
    document.documentElement.style.setProperty('--rx-glass-border', theme.border);
    document.documentElement.style.setProperty('--rx-center-gradient', theme.centerGradient);
    document.documentElement.style.setProperty('--rx-icon-highlight', theme.iconHighlight);
    toggleMenuItems(themeName);
    setCenterLogo(themeName);
    localStorage.setItem('RX-SMART-BUTTON-theme', themeName);
    currentThemeIndex = themeKeys.indexOf(themeName);
    if (currentThemeIndex === -1) currentThemeIndex = 0;
  }

  function cycleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themeKeys.length;
    applyTheme(themeKeys[currentThemeIndex]);
  }

  // ============================================================
  // STATE PERSISTENCE
  // ============================================================
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
    const savedTheme = localStorage.getItem('RX-SMART-BUTTON-theme');
    if (savedTheme && themes[savedTheme]) {
      applyTheme(savedTheme);
    } else {
      applyTheme(themeKeys[currentThemeIndex]);
    }
    const hideItem = localStorage.getItem('RX-SMART-BUTTON-hide-until');
    if (hideItem) {
      const timeVal = parseInt(hideItem, 10);
      if (!Number.isNaN(timeVal)) {
        hideUntil = timeVal;
        startHideTimer();
      } else {
        localStorage.removeItem('RX-SMART-BUTTON-hide-until');
      }
    }
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
      } catch (err) { console.error('RX state parse error:', err); }
    }
  }

  // ============================================================
  // HIDE / SHOW + TIMER
  // ============================================================
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
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    if (!hideUntil) return;
    const now = Date.now();
    const left = hideUntil - now;
    if (left > 0) {
      hideSmartButton();
      hideTimer = setTimeout(() => {
        showSmartButton();
        localStorage.removeItem('RX-SMART-BUTTON-hide-until');
        hideUntil = null;
        hideTimer = null;
      }, left);
    } else {
      localStorage.removeItem('RX-SMART-BUTTON-hide-until');
      hideUntil = null;
      showSmartButton();
    }
  }

  // ============================================================
  // POPUP
  // ============================================================
  function showHidePopup() {
    const overlay = document.getElementById('RX-popup-overlay');
    if (!overlay) return;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeHidePopup() {
    const overlay = document.getElementById('RX-popup-overlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ============================================================
  // INTERACTIONS (drag, click, long-press, menu clicks)
  // ============================================================
  function setupInteractions() {
    const circle = document.querySelector('.RX-SMART-BUTTON-circle');
    const container = document.querySelector('.RX-SMART-BUTTON-container');
    if (!circle || !container) return;

    let isDragging = false;
    let wasDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let offsetX = 0, offsetY = 0;
    let longPressTimer = null;
    const LONG_PRESS_MS = 3000;

    function clearLongPressTimer() {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
    }

    // ---- CLICK: toggle menu (with bounce) ----
    circle.addEventListener('click', function (e) {
      if (wasDragging) { wasDragging = false; return; }
      if (e.target.closest('.RX-SMART-BUTTON-menu-item')) return;
      this.classList.toggle('expanded');
      saveState();
    });

    // ---- DOUBLE-CLICK center: cycle theme ----
    const centerPoint = circle.querySelector('.RX-SMART-BUTTON-center-point');
    if (centerPoint) {
      centerPoint.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        cycleTheme();
      });
    }

    // ---- LONG PRESS: show hide popup ----
    function startLongPress() {
      clearLongPressTimer();
      longPressTimer = setTimeout(() => {
        if (circle.classList.contains('expanded')) return;
        showHidePopup();
      }, LONG_PRESS_MS);
    }

    // ---- MOUSE DRAG ----
    circle.addEventListener('mousedown', function (e) {
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      const rect = container.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      isDragging = false;
      wasDragging = false;
      if (!circle.classList.contains('expanded')) startLongPress();

      function onMouseMove(ev) {
        const dx = ev.clientX - dragStartX;
        const dy = ev.clientY - dragStartY;
        const moveThreshold = 6;
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
        if (wasDragging) { setTimeout(() => { wasDragging = false; }, 120); }
        saveState();
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    // ---- TOUCH DRAG ----
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
        if (wasDragging) { setTimeout(() => { wasDragging = false; }, 120); }
        saveState();
      }

      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }, { passive: false });

    // ---- MENU ITEM CLICK ----
    document.querySelectorAll('.RX-SMART-BUTTON-menu-item').forEach((item) => {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        const link = this.getAttribute('data-link');
        if (!link || link === '') return;
        if (link.startsWith('http') || link.startsWith('mailto')) {
          window.open(link, '_blank', 'noopener');
        } else {
          window.location.href = link;
        }
      });
    });

    // ---- KEYBOARD ----
    circle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        circle.classList.toggle('expanded');
        saveState();
      }
    });
  }

  // ============================================================
  // POPUP CONTROLS
  // ============================================================
  function setupPopupControls() {
    const saveBtn = document.getElementById('RX-save-hide');
    const cancelBtn = document.getElementById('RX-cancel-hide');
    const overlay = document.getElementById('RX-popup-overlay');
    if (!saveBtn || !cancelBtn || !overlay) return;

    overlay.addEventListener('click', (e) => { e.stopPropagation(); });

    saveBtn.addEventListener('click', () => {
      const hours = parseInt(document.getElementById('RX-hide-hours').value || '0', 10) || 0;
      const minutes = parseInt(document.getElementById('RX-hide-minutes').value || '0', 10) || 0;
      const seconds = parseInt(document.getElementById('RX-hide-seconds').value || '0', 10) || 0;
      const ms = (hours * 3600 + minutes * 60 + seconds) * 1000;
      if (ms > 0) {
        hideUntil = Date.now() + ms;
        localStorage.setItem('RX-SMART-BUTTON-hide-until', hideUntil.toString());
        startHideTimer();
      }
      closeHidePopup();
    });

    cancelBtn.addEventListener('click', closeHidePopup);

    window.addEventListener('keydown', (e) => {
      if (overlay.classList.contains('show') && e.key === 'Escape') {
        e.preventDefault();
        closeHidePopup();
      }
    });
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    if (window.__RX_SMART_BUTTON_BOUNCE_INIT__) return;
    window.__RX_SMART_BUTTON_BOUNCE_INIT__ = true;

    injectCSS();
    injectHTML();

    setTimeout(() => {
      loadStateAndApply();
      setupInteractions();
      setupPopupControls();
      window.addEventListener('beforeunload', saveState);
    }, 40);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  setTimeout(init, 600);
})();