// media-controller.js - COMPLETE WORKING VERSION WITH REFRESH RESET

const MediaController = {
    // State management
    audioStates: new Map(), // questionId-audioIndex -> playCount
    currentQuestionId: null,
    currentAudio: null,
    audioElements: new Map(), // audioId -> {element, button, timeout}
    isAudioPlaying: false,
    
    // Initialize everything
    init: function() {
        console.log('🔊 MediaController initializing...');
        
        // RESET ON REFRESH - Clear all audio states
        console.log('🔄 Resetting audio states on refresh...');
        this.clearAllStates();
        
        // Load saved states (will be empty after reset)
        this.loadAudioStates();
        
        // Setup image modal
        this.setupImageModal();
        
        // Setup audio system
        this.setupAudioSystem();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ MediaController ready');
    },
    
    // ============ STATE MANAGEMENT ============
    loadAudioStates: function() {
        try {
            const saved = localStorage.getItem('audioPlayStates');
            if (saved) {
                const states = JSON.parse(saved);
                for (const [key, value] of Object.entries(states)) {
                    this.audioStates.set(key, value);
                }
                console.log('📊 Loaded audio states');
            }
        } catch (e) {
            console.error('Failed to load audio states:', e);
        }
    },
    
    saveAudioStates: function() {
        try {
            const states = Object.fromEntries(this.audioStates);
            localStorage.setItem('audioPlayStates', JSON.stringify(states));
        } catch (e) {
            console.error('Failed to save audio states:', e);
        }
    },
    
    getStateKey: function(questionId, audioIndex) {
        return `${questionId}-${audioIndex}`;
    },
    
    getPlayCount: function(questionId, audioIndex) {
        const key = this.getStateKey(questionId, audioIndex);
        return this.audioStates.get(key) || 0;
    },
    
    setPlayCount: function(questionId, audioIndex, count) {
        const key = this.getStateKey(questionId, audioIndex);
        this.audioStates.set(key, count);
        this.saveAudioStates();
    },
    
    // ============ IMAGE MODAL ============
    setupImageModal: function() {
        // Create modal
        const modalHTML = `
            <div id="imageModal" class="image-modal-overlay">
                <div class="image-modal-content">
                    <button class="image-modal-close">×</button>
                    <img id="modalImage" src="" alt="Enlarged view">
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Close button
        document.querySelector('.image-modal-close').addEventListener('click', () => {
            this.closeImageModal();
        });
        
        // Close on overlay click
        document.getElementById('imageModal').addEventListener('click', (e) => {
            if (e.target.id === 'imageModal') {
                this.closeImageModal();
            }
        });
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeImageModal();
            }
        });
        
        // Image click handler
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('content-image')) {
                this.openImageModal(e.target.src);
            }
        });
    },
    
    openImageModal: function(src) {
        document.getElementById('modalImage').src = src;
        document.getElementById('imageModal').style.display = 'flex';
        document.body.classList.add('modal-open');
    },
    
    closeImageModal: function() {
        document.getElementById('imageModal').style.display = 'none';
        document.body.classList.remove('modal-open');
    },
    
    // ============ AUDIO SYSTEM ============
    setupAudioSystem: function() {
        // Get current question
        this.currentQuestionId = UserState.currentQuestionId || 1;
        console.log(`🔧 Setting up audio for Q${this.currentQuestionId}`);
        
        // Setup all audio elements
        this.setupAllAudioElements();
    },
    
    setupAllAudioElements: function() {
        const containers = document.querySelectorAll('.content-audio');
        
        containers.forEach((container, index) => {
            const audioElement = container.querySelector('audio');
            if (!audioElement) return;
            
            // Get stored play count (will be 0 after reset)
            const playCount = this.getPlayCount(this.currentQuestionId, index);
            
            // Hide original audio
            audioElement.style.display = 'none';
            audioElement.controls = false;
            
            // Create unique ID
            const audioId = `audio-${this.currentQuestionId}-${index}`;
            
            // Create play button
            this.createAudioButton(container, audioElement, audioId, index, playCount);
        });
    },
    
    createAudioButton: function(container, audioElement, audioId, audioIndex, initialPlayCount) {
        // Remove existing button
        const oldBtn = container.querySelector('.audio-play-button');
        if (oldBtn) oldBtn.remove();
        
        // Create button
        const button = document.createElement('button');
        button.className = 'audio-play-button';
        button.dataset.audioId = audioId;
        button.dataset.index = audioIndex;
        
        // Set button text based on play count
        if (initialPlayCount >= 2) {
            button.innerHTML = '⏹️ Completed (2/2)';
            button.classList.add('completed');
            button.disabled = true;
        } else {
            button.innerHTML = `▶ ${initialPlayCount > 0 ? 'Play Again' : 'Play Audio'} (${initialPlayCount}/2)`;
            button.disabled = false;
        }
        
        // Add to container
        container.insertBefore(button, audioElement);
        
        // Store reference
        this.audioElements.set(audioId, {
            element: audioElement,
            button: button,
            questionId: this.currentQuestionId,
            index: audioIndex,
            playCount: initialPlayCount,
            timeout: null
        });
        
        // Add click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handlePlayClick(audioId);
        });
        
        // Setup audio event listeners
        this.setupAudioListeners(audioElement, audioId);
    },
    
    setupAudioListeners: function(audioElement, audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        // Clear existing listeners
        const newAudio = audioElement.cloneNode(true);
        audioElement.parentNode.replaceChild(newAudio, audioElement);
        
        // Update reference
        audioData.element = newAudio;
        
        // Play event
        newAudio.addEventListener('play', () => {
            console.log('▶ Audio started:', audioId);
            audioData.isPlaying = true;
            this.currentAudio = audioId;
            this.onAudioPlay(audioId);
        });
        
        // Playing event (audio actually producing sound)
        newAudio.addEventListener('playing', () => {
            console.log('🔊 Audio is producing sound:', audioId);
        });
        
        // Can play event
        newAudio.addEventListener('canplay', () => {
            console.log('✅ Audio can play:', audioId);
        });
        
        // Can play through event
        newAudio.addEventListener('canplaythrough', () => {
            console.log('✅ Audio fully loaded:', audioId);
        });
        
        // Ended event
        newAudio.addEventListener('ended', () => {
            console.log('⏹️ Audio ended:', audioId);
            audioData.isPlaying = false;
            this.onAudioEnd(audioId);
        });
        
        // Error event
        newAudio.addEventListener('error', (e) => {
            console.error('❌ Audio error:', audioId, e);
            audioData.isPlaying = false;
            this.onAudioError(audioId);
        });
        
        // Pause event
        newAudio.addEventListener('pause', () => {
            audioData.isPlaying = false;
            this.onAudioPause(audioId);
        });
        
        // Load audio
        newAudio.load();
    },
    
    handlePlayClick: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        // Check if already played 2 times
        if (audioData.playCount >= 2) {
            console.log('Already played 2 times');
            return;
        }
        
        // Stop any currently playing audio
        if (this.currentAudio && this.currentAudio !== audioId) {
            this.stopAudio(this.currentAudio);
        }
        
        // Update button to loading
        audioData.button.innerHTML = '⌛ Loading...';
        audioData.button.disabled = true;
        audioData.button.classList.add('loading');
        
        // Play audio with error handling
        this.playAudio(audioId);
    },
    
    playAudio: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        const playPromise = audioData.element.play();
        
        playPromise.then(() => {
            console.log('Audio play succeeded');
        }).catch(error => {
            console.log('Audio play failed, retrying...', error);
            
            // Reset button
            audioData.button.classList.remove('loading');
            audioData.button.innerHTML = `▶ ${audioData.playCount > 0 ? 'Play Again' : 'Play Audio'} (${audioData.playCount}/2)`;
            audioData.button.disabled = false;
            
            // Try again with different strategy
            this.retryAudioPlay(audioId, error);
        });
    },
    
    retryAudioPlay: function(audioId, error) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        // Strategy 1: Reset and retry
        setTimeout(() => {
            audioData.element.currentTime = 0;
            
            const retryPromise = audioData.element.play();
            retryPromise.catch(retryError => {
                console.log('Retry failed:', retryError);
                
                // Strategy 2: Create new audio element
                this.recreateAudioElement(audioId);
            });
        }, 500);
    },
    
    recreateAudioElement: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        // Get original source
        const originalSrc = audioData.element.src;
        
        // Create new audio element
        const newAudio = new Audio();
        newAudio.src = originalSrc;
        newAudio.preload = 'auto';
        newAudio.style.display = 'none';
        
        // Replace old element
        audioData.element.parentNode.replaceChild(newAudio, audioData.element);
        audioData.element = newAudio;
        
        // Re-setup listeners
        this.setupAudioListeners(newAudio, audioId);
        
        // Try playing again
        setTimeout(() => {
            this.playAudio(audioId);
        }, 1000);
    },
    
    onAudioPlay: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        // Update button
        audioData.button.classList.remove('loading');
        audioData.button.classList.add('playing');
        audioData.button.innerHTML = `Playing (${audioData.playCount + 1}/2)`;
        audioData.button.disabled = true;
        
        // Disable interactions
        this.disableInteractions();
    },
    
    onAudioEnd: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        // Increment play count
        audioData.playCount++;
        this.setPlayCount(audioData.questionId, audioData.index, audioData.playCount);
        
        // Clear current audio
        if (this.currentAudio === audioId) {
            this.currentAudio = null;
        }
        
        // Check if played 2 times
        if (audioData.playCount >= 2) {
            // Mark as completed
            audioData.button.classList.remove('playing');
            audioData.button.classList.add('completed');
            audioData.button.innerHTML = 'Completed (2/2)';
            audioData.button.disabled = true;
            
            // Enable interactions
            this.enableInteractions();
        } else {
            // Show waiting state
            audioData.button.classList.remove('playing');
            audioData.button.innerHTML = ` Waiting... (${audioData.playCount}/2)`;
            audioData.button.disabled = true;
            
            // Disable interactions during wait
            this.disableInteractions();
            
            // Auto-play after 5 seconds
            audioData.timeout = setTimeout(() => {
                if (audioData.playCount < 2) {
                    console.log('Auto-playing 2nd time...');
                    audioData.element.currentTime = 0;
                    this.playAudio(audioId);
                }
            }, 5000);
        }
    },
    
    onAudioError: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        // Reset button
        audioData.button.classList.remove('playing', 'loading');
        audioData.button.innerHTML = `▶ ${audioData.playCount > 0 ? 'Try Again' : 'Play Audio'} (${audioData.playCount}/2)`;
        audioData.button.disabled = false;
        
        // Enable interactions
        this.enableInteractions();
    },
    
    onAudioPause: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        // Clear timeout if exists
        if (audioData.timeout) {
            clearTimeout(audioData.timeout);
            audioData.timeout = null;
        }
        
        // Update button
        audioData.button.classList.remove('playing');
        audioData.button.innerHTML = `▶ ${audioData.playCount > 0 ? 'Resume' : 'Play Audio'} (${audioData.playCount}/2)`;
        audioData.button.disabled = false;
        
        // Clear current audio
        if (this.currentAudio === audioId) {
            this.currentAudio = null;
        }
        
        // Enable interactions
        this.enableInteractions();
    },
    
    stopAudio: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        // Stop audio
        audioData.element.pause();
        audioData.element.currentTime = 0;
        
        // Clear timeout
        if (audioData.timeout) {
            clearTimeout(audioData.timeout);
            audioData.timeout = null;
        }
        
        // Update button
        audioData.button.classList.remove('playing');
        audioData.button.innerHTML = `▶ ${audioData.playCount > 0 ? 'Play Again' : 'Play Audio'} (${audioData.playCount}/2)`;
        audioData.button.disabled = false;
        
        // Clear current audio
        if (this.currentAudio === audioId) {
            this.currentAudio = null;
        }
        
        // Enable interactions
        this.enableInteractions();
    },
    
    disableInteractions: function() {
        document.body.classList.add('audio-playing');
        
        // Disable all buttons except option cards
        const elements = document.querySelectorAll('button, .qnum, .btn-finish, .nav-btn');
        elements.forEach(el => {
            if (!el.classList.contains('audio-play-button') && 
                !el.classList.contains('option-card')) {
                el.style.pointerEvents = 'none';
                el.style.opacity = '0.5';
            }
        });
    },
    
    enableInteractions: function() {
        document.body.classList.remove('audio-playing');
        
        // Enable all elements
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            el.style.pointerEvents = '';
            el.style.opacity = '';
        });
    },
    
    stopAllAudio: function() {
        // Stop all audios
        this.audioElements.forEach((data, audioId) => {
            this.stopAudio(audioId);
        });
        
        // Enable interactions
        this.enableInteractions();
    },
    
    // ============ QUESTION NAVIGATION ============
    updateForQuestion: function(questionId) {
        console.log('🔄 Updating audio for Q' + questionId);
        
        // Stop any playing audio
        this.stopAllAudio();
        
        // Update current question
        this.currentQuestionId = questionId;
        
        // Clear current references
        this.currentAudio = null;
        
        // Update audio buttons
        setTimeout(() => {
            this.updateAudioButtons();
        }, 300);
    },
    
    updateAudioButtons: function() {
        const containers = document.querySelectorAll('.content-audio');
        
        containers.forEach((container, index) => {
            const audioElement = container.querySelector('audio');
            if (!audioElement) return;
            
            const playCount = this.getPlayCount(this.currentQuestionId, index);
            const audioId = `audio-${this.currentQuestionId}-${index}`;
            
            // Update or create button
            const existingBtn = container.querySelector('.audio-play-button');
            if (existingBtn) {
                // Update existing button
                if (playCount >= 2) {
                    existingBtn.innerHTML = 'Completed (2/2)';
                    existingBtn.classList.add('completed');
                    existingBtn.disabled = true;
                } else {
                    existingBtn.innerHTML = `${playCount > 0 ? 'Play Again' : 'Play Audio'} (${playCount}/2)`;
                    existingBtn.classList.remove('completed');
                    existingBtn.disabled = false;
                }
                existingBtn.dataset.audioId = audioId;
                
                // Update stored data
                this.audioElements.set(audioId, {
                    element: audioElement,
                    button: existingBtn,
                    questionId: this.currentQuestionId,
                    index: index,
                    playCount: playCount,
                    timeout: null
                });
            } else {
                // Create new button
                this.createAudioButton(container, audioElement, audioId, index, playCount);
            }
            
            // Setup audio element
            audioElement.style.display = 'none';
            audioElement.controls = false;
        });
    },
    
    // ============ EVENT LISTENERS ============
    setupEventListeners: function() {
        // Global click to resume audio context
        document.addEventListener('click', () => {
            this.resumeAudioContext();
        }, { once: true });
        
        // Setup question navigation listeners
        this.setupQuestionListeners();
    },
    
    resumeAudioContext: function() {
        // This helps with iOS/Safari audio
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const context = new AudioContext();
            if (context.state === 'suspended') {
                context.resume();
            }
        }
    },
    
    setupQuestionListeners: function() {
        // Listen for question changes through UserState
        const originalSetCurrent = UserState.setCurrentQuestionId;
        UserState.setCurrentQuestionId = function(id) {
            originalSetCurrent.call(this, id);
            MediaController.updateForQuestion(id);
        };
        
        // Also hook into QuestionLoader
        if (typeof QuestionLoader !== 'undefined') {
            const originalLoad = QuestionLoader.loadQuestion;
            QuestionLoader.loadQuestion = function(id, scrollReset) {
                MediaController.stopAllAudio();
                const result = originalLoad.call(this, id, scrollReset);
                MediaController.updateForQuestion(id);
                return result;
            };
        }
        
        // Hook into navigation
        if (typeof QuestionNav !== 'undefined') {
            ['toggleView', 'prevQ', 'nextQ'].forEach(method => {
                const original = QuestionNav[method];
                QuestionNav[method] = function() {
                    MediaController.stopAllAudio();
                    return original.call(this);
                };
            });
        }
        
        // Stop audio when clicking grid
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('qnum')) {
                this.stopAllAudio();
            }
        });
    },
    
    // Clear all states (for new exam)
    clearAllStates: function() {
        this.audioStates.clear();
        this.audioElements.clear();
        localStorage.removeItem('audioPlayStates');
        console.log('🧹 Cleared all audio states');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof MediaController !== 'undefined') {
            MediaController.init();
        }
    }, 1500);
});

// Make global
window.MediaController = MediaController;