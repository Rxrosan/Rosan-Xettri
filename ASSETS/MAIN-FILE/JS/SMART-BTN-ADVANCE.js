// SMART-BTN.js - Combined CSS and JavaScript
(function() {
  // 1. Inject CSS Styles
  const smartButtonCSS = `
  /* smartbtn.css */
  :root {
    --circle-size: 2cm;
    --menu-item-size: 1.5cm;
    --center-size: 0.8cm;
    --menu-item-distance: 4cm;
  }

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  .circle-container {
    position: fixed;
    bottom: 45%;
    right: 25%;
    z-index: 1000;
    display: none;
    touch-action: none;
  }

  .circle {
    width: var(--circle-size);
    height: var(--circle-size);
    border-radius: 50%;
    position: relative;
    transition: all 0.6s ease-in-out;
    background: radial-gradient(circle at center, rgba(255, 0, 0, 0.6), rgba(0, 0, 255, 0.6), rgba(0, 255, 0, 0.6));
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.7), 
                0 0 30px rgba(168, 5, 5, 0.7),
                0 0 40px rgba(0, 0, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
  }

  .center-point {
    width: var(--center-size);
    height: var(--center-size);
    background-color: #eb0a0a;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
    transition: opacity 0.7s ease-in-out;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  }
  .menu-item {
    position: absolute;
    width: var(--menu-item-size);
    height: var(--menu-item-size);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    overflow: hidden;
    opacity: 0;
    transform: scale(0);
    transition: all 0.7s ease;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.8),
                0 0 10px rgba(0, 255, 0, 0.8),
                0 0 10px rgba(0, 0, 255, 0.8);
    transform-origin: center;
  }

  .menu-item img {
    width: 60%;
    height: 60%;
    object-fit: contain;
    transition: filter 0.5s ease;
  }

  .circle.expanded .menu-item {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  .circle.expanded .menu-item[style] {
    transform: rotate(calc(30deg * var(--index))) 
               translateX(var(--menu-item-distance)) 
               rotate(calc(-30deg * var(--index)));
  }

  .circle.expanded .menu-item:hover img {
    filter: brightness(1.2) contrast(1.2);
  }

  .smart-button-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1001;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    :root {
      --circle-size: 2cm;
      --menu-item-size: 1.2cm;
      --center-size: 0.7cm;
      --menu-item-distance: 3.5cm;
    }
    
    .circle-container {
      bottom: 3vh;
      right: 3vw;
    }
  }

  @media (max-width: 480px) {
    :root {
      --circle-size: 2cm;
      --menu-item-size: 1cm;
      --center-size: 0.6cm;
      --menu-item-distance: 3cm;
    }
    
    .smart-button-toggle {
      padding: 0.6rem 1rem;
    }
  }
  `;

  // Create style element and inject CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = smartButtonCSS;
  document.head.appendChild(styleElement);

  // 2. HTML Injection Function
  function injectSmartButton() {
    const smartButtonHTML = `
    <div class="circle-container">
      <div class="circle">
        <div class="center-point"></div>
        <div class="menu-item" data-link="RX-Weather.html" style="--index: 1;"><img src="ASSETS/MAIN-FILE/IMG/FUNCTION-ICON/weather.png" alt="weather"></div>
        <div class="menu-item" data-link="RX-Calendar.html" style="--index: 2;"><img src="ASSETS/MAIN-FILE/IMG/FUNCTION-ICON/calender.png" alt="Calander"></div>
        <div class="menu-item" data-link="RX-GALLERY" style="--index: 3;"><img src="ASSETS/MAIN-FILE/IMG/FUNCTION-ICON/gallery.png" alt="gallery"></div>
        <div class="menu-item" data-link="RX-S-QR" style="--index: 4;"><img src="ASSETS/MAIN-FILE/IMG/FUNCTION-ICON/qrsc.png" alt="QR Code"></div>
        <div class="menu-item" data-link="index.html" style="--index: 5;"><img src="ASSETS/MAIN-FILE/IMG/FUNCTION-ICON/home.png" alt="home"></div>
        <div class="menu-item" data-link="KR-EXAM-ALL-COLLECTION-LOGIN.html" style="--index: 6;"><img src="ASSETS/MAIN-FILE/IMG/FUNCTION-ICON/other.png" alt="other"></div>
        <div class="menu-item" data-link="About.html" style="--index: 7;"><img src="ASSETS/MAIN-FILE/IMG/FUNCTION-ICON/about.png" alt="about"></div>
        <div class="menu-item" data-link="https://x.com/Rx_Rosan" style="--index: 8;"><img src="ASSETS/MAIN-FILE/IMG/FUNCTION-ICON/xcorp.png" alt="xcorp"></div>
        <div class="menu-item" data-link="https://www.youtube.com/@RX_E-SPORTS" style="--index: 9;"><img src="ASSETS/MAIN-FILE/IMG/FUNCTION-ICON/youtube.png" alt="YouTube"></div>
        <div class="menu-item" data-link="https://www.facebook.com/RosanXettri.2004" style="--index: 10;"><img src="ASSETS/MAIN-FILE/IMG/FUNCTION-ICON/facebook.png" alt="Facebook"></div>
        <div class="menu-item" data-link="mailto:rkc242855@gmail.com" style="--index: 11;"><img src="ASSETS/MAIN-FILE/IMG/FUNCTION-ICON/email.png" alt="email"></div>
        <div class="menu-item" data-link="LEKHAPADI-ACCOUNT-LOGIN.html" style="--index: 12;"><img src="ASSETS/MAIN-FILE/IMG/LOGO/RX-2.png" alt="Logo"></div>
      </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', smartButtonHTML);
    
    if (!document.getElementById('toggleSmartButton')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'toggleSmartButton';
      toggleBtn.className = 'smart-button-toggle';
      toggleBtn.textContent = '◉';
      document.body.appendChild(toggleBtn);
    }
  }

  // 3. State Management Functions
  function loadState() {
    const savedState = localStorage.getItem('circleContainerState');
    if (savedState) {
      try {
        const { display, left, top, expanded } = JSON.parse(savedState);
        const circleContainer = document.querySelector('.circle-container');
        const circle = document.querySelector('.circle');
        
        if (circleContainer) {
          circleContainer.style.display = display || 'none';
          if (left && top) {
            circleContainer.style.left = left;
            circleContainer.style.top = top;
            circleContainer.style.transform = 'none';
          }
        }
        
        const toggleBtn = document.getElementById('toggleSmartButton');
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
    const circleContainer = document.querySelector('.circle-container');
    const circle = document.querySelector('.circle');
    
    if (circleContainer && circle) {
      const state = {
        display: circleContainer.style.display || 'none',
        left: circleContainer.style.left,
        top: circleContainer.style.top,
        expanded: circle.classList.contains('expanded')
      };
      localStorage.setItem('circleContainerState', JSON.stringify(state));
    }
  }

  // 4. Event Handlers
  function setupToggleButton() {
    const toggleBtn = document.getElementById('toggleSmartButton');
    const circleContainer = document.querySelector('.circle-container');
    
    if (toggleBtn && circleContainer) {
      toggleBtn.addEventListener('click', () => {
        const visible = circleContainer.style.display === 'block';
        circleContainer.style.display = visible ? 'none' : 'block';
        toggleBtn.textContent = visible ? '◉' : '◎';
        saveState();
      });
    }
  }

  function setupCircleInteractions() {
    const circle = document.querySelector('.circle');
    if (circle) {
      // Click to expand/collapse
      circle.addEventListener('click', function(e) {
        if (e.target.classList.contains('menu-item') || e.target.tagName === 'IMG') return;
        this.classList.toggle('expanded');
        saveState();
      });
      
      // Menu item clicks
      document.querySelectorAll('.menu-item').forEach(item => {
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
    const circleContainer = document.querySelector('.circle-container');
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
      if (!document.querySelector('.circle-container')) {
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