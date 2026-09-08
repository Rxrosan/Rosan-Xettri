// ===== CONTENT CARDS DATABASE =====
const contentCards = [
    {   
        id: "file1", 
        title: "F1- LEKHAPADI ", 
        description: "ALL DOCUMENT COLLECTION FOR LEKHANDAS ONLY PLEASE DO NOT USE FOR MISSLEADING OR HARM OTHER PEOPLE USING THIS RESOURCE IF ANY LOSES OR DAMAGE THE RX STUDIO IS NOT RESPONSSIBLE. LOGIN PASSWORD : RX-2061", 
        link: "RX-LEKA-PADI.html?exam=file1", 
        icon: "fas fa-pencil",
        extraDetails: "This is a comprehensive document collection for LEKHAPADI preparation.\n• Includes all past papers\n• Study materials\n• Practice tests\n• Perfect for exam preparation"
    },
    {   
        id: "file2", 
        title: "F2- KOREAN EXAM PRACTICE - WEB-APP | COMBINE SETS ", 
        description: "You can practice exam every time auto generate new questions randomly.", 
        link: "RX-KR-EXAM.html", 
        icon: "fas fa-book",
        extraDetails: "Practice Korean exams with randomly generated questions from combined sets.\n• Covers all topics\n• Varying difficulty levels\n• Track your progress\n• Improve your score"
    },
    {   
        id: "file3", 
        title: "F3- QR SCANNER", 
        description: "Scan QR codes instantly", 
        link: "RX-S-QR.html?exam=file3", 
        icon: "fas fa-qrcode",
        extraDetails: "Quick and easy QR code scanner.\n• Supports all QR code formats\n• History tracking\n• Batch scanning features"
    },
    {   
        id: "file4", 
        title: "F4- TEXT TO IMAGE ", 
        description: "LOGIN PASSWORD = RX2061", 
        link: "RX-IMG-CONVERTER.html?exam=file4", 
        icon: "fas fa-pen",
        extraDetails: "Convert text to image with custom fonts, colors, and styles.\n• Multiple export formats\n• Batch conversion available\n• Customizable output"
    },
    
];

// ===== STORES =====
const stores = [
    {   id: "store_1", 
        name: "LEKHA-PADI", 
        content: ["file1"] 
    },
    {   id: "store_2", 
        name: "EPS-EXAM-QUESTION", 
        content: ["file2","file5"] 
    },
    {   id: "store_3", 
        name: "WEB-SOFTWARE", 
        content: ["file3", "file4"] 
    },
];

