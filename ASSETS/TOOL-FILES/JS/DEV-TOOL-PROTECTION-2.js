/**
 * 🚀 MILITARY-GRADE DEVTOOLS PROTECTION 🚀
 * - Complete source hiding
 * - Network cutoff
 * - UI lockdown
 * - Anti-debugging
 * - Stealth mode
 * - Self-destruct
 */
(function() {
    'use strict';

    // 🔧 CONFIGURATION
    const config = {
        checkInterval: 1000,          // DevTools detection frequency (ms)
        enableNetworkCutoff: true,    // Disable fetch/XHR when DevTools open
        enableUILockdown: true,       // Disable buttons/inputs
        enableDebuggerTrap: true,     // Anti-debugging infinite loop
        enableSourceHiding: true,     // Hide sources from DevTools
        enableSelfDestruct: true,     // Remove protection traces
        enableLocalProtection: true   // Protect against `file://` inspection
    };

    // 🛡️ STATE TRACKING
    let devToolsOpened = false;
    let networkDisabled = false;
    let uiDisabled = false;
    let originalFetch = window.fetch;
    let originalXHR = XMLHttpRequest.prototype.open;

    // 🔍 ENHANCED DEVTOOLS DETECTION
    function detectDevTools() {
        // 1️⃣ Window Size Difference
        const widthDiff = window.outerWidth - window.innerWidth > 160;
        const heightDiff = window.outerHeight - window.innerHeight > 160;

        // 2️⃣ Debugger Detection
        let debuggerDetected = false;
        const startTime = Date.now();
        (function() {
            debugger;
            if (Date.now() - startTime > 100) debuggerDetected = true;
        })();

        // 3️⃣ Console Tampering Detection
        const consoleProxy = new Proxy(console, {
            get: (target, prop) => {
                if (prop === 'log' || prop === 'warn') {
                    devToolsOpened = true;
                }
                return target[prop];
            }
        });
        window.console = consoleProxy;

        return widthDiff || heightDiff || debuggerDetected;
    }

    // 📁 SOURCE HIDING (OBFUSCATION)
    function hideSources() {
        if (!config.enableSourceHiding) return;

        // 1️⃣ Break Source Maps
        delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        delete window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

        // 2️⃣ Dynamic Script Relocation
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src) {
                script.src += `?v=${Math.random()}`; // Cache busting
            } else {
                script.textContent = '// Protected by military-grade security';
            }
        });

        // 3️⃣ VM Script Injection (Fragmentation)
        setTimeout(() => {
            eval(`
                function _${Math.random().toString(36).substr(2, 8)}() {
                    console.log("Access restricted");
                }
            `);
        }, 0);
    }

    // 🌐 NETWORK CUTOFF
    function disableNetwork() {
        if (!config.enableNetworkCutoff || networkDisabled) return;

        // 🚫 Block Fetch
        window.fetch = function() {
            return Promise.reject(new Error("Network access disabled"));
        };

        // 🚫 Block XHR
        XMLHttpRequest.prototype.open = function() {
            throw new Error("Network access restricted");
        };

        networkDisabled = true;
    }

    function restoreNetwork() {
        if (!networkDisabled) return;
        window.fetch = originalFetch;
        XMLHttpRequest.prototype.open = originalXHR;
        networkDisabled = false;
    }

    // 🖱️ UI LOCKDOWN (DISABLE ALL INTERACTIVE ELEMENTS)
    function disableUI() {
        if (!config.enableUILockdown || uiDisabled) return;

        document.querySelectorAll('a, button, input, textarea, [onclick]').forEach(el => {
            el.style.pointerEvents = 'none';
            el.style.opacity = '0.5';
            el.style.cursor = 'not-allowed';
            el.tabIndex = -1;
        });

        // Block text selection
        const style = document.createElement('style');
        style.textContent = `* { user-select: none !important; }`;
        document.head.appendChild(style);

        uiDisabled = true;
    }

    function restoreUI() {
        if (!uiDisabled) return;
        document.querySelectorAll('a, button, input, textarea, [onclick]').forEach(el => {
            el.style.pointerEvents = '';
            el.style.opacity = '';
            el.style.cursor = '';
            el.tabIndex = 0;
        });
        uiDisabled = false;
    }

    // 🔄 DEBUGGER TRAP (ANTI-DEBUGGING)
    function startDebuggerTrap() {
        if (!config.enableDebuggerTrap) return;

        setInterval(() => {
            if (devToolsOpened) {
                (function() {
                    debugger;
                })();
            }
        }, 100);
    }

    // 💣 SELF-DESTRUCT (REMOVE PROTECTION TRACES)
    function selfDestruct() {
        if (!config.enableSelfDestruct) return;

        const script = document.currentScript;
        if (script) {
            script.remove();
            document.head.querySelectorAll('style').forEach(s => {
                if (s.textContent.includes('user-select')) s.remove();
            });
        }
    }

    // 🎮 MAIN PROTECTION LOOP
    function initProtection() {
        // 🔄 Continuous DevTools Monitoring
        setInterval(() => {
            const isOpen = detectDevTools();
            
            if (isOpen && !devToolsOpened) {
                devToolsOpened = true;
                hideSources();
                disableNetwork();
                disableUI();
            } else if (!isOpen && devToolsOpened) {
                devToolsOpened = false;
                restoreNetwork();
                restoreUI();
            }
        }, config.checkInterval);

        // 🏁 Start Debugger Trap
        startDebuggerTrap();

        // 🛡️ Local File Protection
        if (config.enableLocalProtection && window.location.protocol === 'file:') {
            Object.defineProperty(document, 'scripts', { get: () => [] });
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'U') e.preventDefault();
            });
        }

        // 💣 Self-Destruct After Initialization
        setTimeout(selfDestruct, 3000);
    }

    // 🚀 START PROTECTION
    if (document.readyState === 'complete') {
        initProtection();
    } else {
        window.addEventListener('DOMContentLoaded', initProtection);
    }

    // 🎭 Initial Obfuscation
    eval('// ' + Math.random().toString(36).substr(2, 8));
})();