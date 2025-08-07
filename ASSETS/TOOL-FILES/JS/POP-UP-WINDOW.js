// RX-POPUP-INFINITE-LOOP.js
document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // 1. POPUP HTML STRUCTURE
    // =============================================
    const popupHTML = `
        <div id="RX-Popup">
            <div class="RX-Popup-content">
                <button class="RX-Popup-btn-close" id="RX-Popup-close" aria-label="Close popup">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                
                <div class="RX-Popup-carousel" id="RX-Popup-carousel">
                                    <!-- Image Gallery Page -->
                    <div class="RX-Popup-carousel-item">
                        <h2>Welcome</h2>
                        <div class="RX-Popup-scroll-content">
                            <p>"Hi, I'm Rosan Xettri, a passionate web designer dedicated to creating stunning and user-friendly websites. Let's build something amazing!"</p>
                            <div class="RX-Popup-gallery">
                                <img src="ASSETS/MAIN-FILE/IMG/WELCOME-PERSON-IMAGE/R-M.jpg" alt="Brand Identity" loading="lazy">
                            </div>
                        </div>
                    </div>

                    <!-- Video Page -->
                    <!--<div class="RX-Popup-carousel-item">
                        <h2>My Introduction Video</h2>
                        <div class="RX-Popup-scroll-content">
                            <p>Watch my creative process in action</p>
                            <div class="RX-Popup-media-container">
                                <video class="RX-Popup-media" controls poster="ASSETS/MAIN-FILE/IMG/video-poster.jpg">
                                    <source src="ASSETS/MAIN-FILE/VIDEO/intro.mp4" type="video/mp4">
                                </video>
                            </div>
                            <p>Double click video to toggle fullscreen</p>
                        </div>
                    </div>-->
                    
                    <!-- Image Gallery Page -->
                    <!--<div class="RX-Popup-carousel-item">
                        <h2>My Portfolio Gallery</h2>
                        <div class="RX-Popup-scroll-content">
                            <p>Explore my recent design projects</p>
                            <div class="RX-Popup-gallery">
                                <img src="ASSETS/MAIN-FILE/IMG/project1.jpg" alt="Web Design Project" loading="lazy">
                                <img src="ASSETS/MAIN-FILE/IMG/project2.jpg" alt="Mobile App Design" loading="lazy">
                                <img src="ASSETS/MAIN-FILE/IMG/project3.jpg" alt="Brand Identity" loading="lazy">
                            </div>
                            <p>Hover images for details</p>
                        </div>
                    </div>-->
                    
                    <!-- Audio Page -->
                    <!--<div class="RX-Popup-carousel-item">
                        <h2>My Design Podcast</h2>
                        <div class="RX-Popup-scroll-content">
                            <p>Listen to my thoughts on modern design</p>
                            <div class="RX-Popup-media-container">
                                <audio class="RX-Popup-media" controls>
                                    <source src="ASSETS/MAIN-FILE/AUDIO/podcast.mp3" type="audio/mpeg">
                                </audio>
                            </div>
                            <p>Episode 1: The Creative Mindset</p>
                        </div>
                    </div>
                </div>-->
                
                <div class="RX-Popup-carousel-controls">
                    <button class="RX-Popup-carousel-btn RX-Popup-prev" aria-label="Previous">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <button class="RX-Popup-carousel-btn RX-Popup-next" aria-label="Next">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
                
                <div class="RX-Popup-carousel-indicators"></div>
            </div>
        </div>
    `;

    // =============================================
    // 2. CSS STYLES
    // =============================================
    const style = document.createElement('style');
    style.textContent = `
        /* Base Styles */
        #RX-Popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(10, 5, 30, 0.96);
            backdrop-filter: blur(12px);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
        }
        
        #RX-Popup.RX-Popup-show {
            opacity: 1;
            visibility: visible;
        }
        
        .RX-Popup-content {
            background: linear-gradient(145deg, #1a0638, #0d0230);
            width: 90%;
            max-width: 700px;
            border-radius: 20px;
            padding: 35px;
            box-shadow: 0 30px 60px rgba(70, 20, 150, 0.5);
            position: relative;
            transform: translateY(30px);
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
            max-height: 90vh;
            overflow: hidden;
            border: 1px solid rgba(150, 110, 255, 0.3);
        }
        
        #RX-Popup.RX-Popup-show .RX-Popup-content {
            transform: translateY(0);
            opacity: 1;
        }
        
        /* Carousel Items */
        .RX-Popup-carousel-item {
            display: none;
            animation: RX-Popup-fadeIn 0.8s ease;
        }
        
        .RX-Popup-carousel-item.RX-Popup-active {
            display: block;
        }
        
        /* Content Styles */
        .RX-Popup-scroll-content {
            max-height: 65vh;
            overflow-y: auto;
            padding-right: 15px;
            scrollbar-width: thin;
            scrollbar-color: #6a3dbb rgba(30, 10, 60, 0.5);
        }
        
        .RX-Popup-scroll-content::-webkit-scrollbar {
            width: 8px;
        }
        
        .RX-Popup-scroll-content::-webkit-scrollbar-track {
            background: rgba(30, 10, 60, 0.5);
            border-radius: 10px;
        }
        
        .RX-Popup-scroll-content::-webkit-scrollbar-thumb {
            background-color: #6a3dbb;
            border-radius: 10px;
        }
        
        h2 {
            color: #b388ff;
            font-size: 28px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }
        
        p {
            color: #d0c0ff;
            line-height: 1.8;
            margin: 15px 0;
            font-size: 16px;
            text-align: center;
        }
        
        /* Media Elements */
        .RX-Popup-media-container {
            margin: 25px 0;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(40, 5, 90, 0.7);
            background: #0f0525;
        }
        
        .RX-Popup-media {
            width: 100%;
            display: block;
        }
        
        /* Gallery */
        .RX-Popup-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 20px;
            margin: 25px 0;
        }
        
        .RX-Popup-gallery img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
            transition: all 0.4s ease;
            cursor: pointer;
            border: 1px solid rgba(120, 80, 220, 0.4);
            opacity: 0;
            transform: translateY(20px);
        }
        
        .RX-Popup-carousel-item.RX-Popup-active .RX-Popup-gallery img {
            animation: RX-Popup-fadeUp 0.6s forwards;
        }
        
        .RX-Popup-carousel-item.RX-Popup-active .RX-Popup-gallery img:nth-child(1) {
            animation-delay: 0.3s;
        }
        
        .RX-Popup-carousel-item.RX-Popup-active .RX-Popup-gallery img:nth-child(2) {
            animation-delay: 0.5s;
        }
        
        .RX-Popup-carousel-item.RX-Popup-active .RX-Popup-gallery img:nth-child(3) {
            animation-delay: 0.7s;
        }
        
        .RX-Popup-gallery img:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 25px rgba(120, 80, 220, 0.5);
        }
        
        /* Controls */
        .RX-Popup-carousel-controls {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: calc(100% - 70px);
            bottom: 25px;
            left: 35px;
        }
        
        .RX-Popup-carousel-btn {
            background: rgba(90, 50, 180, 0.5);
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
            backdrop-filter: blur(6px);
            border: 1px solid rgba(150, 110, 255, 0.3);
        }
        
        .RX-Popup-carousel-btn:hover {
            background: rgba(120, 80, 220, 0.8);
            transform: scale(1.1);
        }
        
        .RX-Popup-carousel-btn svg {
            width: 20px;
            height: 20px;
            stroke: currentColor;
        }
        
        /* Close Button */
        .RX-Popup-btn-close {
            position: absolute;
            top: 25px;
            right: 25px;
            width: 45px;
            height: 45px;
            background: rgba(120, 80, 220, 0.4);
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
            backdrop-filter: blur(5px);
        }
        
        .RX-Popup-btn-close:hover {
            background: rgba(150, 110, 255, 0.6);
            transform: rotate(90deg);
        }
        
        /* Indicators */
        .RX-Popup-carousel-indicators {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 25px;
        }
        
        .RX-Popup-carousel-indicators span {
            display: block;
            width: 12px;
            height: 12px;
            background: rgba(150, 110, 255, 0.4);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .RX-Popup-carousel-indicators span.RX-Popup-active {
            background: #b388ff;
            transform: scale(1.4);
            box-shadow: 0 0 15px rgba(180, 140, 255, 0.8);
        }
        
        /* Animations */
        @keyframes RX-Popup-fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes RX-Popup-fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .RX-Popup-content {
                width: 95%;
                padding: 30px;
            }
            
            .RX-Popup-scroll-content {
                max-height: 60vh;
            }
            
            .RX-Popup-gallery {
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 15px;
            }
        }
        
        @media (max-width: 480px) {
            .RX-Popup-content {
                padding: 25px 20px;
                border-radius: 16px;
            }
            
            h2 {
                font-size: 24px;
            }
            
            .RX-Popup-carousel-controls {
                width: calc(100% - 40px);
                left: 20px;
                bottom: 20px;
            }
            
            .RX-Popup-carousel-btn {
                width: 45px;
                height: 45px;
            }
            
            .RX-Popup-btn-close {
                width: 40px;
                height: 40px;
                top: 15px;
                right: 15px;
            }
        }
    `;

    // =============================================
    // 3. INJECT HTML AND CSS
    // =============================================
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    document.head.appendChild(style);

    // =============================================
    // 4. CORE FUNCTIONALITY (INFINITE LOOP)
    // =============================================
    const popup = document.getElementById("RX-Popup");
    const closeBtn = document.getElementById("RX-Popup-close");
    const carouselItems = document.querySelectorAll(".RX-Popup-carousel-item");
    const prevBtn = document.querySelector(".RX-Popup-prev");
    const nextBtn = document.querySelector(".RX-Popup-next");
    const indicatorsContainer = document.querySelector(".RX-Popup-carousel-indicators");
    
    let currentIndex = 0;
    let autoSlideInterval;
    const slideDuration = 10000; // 10 seconds
    
    // Initialize
    function init() {
        createIndicators();
        updateCarousel();
        showPopup();
    }
    
    // Create indicators
    function createIndicators() {
        carouselItems.forEach((_, index) => {
            const indicator = document.createElement("span");
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    // Show popup
    function showPopup() {
        popup.classList.add("RX-Popup-show");
        startAutoSlide();
    }
    
    // Close popup (only via close button)
    function closePopup() {
        popup.classList.remove("RX-Popup-show");
        stopAutoSlide();
        pauseAllMedia();
    }
    
    // Update carousel
    function updateCarousel() {
        carouselItems.forEach((item, index) => {
            item.classList.toggle("RX-Popup-active", index === currentIndex);
        });
        
        const indicators = document.querySelectorAll(".RX-Popup-carousel-indicators span");
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle("RX-Popup-active", index === currentIndex);
        });
        
        // Handle media
        pauseAllMedia();
        const currentMedia = carouselItems[currentIndex].querySelector('.RX-Popup-media');
        if (currentMedia) {
            currentMedia.currentTime = 0;
            if (currentMedia.tagName === 'VIDEO' || currentMedia.tagName === 'AUDIO') {
                currentMedia.play().catch(e => console.log("Autoplay prevented:", e));
            }
        }
    }
    
    // Pause all media
    function pauseAllMedia() {
        document.querySelectorAll('.RX-Popup-media').forEach(media => {
            if (media.tagName === 'VIDEO' || media.tagName === 'AUDIO') {
                media.pause();
            }
        });
    }
    
    // Infinite loop navigation
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
    
    // Auto-slide
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
    
    // =============================================
    // 5. EVENT LISTENERS
    // =============================================
    closeBtn.addEventListener("click", closePopup);
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);
    
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (popup.classList.contains("RX-Popup-show")) {
            if (e.key === "Escape") {
                closePopup();
            } else if (e.key === "ArrowLeft") {
                prevSlide();
            } else if (e.key === "ArrowRight") {
                nextSlide();
            }
        }
    });
    
    // Initialize after slight delay
    setTimeout(init, 500);
});