// ===== EXTRA DETAILS MODAL =====
const ExtraDetailsManager = {
    createModal() {
        if (document.getElementById('rx-extra-details-modal')) return;

        const modalHTML = `
            <div id="rx-extra-details-modal" class="rx-extra-modal" style="display: none;">
                <div class="rx-extra-modal-content">
                    <div class="rx-extra-modal-header">
                        <h2 id="rx-extra-modal-title">Extra Details</h2>
                        <span class="rx-extra-close" onclick="ExtraDetailsManager.closeModal()">&times;</span>
                    </div>
                    <div class="rx-extra-modal-body" id="rx-extra-modal-body">
                        <div id="rx-extra-details-content"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        if (!document.getElementById('extra-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'extra-modal-styles';
            style.textContent = `
                .rx-extra-modal {
                    display: none;
                    position: fixed;
                    z-index: 10001;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.6);
                    animation: fadeIn 0.3s ease;
                    justify-content: center;
                    align-items: center;
                }
                .rx-extra-modal-content {
                    background-color: #112240;
                    padding: 20px 24px 24px 24px;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 420px;
                    color: #e6f1ff;
                    animation: slideDown 0.3s ease;
                    border: 1px solid #1e3a5f;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    margin: auto;
                }
                @keyframes slideDown {
                    from { transform: translateY(-30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .rx-extra-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #1e3a5f;
                    padding-bottom: 10px;
                    margin-bottom: 12px;
                    flex-shrink: 0;
                }
                .rx-extra-modal-header h2 {
                    color: #e6f1ff;
                    font-size: 18px;
                    margin: 0;
                    font-weight: 700;
                }
                .rx-extra-close {
                    font-size: 28px;
                    cursor: pointer;
                    color: #8892b0;
                    transition: color 0.3s;
                    line-height: 1;
                    padding: 0 4px;
                }
                .rx-extra-close:hover {
                    color: #d10823;
                }
                .rx-extra-modal-body {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 4px;
                    max-height: 60vh;
                }
                .rx-extra-modal-body::-webkit-scrollbar {
                    width: 6px;
                }
                .rx-extra-modal-body::-webkit-scrollbar-track {
                    background: #0a192f;
                    border-radius: 3px;
                }
                .rx-extra-modal-body::-webkit-scrollbar-thumb {
                    background: #d10823;
                    border-radius: 3px;
                }
                .rx-extra-modal-body::-webkit-scrollbar-thumb:hover {
                    background: #ff1a3a;
                }
                #rx-extra-details-content {
                    color: #8892b0;
                    line-height: 1.7;
                    font-size: 14px;
                }
                #rx-extra-details-content .detail-icon {
                    font-size: 32px;
                    color: #d10823;
                    display: block;
                    margin-bottom: 10px;
                    text-align: center;
                }
                #rx-extra-details-content .detail-title {
                    font-size: 17px;
                    font-weight: 700;
                    color: #e6f1ff;
                    margin-bottom: 8px;
                    text-align: center;
                }
                #rx-extra-details-content .detail-description {
                    color: #8892b0;
                    font-size: 14px;
                    line-height: 1.7;
                    margin-bottom: 10px;
                }
                #rx-extra-details-content .detail-features {
                    margin-top: 10px;
                    padding: 10px 14px;
                    background: #0a192f;
                    border-radius: 6px;
                    border: 1px solid #1e3a5f;
                    list-style: none;
                    padding-left: 14px;
                }
                #rx-extra-details-content .detail-features li {
                    margin-bottom: 5px;
                    color: #8892b0;
                    font-size: 13px;
                    padding-left: 18px;
                    position: relative;
                    line-height: 1.6;
                }
                #rx-extra-details-content .detail-features li:before {
                    content: "•";
                    color: #d10823;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    font-size: 16px;
                }
                @media (max-width: 600px) {
                    .rx-extra-modal-content {
                        padding: 16px 18px 18px 18px;
                        max-width: 95%;
                        max-height: 85vh;
                    }
                    .rx-extra-modal-header h2 {
                        font-size: 16px;
                    }
                    .rx-extra-modal-body {
                        max-height: 55vh;
                    }
                    #rx-extra-details-content {
                        font-size: 13px;
                    }
                    #rx-extra-details-content .detail-title {
                        font-size: 16px;
                    }
                    #rx-extra-details-content .detail-icon {
                        font-size: 28px;
                    }
                    #rx-extra-details-content .detail-features li {
                        font-size: 12px;
                    }
                }
                @media (max-width: 400px) {
                    .rx-extra-modal-content {
                        padding: 12px 14px 14px 14px;
                        max-width: 98%;
                    }
                    .rx-extra-modal-header h2 {
                        font-size: 15px;
                    }
                    .rx-extra-modal-body {
                        max-height: 50vh;
                    }
                    #rx-extra-details-content {
                        font-size: 12px;
                    }
                    #rx-extra-details-content .detail-title {
                        font-size: 15px;
                    }
                    #rx-extra-details-content .detail-features li {
                        font-size: 12px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },

    showModal(cardId) {
        this.createModal();
        const card = contentCards.find(c => c.id === cardId);
        if (!card) return;

        const content = document.getElementById('rx-extra-details-content');
        if (!content) return;

        let featuresHtml = '';
        if (card.extraDetails) {
            const lines = card.extraDetails.split('\n').filter(line => line.trim());
            if (lines.length > 1) {
                featuresHtml = `
                    <ul class="detail-features">
                        ${lines.map(line => `<li>${line.trim()}</li>`).join('')}
                    </ul>
                `;
            } else {
                featuresHtml = `<p class="detail-description">${card.extraDetails}</p>`;
            }
        }

        content.innerHTML = `
            <div class="detail-icon">
                <i class="${card.icon || 'fas fa-file'}"></i>
            </div>
            <div class="detail-title">${card.title}</div>
            <p class="detail-description">${card.description || ''}</p>
            ${featuresHtml}
        `;

        document.getElementById('rx-extra-modal-title').textContent = 'Details:';
        const modal = document.getElementById('rx-extra-details-modal');
        modal.style.display = 'flex';
        
        const body = document.getElementById('rx-extra-modal-body');
        if (body) body.scrollTop = 0;
    },

    closeModal() {
        const modal = document.getElementById('rx-extra-details-modal');
        if (modal) modal.style.display = 'none';
    }
};

