// rx-terms.js - Terms & Conditions Page Content & Tab Functionality (Final Fixed)
function rxLoadTermsPage(rxDisplayArea) {
    rxDisplayArea.style.alignItems = "center";
    rxDisplayArea.style.justifyContent = "flex-start";
    rxDisplayArea.innerHTML = `
        <div style="width: 100%; max-width: 1200px; margin: 0 auto; text-align: left;">
            <h2 style="width: 100%; text-align: center; margin-bottom: 20px;">Terms & Conditions</h2>
            <!-- Terms Tabs Navigation -->
            <div class="tc-tabs">
                <div class="tab-nav">
                    <button class="tab-btn active" data-tab="overview">
                        <i class="fas fa-file-alt"></i>
                        <span>OVERVIEW</span>
                    </button>
                    <button class="tab-btn" data-tab="services">
                        <i class="fas fa-cogs"></i>
                        <span>SERVICES</span>
                    </button>
                    <button class="tab-btn" data-tab="obligations">
                        <i class="fas fa-user-check"></i>
                        <span>OBLIGATIONS</span>
                    </button>
                    <button class="tab-btn" data-tab="payments">
                        <i class="fas fa-wallet"></i>
                        <span>PAYMENTS</span>
                    </button>
                    <button class="tab-btn" data-tab="liability">
                        <i class="fas fa-balance-scale"></i>
                        <span>LIABILITY</span>
                    </button>
                </div>

                <!-- Tab Content Container -->
                <div class="tab-content-container">
                    <!-- OVERVIEW Tab -->
                    <div class="tab-content active" id="overview-tab">
                        <div class="tab-content-inner">
                            <div class="tab-header">
                                <div class="tab-icon"><i class="fas fa-file-alt"></i></div>
                                <div><h3>Terms & Conditions Overview</h3></div>
                            </div>
                            <p class="tab-description">Welcome to RX STUDIO. By accessing or using our services, you agree to be bound by these Terms & Conditions. Please read them carefully before using any of our services including lekhapadi, graphic design, EPS exam platform, QR code generator, and text-to-image tools[cite: 6].</p>
                            
                            <div class="services-grid">
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Acceptance of Terms</h4>
                                        <p>By using our website and services, you confirm that you accept these terms and agree to comply with them. If you do not agree, please do not use our services[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Eligibility</h4>
                                        <p>You must be at least 18 years old to use our services. By using our services, you represent that you meet this eligibility requirement[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Account Responsibility</h4>
                                        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Modifications</h4>
                                        <p>We reserve the right to modify these terms at any time. Changes become effective immediately upon posting. Continued use constitutes acceptance[cite: 6].</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SERVICES Tab -->
                    <div class="tab-content" id="services-tab">
                        <div class="tab-content-inner">
                            <div class="tab-header">
                                <div class="tab-icon"><i class="fas fa-cogs"></i></div>
                                <div><h3>Services & Usage</h3></div>
                            </div>
                            <p class="tab-description">RX STUDIO provides various professional services. These terms govern your use of all our service offerings[cite: 6].</p>
                            
                            <div class="services-grid">
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Lekhapadi Services</h4>
                                        <p>Licensed legal documentation services provided within Kapilvastu district. All documents are prepared in accordance with Nepal's legal framework[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Graphic & Design Services</h4>
                                        <p>Logo design, poster creation, image editing services. Final deliverables are provided upon full payment. Revisions are subject to agreed terms[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>EPS Exam Platform</h4>
                                        <p>Online practice software for EPS-TOPIK exam preparation. Access is provided for learning purposes only. No guarantee of exam results[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Web Software Tools</h4>
                                        <p>QR code generator and text-to-image tools are provided "as is" with reasonable functionality. Password-protected features require responsible use[cite: 6].</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tc-highlight-note">
                                <i class="fas fa-info-circle"></i> All services are subject to availability. We reserve the right to modify, suspend, or discontinue any service without prior notice[cite: 6].
                            </div>
                        </div>
                    </div>

                    <!-- OBLIGATIONS Tab -->
                    <div class="tab-content" id="obligations-tab">
                        <div class="tab-content-inner">
                            <div class="tab-header">
                                <div class="tab-icon"><i class="fas fa-user-check"></i></div>
                                <div><h3>User Obligations</h3></div>
                            </div>
                            <p class="tab-description">As a user of RX STUDIO services, you agree to the following obligations and responsibilities[cite: 6].</p>
                            
                            <div class="services-grid">
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Accurate Information</h4>
                                        <p>You must provide accurate, complete, and current information when using our services, especially for lekhapadi documentation and account registration[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Prohibited Activities</h4>
                                        <p>You may not use our services for illegal purposes, harassment, fraud, or any activity that violates applicable laws in Nepal[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Intellectual Property</h4>
                                        <p>You shall not copy, modify, distribute, or reverse engineer any of our software, designs, or proprietary content without written permission[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Compliance with Laws</h4>
                                        <p>You agree to comply with all applicable local, national, and international laws and regulations regarding your use of our services[cite: 6].</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- PAYMENTS Tab -->
                    <div class="tab-content" id="payments-tab">
                        <div class="tab-content-inner">
                            <div class="tab-header">
                                <div class="tab-icon"><i class="fas fa-wallet"></i></div>
                                <div><h3>Payments & Fees</h3></div>
                            </div>
                            <p class="tab-description">Understanding our payment terms, fees, and refund policies for services provided by RX STUDIO[cite: 6].</p>
                            
                            <div class="services-grid">
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Service Fees</h4>
                                        <p>All fees for services are quoted in Nepalese Rupees (NPR) unless otherwise specified. Fees are subject to change with prior notice[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Payment Methods</h4>
                                        <p>We accept various payment methods including bank transfer, mobile payments (eSewa, Khalti), and cash payments for in-person services[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Refund Policy</h4>
                                        <p>Refunds are provided on a case-by-case basis. Digital services once delivered are generally non-refundable. Lekhapadi service fees are non-refundable after document processing begins[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Late Payments</h4>
                                        <p>Late payments may result in service suspension. Additional charges may apply for delayed payments beyond agreed terms[cite: 6].</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tc-highlight-note">
                                <i class="fas fa-receipt"></i> All transactions are recorded and invoices are provided upon request. Please retain payment receipts for reference[cite: 6].
                            </div>
                        </div>
                    </div>

                    <!-- LIABILITY Tab -->
                    <div class="tab-content" id="liability-tab">
                        <div class="tab-content-inner">
                            <div class="tab-header">
                                <div class="tab-icon"><i class="fas fa-balance-scale"></i></div>
                                <div><h3>Limitation of Liability</h3></div>
                            </div>
                            <p class="tab-description">Important limitations on our liability and your responsibilities when using RX STUDIO services[cite: 6].</p>
                            
                            <div class="services-grid">
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>No Warranty</h4>
                                        <p>Services are provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free operation of digital platforms[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Limitation of Damages</h4>
                                        <p>To the maximum extent permitted by law, RX STUDIO shall not be liable for any indirect, incidental, or consequential damages arising from service use[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Indemnification</h4>
                                        <p>You agree to indemnify and hold RX STUDIO harmless from any claims, damages, or expenses arising from your violation of these terms[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Force Majeure</h4>
                                        <p>We are not liable for delays or failures in performance resulting from causes beyond our reasonable control, including natural disasters, technical failures, or government actions[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Governing Law</h4>
                                        <p>These terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes shall be resolved in Kapilvastu district courts[cite: 6].</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Termination</h4>
                                        <p>We reserve the right to terminate or suspend access to our services immediately, without prior notice, for violation of these terms[cite: 6].</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tc-highlight-note">
                                <i class="fas fa-balance-scale"></i> By using RX STUDIO services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions[cite: 6].
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize tab functionality immediately after content is loaded
    setTimeout(() => {
        const tabBtns = rxDisplayArea.querySelectorAll('.tc-tabs .tab-btn');
        const tabContents = rxDisplayArea.querySelectorAll('.tc-tabs .tab-content');
        
        if (tabBtns.length > 0) {
            tabBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    this.classList.add('active');
                    
                    const tabId = this.getAttribute('data-tab');
                    const tabContent = rxDisplayArea.querySelector(`#${tabId}-tab`);
                    if (tabContent) {
                        tabContent.classList.add('active');
                    }
                });
            });
        }
    }, 50);
}