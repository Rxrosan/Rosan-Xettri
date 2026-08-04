// Login System and Application
let loginModal, mainContent, loginCode, loginBtn, loginError, loginStatus;
let modeSwitchBtn, modeSwitchModal, modeSwitchCode, saveModeBtn, cancelModeBtn, modeSwitchError;
let fileInput, encodeBtn, encodedText, copyEncoded, maxSizeInput, downloadEncoded;
let previewContainer, fileInfo, encodedStats, decodeText, decodeBtn, decodedContainer;
let downloadDecoded, decodeStats, textFileInput, tabs, tabContents;

// Login codes
const NORMAL_LOGIN = 'RX2061';
const SUPER_LOGIN = 'RX2004';

// User state
let currentUserType = null;
let lastDataUrl = null;
let lastDecodedBlob = null;
let lastRXFileContent = null;
let lastRXFileBlob = null;

// Initialize all DOM elements
function initializeDOMElements() {
    // Login elements
    loginModal = document.getElementById('loginModal');
    mainContent = document.getElementById('mainContent');
    loginCode = document.getElementById('loginCode');
    loginBtn = document.getElementById('loginBtn');
    loginError = document.getElementById('loginError');
    loginStatus = document.getElementById('loginStatus');
    modeSwitchBtn = document.getElementById('modeSwitchBtn');
    modeSwitchModal = document.getElementById('modeSwitchModal');
    modeSwitchCode = document.getElementById('modeSwitchCode');
    saveModeBtn = document.getElementById('saveModeBtn');
    cancelModeBtn = document.getElementById('cancelModeBtn');
    modeSwitchError = document.getElementById('modeSwitchError');

    // Application elements
    fileInput = document.getElementById('fileInput');
    encodeBtn = document.getElementById('encodeBtn');
    encodedText = document.getElementById('encodedText');
    copyEncoded = document.getElementById('copyEncoded');
    maxSizeInput = document.getElementById('maxSize');
    downloadEncoded = document.getElementById('downloadEncoded');
    previewContainer = document.getElementById('previewContainer');
    fileInfo = document.getElementById('fileInfo');
    encodedStats = document.getElementById('encodedStats');
    decodeText = document.getElementById('decodeText');
    decodeBtn = document.getElementById('decodeBtn');
    decodedContainer = document.getElementById('decodedContainer');
    downloadDecoded = document.getElementById('downloadDecoded');
    decodeStats = document.getElementById('decodeStats');
    textFileInput = document.getElementById('textFileInput');
    tabs = document.querySelectorAll('.tab');
    tabContents = document.querySelectorAll('.tab-content');
}

// Check existing login
function checkExistingLogin() {
    const savedLogin = localStorage.getItem('rxStudioLogin');
    if (savedLogin === 'normal' || savedLogin === 'super') {
        currentUserType = savedLogin;
        showMainContent();
        return true;
    }
    return false;
}

// Show main content
function showMainContent() {
    if (loginModal) loginModal.classList.add('hidden');
    if (mainContent) mainContent.classList.remove('hidden');
    updateLoginStatus();
}

// Update login status
function updateLoginStatus() {
    if (!loginStatus || !modeSwitchBtn) return;
    
    if (currentUserType === 'super') {
        loginStatus.textContent = ' Super Access';
        loginStatus.style.color = 'var(--success)';
        modeSwitchBtn.textContent = 'Normal Mode';
        modeSwitchBtn.style.background = 'var(--success)';
    } else {
        loginStatus.textContent = ' Normal Access';
        loginStatus.style.color = 'var(--primary)';
        modeSwitchBtn.textContent = 'Super Mode';
        modeSwitchBtn.style.background = 'var(--secondary)';
    }
}

// Handle login
function handleLogin() {
    const code = loginCode.value.trim().toUpperCase();
    
    if (code === NORMAL_LOGIN) {
        currentUserType = 'normal';
        localStorage.setItem('rxStudioLogin', 'normal');
        showMainContent();
    } else if (code === SUPER_LOGIN) {
        currentUserType = 'super';
        localStorage.setItem('rxStudioLogin', 'super');
        showMainContent();
    } else {
        loginError.style.display = 'block';
        loginCode.value = '';
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 3000);
    }
}

// Mode switch functions
function openModeSwitch() {
    if (!modeSwitchModal) return;
    
    modeSwitchModal.style.display = 'flex';
    modeSwitchCode.value = '';
    modeSwitchError.style.display = 'none';
    
    if (currentUserType === 'super') {
        document.querySelector('.mode-switch-title').textContent = 'Normal Mode';
        document.querySelector('.mode-switch-content p').textContent = 'Click Save to switch to normal mode';
        modeSwitchCode.style.display = 'none';
    } else {
        document.querySelector('.mode-switch-title').textContent = 'RX STUDIO - SUPER MODE';
        document.querySelector('.mode-switch-content p').textContent = 'Enter super access code to acess super mode';
        modeSwitchCode.style.display = 'block';
    }
}

