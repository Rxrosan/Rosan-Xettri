// RX-MUSIC-PLAYER.js
// RX STUDIO Music Player
(function () {
  'use strict';

  /**
   * ===============================
   * CONFIGURATION
   * ===============================
   */
  const config = {
    // Window Settings 
    playerWidth: '300px',
    playerHeight: '115px', 
    expandedHeight: '320px', 
    mobileWidth: '320px',
    mobileHeight: '115px',
    mobileExpandedHeight: '300px',
    smallMobileWidth: '305px',
    smallMobileHeight: '110px',
    smallMobileExpandedHeight: '305px',
    
    // Messages
    welcomeMessage: null,
    
    // Copyright
    copyright: '<p>&copy; <strong><a href="https://www.rosankc.com.np" style="color:#64ffda; text-decoration:none;">RX STUDIO</a></strong>. All Rights Reserved.</p>',
    
    // Custom Images
    images: {
      playerIcon: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/BOT-PROFILE.png',
      background: null,
      playIcon: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/play.png',
      pauseIcon: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/pause.png',
      nextIcon: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/next.png',
      prevIcon: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/prev.png',
      menuIcon: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/menu.png',
      volumeIcon: 'RX-ASSETS/RX-IMAGE/RX-FUNCTION-ICON/volume.png'
    },
    
    // Custom Colors
    colors: {
      primary: 'transparent',
      headerBg: 'rgba(0,0,0,0.3)',
      playerBg: 'rgba(0,0,0,0.2)',
      textColor: 'white',
      activeColor: '#c70d0d',
      playlistItemBg: 'rgba(255,255,255,0.1)',
      playlistItemHover: 'rgba(100,255,218,0.2)'
    },
    
    // Storage Keys
    storageKeys: {
      windowState: 'rx-music-state',
      position: 'rx-music-position',
      lastPlayed: 'rx-music-last',
      playlist: 'rx-music-playlist'
    },
    
    // Default Playlist
    defaultPlaylist: [
      { 
        title: 'Its You', 
        artist: 'Ali Gatie',
        url: 'RX-ASSETS/RX-MUSIC/Its-you.mp3',
        duration: '3:32'
      },
      { 
        title: 'Dandelions', 
        artist: 'Ruth B',
        url: 'RX-ASSETS/RX-MUSIC/Dandelions.mp3',
        duration: '4:30'
      },
      { 
        title: 'Sarangi', 
        artist: 'Sushant KC',
        url: 'RX-ASSETS/RX-MUSIC/Sarangi.mp3',
        duration: '5:00'
      },
      { 
        title: 'NASAMAJH', 
        artist: 'Aditya Rikhari',
        url: 'RX-ASSETS/RX-MUSIC/NASAMAJH.mp3',
        duration: '2:50'
      },
      { 
        title: 'HundredDollar-Bill', 
        artist: 'Lana Del Rey',
        url: 'RX-ASSETS/RX-MUSIC/HundredDollar-Bill.mp3',
        duration: '3:15'
      },
    ],
    
    // Mobile drag settings
    mobileDrag: {
      enable: true,
      dragHandleHeight: '1cm',
      longPressDelay: 200,
      edgeResistance: 10
    }
  };

  /**
   * ===============================
   * Music Player State
   * ===============================
   */
  let playerState = {
    isPlaying: false,
    currentTrack: null,
    currentIndex: 0,
    playlist: [],
    isPlaylistVisible: false,
    volume: 70,
    audioElement: null
  };

  /**
   * ===============================
   * Load/Save Playlist
   * ===============================
   */
  function loadPlaylist() {
    const saved = localStorage.getItem(config.storageKeys.playlist);
    if (saved) {
      try {
        playerState.playlist = JSON.parse(saved);
      } catch (e) {
        playerState.playlist = [...config.defaultPlaylist];
      }
    } else {
      playerState.playlist = [...config.defaultPlaylist];
    }
    
    // Set first track as current
    if (playerState.playlist.length > 0 && !playerState.currentTrack) {
      playerState.currentTrack = playerState.playlist[0];
    }
  }

  function savePlaylist() {
    localStorage.setItem(config.storageKeys.playlist, JSON.stringify(playerState.playlist));
  }

  function saveLastPlayed(index) {
    localStorage.setItem(config.storageKeys.lastPlayed, index.toString());
  }

  function loadLastPlayed() {
    const saved = localStorage.getItem(config.storageKeys.lastPlayed);
    if (saved && playerState.playlist.length > 0) {
      const index = parseInt(saved);
      if (index >= 0 && index < playerState.playlist.length) {
        playerState.currentIndex = index;
        playerState.currentTrack = playerState.playlist[index];
      }
    }
  }

  /**
   * ===============================
   * Window State Management
   * ===============================
   */
  function saveWindowState(isOpen) {
    localStorage.setItem(config.storageKeys.windowState, isOpen ? 'open' : 'closed');
  }

  function loadWindowState() {
    return localStorage.getItem(config.storageKeys.windowState) === 'open';
  }

  function saveWindowPosition(left, top) {
    localStorage.setItem(config.storageKeys.position, JSON.stringify({ left, top }));
  }

  function loadWindowPosition() {
    const saved = localStorage.getItem(config.storageKeys.position);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  }

  /**
   * ===============================
   * CSS Injection
   * ===============================
   */
  function generateCSS() {
    const { images, colors } = config;
    
    return `
    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* RX Music Player Window */
    .rx-music-window {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${config.playerWidth};
      height: ${config.playerHeight};
      background: ${colors.headerBg || 'rgba(30, 40, 60, 0.95)'};
      ${images.background ? `background-image: url('${images.background}');` : ''}
      background-size: cover;
      background-position: center;
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 1000000;
      color: ${colors.textColor || 'white'};
      touch-action: none;
      will-change: transform, left, top, height;
      transition: height 0.25s ease;
    }

    .rx-music-window.show {
      display: flex;
    }

    .rx-music-window.expanded {
      height: ${config.expandedHeight};
    }

    .rx-music-window.dragging {
      transition: none;
      opacity: 0.95;
    }

    /* Header Section */
    .rx-music-header {
      padding: 0 12px;
      background: ${colors.headerBg || 'rgba(0,0,0,0.3)'};
      border-bottom: 1px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: move;
      cursor: grab;
      height: 32px;
      touch-action: none;
      flex-shrink: 0;
    }

    .rx-music-header:active {
      cursor: grabbing;
    }

    .rx-music-header-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      border: 2px solid rgba(255,255,255,0.5);
      ${images.playerIcon ? `background-image: url('${images.playerIcon}'); background-size: cover; background-position: center;` : ''}
      pointer-events: none;
      flex-shrink: 0;
    }

    .rx-music-header-title {
      flex: 1;
      font-weight: bold;
      text-align: center;
      color: ${colors.textColor || 'white'};
      pointer-events: none;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rx-music-header-close {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      flex-shrink: 0;
      line-height: 1;
    }

    /* Content Section */
    .rx-music-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
    }

    /* Player Controls Section - Always visible */
    .rx-music-controls {
      padding: 6px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: ${colors.playerBg || 'transparent'};
      height: 62px;
      flex-shrink: 0;
    }

    .rx-music-track-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
    }

    .rx-music-track-title {
      font-size: 13px;
      font-weight: bold;
      color: ${colors.textColor || 'white'};
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 60%;
    }

    .rx-music-track-artist {
      font-size: 11px;
      color: rgba(255,255,255,0.6);
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 40%;
      text-align: right;
    }

    .rx-music-progress-container {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      color: rgba(255,255,255,0.6);
    }

    .rx-music-progress-bar {
      flex: 1;
      height: 4px;
      background: rgba(255,255,255,0.2);
      border-radius: 2px;
      cursor: pointer;
      position: relative;
    }

    .rx-music-progress-fill {
      height: 100%;
      background: ${colors.activeColor};
      border-radius: 2px;
      width: 0%;
    }

    .rx-music-control-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .rx-music-control-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .rx-music-control-btn:hover {
      background: rgba(255,255,255,0.1);
    }

    .rx-music-control-btn:active {
      transform: scale(0.95);
    }

    .rx-music-control-btn img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }

    .rx-music-menu-btn {
      width: 28px;
      height: 28px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
    }

    .rx-music-menu-btn img {
      width: 16px;
      height: 16px;
      object-fit: contain;
      filter: brightness(0) invert(1);
      transition: filter 0.2s ease;
    }

    .rx-music-menu-btn.active {
      background: ${colors.activeColor};
    }

    .rx-music-menu-btn.active img {
      filter: brightness(0) invert(0);
    }

    .rx-music-volume-control {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: auto;
    }

    .rx-music-volume-icon {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rx-music-volume-icon img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }

    .rx-music-volume-slider {
      width: 50px;
      height: 4px;
      background: rgba(255,255,255,0.2);
      border-radius: 2px;
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
    }

    .rx-music-volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${colors.activeColor};
      cursor: pointer;
    }

    .rx-music-bottom-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 2px;
    }

    /* Playlist Section - Only shows when menu clicked */
    .rx-music-playlist-section {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      background: rgba(0,0,0,0.3);
      display: none;
      min-height: 0;
    }

    .rx-music-playlist-section.show {
      display: block;
    }

    .rx-music-playlist-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      background: ${colors.playlistItemBg || 'rgba(255,255,255,0.05)'};
      border-radius: 6px;
      margin-bottom: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .rx-music-playlist-item:hover {
      background: ${colors.playlistItemHover || 'rgba(100,255,218,0.1)'};
    }

    .rx-music-playlist-item.active {
      background: ${colors.playlistItemHover || 'rgba(100,255,218,0.2)'};
      border-left: 3px solid ${colors.activeColor};
    }

    .rx-music-playlist-info {
      flex: 1;
      min-width: 0;
    }

    .rx-music-playlist-title {
      font-size: 12px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rx-music-playlist-artist {
      font-size: 10px;
      color: rgba(255,255,255,0.6);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rx-music-playlist-duration {
      font-size: 10px;
      color: rgba(255,255,255,0.4);
      flex-shrink: 0;
    }

    .rx-music-copyright {
      padding: 2px 4px;
      text-align: center;
      font-size: 9px;
      color: rgba(255,255,255,0.5);
      background: ${colors.headerBg || 'rgba(0,0,0,0.3)'};
      border-top: 1px solid rgba(255,255,255,0.1);
      height: 18px;
      line-height: 14px;
      flex-shrink: 0;
    }

    .rx-music-copyright a {
      color: #64ffda;
      text-decoration: none;
    }

    /* Responsive Design - Mobile */
    @media screen and (max-width: 500px) {
      .rx-music-window {
        width: ${config.mobileWidth};
        height: ${config.mobileHeight};
      }
      
      .rx-music-window.expanded {
        height: ${config.mobileExpandedHeight};
      }
      
      .rx-music-controls {
        padding: 4px 8px;
        height: 58px;
      }
      
      .rx-music-track-title {
        font-size: 12px;
      }
      
      .rx-music-track-artist {
        font-size: 10px;
      }
      
      .rx-music-control-btn {
        width: 26px;
        height: 26px;
      }
      
      .rx-music-menu-btn {
        width: 26px;
        height: 26px;
      }
      
      .rx-music-menu-btn img {
        width: 14px;
        height: 14px;
      }
      
      .rx-music-volume-icon {
        width: 14px;
        height: 14px;
      }
      
      .rx-music-volume-slider {
        width: 40px;
      }
    }

    @media screen and (max-width: 360px) {
      .rx-music-window {
        width: ${config.smallMobileWidth};
        height: ${config.smallMobileHeight};
      }
      
      .rx-music-window.expanded {
        height: ${config.smallMobileExpandedHeight};
      }
      
      .rx-music-controls {
        height: 56px;
        padding: 3px 6px;
      }
      
      .rx-music-track-title {
        font-size: 11px;
      }
      
      .rx-music-track-artist {
        font-size: 9px;
      }
      
      .rx-music-control-btn {
        width: 24px;
        height: 24px;
        padding: 4px;
      }
      
      .rx-music-menu-btn {
        width: 24px;
        height: 24px;
      }
      
      .rx-music-menu-btn img {
        width: 12px;
        height: 12px;
      }
      
      .rx-music-volume-icon {
        width: 12px;
        height: 12px;
      }
      
      .rx-music-volume-slider {
        width: 35px;
      }
      
      .rx-music-progress-container {
        font-size: 9px;
      }
    }

    /* Landscape orientation */
    @media (max-height: 400px) and (orientation: landscape) {
      .rx-music-window.expanded {
        height: 250px;
      }
      
      .rx-music-playlist-section {
        max-height: 150px;
      }
    }

    /* Touch device optimizations */
    @media (hover: none) and (pointer: coarse) {
      .rx-music-header {
        cursor: default;
      }
      
      .rx-music-control-btn:hover {
        background: transparent;
      }
      
      .rx-music-volume-slider {
        height: 6px;
      }
    }
    `;
  }

  function injectCSS() {
    const style = document.createElement('style');
    style.id = 'rx-music-styles';
    style.textContent = generateCSS();
    document.head.appendChild(style);
  }

  /**
   * ===============================
   * HTML Injection
   * ===============================
   */
  function injectHTML() {
    if (!document.getElementById('rx-music-window')) {
      const html = `
      <!-- RX Music Player Window -->
      <div class="rx-music-window" id="rx-music-window">
        <div class="rx-music-header" id="rx-music-header">
          <div class="rx-music-header-icon" id="rx-music-header-icon"></div>
          <div class="rx-music-header-title">RX MUSIC</div>
          <div class="rx-music-header-close" id="rx-music-close-btn">×</div>
        </div>

        <div class="rx-music-content">
          <!-- Player Controls - Always Visible -->
          <div class="rx-music-controls">
            <div class="rx-music-track-info">
              <div class="rx-music-track-title" id="rx-music-track-title">No Track</div>
              <div class="rx-music-track-artist" id="rx-music-track-artist">Select Song</div>
            </div>
            
            <div class="rx-music-progress-container">
              <span id="rx-music-current">0:00</span>
              <div class="rx-music-progress-bar" id="rx-music-progress-bar">
                <div class="rx-music-progress-fill" id="rx-music-progress-fill"></div>
              </div>
              <span id="rx-music-duration">0:00</span>
            </div>

            <div class="rx-music-bottom-row">
              <div class="rx-music-control-buttons">
                <button class="rx-music-control-btn" id="rx-music-prev-btn">
                  <img src="${config.images.prevIcon || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'white\'><path d=\'M6 6h2v12H6zm3.5 6l8.5 6V6z\'/></svg>'}" alt="prev">
                </button>
                <button class="rx-music-control-btn" id="rx-music-play-pause-btn">
                  <img src="${config.images.playIcon || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'white\'><path d=\'M8 5v14l11-7z\'/></svg>'}" alt="play" id="rx-music-play-icon">
                </button>
                <button class="rx-music-control-btn" id="rx-music-next-btn">
                  <img src="${config.images.nextIcon || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'white\'><path d=\'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z\'/></svg>'}" alt="next">
                </button>
              </div>
              
              <div class="rx-music-menu-btn" id="rx-music-menu-btn">
                <img src="${config.images.menuIcon || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'white\'><path d=\'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z\'/></svg>'}" alt="menu">
              </div>
              
              <div class="rx-music-volume-control">
                <div class="rx-music-volume-icon">
                  <img src="${config.images.volumeIcon || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'white\'><path d=\'M3 9v6h4l5 5V4L7 9H3z\'/></svg>'}" alt="vol">
                </div>
                <input type="range" min="0" max="100" value="70" class="rx-music-volume-slider" id="rx-music-volume-slider">
              </div>
            </div>
          </div>

          <!-- Playlist Section - Hidden by default, shows only when menu clicked -->
          <div class="rx-music-playlist-section" id="rx-music-playlist">
            <!-- Playlist items will be injected here -->
          </div>
        </div>

        <div class="rx-music-copyright">${config.copyright}</div>
      </div>
      `;
      
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);
    }
  }

  /**
   * ===============================
   * Audio Functions
   * ===============================
   */
  function initAudio() {
    if (!playerState.audioElement) {
      playerState.audioElement = new Audio();
      playerState.audioElement.volume = playerState.volume / 100;
      
      playerState.audioElement.addEventListener('timeupdate', updateProgress);
      playerState.audioElement.addEventListener('loadedmetadata', updateDuration);
      playerState.audioElement.addEventListener('ended', playNext);
    }
  }

  function updateProgress() {
    const audio = playerState.audioElement;
    if (audio && audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      const fill = document.getElementById('rx-music-progress-fill');
      const currentTime = document.getElementById('rx-music-current');
      
      if (fill) fill.style.width = progress + '%';
      if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
    }
  }

  function updateDuration() {
    const audio = playerState.audioElement;
    const duration = document.getElementById('rx-music-duration');
    if (duration && audio && audio.duration) {
      duration.textContent = formatTime(audio.duration);
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function seek(e) {
    const bar = document.getElementById('rx-music-progress-bar');
    const audio = playerState.audioElement;
    if (bar && audio && audio.duration) {
      const rect = bar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      audio.currentTime = percentage * audio.duration;
    }
  }

  function updateTrackInfo() {
    const title = document.getElementById('rx-music-track-title');
    const artist = document.getElementById('rx-music-track-artist');
    
    if (playerState.currentTrack) {
      title.textContent = playerState.currentTrack.title;
      artist.textContent = playerState.currentTrack.artist;
    } else {
      title.textContent = 'No Track';
      artist.textContent = 'Select Song';
    }
  }

  function updatePlayPauseIcon() {
    const icon = document.getElementById('rx-music-play-icon');
    if (icon) {
      icon.src = playerState.isPlaying ? 
        (config.images.pauseIcon || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'white\'><path d=\'M6 19h4V5H6v14zm8-14v14h4V5h-4z\'/></svg>') :
        (config.images.playIcon || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'white\'><path d=\'M8 5v14l11-7z\'/></svg>');
    }
  }

  function playTrack(index) {
    if (index >= 0 && index < playerState.playlist.length) {
      playerState.currentIndex = index;
      playerState.currentTrack = playerState.playlist[index];
      
      initAudio();
      playerState.audioElement.src = playerState.currentTrack.url;
      playerState.audioElement.play().catch(e => console.log('Playback failed:', e));
      playerState.isPlaying = true;
      
      updateTrackInfo();
      updatePlayPauseIcon();
      saveLastPlayed(index);
      updatePlaylistActiveItem();
    }
  }

  function togglePlayPause() {
    if (!playerState.currentTrack) {
      if (playerState.playlist.length > 0) {
        playTrack(0);
      }
      return;
    }
    
    initAudio();
    
    if (playerState.isPlaying) {
      playerState.audioElement.pause();
      playerState.isPlaying = false;
    } else {
      playerState.audioElement.play().catch(e => console.log('Playback failed:', e));
      playerState.isPlaying = true;
    }
    
    updatePlayPauseIcon();
  }

  function playNext() {
    if (playerState.playlist.length === 0) return;
    
    let nextIndex = playerState.currentIndex + 1;
    if (nextIndex >= playerState.playlist.length) {
      nextIndex = 0;
    }
    
    playTrack(nextIndex);
  }

  function playPrev() {
    if (playerState.playlist.length === 0) return;
    
    let prevIndex = playerState.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = playerState.playlist.length - 1;
    }
    
    playTrack(prevIndex);
  }

  function setVolume(value) {
    playerState.volume = value;
    if (playerState.audioElement) {
      playerState.audioElement.volume = value / 100;
    }
  }

  function togglePlaylist() {
    const player = document.getElementById('rx-music-window');
    const playlist = document.getElementById('rx-music-playlist');
    const menuBtn = document.getElementById('rx-music-menu-btn');
    
    if (player && playlist && menuBtn) {
      playerState.isPlaylistVisible = !playerState.isPlaylistVisible;
      
      if (playerState.isPlaylistVisible) {
        player.classList.add('expanded');
        playlist.classList.add('show');
        menuBtn.classList.add('active');
        renderPlaylist(); // Render playlist when showing
      } else {
        player.classList.remove('expanded');
        playlist.classList.remove('show');
        menuBtn.classList.remove('active');
      }
    }
  }

  function renderPlaylist() {
    const playlistSection = document.getElementById('rx-music-playlist');
    if (!playlistSection) return;
    
    let html = '';
    playerState.playlist.forEach((track, index) => {
      const isActive = playerState.currentTrack && playerState.currentTrack.url === track.url;
      html += `
        <div class="rx-music-playlist-item ${isActive ? 'active' : ''}" data-index="${index}">
          <div class="rx-music-playlist-info">
            <div class="rx-music-playlist-title">${track.title}</div>
            <div class="rx-music-playlist-artist">${track.artist}</div>
          </div>
          <div class="rx-music-playlist-duration">${track.duration}</div>
        </div>
      `;
    });
    
    playlistSection.innerHTML = html;
    
    // Add click events to playlist items
    document.querySelectorAll('.rx-music-playlist-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(item.dataset.index);
        playTrack(index);
        // Auto-close playlist after selection
        setTimeout(() => {
          if (playerState.isPlaylistVisible) {
            togglePlaylist();
          }
        }, 300);
      });
    });
  }

  function updatePlaylistActiveItem() {
    document.querySelectorAll('.rx-music-playlist-item').forEach(item => {
      const index = parseInt(item.dataset.index);
      if (index === playerState.currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * ===============================
   * Draggable Function
   * ===============================
   */
  function makeDraggable(element, handle) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let currentX, currentY;
    let dragStartTime;
    let isTouchDevice = ('ontouchstart' in window);

    function getClientCoordinates(e) {
      if (e.type.startsWith('touch')) {
        const touch = e.touches[0] || e.changedTouches[0];
        return {
          clientX: touch.clientX,
          clientY: touch.clientY
        };
      }
      return {
        clientX: e.clientX,
        clientY: e.clientY
      };
    }

    function startDrag(e) {
      if (e.target.closest('#rx-music-close-btn') || 
          e.target.closest('.rx-music-control-btn') ||
          e.target.closest('.rx-music-menu-btn') ||
          e.target.closest('.rx-music-volume-slider') ||
          e.target.closest('.rx-music-progress-bar') ||
          e.target.closest('.rx-music-playlist-item')) {
        return;
      }

      e.preventDefault();
      
      const coords = getClientCoordinates(e);
      const rect = element.getBoundingClientRect();
      
      startX = coords.clientX - rect.left;
      startY = coords.clientY - rect.top;
      
      startLeft = rect.left;
      startTop = rect.top;
      
      isDragging = true;
      dragStartTime = Date.now();
      
      element.classList.add('dragging');
    }

    function onDrag(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      
      const coords = getClientCoordinates(e);
      
      let newLeft = coords.clientX - startX;
      let newTop = coords.clientY - startY;
      
      // Boundary checks
      newLeft = Math.max(5, Math.min(window.innerWidth - element.offsetWidth - 5, newLeft));
      newTop = Math.max(5, Math.min(window.innerHeight - element.offsetHeight - 5, newTop));
      
      element.style.left = newLeft + 'px';
      element.style.top = newTop + 'px';
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.style.transform = 'none';
      
      currentX = newLeft;
      currentY = newTop;
    }

    function stopDrag(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      
      element.classList.remove('dragging');
      
      if (currentX !== undefined && currentY !== undefined) {
        saveWindowPosition(currentX, currentY);
      }
      
      isDragging = false;
    }

    // Mouse events
    handle.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);

    // Touch events
    handle.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('touchend', stopDrag);
  }

  /**
   * ===============================
   * Trigger Setup
   * ===============================
   */
  function setupTrigger() {
    const playerWindow = document.getElementById('rx-music-window');
    if (!playerWindow) return;

    const triggerSelector = '.RX-SMART-BUTTON-menu-item.RX-item-7[data-link=""]';
    
    function openPlayerWindow() {
      console.log('RX Music Player: Opening window');
      playerWindow.classList.add('show');
      saveWindowState(true);
      
      if (playerState.playlist.length > 0 && !playerState.currentTrack) {
        playerState.currentTrack = playerState.playlist[0];
        updateTrackInfo();
      }
    }

    function attachToTrigger() {
      const trigger = document.querySelector(triggerSelector);
      if (trigger) {
        console.log('RX Music Player: Found trigger');
        
        trigger.removeEventListener('click', openPlayerWindow);
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openPlayerWindow();
        });
        
        return true;
      }
      
      // Fallback: look for images
      const images = document.querySelectorAll('img[src*="RX-MUSIC.png"]');
      for (const img of images) {
        const parent = img.closest('.RX-SMART-BUTTON-menu-item');
        if (parent) {
          console.log('RX Music Player: Found trigger by image');
          
          parent.removeEventListener('click', openPlayerWindow);
          parent.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openPlayerWindow();
          });
          
          return true;
        }
      }
      
      return false;
    }

    if (!attachToTrigger()) {
      console.log('RX Music Player: Watching for trigger...');
      
      const observer = new MutationObserver(() => {
        if (attachToTrigger()) {
          console.log('RX Music Player: Trigger attached');
          observer.disconnect();
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * ===============================
   * Setup Interactions
   * ===============================
   */
  function setupInteractions() {
    const playerWindow = document.getElementById('rx-music-window');
    const closeBtn = document.getElementById('rx-music-close-btn');
    const header = document.getElementById('rx-music-header');
    const playPauseBtn = document.getElementById('rx-music-play-pause-btn');
    const prevBtn = document.getElementById('rx-music-prev-btn');
    const nextBtn = document.getElementById('rx-music-next-btn');
    const menuBtn = document.getElementById('rx-music-menu-btn');
    const volumeSlider = document.getElementById('rx-music-volume-slider');
    const progressBar = document.getElementById('rx-music-progress-bar');

    if (!playerWindow || !closeBtn || !header) return;

    // Make window draggable
    makeDraggable(playerWindow, header);

    // Load saved position
    const savedPos = loadWindowPosition();
    if (savedPos) {
      playerWindow.style.left = savedPos.left + 'px';
      playerWindow.style.top = savedPos.top + 'px';
      playerWindow.style.right = 'auto';
      playerWindow.style.bottom = 'auto';
      playerWindow.style.transform = 'none';
    }

    // Load playlist and last played
    loadPlaylist();
    loadLastPlayed();
    
    // Initialize display
    updateTrackInfo();

    // Event Listeners
    closeBtn.addEventListener('click', () => {
      playerWindow.classList.remove('show');
      saveWindowState(false);
      
      // Pause music when closing
      if (playerState.isPlaying && playerState.audioElement) {
        playerState.audioElement.pause();
        playerState.isPlaying = false;
        updatePlayPauseIcon();
      }
      
      // Hide playlist if visible
      if (playerState.isPlaylistVisible) {
        playerWindow.classList.remove('expanded');
        document.getElementById('rx-music-playlist').classList.remove('show');
        menuBtn.classList.remove('active');
        playerState.isPlaylistVisible = false;
      }
    });

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', togglePlayPause);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', playPrev);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', playNext);
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlaylist();
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        setVolume(parseInt(e.target.value));
      });
      volumeSlider.value = playerState.volume;
    }

    if (progressBar) {
      progressBar.addEventListener('click', seek);
    }

    // Load window state
    if (loadWindowState()) {
      playerWindow.classList.add('show');
    }

    setupTrigger();
  }

  /**
   * ===============================
   * Initialize
   * ===============================
   */
  function init() {
    if (window.__RX_MUSIC_INIT__) return;
    window.__RX_MUSIC_INIT__ = true;

    console.log('RX Music Player: Initializing...');
    
    injectCSS();
    injectHTML();

    setTimeout(() => {
      setupInteractions();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();