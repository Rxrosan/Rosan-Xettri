// Smart Button System - Complete Implementation
(function() {
  // 1. HTML Injection Function
  function injectSmartButton() {
    const smartButtonHTML = `
    <div class="circle-container">
      <div class="circle">
        <div class="center-point"></div>
        <div class="menu-item" data-link="RX weather.html" style="--index: 1;"><img src="asset/img/icon/weather.png" alt="weather"></div>
        <div class="menu-item" data-link="RX Calendar.html" style="--index: 2;"><img src="asset/img/icon/calender.png" alt="Calander"></div>
        <div class="menu-item" data-link="gallery.html" style="--index: 3;"><img src="asset/img/icon/gallery.png" alt="gallery"></div>
        <div class="menu-item" data-link="SQRC.html" style="--index: 4;"><img src="asset/img/icon/qrsc.png" alt="QR Code"></div>
        <div class="menu-item" data-link="index.html" style="--index: 5;"><img src="asset/img/icon/home.png" alt="home"></div>
        <div class="menu-item" data-link="RX ALL.html" style="--index: 6;"><img src="asset/img/icon/other.png" alt="other"></div>
        <div class="menu-item" data-link="About.html" style="--index: 7;"><img src="asset/img/icon/about.png" alt="about"></div>
        <div class="menu-item" data-link="https://x.com/Rx_Rosan" style="--index: 8;"><img src="asset/img/icon/xcorp.png" alt="xcorp"></div>
        <div class="menu-item" data-link="https://www.youtube.com/@RX_E-SPORTS" style="--index: 9;"><img src="asset/img/icon/youtube1.png" alt="YouTube"></div>
        <div class="menu-item" data-link="https://www.facebook.com/RosanXettri.2004" style="--index: 10;"><img src="asset/img/icon/facebook.png" alt="Facebook"></div>
        <div class="menu-item" data-link="mailto:rkc242855@gmail.com" style="--index: 11;"><img src="asset/img/icon/email.png" alt="email"></div>
        <div class="menu-item" data-link="RXG.html" style="--index: 12;"><img src="asset/img/icon/rx.png" alt="Logo"></div>
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

  // 2. State Management Functions
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

  // 3. Event Handlers
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

  // 4. Drag and Drop Functions
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

  // 5. Initialization Function
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