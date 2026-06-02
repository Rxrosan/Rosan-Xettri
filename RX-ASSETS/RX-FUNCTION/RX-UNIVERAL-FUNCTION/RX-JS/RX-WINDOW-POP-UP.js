// RX-POP-UP-WINDOW-ENHANCED.js - Close Button Always Visible
document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. CENTRALIZED CONFIGURATION (EDIT THIS SECTION)
    // =============================================
    const POPUP_CONFIG = {
        baseName: "RX_MODULAR_POPUP",

        slides: [
            {
                title: "Welcome",
                text: "Hi, I'm Rosan Xettri, a passionate web designer dedicated to creating stunning and user-friendly websites. Let's build something amazing together!",
                galleryImages: ["RX-ASSETS/RX-IMAGE/RX-BANNER/B-5.gif"]
            },
        ],

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

        settings: {
            initialDelay: 1,
            slideDuration: 3000,
            typingSpeed: 40,
            swipeThreshold: 50,
            swipeMaxTime: 300,
            doubleTapDelay: 300
        }
    };


    // =============================================
    // 2. DYNAMIC HTML & CSS GENERATORS
    // =============================================
    
    function generatePopupHTML(config) {
        const carouselItemsHTML = config.slides.map((slide, slideIndex) => `
            <div class="${config.baseName}-carousel-item" data-slide-index="${slideIndex}">
                <h2>${escapeHtml(slide.title)}</h2>
                <div class="${config.baseName}-scroll-content">
                    <p class="${config.baseName}-typing-text" data-fulltext="${escapeHtml(slide.text)}"></p>
                    <div class="${config.baseName}-gallery">
                        ${slide.galleryImages.map(imgSrc => `<img src="${escapeHtml(imgSrc)}" alt="Gallery Image" loading="lazy">`).join('')}
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
                    <div class="${config.baseName}-carousel-indicators"></div>
                </div>
            </div>
        `;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function generateBaseCSS(config) {
        const base = `#${config.baseName}`;
        const content = `.${config.baseName}-content`;
        const item = `.${config.baseName}-carousel-item`;
        
        return `
            ${base} { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(5, 0, 15, 0.8); backdrop-filter: blur(25px) saturate(180%); z-index: 9999; display: flex; justify-content: center; align-items: center; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s; cursor: default; }
            ${base} * { cursor: default; }
            ${base}::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; transition: all 1s ease; z-index: -1; }
            ${base}.show { opacity: 1; visibility: visible; }
            ${content} { position: relative; width: 90%; max-width: 750px; border-radius: 28px; padding: 45px; transform: translateY(0) scale(1); opacity: 1; transition: none; max-height: 90vh; overflow: hidden; z-index: 1; touch-action: pan-y pinch-zoom; cursor: default; }
            .${config.baseName}-gallery { opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s; }
            /* Close button always visible - removed from condition */
            .${config.baseName}-btn-close { opacity: 1; visibility: visible; transition: all 0.3s ease; }
            ${content}.typing-complete .${config.baseName}-gallery { opacity: 1; visibility: visible; }
            .${config.baseName}-typing-text::after { content: '|'; font-weight: 200; animation: blink-caret-anim 0.75s step-end infinite; color: rgba(255, 255, 255, 0.7); }
            .${config.baseName}-typing-text.typing-done::after { content: ''; }
            @keyframes blink-caret-anim { from, to { color: transparent; } 50% { color: rgba(255, 255, 255, 0.7); } }
            ${item} { display: none; }
            ${item}.active { display: block; }
            .${config.baseName}-scroll-content { max-height: 65vh; overflow-y: auto; padding-right: 15px; scrollbar-width: thin; scrollbar-color: rgba(180, 140, 255, 0.6) transparent; cursor: default; }
            .${config.baseName}-scroll-content::-webkit-scrollbar { width: 6px; } .${config.baseName}-scroll-content::-webkit-scrollbar-track { background: transparent; } .${config.baseName}-scroll-content::-webkit-scrollbar-thumb { border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.2); }
            ${content} h2 { font-size: 32px; margin-bottom: 30px; text-align: center; font-weight: 600; position: relative; display: inline-block; padding: 0 30px; letter-spacing: 1px; cursor: default; }
            ${content} h2::before { content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 80px; height: 3px; border-radius: 3px; }
            ${content} p { color: rgba(255, 255, 255, 0.9); line-height: 1.8; margin: 25px 0; font-size: 17px; text-align: center; text-shadow: 0 1px 3px rgba(0,0,0,0.3); min-height: 100px; cursor: default; }
            .${config.baseName}-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 25px; margin: 35px 0; }
            .${config.baseName}-gallery img { width: 100%; height: 100%; object-fit: cover; border-radius: 14px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(255,255,255,0.08); background: rgba(255,255,255,0.05); backdrop-filter: blur(8px); opacity: 0; transform: translateY(20px); transition: all 0.3s ease; }
            .${config.baseName}-gallery img:hover { transform: scale(1.05); z-index: 2; cursor: pointer; }
            ${content}.typing-complete ${item}.active .${config.baseName}-gallery img { animation: fadeUp-anim 0.4s forwards; animation-delay: calc(var(--order) * 0.1s); }
            .${config.baseName}-btn-close { position: absolute; top: 30px; right: 30px; width: 50px; height: 50px; background: rgba(255, 255, 255, 0.15); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(8px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.15); z-index: 20; }
            .${config.baseName}-btn-close:hover { transform: rotate(90deg) scale(1.15); cursor: pointer; background: rgba(255, 255, 255, 0.25); }
            .${config.baseName}-btn-close svg { width: 24px; height: 24px; stroke: currentColor; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); cursor: pointer; }
            .${config.baseName}-carousel-indicators { display: flex; justify-content: center; gap: 15px; margin-top: 30px; }
            .${config.baseName}-carousel-indicators span { display: block; width: 12px; height: 12px; background: rgba(255, 255, 255, 0.25); border-radius: 50%; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); }
            .${config.baseName}-carousel-indicators span.active { transform: scale(1.5); background: rgba(255,255,255,0.6); }
            .${config.baseName}-carousel-indicators span:hover { transform: scale(1.2); cursor: pointer; }
            @keyframes fadeUp-anim { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            @media (max-width: 768px) { ${content} { width: 95%; padding: 35px; } .${config.baseName}-scroll-content { max-height: 60vh; } .${config.baseName}-gallery { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; } ${content} h2 { font-size: 28px; } .${config.baseName}-btn-close { width: 45px; height: 45px; top: 20px; right: 20px; } }
            @media (max-width: 480px) { ${content} { padding: 30px 25px; border-radius: 24px; } ${content} h2 { font-size: 26px; margin-bottom: 25px; } .${config.baseName}-btn-close { width: 40px; height: 40px; top: 15px; right: 15px; } }
        `;
    }

    function generateThemeCSS(theme, config) {
        return `
            #${config.baseName}::before { background: ${theme.lightEffect}; opacity: 0.8; }
            .${config.baseName}-content { background: ${theme.bgGradient}; backdrop-filter: blur(20px) saturate(200%); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 0 30px rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.12); }
            .${config.baseName}-content h2 { color: rgba(255,255,255,0.95); text-shadow: 0 2px 12px ${theme.primary.replace('0.4', '0.3')}, 0 0 20px ${theme.shineColor}; }
            .${config.baseName}-content h2::before { background: linear-gradient(90deg, transparent, ${theme.primary}, transparent); height: 3px; opacity: 0.8; box-shadow: 0 0 15px ${theme.primary}; }
            .${config.baseName}-gallery img:hover { box-shadow: 0 12px 30px ${theme.primary.replace('0.4', '0.2')}, inset 0 0 15px rgba(255,255,255,0.1); border: 1px solid ${theme.primary.replace('0.4', '0.3')}; filter: brightness(1.1) saturate(1.2); }
            .${config.baseName}-btn-close:hover { background: ${theme.secondary.replace('0.3', '0.25')}; box-shadow: 0 8px 25px ${theme.secondary.replace('0.3', '0.2')}; }
            .${config.baseName}-carousel-indicators span.active { background: ${theme.primary}; box-shadow: 0 0 15px ${theme.primary}; }
        `;
    }

    // =============================================
    // 3. SIMPLE TYPING FUNCTION
    // =============================================
    
    let currentTypingTimeout = null;
    let currentTypingElement = null;
    let currentTypingProgress = 0;
    let currentTypingFullText = '';
    let slideProgress = [];
    let slideCompleted = [];

    function startTyping(element, fullText, progress, onComplete) {
        if (currentTypingTimeout) {
            clearTimeout(currentTypingTimeout);
            currentTypingTimeout = null;
        }
        
        currentTypingElement = element;
        currentTypingFullText = fullText;
        currentTypingProgress = progress;
        
        element.textContent = fullText.substring(0, progress);
        element.classList.remove('typing-done');
        
        if (progress >= fullText.length) {
            element.classList.add('typing-done');
            if (onComplete) onComplete();
            return;
        }
        
        function typeNext() {
            if (currentTypingProgress < currentTypingFullText.length) {
                currentTypingProgress++;
                currentTypingElement.textContent = currentTypingFullText.substring(0, currentTypingProgress);
                
                const char = currentTypingFullText.charAt(currentTypingProgress - 1);
                let delay = 40;
                if (char === '.' || char === '!' || char === '?') delay = 200;
                else if (char === ',' || char === ';') delay = 120;
                else if (char === ' ') delay = 60;
                else delay = 40 + Math.random() * 30;
                
                currentTypingTimeout = setTimeout(typeNext, delay);
            } else {
                currentTypingElement.classList.add('typing-done');
                currentTypingTimeout = null;
                if (onComplete) onComplete();
            }
        }
        
        typeNext();
    }
    
    function stopTyping() {
        if (currentTypingTimeout) {
            clearTimeout(currentTypingTimeout);
            currentTypingTimeout = null;
        }
    }

    // =============================================
    // 4. CORE POPUP LOGIC (INSTANT RESPONSE)
    // =============================================
    
    const state = {
        currentIndex: 0,
        isPaused: false,
        elements: {}
    };

    let rotateTimeout = null;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwiping = false;
    let touchMoved = false;

    let lastTapTime = 0;
    let tapTimeoutId = null;

    function init() {
        document.body.insertAdjacentHTML('beforeend', generatePopupHTML(POPUP_CONFIG));
        const baseStyle = document.createElement('style');
        baseStyle.textContent = generateBaseCSS(POPUP_CONFIG);
        document.head.appendChild(baseStyle);

        state.elements = {
            popup: document.getElementById(POPUP_CONFIG.baseName),
            content: document.querySelector(`.${POPUP_CONFIG.baseName}-content`),
            closeBtn: document.querySelector(`.${POPUP_CONFIG.baseName}-btn-close`),
            carouselItems: document.querySelectorAll(`.${POPUP_CONFIG.baseName}-carousel-item`),
            indicatorsContainer: document.querySelector(`.${POPUP_CONFIG.baseName}-carousel-indicators`),
        };
        
        state.elements.carouselItems.forEach((item, index) => {
            const textElement = item.querySelector(`.${POPUP_CONFIG.baseName}-typing-text`);
            const fullText = textElement.getAttribute('data-fulltext') || '';
            slideProgress[index] = 0;
            slideCompleted[index] = false;
        });
        
        applyNextTheme();
        createIndicators();
        bindEventListeners();
        initGestures();
        
        setTimeout(() => {
            state.elements.popup.classList.add("show");
            state.currentIndex = 0;
            updateCarouselDisplay();
            loadSlide(0);
        }, POPUP_CONFIG.settings.initialDelay);
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

    function loadSlide(index, fromResume = false) {
        const slide = state.elements.carouselItems[index];
        if (!slide) return;
        
        const textElement = slide.querySelector(`.${POPUP_CONFIG.baseName}-typing-text`);
        const fullText = textElement.getAttribute('data-fulltext') || '';
        
        stopTyping();
        if (currentTypingElement && !fromResume) {
            slideProgress[state.currentIndex] = currentTypingProgress;
            slideCompleted[state.currentIndex] = currentTypingProgress >= (currentTypingFullText?.length || 0);
        }
        
        if (rotateTimeout) {
            clearTimeout(rotateTimeout);
            rotateTimeout = null;
        }
        
        state.elements.content.classList.remove('typing-complete');
        
        const savedProgress = slideProgress[index] || 0;
        const wasCompleted = slideCompleted[index] || false;
        
        if (wasCompleted && savedProgress >= fullText.length) {
            textElement.textContent = fullText;
            textElement.classList.add('typing-done');
            state.elements.content.classList.add('typing-complete');
            
            const galleryImages = slide.querySelectorAll(`.${POPUP_CONFIG.baseName}-gallery img`);
            galleryImages.forEach((img, i) => img.style.setProperty('--order', i));
            
            if (!state.isPaused) {
                rotateTimeout = setTimeout(() => {
                    if (!state.isPaused) {
                        nextSlide();
                    }
                    rotateTimeout = null;
                }, POPUP_CONFIG.settings.slideDuration);
            }
        } else {
            startTyping(textElement, fullText, savedProgress, () => {
                slideCompleted[index] = true;
                slideProgress[index] = fullText.length;
                state.elements.content.classList.add('typing-complete');
                
                const galleryImages = slide.querySelectorAll(`.${POPUP_CONFIG.baseName}-gallery img`);
                galleryImages.forEach((img, i) => img.style.setProperty('--order', i));
                
                if (!state.isPaused) {
                    rotateTimeout = setTimeout(() => {
                        if (!state.isPaused) {
                            nextSlide();
                        }
                        rotateTimeout = null;
                    }, POPUP_CONFIG.settings.slideDuration);
                }
            });
        }
    }

    function updateCarouselDisplay() {
        state.elements.carouselItems.forEach((item, index) => {
            if (index === state.currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const indicators = state.elements.indicatorsContainer.children;
        Array.from(indicators).forEach((indicator, index) => {
            if (index === state.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    function createIndicators() {
        state.elements.carouselItems.forEach((_, index) => {
            const indicator = document.createElement("span");
            indicator.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!state.isPaused && index !== state.currentIndex) {
                    goToSlide(index);
                }
            });
            state.elements.indicatorsContainer.appendChild(indicator);
        });
    }

    function goToSlide(index) {
        const total = state.elements.carouselItems.length;
        const newIndex = (index + total) % total;
        
        if (newIndex === state.currentIndex) return;
        
        if (currentTypingElement) {
            slideProgress[state.currentIndex] = currentTypingProgress;
            slideCompleted[state.currentIndex] = currentTypingProgress >= (currentTypingFullText?.length || 0);
        }
        stopTyping();
        
        if (rotateTimeout) {
            clearTimeout(rotateTimeout);
            rotateTimeout = null;
        }
        
        state.currentIndex = newIndex;
        updateCarouselDisplay();
        loadSlide(state.currentIndex);
    }

    function nextSlide() { 
        if (!state.isPaused) {
            goToSlide(state.currentIndex + 1);
        }
    }
    
    function prevSlide() { 
        if (!state.isPaused) {
            goToSlide(state.currentIndex - 1);
        }
    }

    function pauseAutoSlide() {
        if (!state.isPaused) {
            state.isPaused = true;
            if (currentTypingElement) {
                stopTyping();
                slideProgress[state.currentIndex] = currentTypingProgress;
                slideCompleted[state.currentIndex] = currentTypingProgress >= (currentTypingFullText?.length || 0);
            }
            if (rotateTimeout) {
                clearTimeout(rotateTimeout);
                rotateTimeout = null;
            }
        }
    }
    
    function resumeAutoSlide() {
        if (state.isPaused) {
            state.isPaused = false;
            
            const slide = state.elements.carouselItems[state.currentIndex];
            const textElement = slide.querySelector(`.${POPUP_CONFIG.baseName}-typing-text`);
            const fullText = textElement.getAttribute('data-fulltext') || '';
            const savedProgress = slideProgress[state.currentIndex] || 0;
            const wasCompleted = slideCompleted[state.currentIndex] || false;
            
            if (wasCompleted || savedProgress >= fullText.length) {
                if (rotateTimeout) clearTimeout(rotateTimeout);
                rotateTimeout = setTimeout(() => {
                    if (!state.isPaused) {
                        nextSlide();
                    }
                    rotateTimeout = null;
                }, POPUP_CONFIG.settings.slideDuration);
            } else {
                loadSlide(state.currentIndex, true);
            }
        }
    }
    
    function togglePause() {
        if (state.isPaused) {
            resumeAutoSlide();
        } else {
            pauseAutoSlide();
        }
    }

    function handleDoubleTap() {
        togglePause();
    }
    
    function handleTapInteraction(event) {
        const currentTime = new Date().getTime();
        const tapInterval = currentTime - lastTapTime;
        
        if (tapTimeoutId) {
            clearTimeout(tapTimeoutId);
            tapTimeoutId = null;
        }
        
        if (tapInterval < POPUP_CONFIG.settings.doubleTapDelay && tapInterval > 0 && lastTapTime !== 0) {
            lastTapTime = 0;
            handleDoubleTap();
            event.preventDefault();
            return true;
        } else {
            lastTapTime = currentTime;
            tapTimeoutId = setTimeout(() => {
                lastTapTime = 0;
                tapTimeoutId = null;
            }, POPUP_CONFIG.settings.doubleTapDelay);
            return false;
        }
    }
    
    function handleTouchStart(event) {
        if (!state.elements.popup.classList.contains("show")) return;
        
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        isSwiping = true;
        touchMoved = false;
    }
    
    function handleTouchMove(event) {
        if (!isSwiping || !state.elements.popup.classList.contains("show")) return;
        
        const touch = event.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
            touchMoved = true;
            event.preventDefault();
        }
    }
    
    function handleTouchEnd(event) {
        if (!state.elements.popup.classList.contains("show")) {
            isSwiping = false;
            return;
        }
        
        if (!touchMoved) {
            handleTapInteraction(event);
            isSwiping = false;
            touchStartX = 0;
            touchStartY = 0;
            return;
        }
        
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndTime = Date.now();
        const deltaX = touchEndX - touchStartX;
        const deltaTime = touchEndTime - touchStartTime;
        
        if (Math.abs(deltaX) >= POPUP_CONFIG.settings.swipeThreshold && 
            deltaTime <= POPUP_CONFIG.settings.swipeMaxTime &&
            !state.isPaused) {
            
            if (deltaX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
        
        isSwiping = false;
        touchStartX = 0;
        touchStartY = 0;
        touchMoved = false;
    }
    
    let lastClickTime = 0;
    let clickTimeoutId = null;
    
    function handleClickInteraction(event) {
        const currentTime = new Date().getTime();
        const clickInterval = currentTime - lastClickTime;
        
        if (clickTimeoutId) {
            clearTimeout(clickTimeoutId);
            clickTimeoutId = null;
        }
        
        if (clickInterval < POPUP_CONFIG.settings.doubleTapDelay && clickInterval > 0 && lastClickTime !== 0) {
            lastClickTime = 0;
            togglePause();
            event.preventDefault();
            return true;
        } else {
            lastClickTime = currentTime;
            clickTimeoutId = setTimeout(() => {
                lastClickTime = 0;
                clickTimeoutId = null;
            }, POPUP_CONFIG.settings.doubleTapDelay);
            return false;
        }
    }
    
    function handleContentClick(event) {
        if (state.elements.popup.classList.contains("show")) {
            if (event.target.closest(`.${POPUP_CONFIG.baseName}-btn-close`)) return;
            if (event.target.closest(`.${POPUP_CONFIG.baseName}-carousel-indicators`)) return;
            if (event.target.closest(`.${POPUP_CONFIG.baseName}-gallery img`)) return;
            handleClickInteraction(event);
        }
    }
    
    function initGestures() {
        const container = state.elements.content;
        
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);
        container.addEventListener('click', handleContentClick);
        container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }
    
    function bindEventListeners() {
        state.elements.closeBtn.addEventListener("click", () => {
            state.elements.popup.classList.remove("show");
            stopTyping();
            state.isPaused = false;
            if (rotateTimeout) {
                clearTimeout(rotateTimeout);
                rotateTimeout = null;
            }
        });

        document.addEventListener("keydown", (e) => {
            if (state.elements.popup.classList.contains("show")) {
                if (e.key === "Escape") {
                    state.elements.popup.classList.remove("show");
                    stopTyping();
                    state.isPaused = false;
                    if (rotateTimeout) {
                        clearTimeout(rotateTimeout);
                        rotateTimeout = null;
                    }
                } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    if (!state.isPaused) prevSlide();
                } else if (e.key === "ArrowRight") {
                    e.preventDefault();
                    if (!state.isPaused) nextSlide();
                } else if (e.key === " " || e.key === "Spacebar" || e.key === "Space") {
                    e.preventDefault();
                    togglePause();
                }
            }
        });
    }

    // =============================================
    // 5. INITIALIZATION
    // =============================================
    init();

});