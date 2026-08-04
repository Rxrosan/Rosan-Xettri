// animation/typeText.js
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