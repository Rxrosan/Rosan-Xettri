// rx-privacy.js - Privacy & Policy Page Content (All 4 Tabs Included with Icons)
function rxLoadPrivacyPage(rxDisplayArea) {
    rxDisplayArea.style.alignItems = "center";
    rxDisplayArea.style.justifyContent = "flex-start";
    rxDisplayArea.innerHTML = `
        <div style="width: 100%; max-width: 1200px; margin: 0 auto; text-align: left;">
            <h2 style="width: 100%; text-align: center; margin-bottom: 20px;">Privacy & Policy</h2>
            <!-- Privacy Tabs Navigation -->
        <div class="pp-tabs">
            <div class="tab-nav">
                <!-- 1. OVERVIEW -->
                <button class="tab-btn active" data-tab="overview">
                    <i class="fas fa-shield-alt"></i>
                    <span>OVERVIEW</span>
                </button>
                <!-- 2. DATA COLLECTION -->
                <button class="tab-btn" data-tab="data-collection">
                    <i class="fas fa-database"></i>
                    <span>DATA COLLECTION</span>
                </button>
                <!-- 3. USAGE & SECURITY -->
                <button class="tab-btn" data-tab="usage">
                    <i class="fas fa-lock"></i>
                    <span>USAGE & SECURITY</span>
                </button>
                <!-- 4. YOUR RIGHTS -->
                <button class="tab-btn" data-tab="rights">
                    <i class="fas fa-user-shield"></i>
                    <span>YOUR RIGHTS</span>
                </button>
            </div>

            <!-- Tab Content Container -->
            <div class="tab-content-container">
                
                <!-- 1. OVERVIEW Tab -->
                <div class="tab-content active" id="overview-tab">
                    <div class="tab-content-inner">
                        <div class="tab-header">
                            <div class="tab-icon"><i class="fas fa-shield-alt"></i></div>
                            <div><h3>Privacy Commitment</h3></div>
                        </div>
                        <p class="tab-description">RX STUDIO ("we", "our", "us") respects your privacy. This Privacy & Policy outlines how we collect, use, store, and safeguard your information when you engage with our services—whether through website, design consultations, lekhapadi services, EPS exam tools, or software solutions.</p>
                        
                        <div class="services-grid">
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Our Promise</h4>
                                    <p>We are committed to protecting your personal information and maintaining transparency about how we handle your data. Your trust is our priority.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Legal Compliance</h4>
                                    <p>We follow Nepal's data protection principles and international best practices to ensure your information is handled responsibly and lawfully.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Scope of Policy</h4>
                                    <p>This policy applies to all RX STUDIO services including lekhapadi, graphic design, EPS exam platform, QR code generator, and text-to-image tools.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Policy Updates</h4>
                                    <p>We may update this policy periodically. Changes will be posted on this page with an updated effective date.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. DATA COLLECTION Tab -->
                <div class="tab-content" id="data-collection-tab">
                    <div class="tab-content-inner">
                        <div class="tab-header">
                            <div class="tab-icon"><i class="fas fa-database"></i></div>
                            <div><h3>Information We Collect</h3></div>
                        </div>
                        <p class="tab-description">We collect personal data that you voluntarily provide when you register, use our platforms, or request services.</p>
                        
                        <div class="services-grid">
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Identity Data</h4>
                                    <p>Full name, address, contact number, email, citizenship or organization details (for lekhapadi documentation and service delivery).</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Technical Data</h4>
                                    <p>IP address, browser type, device information, cookies to enhance user experience and improve platform performance.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Usage Data</h4>
                                    <p>Interactions with our web software, exam progress, design project preferences, and service usage analytics.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Files & Submissions</h4>
                                    <p>Documents, images, or QR code payloads processed via our tools are temporarily stored only to deliver results.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3. USAGE & SECURITY Tab -->
                <div class="tab-content" id="usage-tab">
                    <div class="tab-content-inner">
                        <div class="tab-header">
                            <div class="tab-icon"><i class="fas fa-lock"></i></div>
                            <div><h3>How We Use Your Data & Security</h3></div>
                        </div>
                        <p class="tab-description">We implement robust security measures and use your information only for legitimate business purposes.</p>
                        
                        <div class="services-grid">
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Service Delivery</h4>
                                    <p>To deliver lekhapadi, graphic design, and web/software services as requested. Process secure QR codes with password protection features.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Platform Improvement</h4>
                                    <p>To improve our EPS exam platform, track performance, and provide personalized practice modules for better user experience.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Security Measures</h4>
                                    <p>SSL/TLS encryption, access controls, firewalls, regular vulnerability scanning, and password-protected QR codes for sensitive information.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Data Sharing</h4>
                                    <p>RX STUDIO does not sell your data. Limited sharing occurs only with trusted service providers or legal requirements.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="pp-highlight-note">
                            <i class="fas fa-lock"></i> All data transmissions are encrypted using SSL/TLS protocols to ensure maximum security.
                        </div>
                    </div>
                </div>

                <!-- 4. YOUR RIGHTS Tab -->
                <div class="tab-content" id="rights-tab">
                    <div class="tab-content-inner">
                        <div class="tab-header">
                            <div class="tab-icon"><i class="fas fa-user-shield"></i></div>
                            <div><h3>Your Rights & Choices</h3></div>
                        </div>
                        <p class="tab-description">You have control over your personal information. Here are the rights you can exercise under applicable data protection laws.</p>
                        
                        <div class="services-grid">
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Right to Access</h4>
                                    <p>You have the right to request access to your personal data and obtain information about how we process it.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Right to Rectification</h4>
                                    <p>You can request correction of inaccurate or incomplete personal data we hold about you.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Right to Erasure</h4>
                                    <p>Request deletion of your information (subject to legal retention for lekhapadi records and regulatory compliance).</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Right to Withdraw Consent</h4>
                                    <p>You may withdraw consent for marketing communications and certain data processing activities at any time.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Cookie Preferences</h4>
                                    <p>You may disable cookies via browser settings. Some features may be affected, but your privacy preferences are respected.</p>
                                </div>
                            </div>
                            
                            <div class="service-card">
                                <div class="service-info">
                                    <h4>Right to Complain</h4>
                                    <p>You have the right to lodge a complaint with the relevant data protection authority in Nepal.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="pp-highlight-note">
                            <i class="fas fa-envelope"></i> To exercise your rights, contact our Data Protection Officer at <strong>rosanxettristudio@gmail.com</strong>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </div>
    `;

    // Trigger tab initialization immediately after loading HTML dynamically
    if (typeof window.rxInitPrivacyTabs === 'function') {
        window.rxInitPrivacyTabs();
    }
}