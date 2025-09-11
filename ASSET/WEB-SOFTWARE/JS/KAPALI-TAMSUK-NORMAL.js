 const { jsPDF } = window.jspdf;

    const dom = {
        loginScreen: document.getElementById('loginScreen'), mainContent: document.getElementById('mainContent'),
        accessCodeInput: document.getElementById('accessCodeInput'), loginBtn: document.getElementById('loginBtn'),
        loginError: document.getElementById('loginError'), sourceText: document.getElementById('sourceText'),
        editableParagraph: document.getElementById('editableParagraph'), resultDiv: document.getElementById('result'),
        generateBtn: document.getElementById('generateBtn'), editBtn: document.getElementById('editBtn'),
        copyBtn: document.getElementById('copyBtn'), printBtn: document.getElementById('printBtn'),
        downloadBtn: document.getElementById('downloadBtn'), copyNotification: document.getElementById('copyNotification'),
        loader: document.getElementById('loader'), termsLink: document.getElementById('termsLink'),
        privacyLink: document.getElementById('privacyLink'), termsModal: document.getElementById('termsModal'),
        privacyModal: document.getElementById('privacyModal'), closeTerms: document.getElementById('closeTerms'),
        closePrivacy: document.getElementById('closePrivacy'),
    };

    const CONFIG = {
        ACCESS_CODE: 'RX-2061',
        PLACEHOLDERS: ["धनीको जिल्लाकाे नाम","नपा वा गापाकाे नाम", "धनीको वडा नं", "धनीको उमेर", "धनीको हजुरबुबाकाे नाम", "धनीको बुबाकाे नाम", "छाेरा वा छाेरी", "धनीकाे पुरा नाम", "ऋणीकाे जिल्लाकाे नाम","नपा वा गापाकाे नाम", "ऋणीको वडा नं.", "ऋणीको उमेर", "ऋणीको हजुरबुबाकाे नाम","ऋणीको बुबाकाे नाम", "छाेरा वा छाेरी","ऋणीको पुरा नाम", "रकम अंकमा", "रकम अक्षरमा", "१० प्रतिशत भन्दा कम", "पुरा भाखा मिति", "तमसुक लेखिएको साल", "नेपाली महिना", "नेपाली गते", "रोज बार संख्या"],
        SESSION_KEY: 'fillBlankAuth', TYPING_SPEED: 20,
    };

    function init() {
        if (sessionStorage.getItem(CONFIG.SESSION_KEY)) showMainContent();
        else dom.accessCodeInput.focus();
    }

    function showMainContent() {
        dom.loginScreen.classList.add('hidden');
        dom.mainContent.classList.remove('hidden');
        renderEditableParagraph();
        updateUIState('editing');
    }

    function updateUIState(state) {
        const isEditing = state === 'editing';
        dom.editableParagraph.classList.toggle('hidden', !isEditing);
        dom.resultDiv.classList.toggle('hidden', isEditing);
        if (isEditing) dom.resultDiv.innerHTML = '';
        dom.generateBtn.classList.toggle('hidden', !isEditing);
        [dom.editBtn, dom.copyBtn, dom.printBtn, dom.downloadBtn].forEach(btn => btn.classList.toggle('hidden', isEditing));
    }

    function renderEditableParagraph() {
        dom.editableParagraph.innerHTML = '';
        const parts = dom.sourceText.value.split('-----');
        parts.forEach((part, index) => {
            if (part) dom.editableParagraph.appendChild(document.createTextNode(part));
            if (index < parts.length - 1) {
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = CONFIG.PLACEHOLDERS[index] || 'यहाँ भर्नुहोस्';
                input.classList.add('blank-input');
                dom.editableParagraph.appendChild(input);
            }
        });
    }

    async function generateFinal() {
        dom.generateBtn.disabled = true; dom.generateBtn.textContent = 'RX STUDIO GENERATING DOCUMENT PLEASE WAIT...';
        let finalText = ''; let inputIndex = 0;
        dom.editableParagraph.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) finalText += node.textContent;
            else if (node.tagName === 'INPUT') {
                finalText += node.value.trim() || `[${CONFIG.PLACEHOLDERS[inputIndex] || 'खाली'}]`;
                inputIndex++;
            }
        });
        dom.editableParagraph.classList.add('hidden');
        dom.resultDiv.classList.remove('hidden');
        dom.resultDiv.innerHTML = '';
        await typeText(dom.resultDiv, finalText);
        updateUIState('generated');
        dom.generateBtn.disabled = false; dom.generateBtn.textContent = 'Generate Text';
    }

    function typeText(element, text) {
        return new Promise(resolve => {
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
                    resolve();
                }
            }, CONFIG.TYPING_SPEED);
        });
    }

    function handlePrint() { window.print(); }

    async function handleDownloadPdf() {
        dom.loader.classList.remove('hidden');
        const printableContent = document.createElement('div');
        try {
            const printableWidth = 8.27 - 2 - 1; // A4 width minus L/R margins
            Object.assign(printableContent.style, {
                position: 'absolute', left: '-9999px', top: '0', padding: '0', margin: '0',
                fontFamily: "'Times New Roman', serif", fontSize: '12pt', color: 'black',
                textAlign: 'justify', whiteSpace: 'pre-wrap', width: `${printableWidth}in`
            });
            printableContent.textContent = dom.resultDiv.textContent;
            document.body.appendChild(printableContent);
            const canvas = await html2canvas(printableContent, { scale: 2, useCORS: true, backgroundColor: null });
            document.body.removeChild(printableContent);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'p', unit: 'in', format: 'a4' });
            const imgProps = pdf.getImageProperties(imgData);
            const pdfImgWidth = pdf.internal.pageSize.getWidth() - 2 - 1;
            const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 2, 3, pdfImgWidth, pdfImgHeight);
            pdf.save('RX-STUDIO-GENERATED-DOCUMENT-KAPALI-TAMSUK.pdf');
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            showNotification('Error generating PDF.', true);
            if (document.body.contains(printableContent)) document.body.removeChild(printableContent);
        } finally {
            dom.loader.classList.add('hidden');
        }
    }

    function copyResult() {
        navigator.clipboard.writeText(dom.resultDiv.textContent)
            .then(() => showNotification('Copied to clipboard!'))
            .catch(() => showNotification('Could not copy text.', true));
    }

    function showNotification(message, isError = false) {
        dom.copyNotification.textContent = message;
        dom.copyNotification.style.background = isError ? 'var(--error)' : 'var(--success)';
        dom.copyNotification.classList.add('show');
        setTimeout(() => dom.copyNotification.classList.remove('show'), 3000);
    }

    function showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // --- Event Listeners ---
    dom.loginBtn.addEventListener('click', () => {
        if (dom.accessCodeInput.value.trim() === CONFIG.ACCESS_CODE) {
            sessionStorage.setItem(CONFIG.SESSION_KEY, 'true');
            showMainContent();
        } else dom.loginError.textContent = 'Incorrect access code.';
    });
    dom.accessCodeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') dom.loginBtn.click(); });
    dom.generateBtn.addEventListener('click', generateFinal);
    dom.editBtn.addEventListener('click', () => updateUIState('editing'));
    dom.copyBtn.addEventListener('click', copyResult);
    dom.printBtn.addEventListener('click', handlePrint);
    dom.downloadBtn.addEventListener('click', handleDownloadPdf);
    
    // Modal Listeners
    dom.termsLink.addEventListener('click', () => showModal(dom.termsModal));
    dom.privacyLink.addEventListener('click', () => showModal(dom.privacyModal));
    dom.closeTerms.addEventListener('click', () => hideModal(dom.termsModal));
    dom.closePrivacy.addEventListener('click', () => hideModal(dom.privacyModal));
    
    init();