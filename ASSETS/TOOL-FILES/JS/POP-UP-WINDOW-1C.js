// RX-POP-UP-WINDOW.js (Dynamic Crystal Themes with Refresh Change)
document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // 1. THEME CONFIGURATION
    // =============================================
    const crystalThemes = {
        "amethyst": {
            primary: "rgba(180, 140, 255, 0.8)",
            secondary: "rgba(100, 70, 255, 0.6)",
            accent: "rgba(230, 200, 255, 0.9)",
            bgGradient: "linear-gradient(145deg, rgba(15, 5, 35, 0.7), rgba(30, 10, 60, 0.8))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(180, 140, 255, 0.15) 0%, transparent 40%)"
        },
        "sapphire": {
            primary: "rgba(100, 150, 255, 0.8)",
            secondary: "rgba(70, 100, 255, 0.6)",
            accent: "rgba(200, 220, 255, 0.9)",
            bgGradient: "linear-gradient(145deg, rgba(5, 15, 35, 0.7), rgba(10, 30, 60, 0.8))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(100, 150, 255, 0.15) 0%, transparent 40%)"
        },
        "ruby": {
            primary: "rgba(255, 100, 150, 0.8)",
            secondary: "rgba(220, 70, 100, 0.6)",
            accent: "rgba(255, 200, 220, 0.9)",
            bgGradient: "linear-gradient(145deg, rgba(35, 5, 15, 0.7), rgba(60, 10, 20, 0.8))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(255, 100, 150, 0.15) 0%, transparent 40%)"
        },
        "emerald": {
            primary: "rgba(100, 255, 180, 0.8)",
            secondary: "rgba(70, 220, 150, 0.6)",
            accent: "rgba(200, 255, 230, 0.9)",
            bgGradient: "linear-gradient(145deg, rgba(5, 35, 15, 0.7), rgba(10, 60, 20, 0.8))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(100, 255, 180, 0.15) 0%, transparent 40%)"
        },
        "citrine": {
            primary: "rgba(255, 200, 100, 0.8)",
            secondary: "rgba(255, 180, 70, 0.6)",
            accent: "rgba(255, 230, 200, 0.9)",
            bgGradient: "linear-gradient(145deg, rgba(35, 25, 5, 0.7), rgba(60, 40, 10, 0.8))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(255, 200, 100, 0.15) 0%, transparent 40%)"
        },
        "rainbow": {
            primary: "rgba(255, 100, 255, 0.8)",
            secondary: "rgba(100, 255, 255, 0.6)",
            accent: "rgba(255, 255, 200, 0.9)",
            bgGradient: "linear-gradient(145deg, rgba(35, 5, 35, 0.7), rgba(60, 10, 60, 0.8))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(255, 100, 255, 0.1) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(100, 255, 255, 0.1) 0%, transparent 40%)"
        }
    };

    // Get random theme different from last one
    function getRandomTheme() {
        const lastTheme = localStorage.getItem('rxCrystalTheme');
        const themeKeys = Object.keys(crystalThemes);
        
        // If no last theme or only one theme available
        if (!lastTheme || themeKeys.length === 1) {
            return themeKeys[Math.floor(Math.random() * themeKeys.length)];
        }
        
        // Filter out last theme and pick random from remaining
        const availableThemes = themeKeys.filter(theme => theme !== lastTheme);
        return availableThemes[Math.floor(Math.random() * availableThemes.length)];
    }

    // Apply theme dynamically
    function applyTheme(themeName) {
        const theme = crystalThemes[themeName];
        const style = document.createElement('style');
        style.id = 'rx-crystal-theme';
        
        style.textContent = `
            /* Dynamic Crystal Theme: ${themeName} */
            #RX-POP-UP-Window::before {
                background: ${theme.lightEffect};
            }
            
            .RX-POP-UP-Window-content {
                background: ${theme.bgGradient};
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                            0 0 0 1px rgba(255, 255, 255, 0.05),
                            0 0 40px ${theme.secondary.replace('0.6', '0.2')},
                            0 0 80px ${theme.secondary.replace('0.6', '0.1')};
            }
            
            h2 {
                text-shadow: 0 2px 10px ${theme.primary.replace('0.8', '0.4')};
            }
            
            h2::before {
                background: linear-gradient(90deg, transparent, ${theme.primary}, transparent);
            }
            
            .RX-POP-UP-Window-gallery img:hover {
                box-shadow: 0 8px 30px ${theme.primary.replace('0.8', '0.3')},
                            inset 0 0 15px rgba(255,255,255,0.1);
                border: 1px solid ${theme.primary.replace('0.8', '0.3')};
            }
            
            .RX-POP-UP-Window-carousel-btn:hover {
                background: ${theme.primary.replace('0.8', '0.3')};
                box-shadow: 0 6px 20px ${theme.primary.replace('0.8', '0.3')};
            }
            
            .RX-POP-UP-Window-btn-close:hover {
                background: ${theme.secondary.replace('0.6', '0.3')};
                box-shadow: 0 6px 20px ${theme.secondary.replace('0.6', '0.3')};
            }
            
            .RX-POP-UP-Window-carousel-indicators span.RX-POP-UP-Window-active {
                background: ${theme.primary};
                box-shadow: 0 0 15px ${theme.primary};
            }
            
            .RX-POP-UP-Window-scroll-content::-webkit-scrollbar-thumb {
                background: ${theme.primary.replace('0.8', '0.6')};
            }
            
            /* Facet Colors */
            .facet-1 {
                background: linear-gradient(135deg, ${theme.primary.replace('0.8', '0.1')}, transparent);
            }
            
            .facet-2 {
                background: linear-gradient(45deg, ${theme.secondary.replace('0.6', '0.1')}, transparent);
            }
            
            .facet-3 {
                background: linear-gradient(90deg, ${theme.accent.replace('0.9', '0.05')}, transparent);
            }
        `;
        
        // Remove existing theme if exists
        const existingTheme = document.getElementById('rx-crystal-theme');
        if (existingTheme) {
            document.head.removeChild(existingTheme);
        }
        
        document.head.appendChild(style);
        
        // Store current theme
        localStorage.setItem('rxCrystalTheme', themeName);
    }

    // =============================================
    // 2. POPUP HTML STRUCTURE
    // =============================================
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

    // =============================================
    // 3. BASE CSS STYLES
    // =============================================
    const baseStyle = document.createElement('style');
    baseStyle.textContent = `
        /* Base Styles */
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
            pointer-events: none;
        }
        
        #RX-POP-UP-Window.RX-POP-UP-Window-show {
            opacity: 1;
            visibility: visible;
        }
        
        .RX-POP-UP-Window-content {
            position: relative;
            width: 90%;
            max-width: 700px;
            border-radius: 24px;
            padding: 40px;
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
            border-radius: 10px;
        }
        
        .facet-1 {
            top: -50px;
            right: -50px;
            width: 200px;
            height: 200px;
            transform: rotate(45deg);
        }
        
        .facet-2 {
            bottom: -30px;
            left: -30px;
            width: 150px;
            height: 150px;
            transform: rotate(20deg);
        }
        
        .facet-3 {
            top: 50%;
            left: 50%;
            width: 100px;
            height: 300px;
            transform: translate(-50%, -50%) rotate(15deg);
        }
        
        #RX-POP-UP-Window.RX-POP-UP-Window-show .RX-POP-UP-Window-content {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        
        /* Carousel Items */
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
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        h2 {
            color: #fff;
            font-size: 28px;
            margin-bottom: 25px;
            text-align: center;
            font-weight: 600;
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
            color:red;
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
            transform: scale(1.1);
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
            transform: rotate(360deg) scale(1.1);
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
            transform: scale(1.4);
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

    // =============================================
    // 4. INITIALIZATION
    // =============================================
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    document.head.appendChild(baseStyle);
    
    // Apply random theme on each load
    const randomTheme = getRandomTheme();
    applyTheme(randomTheme);

    // =============================================
    // 5. CORE FUNCTIONALITY
    // =============================================
    const popup = document.getElementById("RX-POP-UP-Window");
    const closeBtn = document.getElementById("RX-POP-UP-Window-close");
    const carouselItems = document.querySelectorAll(".RX-POP-UP-Window-carousel-item");
    const prevBtn = document.querySelector(".RX-POP-UP-Window-prev");
    const nextBtn = document.querySelector(".RX-POP-UP-Window-next");
    const indicatorsContainer = document.querySelector(".RX-POP-UP-Window-carousel-indicators");
    
    let currentIndex = 0;
    let autoSlideInterval;
    const slideDuration = 10000; // 10 seconds
    
    // Initialize popup
    function init() {
        createIndicators();
        updateCarousel();
        showPopup();
    }
    
    // Create carousel indicators
    function createIndicators() {
        carouselItems.forEach((_, index) => {
            const indicator = document.createElement("span");
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    // Show popup with animation
    function showPopup() {
        popup.classList.add("RX-POP-UP-Window-show");
        startAutoSlide();
    }
    
    // Close popup
    function closePopup() {
        popup.classList.remove("RX-POP-UP-Window-show");
        stopAutoSlide();
        pauseAllMedia();
    }
    
    // Update carousel to current slide
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
    
    // Pause all media elements
    function pauseAllMedia() {
        document.querySelectorAll('.RX-POP-UP-Window-media').forEach(media => {
            if (media.tagName === 'VIDEO' || media.tagName === 'AUDIO') {
                media.pause();
            }
        });
    }
    
    // Navigate to specific slide
    function goToSlide(index) {
        currentIndex = (index + carouselItems.length) % carouselItems.length;
        updateCarousel();
        resetAutoSlide();
    }
    
    // Go to next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Go to previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Start auto-sliding
    function startAutoSlide() {
        if (!autoSlideInterval) {
            autoSlideInterval = setInterval(nextSlide, slideDuration);
        }
    }
    
    // Stop auto-sliding
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
    
    // Reset auto-slide timer
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // =============================================
    // 6. EVENT LISTENERS
    // =============================================
    closeBtn.addEventListener("click", closePopup);
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);
    
    // Keyboard navigation
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
    
    // Initialize after slight delay
    setTimeout(init, 500);
});