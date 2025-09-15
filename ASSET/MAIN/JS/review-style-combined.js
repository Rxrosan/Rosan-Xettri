// REVIEW-STYLE.js - Combined with CSS
document.addEventListener('DOMContentLoaded', function() {
    // Inject CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .reviews-container {
            display: flex;
            flex-direction: column;
            gap: 30px;
            margin: 40px auto;
            max-width: 800px;
            position: relative;
            min-height: 400px;
        }
        
        .review-card {
            background: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: #ffffffff;
            padding: 30px;
            border-radius: 16px;
            position: absolute;
            width: 100%;
            box-sizing: border-box;
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 
                0 4px 30px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 0 25px rgba(255, 255, 255, 0.05);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 250px;
            top: 0;
            left: 0;
            z-index: 1;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .review-card.active {
            z-index: 2;
            box-shadow: 
                0 10px 40px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.15),
                inset 0 0 35px rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.15);
        }
        
        .review-card.current {
            opacity: 1;
            transform: translateY(0);
            position: relative;
            z-index: 3;
        }
        
        .review-card:hover {
            transform: translateY(-5px) scale(1.01) !important;
            box-shadow: 
                0 15px 35px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.2),
                inset 0 0 40px rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.12);
        }
        
        .quote-icon {
            font-size: 60px;
            line-height: 0;
            margin-bottom: 10px;
            color: rgba(255, 255, 255, 0.3);
            font-family: Georgia, serif;
            position: absolute;
            top: 15px;
            left: 25px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .review-text {
            position: relative;
            margin: 30px 0 25px;
            font-size: 18px;
            line-height: 1.6;
            padding: 0 10px;
            z-index: 1;
            text-shadow: 0 1px 3px rgba(233, 9, 9, 0.88);
        }
        
        .reviewer {
            display: flex;
            align-items: center;
            position: relative;
            z-index: 1;
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .reviewer-img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-right: 20px;
            object-fit: cover;
            border: 2px solid rgba(255, 255, 255, 0.4);
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.1);
        }
        
        .review-card:hover .reviewer-img {
            border-color: rgba(255, 255, 255, 0.8);
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .reviewer-info h4 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        .reviewer-info p {
            margin: 5px 0 0;
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        /* Background image when active */
        .review-card.active::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-size: cover;
            background-position: center;
            opacity: 0.2;
            z-index: 0;
            border-radius: 16px;
            filter: blur(5px);
        }
        
        /* Liquid glass effect overlay */
        .review-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0.1) 100%
            );
            border-radius: 16px;
            pointer-events: none;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);

    // Original JavaScript functionality
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewsContainer = document.querySelector('.reviews-container');
    let currentIndex = 0;
    let rotationInterval;
    let isAnimating = false;
    let isPaused = false;

    // Configuration object for easy customization
    const config = {
        rotationInterval: 5000,    // Time between rotations (ms)
        animationDuration: 500,   // Animation duration (ms)
        verticalOffset: 20,       // Vertical movement during animation (px)
        mobileBreakpoint: 768,    // Breakpoint for mobile adjustments (px)
        bgOverlay: 'linear-gradient(rgba(0, 0, 2, 0.7), rgba(6, 0, 10, 0.7))',
        bgColor: 'rgba(6, 0, 10, 0.7)'
    };

    // Initialize cards with proper transitions
    function initializeCards() {
        reviewCards.forEach((card, index) => {
            // Responsive card styling
            card.style.aspectRatio = '1/1';
            card.style.display = 'flex';
            card.style.position = 'absolute';
            card.style.top = '0';
            card.style.left = '0';
            card.style.width = '100%';
            card.style.height = '100%';
            card.style.opacity = index === 0 ? '1' : '0';
            card.style.transform = index === 0 ? 'translateY(0)' : `translateY(${config.verticalOffset}px)`;
            card.style.transition = `opacity ${config.animationDuration}ms ease, transform ${config.animationDuration}ms ease, background ${config.animationDuration}ms ease`;
            card.style.pointerEvents = 'auto';
            
            // Set background image properties
            const imageUrl = card.getAttribute('data-image');
            card.style.setProperty('--bg-image', `url(${imageUrl})`);
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center center';
            card.style.backgroundRepeat = 'no-repeat';
            
            // Set initial state
            if (index === 0) {
                card.classList.add('current');
            } else {
                card.classList.remove('current');
            }

            // Add accessibility attributes
            card.setAttribute('aria-hidden', index !== 0);
            card.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        // Handle mobile layout
        updateMobileLayout();
    }

    // Update layout for mobile devices
    function updateMobileLayout() {
        const isMobile = window.innerWidth < config.mobileBreakpoint;
        reviewCards.forEach(card => {
            if (isMobile) {
                card.style.aspectRatio = '3/4';
                card.style.backgroundPosition = 'top center';
            } else {
                card.style.aspectRatio = '1/1';
                card.style.backgroundPosition = 'center center';
            }
        });
    }

    // Rotate to next review with smooth animation
    function rotateReviews(direction = 1) {
        if (isAnimating || isPaused) return;
        
        isAnimating = true;
        const currentCard = reviewCards[currentIndex];
        const nextIndex = (currentIndex + direction + reviewCards.length) % reviewCards.length;
        const nextCard = reviewCards[nextIndex];
        
        // Prepare next card
        nextCard.style.display = 'flex';
        nextCard.style.opacity = '0';
        nextCard.style.transform = `translateY(${direction * config.verticalOffset}px)`;
        
        // Animate out current card
        currentCard.style.opacity = '0';
        currentCard.style.transform = `translateY(${-direction * config.verticalOffset}px)`;
        currentCard.classList.remove('current');
        currentCard.setAttribute('aria-hidden', 'true');
        currentCard.setAttribute('tabindex', '-1');
        
        // Animate in next card
        setTimeout(() => {
            nextCard.style.opacity = '1';
            nextCard.style.transform = 'translateY(0)';
            nextCard.classList.add('current');
            nextCard.setAttribute('aria-hidden', 'false');
            nextCard.setAttribute('tabindex', '0');
            
            // Hide previous card after animation
            setTimeout(() => {
                currentCard.style.display = 'none';
                currentIndex = nextIndex;
                isAnimating = false;
            }, 50);
        }, 50);
    }

    // Start auto-rotation
    function startRotation() {
        clearInterval(rotationInterval);
        rotationInterval = setInterval(() => rotateReviews(1), config.rotationInterval);
    }

    // Pause rotation on hover/focus
    function pauseRotation() {
        isPaused = true;
        clearInterval(rotationInterval);
    }

    // Resume rotation
    function resumeRotation() {
        isPaused = false;
        startRotation();
    }

    // Toggle image background with enhanced effects
    function toggleReviewImage(card) {
        if (isAnimating) return;
        
        // Close other active cards
        document.querySelectorAll('.review-card.active').forEach(el => {
            if (el !== card) {
                el.classList.remove('active');
                el.style.backgroundImage = 'none';
                el.style.backgroundColor = config.bgColor;
            }
        });
        
        // Toggle current card
        const isActivating = !card.classList.contains('active');
        card.classList.toggle('active');
        
        if (isActivating) {
            const imageUrl = card.getAttribute('data-image');
            card.style.backgroundImage = `${config.bgOverlay}, url(${imageUrl})`;
        } else {
            card.style.backgroundImage = 'none';
            card.style.backgroundColor = config.bgColor;
        }
    }

    // Initialize and start rotation
    initializeCards();
    startRotation();

    // Event listeners
    reviewsContainer.addEventListener('click', function(e) {
        const card = e.target.closest('.review-card');
        if (card && !isAnimating) {
            toggleReviewImage(card);
        }
    });

    // Pause on hover/focus for better UX
    reviewsContainer.addEventListener('mouseenter', pauseRotation);
    reviewsContainer.addEventListener('mouseleave', resumeRotation);
    reviewsContainer.addEventListener('focusin', pauseRotation);
    reviewsContainer.addEventListener('focusout', resumeRotation);

    // Navigation controls
    document.querySelector('.prev-btn')?.addEventListener('click', () => rotateReviews(-1));
    document.querySelector('.next-btn')?.addEventListener('click', () => rotateReviews(1));

    // Handle window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!isAnimating) {
                updateMobileLayout();
                reviewCards.forEach(card => {
                    card.style.transition = 'none';
                    card.style.opacity = card.classList.contains('current') ? '1' : '0';
                    card.style.transform = card.classList.contains('current') ? 'translateY(0)' : `translateY(${config.verticalOffset}px)`;
                    
                    // Force reflow
                    void card.offsetHeight;
                    
                    card.style.transition = `opacity ${config.animationDuration}ms ease, transform ${config.animationDuration}ms ease, background ${config.animationDuration}ms ease`;
                });
            }
        }, 100);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.review-card')) {
            if (e.key === 'ArrowLeft') {
                rotateReviews(-1);
            } else if (e.key === 'ArrowRight') {
                rotateReviews(1);
            }
        }
    });
});