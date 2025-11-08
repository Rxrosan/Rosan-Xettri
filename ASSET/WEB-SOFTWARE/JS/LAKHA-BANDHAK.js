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

const CONFIG = {
    ACCESS_CODE: 'RX-2061',
    TYPING_SPEED: 10,
    SESSION_KEY: 'fillBlankAuth',
    STORAGE_KEY: 'kapaliTamsukData',
    MAX_ROWS_PER_PAGE: 32,
    THEME_KEY: 'rxStudioTheme',
    PERSISTENT_LOGIN_KEY: 'rxStudioPersistentLogin',
    WRITING_ANIMATION_KEY: 'rxStudioWritingAnimation',
    WITNESS_BOTH_PAGES_KEY: 'rxStudioWitnessBothPages',
    PAGE_MARGINS_KEY: 'rxStudioPageMargins'
};

// Dynamic Template System
const TEMPLATE_SYSTEM = {
    pages: {
        page1: {
            title: "पृष्ठ १ - मुख्य विवरण / लखबन्धक तमसुक ",
            template: "लिखितम् धनीका नाम ----- जिल्ला ----- वडा नं  ----- बस्ने बर्ष ----- काे  ----- काे नाति ----- काे ----- ----- ऋणीकाे नाम ----- जिल्ला ----- वडा नं  ----- बस्ने बर्ष ----- काे  ----- काे नाति ----- काे ----- ----- ले नगद नेपाली रूपैयाँ ----- अक्षेरेपी ----- कर्जा लिए वापत घर खर्च गर्न लिएकाे ठीक साँचाे हाे । याे रूपैयाँमा अरू कसैलाई केही गरी नदिएकाे मेराे हक भाेग दर्ताकाे ----- ----- भित्रकाे ----- खेत भन्ने राेपानी ----- जग्गा आजकाे मिति ----- देखि हक छाडी राजीनामा गरी दिँए । भाेग गर्न पाउनु भएन भने साँवा र ऐन बमाेजिमकाे ब्याज समेत मेराे अरू घरानाबाट असुल उपर गरी लिनु भनि मेराे मनाेमान खुशीराजीसँग तपाई साहूकै घर पिंढीमा बसी बायाँ किनारकाे साक्षीकाे राेहवरमा राजीनामा लेखी तपाई साहूलाई दिएँ र साक्षी किनारकाे सदर । याे राजीनामा ऐनकाे म्यादभित्र दर्ता गरी दिउला ।",
            placeholders: ["धनीको जिल्ला","नपा/गापा","धनीको वडा नं","धनीको उमेर","धनीको हजुरबुबा","धनीको बुबा","छोरा/छोरी","धनीको पुरा नाम","ऋणीको जिल्ला","नपा/गापा","ऋणीको वडा नं.","ऋणीको उमेर","ऋणीको हजुरबुबा","ऋणीको बुबा","छोरा/छोरी","ऋणीको पुरा नाम","रकम (अंकमा)","रकम (अक्षरमा)","जग्गाकाे ठेगाना जिल्ला","गा बि स वा न पा ","जग्गाकाे पहिचान नाम","जग्गाकाे नाप ","आजको मिति","तमसुक लेखेकाे साल","तमसुक लेखेकाे महिना","तमसुक लेखेकाे गते","तमसुक लेखेकाे बार अंकमा"]
        },
        //page2: {
        //    title: "पृष्ठ २ - अतिरिक्त विवरण",
        //    template: "यो पृष्ठ ३ को विवरण हो ----- पहिलो फिल्ड ----- र ----- दोस्रो फिल्ड ----- बीचको सम्बन्ध।",
        //    placeholders: ["पृष्ठ ३ को पहिलो फिल्ड", "पृष्ठ ३ को दोस्रो फिल्ड"]
        //},
        //page3: {
        //    title: "पृष्ठ ३ - अन्तिम विवरण", 
        //    template: "अन्तिम पृष्ठ ----- अन्तिम फिल्ड ----- संग समाप्त।",
        //    placeholders: ["अन्तिम फिल्ड"]
        //}
    },
    witness: {
        template: "\nदायाँ                     बायाँ\n                                         साक्षी\nसही ----- जिल्ला ----- वडा नं ----- मा बस्ने -----   \nसही ए ----- जिल्ला ----- वडा नं ----- मा बस्ने -----  \nसही ए ----- जिल्ला ----- वडा नं ----- मा बस्ने लेखक ----- \nप्रमाण पत्र नं ----- प्राप्त गरेकाे अदालत ----- ",
        placeholders: ["पहिलो साक्षीकाे बस्ने जिल्लाकाे नाम","पहिलो साक्षीकाे बस्ने गा पा वा न पा","पहिलो साक्षीकाे बस्ने वडा नंम्बर","पहिलो साक्षीकाे पुरा नाम","दोस्रो साक्षीकाे बस्ने जिल्लाकाे नाम","दोस्रो साक्षीकाे बस्ने गा पा वा न पा","दोस्रो साक्षीकाे बस्ने वडा नंम्बर","दोस्रो साक्षीकाे पुरा नाम","लेखक बस्ने जिल्लाकाे नाम","लेखक काे गा पा वा न पा","लेखक बस्ने वडा नं","लेखक काे पुरा नाम","लेखककाे लाइसेनकाे प्रमाण पत्र नं","लेखकले लाइसेन प्राप्त गरेकाे अदालतकाे नाम"]
    }
};

