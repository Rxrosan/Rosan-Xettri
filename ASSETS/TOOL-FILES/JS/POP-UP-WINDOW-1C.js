// RX-POP-UP-WINDOW.js (Crystal Design)
document.addEventListener('DOMContentLoaded', () => {
    const popupHTML = `
        <div id="RX-POP-UP-Window">
            <div class="RX-POP-UP-Window-content">
                <button class="RX-POP-UP-Window-btn-close" id="RX-POP-UP-Window-close" aria-label="Close popup">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                
                <div class="RX-POP-UP-Window-crystal-facets">
                    <div class="facet-1"></div>
                    <div class="facet-2"></div>
                    <div class="facet-3"></div>
                </div>
                
                <div class="RX-POP-UP-Window-carousel" id="RX-POP-UP-Window-carousel">
                    <div class="RX-POP-UP-Window-carousel-item">
                        <h2>Welcome</h2>
                        <div class="RX-POP-UP-Window-scroll-content">
                            <p>"Hi, I'm Rosan Xettri, a passionate web designer dedicated to creating stunning and user-friendly websites. Let's build something amazing!"</p>
                            <div class="RX-POP-UP-Window-gallery">
                                <img src="ASSETS/MAIN-FILE/IMG/WELCOME-PERSON-IMAGE/R-M.jpg" alt="Brand Identity" loading="lazy">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="RX-POP-UP-Window-carousel-controls">
                    <button class="RX-POP-UP-Window-carousel-btn RX-POP-UP-Window-prev" aria-label="Previous">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <button class="RX-POP-UP-Window-carousel-btn RX-POP-UP-Window-next" aria-label="Next">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
                
                <div class="RX-POP-UP-Window-carousel-indicators"></div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        /* Crystal Base Styles */
        #RX-POP-UP-Window {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(5, 0, 15, 0.85);
            backdrop-filter: blur(16px) saturate(180%);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.6s cubic-bezier(0.32, 0.72, 0, 1);
        }
        
        #RX-POP-UP-Window::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 20% 30%, rgba(100, 70, 255, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(255, 100, 200, 0.15) 0%, transparent 40%);
            pointer-events: none;
        }
        
        #RX-POP-UP-Window.RX-POP-UP-Window-show {
            opacity: 1;
            visibility: visible;
        }
        
        .RX-POP-UP-Window-content {
            position: relative;
            background: rgba(15, 5, 35, 0.6);
            width: 90%;
            max-width: 700px;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        0 0 40px rgba(100, 70, 255, 0.2),
                        0 0 80px rgba(100, 70, 255, 0.1);
            transform: translateY(30px) scale(0.98);
            opacity: 0;
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
            max-height: 90vh;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
        }
        
        .RX-POP-UP-Window-crystal-facets {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 24px;
            pointer-events: none;
            z-index: -1;
        }
        
        .RX-POP-UP-Window-crystal-facets div {
            position: absolute;
            background: linear-gradient(45deg, rgba(255,255,255,0.03), transparent);
            border-radius: 10px;
        }
        
        .facet-1 {
            top: -50px;
            right: -50px;
            width: 200px;
            height: 200px;
            transform: rotate(45deg);
            background: linear-gradient(135deg, rgba(180, 140, 255, 0.1), transparent);
        }
        
        .facet-2 {
            bottom: -30px;
            left: -30px;
            width: 150px;
            height: 150px;
            transform: rotate(20deg);
            background: linear-gradient(45deg, rgba(100, 200, 255, 0.1), transparent);
        }
        
        .facet-3 {
            top: 50%;
            left: 50%;
            width: 100px;
            height: 300px;
            transform: translate(-50%, -50%) rotate(15deg);
            background: linear-gradient(90deg, rgba(255, 100, 200, 0.05), transparent);
        }
        
        #RX-POP-UP-Window.RX-POP-UP-Window-show .RX-POP-UP-Window-content {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        
        /* Crystal Carousel Items */
        .RX-POP-UP-Window-carousel-item {
            display: none;
            animation: RX-POP-UP-Window-fadeIn 0.8s ease;
        }
        
        .RX-POP-UP-Window-carousel-item.RX-POP-UP-Window-active {
            display: block;
        }
        
        /* Content Styles */
        .RX-POP-UP-Window-scroll-content {
            max-height: 65vh;
            overflow-y: auto;
            padding-right: 15px;
            scrollbar-width: thin;
            scrollbar-color: rgba(180, 140, 255, 0.6) transparent;
        }
        
        .RX-POP-UP-Window-scroll-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .RX-POP-UP-Window-scroll-content::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .RX-POP-UP-Window-scroll-content::-webkit-scrollbar-thumb {
            background: rgba(180, 140, 255, 0.6);
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        h2 {
            color: #fff;
            font-size: 28px;
            margin-bottom: 25px;
            text-align: center;
            font-weight: 600;
            text-shadow: 0 2px 10px rgba(180, 140, 255, 0.4);
            position: relative;
            display: inline-block;
            padding: 0 20px;
        }
        
        h2::before {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, transparent, rgba(180, 140, 255, 0.8), transparent);
            border-radius: 3px;
        }
        
        p {
            color: rgba(255, 255, 255, 0.85);
            line-height: 1.8;
            margin: 20px 0;
            font-size: 16px;
            text-align: center;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        /* Gallery */
        .RX-POP-UP-Window-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .RX-POP-UP-Window-gallery img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 12px;
            transition: all 0.4s ease;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3),
                        inset 0 0 10px rgba(255,255,255,0.05);
            background: rgba(255,255,255,0.02);
            backdrop-filter: blur(5px);
            opacity: 0;
            transform: translateY(20px);
        }
        
        .RX-POP-UP-Window-carousel-item.RX-POP-UP-Window-active .RX-POP-UP-Window-gallery img {
            animation: RX-POP-UP-Window-fadeUp 0.6s forwards;
        }
        
        .RX-POP-UP-Window-gallery img:hover {
            transform: scale(1.03);
            box-shadow: 0 8px 30px rgba(180, 140, 255, 0.3),
                        inset 0 0 15px rgba(255,255,255,0.1);
            border: 1px solid rgba(180, 140, 255, 0.3);
        }
        
        /* Controls */
        .RX-POP-UP-Window-carousel-controls {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: calc(100% - 80px);
            bottom: 30px;
            left: 40px;
        }
        
        .RX-POP-UP-Window-carousel-btn {
            background: rgba(180, 140, 255, 0.15);
            color: #fff;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .RX-POP-UP-Window-carousel-btn:hover {
            background: rgba(180, 140, 255, 0.3);
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(180, 140, 255, 0.3);
        }
        
        .RX-POP-UP-Window-carousel-btn svg {
            width: 20px;
            height: 20px;
            stroke: currentColor;
            filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
        }
        
        /* Close Button */
        .RX-POP-UP-Window-btn-close {
            position: absolute;
            top: 25px;
            right: 25px;
            width: 45px;
            height: 45px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
            backdrop-filter: blur(5px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .RX-POP-UP-Window-btn-close:hover {
            background: rgba(255, 100, 200, 0.3);
            transform: rotate(90deg) scale(1.1);
            box-shadow: 0 6px 20px rgba(255, 100, 200, 0.3);
        }
        
        /* Indicators */
        .RX-POP-UP-Window-carousel-indicators {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 25px;
        }
        
        .RX-POP-UP-Window-carousel-indicators span {
            display: block;
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .RX-POP-UP-Window-carousel-indicators span.RX-POP-UP-Window-active {
            background: rgba(180, 140, 255, 0.8);
            transform: scale(1.4);
            box-shadow: 0 0 15px rgba(180, 140, 255, 0.8);
        }
        
        /* Animations */
        @keyframes RX-POP-UP-Window-fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes RX-POP-UP-Window-fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Crystal Light Effects */
        @keyframes crystalPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .RX-POP-UP-Window-content {
                width: 95%;
                padding: 30px;
            }
            
            .RX-POP-UP-Window-scroll-content {
                max-height: 60vh;
            }
            
            .RX-POP-UP-Window-gallery {
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 15px;
            }
        }
        
        @media (max-width: 480px) {
            .RX-POP-UP-Window-content {
                padding: 25px 20px;
                border-radius: 20px;
            }
            
            h2 {
                font-size: 24px;
            }
            
            .RX-POP-UP-Window-carousel-controls {
                width: calc(100% - 40px);
                left: 20px;
                bottom: 20px;
            }
            
            .RX-POP-UP-Window-carousel-btn {
                width: 45px;
                height: 45px;
            }
            
            .RX-POP-UP-Window-btn-close {
                width: 40px;
                height: 40px;
                top: 15px;
                right: 15px;
            }
        }
    `;

    // The JavaScript functionality remains the same as before
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    document.head.appendChild(style);

    const popup = document.getElementById("RX-POP-UP-Window");
    const closeBtn = document.getElementById("RX-POP-UP-Window-close");
    const carouselItems = document.querySelectorAll(".RX-POP-UP-Window-carousel-item");
    const prevBtn = document.querySelector(".RX-POP-UP-Window-prev");
    const nextBtn = document.querySelector(".RX-POP-UP-Window-next");
    const indicatorsContainer = document.querySelector(".RX-POP-UP-Window-carousel-indicators");
    
    let currentIndex = 0;
    let autoSlideInterval;
    const slideDuration = 10000;
    
    function init() {
        createIndicators();
        updateCarousel();
        showPopup();
    }
    
    function createIndicators() {
        carouselItems.forEach((_, index) => {
            const indicator = document.createElement("span");
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    function showPopup() {
        popup.classList.add("RX-POP-UP-Window-show");
        startAutoSlide();
    }
    
    function closePopup() {
        popup.classList.remove("RX-POP-UP-Window-show");
        stopAutoSlide();
        pauseAllMedia();
    }
    
    function updateCarousel() {
        carouselItems.forEach((item, index) => {
            item.classList.toggle("RX-POP-UP-Window-active", index === currentIndex);
        });
        
        const indicators = document.querySelectorAll(".RX-POP-UP-Window-carousel-indicators span");
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle("RX-POP-UP-Window-active", index === currentIndex);
        });
        
        pauseAllMedia();
        const currentMedia = carouselItems[currentIndex].querySelector('.RX-POP-UP-Window-media');
        if (currentMedia) {
            currentMedia.currentTime = 0;
            if (currentMedia.tagName === 'VIDEO' || currentMedia.tagName === 'AUDIO') {
                currentMedia.play().catch(e => console.log("Autoplay prevented:", e));
            }
        }
    }
    
    function pauseAllMedia() {
        document.querySelectorAll('.RX-POP-UP-Window-media').forEach(media => {
            if (media.tagName === 'VIDEO' || media.tagName === 'AUDIO') {
                media.pause();
            }
        });
    }
    
    function goToSlide(index) {
        currentIndex = (index + carouselItems.length) % carouselItems.length;
        updateCarousel();
        resetAutoSlide();
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    function startAutoSlide() {
        if (!autoSlideInterval) {
            autoSlideInterval = setInterval(nextSlide, slideDuration);
        }
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
    
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    closeBtn.addEventListener("click", closePopup);
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);
    
    document.addEventListener("keydown", (e) => {
        if (popup.classList.contains("RX-POP-UP-Window-show")) {
            if (e.key === "Escape") {
                closePopup();
            } else if (e.key === "ArrowLeft") {
                prevSlide();
            } else if (e.key === "ArrowRight") {
                nextSlide();
            }
        }
    });
    
    setTimeout(init, 500);
});