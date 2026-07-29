// rx-contact.js - Contact Page Content & Functionality
// author : RX STUDIO

function rxLoadContactPage(rxDisplayArea) {
    rxDisplayArea.innerHTML = `
        <div style="width: 100%; max-width: 1200px; margin: 0 auto; text-align: left;">
            <h2 style="width: 100%; text-align: center; margin-bottom: 20px;">Contact Us</h2>
            <!-- Contact Tabs Navigation -->
<div class="contact-tabs">
    <div class="tab-nav">
        <button class="tab-btn active" data-tab="social">
            <span>Social Media</span>
        </button>
        <button class="tab-btn" data-tab="direct">
            <span>Direct Contact</span>
        </button>
        <button class="tab-btn" data-tab="email">
            <span>Email Us</span>
        </button>
        <button class="tab-btn" data-tab="map">
            <span>Find Us</span>
        </button>
    </div>

    <!-- Tab Content Container -->
    <div class="tab-content-container">
        <!-- Social Media Tab -->
        <div class="tab-content active" id="social-tab">
            <div class="tab-content-inner">
                <div class="tab-header">
                    <div class="tab-icon">
                        <i class="fas fa-share-alt"></i>
                    </div>
                    <h3>Connect With Us</h3>
                </div>
                <p class="tab-description">Follow us on social media to stay updated with our latest projects, news, and creative insights.</p>
                
                <div class="social-media-grid">
                    <a href="https://www.facebook.com/RosanXettri.2004" class="social-card">
                        <div class="social-icon facebook">
                            <i class="fab fa-facebook-f"></i>
                        </div>
                        <div class="social-info">
                            <h4>Facebook-page</h4>
                            <p>RosanXettri.2004</p>
                        </div>
                    </a>
                    
                    <a href="https://x.com/Rx_Rosan" class="social-card">
                        <div class="social-icon x">
                            <i class="fab fa-x-twitter"></i>
                        </div>
                        <div class="social-info">
                            <h4>X</h4>
                            <p>Rx_Rosan</p>
                        </div>
                    </a>
                    
                    <a href="https://www.instagram.com/Rosan.2061" class="social-card">
                        <div class="social-icon instagram">
                            <i class="fab fa-instagram"></i>
                        </div>
                        <div class="social-info">
                            <h4>Instagram</h4>
                            <p>Rosan.2061</p>
                        </div>
                    </a>
                    
                    <a href="https://www.tiktok.com/@rosankc2061" class="social-card">
                        <div class="social-icon tiktok">
                            <i class="fab fa-tiktok"></i>
                        </div>
                        <div class="social-info">
                            <h4>TikTok</h4>
                            <p>@rosankc2061</p>
                        </div>
                    </a>
                    
                    <a href="https://www.youtube.com/@RX_E-SPORTS" class="social-card">
                        <div class="social-icon youtube">
                            <i class="fab fa-youtube"></i>
                        </div>
                        <div class="social-info">
                            <h4>YouTube</h4>
                            <p>@RX_E-SPORTS</p>
                        </div>
                    </a>
                    
                    <a href="https://www.facebook.com/Rosan.2061" class="social-card">
                        <div class="social-icon facebook">
                             <i class="fab fa-facebook-f"></i>
                        </div>
                        <div class="social-info">
                            <h4>Facebook</h4>
                            <p>Rosan.2061</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        <!-- Direct Contact Tab -->
        <div class="tab-content" id="direct-tab">
            <div class="tab-content-inner">
                <div class="tab-header">
                    <div class="tab-icon">
                        <i class="fas fa-address-book"></i>
                    </div>
                    <h3>Direct Contact</h3>
                </div>
                <p class="tab-description">Reach out to us directly through any of these channels. We typically respond within 24 hours.</p>
                
                <div class="contact-methods">
                    <div class="contact-method">
                        <div class="method-icon phone">
                            <i class="fas fa-phone-alt"></i>
                        </div>
                        <div class="method-details">
                            <h4>Phone Number</h4>
                            <p>+977 9826482279</p>
                            <a href="tel:9826482279" class="method-action">
                                <i class="fas fa-phone"></i> Call Now
                            </a>
                        </div>
                    </div>
                    
                    <div class="contact-method">
                        <div class="method-icon whatsapp">
                            <i class="fab fa-whatsapp"></i>
                        </div>
                        <div class="method-details">
                            <h4>WhatsApp</h4>
                            <p>+977 9826482279</p>
                            <a href="https://wa.me/9826482279" target="_blank" class="method-action">
                                <i class="fab fa-whatsapp"></i> Message Now
                            </a>
                        </div>
                    </div>
                    
                    <div class="contact-method">
                        <div class="method-icon address">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="method-details">
                            <h4>Admin home address</h4>
                            <p>Banganga-10 ,Kapilvastu NEPAL</p>
                            <button class="method-action copy-address">
                                <i class="fas fa-copy"></i> Copy Address
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Email Us Tab -->
        <div class="tab-content" id="email-tab">
            <div class="tab-content-inner">
                <div class="tab-header">
                    <div class="tab-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <h3>Email Us</h3>
                </div>
                <p class="tab-description">Contact us directly via email or use the form below to send us a message.</p>
                
                <div class="email-container">
                    <!-- Direct Email Option -->
                    <div class="direct-email-section">
                        <h4>Send Direct Email</h4>
                        <div class="direct-email-card">
                            <div class="email-icon-main">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="email-details">
                                <h5>rkc242855@gmail.com</h5>
                                <p>Our primary email for all inquiries</p>
                                <div class="email-actions">
                                    <a href="https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcSBmXKWSMrdzdVGfPDXvhtFhDcTmkPvgjGWrWTsfJjXGhVMwWDxDRBPvGckqFjJqrKGKmWpr" class="direct-mail-btn">
                                        <i class="fas fa-paper-plane"></i> Direct open email box
                                    </a>
                                    <button class="copy-email-btn">
                                        <i class="fas fa-copy"></i> Copy Email
                                    </button>
                                </div>
                            </div>
                        </div>
                            
                        <div class="direct-email-card">
                            <div class="email-icon-main">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="email-details">
                                <h5>rosankc820@gmail.com</h5>
                                <p>Our secondary email for inquiries</p>
                                <div class="email-actions">
                                    <a href="https://mail.google.com/mail/u/1/#inbox?compose=DmwnWrRqgrszTfCxJtfssfqXpKxQMFKmsxxrMRpjlvNcBChZkjrSqjKLkHxrgrzsqrcNrZZVbtQv" class="direct-mail-btn">
                                        <i class="fas fa-paper-plane"></i> Direct open email box
                                    </a>
                                    <button class="copy-email-btn">
                                        <i class="fas fa-copy"></i> Copy Email
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="email-info-box">
                            <div class="info-item">
                                <i class="fas fa-clock"></i>
                                <div>
                                    <h6>Response Time</h6>
                                    <p>Within 24 hours on business days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Contact Form -->
                    <div class="email-form-section">
                        <h4>Or Send Message Here</h4>
                        <form class="contact-form-simple" id="contactFormSimple" action="https://formspree.io/f/xzznawep" method="POST">
                            <input type="hidden" name="_subject" value="New Contact Form Submission - RX STUDIO">
                            <input type="hidden" name="_replyto" id="replyTo">
                            <input type="text" name="_gotcha" style="display:none">
                            
                            <div class="form-group-simple">
                                <label for="contactName">Your Name *</label>
                                <input type="text" id="contactName" name="name" placeholder="Enter your full name" required>
                            </div>
                            
                            <div class="form-group-simple">
                                <label for="contactEmail">Your Email *</label>
                                <input type="email" id="contactEmail" name="email" placeholder="Enter your email address" required>
                            </div>
                            
                            <div class="form-group-simple">
                                <label for="contactSubject">Subject *</label>
                                <input type="text" id="contactSubject" name="_subject" placeholder="What is this regarding?" required>
                            </div>
                            
                            <div class="form-group-simple">
                                <label for="contactMessage">Message *</label>
                                <textarea id="contactMessage" name="message" placeholder="Type your message here..." rows="6" required></textarea>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="submit-btn">
                                    <i class="fas fa-paper-plane"></i> Send Message
                                </button>
                                <button type="reset" class="clear-btn">
                                    <i class="fas fa-redo"></i> Clear Form
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Map Tab -->
        <div class="tab-content" id="map-tab">
            <div class="tab-content-inner">
                <div class="tab-header">
                    <div class="tab-icon">
                        <i class="fas fa-map-marked-alt"></i>
                    </div>
                    <h3>Find Us on Map</h3>
                </div>
                <p class="tab-description">Visit our studio or drop by to discuss your project in person.</p>
                
                <div class="map-section-simple">
                    <div class="map-container-simple">
                        <div class="map-placeholder-simple">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d725.728319208644!2d83.2227940321064!3d27.647873553535415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjfCsDM4JzUyLjUiTiA4M8KwMTMnMjIuMSJF!5e1!3m2!1sen!2snp!4v1766279892071!5m2!1sen!2snp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                    
                    <div class="location-details">
                        <h4>Location Details</h4>
                        <div class="location-info">
                            <div class="location-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <h5>Address</h5>
                                    <p>Banganga-10, Kapilvastu NEPAL</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="map-actions-simple">
                            <a href="https://maps.app.goo.gl/XF78VsmDVW96JCsY9" target="_blank" class="map-btn">
                                <i class="fas fa-directions"></i> Open in Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        </div>
    `;

    // Initialize all functionality after innerHTML is injected
    rxInitContactPageFunctionality();
}

