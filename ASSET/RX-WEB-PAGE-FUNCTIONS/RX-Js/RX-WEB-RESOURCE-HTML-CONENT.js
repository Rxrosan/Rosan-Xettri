// RX-WEB-RESOURCE-HTML-CONENT.js - Optimized Fast Loading Version (3 COLUMNS)

(function() {
    'use strict';

    window.rxLoadResourcePage = function(rxDisplayArea) {
        if (!rxDisplayArea) {
            console.error(" Display area not provided!");
            return;
        }

        console.log(" Loading Resource Page...");

        const styles = `
            #rx-resource-container {
                width: 100%;
                max-width: 1280px;
                margin: 0 auto;
                padding: 15px;
                background: transparent;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                box-sizing: border-box;
            }

            .rx-resource-header {
                text-align: center;
                margin-bottom: 20px;
            }

            .rx-resource-header h2 {
                color: #1a4480;
                font-size: clamp(24px, 2.5vw, 34px);
                margin-bottom: 8px;
                position: relative;
                padding-bottom: 12px;
                font-weight: 700;
            }

            .rx-resource-header h2:after {
                content: '';
                display: block;
                width: 60px;
                height: 3px;
                background: #1a4480;
                margin: 10px auto 0;
                border-radius: 2px;
            }

            .rx-resource-header h2 i {
                color: #1a4480;
            }

            .rx-resource-header p {
                color: #666666;
                font-size: clamp(13px, 1.2vw, 15px);
            }

            .store-navigation {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 20px;
                justify-content: center;
                padding: 8px 0;
                width: 100%;
            }

            .store-btn {
                padding: 10px 20px;
                background: #f8fafc;
                color: #1a4480;
                border: 1px solid #d0dbe8;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: clamp(13px, 1vw, 15px);
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

            .store-title {
                text-align: center;
                margin: 15px 0 18px;
                color: #1a4480;
                font-size: clamp(18px, 2vw, 22px);
                font-weight: 600;
                word-break: break-word;
            }

            .content-cards {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                padding: 10px 0 20px;
                width: 100%;
                box-sizing: border-box;
                overflow: visible;
            }

            .card {
                background: #ffffff;
                padding: 16px;
                border-radius: 10px;
                border: 1px solid #d0dbe8;
                transition: all 0.3s ease;
                position: relative;
                min-height: 170px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
                box-sizing: border-box;
                width: 100%;
            }

            .card:hover {
                transform: translateY(-4px);
                border-color: #1a4480;
                box-shadow: 0 8px 25px rgba(26, 68, 128, 0.08);
            }

            .card.locked {
                opacity: 0.85;
            }

            .card.locked:hover {
                opacity: 1;
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 6px;
                width: 100%;
            }

            .card-header-left {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .card-icon {
                font-size: 28px;
                color: #1a4480;
                display: block;
            }

            .extra-details-btn {
                background: transparent;
                border: none;
                color: #1a4480;
                font-size: 18px;
                cursor: pointer;
                padding: 2px 4px;
                transition: all 0.3s ease;
                border-radius: 50%;
                z-index: 10;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: inherit;
            }

            .extra-details-btn:hover {
                background: #f0f4f9;
                transform: scale(1.1);
                color: #0056b3;
            }

            .lock-icon {
                color: #e74c3c;
                font-size: 16px;
                background: #fff;
                padding: 2px;
                border-radius: 50%;
                z-index: 5;
                flex-shrink: 0;
            }

            .card h3 {
                color: #1a4480;
                margin-bottom: 6px;
                font-size: 15px;
                font-weight: 700;
                word-break: break-word;
                line-height: 1.3;
            }

            .card .card-description {
                color: #555555;
                font-size: 13px;
                margin-bottom: 8px;
                line-height: 1.5;
                flex-grow: 1;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }

            .card .card-access-info {
                margin: 6px 0 10px;
                padding: 8px 12px;
                background: #f8fafc;
                border-radius: 6px;
                border: 1px solid #d0dbe8;
                font-size: 13px;
            }

            .card .card-access-info i {
                margin-right: 4px;
            }

            .card-actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 8px;
                margin-top: auto;
                padding-top: 10px;
                border-top: 1px solid #d0dbe8;
                flex-wrap: wrap;
            }

            .card-actions .card-price {
                font-size: 14px;
                font-weight: 700;
                color: #0056b3;
                white-space: nowrap;
            }

            .purchase-btn {
                background: #1a4480;
                color: #ffffff;
                border: none;
                padding: 6px 14px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 12px;
                white-space: nowrap;
                font-family: inherit;
                box-sizing: border-box;
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

            .open-btn {
                display: inline-block;
                background: #1a4480;
                color: #ffffff;
                padding: 6px 14px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 12px;
                white-space: nowrap;
                box-sizing: border-box;
                font-family: inherit;
            }

            .open-btn:hover {
                background: #0056b3;
                transform: scale(1.02);
                box-shadow: 0 4px 12px rgba(26, 68, 128, 0.3);
            }

            .open-btn i {
                margin-right: 4px;
            }

            .floating-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: #1a4480;
                color: #ffffff;
                border: none;
                border-radius: 50%;
                width: 44px;
                height: 44px;
                font-size: 18px;
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

            .loading-spinner {
                text-align: center;
                padding: 40px;
                grid-column: 1/-1;
            }

            .loading-spinner i {
                font-size: 40px;
                color: #1a4480;
                animation: spin 1s linear infinite;
            }

            .loading-spinner p {
                color: #555555;
                margin-top: 12px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .error-message {
                text-align: center;
                padding: 40px 20px;
                grid-column: 1/-1;
                background: #ffffff;
                border-radius: 10px;
                border: 1px solid #d0dbe8;
            }

            .error-message i {
                font-size: 48px;
                color: #e74c3c;
                display: block;
                margin-bottom: 15px;
            }

            .error-message h3 {
                color: #e74c3c;
                font-size: 20px;
                margin-bottom: 8px;
            }

            .error-message p {
                color: #555555;
                margin-bottom: 15px;
            }

            .error-message .refresh-btn {
                padding: 10px 30px;
                background: #1a4480;
                color: #ffffff;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
                margin: 4px;
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

            /* Responsive */
            @media (max-width: 1024px) {
                .content-cards { grid-template-columns: repeat(3, 1fr); gap: 14px; }
            }
            @media (max-width: 900px) {
                .content-cards { grid-template-columns: repeat(2, 1fr); gap: 14px; }
                .card { padding: 14px; min-height: 160px; }
                .card h3 { font-size: 14px; }
                .card .card-description { font-size: 12px; }
                .card .card-access-info { font-size: 12px; }
                .card-icon { font-size: 24px; }
                .extra-details-btn { font-size: 16px; }
                .lock-icon { font-size: 15px; }
                .card-actions .card-price { font-size: 13px; }
                .purchase-btn, .open-btn { font-size: 11px; padding: 5px 12px; }
            }
            @media (max-width: 600px) {
                .content-cards { grid-template-columns: 1fr; gap: 12px; padding: 8px 0; }
                .card { padding: 14px; min-height: auto; }
                .store-btn { padding: 8px 14px; font-size: 13px; }
                .store-title { font-size: 19px; }
                .card h3 { font-size: 15px; }
                .card .card-description { font-size: 13px; }
                .card .card-access-info { font-size: 13px; }
                .card-actions .card-price { font-size: 14px; }
                .purchase-btn, .open-btn { padding: 6px 14px; font-size: 12px; }
                .card-icon { font-size: 26px; }
                .extra-details-btn { font-size: 18px; }
                .lock-icon { font-size: 16px; }
                .floating-btn { width: 40px; height: 40px; font-size: 16px; bottom: 20px; right: 20px; }
            }
            @media (max-width: 400px) {
                .content-cards { gap: 10px; padding: 5px 0; }
                .card { padding: 12px; }
                .card h3 { font-size: 14px; }
                .card .card-description { font-size: 12px; }
                .card .card-access-info { font-size: 12px; }
                .card-actions .card-price { font-size: 13px; }
                .purchase-btn, .open-btn { padding: 5px 12px; font-size: 11px; }
                .card-icon { font-size: 22px; }
                .extra-details-btn { font-size: 16px; }
                .store-btn { padding: 6px 12px; font-size: 12px; }
                .store-title { font-size: 17px; }
                .lock-icon { font-size: 14px; }
                .floating-btn { width: 36px; height: 36px; font-size: 14px; bottom: 15px; right: 15px; }
                .rx-resource-header h2 { font-size: 22px; }
            }
        `;

        if (!document.getElementById('rx-resource-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'rx-resource-styles';
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }

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

        function setupScrollButton() {
            const scrollBtn = document.getElementById('scroll-to-top');
            if (!scrollBtn) return;
            
            const handler = function() {
                scrollBtn.classList.toggle('hidden', window.pageYOffset <= 300);
            };
            
            window.removeEventListener('scroll', handler);
            window.addEventListener('scroll', handler);
            handler();
        }

        function initializeResources() {
            console.log(" Initializing resources...");

            if (typeof StoreManager === 'undefined' || StoreManager === null) {
                console.warn(" StoreManager not ready, retrying...");
                return false;
            }

            if (typeof StoreManager.initializeStores !== 'function') {
                console.error(" StoreManager.initializeStores is not a function");
                return false;
            }

            try {
                StoreManager.initializeStores();
                console.log(" Resources loaded successfully!");
                setupScrollButton();
                return true;
            } catch (error) {
                console.error(" Error loading resources:", error);
                return false;
            }
        }

        if (initializeResources()) {
            return;
        }

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
    };

    function autoInit() {
        const displayArea = document.getElementById('rxDisplayArea');
        if (displayArea && typeof window.rxLoadResourcePage === 'function') {
            if (!displayArea.querySelector('#rx-resource-container')) {
                console.log(" Auto-initializing resource page...");
                window.rxLoadResourcePage(displayArea);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }

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

    console.log(" RX-WEB-RESOURCE-HTML-CONENT loaded successfully");
})();