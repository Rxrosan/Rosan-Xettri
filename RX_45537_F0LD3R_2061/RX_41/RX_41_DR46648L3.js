// ============================================================
// 09-draggable.js - Dynamic Mouse Events (SCROLL FIXED)
// ============================================================

function makeDraggable(element, handle) {
  let isDragging = false;
  let startX = 0, startY = 0;
  let startClientX = 0, startClientY = 0;
  let currentX = 0, currentY = 0;
  let isTouchDevice = ('ontouchstart' in window);
  let isFirstDrag = true;
  let dragStarted = false;
  
  const DRAG_THRESHOLD = 5;
  const LONG_PRESS_DELAY = 300;
  let pressTimer = null;

  function getClientCoordinates(e) {
    if (e.type && e.type.startsWith('touch')) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { clientX: touch.clientX, clientY: touch.clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  }

  function getElementPosition() {
    const rect = element.getBoundingClientRect();
    if (isFirstDrag && element.style.transform === 'translate(-50%, -50%)') {
      const centerX = window.innerWidth / 2 - rect.width / 2;
      const centerY = window.innerHeight / 2 - rect.height / 2;
      element.style.left = centerX + 'px';
      element.style.top = centerY + 'px';
      element.style.transform = 'none';
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      isFirstDrag = false;
    }
    const newRect = element.getBoundingClientRect();
    return { left: newRect.left, top: newRect.top, width: newRect.width, height: newRect.height };
  }

  // ===== IGNORE SCROLLING =====
  function shouldIgnoreDrag(e) {
    const ignoreSelectors = [
      '#rx-close-btn',
      '.rx-input-area',
      '.rx-link-button',
      '.rx-send-icon',
      '#rx-send-btn',
      'input',
      'button',
      'a',
      '.rx-message',
      '.rx-avatar',
      '.rx-chat-messages',  // ← SCROLL AREA IGNORE
      '.rx-message-wrapper',
      '.rx-messages'
    ];
    
    for (const selector of ignoreSelectors) {
      if (e.target.closest(selector)) {
        return true;
      }
    }
    return false;
  }

  // ===== CHECK IF SCROLLING =====
  function isScrollingElement(target) {
    const scrollableSelectors = [
      '.rx-chat-messages',
      '.rx-message-wrapper',
      '.rx-messages'
    ];
    
    for (const selector of scrollableSelectors) {
      const el = target.closest(selector);
      if (el) {
        // Check if element has scrollable content
        const hasScroll = el.scrollHeight > el.clientHeight;
        if (hasScroll) {
          return true;
        }
      }
    }
    return false;
  }

  // ===== ACTUAL DRAG HANDLER =====
  function onDragMove(e) {
    e.preventDefault();
    
    const coords = getClientCoordinates(e);
    const deltaX = coords.clientX - startClientX;
    const deltaY = coords.clientY - startClientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (!dragStarted && distance > DRAG_THRESHOLD) {
      dragStarted = true;
      isDragging = true;
      element.classList.add('dragging');
      element.style.cursor = 'grabbing';
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }
    
    if (!dragStarted) {
      return;
    }
    
    let newLeft = coords.clientX - startX;
    let newTop = coords.clientY - startY;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const elemWidth = element.offsetWidth;
    const elemHeight = element.offsetHeight;
    
    if (newLeft < 0) newLeft = 0;
    if (newLeft + elemWidth > windowWidth) newLeft = windowWidth - elemWidth;
    if (newTop < 0) newTop = 0;
    if (newTop + elemHeight > windowHeight) newTop = windowHeight - elemHeight;
    
    element.style.left = newLeft + 'px';
    element.style.top = newTop + 'px';
    element.style.right = 'auto';
    element.style.bottom = 'auto';
    element.style.transform = 'none';
    currentX = newLeft;
    currentY = newTop;
  }

  // ===== START DRAG =====
  function startDrag(e) {
    // Ignore if clicking on scrollable area
    if (shouldIgnoreDrag(e)) return;
    
    // Check if target is in scrollable area
    if (isScrollingElement(e.target)) {
      return;
    }
    
    e.preventDefault();
    
    const coords = getClientCoordinates(e);
    startClientX = coords.clientX;
    startClientY = coords.clientY;
    
    const pos = getElementPosition();
    startX = coords.clientX - pos.left;
    startY = coords.clientY - pos.top;
    
    dragStarted = false;
    isDragging = false;
    
    if (!isTouchDevice) {
      window.addEventListener('mousemove', onDragMove);
      window.addEventListener('mouseup', stopDrag);
    } else {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
      pressTimer = setTimeout(() => {
        dragStarted = true;
        isDragging = true;
        element.classList.add('dragging');
        element.style.cursor = 'grabbing';
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
        pressTimer = null;
      }, LONG_PRESS_DELAY);
    }
  }

  // ===== STOP DRAG =====
  function stopDrag(e) {
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', stopDrag);
    
    element.style.cursor = '';
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    
    if (!dragStarted) {
      element.classList.remove('dragging');
      isDragging = false;
      return;
    }
    
    if (isDragging) {
      element.classList.remove('dragging');
      if (currentX !== undefined && currentY !== undefined) {
        saveWindowPosition(currentX, currentY);
      }
    }
    
    isDragging = false;
    dragStarted = false;
  }

  // ===== TOUCH EVENTS =====
  function onTouchMove(e) {
    // Allow touch scroll on messages
    const target = e.target.closest('.rx-chat-messages');
    if (target) {
      // Let browser handle scroll
      return;
    }
    
    e.preventDefault();
    
    const coords = getClientCoordinates(e);
    const deltaX = coords.clientX - startClientX;
    const deltaY = coords.clientY - startClientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (!dragStarted && distance > DRAG_THRESHOLD) {
      dragStarted = true;
      isDragging = true;
      element.classList.add('dragging');
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    }
    
    if (!dragStarted) {
      return;
    }
    
    let newLeft = coords.clientX - startX;
    let newTop = coords.clientY - startY;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const elemWidth = element.offsetWidth;
    const elemHeight = element.offsetHeight;
    
    if (newLeft < 0) newLeft = 0;
    if (newLeft + elemWidth > windowWidth) newLeft = windowWidth - elemWidth;
    if (newTop < 0) newTop = 0;
    if (newTop + elemHeight > windowHeight) newTop = windowHeight - elemHeight;
    
    element.style.left = newLeft + 'px';
    element.style.top = newTop + 'px';
    element.style.right = 'auto';
    element.style.bottom = 'auto';
    element.style.transform = 'none';
    currentX = newLeft;
    currentY = newTop;
  }

  function onTouchEnd(e) {
    element.style.cursor = '';
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    
    if (!dragStarted) {
      element.classList.remove('dragging');
      isDragging = false;
      return;
    }
    
    if (isDragging) {
      element.classList.remove('dragging');
      if (currentX !== undefined && currentY !== undefined) {
        saveWindowPosition(currentX, currentY);
      }
    }
    
    isDragging = false;
    dragStarted = false;
  }

  function cancelDrag() {
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', stopDrag);
    
    element.style.cursor = '';
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    if (isDragging || dragStarted) {
      element.classList.remove('dragging');
      isDragging = false;
      dragStarted = false;
    }
  }

  // ===== ATTACH EVENT LISTENERS =====
  element.addEventListener('mousedown', startDrag);
  
  if (isTouchDevice) {
    element.addEventListener('touchstart', startDrag, { passive: false });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    element.addEventListener('touchend', onTouchEnd);
    element.addEventListener('touchcancel', onTouchEnd);
  }
  
  window.addEventListener('blur', cancelDrag);
  
  element.addEventListener('selectstart', function(e) {
    if (isDragging || dragStarted) {
      e.preventDefault();
    }
  });

  element.__dragState = {
    isDragging: () => isDragging,
    dragStarted: () => dragStarted
  };
}