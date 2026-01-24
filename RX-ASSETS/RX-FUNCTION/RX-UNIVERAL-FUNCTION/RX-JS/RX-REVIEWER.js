// no need any just add on html code --->  <section id="rx-reviewer"> </section> <--- this section all automatically added 
// autor : RX STUDIO
// www.rosankc.com.np

// RX-REVIEWER.js - Auto-fills rx-reviewer section
document.addEventListener('DOMContentLoaded', function() {
    // Find your existing section with id="rx-reviewer"
    const reviewSection = document.getElementById('rx-reviewer');
    
    if (!reviewSection) {
        console.error('Section with id="rx-reviewer" not found!');
        return;
    }

    // Add RX-REVIEWER content to your section
    reviewSection.innerHTML = `
        <div class="rx-reviews-container">
            <div class="rx-review-card" data-image="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-5.jpg">
                <div class="rx-quote-icon">"</div>
                <p class="rx-review-text">"Rosan Khattri Chettri is a highly skilled graphic designer with an amazing eye for detail. His logo and branding designs stand out with creativity and professionalism. A true expert in his field!"</p>
                <div class="rx-reviewer">
                    <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-5.jpg" alt="Reviewer" class="rx-reviewer-img">
                    <div class="rx-reviewer-info">
                        <h4>Rohit Xettri</h4>
                        <p>Banganga-10, Kapilvastu</p>
                    </div>
                </div>
            </div>
            <div class="rx-review-card" data-image="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-3.jpg">
                <div class="rx-quote-icon">"</div>
                <p class="rx-review-text">Rosan Khattri Chettri is a talented and reliable graphic designer with a strong eye for detail. He specializes in logos, business cards, and branding, always delivering creative and high-quality work. Highly recommended!</p>
                <div class="rx-reviewer">
                    <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-3.jpg" alt="Reviewer" class="rx-reviewer-img">
                    <div class="rx-reviewer-info">
                        <h4>महेश आचार्य</h4>
                        <p>Arghakhachi</p>
                    </div>
                </div>
            </div>
            <div class="rx-review-card" data-image="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-1.jpg">
                <div class="rx-quote-icon">"</div>
                <p class="rx-review-text">Rosan Khattri Chettri is a talented graphic designer with experience, specializing in logos, business cards, and more. He delivers creative and professional work. Highly recommended!.</p>
                <div class="rx-reviewer">
                    <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-1.jpg" alt="Reviewer" class="rx-reviewer-img">
                    <div class="rx-reviewer-info">
                        <h4>कुस्मा तरामु मगर</h4>
                        <p>Gulmi-Lumpek</p>
                    </div>
                </div>
            </div>
            <div class="rx-review-card" data-image="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-2.jpg">
                <div class="rx-quote-icon">"</div>
                <p class="rx-review-text">Rosan Xettri is known for his dedication to excellence in graphic design and gaming. His innovative mindset, coupled with his refined skills, allows him to create visually stunning designs and achieve remarkable success in the gaming world.</p>
                <div class="rx-reviewer">
                    <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-2.jpg" alt="Reviewer" class="rx-reviewer-img">
                    <div class="rx-reviewer-info">
                        <h4>Leela Bhudha Magar</h4>
                        <p>Banganga-10, Kapilvastu</p>
                    </div>
                </div>
            </div>
            <div class="rx-review-card" data-image="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-4.jpg">
                <div class="rx-quote-icon">"</div>
                <p class="rx-review-text">Rosan Xettri is a talented graphic designer and gamer who seamlessly blends creativity with technical expertise. His innovative approach and attention to detail make his work stand out, consistently delivering high-quality results.</p>
                <div class="rx-reviewer">
                    <img src="RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/R-4.jpg" alt="Reviewer" class="rx-reviewer-img">
                    <div class="rx-reviewer-info">
                        <h4>Prasamsha Khanal</h4>
                        <p>Butwal</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inject CSS styles
    const style = document.createElement('style');
    style.textContent = `
        #rx-reviewer {
            padding: 40px 20px;
            background-image: url('');
            background-size: cover;
            background-position: center;
        }
        
        .rx-reviews-container {
            display: flex;
            flex-direction: column;
            gap: 30px;
            margin: 40px auto;
            max-width: 800px;
            position: relative;
            min-height: 400px;
        }
        
        .rx-review-card {
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
            font-size: 60px;
            line-height: 0;
            margin-bottom: 10px;
            color: rgba(241, 6, 6, 0.91);
            font-family: Georgia, serif;
            position: absolute;
            top: 15px;
            left: 25px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .rx-review-text {
            position: relative;
            margin: 30px 0 25px;
            font-size: 18px;
            line-height: 1.6;
            padding: 0 10px;
            z-index: 1;
            text-shadow: 0 1px 3px rgba(233, 9, 9, 0.88);
        }
        
        .rx-reviewer {
            display: flex;
            align-items: center;
            position: relative;
            z-index: 1;
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .rx-reviewer-img {
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
        
        .rx-review-card:hover .rx-reviewer-img {
            border-color: rgba(255, 255, 255, 0.8);
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .rx-reviewer-info h4 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        .rx-reviewer-info p {
            margin: 5px 0 0;
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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
            border-radius: 16px;
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
            border-radius: 16px;
            pointer-events: none;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);

    // Rest of your JavaScript functionality remains the same
    const reviewCards = document.querySelectorAll('.rx-review-card');
    const reviewsContainer = document.querySelector('.rx-reviews-container');
    let currentIndex = 0;
    let rotationInterval;
    let isAnimating = false;
    let isPaused = false;

    const config = {
        rotationInterval: 5000,
        animationDuration: 500,
        verticalOffset: 20,
        mobileBreakpoint: 768,
        bgOverlay: 'linear-gradient(rgba(0, 0, 2, 0), rgba(6, 0, 10, 0))',
        bgColor: 'transprent'
    };

    function initializeCards() {
        reviewCards.forEach((card, index) => {
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
            
            const imageUrl = card.getAttribute('data-image');
            card.style.setProperty('--bg-image', `url(${imageUrl})`);
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center center';
            card.style.backgroundRepeat = 'no-repeat';
            
            if (index === 0) {
                card.classList.add('current');
            } else {
                card.classList.remove('current');
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
                card.style.aspectRatio = '3/4';
                card.style.backgroundPosition = 'top center';
            } else {
                card.style.aspectRatio = '1/1';
                card.style.backgroundPosition = 'center center';
            }
        });
    }

    function rotateReviews(direction = 1) {
        if (isAnimating || isPaused) return;
        
        isAnimating = true;
        const currentCard = reviewCards[currentIndex];
        const nextIndex = (currentIndex + direction + reviewCards.length) % reviewCards.length;
        const nextCard = reviewCards[nextIndex];
        
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
            
            setTimeout(() => {
                currentCard.style.display = 'none';
                currentIndex = nextIndex;
                isAnimating = false;
            }, 50);
        }, 50);
    }

    function startRotation() {
        clearInterval(rotationInterval);
        rotationInterval = setInterval(() => rotateReviews(1), config.rotationInterval);
    }

    function pauseRotation() {
        isPaused = true;
        clearInterval(rotationInterval);
    }

    function resumeRotation() {
        isPaused = false;
        startRotation();
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

    initializeCards();
    startRotation();

    reviewsContainer.addEventListener('click', function(e) {
        const card = e.target.closest('.rx-review-card');
        if (card && !isAnimating) {
            toggleReviewImage(card);
        }
    });

    reviewsContainer.addEventListener('mouseenter', pauseRotation);
    reviewsContainer.addEventListener('mouseleave', resumeRotation);
    reviewsContainer.addEventListener('focusin', pauseRotation);
    reviewsContainer.addEventListener('focusout', resumeRotation);

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
                    
                    void card.offsetHeight;
                    
                    card.style.transition = `opacity ${config.animationDuration}ms ease, transform ${config.animationDuration}ms ease, background ${config.animationDuration}ms ease`;
                });
            }
        }, 100);
    });

    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.rx-review-card')) {
            if (e.key === 'ArrowLeft') {
                rotateReviews(-1);
            } else if (e.key === 'ArrowRight') {
                rotateReviews(1);
            }
        }
    });
});