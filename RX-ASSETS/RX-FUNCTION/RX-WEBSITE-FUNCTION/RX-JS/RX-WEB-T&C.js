// RX-WEB-T&C.js - Terms & Condition Tab Functionality

document.addEventListener('DOMContentLoaded', function() {
    // ===== TERMS TABS SWITCHING =====
    const tabBtns = document.querySelectorAll('.tc-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tc-tabs .tab-content');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show corresponding tab content
                const tabId = this.getAttribute('data-tab');
                const tabContent = document.getElementById(`${tabId}-tab`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
        
        // Ensure first tab is active if none active
        if (!document.querySelector('.tc-tabs .tab-btn.active')) {
            tabBtns[0].classList.add('active');
            const firstTabId = tabBtns[0].getAttribute('data-tab');
            const firstContent = document.getElementById(`${firstTabId}-tab`);
            if (firstContent) firstContent.classList.add('active');
        }
    }
    
    // ===== SIDE PANEL TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const panelOverlay = document.getElementById('panelOverlay');
    const sidePanel = document.getElementById('sidePanel');
    const closePanel = document.getElementById('closePanel');
    
    function openPanel() {
        if (sidePanel) sidePanel.classList.add('open');
        if (panelOverlay) panelOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closePanelFunc() {
        if (sidePanel) sidePanel.classList.remove('open');
        if (panelOverlay) panelOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', openPanel);
    }
    
    if (closePanel) {
        closePanel.addEventListener('click', closePanelFunc);
    }
    
    if (panelOverlay) {
        panelOverlay.addEventListener('click', closePanelFunc);
    }
    
    // Close panel on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidePanel && sidePanel.classList.contains('open')) {
            closePanelFunc();
        }
    });
    
    // ===== ACTIVE NAVIGATION HIGHLIGHT =====
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
    
    console.log('RX Terms & Condition module loaded - matching Service page style');
});