/**
 * Advanced Developer Mode Protection System (Fully Fixed Version)
 * - Properly structured protection methods
 * - Handles DOM readiness correctly
 * - Includes all required functions
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
        redirectOnPersistentAttempt: true, // Redirect after multiple attempts
        redirectUrl: '/access-denied', // Redirect URL
        localStorageKey: 'devToolsProtectionData', // localStorage key
        resetTimeout: 3600000,         // 1 hour reset timeout (ms)
        warningMessages: [
            "Warning: Developer tools are restricted on this site.",
            "Final warning: Continued attempts may result in restricted access.",
            "Access denied: Developer tools detected multiple times."
        ]
    };

    // Wait for DOM to be fully loaded before executing
    function initProtection() {
        // Load persistent state from localStorage
        let persistentState = JSON.parse(localStorage.getItem(config.localStorageKey)) || {
            warningCount: 0,
            lastDetectionTime: 0,
            protectionActive: true,
            devToolsOpened: false
        };

        // Reset if timeout has passed
        if (Date.now() - persistentState.lastDetectionTime > config.resetTimeout) {
            persistentState = {
                warningCount: 0,
                lastDetectionTime: 0,
                protectionActive: true,
                devToolsOpened: false
            };
        }

        // Create warning element
        const warningElement = document.createElement('div');
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
        
        // Safely append to body
        if (document.body) {
            document.body.appendChild(warningElement);
        } else {
            // Fallback in case body isn't available yet
            document.addEventListener('DOMContentLoaded', function() {
                document.body.appendChild(warningElement);
            });
        }

        // Protection methods - now fully defined before being called
        const protectionMethods = {
            // Save state to localStorage
            saveState: function() {
                localStorage.setItem(
                    config.localStorageKey,
                    JSON.stringify(persistentState)
                );
            },

            // Method 1: Detect dev tools by size difference
            detectSizeDifference: function() {
                const widthThreshold = window.outerWidth - window.innerWidth > 160;
                const heightThreshold = window.outerHeight - window.innerHeight > 160;
                return widthThreshold || heightThreshold;
            },

            // Method 2: Detect dev tools by debugger statement
            detectDebugger: function() {
                let detected = false;
                const startTime = new Date().getTime();
                (function() {
                    debugger;
                    const endTime = new Date().getTime();
                    if (endTime - startTime > 100) {
                        detected = true;
                    }
                })();
                return detected;
            },

            // Method 3: Detect dev tools by function toString modification
            detectFunctionToString: function() {
                const element = document.createElement('div');
                element.toString = function() {
                    persistentState.devToolsOpened = true;
                    protectionMethods.saveState();
                    return '';
                };
                console.log(element);
                return persistentState.devToolsOpened;
            },

            // Method 4: Hide all assets
            hideAssets: function() {
                if (!config.enableAssetProtection) return;
                
                const style = document.createElement('style');
                style.id = 'devToolsProtectionStyle';
                style.textContent = `
                    body *:not(#devToolsWarning):not(script):not(style) {
                        visibility: hidden !important;
                        opacity: 0 !important;
                    }
                    body {
                        background: black !important;
                    }
                `;
                document.head.appendChild(style);
            },

            // Method 5: Show warning
            showWarning: function(message) {
                warningElement.textContent = message;
                warningElement.style.display = 'block';
                
                setTimeout(() => {
                    warningElement.style.display = 'none';
                }, 3000);
            },

            // Method 6: Redirect user
            redirectUser: function() {
                if (config.redirectOnPersistentAttempt) {
                    window.location.href = config.redirectUrl;
                }
            },

            // Method 7: Disable keyboard shortcuts
            disableShortcuts: function() {
                if (!config.disableShortcuts) return;
                
                document.addEventListener('keydown', function(e) {
                    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
                    if (e.key === 'F12' || 
                        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
                        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
                        (e.ctrlKey && e.shiftKey && e.key === 'C') || 
                        (e.ctrlKey && e.key === 'U')) {
                        e.preventDefault();
                        protectionMethods.handleDetection();
                        return false;
                    }
                });
            },

            // Method 8: Disable right click
            disableRightClick: function() {
                if (!config.disableRightClick) return;
                
                document.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    protectionMethods.handleDetection();
                    return false;
                });
            },

            // Method 9: Debugger protection (infinite loop)
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

            // Method 10: Blur protection
            blurProtection: function() {
                if (!config.enableBlurProtection) return;
                
                document.addEventListener('visibilitychange', function() {
                    if (document.hidden && !persistentState.devToolsOpened) {
                        persistentState.devToolsOpened = true;
                        persistentState.lastDetectionTime = Date.now();
                        protectionMethods.saveState();
                        protectionMethods.handleDetection();
                    }
                });
            },

            // Handle detection
            handleDetection: function() {
                if (!persistentState.protectionActive) return;
                
                persistentState.warningCount++;
                persistentState.devToolsOpened = true;
                persistentState.lastDetectionTime = Date.now();
                protectionMethods.saveState();
                
                // Show appropriate warning
                if (persistentState.warningCount <= config.warningCountLimit) {
                    const messageIndex = Math.min(persistentState.warningCount - 1, config.warningMessages.length - 1);
                    protectionMethods.showWarning(config.warningMessages[messageIndex]);
                }
                
                // Take action after warnings exceeded
                if (persistentState.warningCount >= config.warningCountLimit) {
                    protectionMethods.hideAssets();
                    protectionMethods.redirectUser();
                }
            }
        };

        // If previous detection was severe, apply protection immediately
        if (persistentState.warningCount >= config.warningCountLimit) {
            protectionMethods.hideAssets();
            warningElement.textContent = config.warningMessages[2];
            warningElement.style.display = 'block';
        }

        // Initialize protection features
        function startProtection() {
            // Add event listeners
            protectionMethods.disableShortcuts();
            protectionMethods.disableRightClick();
            protectionMethods.debuggerProtection();
            protectionMethods.blurProtection();
            
            // Continuous check for dev tools
            setInterval(function() {
                if (protectionMethods.detectSizeDifference() || 
                    protectionMethods.detectDebugger() || 
                    protectionMethods.detectFunctionToString()) {
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
                const styleElement = document.getElementById('devToolsProtectionStyle');
                if (styleElement) {
                    styleElement.remove();
                }
                protectionMethods.saveState();
            },
            reset: function() {
                persistentState = {
                    warningCount: 0,
                    lastDetectionTime: 0,
                    protectionActive: true,
                    devToolsOpened: false
                };
                protectionMethods.saveState();
                warningElement.style.display = 'none';
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
            }
        };

        // Make it harder to bypass by overriding console methods
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

        // Prevent localStorage clearing by watching for changes
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            if (key === config.localStorageKey) {
                return originalSetItem.apply(this, arguments);
            }
            protectionMethods.handleDetection();
            return originalSetItem.apply(this, arguments);
        };

        const originalRemoveItem = localStorage.removeItem;
        localStorage.removeItem = function(key) {
            if (key === config.localStorageKey) {
                protectionMethods.handleDetection();
                return;
            }
            return originalRemoveItem.apply(this, arguments);
        };

        const originalClear = localStorage.clear;
        localStorage.clear = function() {
            protectionMethods.handleDetection();
            return originalClear.apply(this, arguments);
        };
    }

    // Start the protection when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // DOM is already ready
        initProtection();
    } else {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', initProtection);
    }
})();