// RX-MUSIC-PLAYER.js (v6 — Full Persistence + Auto-Resume)
(function () {
  'use strict';

  // ============================================================
  // 1. CSS INJECTION
  // ============================================================
  const style = document.createElement('style');
  style.innerHTML = `
    body.rx-dragging * { user-select: none !important; -webkit-user-select: none !important; }

    .rx-player-ui {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 360px; max-width: 92vw;
      background: linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.12));
      backdrop-filter: blur(22px) saturate(160%); -webkit-backdrop-filter: blur(22px) saturate(160%);
      border: 2px solid rgba(255, 255, 255, 0.5);
      border-top: 2px solid rgba(255, 255, 255, 0.8);
      border-left: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255,255,255,0.2);
      border-radius: 18px; padding: 14px 18px 10px 18px;
      display: none; flex-direction: column; gap: 12px;
      z-index: 1000000; cursor: grab; user-select: none; font-family: sans-serif;
      touch-action: none; will-change: transform, opacity;
    }
    .rx-player-ui:active { cursor: grabbing; }
    .rx-player-ui.show { display: flex; }

    .rx-top { display: flex; align-items: center; justify-content: space-between; gap: 6px; }

    .rx-btn {
      background: none; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: 0.1s; padding: 0; flex-shrink: 0;
    }
    .rx-btn:active { transform: scale(0.85); }

    .rx-play-btn {
      width: 48px; height: 48px; min-width: 48px; min-height: 48px;
      background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.1);
      border-radius: 50%;
    }
    .rx-play-btn svg { width: 20px; height: 20px; fill: white; margin-left: 2px; }
    .rx-play-btn .pause-icon { margin-left: 0; }
    .rx-nav-btn svg { width: 20px; height: 20px; fill: #222; filter: drop-shadow(0 2px 2px rgba(255,255,255,0.5)); }

    .rx-track-name-container {
      flex-grow: 1; overflow: hidden; position: relative;
      padding: 4px 0; cursor: pointer; display: flex; flex-direction: column;
      justify-content: center; gap: 1px;
      -webkit-tap-highlight-color: transparent; touch-action: manipulation;
      min-width: 0;
    }

    .rx-track-title-wrap {
      overflow: hidden; white-space: nowrap; position: relative; width: 100%;
    }

    .rx-track-name {
      display: inline-block;
      font-family: Georgia, serif; font-style: italic; font-size: 13px;
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

    @keyframes scrollLoop {
      0%   { transform: translate3d(0, 0, 0); }
      8%   { transform: translate3d(0, 0, 0); }
      92%  { transform: translate3d(var(--rx-scroll, -120px), 0, 0); }
      100% { transform: translate3d(0, 0, 0); }
    }

    .rx-track-name.slide-anim {
      animation: scrollLoop var(--rx-dur, 8s) linear infinite;
      animation-fill-mode: both;
    }

    .rx-singer-name {
      font-family: 'Segoe UI', sans-serif;
      font-size: 10px;
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
      width: 30px; height: 30px; min-width: 30px; min-height: 30px;
      background: rgba(230, 213, 213, 0.6); backdrop-filter: blur(5px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.1), inset 0 0 5px rgba(255,255,255,0.5);
      border-radius: 50%; font-size: 22px; color: #222; font-weight: 300;
      flex-shrink: 0;
    }

    .rx-bottom {
      display: flex; align-items: center; gap: 8px;
      padding: 2px 4px; position: relative;
    }

    .rx-time {
      font-size: 12px;
      color: #222;
      font-family: 'Segoe UI', monospace;
      width: 42px;
      text-align: center;
      font-weight: 700;
      flex-shrink: 0;
      letter-spacing: 0.3px;
      text-shadow: 0 1px 1px rgba(255,255,255,0.6);
      transition: color 0.4s ease;
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
      margin: 0 4px;
      height: 22px;
      min-width: 0;
    }

    .rx-timeline-mode, .rx-volume-mode {
      position: absolute;
      left: 0; right: 0; top: 0; bottom: 0;
      display: flex; align-items: center;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .rx-volume-mode {
      opacity: 0;
      pointer-events: none;
      transform: translateY(6px);
    }
    .rx-slider-wrap.volume-active .rx-timeline-mode {
      opacity: 0;
      pointer-events: none;
      transform: translateY(-6px);
    }
    .rx-slider-wrap.volume-active .rx-volume-mode {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
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
      width: 15px; height: 15px;
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
      width: 15px; height: 15px;
      background: #ffffff;
      border: 3px solid var(--rx-prog-color, #4285f4);
      border-radius: 50%; cursor: pointer;
      box-shadow: 0 0 10px var(--rx-prog-color, rgba(66,133,244,0.9));
      transition: transform 0.15s ease, border-color 0.35s ease;
    }

    .rx-vol-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 15px; height: 15px;
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
      width: 15px; height: 15px;
      background: #ffffff;
      border: 3px solid var(--rx-prog-color, #4285f4);
      border-radius: 50%; cursor: pointer;
      box-shadow: 0 0 10px var(--rx-prog-color, rgba(66,133,244,0.9));
      transition: transform 0.15s ease, border-color 0.35s ease;
    }

    .rx-vol-label {
      position: absolute;
      right: 0; top: -14px;
      font-size: 9px;
      font-weight: 700;
      color: #444;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      opacity: 0.8;
      pointer-events: none;
    }

    .rx-bottom .rx-btn svg {
      width: 16px; height: 16px; fill: none; stroke: #222; stroke-width: 2.5;
      stroke-linecap: round; stroke-linejoin: round;
      filter: drop-shadow(0 1px 1px rgba(255,255,255,0.8)); transition: 0.2s;
    }
    .rx-bottom .rx-btn.active svg {
      stroke: #00cc66; filter: drop-shadow(0 0 5px rgba(0, 204, 102, 0.5));
    }

    .rx-playlist-ui {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 360px; max-width: 92vw; height: 380px;
      background: linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2));
      backdrop-filter: blur(25px) saturate(150%); -webkit-backdrop-filter: blur(25px) saturate(150%);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 0 15px rgba(255,255,255,0.3);
      border-radius: 18px; padding: 15px;
      display: none; flex-direction: column; gap: 10px;
      z-index: 1000001; font-family: sans-serif;
      touch-action: none; cursor: grab;
    }
    .rx-playlist-ui:active { cursor: grabbing; }
    .rx-playlist-ui.show { display: flex; }

    .rx-playlist-header {
      display: flex; justify-content: space-between; align-items: center;
      font-weight: bold; color: #222; font-size: 15px;
      border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 8px;
      flex-shrink: 0; cursor: grab; user-select: none;
    }
    .rx-playlist-header:active { cursor: grabbing; }
    .rx-playlist-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #222; }

    .rx-playlist-list {
      flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;
      padding-right: 5px; height: 260px; min-height: 260px; max-height: 260px;
    }
    .rx-playlist-list::-webkit-scrollbar { width: 6px; }
    .rx-playlist-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); border-radius: 3px; }
    .rx-playlist-list::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 3px; }

    .rx-track-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 12px; height: 46px;
      background: rgba(255,255,255,0.3); border-radius: 10px; cursor: pointer;
      font-size: 13px; color: #222; font-weight: 500; transition: 0.2s; border: 1px solid transparent;
      flex-shrink: 0; box-sizing: border-box;
    }
    .rx-track-item:hover { background: rgba(255,255,255,0.6); }

    .rx-track-item.selected {
      background: rgba(255,255,255,0.8); border-color: rgba(0, 204, 102, 0.5);
      box-shadow: 0 2px 10px rgba(0, 204, 102, 0.2); font-weight: bold;
      color: #00cc66 !important;
    }

    .rx-track-item.next-track {
      background: rgba(255,255,255,0.6); border-color: rgba(255, 204, 0, 0.5);
      box-shadow: 0 2px 10px rgba(255, 204, 0, 0.2);
      color: #cc9900 !important;
    }

    .rx-track-item-left { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
    .rx-track-item-title { font-size: 13px; font-weight: inherit; }
    .rx-track-item-singer { font-size: 10px; color: #ff3333; font-weight: 600; }

    .rx-track-item span:last-child {
      font-size: 12px; color: #555; font-weight: 600; font-family: monospace;
      flex-shrink: 0; margin-left: 8px;
    }
    .rx-track-item.selected span:last-child { color: #00cc66; }
    .rx-track-item.next-track span:last-child { color: #cc9900; }

    .rx-fallback-btn {
      position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px;
      background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
      backdrop-filter: blur(15px) saturate(150%); -webkit-backdrop-filter: blur(15px) saturate(150%);
      border: 1px solid rgba(255,255,255,0.6);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2), inset 0 0 10px rgba(255,255,255,0.3);
      border-radius: 50%; color: #222; display: flex; align-items: center; justify-content: center;
      cursor: grab; z-index: 999999; touch-action: none; transition: transform 0.1s; display: none; user-select: none;
    }
    .rx-fallback-btn:active { cursor: grabbing; transform: scale(0.9); }
    .rx-fallback-btn svg { width: 24px; height: 24px; fill: #222; pointer-events: none; filter: drop-shadow(0 1px 2px rgba(255,255,255,0.8)); }
  `;
  document.head.appendChild(style);

  // ============================================================
  // 2. TRACK LIST
  // ============================================================
  const trackList = [
    {
      title: 'DILRUBA.DILNASHEEN',
      singer: 'Reto Riba',
      duration: '--:--',
      url: 'RX_45537_F0LD3R_2061/MU51C_F0LD3R/DILRUBA.DILNASHEEN._BY-RETO RIBA.mp3'
    },
    {
      title: 'Maan_Panu',
      singer: 'Unknown Artist',
      duration: '--:--',
      url: 'RX_45537_F0LD3R_2061/MU51C_F0LD3R/Maan_Panu_I_Met_Her_Again.mp3'
    },
    {
      title: 'VAARU',
      singer: 'Romy, Anand',
      duration: '--:--',
      url: 'RX_45537_F0LD3R_2061/MU51C_F0LD3R/VAARU- Romy, Anand.mp3'
    },
  ];

  // ============================================================
  // 3. HTML INJECTION
  // ============================================================
  const html = `
    <div class="rx-player-ui" id="rx-player-ui">
      <div class="rx-top" id="rx-header">
        <button class="rx-btn rx-nav-btn" id="rx-prev"><svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
        <button class="rx-btn rx-play-btn" id="rx-play">
          <svg id="rx-icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <svg id="rx-icon-pause" class="pause-icon" style="display:none;" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
        <button class="rx-btn rx-nav-btn" id="rx-next"><svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></button>

        <div class="rx-track-name-container" id="rx-track-name-btn">
          <div class="rx-track-title-wrap">
            <div class="rx-track-name" id="rx-track-title-text">Select Track</div>
          </div>
          <div class="rx-singer-name" id="rx-singer-text">—</div>
        </div>

        <button class="rx-btn rx-close-btn" id="rx-close">×</button>
      </div>

      <div class="rx-bottom" id="rx-bottom-row">
        <span class="rx-time countdown" id="rx-curr">0:00</span>

        <div class="rx-slider-wrap" id="rx-slider-wrap">
          <div class="rx-timeline-mode" id="rx-timeline-mode">
            <div class="rx-slider-buffer" id="rx-buffer"></div>
            <input type="range" min="0" max="100" value="0" step="0.1" class="rx-slider" id="rx-slider">
          </div>
          <div class="rx-volume-mode" id="rx-volume-mode">
            <span class="rx-vol-label">VOL</span>
            <input type="range" min="0" max="100" value="70" step="1" class="rx-vol-slider" id="rx-vol-slider">
          </div>
        </div>

        <span class="rx-time total" id="rx-dur">0:00</span>

        <button class="rx-btn" id="rx-repeat-btn"><svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></button>

        <button class="rx-btn" id="rx-volume-btn" title="Volume">
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
        <span>Select Track</span>
        <button class="rx-playlist-close" id="rx-playlist-close">×</button>
      </div>
      <div class="rx-playlist-list" id="rx-playlist-list"></div>
    </div>

    <div class="rx-fallback-btn" id="rx-fallback-btn">
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

  // ============================================================
  // 5. PERSISTENCE KEYS
  // ============================================================
  const K = {
    VOLUME: 'rx-state-volume',
    TRACK: 'rx-state-track',
    POS: 'rx-state-pos',
    PLAYING: 'rx-state-playing',
    REPEAT: 'rx-state-repeat',
    OPEN: 'rx-player-open',
  };

  function saveVolume() { localStorage.setItem(K.VOLUME, String(audio.volume)); }
  function saveTrack() { localStorage.setItem(K.TRACK, String(currentTrackIndex)); }
  function savePos() { localStorage.setItem(K.POS, String(audio.currentTime || 0)); }
  function savePlaying() { localStorage.setItem(K.PLAYING, isPlaying ? '1' : '0'); }
  function saveRepeat() { localStorage.setItem(K.REPEAT, isRepeatMode ? '1' : '0'); }

  // Throttle pos saves to avoid spam
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
          let dur = Math.abs(scrollDist) / 35;
          dur = Math.max(6, Math.min(16, dur));
          trackTitleText.style.setProperty('--rx-scroll', scrollDist + 'px');
          trackTitleText.style.setProperty('--rx-dur', dur + 's');
          trackTitleText.classList.add('slide-anim');
        }
      });
    });

    saveTrack();

    if (track.url) {
      audio.src = track.url;

      // set start position after metadata loads
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
          iconPlay.style.display = 'none';
          iconPause.style.display = 'block';
          savePlaying();
        }).catch(() => {
          // Autoplay blocked — show play icon, wait for interaction
          isPlaying = false;
          iconPlay.style.display = 'block';
          iconPause.style.display = 'none';
          savePlaying();
        });
      } else {
        isPlaying = false;
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        savePlaying();
      }
    } else {
      isPlaying = false;
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      savePlaying();
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
  // 11. PLAYLIST
  // ============================================================
  function renderPlaylist() {
    playlistList.innerHTML = '';
    trackList.forEach((track, index) => {
      const div = document.createElement('div');
      let itemClass = 'rx-track-item';
      if (index === currentTrackIndex) itemClass += ' selected';

      let nextIndex = currentTrackIndex + 1;
      if (nextIndex >= trackList.length) nextIndex = 0;
      if (!isRepeatMode && index === nextIndex) itemClass += ' next-track';

      div.className = itemClass;
      div.innerHTML = `
        <div class="rx-track-item-left">
          <span class="rx-track-item-title">${track.title}</span>
          <span class="rx-track-item-singer">${track.singer || '—'}</span>
        </div>
        <span>${track.duration || '--:--'}</span>
      `;

      div.addEventListener('click', (e) => {
        if (wasDragged) return;
        e.stopPropagation();
        playTrack(index);
        renderPlaylist();
        closePlaylist();
      });
      playlistList.appendChild(div);
    });
  }

  const openPlaylist = () => {
    if (wasDragged) return;
    player.classList.remove('show');
    playlistUI.classList.add('show');
    renderPlaylist();
    loadPosition('rx-playlist-ui', playlistUI);
  };

  const closePlaylist = () => {
    if (wasDragged) return;
    playlistUI.classList.remove('show');
    player.classList.add('show');
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
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    } else {
      audio.play().then(() => {
        isPlaying = true;
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
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
  // 14. POSITION & STATE (already via keys above)
  // ============================================================
  const savePosition = (id, x, y) => localStorage.setItem(`rx-pos-${id}`, JSON.stringify({ x, y }));
  const loadPosition = (id, el) => {
    const saved = localStorage.getItem(`rx-pos-${id}`);
    if (saved) {
      try {
        const { x, y } = JSON.parse(saved);
        const maxX = window.innerWidth - el.offsetWidth - 5;
        const maxY = window.innerHeight - el.offsetHeight - 5;
        el.style.left = Math.max(5, Math.min(maxX, x)) + 'px';
        el.style.top = Math.max(5, Math.min(maxY, y)) + 'px';
        el.style.transform = 'none'; el.style.right = 'auto'; el.style.bottom = 'auto';
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
    let startX, startY, initialX, initialY, hasMovedEnough = false;
    const DRAG_THRESHOLD = 15;

    const startDrag = (e) => {
      if (e.target.closest('input[type="range"]') || e.target.closest('button')) return;
      if (el.id === 'rx-player-ui' && !e.target.closest('.rx-top')) return;

      document.body.classList.add('rx-dragging');

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      initialX = clientX; initialY = clientY;
      const rect = el.getBoundingClientRect();
      startX = clientX - rect.left; startY = clientY - rect.top;

      isDragging = true; hasMovedEnough = false; wasDragged = false;

      if (el.id === 'rx-fallback-btn') {
        el.style.right = 'auto'; el.style.bottom = 'auto';
        el.style.left = rect.left + 'px'; el.style.top = rect.top + 'px';
      } else { el.style.transform = 'none'; }
    };

    const doDrag = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dx = Math.abs(clientX - initialX);
      const dy = Math.abs(clientY - initialY);

      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        hasMovedEnough = true;
        wasDragged = true;
      }

      if (hasMovedEnough) {
        if (e.cancelable) e.preventDefault();
        let newLeft = clientX - startX;
        let newTop = clientY - startY;
        newLeft = Math.max(5, Math.min(window.innerWidth - el.offsetWidth - 5, newLeft));
        newTop = Math.max(5, Math.min(window.innerHeight - el.offsetHeight - 5, newTop));
        el.style.left = newLeft + 'px';
        el.style.top = newTop + 'px';
      }
    };

    const stopDrag = (e) => {
      document.body.classList.remove('rx-dragging');
      if (!isDragging) return;
      isDragging = false;

      const rect = el.getBoundingClientRect();
      savePosition(el.id, rect.left, rect.top);

      if (!wasDragged && onClickCallback) {
        if (el.id === 'rx-fallback-btn' && e.target.closest('.rx-fallback-btn')) {
          onClickCallback();
        }
      }
      setTimeout(() => { wasDragged = false; }, 250);
    };

    handle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', doDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);
  }

  // ============================================================
  // 16. OPEN / CLOSE PLAYER
  // ============================================================
  const openPlayer = () => {
    player.classList.add('show');
    fallbackBtn.style.display = 'none';
    saveOpen(true);
    loadPosition('rx-player-ui', player);
  };

  // CLOSE = stop music + hide player (only way to stop)
  const closePlayer = () => {
    audio.pause();
    isPlaying = false;
    savePlaying();
    savePos();
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';

    player.classList.remove('show');
    playlistUI.classList.remove('show');
    saveOpen(false);

    if (fallbackBtn.dataset.isFallback === 'true') {
      fallbackBtn.style.display = 'flex';
      loadPosition('rx-fallback-btn', fallbackBtn);
    }
  };

  makeDraggable(fallbackBtn, fallbackBtn, openPlayer);
  makeDraggable(player, header);
  makeDraggable(playlistUI, playlistHeader);

  document.getElementById('rx-close').addEventListener('click', (e) => {
    if (wasDragged) return;
    closePlayer();
  });

  // Save state before page unload
  window.addEventListener('beforeunload', () => {
    savePos();
    savePlaying();
    saveVolume();
    saveTrack();
    saveRepeat();
  });

  window.addEventListener('pagehide', () => {
    savePos();
    savePlaying();
    saveVolume();
    saveTrack();
    saveRepeat();
  });

  // ============================================================
  // 17. TRIGGER LOGIC
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
  });

  // ============================================================
  // 18. INIT — Restore saved state
  // ============================================================
  setTimeout(() => {
    loadDurations();

    // --- Restore VOLUME ---
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

    // --- Restore REPEAT ---
    isRepeatMode = localStorage.getItem(K.REPEAT) === '1';
    repeatBtn.classList.toggle('active', isRepeatMode);

    // --- Restore TRACK + POS + PLAYING ---
    const savedTrack = parseInt(localStorage.getItem(K.TRACK), 10);
    const savedPos = parseFloat(localStorage.getItem(K.POS));
    const savedPlaying = localStorage.getItem(K.PLAYING) === '1';

    const trackIdx = (!isNaN(savedTrack) && savedTrack >= 0 && savedTrack < trackList.length) ? savedTrack : 0;
    const startPos = (!isNaN(savedPos) && savedPos > 0) ? savedPos : 0;

    // Always load the track (autoPlay only if savedPlaying was true AND we can try)
    if (localStorage.getItem(K.TRACK) !== null) {
      playTrack(trackIdx, startPos, savedPlaying);
    }

    // --- Restore PLAYER open state ---
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

    // --- Autoplay unlock: on first user interaction, resume if savedPlaying ---
    if (savedPlaying) {
      const resumeOnInteraction = () => {
        if (hasUserInteracted) return;
        hasUserInteracted = true;
        // Only resume if still not playing and we have a saved playing state
        if (!isPlaying && audio.src && audio.paused) {
          audio.play().then(() => {
            isPlaying = true;
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
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