function saveMode() {
    if (currentUserType === 'super') {
        currentUserType = 'normal';
        localStorage.setItem('rxStudioLogin', 'normal');
    } else {
        const code = modeSwitchCode.value.trim().toUpperCase();
        if (code !== SUPER_LOGIN) {
            modeSwitchError.style.display = 'block';
            modeSwitchCode.value = '';
            setTimeout(() => {
                modeSwitchError.style.display = 'none';
            }, 3000);
            return;
        }
        currentUserType = 'super';
        localStorage.setItem('rxStudioLogin', 'super');
    }
    
    modeSwitchModal.style.display = 'none';
    updateLoginStatus();
}

function cancelModeSwitch() {
    if (modeSwitchModal) modeSwitchModal.style.display = 'none';
}

// Setup event listeners
function setupEventListeners() {
    // Login events
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    if (loginCode) {
        loginCode.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }

    // Mode switch events
    if (modeSwitchBtn) modeSwitchBtn.addEventListener('click', openModeSwitch);
    if (saveModeBtn) saveModeBtn.addEventListener('click', saveMode);
    if (cancelModeBtn) cancelModeBtn.addEventListener('click', cancelModeSwitch);
    
    if (modeSwitchModal) {
        modeSwitchModal.addEventListener('click', (e) => {
            if (e.target === modeSwitchModal) cancelModeSwitch();
        });
    }

    // Tab switching
    if (tabs) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }

    // Encode functionality
    if (encodeBtn) encodeBtn.addEventListener('click', encodeImage);
    if (copyEncoded) copyEncoded.addEventListener('click', copyEncodedText);
    if (downloadEncoded) downloadEncoded.addEventListener('click', downloadRXFile);

    // Decode functionality
    if (decodeBtn) decodeBtn.addEventListener('click', decodeImage);
    if (downloadDecoded) downloadDecoded.addEventListener('click', downloadDecodedImage);

    // File handling
    if (fileInput) {
        fileInput.addEventListener('change', handleFileInput);
        fileInput.addEventListener('dragover', handleDragOver);
        fileInput.addEventListener('dragleave', handleDragLeave);
        fileInput.addEventListener('drop', handleDrop);
    }
    
    if (textFileInput) {
        textFileInput.addEventListener('change', handleRXFileInput);
    }
}

// Utility Functions
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => resolve(reader.result);
        reader.readAsText(file);
    });
}

function updateStats(element, text, size) {
    if (element) element.textContent = `${text} • ${formatBytes(size)}`;
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function createPreview(container, src, alt) {
    if (!container) return;
    container.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = 'preview-img';
    container.appendChild(img);
}

// Generate compressed image code with RXSTUDIO tag - OPTIMIZED FOR SUPER MODE
function generateRXImageCode(imageDataUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // For SUPER MODE: Use higher quality but optimize encoding
            let quality = 0.95; // High quality for super mode
            let mimeType = 'image/jpeg';
            
            // For small images or PNG with transparency, use PNG
            if (img.width < 500 && img.height < 500) {
                mimeType = 'image/png';
                quality = 1.0;
            }
            
            const compressedDataUrl = canvas.toDataURL(mimeType, quality);
            
            // Extract base64 data only (remove data:image/jpeg;base64, prefix)
            const base64Data = compressedDataUrl.split(',')[1];
            
            // Create optimized RX file format
            const rxFileData = {
                v: "1.1", // version
                t: Date.now(),
                d: base64Data,
                s: "RXS" // short signature
            };
            
            // Convert to string and use shorter property names
            const jsonString = JSON.stringify(rxFileData);
            
            // For SUPER MODE: Use more efficient encoding
            if (currentUserType === 'super') {
                // Remove unnecessary whitespace from JSON
                const minifiedJson = jsonString.replace(/\s+/g, '');
                resolve(minifiedJson); // Return JSON directly for super mode (shorter)
            } else {
                // Normal mode: use base64 encoding
                const compressedString = btoa(jsonString);
                resolve(compressedString);
            }
        };
        img.src = imageDataUrl;
    });
}

