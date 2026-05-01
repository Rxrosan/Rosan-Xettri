// RX-REVIEWER.js - Auto-fills rx-reviewer section with enhanced responsive design and typing animation
// autor : RX STUDIO
// www.rosankc.com.np

document.addEventListener('DOMContentLoaded', function() {
    // Find your existing section with id="rx-reviewer"
    const reviewSection = document.getElementById('rx-reviewer');
    
    if (!reviewSection) {
        console.error('Section with id="rx-reviewer" not found!');
        return;
    }

    // Review data array for easier management and typing animation
    const reviewsData = [
        {
            text: "Rosan Khattri Chettri is a talented and reliable graphic designer with a strong eye for detail. He specializes in logos, business cards, and branding, always delivering creative and high-quality work. Highly recommended!",
            name: "Puja Acharya Shrestha",
            location: "Palpa, Nepal",
            image: "RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-3.jpg"
        },
        {
            text: "Rosan Khattri Chettri is a talented graphic designer with experience, specializing in logos, business cards, and more. He delivers creative and professional work. Highly recommended!",
            name: "कुस्मा तरामु मगर",
            location: "Gulmi-Lumpek",
            image: "RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-1.jpg"
        },
        {
            text: "Rosan Xettri is known for his dedication to excellence in graphic design and gaming. His innovative mindset, coupled with his refined skills, allows him to create visually stunning designs and achieve remarkable success in the gaming world.",
            name: "Rita Magar",
            location: "Banganga-5, Kapilvastu",
            image: "RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-2.jpg"
        },
        {
            text: "Rosan Xettri is a talented graphic designer and gamer who seamlessly blends creativity with technical expertise. His innovative approach and attention to detail make his work stand out, consistently delivering high-quality results.",
            name: "Pawana Thapaliya",
            location: "Kathmandu, Nepal",
            image: "RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-6.jpg"
        }
    ];

    // Generate HTML from reviews data
    let cardsHTML = '<div class="rx-reviews-container">';
    reviewsData.forEach((review, index) => {
        cardsHTML += `
            <div class="rx-review-card" data-image="${review.image}" data-index="${index}">
                <div class="rx-quote-icon">"</div>
                <p class="rx-review-text" data-fulltext="${escapeHtml(review.text)}"></p>
                <div class="rx-reviewer">
                    <img src="${review.image}" alt="Reviewer" class="rx-reviewer-img" loading="lazy">
                    <div class="rx-reviewer-info">
                        <h4>${escapeHtml(review.name)}</h4>
                        <p>${escapeHtml(review.location)}</p>
                    </div>
                </div>
            </div>
        `;
    });
    cardsHTML += '</div>';
    reviewSection.innerHTML = cardsHTML;

    // Helper function to escape HTML
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
            return c;
        });
    }

    // ==================== TYPING ANIMATION CLASS ====================
    class TypingAnimation {
        constructor(element, fullText, onComplete) {
            this.element = element;
            this.fullText = fullText;
            this.onComplete = onComplete;
            this.currentIndex = 0;
            this.isTyping = false;
            this.timeout = null;
            this.completed = false;
        }

        start() {
            if (this.isTyping) return;
            if (this.completed) {
                this.reset();
            }
            this.isTyping = true;
            if (this.currentIndex === 0) {
                this.element.textContent = '';
            }
            this.typeNextChar();
        }

        typeNextChar() {
            if (this.currentIndex < this.fullText.length) {
                this.element.textContent += this.fullText.charAt(this.currentIndex);
                this.currentIndex++;
                const delay = this.getTypingDelay(this.fullText.charAt(this.currentIndex - 1));
                this.timeout = setTimeout(() => this.typeNextChar(), delay);
            } else {
                this.completed = true;
                this.isTyping = false;
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                }
                if (this.onComplete) this.onComplete();
            }
        }

        getTypingDelay(char) {
            if (char === '.' || char === '!' || char === '?') return 200;
            if (char === ',' || char === ';') return 120;
            if (char === ' ') return 60;
            return 40 + Math.random() * 30;
        }

        stop() {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.isTyping = false;
        }

        reset() {
            this.stop();
            this.currentIndex = 0;
            this.completed = false;
            this.element.textContent = '';
        }
        
        isCompleted() {
            return this.completed;
        }
        
        getCurrentProgress() {
            return this.currentIndex;
        }
        
        setProgress(index) {
            this.currentIndex = index;
        }
    }

    // ==================== GLOBAL VARIABLES ====================
    let currentTypingAnimation = null;
    let rotateTimeout = null;
    let isPaused = false;
    let currentIndex = 0;
    let isAnimating = false;
    let isAutoRotateEnabled = true;

    // ==================== CONFIGURATION ====================
    const config = {
        animationDuration: 500,
        verticalOffset: 20,
        mobileBreakpoint: 768,
        bgOverlay: 'linear-gradient(rgba(0, 0, 2, 0.3), rgba(6, 0, 10, 0.3))',
        bgColor: 'transparent',
        autoRotateDelay: 3000,
        swipeThreshold: 50,
        swipeMaxTime: 300,
        swipeVerticalThreshold: 30
    };

    // Get DOM elements
    const reviewCards = document.querySelectorAll('.rx-review-card');
    const reviewsContainer = document.querySelector('.rx-reviews-container');

    // ==================== TYPING CONTROL FUNCTIONS ====================
    
    function startTypingForCard(card, onCompleteCallback) {
        const textElement = card.querySelector('.rx-review-text');
        if (!textElement) return;
        
        if (currentTypingAnimation) {
            currentTypingAnimation.stop();
            currentTypingAnimation = null;
        }
        
        if (rotateTimeout) {
            clearTimeout(rotateTimeout);
            rotateTimeout = null;
        }
        
        const fullText = textElement.getAttribute('data-fulltext') || '';
        textElement.textContent = '';
        
        currentTypingAnimation = new TypingAnimation(textElement, fullText, () => {
            currentTypingAnimation = null;
            if (onCompleteCallback) {
                onCompleteCallback();
            } else if (!isPaused && isAutoRotateEnabled) {
                rotateTimeout = setTimeout(() => {
                    if (!isPaused && isAutoRotateEnabled) {
                        rotateReviews(1);
                    }
                    rotateTimeout = null;
                }, config.autoRotateDelay);
            }
        });
        
        currentTypingAnimation.start();
    }

    function resetTypingForCard(card) {
        const textElement = card.querySelector('.rx-review-text');
        if (textElement) {
            if (currentTypingAnimation && currentTypingAnimation.element === textElement) {
                currentTypingAnimation.stop();
                currentTypingAnimation = null;
            }
            textElement.textContent = '';
        }
    }
    
    function pauseTyping() {
        if (currentTypingAnimation) {
            currentTypingAnimation.stop();
        }
        if (rotateTimeout) {
            clearTimeout(rotateTimeout);
            rotateTimeout = null;
        }
    }
    
    function resumeTyping() {
        const currentCard = document.querySelector('.rx-review-card.current');
        if (currentCard) {
            const textElement = currentCard.querySelector('.rx-review-text');
            const fullText = textElement.getAttribute('data-fulltext') || '';
            const currentTextLength = textElement.textContent.length;
            
            if (currentTextLength < fullText.length) {
                if (currentTypingAnimation) {
                    currentTypingAnimation.stop();
                    currentTypingAnimation = null;
                }
                
                currentTypingAnimation = new TypingAnimation(textElement, fullText, () => {
                    currentTypingAnimation = null;
                    if (!isPaused && isAutoRotateEnabled) {
                        rotateTimeout = setTimeout(() => {
                            if (!isPaused && isAutoRotateEnabled) {
                                rotateReviews(1);
                            }
                            rotateTimeout = null;
                        }, config.autoRotateDelay);
                    }
                });
                currentTypingAnimation.currentIndex = currentTextLength;
                currentTypingAnimation.start();
            } else if (currentTextLength >= fullText.length) {
                if (!isPaused && isAutoRotateEnabled) {
                    rotateTimeout = setTimeout(() => {
                        if (!isPaused && isAutoRotateEnabled) {
                            rotateReviews(1);
                        }
                        rotateTimeout = null;
                    }, config.autoRotateDelay);
                }
            }
        }
    }

    // ==================== CARD ROTATION FUNCTIONS ====================
    
    function rotateReviews(direction = 1) {
        if (isAnimating || isPaused) return;
        
        isAnimating = true;
        const currentCard = reviewCards[currentIndex];
        const nextIndex = (currentIndex + direction + reviewCards.length) % reviewCards.length;
        const nextCard = reviewCards[nextIndex];
        
        if (rotateTimeout) {
            clearTimeout(rotateTimeout);
            rotateTimeout = null;
        }
        
        if (currentTypingAnimation) {
            currentTypingAnimation.stop();
            currentTypingAnimation = null;
        }
        
        currentCard.style.opacity = '0';
        currentCard.style.transform = `translateY(${-direction * config.verticalOffset}px)`;
        currentCard.classList.remove('current');
        currentCard.setAttribute('aria-hidden', 'true');
        currentCard.setAttribute('tabindex', '-1');
        
        nextCard.style.display = 'flex';
        nextCard.style.opacity = '0';
        nextCard.style.transform = `translateY(${direction * config.verticalOffset}px)`;
        
        void nextCard.offsetHeight;
        
        setTimeout(() => {
            nextCard.style.opacity = '1';
            nextCard.style.transform = 'translateY(0)';
            nextCard.classList.add('current');
            nextCard.setAttribute('aria-hidden', 'false');
            nextCard.setAttribute('tabindex', '0');
            
            startTypingForCard(nextCard);
            
            setTimeout(() => {
                currentCard.style.display = 'flex';
                currentIndex = nextIndex;
                isAnimating = false;
            }, 50);
        }, 50);
    }
    
    function nextReview() {
        if (!isAnimating && !isPaused) {
            rotateReviews(1);
        }
    }
    
    function prevReview() {
        if (!isAnimating && !isPaused) {
            rotateReviews(-1);
        }
    }

    // ==================== TOGGLE IMAGE BACKGROUND FUNCTION (FIXED FOR MOBILE) ====================
    
    function toggleReviewImage(card) {
        if (isAnimating) return;
        
        // Remove active class from all other cards
        document.querySelectorAll('.rx-review-card.active').forEach(el => {
            if (el !== card) {
                el.classList.remove('active');
                el.style.backgroundImage = '';
                el.style.backgroundColor = '';
            }
        });
        
        // Toggle active class on clicked card
        const isActivating = !card.classList.contains('active');
        
        if (isActivating) {
            card.classList.add('active');
            const imageUrl = card.getAttribute('data-image');
            // Apply background image with overlay for better readability
            card.style.backgroundImage = `${config.bgOverlay}, url('${imageUrl}')`;
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';
            card.style.backgroundRepeat = 'no-repeat';
        } else {
            card.classList.remove('active');
            card.style.backgroundImage = '';
            card.style.backgroundColor = '';
        }
    }

    // ==================== DOUBLE TAP DETECTION (FIXED FOR MOBILE) ====================
    
    let lastTapTime = 0;
    let tapTimeoutId = null;
    
    function handleDoubleTap() {
        isPaused = !isPaused;
        
        if (isPaused) {
            pauseTyping();
        } else {
            resumeTyping();
        }
    }
    
    // Universal click/tap handler for all devices
    function handleCardInteraction(card, event) {
        if (!card || isAnimating) return;
        
        const currentTime = new Date().getTime();
        const tapInterval = currentTime - lastTapTime;
        
        // Clear any pending single tap timeout
        if (tapTimeoutId) {
            clearTimeout(tapTimeoutId);
            tapTimeoutId = null;
        }
        
        if (tapInterval < 300 && tapInterval > 0 && lastTapTime !== 0) {
            // DOUBLE TAP detected
            lastTapTime = 0;
            handleDoubleTap();
            event.preventDefault();
            event.stopPropagation();
        } else {
            // SINGLE TAP - wait to see if double tap follows
            lastTapTime = currentTime;
            tapTimeoutId = setTimeout(() => {
                toggleReviewImage(card);
                lastTapTime = 0;
                tapTimeoutId = null;
            }, 300);
        }
    }

    // ==================== SWIPE GESTURE FUNCTIONS (FIXED FOR MOBILE) ====================
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwiping = false;
    let touchMoved = false;

    function handleTouchStart(event) {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        isSwiping = true;
        touchMoved = false;
    }

    function handleTouchMove(event) {
        if (!isSwiping) return;
        
        const touch = event.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        // Check if this is a horizontal swipe
        if (Math.abs(deltaX) > 10) {
            touchMoved = true;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                event.preventDefault();
            }
        }
    }

    function handleTouchEnd(event) {
        if (!isSwiping) {
            // If not swiping, handle as tap on the card
            const card = event.target.closest('.rx-review-card');
            if (card && !touchMoved) {
                handleCardInteraction(card, event);
            }
            return;
        }
        
        isSwiping = false;
        
        if (!touchMoved) {
            // This was a tap, not a swipe
            const card = event.target.closest('.rx-review-card');
            if (card) {
                handleCardInteraction(card, event);
            }
            touchStartX = 0;
            touchStartY = 0;
            touchStartTime = 0;
            touchMoved = false;
            return;
        }
        
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndTime = Date.now();
        const deltaX = touchEndX - touchStartX;
        const deltaTime = touchEndTime - touchStartTime;
        
        // Check if swipe meets conditions
        if (Math.abs(deltaX) >= config.swipeThreshold && deltaTime <= config.swipeMaxTime) {
            if (deltaX > 0) {
                // Swipe right - go to previous review
                if (!isAnimating && !isPaused) {
                    prevReview();
                }
            } else {
                // Swipe left - go to next review
                if (!isAnimating && !isPaused) {
                    nextReview();
                }
            }
        }
        
        touchStartX = 0;
        touchStartY = 0;
        touchStartTime = 0;
        touchMoved = false;
    }

    function initSwipeDetection() {
        reviewsContainer.removeEventListener('touchstart', handleTouchStart);
        reviewsContainer.removeEventListener('touchmove', handleTouchMove);
        reviewsContainer.removeEventListener('touchend', handleTouchEnd);
        
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            reviewsContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
            reviewsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
            reviewsContainer.addEventListener('touchend', handleTouchEnd);
        }
    }

    // ==================== PAUSE/RESUME FUNCTIONS ====================
    
    function pauseAutoRotate() {
        if (!isPaused) {
            isPaused = true;
            pauseTyping();
        }
    }
    
    function resumeAutoRotate() {
        if (isPaused) {
            isPaused = false;
            resumeTyping();
        }
    }
    
    function togglePause() {
        if (isPaused) {
            resumeAutoRotate();
        } else {
            pauseAutoRotate();
        }
    }

    // ==================== RESIZE HANDLER ====================
    
    function updateMobileLayout() {
        const isMobile = window.innerWidth < config.mobileBreakpoint;
        reviewCards.forEach(card => {
            if (isMobile) {
                card.style.minHeight = '280px';
            } else {
                card.style.minHeight = '380px';
            }
        });
        
        if (reviewsContainer) {
            reviewsContainer.style.minHeight = isMobile ? '320px' : '450px';
        }
    }
    
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!isAnimating) {
                updateMobileLayout();
                reviewCards.forEach(card => {
                    card.style.transition = 'none';
                    card.style.opacity = card.classList.contains('current') ? '1' : '0';
                    card.style.transform = card.classList.contains('current') ? 'translateY(0)' : `translateY(${config.verticalOffset}px)`;
                    
                    void card.offsetHeight;
                    
                    card.style.transition = `opacity ${config.animationDuration}ms ease, transform ${config.animationDuration}ms ease`;
                });
                
                initSwipeDetection();
            }
        }, 100);
    }

    // ==================== INITIALIZATION FUNCTION ====================
    
    function initializeCards() {
        reviewCards.forEach((card, index) => {
            card.style.display = 'flex';
            card.style.position = 'absolute';
            card.style.top = '0';
            card.style.left = '0';
            card.style.right = '0';
            card.style.width = '100%';
            card.style.boxSizing = 'border-box';
            card.style.minHeight = window.innerWidth < config.mobileBreakpoint ? '280px' : '380px';
            card.style.opacity = index === 0 ? '1' : '0';
            card.style.transform = index === 0 ? 'translateY(0)' : `translateY(${config.verticalOffset}px)`;
            card.style.transition = `opacity ${config.animationDuration}ms ease, transform ${config.animationDuration}ms ease`;
            card.style.cursor = 'pointer';
            
            if (index === 0) {
                card.classList.add('current');
                setTimeout(() => startTypingForCard(card), 100);
            } else {
                card.classList.remove('current');
                resetTypingForCard(card);
            }

            card.setAttribute('aria-hidden', index !== 0);
            card.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        updateMobileLayout();
        initSwipeDetection();
    }

    // ==================== CLICK HANDLER FOR DESKTOP ====================
    
    reviewsContainer.addEventListener('click', function(e) {
        // Only handle clicks on non-touch devices or as fallback
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouchDevice) {
            const card = e.target.closest('.rx-review-card');
            if (card && !isAnimating) {
                handleCardInteraction(card, e);
            }
        }
    });

    // ==================== KEYBOARD NAVIGATION ====================
    
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.rx-review-card')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevReview();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextReview();
            } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Space') {
                e.preventDefault();
                togglePause();
            }
        }
    });

    // ==================== WINDOW RESIZE ====================
    window.addEventListener('resize', handleResize);

    // ==================== INJECT CSS STYLES ====================
    
    const style = document.createElement('style');
    style.textContent = `
        #rx-reviewer {
            padding: 30px 16px;
            width: 100%;
            box-sizing: border-box;
        }
        
        .rx-reviews-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin: 0 auto;
            max-width: 900px;
            position: relative;
            min-height: 420px;
            width: 100%;
            box-sizing: border-box;
            touch-action: pan-y pinch-zoom;
        }
        
        .rx-review-card {
            background: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: #ffffff;
            padding: 20px;
            border-radius: 20px;
            position: absolute;
            width: 100%;
            box-sizing: border-box;
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 0 25px rgba(255, 255, 255, 0.05);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 320px;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1;
            border: 1px solid rgba(255, 255, 255, 0.2);
            overflow-y: auto;
        }
        
        .rx-review-card::-webkit-scrollbar {
            width: 4px;
        }
        
        .rx-review-card::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
        
        .rx-review-card::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
        }
        
        .rx-review-card.active {
            z-index: 2;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 0 35px rgba(255, 255, 255, 0.1);
        }
        
        .rx-review-card.current {
            opacity: 1;
            transform: translateY(0);
            position: relative;
            z-index: 3;
        }
        
        .rx-quote-icon {
            font-size: 50px;
            line-height: 1;
            margin-bottom: 5px;
            color: rgba(241, 6, 6, 0.91);
            font-family: Georgia, serif;
            position: absolute;
            top: 12px;
            left: 20px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 2;
        }
        
        .rx-review-text {
            position: relative;
            margin: 45px 0 20px;
            font-size: 16px;
            line-height: 1.6;
            padding: 0 10px;
            z-index: 1;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
            word-wrap: break-word;
            overflow-wrap: break-word;
            min-height: 120px;
        }
        
        .rx-reviewer {
            display: flex;
            align-items: center;
            position: relative;
            z-index: 1;
            margin-top: auto;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            flex-shrink: 0;
        }
        
        .rx-reviewer-img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 15px;
            object-fit: cover;
            border: 2px solid rgba(255, 255, 255, 0.4);
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.1);
            flex-shrink: 0;
        }
        
        .rx-reviewer-info {
            overflow: hidden;
        }
        
        .rx-reviewer-info h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            word-wrap: break-word;
        }
        
        .rx-reviewer-info p {
            margin: 4px 0 0;
            font-size: 13px;
            opacity: 0.9;
            font-weight: 300;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            word-wrap: break-word;
        }
        
        @media (min-width: 768px) {
            #rx-reviewer {
                padding: 40px 20px;
            }
            .rx-reviews-container {
                min-height: 450px;
            }
            .rx-review-card {
                padding: 30px;
                min-height: 380px;
            }
            .rx-quote-icon {
                font-size: 60px;
                top: 15px;
                left: 25px;
            }
            .rx-review-text {
                font-size: 18px;
                margin: 55px 0 25px;
                min-height: 140px;
            }
            .rx-reviewer-img {
                width: 60px;
                height: 60px;
                margin-right: 20px;
            }
            .rx-reviewer-info h4 {
                font-size: 18px;
            }
            .rx-reviewer-info p {
                font-size: 14px;
            }
        }
        
        @media (max-width: 480px) {
            #rx-reviewer {
                padding: 20px 12px;
            }
            .rx-reviews-container {
                min-height: 380px;
                gap: 15px;
            }
            .rx-review-card {
                padding: 16px;
                min-height: 280px;
                border-radius: 16px;
            }
            .rx-quote-icon {
                font-size: 40px;
                top: 8px;
                left: 14px;
            }
            .rx-review-text {
                font-size: 14px;
                margin: 38px 0 15px;
                line-height: 1.5;
                min-height: 100px;
            }
            .rx-reviewer-img {
                width: 42px;
                height: 42px;
                margin-right: 12px;
            }
            .rx-reviewer-info h4 {
                font-size: 14px;
            }
            .rx-reviewer-info p {
                font-size: 11px;
            }
        }
        
        .rx-review-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%);
            border-radius: 20px;
            pointer-events: none;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);

    // ==================== START APPLICATION ====================
    initializeCards();

    // Expose public API for external control
    window.RXReviewer = {
        next: nextReview,
        prev: prevReview,
        pause: pauseAutoRotate,
        resume: resumeAutoRotate,
        toggle: togglePause,
        getCurrentIndex: () => currentIndex,
        getTotalCount: () => reviewCards.length,
        isPaused: () => isPaused,
        isAnimating: () => isAnimating
    };
});