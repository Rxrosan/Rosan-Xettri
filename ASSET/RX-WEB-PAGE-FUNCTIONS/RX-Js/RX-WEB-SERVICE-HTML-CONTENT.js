// rx-service.js - Service Page Content & Tabs Management
// author : RX STUDIO

function initServiceTabs() {
    const tabBtns = document.querySelectorAll('.service-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.service-tabs .tab-content');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                
                const tabId = this.getAttribute('data-tab');
                const tabContent = document.getElementById(`${tabId}-tab`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
        
        if (!document.querySelector('.service-tabs .tab-btn.active')) {
            tabBtns[0].classList.add('active');
            const firstTabId = tabBtns[0].getAttribute('data-tab');
            const firstContent = document.getElementById(`${firstTabId}-tab`);
            if (firstContent) firstContent.classList.add('active');
        }
    }
}

function rxLoadServicePage(rxDisplayArea) {
    rxDisplayArea.innerHTML = `
        <div style="width: 100%; max-width: 1200px; margin: 0 auto; text-align: left;">
            <h2 style="width: 100%; text-align: center; margin-bottom: 20px;">SERVICE</h2>
            
            <!-- Services Tabs Navigation -->
            <div class="service-tabs" style="width: 100%;">
                <div class="tab-nav">
                    <button class="tab-btn active" data-tab="LEKHAPADI">
                        <span>लेखापढी सेवा</span>
                    </button>
                    <button class="tab-btn" data-tab="DESIGNING">
                        <span>GRAPHIC & DESIGN Services</span>
                    </button>
                    <button class="tab-btn" data-tab="EPS-EXAM">
                        <span>EPS-EXAM</span>
                    </button>
                    <button class="tab-btn" data-tab="WEB-SOFTWARE">
                        <span>WEB-SOFTWARE</span>
                    </button>
                </div>

                <!-- Tab Content Container -->
                <div class="tab-content-container">
                    <!-- LEKHAPADI Tab -->
                    <div class="tab-content active" id="LEKHAPADI-tab">
                        <div class="tab-content-inner">
                            <div class="tab-header">
                                <h3>लेखापढी सेवा</h3>
                            </div>
                            <p class="tab-description">नमस्कार। म रोसन के.सी. कपिलवस्तु जिल्ला अदालतबाट विधिवत् लाइसेन्स प्राप्त लेखापढी व्यवसायी हुँ। कपिलवस्तु जिल्लाभित्र लेखापढी सम्बन्धी सेवा प्रदान गर्न अधिकृत भएको जानकारी गराउँदै, मैले सेवा प्रदान गर्ने क्षेत्रहरू निम्नानुसार उल्लेख गरिएको छ।</p>
                            
                            <div class="services-grid">
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>वेबसाइटमार्फत लेखापढी सेवा</h4>
                                        <p>आधुनिक प्रविधिको प्रयोग गर्दै यस कार्यालयको वेबसाइटमार्फत विभिन्न प्रकारका लेखापढी सम्बन्धी सेवाहरू अनलाइन रूपमा उपलब्ध गराइन्छ। सेवाग्राहीहरूले आवश्यक कागजात, फारम तथा निवेदनहरू वेबसाइटमार्फत सजिलै प्राप्त गर्न तथा आवश्यक विवरण भरी डाउनलोड वा प्रिन्ट गर्न सक्ने सुविधा उपलब्ध छ। यस माध्यमबाट सेवाग्राहीहरूले समयको बचत गर्दै छिटो, सहज र भरपर्दो रूपमा लेखापढी सेवा प्राप्त गर्छन्।</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- DESIGNING Tab -->
                    <div class="tab-content" id="DESIGNING-tab">
                        <div class="tab-content-inner">
                            <div class="tab-header">
                                <h3>GRAPHIC & DESIGN Services</h3>
                            </div>
                            <p class="tab-description">We provide comprehensive design solutions for businesses, organizations, and individuals, ensuring high-quality, visually appealing, and impactful designs that communicate your message effectively.</p>
                            
                            <div class="services-grid">
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Logo Design</h4>
                                        <p>We create unique, memorable, and professional logos that reflect your brand identity and values. Services include concept creation, color selection, typography, and multiple design drafts to ensure client satisfaction.</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Poster & Banner Design</h4>
                                        <p>We design eye-catching posters and banners for both print and digital platforms. Services include advertising banners, event posters, promotional materials, and social media graphics.</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Image Editing & Customization</h4>
                                        <p>We offer professional photo editing, retouching, and digital customization for both personal and official use. Services include background removal, color correction, and document enhancement.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- EPS-EXAM Tab -->
                    <div class="tab-content" id="EPS-EXAM-tab">
                        <div class="tab-content-inner">
                            <div class="tab-header">
                                <h3>EPS-EXAM Services</h3>
                            </div>
                            <p class="tab-description">We provide comprehensive EPS online exam practice for candidates preparing for the Employment Permit System (EPS) – South Korea.</p>
                            
                            <div class="services-grid">
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>EPS Exam Practice Web Software</h4>
                                        <p>Our web-based EPS exam practice software provides a complete platform for candidates preparing for the Employment Permit System (EPS) – South Korea.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- WEB-SOFTWARE Tab -->
                    <div class="tab-content" id="WEB-SOFTWARE-tab">
                        <div class="tab-content-inner">
                            <div class="tab-header">
                                <h3>WEB-SOFTWARE Services</h3>
                            </div>
                            <p class="tab-description">Our Web Software provides an all-in-one platform for managing, creating, and delivering professional services efficiently online.</p>
                            
                            <div class="services-grid">
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>QR Code Generator</h4>
                                        <p>Our QR Code Generator allows users to create secure and customizable QR codes with an added password protection system.</p>
                                    </div>
                                </div>
                                
                                <div class="service-card">
                                    <div class="service-info">
                                        <h4>Text-to-Image</h4>
                                        <p>Our platform provides advanced text-to-image and image-to-text conversion tools, enabling users to convert text into visual content or extract text efficiently.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Client Section -->
            <h2 class="section-title" style="width: 100%; text-align: center; margin-top: 40px;">Client Review's</h2>
             <section id="rx-reviewer"> </section>
        </div>
    `;
    
    initServiceTabs();
    
    if (typeof initReviewerCards === 'function') {
        initReviewerCards();
    }
}