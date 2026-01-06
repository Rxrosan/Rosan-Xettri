// About Page Animations
document.addEventListener('DOMContentLoaded', function() {
    // Animated counter for statistics
    const counters = document.querySelectorAll('.stat-number');
    
    const startCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counter animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
    
    // Image hover effect enhancement
    const adminImage = document.querySelector('.admin-image-container');
    if (adminImage) {
        adminImage.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.image-overlay');
            overlay.style.background = 'linear-gradient(to top, rgba(10, 25, 47, 0.95), rgba(100, 255, 218, 0.2))';
        });
        
        adminImage.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.image-overlay');
            overlay.style.background = 'linear-gradient(to top, rgba(10, 25, 47, 0.9), transparent)';
        });
    }
    
    // Skill items animation on scroll
    const skillItems = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.3
    });
    
    skillItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
        skillObserver.observe(item);
    });
});