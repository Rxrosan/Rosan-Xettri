// main-app.js

// DOM Elements
const dom = {
    loginScreen: document.getElementById('loginScreen'),
    mainContent: document.getElementById('mainContent'),
    accessCodeInput: document.getElementById('accessCodeInput'),
    loginBtn: document.getElementById('loginBtn'),
    editorContainer: document.getElementById('editorContainer'),
    resultArea: document.getElementById('result-area'),
    editableWitnesses: document.getElementById('editableWitnesses'),
    outputContainer: document.getElementById('final-output-container'),
    generateBtn: document.getElementById('generateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    editBtn: document.getElementById('editBtn'),
    copyBtn: document.getElementById('copyBtn'),
    printBtn: document.getElementById('printBtn'),
    shareBtn: document.getElementById('shareBtn'),
    termsLink: document.getElementById('termsLink'),
    privacyLink: document.getElementById('privacyLink'),
    termsModal: document.getElementById('termsModal'),
    privacyModal: document.getElementById('privacyModal'),
    closeTerms: document.getElementById('closeTerms'),
    closePrivacy: document.getElementById('closePrivacy'),
    statusIndicator: document.getElementById('statusIndicator'),
    statusText: document.getElementById('statusText'),
    progressBar: document.getElementById('progressBar'),
    settingsBtn: document.getElementById('settingsBtn'),
    settingsPopup: document.getElementById('settingsPopup'),
    homeOption: document.getElementById('homeOption'),
    logoutOption: document.getElementById('logoutOption'),
    themeToggle: document.getElementById('themeToggle'),
    animationToggle: document.getElementById('animationToggle')
};

// Application State
let appState = {
    isLoggedIn: false,
    currentPage: 1,
    isTyping: false,
    isGenerated: false,
    isEditing: true
};

// ==================== INITIALIZATION FUNCTIONS ====================

function init() {
    console.log('Initializing DRISTI-BANDHAK Application v' + CONFIG.APP_VERSION);
    
    // Check and restore session
    checkAndRestoreSession();
    
    // Initialize all settings
    initTheme();
    initWritingAnimationSetting();
    initWitnessBothPagesSetting();
    initPageMarginsSetting();
    
    // Setup auto-save
    setupAutoSave();
    
    // Setup idle timeout
    setupIdleTimeout();
    
    // Setup all event listeners
    setupEventListeners();
    
    // Update UI state
    updateUIState('editing');
    
    console.log('Application initialized successfully');
}

function checkAndRestoreSession() {
    console.log('Checking session...');
    
    const persistentLogin = localStorage.getItem(CONFIG.PERSISTENT_LOGIN_KEY) === 'true';
    const sessionActive = sessionStorage.getItem(CONFIG.SESSION_KEY) === 'true';
    
    if (persistentLogin || sessionActive) {
        console.log('Session found, restoring...');
        
        // Check session expiry for non-persistent login
        if (!persistentLogin && sessionActive) {
            const expiryTime = localStorage.getItem(CONFIG.SESSION_EXPIRY_KEY);
            const currentTime = new Date().getTime();
            
            if (expiryTime && currentTime <= parseInt(expiryTime)) {
                // Session valid
                localStorage.setItem(CONFIG.SESSION_EXPIRY_KEY, (new Date().getTime() + (24 * 60 * 60 * 1000)).toString());
                showMainContent();
                appState.isLoggedIn = true;
            } else {
                // Session expired
                clearSession();
                location.reload();
            }
        } else {
            // Persistent login
            showMainContent();
            appState.isLoggedIn = true;
        }
    } else {
        console.log('No active session found');
    }
}

function showMainContent() {
    console.log('Showing main content...');
    dom.loginScreen.classList.add('hidden');
    dom.mainContent.classList.remove('hidden');
    renderEditableParagraphs();
    updateUIState('editing');
    initInputHover();
    localStorage.setItem('lastActivity', new Date().getTime().toString());
}

// ==================== SETTINGS FUNCTIONS ====================

function initTheme() {
    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    dom.themeToggle.checked = savedTheme === 'light';
    console.log('Theme initialized: ' + savedTheme);
}

function initWritingAnimationSetting() {
    const animationEnabled = localStorage.getItem(CONFIG.WRITING_ANIMATION_KEY) !== 'false';
    dom.animationToggle.checked = animationEnabled;
    CONFIG.WRITING_ANIMATION_ENABLED = animationEnabled;
    console.log('Writing animation: ' + (animationEnabled ? 'Enabled' : 'Disabled'));
}

function initWitnessBothPagesSetting() {
    const witnessBothPages = localStorage.getItem(CONFIG.WITNESS_BOTH_PAGES_KEY) === 'true';
    
    // Create witness toggle if it doesn't exist
    if (!document.getElementById('witnessToggle')) {
        const witnessOption = document.createElement('div');
        witnessOption.className = 'settings-option';
        witnessOption.innerHTML = `
            <div class="witness-toggle">
                <span>Witness on all Pages</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="witnessToggle">
                    <span class="slider"></span>
                </label>
            </div>
        `;
        dom.settingsPopup.insertBefore(witnessOption, dom.logoutOption);
        
        // Add event listener
        document.getElementById('witnessToggle').addEventListener('change', toggleWitnessBothPages);
    }
    
    document.getElementById('witnessToggle').checked = witnessBothPages;
    CONFIG.WITNESS_BOTH_PAGES = witnessBothPages;
    console.log('Witness on all pages: ' + (witnessBothPages ? 'Enabled' : 'Disabled'));
}

function initPageMarginsSetting() {
    const savedMargins = localStorage.getItem(CONFIG.PAGE_MARGINS_KEY);
    CONFIG.PAGE_MARGINS = savedMargins ? JSON.parse(savedMargins) : {};
    
    // Add margin management option to settings if it doesn't exist
    if (!document.getElementById('marginOption')) {
        const marginOption = document.createElement('div');
        marginOption.className = 'settings-option';
        marginOption.id = 'marginOption';
        marginOption.innerHTML = `
            <span>Manage Page Margins</span>
        `;
        dom.settingsPopup.insertBefore(marginOption, dom.logoutOption);
        marginOption.addEventListener('click', showMarginManagementPopup);
    }
    
    console.log('Page margins initialized');
}

// ==================== TEMPLATE RENDERING FUNCTIONS ====================

function renderPart(templateText, targetElement, placeholderOffset, placeholders) {
    targetElement.innerHTML = '';
    const parts = templateText.split('-----');
    const savedData = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];

    parts.forEach((part, index) => {
        if (part) targetElement.appendChild(document.createTextNode(part));
        if (index < parts.length - 1) {
            const placeholder = placeholders[index] || '';
            const wrapper = document.createElement('span');
            wrapper.className = 'input-wrapper';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = placeholder;
            input.value = savedData[index + placeholderOffset] || '';
            input.dataset.index = index + placeholderOffset;
            input.dataset.placeholder = placeholder;
            input.title = placeholder;
            
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.textContent = placeholder;
            
            wrapper.appendChild(input);
            wrapper.appendChild(tooltip);
            targetElement.appendChild(wrapper);
        }
    });
    return parts.length - 1;
}

