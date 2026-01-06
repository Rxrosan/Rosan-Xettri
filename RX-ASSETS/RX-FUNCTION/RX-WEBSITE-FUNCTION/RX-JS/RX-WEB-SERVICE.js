// Services System - Flexible and Dynamic
document.addEventListener('DOMContentLoaded', function() {
    
    // ======================
    // SERVICE DATABASE
    // ======================
    const servicesDatabase = {
        tabs: [
            {
                id: "graphic",
                title: "Graphic Design",
                icon: "fas fa-paint-brush",
                description: "Professional graphic design solutions for branding, marketing, and visual communication.",
                card: {
                    title: "Graphic Design Services",
                    description: "Create stunning visual designs for your brand and marketing needs.",
                    features: [
                        "Logo & Brand Identity Design",
                        "Marketing Materials (Brochures, Flyers, Banners)",
                        "Social Media Graphics & Templates",
                        "Packaging & Label Design",
                        "Business Stationery Design"
                    ]
                }
            },
            {
                id: "Lekhapadi",
                title: "Lekhapadi",
                icon: "fas fa-pen-fancy",
                description: "Professional writing and content creation for various needs and platforms.",
                card: {
                    title: "Lekha-padi ",
                    description: "High-quality writing services for all your content needs.",
                    features: [
                        "Content Writing & Blog Posts",
                        "Technical Documentation",
                        "Copywriting for Marketing",
                        "Translation Services (English/Nepali)",
                        "Proofreading & Editing"
                    ]
                }
            },
            {
                id: "eps",
                title: "EPS Exam",
                icon: "fas fa-graduation-cap",
                description: "Comprehensive preparation for EPS-TOPIK Korean language examination.",
                card: {
                    title: "EPS Exam Preparation",
                    description: "Complete guidance and materials for EPS-TOPIK exam success.",
                    features: [
                        "Study Materials & Practice Tests",
                        "Online Classes & Tutorials",
                        "Vocabulary & Grammar Guides",
                        "Mock Tests & Evaluation",
                        "Application Process Guidance"
                    ]
                }
            },
            {
                id: "web",
                title: "Web Development",
                icon: "fas fa-code",
                description: "Custom web solutions from simple websites to complex web applications.",
                card: {
                    title: "Web & Software Development",
                    description: "Build powerful web solutions for your business needs.",
                    features: [
                        "Website Development & Design",
                        "E-commerce Solutions",
                        "Web Applications",
                        "Mobile Responsive Design",
                        "Maintenance & Support"
                    ]
                }
            },
            {
                id: "consulting",
                title: "Consulting",
                icon: "fas fa-briefcase",
                description: "Strategic consulting services to help grow your business.",
                card: {
                    title: "Business Consulting",
                    description: "Expert guidance for business growth and digital transformation.",
                    features: [
                        "Business Strategy & Planning",
                        "Digital Transformation",
                        "Startup Consulting",
                        "Market Research & Analysis",
                        "Process Optimization"
                    ]
                }
            }
        ]
    };

    // ======================
    // ELEMENTS
    // ======================
    const tabNav = document.querySelector('.services-tab-nav');
    const tabContent = document.querySelector('.services-tab-content');

    // ======================
    // GENERATE TABS
    // ======================
    function generateTabs() {
        // Clear existing tabs
        tabNav.innerHTML = '';
        tabContent.innerHTML = '';

        // Generate tab buttons
        servicesDatabase.tabs.forEach((tab, index) => {
            // Create tab button
            const tabBtn = document.createElement('button');
            tabBtn.className = `service-tab-btn ${index === 0 ? 'active' : ''}`;
            tabBtn.setAttribute('data-tab', tab.id);
            tabBtn.innerHTML = `
                <i class="${tab.icon}"></i>
                <span>${tab.title}</span>
            `;
            tabNav.appendChild(tabBtn);

            // Create tab content
            const tabPane = document.createElement('div');
            tabPane.className = `service-tab-pane ${index === 0 ? 'active' : ''}`;
            tabPane.id = `${tab.id}-tab`;
            
            tabPane.innerHTML = `
                <div class="tab-header">
                    <div class="tab-icon">
                        <i class="${tab.icon}"></i>
                    </div>
                    <h3>${tab.card.title}</h3>
                </div>
                <p class="tab-description">${tab.description}</p>
                
                <div class="single-service-card">
                    <div class="service-card-content">
                        <div class="service-icon">
                            <i class="${tab.icon}"></i>
                        </div>
                        <h4>${tab.card.title}</h4>
                        <p>${tab.card.description}</p>
                        
                        <div class="service-features-section">
                            <h5>What We Offer:</h5>
                            <ul class="service-features">
                                ${tab.card.features.map(feature => `
                                    <li><i class="fas fa-check"></i> ${feature}</li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <button class="enquire-btn" data-service="${tab.card.title}">
                            <i class="fas fa-envelope"></i> Enquire About ${tab.title}
                        </button>
                    </div>
                </div>
            `;
            tabContent.appendChild(tabPane);
        });

        // Re-initialize event listeners
        initializeTabSystem();
        initializeEnquirySystem();
    }

    // ======================
    // TAB SYSTEM
    // ======================
    function initializeTabSystem() {
        const tabButtons = document.querySelectorAll('.service-tab-btn');
        const tabPanes = document.querySelectorAll('.service-tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                const activePane = document.getElementById(`${tabId}-tab`);
                if (activePane) {
                    activePane.classList.add('active');
                }
            });
        });
    }

    // ======================
    // ENQUIRY SYSTEM
    // ======================
    function initializeEnquirySystem() {
        const enquiryButtons = document.querySelectorAll('.enquire-btn');
        
        enquiryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const serviceName = this.getAttribute('data-service');
                openEnquiryModal(serviceName);
            });
        });
    }

    function openEnquiryModal(serviceName) {
        // Get user data from profile system
        let userData = null;
        
        // Try to get from RX Profile System
        if (typeof currentUser !== 'undefined' && currentUser) {
            if (typeof userDatabase !== 'undefined') {
                userData = userDatabase.find(u => u.email === currentUser);
            }
        }
        
        // Try localStorage as fallback
        if (!userData) {
            try {
                const saved = localStorage.getItem('rx_profile_system');
                if (saved) {
                    const data = JSON.parse(saved);
                    if (data && data.email && typeof userDatabase !== 'undefined') {
                        userData = userDatabase.find(u => u.email === data.email);
                    }
                }
            } catch (e) {
                console.log('Could not load user data:', e);
            }
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'service-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Enquire About: ${serviceName}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form class="enquiry-form" id="serviceEnquiryForm">
                        <div class="form-group">
                            <label>Service Name</label>
                            <input type="text" value="${serviceName}" readonly>
                        </div>
                        
                        <div class="form-group">
                            <label>Your Name *</label>
                            <input type="text" id="enquiryName" placeholder="Enter your name" required 
                                value="${userData ? userData.username : ''}">
                        </div>
                        
                        <div class="form-group">
                            <label>Email Address *</label>
                            <input type="email" id="enquiryEmail" placeholder="Enter your email" required
                                value="${userData ? userData.email : ''}">
                        </div>
                        
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" id="enquiryPhone" placeholder="Enter your phone number"
                                value="${userData ? userData.phone : ''}">
                        </div>
                        
                        <div class="form-group">
                            <label>Your Message *</label>
                            <textarea id="enquiryMessage" placeholder="Tell us about your requirements..." rows="5" required></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-paper-plane"></i> Send Enquiry
                            </button>
                            <button type="button" class="cancel-btn">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
            // Focus on first input
            const nameInput = document.getElementById('enquiryName');
            if (nameInput && !nameInput.value) {
                nameInput.focus();
            }
        }, 10);
        
        // Close modal events
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        const cancelBtn = modal.querySelector('.cancel-btn');
        
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
        
        // Form submission
        const form = document.getElementById('serviceEnquiryForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                service: serviceName,
                name: document.getElementById('enquiryName').value.trim(),
                email: document.getElementById('enquiryEmail').value.trim(),
                phone: document.getElementById('enquiryPhone').value.trim(),
                message: document.getElementById('enquiryMessage').value.trim(),
                timestamp: new Date().toISOString()
            };
            
            // Validate
            if (!formData.name || !formData.email || !formData.message) {
                showFormError('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormError('Please enter a valid email address.');
                return;
            }
            
            // Show loading
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                console.log('Enquiry submitted:', formData);
                
                // Show success
                showSuccessNotification(formData.email, serviceName);
                
                // Close modal after delay
                setTimeout(closeModal, 2000);
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
            
            function showFormError(message) {
                // Remove existing error
                const existingError = form.querySelector('.form-error');
                if (existingError) existingError.remove();
                
                // Create error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'form-error';
                errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
                errorDiv.style.cssText = `
                    color: #ff6b6b;
                    background: rgba(255, 107, 107, 0.1);
                    padding: 10px;
                    border-radius: 6px;
                    text-align: center;
                    margin-bottom: 15px;
                    font-size: 13px;
                `;
                
                // Insert after header
                const formHeader = form.querySelector('.modal-header h3');
                if (formHeader) {
                    formHeader.parentNode.parentNode.insertBefore(errorDiv, formHeader.parentNode.nextSibling);
                }
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.remove();
                    }
                }, 5000);
            }
        });
    }

    function showSuccessNotification(email, serviceName) {
        // Remove existing notification
        const existing = document.querySelector('.success-notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <strong>Enquiry Sent Successfully!</strong>
                <p>We'll contact you at ${email} about ${serviceName}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // ======================
    // ADMIN FUNCTIONS
    // ======================
    // Expose functions to add/remove/update tabs
    window.RXServices = {
        // Add a new tab
        addTab: function(tabData) {
            servicesDatabase.tabs.push(tabData);
            generateTabs();
            console.log('Tab added successfully:', tabData.title);
        },
        
        // Remove a tab by ID
        removeTab: function(tabId) {
            const index = servicesDatabase.tabs.findIndex(tab => tab.id === tabId);
            if (index !== -1) {
                servicesDatabase.tabs.splice(index, 1);
                generateTabs();
                console.log('Tab removed successfully:', tabId);
            }
        },
        
        // Update a tab
        updateTab: function(tabId, newData) {
            const tab = servicesDatabase.tabs.find(t => t.id === tabId);
            if (tab) {
                Object.assign(tab, newData);
                generateTabs();
                console.log('Tab updated successfully:', tabId);
            }
        },
        
        // Get all tabs
        getTabs: function() {
            return servicesDatabase.tabs;
        },
        
        // Save to localStorage
        saveToStorage: function() {
            try {
                localStorage.setItem('rx_services_data', JSON.stringify(servicesDatabase));
                console.log('Services data saved to storage');
            } catch (e) {
                console.error('Failed to save to storage:', e);
            }
        },
        
        // Load from localStorage
        loadFromStorage: function() {
            try {
                const saved = localStorage.getItem('rx_services_data');
                if (saved) {
                    const data = JSON.parse(saved);
                    if (data && data.tabs) {
                        servicesDatabase.tabs = data.tabs;
                        generateTabs();
                        console.log('Services data loaded from storage');
                    }
                }
            } catch (e) {
                console.error('Failed to load from storage:', e);
            }
        },
        
        // Reset to default
        resetToDefault: function() {
            servicesDatabase.tabs = [
                {
                    id: "graphic",
                    title: "Graphic Design",
                    icon: "fas fa-paint-brush",
                    description: "Professional graphic design solutions for branding, marketing, and visual communication.",
                    card: {
                        title: "Graphic Design Services",
                        description: "Create stunning visual designs for your brand and marketing needs.",
                        features: [
                            "Logo & Brand Identity Design",
                            "Marketing Materials (Brochures, Flyers, Banners)",
                            "Social Media Graphics & Templates",
                            "Packaging & Label Design",
                            "Business Stationery Design"
                        ]
                    }
                }
            ];
            generateTabs();
            console.log('Reset to default');
        }
    };

    // ======================
    // INITIALIZATION
    // ======================
    function init() {
        // Try to load saved data, otherwise generate default
        window.RXServices.loadFromStorage();
        if (servicesDatabase.tabs.length === 0) {
            generateTabs();
        }
        
        // Auto-save on page unload
        window.addEventListener('beforeunload', function() {
            window.RXServices.saveToStorage();
        });
    }

    // Start the system
    init();
});