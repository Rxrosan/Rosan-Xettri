// ui/showMainContent.js
function showMainContent() {
    if (dom.loginScreen) dom.loginScreen.classList.add('hidden');
    if (dom.mainContent) dom.mainContent.classList.remove('hidden');
    
    createEditorStructure();
    
    setTimeout(() => {
        renderEditableParagraphs();
        updateUIState('editing');
        initInputHover();
    }, 50);
}