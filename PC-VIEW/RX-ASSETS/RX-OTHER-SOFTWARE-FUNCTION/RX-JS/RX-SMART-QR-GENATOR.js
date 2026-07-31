// Global variables
let currentTab = 'encrypt';
let qrSize = 200;
let qrColor = '#6366f1';
let stream = null;
let scanInterval = null;
let encryptedData = null;
let currentQRCodeData = null; // Stores the data of the currently generated QR for watermark
let watermarkImage = null; // Stores the custom watermark image
let watermarkImageSrc = ''; // Stores the source for the custom watermark image

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Set up event listeners
  document.getElementById('encryptPassword').addEventListener('input', checkPasswordStrength);
  document.getElementById('qrColor').addEventListener('input', updateQRColorValue);
  document.getElementById('watermarkImageInput').addEventListener('change', handleWatermarkImageSelect);

  // Load history
  loadHistory();

  // Check for camera support
  checkCameraSupport();
});

// Switch between tabs
function switchTab(tabName) {
  // Hide all cards
  document.getElementById('encryptCard').classList.add('hidden');
  document.getElementById('decryptCard').classList.add('hidden');
  document.getElementById('scanCard').classList.add('hidden');
  document.getElementById('historyCard').classList.add('hidden');

  // Deactivate all tabs
  document.getElementById('tabEncrypt').classList.remove('active');
  document.getElementById('tabDecrypt').classList.remove('active');
  document.getElementById('tabScan').classList.remove('active');
  document.getElementById('tabHistory').classList.remove('active');

  // Show selected card and activate tab
  document.getElementById(tabName + 'Card').classList.remove('hidden');
  document.getElementById('tab' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.add('active');

  // Stop camera if leaving scan tab
  if (currentTab === 'scan' && tabName !== 'scan') {
    stopCamera();
  }

  currentTab = tabName;
}

// Update character count
function updateCharCount() {
  const message = document.getElementById('messageInput').value;
  document.getElementById('charCount').textContent = message.length;
}

// Check password strength
function checkPasswordStrength() {
  const password = document.getElementById('encryptPassword').value;
  const strengthBar = document.getElementById('passwordStrengthBar');
  const strengthText = document.getElementById('passwordStrengthText');

  if (password.length === 0) {
    strengthBar.style.width = '0%';
    strengthBar.style.backgroundColor = '';
    strengthText.textContent = 'Password strength';
    return;
  }

  // Simple password strength algorithm
  let strength = 0;

  // Length check
  if (password.length > 5) strength += 1;
  if (password.length > 8) strength += 1;

  // Character variety checks
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  // Update strength bar
  let width = 0;
  let color = '';
  let text = '';

  switch(strength) {
    case 0:
    case 1:
      width = 25;
      color = '#ef4444';
      text = 'Weak';
      break;
    case 2:
    case 3:
      width = 50;
      color = '#f59e0b';
      text = 'Fair';
      break;
    case 4:
      width = 75;
      color = '#3b82f6';
      text = 'Good';
      break;
    case 5:
      width = 100;
      color = '#10b981';
      text = 'Strong';
      break;
  }

  strengthBar.style.width = width + '%';
  strengthBar.style.backgroundColor = color;
  strengthText.textContent = text;
  strengthText.style.color = color;
}

// Toggle password visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.nextElementSibling.querySelector('i');

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

// Encrypt message and generate QR code
async function encryptMessage() {
  const message = document.getElementById('messageInput').value.trim();
  const password = document.getElementById('encryptPassword').value;

  if (!message) {
    showAlert('Error', 'Please enter a message to encrypt.', 'error');
    return;
  }

  if (!password) {
    showAlert('Error', 'Please enter an encryption password.', 'error');
    return;
  }

  if (message.length > 1000) {
    showAlert('Error', 'Message is too long. Maximum 1000 characters allowed.', 'error');
    return;
  }

  try {
    // Encrypt the message using AES
    const encrypted = CryptoJS.AES.encrypt(message, password).toString();
    encryptedData = encrypted;

    // Format the encrypted data with a prefix to identify it as encrypted
    const formattedData = 'RXSECURE:' + encrypted;
    currentQRCodeData = formattedData; // Store for watermark

    // Generate QR code
    await generateQRCode(formattedData);

    // Show the QR code container
    document.getElementById('qrPreviewContainer').classList.remove('hidden');

    // Capture QR code image as base64 after generation for history
    const canvas = document.getElementById('qrCanvas');
    const qrImageBase64 = canvas.toDataURL('image/png');

    // Add to history
    addToHistory({
      type: 'encrypt',
      timestamp: new Date().toISOString(),
      message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
      fullMessage: message,
      password: password,
      qrImage: qrImageBase64
    });

    showAlert('Success', 'Message encrypted and QR code generated successfully.', 'success');
  } catch (error) {
    console.error('Encryption error:', error);
    showAlert('Error', 'Failed to encrypt message. Please try again.', 'error');
  }
}

// Generate QR code with watermark
async function generateQRCode(data) {
  const canvas = document.getElementById('qrCanvas');
  const ctx = canvas.getContext('2d');

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set canvas size
  canvas.width = qrSize;
  canvas.height = qrSize;

  return new Promise((resolve, reject) => {
    QRCode.toCanvas(canvas, data, {
      width: qrSize,
      height: qrSize,
      color: {
        dark: qrColor,
        light: '#ffffff'
      },
      margin: 1
    }, async function(error) {
      if (error) {
        console.error('QR generation error:', error);
        showAlert('Error', 'Failed to generate QR code. Please try again.', 'error');
        return reject(error);
      }

      // Apply watermark if image is loaded or default logo
      if (watermarkImage || (document.getElementById('defaultWatermark').checked && !watermarkImageSrc)) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0); // Draw QR onto temporary canvas

        let imgToDraw = null;
        if (watermarkImage) {
            imgToDraw = watermarkImage;
        } else if (document.getElementById('defaultWatermark').checked) {
            // Use default logo if no custom watermark and default is checked
            imgToDraw = new Image();
            imgToDraw.src = 'IMG/RX-3.png'; // Assuming your default logo path
            await new Promise(r => imgToDraw.onload = r); // Wait for default logo to load
        }

        if (imgToDraw) {
          const qrCenter = canvas.width / 2;
          const watermarkSize = canvas.width * 0.2; // 20% of QR size
          const x = qrCenter - watermarkSize / 2;
          const y = qrCenter - watermarkSize / 2;

          // Clear the center area for the watermark (optional, can just draw over)
          // tempCtx.clearRect(x, y, watermarkSize, watermarkSize);

          tempCtx.drawImage(imgToDraw, x, y, watermarkSize, watermarkSize);

          // Draw the combined image back to the original canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear original
          ctx.drawImage(tempCanvas, 0, 0); // Draw combined
        }
      }
      resolve();
    });
  });
}

