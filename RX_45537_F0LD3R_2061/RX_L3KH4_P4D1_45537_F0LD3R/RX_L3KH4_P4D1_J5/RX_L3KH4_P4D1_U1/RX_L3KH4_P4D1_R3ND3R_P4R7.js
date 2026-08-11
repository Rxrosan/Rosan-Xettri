// ui/renderPart.js
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