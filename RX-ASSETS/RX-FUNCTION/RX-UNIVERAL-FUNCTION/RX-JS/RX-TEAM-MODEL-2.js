// RX-TEAM.js - Professional Team Showcase with Advanced Features
// Enhanced Version - Smooth, Modern, Accessible
// Author: RX STUDIO
// www.rosankc.com.np

document.addEventListener('DOMContentLoaded', function() {
    const teamSection = document.getElementById('rx-team-section');
    
    if (!teamSection) {
        console.error('Section with id="rx-team-section" not found!');
        return;
    }

    // Advanced Configuration
    const CONFIG = {
        slideDuration: 5000,
        animationDuration: 600,
        animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        pauseOnHover: true,
        touchSensitivity: 50,
        mobileBreakpoint: 768,
        autoPlay: true,
        keyboardNavigation: true,
        showNavigationDots: true,
        showNavigationArrows: true,
        cardHoverEffect: true,
        glassMorphism: true
    };

    // Enhanced HTML Structure
    teamSection.innerHTML = `
        <div class="rx-team-wrapper">
             <div class="rx-team-carousel-container">
                <button class="rx-team-nav rx-team-prev" aria-label="Previous team member">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                    </svg>
                </button>
                
                <div class="rx-team-slider-container">
                    <div class="rx-team-slider">
                        <div class="rx-team-slide">
                            <div class="rx-team-card">
                                <div class="rx-card-bg"></div>
                                <div class="rx-team-image-wrapper">
                                    <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/A-1.png" alt="ROSAN KC" class="rx-team-image">
                                    <div class="rx-image-overlay"></div>
                                    <div class="rx-team-status active">Active</div>
                                </div>
                                <div class="rx-team-info">
                                    <h3 class="rx-team-name">ROSAN KC</h3>
                                    <p class="rx-team-position">Founder & Creative Director</p>
                                    <div class="rx-team-location">
                                        <svg viewBox="0 0 24 24" width="14" height="14">
                                            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                        <span>Banganga-10, Kapilvastu, Nepal</span>
                                    </div>
                                    <p class="rx-team-bio">Passionate graphic designer and creative director with over 5 years of experience in branding and visual storytelling.</p>
                                    <div class="rx-team-social">
                                        <a href="https://www.facebook.com/Rosan.2061" class="rx-social-link facebook"  target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook"></i> </a>
                                        <a href="https://www.tiktok.com/@rosankc2061" class="rx-social-link tiktok"  target="_blank"  rel="noopener noreferrer"> <i class="fa-brands fa-tiktok"></i> </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="rx-team-slide">
                            <div class="rx-team-card">
                                <div class="rx-card-bg"></div>
                                <div class="rx-team-image-wrapper">
                                    <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/T-0.jpg" alt="Team Member" class="rx-team-image">
                                    <div class="rx-image-overlay"></div>
                                    <div class="rx-team-status">Coming Soon</div>
                                </div>
                                <div class="rx-team-info">
                                    <h3 class="rx-team-name">Join Our Team</h3>
                                    <p class="rx-team-position">Position Available</p>
                                    <div class="rx-team-location">
                                        <svg viewBox="0 0 24 24" width="14" height="14">
                                            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                        </svg>
                                        <span>Remote / On-site</span>
                                    </div>
                                    <p class="rx-team-bio">We're always looking for talented designers and developers to join our creative team.</p>
                                    <a href="Contact.html" class="rx-team-apply-btn">Apply Now →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="rx-team-nav rx-team-next" aria-label="Next team member">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                </button>
            </div>
            
            <div class="rx-team-dots"></div>
        </div>
    `;

    // Enhanced CSS Styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rx-teamFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes rx-teamPulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.05); opacity: 1; }
        }
        
        @keyframes rx-teamGlow {
            0% { box-shadow: 0 0 0 0 rgba(255,107,107,0.4); }
            70% { box-shadow: 0 0 0 10px rgba(255,107,107,0); }
            100% { box-shadow: 0 0 0 0 rgba(255,107,107,0); }
        }
        
        #rx-team-section {
            padding: 60px 20px;
            background: transparent;
            position: relative;
            overflow: hidden;
        }
        
        .rx-team-wrapper {
            max-width: 500px;
            margin: 0 auto;
        }
        
        .rx-team-header {
            text-align: center;
            margin-bottom: 40px;
            animation: rx-teamFadeIn 0.8s ease;
        }
        
        .rx-team-title {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            margin-bottom: 12px;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            position: relative;
        }
      
        .rx-team-subtitle {
            color: #666;
            font-size: 1rem;
            letter-spacing: 1px;
        }
        
        .rx-team-carousel-container {
            position: relative;
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .rx-team-slider-container {
            flex: 1;
            overflow: hidden;
            border-radius: 28px;
        }
        
        .rx-team-slider {
            display: flex;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .rx-team-slide {
            flex-shrink: 0;
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
        }
        
        .rx-team-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 28px;
            overflow: hidden;
            box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .rx-team-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 30px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .rx-card-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 120px;
            background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
            opacity: 0.1;
        }
        
        .rx-team-image-wrapper {
            position: relative;
            padding-top: 20px;
            text-align: center;
        }
        
        .rx-team-image {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid white;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            position: relative;
            z-index: 2;
        }
        
        .rx-team-card:hover .rx-team-image {
            transform: scale(1.02);
            border-color: #ff6b6b;
        }
        
        .rx-image-overlay {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 140px;
            height: 140px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,107,107,0.2), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        
        .rx-team-card:hover .rx-image-overlay {
            opacity: 1;
        }
        
        .rx-team-status {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            background: #4ecdc4;
            color: white;
            font-size: 0.7rem;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: 500;
            z-index: 3;
            white-space: nowrap;
        }
        
        .rx-team-status.active {
            background: #4ecdc4;
            animation: rx-teamPulse 2s ease-in-out infinite;
        }
        
        .rx-team-info {
            padding: 24px 24px 32px;
            text-align: center;
        }
        
        .rx-team-name {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 0 6px;
            background: linear-gradient(135deg, #1a1a2e, #333);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
        }
        
        .rx-team-position {
            color: #ff6b6b;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 1px;
            margin-bottom: 12px;
        }
        
        .rx-team-location {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #f0f0f0;
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 0.75rem;
            color: #666;
            margin-bottom: 16px;
        }
        
        .rx-team-bio {
            font-size: 0.9rem;
            line-height: 1.6;
            color: #555;
            margin: 16px 0 20px;
        }
        
        .rx-team-social {
            display: flex;
            justify-content: center;
            gap: 15px;
        }
        
        .rx-social-link {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            color: white;
            text-decoration: none;
        }
        
        .rx-social-link.facebook {
            background: #1877f2;
            box-shadow: 0 4px 10px rgba(24,119,242,0.3);
        }
        
        .rx-social-link.tiktok {
            background: #000000;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        
        .rx-social-link:hover {
            transform: translateY(-3px) scale(1.05);
        }
        
        .rx-team-apply-btn {
            display: inline-block;
            background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
            border: none;
            padding: 10px 24px;
            border-radius: 30px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .rx-team-apply-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(255,107,107,0.4);
        }
        
        .rx-team-nav {
            background: white;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 50%;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #333;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .rx-team-nav:hover {
            background: #ff6b6b;
            color: white;
            transform: scale(1.1);
            border-color: #ff6b6b;
        }
        
        .rx-team-dots {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 32px;
        }
        
        .rx-team-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(0,0,0,0.2);
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            padding: 0;
        }
        
        .rx-team-dot.active {
            background: #ff6b6b;
            width: 24px;
            border-radius: 10px;
        }
        
        .rx-team-dot:hover {
            background: #ff6b6b;
            transform: scale(1.2);
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .rx-team-title {
                background: linear-gradient(135deg, #e0d4ff, #fff);
                background-clip: text;
                -webkit-background-clip: text;
            }
            .rx-team-subtitle {
                color: rgba(255,255,255,0.7);
            }
            .rx-team-card {
                background: rgba(30, 30, 45, 0.95);
                border-color: rgba(255,255,255,0.1);
            }
            .rx-team-name {
                background: linear-gradient(135deg, #e0d4ff, #fff);
                background-clip: text;
                -webkit-background-clip: text;
            }
            .rx-team-position {
                color: #ff8e8e;
            }
            .rx-team-location {
                background: rgba(255,255,255,0.1);
                color: rgba(255,255,255,0.7);
            }
            .rx-team-bio {
                color: rgba(255,255,255,0.8);
            }
            .rx-team-nav {
                background: rgba(30,30,45,0.9);
                color: white;
                border-color: rgba(255,255,255,0.1);
            }
            .rx-team-dot {
                background: rgba(255,255,255,0.3);
            }
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            #rx-team-section { padding: 40px 16px; }
            .rx-team-title { font-size: 1.8rem; }
            .rx-team-image { width: 110px; height: 110px; }
            .rx-image-overlay { width: 110px; height: 110px; }
            .rx-team-nav { width: 38px; height: 38px; }
            .rx-team-info { padding: 20px 20px 28px; }
            .rx-team-name { font-size: 1.3rem; }
        }
    `;
    document.head.appendChild(style);

    // Advanced Slider Functionality
    const slider = teamSection.querySelector('.rx-team-slider');
    const slides = Array.from(teamSection.querySelectorAll('.rx-team-slide'));
    const prevBtn = teamSection.querySelector('.rx-team-prev');
    const nextBtn = teamSection.querySelector('.rx-team-next');
    const dotsContainer = teamSection.querySelector('.rx-team-dots');
    
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoPlayInterval;
    let isAnimating = false;
    let isPaused = false;
    let startX = 0;
    let isDragging = false;

    // Create dots
    function createDots() {
        if (!CONFIG.showNavigationDots) return;
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('rx-team-dot');
            if (index === currentIndex) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to team member ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        const dots = teamSection.querySelectorAll('.rx-team-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index, animate = true) {
        if (isAnimating || index === currentIndex) return;
        isAnimating = true;
        
        const targetIndex = Math.max(0, Math.min(index, totalSlides - 1));
        const offset = -targetIndex * 100;
        
        if (!animate) {
            slider.style.transition = 'none';
        } else {
            slider.style.transition = `transform ${CONFIG.animationDuration}ms ${CONFIG.animationEasing}`;
        }
        
        slider.style.transform = `translateX(${offset}%)`;
        
        setTimeout(() => {
            currentIndex = targetIndex;
            updateDots();
            updateAriaAttributes();
            isAnimating = false;
            
            // Reset transition after non-animated move
            if (!animate) {
                slider.style.transition = `transform ${CONFIG.animationDuration}ms ${CONFIG.animationEasing}`;
            }
        }, animate ? CONFIG.animationDuration : 10);
    }

    function updateAriaAttributes() {
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== currentIndex);
            const card = slide.querySelector('.rx-team-card');
            if (card) {
                card.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
            }
        });
    }

    function nextSlide() {
        if (!isPaused && !isAnimating) {
            goToSlide((currentIndex + 1) % totalSlides);
        }
    }

    function prevSlide() {
        if (!isPaused && !isAnimating) {
            goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
        }
    }

    function startAutoPlay() {
        if (!CONFIG.autoPlay) return;
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, CONFIG.slideDuration);
    }

    function pauseAutoPlay() {
        isPaused = true;
        clearInterval(autoPlayInterval);
    }

    function resumeAutoPlay() {
        isPaused = false;
        if (CONFIG.autoPlay) {
            startAutoPlay();
        }
    }

    // Touch swipe support
    function setupTouchEvents() {
        const container = teamSection.querySelector('.rx-team-slider-container');
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            pauseAutoPlay();
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const moveX = e.touches[0].clientX - startX;
            if (Math.abs(moveX) > CONFIG.touchSensitivity) {
                if (moveX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
                isDragging = false;
            }
        });
        
        container.addEventListener('touchend', () => {
            isDragging = false;
            resumeAutoPlay();
        });
    }

    // Keyboard navigation
    function setupKeyboardNavigation() {
        if (!CONFIG.keyboardNavigation) return;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                if (CONFIG.autoPlay) {
                    pauseAutoPlay();
                    setTimeout(resumeAutoPlay, 5000);
                }
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                if (CONFIG.autoPlay) {
                    pauseAutoPlay();
                    setTimeout(resumeAutoPlay, 5000);
                }
            }
        });
    }

    // Handle visibility change
    function setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseAutoPlay();
            } else if (CONFIG.autoPlay && !isPaused) {
                startAutoPlay();
            }
        });
    }

    // Initialize everything
    function init() {
        if (slider && slides.length > 0) {
            createDots();
            updateAriaAttributes();
            startAutoPlay();
            setupTouchEvents();
            setupKeyboardNavigation();
            setupVisibilityHandler();
            
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
                slider.addEventListener('mouseenter', pauseAutoPlay);
                slider.addEventListener('mouseleave', resumeAutoPlay);
            }
        }
    }
    
    init();
});