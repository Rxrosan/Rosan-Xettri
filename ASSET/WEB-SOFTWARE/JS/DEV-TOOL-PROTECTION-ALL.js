(function() {
    'use strict';
    
    // Configuration
    const config = {
        checkInterval: 1000,          // Check for devtools every second
        freezeOnDevTools: true,       // Freeze website when devtools detected
        disableRightClick: true,      // Disable right-click context menu
        disableShortcuts: true        // Disable devtools keyboard shortcuts
    };

    let devToolsOpened = false;
    let freezeStyle = null;

    // Disable right-click context menu
    function disableRightClick() {
        if (!config.disableRightClick) return;
        
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        }, true);
    }

    // Disable devtools keyboard shortcuts
    function disableShortcuts() {
        if (!config.disableShortcuts) return;
        
        document.addEventListener('keydown', function(e) {
            // Block F12
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }
            
            // Block Ctrl+Shift+I (Chrome/Firefox), Ctrl+Shift+J (Chrome), Ctrl+Shift+C (Firefox)
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
                e.preventDefault();
                return false;
            }
            
            // Block Ctrl+U (View source)
            if (e.ctrlKey && e.key === 'U') {
                e.preventDefault();
                return false;
            }
        }, true);
    }

    // Freeze the entire website
    function freezeWebsite() {
        if (freezeStyle) return;
        
        freezeStyle = document.createElement('style');
        freezeStyle.id = '__devtools_freeze__';
        freezeStyle.textContent = `
            body * {
                pointer-events: none !important;
                user-select: none !important;
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
            }
            body {
                overflow: hidden !important;
                cursor: not-allowed !important;
            }
        `;
        document.head.appendChild(freezeStyle);
        
        // Disable scrolling
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    // Unfreeze the website
    function unfreezeWebsite() {
        if (!freezeStyle) return;
        
        try {
            freezeStyle.remove();
            freezeStyle = null;
            
            // Re-enable scrolling
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        } catch (e) {
            // Ignore errors during removal
        }
    }

    // Detect if devtools is open
    function detectDevTools() {
        try {
            // Method 1: Check window size difference
            const widthThreshold = 160;
            const heightThreshold = 160;
            
            if (window.outerWidth - window.innerWidth > widthThreshold || 
                window.outerHeight - window.innerHeight > heightThreshold) {
                return true;
            }
            
            // Method 2: Debugger timing detection
            const startTime = Date.now();
            debugger;
            if (Date.now() - startTime > 100) {
                return true;
            }
            
            return false;
        } catch (e) {
            return false;
        }
    }

    // Main protection function
    function initProtection() {
        // Apply initial protections
        disableRightClick();
        disableShortcuts();
        
        // Start monitoring for devtools
        const checkInterval = setInterval(() => {
            const isOpen = detectDevTools();
            
            if (isOpen && !devToolsOpened) {
                // Devtools just opened
                devToolsOpened = true;
                if (config.freezeOnDevTools) {
                    freezeWebsite();
                }
            } else if (!isOpen && devToolsOpened) {
                // Devtools just closed
                devToolsOpened = false;
                unfreezeWebsite();
            }
        }, config.checkInterval);
        
        // Return cleanup function (optional)
        return function stopProtection() {
            clearInterval(checkInterval);
            unfreezeWebsite();
        };
    }

    // Start protection when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    } else {
        initProtection();
    }
})();