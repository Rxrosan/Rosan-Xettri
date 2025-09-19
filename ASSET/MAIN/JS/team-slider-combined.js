// Inject CSS styles
(function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .team-slider-container {
            position: relative;
            height: 400px;
            overflow: hidden;
            margin: 0 auto;
            max-width: 300px;
        }

        .team-slider {
            height: 100%;
            transition: transform 0.8s ease-in-out;
        }

        .team-slide {
            height: 400px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .team-member {
            text-align: center;
            padding: 20px;
        }

        .team-member img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 15px;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 15px;
            font-size: 18px;
        }

        .social-links a {
            color: #555;
            transition: all 0.3s ease;
        }

        .social-links a:hover {
            color: #000;
            transform: translateY(-3px);
        }
    `;
    document.head.appendChild(style);
})();

// Team slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.team-slider');
    const slides = document.querySelectorAll('.team-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let isAnimating = false;
    let isPaused = false;
    let slideInterval;

    // Configuration object for easy customization
    const config = {
        slideDuration: 5000,          // Time between slides (ms)
        animationDuration: 800,       // Slide transition duration (ms)
        animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth easing function
        pauseOnHover: true,           // Pause on hover
        touchSensitivity: 50,         // Minimum swipe distance (px)
        responsiveBreakpoint: 768     // Mobile breakpoint (px)
    };

    // Initialize slider
    function initSlider() {
        // Set initial positions and styles
        slider.style.transition = `transform ${config.animationDuration}ms ${config.animationEasing}`;
        slides.forEach((slide, index) => {
            slide.style.width = '100%';
            slide.style.flexShrink = '0';
            slide.setAttribute('data-index', index);
            slide.setAttribute('aria-hidden', index !== 0);
        });

        // Clone first and last slides for infinite looping
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[totalSlides - 1].cloneNode(true);
        
        firstClone.id = 'first-clone';
        lastClone.id = 'last-clone';
        
        slider.appendChild(firstClone);
        slider.insertBefore(lastClone, slides[0]);
        
        // Adjust current index for the new slides
        currentIndex = 1;
        goToSlide(currentIndex, false);
    }

    // Navigate to specific slide
    function goToSlide(index, animate = true) {
        if (isAnimating) return;
        
        isAnimating = true;
        currentIndex = index;
        
        if (!animate) {
            slider.style.transition = 'none';
        }
        
        slider.style.transform = `translateY(-${currentIndex * 100}%)`;
        
        // Handle infinite loop
        setTimeout(() => {
            if (currentIndex === totalSlides + 1) {
                currentIndex = 1;
                slider.style.transition = 'none';
                slider.style.transform = `translateY(-${currentIndex * 100}%)`;
            } else if (currentIndex === 0) {
                currentIndex = totalSlides;
                slider.style.transition = 'none';
                slider.style.transform = `translateY(-${currentIndex * 100}%)`;
            }
            
            // Update aria-hidden attributes
            slides.forEach((slide, i) => {
                slide.setAttribute('aria-hidden', i !== currentIndex - 1);
            });
            
            isAnimating = false;
        }, config.animationDuration);
    }

    // Navigate to next slide
    function nextSlide() {
        if (isPaused) return;
        goToSlide(currentIndex + 1);
    }

    // Navigate to previous slide
    function prevSlide() {
        if (isPaused) return;
        goToSlide(currentIndex - 1);
    }

    // Start auto-sliding
    function startAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, config.slideDuration);
    }

    // Pause auto-sliding
    function pauseAutoSlide() {
        isPaused = true;
        clearInterval(slideInterval);
    }

    // Resume auto-sliding
    function resumeAutoSlide() {
        isPaused = false;
        startAutoSlide();
    }

    // Handle touch events for swipe navigation
    function setupTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            pauseAutoSlide();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
            resumeAutoSlide();
        }, { passive: true });

        function handleSwipe() {
            const xDiff = touchStartX - touchEndX;
            const yDiff = touchStartY - touchEndY;
            
            // Only consider vertical swipes
            if (Math.abs(yDiff) > Math.abs(xDiff)) {
                if (yDiff > config.touchSensitivity) {
                    nextSlide();
                } else if (yDiff < -config.touchSensitivity) {
                    prevSlide();
                }
            }
        }
    }

    // Initialize everything
    if (slider && slides.length > 0) {
        initSlider();
        startAutoSlide();
        setupTouchEvents();

        // Pause on hover if enabled
        if (config.pauseOnHover) {
            slider.addEventListener('mouseenter', pauseAutoSlide);
            slider.addEventListener('mouseleave', resumeAutoSlide);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                nextSlide();
            } else if (e.key === 'ArrowUp') {
                prevSlide();
            }
        });

        // Responsive adjustments
        window.addEventListener('resize', () => {
            // Force reflow to prevent animation glitches
            slider.style.transition = 'none';
            slider.style.transform = `translateY(-${currentIndex * 100}%)`;
            void slider.offsetWidth;
            slider.style.transition = `transform ${config.animationDuration}ms ${config.animationEasing}`;
        });

        // Optional navigation buttons
        document.querySelector('.team-next')?.addEventListener('click', nextSlide);
        document.querySelector('.team-prev')?.addEventListener('click', prevSlide);
    }
});