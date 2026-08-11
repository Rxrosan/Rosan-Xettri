// data/getFullGeneratedText.js
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