// AUTO-DETECT MARGIN PRESETS SYSTEM
const MARGIN_PRESETS = {
    // Add your margin presets here - the system will auto-detect any new ones
    Lekhapadi: { top: '3in', right: '1.5in', bottom: '1in', left: '2in' },
    lekhapadinextpage: { top: '1in', right: '1in', bottom: '1in', left: '2in' },
    resetandedit: { top: '0in', right: '0in', bottom: '0in', left: '0in' }
};

function init() {
    if (localStorage.getItem(CONFIG.PERSISTENT_LOGIN_KEY) === 'true') {
        showMainContent();
    } else if (sessionStorage.getItem(CONFIG.SESSION_KEY)) {
        showMainContent();
    }
    initTheme();
    initWritingAnimationSetting();
    initWitnessBothPagesSetting();
    initPageMarginsSetting();
}

function initTheme() {
    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    dom.themeToggle.checked = savedTheme === 'light';
}

function initWritingAnimationSetting() {
    const animationEnabled = localStorage.getItem(CONFIG.WRITING_ANIMATION_KEY) !== 'false';
    dom.animationToggle.checked = animationEnabled;
    CONFIG.WRITING_ANIMATION_ENABLED = animationEnabled;
}

function initWitnessBothPagesSetting() {
    const witnessBothPages = localStorage.getItem(CONFIG.WITNESS_BOTH_PAGES_KEY) === 'true';
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
        document.getElementById('witnessToggle').addEventListener('change', toggleWitnessBothPages);
    }
    document.getElementById('witnessToggle').checked = witnessBothPages;
    CONFIG.WITNESS_BOTH_PAGES = witnessBothPages;
}

// AUTO-DETECTING MARGIN MANAGEMENT SYSTEM
function initPageMarginsSetting() {
    const savedMargins = localStorage.getItem(CONFIG.PAGE_MARGINS_KEY);
    CONFIG.PAGE_MARGINS = savedMargins ? JSON.parse(savedMargins) : {};
    
    // Add margin management option to settings
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
}

function showMarginManagementPopup() {
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

// AUTO-GENERATE PRESET BUTTONS FROM MARGIN_PRESETS OBJECT
function generateMarginPresetButtons() {
    let buttonsHTML = '';
    
    for (const [presetKey, presetValue] of Object.entries(MARGIN_PRESETS)) {
        const presetName = formatPresetName(presetKey);
        buttonsHTML += `<div class="margin-preset-btn" data-preset="${presetKey}">${presetName}</div>`;
    }
    
    return buttonsHTML;
}

// FORMAT PRESET NAME FOR DISPLAY
function formatPresetName(presetKey) {
    const names = {
        normal: 'Lekhapadi',
        narrow: 'Narrow (0.5in)',
        wide: 'Wide (2in)',
        custom1: 'Custom 1 (3cm)',
        custom2: 'Custom 2 (1.5in)',
        reset: 'Reset to Default'
    };
    
    return names[presetKey] || presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
}

// AUTO-DETECTING MARGIN PRESET APPLICATION
function applyMarginPreset(pageNumber, preset) {
    // Automatically get margins from MARGIN_PRESETS object
    const margins = MARGIN_PRESETS[preset] || { top: '1in', right: '1in', bottom: '1in', left: '1in' };
    
    document.getElementById(`topMargin${pageNumber}`).value = margins.top;
    document.getElementById(`rightMargin${pageNumber}`).value = margins.right;
    document.getElementById(`bottomMargin${pageNumber}`).value = margins.bottom;
    document.getElementById(`leftMargin${pageNumber}`).value = margins.left;
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

// ... REST OF YOUR EXISTING FUNCTIONS REMAIN THE SAME ...

function showMainContent() {
    dom.loginScreen.classList.add('hidden');
    dom.mainContent.classList.remove('hidden');
    renderEditableParagraphs();
    updateUIState('editing');
    initInputHover();
}

function updateUIState(state) {
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
    } else if (isTyping) {
        dom.statusIndicator.classList.add('status-typing');
        dom.statusText.textContent = 'Generating...';
    } else if (isGenerated) {
        dom.statusIndicator.classList.add('status-generated');
        dom.statusText.textContent = 'Generated';
    }
}

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
            input.placeholder = placeholder;
            input.value = savedData[index + placeholderOffset] || '';
            input.dataset.index = index + placeholderOffset;
            input.dataset.placeholder = placeholder;
            
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
    const editorContainer = document.querySelector('.editor-container');
    const pageKeys = Object.keys(TEMPLATE_SYSTEM.pages);
    
    // Get or create the main column
    let mainColumn = document.querySelector('.editor-main-column');
    if (!mainColumn) {
        mainColumn = document.createElement('div');
        mainColumn.className = 'editor-main-column';
        editorContainer.appendChild(mainColumn);
    }
    
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
        
        document.querySelectorAll('.page-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.page-content').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                document.getElementById(`page${this.dataset.page}`).classList.add('active');
            });
        });
    }

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

    renderPart(
        TEMPLATE_SYSTEM.witness.template, 
        document.getElementById('editableWitnesses'), 
        totalInputsSoFar, 
        TEMPLATE_SYSTEM.witness.placeholders
    );
}

