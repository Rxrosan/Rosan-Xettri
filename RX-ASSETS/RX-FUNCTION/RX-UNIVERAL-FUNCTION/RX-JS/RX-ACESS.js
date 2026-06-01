// RX-ACESS.js - Optimized Dynamic Content Loader with Redirect
(function() {
    "use strict";

    const contentMapping = {
        'file1': { path: 'RX-ASSETS/RX-FUNCTION/RX-UNIVERAL-FUNCTION/RX-JS/RX-SMART-BUTTON.js', type: 'js' },
        'file2': { path: 'RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-1-FILES/RX-EXAM-FUNCTION-JS/questions-manager.js', type: 'js' },
        'file3': { path: 'RX-ASSETS/RX-OTHER-SOFTWARE-FUNCTION/RX-JS/RX-SMART-QR-GENATOR.js', type: 'js' },
        'file4': { path: 'RX-ASSETS/RX-FUNCTION/RX-UNIVERAL-FUNCTION/RX-JS/RX-SMART-BUTTON.js', type: 'js' },
        'file5': { path: 'RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-2-FILES/RX-KR-EXAM-QUESTIONS-MODEL-2/SET-1.js', type: 'js' },
        'file6': { path: 'RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-2-FILES/RX-KR-EXAM-QUESTIONS-MODEL-2/SET-2.js', type: 'js' },
        'file7': { path: 'RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-2-FILES/RX-KR-EXAM-QUESTIONS-MODEL-2/SET-3.js', type: 'js' },
    };

    const LOCAL_STORAGE_CONTENT_KEY = 'activeContentId';
    const LOCAL_STORAGE_USER_KEY = 'currentUser';

    function getQueryParameter(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve(src);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }

    function loadHTML(src, target) {
        return fetch(src)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
                return response.text();
            })
            .then(html => {
                const container = document.getElementById(target);
                if (container) {
                    container.innerHTML = html;
                    return src;
                }
                throw new Error(`Target ${target} not found.`);
            });
    }

    /**
     * DISPLAYS ERROR CENTERED ON SCREEN
     */
    function displayError(title, message) {
        const errHtml = `
            <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; z-index: 9999; font-family: 'Segoe UI', Roboto, sans-serif;">
                <div style="text-align: center; padding: 40px; border: 1px solid #ffcc00; background-color: #fffacd; border-radius: 12px; color: #333; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                    <h2 style="color: #da7f00; margin-top: 0;">${title}</h2>
                    <p style="font-size: 1.2em; line-height: 1.5; color: #444;">${message}</p>
                    <div style="margin-top: 20px; font-size: 0.9em; color: #777;">
                        RX STUDIO
                    </div>
                </div>
            </div>`;
        
        // Use document.documentElement to ensure it overwrites the whole view immediately
        document.documentElement.innerHTML = errHtml;
    }

    function cleanUrl() {
        if (window.history.replaceState) {
            const cleanPath = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanPath }, '', cleanPath);
        }
    }

    function getPersistentContentId() {
        const urlId = getQueryParameter('content') || getQueryParameter('exam');
        if (urlId) {
            localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, urlId);
            return urlId;
        }
        return localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
    }

    function clearPersistentContentId() {
        localStorage.removeItem(LOCAL_STORAGE_CONTENT_KEY);
    }

    function hasAccessToFile(user, fileId) {
        if (!user) return false;
        // 1. Permanent Access
        if (user.access && user.access.includes(fileId)) return true;
        // 2. Timed Access
        const cfg = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
        if (cfg && cfg.startDate && cfg.duration) {
            const start = new Date(`${cfg.startDate}T00:00:00Z`).getTime();
            const end = start + (cfg.duration * 86400000);
            return end > Date.now();
        }
        return false;
    }

    window.clearActiveContent = clearPersistentContentId;

    /**
     * MAIN LOADER ENGINE
     */
    async function startLoading() {
        const selectedId = getPersistentContentId();
        
        if (!selectedId) {
            displayError("Selection Required", "Please select a valid exam or content to proceed.");
            setTimeout(() => { window.location.href = 'Resource.html'; }, 3000);
            return;
        }

        const config = contentMapping[selectedId];
        if (!config) {
            displayError("Invalid Content", "The requested content does not exist.");
            clearPersistentContentId();
            setTimeout(() => { window.location.href = 'Resource.html'; }, 3000);
            return;
        }

        // --- BLOCK LOGIC FOR NO ACCESS ---
        const userStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        const user = userStr ? JSON.parse(userStr) : null;

        if (!user || !hasAccessToFile(user, selectedId)) {
            // Block and Show Centered Message
            displayError("Access Denied", "You do not have permission to view this content or your access has expired.");
            
            // Clear storage so they don't get stuck in a loop
            clearPersistentContentId();

            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = 'Resource.html';
            }, 3000);
            
            return; // Stop execution completely
        }

        // --- LOADING LOGIC ---
        try {
            if (config.type === 'js') {
                await loadScript(config.path);
            } else if (config.type === 'html') {
                if (document.readyState === 'loading') {
                    await new Promise(r => document.addEventListener('DOMContentLoaded', r));
                }
                await loadHTML(config.path, config.target);
            }
            cleanUrl();
        } catch (err) {
            displayError("Load Failure", "The system could not load the requested file.");
            clearPersistentContentId();
            setTimeout(() => { window.location.href = 'Resource.html'; }, 3000);
        }
    }

    // Initialize
    startLoading();

})();