function renderEditableParagraphs() {
    console.log('Rendering editable paragraphs...');
    
    const editorContainer = document.querySelector('.editor-container');
    const pageKeys = Object.keys(TEMPLATE_SYSTEM.pages);
    
    // Get or create the main column
    let mainColumn = document.querySelector('.editor-main-column');
    if (!mainColumn) {
        mainColumn = document.createElement('div');
        mainColumn.className = 'editor-main-column';
        editorContainer.appendChild(mainColumn);
    }
    
    // Create page tabs if they don't exist
    if (!document.querySelector('.page-tabs')) {
        const pageTabs = document.createElement('div');
        pageTabs.className = 'page-tabs';
        
        let tabsHTML = '';
        pageKeys.forEach((pageKey, index) => {
            const pageNumber = index + 1;
            const activeClass = index === 0 ? 'active' : '';
            tabsHTML += `<button class="page-tab ${activeClass}" data-page="${pageNumber}">पृष्ठ ${pageNumber}</button>`;
        });
        
        pageTabs.innerHTML = tabsHTML;
        mainColumn.appendChild(pageTabs);
        
        // Add tab click listeners
        document.querySelectorAll('.page-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const pageNum = this.dataset.page;
                document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.page-content').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                document.getElementById(`page${pageNum}`).classList.add('active');
                appState.currentPage = parseInt(pageNum);
            });
        });
    }

    // Create page content containers if they don't exist
    if (!document.getElementById('page1')) {
        const pageContainer = document.createElement('div');
        pageContainer.className = 'page-container';
        
        let pagesHTML = '';
        pageKeys.forEach((pageKey, index) => {
            const pageNumber = index + 1;
            const pageData = TEMPLATE_SYSTEM.pages[pageKey];
            const activeClass = index === 0 ? 'active' : '';
            pagesHTML += `
                <div id="page${pageNumber}" class="page-content ${activeClass}">
                    <div class="section-title">${pageData.title}</div>
                    <div class="editable-area" id="editablePage${pageNumber}"></div>
                </div>
            `;
        });
        
        pageContainer.innerHTML = pagesHTML;
        mainColumn.appendChild(pageContainer);
    }

    // Render each page
    let totalInputsSoFar = 0;
    
    pageKeys.forEach((pageKey, index) => {
        const pageNumber = index + 1;
        const pageData = TEMPLATE_SYSTEM.pages[pageKey];
        const inputsCount = renderPart(
            pageData.template, 
            document.getElementById(`editablePage${pageNumber}`), 
            totalInputsSoFar, 
            pageData.placeholders
        );
        totalInputsSoFar += inputsCount;
    });

    // Render witness section
    renderPart(
        TEMPLATE_SYSTEM.witness.template, 
        document.getElementById('editableWitnesses'), 
        totalInputsSoFar, 
        TEMPLATE_SYSTEM.witness.placeholders
    );
    
    console.log('Rendering complete. Total inputs: ' + totalInputsSoFar);
}

