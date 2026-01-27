(function () {
  const KEY = "__AUTO_ROUTE__";
  const DEBUG = false; // Set to true for debugging

  // Helper function for logging
  function log(...args) {
    if (DEBUG) {
      console.log("[RX-PATH-HIDE]", ...args);
    }
  }

  // Prevent multiple initializations
  if (window.__RX_PATH_HIDE_ACTIVE) {
    log("Script already active, skipping");
    return;
  }
  window.__RX_PATH_HIDE_ACTIVE = true;

  // Track loading state
  let isLoading = false;
  
  // Save original HTML structure for reference
  const originalHeadHTML = document.head.innerHTML;
  const originalBodyHTML = document.body.innerHTML;

  // 1. Save current path if not root
  const fullPath = location.pathname + location.search + location.hash;
  const isRoot = fullPath === "/" || fullPath === "" || fullPath === "/index.html";

  if (!isRoot) {
    log("Saving current path:", fullPath);
    try {
      sessionStorage.setItem(KEY, fullPath);
      if (!sessionStorage.getItem("__RX_LOADING__")) {
        history.replaceState({ rpHide: true }, "", "/");
      }
    } catch (e) {
      console.error("Failed to save route:", e);
    }
  }

  // 2. Smart content extraction - NO ASSUMPTIONS NEEDED
  function extractContentFromHTML(html) {
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(html, "text/html");
    
    // Get all content between <body> tags
    const newBodyHTML = newDoc.body.innerHTML;
    
    // Keep original head structure (CSS/JS files) and only update body
    return {
      title: newDoc.title,
      bodyHTML: newBodyHTML
    };
  }

  // 3. Preserve all existing scripts and styles
  function preserveExistingResources() {
    // This keeps all loaded resources intact
    // We're NOT touching the head or any script tags
    
    // Just ensure our script doesn't break other scripts
    const allScripts = document.querySelectorAll('script[src]');
    allScripts.forEach(script => {
      if (!script.hasAttribute('data-rx-preserved')) {
        script.setAttribute('data-rx-preserved', 'true');
      }
    });
  }

  // 4. Show loading indicator that doesn't break layout
  function showLoadingIndicator() {
    // Create a subtle overlay
    const overlay = document.createElement('div');
    overlay.id = 'rx-loading-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      z-index: 999999;
      animation: rx-loading 2s infinite;
    `;
    
    // Add animation style if not exists
    if (!document.querySelector('#rx-loading-style')) {
      const style = document.createElement('style');
      style.id = 'rx-loading-style';
      style.textContent = `
        @keyframes rx-loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(overlay);
  }

  function hideLoadingIndicator() {
    const overlay = document.getElementById('rx-loading-overlay');
    if (overlay) overlay.remove();
  }

  // 5. Enhanced link interception
  document.addEventListener("click", function (e) {
    if (isLoading) {
      e.preventDefault();
      return;
    }

    let link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    const target = link.getAttribute("target");

    // Skip links that shouldn't be intercepted
    if (!href || 
        href.includes("://") || // Any protocol (http://, https://, ftp://, etc.)
        href.startsWith("//") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.startsWith("javascript:") ||
        (target && target !== "_self") ||
        link.hasAttribute("download") ||
        link.classList.contains("external") ||
        link.getAttribute("rel") === "external" ||
        link.hasAttribute("data-no-intercept")) {
      return;
    }

    e.preventDefault();
    log("Intercepted link:", href);

    try {
      sessionStorage.setItem("__RX_LOADING__", "true");
      sessionStorage.setItem(KEY, href);
      history.replaceState({ rpHide: true }, "", "/");
      loadRouteContent(href);
    } catch (error) {
      console.error("Failed to process link:", error);
      // Fallback to normal navigation
      window.location.href = href;
    }
  });

  // 6. MAIN FUNCTION: Load content without breaking anything
  function loadRouteContent(route) {
    if (isLoading || !route || route === "/") {
      removeLoadingFlag();
      return;
    }

    isLoading = true;
    showLoadingIndicator();
    log("Loading content from:", route);

    // Preserve all current resources
    preserveExistingResources();

    fetch(route)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("text/html")) {
          throw new Error("Not HTML content");
        }
        
        return res.text();
      })
      .then(html => {
        // Extract only what we need
        const { title, bodyHTML } = extractContentFromHTML(html);
        
        // Fade out current content smoothly
        document.body.style.opacity = "0.7";
        document.body.style.transition = "opacity 0.2s";
        
        setTimeout(() => {
          // Replace ONLY the body content
          document.body.innerHTML = bodyHTML;
          
          // Restore opacity
          document.body.style.opacity = "1";
          
          // Update page title
          if (title && title !== document.title) {
            document.title = title;
          }
          
          // Re-run any initialization scripts if they exist
          if (window.initializePage) {
            try {
              window.initializePage();
            } catch (e) {
              console.warn("Custom initializePage failed:", e);
            }
          }
          
          // Dispatch event for other scripts
          window.dispatchEvent(new CustomEvent("routechanged", {
            detail: { route, title }
          }));
          
          log("Content loaded successfully");
          isLoading = false;
          hideLoadingIndicator();
          removeLoadingFlag();
          
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
      })
      .catch(error => {
        console.error("Failed to load route:", route, error);
        isLoading = false;
        hideLoadingIndicator();
        removeLoadingFlag();
        
        // Show error but don't break the page
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          background: #ff4444;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          z-index: 99999;
          max-width: 300px;
        `;
        errorDiv.innerHTML = `
          <strong>Failed to load page</strong><br>
          <small>${route}</small>
          <button onclick="this.parentElement.remove()" style="
            background: none;
            border: none;
            color: white;
            float: right;
            cursor: pointer;
          ">×</button>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remove error after 5 seconds
        setTimeout(() => {
          if (errorDiv.parentElement) {
            errorDiv.remove();
          }
        }, 5000);
      });
  }

  // 7. Handle browser navigation
  window.addEventListener("popstate", function () {
    if (isLoading) return;
    const route = sessionStorage.getItem(KEY) || "/";
    if (route !== "/") {
      loadRouteContent(route);
    }
  });

  // 8. Remove loading flag
  function removeLoadingFlag() {
    sessionStorage.removeItem("__RX_LOADING__");
  }

  // 9. Initial page load
  window.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
      const route = sessionStorage.getItem(KEY);
      const wasLoading = sessionStorage.getItem("__RX_LOADING__");
      
      log("Initial check - Route:", route, "Loading:", wasLoading);
      
      if (route && route !== "/" && !wasLoading) {
        loadRouteContent(route);
      }
      
      removeLoadingFlag();
    }, 100);
  });

  // 10. Handle form submissions
  document.addEventListener("submit", function (e) {
    if (isLoading) {
      e.preventDefault();
      return;
    }

    const form = e.target;
    if (form.tagName === "FORM" && form.method === "get") {
      const action = form.getAttribute("action") || "";
      if (action && !action.includes("://") && !action.startsWith("#")) {
        e.preventDefault();
        const params = new URLSearchParams(new FormData(form));
        const url = action + (params.toString() ? "?" + params.toString() : "");
        sessionStorage.setItem("__RX_LOADING__", "true");
        sessionStorage.setItem(KEY, url);
        history.replaceState({}, "", "/");
        loadRouteContent(url);
      }
    }
  });

  // 11. Listen for dynamic content additions
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        // New content was added, ensure our click handler works
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.tagName === 'A') { // Element node with A tag
            node.addEventListener('click', handleLinkClick);
          } else if (node.nodeType === 1 && node.querySelectorAll) {
            node.querySelectorAll('a').forEach(function(link) {
              link.addEventListener('click', handleLinkClick);
            });
          }
        });
      }
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Separate handler for dynamically added links
  function handleLinkClick(e) {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href.includes('://') || href.startsWith('#') || href.startsWith('mailto:')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    sessionStorage.setItem("__RX_LOADING__", "true");
    sessionStorage.setItem(KEY, href);
    history.replaceState({ rpHide: true }, "", "/");
    loadRouteContent(href);
  }

  log("RX-PATH-HIDE initialized - Automatic mode");
})();