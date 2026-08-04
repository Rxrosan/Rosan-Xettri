// data/getTextFromEditableArea.js
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