// ===== STORE MANAGEMENT MODULE =====
const StoreManager = {
    currentStoreId: stores.length > 0 ? stores[0].id : null,

    renderStoreNavigation() {
        const navContainer = document.getElementById('storeNavigation');
        if (!navContainer) return;
        
        navContainer.innerHTML = '';
        stores.forEach(store => {
            const button = document.createElement('button');
            button.className = `store-btn ${store.id === this.currentStoreId ? 'active' : ''}`;
            button.textContent = store.name;
            button.onclick = () => this.switchStore(store.id);
            navContainer.appendChild(button);
        });
    },

    switchStore(storeId) {
        this.currentStoreId = storeId;
        const store = stores.find(s => s.id === storeId);
        if (store) {
            const storeTitle = document.getElementById('storeTitle');
            if (storeTitle) storeTitle.innerHTML = `<span>${store.name}</span>`;
            this.renderStoreNavigation();
            this.renderContentCards();
        }
    },

    renderContentCards() {
        const cardsContainer = document.getElementById('contentCards');
        if (!cardsContainer) return;

        cardsContainer.innerHTML = '';
        const store = stores.find(s => s.id === this.currentStoreId);
        if (!store) {
            cardsContainer.innerHTML = '<p style="text-align: center; color: #8892b0;">No store selected</p>';
            return;
        }
        
        const storeContent = contentCards.filter(card => store.content.includes(card.id));

        if (storeContent.length === 0) {
            cardsContainer.innerHTML = '<p style="text-align: center; color: #8892b0; padding: 40px;">No content available in this store</p>';
            return;
        }

        storeContent.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            
            cardElement.innerHTML = `
                <div class="card-header">
                    <div class="card-header-left">
                        <i class="${card.icon || 'fas fa-file'} card-icon"></i>
                        <button class="extra-details-btn" onclick="ExtraDetailsManager.showModal('${card.id}')" title="View Extra Details">
                            <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                </div>
                <h3>${card.title}</h3>
                <p class="card-description">${card.description || ''}</p>
                <div class="card-actions">
                    <a href="${card.link}" class="open-btn"><i class="fas fa-external-link-alt"></i> Open</a>
                </div>
            `;
            cardsContainer.appendChild(cardElement);
        });
    },

    initializeStores() {
        this.renderStoreNavigation();
        const store = stores.find(s => s.id === this.currentStoreId);
        if (store) {
            const storeTitle = document.getElementById('storeTitle');
            if (storeTitle) storeTitle.innerHTML = `<span>${store.name}</span>`;
        }
        this.renderContentCards();
    }
};

// ===== RESOURCE PAGE LOADER =====
function rxLoadResourcePage(rxDisplayArea) {
    console.log("Loading Resource Page...");
    
    let container = rxDisplayArea;
    if (!container) {
        container = document.getElementById('rx-resource-container');
    }
    
    if (!container) {
        console.error("Resource container not found!");
        return;
    }

    if (rxDisplayArea) {
        rxDisplayArea.innerHTML = `
            <div id="rx-resource-container" style="width:100%;">
                <div class="rx-resource-header">
                    <h2>Resources & Assets</h2>
                </div>
                <div id="storeNavigation" class="store-navigation"></div>
                <h3 id="storeTitle" class="store-title"><span>----</span></h3>
                <div id="contentCards" class="content-cards">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner"></i>
                        <p>Loading resources...</p>
                    </div>
                </div>
            </div>
            <button id="scroll-to-top" class="floating-btn hidden" onclick="window.scrollTo({top:0,behavior:'smooth'})">
                <i class="fas fa-arrow-up"></i>
            </button>
        `;
    }

    try {
        StoreManager.initializeStores();
        console.log("Resources loaded successfully!");
        setupScrollButton();
    } catch (error) {
        console.error("Error initializing stores:", error);
    }
}

function setupScrollButton() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;
    
    const handler = function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.remove('hidden');
        } else {
            scrollBtn.classList.add('hidden');
        }
    };
    
    window.removeEventListener('scroll', handler);
    window.addEventListener('scroll', handler);
    handler();
}

// ===== EXPOSE GLOBALLY =====
window.StoreManager = StoreManager;
window.ExtraDetailsManager = ExtraDetailsManager;
window.contentCards = contentCards;
window.stores = stores;
window.rxLoadResourcePage = rxLoadResourcePage;

// ===== AUTO-INITIALIZE =====
(function() {
    function initResourcePage() {
        const container = document.getElementById('rx-resource-container');
        if (!container) return;
        
        if (container.dataset.initialized === 'true') return;
        container.dataset.initialized = 'true';
        
        console.log("Auto-initializing Resource page...");
        
        try {
            StoreManager.initializeStores();
            console.log("Resources loaded successfully!");
            setupScrollButton();
        } catch (error) {
            console.error("Error initializing stores:", error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResourcePage);
    } else {
        initResourcePage();
    }
})();

console.log('RX-RESOURCE.js - loaded (simplified version)');