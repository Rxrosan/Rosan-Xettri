// margin/savePageMargins.js
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