function rxInitContactPageFunctionality() {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            
            const tabId = btn.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
    
    // Copy Address Functionality
    const copyAddressBtn = document.querySelector('.copy-address');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', function() {
            const address = 'Banganga-10 ,Kapilvastu NEPAL';
            navigator.clipboard.writeText(address)
                .then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    this.style.backgroundColor = '#1a4480';
                    this.style.color = '#ffffff';
                    this.style.borderColor = '#1a4480';
                    
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
    
    // Copy Email Buttons
    document.querySelectorAll('.copy-email-btn').forEach(button => {
        button.addEventListener('click', function () {
            const email = this.closest('.direct-email-card')
                              .querySelector('.email-details h5')
                              .innerText;

            navigator.clipboard.writeText(email).then(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                this.classList.add('copied');

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
            
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: new FormData(this),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    contactFormSimple.reset();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    const clearBtn = contactFormSimple ? contactFormSimple.querySelector('.clear-btn') : null;
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            contactFormSimple.reset();
            showNotification('Form cleared.', 'info');
        });
    }
    
    // Helper Notification Function
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
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
    
    // Add notification styles dynamically if not already present
    if (!document.getElementById('rx-notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'rx-notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background-color: #ffffff;
                color: #333333;
                padding: 15px 20px;
                border-radius: 8px;
                border-left: 4px solid #1a4480;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 9999;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                max-width: 400px;
                border: 1px solid #d0dbe8;
            }
            .notification.show { transform: translateX(0); }
            .notification.success { border-left-color: #28a745; }
            .notification.error { border-left-color: #dc3545; }
            .notification i { font-size: 1.2rem; }
            .notification.success i { color: #28a745; }
            .notification.error i { color: #dc3545; }
            .notification span { flex: 1; font-size: 0.95rem; }
            .notification-close { background: none; border: none; color: #666666; cursor: pointer; padding: 0; font-size: 1rem; }
            .notification-close:hover { color: #1a4480; }
        `;
        document.head.appendChild(notificationStyles);
    }
}