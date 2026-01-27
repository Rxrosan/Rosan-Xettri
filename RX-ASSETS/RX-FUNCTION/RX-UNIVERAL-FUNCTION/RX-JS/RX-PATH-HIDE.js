(function () {
  const KEY = "__AUTO_ROUTE__";
  const DEBUG = true; // Set to false in production

  // Helper function for logging
  function log(...args) {
    if (DEBUG) {
      console.log("[RX-PATH-HIDE]", ...args);
    }
  }

  // 1. Check if we're already processing a route to prevent loops
  if (window.__RX_PATH_HIDE_ACTIVE) {
    log("Script already active, skipping");
    return;
  }
  window.__RX_PATH_HIDE_ACTIVE = true;

  // 2. Determine current path - handle different scenarios
  const fullPath = location.pathname + location.search + location.hash;
  const isRoot = fullPath === "/" || fullPath === "" || fullPath === "/index.html";

  // Save current path if not root
  if (!isRoot) {
    log("Saving current path:", fullPath);
    try {
      sessionStorage.setItem(KEY, fullPath);
      // Only replace state if we're not in a loading cycle
      if (!sessionStorage.getItem("__RX_LOADING__")) {
        history.replaceState({ rpHide: true }, "", "/");
      }
    } catch (e) {
      console.error("Failed to save route:", e);
    }
  }

  // 3. Intercept link clicks with improved detection
  document.addEventListener("click", function (e) {
    // Find the closest anchor tag
    let link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    const target = link.getAttribute("target");

    // Ignore external links, special protocols, anchors, and links with targets
    if (
      !href ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("//") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      (target && target !== "_self") ||
      link.hasAttribute("download") ||
      link.hasAttribute("data-no-route")
    ) {
      log("Ignoring link:", href);
      return;
    }

    e.preventDefault();
    log("Intercepted link click:", href);

    try {
      // Set loading flag to prevent state replacement on next load
      sessionStorage.setItem("__RX_LOADING__", "true");
      sessionStorage.setItem(KEY, href);
      
      // Update URL without reloading if possible
      history.replaceState({ rpHide: true }, "", "/");
      
      // Load the new content
      loadRoute(href);
    } catch (error) {
      console.error("Failed to process link click:", error);
      // Fallback: allow default navigation
      window.location.href = href;
    }
  });

  // 4. Handle browser back/forward navigation
  window.addEventListener("popstate", function (e) {
    log("Popstate event triggered");
    // When user navigates back/forward, we need to handle it
    const route = sessionStorage.getItem(KEY) || "/";
    loadRoute(route);
  });

  // 5. Improved route loading function
  function loadRoute(route) {
    if (!route || route === "/") {
      log("Loading root route");
      clearContentAndShowLoader();
      // For root, we might already be there, just ensure clean state
      removeLoadingFlag();
      return;
    }

    log("Loading route:", route);
    clearContentAndShowLoader();

    // Add a timeout for slow network conditions
    const timeoutId = setTimeout(() => {
      log("Route loading is taking longer than expected");
    }, 5000);

    fetch(route)
      .then(res => {
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("text/html")) {
          throw new Error("Response is not HTML");
        }
        
        return res.text();
      })
      .then(html => {
        // Parse the HTML and extract just the body content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        
        // Replace the entire document body
        document.body.innerHTML = doc.body.innerHTML;
        
        // Update the title if available
        if (doc.title) {
          document.title = doc.title;
        }
        
        // Re-initialize any scripts if needed
        reinitializeScripts(doc);
        
        log("Route loaded successfully");
        removeLoadingFlag();
        
        // Scroll to top after loading
        window.scrollTo(0, 0);
        
        // Dispatch a custom event for other scripts to hook into
        window.dispatchEvent(new CustomEvent("routechanged", {
          detail: { route }
        }));
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error("Failed to load route:", route, error);
        
        // Show error to user
        document.body.innerHTML = `
          <div style="padding: 40px; text-align: center; font-family: sans-serif;">
            <h2>Page Load Error</h2>
            <p>Failed to load: ${route}</p>
            <p><a href="/" style="color: blue; text-decoration: underline;">Return to homepage</a></p>
          </div>
        `;
        
        removeLoadingFlag();
      });
  }

  // 6. Helper functions
  function clearContentAndShowLoader() {
    // You can customize this loader as needed
    document.body.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: sans-serif;
      ">
        <div style="text-align: center;">
          <div style="
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          "></div>
          <p>Loading page...</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  function reinitializeScripts(newDoc) {
    // This function can be extended to reinitialize specific scripts
    // For now, we'll just re-add event listeners
    log("Reinitializing page scripts");
  }

  function removeLoadingFlag() {
    sessionStorage.removeItem("__RX_LOADING__");
  }

  // 7. Initial page load - check for saved route
  window.addEventListener("DOMContentLoaded", function () {
    // Small delay to ensure everything is ready
    setTimeout(() => {
      const route = sessionStorage.getItem(KEY);
      const isLoading = sessionStorage.getItem("__RX_LOADING__");
      
      log("Initial check - Route:", route, "Loading:", isLoading);
      
      // Only load a route if we have one saved AND we're not already loading
      if (route && route !== "/" && !isLoading) {
        loadRoute(route);
      } else {
        removeLoadingFlag();
      }
    }, 100);
  });

  // 8. Prevent form submission from breaking the flow
  document.addEventListener("submit", function (e) {
    const form = e.target;
    if (form.tagName === "FORM" && form.method === "get") {
      // For GET forms, we should intercept like links
      const action = form.getAttribute("action") || "";
      if (action && !action.startsWith("http") && !action.startsWith("#")) {
        e.preventDefault();
        const params = new URLSearchParams(new FormData(form));
        const url = action + (params.toString() ? "?" + params.toString() : "");
        sessionStorage.setItem(KEY, url);
        history.replaceState({}, "", "/");
        loadRoute(url);
      }
    }
  });

  log("RX-PATH-HIDE initialized");
})();