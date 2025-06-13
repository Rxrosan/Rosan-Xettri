document.addEventListener('DOMContentLoaded', function() {
    // Password configuration
    const CORRECT_PASSWORD = "Ro&@n2061";
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    // DOM elements - cache all elements at once
    const elements = {
        loginContainer: document.getElementById('login-container'),
        galleryContainer: document.getElementById('gallery-container'),
        passwordInput: document.getElementById('password-input'),
        loginBtn: document.getElementById('login-btn'),
        errorMessage: document.getElementById('error-message'),
        showPasswordBtn: document.getElementById('show-password'),
        logoutBtn: document.getElementById('logout-btn'),
        searchInput: document.getElementById('search-input'),
        searchBtn: document.getElementById('search-btn'),
        galleryGrid: document.getElementById('gallery-grid'),
        lightbox: document.getElementById('lightbox'),
        lightboxImage: document.getElementById('lightbox-image'),
        closeLightbox: document.getElementById('close-lightbox'),
        downloadBtn: document.getElementById('download-btn'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        filterSelect: document.getElementById('filter-select'),
        lightboxInfo: document.getElementById('lightbox-info')
    };

    // Gallery data - optimized for quick access
    const images =[
        { id: 1, src: 'asset/img/RXG/NCCF.jpg', title: 'RX NCCF', tags: ['National Citizenship Certificate Front'] },
        { id: 2, src: 'asset/img/RXG/NCCB.jpg', title: 'RX NCCB', tags: ['National Citizenship Certificate Back'] },
        { id: 3, src: 'asset/img/RXG/DCP.jpg', title: 'RX DCP', tags: ['DANDAPIDIT Certificate Photocopy'] },
        { id: 4, src: 'asset/img/RXG/MBBCD.jpg', title: 'RX MBBCD', tags: ['MUKTHINAT BIKAS BANK CHECK DETAIL'] },
        { id: 5, src: 'asset/img/RXG/MBBD.jpg', title: 'RX MBBD', tags: ['MUKTHINAT BIKAS BANK DETAIL'] },
        { id: 6, src: 'asset/img/RXG/NEB MC.jpg', title: 'RX NEB MC', tags: ['NEB Migration Certificate'] },
        { id: 7, src: 'asset/img/RXG/NBCD.jpg', title: 'RX NBCD', tags: ['NEPAL BANK CHECK DETAIL'] },
        { id: 8, src: 'asset/img/RXG/NBD.jpg', title: 'RX NBD', tags: ['NEPAL BANK DEATIL'] },
        { id: 9, src: 'asset/img/RXG/BLE GEAC.jpg', title: 'RX BLE GEAC', tags: ['BLE Grade Examination Admission Card'] },
        { id: 10, src: 'asset/img/RXG/G12 EGIF.jpg', title: 'RX G12 EGIF', tags: ['Grade 12 Exam Grade Improvement Farm'] },
        { id: 11, src: 'asset/img/RXG/G12 EF.jpg', title: 'RX G12 EF', tags: ['Grade 12 Exam Farm'] },
        { id: 12, src: 'asset/img/RXG/NEB SRC.jpg', title: 'RX NEB SRC', tags: ['NEB Student Registration Card'] },
        { id: 13, src: 'asset/img/RXG/RKC PD.jpg', title: 'RX RKC PD', tags: ['Rosan KC Passport Detail - 11NOV2024 , 10NOV2034'] },
        { id: 14, src: 'asset/img/RXG/SEE G9RC.jpg', title: 'RX SEE G9RC', tags: ['SEE Grade 9 Registration Certificate'] },
        { id: 15, src: 'asset/img/RXG/SEE G10EC.jpg', title: 'RX SEE G10EC', tags: ['SEE Grade 10 Entrance Card'] },
        { id: 16, src: 'asset/img/RXG/TU 4YR BBS 1ST EEC.jpg', title: 'RX TU 4YR BBS 1ST EEC', tags: ['TU 4yr BBS 1yr Exam Entry Card'] },
        { id: 17, src: 'asset/img/RXG/B.jpg', title: 'RX B', tags: ['Banganga'] },
        { id: 18, src: 'asset/img/RXG/BLE G8GS.jpg', title: 'RX BLE G8GS', tags: ['BLE Grade 8 Grade Sheet'] },
        { id: 19, src: 'asset/img/RXG/GTI CCC 6M.jpg', title: 'RX GTI CCC 6M', tags: ['GTI Computer Course Certificate Of 6 month'] },
        { id: 20, src: 'asset/img/RXG/LGNSS G11GS.jpg', title: 'RX LGNSS G11GS', tags: ['LGNSS Grade 11 Grade Sheet'] },
        { id: 21, src: 'asset/img/RXG/LGNSS T&CC NEB.jpg', title: 'RX LGNSS T&CC NEB', tags: ['LGNSS Transfer & Character Certificate Of NEB'] },
        { id: 22, src: 'asset/img/RXG/LGNSS T&CC SEE.jpg', title: 'RX LGNSS T&CC SEE', tags: ['LGNSS Transfer & Character Certificate Of SEE'] },
        { id: 23, src: 'asset/img/RXG/NIDF RKC.jpg', title: 'RX NIDF RKC', tags: ['National Identity Crad Farm Rosan KC'] },
        { id: 24, src: 'asset/img/RXG/NEB PC.jpg', title: 'RX NEB PC', tags: ['NEB  Provisional Certificate'] },
        { id: 25, src: 'asset/img/RXG/NEB GIEC.jpg', title: 'RX NEB GIEC', tags: ['NEB Grade Improvement Examination Certificate'] },
        { id: 26, src: 'asset/img/RXG/SEE G10C.jpg', title: 'RX SEE G10C', tags: ['SEE Grade 10 Certificate'] },
        { id: 27, src: 'asset/img/RXG/SEE G10GS.jpg', title: 'RX SEE G10GS', tags: ['SEE Grade 10 Grade Sheet'] },
        { id: 28, src: 'asset/img/RXG/SLC G12GS.jpg', title: 'RX SLC G12GS', tags: ['SLC Grade 12 Grade Sheet -  Academic Transcript'] }

    ].map(img => {
        // Pre-compute lowercase versions for faster searching
        return {
            ...img,
            searchTitle: img.title.toLowerCase(),
            searchTags: img.tags.map(tag => tag.toLowerCase())
        };
    });
    
    let currentImageIndex = 0;
    let sessionTimeout;
    let filteredImages = [];
    
    // Event delegation for better performance
    document.addEventListener('click', function(e) {
        // Handle gallery item clicks
        if (e.target.closest('.gallery-item')) {
            const item = e.target.closest('.gallery-item');
            openLightbox(parseInt(item.dataset.index));
            resetSessionTimer();
            return;
        }
        
        // Handle download button clicks
        if (e.target.closest('.download-overlay button')) {
            e.stopPropagation();
            const item = e.target.closest('.gallery-item');
            const index = parseInt(item.dataset.index);
            const image = filteredImages[index];
            downloadImageFromGallery(image.src, image.title);
            resetSessionTimer();
            return;
        }
    });

    // Initialize
    checkLoginStatus();
    
    // Event listeners - optimized
    elements.loginBtn.addEventListener('click', handleLogin);
    elements.showPasswordBtn.addEventListener('click', togglePasswordVisibility);
    elements.passwordInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleLogin());
    elements.logoutBtn.addEventListener('click', logout);
    elements.searchBtn.addEventListener('click', searchImages);
    elements.searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && searchImages());
    elements.closeLightbox.addEventListener('click', closeLightboxView);
    elements.downloadBtn.addEventListener('click', downloadImage);
    elements.prevBtn.addEventListener('click', showPrevImage);
    elements.nextBtn.addEventListener('click', showNextImage);
    elements.filterSelect.addEventListener('change', filterImagesByTag);
    elements.lightbox.addEventListener('click', (e) => e.target === elements.lightbox && closeLightboxView());
    
    // Functions
    function checkLoginStatus() {
        const loggedIn = localStorage.getItem('galleryLoggedIn');
        const loginTime = localStorage.getItem('galleryLoginTime');
        
        if (loggedIn === 'true') {
            const timeSinceLogin = Date.now() - parseInt(loginTime);
            
            if (timeSinceLogin < SESSION_TIMEOUT) {
                elements.loginContainer.style.display = 'none';
                elements.galleryContainer.style.display = 'block';
                loadGallery();
                startSessionTimer();
            } else {
                localStorage.removeItem('galleryLoggedIn');
                localStorage.removeItem('galleryLoginTime');
            }
        }
    }
    
    function handleLogin() {
        const password = elements.passwordInput.value.trim();
        
        if (password === CORRECT_PASSWORD) {
            elements.errorMessage.textContent = '';
            localStorage.setItem('galleryLoggedIn', 'true');
            localStorage.setItem('galleryLoginTime', Date.now().toString());
            
            elements.loginContainer.style.display = 'none';
            elements.galleryContainer.style.display = 'block';
            
            loadGallery();
            startSessionTimer();
        } else {
            elements.errorMessage.textContent = 'Incorrect password. Please try again.';
            elements.passwordInput.value = '';
            elements.passwordInput.focus();
        }
    }
    
    function togglePasswordVisibility() {
        const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
        elements.passwordInput.type = type;
        elements.showPasswordBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    }
    
    function startSessionTimer() {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(() => {
            alert('Your session has expired due to inactivity. Please log in again.');
            logout();
        }, SESSION_TIMEOUT);
    }
    
    function resetSessionTimer() {
        startSessionTimer();
    }
    
    function logout() {
        localStorage.removeItem('galleryLoggedIn');
        localStorage.removeItem('galleryLoginTime');
        clearTimeout(sessionTimeout);
        elements.galleryContainer.style.display = 'none';
        elements.loginContainer.style.display = 'flex';
        elements.passwordInput.value = '';
        elements.passwordInput.focus();
    }
    
    function loadGallery() {
        elements.galleryGrid.innerHTML = '';
        filteredImages = [...images];
        populateTagFilter();
        renderFilteredImages();
    }
    
    function populateTagFilter() {
        const allTags = new Set();
        images.forEach(image => image.tags.forEach(tag => allTags.add(tag)));
        
        elements.filterSelect.innerHTML = '<option value="">All Categories</option>';
        allTags.forEach(tag => {
            const option = new Option(tag.charAt(0).toUpperCase() + tag.slice(1), tag);
            elements.filterSelect.add(option);
        });
    }
    
    function filterImagesByTag() {
        const selectedTag = elements.filterSelect.value;
        filteredImages = selectedTag ? images.filter(img => img.tags.includes(selectedTag)) : [...images];
        renderFilteredImages();
    }
    
    function createGalleryItem(image, index) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.index = index;
        
        const img = new Image();
        img.src = image.src;
        img.alt = image.title;
        img.loading = 'lazy';
        
        const downloadOverlay = document.createElement('div');
        downloadOverlay.className = 'download-overlay';
        downloadOverlay.innerHTML = `
            <p>${image.title}</p>
            <div class="tags-container">
                ${image.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <button><i class="fas fa-download"></i></button>
        `;
        
        galleryItem.append(img, downloadOverlay);
        elements.galleryGrid.appendChild(galleryItem);
    }
    
    function searchImages() {
        const searchTerm = elements.searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            filteredImages = [...images];
        } else {
            filteredImages = images.filter(img => 
                img.searchTitle.includes(searchTerm) || 
                img.searchTags.some(tag => tag.includes(searchTerm))
            );
        }
        
        renderFilteredImages();
    }
    
    function renderFilteredImages() {
        elements.galleryGrid.innerHTML = filteredImages.length 
            ? '' 
            : '<p class="no-results">No images found matching your search.</p>';
        
        // Use document fragment for batch DOM insertion
        const fragment = document.createDocumentFragment();
        filteredImages.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.index = index;
            
            const img = new Image();
            img.src = image.src;
            img.alt = image.title;
            img.loading = 'lazy';
            
            const downloadOverlay = document.createElement('div');
            downloadOverlay.className = 'download-overlay';
            downloadOverlay.innerHTML = `
                <p>${image.title}</p>
                <div class="tags-container">
                    ${image.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button><i class="fas fa-download"></i></button>
            `;
            
            item.append(img, downloadOverlay);
            fragment.appendChild(item);
        });
        
        elements.galleryGrid.appendChild(fragment);
    }
    
    function openLightbox(index) {
        currentImageIndex = index;
        elements.lightboxImage.src = filteredImages[index].src;
        elements.lightboxImage.alt = filteredImages[index].title;
        elements.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightboxInfo();
    }
    
    function updateLightboxInfo() {
        if (elements.lightboxInfo) {
            const image = filteredImages[currentImageIndex];
            elements.lightboxInfo.innerHTML = `
                <h3>${image.title}</h3>
                <div class="lightbox-tags">
                    ${image.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <p>Image ${currentImageIndex + 1} of ${filteredImages.length}</p>
            `;
        }
    }
    
    function closeLightboxView() {
        elements.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        updateLightboxImage();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        updateLightboxImage();
    }
    
    function updateLightboxImage() {
        elements.lightboxImage.src = filteredImages[currentImageIndex].src;
        elements.lightboxImage.alt = filteredImages[currentImageIndex].title;
        updateLightboxInfo();
    }
    
    function downloadImage() {
        const image = filteredImages[currentImageIndex];
        downloadImageFromGallery(image.src, image.title);
    }
    
    function downloadImageFromGallery(src, title) {
        // Try direct download first for better performance
        const link = document.createElement('a');
        link.href = src;
        link.download = generateFilename(title, src);
        
        // Fallback if download attribute isn't supported
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        
        link.dispatchEvent(clickEvent);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
    }
    
    function generateFilename(title, src) {
        const extension = src.split('.').pop().toLowerCase().split(/[#?]/)[0] || 'jpg';
        const cleanTitle = title.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return `${cleanTitle || 'image'}.${extension}`;
    }
    
    // Reset session timer on user activity
    ['mousemove', 'keypress', 'click'].forEach(event => {
        document.addEventListener(event, resetSessionTimer);
    });
});