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

    // Typing animation class
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
    }

    let currentTypingAnimation = null;
    let rotateTimeout = null;
    let isPaused = false;

    // Function to start typing animation for a card
    function startTypingForCard(card, onCompleteCallback) {
        const textElement = card.querySelector('.rx-review-text');
        if (!textElement) return;
        
        // Stop current typing if any
        if (currentTypingAnimation) {
            currentTypingAnimation.stop();
            currentTypingAnimation = null;
        }
        
        // Clear any pending rotate timeout
        if (rotateTimeout) {
            clearTimeout(rotateTimeout);
            rotateTimeout = null;
        }
        
        const fullText = textElement.getAttribute('data-fulltext') || '';
        
        // Clear text content before starting
        textElement.textContent = '';
        
        // Create new typing animation
        currentTypingAnimation = new TypingAnimation(textElement, fullText, () => {
            currentTypingAnimation = null;
            if (onCompleteCallback) {
                onCompleteCallback();
            } else if (!isPaused) {
                // Auto rotate after 3 seconds when typing completes
                rotateTimeout = setTimeout(() => {
                    if (!isPaused) {
                        rotateReviews(1);
                    }
                    rotateTimeout = null;
                }, 3000);
            }
        });
        
        currentTypingAnimation.start();
    }

    // Function to reset typing for a card (clear text)
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

    // Inject enhanced CSS styles
    const style = document.createElement('style');
    style.textContent = `
        #rx-reviewer {
            padding: 30px 16px;
            background-image: url('');
            background-size: cover;
            background-position: center;
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
            box-shadow: 
                0 4px 30px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 0 25px rgba(255, 255, 255, 0.05);
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
        
        /* Custom scrollbar for review cards */
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
            box-shadow: 
                0 10px 40px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.15),
                inset 0 0 35px rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.15);
        }
        
        .rx-review-card.current {
            opacity: 1;
            transform: translateY(0);
            position: relative;
            z-index: 3;
        }
        
        .rx-review-card:hover {
            transform: translateY(-5px) scale(1.01) !important;
            box-shadow: 
                0 15px 35px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.2),
                inset 0 0 40px rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.12);
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
        
        .rx-review-card:hover .rx-reviewer-img {
            border-color: rgba(255, 255, 255, 0.8);
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
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
        
        /* Responsive breakpoints */
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
        
        /* Background image when active */
        .rx-review-card.active::before {
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
            border-radius: 20px;
            filter: blur(5px);
        }
        
        /* Liquid glass effect overlay */
        .rx-review-card::after {
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
            border-radius: 20px;
            pointer-events: none;
            z-index: -1;
        }
        
        /* Typing animation - no cursor */
        .rx-review-text.typing {
            border-right: none;
        }
    `;
    document.head.appendChild(style);

    // Main functionality
    const reviewCards = document.querySelectorAll('.rx-review-card');
    const reviewsContainer = document.querySelector('.rx-reviews-container');
    let currentIndex = 0;
    let isAnimating = false;

    const config = {
        animationDuration: 500,
        verticalOffset: 20,
        mobileBreakpoint: 768,
        bgOverlay: 'linear-gradient(rgba(0, 0, 2, 0), rgba(6, 0, 10, 0))',
        bgColor: 'transparent'
    };

    function initializeCards() {
        reviewCards.forEach((card, index) => {
            card.style.display = 'flex';
            card.style.position = 'absolute';
            card.style.top = '0';
            card.style.left = '0';
            card.style.right = '0';
            card.style.width = '100%';
            card.style.height = 'auto';
            card.style.minHeight = window.innerWidth < config.mobileBreakpoint ? '280px' : '380px';
            card.style.opacity = index === 0 ? '1' : '0';
            card.style.transform = index === 0 ? 'translateY(0)' : `translateY(${config.verticalOffset}px)`;
            card.style.transition = `opacity ${config.animationDuration}ms ease, transform ${config.animationDuration}ms ease, background ${config.animationDuration}ms ease`;
            card.style.pointerEvents = 'auto';
            
            const imageUrl = card.getAttribute('data-image');
            card.style.setProperty('--bg-image', `url(${imageUrl})`);
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center center';
            card.style.backgroundRepeat = 'no-repeat';
            
            if (index === 0) {
                card.classList.add('current');
                // Start typing for initial card
                setTimeout(() => startTypingForCard(card), 100);
            } else {
                card.classList.remove('current');
                resetTypingForCard(card);
            }

            card.setAttribute('aria-hidden', index !== 0);
            card.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        updateMobileLayout();
    }

    function updateMobileLayout() {
        const isMobile = window.innerWidth < config.mobileBreakpoint;
        reviewCards.forEach(card => {
            if (isMobile) {
                card.style.minHeight = '280px';
                card.style.backgroundPosition = 'top center';
            } else {
                card.style.minHeight = '380px';
                card.style.backgroundPosition = 'center center';
            }
        });
        
        const container = document.querySelector('.rx-reviews-container');
        if (container) {
            container.style.minHeight = isMobile ? '320px' : '450px';
        }
    }

    function rotateReviews(direction = 1) {
        if (isAnimating || isPaused) return;
        
        isAnimating = true;
        const currentCard = reviewCards[currentIndex];
        const nextIndex = (currentIndex + direction + reviewCards.length) % reviewCards.length;
        const nextCard = reviewCards[nextIndex];
        
        // Clear any pending rotate timeout
        if (rotateTimeout) {
            clearTimeout(rotateTimeout);
            rotateTimeout = null;
        }
        
        // Stop current typing
        if (currentTypingAnimation) {
            currentTypingAnimation.stop();
            currentTypingAnimation = null;
        }
        
        nextCard.style.display = 'flex';
        nextCard.style.opacity = '0';
        nextCard.style.transform = `translateY(${direction * config.verticalOffset}px)`;
        
        currentCard.style.opacity = '0';
        currentCard.style.transform = `translateY(${-direction * config.verticalOffset}px)`;
        currentCard.classList.remove('current');
        currentCard.setAttribute('aria-hidden', 'true');
        currentCard.setAttribute('tabindex', '-1');
        
        setTimeout(() => {
            nextCard.style.opacity = '1';
            nextCard.style.transform = 'translateY(0)';
            nextCard.classList.add('current');
            nextCard.setAttribute('aria-hidden', 'false');
            nextCard.setAttribute('tabindex', '0');
            
            // Start typing animation for the new card
            startTypingForCard(nextCard);
            
            setTimeout(() => {
                currentCard.style.display = 'flex';
                currentIndex = nextIndex;
                isAnimating = false;
            }, 50);
        }, 50);
    }

    function toggleReviewImage(card) {
        if (isAnimating) return;
        
        document.querySelectorAll('.rx-review-card.active').forEach(el => {
            if (el !== card) {
                el.classList.remove('active');
                el.style.backgroundImage = 'none';
                el.style.backgroundColor = config.bgColor;
            }
        });
        
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

    // Double-tap detection for pause/resume (no visual indicator)
    let lastTapTime = 0;
    let tapTimeoutId = null;
    
    function handleDoubleTap() {
        // Toggle pause state without any visual indicator
        isPaused = !isPaused;
        
        if (isPaused) {
            // Pause: stop typing and clear any pending rotate
            if (currentTypingAnimation) {
                currentTypingAnimation.stop();
            }
            if (rotateTimeout) {
                clearTimeout(rotateTimeout);
                rotateTimeout = null;
            }
        } else {
            // Resume: restart typing for current card from where it left off
            const currentCard = document.querySelector('.rx-review-card.current');
            if (currentCard) {
                const textElement = currentCard.querySelector('.rx-review-text');
                const fullText = textElement.getAttribute('data-fulltext') || '';
                const currentTextLength = textElement.textContent.length;
                
                if (currentTextLength < fullText.length) {
                    // Resume typing from current position
                    if (currentTypingAnimation) {
                        currentTypingAnimation.stop();
                        currentTypingAnimation = null;
                    }
                    
                    // Create new animation with current progress
                    currentTypingAnimation = new TypingAnimation(textElement, fullText, () => {
                        currentTypingAnimation = null;
                        if (!isPaused) {
                            rotateTimeout = setTimeout(() => {
                                if (!isPaused) {
                                    rotateReviews(1);
                                }
                                rotateTimeout = null;
                            }, 3000);
                        }
                    });
                    currentTypingAnimation.currentIndex = currentTextLength;
                    currentTypingAnimation.start();
                } else if (currentTextLength >= fullText.length) {
                    // Already completed, wait 3 seconds then rotate
                    if (!isPaused) {
                        rotateTimeout = setTimeout(() => {
                            if (!isPaused) {
                                rotateReviews(1);
                            }
                            rotateTimeout = null;
                        }, 3000);
                    }
                }
            }
        }
    }

    initializeCards();

    // Click handler with double-tap detection
    reviewsContainer.addEventListener('click', function(e) {
        const card = e.target.closest('.rx-review-card');
        if (card && !isAnimating) {
            const currentTime = new Date().getTime();
            const tapInterval = currentTime - lastTapTime;
            
            if (tapInterval < 300 && tapInterval > 0 && lastTapTime !== 0) {
                // Double tap - pause/resume (no visual indicator)
                if (tapTimeoutId) {
                    clearTimeout(tapTimeoutId);
                    tapTimeoutId = null;
                }
                handleDoubleTap();
                lastTapTime = 0;
            } else {
                // Single tap - toggle image background
                lastTapTime = currentTime;
                tapTimeoutId = setTimeout(() => {
                    toggleReviewImage(card);
                    lastTapTime = 0;
                    tapTimeoutId = null;
                }, 300);
            }
        }
    });

    // Hover events - do nothing
    reviewsContainer.addEventListener('mouseenter', function() {});
    reviewsContainer.addEventListener('mouseleave', function() {});
    reviewsContainer.addEventListener('focusin', function() {});
    reviewsContainer.addEventListener('focusout', function() {});

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
                    card.style.minHeight = window.innerWidth < config.mobileBreakpoint ? '280px' : '380px';
                    
                    void card.offsetHeight;
                    
                    card.style.transition = `opacity ${config.animationDuration}ms ease, transform ${config.animationDuration}ms ease, background ${config.animationDuration}ms ease`;
                });
            }
        }, 100);
    });

    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.rx-review-card')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                rotateReviews(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                rotateReviews(1);
            } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Space') {
                e.preventDefault();
                handleDoubleTap();
            }
        }
    });
});