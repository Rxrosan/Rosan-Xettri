(function() {
    // --- CONFIGURATION ---
    const LOGO_URL = 'RX-ASSETS/RX-IMAGE/RX-LOGO/L-7.gif'; 
    const BG_COLOR = '#0a192f';           
    const LOGO_SIZE = '150px';
    const PRIMARY_TEXT = 'RX STUDIO';     
    const SECONDARY_TEXT = 'ROSAN KC';    
    // ---------------------

    // 1. [FUNCTION PRESERVED] INSTANTLY COLOR BACKGROUND
    // Stops the white flash before the browser even reads the HTML
    document.documentElement.style.background = BG_COLOR;

    // 2. [FUNCTION PRESERVED] INJECT CSS
    const style = document.createElement('style');
    style.innerHTML = `
        html, body {
            background-color: ${BG_COLOR} !important;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden !important;
        }

        #ui-loader-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: ${BG_COLOR};
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483647;
            opacity: 1;
            transition: opacity 0.5s ease;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .loader-content {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .loader-image {
            width: ${LOGO_SIZE};
            height: auto;
            display: block;
            margin-bottom: 15px;
        }

        .brand-name {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 4px;
            margin: 0;
            text-transform: uppercase;
        }

        .author-name {
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            margin-top: 8px;
            letter-spacing: 2px;
            font-weight: 300;
        }

        #main-site-content {
            display: none;
        }

        .site-revealed #main-site-content {
            display: block !important;
        }
        
        .site-revealed #ui-loader-wrapper {
            opacity: 0;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // 3. [FUNCTION PRESERVED] CREATE THE LOADER HTML
    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'ui-loader-wrapper';
    loaderDiv.innerHTML = `
        <div class="loader-content">
            <img src="${LOGO_URL}" class="loader-image" alt="Logo">
            <h1 class="brand-name">${PRIMARY_TEXT}</h1>
            <p class="author-name">${SECONDARY_TEXT}</p>
        </div>
    `;

    // 4. [FUNCTION PRESERVED] MUTATION OBSERVER
    // Injects the loader the exact micro-second the <body> tag appears
    const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
            document.body.prepend(loaderDiv);
            obs.disconnect(); 
        }
    });
    observer.observe(document.documentElement, { childList: true });

    // 5. [FUNCTION PRESERVED] AUTO-SENSE FINISH (window.onload)
    // This is the trigger that waits for ALL JS, CSS, and Images to load.
    window.addEventListener('load', function() {
        setTimeout(() => {
            // Reveals the website
            document.documentElement.classList.add('site-revealed');
            
            // Cleanup: Removes loader from DOM to save memory
            setTimeout(() => {
                const loader = document.getElementById('ui-loader-wrapper');
                if (loader) loader.remove();
                document.documentElement.style.background = ''; 
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
            }, 500);
        }, 400); // 400ms buffer so the user actually sees the logo
    });
})();