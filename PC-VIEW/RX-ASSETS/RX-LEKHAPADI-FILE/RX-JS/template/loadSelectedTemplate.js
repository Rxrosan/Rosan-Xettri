// template/loadSelectedTemplate.js
function loadSelectedTemplate() {
    const savedTemplateId = localStorage.getItem(CONFIG.TEMPLATE_KEY);
    
    if (savedTemplateId && TEMPLATE_COLLECTION && TEMPLATE_COLLECTION[savedTemplateId]) {
        TEMPLATE_SYSTEM = JSON.parse(JSON.stringify(TEMPLATE_COLLECTION[savedTemplateId]));
    } else if (TEMPLATE_COLLECTION) {
        const firstTemplateId = Object.keys(TEMPLATE_COLLECTION)[0];
        TEMPLATE_SYSTEM = JSON.parse(JSON.stringify(TEMPLATE_COLLECTION[firstTemplateId]));
        localStorage.setItem(CONFIG.TEMPLATE_KEY, firstTemplateId);
    }
}