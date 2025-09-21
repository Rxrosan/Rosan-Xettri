const dom = {
    loginScreen: document.getElementById('loginScreen'),
    mainContent: document.getElementById('mainContent'),
    accessCodeInput: document.getElementById('accessCodeInput'),
    loginBtn: document.getElementById('loginBtn'),
    editorContainer: document.getElementById('editorContainer'),
    resultArea: document.getElementById('result-area'),
    editableMainBody: document.getElementById('editableMainBody'),
    editableWitnesses: document.getElementById('editableWitnesses'),
    editableFooter: document.getElementById('editableFooter'),
    outputContainer: document.getElementById('final-output-container'),
    outputWitnesses: document.getElementById('output-witnesses'),
    outputMainBody: document.getElementById('output-main-body'),
    generateBtn: document.getElementById('generateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    editBtn: document.getElementById('editBtn'),
    copyBtn: document.getElementById('copyBtn'),
    printBtn: document.getElementById('printBtn'),
    termsLink: document.getElementById('termsLink'),
    privacyLink: document.getElementById('privacyLink'),
    termsModal: document.getElementById('termsModal'),
    privacyModal: document.getElementById('privacyModal'),
    closeTerms: document.getElementById('closeTerms'),
    closePrivacy: document.getElementById('closePrivacy'),
};

const CONFIG = {
    ACCESS_CODE: 'RX-2061',
    TYPING_SPEED: 10,
    PLACEHOLDERS: ["धनीको जिल्ला","नपा/गापा","धनीको वडा नं","धनीको उमेर","धनीको हजुरबुबा","धनीको बुबा","छोरा/छोरी","धनीको पुरा नाम","ऋणीको जिल्ला","नपा/गापा","ऋणीको वडा नं.","ऋणीको उमेर","ऋणीको हजुरबुबा","ऋणीको बुबा","छोरा/छोरी","ऋणीको पुरा नाम","रकम (अंकमा)","रकम (अक्षरमा)","जिल्लाकाे नाम ","गा बि स वा न पा ","वडा नं ","कित्ता नं ","चार दिसा मध्ये एक काे जग्गाकाे ठेगना ","चार दिसा मध्ये एक काे जग्गाकाे ठेगना ","चार दिसा मध्ये एक काे जग्गाकाे ठेगना ","चार दिसा मध्ये एक काे जग्गाकाे ठेगना ","किल्लाकाे नाप अंकमा "," राेपानी जग्गाकाे नाम "," राेपानी काे नाप क्षेत्रपफल अंकमा  "," जग्गा बेचेकाे मुल्य रकम अंकमा ","जग्गा बेचेकाे पुरा मिति","राजीनामा चाेरी वा हराएकाे भएकाे पुरा मिति"," हराएकाे वा चाेरी भएकाे ","पहिलो साक्षीकाे बस्ने जिल्लाकाे नाम","पहिलो साक्षीकाे बस्ने गा पा वा न पा","पहिलो साक्षीकाे बस्ने वडा नंम्बर","पहिलो साक्षीकाे पुरा नाम","दोस्रो साक्षीकाे बस्ने जिल्लाकाे नाम","दोस्रो साक्षीकाे बस्ने गा पा वा न पा","दोस्रो साक्षीकाे बस्ने वडा नंम्बर","दोस्रो साक्षीकाे पुरा नाम","लेखक बस्ने जिल्लाकाे नाम","लेखक काे गा पा वा न पा","लेखक बस्ने वडा नं","लेखक काे पुरा नाम","लेखककाे लाइसेनकाे प्रमाण पत्र नं","लेखकले लाइसेन प्राप्त गरेकाे अदालतकाे नाम","तमसुक लेखेकाे साल","तमसुक लेखेकाे महिना","तमसुक लेखेकाे गते","तमसुक लेखेकाे बार अंकमा"],
    SESSION_KEY: 'fillBlankAuth',
    STORAGE_KEY: 'kapaliTamsukData'
};

// Template texts moved from HTML to JavaScript
const TEMPLATE_TEXTS = {
    mainBodyText: "लिखितम् धनीका नाम ----- जिल्ला ----- वडा नं  ----- बस्ने बर्ष ----- काे  ----- काे नाति ----- काे ----- ----- ऋणीकाे नाम ----- जिल्ला ----- वडा नं  ----- बस्ने बर्ष ----- काे  ----- काे नाति ----- काे ----- ----- ले नगद नेपाली रूपैयाँ ----- अक्षेरेपी ----- कर्जा लिए वापत घर खर्च गर्न लिएकाे, साे रूपैयाँमा मेराे नाममा दर्ता भएकाे ----- ----- वडा नं ----- काे कि नं ----- काे ----- ----- ----- ----- तपाई  साहूकाे जग्गा यति ----- किल्ला भित्रकाे ----- भन्ने राेपानी ----- जग्गा तपाई  साहूलाई  मैले रू ----- मा ----- मा राजीनामा  गरी दिएकाे ----- मा -----भएकाेले व्यहाेरा जनाई याे अर्काे गरिदिनुहाेस् भनी आजको मितिमा भन्नु भएकाले उक्त चाेरी भएकाेले व्यहाेरा जनाई याे अर्काे राजीनामा गरी दिएकाे छु । अघिकै मितिकाे राजीनामा सरह याे राजीनामा बाट पनि साे जग्गा तपाई साहूले भाेग गर्नु । भाेग गर्दा कच्चा ठहरे साहूकाे थैली ऐन बमाेजिम मेराे घर घरानाबाट उपर गरी लिनु भनी मेरै घर पिंढीमा बसी बायाँ किनाराकाे साक्षीका राेहवरमा राजीनामा लेखी तपाई साहूलाई दिए ।",
    witnessText: "दायाँ                     बायाँ\n                                         साक्षी\nसही ----- जिल्ला ----- वडा नं ----- मा बस्ने -----  १ \nसही ए ----- जिल्ला ----- वडा नं ----- मा बस्ने -----  १\nसही ए ----- जिल्ला ----- वडा नं ----- मा बस्ने लेखक ----- १\nप्रमाण पत्र नं ----- प्राप्त गरेकाे अदालत ----- ",
    footerText: "इति सम्वत् ----- साल ----- ----- गते राेज ----- शुभम् ।\n\n                                                                                     दायाँ                बायाँ"
};

function init() {
    if (sessionStorage.getItem(CONFIG.SESSION_KEY)) showMainContent();
}

function showMainContent() {
    dom.loginScreen.classList.add('hidden');
    dom.mainContent.classList.remove('hidden');
    renderEditableParagraphs();
    updateUIState('editing');
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

    dom.resetBtn.classList.toggle('hidden', !isEditing);
    dom.editBtn.classList.toggle('hidden', !isGenerated);
    dom.copyBtn.classList.toggle('hidden', !isGenerated);
    dom.printBtn.classList.toggle('hidden', !isGenerated);
}

function renderPart(templateText, targetElement, placeholderOffset) {
    targetElement.innerHTML = '';
    const parts = templateText.split('-----');
    const savedData = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];

    parts.forEach((part, index) => {
        if (part) targetElement.appendChild(document.createTextNode(part));
        if (index < parts.length - 1) {
            const placeholder = CONFIG.PLACEHOLDERS[index + placeholderOffset] || '';
            const wrapper = document.createElement('span');
            wrapper.className = 'input-wrapper';
            const input = document.createElement('input');
            input.placeholder = placeholder;
            input.value = savedData[index + placeholderOffset] || '';
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
    const mainInputs = renderPart(TEMPLATE_TEXTS.mainBodyText, dom.editableMainBody, 0);
    const witnessInputs = renderPart(TEMPLATE_TEXTS.witnessText, dom.editableWitnesses, mainInputs);
    renderPart(TEMPLATE_TEXTS.footerText, dom.editableFooter, mainInputs + witnessInputs);
}

function saveInputsToLocalStorage() {
    const allInputs = document.querySelectorAll('#editorContainer input');
    const data = Array.from(allInputs).map(input => input.value);
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
}

function clearInputs() {
    if (confirm("Are you sure you want to clear all fields? This cannot be undone.")) {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        renderEditableParagraphs();
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
    const mainText = getTextFromEditableArea(dom.editableMainBody);
    const witnessText = getTextFromEditableArea(dom.editableWitnesses);
    const footerText = getTextFromEditableArea(dom.editableFooter);
    return `${mainText}\n\n${witnessText}\n\n${footerText}`;
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
    typeText(dom.resultArea, fullText, () => {
        updateUIState('generated');
    });
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

function prepareFinalOutput() {
    const mainText = getTextFromEditableArea(dom.editableMainBody);
    const witnessText = getTextFromEditableArea(dom.editableWitnesses);
    const footerText = getTextFromEditableArea(dom.editableFooter);
    dom.outputWitnesses.innerText = witnessText;
    dom.outputMainBody.innerText = `${mainText}\n\n${footerText}`;
}

function handlePrint() {
    prepareFinalOutput();
    window.print();
}

function showModal(modal) { modal.classList.add('active'); }
function hideModal(modal) { modal.classList.remove('active'); }

function setupEventListeners() {
    dom.loginBtn.addEventListener('click', () => {
        if (dom.accessCodeInput.value.trim() === CONFIG.ACCESS_CODE) {
            sessionStorage.setItem(CONFIG.SESSION_KEY, 'true');
            showMainContent();
        } else {
            alert('Invalid Access Code');
        }
    });
    dom.accessCodeInput.addEventListener('keydown', (e) => { 
        if (e.key === 'Enter') dom.loginBtn.click(); 
    });
    
    dom.generateBtn.addEventListener('click', handleGenerate);
    dom.resetBtn.addEventListener('click', clearInputs);
    dom.editBtn.addEventListener('click', () => {
        updateUIState('editing');
    });
    dom.copyBtn.addEventListener('click', handleCopyToClipboard);
    dom.printBtn.addEventListener('click', handlePrint);
    
    dom.termsLink.addEventListener('click', () => showModal(dom.termsModal));
    dom.privacyLink.addEventListener('click', () => showModal(dom.privacyModal));
    dom.closeTerms.addEventListener('click', () => hideModal(dom.termsModal));
    dom.closePrivacy.addEventListener('click', () => hideModal(dom.privacyModal));

    dom.mainContent.addEventListener('input', saveInputsToLocalStorage);
}

setupEventListeners();
init();