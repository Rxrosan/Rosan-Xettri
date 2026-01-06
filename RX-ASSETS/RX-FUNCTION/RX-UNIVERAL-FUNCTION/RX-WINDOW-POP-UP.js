// RX-POP-UP-WINDOW-REFACTORED.js (Modular & Highly Editable)
document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. CENTRALIZED CONFIGURATION (EDIT THIS SECTION)
    // =============================================
    const POPUP_CONFIG = {
        // --- Base Naming ---
        // Change this to create a unique instance of the popup and prevent conflicts.
        baseName: "RX_MODULAR_POPUP",

        // --- Content Slides ---
        // Add or remove objects in this array to change the carousel slides.
        slides: [
            {
                title: "Welcome",
                // The text for the typing animation.
                text: "Hi, I'm Rosan Xettri, a passionate web designer dedicated to creating stunning and user-friendly websites. Let's build something amazing together!",
                // Add image paths to this gallery.
                galleryImages: ["ASSET/MAIN/IMG/WELCOME-PERSON-IMAGE/INTRO.jpg"
                    // Example: "path/to/your/image2.jpg",
                    // Example: "path/to/your/image3.jpg"
                    ]
            },
            // To add a new slide, copy the object above and paste it here, separated by a comma.
            // {
            //     title: "My Projects",
            //     text: "Here is a showcase of my recent work.",
            //     galleryImages: [ "path/to/project1.jpg", "path/to/project2.jpg" ]
            // }
        ],

        // --- Themes ---
        // Define different visual themes. The popup will cycle through them on each visit.
        themes: {
            "silver_water_liquid": {
                primary: "rgba(192, 192, 192, 0.4)",
                secondary: "rgba(169, 169, 169, 0.3)",
                accent: "rgba(211, 211, 211, 0.5)",
                bgGradient: "linear-gradient(145deg, rgba(30, 30, 40, 0.3), rgba(50, 50, 70, 0.4))",
                lightEffect: "radial-gradient(circle at 20% 30%, rgba(220, 220, 230, 0.2) 0%, transparent 60%)",
                shineColor: "rgba(240, 240, 255, 0.7)"
            },
            "white_liquid_transparent": {
                primary: "rgba(255, 255, 255, 0.4)",
                secondary: "rgba(230, 230, 230, 0.3)",
                accent: "rgba(255, 255, 255, 0.5)",
                bgGradient: "linear-gradient(145deg, rgba(25, 25, 35, 0.3), rgba(40, 40, 60, 0.4))",
                lightEffect: "radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)",
                shineColor: "rgba(255, 255, 255, 0.7)"
            }
        },

        // --- Functional Settings ---
        settings: {
            initialDelay: 1,       // Delay in milliseconds before the popup appears.
            slideDuration: 10000,    // Time in milliseconds for auto-sliding.
            typingSpeed: 40         // Speed of the typing animation in milliseconds.
        }
    };


    // =============================================
    // 2. DYNAMIC HTML & CSS GENERATORS (DO NOT EDIT)
    // =============================================
    
    // Generates the popup's HTML structure from the configuration.
    function generatePopupHTML(config) {
        const carouselItemsHTML = config.slides.map(slide => `
            <div class="${config.baseName}-carousel-item">
                <h2>${slide.title}</h2>
                <div class="${config.baseName}-scroll-content">
                    <p class="${config.baseName}-typing-text" data-text="${slide.text}"></p>
                    <div class="${config.baseName}-gallery">
                        ${slide.galleryImages.map(imgSrc => `<img src="${imgSrc}" alt="Gallery Image" loading="lazy">`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div id="${config.baseName}">
                <div class="${config.baseName}-content">
                    <button class="${config.baseName}-btn-close" aria-label="Close popup">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="${config.baseName}-carousel">${carouselItemsHTML}</div>
                    <div class="${config.baseName}-carousel-controls">
                        <button class="${config.baseName}-carousel-btn ${config.baseName}-prev" aria-label="Previous">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <button class="${config.baseName}-carousel-btn ${config.baseName}-next" aria-label="Next">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                    <div class="${config.baseName}-carousel-indicators"></div>
                </div>
            </div>
        `;
    }

    // Generates the popup's base CSS using the unique baseName.
    function generateBaseCSS(config) {
        const base = `#${config.baseName}`;
        const content = `.${config.baseName}-content`;
        const item = `.${config.baseName}-carousel-item`;
        
        return `
            ${base} { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(5, 0, 15, 0.8); backdrop-filter: blur(25px) saturate(180%); z-index: 9999; display: flex; justify-content: center; align-items: center; opacity: 0; visibility: hidden; transition: opacity 0.6s cubic-bezier(0.32, 0.72, 0, 1), visibility 0.6s; }
            ${base}::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; transition: all 1s ease; z-index: -1; }
            ${base}.show { opacity: 1; visibility: visible; }
            ${content} { position: relative; width: 90%; max-width: 750px; border-radius: 28px; padding: 45px; transform: translateY(30px) scale(0.98); opacity: 0; transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s; max-height: 90vh; overflow: hidden; z-index: 1; }
            ${base}.show ${content} { transform: translateY(0) scale(1); opacity: 1; }
            .${config.baseName}-gallery, .${config.baseName}-carousel-controls, .${config.baseName}-btn-close { opacity: 0; visibility: hidden; transition: opacity 0.6s ease, visibility 0.6s; }
            ${content}.typing-complete .${config.baseName}-gallery, ${content}.typing-complete .${config.baseName}-carousel-controls, ${content}.typing-complete .${config.baseName}-btn-close { opacity: 1; visibility: visible; }
            .${config.baseName}-typing-text::after { content: '|'; font-weight: 200; animation: blink-caret-anim 0.75s step-end infinite; color: rgba(255, 255, 255, 0.7); }
            .${config.baseName}-typing-text.typing-done::after { content: ''; }
            @keyframes blink-caret-anim { from, to { color: transparent; } 50% { color: rgba(255, 255, 255, 0.7); } }
            ${item} { display: none; animation: fadeIn-anim 0.8s ease; }
            ${item}.active { display: block; }
            .${config.baseName}-scroll-content { max-height: 65vh; overflow-y: auto; padding-right: 15px; scrollbar-width: thin; scrollbar-color: rgba(180, 140, 255, 0.6) transparent; }
            .${config.baseName}-scroll-content::-webkit-scrollbar { width: 6px; } .${config.baseName}-scroll-content::-webkit-scrollbar-track { background: transparent; } .${config.baseName}-scroll-content::-webkit-scrollbar-thumb { border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.2); }
            ${content} h2 { font-size: 32px; margin-bottom: 30px; text-align: center; font-weight: 600; position: relative; display: inline-block; padding: 0 30px; letter-spacing: 1px; }
            ${content} h2::before { content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 80px; height: 3px; border-radius: 3px; }
            ${content} p { color: rgba(255, 255, 255, 0.9); line-height: 1.8; margin: 25px 0; font-size: 17px; text-align: center; text-shadow: 0 1px 3px rgba(0,0,0,0.3); min-height: 100px; }
            .${config.baseName}-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 25px; margin: 35px 0; }
            .${config.baseName}-gallery img { width: 100%; height: 100%; object-fit: cover; border-radius: 14px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(255,255,255,0.08); background: rgba(255,255,255,0.05); backdrop-filter: blur(8px); opacity: 0; transform: translateY(20px); }
            ${content}.typing-complete ${item}.active .${config.baseName}-gallery img { animation: fadeUp-anim 0.6s forwards; animation-delay: calc(var(--order) * 0.1s); }
            .${config.baseName}-gallery img:hover { transform: scale(1.05); z-index: 2; }
            .${config.baseName}-carousel-controls { display: flex; justify-content: space-between; position: absolute; width: calc(100% - 90px); bottom: 35px; left: 45px; }
            .${config.baseName}-carousel-btn { border: none; width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); }
            .${config.baseName}-carousel-btn:hover { transform: scale(1.15); } .${config.baseName}-carousel-btn svg { width: 22px; height: 22px; stroke: currentColor; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
            .${config.baseName}-btn-close { position: absolute; top: 30px; right: 30px; width: 50px; height: 50px; background: rgba(255, 255, 255, 0.15); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.4s ease; z-index: 10; backdrop-filter: blur(8px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.15); }
            .${config.baseName}-btn-close:hover { transform: rotate(90deg) scale(1.15); } .${config.baseName}-btn-close svg { width: 24px; height: 24px; stroke: currentColor; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
            .${config.baseName}-carousel-indicators { display: flex; justify-content: center; gap: 15px; margin-top: 30px; }
            .${config.baseName}-carousel-indicators span { display: block; width: 12px; height: 12px; background: rgba(255, 255, 255, 0.25); border-radius: 50%; cursor: pointer; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); }
            .${config.baseName}-carousel-indicators span.active { transform: scale(1.5); }
            @keyframes fadeIn-anim { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fadeUp-anim { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
            @media (max-width: 768px) { ${content} { width: 95%; padding: 35px; } .${config.baseName}-scroll-content { max-height: 60vh; } .${config.baseName}-gallery { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; } ${content} h2 { font-size: 28px; } }
            @media (max-width: 480px) { ${content} { padding: 30px 25px; border-radius: 24px; } ${content} h2 { font-size: 26px; margin-bottom: 25px; } .${config.baseName}-carousel-controls { width: calc(100% - 50px); left: 25px; bottom: 25px; } .${config.baseName}-carousel-btn { width: 50px; height: 50px; } .${config.baseName}-btn-close { width: 45px; height: 45px; top: 20px; right: 20px; } }
        `;
    }

    // Generates the theme-specific CSS.
    function generateThemeCSS(theme, config) {
        const base = `#${config.baseName}`;
        return `
            ${base}::before { background: ${theme.lightEffect}; opacity: 0.8; }
            .${config.baseName}-content { background: ${theme.bgGradient}; backdrop-filter: blur(20px) saturate(200%); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 0 30px rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.12); }
            .${config.baseName}-content h2 { color: rgba(255,255,255,0.95); text-shadow: 0 2px 12px ${theme.primary.replace('0.4', '0.3')}, 0 0 20px ${theme.shineColor}; }
            .${config.baseName}-content h2::before { background: linear-gradient(90deg, transparent, ${theme.primary}, transparent); height: 3px; opacity: 0.8; box-shadow: 0 0 15px ${theme.primary}; }
            .${config.baseName}-gallery img:hover { box-shadow: 0 12px 30px ${theme.primary.replace('0.4', '0.2')}, inset 0 0 15px rgba(255,255,255,0.1); border: 1px solid ${theme.primary.replace('0.4', '0.3')}; filter: brightness(1.1) saturate(1.2); }
            .${config.baseName}-carousel-btn { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255,255,255,0.1); }
            .${config.baseName}-carousel-btn:hover { background: ${theme.primary.replace('0.4', '0.3')}; box-shadow: 0 8px 25px ${theme.primary.replace('0.4', '0.2')}, inset 0 0 15px rgba(255,255,255,0.15); color: white; }
            .${config.baseName}-btn-close:hover { background: ${theme.secondary.replace('0.3', '0.25')}; box-shadow: 0 8px 25px ${theme.secondary.replace('0.3', '0.2')}; }
            .${config.baseName}-carousel-indicators span.active { background: ${theme.primary}; box-shadow: 0 0 15px ${theme.primary}; }
            .${config.baseName}-carousel-btn, .${config.baseName}-gallery img { transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
        `;
    }

    // =============================================
    // 3. CORE POPUP LOGIC (DO NOT EDIT)
    // =============================================
    
    // Holds the current state of the popup
    const state = {
        currentIndex: 0,
        autoSlideInterval: null,
        typeWriterTimeout: null,
        elements: {}
    };

    function init() {
        // Inject HTML and CSS into the page
        document.body.insertAdjacentHTML('beforeend', generatePopupHTML(POPUP_CONFIG));
        const baseStyle = document.createElement('style');
        baseStyle.textContent = generateBaseCSS(POPUP_CONFIG);
        document.head.appendChild(baseStyle);

        // Store references to DOM elements
        state.elements = {
            popup: document.getElementById(POPUP_CONFIG.baseName),
            content: document.querySelector(`.${POPUP_CONFIG.baseName}-content`),
            closeBtn: document.querySelector(`.${POPUP_CONFIG.baseName}-btn-close`),
            carouselItems: document.querySelectorAll(`.${POPUP_CONFIG.baseName}-carousel-item`),
            prevBtn: document.querySelector(`.${POPUP_CONFIG.baseName}-prev`),
            nextBtn: document.querySelector(`.${POPUP_CONFIG.baseName}-next`),
            indicatorsContainer: document.querySelector(`.${POPUP_CONFIG.baseName}-carousel-indicators`)
        };
        
        applyNextTheme();
        createIndicators();
        bindEventListeners();
        
        setTimeout(showPopup, POPUP_CONFIG.settings.initialDelay);
    }

    function applyNextTheme() {
        const themeKeys = Object.keys(POPUP_CONFIG.themes);
        const lastTheme = localStorage.getItem('rxPopupTheme');
        const currentIndex = lastTheme ? themeKeys.indexOf(lastTheme) : -1;
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        const nextThemeName = themeKeys[nextIndex];
        
        const theme = POPUP_CONFIG.themes[nextThemeName];
        const themeStyle = document.createElement('style');
        themeStyle.id = 'rx-popup-theme-style';
        themeStyle.textContent = generateThemeCSS(theme, POPUP_CONFIG);

        const existingStyle = document.getElementById('rx-popup-theme-style');
        if (existingStyle) document.head.removeChild(existingStyle);
        
        document.head.appendChild(themeStyle);
        localStorage.setItem('rxPopupTheme', nextThemeName);
    }

    function typeWriter(element, text, speed, callback) {
        let i = 0;
        element.innerHTML = "";
        element.classList.remove('typing-done');
        clearTimeout(state.typeWriterTimeout);

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                state.typeWriterTimeout = setTimeout(type, speed);
            } else {
                element.classList.add('typing-done');
                if (callback) callback();
            }
        }
        type();
    }

    function showPopup() {
        state.elements.popup.classList.add("show");
        updateCarousel(); // To trigger the first slide's animation
    }

    function closePopup() {
        state.elements.popup.classList.remove("show");
        stopAutoSlide();
        
        // Reset typing animation state after closing
        clearTimeout(state.typeWriterTimeout);
        state.elements.content.classList.remove('typing-complete');
        const currentTextElement = state.elements.carouselItems[state.currentIndex]?.querySelector(`.${POPUP_CONFIG.baseName}-typing-text`);
        if (currentTextElement) {
            currentTextElement.innerHTML = "";
            currentTextElement.classList.remove('typing-done');
        }
    }

    function updateCarousel() {
        state.elements.carouselItems.forEach((item, index) => {
            item.classList.toggle("active", index === state.currentIndex);
        });

        const indicators = state.elements.indicatorsContainer.children;
        Array.from(indicators).forEach((indicator, index) => {
            indicator.classList.toggle("active", index === state.currentIndex);
        });

        // Handle typing animation for the current slide
        state.elements.content.classList.remove('typing-complete');
        const textElement = state.elements.carouselItems[state.currentIndex].querySelector(`.${POPUP_CONFIG.baseName}-typing-text`);
        const fullText = textElement.dataset.text;
        
        typeWriter(textElement, fullText, POPUP_CONFIG.settings.typingSpeed, () => {
            state.elements.content.classList.add('typing-complete');
            const galleryImages = state.elements.carouselItems[state.currentIndex].querySelectorAll(`.${POPUP_CONFIG.baseName}-gallery img`);
            galleryImages.forEach((img, i) => img.style.setProperty('--order', i));
            resetAutoSlide();
        });
    }

    function createIndicators() {
        state.elements.carouselItems.forEach((_, index) => {
            const indicator = document.createElement("span");
            indicator.addEventListener('click', () => goToSlide(index));
            state.elements.indicatorsContainer.appendChild(indicator);
        });
    }

    function goToSlide(index) {
        const total = state.elements.carouselItems.length;
        state.currentIndex = (index + total) % total;
        updateCarousel();
    }

    function nextSlide() { goToSlide(state.currentIndex + 1); }
    function prevSlide() { goToSlide(state.currentIndex - 1); }

    function startAutoSlide() {
        if (!state.autoSlideInterval) {
            state.autoSlideInterval = setInterval(nextSlide, POPUP_CONFIG.settings.slideDuration);
        }
    }

    function stopAutoSlide() {
        clearInterval(state.autoSlideInterval);
        state.autoSlideInterval = null;
    }

    function resetAutoSlide() {
        stopAutoSlide();
        if (state.elements.carouselItems.length > 1) {
            startAutoSlide();
        }
    }
    
    function bindEventListeners() {
        state.elements.closeBtn.addEventListener("click", closePopup);
        state.elements.prevBtn.addEventListener("click", prevSlide);
        state.elements.nextBtn.addEventListener("click", nextSlide);

        document.addEventListener("keydown", (e) => {
            if (state.elements.popup.classList.contains("show")) {
                if (e.key === "Escape") closePopup();
                else if (e.key === "ArrowLeft") prevSlide();
                else if (e.key === "ArrowRight") nextSlide();
            }
        });
    }

    // =============================================
    // 4. INITIALIZATION
    // =============================================
    init();

});