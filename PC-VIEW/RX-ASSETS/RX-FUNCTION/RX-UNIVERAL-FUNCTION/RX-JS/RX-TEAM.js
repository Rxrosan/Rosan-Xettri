// RX-TEAM.js - CONTINUOUS VERSION (NO PAUSE ANYWHERE)
document.addEventListener('DOMContentLoaded', function() {
    // Find your existing section
    const teamSection = document.getElementById('rx-team-section');
    
    if (!teamSection) {
        console.error('Section with id="rx-team-section" not found!');
        return;
    }

    // Add content to your existing section
    teamSection.innerHTML = `
        <div class="rx-team-slider-container">
            <div class="rx-team-slider">
                <div class="rx-team-slide">
                    <div class="rx-team-member">
                        <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/A-1.png" alt="Admin - ROSAN KC">
                        <h3>ROSAN KC</h3>
                        <p class="rx-position">ADMIN</p>
                        <p>Banganga-10, Kapilvastu - NEPAL</p>
                        <div class="rx-social-links">
                            <a href="https://www.facebook.com/Rosan.2061" aria-label="rosan kc facebook"><i class="fab fa-facebook-f"></i></a>
                            <a href="https://www.tiktok.com/@rosankc2061?is_from_webapp=1&sender_device=pc" aria-label="rosan kc tiktok"><i class="fab fa-tiktok"></i></a>
                        </div>
                    </div>
                </div>
                
                <div class="rx-team-slide">
                    <div class="rx-team-member">
                        <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/T-0.jpg" alt="#">
                        <h3>Next Is YOU ?</h3>
                        <p class="rx-position">Have a business mind or idea !</p>
                        <p>Contact us for your BUSINESS IDEA .</p>
                        <div class="rx-social-links">
                            <a href="#" aria-label="#"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" aria-label="#"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inject CSS styles
    const style = document.createElement('style');
    style.textContent = `
        #rx-team-section {
            padding: 40px 20px;
            background-image: url('');
            background-size: cover;
            background-position: center;
        }

        .rx-team-slider-container {
            position: relative;
            height: 400px;
            overflow: hidden;
            margin: 0 auto;
            max-width: 300px;
        }

        .rx-team-slider {
            height: 100%;
            transition: transform 0.8s ease-in-out;
        }

        .rx-team-slide {
            height: 400px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .rx-team-member {
            text-align: center;
            padding: 20px;
        }

        .rx-team-member img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 15px;
        }
        
        .rx-social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 15px;
            font-size: 18px;
        }

        .rx-social-links a {
            color: #555;
            transition: all 0.3s ease;
        }

        .rx-social-links a:hover {
            color: #000;
            transform: translateY(-3px);
        }
    `;
    document.head.appendChild(style);

    // Team slider functionality - CONTINUOUS, NO PAUSE
    const slider = document.querySelector('.rx-team-slider');
    const slides = document.querySelectorAll('.rx-team-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let isAnimating = false;
    let slideInterval;

    // Configuration object for easy customization
    const config = {
        slideDuration: 5000,          // Time between slides (ms)
        animationDuration: 800,       // Slide transition duration (ms)
        animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth easing function
        touchSensitivity: 50,         // Minimum swipe distance (px)
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
        
        firstClone.id = 'rx-first-clone';
        lastClone.id = 'rx-last-clone';
        
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

    // Navigate to next slide (continuous)
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    // Navigate to previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Start auto-sliding - CONTINUOUS, NEVER STOPS
    function startAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, config.slideDuration);
    }

    // Handle touch events for swipe navigation (does NOT pause auto-slide)
    function setupTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
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

        // NO PAUSE ON HOVER - SLIDER CONTINUES WORKING NORMALLY
        // The slider continues auto-sliding even when mouse is over it

        // Keyboard navigation (does NOT pause auto-slide)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                nextSlide();
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                prevSlide();
                e.preventDefault();
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
        document.querySelector('.rx-team-next')?.addEventListener('click', nextSlide);
        document.querySelector('.rx-team-prev')?.addEventListener('click', prevSlide);
    }
});
