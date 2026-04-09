// media-controller.js - COMPLETE WORKING VERSION
const MediaController = {
    audioStates: new Map(),
    currentQuestionId: null,
    currentAudio: null,
    audioElements: new Map(),
    isAudioPlaying: false,
    
    init: function() {
        console.log('🔊 MediaController initializing...');
        
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
            const saved = localStorage.getItem('examAudioStates');
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
            localStorage.setItem('examAudioStates', JSON.stringify(states));
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
        const modalHTML = `
            <div id="imageModal" class="image-modal-overlay">
                <div class="image-modal-content">
                    <button class="image-modal-close">×</button>
                    <img id="modalImage" src="" alt="Enlarged view">
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        document.querySelector('.image-modal-close').addEventListener('click', () => {
            this.closeImageModal();
        });
        
        document.getElementById('imageModal').addEventListener('click', (e) => {
            if (e.target.id === 'imageModal') {
                this.closeImageModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeImageModal();
            }
        });
        
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
        this.currentQuestionId = UserState.currentQuestionId || 1;
        console.log(`🔧 Setting up audio for Q${this.currentQuestionId}`);
        
        // Load audio states
        this.loadAudioStates();
        
        // Setup audio elements
        setTimeout(() => {
            this.setupAllAudioElements();
        }, 500);
    },
    
    setupAllAudioElements: function() {
        const containers = document.querySelectorAll('.content-audio');
        
        containers.forEach((container, index) => {
            const audioElement = container.querySelector('audio');
            if (!audioElement) return;
            
            const playCount = this.getPlayCount(this.currentQuestionId, index);
            const audioId = `audio-${this.currentQuestionId}-${index}`;
            
            this.createAudioButton(container, audioElement, audioId, index, playCount);
        });
    },
    
    createAudioButton: function(container, audioElement, audioId, audioIndex, initialPlayCount) {
        const oldBtn = container.querySelector('.audio-play-button');
        if (oldBtn) oldBtn.remove();
        
        const button = document.createElement('button');
        button.className = 'audio-play-button';
        button.dataset.audioId = audioId;
        button.dataset.index = audioIndex;
        
        if (initialPlayCount >= 2) {
            button.innerHTML = '⏹️ Completed (2/2)';
            button.classList.add('completed');
            button.disabled = true;
        } else {
            button.innerHTML = `▶ ${initialPlayCount > 0 ? 'Play Again' : 'Play Audio'} (${initialPlayCount}/2)`;
            button.disabled = false;
        }
        
        container.insertBefore(button, audioElement);
        
        this.audioElements.set(audioId, {
            element: audioElement,
            button: button,
            questionId: this.currentQuestionId,
            index: audioIndex,
            playCount: initialPlayCount,
            timeout: null
        });
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handlePlayClick(audioId);
        });
        
        this.setupAudioListeners(audioElement, audioId);
    },
    
    setupAudioListeners: function(audioElement, audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        const newAudio = audioElement.cloneNode(true);
        audioElement.parentNode.replaceChild(newAudio, audioElement);
        audioData.element = newAudio;
        
        newAudio.addEventListener('play', () => {
            console.log('▶ Audio started:', audioId);
            audioData.isPlaying = true;
            this.currentAudio = audioId;
            this.onAudioPlay(audioId);
        });
        
        newAudio.addEventListener('playing', () => {
            console.log('🔊 Audio is producing sound:', audioId);
        });
        
        newAudio.addEventListener('canplay', () => {
            console.log('✅ Audio can play:', audioId);
        });
        
        newAudio.addEventListener('canplaythrough', () => {
            console.log('✅ Audio fully loaded:', audioId);
        });
        
        newAudio.addEventListener('ended', () => {
            console.log('⏹️ Audio ended:', audioId);
            audioData.isPlaying = false;
            this.onAudioEnd(audioId);
        });
        
        newAudio.addEventListener('error', (e) => {
            console.error('❌ Audio error:', audioId, e);
            audioData.isPlaying = false;
            this.onAudioError(audioId);
        });
        
        newAudio.addEventListener('pause', () => {
            audioData.isPlaying = false;
            this.onAudioPause(audioId);
        });
        
        newAudio.load();
    },
    
    handlePlayClick: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        if (audioData.playCount >= 2) {
            console.log('Already played 2 times');
            return;
        }
        
        if (this.currentAudio && this.currentAudio !== audioId) {
            this.stopAudio(this.currentAudio);
        }
        
        audioData.button.innerHTML = '⌛ Loading...';
        audioData.button.disabled = true;
        audioData.button.classList.add('loading');
        
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
            
            audioData.button.classList.remove('loading');
            audioData.button.innerHTML = `▶ ${audioData.playCount > 0 ? 'Play Again' : 'Play Audio'} (${audioData.playCount}/2)`;
            audioData.button.disabled = false;
            
            this.retryAudioPlay(audioId, error);
        });
    },
    
    retryAudioPlay: function(audioId, error) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        setTimeout(() => {
            audioData.element.currentTime = 0;
            
            const retryPromise = audioData.element.play();
            retryPromise.catch(retryError => {
                console.log('Retry failed:', retryError);
                this.recreateAudioElement(audioId);
            });
        }, 500);
    },
    
    recreateAudioElement: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        const originalSrc = audioData.element.src;
        const newAudio = new Audio();
        newAudio.src = originalSrc;
        newAudio.preload = 'auto';
        newAudio.style.display = 'none';
        
        audioData.element.parentNode.replaceChild(newAudio, audioData.element);
        audioData.element = newAudio;
        
        this.setupAudioListeners(newAudio, audioId);
        
        setTimeout(() => {
            this.playAudio(audioId);
        }, 1000);
    },
    
    onAudioPlay: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        audioData.button.classList.remove('loading');
        audioData.button.classList.add('playing');
        audioData.button.innerHTML = `Playing (${audioData.playCount + 1}/2)`;
        audioData.button.disabled = true;
        
        this.disableInteractions();
    },
    
    onAudioEnd: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        audioData.playCount++;
        this.setPlayCount(audioData.questionId, audioData.index, audioData.playCount);
        
        if (this.currentAudio === audioId) {
            this.currentAudio = null;
        }
        
        if (audioData.playCount >= 2) {
            audioData.button.classList.remove('playing');
            audioData.button.classList.add('completed');
            audioData.button.innerHTML = 'Completed (2/2)';
            audioData.button.disabled = true;
            
            this.enableInteractions();
        } else {
            audioData.button.classList.remove('playing');
            audioData.button.innerHTML = ` Waiting... (${audioData.playCount}/2)`;
            audioData.button.disabled = true;
            
            this.disableInteractions();
            
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
        
        audioData.button.classList.remove('playing', 'loading');
        audioData.button.innerHTML = `▶ ${audioData.playCount > 0 ? 'Try Again' : 'Play Audio'} (${audioData.playCount}/2)`;
        audioData.button.disabled = false;
        
        this.enableInteractions();
    },
    
    onAudioPause: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        if (audioData.timeout) {
            clearTimeout(audioData.timeout);
            audioData.timeout = null;
        }
        
        audioData.button.classList.remove('playing');
        audioData.button.innerHTML = `▶ ${audioData.playCount > 0 ? 'Resume' : 'Play Audio'} (${audioData.playCount}/2)`;
        audioData.button.disabled = false;
        
        if (this.currentAudio === audioId) {
            this.currentAudio = null;
        }
        
        this.enableInteractions();
    },
    
    stopAudio: function(audioId) {
        const audioData = this.audioElements.get(audioId);
        if (!audioData) return;
        
        audioData.element.pause();
        audioData.element.currentTime = 0;
        
        if (audioData.timeout) {
            clearTimeout(audioData.timeout);
            audioData.timeout = null;
        }
        
        audioData.button.classList.remove('playing');
        audioData.button.innerHTML = `▶ ${audioData.playCount > 0 ? 'Play Again' : 'Play Audio'} (${audioData.playCount}/2)`;
        audioData.button.disabled = false;
        
        if (this.currentAudio === audioId) {
            this.currentAudio = null;
        }
        
        this.enableInteractions();
    },
    
    disableInteractions: function() {
        document.body.classList.add('audio-playing');
        
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
        
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            el.style.pointerEvents = '';
            el.style.opacity = '';
        });
    },
    
    stopAllAudio: function() {
        this.audioElements.forEach((data, audioId) => {
            this.stopAudio(audioId);
        });
        
        this.enableInteractions();
    },
    
    updateForQuestion: function(questionId) {
        console.log('🔄 Updating audio for Q' + questionId);
        
        this.stopAllAudio();
        this.currentQuestionId = questionId;
        this.currentAudio = null;
        
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
            
            const existingBtn = container.querySelector('.audio-play-button');
            if (existingBtn) {
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
                
                this.audioElements.set(audioId, {
                    element: audioElement,
                    button: existingBtn,
                    questionId: this.currentQuestionId,
                    index: index,
                    playCount: playCount,
                    timeout: null
                });
            } else {
                this.createAudioButton(container, audioElement, audioId, index, playCount);
            }
            
            audioElement.style.display = 'none';
            audioElement.controls = false;
        });
    },
    
    setupEventListeners: function() {
        document.addEventListener('click', () => {
            this.resumeAudioContext();
        }, { once: true });
        
        this.setupQuestionListeners();
    },
    
    resumeAudioContext: function() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const context = new AudioContext();
            if (context.state === 'suspended') {
                context.resume();
            }
        }
    },
    
    setupQuestionListeners: function() {
        const originalSetCurrent = UserState.setCurrentQuestionId;
        UserState.setCurrentQuestionId = function(id) {
            originalSetCurrent.call(this, id);
            MediaController.updateForQuestion(id);
        };
        
        if (typeof QuestionLoader !== 'undefined') {
            const originalLoad = QuestionLoader.loadQuestion;
            QuestionLoader.loadQuestion = function(id, scrollReset) {
                MediaController.stopAllAudio();
                const result = originalLoad.call(this, id, scrollReset);
                MediaController.updateForQuestion(id);
                return result;
            };
        }
        
        if (typeof QuestionNav !== 'undefined') {
            ['toggleView', 'prevQ', 'nextQ'].forEach(method => {
                const original = QuestionNav[method];
                QuestionNav[method] = function() {
                    MediaController.stopAllAudio();
                    return original.call(this);
                };
            });
        }
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('qnum')) {
                this.stopAllAudio();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof MediaController !== 'undefined') {
            MediaController.init();
        }
    }, 1500);
});

window.MediaController = MediaController;