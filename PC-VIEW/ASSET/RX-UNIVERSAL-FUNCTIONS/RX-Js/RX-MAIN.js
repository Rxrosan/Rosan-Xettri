/**
 * RX-MAIN.js 
 * Author: RX STUDIO
 * All original functionality preserved.
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

// Load Content
function rxLoadContent(rxTitleName) {
    localStorage.setItem('rxCurrentPage', rxTitleName);
    renderContent(rxTitleName);
    rxCloseMenu();
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
            if (typeof rxLoadContentPage === 'function') rxLoadContactPage(rxDisplayArea); // Note: Ensure function name is correct
            else if (typeof rxLoadContactPage === 'function') rxLoadContactPage(rxDisplayArea);
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
    }
}

// Initialize
window.addEventListener('load', () => {
    const savedPage = localStorage.getItem('rxCurrentPage') || 'HOME';
    renderContent(savedPage);
    
    const mobileMenuBtn = document.getElementById('rx-mobile-menu-btn');
    const sidebar = document.getElementById('rx-sidebar');
    const displayArea = document.getElementById('rx-display-area');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('show');
        });

        // Content Area मा क्लिक गर्दा मेनु बन्द हुने
        if (displayArea) {
            displayArea.addEventListener('click', () => {
                sidebar.classList.remove('show');
            });
        }
    }
});

// Date Time Update
function updateDateTime() {
    const now = new Date();
    const timeEl = document.getElementById('rx-time');
    const dateEl = document.getElementById('rx-date');
    const dayEl = document.getElementById('rx-day');
    if (timeEl) timeEl.innerText = now.toLocaleTimeString();
    if (dateEl) dateEl.innerText = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
    if (dayEl) dayEl.innerText = now.toLocaleDateString(undefined, {weekday:'long'});
}
setInterval(updateDateTime, 1000);
updateDateTime();