// Handle watermark image selection
function handleWatermarkImageSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            watermarkImageSrc = e.target.result;
            watermarkImage = new Image();
            watermarkImage.src = watermarkImageSrc;
            watermarkImage.onload = function() {
                if (currentQRCodeData) {
                    generateQRCode(currentQRCodeData); // Regenerate QR with new watermark
                }
                showAlert('Success', 'Custom watermark loaded.', 'success');
            };
            watermarkImage.onerror = function() {
                showAlert('Error', 'Failed to load watermark image.', 'error');
            };
        };
        reader.readAsDataURL(file);
    } else {
        watermarkImage = null;
        watermarkImageSrc = '';
        if (currentQRCodeData) {
            generateQRCode(currentQRCodeData); // Regenerate QR without custom watermark
        }
    }
}

// Toggle default watermark
function toggleDefaultWatermark() {
    const defaultWatermarkCheckbox = document.getElementById('defaultWatermark');
    if (defaultWatermarkCheckbox.checked && !watermarkImage) { // If default checked and no custom image
        if (currentQRCodeData) {
            generateQRCode(currentQRCodeData);
        }
    } else if (!defaultWatermarkCheckbox.checked && !watermarkImage) { // If default unchecked and no custom image
         if (currentQRCodeData) {
            generateQRCode(currentQRCodeData); // Regenerate without watermark
        }
    } else if (defaultWatermarkCheckbox.checked && watermarkImage) {
        // Both custom and default are checked, custom takes precedence. No change needed.
        showAlert('Info', 'Custom watermark is active, default will not be used.', 'info');
    }
}

