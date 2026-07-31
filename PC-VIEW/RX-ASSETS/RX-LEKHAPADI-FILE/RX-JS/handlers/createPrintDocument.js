// handlers/createPrintDocument.js
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