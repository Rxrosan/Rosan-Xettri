/**
 * RX-MAIN.js - Fully Functional Version
 * Author: RX STUDIO
 * All original logic preserved with fixed mobile/layout updates.
 */

// Tree Menu Toggle - (Keep original)
function rxToggleSub(rxElement) {
    let rxNested = rxElement.nextElementSibling;
    if (rxNested) {
        rxNested.classList.toggle('rx-active-tree');
    }
}

// Load Home Logic - (Keep original + close menu)
function rxLoadHome() {
    localStorage.removeItem('rxCurrentPage');
    
    const rxDisplayArea = document.getElementById('rx-display-area');
    if (rxDisplayArea && typeof rxLoadHomePage === 'function') {
        rxLoadHomePage(rxDisplayArea);
    }
    
    const sidebarHeading = document.getElementById('rx-sidebar-heading');
    if (sidebarHeading) sidebarHeading.innerText = 'HOME';

    rxCloseMenu(); // मेनु बन्द गर्ने
}

// Load Content Logic - (Keep original + close menu)
function rxLoadContent(rxTitleName) {
    localStorage.setItem('rxCurrentPage', rxTitleName);
    renderContent(rxTitleName);
    rxCloseMenu(); // मेनु बन्द गर्ने
}

// Mobile Menu Close Function
function rxCloseMenu() {
    const sidebar = document.getElementById('rx-sidebar');
    if (sidebar) sidebar.classList.remove('show');
}

// Master Render Function - (Keep original structure)
function renderContent(rxTitleName) {
    const rxDisplayArea = document.getElementById('rx-display-area');
    const sidebarHeading = document.getElementById('rx-sidebar-heading');
    
    if (sidebarHeading) sidebarHeading.innerText = rxTitleName;
    if (!rxDisplayArea) return;

    // Reset view position
    rxDisplayArea.scrollTo(0, 0);

    // Routing Logic
    if (rxTitleName === 'Home' || rxTitleName === 'HOME') {
        rxLoadHome();
        return;
    } 

    // Switch case for all your other pages
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
        default:
            // fallback
            console.log("Page not found: " + rxTitleName);
    }
}

// Page initialization
window.addEventListener('load', () => {
    // १. सुरुमा कुन पेज देखाउने (LocalStorage check)
    const savedPage = localStorage.getItem('rxCurrentPage');
    if (savedPage) {
        renderContent(savedPage);
    } else {
        rxLoadHome();
    }
    
    // २. मोबाइल मेनु बटन इभेन्ट
    const mobileMenuBtn = document.getElementById('rx-mobile-menu-btn');
    const sidebar = document.getElementById('rx-sidebar');
    const displayArea = document.getElementById('rx-display-area');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('show');
        });

        // ३. मेनु बाहिर (Content area) क्लिक गर्दा मेनु बन्द हुने
        if (displayArea) {
            displayArea.addEventListener('click', () => {
                sidebar.classList.remove('show');
            });
        }
    }
});

// Clock & Date Logic - (Keep original)
function updateDateTime() {
    const now = new Date();
    const userLocale = navigator.language || 'en-US';

    const timeEl = document.getElementById('rx-time');
    const dateEl = document.getElementById('rx-date');
    const dayEl = document.getElementById('rx-day');

    if (timeEl) timeEl.innerText = now.toLocaleTimeString(userLocale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dayNum = String(now.getDate()).padStart(2, '0');
    if (dateEl) dateEl.innerText = `${year}.${month}.${dayNum}`;
    
    if (dayEl) dayEl.innerText = now.toLocaleDateString(userLocale, { weekday: 'long' });
}

// Intervals
setInterval(updateDateTime, 1000);
updateDateTime();