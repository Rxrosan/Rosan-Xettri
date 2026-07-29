// rx-main.js - Main Application Logic & Routing
// author : RX STUDIO

function rxToggleSub(rxElement) {
    let rxNested = rxElement.nextElementSibling;
    if (rxNested) {
        rxNested.classList.toggle('rx-active-tree');
    }
}

function rxLoadHome() {
    localStorage.removeItem('rxCurrentPage');
    
    const rxDisplayArea = document.getElementById('rx-display-area');
    if (rxDisplayArea && typeof rxLoadHomePage === 'function') {
        rxLoadHomePage(rxDisplayArea);
    }

    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('rx-sidebar');
        if (sidebar) sidebar.classList.remove('show');
    }
}

function rxLoadContent(rxTitleName) {
    // युजरले क्लिक गरेको हालको पेजलाई LocalStorage मा सेभ गर्ने
    localStorage.setItem('rxCurrentPage', rxTitleName);
    renderContent(rxTitleName);

    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('rx-sidebar');
        if (sidebar) sidebar.classList.remove('show');
    }
}

function renderContent(rxTitleName) {
    const rxDisplayArea = document.getElementById('rx-display-area');
    const sidebarHeading = document.getElementById('rx-sidebar-heading');
    if (sidebarHeading) sidebarHeading.innerText = rxTitleName;
    
    if (!rxDisplayArea) return;

    rxDisplayArea.style.alignItems = "center";
    rxDisplayArea.style.justifyContent = "flex-start";

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

// पेज रिफ्रेस वा लोड हुँदा LocalStorage चेक गरेर सेभ भएको पेज देखाउने
window.addEventListener('DOMContentLoaded', () => {
    const savedPage = localStorage.getItem('rxCurrentPage');
    if (savedPage) {
        renderContent(savedPage);
    }
    
    const mobileMenuBtn = document.getElementById('rx-mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const sidebar = document.getElementById('rx-sidebar');
            if (sidebar) sidebar.classList.toggle('show');
        });
    }
});

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

setInterval(updateDateTime, 1000);
updateDateTime();