// Decode RX file format - UPDATED FOR NEW FORMAT
function decodeRXFile(rxFileContent) {
    try {
        let rxData;
        
        // Check if it's the new JSON format (super mode) or old base64 format
        if (rxFileContent.startsWith('{') && rxFileContent.endsWith('}')) {
            // New JSON format (super mode)
            rxData = JSON.parse(rxFileContent);
        } else {
            // Old base64 format (normal mode)
            const jsonString = atob(rxFileContent);
            rxData = JSON.parse(jsonString);
        }
        
        // Verify RXSTUDIO tag with new shorter format
        if ((rxData.v !== "1.1" && rxData.header !== "RXSTUDIO_IMAGE_V1") || 
            (rxData.s !== "RXS" && rxData.signature !== "RXSTUDIO_PROPRIETARY")) {
            throw new Error("Invalid RX file format");
        }
        
        // Reconstruct data URL
        return `data:image/jpeg;base64,${rxData.d || rxData.data}`;
    } catch (error) {
        throw new Error("This file is not a valid RX STUDIO image file");
    }
}

// Watermark function (only for normal mode downloads)
function addWatermark(imageDataUrl) {
    if (currentUserType === 'super') {
        return Promise.resolve(imageDataUrl);
    }
    
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText('RX STUDIO', img.width - 2, img.height - 2);
            resolve(canvas.toDataURL());
        };
        img.src = imageDataUrl;
    });
}

// Share RX File - Direct share without download
async function shareRXFile() {
    if (!lastRXFileBlob) {
        alert('No RX file to share. Please encode an image first.');
        return;
    }
    
    try {
        // Create file object for sharing
        const file = new File([lastRXFileBlob], 'RXSTUDIO_IMAGE.rx', { type: 'application/octet-stream' });
        
        // Try to share using Web Share API
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'RX STUDIO Image File',
                text: 'Check out this RX STUDIO image file! Use RX STUDIO to decode it.',
                files: [file]
            });
        } else {
            // If sharing not supported, fallback to download
            alert('Sharing not supported on this device. Downloading file instead.');
            downloadRXFile();
        }
    } catch (error) {
        console.log('Share failed:', error);
        // If sharing fails, fallback to download
        alert('Sharing failed. Downloading file instead.');
        downloadRXFile();
    }
}

// Share Decoded Image - Direct share without download
async function shareDecodedImage() {
    if (!lastDecodedBlob) {
        alert('No decoded image to share.');
        return;
    }
    
    try {
        // Add watermark if needed before sharing
        const dataUrl = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(lastDecodedBlob);
        });
        
        const watermarkedDataUrl = await addWatermark(dataUrl);
        const response = await fetch(watermarkedDataUrl);
        const watermarkedBlob = await response.blob();
        
        // Create file object for sharing
        const file = new File([watermarkedBlob], 'RX_STUDIO_image.png', { type: 'image/png' });
        
        // Try to share using Web Share API
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'RX STUDIO Image',
                text: 'Check out this image decoded with RX STUDIO!',
                files: [file]
            });
        } else {
            // If sharing not supported, fallback to download
            alert('Sharing not supported on this device. Downloading image instead.');
            downloadDecodedImage();
        }
    } catch (error) {
        console.log('Share failed:', error);
        // If sharing fails, fallback to download
        alert('Sharing failed. Downloading image instead.');
        downloadDecodedImage();
    }
}

