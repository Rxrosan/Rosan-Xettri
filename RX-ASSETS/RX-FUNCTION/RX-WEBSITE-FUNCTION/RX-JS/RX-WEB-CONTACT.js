// Contact Tabs Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding tab content
            const tabId = btn.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
    
    // ===== Direct Contact Tab =====
    // Copy Address Functionality
    const copyAddressBtn = document.querySelector('.copy-address');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', function() {
            const address = 'Banganga-10 ,Kapilvastu NEPAL';
            navigator.clipboard.writeText(address)
                .then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    this.style.backgroundColor = '#64ffda';
                    this.style.color = '#0a192f';
                    this.style.borderColor = '#64ffda';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.backgroundColor = '';
                        this.style.color = '';
                        this.style.borderColor = '';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy address: ', err);
                    showNotification('Failed to copy address. Please try again.', 'error');
                });
        });
    }
    
    // ===== Email Us Tab =====
    // Copy Email Buttons (Auto Reset)
document.querySelectorAll('.copy-email-btn').forEach(button => {
    button.addEventListener('click', function () {

        const email = this.closest('.direct-email-card')
                          .querySelector('.email-details h5')
                          .innerText;

        navigator.clipboard.writeText(email).then(() => {

            // Change to Copied
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            this.classList.add('copied');

            // Reset after 2 seconds
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-copy"></i> Copy Email';
                this.classList.remove('copied');
            }, 2000);

        }).catch(() => {
            alert('Failed to copy email');
        });
    });
});

    
    // Contact Form Submission (Formspree)
    const contactFormSimple = document.getElementById('contactFormSimple');
    if (contactFormSimple) {
        // Set replyto from email field
        const emailField = document.getElementById('contactEmail');
        const replyToField = document.getElementById('replyTo');
        
        if (emailField && replyToField) {
            emailField.addEventListener('input', function() {
                replyToField.value = this.value;
            });
        }
        
        contactFormSimple.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Send to Formspree
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: new FormData(this),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    
                    // Reset form
                    contactFormSimple.reset();
                    
                    // Log for debugging
                    console.log('Form submitted successfully to Formspree');
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    // Clear form button functionality
    const clearBtn = contactFormSimple ? contactFormSimple.querySelector('.clear-btn') : null;
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            contactFormSimple.reset();
            showNotification('Form cleared.', 'info');
        });
    }
    
    // ===== Helper Functions =====
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
    
    // Add notification styles dynamically
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #112240;
            color: #e6f1ff;
            padding: 15px 20px;
            border-radius: 8px;
            border-left: 4px solid #64ffda;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 400px;
            border: 1px solid #1e3a5f;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left-color: #64ffda;
        }
        
        .notification.error {
            border-left-color: #ff6b6b;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .notification.success i {
            color: #64ffda;
        }
        
        .notification.error i {
            color: #ff6b6b;
        }
        
        .notification span {
            flex: 1;
            font-size: 0.95rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #8892b0;
            cursor: pointer;
            padding: 0;
            font-size: 1rem;
            transition: color 0.3s ease;
        }
        
        .notification-close:hover {
            color: #64ffda;
        }
    `;
    document.head.appendChild(notificationStyles);
    
    // Initialize first tab as active
    if (tabBtns.length > 0) {
        const firstTab = document.querySelector('[data-tab="social"]');
        if (firstTab) {
            firstTab.click();
        }
    }
});