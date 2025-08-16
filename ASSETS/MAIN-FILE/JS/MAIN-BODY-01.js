// Theme management system
const themes = [
    'theme-default', 
    'theme-purple', 
    'theme-blue', 
    'theme-silver', 
    'theme-black', 
];

function setTheme() {
    const savedTheme = localStorage.getItem('liquidTheme');
    let themeIndex;
    
    if (savedTheme) {
        // If theme exists in localStorage, get the next one in sequence
        themeIndex = (themes.indexOf(savedTheme) + 1) % themes.length;
    } else {
        // No saved theme, pick a random one
        themeIndex = Math.floor(Math.random() * themes.length);
    }
    
    const newTheme = themes[themeIndex];
    
    // Remove all theme classes first
    document.body.classList.remove(...themes);
    // Add the new theme class
    document.body.classList.add(newTheme);
    
    // Save to localStorage
    localStorage.setItem('liquidTheme', newTheme);
    
    // Add smooth transition for theme change
    document.body.style.transition = 'background 0.8s ease, color 0.8s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 800);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', setTheme);
// Mobile menu toggle with animation
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

        // Update current time with animation
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
            const timeElement = document.getElementById('current-time');
            
            // Add fade effect
            timeElement.style.opacity = '0';
            setTimeout(() => {
                timeElement.textContent = timeString;
                timeElement.style.opacity = '1';
            }, 200);
        }
        
        // Update immediately and every second
        updateTime();
        setInterval(updateTime, 1000);

        // Smooth scrolling with offset for fixed header
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add hover effects to all cards
        const cards = document.querySelectorAll('.contact-card, .social-card');
        
        cards.forEach(card => {
            // Add random delay for staggered animations
            const delay = Math.random() * 0.5;
            card.style.animationDelay = `${delay}s`;
            
            // Add tilt effect on mouse move
            card.addEventListener('mousemove', (e) => {
                const x = e.offsetX;
                const y = e.offsetY;
                const centerX = card.offsetWidth / 2;
                const centerY = card.offsetHeight / 2;
                
                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            });
            
            // Reset on mouse leave
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });

        // Add scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.contact-card, .social-card, .section-title').forEach(element => {
            observer.observe(element);
        });

        // Add floating animation to hero elements
        const heroElements = document.querySelectorAll('.hero h1, .hero p, .hero .btn');
        
        heroElements.forEach((el, index) => {
            el.style.animation = `float 4s ease-in-out infinite`;
            el.style.animationDelay = `${index * 0.5}s`;
        });