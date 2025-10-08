// DOM Elements
    const fileInput = document.getElementById('fileInput');
    const encodeBtn = document.getElementById('encodeBtn');
    const encodedText = document.getElementById('encodedText');
    const copyEncoded = document.getElementById('copyEncoded');
    const maxSizeInput = document.getElementById('maxSize');
    const downloadEncoded = document.getElementById('downloadEncoded');
    const previewContainer = document.getElementById('previewContainer');
    const fileInfo = document.getElementById('fileInfo');
    const encodedStats = document.getElementById('encodedStats');

    const decodeText = document.getElementById('decodeText');
    const decodeBtn = document.getElementById('decodeBtn');
    const decodedContainer = document.getElementById('decodedContainer');
    const downloadDecoded = document.getElementById('downloadDecoded');
    const decodeStats = document.getElementById('decodeStats');
    const textFileInput = document.getElementById('textFileInput');

    // Tab Elements
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // State
    let lastDataUrl = null;
    let lastDecodedBlob = null;

    // Utility Functions
    const readFileAsDataURL = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

    const readFileAsText = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(reader.result);
      reader.readAsText(file);
    });

    const updateStats = (element, text, size) => {
      element.textContent = `${text} • ${formatBytes(size)}`;
    };

    const formatBytes = (bytes, decimals = 2) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const createPreview = (container, src, alt) => {
      container.innerHTML = '';
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.className = 'preview-img';
      container.appendChild(img);
    };

// Add watermark to image
const addWatermark = (imageDataUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Add watermark - CHANGED TO RED COLOR
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = 'red'; // Red color with  transparency
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('RX STUDIO', img.width - 2, img.height - 2);
      
      resolve(canvas.toDataURL());
    };
    img.src = imageDataUrl;
  });
};

    // Tab Switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Update tabs
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update tab contents
        tabContents.forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');
      });
    });

    // Encode Functions
    const encodeImage = async () => {
      const file = fileInput.files[0];
      if (!file) {
        alert('Please select an image file first.');
        return;
      }

      const maxSize = parseInt(maxSizeInput.value) || 0;
      
      if (!maxSize) {
        // Simple encoding without resizing
        const dataUrl = await readFileAsDataURL(file);
        encodedText.value = dataUrl;
        createPreview(previewContainer, dataUrl, 'Encoded preview');
        lastDataUrl = dataUrl;
        downloadEncoded.disabled = false;
        updateStats(encodedStats, 'Encoded data', dataUrl.length);
        return;
      }

      // Resize before encoding
      const dataUrl = await readFileAsDataURL(file);
      const img = new Image();
      img.src = dataUrl;
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
      
      const outDataUrl = canvas.toDataURL('image/png');
      encodedText.value = outDataUrl;
      createPreview(previewContainer, outDataUrl, 'Resized preview');
      lastDataUrl = outDataUrl;
      downloadEncoded.disabled = false;
      updateStats(encodedStats, 'Encoded data', outDataUrl.length);
    };

    // Decode Functions
    const ensureDataUrl = text => {
      if (!text) return null;
      text = text.trim();
      if (text.startsWith('data:')) return text;
      
      // If it's only base64 (no mime), assume PNG
      if (/^[A-Za-z0-9+/=\s]+$/.test(text)) {
        return 'data:image/png;base64,' + text.replace(/\s+/g, '');
      }
      
      // If it looks like base64 with prefix removed but contains commas
      const commaIndex = text.indexOf(',');
      if (commaIndex >= 0 && /^[A-Za-z0-9+/=\s]+$/.test(text.slice(commaIndex + 1))) {
        const maybe = text.slice(commaIndex + 1).replace(/\s+/g, '');
        return 'data:image/png;base64,' + maybe;
      }
      
      return null;
    };

    const decodeImage = async () => {
      const txt = decodeText.value;
      const dataUrl = ensureDataUrl(txt);
      
      if (!dataUrl) {
        alert('Unable to detect valid Base64 content. Please check your input.');
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
          });
      };
      img.onerror = () => alert('Decoding failed. The data may be corrupted or incomplete.');
      img.src = dataUrl;
    };

    // Event Listeners
    encodeBtn.addEventListener('click', encodeImage);

    copyEncoded.addEventListener('click', async () => {
      if (!encodedText.value) {
        alert('No encoded text to copy.');
        return;
      }
      
      try {
        await navigator.clipboard.writeText(encodedText.value);
        // Visual feedback
        const originalText = copyEncoded.innerHTML;
        copyEncoded.innerHTML = '<span class="icon">✅</span> Copied!';
        setTimeout(() => {
          copyEncoded.innerHTML = originalText;
        }, 2000);
      } catch (e) {
        alert('Clipboard access denied. Please copy manually.');
      }
    });

    downloadEncoded.addEventListener('click', () => {
      if (!encodedText.value) return;
      const blob = new Blob([encodedText.value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RX STUDIO | image-base64.txt';
      a.click();
      URL.revokeObjectURL(url);
    });

    decodeBtn.addEventListener('click', decodeImage);

    downloadDecoded.addEventListener('click', async () => {
      if (!lastDecodedBlob) return;
      
      // Convert blob to data URL
      const dataUrl = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(lastDecodedBlob);
      });
      
      // Add watermark
      const watermarkedDataUrl = await addWatermark(dataUrl);
      
      // Convert back to blob
      const response = await fetch(watermarkedDataUrl);
      const watermarkedBlob = await response.blob();
      
      // Download
      const url = URL.createObjectURL(watermarkedBlob);
      const a = document.createElement('a');
      const ext = lastDecodedBlob.type.split('/')[1] || 'png';
      a.href = url;
      a.download = `RX STUDIO | decoded-image.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Text file upload for decoding
    textFileInput.addEventListener('change', async () => {
      const file = textFileInput.files[0];
      if (!file) {
        return;
      }
      
      try {
        const text = await readFileAsText(file);
        decodeText.value = text;
        updateStats(decodeStats, 'Loaded from file', file.size);
      } catch (e) {
        alert('Error reading text file: ' + e.message);
      }
    });

    // File input handling
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) {
        previewContainer.innerHTML = '<div class="empty-preview">No image selected</div>';
        fileInfo.textContent = '';
        return;
      }

      updateStats(fileInfo, file.name, file.size);
      
      const dataUrl = await readFileAsDataURL(file);
      createPreview(previewContainer, dataUrl, 'Original image');
    });

    // Drag and drop functionality
    fileInput.addEventListener('dragover', e => {
      e.preventDefault();
      fileInput.classList.add('drag-over');
    });

    fileInput.addEventListener('dragleave', () => {
      fileInput.classList.remove('drag-over');
    });

    fileInput.addEventListener('drop', e => {
      e.preventDefault();
      fileInput.classList.remove('drag-over');
      
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    });