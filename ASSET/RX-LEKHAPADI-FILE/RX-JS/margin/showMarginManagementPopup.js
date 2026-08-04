// margin/showMarginManagementPopup.js
function showMarginManagementPopup() {
    if (dom.settingsPopup) dom.settingsPopup.classList.remove('active');
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'marginModal';
    
    const pageKeys = TEMPLATE_SYSTEM ? Object.keys(TEMPLATE_SYSTEM.pages) : [];
    
    let tabsHTML = '';
    let contentHTML = '';
    
    pageKeys.forEach((pageKey, index) => {
        const pageNumber = index + 1;
        const activeClass = index === 0 ? 'active' : '';
        
        tabsHTML += `<button class="page-margin-tab ${activeClass}" data-page="${pageNumber}">पृष्ठ ${pageNumber}</button>`;
        
        const pageMargins = CONFIG.PAGE_MARGINS && CONFIG.PAGE_MARGINS[`page${pageNumber}`] ? 
            CONFIG.PAGE_MARGINS[`page${pageNumber}`] : { top: '1in', right: '1in', bottom: '1in', left: '1in' };
        
        contentHTML += `
            <div id="marginPage${pageNumber}" class="margin-page-content ${activeClass}">
                <h3 style="margin-bottom: 15px; color: var(--primary);">पृष्ठ ${pageNumber} - Margin Settings</h3>
                <div class="margin-control-group">
                    <div class="margin-control">
                        <label>Top Margin</label>
                        <input type="text" id="topMargin${pageNumber}" value="${pageMargins.top}" placeholder="e.g., 1in, 2cm">
                    </div>
                    <div class="margin-control">
                        <label>Right Margin</label>
                        <input type="text" id="rightMargin${pageNumber}" value="${pageMargins.right}" placeholder="e.g., 1in, 2cm">
                    </div>
                    <div class="margin-control">
                        <label>Bottom Margin</label>
                        <input type="text" id="bottomMargin${pageNumber}" value="${pageMargins.bottom}" placeholder="e.g., 1in, 2cm">
                    </div>
                    <div class="margin-control">
                        <label>Left Margin</label>
                        <input type="text" id="leftMargin${pageNumber}" value="${pageMargins.left}" placeholder="e.g., 1in, 2cm">
                    </div>
                </div>
                
                <div class="margin-presets">
                    ${generateMarginPresetButtons()}
                </div>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" id="closeMarginModal">&times;</button>
            <h2 class="modal-title">Page Margin Management</h2>
            
            <div class="page-margin-tabs">
                ${tabsHTML}
            </div>
            
            <div class="margin-pages-container">
                ${contentHTML}
            </div>
            
            <div class="margin-actions">
                <button class="btn btn-danger" id="cancelMarginBtn">Cancel</button>
                <button class="btn btn-success" id="saveMarginBtn">Save & Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.querySelectorAll('.page-margin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.page-margin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.margin-page-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`marginPage${this.dataset.page}`).classList.add('active');
        });
    });
    
    document.querySelectorAll('.margin-preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const activePage = document.querySelector('.page-margin-tab.active').dataset.page;
            applyMarginPreset(activePage, this.dataset.preset);
        });
    });
    
    document.getElementById('closeMarginModal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('cancelMarginBtn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('saveMarginBtn').addEventListener('click', savePageMargins);
}