// Change QR code size
async function changeQRSize(size) {
  qrSize = size;

  // Update active button
  const buttons = document.querySelectorAll('.qr-size-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  // Find the button that was clicked based on its size value
  const clickedBtn = Array.from(buttons).find(btn => parseInt(btn.textContent) === size || btn.textContent.toLowerCase().includes(size === 200 ? 'small' : size === 300 ? 'medium' : 'large'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  }

  // Regenerate QR code if there's data
  if (currentQRCodeData) {
    await generateQRCode(currentQRCodeData);
  }
}

// Update QR color value display
function updateQRColorValue() {
  const color = document.getElementById('qrColor').value;
  document.getElementById('qrColorValue').textContent = color;
  updateQRColor();
}

// Update QR code color
async function updateQRColor() {
  qrColor = document.getElementById('qrColor').value;

  // Regenerate QR code if there's data
  if (currentQRCodeData) {
    await generateQRCode(currentQRCodeData);
  }
}

// Download QR code
async function downloadQR(qrImageBase64) {
  const canvas = document.getElementById('qrCanvas');
  let finalDataURL = qrImageBase64 || canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = 'secure-qr-code.png';
  link.href = finalDataURL;
  link.click();

  showAlert('Success', 'QR code downloaded successfully.', 'success');
}

// Share QR code
function shareQR() {
  const canvas = document.getElementById('qrCanvas');

  canvas.toBlob(function(blob) {
    if (navigator.share) {
      const file = new File([blob], 'secure-qr-code.png', { type: 'image/png' });

      navigator.share({
        title: 'Secure QR Code',
        text: 'Check out this secure QR code generated with RX Secure QR Tool',
        files: [file]
      })
      .then(() => showAlert('Success', 'QR code share link generated successfully.', 'success'))
      .catch(error => {
        if (error.name !== 'AbortError') {
          showAlert('Error', 'Failed to share QR code. You can download it instead.', 'error');
        }
      });
    } else {
      showAlert('Info', 'Web Share API not supported in your browser. You can download the QR code instead.', 'error');
    }
  });
}

// Handle file selection for decryption
function handleFileSelect(event) {
  const file = event.target.files[0];
  const fileInfo = document.getElementById('fileInfo');
  const decryptBtn = document.getElementById('decryptBtn');

  if (file) {
    fileInfo.classList.remove('hidden');
    fileInfo.querySelector('span').textContent = file.name;
    decryptBtn.disabled = false;
  } else {
    fileInfo.classList.add('hidden');
    decryptBtn.disabled = true;
  }
}

// Decrypt message from QR code
function decryptMessage() {
  const fileInput = document.getElementById('qrFileInput');
  const password = document.getElementById('decryptPassword').value;
  const resultContainer = document.getElementById('decryptResult');
  document.getElementById('result').textContent = ''; // Clear previous result
  resultContainer.classList.add('hidden'); // Hide result container initially

  if (!fileInput.files || fileInput.files.length === 0) {
    showAlert('Error', 'Please select a QR code image to decrypt.', 'error');
    return;
  }

  const file = fileInput.files[0];
  const img = new Image();

  img.onload = function() {
    try {
      // Create a canvas to process the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Get image data for QR decoding
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Decode QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        const data = code.data;

        // Check if it's an encrypted QR code from our system
        if (data.startsWith('RXSECURE:')) {
          if (!password) {
            showAlert('Error', 'This QR code is encrypted. Please enter the decryption password.', 'error');
            return;
          }

          try {
            // Extract the encrypted part
            const encrypted = data.substring(9);

            // Decrypt the message
            const bytes = CryptoJS.AES.decrypt(encrypted, password);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (!decrypted) {
              showAlert('Error', 'Failed to decrypt. Incorrect password or corrupted data.', 'error');
              return;
            }

            // Show the decrypted message
            document.getElementById('result').textContent = decrypted;
            resultContainer.classList.remove('hidden');
            resultContainer.classList.add('success');
            resultContainer.classList.remove('error');

            // Generate QR code for the decrypted message to add to history
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 200;
            tempCanvas.height = 200;
            
            QRCode.toCanvas(tempCanvas, decrypted, {
              width: 200,
              height: 200,
              color: {
                dark: '#6366f1',
                light: '#ffffff'
              },
              margin: 1
            }, function(error) {
              if (error) {
                console.error('QR generation error for history:', error);
              }
              
              const qrImageBase64 = tempCanvas.toDataURL('image/png');
              
              // Add to history
              addToHistory({
                type: 'decrypt',
                timestamp: new Date().toISOString(),
                message: decrypted.substring(0, 50) + (decrypted.length > 50 ? '...' : ''),
                fullMessage: decrypted,
                password: password,
                qrImage: qrImageBase64
              });
            });

            showAlert('Success', 'Message decrypted successfully.', 'success');
          } catch (error) {
            console.error('Decryption error:', error);
            showAlert('Error', 'Failed to decrypt message. Incorrect password or corrupted data.', 'error');
          }
        } else {
          // Not encrypted with our system, just show the data
          document.getElementById('result').textContent = data;
          resultContainer.classList.remove('hidden');
          resultContainer.classList.add('success');
          resultContainer.classList.remove('error');

          // Generate QR code for the scanned message to add to history
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = 200;
          tempCanvas.height = 200;
          
          QRCode.toCanvas(tempCanvas, data, {
            width: 200,
            height: 200,
            color: {
              dark: '#6366f1',
              light: '#ffffff'
            },
            margin: 1
          }, function(error) {
            if (error) {
              console.error('QR generation error for history:', error);
            }
            
            const qrImageBase64 = tempCanvas.toDataURL('image/png');
            
            // Add to history
            addToHistory({
              type: 'decrypt',
              timestamp: new Date().toISOString(),
              message: data.substring(0, 50) + (data.length > 50 ? '...' : ''),
              fullMessage: data,
              qrImage: qrImageBase64
            });
          });

          showAlert('Info', 'QR code scanned successfully. This QR code is not encrypted.', 'success');
        }
      } else {
        showAlert('Error', 'No QR code found in the image. Please try another image.', 'error');
      }
    } catch (error) {
      console.error('QR decoding error:', error);
      showAlert('Error', 'Failed to decode QR code. Please try another image.', 'error');
    }
  };

  img.onerror = function() {
    showAlert('Error', 'Failed to load image. Please try another file.', 'error');
  };

  // Read the file as data URL
  const reader = new FileReader();
  reader.onload = function(e) {
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Check camera support
function checkCameraSupport() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    document.getElementById('startCameraBtn').disabled = true;
    showAlert('Info', 'Camera access is not supported by your browser.', 'error');
  }
}

// Start camera for scanning
function startCamera() {
  const video = document.getElementById('cameraPreview');
  const startBtn = document.getElementById('startCameraBtn');
  const stopBtn = document.getElementById('stopCameraBtn');
  const scanResultContainer = document.getElementById('scanResult');
  document.getElementById('scanResultContent').textContent = ''; // Clear previous scan result
  scanResultContainer.classList.add('hidden'); // Hide scan result initially

  startBtn.disabled = true;
  stopBtn.disabled = false;

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(function(mediaStream) {
      stream = mediaStream;
      video.srcObject = stream;

      // Start scanning for QR codes
      scanInterval = setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            const data = code.data;
            const password = document.getElementById('scanPassword').value;
            const resultContainer = document.getElementById('scanResult');

            // Check if it's an encrypted QR code from our system
            if (data.startsWith('RXSECURE:')) {
              if (!password) {
                showAlert('Error', 'This QR code is encrypted. Please enter the decryption password.', 'error');
                return;
              }

              try {
                // Extract the encrypted part
                const encrypted = data.substring(9);

                // Decrypt the message
                const bytes = CryptoJS.AES.decrypt(encrypted, password);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);

                if (!decrypted) {
                  showAlert('Error', 'Failed to decrypt. Incorrect password or corrupted data.', 'error');
                  return;
                }

                // Show the decrypted message
                document.getElementById('scanResultContent').textContent = decrypted;
                resultContainer.classList.remove('hidden');
                resultContainer.classList.add('success');
                resultContainer.classList.remove('error');

                // Generate QR code for the scanned message to add to history
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = 200;
                tempCanvas.height = 200;
                
                QRCode.toCanvas(tempCanvas, decrypted, {
                  width: 200,
                  height: 200,
                  color: {
                    dark: '#6366f1',
                    light: '#ffffff'
                  },
                  margin: 1
                }, function(error) {
                  if (error) {
                    console.error('QR generation error for history:', error);
                  }
                  
                  const qrImageBase64 = tempCanvas.toDataURL('image/png');
                  
                  // Add to history
                  addToHistory({
                    type: 'scan',
                    timestamp: new Date().toISOString(),
                    message: decrypted.substring(0, 50) + (decrypted.length > 50 ? '...' : ''),
                    fullMessage: decrypted,
                    password: password,
                    qrImage: qrImageBase64
                  });
                });

                showAlert('Success', 'Message decrypted successfully.', 'success');
                stopCamera();
              } catch (error) {
                console.error('Decryption error:', error);
                showAlert('Error', 'Failed to decrypt message. Incorrect password or corrupted data.', 'error');
              }
            } else {
              // Not encrypted with our system, just show the data
              document.getElementById('scanResultContent').textContent = data;
              resultContainer.classList.remove('hidden');
              resultContainer.classList.add('success');
              resultContainer.classList.remove('error');

              // Generate QR code for the scanned message to add to history
              const tempCanvas = document.createElement('canvas');
              tempCanvas.width = 200;
              tempCanvas.height = 200;
              
              QRCode.toCanvas(tempCanvas, data, {
                width: 200,
                height: 200,
                color: {
                  dark: '#6366f1',
                  light: '#ffffff'
                },
                margin: 1
              }, function(error) {
                if (error) {
                  console.error('QR generation error for history:', error);
                }
                
                const qrImageBase64 = tempCanvas.toDataURL('image/png');
                
                // Add to history
                addToHistory({
                  type: 'scan',
                  timestamp: new Date().toISOString(),
                  message: data.substring(0, 50) + (data.length > 50 ? '...' : ''),
                  fullMessage: data,
                  qrImage: qrImageBase64
                });
              });

              showAlert('Info', 'QR code scanned successfully.', 'success');
              stopCamera();
            }
          }
        }
      }, 500);
    })
    .catch(function(error) {
      console.error('Camera error:', error);
      showAlert('Error', 'Failed to access camera. Please check permissions.', 'error');
      startBtn.disabled = false;
      stopBtn.disabled = true;
    });
}

