// rx-about.js - About Page Content & Team Trigger Fixed
// author : RX STUDIO

function rxLoadAboutPage(rxDisplayArea) {
    rxDisplayArea.innerHTML = `
        <div style="width: 100%; max-width: 1200px; margin: 0 auto; text-align: left;">
            <h2 style="width: 100%; text-align: center; margin-bottom: 20px;">About Me</h2>
            <div class="about-container">
                <div class="about-content">
                    <!-- Left Side: Admin Image -->
                    <div class="about-left">
                        <div class="admin-image-container">
                            <img src="ASSET/RX-IMAGES/RX-USER-IMAGE/A-1.png" alt="ROSAN KC - Founder & Admin" class="admin-image">
                            <div class="image-overlay">
                                <h4>ROSAN KC</h4>
                                <p>ADMIN AT RX STUDIO </p>
                            </div>
                        </div>
                        
                        <div class="admin-badges">
                            <div class="badge">
                                <i class="fas fa-medal"></i>
                                <span>5+ Years Experience</span>
                            </div>
                        </div>
                        <div class="admin-badges">
                            <div class="badge">
                                <i class="fas fa-pen"></i>
                                <span>Lekhapadi with certificate approved </span>
                            </div>
                        </div>
                        <div class="admin-badges">
                            <div class="badge">
                                <i class="fas fa-cog"></i>
                                <span>Lekhapadi document generete for web software </span>
                            </div>
                        </div>
                        <div class="admin-badges">
                            <div class="badge">
                                <i class="fas fa-book"></i>
                                <span>Korean language test exam for web software </span>
                            </div>
                        </div>
                    </div>

                    <!-- Right Side: Bio -->
                    <div class="about-right">
                        <h3>Hello, I'm <span class="highlight">ROSAN KC</span></h3>
                        <p class="title">ADMIN at RX STUDIO</p>
                        
                        <div class="bio-section">
                            <p>I am Rosan Khattri Chettri, a 23-year-old creative and technology-driven individual from Banganga-10, Kapilvastu. Currently pursuing my BBS 3rd year, I have a strong interest in the digital world where creativity and innovation meet.</p>
                            
                            <p>My core skills include designing and web development. I enjoy creating impactful visual designs and building user-friendly, functional, and visually appealing websites that deliver meaningful digital experiences.</p>
                            
                            <p>I believe in continuous learning and self-improvement, always striving to enhance my skills and adapt to new challenges. With passion and dedication, I aim to contribute creatively and technically to the digital space while making a positive impact through my work.</p>
                        </div>

                        <div class="skills-section">
                            <h4>Expertise & Skills</h4>
                            <div class="skills-grid">
                                <div class="skill-item">
                                    <i class="fas fa-paint-brush"></i>
                                    <span>Graphic Design</span>
                                </div>
                                <div class="skill-item">
                                    <i class="fas fa-book"></i>
                                    <span>Lekhapadi</span>
                                </div>
                                <div class="skill-item">
                                    <i class="fas fa-graduation-cap"></i>
                                    <span> Korean Language Question Model - Web Software </span>
                                </div>
                            </div>
                        </div>

                        <div class="contact-cta">
                            <h4>Direct contact me thrugh :</h4>
                            <p>Have a project in mind? Let's discuss how we can bring your vision to life.</p>
                            
                            <div class="cta-buttons">
                                <a href="javascript:void(0);" onclick="rxLoadContent('CONTACT')" class="contact-btn">
                                    <i class="fas fa-envelope"></i> Contact Me
                                </a>
                                <a href="https://wa.me/9826482279" target="_blank" class="whatsapp-btn">
                                    <i class="fab fa-whatsapp"></i> WhatsApp
                                </a>
                                <a href="https://mail.google.com/mail/u/0/#inbox?compose=DmwnWrRrlrHkpggsqlwXzcjBtxqJqKvRtqsrFcsWlnmKDdGRWpDrGrsBpHFsvLfkwmNhkCFMjVHl" class="email-btn">
                                    <i class="fas fa-paper-plane"></i> Email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <h2 class="section-title" style="margin-top: 40px;">Our Team</h2>
        <section id="rx-team-section"></section>
    `;

    // ट्यागहरू लोड भएपछि टिमको स्क्रिप्टलाई ट्रिगर गर्ने
    if (typeof initRxTeamSlider === 'function') {
        initRxTeamSlider();
    }
}