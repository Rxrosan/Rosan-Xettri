// RX-TEAM.js - Function wrapped for dynamic loading
function initRxTeamSlider() {
    const teamSection = document.getElementById('rx-team-section');
    
    if (!teamSection) {
        return;
    }

    teamSection.innerHTML = `
        <div class="rx-team-slider-container">
            <div class="rx-team-slider">
                <div class="rx-team-slide">
                    <div class="rx-team-member">
                        <img src="ASSET/RX-IMAGES/RX-USER-IMAGE/A-1.png" alt="Admin - ROSAN KC">
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
                        <img src="ASSET/RX-IMAGES/RX-USER-IMAGE/T-0.jpg" alt="#">
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

    // Inject CSS styles if not already injected
    if (!document.getElementById('rx-team-style')) {
        const style = document.createElement('style');
        style.id = 'rx-team-style';
        style.textContent = `
            #rx-team-section {
                padding: 20px 20px 40px 20px;
                background-image: url('');
                background-size: cover;
                background-position: center;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
            }
            .rx-team-slider-container {
                position: relative;
                height: 380px;
                overflow: hidden;
                margin: 0 auto;
                max-width: 320px;
                width: 100%;
            }
            .rx-team-slider {
                height: 100%;
                display: flex;
                flex-direction: column;
                transition: transform 0.8s ease-in-out;
            }
            .rx-team-slide {
                height: 380px;
                min-height: 380px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .rx-team-member {
                text-align: center;
                padding: 20px;
                width: 100%;
            }
            .rx-team-member img {
                width: 130px;
                height: 130px;
                border-radius: 50%;
                object-fit: cover;
                margin-bottom: 15px;
                border: 3px solid #1a4480;
            }
            .rx-team-member h3 {
                font-size: 1.25rem;
                margin-bottom: 5px;
                color: #1a4480;
            }
            .rx-position {
                font-weight: 600;
                color: #555;
                margin-bottom: 8px;
                font-size: 0.9rem;
            }
            .rx-social-links {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 15px;
                font-size: 18px;
            }
            .rx-social-links a {
                color: #1a4480;
                transition: all 0.3s ease;
            }
            .rx-social-links a:hover {
                color: #0056b3;
                transform: translateY(-3px);
            }
        `;
        document.head.appendChild(style);
    }

    const slider = teamSection.querySelector('.rx-team-slider');
    const slides = teamSection.querySelectorAll('.rx-team-slide');
    const totalSlides = slides.length;
    let currentIndex = 1;
    let isAnimating = false;
    let slideInterval;

    const config = {
        slideDuration: 5000,
        animationDuration: 800,
        animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        touchSensitivity: 50,
    };

    function initSlider() {
        slider.style.transition = `transform ${config.animationDuration}ms ${config.animationEasing}`;
        slides.forEach((slide, index) => {
            slide.style.width = '100%';
            slide.style.flexShrink = '0';
            slide.setAttribute('data-index', index);
            slide.setAttribute('aria-hidden', index !== 0);
        });

        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[totalSlides - 1].cloneNode(true);
        
        slider.appendChild(firstClone);
        slider.insertBefore(lastClone, slides[0]);
        
        currentIndex = 1;
        goToSlide(currentIndex, false);
    }

    function goToSlide(index, animate = true) {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = index;
        
        if (!animate) {
            slider.style.transition = 'none';
        }
        
        slider.style.transform = `translateY(-${currentIndex * 100}%)`;
        
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
            isAnimating = false;
        }, config.animationDuration);
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function startAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, config.slideDuration);
    }

    if (slider && slides.length > 0) {
        initSlider();
        startAutoSlide();
    }
}

// साधारण पेज रिफ्रेस हुँदा पनि काम गरोस्
document.addEventListener('DOMContentLoaded', function() {
    initRxTeamSlider();
});