// Stop camera
function stopCamera() {
  const startBtn = document.getElementById('startCameraBtn');
  const stopBtn = document.getElementById('stopCameraBtn');

  startBtn.disabled = false;
  stopBtn.disabled = true;

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
  }
}

// Copy to clipboard
function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).textContent;

  navigator.clipboard.writeText(text)
    .then(() => {
      showAlert('Success', 'Copied to clipboard!', 'success');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
      showAlert('Error', 'Failed to copy to clipboard.', 'error');
    });
}

// Add to history
function addToHistory(item) {
  let history = JSON.parse(localStorage.getItem('qrHistory')) || [];
  history.unshift(item);

  // Keep only the last 20 items
  if (history.length > 20) {
    history = history.slice(0, 20);
  }

  localStorage.setItem('qrHistory', JSON.stringify(history));
  loadHistory();
}

// Delete history item
function deleteHistoryItem(index) {
    let history = JSON.parse(localStorage.getItem('qrHistory')) || [];
    history.splice(index, 1);
    localStorage.setItem('qrHistory', JSON.stringify(history));
    loadHistory();
    showAlert('Success', 'History item deleted.', 'success');
}

// Download history QR
function downloadHistoryQR(qrImageBase64, filename) {
    const link = document.createElement('a');
    link.download = filename || 'RX STUDIO-qr-code.png';
    link.href = qrImageBase64;
    link.click();
    showAlert('Success', 'QR code downloaded.', 'success');
}

