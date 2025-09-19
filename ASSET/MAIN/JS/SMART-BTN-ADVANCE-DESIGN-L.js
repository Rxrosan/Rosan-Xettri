// RX-SMART-BUTTON System with Liquid Glass Theme
(function() {
  // Color Themes
  const themes = {
    blue: {
      name: "blue",
      centerGradient: "radial-gradient(circle at 30% 30%, rgba(173, 216, 230, 0.9) 0%, rgba(70, 130, 180, 0.7) 100%)",
      glow: "0 0 15px rgba(173, 216, 230, 0.6)",
      border: "1px solid rgba(173, 216, 230, 0.4)",
      iconHighlight: "rgba(173, 216, 230, 0.7)"
    },
    silver: {
      name: "silver",
      centerGradient: "radial-gradient(circle at 30% 30%, rgba(220, 220, 220, 0.9) 0%, rgba(169, 169, 169, 0.7) 100%)",
      glow: "0 0 15px rgba(220, 220, 220, 0.6)",
      border: "1px solid rgba(220, 220, 220, 0.4)",
      iconHighlight: "rgba(220, 220, 220, 0.7)"
    },
  };

  let currentThemeIndex = 0;
  const themeKeys = Object.keys(themes);
  
  // 1. Inject Liquid Glass Theme CSS
  const liquidGlassCSS = `
  /* RX-SMART-BUTTON Liquid Glass Theme */
  :root {
    --RX-circle-size: 2.2cm;
    --RX-menu-item-size: 1.6cm;
    --RX-center-size: 0.9cm;
    --RX-menu-item-distance: 4.2cm;
    --RX-glass-blur: 4px;
    --RX-glass-border: 1px solid rgba(255, 255, 255, 0.2);
    --RX-glass-highlight: 0 0 15px rgba(173, 216, 230, 0.6);
    --RX-center-gradient: radial-gradient(circle at 30% 30%, rgba(173, 216, 230, 0.9) 0%, rgba(70, 130, 180, 0.7) 100%);
    --RX-icon-highlight: rgba(173, 216, 230, 0.7);
  }

  .RX-SMART-BUTTON-container {
    position: fixed;
    bottom: 45%;
    right: 25%;
    z-index: 1000;
    display: none;
    touch-action: none;
    filter: drop-shadow(0 0 10px rgba(135, 206, 250, 0.7));
  }

  .RX-SMART-BUTTON-circle {
    width: var(--RX-circle-size);
    height: var(--RX-circle-size);
    border-radius: 50%;
    position: relative;
    transition: all 0.5s cubic-bezier(0.17, 0.67, 0.32, 1.5);
    background: radial-gradient(
      circle at 65% 35%,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0.15) 30%,
      rgba(255, 255, 255, 0.1) 70%
    );
    backdrop-filter: blur(var(--RX-glass-blur));
    -webkit-backdrop-filter: blur(var(--RX-glass-blur));
    border: var(--RX-glass-border);
    box-shadow: 
      var(--RX-glass-highlight),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
  }

  .RX-SMART-BUTTON-center-point {
    width: var(--RX-center-size);
    height: var(--RX-center-size);
    background: var(--RX-center-gradient);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
    transition: opacity 0.5s ease-in-out, background 0.5s ease;
    box-shadow: 
      inset 0 0 10px rgba(255, 255, 255, 0.4),
      var(--RX-glass-highlight);
    border: var(--RX-glass-border);
  }

  .RX-SMART-BUTTON-menu-item {
    position: absolute;
    width: var(--RX-menu-item-size);
    height: var(--RX-menu-item-size);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    opacity: 0;
    transform: scale(0);
    transition: all 0.6s cubic-bezier(0.17, 0.67, 0.32, 1.3);
    cursor: pointer;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    border: var(--RX-glass-border);
    box-shadow: 
      0 0 10px rgba(255, 255, 255, 0.4),
      inset 0 0 10px rgba(255, 255, 255, 0.1);
    transform-origin: center;
  }

  .RX-SMART-BUTTON-menu-item img {
    width: 55%;
    height: 55%;
    object-fit: contain;
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.3));
  }

  .RX-SMART-BUTTON-circle.expanded .RX-SMART-BUTTON-menu-item {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  .RX-SMART-BUTTON-circle.expanded .RX-SMART-BUTTON-menu-item[style] {
    transform: rotate(calc(30deg * var(--index))) 
               translateX(var(--RX-menu-item-distance)) 
               rotate(calc(-30deg * var(--index)));
  }

  .RX-SMART-BUTTON-circle.expanded .RX-SMART-BUTTON-menu-item:hover {
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 
      0 0 15px var(--RX-glass-highlight),
      inset 0 0 15px rgba(255, 255, 255, 0.2);
  }

  .RX-SMART-BUTTON-circle.expanded .RX-SMART-BUTTON-menu-item:hover img {
    filter: brightness(1.1) drop-shadow(0 0 8px var(--RX-icon-highlight));
    transform: scale(1.1);
  }

  #RX-SMART-BUTTON-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1001;
    background: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.9);
    border: var(--RX-glass-border);
    border-radius: 50%;
    width: 42px;
    height: 42px;
    font-size: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    box-shadow: 
      0 0 10px rgba(255, 255, 255, 0.4),
      inset 0 0 10px rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    text-decoration: none;
  }

  #RX-SMART-BUTTON-toggle:hover {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 0 15px var(--RX-glass-highlight),
      inset 0 0 15px rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    :root {
      --RX-circle-size: 2cm;
      --RX-menu-item-size: 1.4cm;
      --RX-center-size: 0.8cm;
      --RX-menu-item-distance: 3.8cm;
      --RX-glass-blur: 3px;
    }
    
    .RX-SMART-BUTTON-container {
      bottom: 5vh;
      right: 5vw;
    }
  }

  @media (max-width: 480px) {
    :root {
      --RX-circle-size: 1.8cm;
      --RX-menu-item-size: 1.2cm;
      --RX-center-size: 0.7cm;
      --RX-menu-item-distance: 3.2cm;
    }
    
    #RX-SMART-BUTTON-toggle {
      width: 38px;
      height: 38px;
      font-size: 20px;
    }
  }
  `;

  // Create style element and inject CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = liquidGlassCSS;
  document.head.appendChild(styleElement);

  // Function to update theme
  function updateTheme() {
    const themeName = themeKeys[currentThemeIndex];
    const theme = themes[themeName];
    
    document.documentElement.style.setProperty('--RX-glass-highlight', theme.glow);
    document.documentElement.style.setProperty('--RX-glass-border', theme.border);
    document.documentElement.style.setProperty('--RX-center-gradient', theme.centerGradient);
    document.documentElement.style.setProperty('--RX-icon-highlight', theme.iconHighlight);
    
    // Save theme to localStorage
    localStorage.setItem('RX-SMART-BUTTON-theme', themeName);
    
    // Cycle to next theme
    currentThemeIndex = (currentThemeIndex + 1) % themeKeys.length;
  }

  // 2. HTML Injection Function
  function injectSmartButton() {
    const smartButtonHTML = `
    <div class="RX-SMART-BUTTON-container">
      <div class="RX-SMART-BUTTON-circle">
        <div class="RX-SMART-BUTTON-center-point"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="RX-Weather.html" style="--index: 1;"><img src="ASSET/MAIN/IMG/FUNCTION-ICON/weather.png" alt="weather"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="RX-Calendar.html" style="--index: 2;"><img src="ASSET/MAIN/IMG/FUNCTION-ICON/calender.png" alt="Calander"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="RX-GALLERY" style="--index: 3;"><img src="ASSET/MAIN/IMG/FUNCTION-ICON/gallery.png" alt="gallery"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="RX-S-QR" style="--index: 4;"><img src="ASSET/MAIN/IMG/FUNCTION-ICON/qrsc.png" alt="QR Code"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="index.html" style="--index: 5;"><img src="ASSET/MAIN/IMG/FUNCTION-ICON/home.png" alt="home"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="USER-LOGIN.html" style="--index: 6;"><img src="ASSET/MAIN/IMG/FUNCTION-ICON/other.png" alt="other"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="About.html" style="--index: 7;"><img src="ASSET/MAIN/IMG/FUNCTION-ICON/about.png" alt="about"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="https://x.com/Rx_Rosan" style="--index: 8;"><img src="ASSET/MAIN/IMG/FUNCTION-ICON/xcorp.png" alt="xcorp"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="https://www.youtube.com/@RX_E-SPORTS" style="--index: 9;"><img src="ASSET/MAIN/IMG/FUNCTION-ICON/youtube.png" alt="YouTube"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="https://www.facebook.com/RosanXettri.2004" style="--index: 10;"><img src="ASSET/MAIN/IMG/FUNCTION-ICON/facebook.png" alt="Facebook"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="mailto:rkc242855@gmail.com" style="--index: 11;"><img src="ASSET/MAIN/IMG/FUNCTION-ICON/email.png" alt="email"></div>
        <div class="RX-SMART-BUTTON-menu-item" data-link="#" style="--index: 12;"><img src="ASSET/MAIN/IMG/LOGO/RX-3.png" alt="Logo"></div>
      </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', smartButtonHTML);
    
    if (!document.getElementById('RX-SMART-BUTTON-toggle')) {
      const toggleBtn = document.createElement('a');
      toggleBtn.id = 'RX-SMART-BUTTON-toggle';
      toggleBtn.href = 'javascript:void(0)';
      toggleBtn.textContent = '◉';
      document.body.appendChild(toggleBtn);
    }
  }

  // 3. State Management Functions
  function loadState() {
    // Load saved theme
    const savedTheme = localStorage.getItem('RX-SMART-BUTTON-theme');
    if (savedTheme) {
      currentThemeIndex = themeKeys.indexOf(savedTheme);
      if (currentThemeIndex === -1) currentThemeIndex = 0;
      else currentThemeIndex = (currentThemeIndex + 1) % themeKeys.length;
      updateTheme();
    }

    const savedState = localStorage.getItem('RX-SMART-BUTTON-state');
    if (savedState) {
      try {
        const { display, left, top, expanded } = JSON.parse(savedState);
        const circleContainer = document.querySelector('.RX-SMART-BUTTON-container');
        const circle = document.querySelector('.RX-SMART-BUTTON-circle');
        
        if (circleContainer) {
          circleContainer.style.display = display || 'none';
          if (left && top) {
            circleContainer.style.left = left;
            circleContainer.style.top = top;
            circleContainer.style.transform = 'none';
          }
        }
        
        const toggleBtn = document.getElementById('RX-SMART-BUTTON-toggle');
        if (toggleBtn && display === 'block') {
          toggleBtn.textContent = "◎";
        }
        
        if (circle && expanded) {
          circle.classList.add('expanded');
        }
      } catch (e) {
        console.error('Error loading smart button state:', e);
      }
    }
  }

  function saveState() {
    const circleContainer = document.querySelector('.RX-SMART-BUTTON-container');
    const circle = document.querySelector('.RX-SMART-BUTTON-circle');
    
    if (circleContainer && circle) {
      const state = {
        display: circleContainer.style.display || 'none',
        left: circleContainer.style.left,
        top: circleContainer.style.top,
        expanded: circle.classList.contains('expanded')
      };
      localStorage.setItem('RX-SMART-BUTTON-state', JSON.stringify(state));
    }
  }

  // 4. Event Handlers
  function setupToggleButton() {
    const toggleBtn = document.getElementById('RX-SMART-BUTTON-toggle');
    const circleContainer = document.querySelector('.RX-SMART-BUTTON-container');
    const circle = document.querySelector('.RX-SMART-BUTTON-circle');
    
    if (toggleBtn && circleContainer && circle) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const visible = circleContainer.style.display === 'block';
        circleContainer.style.display = visible ? 'none' : 'block';
        toggleBtn.textContent = visible ? '◉' : '◎';
        
        // Change theme when opening (not when closing)
        if (!visible) {
          updateTheme();
        }
        
        saveState();
      });
    }
  }

  function setupCircleInteractions() {
    const circle = document.querySelector('.RX-SMART-BUTTON-circle');
    if (circle) {
      // Click to expand/collapse
      circle.addEventListener('click', function(e) {
        if (e.target.classList.contains('RX-SMART-BUTTON-menu-item') || e.target.tagName === 'IMG') return;
        this.classList.toggle('expanded');
        saveState();
      });
      
      // Menu item clicks
      document.querySelectorAll('.RX-SMART-BUTTON-menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          const link = this.getAttribute('data-link');
          if (link) {
            if (link.startsWith('http') || link.startsWith('mailto')) {
              window.open(link, '_blank');
            } else {
              window.location.href = link;
            }
          }
        });
      });
    }
  }

  // 5. Drag and Drop Functions
  function setupDragAndDrop() {
    const circleContainer = document.querySelector('.RX-SMART-BUTTON-container');
    if (!circleContainer) return;
    
    let isDragging = false, offsetX = 0, offsetY = 0;

    const startDrag = (x, y) => {
      const rect = circleContainer.getBoundingClientRect();
      offsetX = x - rect.left;
      offsetY = y - rect.top;
      isDragging = true;
      circleContainer.style.cursor = 'move';
    };

    const moveDrag = (x, y) => {
      if (!isDragging) return;
      circleContainer.style.left = `${x - offsetX}px`;
      circleContainer.style.top = `${y - offsetY}px`;
      circleContainer.style.transform = 'none';
      saveState();
    };

    const stopDrag = () => {
      isDragging = false;
      circleContainer.style.cursor = 'pointer';
      saveState();
    };

    // Mouse events
    circleContainer.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', stopDrag);

    // Touch events
    circleContainer.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    });
    window.addEventListener('touchmove', e => {
      const touch = e.touches[0];
      moveDrag(touch.clientX, touch.clientY);
    }, { passive: false });
    window.addEventListener('touchend', stopDrag);
  }

  // 6. Initialization Function
  function initSmartButton() {
    injectSmartButton();
    loadState();
    setupToggleButton();
    setupCircleInteractions();
    setupDragAndDrop();
    
    // Save state before page unload
    window.addEventListener('beforeunload', saveState);
    
    // Handle potential dynamic content changes
    const observer = new MutationObserver(() => {
      if (!document.querySelector('.RX-SMART-BUTTON-container')) {
        initSmartButton();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Start the smart button system when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmartButton);
  } else {
    initSmartButton();
  }
})();