// Global variables
let currentQrSize = 200;
let currentQrColor = '#000000';
let qrHistory = [];
let isGenerating = false;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize from local storage
  loadHistory();
  
  // Set up file input change listener
  document.getElementById('qrFileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      document.getElementById('fileName').textContent = file.name;
      document.getElementById('fileInfo').classList.remove('hidden');
    }
  });
  
  // Set up QR color picker
  const colorPicker = document.getElementById('qrColor');
  colorPicker.addEventListener('input', function(e) {
    currentQrColor = e.target.value;
    document.getElementById('colorHex').textContent = currentQrColor.toUpperCase();
  });
  
  // Character counter for message input
  const messageInput = document.getElementById('messageInput');
  messageInput.addEventListener('input', function() {
    const charCount = messageInput.value.length;
    document.getElementById('charCount').textContent = charCount;
  });
  
  // Drag and drop for file upload
  const fileUploadLabel = document.querySelector('.file-upload-label');
  fileUploadLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadLabel.style.borderColor = 'var(--primary)';
    fileUploadLabel.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
  });
  
  fileUploadLabel.addEventListener('dragleave', () => {
    fileUploadLabel.style.borderColor = '#e2e8f0';
    fileUploadLabel.style.backgroundColor = 'transparent';
  });
  
  fileUploadLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadLabel.style.borderColor = '#e2e8f0';
    fileUploadLabel.style.backgroundColor = 'transparent';
    
    if (e.dataTransfer.files.length) {
      document.getElementById('qrFileInput').files = e.dataTransfer.files;
      const event = new Event('change');
      document.getElementById('qrFileInput').dispatchEvent(event);
    }
  });
});

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.card').forEach(c => c.classList.add('hidden'));
  document.getElementById(tab).classList.remove('hidden');
  event.target.classList.add('active');
  
  // Reset results when switching tabs
  if (tab === 'generate') {
    resetGenerateTab();
  } else if (tab === 'read') {
    resetReadTab();
  }
}

function resetGenerateTab() {
  document.getElementById('qrCanvas').classList.add('hidden');
  document.getElementById('qrSuccess').classList.add('hidden');
  document.getElementById('downloadSection').classList.add('hidden');
  document.getElementById('encryptedOutputContainer').classList.add('hidden');
  document.getElementById('qrPreviewContainer').classList.add('hidden');
}

function resetReadTab() {
  document.getElementById('resultContainer').classList.add('hidden');
}

