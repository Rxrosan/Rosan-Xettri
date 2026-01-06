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

// Panel Menu Active State
const panelLinks = document.querySelectorAll('.panel-link');
panelLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        panelLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        
        // Close panel after clicking a link (optional)
        setTimeout(() => {
            sidePanel.classList.remove('active');
            panelOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    });
});

// Add animation to hero title on load
const heroTitle = document.querySelector('.hero-title');
heroTitle.style.opacity = '0';
heroTitle.style.transform = 'translateY(20px)';

setTimeout(() => {
    heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
    heroTitle.style.opacity = '1';
    heroTitle.style.transform = 'translateY(0)';
}, 300);

// Update copyright year
const copyrightYear = document.querySelector('.copyright p');
const currentYear = new Date().getFullYear();
copyrightYear.innerHTML = copyrightYear.innerHTML.replace('2023', currentYear);