// RX-POP-UP-WINDOW.js (Liquid Crystal Shining Theme)
document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // 1. ENHANCED LIQUID THEME CONFIGURATION (12 SHINING THEMES)
    // =============================================
    const liquidThemes = {
        "ruby": { // Red (Liquid)
            primary: "rgba(255, 80, 100, 0.4)",
            secondary: "rgba(220, 50, 70, 0.3)",
            accent: "rgba(255, 180, 190, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(35, 5, 10, 0.3), rgba(60, 10, 15, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(255, 80, 100, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(255, 120, 140, 0.6)",
            particleColor: "rgba(255, 100, 120, 0.4)"
        },
        "sapphire": { // Blue (Liquid)
            primary: "rgba(80, 140, 255, 0.4)",
            secondary: "rgba(60, 110, 220, 0.3)",
            accent: "rgba(190, 220, 255, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(5, 10, 35, 0.3), rgba(10, 20, 60, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(80, 140, 255, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(120, 180, 255, 0.6)",
            particleColor: "rgba(100, 160, 255, 0.4)"
        },
        "diamond": { // White (Liquid)
            primary: "rgba(255, 255, 255, 0.4)",
            secondary: "rgba(230, 230, 230, 0.3)",
            accent: "rgba(255, 255, 255, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(25, 25, 35, 0.3), rgba(40, 40, 60, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(255, 255, 255, 0.7)",
            particleColor: "rgba(255, 255, 255, 0.5)"
        },
        "emerald": { // Green (Liquid)
            primary: "rgba(90, 255, 170, 0.4)",
            secondary: "rgba(70, 220, 140, 0.3)",
            accent: "rgba(190, 255, 220, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(5, 35, 15, 0.3), rgba(10, 60, 25, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(90, 255, 170, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(140, 255, 200, 0.6)",
            particleColor: "rgba(120, 255, 180, 0.4)"
        },
        "citrine": { // Yellow (Liquid)
            primary: "rgba(255, 230, 90, 0.4)",
            secondary: "rgba(255, 200, 70, 0.3)",
            accent: "rgba(255, 245, 190, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(35, 25, 5, 0.3), rgba(60, 45, 10, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(255, 230, 90, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(255, 240, 120, 0.6)",
            particleColor: "rgba(255, 220, 100, 0.4)"
        },
        "platinum": { // Platinum (Liquid)
            primary: "rgba(220, 220, 230, 0.4)",
            secondary: "rgba(200, 200, 210, 0.3)",
            accent: "rgba(240, 240, 250, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(30, 30, 40, 0.3), rgba(50, 50, 70, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(220, 220, 230, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(240, 240, 255, 0.7)",
            particleColor: "rgba(230, 230, 240, 0.5)"
        },
        "gold": { // Golden (Liquid)
            primary: "rgba(255, 225, 50, 0.4)",
            secondary: "rgba(255, 200, 30, 0.3)",
            accent: "rgba(255, 240, 160, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(35, 25, 5, 0.3), rgba(60, 45, 10, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(255, 225, 50, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(255, 235, 100, 0.7)",
            particleColor: "rgba(255, 215, 80, 0.5)"
        },
        "amethyst": { // Purple (Liquid)
            primary: "rgba(190, 110, 255, 0.4)",
            secondary: "rgba(160, 80, 220, 0.3)",
            accent: "rgba(230, 190, 255, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(25, 5, 35, 0.3), rgba(40, 10, 60, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(190, 110, 255, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(210, 140, 255, 0.6)",
            particleColor: "rgba(200, 120, 255, 0.4)"
        },
        "aquamarine": { // Teal (Liquid)
            primary: "rgba(80, 255, 220, 0.4)",
            secondary: "rgba(60, 220, 190, 0.3)",
            accent: "rgba(190, 255, 240, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(5, 30, 25, 0.3), rgba(10, 50, 45, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(80, 255, 220, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(120, 255, 230, 0.6)",
            particleColor: "rgba(100, 255, 210, 0.4)"
        },
        "rose-quartz": { // Pink (Liquid)
            primary: "rgba(255, 160, 200, 0.4)",
            secondary: "rgba(255, 130, 180, 0.3)",
            accent: "rgba(255, 210, 230, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(35, 10, 20, 0.3), rgba(60, 20, 35, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(255, 160, 200, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(255, 180, 220, 0.6)",
            particleColor: "rgba(255, 170, 210, 0.4)"
        },
        "tanzanite": { // Deep Blue (Liquid)
            primary: "rgba(50, 100, 255, 0.4)",
            secondary: "rgba(40, 80, 220, 0.3)",
            accent: "rgba(160, 190, 255, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(5, 15, 40, 0.3), rgba(10, 25, 70, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(50, 100, 255, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(80, 140, 255, 0.6)",
            particleColor: "rgba(70, 120, 255, 0.4)"
        },
        "sunstone": { // Orange (Liquid)
            primary: "rgba(255, 160, 60, 0.4)",
            secondary: "rgba(255, 140, 40, 0.3)",
            accent: "rgba(255, 210, 160, 0.5)",
            bgGradient: "linear-gradient(145deg, rgba(35, 15, 5, 0.3), rgba(60, 30, 10, 0.4))",
            lightEffect: "radial-gradient(circle at 20% 30%, rgba(255, 160, 60, 0.2) 0%, transparent 60%)",
            shineColor: "rgba(255, 180, 80, 0.6)",
            particleColor: "rgba(255, 170, 70, 0.4)"
        }
    };

    // Get next theme in sequence on refresh
    function getNextTheme() {
        const lastTheme = localStorage.getItem('rxLiquidTheme');
        const themeKeys = Object.keys(liquidThemes);
        
        if (!lastTheme) return themeKeys[0];
        
        const currentIndex = themeKeys.indexOf(lastTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        return themeKeys[nextIndex];
    }

    // Apply liquid theme with ultra-transparent effects
    function applyLiquidTheme(themeName) {
        const theme = liquidThemes[themeName];
        const style = document.createElement('style');
        style.id = 'rx-liquid-theme';
        
        style.textContent = `
            /* Liquid Crystal Theme: ${themeName} */
            #RX-POP-UP-Window::before {
                background: ${theme.lightEffect};
                opacity: 0.8;
            }
            
            .RX-POP-UP-Window-content {
                background: ${theme.bgGradient};
                backdrop-filter: blur(20px) saturate(200%);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3),
                            0 0 0 1px rgba(255, 255, 255, 0.08),
                            inset 0 0 30px rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.12);
            }
            
            h2 {
                color: rgba(255,255,255,0.95);
                text-shadow: 0 2px 12px ${theme.primary.replace('0.4', '0.3')},
                             0 0 20px ${theme.shineColor};
            }
            
            h2::before {
                background: linear-gradient(90deg, transparent, ${theme.primary}, transparent);
                height: 3px;
                opacity: 0.8;
                box-shadow: 0 0 15px ${theme.primary};
            }
            
            .RX-POP-UP-Window-gallery img:hover {
                box-shadow: 0 12px 30px ${theme.primary.replace('0.4', '0.2')},
                            inset 0 0 15px rgba(255,255,255,0.1);
                border: 1px solid ${theme.primary.replace('0.4', '0.3')};
                filter: brightness(1.1) saturate(1.2);
            }
            
            .RX-POP-UP-Window-carousel-btn {
                color: rgba(255,255,255,0.9);
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.15);
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3),
                            inset 0 0 10px rgba(255,255,255,0.1);
            }
            
            .RX-POP-UP-Window-carousel-btn:hover {
                background: ${theme.primary.replace('0.4', '0.3')};
                box-shadow: 0 8px 25px ${theme.primary.replace('0.4', '0.2')},
                            inset 0 0 15px rgba(255,255,255,0.15);
                color: white;
            }
            
            .RX-POP-UP-Window-btn-close:hover {
                background: ${theme.secondary.replace('0.3', '0.25')};
                box-shadow: 0 8px 25px ${theme.secondary.replace('0.3', '0.2')};
            }
            
            .RX-POP-UP-Window-carousel-indicators span.RX-POP-UP-Window-active {
                background: ${theme.primary};
                box-shadow: 0 0 15px ${theme.primary};
            }
            
            /* Liquid Facets */
            .liquid-facet {
                background: linear-gradient(var(--grad-angle), var(--facet-color), transparent);
                opacity: var(--facet-opacity);
                filter: blur(var(--facet-blur));
                border-radius: 50% / 20%;
                animation: liquid-flow 15s infinite alternate ease-in-out;
            }
            
            /* Shining Particles */
            .shining-particle {
                position: absolute;
                background: ${theme.shineColor};
                border-radius: 50%;
                filter: blur(1px);
                animation: particle-float var(--duration) infinite ease-in-out;
                opacity: 0;
            }
            
            /* Animations */
            @keyframes liquid-flow {
                0% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(10px, 10px) rotate(2deg) scale(1.05); }
                100% { transform: translate(-5px, -5px) rotate(-1deg) scale(0.98); }
            }
            
            @keyframes particle-float {
                0% { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; }
                10% { opacity: 0.8; }
                90% { opacity: 0.8; }
                100% { transform: translateY(var(--y-end)) translateX(var(--x-end)) scale(1); opacity: 0; }
            }
            
            @keyframes shine-pulse {
                0% { box-shadow: 0 0 10px ${theme.shineColor}; }
                50% { box-shadow: 0 0 25px ${theme.shineColor}; }
                100% { box-shadow: 0 0 10px ${theme.shineColor}; }
            }
            
            /* Enhanced Elements */
            .RX-POP-UP-Window-btn-close {
                animation: shine-pulse 3s infinite;
            }
            
            .RX-POP-UP-Window-carousel-btn {
                transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            }
            
            .RX-POP-UP-Window-gallery img {
                transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
            }
        `;
        
        // Remove existing theme
        const existingTheme = document.getElementById('rx-liquid-theme');
        if (existingTheme) document.head.removeChild(existingTheme);
        
        document.head.appendChild(style);
        localStorage.setItem('rxLiquidTheme', themeName);
        
        // Create shining particles
        createShiningParticles(theme);
    }
    
    // Create shining particles effect
    function createShiningParticles(theme) {
        const particlesContainer = document.querySelector('.RX-POP-UP-Window-shining-particles');
        if (particlesContainer) particlesContainer.innerHTML = '';
        
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'shining-particle';
            
            // Random properties
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            const xEnd = (Math.random() - 0.5) * 40;
            const yEnd = (Math.random() - 0.5) * 40;
            
            particle.style.cssText = `
                --duration: ${duration}s;
                --x-end: ${xEnd}px;
                --y-end: ${yEnd}px;
                width: ${size}px;
                height: ${size}px;
                left: ${posX}%;
                top: ${posY}%;
                animation-delay: ${delay}s;
                background: ${theme.particleColor};
            `;
            
            particlesContainer.appendChild(particle);
        }
    }

    // =============================================
    // 2. ENHANCED POPUP HTML STRUCTURE (with shining effects)
    // =============================================
    const popupHTML = `
        <div id="RX-POP-UP-Window">
            <div class="RX-POP-UP-Window-content">
                <button class="RX-POP-UP-Window-btn-close" id="RX-POP-UP-Window-close" aria-label="Close popup">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                
                <div class="RX-POP-UP-Window-liquid-facets">
                    <div class="liquid-facet" style="--grad-angle: 45deg; --facet-color: ${liquidThemes.ruby.primary}; --facet-opacity: 0.35; --facet-blur: 12px; top: 10%; left: 10%; width: 220px; height: 220px;"></div>
                    <div class="liquid-facet" style="--grad-angle: 135deg; --facet-color: ${liquidThemes.sapphire.primary}; --facet-opacity: 0.3; --facet-blur: 18px; bottom: 15%; right: 15%; width: 270px; height: 270px;"></div>
                    <div class="liquid-facet" style="--grad-angle: 90deg; --facet-color: ${liquidThemes.diamond.primary}; --facet-opacity: 0.25; --facet-blur: 25px; top: 50%; left: 50%; width: 320px; height: 320px;"></div>
                </div>
                
                <div class="RX-POP-UP-Window-shining-particles"></div>
                
                <div class="RX-POP-UP-Window-carousel">
                    <div class="RX-POP-UP-Window-carousel-item">
                        <h2>Welcome</h2>
                        <div class="RX-POP-UP-Window-scroll-content">
                            <p>"Hi, I'm Rosan Xettri, a passionate web designer dedicated to creating stunning and user-friendly websites. Let's build something amazing together!"</p>
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
    // 3. ENHANCED LIQUID STYLE BASE CSS
    // =============================================
    const liquidStyle = document.createElement('style');
    liquidStyle.textContent = `
        /* Liquid Crystal Base Styles */
        #RX-POP-UP-Window {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(5, 0, 15, 0.8);
            backdrop-filter: blur(25px) saturate(180%);
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
            transition: all 1s ease;
            z-index: -1;
        }
        
        #RX-POP-UP-Window.RX-POP-UP-Window-show {
            opacity: 1;
            visibility: visible;
        }
        
        .RX-POP-UP-Window-content {
            position: relative;
            width: 90%;
            max-width: 750px;
            border-radius: 28px;
            padding: 45px;
            transform: translateY(30px) scale(0.98);
            opacity: 0;
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
            max-height: 90vh;
            overflow: hidden;
            z-index: 1;
        }
        
        .RX-POP-UP-Window-liquid-facets {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 28px;
            pointer-events: none;
            z-index: -1;
        }
        
        .RX-POP-UP-Window-shining-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
            border-radius: 28px;
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
            border: 1px solid rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.2);
        }
        
        h2 {
            font-size: 32px;
            margin-bottom: 30px;
            text-align: center;
            font-weight: 600;
            position: relative;
            display: inline-block;
            padding: 0 30px;
            letter-spacing: 1px;
        }
        
        h2::before {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            border-radius: 3px;
        }
        
        p {
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.8;
            margin: 25px 0;
            font-size: 17px;
            text-align: center;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        
        /* Gallery */
        .RX-POP-UP-Window-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 25px;
            margin: 35px 0;
        }
        
        .RX-POP-UP-Window-gallery img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 14px;
            transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4),
                        inset 0 0 15px rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(8px);
            opacity: 0;
            transform: translateY(20px);
        }
        
        .RX-POP-UP-Window-carousel-item.RX-POP-UP-Window-active .RX-POP-UP-Window-gallery img {
            animation: RX-POP-UP-Window-fadeUp 0.6s forwards;
            animation-delay: calc(var(--order) * 0.1s);
        }
        
        .RX-POP-UP-Window-gallery img:hover {
            transform: scale(1.05);
            z-index: 2;
        }
        
        /* Controls */
        .RX-POP-UP-Window-carousel-controls {
            display: flex;
            justify-content: space-between;
            position: absolute;
            width: calc(100% - 90px);
            bottom: 35px;
            left: 45px;
        }
        
        .RX-POP-UP-Window-carousel-btn {
            border: none;
            width: 55px;
            height: 55px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        
        .RX-POP-UP-Window-carousel-btn:hover {
            transform: scale(1.15);
        }
        
        .RX-POP-UP-Window-carousel-btn svg {
            width: 22px;
            height: 22px;
            stroke: currentColor;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        
        /* Close Button */
        .RX-POP-UP-Window-btn-close {
            position: absolute;
            top: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.15);
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.4s ease;
            z-index: 10;
            backdrop-filter: blur(8px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .RX-POP-UP-Window-btn-close:hover {
            transform: rotate(360deg) scale(1.15);
        }
        
        .RX-POP-UP-Window-btn-close svg {
            width: 24px;
            height: 24px;
            stroke: currentColor;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        
        /* Indicators */
        .RX-POP-UP-Window-carousel-indicators {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 30px;
        }
        
        .RX-POP-UP-Window-carousel-indicators span {
            display: block;
            width: 12px;
            height: 12px;
            background: rgba(255, 255, 255, 0.25);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.15);
        }
        
        .RX-POP-UP-Window-carousel-indicators span.RX-POP-UP-Window-active {
            transform: scale(1.5);
        }
        
        /* Animations */
        @keyframes RX-POP-UP-Window-fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes RX-POP-UP-Window-fadeUp {
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .RX-POP-UP-Window-content {
                width: 95%;
                padding: 35px;
            }
            
            .RX-POP-UP-Window-scroll-content {
                max-height: 60vh;
            }
            
            .RX-POP-UP-Window-gallery {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 20px;
            }
            
            h2 {
                font-size: 28px;
            }
        }
        
        @media (max-width: 480px) {
            .RX-POP-UP-Window-content {
                padding: 30px 25px;
                border-radius: 24px;
            }
            
            h2 {
                font-size: 26px;
                margin-bottom: 25px;
            }
            
            .RX-POP-UP-Window-carousel-controls {
                width: calc(100% - 50px);
                left: 25px;
                bottom: 25px;
            }
            
            .RX-POP-UP-Window-carousel-btn {
                width: 50px;
                height: 50px;
            }
            
            .RX-POP-UP-Window-btn-close {
                width: 45px;
                height: 45px;
                top: 20px;
                right: 20px;
            }
        }
    `;

    // =============================================
    // 4. INITIALIZATION
    // =============================================
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    document.head.appendChild(liquidStyle);
    
    // Apply liquid theme on load
    const nextLiquidTheme = getNextTheme();
    applyLiquidTheme(nextLiquidTheme);

    // =============================================
    // 5. ENHANCED CORE FUNCTIONALITY
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
    let themeRotationInterval;
    
    // Initialize popup
    function init() {
        createIndicators();
        updateCarousel();
        showPopup();
        startThemeRotation();
        setGalleryItemOrder();
    }
    
    // Set order for gallery items animation
    function setGalleryItemOrder() {
        document.querySelectorAll('.RX-POP-UP-Window-gallery img').forEach((img, index) => {
            img.style.setProperty('--order', index);
        });
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
        clearInterval(themeRotationInterval);
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
        
        // Update gallery items order for animation
        setGalleryItemOrder();
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
    
    // Rotate through themes automatically
    function startThemeRotation() {
        themeRotationInterval = setInterval(() => {
            const currentTheme = localStorage.getItem('rxLiquidTheme');
            const themeKeys = Object.keys(liquidThemes);
            const currentIndex = themeKeys.indexOf(currentTheme);
            const nextIndex = (currentIndex + 1) % themeKeys.length;
            applyLiquidTheme(themeKeys[nextIndex]);
        }, 15000); // Rotate every 15 seconds
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