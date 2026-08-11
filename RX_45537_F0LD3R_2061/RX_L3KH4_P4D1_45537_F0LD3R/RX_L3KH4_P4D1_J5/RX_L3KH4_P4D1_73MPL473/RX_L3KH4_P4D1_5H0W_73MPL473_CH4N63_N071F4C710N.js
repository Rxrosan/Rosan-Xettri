// template/showTemplateChangeNotification.js
function showTemplateChangeNotification(templateId) {
    const template = TEMPLATE_COLLECTION[templateId];
    
    const notification = document.createElement('div');
    notification.className = 'template-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon"></div>
            <div class="notification-message">
                <strong>Template Changed!</strong>
                <p>New template: ${template.name}</p>
                <p>The page will refresh to load the new template.</p>
            </div>
            <div class="notification-actions">
                <button class="btn btn-success" id="refreshNowBtn">Refresh Now</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .template-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--card-bg);
                border: 2px solid var(--primary);
                border-radius: var(--radius);
                padding: 20px;
                box-shadow: var(--shadow);
                z-index: 5000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .notification-icon {
                font-size: 40px;
            }
            
            .notification-message {
                flex: 1;
            }
            
            .notification-message strong {
                color: var(--primary);
                display: block;
                margin-bottom: 5px;
            }
            
            .notification-message p {
                margin: 2px 0;
                font-size: 14px;
            }
            
            .notification-actions .btn {
                padding: 8px 15px;
                font-size: 14px;
                white-space: nowrap;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.getElementById('refreshNowBtn').addEventListener('click', () => {
        location.reload();
    });
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            location.reload();
        }
    }, 3000);
}