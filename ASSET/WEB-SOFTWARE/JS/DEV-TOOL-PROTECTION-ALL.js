/**
 * MERGED DEVTOOLS PROTECTION
 * - Combines DEV-TOOL-PROTECTION-1.js and DEV-TOOL-PROTECTION-2.js
 * - Auto-detects domain when requested
 * - Multiple detection heuristics
 * - Safe network/UI restore, configurable self-destruct
 *
 * NOTE: Client-side protections are inherently imperfect. This raises the bar
 * but cannot stop a determined attacker. Use server-side controls & headers too.
 */
(function() {
  'use strict';

  // -------- CONFIGURATION --------
  const config = {
    checkInterval: 700,             // ms between devtools checks
    enableNetworkCutoff: true,      // disable fetch/XHR when devtools open
    enableUILockdown: true,         // disable interactive elements
    enableDebuggerTrap: false,      // VERY aggressive; default OFF (infinite loops hang)
    enableSourceHiding: true,       // attempt to make sources harder to read
    enableSelfDestruct: true,       // remove traces after initTimeout ms
    selfDestructDelay: 3000,        // ms before self-destruct runs
    enableLocalProtection: true,    // special behavior when loaded via file://
    enableRightClickBlock: true,    // block context menu
    enableShortcutBlock: true,      // block DevTools keyboard shortcuts

    // Domain lockdown options
    enableDomainLockdown: true,     // if true, wipe + redirect when devtools open on protected domain
    targetDomain: 'auto',           // 'auto' uses current hostname, or supply a host string like 'example.com'
    redirectUrl: null,              // if null and targetDomain is 'auto' redirect to same origin (https)
    lockdownDelayBeforeRedirect: 1200 // ms delay before redirect after wiping
  };

  // -------- INTERNAL STATE --------
  let devToolsOpened = false;
  let networkDisabled = false;
  let uiDisabled = false;
  let originals = {
    fetch: window.fetch,
    xhrOpen: XMLHttpRequest.prototype.open,
    addEventListener: window.addEventListener
  };
  let uiLockStyleEl = null;
  let consoleBackup = null;
  const hostname = window.location.hostname || '';

  // If targetDomain is 'auto', set to current hostname
  if (config.targetDomain === 'auto') {
    config.targetDomain = hostname;
    if (!config.redirectUrl) {
      // default redirect to same origin using https if available
      config.redirectUrl = `${window.location.protocol}//${window.location.hostname}`;
    }
  } else {
    if (!config.redirectUrl) {
      // default redirect to target domain with https
      config.redirectUrl = `https://${config.targetDomain}`;
    }
  }

  // -------- DETECTION HELPERS --------
  function detectByWindowSizes() {
    try {
      return (window.outerWidth - window.innerWidth > 160) || (window.outerHeight - window.innerHeight > 160);
    } catch (e) {
      return false;
    }
  }

  // debugger timing check
  function detectByDebuggerTiming(timeout = 120) {
    try {
      const start = Date.now();
      // small inline debugger execution
      // note: in some browsers this will pause the JS engine if devtools are open
      (function() { debugger; })();
      return (Date.now() - start) > timeout;
    } catch (e) {
      // Access to debugger triggered exception in some contexts
      return false;
    }
  }

  // Measure how long it takes to stringify a function (devtools sometimes modifies toString)
  function detectByFunctionToString() {
    try {
      const f = function() { /* noop */ };
      const s = f.toString();
      // some devtools change toString or annotate it; heuristic only
      return (typeof s !== 'string' || s.length > 2000);
    } catch (e) {
      return false;
    }
  }

  // using element measured width trick (fast)
  function detectByElementResizeProbe() {
    try {
      const probeId = '__dt_probe__';
      let el = document.getElementById(probeId);
      if (!el) {
        el = document.createElement('div');
        el.id = probeId;
        el.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;z-index:99999999';
        document.documentElement.appendChild(el);
      }
      const rect = el.getBoundingClientRect();
      // If devtools panel is open, available visual viewport changes and sometimes rect differs
      return (rect.width === 0 && rect.height === 0) ? false : false;
    } catch (e) {
      return false;
    }
  }

  // Aggregate detection; returns true if any heuristic passes
  function detectDevTools() {
    // combine fast heuristics first
    if (detectByWindowSizes()) return true;

    // run debugger timing check but keep it short to avoid big delays
    if (detectByDebuggerTiming(120)) return true;

    // additional heuristics (less reliable, but helpful)
    if (detectByFunctionToString()) return true;

    // final fallback
    return false;
  }

  // -------- SOURCE HIDING (best-effort; doesn't replace real obfuscation) --------
  function hideSources() {
    if (!config.enableSourceHiding) return;
    try {
      // Remove common devtools hooks
      try { delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__; } catch (e) {}
      try { delete window.__VUE_DEVTOOLS_GLOBAL_HOOK__; } catch (e) {}

      // add cache-busting query param to external scripts
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(s => {
        try {
          const src = s.getAttribute('src') || '';
          if (!src.includes('_dt_protect=')) {
            const sep = src.includes('?') ? '&' : '?';
            s.setAttribute('src', src + sep + '_dt_protect=' + Date.now());
          }
        } catch (e) { /* ignore */ }
      });

      // optionally inject a tiny VM function to confuse cursory inspection
      setTimeout(() => {
        try { /* eslint-disable no-eval */
          eval('function _' + Math.random().toString(36).substr(2, 8) + '(){/* protected */}');
        } catch (e) {}
      }, 0);
    } catch (e) { /* swallow */ }
  }

  // -------- NETWORK CUT-OFF (save originals, safely restore) --------
  function disableNetwork() {
    if (!config.enableNetworkCutoff || networkDisabled) return;
    try {
      originals.fetch = window.fetch;
      originals.xhrOpen = XMLHttpRequest.prototype.open;

      window.fetch = function() {
        return Promise.reject(new Error('Network access disabled by security policy'));
      };

      XMLHttpRequest.prototype.open = function() {
        throw new Error('Network access restricted by security policy');
      };

      networkDisabled = true;
    } catch (e) { /* swallow but mark */ networkDisabled = true; }
  }

  function restoreNetwork() {
    try {
      if (!networkDisabled) return;
      if (originals.fetch) window.fetch = originals.fetch;
      if (originals.xhrOpen) XMLHttpRequest.prototype.open = originals.xhrOpen;
      networkDisabled = false;
    } catch (e) { /* swallow */ networkDisabled = false; }
  }

  // -------- UI LOCKDOWN (adds/removes style element) --------
  function disableUI() {
    if (!config.enableUILockdown || uiDisabled) return;
    try {
      uiLockStyleEl = document.createElement('style');
      uiLockStyleEl.id = '__dt_ui_lock__';
      uiLockStyleEl.textContent = `
        * { pointer-events: none !important; user-select: none !important; -webkit-user-select: none !important; cursor: not-allowed !important; }
        html, body { opacity: 0.75 !important; }
      `;
      (document.head || document.documentElement).appendChild(uiLockStyleEl);

      // additionally dim interactive elements for older browsers
      document.querySelectorAll('a, button, input, textarea, [onclick]').forEach(el => {
        try {
          el.setAttribute('data-dt-locked', '1');
          el.tabIndex = -1;
        } catch (e) {}
      });

      uiDisabled = true;
    } catch (e) { /* swallow */ uiDisabled = true; }
  }

  function restoreUI() {
    try {
      if (!uiDisabled) return;
      const el = document.getElementById('__dt_ui_lock__');
      if (el) el.remove();
      document.querySelectorAll('[data-dt-locked]').forEach(n => {
        try { n.removeAttribute('data-dt-locked'); n.tabIndex = 0; } catch (e) {}
      });
      uiDisabled = false;
    } catch (e) { uiDisabled = false; }
  }

  // -------- RIGHT-CLICK & SHORTCUTS --------
  function blockRightClick() {
    if (!config.enableRightClickBlock) return;
    document.addEventListener('contextmenu', preventHandler, true);
  }
  function unblockRightClick() {
    document.removeEventListener('contextmenu', preventHandler, true);
  }
  function preventHandler(e) {
    e.preventDefault();
    return false;
  }

  function blockShortcuts() {
    if (!config.enableShortcutBlock) return;
    document.addEventListener('keydown', shortcutHandler, true);
  }
  function unblockShortcuts() {
    document.removeEventListener('keydown', shortcutHandler, true);
  }
  function shortcutHandler(e) {
    // Block F12, Ctrl+Shift+I/J/C and Ctrl+U
    if (e.key === 'F12') { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.key === 'U') { e.preventDefault(); return false; }
  }

  // -------- DOMAIN LOCKDOWN (wipe + redirect) --------
  function enforceDomainProtection() {
    if (!config.enableDomainLockdown) return;
    if (!config.targetDomain) return;
    try {
      // only enforce on the configured protected host
      if (window.location.hostname !== config.targetDomain) return;

      // wipe page content
      try {
        document.documentElement.innerHTML = `
          <head><meta charset="utf-8"><title>Access Denied</title></head>
          <body style="background:#000;color:#fff;font-family:system-ui, Arial, sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
            <div style="text-align:center;">
              <h1 style="margin:0;font-size:28px;">Access Denied</h1>
              <p style="opacity:0.85">Developer Tools prohibited on this domain. Your session will be terminated.</p>
            </div>
          </body>
        `;
      } catch (e) {
        // fallback: try to replace body
        try {
          document.body.innerHTML = '<div style="padding:40px;color:#fff;background:#000;">Access Denied: Developer Tools forbidden</div>';
        } catch (e2) {}
      }

      // redirect after delay
      setTimeout(() => {
        try {
          if (config.redirectUrl) {
            window.location.href = config.redirectUrl;
          } else {
            window.location.href = window.location.origin;
          }
        } catch (e) {}
      }, Math.max(200, config.lockdownDelayBeforeRedirect));
    } catch (e) { /* swallow */ }
  }

  // -------- DEBUGGER TRAP (optional) --------
  function startDebuggerTrap() {
    if (!config.enableDebuggerTrap) return;
    // WARNING: this can hang the page if devtools are open; use only if you understand consequences
    setInterval(() => {
      if (devToolsOpened) {
        try {
          // attempt to spin the debugger call in a safe-ish way; keep short
          new Function('debugger')();
        } catch (e) {}
      }
    }, 100);
  }

  // -------- SELF DESTRUCT (remove traces) --------
  function selfDestruct() {
    if (!config.enableSelfDestruct) return;
    try {
      // Remove inline style added for UI lock
      try { const el = document.getElementById('__dt_ui_lock__'); if (el) el.remove(); } catch (e) {}
      // Remove probe element if present
      try { const probe = document.getElementById('__dt_probe__'); if (probe) probe.remove(); } catch (e) {}
      // Remove any tiny VM injected script tags (best effort)
      try {
        document.querySelectorAll('script').forEach(s => {
          try {
            if (s.textContent && s.textContent.includes('_dt_protect')) s.remove();
          } catch (e) {}
        });
      } catch (e) {}
      // Attempt to remove this script node itself
      try {
        const current = document.currentScript;
        if (current) current.remove();
      } catch (e) {}
    } catch (e) { /* swallow */ }
  }

  // -------- MAIN LOOP --------
  function initProtection() {
    // apply baseline blocking handlers
    if (config.enableRightClickBlock) blockRightClick();
    if (config.enableShortcutBlock) blockShortcuts();

    // start optional debugger trap
    startDebuggerTrap();

    // periodic check
    const timer = setInterval(() => {
      let isOpen = false;
      try {
        isOpen = detectDevTools();
      } catch (e) {
        isOpen = false;
      }

      if (isOpen && !devToolsOpened) {
        devToolsOpened = true;
        try {
          // domain-first action (aggressive)
          if (config.enableDomainLockdown && (window.location.hostname === config.targetDomain)) {
            enforceDomainProtection();
          } else {
            // if not locked to domain, apply other protections
            hideSources();
            if (config.enableNetworkCutoff) disableNetwork();
            if (config.enableUILockdown) disableUI();
          }
        } catch (e) { /* swallow */ }
      } else if (!isOpen && devToolsOpened) {
        // restore when devtools close
        devToolsOpened = false;
        try {
          restoreNetwork();
          restoreUI();
        } catch (e) {}
      }
    }, Math.max(200, config.checkInterval));

    // local file protections
    if (config.enableLocalProtection && window.location.protocol === 'file:') {
      try {
        Object.defineProperty(document, 'scripts', { get: () => [] });
        document.addEventListener('keydown', (e) => {
          if (e.ctrlKey && e.key === 'U') e.preventDefault();
        }, true);
      } catch (e) {}
    }

    // self destruct after configured delay (remove some traces so script can't be trivially found)
    if (config.enableSelfDestruct) {
      setTimeout(() => {
        try {
          selfDestruct();
        } catch (e) {}
      }, Math.max(0, config.selfDestructDelay));
    }

    // return a cleanup handle if ever needed
    return function stopProtection() {
      try {
        clearInterval(timer);
        restoreNetwork();
        restoreUI();
        unblockRightClick();
        unblockShortcuts();
      } catch (e) {}
    };
  }

  // START
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initProtection();
  } else {
    window.addEventListener('DOMContentLoaded', initProtection);
  }
})();
