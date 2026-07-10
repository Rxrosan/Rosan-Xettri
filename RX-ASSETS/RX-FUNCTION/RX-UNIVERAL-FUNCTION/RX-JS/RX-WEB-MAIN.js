// ===== RX-WEB-MAIN.js =====
(function() {
    'use strict';

    // DOM refs
    const menuToggle = document.getElementById('menuToggle');
    const sidePanel = document.getElementById('sidePanel');
    const closePanel = document.getElementById('closePanel');
    const panelOverlay = document.getElementById('panelOverlay');

    // Open panel
    function openPanel() {
        sidePanel.classList.add('active');
        panelOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = '-' + window.scrollY + 'px';
        // Save state in sessionStorage
        sessionStorage.setItem('panelOpen', 'true');
    }

    // Close panel
    function closePanelFn() {
        const scrollY = document.body.style.top;
        sidePanel.classList.remove('active');
        panelOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        // Remove state from sessionStorage
        sessionStorage.removeItem('panelOpen');
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

    // Check if panel was open before refresh
    function checkPanelState() {
        if (sessionStorage.getItem('panelOpen') === 'true') {
            // Panel was open, keep it open
            sidePanel.classList.add('active');
            panelOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = '-' + window.scrollY + 'px';
        }
    }

    // Event listener for opening
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            openPanel();
        });
    }

    // ONLY close panel when clicking the close button
    if (closePanel) {
        closePanel.addEventListener('click', function(e) {
            e.preventDefault();
            closePanelFn();
        });
    }

    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (sidePanel.classList.contains('active')) {
                closePanelFn();
            }
        }
    });

    // REMOVE overlay click handler - so clicking outside does NOT close
    // The overlay is now just a visual backdrop

    // Prevent any clicks on the panel from closing it
    if (sidePanel) {
        sidePanel.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Also prevent touch events from closing
        sidePanel.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        });
    }

    // Prevent clicks on panel links from closing
    const panelLinks = document.querySelectorAll('.panel-link');
    panelLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
            // Navigation happens naturally
        });
    });

    // Prevent clicks on all panel children from closing
    const panelChildren = document.querySelectorAll('.panel-item, .panel-header, .panel-footer, .panel-menu');
    panelChildren.forEach(function(element) {
        element.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        element.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        });
    });

    // Prevent document clicks from closing the panel
    document.addEventListener('click', function(e) {
        // If click is not on close button or escape key, do nothing
        // The panel stays open
    });

    // Prevent touch outside from closing
    document.addEventListener('touchstart', function(e) {
        // If panel is open and touch is not on close button, keep it open
        if (sidePanel.classList.contains('active')) {
            const target = e.target;
            // Check if touch is on close button
            if (target.closest && target.closest('#closePanel')) {
                // Close button will handle it
                return;
            }
            // Otherwise prevent default behavior that might close it
            e.stopPropagation();
        }
    }, true);

    // Active nav link highlight
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Check panel state on page load
    checkPanelState();

})();