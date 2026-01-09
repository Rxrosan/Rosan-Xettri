// Menu Functionality
const menuToggle = document.getElementById('menuToggle');
const sidePanel = document.getElementById('sidePanel');
const closePanel = document.getElementById('closePanel');
const panelOverlay = document.getElementById('panelOverlay');

// Toggle Side Panel Menu
menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    sidePanel.classList.add('active');
    panelOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closePanel.addEventListener('click', function() {
    sidePanel.classList.remove('active');
    panelOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

panelOverlay.addEventListener('click', function() {
    sidePanel.classList.remove('active');
    panelOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Close panel with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        sidePanel.classList.remove('active');
        panelOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Panel Menu Links with proper navigation
const panelLinks = document.querySelectorAll('.panel-link');
panelLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // If it's a real HTML page link (like Dashboard.html)
        if (href && (href.endsWith('.html') || href.startsWith('http'))) {
            // Update active state
            panelLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Close panel immediately
            sidePanel.classList.remove('active');
            panelOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Let the browser handle navigation naturally
            // Don't use preventDefault() for actual page links
            return;
        }
        
        // For anchor links (#section), internal navigation, or other cases
        e.preventDefault();
        panelLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        
        // Close panel after clicking
        setTimeout(() => {
            sidePanel.classList.remove('active');
            panelOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    });
});

// Add animation to hero title on load
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';

    setTimeout(() => {
        heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);
}

// Update copyright year
const copyrightYear = document.querySelector('.copyright p');
if (copyrightYear) {
    const currentYear = new Date().getFullYear();
    copyrightYear.innerHTML = copyrightYear.innerHTML.replace('2023', currentYear);
}