// Simple hover functionality for inputs
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
}

function saveInputsToLocalStorage() {
    const allInputs = document.querySelectorAll('.page-content input');
    const data = Array.from(allInputs).map(input => input.value);
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
}

function clearInputs() {
    if (confirm("Are you sure you want to clear all fields? This cannot be undone.")) {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        renderEditableParagraphs();
        initInputHover();
    }
}

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
    saveInputsToLocalStorage();
    const fullText = getFullGeneratedText();
    updateUIState('typing');

    if (CONFIG.WRITING_ANIMATION_ENABLED) {
        typeText(dom.resultArea, fullText, () => {
            updateUIState('generated');
            dom.progressBar.style.width = '0%';
        });
    } else {
        dom.resultArea.innerText = fullText;
        updateUIState('generated');
        dom.progressBar.style.width = '100%';
        setTimeout(() => dom.progressBar.style.width = '0%', 300);
    }
}

function handleCopyToClipboard() {
    const textToCopy = dom.resultArea.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = dom.copyBtn.innerHTML;
        dom.copyBtn.textContent = 'Copied!';
        setTimeout(() => { dom.copyBtn.innerHTML = originalText; }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy text.');
    });
}

function createPrintDocument() {
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
}

function handlePrint() {
    createPrintDocument();
    setTimeout(() => {
        window.print();
    }, 500);
}

// SHARE FUNCTIONALITY
async function handleShare() {
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
    
    alert('Document downloaded as text file. You can now convert it to PDF using your device\'s file manager or any PDF converter app.or you can also clicking print button from there  save as direct pdf file ');
}

function toggleSettingsPopup() {
    dom.settingsPopup.classList.toggle('active');
}

function toggleTheme() {
    const isLight = dom.themeToggle.checked;
    const theme = isLight ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.THEME_KEY, theme);
}

function toggleWritingAnimation() {
    const isAnimationEnabled = dom.animationToggle.checked;
    CONFIG.WRITING_ANIMATION_ENABLED = isAnimationEnabled;
    localStorage.setItem(CONFIG.WRITING_ANIMATION_KEY, isAnimationEnabled);
}

function toggleWitnessBothPages() {
    const isWitnessBothPages = document.getElementById('witnessToggle').checked;
    CONFIG.WITNESS_BOTH_PAGES = isWitnessBothPages;
    localStorage.setItem(CONFIG.WITNESS_BOTH_PAGES_KEY, isWitnessBothPages);
}

function goToHome() {
    if (confirm('Are you sure you want to go to home?')) {
        window.location.href = 'index.html';
    }
}

function logout() {
    if (confirm('Are you sure you want to log out?')) {
        sessionStorage.removeItem(CONFIG.SESSION_KEY);
        localStorage.removeItem(CONFIG.PERSISTENT_LOGIN_KEY);
        location.reload();
    }
}

// Event Listeners
dom.loginBtn.addEventListener('click', () => {
    if (dom.accessCodeInput.value === CONFIG.ACCESS_CODE) {
        sessionStorage.setItem(CONFIG.SESSION_KEY, 'true');
        localStorage.setItem(CONFIG.PERSISTENT_LOGIN_KEY, 'true');
        showMainContent();
    } else {
        alert('Invalid access code. Please try again.');
    }
});

dom.accessCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') dom.loginBtn.click();
});

dom.generateBtn.addEventListener('click', handleGenerate);
dom.resetBtn.addEventListener('click', clearInputs);
dom.editBtn.addEventListener('click', () => {
    updateUIState('editing');
    initInputHover();
});
dom.copyBtn.addEventListener('click', handleCopyToClipboard);
dom.printBtn.addEventListener('click', handlePrint);
dom.shareBtn.addEventListener('click', handleShare);

dom.termsLink.addEventListener('click', () => dom.termsModal.classList.add('active'));
dom.privacyLink.addEventListener('click', () => dom.privacyModal.classList.add('active'));
dom.closeTerms.addEventListener('click', () => dom.termsModal.classList.remove('active'));
dom.closePrivacy.addEventListener('click', () => dom.privacyModal.classList.remove('active'));

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
});

// Initialize the app
init();