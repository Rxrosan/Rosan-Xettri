// ================================================================
// RX-UNIVERSAL-CARD.js - Complete Universal Card System
// Author: RX STUDIO | Website: www.rosankc.com.np
// Version: 2.0.0
// ================================================================

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const DEFAULT_CONFIG = {
        containerId: 'rx-reviewer',
        autoRotateDelay: 3000,
        typingSpeed: {
            punctuation: 200,
            comma: 120,
            space: 60,
            default: 40
        },
        bgColor: '#ffffff',
        textColor: '#333333',
        cardBg: '#f8fafc',
        borderColor: '#d0dbe8',
        shadowColor: 'rgba(26, 68, 128, 0.08)',
        // ===== FIXED: NO OVERLAY, IMAGE CLEAR =====
        overlayOpacity: 0,
        animationDuration: 500,
        verticalOffset: 20,
        swipeThreshold: 50,
        swipeMaxTime: 300,
        mobileBreakpoint: 768,
        socialIcons: {
            facebook: { icon: '📘', color: '#1877f2', image: '' },
            instagram: { icon: '📷', color: '#e4405f', image: '' },
            twitter: { icon: '🐦', color: '#1da1f2', image: '' },
            x: { icon: '🐦', color: '#000000', image: '' },
            linkedin: { icon: '🔗', color: '#0a66c2', image: '' },
            youtube: { icon: '▶️', color: '#ff0000', image: '' },
            tiktok: { icon: '🎵', color: '#000000', image: '' },
            github: { icon: '💻', color: '#333333', image: '' },
            whatsapp: { icon: '💬', color: '#25d366', image: '' },
            telegram: { icon: '✈️', color: '#0088cc', image: '' }
        }
    };

    // ==================== DEFAULT REVIEW DATA ====================
    const DEFAULT_REVIEW_DATA = [
        {
            text: "Rosan Khattri Chettri is a talented and reliable graphic designer with a strong eye for detail. He specializes in logos, business cards, and branding, always delivering creative and high-quality work. Highly recommended!",
            name: "Puja Acharya Shrestha",
            location: "Palpa, Nepal",
            image: "ASSET/RX-IMAGES/RX-USER-IMAGE/R-3.jpg",
            socials: {
                facebook: "https://facebook.com",
                instagram: "https://instagram.com",
                twitter: "https://twitter.com"
            }
        },
        {
            text: "Rosan Khattri Chettri is a talented graphic designer with experience, specializing in logos, business cards, and more. He delivers creative and professional work. Highly recommended!",
            name: "कुस्मा तरामु मगर",
            location: "Gulmi-Lumpek",
            image: "ASSET/RX-IMAGES/RX-USER-IMAGE/R-1.jpg",
            socials: {
                facebook: "https://facebook.com",
                instagram: "https://instagram.com",
                linkedin: "https://linkedin.com"
            }
        },
        {
            text: "Rosan Xettri is known for his dedication to excellence in graphic design and gaming. His innovative mindset, coupled with his refined skills, allows him to create visually stunning designs and achieve remarkable success in the gaming world.",
            name: "Rita Magar",
            location: "Banganga-5, Kapilvastu",
            image: "ASSET/RX-IMAGES/RX-USER-IMAGE/R-2.jpg",
            socials: {
                facebook: "https://facebook.com",
                twitter: "https://twitter.com",
                instagram: "https://instagram.com"
            }
        },
        {
            text: "Rosan Xettri is a talented graphic designer and gamer who seamlessly blends creativity with technical expertise. His innovative approach and attention to detail make his work stand out, consistently delivering high-quality results.",
            name: "Pawana Thapaliya",
            location: "Kathmandu, Nepal",
            image: "ASSET/RX-IMAGES/RX-USER-IMAGE/R-6.jpg",
            socials: {
                facebook: "https://facebook.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com"
            }
        }
    ];

    // ==================== STATE ====================
    let currentConfig = {};
    let cardData = [];
    let reviewCards = [];
    let reviewsContainer = null;
    let currentIndex = 0;
    let isAnimating = false;
    let isPaused = false;
    let currentTypingAnimation = null;
    let rotateTimeout = null;
    let lastTapTime = 0;
    let tapTimeoutId = null;
    let lastAvatarTapTime = 0;
    let avatarTapTimeoutId = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwiping = false;
    let touchMoved = false;
    let resizeTimeout = null;
    let isInitialized = false;

    // ==================== HELPERS ====================
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function getSocialIconHTML(platform, url) {
        const config = currentConfig.socialIcons || {};
        const platformConfig = config[platform.toLowerCase()] || {};
        const customImage = platformConfig.image || '';
        const icon = platformConfig.icon || '🔗';
        const color = platformConfig.color || '#1a4480';
        const displayName = platform.charAt(0).toUpperCase() + platform.slice(1);

        if (customImage) {
            return `
                <a href="${url}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="rx-social-link rx-social-image"
                   data-platform="${platform}"
                   style="border-color: ${color}; color: #1a4480;">
                    <img src="${customImage}" 
                         alt="${displayName}" 
                         class="rx-social-icon-img"
                         loading="lazy"
                         onerror="this.style.display='none';this.nextElementSibling.style.display='inline';">
                    <span style="display:none;">${icon}</span>
                    <span class="rx-social-label">${displayName}</span>
                </a>
            `;
        }

        return `
            <a href="${url}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="rx-social-link"
               data-platform="${platform}"
               style="border-color: ${color}; color: #1a4480;">
                ${icon} ${displayName}
            </a>
        `;
    }

    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    function isMobile() {
        return window.innerWidth < (currentConfig.mobileBreakpoint || 768);
    }

    // ==================== STYLES INJECTION ====================
    function injectStyles() {
        if (document.getElementById('rx-universal-card-styles')) return;

        const style = document.createElement('style');
        style.id = 'rx-universal-card-styles';
        style.textContent = `
            #rx-reviewer {
                padding: 30px 16px;
                width: 100%;
                box-sizing: border-box;
            }
            
            .rx-universal-container {
                display: block;
                margin: 0 auto;
                max-width: 900px;
                position: relative;
                min-height: 420px;
                width: 100%;
                box-sizing: border-box;
                touch-action: pan-y pinch-zoom;
                overflow: hidden;
            }
            
            .rx-review-card {
                background: #ffffff;
                color: #333333;
                padding: 25px;
                border-radius: 15px;
                position: absolute;
                width: 100%;
                box-sizing: border-box;
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
                box-shadow: 0 4px 15px rgba(26, 68, 128, 0.08);
                cursor: pointer;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                min-height: 320px;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1;
                border: 1px solid #d0dbe8;
                overflow: hidden;
            }

            /* ===== FIXED: Card with Image Background - NO OVERLAY ===== */
            .rx-review-card.active {
                z-index: 2;
                box-shadow: 0 8px 25px rgba(26, 68, 128, 0.2);
                border-color: #1a4480;
            }

            .rx-review-card.active .rx-card-front {
                /* Text color changes for better visibility on image */
                color: #ffffff;
            }

            .rx-review-card.active .rx-review-text {
                color: #ffffff;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
            }

            .rx-review-card.active .rx-reviewer-info h4 {
                color: #ffffff;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
            }

            .rx-review-card.active .rx-reviewer-info p {
                color: #f0f0f0;
                text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
            }

            .rx-review-card.active .rx-quote-icon {
                color: rgba(255, 255, 255, 0.3);
            }

            .rx-review-card.active .rx-reviewer-img {
                border-color: #ffffff;
                box-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);
            }

            .rx-review-card.active .rx-reviewer {
                border-top-color: rgba(255, 255, 255, 0.2);
            }

            /* ===== FIXED: No white overlay on background image ===== */
            .rx-review-card.active::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.35);
                border-radius: 15px;
                z-index: 0;
                pointer-events: none;
            }

            .rx-card-front {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
                width: 100%;
                transition: opacity 0.4s ease;
                position: relative;
                z-index: 2;
            }

            .rx-card-info-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.97);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s ease;
                z-index: 20;
                padding: 20px;
                box-sizing: border-box;
                text-align: center;
                border-radius: 15px;
            }

            .rx-review-card.show-social-info .rx-card-front {
                opacity: 0;
                pointer-events: none;
            }

            .rx-review-card.show-social-info .rx-card-info-overlay {
                opacity: 1;
                visibility: visible;
            }

            .rx-overlay-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }

            .rx-overlay-img {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid #1a4480;
                box-shadow: 0 4px 15px rgba(26, 68, 128, 0.15);
                margin-bottom: 5px;
                cursor: pointer;
            }

            .rx-overlay-name {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1a4480;
            }

            .rx-overlay-location {
                margin: 0 0 10px 0;
                font-size: 13px;
                color: #666666;
            }

            .rx-universal-socials {
                display: flex;
                gap: 10px;
                margin-top: 5px;
                flex-wrap: wrap;
                justify-content: center;
            }

            .rx-social-link {
                padding: 6px 14px;
                background: #f0f4f9;
                border: 1px solid #d0dbe8;
                border-radius: 20px;
                color: #1a4480 !important;
                font-size: 12px;
                text-decoration: none;
                text-transform: capitalize;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }

            .rx-social-link:hover {
                background: #1a4480;
                border-color: #1a4480;
                transform: translateY(-2px);
                color: #ffffff !important;
            }

            .rx-social-link.rx-social-image {
                padding: 4px 10px 4px 4px;
                background: #f0f4f9;
                border-radius: 25px;
            }

            .rx-social-link.rx-social-image:hover {
                background: #1a4480;
                border-color: #1a4480;
            }

            .rx-social-link.rx-social-image:hover .rx-social-label {
                color: #ffffff;
            }

            .rx-social-icon-img {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                object-fit: cover;
                display: inline-block;
                border: 1px solid #d0dbe8;
            }

            .rx-social-label {
                font-size: 12px;
                font-weight: 500;
                margin-left: 2px;
                color: #1a4480;
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
                color: #1a4480;
                font-family: Georgia, serif;
                position: absolute;
                top: 12px;
                left: 20px;
                opacity: 0.15;
                z-index: 2;
            }

            .rx-review-card.active .rx-quote-icon {
                opacity: 0.3;
                color: #ffffff;
            }
            
            .rx-review-text {
                position: relative;
                margin: 45px 0 20px;
                font-size: 16px;
                line-height: 1.6;
                padding: 0 10px;
                z-index: 1;
                word-wrap: break-word;
                overflow-wrap: break-word;
                min-height: 120px;
                color: #444444;
            }

            .rx-review-card.active .rx-review-text {
                color: #ffffff;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            }
            
            .rx-reviewer {
                display: flex;
                align-items: center;
                position: relative;
                z-index: 1;
                margin-top: auto;
                padding-top: 15px;
                border-top: 1px solid #d0dbe8;
                flex-shrink: 0;
            }

            .rx-review-card.active .rx-reviewer {
                border-top-color: rgba(255, 255, 255, 0.2);
            }
            
            .rx-reviewer-img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 15px;
                object-fit: cover;
                border: 2px solid #1a4480;
                transition: all 0.3s ease;
                box-shadow: 0 3px 10px rgba(26, 68, 128, 0.1);
                background: #f0f4f9;
                flex-shrink: 0;
                cursor: pointer;
            }

            .rx-review-card.active .rx-reviewer-img {
                border-color: #ffffff;
                box-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);
            }
            
            .rx-reviewer-info {
                overflow: hidden;
            }
            
            .rx-reviewer-info h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                letter-spacing: 0.5px;
                word-wrap: break-word;
                color: #1a4480;
            }

            .rx-review-card.active .rx-reviewer-info h4 {
                color: #ffffff;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            }
            
            .rx-reviewer-info p {
                margin: 4px 0 0;
                font-size: 13px;
                opacity: 0.7;
                font-weight: 400;
                word-wrap: break-word;
                color: #666666;
            }

            .rx-review-card.active .rx-reviewer-info p {
                color: #f0f0f0;
                opacity: 0.9;
                text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
            }

            .rx-review-card::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(26, 68, 128, 0.02) 0%, rgba(26, 68, 128, 0.01) 50%, rgba(26, 68, 128, 0.02) 100%);
                border-radius: 15px;
                pointer-events: none;
                z-index: 0;
            }

            .rx-review-card.active::after {
                display: none;
            }

            /* ===== RESPONSIVE ===== */
            @media (min-width: 768px) {
                #rx-reviewer { padding: 40px 20px; }
                .rx-universal-container { min-height: 450px; }
                .rx-review-card { padding: 30px; min-height: 380px; }
                .rx-quote-icon { font-size: 60px; top: 15px; left: 25px; }
                .rx-review-text { font-size: 18px; margin: 55px 0 25px; min-height: 140px; }
                .rx-reviewer-img { width: 60px; height: 60px; margin-right: 20px; }
                .rx-reviewer-info h4 { font-size: 18px; }
                .rx-reviewer-info p { font-size: 14px; }
            }

            @media (max-width: 480px) {
                #rx-reviewer { padding: 20px 12px; }
                .rx-universal-container { min-height: 380px; }
                .rx-review-card { padding: 16px; min-height: 280px; border-radius: 12px; }
                .rx-quote-icon { font-size: 40px; top: 8px; left: 14px; }
                .rx-review-text { font-size: 14px; margin: 38px 0 15px; min-height: 100px; }
                .rx-reviewer-img { width: 42px; height: 42px; margin-right: 12px; }
                .rx-reviewer-info h4 { font-size: 14px; }
                .rx-reviewer-info p { font-size: 11px; }
                .rx-social-link { font-size: 10px; padding: 4px 10px; }
            }
        `;
        document.head.appendChild(style);
    }

    // ==================== CARD HTML GENERATOR ====================
    function generateCardHTML(review, index) {
        let socialsHTML = '';
        if (review.socials && Object.keys(review.socials).length > 0) {
            socialsHTML = '<div class="rx-universal-socials">';
            for (let platform in review.socials) {
                socialsHTML += getSocialIconHTML(platform, review.socials[platform]);
            }
            socialsHTML += '</div>';
        }

        const imageSrc = review.image || '';
        const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23f0f4f9'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%231a4480' font-size='24'%3E👤%3C/text%3E%3C/svg%3E";

        return `
            <div class="rx-review-card" 
                 data-image="${imageSrc}" 
                 data-index="${index}">
                <div class="rx-card-front">
                    <div class="rx-quote-icon">"</div>
                    <p class="rx-review-text" data-fulltext="${escapeHtml(review.text)}"></p>
                    <div class="rx-reviewer">
                        <img src="${imageSrc}" 
                             alt="${escapeHtml(review.name)}" 
                             class="rx-reviewer-img rx-interactive-avatar" 
                             loading="lazy"
                             onerror="this.src='${fallbackImg}'">
                        <div class="rx-reviewer-info">
                            <h4>${escapeHtml(review.name)}</h4>
                            <p>${escapeHtml(review.location || '')}</p>
                        </div>
                    </div>
                </div>
                <div class="rx-card-info-overlay">
                    <div class="rx-overlay-content">
                        <img src="${imageSrc}" 
                             alt="${escapeHtml(review.name)}" 
                             class="rx-overlay-img rx-interactive-avatar"
                             onerror="this.src='${fallbackImg}'">
                        <h3 class="rx-overlay-name">${escapeHtml(review.name)}</h3>
                        <p class="rx-overlay-location">${escapeHtml(review.location || '')}</p>
                        ${socialsHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== TYPING ANIMATION ====================
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
            if (this.completed) { this.reset(); }
            this.isTyping = true;
            if (this.currentIndex === 0) { this.element.textContent = ''; }
            this.typeNextChar();
        }
        typeNextChar() {
            if (this.currentIndex < this.fullText.length) {
                this.element.textContent += this.fullText.charAt(this.currentIndex);
                this.currentIndex++;
                const char = this.fullText.charAt(this.currentIndex - 1);
                let delay = currentConfig.typingSpeed.default;
                if (char === '.' || char === '!' || char === '?') delay = currentConfig.typingSpeed.punctuation;
                else if (char === ',' || char === ';') delay = currentConfig.typingSpeed.comma;
                else if (char === ' ') delay = currentConfig.typingSpeed.space;
                delay += Math.random() * 20;
                this.timeout = setTimeout(() => this.typeNextChar(), delay);
            } else {
                this.completed = true;
                this.isTyping = false;
                if (this.timeout) { clearTimeout(this.timeout); this.timeout = null; }
                if (this.onComplete) this.onComplete();
            }
        }
        stop() {
            if (this.timeout) { clearTimeout(this.timeout); this.timeout = null; }
            this.isTyping = false;
        }
        reset() {
            this.stop();
            this.currentIndex = 0;
            this.completed = false;
            this.element.textContent = '';
        }
    }

    // ==================== CORE FUNCTIONS ====================
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
            } else if (!isPaused) {
                rotateTimeout = setTimeout(() => {
                    if (!isPaused) { rotateReviews(1); }
                    rotateTimeout = null;
                }, currentConfig.autoRotateDelay);
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
        if (currentTypingAnimation) { currentTypingAnimation.stop(); }
        if (rotateTimeout) { clearTimeout(rotateTimeout); rotateTimeout = null; }
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
                    if (!isPaused) {
                        rotateTimeout = setTimeout(() => {
                            if (!isPaused) { rotateReviews(1); }
                            rotateTimeout = null;
                        }, currentConfig.autoRotateDelay);
                    }
                });
                currentTypingAnimation.currentIndex = currentTextLength;
                currentTypingAnimation.start();
            } else if (!isPaused) {
                rotateTimeout = setTimeout(() => {
                    if (!isPaused) { rotateReviews(1); }
                    rotateTimeout = null;
                }, currentConfig.autoRotateDelay);
            }
        }
    }

    function rotateReviews(direction = 1) {
        if (isAnimating || isPaused) return;
        if (reviewCards.length === 0) return;
        isAnimating = true;
        const currentCard = reviewCards[currentIndex];
        const nextIndex = (currentIndex + direction + reviewCards.length) % reviewCards.length;
        const nextCard = reviewCards[nextIndex];
        if (!currentCard || !nextCard) { isAnimating = false; return; }
        currentCard.classList.remove('show-social-info');
        nextCard.classList.remove('show-social-info');
        if (rotateTimeout) { clearTimeout(rotateTimeout); rotateTimeout = null; }
        if (currentTypingAnimation) {
            currentTypingAnimation.stop();
            currentTypingAnimation = null;
        }
        currentCard.style.opacity = '0';
        currentCard.style.transform = `translateY(${-direction * currentConfig.verticalOffset}px)`;
        currentCard.classList.remove('current');
        currentCard.setAttribute('aria-hidden', 'true');
        currentCard.setAttribute('tabindex', '-1');
        nextCard.style.display = 'flex';
        nextCard.style.opacity = '0';
        nextCard.style.transform = `translateY(${direction * currentConfig.verticalOffset}px)`;
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

    // ===== FIXED: toggleReviewImage - CLEAR IMAGE, NO WHITE OVERLAY =====
    function toggleReviewImage(card) {
        if (isAnimating) return;
        
        // Remove active class from all cards
        document.querySelectorAll('.rx-review-card.active').forEach(el => {
            if (el !== card) {
                el.classList.remove('active');
                el.style.backgroundImage = '';
                el.style.backgroundColor = '#ffffff';
            }
        });
        
        const isActivating = !card.classList.contains('active');
        
        if (isActivating) {
            card.classList.add('active');
            const imageUrl = card.getAttribute('data-image');
            if (imageUrl) {
                // ===== FIXED: NO OVERLAY, CLEAR IMAGE =====
                card.style.backgroundImage = `url('${imageUrl}')`;
                card.style.backgroundSize = 'cover';
                card.style.backgroundPosition = 'center';
                card.style.backgroundRepeat = 'no-repeat';
                card.style.backgroundColor = 'transparent';
            }
        } else {
            card.classList.remove('active');
            card.style.backgroundImage = '';
            card.style.backgroundColor = '#ffffff';
        }
    }

    function handleCardTextClick(card) {
        isPaused = !isPaused;
        if (isPaused) { pauseTyping(); } else { resumeTyping(); }
    }

    function handleAvatarInteraction(card, event) {
        if (!card || isAnimating) return;
        const currentTime = new Date().getTime();
        const tapInterval = currentTime - lastAvatarTapTime;
        if (avatarTapTimeoutId) {
            clearTimeout(avatarTapTimeoutId);
            avatarTapTimeoutId = null;
        }
        if (tapInterval < 300 && tapInterval > 0 && lastAvatarTapTime !== 0) {
            lastAvatarTapTime = 0;
            card.classList.toggle('show-social-info');
            event.preventDefault();
            event.stopPropagation();
        } else {
            lastAvatarTapTime = currentTime;
            avatarTapTimeoutId = setTimeout(() => {
                toggleReviewImage(card);
                lastAvatarTapTime = 0;
                avatarTapTimeoutId = null;
            }, 300);
        }
    }

    function handleCardGeneralInteraction(card, event) {
        if (!card || isAnimating) return;
        const currentTime = new Date().getTime();
        const tapInterval = currentTime - lastTapTime;
        if (tapTimeoutId) {
            clearTimeout(tapTimeoutId);
            tapTimeoutId = null;
        }
        if (tapInterval < 300 && tapInterval > 0 && lastTapTime !== 0) {
            lastTapTime = 0;
            handleCardTextClick(card);
            event.preventDefault();
            event.stopPropagation();
        } else {
            lastTapTime = currentTime;
            tapTimeoutId = setTimeout(() => {
                toggleReviewImage(card);
                lastTapTime = 0;
                tapTimeoutId = null;
            }, 300);
        }
    }

    // ==================== TOUCH / SWIPE ====================
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
        if (Math.abs(deltaX) > 10) {
            touchMoved = true;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                event.preventDefault();
            }
        }
    }

    function handleTouchEnd(event) {
        if (!isSwiping) {
            const card = event.target.closest('.rx-review-card');
            if (card && !touchMoved) {
                if (event.target.closest('.rx-interactive-avatar')) {
                    handleAvatarInteraction(card, event);
                } else {
                    handleCardGeneralInteraction(card, event);
                }
            }
            return;
        }
        isSwiping = false;
        if (!touchMoved) {
            const card = event.target.closest('.rx-review-card');
            if (card) {
                if (event.target.closest('.rx-interactive-avatar')) {
                    handleAvatarInteraction(card, event);
                } else {
                    handleCardGeneralInteraction(card, event);
                }
            }
            touchStartX = 0; touchStartY = 0; touchStartTime = 0; touchMoved = false;
            return;
        }
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndTime = Date.now();
        const deltaX = touchEndX - touchStartX;
        const deltaTime = touchEndTime - touchStartTime;
        if (Math.abs(deltaX) >= currentConfig.swipeThreshold && deltaTime <= currentConfig.swipeMaxTime) {
            if (deltaX > 0) {
                if (!isAnimating && !isPaused) { rotateReviews(-1); }
            } else {
                if (!isAnimating && !isPaused) { rotateReviews(1); }
            }
        }
        touchStartX = 0; touchStartY = 0; touchStartTime = 0; touchMoved = false;
    }

    // ==================== RESIZE ====================
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const mobile = isMobile();
            reviewCards.forEach(card => {
                card.style.minHeight = mobile ? '280px' : '380px';
            });
            if (reviewsContainer) {
                reviewsContainer.style.minHeight = mobile ? '340px' : '450px';
            }
        }, 100);
    }

    // ==================== KEYBOARD ====================
    function handleKeyboard(event) {
        const target = event.target;
        if (target.closest('.rx-review-card') || target.closest('#rx-reviewer')) {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                if (!isAnimating && !isPaused) rotateReviews(-1);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                if (!isAnimating && !isPaused) rotateReviews(1);
            } else if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Space') {
                event.preventDefault();
                isPaused = !isPaused;
                if (isPaused) pauseTyping();
                else resumeTyping();
            }
        }
    }

    // ==================== MAIN LOAD FUNCTION ====================
    function loadUniversalCards(data, config) {
        currentConfig = { ...DEFAULT_CONFIG, ...config };
        cardData = data || DEFAULT_REVIEW_DATA;

        const container = document.getElementById(currentConfig.containerId);
        if (!container) {
            console.error('❌ Container #' + currentConfig.containerId + ' not found!');
            return false;
        }

        container.innerHTML = '';
        injectStyles();

        let cardsHTML = '<div class="rx-universal-container">';
        cardData.forEach((review, index) => {
            cardsHTML += generateCardHTML(review, index);
        });
        cardsHTML += '</div>';
        container.innerHTML = cardsHTML;

        reviewCards = container.querySelectorAll('.rx-review-card');
        reviewsContainer = container.querySelector('.rx-universal-container');

        if (reviewCards.length === 0) {
            console.warn('⚠️ No review cards generated');
            return false;
        }

        currentIndex = 0;
        isAnimating = false;
        isPaused = false;

        reviewCards.forEach((card, index) => {
            card.style.backgroundColor = '#ffffff';
            card.style.display = 'flex';
            card.style.position = 'absolute';
            card.style.top = '0';
            card.style.left = '0';
            card.style.right = '0';
            card.style.width = '100%';
            card.style.boxSizing = 'border-box';
            card.style.minHeight = isMobile() ? '280px' : '380px';
            card.style.opacity = index === 0 ? '1' : '0';
            card.style.transform = index === 0 ? 'translateY(0)' : `translateY(${currentConfig.verticalOffset}px)`;
            card.style.transition = `opacity ${currentConfig.animationDuration}ms ease, transform ${currentConfig.animationDuration}ms ease`;
            card.style.cursor = 'pointer';
            card.style.border = '1px solid #d0dbe8';
            card.style.borderRadius = '15px';
            card.style.padding = '25px';
            card.style.boxShadow = '0 4px 15px rgba(26, 68, 128, 0.08)';
            
            if (index === 0) {
                card.classList.add('current');
                setTimeout(() => startTypingForCard(card), 300);
            } else {
                card.classList.remove('current');
                resetTypingForCard(card);
            }
            card.setAttribute('aria-hidden', index !== 0);
            card.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        if (reviewsContainer) {
            reviewsContainer.style.position = 'relative';
            reviewsContainer.style.minHeight = isMobile() ? '340px' : '450px';
            reviewsContainer.style.touchAction = 'pan-y pinch-zoom';
            reviewsContainer.style.overflow = 'hidden';
        }

        // Event Listeners
        reviewsContainer.addEventListener('click', function(e) {
            if (!isTouchDevice()) {
                const card = e.target.closest('.rx-review-card');
                if (card && !isAnimating) {
                    if (e.target.closest('.rx-interactive-avatar')) {
                        handleAvatarInteraction(card, e);
                    } else {
                        handleCardGeneralInteraction(card, e);
                    }
                }
            }
        });

        if (isTouchDevice()) {
            reviewsContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
            reviewsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
            reviewsContainer.addEventListener('touchend', handleTouchEnd);
        }

        document.addEventListener('keydown', handleKeyboard);
        window.addEventListener('resize', handleResize);

        isInitialized = true;
        console.log('✅ Universal Cards loaded: ' + cardData.length + ' cards');
        return true;
    }

    // ==================== EXPOSE GLOBALLY ====================
    window.initReviewerCards = function(data, config) {
        return loadUniversalCards(data, config);
    };

    window.RXUniversalCard = {
        load: loadUniversalCards,
        init: loadUniversalCards,
        config: DEFAULT_CONFIG,
        version: '2.0.0'
    };

    // ==================== AUTO INIT ON DOM READY ====================
    document.addEventListener('DOMContentLoaded', function() {
        const container = document.getElementById('rx-reviewer');
        if (container && container.children.length === 0) {
            if (window.REVIEW_DATA && window.REVIEW_DATA.length > 0) {
                loadUniversalCards(window.REVIEW_DATA);
            }
        }
    });

    console.log('✅ RX Universal Card System loaded successfully!');

})();