// ============================================================
// 10-trigger.js - Trigger Setup + Auto Floating Button
// (FINAL: responsive size + fast fallback + refined drag/click + self icon)
// ============================================================

function setupTrigger() {
  const chatWindow = document.getElementById('rx-chat-window');
  if (!chatWindow) return;

  // ============================================================
  // 🎯 ICON SOURCE — यहीँबाट सबै ठाउँमा
  // ============================================================
  const TRIGGER_ICON =
    'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/BOT-PROFILE-1.png';
  // ↑ नयाँ icon चाहिए यही line बदल्नुहोस्

  // ============================================================
  // OPEN / CLOSE HELPERS
  // ============================================================
  function openChatWindow() {
    chatWindow.classList.add('show');
    saveWindowState(true);

    const circle = document.querySelector('.RX-SMART-BUTTON-circle');
    if (circle) circle.classList.remove('expanded');

    hideAutoTrigger();

    const messageContainer = document.getElementById('rx-chat-messages');
    if (messageContainer && messageContainer.children.length === 0) {
      if (typeof showWelcomeSequence === 'function') showWelcomeSequence();
    }
  }

  function hideAutoTrigger() {
    const btn = document.getElementById('rx-auto-trigger');
    if (btn && btn.style.display !== 'none') {
      btn.style.opacity = '0';
      btn.style.transform = 'scale(0.6)';
      setTimeout(() => { btn.style.display = 'none'; }, 250);
    }
  }

  function showAutoTrigger() {
    const btn = document.getElementById('rx-auto-trigger');
    if (btn && btn.style.display === 'none') {
      btn.style.display = 'flex';
      requestAnimationFrame(() => {
        btn.style.opacity = '1';
        btn.style.transform = 'scale(1)';
      });
    }
  }

  // ============================================================
  // WATCH WINDOW CLOSE → button फेरि देखाउने
  // ============================================================
  function watchWindowClose() {
    const observer = new MutationObserver(() => {
      const isOpen = chatWindow.classList.contains('show');
      const btn = document.getElementById('rx-auto-trigger');
      if (!btn) return;
      if (isOpen) {
        if (btn.style.display !== 'none') hideAutoTrigger();
      } else {
        if (btn.style.display === 'none') showAutoTrigger();
      }
    });
    observer.observe(chatWindow, { attributes: true, attributeFilter: ['class'] });
  }

  // ============================================================
  // SMART BUTTON TRIGGER BIND (RX-item-9)
  // ============================================================
  function bindClick(element) {
    if (!element || element.dataset.rxTriggerAttached === '1') return !!element;
    element.dataset.rxTriggerAttached = '1';
    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      openChatWindow();
    }, true);
    return true;
  }

  function tryAttach() {
    const item9 = document.querySelector('.RX-SMART-BUTTON-menu-item.RX-item-9');
    if (item9) return bindClick(item9);

    const imgs = document.querySelectorAll('img[src*="BOT-PROFILE"]');
    for (const img of imgs) {
      const parent = img.closest('.RX-SMART-BUTTON-menu-item');
      if (parent) return bindClick(parent);
    }
    return false;
  }

  // ============================================================
  // SMART BUTTON को ICON SYNC (auto button मा copy)
  // ============================================================
  function syncIconFromSmartButton() {
    const item9 = document.querySelector('.RX-SMART-BUTTON-menu-item.RX-item-9');
    const img = item9?.querySelector('img');
    if (img) {
      return img.getAttribute('src') || img.src || null;
    }
    return null;
  }

  if (tryAttach()) {
    watchWindowClose();
    return;
  }

  // ============================================================
  // AUTO BUTTON STATE
  // ============================================================
  let observer = null;
  let attempts = 0;
  const MAX_ATTEMPTS = 50;
  let autoTriggerCreated = false;
  let lateObserver = null;

  function createAutoTriggerOnce() {
    if (autoTriggerCreated) return;
    if (document.querySelector('[data-rx-trigger-attached="1"]')) return;
    if (document.getElementById('rx-auto-trigger')) return;

    autoTriggerCreated = true;
    if (observer) { observer.disconnect(); observer = null; }

    createAutoTrigger();
    watchWindowClose();

    // Late smart button आए auto button हटाउने
    lateObserver = new MutationObserver(() => {
      if (tryAttach()) {
        const autoBtn = document.getElementById('rx-auto-trigger');
        if (autoBtn) {
          autoBtn.style.opacity = '0';
          autoBtn.style.transform = 'scale(0.6)';
          setTimeout(() => autoBtn.remove(), 250);
        }
        autoTriggerCreated = false;
        if (lateObserver) { lateObserver.disconnect(); lateObserver = null; }
        watchWindowClose();
      }
    });
    lateObserver.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      if (lateObserver) { lateObserver.disconnect(); lateObserver = null; }
    }, 15000);
  }

  // ============================================================
  // MUTATION OBSERVER — smart button पछि load हुन सक्छ
  // ============================================================
  observer = new MutationObserver(() => {
    attempts++;
    if (tryAttach()) {
      observer.disconnect();
      observer = null;
      watchWindowClose();
      return;
    }
    if (attempts >= MAX_ATTEMPTS) {
      observer.disconnect();
      observer = null;
      createAutoTriggerOnce();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // ============================================================
  // FAST FALLBACK — 1.5s भित्र trigger नभेटिए → auto button
  // ============================================================
  setTimeout(() => {
    if (!document.querySelector('[data-rx-trigger-attached="1"]')) {
      createAutoTriggerOnce();
    } else {
      if (observer) { observer.disconnect(); observer = null; }
      watchWindowClose();
    }
  }, 1500);

  // ============================================================
  // SAFETY NET — 5s पछि observer बन्द + button guarantee
  // ============================================================
  setTimeout(() => {
    if (observer) { observer.disconnect(); observer = null; }
    if (!document.getElementById('rx-auto-trigger') &&
        !document.querySelector('[data-rx-trigger-attached="1"]')) {
      createAutoTriggerOnce();
    }
  }, 5000);

  // ============================================================
  // CREATE DRAGGABLE FLOATING BUTTON (responsive size)
  // ============================================================
  function createAutoTrigger() {
    const btn = document.createElement('button');
    btn.id = 'rx-auto-trigger';
    btn.setAttribute('aria-label', 'Open ROSAN KC Assistant');
    btn.setAttribute('title', 'Open ROSAN KC AI Assistant');

    // ============================================================
    // 📐 RESPONSIVE SIZE CALCULATION
    // ============================================================
    function calculateButtonSize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const minSide = Math.min(w, h);

      let size;
      if (w <= 480) {
        size = 44;              // Mobile: touch-friendly min
      } else if (w <= 768) {
        size = 52;              // Tablet
      } else if (w <= 1200) {
        size = 48;              // Standard desktop
      } else {
        size = 56;              // Large desktop
      }

      if (h < 600) size = Math.min(size, 44);       // Landscape
      if (minSide < 360) size = Math.min(size, 40); // Tiny device

      return size;
    }

    // ===== Icon resolve (3-step) =====
    const iconFromSmart = syncIconFromSmartButton();
    const finalIcon =
      iconFromSmart ||
      TRIGGER_ICON ||
      (typeof config !== 'undefined' && config.images && config.images.botAvatar) ||
      'RX_45537_F0LD3R_2061/RX_1M463_45537_F0LD3R/RX_1M463_FUNC710N_1C0N/BOT-PROFILE-1.png';

    console.log('[RX] Auto button icon:', finalIcon);

    const img = document.createElement('img');
    img.src = finalIcon;
    img.alt = 'AI';
    img.style.cssText = `
      width: 85%; height: 85%;
      object-fit: contain;
      pointer-events: none;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
    `;
    img.onerror = () => {
      console.warn('[RX] Icon failed:', finalIcon, '→ emoji fallback');
      img.style.display = 'none';
      btn.textContent = '🤖';
      btn.style.fontSize = '18px';
    };
    btn.appendChild(img);

    // ===== Base style =====
    btn.style.cssText = `
      position: fixed;
      bottom: 100px; right: 20px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, rgba(173,216,230,0.9), rgba(70,130,180,0.7));
      border: 1px solid rgba(255,255,255,0.3);
      box-shadow: 0 0 15px rgba(173,216,230,0.6);
      cursor: grab;
      z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      opacity: 0;
      transform: scale(0.6);
      transition: opacity 0.25s ease, transform 0.25s ease, box-shadow 0.2s ease;
      touch-action: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      padding: 0;
      overflow: hidden;
    `;

    // ============================================================
    // 🎯 APPLY RESPONSIVE SIZE
    // ============================================================
    function applyButtonSize() {
      const size = calculateButtonSize();
      btn.style.width = size + 'px';
      btn.style.height = size + 'px';
      btn.style.fontSize = Math.round(size * 0.4) + 'px';
      console.log('[RX] Button size:', size + 'px (viewport: ' + window.innerWidth + 'x' + window.innerHeight + ')');
    }

    applyButtonSize();

    // ===== Hover =====
    btn.addEventListener('mouseenter', () => {
      if (!btn.__dragging) btn.style.boxShadow = '0 0 22px rgba(173,216,230,1)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.boxShadow = '0 0 15px rgba(173,216,230,0.6)';
    });

    // ============================================================
    // 📱 RESIZE HANDLER — screen resize भए size update
    // ============================================================
    let resizeTimer = null;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        applyButtonSize();
        clampPosition();
      }, 200);
    }
    window.addEventListener('resize', onResize);

    function clampPosition() {
      const rect = btn.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        btn.style.left = (window.innerWidth - rect.width - 6) + 'px';
        btn.style.right = 'auto';
      }
      if (rect.bottom > window.innerHeight) {
        btn.style.top = (window.innerHeight - rect.height - 6) + 'px';
        btn.style.bottom = 'auto';
      }
    }

    // ===== Load saved position =====
    try {
      const saved = localStorage.getItem('rx-auto-trigger-pos');
      if (saved) {
        const pos = JSON.parse(saved);
        if (pos.left != null && pos.top != null) {
          btn.style.left = pos.left + 'px';
          btn.style.top = pos.top + 'px';
          btn.style.right = 'auto';
          btn.style.bottom = 'auto';
        }
      }
    } catch (e) {}

    // ===== Append + fade-in =====
    document.body.appendChild(btn);
    requestAnimationFrame(() => {
      btn.style.opacity = '1';
      btn.style.transform = 'scale(1)';
      clampPosition();
    });

    // ============================================================
    // REFINED DRAG + CLICK SEPARATION
    // ============================================================
    let dragConfirmed = false;
    let pointerStartX = 0, pointerStartY = 0;
    let offsetX = 0, offsetY = 0;
    let activePointerId = null;
    let lastDragEndTime = 0;
    let currentLeft = 0, currentTop = 0;

    const DRAG_THRESHOLD = 8;
    const CLICK_SUPPRESS_MS = 400;

    function isClickSuppressed() {
      return Date.now() - lastDragEndTime < CLICK_SUPPRESS_MS;
    }

    function onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      activePointerId = e.pointerId;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      const rect = btn.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      dragConfirmed = false;
      btn.__dragging = false;
      btn.style.cursor = 'grabbing';
      try { btn.setPointerCapture(e.pointerId); } catch (err) {}
    }

    function onPointerMove(e) {
      if (activePointerId === null || e.pointerId !== activePointerId) return;
      const dx = e.clientX - pointerStartX;
      const dy = e.clientY - pointerStartY;
      if (!dragConfirmed && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        dragConfirmed = true;
        btn.__dragging = true;
        document.body.style.userSelect = 'none';
        btn.style.transform = 'scale(1.15)';
        btn.style.boxShadow = '0 0 22px rgba(173,216,230,1)';
      }
      if (!dragConfirmed) return;
      e.preventDefault();
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      const bw = btn.offsetWidth;
      const bh = btn.offsetHeight;
      newLeft = Math.max(6, Math.min(window.innerWidth - bw - 6, newLeft));
      newTop = Math.max(6, Math.min(window.innerHeight - bh - 6, newTop));
      btn.style.left = newLeft + 'px';
      btn.style.top = newTop + 'px';
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
      currentLeft = newLeft;
      currentTop = newTop;
    }

    function onPointerUp(e) {
      if (activePointerId === null || e.pointerId !== activePointerId) return;
      try { btn.releasePointerCapture(e.pointerId); } catch (err) {}
      btn.style.cursor = 'grab';
      document.body.style.userSelect = '';
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 0 15px rgba(173,216,230,0.6)';
      if (dragConfirmed) {
        lastDragEndTime = Date.now();
        try {
          localStorage.setItem(
            'rx-auto-trigger-pos',
            JSON.stringify({ left: currentLeft, top: currentTop })
          );
        } catch (err) {}
      }
      setTimeout(() => {
        dragConfirmed = false;
        btn.__dragging = false;
        activePointerId = null;
      }, 50);
    }

    // ===== Attach pointer events =====
    if (window.PointerEvent) {
      btn.addEventListener('pointerdown', onPointerDown);
      btn.addEventListener('pointermove', onPointerMove);
      btn.addEventListener('pointerup', onPointerUp);
      btn.addEventListener('pointercancel', onPointerUp);
    } else {
      btn.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);
      btn.addEventListener('touchstart', onPointerDown, { passive: false });
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp);
    }

    // ============================================================
    // CLICK → OPEN CHAT (drag suppress)
    // ============================================================
    btn.addEventListener('click', (e) => {
      if (isClickSuppressed()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      openChatWindow();
    }, true);

    console.log('[RX] Auto trigger button created ');
  }
}