// ==================== UI STATE MANAGEMENT ====================

function updateUIState(state) {
    console.log('Updating UI state to: ' + state);
    
    const isEditing = state === 'editing';
    const isGenerated = state === 'generated';
    const isTyping = state === 'typing';

    dom.editorContainer.classList.toggle('hidden', !isEditing);
    dom.resultArea.classList.toggle('hidden', isEditing);

    dom.generateBtn.classList.toggle('hidden', !isEditing);
    dom.generateBtn.classList.toggle('loading', isTyping);
    dom.generateBtn.disabled = isTyping;

    dom.printBtn.classList.toggle('hidden', !isGenerated);
    dom.resetBtn.classList.toggle('hidden', !isEditing);
    dom.editBtn.classList.toggle('hidden', !isGenerated);
    dom.copyBtn.classList.toggle('hidden', !isGenerated);
    dom.shareBtn.classList.toggle('hidden', !isGenerated);

    // Update status indicator
    dom.statusIndicator.className = 'status-indicator';
    if (isEditing) {
        dom.statusIndicator.classList.add('status-editing');
        dom.statusText.textContent = 'Editing Mode';
        appState.isEditing = true;
        appState.isGenerated = false;
        appState.isTyping = false;
    } else if (isTyping) {
        dom.statusIndicator.classList.add('status-typing');
        dom.statusText.textContent = 'Generating...';
        appState.isTyping = true;
        appState.isEditing = false;
        appState.isGenerated = false;
    } else if (isGenerated) {
        dom.statusIndicator.classList.add('status-generated');
        dom.statusText.textContent = 'Generated';
        appState.isGenerated = true;
        appState.isEditing = false;
        appState.isTyping = false;
    }
}

function initInputHover() {
    const allInputs = document.querySelectorAll('.page-content input');
    
    allInputs.forEach(input => {
        input.addEventListener('mouseenter', function() {
            this.parentElement.classList.add('hover-active');
        });
        
        input.addEventListener('mouseleave', function() {
            this.parentElement.classList.remove('hover-active');
        });
        
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focus-active');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focus-active');
        });
    });
    
    console.log('Input hover effects initialized');
}

// ==================== DATA MANAGEMENT FUNCTIONS ====================

function saveInputsToLocalStorage() {
    const allInputs = document.querySelectorAll('.page-content input');
    const data = Array.from(allInputs).map(input => input.value);
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    console.log('Inputs saved to localStorage');
}

function loadInputsFromLocalStorage() {
    const savedData = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];
    const allInputs = document.querySelectorAll('.page-content input');
    
    allInputs.forEach((input, index) => {
        if (savedData[index] !== undefined) {
            input.value = savedData[index];
        }
    });
    
    console.log('Inputs loaded from localStorage');
}

function clearInputs() {
    if (confirm("Are you sure you want to clear all fields? This cannot be undone.")) {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        renderEditableParagraphs();
        initInputHover();
        console.log('All inputs cleared');
    }
}

// ==================== TEXT GENERATION FUNCTIONS ====================

