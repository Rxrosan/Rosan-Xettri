// RX-WEB-P&P.js - Privacy & Policy Tab Functionality (Fully Fixed)

function initPrivacyTabs() {
    // Event delegation on document or body to catch clicks dynamically
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.pp-tabs .tab-btn');
        if (!btn) return;

        const tabsWrapper = btn.closest('.pp-tabs');
        if (!tabsWrapper) return;

        const tabBtns = tabsWrapper.querySelectorAll('.tab-btn');
        const tabContents = tabsWrapper.querySelectorAll('.tab-content');

        // Remove active class from all buttons and contents within this wrapper
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // Show corresponding tab content
        const tabId = btn.getAttribute('data-tab');
        const tabContent = tabsWrapper.querySelector(`#${tabId}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
    });
}

// Initialize immediately
initPrivacyTabs();

// Also run on DOMContentLoaded for global utilities (Side panel, active nav, etc.)
document.addEventListener('DOMContentLoaded', function() {
    initPrivacyTabs();
    
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
    
    if (menuToggle) menuToggle.addEventListener('click', openPanel);
    if (closePanel) closePanel.addEventListener('click', closePanelFunc);
    if (panelOverlay) panelOverlay.addEventListener('click', closePanelFunc);
    
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
    
    console.log('RX Privacy & Policy module loaded and working perfectly.');
});