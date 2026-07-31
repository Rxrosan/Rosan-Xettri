// template/showTemplateSelectionPopup.js
function showTemplateSelectionPopup() {
    if (dom.settingsPopup) dom.settingsPopup.classList.remove('active');
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'templateModal';
    
    let templatesHTML = '';
    
    for (const [key, template] of Object.entries(TEMPLATE_COLLECTION)) {
        const isSelected = localStorage.getItem(CONFIG.TEMPLATE_KEY) === key;
        templatesHTML += `
            <div class="template-item ${isSelected ? 'selected' : ''}" data-template-id="${key}">
                <div class="template-name">${template.name}</div>
                ${isSelected ? '<span class="selected-badge">✓ Current</span>' : ''}
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" id="closeTemplateModal">&times;</button>
            <h2 class="modal-title">RX STUDIO DOCUMENT'S COLLECTION</h2>
            <p class="modal-subtitle">Select document & click apply button.</p>
            
            <div class="template-list">
                ${templatesHTML}
            </div>
            
            <div class="margin-actions">
                <button class="btn btn-danger" id="cancelTemplateBtn">Cancel</button>
                <button class="btn btn-success" id="applyTemplateBtn">Apply</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    let selectedTemplateId = null;
    
    document.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.template-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedTemplateId = this.dataset.templateId;
        });
    });
    
    document.getElementById('closeTemplateModal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('cancelTemplateBtn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('applyTemplateBtn').addEventListener('click', () => {
        if (!selectedTemplateId) {
            alert('Please select a template first.');
            return;
        }
        
        if (confirm('Are you sure you want to change template? All current data will be cleared.')) {
            localStorage.setItem(CONFIG.TEMPLATE_KEY, selectedTemplateId);
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            
            document.body.removeChild(modal);
            
            showTemplateChangeNotification(selectedTemplateId);
        }
    });
}