function getTextFromEditableArea(container) {
    let text = '';
    container.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent;
        } else if (node.classList.contains('input-wrapper')) {
            const input = node.querySelector('input');
            text += input.value.trim() || `[${input.placeholder}]`;
        }
    });
    return text;
}

function getFullGeneratedText() {
    const pageKeys = Object.keys(TEMPLATE_SYSTEM.pages);
    let fullText = '';
    
    pageKeys.forEach((pageKey, index) => {
        const pageNumber = index + 1;
        const pageText = getTextFromEditableArea(document.getElementById(`editablePage${pageNumber}`));
        fullText += `पृष्ठ ${pageNumber}:\n${pageText}\n\n`;
    });
    
    const witnessText = getTextFromEditableArea(document.getElementById('editableWitnesses'));
    fullText += `साक्षी विवरण:\n${witnessText}`;
    
    return fullText;
}

function typeText(element, text, callback) {
    element.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    element.appendChild(cursor);
    let i = 0;
    
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
            i++;
            dom.progressBar.style.width = `${(i / text.length) * 100}%`;
        } else {
            clearInterval(typingInterval);
            element.removeChild(cursor);
            if (callback) callback();
        }
    }, CONFIG.TYPING_SPEED);
}

function handleGenerate() {
    console.log('Generating document...');
    saveInputsToLocalStorage();
    const fullText = getFullGeneratedText();
    updateUIState('typing');

    if (CONFIG.WRITING_ANIMATION_ENABLED) {
        typeText(dom.resultArea, fullText, () => {
            updateUIState('generated');
            dom.progressBar.style.width = '0%';
            console.log('Document generated with animation');
        });
    } else {
        dom.resultArea.innerText = fullText;
        updateUIState('generated');
        dom.progressBar.style.width = '100%';
        setTimeout(() => dom.progressBar.style.width = '0%', 300);
        console.log('Document generated without animation');
    }
}

// ==================== OUTPUT FUNCTIONS ====================

function handleCopyToClipboard() {
    const textToCopy = dom.resultArea.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = dom.copyBtn.innerHTML;
        dom.copyBtn.textContent = 'Copied!';
        dom.copyBtn.classList.add('success');
        setTimeout(() => { 
            dom.copyBtn.innerHTML = originalText;
            dom.copyBtn.classList.remove('success');
        }, 2000);
        console.log('Text copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy text. Please try again.');
    });
}

function createPrintDocument() {
    console.log('Creating print document...');
    
    const pageKeys = Object.keys(TEMPLATE_SYSTEM.pages);
    const witnessText = getTextFromEditableArea(document.getElementById('editableWitnesses'));
    
    dom.outputContainer.innerHTML = '';
    
    pageKeys.forEach((pageKey, index) => {
        const pageNumber = index + 1;
        const pageText = getTextFromEditableArea(document.getElementById(`editablePage${pageNumber}`));
        
        const pageDiv = document.createElement('div');
        pageDiv.className = 'print-page';
        
        // Apply custom margins if set
        if (CONFIG.PAGE_MARGINS && CONFIG.PAGE_MARGINS[`page${pageNumber}`]) {
            const margins = CONFIG.PAGE_MARGINS[`page${pageNumber}`];
            pageDiv.style.paddingTop = margins.top;
            pageDiv.style.paddingRight = margins.right;
            pageDiv.style.paddingBottom = margins.bottom;
            pageDiv.style.paddingLeft = margins.left;
        } else {
            // Default margins
            pageDiv.style.padding = '3in 1in 1in 2in';
        }
        
        // Add witness column if enabled
        if (CONFIG.WITNESS_BOTH_PAGES || index === 0) {
            const witnessColumn = document.createElement('div');
            witnessColumn.className = 'witness-column';
            witnessColumn.textContent = witnessText;
            pageDiv.appendChild(witnessColumn);
        }
        
        const mainContent = document.createElement('div');
        mainContent.className = 'main-content';
        mainContent.textContent = pageText;
        pageDiv.appendChild(mainContent);
        
        dom.outputContainer.appendChild(pageDiv);
    });
    
    console.log('Print document created');
}

function handlePrint() {
    console.log('Preparing to print...');
    createPrintDocument();
    
    // Small delay to ensure DOM is updated
    setTimeout(() => {
        window.print();
        console.log('Print dialog opened');
    }, 500);
}

