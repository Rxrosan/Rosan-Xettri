// RX-WEB-SERVICES.js - Services Tab Functionality (tabs preserved, inquire removed)
document.addEventListener('DOMContentLoaded', function() {
    // ===== TAB SWITCHING =====
    const tabBtns = document.querySelectorAll('.service-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.service-tabs .tab-content');
    
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
        if (!document.querySelector('.service-tabs .tab-btn.active')) {
            tabBtns[0].classList.add('active');
            const firstTabId = tabBtns[0].getAttribute('data-tab');
            const firstContent = document.getElementById(`${firstTabId}-tab`);
            if (firstContent) firstContent.classList.add('active');
        }
    }
    
    console.log('RX Services module loaded - tabs working, inquire buttons removed');
});