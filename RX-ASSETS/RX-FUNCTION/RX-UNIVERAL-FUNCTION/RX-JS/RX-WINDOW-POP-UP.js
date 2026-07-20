// RX-POP-UP-WINDOW-ENHANCED.js - Outside Click Disabled & Refresh State Persistence Included
document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. CENTRALIZED CONFIGURATION
    // =============================================
    const POPUP_CONFIG = {
        baseName: "RX_MODULAR_POPUP",

        slides: [
            {
                title: "Welcome",
                text: "Hi, I'm Rosan Xettri, a passionate web designer dedicated to creating stunning and user-friendly websites. Let's build something amazing together!",
                galleryImages: [
                    {
                        url: "RX-ASSETS/RX-IMAGE/RX-BANNER/B-5.gif",
                        title: "Banner Animation B-5",
                        desc: "High quality interactive GIF banner crafted for modern responsive web design templates."
                    }
                ]
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
                        ${slide.galleryImages.map((img) => {
                            const imgUrl = typeof img === 'object' ? img.url : img;
                            const imgTitle = typeof img === 'object' ? (img.title || 'Image Detail') : 'Image Detail';
                            const imgDesc = typeof img === 'object' ? (img.desc || 'No description available.') : '';
                            return `<img src="${escapeHtml(imgUrl)}" 
                                         data-title="${escapeHtml(imgTitle)}" 
                                         data-desc="${escapeHtml(imgDesc)}" 
                                         alt="Gallery Image" 
                                         loading="lazy">`;
                        }).join('')}
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

            <!-- LIGHTBOX MODAL -->
            <div id="${config.baseName}-lightbox" class="${config.baseName}-lightbox">
                <button class="${config.baseName}-lightbox-close" aria-label="Close lightbox">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <div class="${config.baseName}-lightbox-container">
                    <div class="${config.baseName}-lightbox-left">
                        <img id="${config.baseName}-lightbox-img" src="" alt="Maximized Image">
                    </div>
                    <div class="${config.baseName}-lightbox-right">
                        <h3 id="${config.baseName}-lightbox-title">Image Details</h3>
                        <p id="${config.baseName}-lightbox-desc">Detailed info about this item.</p>
                        <div class="${config.baseName}-lightbox-actions">
                            <button id="${config.baseName}-btn-download" class="${config.baseName}-action-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                Download
                            </button>
                            <button id="${config.baseName}-btn-share" class="${config.baseName}-action-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                                Share Link
                            </button>
                        </div>
                        <span id="${config.baseName}-toast-msg" class="${config.baseName}-toast">Link copied to clipboard!</span>
                    </div>
                </div>
            </div>
        `;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, function(m) {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return map[m];
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
            .${config.baseName}-gallery img { width: 100%; height: 100%; object-fit: cover; border-radius: 14px; cursor: pointer !important; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(255,255,255,0.08); background: rgba(255,255,255,0.05); backdrop-filter: blur(8px); opacity: 0; transform: translateY(20px); transition: all 0.3s ease; user-select: none; }
            .${config.baseName}-gallery img:hover { transform: scale(1.05); z-index: 2; cursor: pointer !important; }
            ${content}.typing-complete ${item}.active .${config.baseName}-gallery img { animation: fadeUp-anim 0.4s forwards; animation-delay: calc(var(--order) * 0.1s); }
            
            /* CLOSE BUTTON */
            .${config.baseName}-btn-close { position: absolute; top: 30px; right: 30px; width: 50px; height: 50px; background: rgba(255, 255, 255, 0.15); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer !important; backdrop-filter: blur(8px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.15); z-index: 20; opacity: 1; visibility: visible; transition: background 0.3s ease; }
            .${config.baseName}-btn-close:hover { cursor: pointer !important; background: rgba(255, 255, 255, 0.25); }
            .${config.baseName}-btn-close svg, .${config.baseName}-btn-close path { width: 24px; height: 24px; stroke: currentColor; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); cursor: pointer !important; }
            
            .${config.baseName}-carousel-indicators { display: flex; justify-content: center; gap: 15px; margin-top: 30px; }
            .${config.baseName}-carousel-indicators span { display: block; width: 12px; height: 12px; background: rgba(255, 255, 255, 0.25); border-radius: 50%; cursor: pointer !important; transition: all 0.2s ease; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); }
            .${config.baseName}-carousel-indicators span.active { transform: scale(1.5); background: rgba(255,255,255,0.6); }
            .${config.baseName}-carousel-indicators span:hover { transform: scale(1.2); cursor: pointer !important; }
            @keyframes fadeUp-anim { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            
            /* LIGHTBOX SYSTEM CSS */
            .${config.baseName}-lightbox { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(15px); z-index: 10000; display: flex; justify-content: center; align-items: center; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s; }
            .${config.baseName}-lightbox.show { opacity: 1; visibility: visible; }
            .${config.baseName}-lightbox-close { position: absolute; top: 25px; right: 25px; width: 45px; height: 45px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer !important; z-index: 10001; transition: background 0.2s; }
            .${config.baseName}-lightbox-close:hover { background: rgba(255,255,255,0.3); }
            .${config.baseName}-lightbox-container { display: flex; width: 90%; max-width: 1100px; max-height: 85vh; background: rgba(20, 20, 30, 0.85); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
            .${config.baseName}-lightbox-left { flex: 1.5; background: #000; display: flex; align-items: center; justify-content: center; padding: 20px; overflow: hidden; }
            .${config.baseName}-lightbox-left img { max-width: 100%; max-height: 75vh; object-fit: contain; border-radius: 10px; }
            .${config.baseName}-lightbox-right { flex: 1; padding: 40px 30px; display: flex; flex-direction: column; justify-content: center; color: #fff; border-left: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255,255,255,0.02); }
            .${config.baseName}-lightbox-right h3 { font-size: 24px; margin-bottom: 15px; color: #fff; text-align: left; }
            .${config.baseName}-lightbox-right p { font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 30px; text-align: left; min-height: auto; }
            .${config.baseName}-lightbox-actions { display: flex; gap: 15px; flex-wrap: wrap; }
            .${config.baseName}-action-btn { display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2); padding: 12px 20px; border-radius: 30px; color: #fff; font-size: 14px; font-weight: 500; cursor: pointer !important; transition: all 0.2s; }
            .${config.baseName}-action-btn:hover { background: rgba(255, 255, 255, 0.25); transform: translateY(-2px); }
            .${config.baseName}-action-btn svg { cursor: pointer !important; }
            .${config.baseName}-toast { margin-top: 15px; font-size: 13px; color: #4EED97; opacity: 0; transition: opacity 0.3s; }
            .${config.baseName}-toast.show { opacity: 1; }

            @media (max-width: 768px) { 
                ${content} { width: 95%; padding: 35px; } 
                .${config.baseName}-scroll-content { max-height: 60vh; } 
                .${config.baseName}-gallery { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; } 
                ${content} h2 { font-size: 28px; } 
                .${config.baseName}-btn-close { width: 45px; height: 45px; top: 20px; right: 20px; } 
                .${config.baseName}-lightbox-container { flex-direction: column; max-height: 90vh; overflow-y: auto; }
                .${config.baseName}-lightbox-left { flex: none; height: 50vh; }
                .${config.baseName}-lightbox-right { padding: 25px; }
            }
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
            .${config.baseName}-btn-close:hover { background: ${theme.secondary.replace('0.3', '0.25')}; }
            .${config.baseName}-carousel-indicators span.active { background: ${theme.primary}; box-shadow: 0 0 15px ${theme.primary}; }
        `;
    }

    // =============================================
    // 3. DYNAMIC TYPING FUNCTION
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
                const baseSpeed = POPUP_CONFIG.settings.typingSpeed || 40;
                let delay = baseSpeed;

                if (char === '.' || char === '!' || char === '?') {
                    delay = baseSpeed * 5;
                } else if (char === ',' || char === ';') {
                    delay = baseSpeed * 3;
                } else if (char === ' ') {
                    delay = baseSpeed * 1.5;
                } else {
                    delay = baseSpeed + (Math.random() * (baseSpeed * 0.75));
                }
                
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
    // 4. CORE POPUP LOGIC
    // =============================================
    const state = {
        currentIndex: 0,
        isPaused: false,
        elements: {},
        currentActiveImgUrl: ''
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
        
        if (!document.getElementById(`${POPUP_CONFIG.baseName}-base-style`)) {
            const baseStyle = document.createElement('style');
            baseStyle.id = `${POPUP_CONFIG.baseName}-base-style`;
            baseStyle.textContent = generateBaseCSS(POPUP_CONFIG);
            document.head.appendChild(baseStyle);
        }

        state.elements = {
            popup: document.getElementById(POPUP_CONFIG.baseName),
            content: document.querySelector(`.${POPUP_CONFIG.baseName}-content`),
            closeBtn: document.querySelector(`.${POPUP_CONFIG.baseName}-btn-close`),
            carouselItems: document.querySelectorAll(`.${POPUP_CONFIG.baseName}-carousel-item`),
            indicatorsContainer: document.querySelector(`.${POPUP_CONFIG.baseName}-carousel-indicators`),
            lightbox: document.getElementById(`${POPUP_CONFIG.baseName}-lightbox`),
            lightboxImg: document.getElementById(`${POPUP_CONFIG.baseName}-lightbox-img`),
            lightboxTitle: document.getElementById(`${POPUP_CONFIG.baseName}-lightbox-title`),
            lightboxDesc: document.getElementById(`${POPUP_CONFIG.baseName}-lightbox-desc`),
            lightboxClose: document.querySelector(`.${POPUP_CONFIG.baseName}-lightbox-close`),
            btnDownload: document.getElementById(`${POPUP_CONFIG.baseName}-btn-download`),
            btnShare: document.getElementById(`${POPUP_CONFIG.baseName}-btn-share`),
            toast: document.getElementById(`${POPUP_CONFIG.baseName}-toast-msg`)
        };
        
        state.elements.carouselItems.forEach((item, index) => {
            slideProgress[index] = 0;
            slideCompleted[index] = false;
        });
        
        applyNextTheme();
        createIndicators();
        bindEventListeners();
        initGestures();
        initGalleryEvents();
        
        setTimeout(() => {
            // REFRESH STATE CHECK (Keep open if previously open)
            const isPopupDismissed = localStorage.getItem('rxPopupClosed');
            const savedLightboxImg = localStorage.getItem('rxLightboxOpenImg');

            // URL Params Check
            const urlParams = new URLSearchParams(window.location.search);
            const targetSlide = parseInt(urlParams.get('popupSlide'), 10);
            const targetImg = urlParams.get('popupImg');

            if (!isPopupDismissed || targetSlide || targetImg || savedLightboxImg) {
                state.elements.popup.classList.add("show");
            }

            if (!isNaN(targetSlide) && targetSlide >= 0 && targetSlide < POPUP_CONFIG.slides.length) {
                state.currentIndex = targetSlide;
            } else {
                state.currentIndex = 0;
            }

            updateCarouselDisplay();
            loadSlide(state.currentIndex);

            // AUTO OPEN LIGHTBOX ON REFRESH OR VIA SHARED LINK
            const activeImg = targetImg || savedLightboxImg;
            if (activeImg) {
                setTimeout(() => {
                    const matchedImg = document.querySelector(`.${POPUP_CONFIG.baseName}-gallery img[src="${activeImg}"]`);
                    if (matchedImg) {
                        openLightbox(matchedImg);
                    } else {
                        state.currentActiveImgUrl = activeImg;
                        state.elements.lightboxImg.src = activeImg;
                        state.elements.lightboxTitle.textContent = localStorage.getItem('rxLightboxTitle') || 'Image Preview';
                        state.elements.lightboxDesc.textContent = localStorage.getItem('rxLightboxDesc') || 'No description available.';
                        state.elements.lightbox.classList.add('show');
                        pauseAutoSlide();
                    }
                }, 400);
            }
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
                    if (!state.isPaused) nextSlide();
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
                        if (!state.isPaused) nextSlide();
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
        if (!state.isPaused) goToSlide(state.currentIndex + 1);
    }
    
    function prevSlide() { 
        if (!state.isPaused) goToSlide(state.currentIndex - 1);
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
                    if (!state.isPaused) nextSlide();
                    rotateTimeout = null;
                }, POPUP_CONFIG.settings.slideDuration);
            } else {
                loadSlide(state.currentIndex, true);
            }
        }
    }
    
    function togglePause() {
        if (state.isPaused) resumeAutoSlide();
        else pauseAutoSlide();
    }

    // =============================================
    // 5. LIGHTBOX & FORCE DOWNLOAD / SHARE
    // =============================================
    function openLightbox(imgElement) {
        pauseAutoSlide();
        const src = imgElement.getAttribute('src');
        const title = imgElement.getAttribute('data-title') || 'Image Preview';
        const desc = imgElement.getAttribute('data-desc') || 'No description available for this image.';

        state.currentActiveImgUrl = src;
        state.elements.lightboxImg.src = src;
        state.elements.lightboxTitle.textContent = title;
        state.elements.lightboxDesc.textContent = desc;
        
        // SAVE LIGHTBOX STATE FOR REFRESH
        localStorage.setItem('rxLightboxOpenImg', src);
        localStorage.setItem('rxLightboxTitle', title);
        localStorage.setItem('rxLightboxDesc', desc);

        state.elements.lightbox.classList.add('show');
    }

    function closeLightbox() {
        state.elements.lightbox.classList.remove('show');
        localStorage.removeItem('rxLightboxOpenImg');
        localStorage.removeItem('rxLightboxTitle');
        localStorage.removeItem('rxLightboxDesc');
        resumeAutoSlide();
    }

    // DOWNLOAD FUNCTION WITH LOCAL & LIVE FALLBACK
    async function downloadCurrentImage() {
        if (!state.currentActiveImgUrl) return;
        
        showToast("Downloading image...");
        const imgUrl = state.currentActiveImgUrl;
        const fileName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1) || 'downloaded-image.gif';

        if (window.location.protocol === 'file:') {
            forceDirectAnchorDownload(imgUrl, fileName);
            return;
        }

        try {
            const response = await fetch(imgUrl, { mode: 'cors' });
            if (!response.ok) throw new Error("Fetch failed");
            
            const blob = await response.blob();
            triggerBlobDownload(blob, fileName);
        } catch (error) {
            forceDirectAnchorDownload(imgUrl, fileName);
        }
    }

    function triggerBlobDownload(blob, fileName) {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        showToast("Download completed!");
    }

    function forceDirectAnchorDownload(url, fileName) {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Downloading image...");
    }

    function shareCurrentImage() {
        if (!state.currentActiveImgUrl) return;

        const shareUrl = new URL(window.location.href);
        shareUrl.searchParams.set('popupSlide', state.currentIndex);
        shareUrl.searchParams.set('popupImg', state.currentActiveImgUrl);
        const finalLink = shareUrl.toString();

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(finalLink)
                .then(() => showToast("Link copied to clipboard!"))
                .catch(() => fallbackCopyText(finalLink));
        } else {
            fallbackCopyText(finalLink);
        }
    }

    function fallbackCopyText(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast("Link copied to clipboard!");
        } catch (err) {
            showToast("Failed to copy link.");
        }
        document.body.removeChild(textArea);
    }

    function showToast(msg) {
        state.elements.toast.textContent = msg;
        state.elements.toast.classList.add('show');
        setTimeout(() => {
            state.elements.toast.classList.remove('show');
        }, 2500);
    }

    function initGalleryEvents() {
        document.addEventListener('dblclick', (e) => {
            if (e.target.matches(`.${POPUP_CONFIG.baseName}-gallery img`)) {
                openLightbox(e.target);
            }
        });

        state.elements.lightboxClose.addEventListener('click', closeLightbox);
        
        // OUTSIDE CLICK DISABLED (NO ACTION ON BACKGROUND CLICK)
        state.elements.lightbox.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        state.elements.btnDownload.addEventListener('click', downloadCurrentImage);
        state.elements.btnShare.addEventListener('click', shareCurrentImage);
    }

    // =============================================
    // 6. GESTURES & EVENTS
    // =============================================
    function handleTapInteraction(event) {
        const currentTime = new Date().getTime();
        const tapInterval = currentTime - lastTapTime;
        
        if (tapTimeoutId) {
            clearTimeout(tapTimeoutId);
            tapTimeoutId = null;
        }
        
        if (tapInterval < POPUP_CONFIG.settings.doubleTapDelay && tapInterval > 0 && lastTapTime !== 0) {
            lastTapTime = 0;
            if (event.target.matches(`.${POPUP_CONFIG.baseName}-gallery img`)) {
                openLightbox(event.target);
            } else {
                togglePause();
            }
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
            if (deltaX > 0) prevSlide();
            else nextSlide();
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
            if (event.target.matches(`.${POPUP_CONFIG.baseName}-gallery img`)) {
                openLightbox(event.target);
            } else {
                togglePause();
            }
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
        // CLOSE MAIN POPUP
        state.elements.closeBtn.addEventListener("click", () => {
            state.elements.popup.classList.remove("show");
            localStorage.setItem('rxPopupClosed', 'true');
            stopTyping();
            state.isPaused = false;
            if (rotateTimeout) {
                clearTimeout(rotateTimeout);
                rotateTimeout = null;
            }
        });

        // OUTSIDE CLICK DISABLED FOR MAIN POPUP AS WELL
        state.elements.popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        document.addEventListener("keydown", (e) => {
            if (state.elements.lightbox.classList.contains("show") && e.key === "Escape") {
                closeLightbox();
                return;
            }
            if (state.elements.popup.classList.contains("show")) {
                if (e.key === "Escape") {
                    state.elements.popup.classList.remove("show");
                    localStorage.setItem('rxPopupClosed', 'true');
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
    // 7. INITIALIZATION
    // =============================================
    init();

});