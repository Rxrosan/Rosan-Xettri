// handlers/handleGenerate.js
function handleGenerate() {
    saveInputsToLocalStorage();
    const fullText = getFullGeneratedText();
    updateUIState('typing');

    if (CONFIG.WRITING_ANIMATION_ENABLED && dom.resultArea) {
        typeText(dom.resultArea, fullText, () => {
            updateUIState('generated');
            if (dom.progressBar) dom.progressBar.style.width = '0%';
        });
    } else {
        if (dom.resultArea) {
            dom.resultArea.innerText = fullText;
        }
        updateUIState('generated');
        if (dom.progressBar) {
            dom.progressBar.style.width = '100%';
            setTimeout(() => {
                if (dom.progressBar) dom.progressBar.style.width = '0%';
            }, 300);
        }
    }
}