// RX-REVIEWER.js - Professional Testimonial Slider with Transparent Background
// Enhanced Version - Clean, Modern, Accessible
// Author: RX STUDIO
// www.rosankc.com.np

document.addEventListener('DOMContentLoaded', function() {
    const reviewSection = document.getElementById('rx-reviewer');
    
    if (!reviewSection) {
        console.error('Section with id="rx-reviewer" not found!');
        return;
    }

    // Advanced Configuration
    const CONFIG = {
        rotationInterval: 6000,
        animationDuration: 600,
        touchThreshold: 50,
        mobileBreakpoint: 768,
        maxCardsVisible: 3,
        autoPlay: true,
        pauseOnHover: true,
        pauseOnFocus: true,
        keyboardNavigation: true,
        swipeEnabled: true,
        backgroundOverlay: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)',
        glassEffect: true,
        blurAmount: 12
    };

    // Enhanced HTML Structure with Navigation and Indicators (progress bar removed)
    reviewSection.innerHTML = `
        <div class="rx-reviews-wrapper">
            <div class="rx-reviews-header">
                <h2 class="rx-section-title">
                    <span class="rx-title-icon">⭐</span>
                    Client Rewiew
                    <span class="rx-title-glow"></span>
                </h2>
                <p class="rx-section-subtitle">People say about my work</p>
            </div>
            
            <div class="rx-carousel-container">
                <button class="rx-nav-btn rx-nav-prev" aria-label="Previous review">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                </button>
                
                <div class="rx-reviews-container">
                    <div class="rx-review-card" data-image="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-3.jpg" data-rating="5">
                        <div class="rx-quote-icon">“</div>
                        <div class="rx-stars">★★★★★</div>
                        <p class="rx-review-text">Rosan Khattri Chettri is a talented and reliable graphic designer with a strong eye for detail. He specializes in logos, business cards, and branding, always delivering creative and high-quality work. Highly recommended!</p>
                        <div class="rx-reviewer">
                            <div class="rx-reviewer-avatar">
                                <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-3.jpg" alt="Puja Acharya Shrestha" class="rx-reviewer-img">
                                <div class="rx-avatar-glow"></div>
                            </div>
                            <div class="rx-reviewer-info">
                                <h4>Puja Acharya Shrestha</h4>
                                <p>Palpa, Nepal</p>
                                <span class="rx-verified-badge">REVIEWER</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rx-review-card" data-image="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-1.jpg" data-rating="5">
                        <div class="rx-quote-icon">“</div>
                        <div class="rx-stars">★★★★★</div>
                        <p class="rx-review-text">Rosan Khattri Chettri is a talented graphic designer with experience, specializing in logos, business cards, and more. He delivers creative and professional work. Highly recommended!</p>
                        <div class="rx-reviewer">
                            <div class="rx-reviewer-avatar">
                                <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-1.jpg" alt="Kusma Taramu Magar" class="rx-reviewer-img">
                                <div class="rx-avatar-glow"></div>
                            </div>
                            <div class="rx-reviewer-info">
                                <h4>कुस्मा तरामु मगर</h4>
                                <p>Gulmi-Lumpek</p>
                                <span class="rx-verified-badge">REVIEWER</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rx-review-card" data-image="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-2.jpg" data-rating="5">
                        <div class="rx-quote-icon">“</div>
                        <div class="rx-stars">★★★★★</div>
                        <p class="rx-review-text">Rosan Xettri is known for his dedication to excellence in graphic design and gaming. His innovative mindset, coupled with his refined skills, allows him to create visually stunning designs and achieve remarkable success in the gaming world.</p>
                        <div class="rx-reviewer">
                            <div class="rx-reviewer-avatar">
                                <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-2.jpg" alt="Rita Magar" class="rx-reviewer-img">
                                <div class="rx-avatar-glow"></div>
                            </div>
                            <div class="rx-reviewer-info">
                                <h4>Rita Magar</h4>
                                <p>Banganga-5, Kapilvastu</p>
                                <span class="rx-verified-badge">REVIEWER</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rx-review-card" data-image="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-6.jpg" data-rating="5">
                        <div class="rx-quote-icon">“</div>
                        <div class="rx-stars">★★★★★</div>
                        <p class="rx-review-text">Rosan Xettri is a talented graphic designer and gamer who seamlessly blends creativity with technical expertise. His innovative approach and attention to detail make his work stand out, consistently delivering high-quality results.</p>
                        <div class="rx-reviewer">
                            <div class="rx-reviewer-avatar">
                                <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-6.jpg" alt="Pawana Thapaliya" class="rx-reviewer-img">
                                <div class="rx-avatar-glow"></div>
                            </div>
                            <div class="rx-reviewer-info">
                                <h4>Pawana Thapaliya</h4>
                                <p>Kathmandu, Nepal</p>
                                <span class="rx-verified-badge">REVIEWER</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="rx-nav-btn rx-nav-next" aria-label="Next review">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                </button>
            </div>
            
            <div class="rx-dots-container"></div>
        </div>
    `;

    // Enhanced CSS Styles - Transparent Background (progress bar styles removed, overflow fixed)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rx-fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes rx-glowPulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 0.6; transform: scale(1.2); }
        }
        
        @keyframes rx-starPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); text-shadow: 0 0 8px currentColor; }
        }
        
        #rx-reviewer {
            padding: 60px 20px;
            background: transparent;
            position: relative;
            overflow: hidden;
        }
        
        .rx-reviews-wrapper {
            max-width: 900px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
        }
        
        .rx-reviews-header {
            text-align: center;
            margin-bottom: 40px;
            animation: rx-fadeInUp 0.8s ease;
        }
        
        .rx-section-title {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 12px;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            position: relative;
        }
        
        .rx-title-icon {
            font-size: 2rem;
            animation: rx-starPulse 2s ease-in-out infinite;
            display: inline-block;
        }
        
        .rx-title-glow {
            position: absolute;
            bottom: -8px;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, #ff6b6b, #4ecdc4, transparent);
            border-radius: 3px;
        }
        
        .rx-section-subtitle {
            color: #555;
            font-size: 1.1rem;
            letter-spacing: 1px;
        }
        
        .rx-carousel-container {
            position: relative;
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .rx-reviews-container {
            flex: 1;
            position: relative;
            min-height: 450px;
            perspective: 1000px;
            overflow: hidden;
        }
        
        .rx-review-card {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(${CONFIG.blurAmount}px);
            -webkit-backdrop-filter: blur(${CONFIG.blurAmount}px);
            border-radius: 24px;
            padding: 32px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.3);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            transform-style: preserve-3d;
            overflow-y: auto;
        }
        
        .rx-review-card.active {
            opacity: 1;
            visibility: visible;
            position: relative;
            transform: translateX(0) scale(1);
            z-index: 10;
        }
        
        .rx-review-card.prev {
            transform: translateX(-40%) scale(0.85);
            opacity: 0;
            visibility: hidden;
            filter: blur(4px);
            pointer-events: none;
        }
        
        .rx-review-card.next {
            transform: translateX(40%) scale(0.85);
            opacity: 0;
            visibility: hidden;
            filter: blur(4px);
            pointer-events: none;
        }
        
        .rx-review-card:hover {
            background: rgba(255, 255, 255, 1);
            transform: translateY(-5px) scale(1.01);
            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3);
            border-color: rgba(255,255,255,0.5);
        }
        
        .rx-quote-icon {
            font-size: 80px;
            line-height: 0.8;
            color: #ff6b6b;
            font-family: 'Georgia', serif;
            margin-bottom: 10px;
            position: absolute;
            top: 20px;
            left: 25px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.1);
            opacity: 0.6;
        }
        
        .rx-stars {
            font-size: 20px;
            color: #ffd700;
            letter-spacing: 4px;
            margin: 40px 0 15px;
            text-shadow: 0 0 5px rgba(255,215,0,0.3);
        }
        
        .rx-review-text {
            font-size: 1.1rem;
            line-height: 1.7;
            color: #333;
            margin: 15px 0 25px;
            flex: 1;
            font-style: italic;
        }
        
        .rx-reviewer {
            display: flex;
            align-items: center;
            gap: 18px;
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid rgba(0,0,0,0.1);
        }
        
        .rx-reviewer-avatar {
            position: relative;
            flex-shrink: 0;
        }
        
        .rx-reviewer-img {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid rgba(255,107,107,0.3);
            transition: all 0.3s ease;
        }
        
        .rx-avatar-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,107,107,0.3), transparent);
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
        }
        
        .rx-review-card:hover .rx-avatar-glow {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        
        .rx-review-card:hover .rx-reviewer-img {
            border-color: #ff6b6b;
            transform: scale(1.05);
        }
        
        .rx-reviewer-info {
            flex: 1;
        }
        
        .rx-reviewer-info h4 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: 600;
            color: #1a1a2e;
        }
        
        .rx-reviewer-info p {
            margin: 4px 0 6px;
            font-size: 0.85rem;
            color: #666;
        }
        
        .rx-verified-badge {
            font-size: 0.75rem;
            color: #4ecdc4;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: rgba(78,205,196,0.1);
            padding: 3px 10px;
            border-radius: 20px;
        }
        
        .rx-nav-btn {
            background: white;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 50%;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #333;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 20;
        }
        
        .rx-nav-btn:hover {
            background: #ff6b6b;
            color: white;
            transform: scale(1.1);
            border-color: #ff6b6b;
            box-shadow: 0 8px 20px rgba(255,107,107,0.3);
        }
        
        .rx-dots-container {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 32px;
        }
        
        .rx-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(0,0,0,0.2);
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            padding: 0;
        }
        
        .rx-dot.active {
            background: #ff6b6b;
            width: 28px;
            border-radius: 10px;
            box-shadow: 0 0 8px rgba(255,107,107,0.4);
        }
        
        .rx-dot:hover {
            background: #ff6b6b;
            transform: scale(1.2);
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .rx-section-title {
                background: linear-gradient(135deg, #e0d4ff, #fff);
                -webkit-background-clip: text;
                background-clip: text;
            }
            .rx-section-subtitle {
                color: rgba(255,255,255,0.7);
            }
            .rx-review-card {
                background: rgba(30, 30, 45, 0.95);
                border-color: rgba(255,255,255,0.1);
            }
            .rx-review-card:hover {
                background: rgba(40, 40, 55, 1);
            }
            .rx-review-text {
                color: rgba(255,255,255,0.9);
            }
            .rx-reviewer-info h4 {
                color: white;
            }
            .rx-reviewer-info p {
                color: rgba(255,255,255,0.6);
            }
            .rx-nav-btn {
                background: rgba(30,30,45,0.9);
                color: white;
                border-color: rgba(255,255,255,0.1);
            }
            .rx-nav-btn:hover {
                background: #ff6b6b;
            }
            .rx-dot {
                background: rgba(255,255,255,0.3);
            }
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            #rx-reviewer { padding: 40px 16px; }
            .rx-section-title { font-size: 1.8rem; }
            .rx-review-card { padding: 24px; }
            .rx-quote-icon { font-size: 60px; top: 15px; left: 20px; }
            .rx-review-text { font-size: 0.95rem; }
            .rx-nav-btn { width: 40px; height: 40px; }
            .rx-reviewer-img { width: 50px; height: 50px; }
        }
        
        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
            .rx-review-card,
            .rx-nav-btn,
            .rx-dot {
                transition: none !important;
                animation: none !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Advanced JavaScript Functionality
    const reviewsContainer = reviewSection.querySelector('.rx-reviews-container');
    const reviewCards = Array.from(reviewSection.querySelectorAll('.rx-review-card'));
    const prevBtn = reviewSection.querySelector('.rx-nav-prev');
    const nextBtn = reviewSection.querySelector('.rx-nav-next');
    const dotsContainer = reviewSection.querySelector('.rx-dots-container');
    
    let currentIndex = 0;
    let autoPlayInterval;
    let isPaused = false;
    let isAnimating = false;

    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        reviewCards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('rx-dot');
            if (index === currentIndex) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to review ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    // Update dots
    function updateDots() {
        const dots = reviewSection.querySelectorAll('.rx-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Update card classes for 3D effect
    function updateCardClasses() {
        reviewCards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');
            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index === (currentIndex - 1 + reviewCards.length) % reviewCards.length) {
                card.classList.add('prev');
            } else if (index === (currentIndex + 1) % reviewCards.length) {
                card.classList.add('next');
            }
        });
    }

    // Go to specific slide
    function goToSlide(index, direction = 'next') {
        if (isAnimating || index === currentIndex) return;
        isAnimating = true;
        
        const targetIndex = (index + reviewCards.length) % reviewCards.length;
        const currentCard = reviewCards[currentIndex];
        const targetCard = reviewCards[targetIndex];
        
        // Reset styles for animation
        targetCard.style.opacity = '0';
        targetCard.style.visibility = 'visible';
        
        requestAnimationFrame(() => {
            currentCard.style.opacity = '0';
            currentCard.style.transform = direction === 'next' ? 'translateX(-20%) scale(0.9)' : 'translateX(20%) scale(0.9)';
            
            targetCard.style.opacity = '1';
            targetCard.style.transform = 'translateX(0) scale(1)';
            
            setTimeout(() => {
                currentIndex = targetIndex;
                updateCardClasses();
                updateDots();
                
                setTimeout(() => {
                    isAnimating = false;
                }, 100);
            }, CONFIG.animationDuration);
        });
    }

    // Next slide
    function nextSlide() {
        if (!isPaused && !isAnimating) {
            goToSlide(currentIndex + 1, 'next');
        }
    }

    // Previous slide
    function prevSlide() {
        if (!isPaused && !isAnimating) {
            goToSlide(currentIndex - 1, 'prev');
        }
    }

    // Auto rotation control
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        if (!CONFIG.autoPlay) return;
        
        autoPlayInterval = setInterval(() => {
            if (!isPaused && !isAnimating) {
                nextSlide();
            }
        }, CONFIG.rotationInterval);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }
    
    function pauseAutoPlay() {
        isPaused = true;
    }
    
    function resumeAutoPlay() {
        isPaused = false;
    }

    // Touch/Swipe support
    let startX = 0;
    let isDragging = false;
    
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    }
    
    function handleTouchMove(e) {
        if (!isDragging || isAnimating) return;
        const moveX = e.touches[0].clientX - startX;
        if (Math.abs(moveX) > CONFIG.touchThreshold) {
            if (moveX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
            isDragging = false;
        }
    }
    
    function handleTouchEnd() {
        isDragging = false;
    }

    // Background image on click (enhanced)
    function setupBackgroundToggle() {
        reviewCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const imageUrl = card.getAttribute('data-image');
                const isActive = card.classList.contains('bg-active');
                
                reviewCards.forEach(c => {
                    c.classList.remove('bg-active');
                    c.style.backgroundImage = '';
                });
                
                if (!isActive) {
                    card.classList.add('bg-active');
                    card.style.backgroundImage = `${CONFIG.backgroundOverlay}, url(${imageUrl})`;
                    card.style.backgroundSize = 'cover';
                    card.style.backgroundPosition = 'center';
                }
            });
        });
    }

    // Keyboard navigation
    function handleKeydown(e) {
        if (!CONFIG.keyboardNavigation) return;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
            if (CONFIG.autoPlay) {
                pauseAutoPlay();
                setTimeout(resumeAutoPlay, 5000);
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
            if (CONFIG.autoPlay) {
                pauseAutoPlay();
                setTimeout(resumeAutoPlay, 5000);
            }
        }
    }

    // Initialize all
    function init() {
        createDots();
        updateCardClasses();
        setupBackgroundToggle();
        
        // Event listeners
        prevBtn.addEventListener('click', () => {
            prevSlide();
            if (CONFIG.autoPlay) {
                pauseAutoPlay();
                setTimeout(resumeAutoPlay, 5000);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            nextSlide();
            if (CONFIG.autoPlay) {
                pauseAutoPlay();
                setTimeout(resumeAutoPlay, 5000);
            }
        });
        
        if (CONFIG.pauseOnHover) {
            reviewsContainer.addEventListener('mouseenter', pauseAutoPlay);
            reviewsContainer.addEventListener('mouseleave', resumeAutoPlay);
        }
        
        if (CONFIG.swipeEnabled) {
            reviewsContainer.addEventListener('touchstart', handleTouchStart);
            reviewsContainer.addEventListener('touchmove', handleTouchMove);
            reviewsContainer.addEventListener('touchend', handleTouchEnd);
        }
        
        document.addEventListener('keydown', handleKeydown);
        
        // Start auto rotation
        startAutoPlay();
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoPlay();
            } else if (CONFIG.autoPlay && !isPaused) {
                startAutoPlay();
            }
        });
    }
    
    init();
});