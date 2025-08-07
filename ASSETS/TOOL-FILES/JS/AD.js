(function () {
    // --- MASTER CONFIGURATION START ---
    const adConfig = {
        // --- THEME SELECTION ---
        activeTheme: 'modernBlue',

        themes: {
            modernBlue: {
                primaryColor: "#007aff",
                successColor: "#28a745",
                dangerColor: "#dc3545",
                darkTextColor: "#1d2d35",
                lightTextColor: "#5a6a72",
                bodyBg: "#f7f9fc",
                cardBg: "#ffffff",
                subtleBorderColor: "#e9ecef",
                borderRadius: "14px",
                fontFamily: `"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif`
            },
            deepPurple: {
                primaryColor: "#6f42c1",
                successColor: "#20c997",
                dangerColor: "#e83e8c",
                darkTextColor: "#212529",
                lightTextColor: "#495057",
                bodyBg: "#f8f7fa",
                cardBg: "#ffffff",
                subtleBorderColor: "#e3e1e7",
                borderRadius: "14px",
                fontFamily: `"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif`
            }
        },

        // --- AD CONTENT ---
        ads: [
            {
                id: 1,
                title: "Mirai International Language Centre",
                content: "Admissions open for Japanese and Korean language courses — for work & study!",
                image: "asset/img/ad/mirai1.jpg",
                duration: 7,
                contact: {
                    tagline: "Your Gateway to Japan & Korea",
                    phone: "07655217, 9867134971, 9749909414, 9761691883",
                    email: "mirailanguage280@gmail.com",
                    website: "https://example.com",
                    facebook: "https://www.facebook.com/profile.php?id=61576608577238",
                    address: "Banganga 1, 4NO, Kapilvastu, Lumbini, Nepal",
                    about: "Mirai International is a premier language center dedicated to providing top-tier Japanese and Korean language education. Our courses are designed by certified professionals to ensure you are not just learning a language, but mastering it for real-world application, whether for higher studies or professional careers in Japan and Korea.",
                    services: [
                        "Intensive Japanese Language Courses (N5-N1)",
                        "Comprehensive Korean Language (TOPIK)",
                        "Student Visa Application & Documentation",
                        "Work & Study Program Guidance",
                        "Pre-departure & Cultural Immersion Workshops",
                        "Career Counseling & University Placement"
                    ],
                    mapEmbedURL: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.067868547464!2d83.1083925752009!3d27.8080299761358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996864f6c58f00b%3A0x7d6f11c14a4e5c5d!2sBanganga%2C%20Kapilvastu!5e0!3m2!1sen!2snp!4v1672543210987"
                }
            },
        ],
        autoCloseTimeout: 60,
        fontAwesomeURL: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    };
    // --- MASTER CONFIGURATION END ---

    function showAd(config) {
        if (!config || !config.ads || config.ads.length === 0) return;

        const ad = config.ads[Math.floor(Math.random() * config.ads.length)];
        const theme = config.themes[config.activeTheme] || config.themes.modernBlue;

        const css = document.createElement('style');
        css.id = 'rx-ad-styles';
        css.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            @import url("${config.fontAwesomeURL}");
            
            :root {
                --rx-primary: ${theme.primaryColor}; --rx-success: ${theme.successColor}; --rx-danger: ${theme.dangerColor};
                --rx-text-dark: ${theme.darkTextColor}; --rx-text-light: ${theme.lightTextColor};
                --rx-body-bg: ${theme.bodyBg}; --rx-card-bg: ${theme.cardBg};
                --rx-border-color: ${theme.subtleBorderColor}; --rx-radius: ${theme.borderRadius};
                --rx-font-family: ${theme.fontFamily};
            }

            .rx-ad-overlay {
                position: fixed; inset: 0; padding: 1rem;
                background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px);
                display: flex; justify-content: center; align-items: center;
                z-index: 2147483647; font-family: var(--rx-font-family);
                opacity: 0; transition: opacity 0.3s ease;
            }
            .rx-ad-overlay.visible { opacity: 1; }

            .rx-ad-card {
                background: var(--rx-card-bg); border-radius: var(--rx-radius);
                padding: clamp(1rem, 4vw, 1.5rem); text-align: center; 
                max-width: min(500px, 90vw); width: 100%;
                box-shadow: 0 15px 45px rgba(0,0,0,0.2);
                transform: scale(0.95); transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                display: flex; flex-direction: column; gap: 1rem;
            }
            .rx-ad-overlay.visible .rx-ad-card { transform: scale(1); }

            .rx-ad-card h2 { 
                margin: 0; color: var(--rx-text-dark); 
                font-size: clamp(1.3rem, 4vw, 1.7rem); 
                font-weight: 700; line-height: 1.3;
            }
            .rx-ad-card p { 
                margin: 0; color: var(--rx-text-light); 
                font-size: clamp(0.95rem, 2.5vw, 1.1rem); 
                line-height: 1.5; 
            }
            .rx-ad-card img { 
                width: 100%; height: auto; 
                max-height: 50vh; object-fit: cover; 
                border-radius: calc(var(--rx-radius) - 4px); 
                align-self: center;
            }
            .rx-ad-buttons { 
                display: flex; gap: 0.75rem; 
                justify-content: center; flex-wrap: wrap;
            }
            .rx-ad-buttons button { 
                padding: 0.75rem 1.5rem; border: none; 
                border-radius: 8px; font-weight: 600; 
                font-size: clamp(0.9rem, 3vw, 1rem); 
                cursor: pointer; transition: all 0.2s ease;
                flex: 1 1 auto; min-width: 120px;
            }
            .rx-ad-buttons button:hover { 
                transform: translateY(-2px); 
                box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
            }
            #rx-skip { background: var(--rx-danger); color: white; }
            #rx-skip:disabled { 
                background: #ced4da; cursor: not-allowed; 
                transform: none !important; box-shadow: none !important; 
            }
            #rx-more { background: var(--rx-primary); color: white; }

            /* --- FIXED MODAL STYLES --- */
            .rx-modal {
                position: fixed; inset: 0; padding: 1rem;
                background: rgba(10, 22, 39, 0.8); backdrop-filter: blur(8px);
                z-index: 2147483647; display: flex; justify-content: center; align-items: center;
                opacity: 0; transition: opacity 0.3s ease;
            }
            .rx-modal.visible { opacity: 1; }

            .rx-modal-box {
                background: var(--rx-card-bg); border-radius: var(--rx-radius);
                width: min(750px, 90vw); display: flex; flex-direction: column;
                max-height: 90vh; box-shadow: 0 10px 60px rgba(0,0,0,0.25);
                transform: scale(0.98); transition: transform 0.3s ease;
            }
            .rx-modal.visible .rx-modal-box { transform: scale(1); }
            
            .rx-modal-header {
                flex-shrink: 0; padding: 1.25rem 1.5rem; background: var(--rx-body-bg);
                border-bottom: 1px solid var(--rx-border-color);
                display: flex; justify-content: space-between; align-items: flex-start;
                border-radius: var(--rx-radius) var(--rx-radius) 0 0;
                gap: 1rem;
                position: sticky; top: 0; z-index: 1;
            }
            .rx-modal-header div h2 { 
                margin: 0; color: var(--rx-text-dark); 
                font-size: clamp(1.3rem, 4vw, 1.7rem); 
                font-weight: 700; line-height: 1.3;
            }
            .rx-modal-header div p { 
                margin: 0.25rem 0 0; color: var(--rx-text-light); 
                font-size: clamp(0.9rem, 2vw, 1rem); 
            }
            #rx-close-modal-icon { 
                background: transparent; border: none; 
                font-size: 1.5rem; color: var(--rx-text-light); 
                cursor: pointer; transition: all 0.2s ease; 
                padding: 0.25rem; line-height: 1; flex-shrink: 0;
            }
            #rx-close-modal-icon:hover { 
                color: var(--rx-danger); transform: rotate(90deg); 
            }

            .rx-modal-body {
                flex-grow: 1; padding: 1.5rem; overflow-y: auto; 
                line-height: 1.65; color: var(--rx-text-light);
                font-size: clamp(0.95rem, 2vw, 1rem);
                scroll-padding-top: 1.5rem; /* Ensure content isn't hidden behind sticky header */
            }
            .rx-modal-body::-webkit-scrollbar { width: 8px; }
            .rx-modal-body::-webkit-scrollbar-track { background: var(--rx-body-bg); }
            .rx-modal-body::-webkit-scrollbar-thumb { 
                background-color: #cccccc; border-radius: 10px; 
                border: 2px solid var(--rx-body-bg); 
            }
            .rx-modal-body::-webkit-scrollbar-thumb:hover { background-color: #b3b3b3; }
            
            .rx-modal-body h3 { 
                font-size: clamp(1.1rem, 3vw, 1.3rem); 
                font-weight: 700; color: var(--rx-text-dark); 
                margin: 1.5rem 0 1rem; 
                border-bottom: 2px solid var(--rx-primary); 
                padding-bottom: 0.5rem; display: inline-block; 
                scroll-margin-top: 1.5rem; /* Ensure headings aren't hidden behind sticky header */
            }
            .rx-modal-body h3:first-child { margin-top: 0; }
            .rx-modal-section p { 
                display: flex; align-items: flex-start; 
                gap: 0.75rem; margin-bottom: 0.75rem; 
                word-break: break-word;
            }
            .rx-modal-section i { 
                color: var(--rx-primary); font-size: 1rem; 
                margin-top: 3px; width: 20px; text-align: center; 
                flex-shrink: 0;
            }
            .rx-modal-section a { 
                color: var(--rx-primary); text-decoration: none; 
                word-break: break-all; font-weight: 600; 
            }
            .rx-modal-section a:hover { text-decoration: underline; }
            
            .rx-modal-body ul { 
                list-style: none; padding-left: 1.75rem; 
                margin: 0.5rem 0 1rem;
            }
            .rx-modal-body ul li { 
                position: relative; margin-bottom: 0.75rem; 
                padding-left: 0.5rem;
            }
            .rx-modal-body ul li::before { 
                content: '\\f058'; font-family: 'Font Awesome 6 Free'; 
                font-weight: 900; color: var(--rx-success); 
                position: absolute; left: -1.75rem; top: 3px; 
                font-size: 0.9rem; 
            }
            .rx-modal-map { 
                width: 100%; height: min(400px, 30vh); 
                border: 1px solid var(--rx-border-color); 
                margin: 1rem 0 0; 
                border-radius: calc(var(--rx-radius) - 4px); 
            }
            .rx-modal-footer {
                flex-shrink: 0; padding: 1rem 1.5rem; 
                border-top: 1px solid var(--rx-border-color);
                background: var(--rx-body-bg); text-align: right;
                border-radius: 0 0 var(--rx-radius) var(--rx-radius);
                position: sticky; bottom: 0;
            }
            #rx-close-modal-btn { 
                padding: 0.7rem 1.5rem; background: var(--rx-primary); 
                color: white; border: none; border-radius: 8px; 
                cursor: pointer; font-size: 0.95rem; 
                font-weight: 600; transition: all 0.2s ease; 
            }
            #rx-close-modal-btn:hover { 
                background: var(--rx-text-dark); 
                transform: translateY(-1px);
            }

            @media (max-width: 480px) {
                .rx-modal-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.5rem;
                    padding: 1rem;
                }
                .rx-modal-body {
                    padding: 1rem;
                }
                .rx-ad-buttons button {
                    min-width: 100%;
                }
                .rx-modal-section p {
                    flex-direction: column;
                    gap: 0.25rem;
                }
            }
        `;
        document.head.appendChild(css);

        const adContainer = document.createElement('div');
        adContainer.className = 'rx-ad-overlay';
        adContainer.innerHTML = `
            <div class="rx-ad-card">
                <div>
                    <h2>${ad.title}</h2>
                    <p>${ad.content}</p>
                </div>
                <img src="${ad.image}" alt="${ad.title}" loading="lazy">
                <div class="rx-ad-buttons">
                    <button id="rx-skip" disabled>Skip (${ad.duration})</button>
                    <button id="rx-more">More Details</button>
                </div>
            </div>
        `;

        document.body.appendChild(adContainer);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        setTimeout(() => adContainer.classList.add('visible'), 50);

        const skipBtn = document.getElementById('rx-skip');
        const moreBtn = document.getElementById('rx-more');

        let countdown = ad.duration;
        const interval = setInterval(() => {
            countdown--;
            if (skipBtn) skipBtn.textContent = `Skip (${countdown})`;
            if (countdown <= 0) {
                clearInterval(interval);
                if (skipBtn) {
                    skipBtn.disabled = false;
                    skipBtn.textContent = "Skip";
                }
            }
        }, 1000);
        
        const closeAd = () => {
            adContainer.classList.remove('visible');
            adContainer.addEventListener('transitionend', () => {
                adContainer.remove();
                document.body.style.overflow = originalOverflow;
                document.getElementById('rx-ad-styles')?.remove();
            }, { once: true });
        };
        
        skipBtn.addEventListener('click', closeAd);

        moreBtn.addEventListener('click', () => {
            const contact = ad.contact;
            const phoneLinks = contact.phone.split(',').map(p => `<a href="tel:${p.trim()}">${p.trim()}</a>`).join(', ');
            const websiteLink = contact.website ? `<a href="${contact.website}" target="_blank" rel="noopener noreferrer">${contact.website}</a>` : 'Not available';
            
            const taglineHTML = contact.tagline ? `<p>${contact.tagline}</p>` : '';
            const aboutHTML = contact.about ? `<h3>About Us</h3><p>${contact.about}</p>` : '';
            const servicesHTML = contact.services && contact.services.length > 0 
                ? `<h3>Our Services</h3><ul>${contact.services.map(s => `<li>${s}</li>`).join('')}</ul>` 
                : '';
            const mapHTML = contact.mapEmbedURL ? `<h3>Our Location</h3><iframe class="rx-modal-map" src="${contact.mapEmbedURL}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : '';

            const modal = document.createElement('div');
            modal.className = 'rx-modal';
            modal.innerHTML = `
                <div class="rx-modal-box">
                    <header class="rx-modal-header">
                        <div>
                            <h2>${ad.title}</h2>
                            ${taglineHTML}
                        </div>
                        <button id="rx-close-modal-icon" title="Close"><i class="fas fa-times"></i></button>
                    </header>
                    <div class="rx-modal-body">
                        ${aboutHTML}
                        <h3>Contact Information</h3>
                        <div class="rx-modal-section">
                            <p><i class="fas fa-map-marker-alt"></i> <span>${contact.address}</span></p>
                            <p><i class="fas fa-phone"></i> <span>${phoneLinks}</span></p>
                            <p><i class="fas fa-envelope"></i> <a href="mailto:${contact.email}">${contact.email}</a></p>
                            <p><i class="fas fa-globe"></i> ${websiteLink}</p>
                            <p><i class="fab fa-facebook"></i> <a href="${contact.facebook}" target="_blank" rel="noopener noreferrer">Follow on Facebook</a></p>
                        </div>
                        ${servicesHTML}
                        ${mapHTML}
                    </div>
                    <footer class="rx-modal-footer">
                        <button id="rx-close-modal-btn">Close</button>
                    </footer>
                </div>
            `;
            document.body.appendChild(modal);

            const closeModal = () => {
                modal.classList.remove('visible');
                modal.addEventListener('transitionend', () => modal.remove(), { once: true });
            };

            setTimeout(() => modal.classList.add('visible'), 10);
            document.getElementById('rx-close-modal-icon').addEventListener('click', closeModal);
            document.getElementById('rx-close-modal-btn').addEventListener('click', closeModal);
            
            // Close modal when clicking outside content
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            // Focus on modal content for better accessibility
            const modalBody = modal.querySelector('.rx-modal-body');
            if (modalBody) {
                setTimeout(() => {
                    modalBody.focus();
                    modalBody.scrollTop = 0;
                }, 100);
            }
        });

        setTimeout(() => {
            if (document.body.contains(adContainer)) closeAd();
        }, config.autoCloseTimeout * 1000);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => showAd(adConfig));
    } else {
        showAd(adConfig);
    }
})();