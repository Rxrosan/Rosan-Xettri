//============================================================
// RX-MAIN.js 
//Author: RX STUDIO
// ============================================================
// 1. SIDEBAR / MENU TOGGLE FUNCTIONS
// ============================================================

// Toggle sub-menu (folder open/close)
function rxToggleSub(rxElement) {
    let rxNested = rxElement.nextElementSibling;
    if (rxNested) {
        rxNested.classList.toggle('rx-active-tree');
    }
}

// Closes the mobile menu
function rxCloseMobileMenu() {
    const sidebar = document.getElementById('rx-sidebar');
    if (sidebar && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
    }
}

// Toggles the mobile menu open/close
function rxToggleMobileMenu() {
    const sidebar = document.getElementById('rx-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('show');
    }
}

// ============================================================
// 2. CONTENT LOADING & ROUTING LOGIC
// ============================================================

// Load Home content
function rxLoadHome() {
    localStorage.removeItem('rxCurrentPage');
    
    const rxDisplayArea = document.getElementById('rx-display-area');
    if (rxDisplayArea && typeof rxLoadHomePage === 'function') {
        rxLoadHomePage(rxDisplayArea);
    }

    // Close menu on mobile if open
    if (window.innerWidth <= 768) rxCloseMobileMenu();
}

// Main content loader
function rxLoadContent(rxTitleName) {
    localStorage.setItem('rxCurrentPage', rxTitleName);
    renderContent(rxTitleName);
    if (window.innerWidth <= 768) rxCloseMobileMenu();
}

// Render the correct page based on title
function renderContent(rxTitleName) {
    const rxDisplayArea = document.getElementById('rx-display-area');
    const sidebarHeading = document.getElementById('rx-sidebar-heading');
    
    // Update sidebar heading
    if (sidebarHeading) sidebarHeading.innerText = rxTitleName;
    if (!rxDisplayArea) return;

    // Reset content area styling
    rxDisplayArea.style.alignItems = "center";
    rxDisplayArea.style.justifyContent = "flex-start";

    // Route to specific page functions
    if (rxTitleName === 'Home' || rxTitleName === 'HOME') {
        rxLoadHome();
        return;
    } 
    else if (rxTitleName === 'ABOUT' && typeof rxLoadAboutPage === 'function') {
        rxLoadAboutPage(rxDisplayArea);
    } 
    else if (rxTitleName === 'SERVICE' && typeof rxLoadServicePage === 'function') {
        rxLoadServicePage(rxDisplayArea);
    } 
    else if (rxTitleName === 'CONTACT' && typeof rxLoadContactPage === 'function') {
        rxLoadContactPage(rxDisplayArea);
    } 
    else if (rxTitleName === 'NEWS' && typeof rxLoadNewsPage === 'function') {
        rxLoadNewsPage(rxDisplayArea);
    } 
    else if (rxTitleName === 'PRIVACY & POLICY' && typeof rxLoadPrivacyPage === 'function') {
        rxLoadPrivacyPage(rxDisplayArea);
    } 
    else if (rxTitleName === 'TERMS & CONDITIONS' && typeof rxLoadTermsPage === 'function') {
        rxLoadTermsPage(rxDisplayArea);
    } 
    else if (rxTitleName === 'AUTHENTICATION' && typeof rxLoadAuthPage === 'function') {
        rxLoadAuthPage(rxDisplayArea);
    } 
    else if (rxTitleName === 'USER PROFILE' && typeof rxLoadProfilePage === 'function') {
        rxLoadProfilePage(rxDisplayArea);
    } 
    else if (rxTitleName === 'Resource' && typeof rxLoadResourcePage === 'function') {
        rxLoadResourcePage(rxDisplayArea);
    }
}

// ============================================================
// 3. INITIALIZATION ON PAGE LOAD
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
    const savedPage = localStorage.getItem('rxCurrentPage');
    const rxDisplayArea = document.getElementById('rx-display-area');
    
    // 1. Load saved page or default to Home
    if (savedPage) {
        renderContent(savedPage);
    } else {
        if (rxDisplayArea && typeof rxLoadHomePage === 'function') {
            rxLoadHomePage(rxDisplayArea);
        }
        const sidebarHeading = document.getElementById('rx-sidebar-heading');
        if (sidebarHeading) sidebarHeading.innerText = 'HOME';
    }

    // 2. Mobile Menu Button Listener
    const mobileMenuBtn = document.getElementById('rx-mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            rxToggleMobileMenu();
        });
    }

    // ============================================================
    // [FIXED] Outside Click Close Function REMOVED completely.
    // Menu will ONLY open/close by clicking the button.
    // ============================================================

});

// ============================================================
// 4. REAL-TIME CLOCK & DATE UPDATE
// ============================================================

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

// Update clock every second
setInterval(updateDateTime, 1000);
updateDateTime();
