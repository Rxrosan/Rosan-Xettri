// margin/applyPageMarginsToPrint.js
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