async function handleShare() {
    console.log('Sharing document...');
    
    try {
        createPrintDocument();
        const fullText = getFullGeneratedText();
        
        const textBlob = new Blob([fullText], { type: 'text/plain' });
        const textFile = new File([textBlob], 'Lekha-Padi-document.txt', { 
            type: 'text/plain' 
        });

        const shareData = {
            title: 'लेखापढी दस्तावेज - ROSAN XETTRI STUDIO',
            text: fullText.substring(0, 100) + '...',
            files: [textFile],
        };

        if (navigator.share && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            console.log('Document shared successfully');
        } else {
            handleDownloadFallback(fullText);
        }
    } catch (error) {
        console.error('Error sharing:', error);
        const fullText = getFullGeneratedText();
        handleDownloadFallback(fullText);
    }
}

function handleDownloadFallback(fullText) {
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kapali-tamsuk-document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Document downloaded as text file');
    alert('Document downloaded as text file. You can now convert it to PDF using your device\'s file manager or any PDF converter app.');
}

// ==================== SETTINGS FUNCTIONS ====================

function toggleSettingsPopup() {
    dom.settingsPopup.classList.toggle('active');
    console.log('Settings popup toggled');
}

function toggleTheme() {
    const isLight = dom.themeToggle.checked;
    const theme = isLight ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.THEME_KEY, theme);
    console.log('Theme changed to: ' + theme);
}

function toggleWritingAnimation() {
    const isAnimationEnabled = dom.animationToggle.checked;
    CONFIG.WRITING_ANIMATION_ENABLED = isAnimationEnabled;
    localStorage.setItem(CONFIG.WRITING_ANIMATION_KEY, isAnimationEnabled);
    console.log('Writing animation: ' + (isAnimationEnabled ? 'Enabled' : 'Disabled'));
}

function toggleWitnessBothPages() {
    const isWitnessBothPages = document.getElementById('witnessToggle').checked;
    CONFIG.WITNESS_BOTH_PAGES = isWitnessBothPages;
    localStorage.setItem(CONFIG.WITNESS_BOTH_PAGES_KEY, isWitnessBothPages);
    console.log('Witness on all pages: ' + (isWitnessBothPages ? 'Enabled' : 'Disabled'));
}

