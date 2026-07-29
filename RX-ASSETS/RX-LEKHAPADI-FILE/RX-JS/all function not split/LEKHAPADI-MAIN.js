// LEKHAPADI-UPDATED.js
// Main Application Logic with Template Selection

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dom = {
        loginScreen: document.getElementById('loginScreen'),
        mainContent: document.getElementById('mainContent'),
        accessCodeInput: document.getElementById('accessCodeInput'),
        loginBtn: document.getElementById('loginBtn'),
        editorContainer: document.getElementById('editorContainer'),
        resultArea: document.getElementById('result-area'),
        editableWitnesses: null, // Will be set after creation
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
        PAGE_MARGINS_KEY: 'rxStudioPageMargins',
        TEMPLATE_KEY: 'rxStudioSelectedTemplate'
    };

    // Current template system - will be set from TEMPLATE_COLLECTION
    let TEMPLATE_SYSTEM = null;

    // AUTO-DETECT MARGIN PRESETS SYSTEM
    const MARGIN_PRESETS = {
        Lekhapadi: { top: '3in', right: '1.5in', bottom: '1in', left: '2in' },
        lekhapadinextpage: { top: '1in', right: '1in', bottom: '1in', left: '2in' },
        resetandedit: { top: '0in', right: '0in', bottom: '0in', left: '0in' }
    };

    // Initialize the application
    function init() {
        // Check if TEMPLATE_COLLECTION is available
        if (typeof TEMPLATE_COLLECTION === 'undefined') {
            console.error('TEMPLATE_COLLECTION not found! Make sure 1.js is loaded before 2.js');
            return;
        }

        // Check login status
        if (localStorage.getItem(CONFIG.PERSISTENT_LOGIN_KEY) === 'true') {
            showMainContent();
        } else if (sessionStorage.getItem(CONFIG.SESSION_KEY)) {
            showMainContent();
        }
        
        initTheme();
        initWritingAnimationSetting();
        initWitnessBothPagesSetting();
        initPageMarginsSetting();
        initTemplateSetting();
        loadSelectedTemplate();
        setupEventListeners();
    }

    function initTheme() {
        const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'dark';
        document.body.setAttribute('data-theme', savedTheme);
        if (dom.themeToggle) dom.themeToggle.checked = savedTheme === 'light';
    }

    function initWritingAnimationSetting() {
        const animationEnabled = localStorage.getItem(CONFIG.WRITING_ANIMATION_KEY) !== 'false';
        if (dom.animationToggle) dom.animationToggle.checked = animationEnabled;
        CONFIG.WRITING_ANIMATION_ENABLED = animationEnabled;
    }

    function initWitnessBothPagesSetting() {
        const witnessBothPages = localStorage.getItem(CONFIG.WITNESS_BOTH_PAGES_KEY) === 'true';
        
        // Add witness toggle to settings if it doesn't exist
        if (!document.getElementById('witnessToggle') && dom.settingsPopup) {
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
            
            // Insert before logout option
            if (dom.logoutOption) {
                dom.settingsPopup.insertBefore(witnessOption, dom.logoutOption);
            } else {
                dom.settingsPopup.appendChild(witnessOption);
            }
            
            document.getElementById('witnessToggle').addEventListener('change', toggleWitnessBothPages);
        }
        
        const witnessToggle = document.getElementById('witnessToggle');
        if (witnessToggle) {
            witnessToggle.checked = witnessBothPages;
        }
        
        CONFIG.WITNESS_BOTH_PAGES = witnessBothPages;
    }

    function initTemplateSetting() {
        if (!document.getElementById('templateOption') && dom.settingsPopup) {
            const templateOption = document.createElement('div');
            templateOption.className = 'settings-option';
            templateOption.id = 'templateOption';
            templateOption.innerHTML = `Select Document`;
            templateOption.addEventListener('click', showTemplateSelectionPopup);
            
            // Insert before logout option
            if (dom.logoutOption) {
                dom.settingsPopup.insertBefore(templateOption, dom.logoutOption);
            } else {
                dom.settingsPopup.appendChild(templateOption);
            }
        }
    }

    function loadSelectedTemplate() {
        const savedTemplateId = localStorage.getItem(CONFIG.TEMPLATE_KEY);
        
        if (savedTemplateId && TEMPLATE_COLLECTION && TEMPLATE_COLLECTION[savedTemplateId]) {
            TEMPLATE_SYSTEM = JSON.parse(JSON.stringify(TEMPLATE_COLLECTION[savedTemplateId]));
        } else if (TEMPLATE_COLLECTION) {
            const firstTemplateId = Object.keys(TEMPLATE_COLLECTION)[0];
            TEMPLATE_SYSTEM = JSON.parse(JSON.stringify(TEMPLATE_COLLECTION[firstTemplateId]));
            localStorage.setItem(CONFIG.TEMPLATE_KEY, firstTemplateId);
        }
    }

    function showTemplateSelectionPopup() {
        if (dom.settingsPopup) dom.settingsPopup.classList.remove('active');
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.id = 'templateModal';
        
        let templatesHTML = '';
        
        for (const [key, template] of Object.entries(TEMPLATE_COLLECTION)) {
            const isSelected = localStorage.getItem(CONFIG.TEMPLATE_KEY) === key;
            templatesHTML += `
                <div class="template-item ${isSelected ? 'selected' : ''}" data-template-id="${key}">
                    <div class="template-name">${template.name}</div>
                    ${isSelected ? '<span class="selected-badge">✓ Current</span>' : ''}
                </div>
            `;
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" id="closeTemplateModal">&times;</button>
                <h2 class="modal-title">RX STUDIO DOCUMENT'S COLLECTION</h2>
                <p class="modal-subtitle">Select document & click apply button.</p>
                
                <div class="template-list">
                    ${templatesHTML}
                </div>
                
                <div class="margin-actions">
                    <button class="btn btn-danger" id="cancelTemplateBtn">Cancel</button>
                    <button class="btn btn-success" id="applyTemplateBtn">Apply</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        let selectedTemplateId = null;
        
        document.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.template-item').forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                selectedTemplateId = this.dataset.templateId;
            });
        });
        
        document.getElementById('closeTemplateModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        document.getElementById('cancelTemplateBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        document.getElementById('applyTemplateBtn').addEventListener('click', () => {
            if (!selectedTemplateId) {
                alert('Please select a template first.');
                return;
            }
            
            if (confirm('Are you sure you want to change template? All current data will be cleared.')) {
                localStorage.setItem(CONFIG.TEMPLATE_KEY, selectedTemplateId);
                localStorage.removeItem(CONFIG.STORAGE_KEY);
                
                document.body.removeChild(modal);
                
                showTemplateChangeNotification(selectedTemplateId);
            }
        });
    }

    function showTemplateChangeNotification(templateId) {
        const template = TEMPLATE_COLLECTION[templateId];
        
        const notification = document.createElement('div');
        notification.className = 'template-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon"></div>
                <div class="notification-message">
                    <strong>Template Changed!</strong>
                    <p>New template: ${template.name}</p>
                    <p>The page will refresh to load the new template.</p>
                </div>
                <div class="notification-actions">
                    <button class="btn btn-success" id="refreshNowBtn">Refresh Now</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .template-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--card-bg);
                    border: 2px solid var(--primary);
                    border-radius: var(--radius);
                    padding: 20px;
                    box-shadow: var(--shadow);
                    z-index: 5000;
                    animation: slideIn 0.3s ease;
                    max-width: 400px;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .notification-icon {
                    font-size: 40px;
                }
                
                .notification-message {
                    flex: 1;
                }
                
                .notification-message strong {
                    color: var(--primary);
                    display: block;
                    margin-bottom: 5px;
                }
                
                .notification-message p {
                    margin: 2px 0;
                    font-size: 14px;
                }
                
                .notification-actions .btn {
                    padding: 8px 15px;
                    font-size: 14px;
                    white-space: nowrap;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.getElementById('refreshNowBtn').addEventListener('click', () => {
            location.reload();
        });
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                location.reload();
            }
        }, 3000);
    }

    function initPageMarginsSetting() {
        const savedMargins = localStorage.getItem(CONFIG.PAGE_MARGINS_KEY);
        CONFIG.PAGE_MARGINS = savedMargins ? JSON.parse(savedMargins) : {};
        
        if (!document.getElementById('marginOption') && dom.settingsPopup) {
            const marginOption = document.createElement('div');
            marginOption.className = 'settings-option';
            marginOption.id = 'marginOption';
            marginOption.innerHTML = `Manage Page Margins`;
            marginOption.addEventListener('click', showMarginManagementPopup);
            
            // Insert before logout option
            if (dom.logoutOption) {
                dom.settingsPopup.insertBefore(marginOption, dom.logoutOption);
            } else {
                dom.settingsPopup.appendChild(marginOption);
            }
        }
    }

    function showMarginManagementPopup() {
        if (dom.settingsPopup) dom.settingsPopup.classList.remove('active');
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.id = 'marginModal';
        
        const pageKeys = TEMPLATE_SYSTEM ? Object.keys(TEMPLATE_SYSTEM.pages) : [];
        
        let tabsHTML = '';
        let contentHTML = '';
        
        pageKeys.forEach((pageKey, index) => {
            const pageNumber = index + 1;
            const activeClass = index === 0 ? 'active' : '';
            
            tabsHTML += `<button class="page-margin-tab ${activeClass}" data-page="${pageNumber}">पृष्ठ ${pageNumber}</button>`;
            
            const pageMargins = CONFIG.PAGE_MARGINS && CONFIG.PAGE_MARGINS[`page${pageNumber}`] ? 
                CONFIG.PAGE_MARGINS[`page${pageNumber}`] : { top: '1in', right: '1in', bottom: '1in', left: '1in' };
            
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
            Lekhapadi: 'Lekhapadi',
            lekhapadinextpage: 'Next Page',
            resetandedit: 'Reset to Zero'
        };
        
        return names[presetKey] || presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
    }

    function applyMarginPreset(pageNumber, preset) {
        const margins = MARGIN_PRESETS[preset] || { top: '1in', right: '1in', bottom: '1in', left: '1in' };
        
        document.getElementById(`topMargin${pageNumber}`).value = margins.top;
        document.getElementById(`rightMargin${pageNumber}`).value = margins.right;
        document.getElementById(`bottomMargin${pageNumber}`).value = margins.bottom;
        document.getElementById(`leftMargin${pageNumber}`).value = margins.left;
    }

    function savePageMargins() {
        const pageKeys = TEMPLATE_SYSTEM ? Object.keys(TEMPLATE_SYSTEM.pages) : [];
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
        const pageKeys = TEMPLATE_SYSTEM ? Object.keys(TEMPLATE_SYSTEM.pages) : [];
        
        pageKeys.forEach((pageKey, index) => {
            const pageNumber = index + 1;
            const pageDiv = document.querySelector(`.print-page:nth-child(${index + 1})`);
            
            if (pageDiv && CONFIG.PAGE_MARGINS && CONFIG.PAGE_MARGINS[`page${pageNumber}`]) {
                const margins = CONFIG.PAGE_MARGINS[`page${pageNumber}`];
                pageDiv.style.paddingTop = margins.top;
                pageDiv.style.paddingRight = margins.right;
                pageDiv.style.paddingBottom = margins.bottom;
                pageDiv.style.paddingLeft = margins.left;
            }
        });
    }

    function showMainContent() {
        if (dom.loginScreen) dom.loginScreen.classList.add('hidden');
        if (dom.mainContent) dom.mainContent.classList.remove('hidden');
        
        createEditorStructure();
        
        // Small delay to ensure DOM is updated
        setTimeout(() => {
            renderEditableParagraphs();
            updateUIState('editing');
            initInputHover();
        }, 50);
    }

    function createEditorStructure() {
        if (!dom.editorContainer) return;
        
        // Clear existing content
        dom.editorContainer.innerHTML = '';
        
        // Create editor container div
        const editorDiv = document.createElement('div');
        editorDiv.className = 'editor-container';
        
        // Create witness column
        const witnessColumn = document.createElement('div');
        witnessColumn.className = 'editor-witness-column';
        witnessColumn.innerHTML = `
            <div class="section-title">
            साक्षी विवरण
            </div>
            <div class="editable-area" id="editableWitnesses" style="min-height: 400px;"></div>
        `;
        
        // Create main column
        const mainColumn = document.createElement('div');
        mainColumn.className = 'editor-main-column';
        
        // Add columns to editor div
        editorDiv.appendChild(witnessColumn);
        editorDiv.appendChild(mainColumn);
        
        // Add to editor container
        dom.editorContainer.appendChild(editorDiv);
        
        // Update dom reference
        dom.editableWitnesses = document.getElementById('editableWitnesses');
    }

    function updateUIState(state) {
        const isEditing = state === 'editing';
        const isGenerated = state === 'generated';
        const isTyping = state === 'typing';

        if (dom.editorContainer) {
            dom.editorContainer.classList.toggle('hidden', !isEditing);
        }

        if (dom.resultArea) {
            dom.resultArea.classList.toggle('hidden', isEditing);
        }

        if (dom.generateBtn) {
            dom.generateBtn.classList.toggle('hidden', !isEditing);
            dom.generateBtn.classList.toggle('loading', isTyping);
            dom.generateBtn.disabled = isTyping;
        }

        if (dom.printBtn) dom.printBtn.classList.toggle('hidden', !isGenerated);
        if (dom.resetBtn) dom.resetBtn.classList.toggle('hidden', !isEditing);
        if (dom.editBtn) dom.editBtn.classList.toggle('hidden', !isGenerated);
        if (dom.copyBtn) dom.copyBtn.classList.toggle('hidden', !isGenerated);
        if (dom.shareBtn) dom.shareBtn.classList.toggle('hidden', !isGenerated);

        if (dom.statusIndicator && dom.statusText) {
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
    }

    function renderPart(templateText, targetElement, placeholderOffset, placeholders) {
        if (!targetElement) return 0;
        
        targetElement.innerHTML = '';
        const parts = templateText.split('-----');
        const savedData = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];

        parts.forEach((part, index) => {
            if (part) {
                targetElement.appendChild(document.createTextNode(part));
            }
            
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
        if (!TEMPLATE_SYSTEM) return;
        
        const mainColumn = document.querySelector('.editor-main-column');
        if (!mainColumn) return;
        
        const pageKeys = Object.keys(TEMPLATE_SYSTEM.pages);
        
        // Clear main column
        mainColumn.innerHTML = '';
        
        // Create page tabs
        const pageTabs = document.createElement('div');
        pageTabs.className = 'page-tabs';
        
        pageKeys.forEach((pageKey, index) => {
            const pageNumber = index + 1;
            const activeClass = index === 0 ? 'active' : '';
            pageTabs.innerHTML += `<button class="page-tab ${activeClass}" data-page="${pageNumber}">पृष्ठ ${pageNumber}</button>`;
        });
        
        mainColumn.appendChild(pageTabs);

        // Create page container
        const pageContainer = document.createElement('div');
        pageContainer.className = 'page-container';
        
        pageKeys.forEach((pageKey, index) => {
            const pageNumber = index + 1;
            const pageData = TEMPLATE_SYSTEM.pages[pageKey];
            const activeClass = index === 0 ? 'active' : '';
            pageContainer.innerHTML += `
                <div id="page${pageNumber}" class="page-content ${activeClass}">
                    <div class="section-title">${pageData.title}</div>
                    <div class="editable-area" id="editablePage${pageNumber}"></div>
                </div>
            `;
        });
        
        mainColumn.appendChild(pageContainer);

        // Render each page
        let totalInputsSoFar = 0;
        
        pageKeys.forEach((pageKey, index) => {
            const pageNumber = index + 1;
            const pageData = TEMPLATE_SYSTEM.pages[pageKey];
            const pageElement = document.getElementById(`editablePage${pageNumber}`);
            
            if (pageElement) {
                const inputsCount = renderPart(
                    pageData.template, 
                    pageElement, 
                    totalInputsSoFar, 
                    pageData.placeholders
                );
                totalInputsSoFar += inputsCount;
            }
        });

        // Render witness section
        if (dom.editableWitnesses && TEMPLATE_SYSTEM.witness) {
            renderPart(
                TEMPLATE_SYSTEM.witness.template, 
                dom.editableWitnesses, 
                totalInputsSoFar, 
                TEMPLATE_SYSTEM.witness.placeholders
            );
        }

        // Add tab click handlers
        document.querySelectorAll('.page-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.page-content').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const pageId = `page${this.dataset.page}`;
                const pageElement = document.getElementById(pageId);
                if (pageElement) pageElement.classList.add('active');
            });
        });
    }

    function initInputHover() {
        const allInputs = document.querySelectorAll('.page-content input, #editableWitnesses input');
        
        allInputs.forEach(input => {
            input.addEventListener('mouseenter', function() {
                if (this.parentElement) {
                    this.parentElement.classList.add('hover-active');
                }
            });
            
            input.addEventListener('mouseleave', function() {
                if (this.parentElement) {
                    this.parentElement.classList.remove('hover-active');
                }
            });
            
            input.addEventListener('focus', function() {
                if (this.parentElement) {
                    this.parentElement.classList.add('focus-active');
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.parentElement) {
                    this.parentElement.classList.remove('focus-active');
                }
            });
        });
    }

    function saveInputsToLocalStorage() {
        const allInputs = document.querySelectorAll('.page-content input, #editableWitnesses input');
        const data = Array.from(allInputs).map(input => input.value);
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    }

    function clearInputs() {
        if (confirm("Are you sure you want to clear all fields? This cannot be undone.")) {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            
            // Clear all input values
            const allInputs = document.querySelectorAll('.page-content input, #editableWitnesses input');
            allInputs.forEach(input => input.value = '');
        }
    }

    function getTextFromEditableArea(container) {
        if (!container) return '';
        
        let text = '';
        container.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.classList && node.classList.contains('input-wrapper')) {
                const input = node.querySelector('input');
                text += input.value.trim() || `[${input.placeholder}]`;
            }
        });
        return text;
    }

    function getFullGeneratedText() {
        if (!TEMPLATE_SYSTEM) return '';
        
        const pageKeys = Object.keys(TEMPLATE_SYSTEM.pages);
        let fullText = '';
        
        pageKeys.forEach((pageKey, index) => {
            const pageNumber = index + 1;
            const pageElement = document.getElementById(`editablePage${pageNumber}`);
            if (pageElement) {
                const pageText = getTextFromEditableArea(pageElement);
                fullText += `पृष्ठ ${pageNumber}:\n${pageText}\n\n`;
            }
        });
        
        if (dom.editableWitnesses) {
            const witnessText = getTextFromEditableArea(dom.editableWitnesses);
            fullText += `साक्षी विवरण:\n${witnessText}`;
        }
        
        return fullText;
    }

    function typeText(element, text, callback) {
        if (!element) return;
        
        element.innerHTML = '';
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        element.appendChild(cursor);
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                i++;
                if (dom.progressBar) {
                    dom.progressBar.style.width = `${(i / text.length) * 100}%`;
                }
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

        if (CONFIG.WRITING_ANIMATION_ENABLED && dom.resultArea) {
            typeText(dom.resultArea, fullText, () => {
                updateUIState('generated');
                if (dom.progressBar) dom.progressBar.style.width = '0%';
            });
        } else {
            if (dom.resultArea) {
                dom.resultArea.innerText = fullText;
            }
            updateUIState('generated');
            if (dom.progressBar) {
                dom.progressBar.style.width = '100%';
                setTimeout(() => {
                    if (dom.progressBar) dom.progressBar.style.width = '0%';
                }, 300);
            }
        }
    }

    function handleCopyToClipboard() {
        if (!dom.resultArea) return;
        
        const textToCopy = dom.resultArea.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            if (dom.copyBtn) {
                const originalText = dom.copyBtn.innerHTML;
                dom.copyBtn.textContent = 'Copied!';
                setTimeout(() => { 
                    if (dom.copyBtn) dom.copyBtn.innerHTML = originalText; 
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy text.');
        });
    }

    function createPrintDocument() {
        if (!TEMPLATE_SYSTEM || !dom.outputContainer) return;
        
        const pageKeys = Object.keys(TEMPLATE_SYSTEM.pages);
        const witnessText = dom.editableWitnesses ? getTextFromEditableArea(dom.editableWitnesses) : '';
        
        dom.outputContainer.innerHTML = '';
        
        pageKeys.forEach((pageKey, index) => {
            const pageNumber = index + 1;
            const pageElement = document.getElementById(`editablePage${pageNumber}`);
            const pageText = pageElement ? getTextFromEditableArea(pageElement) : '';
            
            const pageDiv = document.createElement('div');
            pageDiv.className = 'print-page';
            
            if (CONFIG.PAGE_MARGINS && CONFIG.PAGE_MARGINS[`page${pageNumber}`]) {
                const margins = CONFIG.PAGE_MARGINS[`page${pageNumber}`];
                pageDiv.style.paddingTop = margins.top;
                pageDiv.style.paddingRight = margins.right;
                pageDiv.style.paddingBottom = margins.bottom;
                pageDiv.style.paddingLeft = margins.left;
            } else {
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

            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
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
        
        alert('Document downloaded as text file. You can now convert it to PDF using your device\'s file manager or any PDF converter app. You can also click the print button and save as PDF directly.');
    }

    function toggleSettingsPopup() {
        if (dom.settingsPopup) {
            dom.settingsPopup.classList.toggle('active');
        }
    }

    function toggleTheme() {
        const isLight = dom.themeToggle ? dom.themeToggle.checked : false;
        const theme = isLight ? 'light' : 'dark';
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem(CONFIG.THEME_KEY, theme);
    }

    function toggleWritingAnimation() {
        const isAnimationEnabled = dom.animationToggle ? dom.animationToggle.checked : true;
        CONFIG.WRITING_ANIMATION_ENABLED = isAnimationEnabled;
        localStorage.setItem(CONFIG.WRITING_ANIMATION_KEY, isAnimationEnabled);
    }

    function toggleWitnessBothPages() {
        const witnessToggle = document.getElementById('witnessToggle');
        if (witnessToggle) {
            const isWitnessBothPages = witnessToggle.checked;
            CONFIG.WITNESS_BOTH_PAGES = isWitnessBothPages;
            localStorage.setItem(CONFIG.WITNESS_BOTH_PAGES_KEY, isWitnessBothPages);
        }
    }

    function goToHome() {
        if (confirm('Are you sure you want to go to home?')) {
            window.location.href = 'https://rosankc.com.np/';
        }
    }

    function logout() {
        if (confirm('Are you sure you want to log out?')) {
            sessionStorage.removeItem(CONFIG.SESSION_KEY);
            localStorage.removeItem(CONFIG.PERSISTENT_LOGIN_KEY);
            location.reload();
        }
    }

    function setupEventListeners() {
        // Login button
        if (dom.loginBtn) {
            dom.loginBtn.addEventListener('click', () => {
                if (dom.accessCodeInput && dom.accessCodeInput.value === CONFIG.ACCESS_CODE) {
                    sessionStorage.setItem(CONFIG.SESSION_KEY, 'true');
                    localStorage.setItem(CONFIG.PERSISTENT_LOGIN_KEY, 'true');
                    showMainContent();
                } else {
                    alert('Invalid access code. Please try again.');
                }
            });
        }

        // Enter key on access code input
        if (dom.accessCodeInput) {
            dom.accessCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && dom.loginBtn) {
                    dom.loginBtn.click();
                }
            });
        }

        // Main buttons
        if (dom.generateBtn) dom.generateBtn.addEventListener('click', handleGenerate);
        if (dom.resetBtn) dom.resetBtn.addEventListener('click', clearInputs);
        if (dom.editBtn) dom.editBtn.addEventListener('click', () => {
            updateUIState('editing');
            initInputHover();
        });
        if (dom.copyBtn) dom.copyBtn.addEventListener('click', handleCopyToClipboard);
        if (dom.printBtn) dom.printBtn.addEventListener('click', handlePrint);
        if (dom.shareBtn) dom.shareBtn.addEventListener('click', handleShare);

        // Modals
        if (dom.termsLink) {
            dom.termsLink.addEventListener('click', () => {
                if (dom.termsModal) dom.termsModal.classList.add('active');
            });
        }
        
        if (dom.privacyLink) {
            dom.privacyLink.addEventListener('click', () => {
                if (dom.privacyModal) dom.privacyModal.classList.add('active');
            });
        }
        
        if (dom.closeTerms) {
            dom.closeTerms.addEventListener('click', () => {
                if (dom.termsModal) dom.termsModal.classList.remove('active');
            });
        }
        
        if (dom.closePrivacy) {
            dom.closePrivacy.addEventListener('click', () => {
                if (dom.privacyModal) dom.privacyModal.classList.remove('active');
            });
        }

        // Settings
        if (dom.settingsBtn) dom.settingsBtn.addEventListener('click', toggleSettingsPopup);
        if (dom.homeOption) dom.homeOption.addEventListener('click', goToHome);
        if (dom.logoutOption) dom.logoutOption.addEventListener('click', logout);
        if (dom.themeToggle) dom.themeToggle.addEventListener('change', toggleTheme);
        if (dom.animationToggle) dom.animationToggle.addEventListener('change', toggleWritingAnimation);

        // Close modals on overlay click
        window.addEventListener('click', (e) => {
            if (e.target === dom.termsModal && dom.termsModal) {
                dom.termsModal.classList.remove('active');
            }
            if (e.target === dom.privacyModal && dom.privacyModal) {
                dom.privacyModal.classList.remove('active');
            }
            if (dom.settingsBtn && dom.settingsPopup && 
                !dom.settingsBtn.contains(e.target) && 
                !dom.settingsPopup.contains(e.target)) {
                dom.settingsPopup.classList.remove('active');
            }
        });

        // Auto-save on input
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT') {
                saveInputsToLocalStorage();
            }
        });
    }

    // Start the application
    init();
});