function setQrSize(size) {
  currentQrSize = size;
  document.querySelectorAll('.qr-size-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);
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

function checkPasswordStrength() {
  const password = document.getElementById('encryptPassword').value;
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  
  if (!password) {
    strengthBar.style.width = '0%';
    strengthBar.style.backgroundColor = 'transparent';
    strengthText.textContent = 'Password strength';
    return;
  }
  
  // Calculate strength (simple version)
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  // Update UI
  const width = strength * 20;
  strengthBar.style.width = width + '%';
  
  if (width < 40) {
    strengthBar.style.backgroundColor = 'var(--danger)';
    strengthText.textContent = 'Weak';
  } else if (width < 70) {
    strengthBar.style.backgroundColor = 'var(--warning)';
    strengthText.textContent = 'Moderate';
  } else {
    strengthBar.style.backgroundColor = 'var(--success)';
    strengthText.textContent = 'Strong';
  }
}

function encryptAndGenerateQR() {
  if (isGenerating) return;
  
  const msg = document.getElementById("messageInput").value.trim();
  const pass = document.getElementById("encryptPassword").value;
  const canvas = document.getElementById("qrCanvas");
  const output = document.getElementById("encryptedOutput");
  const downloadBtn = document.getElementById("downloadBtn");
  const encryptedOutputContainer = document.getElementById("encryptedOutputContainer");
  const qrSuccess = document.getElementById("qrSuccess");
  const downloadSection = document.getElementById("downloadSection");
  const generateBtn = document.getElementById("generateBtn");
  const qrPreviewContainer = document.getElementById("qrPreviewContainer");

  if (!msg) {
    showAlert("Please enter a message to encrypt.", "error");
    return;
  }
  
  if (!pass || pass.length < 8) {
    showAlert("Please enter a password with at least 8 characters.", "error");
    return;
  }

  // Disable button during generation
  isGenerating = true;
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<i class="fas fa-spinner spin"></i> Generating...';

  try {
    // Encrypt with AES-256
    const encrypted = CryptoJS.AES.encrypt(msg, pass).toString();
    
    // Generate QR code with custom color
    QRCode.toCanvas(canvas, encrypted, {
      width: currentQrSize,
      color: {
        dark: currentQrColor,
        light: '#ffffff'
      },
      margin: 2
    }, function(err) {
      isGenerating = false;
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<i class="fas fa-lock"></i> Generate Secure QR Code';
      
      if (err) {
        showAlert("Error generating QR code. Please try again.", "error");
        console.error(err);
      } else {
        qrPreviewContainer.classList.remove("hidden");
        canvas.classList.remove("hidden");
        qrSuccess.classList.remove("hidden");
        downloadSection.classList.remove("hidden");
        encryptedOutputContainer.classList.remove("hidden");
        
        output.textContent = encrypted;
        
        // Prepare download
        const dataURL = canvas.toDataURL("image/png");
        downloadBtn.href = dataURL;
        
        // Scroll to results
        canvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  } catch (error) {
    isGenerating = false;
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i class="fas fa-lock"></i> Generate Secure QR Code';
    showAlert("Encryption failed. Please try again.", "error");
    console.error(error);
  }
}

function refreshQR() {
  encryptAndGenerateQR();
}

function scanAndDecrypt() {
  const fileInput = document.getElementById("qrFileInput");
  const pass = document.getElementById("decryptPassword").value;
  const output = document.getElementById("result");
  const resultContainer = document.getElementById("resultContainer");
  const decryptBtn = document.getElementById("decryptBtn");

  if (!fileInput.files[0]) {
    showAlert("Please upload a QR code image first.", "error");
    return;
  }

  if (!pass) {
    showAlert("Please enter the decryption password.", "error");
    return;
  }

  // Show loading state
  decryptBtn.disabled = true;
  decryptBtn.innerHTML = '<i class="fas fa-spinner spin"></i> Decrypting...';

  const reader = new FileReader();
  reader.onload = function() {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      try {
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        
        if (code) {
          try {
            const bytes = CryptoJS.AES.decrypt(code.data, pass);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            
            // Reset button state
            decryptBtn.disabled = false;
            decryptBtn.innerHTML = '<i class="fas fa-unlock"></i> Decrypt Message';
            
            if (originalText) {
              output.textContent = originalText;
              resultContainer.classList.remove("hidden");
              resultContainer.classList.add("success");
              resultContainer.querySelector('.result-title i').className = 'fas fa-check-circle';
              resultContainer.querySelector('.result-title').innerHTML = `<i class="fas fa-check-circle"></i> Message Decrypted Successfully`;
              
              // Scroll to result
              resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              showAlert("Wrong password or invalid QR code.", "error");
            }
          } catch (e) {
            decryptBtn.disabled = false;
            decryptBtn.innerHTML = '<i class="fas fa-unlock"></i> Decrypt Message';
            showAlert("Decryption failed. Please check the password.", "error");
            console.error(e);
          }
        } else {
          decryptBtn.disabled = false;
          decryptBtn.innerHTML = '<i class="fas fa-unlock"></i> Decrypt Message';
          showAlert("No QR code found in the image.", "error");
        }
      } catch (error) {
        decryptBtn.disabled = false;
        decryptBtn.innerHTML = '<i class="fas fa-unlock"></i> Decrypt Message';
        showAlert("Error processing QR code. Please try another image.", "error");
        console.error(error);
      }
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(fileInput.files[0]);
}

function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const text = element.textContent || element.innerText;
  
  navigator.clipboard.writeText(text).then(function() {
    showAlert("Copied to clipboard!", "success");
  }).catch(function(err) {
    console.error('Could not copy text: ', err);
    showAlert("Failed to copy text", "error");
  });
}

function clearFileInput() {
  document.getElementById('qrFileInput').value = '';
  document.getElementById('fileInfo').classList.add('hidden');
  document.getElementById('resultContainer').classList.add('hidden');
}

function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert-${type}`;
  alertDiv.style.position = 'fixed';
  alertDiv.style.bottom = '20px';
  alertDiv.style.right = '20px';
  alertDiv.style.padding = '12px 24px';
  alertDiv.style.borderRadius = '8px';
  alertDiv.style.color = 'white';
  alertDiv.style.fontWeight = '500';
  alertDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  alertDiv.style.zIndex = '1000';
  alertDiv.style.animation = 'fadeIn 0.3s ease-in-out';
  
  if (type === 'success') {
    alertDiv.style.backgroundColor = 'var(--success)';
  } else if (type === 'error') {
    alertDiv.style.backgroundColor = 'var(--danger)';
  } else {
    alertDiv.style.backgroundColor = 'var(--primary)';
  }
  
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);
  
  setTimeout(function() {
    alertDiv.style.animation = 'fadeOut 0.3s ease-in-out';
    setTimeout(function() {
      document.body.removeChild(alertDiv);
    }, 300);
  }, 3000);
}

// History functions
function saveToHistory() {
  const msg = document.getElementById("messageInput").value.trim();
  const pass = document.getElementById("encryptPassword").value;
  const encrypted = document.getElementById("encryptedOutput").textContent;
  const canvas = document.getElementById("qrCanvas");
  
  if (!msg || !encrypted) return;
  
  const historyItem = {
    id: Date.now(),
    message: msg,
    encrypted: encrypted,
    passwordHint: pass ? pass.substring(0, 2) + '*'.repeat(pass.length - 2) : '',
    date: new Date().toLocaleString(),
    qrData: canvas.toDataURL("image/png")
  };
  
  qrHistory.unshift(historyItem);
  saveHistory();
  renderHistory();
  showAlert("QR code saved to history", "success");
}

function loadHistory() {
  const savedHistory = localStorage.getItem('qrHistory');
  if (savedHistory) {
    qrHistory = JSON.parse(savedHistory);
    renderHistory();
  }
}

function saveHistory() {
  localStorage.setItem('qrHistory', JSON.stringify(qrHistory));
}

function renderHistory() {
  const historyList = document.getElementById('historyList');
  
  if (qrHistory.length === 0) {
    historyList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-qrcode"></i>
        <p>No QR codes saved yet</p>
        <p>Generate QR codes and save them to view here</p>
      </div>
    `;
    return;
  }
  
  historyList.innerHTML = '';
  
  qrHistory.forEach(item => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
      <div class="history-item-preview">
        <img src="${item.qrData}" alt="QR Code Preview">
      </div>
      <div class="history-item-content">
        <div class="history-item-title">${item.message.substring(0, 30)}${item.message.length > 30 ? '...' : ''}</div>
        <div class="history-item-date">${item.date}</div>
        <div class="history-item-password">Password: ${item.passwordHint}</div>
      </div>
      <div class="history-item-actions">
        <button class="btn btn-text" onclick="downloadHistoryItem(${item.id})" aria-label="Download">
          <i class="fas fa-download"></i>
        </button>
        <button class="btn btn-text" onclick="copyHistoryItem(${item.id})" aria-label="Copy">
          <i class="fas fa-copy"></i>
        </button>
        <button class="btn btn-text" onclick="deleteHistoryItem(${item.id})" aria-label="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    historyList.appendChild(historyItem);
  });
}

function downloadHistoryItem(id) {
  const item = qrHistory.find(i => i.id === id);
  if (item) {
    const link = document.createElement('a');
    link.href = item.qrData;
    link.download = `secure-qr-${id}.png`;
    link.click();
    showAlert("QR code downloaded", "success");
  }
}

function copyHistoryItem(id) {
  const item = qrHistory.find(i => i.id === id);
  if (item) {
    navigator.clipboard.writeText(item.encrypted).then(function() {
      showAlert("Encrypted data copied to clipboard!", "success");
    }).catch(function(err) {
      console.error('Could not copy text: ', err);
      showAlert("Failed to copy text", "error");
    });
  }
}

function deleteHistoryItem(id) {
  qrHistory = qrHistory.filter(i => i.id !== id);
  saveHistory();
  renderHistory();
  showAlert("QR code removed from history", "success");
}

function clearHistory() {
  if (confirm("Are you sure you want to clear your QR code history?")) {
    qrHistory = [];
    saveHistory();
    renderHistory();
    showAlert("History cleared", "success");
  }
}

function exportHistory() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(qrHistory, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "qr-history.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  showAlert("History exported", "success");
}

// Modal functions
function showPrivacyModal() {
  document.getElementById('privacyModal').classList.add('show');
}

function showTermsModal() {
  document.getElementById('termsModal').classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('show');
  }
});