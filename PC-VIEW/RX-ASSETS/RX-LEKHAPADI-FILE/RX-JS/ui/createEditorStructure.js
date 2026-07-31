// ui/createEditorStructure.js
function createEditorStructure() {
    if (!dom.editorContainer) return;
    
    dom.editorContainer.innerHTML = '';
    
    const editorDiv = document.createElement('div');
    editorDiv.className = 'editor-container';
    
    const witnessColumn = document.createElement('div');
    witnessColumn.className = 'editor-witness-column';
    witnessColumn.innerHTML = `
        <div class="section-title">
        साक्षी विवरण
        </div>
        <div class="editable-area" id="editableWitnesses" style="min-height: 400px;"></div>
    `;
    
    const mainColumn = document.createElement('div');
    mainColumn.className = 'editor-main-column';
    
    editorDiv.appendChild(witnessColumn);
    editorDiv.appendChild(mainColumn);
    
    dom.editorContainer.appendChild(editorDiv);
    
    dom.editableWitnesses = document.getElementById('editableWitnesses');
}