// Toggle history item details
function toggleHistoryDetails(index) {
    const detailElement = document.getElementById(`history-detail-${index}`);
    detailElement.classList.toggle('hidden');
}

// Load history
function loadHistory() {
  const historyContainer = document.getElementById('historyItems');
  const history = JSON.parse(localStorage.getItem('qrHistory')) || [];

  if (history.length === 0) {
    historyContainer.innerHTML = `
      <div class="empty-history">
        <i class="fas fa-history"></i>
        <p>No history yet. Your encrypted and decrypted messages will appear here.</p>
      </div>
    `;
    return;
  }

  let html = '';

  history.forEach((item, index) => {
    const date = new Date(item.timestamp);
    const typeIcon = item.type === 'encrypt' ? 'fa-lock' : (item.type === 'decrypt' ? 'fa-unlock' : 'fa-camera');
    const typeText = item.type === 'encrypt' ? 'Encrypted' : (item.type === 'decrypt' ? 'Decrypted' : 'Scanned');
    const hasPassword = item.password ? `<p><strong>Password:</strong> ${item.password}</p>` : '';
    const qrImageHtml = item.qrImage ? `<img src="${item.qrImage}" alt="Generated QR Code" class="history-qr-thumbnail" onclick="toggleHistoryDetails(${index})">` : '';

    // For encrypted items, show QR image and hide content initially
    // For decrypted/scan items, show content and QR image
    if (item.type === 'encrypt') {
      html += `
        <div class="history-item">
          <div class="history-header">
            <div><i class="fas ${typeIcon}"></i> ${typeText}</div>
            <div class="history-date">${date.toLocaleString()}</div>
          </div>
          <div class="history-content">
            ${qrImageHtml}
            <p><strong>Message Preview:</strong> ${item.message}</p>
          </div>
          <div class="history-actions">
            <button class="btn btn-text" onclick="toggleHistoryDetails(${index})"><i class="fas fa-info-circle"></i> Details</button>
            ${item.qrImage ? `<button class="btn btn-text" onclick="downloadHistoryQR('${item.qrImage}', 'secure-qr-code-${index}.png')"><i class="fas fa-download"></i> Download QR</button>` : ''}
            <button class="btn btn-text" onclick="deleteHistoryItem(${index})"><i class="fas fa-trash"></i> Delete</button>
          </div>
          <div class="history-details hidden" id="history-detail-${index}">
            <p><strong>Full Content:</strong> <pre>${item.fullMessage}</pre></p>
            ${hasPassword}
            <p><strong>Generated:</strong> ${date.toLocaleString()}</p>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="history-item">
          <div class="history-header">
            <div><i class="fas ${typeIcon}"></i> ${typeText}</div>
            <div class="history-date">${date.toLocaleString()}</div>
          </div>
          <div class="history-content">
            <p><strong>Content:</strong> ${item.message}</p>
            ${qrImageHtml}
          </div>
          <div class="history-actions">
            <button class="btn btn-text" onclick="toggleHistoryDetails(${index})"><i class="fas fa-info-circle"></i> Details</button>
            ${item.qrImage ? `<button class="btn btn-text" onclick="downloadHistoryQR('${item.qrImage}', 'secure-qr-code-${index}.png')"><i class="fas fa-download"></i> Download QR</button>` : ''}
            <button class="btn btn-text" onclick="deleteHistoryItem(${index})"><i class="fas fa-trash"></i> Delete</button>
          </div>
          <div class="history-details hidden" id="history-detail-${index}">
            <p><strong>Full Content:</strong> <pre>${item.fullMessage}</pre></p>
            ${hasPassword}
            <p><strong>Processed:</strong> ${date.toLocaleString()}</p>
          </div>
        </div>
      `;
    }
  });

  historyContainer.innerHTML = html;
}

// Show alert
function showAlert(title, message, type) {
  const alert = document.getElementById('alert');
  const alertTitle = document.getElementById('alertTitle');
  const alertMessage = document.getElementById('alertMessage');
  const alertIcon = document.getElementById('alertIcon');

  alertTitle.textContent = title;
  alertMessage.textContent = message;

  alert.className = 'alert';
  alert.classList.add('alert-' + (type === 'success' ? 'success' : type === 'info' ? 'info' : 'error')); // Added 'info' type

  alertIcon.className = 'fas ' + (type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'); // Added 'info' icon

  alert.classList.add('show');

  // Hide alert after 5 seconds
  setTimeout(() => {
    alert.classList.remove('show');
  }, 5000);
}