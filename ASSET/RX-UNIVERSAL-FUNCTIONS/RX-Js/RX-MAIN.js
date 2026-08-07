/**
 * RX-MAIN.js - FINAL REWRITE WITH AUTO RELOAD & SCROLL
 * Author: RX STUDIO
 */

// Tree Menu Toggle
function rxToggleSub(rxElement) {
    let rxNested = rxElement.nextElementSibling;
    if (rxNested) {
        rxNested.classList.toggle('rx-active-tree');
    }
}

// Load Home
function rxLoadHome() {
    localStorage.removeItem('rxCurrentPage');
    const rxDisplayArea = document.getElementById('rx-display-area');
    if (rxDisplayArea && typeof rxLoadHomePage === 'function') {
        rxLoadHomePage(rxDisplayArea);
    }
    const sidebarHeading = document.getElementById('rx-sidebar-heading');
    if (sidebarHeading) sidebarHeading.innerText = 'HOME';
    rxCloseMenu();
}

// Load Content - FIXED: Don't reload for Resource Manager
function rxLoadContent(rxTitleName) {
    localStorage.setItem('rxCurrentPage', rxTitleName);
    
    // If it's Resource Manager or Resource, don't reload - just render directly
    if (rxTitleName === 'Resource Manager' || rxTitleName === 'Resource') {
        const displayArea = document.getElementById('rx-display-area');
        if (displayArea) {
            // Call renderContent directly without page reload
            renderContent(rxTitleName);
        }
        rxCloseMenu();
        return;
    }
    
    // For all other pages, reload to load the page content
    location.reload();
}

// Close Mobile Menu Function
function rxCloseMenu() {
    const sidebar = document.getElementById('rx-sidebar');
    if (sidebar) sidebar.classList.remove('show');
}

// Master Render Function
function renderContent(rxTitleName) {
    const rxDisplayArea = document.getElementById('rx-display-area');
    const sidebarHeading = document.getElementById('rx-sidebar-heading');
    if (sidebarHeading) sidebarHeading.innerText = rxTitleName;
    if (!rxDisplayArea) return;

    rxDisplayArea.scrollTo(0, 0);

    if (rxTitleName === 'Home' || rxTitleName === 'HOME') {
        rxLoadHome();
        return;
    } 

    // Switching Logic for all pages
    switch (rxTitleName) {
        case 'ABOUT':
            if (typeof rxLoadAboutPage === 'function') rxLoadAboutPage(rxDisplayArea);
            break;
        case 'SERVICE':
            if (typeof rxLoadServicePage === 'function') rxLoadServicePage(rxDisplayArea);
            break;
        case 'CONTACT':
            if (typeof rxLoadContactPage === 'function') rxLoadContactPage(rxDisplayArea);
            break;
        case 'NEWS':
            if (typeof rxLoadNewsPage === 'function') rxLoadNewsPage(rxDisplayArea);
            break;
        case 'PRIVACY & POLICY':
            if (typeof rxLoadPrivacyPage === 'function') rxLoadPrivacyPage(rxDisplayArea);
            break;
        case 'TERMS & CONDITIONS':
            if (typeof rxLoadTermsPage === 'function') rxLoadTermsPage(rxDisplayArea);
            break;
        case 'AUTHENTICATION':
            if (typeof rxLoadAuthPage === 'function') rxLoadAuthPage(rxDisplayArea);
            break;
        case 'USER PROFILE':
            if (typeof rxLoadProfilePage === 'function') rxLoadProfilePage(rxDisplayArea);
            break;
        case 'Resource':
            if (typeof rxLoadResourcePage === 'function') rxLoadResourcePage(rxDisplayArea);
            break;
        case 'Resource Manager':
            if (typeof rxLoadresourcemanagerPage === 'function') rxLoadresourcemanagerPage(rxDisplayArea);
            break;
            
    }
}

// Initialize
window.addEventListener('load', function() {
    // Get saved page or default to HOME
    var savedPage = localStorage.getItem('rxCurrentPage') || 'HOME';
    
    // IMPORTANT: If saved page is Resource Manager, we need to render it differently
    // But renderContent will handle it
    renderContent(savedPage);
    
    var mobileMenuBtn = document.getElementById('rx-mobile-menu-btn');
    var sidebar = document.getElementById('rx-sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('show');
        });
    }
});

// Date Time Update
function updateDateTime() {
    var now = new Date();
    var timeEl = document.getElementById('rx-time');
    var dateEl = document.getElementById('rx-date');
    var dayEl = document.getElementById('rx-day');
    if (timeEl) timeEl.innerText = now.toLocaleTimeString();
    if (dateEl) dateEl.innerText = now.getFullYear() + '.' + String(now.getMonth()+1).padStart(2,'0') + '.' + String(now.getDate()).padStart(2,'0');
    if (dayEl) dayEl.innerText = now.toLocaleDateString(undefined, {weekday:'long'});
}
setInterval(updateDateTime, 1000);
updateDateTime();

console.log('✅ RX-MAIN.js loaded successfully');