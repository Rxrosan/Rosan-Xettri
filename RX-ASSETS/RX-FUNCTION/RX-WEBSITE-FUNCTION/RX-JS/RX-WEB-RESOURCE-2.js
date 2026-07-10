// Auto-sense user login and initialize stores
        document.addEventListener('DOMContentLoaded', function() {
            const scrollBtn = document.getElementById('scroll-to-top');
            
            // Check if user is logged in
            const currentUser = localStorage.getItem('currentUser');
            
            if (currentUser) {
                document.body.classList.add('logged-in');
                document.body.classList.remove('logged-out');
                
                // Initialize stores using StoreManager from user.js
                if (typeof StoreManager !== 'undefined') {
                    StoreManager.initializeStores();
                    StoreManager.renderStoreNavigation();
                    StoreManager.renderContentCards();
                }
            } else {
                document.body.classList.add('logged-out');
                document.body.classList.remove('logged-in');
            }
            
            // Scroll to top
            window.addEventListener('scroll', function() {
                scrollBtn.classList.toggle('hidden', window.scrollY <= 300);
            });
            
            scrollBtn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Side panel
            const menuToggle = document.getElementById('menuToggle');
            const closePanel = document.getElementById('closePanel');
            const panelOverlay = document.getElementById('panelOverlay');
            const sidePanel = document.getElementById('sidePanel');
            
            if (menuToggle) {
                menuToggle.addEventListener('click', function() {
                    sidePanel.classList.add('active');
                    panelOverlay.classList.add('active');
                });
            }
            
            if (closePanel) {
                closePanel.addEventListener('click', function() {
                    sidePanel.classList.remove('active');
                    panelOverlay.classList.remove('active');
                });
            }
            
            if (panelOverlay) {
                panelOverlay.addEventListener('click', function() {
                    sidePanel.classList.remove('active');
                    panelOverlay.classList.remove('active');
                });
            }
        });