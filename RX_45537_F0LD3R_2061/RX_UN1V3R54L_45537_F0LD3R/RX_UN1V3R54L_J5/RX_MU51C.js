// RX-MUSIC-PLAYER.js (Removed Arrow Indicator)
(function () {
  'use strict';

  // 1. CSS Injection
  const style = document.createElement('style');
  style.innerHTML = `
    body.rx-dragging * { user-select: none !important; -webkit-user-select: none !important; }

    .rx-player-ui {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 340px; max-width: 90vw; 
      background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1));
      backdrop-filter: blur(20px) saturate(150%); -webkit-backdrop-filter: blur(20px) saturate(150%);
      
      border: 2px solid rgba(255, 255, 255, 0.5); 
      border-top: 2px solid rgba(255, 255, 255, 0.8); 
      border-left: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255,255,255,0.2);
      
      border-radius: 18px; padding: 12px 16px 8px 16px;
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
        transition: 0.1s; padding: 0; 
        flex-shrink: 0;
    }
    .rx-btn:active { transform: scale(0.85); }
    
    .rx-play-btn { 
      width: 46px; height: 46px; min-width: 46px; min-height: 46px;
      background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.1); 
      border-radius: 50%; 
    }
    .rx-play-btn svg { width: 20px; height: 20px; fill: white; margin-left: 2px; }
    .rx-play-btn .pause-icon { margin-left: 0; }
    .rx-nav-btn svg { width: 20px; height: 20px; fill: #222; filter: drop-shadow(0 2px 2px rgba(255,255,255,0.5)); }
    
    /* --- TRACK NAME (Arrow Hataideko) --- */
    .rx-track-name-container {
      flex-grow: 1; 
      overflow: hidden; 
      white-space: nowrap; 
      position: relative;
      padding: 8px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      -webkit-tap-highlight-color: transparent; 
      touch-action: manipulation;
    }
    
    .rx-track-name {
      display: inline-block;
      font-family: Georgia, serif; 
      font-style: italic; 
      font-size: 13px; 
      color: #ff3333; /* Default Red */
      text-shadow: 0 1px 2px rgba(255,255,255,0.8);
      transition: color 0.3s ease;
    }

    .rx-track-name.active-track {
      color: #00cc66 !important;
      font-weight: bold;
    }

    @keyframes scrollLoop {
      0% { transform: translateX(0); }
      10% { transform: translateX(0); }
      90% { transform: translateX(calc(-100% + 180px)); }
      100% { transform: translateX(0); }
    }

    .rx-track-name.slide-anim {
      animation: scrollLoop 10s linear infinite;
    }

    /* Arrow hatauna yo ::after hataideko chu */
    
    .rx-close-btn { 
      width: 30px; height: 30px; min-width: 30px; min-height: 30px;
      background: rgba(230, 213, 213, 0.6); backdrop-filter: blur(5px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.1), inset 0 0 5px rgba(255,255,255,0.5);
      border-radius: 50%; font-size: 22px; color: #222; font-weight: 300; 
      flex-shrink: 0;
    }
    
    .rx-bottom { display: flex; align-items: center; gap: 6px; padding: 0 4px; position: relative; }
    .rx-time { font-size: 8px; color: #333; font-family: monospace; width: 20px; text-align: center; font-weight: bold; flex-shrink: 0; }
    
    .rx-slider { 
      flex-grow: 1; -webkit-appearance: none; height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px; 
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.2); background-image: linear-gradient(#4285f4, #4285f4); 
      background-size: 0% 100%; background-repeat: no-repeat; 
      cursor: pointer; margin: 0 2px; touch-action: auto; 
    }
    .rx-slider::-webkit-slider-thumb { 
      -webkit-appearance: none; width: 12px; height: 12px; background: #4285f4; border-radius: 50%; cursor: pointer; 
      box-shadow: 0 0 8px rgba(66, 133, 244, 0.8);
    }

    .rx-bottom .rx-btn svg { width: 16px; height: 16px; fill: none; stroke: #222; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 1px 1px rgba(255,255,255,0.8)); transition: 0.2s; }
    .rx-bottom .rx-btn.active svg { stroke: #00cc66; filter: drop-shadow(0 0 5px rgba(0, 204, 102, 0.5)); }

    /* --- PLAYLIST UI --- */
    .rx-playlist-ui {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 340px; max-width: 90vw; height: 360px; 
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
      padding-right: 5px; height: 240px; min-height: 240px; max-height: 240px;
    }
    .rx-playlist-list::-webkit-scrollbar { width: 6px; }
    .rx-playlist-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); border-radius: 3px; }
    .rx-playlist-list::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 3px; }

    .rx-track-item {
      display: flex; justify-content: space-between; align-items: center; 
      padding: 10px 12px; height: 40px; 
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
    
    .rx-track-item span:last-child { font-size: 11px; color: #555; }

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

  // 2. Default Track List
  const trackList = [
    { title: 'DILRUBA.DILNASHEEN', duration: '2:47', url: 'RX_45537_F0LD3R_2061/MU51C_F0LD3R/DILRUBA.DILNASHEEN._BY-RETO RIBA.mp3' }, 
    { title: 'Maan_Panu', duration: '3:34', url: 'RX_45537_F0LD3R_2061/MU51C_F0LD3R/Maan_Panu_I_Met_Her_Again.mp3' }, 
    { title: 'VAARU', duration: '5:50', url: 'RX_45537_F0LD3R_2061/MU51C_F0LD3R/VAARU- Romy, Anand.mp3' },
  ];

  // 3. HTML Injection
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
            <div class="rx-track-name" id="rx-track-title-text">Select Track</div>
        </div>
        
        <button class="rx-btn rx-close-btn" id="rx-close">×</button>
      </div>
      
      <div class="rx-bottom" id="rx-bottom-row">
        <span class="rx-time" id="rx-curr">0:00</span>
        <input type="range" min="0" max="100" value="0" class="rx-slider" id="rx-slider">
        <span class="rx-time" id="rx-dur">0:00</span>
        
        <button class="rx-btn" id="rx-repeat-btn"><svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></button>
        <button class="rx-btn" id="rx-shuffle-btn"><svg viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg></button>
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

  // 4. DOM Elements
  const player = document.getElementById('rx-player-ui');
  const playlistUI = document.getElementById('rx-playlist-ui');
  const playlistList = document.getElementById('rx-playlist-list');
  const playlistHeader = document.getElementById('rx-playlist-header');
  const trackNameBtn = document.getElementById('rx-track-name-btn'); 
  const trackTitleText = document.getElementById('rx-track-title-text'); 
  const header = document.getElementById('rx-header');
  const playBtn = document.getElementById('rx-play');
  const iconPlay = document.getElementById('rx-icon-play');
  const iconPause = document.getElementById('rx-icon-pause');
  const slider = document.getElementById('rx-slider');
  const currTime = document.getElementById('rx-curr');
  const durTime = document.getElementById('rx-dur');
  const fallbackBtn = document.getElementById('rx-fallback-btn');
  const bottomRow = document.getElementById('rx-bottom-row');
  
  const repeatBtn = document.getElementById('rx-repeat-btn');
  const shuffleBtn = document.getElementById('rx-shuffle-btn');
  
  const audio = new Audio();
  audio.volume = 0.7; 

  let isPlaying = false;
  let currentTrackIndex = 0;
  let isRepeatMode = false;
  let isShuffleMode = false;
  let wasDragged = false;

  // --- 5. Audio & Slide Logic ---
  function playTrack(index) {
    currentTrackIndex = index;
    const track = trackList[index];
    
    trackTitleText.textContent = track.title;
    trackTitleText.classList.add('active-track'); 
    
    trackTitleText.classList.remove('slide-anim');
    void trackTitleText.offsetWidth; 
    
    if (track.title.length > 15) {
        trackTitleText.classList.add('slide-anim');
    }
    
    if (track.url) {
      audio.src = track.url;
      audio.play().then(() => {
        isPlaying = true;
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
      }).catch(e => {
        isPlaying = false;
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
      });
    } else {
      isPlaying = false;
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    }
  }

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const val = (audio.currentTime / audio.duration) * 100;
      slider.value = val;
      slider.style.backgroundSize = val + '% 100%';
      
      const currMins = Math.floor(audio.currentTime / 60);
      const currSecs = Math.floor(audio.currentTime % 60);
      currTime.textContent = `${currMins}:${currSecs < 10 ? '0' : ''}${currSecs}`;
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (audio.duration) {
      const durMins = Math.floor(audio.duration / 60);
      const durSecs = Math.floor(audio.duration % 60);
      durTime.textContent = `${durMins}:${durSecs < 10 ? '0' : ''}${durSecs}`;
    }
  });
  
  function handleNext() {
    if (isRepeatMode) {
      audio.currentTime = 0;
      audio.play();
    } else if (isShuffleMode) {
      let randomIndex = Math.floor(Math.random() * trackList.length);
      if(randomIndex === currentTrackIndex && trackList.length > 1) randomIndex = (randomIndex + 1) % trackList.length;
      playTrack(randomIndex);
    } else {
      let nextIdx = currentTrackIndex + 1;
      if (nextIdx >= trackList.length) nextIdx = 0;
      playTrack(nextIdx);
    }
  }

  audio.addEventListener('ended', handleNext);

  document.getElementById('rx-next').addEventListener('click', () => {
      if (wasDragged) return;
      if(isShuffleMode) {
          let nextIdx = Math.floor(Math.random() * trackList.length);
          if(nextIdx === currentTrackIndex && trackList.length > 1) nextIdx = (nextIdx + 1) % trackList.length;
          playTrack(nextIdx);
      } else {
          let nextIdx = currentTrackIndex + 1;
          if (nextIdx >= trackList.length) nextIdx = 0;
          playTrack(nextIdx);
      }
  });
  
  document.getElementById('rx-prev').addEventListener('click', () => {
    if (wasDragged) return;
    let prevIdx = currentTrackIndex - 1;
    if (prevIdx < 0) prevIdx = trackList.length - 1;
    playTrack(prevIdx);
  });

  // --- 6. Repeat & Shuffle Logic ---
  repeatBtn.addEventListener('click', (e) => {
    if (wasDragged) return;
    e.stopPropagation();
    isRepeatMode = !isRepeatMode;
    if (isRepeatMode) {
      repeatBtn.classList.add('active');
      isShuffleMode = false;
      shuffleBtn.classList.remove('active');
    } else {
      repeatBtn.classList.remove('active');
    }
  });

  shuffleBtn.addEventListener('click', (e) => {
    if (wasDragged) return;
    e.stopPropagation();
    isShuffleMode = !isShuffleMode;
    if (isShuffleMode) {
      shuffleBtn.classList.add('active');
      isRepeatMode = false;
      repeatBtn.classList.remove('active');
    } else {
      shuffleBtn.classList.remove('active');
    }
  });

  // --- 7. Playlist Logic ---
  function renderPlaylist() {
    playlistList.innerHTML = '';
    trackList.forEach((track, index) => {
      const div = document.createElement('div');
      let itemClass = 'rx-track-item';
      if (index === currentTrackIndex) itemClass += ' selected'; 
      
      let nextIndex = currentTrackIndex + 1;
      if (nextIndex >= trackList.length) nextIndex = 0;
      if (!isRepeatMode && !isShuffleMode && index === nextIndex) itemClass += ' next-track'; 

      div.className = itemClass;
      div.innerHTML = `<span>${track.title}</span><span>${track.duration}</span>`;
      
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

  playBtn.addEventListener('click', (e) => {
    if (wasDragged) return;
    e.preventDefault();
    
    if (!audio.src) { 
        playTrack(0); 
        return; 
    }
    
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    } else {
      audio.play();
      isPlaying = true;
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
    }
  });

  slider.addEventListener('input', (e) => {
    const val = e.target.value;
    slider.style.backgroundSize = val + '% 100%';
    if (audio.duration) audio.currentTime = (val / 100) * audio.duration;
  });

  // --- 8. Position & State Save/Load ---
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

  const saveState = (isOpen) => localStorage.setItem('rx-player-open', isOpen ? 'true' : 'false');
  const loadState = () => localStorage.getItem('rx-player-open') === 'true';

  // --- 9. Advanced Draggable ---
  function makeDraggable(el, handle, onClickCallback) {
    let isDragging = false;
    let startX, startY, initialX, initialY, hasMovedEnough = false;
    const DRAG_THRESHOLD = 10; 

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
      setTimeout(() => { wasDragged = false; }, 100);
    };

    handle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', doDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);
  }

  // --- 10. UI Interactions ---
  const openPlayer = () => {
    player.classList.add('show');
    fallbackBtn.style.display = 'none';
    saveState(true);
    loadPosition('rx-player-ui', player);
  };

  const closePlayer = () => {
    player.classList.remove('show');
    playlistUI.classList.remove('show'); 
    saveState(false);
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

  // --- 11. Trigger Logic ---
  const triggerSelector = '.RX-SMART-BUTTON-menu-item.RX-item-7[data-link=""]';

  function attachToTrigger() {
    const trigger = document.querySelector(triggerSelector);
    if (trigger) {
      trigger.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openPlayer(); if (fallbackBtn.dataset.isFallback === 'true') fallbackBtn.style.display = 'none'; });
      return true;
    }
    const imgs = document.querySelectorAll('img[src*="RX-MUSIC.png"]');
    for (const img of imgs) {
      const parent = img.closest('.RX-SMART-BUTTON-menu-item');
      if (parent) {
        parent.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openPlayer(); if (fallbackBtn.dataset.isFallback === 'true') fallbackBtn.style.display = 'none'; });
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

  // --- 12. Initialization ---
  setTimeout(() => {
    const triggerFound = attachToTrigger();
    if (loadState()) {
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
      const observer = new MutationObserver(() => { if (attachToTrigger()) { if (!loadState()) fallbackBtn.style.display = 'none'; observer.disconnect(); } });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }, 50);
})();