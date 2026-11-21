// RX-MUSIC-PLAYER
(function () {
  'use strict';

  // ============================================================
  // 0. TRACK LIST CHECK
  // ============================================================
  if (typeof trackList === 'undefined' || !Array.isArray(trackList)) {
    console.error('[RX-MUSIC-PLAYER] not found.');
    return;
  }

  // ============================================================
  // 1. CSS INJECTION
  // ============================================================
  const style = document.createElement('style');
  style.innerHTML = `
    body.rx-dragging * { user-select: none !important; -webkit-user-select: none !important; }
    body.rx-dragging { overflow: hidden !important; touch-action: none !important; }

    /* PLAYER UI */
    .rx-player-ui {
      position: fixed; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0);
      width: min(300px, 88vw);
      background: linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.12));
      backdrop-filter: blur(22px) saturate(160%); -webkit-backdrop-filter: blur(22px) saturate(160%);
      border: 2px solid rgba(255, 255, 255, 0.5);
      border-top: 2px solid rgba(255, 255, 255, 0.8);
      border-left: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255,255,255,0.2);
      border-radius: 16px; padding: 10px 12px 8px 12px;
      display: none; flex-direction: column; gap: 9px;
      z-index: 1000000; cursor: grab; user-select: none; font-family: sans-serif;
      touch-action: none; will-change: transform;
      box-sizing: border-box;
    }
    .rx-player-ui:active { cursor: grabbing; }
    .rx-player-ui.show { display: flex; }

    .rx-top { display: flex; align-items: center; justify-content: space-between; gap: 5px; }

    .rx-btn {
      background: none; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: 0.1s; padding: 0; flex-shrink: 0;
    }
    .rx-btn:active { transform: scale(0.85); }

    .rx-play-btn {
      width: 42px; height: 42px; min-width: 42px; min-height: 42px;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(5px);
      border-radius: 50%;
      --rx-ring-color: #ffffff;
      box-shadow:
        0 0 0 2px #000000,
        0 0 0 4px var(--rx-ring-color),
        0 4px 15px rgba(0,0,0,0.3),
        inset 0 0 10px rgba(255,255,255,0.1);
      transition: box-shadow 0.35s ease;
    }
    .rx-play-btn.ring-green { --rx-ring-color: #00cc66; }
    .rx-play-btn.ring-red   { --rx-ring-color: #ff3333; }

    .rx-play-btn svg { width: 18px; height: 18px; fill: white; margin-left: 2px; }
    .rx-play-btn .pause-icon { margin-left: 0; }
    .rx-nav-btn svg { width: 17px; height: 17px; fill: #222; filter: drop-shadow(0 2px 2px rgba(255,255,255,0.5)); }

    .rx-track-name-container {
      flex-grow: 1; overflow: hidden; position: relative;
      padding: 3px 0; cursor: pointer; display: flex; flex-direction: column;
      justify-content: center; gap: 1px;
      -webkit-tap-highlight-color: transparent; touch-action: manipulation;
      min-width: 0;
    }

    .rx-track-title-wrap {
      overflow: hidden; white-space: nowrap; position: relative; width: 100%;
    }

    .rx-track-name {
      display: inline-block;
      font-family: Georgia, serif; font-style: italic; font-size: 12px;
      color: #ff3333;
      text-shadow: 0 1px 2px rgba(255,255,255,0.8);
      transition: color 0.35s ease;
      will-change: transform;
      white-space: nowrap;
      padding-right: 12px;
    }

    .rx-track-name.active-track {
      color: #00cc66 !important;
      font-weight: bold;
    }

    @keyframes scrollLoopSmart {
      0%   { transform: translate3d(0, 0, 0); opacity: 1; }
      12%  { transform: translate3d(0, 0, 0); opacity: 1; }
      78%  { transform: translate3d(var(--rx-scroll, -120px), 0, 0); opacity: 1; }
      86%  { transform: translate3d(var(--rx-scroll, -120px), 0, 0); opacity: 0; }
      92%  { transform: translate3d(0, 0, 0); opacity: 0; }
      96%  { transform: translate3d(0, 0, 0); opacity: 1; }
      100% { transform: translate3d(0, 0, 0); opacity: 1; }
    }

    .rx-track-name.slide-anim {
      animation: scrollLoopSmart var(--rx-dur, 14s) linear infinite;
      animation-fill-mode: both;
    }

    .rx-singer-name {
      font-family: 'Segoe UI', sans-serif;
      font-size: 9px;
      font-style: normal;
      font-weight: 600;
      color: #ff3333;
      text-shadow: 0 1px 1px rgba(255,255,255,0.7);
      letter-spacing: 0.2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 1;
      transition: color 0.35s ease;
    }
    .rx-singer-name.active-singer {
      color: #ff3333;
      opacity: 1;
      font-weight: 700;
    }

    .rx-close-btn {
      width: 26px; height: 26px; min-width: 26px; min-height: 26px;
      background: rgba(230, 213, 213, 0.6); backdrop-filter: blur(5px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.1), inset 0 0 5px rgba(255,255,255,0.5);
      border-radius: 50%; font-size: 19px; color: #222; font-weight: 300;
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      padding: 0; margin: 0; line-height: 1;
      box-sizing: border-box;
      -webkit-appearance: none; appearance: none;
      overflow: hidden;
    }
    .rx-close-btn span { display: block; line-height: 1; transform: translateY(-1px); }

    .rx-bottom {
      display: flex; align-items: center; gap: 6px;
      padding: 2px 2px; position: relative;
    }

    .rx-time {
      font-size: 11px;
      color: #222;
      font-family: 'Segoe UI', monospace;
      width: 38px;
      text-align: center;
      font-weight: 700;
      flex-shrink: 0;
      letter-spacing: 0.3px;
      text-shadow: 0 1px 1px rgba(255,255,255,0.6);
      transition: color 0.4s ease;
      position: relative;
      cursor: default;
    }

    .rx-time.countdown {
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.4);
    }
    .rx-time.countdown.c-green  { color: #00cc66; text-shadow: 0 0 6px rgba(0,204,102,0.4); }
    .rx-time.countdown.c-orange { color: #ff9900; text-shadow: 0 0 6px rgba(255,153,0,0.4); }
    .rx-time.countdown.c-red    { color: #ff3333; text-shadow: 0 0 6px rgba(255,51,51,0.4); }

    .rx-time.total {
      color: #ff3333 !important;
      text-shadow: 0 0 6px rgba(255,51,51,0.3);
    }

    .rx-slider-wrap {
      position: relative;
      flex-grow: 1;
      display: flex;
      align-items: center;
      margin: 0 2px;
      height: 20px;
      min-width: 0;
    }

    .rx-timeline-mode, .rx-volume-mode {
      position: absolute;
      left: 0; right: 0; top: 0; bottom: 0;
      display: flex; align-items: center;
      transition: opacity 0.25s ease;
    }
    .rx-volume-mode {
      opacity: 0;
      pointer-events: none;
    }
    .rx-slider-wrap.volume-active .rx-timeline-mode {
      opacity: 0;
      pointer-events: none;
    }
    .rx-slider-wrap.volume-active .rx-volume-mode {
      opacity: 1;
      pointer-events: auto;
    }

    .rx-slider-buffer {
      position: absolute;
      left: 0; top: 50%;
      height: 6px;
      transform: translateY(-50%);
      width: 0%;
      border-radius: 3px;
      background: rgba(66, 133, 244, 0.25);
      pointer-events: none;
      transition: width 0.2s linear;
      z-index: 1;
    }

    .rx-slider, .rx-vol-slider {
      position: relative;
      z-index: 2;
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: rgba(0, 0, 0, 0.12);
      border-radius: 3px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.18);
      background-repeat: no-repeat;
      background-size: 0% 100%;
      cursor: pointer;
      touch-action: auto;
      transition: background-size 0.12s linear, background-image 0.4s ease;
      outline: none;
    }

    .rx-slider {
      --rx-prog-color: #ffffff;
      background-image: linear-gradient(90deg, var(--rx-prog-color), var(--rx-prog-color));
    }
    .rx-vol-slider {
      --rx-prog-color: #ffffff;
      background-image: linear-gradient(90deg, var(--rx-prog-color), var(--rx-prog-color));
    }

    .rx-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px; height: 14px;
      background: #ffffff;
      border: 3px solid var(--rx-prog-color, #4285f4);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 10px var(--rx-prog-color, rgba(66,133,244,0.9)), 0 2px 5px rgba(0,0,0,0.25);
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.35s ease;
    }
    .rx-slider:hover::-webkit-slider-thumb { transform: scale(1.2); }
    .rx-slider:active::-webkit-slider-thumb { transform: scale(1.3); }

    .rx-slider::-moz-range-thumb {
      width: 14px; height: 14px;
      background: #ffffff;
      border: 3px solid var(--rx-prog-color, #4285f4);
      border-radius: 50%; cursor: pointer;
      box-shadow: 0 0 10px var(--rx-prog-color, rgba(66,133,244,0.9));
      transition: transform 0.15s ease, border-color 0.35s ease;
    }

    .rx-vol-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px; height: 14px;
      background: #ffffff;
      border: 3px solid var(--rx-prog-color, #4285f4);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 10px var(--rx-prog-color, rgba(66,133,244,0.9)), 0 2px 5px rgba(0,0,0,0.25);
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.35s ease;
    }
    .rx-vol-slider:hover::-webkit-slider-thumb { transform: scale(1.2); }
    .rx-vol-slider:active::-webkit-slider-thumb { transform: scale(1.3); }

    .rx-vol-slider::-moz-range-thumb {
      width: 14px; height: 14px;
      background: #ffffff;
      border: 3px solid var(--rx-prog-color, #4285f4);
      border-radius: 50%; cursor: pointer;
      box-shadow: 0 0 10px var(--rx-prog-color, rgba(66,133,244,0.9));
      transition: transform 0.15s ease, border-color 0.35s ease;
    }

    .rx-vol-label {
      position: absolute;
      right: 0; top: -13px;
      font-size: 8px;
      font-weight: 700;
      color: #444;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      opacity: 0.8;
      pointer-events: none;
    }

    .rx-bottom .rx-btn svg {
      width: 15px; height: 15px; fill: none; stroke: #222; stroke-width: 2.5;
      stroke-linecap: round; stroke-linejoin: round;
      filter: drop-shadow(0 1px 1px rgba(255,255,255,0.8)); transition: 0.2s;
    }
    .rx-bottom .rx-btn.active svg {
      stroke: #00cc66; filter: drop-shadow(0 0 5px rgba(0, 204, 102, 0.5));
    }

    .rx-tooltip {
      position: fixed;
      z-index: 2000000;
      padding: 6px 10px;
      background: rgba(20, 20, 20, 0.88);
      backdrop-filter: blur(8px) saturate(140%);
      -webkit-backdrop-filter: blur(8px) saturate(140%);
      color: #ffffff;
      font-size: 11px;
      font-family: 'Segoe UI', sans-serif;
      font-weight: 500;
      letter-spacing: 0.3px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.18);
      box-shadow: 0 4px 16px rgba(0,0,0,0.35), inset 0 0 8px rgba(255,255,255,0.08);
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translateY(4px) scale(0.95);
      transition: opacity 0.18s ease, transform 0.18s ease;
      user-select: none;
    }
    .rx-tooltip.show { opacity: 1; transform: translateY(0) scale(1); }
    .rx-tooltip::after {
      content: '';
      position: absolute;
      left: 50%; bottom: -5px;
      transform: translateX(-50%);
      width: 0; height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid rgba(20, 20, 20, 0.88);
    }
    .rx-tooltip.below::after {
      bottom: auto; top: -5px;
      border-top: none;
      border-bottom: 5px solid rgba(20, 20, 20, 0.88);
    }
    @media (hover: none) and (pointer: coarse) {
      .rx-tooltip { display: none !important; }
    }

    /* PLAYLIST UI */
    .rx-playlist-ui {
      position: fixed; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0);
      width: min(280px, 85vw);
      height: auto;
      background: linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2));
      backdrop-filter: blur(25px) saturate(150%); -webkit-backdrop-filter: blur(25px) saturate(150%);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 0 15px rgba(255,255,255,0.3);
      border-radius: 16px; padding: 10px 12px 8px 12px;
      display: none; flex-direction: column; gap: 8px;
      z-index: 1000001; font-family: sans-serif;
      touch-action: none; cursor: grab;
      will-change: transform;
      box-sizing: border-box;
    }
    .rx-playlist-ui:active { cursor: grabbing; }
    .rx-playlist-ui.show { display: flex; }

    .rx-playlist-header {
      display: flex; justify-content: space-between; align-items: center;
      font-weight: bold; color: #222; font-size: 14px;
      border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 6px;
      flex-shrink: 0; cursor: grab; user-select: none;
      height: 26px;
      gap: 5px;
    }
    .rx-playlist-header:active { cursor: grabbing; }

    .rx-playlist-search-wrap {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-grow: 1;
      gap: 4px;
      min-width: 0;
    }
    .rx-playlist-search {
      width: 0;
      min-width: 0;
      height: 24px;
      padding: 0;
      border: none;
      background: rgba(255,255,255,0.55);
      border-radius: 12px;
      font-size: 11px;
      color: #222;
      outline: none;
      opacity: 0;
      pointer-events: none;
      transition: width 0.25s ease, opacity 0.2s ease, padding 0.25s ease;
      cursor: text;
      font-family: 'Segoe UI', sans-serif;
      box-sizing: border-box;
    }
    .rx-playlist-search.open {
      width: 100px;
      padding: 0 8px;
      opacity: 1;
      pointer-events: auto;
      cursor: text;
    }
    .rx-playlist-search::placeholder {
      color: #888;
      font-size: 10px;
    }
    .rx-search-icon-btn {
      width: 24px; height: 24px; min-width: 24px; min-height: 24px;
      background: rgba(255,255,255,0.55);
      border: none;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #222;
      transition: background 0.2s ease, transform 0.1s ease;
      padding: 0;
    }
    .rx-search-icon-btn:active { transform: scale(0.9); }
    .rx-search-icon-btn.active { background: rgba(0, 204, 102, 0.35); }
    .rx-search-icon-btn svg {
      width: 13px; height: 13px;
      stroke: #222; stroke-width: 2.5; fill: none;
      stroke-linecap: round; stroke-linejoin: round;
      pointer-events: none;
    }

    .rx-playlist-close {
      width: 26px; height: 26px; min-width: 26px; min-height: 26px;
      background: rgba(230, 213, 213, 0.6); backdrop-filter: blur(5px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.1), inset 0 0 5px rgba(255,255,255,0.5);
      border-radius: 50%; font-size: 18px; color: #222; font-weight: 400;
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      padding: 0; margin: 0;
      line-height: 1;
      box-sizing: border-box;
      -webkit-appearance: none;
      appearance: none;
      text-align: center;
      overflow: hidden;
      padding-bottom: 2px;
      flex-shrink: 0;
    }
    .rx-playlist-close:active { transform: scale(0.9); }

    .rx-playlist-list {
      flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
      display: flex; flex-direction: column; gap: 6px;
      padding-right: 5px;
      min-height: 0;
      height: 90px;
      max-height: 200px;
      overscroll-behavior: contain;
    }
    .rx-playlist-list::-webkit-scrollbar { width: 6px; }
    .rx-playlist-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); border-radius: 3px; }
    .rx-playlist-list::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 3px; }

    .rx-track-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 7px 9px; height: 40px;
      background: rgba(255,255,255,0.3); border-radius: 10px; cursor: pointer;
      font-size: 12px; color: #222; font-weight: 500; transition: 0.2s; border: 1px solid transparent;
      flex-shrink: 0; box-sizing: border-box;
    }
    .rx-track-item:hover { background: rgba(255,255,255,0.6); }

    .rx-track-item.selected {
      background: rgba(255,255,255,0.8); border-color: rgba(0, 204, 102, 0.5);
      box-shadow: 0 2px 10px rgba(0, 204, 102, 0.2); font-weight: bold;
      color: #00cc66 !important;
    }

    .rx-track-item-left { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; overflow: hidden; }
    .rx-track-item-title { font-size: 12px; font-weight: inherit; white-space: nowrap; overflow: hidden; }
    .rx-track-item-singer { font-size: 9px; color: #ff3333; font-weight: 600; }

    .rx-track-item-title-wrap { overflow: hidden; white-space: nowrap; position: relative; width: 100%; }
    .rx-track-item-title.rx-pl-scroll {
      display: inline-block;
      white-space: nowrap;
      padding-right: 16px;
    }
    @keyframes scrollLoopSmartPl {
      0%   { transform: translate3d(0, 0, 0); opacity: 1; }
      12%  { transform: translate3d(0, 0, 0); opacity: 1; }
      78%  { transform: translate3d(var(--rx-pl-scroll, -120px), 0, 0); opacity: 1; }
      86%  { transform: translate3d(var(--rx-pl-scroll, -120px), 0, 0); opacity: 0; }
      92%  { transform: translate3d(0, 0, 0); opacity: 0; }
      96%  { transform: translate3d(0, 0, 0); opacity: 1; }
      100% { transform: translate3d(0, 0, 0); opacity: 1; }
    }
    .rx-track-item-title.rx-pl-scroll.rx-pl-anim {
      animation: scrollLoopSmartPl var(--rx-pl-dur, 14s) linear infinite;
      animation-fill-mode: both;
    }

    .rx-track-item span:last-child {
      font-size: 11px; color: #555; font-weight: 600; font-family: monospace;
      flex-shrink: 0; margin-left: 6px;
    }
    .rx-track-item.selected span:last-child { color: #00cc66; }

    .rx-no-result {
      text-align: center;
      color: #ff3333;
      font-size: 12px;
      font-weight: 700;
      padding: 18px 10px;
      font-style: italic;
      text-shadow: 0 1px 2px rgba(255,255,255,0.7);
      letter-spacing: 0.3px;
    }

    .rx-fallback-btn {
      position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px;
      background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
      backdrop-filter: blur(15px) saturate(150%); -webkit-backdrop-filter: blur(15px) saturate(150%);
      border: 1px solid rgba(255,255,255,0.6);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2), inset 0 0 10px rgba(255,255,255,0.3);
      border-radius: 50%; color: #222; display: flex; align-items: center; justify-content: center;
      cursor: grab; z-index: 999999; touch-action: none; transition: transform 0.1s; display: none; user-select: none;
      will-change: transform, left, top;
    }
    .rx-fallback-btn:active { cursor: grabbing; transform: scale(0.9); }
    .rx-fallback-btn svg { width: 24px; height: 24px; fill: #222; pointer-events: none; filter: drop-shadow(0 1px 2px rgba(255,255,255,0.8)); }

    @media (max-width: 400px) {
      .rx-player-ui { width: 86vw; padding: 9px 10px 7px 10px; gap: 8px; border-radius: 14px; }
      .rx-play-btn { width: 38px; height: 38px; min-width: 38px; min-height: 38px; }
      .rx-play-btn svg { width: 16px; height: 16px; }
      .rx-nav-btn svg { width: 16px; height: 16px; }
      .rx-track-name { font-size: 11px; }
      .rx-singer-name { font-size: 8px; }
      .rx-close-btn { width: 24px; height: 24px; min-width: 24px; min-height: 24px; font-size: 17px; }
      .rx-time { font-size: 10px; width: 34px; }
      .rx-bottom { gap: 4px; padding: 2px 1px; }
      .rx-bottom .rx-btn svg { width: 14px; height: 14px; }
      .rx-slider-wrap { margin: 0 1px; height: 18px; }
      .rx-vol-label { font-size: 7px; top: -11px; }
      .rx-playlist-ui { width: 82vw; padding: 9px 10px 7px 10px; gap: 7px; border-radius: 14px; }
      .rx-playlist-header { font-size: 13px; padding-bottom: 5px; height: 24px; }
      .rx-playlist-close { width: 24px; height: 24px; min-width: 24px; min-height: 24px; font-size: 16px; padding-bottom: 2px; }
      .rx-playlist-search.open { width: 85px; }
      .rx-playlist-search-wrap { gap: 3px; }
      .rx-playlist-list { height: 85px; max-height: 170px; gap: 5px; }
      .rx-track-item { padding: 6px 8px; height: 38px; font-size: 11px; }
      .rx-track-item-title { font-size: 11px; }
      .rx-track-item-singer { font-size: 8px; }
      .rx-track-item span:last-child { font-size: 10px; margin-left: 5px; }
      .rx-fallback-btn { width: 46px; height: 46px; }
      .rx-fallback-btn svg { width: 22px; height: 22px; }
    }

    @media (max-width: 340px) {
      .rx-player-ui { width: 84vw; padding: 8px 8px 5px 8px; gap: 7px; }
      .rx-playlist-ui { width: 80vw; padding: 8px 8px 6px 8px; gap: 6px; }
      .rx-play-btn { width: 34px; height: 34px; min-width: 34px; min-height: 34px; }
      .rx-play-btn svg { width: 15px; height: 15px; }
      .rx-nav-btn svg { width: 14px; height: 14px; }
      .rx-track-name { font-size: 10px; }
      .rx-singer-name { font-size: 8px; }
      .rx-close-btn { width: 22px; height: 22px; min-width: 22px; min-height: 22px; font-size: 16px; }
      .rx-time { font-size: 9px; width: 32px; }
      .rx-bottom { gap: 3px; }
      .rx-bottom .rx-btn svg { width: 13px; height: 13px; }
      .rx-slider-wrap { height: 16px; margin: 0 1px; }
      .rx-playlist-search.open { width: 70px; }
      .rx-playlist-list { height: 80px; max-height: 150px; gap: 4px; }
      .rx-track-item { padding: 5px 7px; height: 36px; font-size: 10px; }
      .rx-track-item-title { font-size: 10px; }
      .rx-track-item-singer { font-size: 7px; }
    }

    @media (max-height: 500px) and (orientation: landscape) {
      .rx-playlist-list { height: 80px; max-height: 160px; }
      .rx-player-ui { width: 72vw; padding: 7px 10px 5px 10px; gap: 6px; }
      .rx-playlist-ui { width: 68vw; padding: 7px 10px 5px 10px; gap: 6px; }
      .rx-play-btn { width: 36px; height: 36px; min-width: 36px; min-height: 36px; }
      .rx-play-btn svg { width: 16px; height: 16px; }
    }
  `;
  document.head.appendChild(style);

  // ============================================================
  // 3. HTML INJECTION
  // ============================================================
  const html = `
    <div class="rx-player-ui" id="rx-player-ui">
      <div class="rx-top" id="rx-header">
        <button class="rx-btn rx-nav-btn" id="rx-prev" data-tip="Previous Track"><svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
        <button class="rx-btn rx-play-btn" id="rx-play" data-tip="Play / Pause">
          <svg id="rx-icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <svg id="rx-icon-pause" class="pause-icon" style="display:none;" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
        <button class="rx-btn rx-nav-btn" id="rx-next" data-tip="Next Track"><svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></button>

        <div class="rx-track-name-container" id="rx-track-name-btn" data-tip="Open Playlist">
          <div class="rx-track-title-wrap">
            <div class="rx-track-name" id="rx-track-title-text">Select Music</div>
          </div>
          <div class="rx-singer-name" id="rx-singer-text">—</div>
        </div>

        <button class="rx-btn rx-close-btn" id="rx-close" data-tip="Close Player"><span>×</span></button>
      </div>

      <div class="rx-bottom" id="rx-bottom-row">
        <span class="rx-time countdown" id="rx-curr" data-tip="Time Remaining">0:00</span>

        <div class="rx-slider-wrap" id="rx-slider-wrap">
          <div class="rx-timeline-mode" id="rx-timeline-mode">
            <div class="rx-slider-buffer" id="rx-buffer"></div>
            <input type="range" min="0" max="100" value="0" step="0.1" class="rx-slider" id="rx-slider" data-tip="Seek Timeline">
          </div>
          <div class="rx-volume-mode" id="rx-volume-mode">
            <span class="rx-vol-label">VOL</span>
            <input type="range" min="0" max="100" value="70" step="1" class="rx-vol-slider" id="rx-vol-slider" data-tip="Adjust Volume">
          </div>
        </div>

        <span class="rx-time total" id="rx-dur" data-tip="Total Duration">0:00</span>

        <button class="rx-btn" id="rx-repeat-btn" data-tip="Repeat Mode"><svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></button>

        <button class="rx-btn" id="rx-volume-btn" data-tip="Volume">
          <svg viewBox="0 0 24 24" id="rx-volume-icon">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="rx-playlist-ui" id="rx-playlist-ui">
      <div class="rx-playlist-header" id="rx-playlist-header">
        <span>Select Music</span>
        <div class="rx-playlist-search-wrap">
          <input type="text" class="rx-playlist-search" id="rx-playlist-search" placeholder="Search music..." autocomplete="off" spellcheck="false">
          <button class="rx-search-icon-btn" id="rx-search-icon-btn" data-tip="Search Music" aria-label="Search Music">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7"/>
              <line x1="16" y1="16" x2="21" y2="21"/>
            </svg>
          </button>
        </div>
        <button class="rx-playlist-close" id="rx-playlist-close">×</button>
      </div>
      <div class="rx-playlist-list" id="rx-playlist-list"></div>
    </div>

    <div class="rx-fallback-btn" id="rx-fallback-btn" data-tip="Open Music Player">
      <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // ============================================================
  // 4. DOM ELEMENTS
  // ============================================================
  const player = document.getElementById('rx-player-ui');
  const playlistUI = document.getElementById('rx-playlist-ui');
  const playlistList = document.getElementById('rx-playlist-list');
  const playlistHeader = document.getElementById('rx-playlist-header');
  const trackNameBtn = document.getElementById('rx-track-name-btn');
  const trackTitleText = document.getElementById('rx-track-title-text');
  const singerText = document.getElementById('rx-singer-text');
  const header = document.getElementById('rx-header');
  const playBtn = document.getElementById('rx-play');
  const iconPlay = document.getElementById('rx-icon-play');
  const iconPause = document.getElementById('rx-icon-pause');
  const slider = document.getElementById('rx-slider');
  const rxBuffer = document.getElementById('rx-buffer');
  const currTime = document.getElementById('rx-curr');
  const durTime = document.getElementById('rx-dur');
  const fallbackBtn = document.getElementById('rx-fallback-btn');
  const bottomRow = document.getElementById('rx-bottom-row');

  const repeatBtn = document.getElementById('rx-repeat-btn');
  const volumeBtn = document.getElementById('rx-volume-btn');
  const sliderWrap = document.getElementById('rx-slider-wrap');
  const volSlider = document.getElementById('rx-vol-slider');

  const searchInput = document.getElementById('rx-playlist-search');
  const searchIconBtn = document.getElementById('rx-search-icon-btn');

  const audio = new Audio();
  audio.preload = 'metadata';

  // ============================================================
  // STATE
  // ============================================================
  let isPlaying = false;
  let currentTrackIndex = 0;
  let isRepeatMode = false;
  let wasDragged = false;
  let volumeModeActive = false;
  let volumeAutoTimer = null;
  let hasUserInteracted = false;
  let hasPlayedOnce = false;
  let lastEscPress = 0;
  let searchActive = false;
  let searchQuery = '';
  let searchFocusTimer = null;

  // ============================================================
  // 5. PERSISTENCE
  // ============================================================
  const K = {
    VOLUME: 'rx-state-volume',
    TRACK: 'rx-state-track',
    POS: 'rx-state-pos',
    PLAYING: 'rx-state-playing',
    REPEAT: 'rx-state-repeat',
    OPEN: 'rx-player-open',
    RING: 'rx-state-ring',
    HAS_PLAYED: 'rx-state-hasplayed',
  };

  function saveVolume() { localStorage.setItem(K.VOLUME, String(audio.volume)); }
  function saveTrack() { localStorage.setItem(K.TRACK, String(currentTrackIndex)); }
  function savePos() { localStorage.setItem(K.POS, String(audio.currentTime || 0)); }
  function savePlaying() { localStorage.setItem(K.PLAYING, isPlaying ? '1' : '0'); }
  function saveRepeat() { localStorage.setItem(K.REPEAT, isRepeatMode ? '1' : '0'); }
  function saveRingState() { localStorage.setItem(K.RING, isPlaying ? 'green' : (hasPlayedOnce ? 'red' : 'white')); }
  function saveHasPlayed() { localStorage.setItem(K.HAS_PLAYED, hasPlayedOnce ? '1' : '0'); }

  let lastPosSave = 0;
  function savePosThrottled() {
    const now = Date.now();
    if (now - lastPosSave > 1000) {
      lastPosSave = now;
      savePos();
    }
  }

  // ============================================================
  // 6. HELPERS
  // ============================================================
  function fmtTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function getProgressColor(percent) {
    if (percent <= 25) return '#ffffff';
    if (percent <= 50) return '#00cc66';
    if (percent <= 75) return '#ff9900';
    return '#ff3333';
  }

  function updateTimelineColor(percent) {
    slider.style.setProperty('--rx-prog-color', getProgressColor(percent));
  }

  function updateVolumeColor(percent) {
    volSlider.style.setProperty('--rx-prog-color', getProgressColor(percent));
  }

  function updateCountdownColor(percent) {
    currTime.classList.remove('c-green', 'c-orange', 'c-red');
    if (percent <= 25) {
      // white
    } else if (percent <= 50) {
      currTime.classList.add('c-green');
    } else if (percent <= 75) {
      currTime.classList.add('c-orange');
    } else {
      currTime.classList.add('c-red');
    }
  }

  function applyPlayBtnRing() {
    playBtn.classList.remove('ring-green', 'ring-red');
    if (!hasPlayedOnce) return;
    if (isPlaying) playBtn.classList.add('ring-green');
    else playBtn.classList.add('ring-red');
  }

  function loadDurations() {
    trackList.forEach((track, idx) => {
      if (!track.url) return;
      const probe = new Audio();
      probe.preload = 'metadata';
      probe.src = track.url;
      probe.addEventListener('loadedmetadata', () => {
        if (probe.duration && isFinite(probe.duration)) {
          trackList[idx].duration = fmtTime(probe.duration);
          if (playlistUI.classList.contains('show')) renderPlaylist();
        }
        probe.src = '';
      }, { once: true });
      probe.addEventListener('error', () => { probe.src = ''; }, { once: true });
    });
  }

  function calcScrollDuration(scrollDist, containerWidth) {
    const approxChars = Math.abs(scrollDist) / 7.5;
    const readPause = Math.max(2, Math.min(6, approxChars / 3));
    const scrollTime = Math.abs(scrollDist) / 8;
    const endPause = Math.max(1.5, approxChars / 8);
    const fadeTime = 1.2;
    let total = readPause + scrollTime + endPause + fadeTime;
    total = Math.max(10, Math.min(90, total));
    return { duration: total, readPause, scrollTime, endPause, fadeTime };
  }

  // ============================================================
  // 6a. TOOLTIP
  // ============================================================
  const HOLD_DELAY = 1000;
  let tooltipEl = null;
  let tooltipTimer = null;
  let tooltipTarget = null;
  let tooltipVisible = false;

  function isHoverDevice() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  function ensureTooltipEl() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'rx-tooltip';
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  function showTooltip(target, text) {
    if (!text) return;
    if (!isHoverDevice()) return;
    const el = ensureTooltipEl();
    el.textContent = text;
    el.classList.remove('below');

    el.style.visibility = 'hidden';
    el.classList.add('show');

    const rect = target.getBoundingClientRect();
    const tipRect = el.getBoundingClientRect();

    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    let top = rect.top - tipRect.height - 8;
    let below = false;

    if (top < 6) {
      top = rect.bottom + 8;
      below = true;
    }
    left = Math.max(6, Math.min(window.innerWidth - tipRect.width - 6, left));

    el.style.left = left + 'px';
    el.style.top = top + 'px';
    if (below) el.classList.add('below');

    el.style.visibility = '';
    tooltipVisible = true;
  }

  function hideTooltip() {
    if (!tooltipEl) return;
    tooltipEl.classList.remove('show');
    tooltipVisible = false;
  }

  function bindLongPressTooltip(el) {
    if (!el) return;
    const text = el.getAttribute('data-tip');
    if (!text) return;
    if (!isHoverDevice()) return;

    const onMouseEnter = () => {
      if (tooltipTimer) { clearTimeout(tooltipTimer); tooltipTimer = null; }
      tooltipTarget = el;
      tooltipTimer = setTimeout(() => {
        showTooltip(el, text);
      }, HOLD_DELAY);
    };
    const onMouseLeave = () => {
      if (tooltipTimer) { clearTimeout(tooltipTimer); tooltipTimer = null; }
      hideTooltip();
      tooltipTarget = null;
    };

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  function attachTooltips() {
    const nodes = document.querySelectorAll('[data-tip]');
    nodes.forEach(bindLongPressTooltip);
  }

  // ============================================================
  // 7. VOLUME MODE
  // ============================================================
  function enterVolumeMode() {
    volumeModeActive = true;
    sliderWrap.classList.add('volume-active');
    volumeBtn.classList.add('active');
    volSlider.value = audio.volume * 100;
    volSlider.style.backgroundSize = (audio.volume * 100) + '% 100%';
    updateVolumeColor(audio.volume * 100);
    resetVolumeAutoTimer();
  }

  function exitVolumeMode() {
    if (!volumeModeActive) return;
    volumeModeActive = false;
    sliderWrap.classList.remove('volume-active');
    volumeBtn.classList.remove('active');
    clearTimeout(volumeAutoTimer);
    volumeAutoTimer = null;
  }

  function resetVolumeAutoTimer() {
    clearTimeout(volumeAutoTimer);
    volumeAutoTimer = setTimeout(exitVolumeMode, 3000);
  }

  volumeBtn.addEventListener('click', (e) => {
    if (wasDragged) return;
    e.stopPropagation();
    volumeModeActive ? exitVolumeMode() : enterVolumeMode();
  });

  volSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val / 100;
    volSlider.style.backgroundSize = val + '% 100%';
    updateVolumeColor(val);
    saveVolume();
    resetVolumeAutoTimer();
  });

  volSlider.addEventListener('mousedown', resetVolumeAutoTimer);
  volSlider.addEventListener('touchstart', resetVolumeAutoTimer, { passive: true });
  volSlider.addEventListener('change', resetVolumeAutoTimer);

  // ============================================================
  // 8. PLAY TRACK
  // ============================================================
  function playTrack(index, startPos = 0, autoPlay = true) {
    currentTrackIndex = index;
    const track = trackList[index];

    trackTitleText.textContent = track.title;
    trackTitleText.classList.add('active-track');

    singerText.textContent = track.singer || '—';
    singerText.classList.add('active-singer');

    trackTitleText.classList.remove('slide-anim');
    trackTitleText.style.removeProperty('--rx-dur');
    trackTitleText.style.removeProperty('--rx-scroll');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = trackNameBtn;
        const textWidth = trackTitleText.scrollWidth;
        const containerWidth = container.clientWidth;

        if (textWidth > containerWidth + 4) {
          const scrollDist = -(textWidth - containerWidth + 10);
          const timing = calcScrollDuration(scrollDist, containerWidth);
          trackTitleText.style.setProperty('--rx-scroll', scrollDist + 'px');
          trackTitleText.style.setProperty('--rx-dur', timing.duration.toFixed(2) + 's');
          trackTitleText.classList.add('slide-anim');
        }
      });
    });

    saveTrack();

    if (track.url) {
      audio.src = track.url;

      const onMeta = () => {
        if (startPos > 0 && isFinite(audio.duration)) {
          audio.currentTime = Math.min(startPos, audio.duration - 0.5);
        }
        audio.removeEventListener('loadedmetadata', onMeta);
      };
      audio.addEventListener('loadedmetadata', onMeta);

      if (autoPlay) {
        audio.play().then(() => {
          isPlaying = true;
          hasPlayedOnce = true;
          iconPlay.style.display = 'none';
          iconPause.style.display = 'block';
          applyPlayBtnRing();
          savePlaying();
          saveRingState();
          saveHasPlayed();
        }).catch(() => {
          isPlaying = false;
          iconPlay.style.display = 'block';
          iconPause.style.display = 'none';
          applyPlayBtnRing();
          savePlaying();
          saveRingState();
          saveHasPlayed();
        });
      } else {
        isPlaying = false;
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        applyPlayBtnRing();
        savePlaying();
        saveRingState();
        saveHasPlayed();
      }
    } else {
      isPlaying = false;
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      applyPlayBtnRing();
      savePlaying();
      saveRingState();
      saveHasPlayed();
    }
  }

  // ============================================================
  // 9. AUDIO EVENTS
  // ============================================================
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      slider.value = percent;
      slider.style.backgroundSize = percent + '% 100%';
      updateTimelineColor(percent);

      const remaining = audio.duration - audio.currentTime;
      currTime.textContent = fmtTime(remaining);
      updateCountdownColor(percent);
    }

    savePosThrottled();

    try {
      if (audio.buffered.length > 0 && audio.duration) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const bufPct = Math.min(100, (bufferedEnd / audio.duration) * 100);
        rxBuffer.style.width = bufPct + '%';
      }
    } catch (err) {}
  });

  audio.addEventListener('loadedmetadata', () => {
    if (audio.duration) {
      durTime.textContent = fmtTime(audio.duration);
      trackList[currentTrackIndex].duration = fmtTime(audio.duration);
    }
  });

  audio.addEventListener('volumechange', () => {
    saveVolume();
    if (!volumeModeActive) return;
    const val = audio.volume * 100;
    volSlider.value = val;
    volSlider.style.backgroundSize = val + '% 100%';
    updateVolumeColor(val);
  });

  function handleNext() {
    if (isRepeatMode) {
      audio.currentTime = 0;
      audio.play();
    } else {
      let nextIdx = currentTrackIndex + 1;
      if (nextIdx >= trackList.length) nextIdx = 0;
      playTrack(nextIdx);
    }
  }

  audio.addEventListener('ended', handleNext);

  document.getElementById('rx-next').addEventListener('click', () => {
    if (wasDragged) return;
    let nextIdx = currentTrackIndex + 1;
    if (nextIdx >= trackList.length) nextIdx = 0;
    playTrack(nextIdx);
  });

  document.getElementById('rx-prev').addEventListener('click', () => {
    if (wasDragged) return;
    let prevIdx = currentTrackIndex - 1;
    if (prevIdx < 0) prevIdx = trackList.length - 1;
    playTrack(prevIdx);
  });

  // ============================================================
  // 10. REPEAT
  // ============================================================
  repeatBtn.addEventListener('click', (e) => {
    if (wasDragged) return;
    e.stopPropagation();
    isRepeatMode = !isRepeatMode;
    repeatBtn.classList.toggle('active', isRepeatMode);
    saveRepeat();
  });

  // ============================================================
  // 11. SEARCH — STATE MACHINE
  // ============================================================
  function openSearch() {
    if (searchActive) {
      try { searchInput.focus(); } catch (e) {}
      return;
    }
    searchActive = true;
    searchQuery = '';
    searchInput.value = '';
    searchInput.classList.add('open');
    searchIconBtn.classList.add('active');
    renderPlaylist();

    if (searchFocusTimer) { clearTimeout(searchFocusTimer); searchFocusTimer = null; }
    searchFocusTimer = setTimeout(() => {
      searchFocusTimer = null;
      if (searchActive) {
        try { searchInput.focus(); } catch (e) {}
      }
    }, 260);
  }

  function closeSearch() {
    if (!searchActive) return;
    searchActive = false;
    searchQuery = '';
    searchInput.value = '';
    searchInput.classList.remove('open');
    searchIconBtn.classList.remove('active');
    if (searchFocusTimer) { clearTimeout(searchFocusTimer); searchFocusTimer = null; }
    try { searchInput.blur(); } catch (e) {}
    renderPlaylist();
  }

  searchIconBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (searchActive) closeSearch();
    else openSearch();
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderPlaylist();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeSearch();
      try { searchInput.blur(); } catch (err) {}
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      const results = getFilteredTracks();
      if (results.length > 0) {
        const idx = results[0].index;
        closeSearch();
        playTrack(idx);
        closePlaylist();
      }
    }
  });

  function getFilteredTracks() {
    if (!searchQuery) return [];
    const results = [];
    trackList.forEach((t, i) => {
      const inTitle = (t.title || '').toLowerCase().includes(searchQuery);
      const inSinger = (t.singer || '').toLowerCase().includes(searchQuery);
      if (inTitle || inSinger) results.push({ track: t, index: i });
    });
    return results;
  }

  // ============================================================
  // 11a. RENDER PLAYLIST
  // ============================================================
  function renderPlaylist() {
    playlistList.innerHTML = '';

    let itemsToRender = [];
    if (searchActive && searchQuery) {
      itemsToRender = getFilteredTracks();
      if (itemsToRender.length === 0) {
        const noRes = document.createElement('div');
        noRes.className = 'rx-no-result';
        noRes.textContent = 'SONG NOT FOUND !';
        playlistList.appendChild(noRes);
        return;
      }
    } else {
      itemsToRender = trackList.map((t, i) => ({ track: t, index: i }));
    }

    itemsToRender.forEach(({ track, index }) => {
      const div = document.createElement('div');
      let itemClass = 'rx-track-item';
      if (index === currentTrackIndex) itemClass += ' selected';

      div.className = itemClass;
      div.innerHTML = `
        <div class="rx-track-item-left">
          <div class="rx-track-item-title-wrap">
            <span class="rx-track-item-title">${track.title}</span>
          </div>
          <span class="rx-track-item-singer">${track.singer || '—'}</span>
        </div>
        <span>${track.duration || '--:--'}</span>
      `;

      div.addEventListener('click', (e) => {
        if (wasDragged) return;
        e.stopPropagation();
        closeSearch();
        playTrack(index);
        closePlaylist();
      });
      playlistList.appendChild(div);
    });

    requestAnimationFrame(() => {
      playlistList.querySelectorAll('.rx-track-item-title').forEach(el => {
        const wrap = el.parentElement;
        el.classList.remove('rx-pl-scroll', 'rx-pl-anim');
        el.style.removeProperty('--rx-pl-dur');
        el.style.removeProperty('--rx-pl-scroll');
        el.style.display = 'inline-block';
        el.style.whiteSpace = 'nowrap';

        if (el.scrollWidth > wrap.clientWidth + 4) {
          const scrollDist = -(el.scrollWidth - wrap.clientWidth + 10);
          const timing = calcScrollDuration(scrollDist, wrap.clientWidth);
          el.style.setProperty('--rx-pl-scroll', scrollDist + 'px');
          el.style.setProperty('--rx-pl-dur', timing.duration.toFixed(2) + 's');
          el.classList.add('rx-pl-scroll', 'rx-pl-anim');
        } else {
          el.style.display = '';
          el.style.whiteSpace = '';
        }
      });
    });
  }

  function scrollPlaylistToSelected() {
    if (searchActive && searchQuery) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const selectedItem = playlistList.querySelector('.rx-track-item.selected');

        if (isPlaying && selectedItem) {
          const listRect = playlistList.getBoundingClientRect();
          const itemRect = selectedItem.getBoundingClientRect();
          const offset = itemRect.top - listRect.top + playlistList.scrollTop;
          const targetScroll = offset - (playlistList.clientHeight / 2) + (selectedItem.offsetHeight / 2);

          playlistList.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'smooth'
          });
        } else {
          playlistList.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================================
  // 11b. POSITION CLAMP
  // ============================================================
  function clampAndApplyPosition(el, left, top) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const margin = 5;
    const maxX = window.innerWidth - w - margin;
    const maxY = window.innerHeight - h - margin;
    const finalLeft = Math.max(margin, Math.min(maxX, left));
    const finalTop = Math.max(margin, Math.min(maxY, top));
    el.style.left = finalLeft + 'px';
    el.style.top = finalTop + 'px';
    el.style.transform = 'none';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    return { x: finalLeft, y: finalTop };
  }

  // ============================================================
  // 11c. OPEN / CLOSE PLAYLIST
  // ============================================================
  const openPlaylist = () => {
    if (wasDragged) return;

    closeSearchSilently();

    const pRect = player.getBoundingClientRect();
    const wasShowing = player.classList.contains('show');

    player.classList.remove('show');
    playlistUI.classList.add('show');

    renderPlaylist();

    if (wasShowing && pRect.width > 0) {
      requestAnimationFrame(() => {
        const pos = clampAndApplyPosition(playlistUI, pRect.left, pRect.top);
        savePosition('rx-playlist-ui', pos.x, pos.y);
        scrollPlaylistToSelected();
      });
    } else {
      const saved = localStorage.getItem('rx-pos-rx-playlist-ui');
      if (saved) {
        try {
          const { x, y } = JSON.parse(saved);
          requestAnimationFrame(() => {
            clampAndApplyPosition(playlistUI, x, y);
            scrollPlaylistToSelected();
          });
        } catch (e) {
          requestAnimationFrame(() => scrollPlaylistToSelected());
        }
      } else {
        requestAnimationFrame(() => scrollPlaylistToSelected());
      }
    }
  };

  function closeSearchSilently() {
    searchActive = false;
    searchQuery = '';
    searchInput.value = '';
    searchInput.classList.remove('open');
    searchIconBtn.classList.remove('active');
    if (searchFocusTimer) { clearTimeout(searchFocusTimer); searchFocusTimer = null; }
  }

  const closePlaylist = () => {
    closeSearchSilently();

    const plRect = playlistUI.getBoundingClientRect();
    const wasShowing = playlistUI.classList.contains('show');

    playlistUI.classList.remove('show');
    player.classList.add('show');

    if (wasShowing && plRect.width > 0) {
      requestAnimationFrame(() => {
        const pos = clampAndApplyPosition(player, plRect.left, plRect.top);
        savePosition('rx-player-ui', pos.x, pos.y);
        savePosition('rx-playlist-ui', pos.x, pos.y);
      });
    }
  };

  trackNameBtn.addEventListener('click', (e) => {
    if (wasDragged) return;
    e.stopPropagation();
    openPlaylist();
  });

  document.getElementById('rx-playlist-close').addEventListener('click', (e) => {
    if (wasDragged) return;
    e.stopPropagation();
    closePlaylist();
  });

  // ============================================================
  // 12. PLAY BUTTON
  // ============================================================
  playBtn.addEventListener('click', (e) => {
    if (wasDragged) return;
    e.preventDefault();

    if (!audio.src) { playTrack(0); return; }

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      hasPlayedOnce = true;
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      applyPlayBtnRing();
      saveRingState();
      saveHasPlayed();
    } else {
      audio.play().then(() => {
        isPlaying = true;
        hasPlayedOnce = true;
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
        applyPlayBtnRing();
        saveRingState();
        saveHasPlayed();
      }).catch(() => {});
    }
    savePlaying();
  });

  // ============================================================
  // 13. TIMELINE SLIDER
  // ============================================================
  slider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    slider.style.backgroundSize = val + '% 100%';
    if (audio.duration) audio.currentTime = (val / 100) * audio.duration;
    updateTimelineColor(val);
    updateCountdownColor(val);
  });

  // ============================================================
  // 14. POSITION & STATE
  // ============================================================
  const savePosition = (id, x, y) => localStorage.setItem(`rx-pos-${id}`, JSON.stringify({ x, y }));
  const loadPosition = (id, el) => {
    const saved = localStorage.getItem(`rx-pos-${id}`);
    if (saved) {
      try {
        const { x, y } = JSON.parse(saved);
        clampAndApplyPosition(el, x, y);
      } catch (e) {}
    }
  };

  const saveOpen = (isOpen) => localStorage.setItem(K.OPEN, isOpen ? 'true' : 'false');
  const loadOpen = () => localStorage.getItem(K.OPEN) === 'true';

  // ============================================================
  // 15. DRAGGABLE
  // ============================================================
  function makeDraggable(el, handle, onClickCallback) {
    let isDragging = false;
    let hasMovedEnough = false;
    let startPointerX = 0, startPointerY = 0;
    let startLeft = 0, startTop = 0;
    let pendingX = 0, pendingY = 0;
    let rafId = null;
    const DRAG_THRESHOLD = 6;

    function applyPendingMove() {
      rafId = null;
      if (!isDragging) return;
      el.style.transform = `translate3d(${pendingX}px, ${pendingY}px, 0)`;
    }

    function getPoint(e) {
      if (e.touches && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if (e.changedTouches && e.changedTouches.length) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function onDown(e) {
      if (e.target.closest('input[type="range"]')) return;
      if (e.target.closest('input[type="text"]')) return;
      if (e.target.closest('button') && e.target.closest('button') !== handle) {
        if (!handle.classList.contains('rx-fallback-btn')) return;
      }

      const pt = getPoint(e);
      startPointerX = pt.x;
      startPointerY = pt.y;

      const rect = el.getBoundingClientRect();

      el.style.transform = 'none';
      if (el.id === 'rx-fallback-btn') {
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      }
      el.style.left = rect.left + 'px';
      el.style.top = rect.top + 'px';

      startLeft = rect.left;
      startTop = rect.top;

      pendingX = 0;
      pendingY = 0;
      hasMovedEnough = false;
      isDragging = true;
      wasDragged = false;

      document.body.classList.add('rx-dragging');

      if (e.cancelable) e.preventDefault();
    }

    function onMove(e) {
      if (!isDragging) return;

      const pt = getPoint(e);
      const dx = pt.x - startPointerX;
      const dy = pt.y - startPointerY;

      if (!hasMovedEnough) {
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          hasMovedEnough = true;
          wasDragged = true;
        } else {
          return;
        }
      }

      if (e.cancelable) e.preventDefault();

      const maxX = window.innerWidth - el.offsetWidth - 4;
      const maxY = window.innerHeight - el.offsetHeight - 4;

      let newLeft = startLeft + dx;
      let newTop = startTop + dy;
      newLeft = Math.max(4, Math.min(maxX, newLeft));
      newTop = Math.max(4, Math.min(maxY, newTop));

      pendingX = newLeft - startLeft;
      pendingY = newTop - startTop;

      if (!rafId) rafId = requestAnimationFrame(applyPendingMove);
    }

    function onUp(e) {
      if (!isDragging) {
        document.body.classList.remove('rx-dragging');
        return;
      }
      isDragging = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

      const rect = el.getBoundingClientRect();
      el.style.transform = 'none';
      el.style.left = rect.left + 'px';
      el.style.top = rect.top + 'px';

      savePosition(el.id, rect.left, rect.top);
      if (el.id === 'rx-player-ui') savePosition('rx-playlist-ui', rect.left, rect.top);
      if (el.id === 'rx-playlist-ui') savePosition('rx-player-ui', rect.left, rect.top);

      document.body.classList.remove('rx-dragging');

      if (!wasDragged && onClickCallback) {
        if (el.id === 'rx-fallback-btn') {
          onClickCallback();
        }
      }

      setTimeout(() => { wasDragged = false; }, 250);
    }

    if (window.PointerEvent) {
      handle.addEventListener('pointerdown', onDown);
      document.addEventListener('pointermove', onMove, { passive: false });
      document.addEventListener('pointerup', onUp);
      document.addEventListener('pointercancel', onUp);
    } else {
      handle.addEventListener('mousedown', onDown);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      handle.addEventListener('touchstart', onDown, { passive: false });
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
      document.addEventListener('touchcancel', onUp);
    }
  }

  // ============================================================
  // 16. OPEN / CLOSE PLAYER
  // ============================================================
  const openPlayer = () => {
    player.classList.add('show');
    fallbackBtn.style.display = 'none';
    saveOpen(true);
    loadPosition('rx-player-ui', player);
    attachTooltips();
  };

  const closePlayer = () => {
    audio.pause();
    isPlaying = false;
    savePlaying();
    savePos();
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';
    applyPlayBtnRing();
    saveRingState();

    closeSearchSilently();

    player.classList.remove('show');
    playlistUI.classList.remove('show');
    saveOpen(false);

    if (fallbackBtn.dataset.isFallback === 'true') {
      fallbackBtn.style.display = 'flex';
      loadPosition('rx-fallback-btn', fallbackBtn);
    }
    hideTooltip();
  };

  makeDraggable(fallbackBtn, fallbackBtn, openPlayer);
  makeDraggable(player, player);
  makeDraggable(playlistUI, playlistUI);

  document.getElementById('rx-close').addEventListener('click', (e) => {
    if (wasDragged) return;
    closePlayer();
  });

  window.addEventListener('beforeunload', () => {
    savePos();
    savePlaying();
    saveVolume();
    saveTrack();
    saveRepeat();
    saveRingState();
    saveHasPlayed();
  });

  window.addEventListener('pagehide', () => {
    savePos();
    savePlaying();
    saveVolume();
    saveTrack();
    saveRepeat();
    saveRingState();
    saveHasPlayed();
  });

    // ============================================================
  // 17. KEYBOARD SHORTCUTS
  // ============================================================
  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    const isSearchInput = (e.target === searchInput);

    // ----------------------------------------------------------
    // GUARD 1: Search input focus → Esc मात्र काम गर्छ
    // ----------------------------------------------------------
    if (isSearchInput) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeSearch();
      }
      return;
    }

    // ----------------------------------------------------------
    // GUARD 2: अन्य input / textarea / select / contentEditable
    // ----------------------------------------------------------
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.target && e.target.isContentEditable) return;

    const playerVisible = player.classList.contains('show');
    const playlistVisible = playlistUI.classList.contains('show');
    const fallbackVisible = (fallbackBtn.style.display === 'flex');

    // ----------------------------------------------------------
    // 1. TAB — player → playlist
    //    (playlist खुला छ भने काम गर्दैन)
    // ----------------------------------------------------------
    if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
      if (playerVisible) {
        e.preventDefault();
        e.stopPropagation();
        openPlaylist();
        return;
      }
      if (playlistVisible) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      return;
    }

    // ----------------------------------------------------------
    // 2. ESC — priority chain
    //    a) Search खुला → search बन्द (playlist खुलै)
    //    b) Playlist खुला → playlist बन्द (player फर्क)
    //    c) Player खुला → double Esc ले player बन्द
    // ----------------------------------------------------------
    if (e.key === 'Escape') {
      if (searchActive) {
        e.preventDefault();
        e.stopPropagation();
        closeSearch();
        return;
      }
      if (playlistVisible) {
        e.preventDefault();
        e.stopPropagation();
        closePlaylist();
        return;
      }
      if (playerVisible) {
        e.preventDefault();
        e.stopPropagation();
        const now = Date.now();
        if (now - lastEscPress < 400) {
          lastEscPress = 0;
          closePlayer();
        } else {
          lastEscPress = now;
        }
        return;
      }
      return;
    }

    // ----------------------------------------------------------
    // यदि player वा playlist कुनै पनि खुला छैन → बाँकी सबै बन्द
    // ----------------------------------------------------------
    if (!playerVisible && !playlistVisible) return;

    // ----------------------------------------------------------
    // 3. S — Search open ONLY
    //    • playlist खुला छ भने → search खोल्छ (बन्द होइन)
    //    • playlist बन्द छ भने → केही गर्दैन
    //    • search खुला छ भने → केही गर्दैन (focus मात्र)
    // ----------------------------------------------------------
    if ((e.key === 's' || e.key === 'S') && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      e.stopPropagation();

      if (!playlistVisible) {
        // player मात्र खुला छ → S ले केही गर्दैन
        return;
      }

      if (!searchActive) {
        openSearch();
      }
      return;
    }

    // ----------------------------------------------------------
    // ⚠️ यहाँबाट तलका सबै shortcut — player खुला छ भने मात्र
    //    (playlist खुला छ भने R, Space, Ctrl+arrows सबै बन्द)
    // ----------------------------------------------------------
    if (playlistVisible) return;

    // ----------------------------------------------------------
    // 4. R — Repeat toggle (player खुला भए मात्र)
    // ----------------------------------------------------------
    if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      isRepeatMode = !isRepeatMode;
      repeatBtn.classList.toggle('active', isRepeatMode);
      saveRepeat();
      return;
    }

    // ----------------------------------------------------------
    // 5. SPACE — Play / Pause (player खुला भए मात्र)
    // ----------------------------------------------------------
    if ((e.code === 'Space' || e.key === ' ') && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();

      if (!audio.src) { playTrack(0); return; }

      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        hasPlayedOnce = true;
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        applyPlayBtnRing();
        saveRingState();
        saveHasPlayed();
        savePlaying();
      } else {
        audio.play().then(() => {
          isPlaying = true;
          hasPlayedOnce = true;
          iconPlay.style.display = 'none';
          iconPause.style.display = 'block';
          applyPlayBtnRing();
          saveRingState();
          saveHasPlayed();
          savePlaying();
        }).catch(() => {});
      }
      return;
    }

    // ----------------------------------------------------------
    // 6. CTRL + ← — Previous Track (player खुला भए मात्र)
    // ----------------------------------------------------------
    if (e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      let prevIdx = currentTrackIndex - 1;
      if (prevIdx < 0) prevIdx = trackList.length - 1;
      playTrack(prevIdx);
      return;
    }

    // ----------------------------------------------------------
    // 7. CTRL + → — Next Track (player खुला भए मात्र)
    // ----------------------------------------------------------
    if (e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey && e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      let nextIdx = currentTrackIndex + 1;
      if (nextIdx >= trackList.length) nextIdx = 0;
      playTrack(nextIdx);
      return;
    }

    // ----------------------------------------------------------
    // 8. CTRL + ↑ — Volume Up (player खुला भए मात्र)
    // ----------------------------------------------------------
    if (e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey && e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      if (!volumeModeActive) enterVolumeMode();
      const newVol = Math.min(1, audio.volume + 0.10);
      audio.volume = newVol;
      volSlider.value = newVol * 100;
      volSlider.style.backgroundSize = (newVol * 100) + '% 100%';
      updateVolumeColor(newVol * 100);
      saveVolume();
      resetVolumeAutoTimer();
      return;
    }

    // ----------------------------------------------------------
    // 9. CTRL + ↓ — Volume Down (player खुला भए मात्र)
    // ----------------------------------------------------------
    if (e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey && e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      if (!volumeModeActive) enterVolumeMode();
      const newVol = Math.max(0, audio.volume - 0.10);
      audio.volume = newVol;
      volSlider.value = newVol * 100;
      volSlider.style.backgroundSize = (newVol * 100) + '% 100%';
      updateVolumeColor(newVol * 100);
      saveVolume();
      resetVolumeAutoTimer();
      return;
    }
  });

  // ============================================================
  // 18. TRIGGER LOGIC
  // ============================================================
  const triggerSelector = '.RX-SMART-BUTTON-menu-item.RX-item-7[data-link=""]';

  function attachToTrigger() {
    const trigger = document.querySelector(triggerSelector);
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        openPlayer();
        if (fallbackBtn.dataset.isFallback === 'true') fallbackBtn.style.display = 'none';
      });
      return true;
    }
    const imgs = document.querySelectorAll('img[src*="RX-MUSIC.png"]');
    for (const img of imgs) {
      const parent = img.closest('.RX-SMART-BUTTON-menu-item');
      if (parent) {
        parent.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          openPlayer();
          if (fallbackBtn.dataset.isFallback === 'true') fallbackBtn.style.display = 'none';
        });
        return true;
      }
    }
    return false;
  }

  window.addEventListener('resize', () => {
    if (player.classList.contains('show')) loadPosition('rx-player-ui', player);
    if (playlistUI.classList.contains('show')) loadPosition('rx-playlist-ui', playlistUI);
    if (fallbackBtn.style.display === 'flex') loadPosition('rx-fallback-btn', fallbackBtn);
    hideTooltip();
  });

  // ============================================================
  // 19. INIT
  // ============================================================
  setTimeout(() => {
    loadDurations();

    const savedVol = parseFloat(localStorage.getItem(K.VOLUME));
    if (!isNaN(savedVol) && savedVol >= 0 && savedVol <= 1) {
      audio.volume = savedVol;
    } else {
      audio.volume = 0.7;
    }
    volSlider.value = audio.volume * 100;
    volSlider.style.backgroundSize = (audio.volume * 100) + '% 100%';
    updateVolumeColor(audio.volume * 100);
    updateTimelineColor(0);

    hasPlayedOnce = localStorage.getItem(K.HAS_PLAYED) === '1';
    const savedRing = localStorage.getItem(K.RING);

    isRepeatMode = localStorage.getItem(K.REPEAT) === '1';
    repeatBtn.classList.toggle('active', isRepeatMode);

    const savedTrack = parseInt(localStorage.getItem(K.TRACK), 10);
    const savedPos = parseFloat(localStorage.getItem(K.POS));
    const savedPlaying = localStorage.getItem(K.PLAYING) === '1';

    const trackIdx = (!isNaN(savedTrack) && savedTrack >= 0 && savedTrack < trackList.length) ? savedTrack : 0;
    const startPos = (!isNaN(savedPos) && savedPos > 0) ? savedPos : 0;

    if (localStorage.getItem(K.TRACK) !== null) {
      playTrack(trackIdx, startPos, savedPlaying);
    }

    if (savedRing === 'green') {
      playBtn.classList.add('ring-green');
      playBtn.classList.remove('ring-red');
    } else if (savedRing === 'red') {
      playBtn.classList.add('ring-red');
      playBtn.classList.remove('ring-green');
    } else {
      playBtn.classList.remove('ring-green', 'ring-red');
    }

    const triggerFound = attachToTrigger();
    if (loadOpen()) {
      player.classList.add('show');
      fallbackBtn.style.display = 'none';
      loadPosition('rx-player-ui', player);
    } else {
      if (!triggerFound) {
        fallbackBtn.dataset.isFallback = 'true';
        fallbackBtn.style.display = 'flex';
        loadPosition('rx-fallback-btn', fallbackBtn);
      } else { fallbackBtn.style.display = 'none'; }
    }
    if (!triggerFound) {
      const observer = new MutationObserver(() => {
        if (attachToTrigger()) {
          if (!loadOpen()) fallbackBtn.style.display = 'none';
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    attachTooltips();

    if (savedPlaying) {
      const resumeOnInteraction = () => {
        if (hasUserInteracted) return;
        hasUserInteracted = true;
        if (!isPlaying && audio.src && audio.paused) {
          audio.play().then(() => {
            isPlaying = true;
            hasPlayedOnce = true;
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
            applyPlayBtnRing();
            saveRingState();
            saveHasPlayed();
            savePlaying();
          }).catch(() => {});
        }
        document.removeEventListener('click', resumeOnInteraction);
        document.removeEventListener('touchstart', resumeOnInteraction);
        document.removeEventListener('keydown', resumeOnInteraction);
      };
      document.addEventListener('click', resumeOnInteraction, { once: true });
      document.addEventListener('touchstart', resumeOnInteraction, { once: true });
      document.addEventListener('keydown', resumeOnInteraction, { once: true });
    }
  }, 50);
})();