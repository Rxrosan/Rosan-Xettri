// ui/updateUIState.js
function updateUIState(state) {
    const isEditing = state === 'editing';
    const isGenerated = state === 'generated';
    const isTyping = state === 'typing';

    if (dom.editorContainer) {
        dom.editorContainer.classList.toggle('hidden', !isEditing);
    }

    if (dom.resultArea) {
        dom.resultArea.classList.toggle('hidden', isEditing);
    }

    if (dom.generateBtn) {
        dom.generateBtn.classList.toggle('hidden', !isEditing);
        dom.generateBtn.classList.toggle('loading', isTyping);
        dom.generateBtn.disabled = isTyping;
    }

    if (dom.printBtn) dom.printBtn.classList.toggle('hidden', !isGenerated);
    if (dom.resetBtn) dom.resetBtn.classList.toggle('hidden', !isEditing);
    if (dom.editBtn) dom.editBtn.classList.toggle('hidden', !isGenerated);
    if (dom.copyBtn) dom.copyBtn.classList.toggle('hidden', !isGenerated);
    if (dom.shareBtn) dom.shareBtn.classList.toggle('hidden', !isGenerated);

    if (dom.statusIndicator && dom.statusText) {
        dom.statusIndicator.className = 'status-indicator';
        if (isEditing) {
            dom.statusIndicator.classList.add('status-editing');
            dom.statusText.textContent = 'Editing Mode';
        } else if (isTyping) {
            dom.statusIndicator.classList.add('status-typing');
            dom.statusText.textContent = 'Generating...';
        } else if (isGenerated) {
            dom.statusIndicator.classList.add('status-generated');
            dom.statusText.textContent = 'Generated';
        }
    }
}