document.addEventListener('DOMContentLoaded', function() {
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