// Encode Functions
async function encodeImage() {
    const file = fileInput?.files[0];
    if (!file) {
        alert('Please select an image file first.');
        return;
    }

    const maxSize = parseInt(maxSizeInput?.value) || 0;
    
    // Read original file
    const originalDataUrl = await readFileAsDataURL(file);
    
    let processedDataUrl = originalDataUrl;
    
    // Resize if needed
    if (maxSize > 0) {
        const img = new Image();
        img.src = originalDataUrl;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        let { width, height } = img;
        const ratio = Math.min(1, maxSize / Math.max(width, height));
        
        if (ratio < 1) {
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Use appropriate format based on mode and image size
        let quality = currentUserType === 'super' ? 0.95 : 0.8;
        let mimeType = 'image/jpeg';
        
        if (width < 500 && height < 500) {
            mimeType = 'image/png';
            quality = 1.0;
        }
        
        processedDataUrl = canvas.toDataURL(mimeType, quality);
    }
    
    // Generate RX image code (optimized based on mode)
    const rxCode = await generateRXImageCode(processedDataUrl);
    encodedText.value = rxCode;
    lastRXFileContent = rxCode;
    
    // Create blob for sharing
    lastRXFileBlob = new Blob([rxCode], { type: 'application/octet-stream' });
    
    // Show preview of original processed image
    createPreview(previewContainer, processedDataUrl, 'Processed preview');
    lastDataUrl = processedDataUrl;
    downloadEncoded.disabled = false;
    
    // Show optimized stats
    const originalSize = file.size;
    const encodedSize = rxCode.length;
    const compressionRatio = ((originalSize - encodedSize) / originalSize * 100).toFixed(1);
    
    if (currentUserType === 'super') {
        updateStats(encodedStats, `SUPER MODE: ${compressionRatio}% smaller`, encodedSize);
    } else {
        updateStats(encodedStats, `RX Compressed data`, encodedSize);
    }
    
    // REMOVED: Share button creation for encode side
}

// Copy encoded text
async function copyEncodedText() {
    if (!encodedText.value) {
        alert('No encoded text to copy.');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(encodedText.value);
        const originalText = copyEncoded.innerHTML;
        copyEncoded.innerHTML = '<span class="icon">✅</span> Copied!';
        setTimeout(() => {
            copyEncoded.innerHTML = originalText;
        }, 2000);
    } catch (e) {
        alert('Clipboard access denied. Please copy manually.');
    }
}

// Download .RX file
function downloadRXFile() {
    if (!encodedText.value) return;
    
    const blob = new Blob([encodedText.value], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'RXSTUDIO_IMAGE.rx';
    a.click();
    URL.revokeObjectURL(url);
}

// Decode Functions
function ensureDataUrl(text) {
    if (!text) return null;
    text = text.trim();
    
    // Check if it's a regular data URL
    if (text.startsWith('data:')) return text;
    
    // Check if it's an RX file format
    try {
        return decodeRXFile(text);
    } catch (e) {
        // If not RX format, try traditional base64
        if (/^[A-Za-z0-9+/=\s]+$/.test(text)) {
            return 'data:image/png;base64,' + text.replace(/\s+/g, '');
        }
        
        const commaIndex = text.indexOf(',');
        if (commaIndex >= 0 && /^[A-Za-z0-9+/=\s]+$/.test(text.slice(commaIndex + 1))) {
            const maybe = text.slice(commaIndex + 1).replace(/\s+/g, '');
            return 'data:image/png;base64,' + maybe;
        }
    }
    
    return null;
}

async function decodeImage() {
    const txt = decodeText.value;
    const dataUrl = ensureDataUrl(txt);
    
    if (!dataUrl) {
        alert('Unable to detect valid image content. Please check your input.');
        return;
    }

    const img = new Image();
    img.onload = () => {
        createPreview(decodedContainer, dataUrl, 'Decoded image');
        fetch(dataUrl)
            .then(r => r.blob())
            .then(b => {
                lastDecodedBlob = b;
                downloadDecoded.disabled = false;
                updateStats(decodeStats, 'Decoded image', b.size);
                
                // Create separate share button if not exists
                if (!document.getElementById('shareDecoded')) {
                    const downloadSection = document.querySelector('#decode-tab .download-section');
                    const shareBtn = document.createElement('button');
                    shareBtn.id = 'shareDecoded';
                    shareBtn.className = 'btn btn-secondary';
                    shareBtn.innerHTML = '<span class="icon">📤</span> Share Image';
                    shareBtn.onclick = shareDecodedImage;
                    downloadSection.appendChild(shareBtn);
                }
            });
    };
    img.onerror = () => alert('Decoding failed. The data may be corrupted or incomplete.');
    img.src = dataUrl;
}

// Download decoded image
async function downloadDecodedImage() {
    if (!lastDecodedBlob) return;
    
    const dataUrl = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(lastDecodedBlob);
    });
    
    const watermarkedDataUrl = await addWatermark(dataUrl);
    const response = await fetch(watermarkedDataUrl);
    const watermarkedBlob = await response.blob();
    
    const url = URL.createObjectURL(watermarkedBlob);
    const a = document.createElement('a');
    const ext = lastDecodedBlob.type.split('/')[1] || 'png';
    a.href = url;
    a.download = `RX_STUDIO_image.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
}

// File input handlers
async function handleFileInput() {
    const file = fileInput.files[0];
    if (!file) {
        previewContainer.innerHTML = '<div class="empty-preview">No image selected</div>';
        fileInfo.textContent = '';
        return;
    }

    updateStats(fileInfo, file.name, file.size);
    const dataUrl = await readFileAsDataURL(file);
    createPreview(previewContainer, dataUrl, 'Original image');
}

// Handle .RX file input
async function handleRXFileInput() {
    const file = textFileInput.files[0];
    if (!file) return;
    
    // Check if it's an .rx file
    if (!file.name.toLowerCase().endsWith('.rx')) {
        alert('Please select a valid .RX file');
        return;
    }
    
    try {
        const text = await readFileAsText(file);
        decodeText.value = text;
        updateStats(decodeStats, 'RX file loaded', file.size);
        
        // Auto-decode RX files
        setTimeout(() => decodeImage(), 500);
    } catch (e) {
        alert('Error reading RX file: ' + e.message);
    }
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    fileInput.classList.add('drag-over');
}

function handleDragLeave() {
    fileInput.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    fileInput.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeDOMElements();
    setupEventListeners();
    
    if (!checkExistingLogin()) {
        if (loginModal) loginModal.classList.remove('hidden');
        if (mainContent) mainContent.classList.add('hidden');
    }
});