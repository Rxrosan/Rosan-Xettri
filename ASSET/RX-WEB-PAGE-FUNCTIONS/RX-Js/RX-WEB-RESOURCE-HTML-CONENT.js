// RX-WEB-RESOURCE-HTML-CONENT.js - Optimized Fast Loading Version (FULLY VISIBLE LIST)

(function() {
    'use strict';

    // ===== MAIN FUNCTION =====
    window.rxLoadResourcePage = function(rxDisplayArea) {
        if (!rxDisplayArea) {
            console.error(" Display area not provided!");
            return;
        }

        console.log(" Loading Resource Page...");

        // ===== INJECT CSS STYLES (WHITE THEME & FULLY VISIBLE) =====
        const styles = `
            #rx-resource-container {
                width: 100%;
                max-width: 1280px;
                margin: 0 auto;
                padding: 20px;
                background: transparent;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                box-sizing: border-box;
            }

            /* Header Matching About Page */
            .rx-resource-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .rx-resource-header h2 {
                color: #1a4480;
                font-size: clamp(28px, 3vw, 40px);
                margin-bottom: 10px;
                position: relative;
                padding-bottom: 15px;
                font-weight: 700;
            }

            .rx-resource-header h2:after {
                content: '';
                display: block;
                width: 80px;
                height: 4px;
                background: #1a4480;
                margin: 12px auto 0;
                border-radius: 2px;
            }

            .rx-resource-header h2 i {
                color: #1a4480;
            }

            .rx-resource-header p {
                color: #666666;
                font-size: clamp(14px, 1.5vw, 16px);
            }

            /* Store Navigation Buttons */
            .store-navigation {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 25px;
                justify-content: center;
                padding: 10px 0;
                width: 100%;
            }

            .store-btn {
                padding: 12px 24px;
                background: #f8fafc;
                color: #1a4480;
                border: 1px solid #d0dbe8;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: clamp(14px, 1.2vw, 16px);
                font-weight: 600;
                font-family: inherit;
                flex-shrink: 0;
                white-space: nowrap;
            }

            .store-btn:hover {
                background: #ffffff;
                border-color: #1a4480;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(26, 68, 128, 0.1);
            }

            .store-btn.active {
                background: #1a4480;
                color: #ffffff;
                border-color: #1a4480;
                box-shadow: 0 4px 12px rgba(26, 68, 128, 0.25);
            }

            /* Store Title */
            .store-title {
                text-align: center;
                margin: 25px 0 20px;
                color: #1a4480;
                font-size: clamp(20px, 2.5vw, 24px);
                font-weight: 600;
                word-break: break-word;
            }

            /* Content Cards Grid - FULLY VISIBLE */
            .content-cards {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 25px;
                padding: 10px 0 30px;
                width: 100%;
                box-sizing: border-box;
                overflow: visible; /* Ensure nothing is hidden */
            }

            /* Individual Card */
            .card {
                background: #ffffff;
                padding: 25px;
                border-radius: 12px;
                border: 1px solid #d0dbe8;
                transition: all 0.3s ease;
                position: relative;
                min-height: 240px; /* Reduced min height slightly */
                display: flex;
                flex-direction: column;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
                box-sizing: border-box;
                width: 100%;
            }

            .card:hover {
                transform: translateY(-5px);
                border-color: #1a4480;
                box-shadow: 0 8px 25px rgba(26, 68, 128, 0.08);
            }

            .card.locked {
                opacity: 0.9;
            }

            .card.locked:hover {
                opacity: 1;
            }

            /* Card Icon */
            .card-icon {
                font-size: 38px;
                color: #1a4480;
                margin-bottom: 15px;
                display: block;
            }

            /* Card Text */
            .card h3 {
                color: #1a4480;
                margin-bottom: 12px;
                font-size: 18px;
                font-weight: 700;
                word-break: break-word;
            }

            .card p {
                color: #555555;
                font-size: 14px;
                margin-bottom: 15px;
                line-height: 1.6;
                flex-grow: 1;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            /* Price Badge */
            .card .price {
                color: #0056b3;
                font-weight: 700;
                font-size: 17px;
                margin: 10px 0;
                padding: 6px 14px;
                background: rgba(26, 68, 128, 0.06);
                border-radius: 20px;
                display: inline-block;
                border: 1px solid rgba(26, 68, 128, 0.1);
                word-break: break-word;
            }

            /* Lock Icon */
            .lock-icon {
                position: absolute;
                top: 15px;
                right: 15px;
                color: #e74c3c;
                font-size: 18px;
                background: #fff;
                padding: 4px;
                border-radius: 50%;
            }

            /* Purchase Buttons */
            .purchase-btn {
                background: #1a4480;
                color: #ffffff;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                width: 100%;
                font-size: 16px;
                margin-top: auto;
                font-family: inherit;
                box-sizing: border-box;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .purchase-btn:hover {
                background: #0056b3;
                transform: scale(1.02);
                box-shadow: 0 4px 12px rgba(26, 68, 128, 0.3);
            }

            .purchase-btn.login-required {
                background: #f8fafc;
                color: #1a4480;
                border: 1px solid #d0dbe8;
            }

            .purchase-btn.login-required:hover {
                background: #e74c3c;
                color: #ffffff;
                border-color: #e74c3c;
            }

            /* Open Link Button */
            .card a {
                display: inline-block;
                background: #1a4480;
                color: #ffffff;
                padding: 12px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                width: 100%;
                text-align: center;
                transition: all 0.3s ease;
                margin-top: auto;
                box-sizing: border-box;
                font-family: inherit;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .card a:hover {
                background: #0056b3;
                transform: scale(1.02);
                box-shadow: 0 4px 12px rgba(26, 68, 128, 0.3);
            }

            .card a i {
                margin-right: 8px;
            }

            /* Floating Scroll Button */
            .floating-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: #1a4480;
                color: #ffffff;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 22px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(26, 68, 128, 0.3);
                transition: all 0.3s ease;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .floating-btn:hover {
                transform: translateY(-5px);
                background: #0056b3;
                box-shadow: 0 6px 20px rgba(26, 68, 128, 0.4);
            }

            .floating-btn.hidden {
                display: none !important;
            }

            /* Loading & Error States */
            .loading-spinner {
                text-align: center;
                padding: 60px;
                grid-column: 1/-1;
            }

            .loading-spinner i {
                font-size: 48px;
                color: #1a4480;
                animation: spin 1s linear infinite;
            }

            .loading-spinner p {
                color: #555555;
                margin-top: 15px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .error-message {
                text-align: center;
                padding: 60px 20px;
                grid-column: 1/-1;
                background: #ffffff;
                border-radius: 12px;
                border: 1px solid #d0dbe8;
            }

            .error-message i {
                font-size: 64px;
                color: #e74c3c;
                display: block;
                margin-bottom: 20px;
            }

            .error-message h3 {
                color: #e74c3c;
                font-size: 24px;
                margin-bottom: 10px;
            }

            .error-message p {
                color: #555555;
                margin-bottom: 20px;
            }

            .error-message .refresh-btn {
                padding: 12px 40px;
                background: #1a4480;
                color: #ffffff;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s ease;
                margin: 5px;
                font-family: inherit;
            }

            .error-message .refresh-btn:hover {
                background: #0056b3;
                transform: scale(1.02);
            }

            .error-message .refresh-btn.secondary {
                background: #f8fafc;
                color: #1a4480;
                border: 1px solid #d0dbe8;
            }

            .error-message .refresh-btn.secondary:hover {
                background: #ffffff;
                border-color: #1a4480;
            }

            /* ============================================================
               RESPONSIVE DESIGN - ALL DEVICES
               ============================================================ */

            /* Medium Tablets / Small Laptops */
            @media (max-width: 992px) {
                .content-cards {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                }
            }

            /* Tablets (768px and below) */
            @media (max-width: 768px) {
                #rx-resource-container {
                    padding: 15px;
                }
                .content-cards {
                    grid-template-columns: 1fr;
                    gap: 18px;
                    padding: 5px 0 20px;
                }
                .card {
                    min-height: auto;
                    padding: 20px;
                }
                .store-btn {
                    padding: 10px 18px;
                    font-size: 14px;
                    white-space: nowrap;
                }
                .store-navigation {
                    gap: 8px;
                    padding: 5px 0;
                }
                .rx-resource-header h2 {
                    font-size: 28px;
                }
                .rx-resource-header p {
                    font-size: 14px;
                }
                .floating-btn {
                    width: 45px;
                    height: 45px;
                    font-size: 18px;
                    bottom: 20px;
                    right: 20px;
                }
                .card h3 {
                    font-size: 17px;
                }
                .card p {
                    font-size: 13px;
                }
                .card .price {
                    font-size: 15px;
                    padding: 5px 12px;
                }
                .purchase-btn, .card a {
                    font-size: 15px;
                    padding: 10px 16px;
                }
            }

            /* Mobile Devices (480px and below) */
            @media (max-width: 480px) {
                #rx-resource-container {
                    padding: 10px;
                }
                .rx-resource-header {
                    margin-bottom: 20px;
                }
                .rx-resource-header h2 {
                    font-size: 24px;
                    padding-bottom: 12px;
                }
                .rx-resource-header h2:after {
                    width: 60px;
                    height: 3px;
                    margin-top: 10px;
                }
                .rx-resource-header p {
                    font-size: 13px;
                }
                .store-navigation {
                    gap: 6px;
                    margin-bottom: 15px;
                }
                .store-btn {
                    padding: 8px 14px;
                    font-size: 13px;
                }
                .store-title {
                    font-size: 19px;
                    margin: 15px 0;
                }
                .content-cards {
                    gap: 15px;
                    padding: 0 0 15px;
                }
                .card {
                    padding: 18px;
                    min-height: auto;
                    border-radius: 10px;
                }
                .card-icon {
                    font-size: 32px;
                    margin-bottom: 12px;
                }
                .card h3 {
                    font-size: 16px;
                    margin-bottom: 8px;
                }
                .card p {
                    font-size: 13px;
                    margin-bottom: 12px;
                }
                .card .price {
                    font-size: 14px;
                    padding: 4px 12px;
                    margin: 8px 0;
                }
                .purchase-btn, .card a {
                    font-size: 14px;
                    padding: 10px 14px;
                }
                .floating-btn {
                    width: 40px;
                    height: 40px;
                    font-size: 16px;
                    bottom: 15px;
                    right: 15px;
                }
                .lock-icon {
                    top: 12px;
                    right: 12px;
                    font-size: 16px;
                }
                .loading-spinner, .error-message {
                    padding: 40px 15px;
                }
                .error-message .refresh-btn {
                    padding: 10px 25px;
                    font-size: 14px;
                }
            }

            /* Small Mobile Devices (400px and below) */
            @media (max-width: 400px) {
                #rx-resource-container {
                    padding: 5px;
                }
                .store-navigation {
                    gap: 5px;
                }
                .store-btn {
                    padding: 6px 12px;
                    font-size: 12px;
                }
                .card {
                    padding: 15px;
                }
                .card-icon {
                    font-size: 28px;
                    margin-bottom: 10px;
                }
                .card h3 {
                    font-size: 15px;
                }
                .card p {
                    font-size: 12px;
                }
                .purchase-btn, .card a {
                    font-size: 13px;
                    padding: 8px 12px;
                }
                .floating-btn {
                    width: 36px;
                    height: 36px;
                    font-size: 14px;
                    bottom: 12px;
                    right: 12px;
                }
                .rx-resource-header h2 {
                    font-size: 21px;
                }
            }
        `;

        // Add styles if not already present
        if (!document.getElementById('rx-resource-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'rx-resource-styles';
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }

        // ===== INJECT HTML =====
        rxDisplayArea.innerHTML = `
            <div id="rx-resource-container">
                <div class="rx-resource-header">
                    <h2>Resources & Assets</h2>
                </div>

                <div id="storeNavigation" class="store-navigation"></div>
                <h3 id="storeTitle" class="store-title"><span>----</span></h3>
                <div id="contentCards" class="content-cards">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner"></i>
                        <p>Loading resources...</p>
                    </div>
                </div>
            </div>

            <button id="scroll-to-top" class="floating-btn hidden" onclick="window.scrollTo({top:0,behavior:'smooth'})">
                <i class="fas fa-arrow-up"></i>
            </button>
        `;

        // ===== SETUP SCROLL BUTTON =====
        function setupScrollButton() {
            const scrollBtn = document.getElementById('scroll-to-top');
            if (!scrollBtn) return;
            
            const handler = function() {
                scrollBtn.classList.toggle('hidden', window.pageYOffset <= 300);
            };
            
            window.removeEventListener('scroll', handler);
            window.addEventListener('scroll', handler);
            handler(); // Initial check
        }

        // ===== INITIALIZE RESOURCES =====
        function initializeResources() {
            console.log(" Initializing resources...");

            // Check if StoreManager exists
            if (typeof StoreManager === 'undefined' || StoreManager === null) {
                console.warn(" StoreManager not ready, retrying...");
                return false;
            }

            // Check if StoreManager has initializeStores method
            if (typeof StoreManager.initializeStores !== 'function') {
                console.error(" StoreManager.initializeStores is not a function");
                return false;
            }

            try {
                // Initialize stores
                StoreManager.initializeStores();
                console.log(" Resources loaded successfully!");
                setupScrollButton();
                return true;
            } catch (error) {
                console.error(" Error loading resources:", error);
                return false;
            }
        }

        // ===== TRY TO LOAD IMMEDIATELY =====
        if (initializeResources()) {
            return;
        }

        // ===== RETRY WITH DELAY =====
        let attempts = 0;
        const maxAttempts = 30;
        
        const retryInterval = setInterval(() => {
            attempts++;
            console.log(` Retry ${attempts}/${maxAttempts}...`);

            if (initializeResources()) {
                clearInterval(retryInterval);
                return;
            }

            if (attempts >= maxAttempts) {
                clearInterval(retryInterval);
                console.error(" Failed to load resources after max attempts");

                // Show error
                const contentCards = document.getElementById('contentCards');
                if (contentCards) {
                    contentCards.innerHTML = `
                        <div class="error-message">
                            <i class="fas fa-exclamation-circle"></i>
                            <h3>Failed to Load Resources</h3>
                            <p>Unable to load resources. Please refresh the page.</p>
                            <button class="refresh-btn" onclick="location.reload()">
                                <i class="fas fa-sync"></i> Refresh Page
                            </button>
                            <button class="refresh-btn secondary" onclick="if(window.StoreManager) StoreManager.initializeStores();">
                                <i class="fas fa-play"></i> Try Again
                            </button>
                        </div>
                    `;
                }
            }
        }, 300);

        // ===== SAFETY NET =====
        setTimeout(() => {
            if (typeof StoreManager === 'undefined') {
                console.warn(" StoreManager still not available.");
            }
        }, 5000);
    };

    // ===== AUTO-INITIALIZE ON DOM READY =====
    function autoInit() {
        const displayArea = document.getElementById('rxDisplayArea');
        if (displayArea && typeof window.rxLoadResourcePage === 'function') {
            // Check if already loaded
            if (!displayArea.querySelector('#rx-resource-container')) {
                console.log(" Auto-initializing resource page...");
                window.rxLoadResourcePage(displayArea);
            }
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }

    // ===== LISTEN FOR LOGIN/LOGOUT EVENTS =====
    document.addEventListener('userLoggedIn', function() {
        console.log(" User logged in, refreshing resources...");
        const displayArea = document.getElementById('rxDisplayArea');
        if (displayArea && window.StoreManager) {
            window.StoreManager.renderContentCards();
        }
    });

    document.addEventListener('userLoggedOut', function() {
        console.log(" User logged out, refreshing resources...");
        const displayArea = document.getElementById('rxDisplayArea');
        if (displayArea && window.StoreManager) {
            window.StoreManager.renderContentCards();
        }
    });

    console.log(" RX-WEB-RESOURCE-HTML-CONENT loaded successfully w");
})();