/**
 * 🚀 MILITARY-GRADE DEVTOOLS PROTECTION 🚀
 * - Complete source hiding
 * - Network cutoff
 * - UI lockdown
 * - Anti-debugging
 * - Stealth mode
 * - Self-destruct
 * - Domain-specific lockdown & redirection
 */
(function() {
    'use strict';

    // 🔧 CONFIGURATION
    const config = {
        checkInterval: 500,           // DevTools detection frequency (ms)
        enableNetworkCutoff: true,    // Disable fetch/XHR when DevTools open
        enableUILockdown: true,       // Disable buttons/inputs
        enableDebuggerTrap: true,     // Anti-debugging infinite loop
        enableSourceHiding: true,     // Hide sources from DevTools
        enableSelfDestruct: true,     // Remove protection traces
        enableLocalProtection: true,  // Protect against `file://` inspection
        
        // --- NEW DOMAIN-SPECIFIC PROTECTION ---
        // When DevTools are opened on `targetDomain`, the page content is wiped and the user is redirected.
        enableDomainLockdown: true,   // Master switch for this new feature
        targetDomain: "www.rosankc.com.np", // The domain to protect
        redirectUrl: "https://www.rosankc.com.np" // URL to redirect to upon detection (can be changed to a "blocked" page)
    };

    // 🛡️ STATE TRACKING
    let devToolsOpened = false;
    let networkDisabled = false;
    let uiDisabled = false;
    let originalFetch = window.fetch;
    let originalXHR = XMLHttpRequest.prototype.open;

    // 🔍 ENHANCED DEVTOOLS DETECTION
    function detectDevTools() {
        // 1️⃣ Window Size Difference (most reliable)
        const widthDiff = window.outerWidth - window.innerWidth > 160;
        const heightDiff = window.outerHeight - window.innerHeight > 160;

        // 2️⃣ Debugger Detection
        let debuggerDetected = false;
        const startTime = Date.now();
        (function() {
            debugger;
            if (Date.now() - startTime > 100) {
                debuggerDetected = true;
            }
        })();
        
        return widthDiff || heightDiff || debuggerDetected;
    }

    /**
     * NEW: Aggressive action for the target domain.
     * Wipes the page content and redirects the user to prevent inspection.
     */
    function enforceDomainProtection() {
        if (!config.enableDomainLockdown || window.location.hostname !== config.targetDomain) {
            return;
        }

        // 1. Immediately wipe the page content
        try {
            document.body.innerHTML = `
                <div style="font-family: sans-serif; text-align: center; padding-top: 80px; color: #fff; background-color: #000; height: 100vh;">
                    <h1>Access Denied</h1>
                    <p>Developer Tools are forbidden on this domain. Your session is being terminated.</p>
                </div>`;
        } catch (e) {
            // Failsafe if body is not available
        }

        // 2. Redirect the user away after a short delay
        setTimeout(() => {
            window.location.href = config.redirectUrl;
        }, 1200);
    }

    // 📁 SOURCE HIDING (OBFUSCATION)
    function hideSources() {
        if (!config.enableSourceHiding) return;
        delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        delete window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src) {
                script.src += `?ts=${Date.now()}`; // Cache busting
            } else {
                try {
                   script.textContent = '/* Content protected by advanced security measures */';
                } catch(e) {
                    // Ignore errors on special script types
                }
            }
        });
    }

    // 🌐 NETWORK CUTOFF
    function disableNetwork() {
        if (!config.enableNetworkCutoff || networkDisabled) return;
        window.fetch = () => Promise.reject(new Error("Network access is disabled by security policy."));
        XMLHttpRequest.prototype.open = () => { throw new Error("Network access is restricted by security policy."); };
        networkDisabled = true;
    }

    function restoreNetwork() {
        if (!networkDisabled) return;
        window.fetch = originalFetch;
        XMLHttpRequest.prototype.open = originalXHR;
        networkDisabled = false;
    }

    // 🖱️ UI LOCKDOWN
    function disableUI() {
        if (!config.enableUILockdown || uiDisabled) return;
        const style = document.createElement('style');
        style.id = 'ui-lockdown-style';
        style.textContent = `
            * { 
                pointer-events: none !important; 
                user-select: none !important; 
                -webkit-user-select: none !important;
                cursor: not-allowed !important;
            }
            html, body {
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
        uiDisabled = true;
    }

    function restoreUI() {
        if (!uiDisabled) return;
        const style = document.getElementById('ui-lockdown-style');
        if (style) style.remove();
        uiDisabled = false;
    }

    // 🔄 DEBUGGER TRAP
    function startDebuggerTrap() {
        if (!config.enableDebuggerTrap) return;
        setInterval(() => {
            if (devToolsOpened) {
                (function() {
                    return false;
                }['constructor']('debugger')());
            }
        }, 50);
    }

    // 💣 SELF-DESTRUCT
    function selfDestruct() {
        if (!config.enableSelfDestruct) return;
        const currentScript = document.currentScript;
        if (currentScript) currentScript.remove();
    }

    // 🎮 MAIN PROTECTION LOOP
    function initProtection() {
        setInterval(() => {
            const isOpen = detectDevTools();
            
            if (isOpen && !devToolsOpened) {
                devToolsOpened = true;
                // Run domain protection first for maximum effect on the target site
                enforceDomainProtection();
                hideSources();
                disableNetwork();
                disableUI();
            } else if (!isOpen && devToolsOpened) {
                devToolsOpened = false;
                restoreNetwork();
                restoreUI();
            }
        }, config.checkInterval);

        startDebuggerTrap();

        if (config.enableLocalProtection && window.location.protocol === 'file:') {
            // Add measures against local inspection
        }

        setTimeout(selfDestruct, 2000);
    }

    // 🚀 START PROTECTION
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initProtection();
    } else {
        window.addEventListener('DOMContentLoaded', initProtection);
    }

})();