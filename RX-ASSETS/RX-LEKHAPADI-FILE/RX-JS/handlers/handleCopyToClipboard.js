// handlers/handleCopyToClipboard.js
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