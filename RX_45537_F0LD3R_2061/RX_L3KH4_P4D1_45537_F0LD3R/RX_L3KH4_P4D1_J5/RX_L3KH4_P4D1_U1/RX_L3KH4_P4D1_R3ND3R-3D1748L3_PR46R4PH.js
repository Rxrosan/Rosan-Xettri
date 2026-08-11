// ui/renderEditableParagraphs.js
function renderEditableParagraphs() {
    if (!TEMPLATE_SYSTEM) return;
    
    const mainColumn = document.querySelector('.editor-main-column');
    if (!mainColumn) return;
    
    const pageKeys = Object.keys(TEMPLATE_SYSTEM.pages);
    
    mainColumn.innerHTML = '';
    
    const pageTabs = document.createElement('div');
    pageTabs.className = 'page-tabs';
    
    pageKeys.forEach((pageKey, index) => {
        const pageNumber = index + 1;
        const activeClass = index === 0 ? 'active' : '';
        pageTabs.innerHTML += `<button class="page-tab ${activeClass}" data-page="${pageNumber}">पृष्ठ ${pageNumber}</button>`;
    });
    
    mainColumn.appendChild(pageTabs);

    const pageContainer = document.createElement('div');
    pageContainer.className = 'page-container';
    
    pageKeys.forEach((pageKey, index) => {
        const pageNumber = index + 1;
        const pageData = TEMPLATE_SYSTEM.pages[pageKey];
        const activeClass = index === 0 ? 'active' : '';
        pageContainer.innerHTML += `
            <div id="page${pageNumber}" class="page-content ${activeClass}">
                <div class="section-title">${pageData.title}</div>
                <div class="editable-area" id="editablePage${pageNumber}"></div>
            </div>
        `;
    });
    
    mainColumn.appendChild(pageContainer);

    let totalInputsSoFar = 0;
    
    pageKeys.forEach((pageKey, index) => {
        const pageNumber = index + 1;
        const pageData = TEMPLATE_SYSTEM.pages[pageKey];
        const pageElement = document.getElementById(`editablePage${pageNumber}`);
        
        if (pageElement) {
            const inputsCount = renderPart(
                pageData.template, 
                pageElement, 
                totalInputsSoFar, 
                pageData.placeholders
            );
            totalInputsSoFar += inputsCount;
        }
    });

    if (dom.editableWitnesses && TEMPLATE_SYSTEM.witness) {
        renderPart(
            TEMPLATE_SYSTEM.witness.template, 
            dom.editableWitnesses, 
            totalInputsSoFar, 
            TEMPLATE_SYSTEM.witness.placeholders
        );
    }

    document.querySelectorAll('.page-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.page-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const pageId = `page${this.dataset.page}`;
            const pageElement = document.getElementById(pageId);
            if (pageElement) pageElement.classList.add('active');
        });
    });
}