function showMarginManagementPopup() {
    console.log('Showing margin management popup...');
    dom.settingsPopup.classList.remove('active');
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'marginModal';
    
    const pageKeys = Object.keys(TEMPLATE_SYSTEM.pages);
    
    let tabsHTML = '';
    let contentHTML = '';
    
    pageKeys.forEach((pageKey, index) => {
        const pageNumber = index + 1;
        const activeClass = index === 0 ? 'active' : '';
        
        tabsHTML += `<button class="page-margin-tab ${activeClass}" data-page="${pageNumber}">पृष्ठ ${pageNumber}</button>`;
        
        const pageMargins = CONFIG.PAGE_MARGINS[`page${pageNumber}`] || { top: '1in', right: '1in', bottom: '1in', left: '1in' };
        
        contentHTML += `
            <div id="marginPage${pageNumber}" class="margin-page-content ${activeClass}">
                <h3 style="margin-bottom: 15px; color: var(--primary);">पृष्ठ ${pageNumber} - Margin Settings</h3>
                <div class="margin-control-group">
                    <div class="margin-control">
                        <label>Top Margin</label>
                        <input type="text" id="topMargin${pageNumber}" value="${pageMargins.top}" placeholder="e.g., 1in, 2cm">
                    </div>
                    <div class="margin-control">
                        <label>Right Margin</label>
                        <input type="text" id="rightMargin${pageNumber}" value="${pageMargins.right}" placeholder="e.g., 1in, 2cm">
                    </div>
                    <div class="margin-control">
                        <label>Bottom Margin</label>
                        <input type="text" id="bottomMargin${pageNumber}" value="${pageMargins.bottom}" placeholder="e.g., 1in, 2cm">
                    </div>
                    <div class="margin-control">
                        <label>Left Margin</label>
                        <input type="text" id="leftMargin${pageNumber}" value="${pageMargins.left}" placeholder="e.g., 1in, 2cm">
                    </div>
                </div>
                
                <div class="margin-presets">
                    ${generateMarginPresetButtons()}
                </div>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" id="closeMarginModal">&times;</button>
            <h2 class="modal-title">Page Margin Management</h2>
            
            <div class="page-margin-tabs">
                ${tabsHTML}
            </div>
            
            <div class="margin-pages-container">
                ${contentHTML}
            </div>
            
            <div class="margin-actions">
                <button class="btn btn-danger" id="cancelMarginBtn">Cancel</button>
                <button class="btn btn-success" id="saveMarginBtn">Save & Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.querySelectorAll('.page-margin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.page-margin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.margin-page-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`marginPage${this.dataset.page}`).classList.add('active');
        });
    });
    
    document.querySelectorAll('.margin-preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const activePage = document.querySelector('.page-margin-tab.active').dataset.page;
            applyMarginPreset(activePage, this.dataset.preset);
        });
    });
    
    document.getElementById('closeMarginModal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('cancelMarginBtn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('saveMarginBtn').addEventListener('click', savePageMargins);
}

function generateMarginPresetButtons() {
    let buttonsHTML = '';
    
    for (const [presetKey, presetValue] of Object.entries(MARGIN_PRESETS)) {
        const presetName = formatPresetName(presetKey);
        buttonsHTML += `<div class="margin-preset-btn" data-preset="${presetKey}">${presetName}</div>`;
    }
    
    return buttonsHTML;
}

function formatPresetName(presetKey) {
    const names = {
        Lekhapadi: 'लेखापढी (Default)',
        lekhapadinextpage: 'लेखापढी (Next Page)',
        resetandedit: 'Reset & Edit',
        Narrow: 'Narrow (0.5in)',
        Wide: 'Wide (2in)',
        Legal: 'Legal (1.5in Left)'
    };
    
    return names[presetKey] || presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
}

function applyMarginPreset(pageNumber, preset) {
    const margins = MARGIN_PRESETS[preset] || { top: '1in', right: '1in', bottom: '1in', left: '1in' };
    
    document.getElementById(`topMargin${pageNumber}`).value = margins.top;
    document.getElementById(`rightMargin${pageNumber}`).value = margins.right;
    document.getElementById(`bottomMargin${pageNumber}`).value = margins.bottom;
    document.getElementById(`leftMargin${pageNumber}`).value = margins.left;
    
    console.log(`Applied ${preset} preset to page ${pageNumber}`);
}

function savePageMargins() {
    const pageKeys = Object.keys(TEMPLATE_SYSTEM.pages);
    const margins = {};
    
    pageKeys.forEach((pageKey, index) => {
        const pageNumber = index + 1;
        margins[`page${pageNumber}`] = {
            top: document.getElementById(`topMargin${pageNumber}`).value || '1in',
            right: document.getElementById(`rightMargin${pageNumber}`).value || '1in',
            bottom: document.getElementById(`bottomMargin${pageNumber}`).value || '1in',
            left: document.getElementById(`leftMargin${pageNumber}`).value || '1in'
        };
    });
    
    CONFIG.PAGE_MARGINS = margins;
    localStorage.setItem(CONFIG.PAGE_MARGINS_KEY, JSON.stringify(margins));
    
    const modal = document.getElementById('marginModal');
    if (modal) {
        document.body.removeChild(modal);
    }
    
    console.log('Page margins saved');
    alert('Page margins saved successfully!');
}

function applyPageMarginsToPrint() {
    const pageKeys = Object.keys(TEMPLATE_SYSTEM.pages);
    
    pageKeys.forEach((pageKey, index) => {
        const pageNumber = index + 1;
        const pageDiv = document.querySelector(`.print-page:nth-child(${index + 1})`);
        
        if (pageDiv && CONFIG.PAGE_MARGINS[`page${pageNumber}`]) {
            const margins = CONFIG.PAGE_MARGINS[`page${pageNumber}`];
            pageDiv.style.paddingTop = margins.top;
            pageDiv.style.paddingRight = margins.right;
            pageDiv.style.paddingBottom = margins.bottom;
            pageDiv.style.paddingLeft = margins.left;
        }
    });
}

// ==================== SESSION MANAGEMENT ====================

function setupAutoSave() {
    // Auto-save when user types
    document.addEventListener('input', function(e) {
        if (e.target.matches('.page-content input')) {
            saveInputsToLocalStorage();
        }
    });
    
    // Auto-save on blur
    document.addEventListener('blur', function(e) {
        if (e.target.matches('.page-content input')) {
            saveInputsToLocalStorage();
        }
    }, true);
    
    console.log('Auto-save enabled');
}

function setupIdleTimeout() {
    let idleTime = 0;
    
    const resetIdleTime = () => {
        idleTime = 0;
        localStorage.setItem('lastActivity', new Date().getTime().toString());
    };
    
    // Reset idle time on user activity
    ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetIdleTime);
    });
    
    // Check idle time every minute
    setInterval(() => {
        idleTime++;
        
        // If idle for 30 minutes and not using persistent login
        if (idleTime > 30 && localStorage.getItem(CONFIG.PERSISTENT_LOGIN_KEY) !== 'true') {
            // Log out due to inactivity
            console.log('Logging out due to inactivity');
            clearSession();
            location.reload();
        }
    }, 60000); // Check every minute
    
    console.log('Idle timeout monitoring enabled');
}

function clearSession() {
    sessionStorage.removeItem(CONFIG.SESSION_KEY);
    localStorage.removeItem(CONFIG.PERSISTENT_LOGIN_KEY);
    localStorage.removeItem(CONFIG.SESSION_EXPIRY_KEY);
    console.log('Session cleared');
}

function goToHome() {
    if (confirm('Are you sure you want to go to home?')) {
        window.location.href = 'USER-DASHBOARD.html';
    }
}

function logout() {
    if (confirm('Are you sure you want to log out?')) {
        clearSession();
        location.reload();
    }
}

// ==================== EVENT LISTENERS SETUP ====================

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login
    dom.loginBtn.addEventListener('click', () => {
        if (dom.accessCodeInput.value === CONFIG.ACCESS_CODE) {
            sessionStorage.setItem(CONFIG.SESSION_KEY, 'true');
            localStorage.setItem(CONFIG.PERSISTENT_LOGIN_KEY, 'true');
            
            // Set session expiry (24 hours from now)
            const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem(CONFIG.SESSION_EXPIRY_KEY, expiryTime.toString());
            
            showMainContent();
            appState.isLoggedIn = true;
            console.log('Login successful');
        } else {
            alert('Invalid access code. Please try again.');
            console.log('Login failed: Invalid access code');
        }
    });
    
    dom.accessCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') dom.loginBtn.click();
    });
    
    // Main buttons
    dom.generateBtn.addEventListener('click', handleGenerate);
    dom.resetBtn.addEventListener('click', clearInputs);
    dom.editBtn.addEventListener('click', () => {
        updateUIState('editing');
        initInputHover();
    });
    dom.copyBtn.addEventListener('click', handleCopyToClipboard);
    dom.printBtn.addEventListener('click', handlePrint);
    dom.shareBtn.addEventListener('click', handleShare);
    
    // Terms and Privacy
    dom.termsLink.addEventListener('click', () => dom.termsModal.classList.add('active'));
    dom.privacyLink.addEventListener('click', () => dom.privacyModal.classList.add('active'));
    dom.closeTerms.addEventListener('click', () => dom.termsModal.classList.remove('active'));
    dom.closePrivacy.addEventListener('click', () => dom.privacyModal.classList.remove('active'));
    
    // Settings
    dom.settingsBtn.addEventListener('click', toggleSettingsPopup);
    dom.homeOption.addEventListener('click', goToHome);
    dom.logoutOption.addEventListener('click', logout);
    dom.themeToggle.addEventListener('change', toggleTheme);
    dom.animationToggle.addEventListener('change', toggleWritingAnimation);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === dom.termsModal) dom.termsModal.classList.remove('active');
        if (e.target === dom.privacyModal) dom.privacyModal.classList.remove('active');
        if (!dom.settingsBtn.contains(e.target) && !dom.settingsPopup.contains(e.target)) {
            dom.settingsPopup.classList.remove('active');
        }
        
        // Close margin modal if it exists
        const marginModal = document.getElementById('marginModal');
        if (marginModal && e.target === marginModal) {
            document.body.removeChild(marginModal);
        }
    });
    
    // Handle page unload
    window.addEventListener('beforeunload', function(e) {
        if (appState.isLoggedIn) {
            saveInputsToLocalStorage();
            
            // Update session expiry
            if (sessionStorage.getItem(CONFIG.SESSION_KEY)) {
                const newExpiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
                localStorage.setItem(CONFIG.SESSION_EXPIRY_KEY, newExpiryTime.toString());
            }
        }
    });
    
    console.log('Event listeners setup complete');
}

// ==================== INITIALIZE APPLICATION ====================

// Check if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}