/**
 * Advanced Developer Mode Protection System
 * - Shows countdown timer instead of redirecting
 * - Persistent lockout state with visible timer
 * - Multiple detection methods with improved reliability
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        warningCountLimit: 3,          // Max warnings before action
        checkInterval: 1000,           // Dev tools check interval (ms)
        disableRightClick: true,       // Disable right-click context menu
        disableShortcuts: true,        // Disable dev tools shortcuts
        enableDebuggerProtection: true, // Debugger protection
        enableBlurProtection: true,    // Blur content when detected
        enableAssetProtection: true,   // Hide assets when detected
        lockoutDuration: 3600000,      // 1 hour lockout duration (ms)
        warningMessages: [
            "Warning: Developer tools are restricted on this site.",
            "Final warning: Continued attempts may result in restricted access.",
            "Access denied: Developer tools detected. You must wait %time% before continuing."
        ],
        lockoutMessage: "Access locked. Please wait %time% before trying again."
    };

    // Wait for DOM to be ready
    function initProtection() {
        // Load or initialize state
        let persistentState = JSON.parse(localStorage.getItem(config.localStorageKey)) || {
            warningCount: 0,
            lockoutEndTime: 0,
            protectionActive: true,
            devToolsOpened: false
        };

        // Create warning element
        const warningElement = document.createElement('div');
        warningElement.id = 'devToolsWarning';
        warningElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            padding: 15px;
            background-color: #ff0000;
            color: white;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            z-index: 999999;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            display: none;
        `;
        
        // Create countdown element
        const countdownElement = document.createElement('div');
        countdownElement.id = 'devToolsCountdown';
        countdownElement.style.cssText = `
            position: fixed;
            top: 40px;
            left: 0;
            width: 100%;
            padding: 10px;
            background-color: #990000;
            color: white;
            text-align: center;
            font-size: 16px;
            z-index: 999998;
            display: none;
        `;

        // Safely append to body
        if (document.body) {
            document.body.appendChild(warningElement);
            document.body.appendChild(countdownElement);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(warningElement);
                document.body.appendChild(countdownElement);
            });
        }

        // Protection methods
        const protectionMethods = {
            // Save state to localStorage
            saveState: function() {
                localStorage.setItem(
                    config.localStorageKey,
                    JSON.stringify(persistentState)
                );
            },

            // Format time from milliseconds to MM:SS
            formatTime: function(ms) {
                const minutes = Math.floor(ms / 60000);
                const seconds = Math.floor((ms % 60000) / 1000);
                return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            },

            // Update countdown display
            updateCountdown: function() {
                const remaining = Math.max(0, persistentState.lockoutEndTime - Date.now());
                const formattedTime = this.formatTime(remaining);
                
                if (remaining <= 0) {
                    countdownElement.style.display = 'none';
                    persistentState.warningCount = 0;
                    persistentState.lockoutEndTime = 0;
                    this.saveState();
                    return false;
                }
                
                countdownElement.textContent = config.lockoutMessage.replace('%time%', formattedTime);
                countdownElement.style.display = 'block';
                return true;
            },

            // Enhanced detection methods
            detectDevTools: function() {
                // Method 1: Detect by size difference
                const sizeDiffDetected = (() => {
                    const widthThreshold = window.outerWidth - window.innerWidth > 160;
                    const heightThreshold = window.outerHeight - window.innerHeight > 160;
                    return widthThreshold || heightThreshold;
                })();

                // Method 2: Detect by debugger statement
                const debuggerDetected = (() => {
                    let detected = false;
                    const startTime = Date.now();
                    (function() {
                        debugger;
                        if (Date.now() - startTime > 100) detected = true;
                    })();
                    return detected;
                })();

                return sizeDiffDetected || debuggerDetected;
            },

            // Hide all assets
            hideAssets: function() {
                if (!config.enableAssetProtection) return;
                
                const style = document.createElement('style');
                style.id = 'devToolsProtectionStyle';
                style.textContent = `
                    body *:not(#devToolsWarning):not(#devToolsCountdown):not(script):not(style) {
                        visibility: hidden !important;
                        opacity: 0 !important;
                    }
                    body {
                        background: black !important;
                    }
                `;
                document.head.appendChild(style);
            },

            // Show warning
            showWarning: function(message) {
                const remaining = Math.max(0, persistentState.lockoutEndTime - Date.now());
                const formattedTime = this.formatTime(remaining);
                
                warningElement.textContent = message.replace('%time%', formattedTime);
                warningElement.style.display = 'block';
                
                setTimeout(() => {
                    warningElement.style.display = 'none';
                }, 3000);
            },

            // Disable keyboard shortcuts
            disableShortcuts: function() {
                if (!config.disableShortcuts) return;
                
                document.addEventListener('keydown', function(e) {
                    // Block all common dev tools shortcuts
                    if (e.key === 'F12' || 
                        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || 
                        (e.ctrlKey && e.key === 'U') ||
                        (e.metaKey && e.altKey && e.key === 'I')) {
                        e.preventDefault();
                        protectionMethods.handleDetection();
                        return false;
                    }
                });
            },

            // Disable right click
            disableRightClick: function() {
                if (!config.disableRightClick) return;
                
                document.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    protectionMethods.handleDetection();
                    return false;
                });
            },

            // Debugger protection (infinite loop)
            debuggerProtection: function() {
                if (!config.enableDebuggerProtection) return;
                
                setInterval(function() {
                    if (persistentState.devToolsOpened) {
                        (function() {
                            debugger;
                        })();
                    }
                }, 100);
            },

            // Handle detection
            handleDetection: function() {
                if (!persistentState.protectionActive) return;
                
                persistentState.warningCount++;
                persistentState.devToolsOpened = true;
                this.saveState();
                
                // Show appropriate warning
                if (persistentState.warningCount <= config.warningCountLimit) {
                    const messageIndex = Math.min(persistentState.warningCount - 1, config.warningMessages.length - 1);
                    protectionMethods.showWarning(config.warningMessages[messageIndex]);
                }
                
                // Take action after warnings exceeded
                if (persistentState.warningCount >= config.warningCountLimit) {
                    persistentState.lockoutEndTime = Date.now() + config.lockoutDuration;
                    this.saveState();
                    protectionMethods.hideAssets();
                    
                    // Start countdown update interval
                    const countdownInterval = setInterval(() => {
                        if (!protectionMethods.updateCountdown()) {
                            clearInterval(countdownInterval);
                            // Restore access when time is up
                            const styleElement = document.getElementById('devToolsProtectionStyle');
                            if (styleElement) {
                                styleElement.remove();
                            }
                        }
                    }, 1000);
                }
            }
        };

        // Check if currently locked out
        if (persistentState.lockoutEndTime > Date.now()) {
            protectionMethods.hideAssets();
            protectionMethods.updateCountdown();
            
            // Start countdown update interval
            const countdownInterval = setInterval(() => {
                if (!protectionMethods.updateCountdown()) {
                    clearInterval(countdownInterval);
                    // Restore access when time is up
                    const styleElement = document.getElementById('devToolsProtectionStyle');
                    if (styleElement) {
                        styleElement.remove();
                    }
                }
            }, 1000);
        }

        // Initialize protection features
        function startProtection() {
            // Add event listeners
            protectionMethods.disableShortcuts();
            protectionMethods.disableRightClick();
            protectionMethods.debuggerProtection();
            
            // Continuous check for dev tools
            setInterval(function() {
                if (protectionMethods.detectDevTools()) {
                    protectionMethods.handleDetection();
                }
            }, config.checkInterval);
        }

        // Start protection
        startProtection();

        // Public API
        window.devToolsProtection = {
            enable: function() {
                persistentState.protectionActive = true;
                protectionMethods.saveState();
            },
            disable: function() {
                persistentState.protectionActive = false;
                warningElement.style.display = 'none';
                countdownElement.style.display = 'none';
                const styleElement = document.getElementById('devToolsProtectionStyle');
                if (styleElement) {
                    styleElement.remove();
                }
                protectionMethods.saveState();
            },
            reset: function() {
                persistentState = {
                    warningCount: 0,
                    lockoutEndTime: 0,
                    protectionActive: true,
                    devToolsOpened: false
                };
                protectionMethods.saveState();
                warningElement.style.display = 'none';
                countdownElement.style.display = 'none';
                const styleElement = document.getElementById('devToolsProtectionStyle');
                if (styleElement) {
                    styleElement.remove();
                }
            },
            isActive: function() {
                return persistentState.protectionActive;
            },
            getWarningCount: function() {
                return persistentState.warningCount;
            },
            getRemainingLockoutTime: function() {
                return Math.max(0, persistentState.lockoutEndTime - Date.now());
            }
        };

        // Override console methods
        if (window.console) {
            const consoleMethods = ['log', 'warn', 'error', 'info', 'debug', 'table', 'dir'];
            consoleMethods.forEach(method => {
                const original = console[method];
                console[method] = function() {
                    if (persistentState.devToolsOpened) {
                        protectionMethods.handleDetection();
                    }
                    original.apply(console, arguments);
                };
            });
        }
    }

    // Start protection when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initProtection();
    } else {
        document.addEventListener('DOMContentLoaded', initProtection);
    }
})();