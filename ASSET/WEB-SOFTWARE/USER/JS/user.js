// --- NEW: Define available custom badge designs and their image paths ---
const badgeDesigns = {
    "ADMIN":  "ASSET/MAIN/IMG/BADGE/ADMIN.png",
    "PARTNER":"ASSET/MAIN/IMG/BADGE/PARTNER.png",
    "MEMBER": "ASSET/MAIN/IMG/BADGE/MEMBER.png",
    "GUEST":  "ASSET/MAIN/IMG/BADGE/GUEST.png" // You might want a specific guest badge image
    // Add more badge types here as needed
};

// Sample user data (for demonstration purposes)
const allUsers = [
    {
        id: "U001",
        userName: "ROSAN",
        fullName: "ROSAN KC",
        email: "rkc242855@gmail.com",
        image: "ASSET/WEB-SOFTWARE/USER/IMG/ROSAN-KC.jpg",
        phone: "9826482279",
        address: "BANGANGA-10, KAPILVASTU",
        accountType: "ADMIN", // accountType is still useful for other logic
        badgeAccess: true,    // Controls if a badge is shown at all
        badgeType: "ADMIN",   // Specifies which badge image to use
        password: "Ro&@n2061",
        access: ["file1", "file2", "file3", "file4", "file5", "file6", "file7","file8","file9","file10","file11",],
        timedAccessConfig: {},
        dateOfBirth: "2004-07-25", //yyyy mm dd
    },
    {
        id: "U002",
        userName: "RITA",
        fullName: "Rita Rana Magar",
        email: "rita24839@gmail.com",
        image: "ASSET/WEB-SOFTWARE/USER/IMG/Rita-Magar.jpg",
        phone: "9807483578",
        address: "BANGANGA-5 ,KAPILVASTU",
        accountType: "PARTNER",
        badgeAccess: true,
        badgeType: "PARTNER",
        password: "RX9807483578",
        access: ["file1","file2","file5","file11",],
        timedAccessConfig: { },
        dateOfBirth: "null", //yyyy mm dd
    },
    {
        id: "U003",
        userName: "KESHAB",
        fullName: "Keshab Disuwa Magar",
        email: "keshabdisuwa7@gmail.com",
        image: "ASSET/WEB-SOFTWARE/USER/IMG/Keshab-Disuwa-Magar.jpg",
        phone: "9748780170",
        address: "BANGANGA-11 ,KAPILVASTU",
        accountType: "MEMBER",
        badgeAccess: true, // No badge for Keshab like , badgeAccess: false
        badgeType: "MEMBER", // Even if no badge, can have a type
        password: "RX9748780170",
        access: ["file11",],
        timedAccessConfig: {
            "file1": { startDate: "2025-08-18", duration: 365 },
            "file2": { startDate: "2025-08-18", duration: 365 },
            "file5": { startDate: "2025-09-16", duration: 365 },
        },
        dateOfBirth: "null", //yyyy mm dd
    },
    {
        id: "U004",
        userName: "ROHIT",
        fullName: "Rohit kc",
        email: "rohitchattri71@gmail.com",
        image: "ASSET/WEB-SOFTWARE/USER/IMG/ROHIT-KC.jpg",
        phone: "9821948199",
        address: "BANGANGA-10, KAPILVASTU",
        accountType: "PARTNER",
        badgeAccess: true,
        badgeType: "PARTNER",
        password: "RX9821948199",
        access: ["file1", "file2", "file3", "file5","file11",],
        timedAccessConfig: { },
        dateOfBirth: "2005-11-17", //yyyy mm dd  NEPALI : Thursday, 2062/8/2
    },
    {
        id: "U005",
        userName: "NIRAJ",
        fullName: "Niraj Thapa",
        email: "nirajthapa54535@gmail.com",
        image: "ASSET/WEB-SOFTWARE/USER/IMG/Niraj.jpg",
        phone: "9800754535",
        address: "BANGANGA-4, GAJEHADA",
        accountType: "MEMBER",
        badgeAccess: true, // No badge for Niraj like , badgeAccess: false
        badgeType: "MEMBER",
        password: "RX9800754535",
        access: ["file11",],
        timedAccessConfig: {
            "file1": { startDate: "2025-08-18", duration: 365 },
            "file2": { startDate: "2025-08-18", duration: 365 },
            "file5": { startDate: "2025-09-16", duration: 365 },
        },
        dateOfBirth: "null", //yyyy mm dd
    },
    {
        id: "U006",
        userName: "SAGAR",
        fullName: "Sagar Giri",
        email: "girisagar745@gmail.com",
        image: "ASSET/WEB-SOFTWARE/USER/IMG/SAGAR.jpg",
        phone: "9701300086",
        address: "JITPUR, KAPILVASTU",
        accountType: "MEMBER",
        badgeAccess: true,
        badgeType: "MEMBER",
        password: "RX9701300086",
        access: ["file11",],
        timedAccessConfig: {
            "file1": { startDate: "2025-09-16", duration: 365 },
            "file2": { startDate: "2025-09-16", duration: 365 },
            "file5": { startDate: "2025-09-16", duration: 365 },
        },
        dateOfBirth: "null", //yyyy mm dd
    },
    {
        id: "U007",
        userName: "MANISHA",
        fullName: "Manisha Tharu",
        email: "manishatharu388@gmail.com",
        image: "ASSET/WEB-SOFTWARE/USER/IMG/MANISHA.jpg",
        phone: "9745397210",
        address: "SALJHANDI, RUPANDEHI",
        accountType: "MEMBER",
        badgeAccess: true, // No badge for Manisha like , badgeAccess: false
        badgeType: "MEMBER",
        password: "RX9745397210",
        access: ["file11",],
        timedAccessConfig: {
            "file1": { startDate: "2025-09-17", duration: 365 },
            "file2": { startDate: "2025-09-17", duration: 365 },
            "file5": { startDate: "2025-09-17", duration: 365 },
        },
        dateOfBirth: "null", //yyyy mm dd
    }
];
// Content Cards Database
const contentCards = [
    {   
        id: "file1", 
        title: "F1- QUESTION-MODEL-1", 
        description: "LESSON A 1 - 10L", 
        link: "KR-EXAM.html?exam=file1", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100" }
    },
    
    {   
        id: "file2", 
        title: "F2- RX-QR-Scanner/Generator", 
        description: "You can create personalized messages using a QR code with this app.", 
        link: "ASSET/WEB-SOFTWARE/RX-S-QR.html", 
        icon: "fas fa-qrcode",
        prices: { default: "Rs. 100" }
    },
    
    {   
        id: "file3", 
        title: "F3- कपाली तमसुक", 
        description: "कुनै सम्पत्ति धिताे, बन्धक नराखी ब्याज र प्रतिशतकाे हिसाब गरी बुझाउने मिति ताेकिएकाे नबुझाइ भाका नाघे साहुकाे थैलि मेराे घर घरना बाट असुल गरी लिनु भनी असामिकाे विश्वासमा लेखी दिएकाे तमसुक  <br>Login Code: RX-2061", 
        link: "LEKA-PADI.html?exam=file3", 
        icon: "fas fa-pencil",
        prices: { default: "Rs. 600",}
    },
    {   
        id: "file4", 
        title: "F4- QUESTION MODEL 2", 
        description: "LESSON A 11 - 20 L | UPDATING IN PROGRESS...", 
        link: "KR-EXAM.html?exam=file4", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100",}
    },
    {   
        id: "file5", 
        title: "F5- QUESTION MODEL 3", 
        description: "ALL OVER BOOK RESOURCE", 
        link: "KR-EXAM.html?exam=file5", 
        icon: "fas fa-book",
        prices: { default: "Rs. 100",}
    },
    {   
        id: "file6", 
        title: "F6- राजीनामा ", 
        description: "साहुबाट असामीले कर्जा लिएकाे रूपैँया बापत आफ्नाे हक अधिकार सदाकाे निमित्त समाप्त हुने गरी साहुले भाेग गर्न पाउने गरी कुनै सम्पत्तिकाे हक छाडी गरी दिएकाे लिखित<br>Login Code: RX-2061", 
        link: "LEKA-PADI.html?exam=file6", 
        icon: "fas fa-pen",
        prices: { default: "Rs. 600",}
    },
    {   
        id: "file7", 
        title: "F7- राजीनामा हराएमा व्यहाेरा जनाई गरिदिएकाे राजीनामा ", 
        description: "Login Code: RX-2061", 
        link: "LEKA-PADI.html?exam=file7", 
        icon: "fas fa-pencil",
        prices: { default: "Rs. 600",}
    },
    {   
        id: "file8", 
        title: "F8- दृष्टिबन्धक तमसुक ", 
        description: "साहुकाे रूपैयाँ धिताे नराखी यति ब्याज याे मितिमा बुझाउने, नभए साँवा ब्याज नबुझाएसम्म फलानाे सम्पत्ति भाेग चलन गर्ने र कच्चा ठहरे साहुले मेराे घर घरानाबाट असुल गर्ने भनेर लेखिएकाे तमसुक<br>UPDATE IN PROGRESS...<br>Login Code: RX-2061", 
        link: "LEKA-PADI.html?exam=file8", 
        icon: "fas fa-pen",
        prices: { default: "Rs. 600",}
    },
    {   
        id: "file9", 
        title: "F9- लखबन्धक तमसुक ", 
        description: "चल अचल भाेगबन्धक वा दृष्टिबन्धक लिइ राख्नेले तमसुक बमाेजिम वम त्यसभन्दा घटी लिइ अर्काे साहुलाइ भाेगबन्धक वा दृष्टिबन्धक लेखी दिएकाे लिखत पछि लिनेले अघिकाे भन्दा बढ्ता थैलि लिएकाे र करार लेखेकाे सदर हुदैन <br>UPDATE IN PROGRESS...<br>Login Code: RX-2061", 
        link: "LEKA-PADI.html?exam=file9", 
        icon: "fas fa-pencil",
        prices: { default: "Rs. 600",}
    },
    {   
        id: "file10", 
        title: "F10- भाेगबन्धक तमसुक ", 
        description: "साहुकाे थैली वापत रूपैयाँ नबुझाएसम्म सकहुलाइ आसामीले कुनै सम्पत्ति भाेग गर्न नपाइने गरी लेखी दिएकाे लिखित<br>UPDATE IN PROGRESS...<br>Login Code: RX-2061", 
        link: "LEKA-PADI.html?exam=file10", 
        icon: "fas fa-pen",
        prices: { default: "Rs. 600",}
    },
    {   
        id: "file11", 
        title: "F11- RX IMG CONVERTER ", 
        description: "LOGIN CODE : RX2061 <br>Easily encode images to text and decode back to images", 
        link: "ASSET/WEB-SOFTWARE/RX-IMG-CONVERTER.html", 
        icon: "fas fa-tools",
        prices: { default: "Rs. 600",}
    }
];

// Developer-Managed Stores
const defaultStores = [
    {   id: "store_1", 
        name: "LEKHA-PADI", 
        content: ["file3", "file6", "file7", "file8", "file9","file10"] },

    {   id: "store_2", 
        name: "EPS-EXAM-QUESTION", 
        content: ["file1","file4","file5"] },

    {   id: "store_3", 
        name: "WEB-SOFTWARE", 
        content: ["file2","file11",] },
];

// ===== USER MANAGEMENT MODULE =====
const UserManager = (() => {
    // Create a guest user
   const createGuestUser = () => {
    return {
        id: "UNKNOWN",
        isGuest: true,
        userName: "GUEST",
        fullName: "RX STUDIO",
        email: "UNKNOWN",
        image: "ASSET/WEB-SOFTWARE/USER/IMG/USER.png",
        phone: "UNKNOWN",
        address: "UNKNOWN",
        accountType: "GUEST",
        access: ["file2","file11",],
        timedAccessConfig: {},
        //badgeAccess: true, // Decide if guests should show a badge
        //badgeType: "GUEST" // Assign a badge type for guests
    };
};
    // Save user data to localStorage
    const saveUserData = (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Also store a flag to track if user has already seen the login notification
        if (!user.isGuest) {
            localStorage.setItem('hasLoggedInBefore', 'true');
        }
    };

    // Get user data from localStorage
    const getUserData = () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    };

    // Check if user has logged in before
    const hasUserLoggedInBefore = () => {
        return localStorage.getItem('hasLoggedInBefore') === 'true';
    };

    // Get current logged-in user
    const getCurrentUser = () => {
        return getUserData();
    };
    
// Update verification badges based on badgeAccess and badgeType
const updateVerificationBadges = (user) => {
    const profileBadge = document.getElementById('profile-badge');
    const dropdownBadge = document.getElementById('dropdown-badge');

    // Reset badges: clear content and hide by default
    [profileBadge, dropdownBadge].forEach(badge => {
        if (badge) {
            badge.innerHTML = ''; // Clear any existing img
            badge.style.display = 'none'; // Hide by default
        }
    });

    // Only proceed if badgeAccess is explicitly true for the user
    if (user.badgeAccess && user.badgeType) {
        const badgeImageUrl = badgeDesigns[user.badgeType];

        if (badgeImageUrl) {
            [profileBadge, dropdownBadge].forEach(badge => {
                if (badge) {
                    badge.style.display = 'flex'; // Show the badge container

                    const badgeImg = document.createElement('img');
                    badgeImg.src = badgeImageUrl;
                    badgeImg.alt = `${user.badgeType} Badge`;
                    badgeImg.classList.add('badge-image'); // Add a class for CSS styling

                    badge.appendChild(badgeImg);
                }
            });
        }
    }
};

// Update UI with user data
const updateUIWithUserData = (user) => {
    document.getElementById('username').textContent = user.isGuest ? 'GUEST' : user.userName;
    document.getElementById('profile-img').src = user.image;
    document.getElementById('dropdown-img').src = user.image;
    document.getElementById('dropdown-name').textContent = user.fullName;
    document.getElementById('dropdown-email').textContent = user.email;
    document.getElementById('dropdown-phone').textContent = user.phone;
    document.getElementById('dropdown-address').textContent = user.address;
    document.getElementById('dropdown-user-id').textContent = user.id;
    document.getElementById('dropdown-account-type').textContent = user.accountType;

    // Update verification badges
    updateVerificationBadges(user);

    // Show/hide admin settings link
    const adminSettingsLink = document.getElementById('admin-settings-link');
    if (user.accountType === "ADMIN") {
        adminSettingsLink.style.display = 'flex'; // Use flex to match other nav links
    } else {
        adminSettingsLink.style.display = 'none';
    }
};

    // Login user with credentials
const loginUser = (email, password) => {
    const foundUser = allUsers.find(user => user.email === email && user.password === password);
    if (foundUser) {
        saveUserData(foundUser);
        updateUIWithUserData(foundUser);
        
        // Add birthday system initialization
        BirthdayManager.initBirthdaySystem(foundUser);

            ModalManager.hideModal('login-modal'); // Assuming ModalManager is accessible
            NotificationManager.hideNotification(); // Assuming NotificationManager is accessible

            // Clear login form fields
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';

            // If admin, show admin notification
            if (foundUser.accountType === "ADMIN") {
                NotificationManager.showNotification("Welcome Admin!", "You have successfully logged in as an administrator.", "success", 8000); // 8 seconds for admin
            } else {
                NotificationManager.showNotification("Welcome Back!", `You have successfully logged in as ${foundUser.fullName}.`, "success");
            }

            return true;
        } else {
            alert("Invalid email or password."); // Basic error feedback
            return false;
        }
    };

    // Logout user and return to guest mode
    const logoutUser = () => {
        const guestUser = createGuestUser();
        saveUserData(guestUser);
        updateUIWithUserData(guestUser);
        NotificationManager.showNotification("Logged Out", "You have been logged out. Please login to access your account.", "warning");
    };

    // Initialize user state
    const initUser = () => {
        let user = getUserData();

        if (!user || user.isGuest) { 
            // If no user or it's a guest user, ensure guest notification is shown
            user = createGuestUser(); // Always start with a fresh guest user if not logged in
            saveUserData(user); // Save to persist guest state across refreshes
            
            // Only show guest notification if user has never logged in before
            if (!hasUserLoggedInBefore()) {
                NotificationManager.showNotification("You are logged in as Guest", "To access your real account, please login", "warning");
            }
        } else {
            // If a real user is already logged in, only show welcome back notification 
            // if they haven't seen it before (first time login)
            if (!hasUserLoggedInBefore()) {
                NotificationManager.showNotification("Welcome Back!", `You are logged in as ${user.fullName}.`, "success", 3000);
            }
        }

        updateUIWithUserData(user);
    };

    // Check if user has access to a file
    const hasAccessToFile = (userId, fileId) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return false;
        
        // Check permanent access
        if (user.access && user.access.includes(fileId)) return true;
        
        // Check timed access
        const fileConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
        if (fileConfig && fileConfig.startDate && fileConfig.duration) {
            const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`);
            const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000);
            return timedAccessEnd > Date.now();
        }
        
        return false;
    };

    // Get remaining time for timed access
    const getRemainingTime = (userId, fileId) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return 0;
        
        const fileConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
        if (fileConfig && fileConfig.startDate && fileConfig.duration) {
            const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`);
            const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000);
            const remaining = timedAccessEnd - Date.now();
            return remaining > 0 ? remaining : 0;
        }
        
        return 0;
    };

    return {
        initUser,
        loginUser,
        logoutUser,
        getCurrentUser,
        hasUserLoggedInBefore,
        hasAccessToFile,
        getRemainingTime
    };
})();

// ===== NOTIFICATION MODULE =====
const NotificationManager = (() => {
    // Show guest notification
    const showNotification = (title, message, type = "warning", duration = 5000) => {
        const notification = document.getElementById('guest-notification');
        const icon = notification.querySelector('i');
        const notificationTitle = document.getElementById('notification-title');
        const notificationMessage = document.getElementById('notification-message');

        // Reset classes
        notification.classList.remove('show');
        notification.style.borderLeftColor = ''; // Clear previous color

        // Set content
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;

        // Set type-specific styling
        if (type === "warning") {
            icon.className = 'fas fa-info-circle';
            icon.style.color = 'var(--warning)';
            notification.style.borderLeftColor = 'var(--warning)';
        } else if (type === "success") {
            icon.className = 'fas fa-check-circle';
            icon.style.color = 'var(--success)';
            notification.style.borderLeftColor = 'var(--success)';
        } else if (type === "info") {
            icon.className = 'fas fa-info-circle';
            icon.style.color = 'var(--accent)';
            notification.style.borderLeftColor = 'var(--accent)';
        }

        notification.classList.add('show');

        // Hide notification after duration
        if (NotificationManager.timeoutId) {
            clearTimeout(NotificationManager.timeoutId);
        }
        NotificationManager.timeoutId = setTimeout(() => {
            hideNotification();
        }, duration);
    };

    // Hide guest notification
    const hideNotification = () => {
        const notification = document.getElementById('guest-notification');
        notification.classList.remove('show');
        if (NotificationManager.timeoutId) {
            clearTimeout(NotificationManager.timeoutId);
        }
    };

    return {
        showNotification,
        hideNotification,
        timeoutId: null // To store the timeout ID
    };
})();

// ===== ADMIN PANEL MODULE =====
const AdminPanelManager = (() => {
    const renderMemberList = () => {
        const memberListUl = document.getElementById('member-list');
        memberListUl.innerHTML = ''; // Clear existing list

        allUsers.forEach(user => {
            if (user.accountType !== "ADMIN") { // Only show members, not admins, in the member list
                const li = document.createElement('li');
                li.dataset.userId = user.id;
                li.innerHTML = `
                    <img src="${user.image}" alt="${user.fullName}">
                    <span>${user.fullName} (${user.userName})</span>
                `;
                li.addEventListener('click', () => selectUser(user.id));
                memberListUl.appendChild(li);
            }
        });
    };

    const displayUserDetails = (userId) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) {
            document.getElementById('selected-user-header').textContent = 'User not found.';
            document.getElementById('selected-user-details').style.display = 'none';
            return;
        }

        document.getElementById('selected-user-header').textContent = `Details for ${user.fullName}`;
        document.getElementById('selected-user-details').style.display = 'block';

        document.getElementById('admin-user-id').textContent = user.id;
        document.getElementById('admin-full-name').textContent = user.fullName;
        document.getElementById('admin-email').textContent = user.email;
        document.getElementById('admin-phone').textContent = user.phone;
        document.getElementById('admin-address').textContent = user.address;
        document.getElementById('admin-account-type').textContent = user.accountType;
        document.getElementById('admin-profile-img').src = user.image;

        // Display access information
        const accessDetailsContainer = document.getElementById('admin-access-details');
        if (accessDetailsContainer) {
            accessDetailsContainer.innerHTML = '';
            
            // Create access details section
            const accessSection = document.createElement('div');
            accessSection.className = 'detail-section';
            accessSection.innerHTML = '<h4>File Access Details</h4>';
            
            // Create table for access details
            const table = document.createElement('table');
            table.className = 'access-table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>File</th>
                        <th>Access Type</th>
                        <th>Status</th>
                        <th>Remaining Time</th>
                    </tr>
                </thead>
                <tbody>
                    ${contentCards.map(card => {
                        const hasPermanentAccess = user.access && user.access.includes(card.id);
                        const hasTimedAccess = user.timedAccessConfig && user.timedAccessConfig[card.id];
                        let accessType = "No Access";
                        let status = "Not Available";
                        let remainingTime = "N/A";
                        
                        if (hasPermanentAccess) {
                            accessType = "Permanent";
                            status = "Active";
                        } else if (hasTimedAccess) {
                            accessType = "Timed";
                            const remaining = UserManager.getRemainingTime(user.id, card.id);
                            if (remaining > 0) {
                                const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
                                const h = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                                const s = Math.floor((remaining % (1000 * 60)) / 1000);
                                status = "Active";
                                remainingTime = `${d}d ${h}h ${m}m ${s}s`;
                            } else {
                                status = "Expired";
                            }
                        }
                        
                        return `
                            <tr>
                                <td>${card.title} (${card.id})</td>
                                <td>${accessType}</td>
                                <td class="${status.toLowerCase()}">${status}</td>
                                <td>${remainingTime}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            `;
            
            accessSection.appendChild(table);
            accessDetailsContainer.appendChild(accessSection);
        }

        // Update selected class in sidebar
        document.querySelectorAll('#member-list li').forEach(item => {
            item.classList.remove('selected');
            if (item.dataset.userId === userId) {
                item.classList.add('selected');
            }
        });
    };

    const selectUser = (userId) => {
        displayUserDetails(userId);
    };

    const openAdminPanel = () => {
        const currentUser = UserManager.getCurrentUser();
        if (currentUser && currentUser.accountType === "ADMIN") {
            renderMemberList();
            // Clear previous details when opening
            document.getElementById('selected-user-header').textContent = 'Select a Member to View Details';
            document.getElementById('selected-user-details').style.display = 'none';
            document.querySelectorAll('#member-list li').forEach(item => item.classList.remove('selected'));
            ModalManager.showModal('admin-panel-modal');
        } else {
            NotificationManager.showNotification("Access Denied", "You do not have administrative privileges.", "danger", 4000);
        }
    };

    return {
        openAdminPanel
    };
})();

// ===== STORE MANAGEMENT MODULE =====
const StoreManager = (() => {
    let stores = [];
    let currentStoreId = null;

    // Initialize stores
    const initializeStores = () => {
        const savedStores = JSON.parse(localStorage.getItem('lekhapadi_stores')) || [];
        stores = defaultStores.map(devStore => {
            const savedStore = savedStores.find(s => s.id === devStore.id);
            return { ...devStore, name: savedStore ? savedStore.name : devStore.name };
        });
        localStorage.setItem('lekhapadi_stores', JSON.stringify(stores));
        if (stores.length > 0 && !currentStoreId) {
            currentStoreId = stores[0].id;
        }
    };

    // Render store navigation
    const renderStoreNavigation = () => {
        const navContainer = document.getElementById('storeNavigation');
        if (!navContainer) return;
        navContainer.innerHTML = '';
        stores.forEach(store => {
            const button = document.createElement('button');
            button.className = 'store-btn';
            button.textContent = store.name;
            button.onclick = () => switchStore(store.id);
            if (store.id === currentStoreId) button.classList.add('active');
            navContainer.appendChild(button);
        });
        const manageButton = document.createElement('button');
        manageButton.className = 'store-btn manage-btn';
        manageButton.innerHTML = '<i class="fas fa-cog"></i> Manage Stores';
        manageButton.onclick = openStoreManager;
        navContainer.appendChild(manageButton);
    };

    // Switch store
    const switchStore = (storeId) => {
        currentStoreId = storeId;
        const store = stores.find(s => s.id === storeId);
        if (store) {
            const storeTitle = document.getElementById('storeTitle');
            if (storeTitle) storeTitle.innerHTML = `<i class="fas fa-store"></i> ${store.name}`;
            renderStoreNavigation();
            renderContentCards();
        }
    };

    // Render content cards
    const renderContentCards = () => {
        const cardsContainer = document.getElementById('contentCards');
        if (!cardsContainer) return;

        cardsContainer.innerHTML = '';
        const store = stores.find(s => s.id === currentStoreId);
        if (!store || store.content.length === 0) {
            cardsContainer.innerHTML = '<p class="no-content">No content available in this store.</p>';
            return;
        }
        
        const storeContent = contentCards.filter(card => store.content.includes(card.id));
        const currentUser = UserManager.getCurrentUser();

        storeContent.forEach(card => {
            const permanentAccess = currentUser.access && currentUser.access.includes(card.id);
            
            let timedAccessEnd = null;
            const cardConfig = currentUser.timedAccessConfig ? currentUser.timedAccessConfig[card.id] : null;

            if (cardConfig && cardConfig.startDate && cardConfig.duration) {
                const startDate = new Date(`${cardConfig.startDate}T00:00:00Z`);
                timedAccessEnd = startDate.getTime() + (cardConfig.duration * 24 * 60 * 60 * 1000);
            }

            const isExpired = timedAccessEnd && timedAccessEnd <= Date.now();
            const hasAccess = permanentAccess || (timedAccessEnd && !isExpired);

            const cardElement = document.createElement('div');
            cardElement.className = `card ${hasAccess ? '' : 'locked'}`;
            let detailsHtml = '';
            let buttonHtml = '';

            if (hasAccess) {
                detailsHtml = `<p>${card.description}</p>`;
                if (timedAccessEnd && !permanentAccess) {
                    detailsHtml += `<div class="countdown-container"><p>Time Remaining:</p><p class="countdown" data-expiration="${timedAccessEnd}" id="countdown-${card.id}"></p></div>`;
                }
                
                // Check if the card is an exam and use the special launcher
                if (card.link.includes("KR-EXAM.html")) {
                    buttonHtml = `<a href="#" onclick="prepareAndLaunchExam('${card.id}', '${card.link}')"><i class="fas fa-external-link-alt"></i> Open</a>`;
                } else {
                    buttonHtml = `<a href="${card.link}"><i class="fas fa-external-link-alt"></i> Open</a>`;
                }
            } else {
                if (isExpired) {
                    detailsHtml = `<p class="time-limit-expired">Your timed access has expired.</p>`;
                    buttonHtml = `<button class="purchase-btn" onclick="requestAccess('${card.id}', true)"><i class="fas fa-envelope"></i> Request Renewal</button>`;
                } else {
                    const price = getPriceForUser(card, currentUser);
                    detailsHtml = `<p>Purchase to get access.</p><div class="price">${price}</div>`;
                    buttonHtml = `<button class="purchase-btn" onclick="requestAccess('${card.id}', false)"><i class="fas fa-shopping-cart"></i> Purchase Access</button>`;
                }
            }
            cardElement.innerHTML = `<i class="${card.icon || 'fas fa-file'} card-icon"></i><h3>${card.title}</h3>${detailsHtml}${!hasAccess ? '<div class="lock-icon"><i class="fas fa-lock"></i></div>' : ''}${buttonHtml}`;
            cardsContainer.appendChild(cardElement);
        });

        startCountdownTimers();
    };

    // Get price for user
    const getPriceForUser = (card, user) => {
        if (!card.prices) return "Not for sale";
        if (user && card.prices[user.id]) return card.prices[user.id];
        return card.prices.default || "Contact for price";
    };

    // Start countdown timers
    const startCountdownTimers = () => {
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(updateCountdowns, 1000);
    };

    // Update countdowns
    const updateCountdowns = () => {
        const countdownElements = document.querySelectorAll('.countdown');
        if (countdownElements.length === 0) {
            clearInterval(countdownInterval);
            return;
        }
        countdownElements.forEach(el => {
            const expirationTime = parseInt(el.getAttribute('data-expiration'), 10);
            const remaining = expirationTime - Date.now();
            if (remaining <= 0) {
                el.innerHTML = "Expired";
                if (!el.classList.contains('expired')) {
                    el.classList.add('expired');
                    setTimeout(renderContentCards, 1500);
                }
                return;
            }
            const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const h = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((remaining % (1000 * 60)) / 1000);
            el.innerHTML = `<b>${d}</b>d <b>${h}</b>h <b>${m}</b>m <b>${s}</b>s`;
        });
    };

    // Prepare and launch exam
    const prepareAndLaunchExam = (examId, examUrl) => {
        if (!examId || !examUrl) {
            console.error("Cannot launch exam: Missing examId or examUrl.");
            return;
        }
        console.log(`Preparing to launch exam. ID: ${examId}`);
        localStorage.setItem('selectedExamId', examId);
        window.location.href = examUrl;
    };

    // Request access
    const requestAccess = (contentId, isRenewal) => {
        const card = contentCards.find(c => c.id === contentId);
        if (!card) {
            console.error("Card data not found for ID:", contentId);
            return;
        }

        const modalTitleEl = document.getElementById('modalTitle');
        const modalPriceEl = document.getElementById('modalPrice');
        const facebookLink = document.getElementById('facebookContactLink');
        const emailLink = document.getElementById('emailContactLink');

        if (!modalTitleEl || !modalPriceEl || !facebookLink || !emailLink) {
            alert("Error: The contact modal HTML is missing or has incorrect IDs. Please check the dashboard file.");
            return;
        }

        const price = getPriceForUser(card, UserManager.getCurrentUser());
        let subject = '';

        if (isRenewal) {
            modalTitleEl.textContent = `Request Renewal: ${card.title}`;
            modalPriceEl.textContent = `Please contact us to discuss renewal options.`;
            subject = `Renewal Inquiry for ${card.title} (User: ${UserManager.getCurrentUser().username})`;
        } else {
            modalTitleEl.textContent = `Purchase Access: ${card.title}`;
            modalPriceEl.textContent = `Price: ${price}`;
            subject = `Purchase Inquiry for ${card.title} (User: ${UserManager.getCurrentUser().username})`;
        }

        facebookLink.href = "https://www.facebook.com/RosanXettri.2004"; 
        emailLink.href = `mailto:rkc242855@gmail.com?subject=${encodeURIComponent(subject)}`;
        
        showModal('purchaseModal');
    };

    // Open store manager
    const openStoreManager = () => {
        const modal = document.getElementById('storeManagerModal');
        if (modal) {
            renderStoreManagerList();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    // Close store manager
    const closeStoreManager = () => {
        const modal = document.getElementById('storeManagerModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Render store manager list
    const renderStoreManagerList = () => {
        const listContainer = document.getElementById('storeManagerList');
        if (!listContainer) return;
        listContainer.innerHTML = '';
        stores.forEach(store => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-store"></i> <input type="text" value="${store.name}" data-id="${store.id}" placeholder="Store Name">`;
            listContainer.appendChild(li);
        });
    };

    // Save store changes
    const saveStoreChanges = () => {
        const inputs = document.querySelectorAll('#storeManagerList input[type="text"]');
        inputs.forEach(input => {
            const storeId = input.getAttribute('data-id');
            const newName = input.value.trim();
            const store = stores.find(s => s.id === storeId);
            if (store && newName) store.name = newName;
        });
        localStorage.setItem('lekhapadi_stores', JSON.stringify(stores));
        closeStoreManager();
        renderStoreNavigation();
        if (currentStoreId) switchStore(currentStoreId);
    };

    return {
        initializeStores,
        renderStoreNavigation,
        renderContentCards,
        prepareAndLaunchExam,
        requestAccess,
        openStoreManager,
        closeStoreManager,
        saveStoreChanges
    };
})();

// Global variables
let countdownInterval = null;

// ===== INITIALIZATION (User and Admin specific) =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user state
    UserManager.initUser();
     // Initialize birthday system
    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
        BirthdayManager.initBirthdaySystem(currentUser);
    }

    // Initialize stores if on dashboard
    if (document.getElementById('storeNavigation')) {
        StoreManager.initializeStores();
        StoreManager.renderStoreNavigation();
        StoreManager.renderContentCards();
    }

    // Event listeners for user-related actions
    document.getElementById('login-btn').addEventListener('click', () => {
        ModalManager.showModal('login-modal');
    });

    document.getElementById('modal-login-btn').addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        UserManager.loginUser(email, password);
    });

    document.getElementById('logout-btn').addEventListener('click', UserManager.logoutUser);

    document.querySelector('.profile-button').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click listener from immediately closing dropdown
        document.getElementById('profile-dropdown').classList.toggle('show');
    });

    // Event listener for Admin Super Settings link
    document.getElementById('admin-settings-link').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        AdminPanelManager.openAdminPanel();
    });
});

// Global functions for HTML onclick attributes
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
    document.body.style.overflow = 'auto';
}

// Add CSS for admin panel enhancements
const style = document.createElement('style');
style.textContent = `
.detail-section {
    margin-top: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: 100%;
    box-sizing: border-box;
}

.detail-section h4 {
    margin-top: 0;
    color: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 8px;
    font-size: clamp(1.1rem, 2.5vw, 1.3rem);
}

.access-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
}

.access-table table {
    width: 100%;
    min-width: 500px;
}

.access-table th, .access-table td {
    padding: clamp(6px, 2vw, 12px) clamp(8px, 2vw, 12px);
    text-align: left;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
    font-size: clamp(0.8rem, 2vw, 0.9rem);
}

.access-table th {
    background-color: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    font-weight: bold;
    color: rgba(255, 255, 255, 0.9);
    font-size: clamp(0.85rem, 2vw, 0.95rem);
}

.access-table tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.05);
}

.access-table .active {
    color: #4ade80;
    font-weight: bold;
}

.access-table .expired {
    color: #f87171;
    font-weight: bold;
}

.countdown-container {
    margin-top: 10px;
    padding: clamp(8px, 2vw, 12px);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
}

.countdown {
    font-family: monospace;
    font-size: clamp(0.8rem, 2.5vw, 0.9rem);
    color: rgba(255, 255, 255, 0.8);
    word-break: break-all;
}

.countdown.expired {
    color: #f87171;
    font-weight: bold;
}

.time-limit-expired {
    color: #f87171;
    font-weight: bold;
    font-size: clamp(0.85rem, 2.5vw, 1rem);
}

/* Mobile First Responsive Design */
@media (max-width: 768px) {
    .detail-section {
        margin-top: 15px;
        padding: 12px;
        border-radius: 6px;
    }
    
    .access-table {
        margin-top: 8px;
        border-radius: 4px;
    }
    
    .access-table th, .access-table td {
        padding: 6px 8px;
        font-size: 0.8rem;
    }
    
    .access-table th {
        font-size: 0.82rem;
    }
    
    .countdown-container {
        margin-top: 8px;
        padding: 8px;
    }
}

@media (max-width: 480px) {
    .detail-section {
        margin-top: 12px;
        padding: 10px;
        border-radius: 4px;
    }
    
    .detail-section h4 {
        font-size: 1rem;
        padding-bottom: 6px;
    }
    
    .access-table th, .access-table td {
        padding: 4px 6px;
        font-size: 0.75rem;
    }
    
    .access-table th {
        font-size: 0.77rem;
    }
    
    .countdown {
        font-size: 0.75rem;
    }
    
    .time-limit-expired {
        font-size: 0.8rem;
    }
}

/* Tablet and Small Desktop */
@media (min-width: 769px) and (max-width: 1024px) {
    .detail-section {
        padding: 18px;
    }
    
    .access-table th, .access-table td {
        padding: 10px 14px;
    }
}

/* Large Desktop */
@media (min-width: 1025px) {
    .detail-section {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .access-table {
        max-width: 100%;
    }
}

/* Extra Small Devices */
@media (max-width: 360px) {
    .detail-section {
        padding: 8px;
        margin-top: 10px;
    }
    
    .detail-section h4 {
        font-size: 0.9rem;
    }
    
    .access-table th, .access-table td {
        padding: 3px 4px;
        font-size: 0.7rem;
    }
    
    .countdown {
        font-size: 0.7rem;
    }
}

/* High DPI Screens */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .detail-section {
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    }
    
    .access-table th {
        backdrop-filter: blur(15px);
    }
    
    .countdown-container {
        backdrop-filter: blur(15px);
    }
}

/* Landscape Mobile */
@media (max-width: 768px) and (orientation: landscape) {
    .detail-section {
        padding: 10px;
    }
    
    .access-table {
        max-height: 200px;
        overflow-y: auto;
    }
    
    .access-table th, .access-table td {
        padding: 4px 6px;
    }
}

/* Print Styles */
@media print {
    .detail-section {
        background: white;
        border: 1px solid #000;
        color: #000;
    }
    
    .detail-section h4 {
        color: #000;
        border-bottom-color: #000;
    }
    
    .access-table th, .access-table td {
        color: #000;
        border-color: #000;
    }
    
    .access-table th {
        background-color: #f0f0f0;
    }
    
    .countdown-container {
        background-color: #f0f0f0;
        border-color: #000;
    }
    
    .countdown {
        color: #000;
    }
}
`;
document.head.appendChild(style);

// ===== BIRTHDAY SYSTEM WITH FLOATING CAKE ICON =====
const BirthdayManager = (() => {
    const birthdayCardStorageKey = 'birthdayCardShown';
    const cakePositionKey = 'birthdayCakePosition';
    let currentCakeElement = null;

    // Check if today is user's birthday
    const isBirthdayToday = (birthDate) => {
        if (!birthDate) return false;
        
        const today = new Date();
        const birth = new Date(birthDate);
        
        return today.getMonth() === birth.getMonth() && 
               today.getDate() === birth.getDate();
    };

    // Calculate age from birth date
    const calculateAge = (birthDate) => {
        if (!birthDate) return 0;
        
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    // Format date to "YEAR MONTH DATE" format
    const formatBirthDate = (birthDate) => {
        if (!birthDate) return '';
        
        const date = new Date(birthDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Create floating cake icon
    const createFloatingCake = (user) => {
        // Remove existing cake if any
        removeFloatingCake();

        const cakeHTML = `
            <div id="floating-birthday-cake" class="floating-cake">
                <div class="cake-icon">🎂</div>
                <div class="cake-sparkle"></div>
                <div class="cake-sparkle"></div>
                <div class="cake-sparkle"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', cakeHTML);
        
        currentCakeElement = document.getElementById('floating-birthday-cake');
        
        // Load saved position or set default
        const savedPosition = localStorage.getItem(cakePositionKey);
        if (savedPosition) {
            const { x, y } = JSON.parse(savedPosition);
            currentCakeElement.style.left = x;
            currentCakeElement.style.top = y;
        } else {
            // Default position (bottom right)
            currentCakeElement.style.right = '20px';
            currentCakeElement.style.bottom = '20px';
        }

        // Add event listeners
        currentCakeElement.addEventListener('click', () => showBirthdayCard(user));
        makeElementDraggable(currentCakeElement);
        
        // Add cake styles
        addCakeStyles();
    };

    // Make element draggable
    const makeElementDraggable = (element) => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.onmousedown = dragMouseDown;
        element.ontouchstart = dragTouchStart;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function dragTouchStart(e) {
            e.preventDefault();
            const touch = e.touches[0];
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDragTouch;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            const newTop = (element.offsetTop - pos2) + "px";
            const newLeft = (element.offsetLeft - pos1) + "px";
            
            element.style.top = newTop;
            element.style.left = newLeft;
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }

        function elementDragTouch(e) {
            e.preventDefault();
            const touch = e.touches[0];
            pos1 = pos3 - touch.clientX;
            pos2 = pos4 - touch.clientY;
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            
            const newTop = (element.offsetTop - pos2) + "px";
            const newLeft = (element.offsetLeft - pos1) + "px";
            
            element.style.top = newTop;
            element.style.left = newLeft;
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }

        function closeDragElement() {
            // Save position
            const position = {
                x: element.style.left,
                y: element.style.top
            };
            localStorage.setItem(cakePositionKey, JSON.stringify(position));
            
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        }
    };

    // Remove floating cake
    const removeFloatingCake = () => {
        if (currentCakeElement) {
            currentCakeElement.remove();
            currentCakeElement = null;
        }
    };

    // Check and manage cake visibility
    const manageCakeVisibility = (user) => {
        if (user && user.dateOfBirth && !user.isGuest) {
            if (isBirthdayToday(user.dateOfBirth)) {
                createFloatingCake(user);
            } else {
                removeFloatingCake();
            }
        } else {
            removeFloatingCake();
        }
    };

    // Create birthday card HTML
    const createBirthdayCard = (user) => {
        const age = calculateAge(user.dateOfBirth);
        const formattedDate = formatBirthDate(user.dateOfBirth);
        
        const cardHTML = `
            <div id="birthday-card-overlay" class="birthday-overlay">
                <div class="birthday-card">
                    <div class="birthday-header">
                        <div class="birthday-balloons">
                            <div class="balloon balloon1">🎈</div>
                            <div class="balloon balloon2">🎈</div>
                            <div class="balloon balloon3">🎈</div>
                        </div>
                        <h1>🎉 Happy Birthday! 🎉</h1>
                        <div class="birthday-confetti">
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                        </div>
                    </div>
                    
                    <div class="birthday-content">
                        <div class="birthday-message">
                            <p class="greeting">RX STUDIO BEST WISHES FOR YOU!</p>
                            <p class="main-message">HAPPY BIRTHDAY DEAR, <span class="user-name">${user.fullName}</span></p>
                            <p class="wish-message">WE HOPE YOUR DAYS GOING BETTER ALSO IN FUTURE!</p>
                        </div>
                        
                        <div class="birthday-details">
                            <div class="detail-item">
                                <span class="label">Your Current Age:</span>
                                <span class="value age">${age} Years Old</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Birth Date:</span>
                                <span class="value date">${formattedDate}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="birthday-footer">
                        <button id="download-birthday-card" class="btn-download">
                            <i class="fas fa-download"></i> Download Birthday Card
                        </button>
                        <button id="close-birthday-card" class="btn-close">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return cardHTML;
    };

    // Show birthday card
    const showBirthdayCard = (user) => {
        // Remove existing card if any
        closeBirthdayCard();
        
        // Always show the card when cake is clicked
        const cardHTML = createBirthdayCard(user);
        document.body.insertAdjacentHTML('beforeend', cardHTML);
        setupCardEventListeners(user);
        
        // Add CSS styles if not already added
        addBirthdayStyles();
    };

    // Setup card event listeners
    const setupCardEventListeners = (user) => {
        const closeBtn = document.getElementById('close-birthday-card');
        const downloadBtn = document.getElementById('download-birthday-card');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeBirthdayCard);
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => downloadBirthdayCard(user));
        }
    };

    // Close birthday card
    const closeBirthdayCard = () => {
        const overlay = document.getElementById('birthday-card-overlay');
        if (overlay) {
            overlay.remove();
        }
    };

    // Download birthday card as image - OPTIMIZED VERSION
    const downloadBirthdayCard = (user) => {
        const card = document.querySelector('.birthday-card');
        
        if (!card) {
            alert('Birthday card not found!');
            return;
        }

        // Create canvas immediately without html2canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = card.offsetWidth * 2;
        canvas.height = card.offsetHeight * 2;
        
        // Scale context for high DPI
        ctx.scale(2, 2);
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, card.offsetWidth, card.offsetHeight);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        // Draw card background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, card.offsetWidth, card.offsetHeight);
        
        // Draw content area
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(20, 120, card.offsetWidth - 40, card.offsetHeight - 200);
        
        // Draw text content
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 Happy Birthday! 🎉', card.offsetWidth / 2, 60);
        
        ctx.font = 'bold 18px Arial';
        ctx.fillText('RX STUDIO BEST WISHES FOR YOU!', card.offsetWidth / 2, 160);
        
        ctx.font = 'bold 22px Arial';
        ctx.fillText(`HAPPY BIRTHDAY DEAR, ${user.fullName}`, card.offsetWidth / 2, 200);
        
        ctx.font = 'italic 16px Arial';
        ctx.fillText('WE HOPE YOUR DAYS GOING BETTER ALSO IN FUTURE!', card.offsetWidth / 2, 230);
        
        // Draw user details
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Your Current Age:', 40, 280);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffeb3b';
        ctx.fillText(`${calculateAge(user.dateOfBirth)} Years Old`, card.offsetWidth - 40, 280);
        
        ctx.textAlign = 'left';
        ctx.fillStyle = 'white';
        ctx.fillText('Birth Date:', 40, 310);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#4caf50';
        ctx.fillText(formatBirthDate(user.dateOfBirth), card.offsetWidth - 40, 310);
        
        // Download immediately
        try {
            const link = document.createElement('a');
            link.download = `Happy-Birthday-${user.fullName.replace(/\s+/g, '-')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error downloading birthday card:', error);
            alert('Error downloading birthday card. Please try again.');
        }
    };

    // Add cake styles
    const addCakeStyles = () => {
        if (document.getElementById('cake-styles')) return;
        
        const styles = `
            <style id="cake-styles">
                .floating-cake {
                    position: fixed;
                    z-index: 9999;
                    cursor: pointer;
                    user-select: none;
                    touch-action: none;
                    transition: transform 0.3s ease;
                }

                .floating-cake:hover {
                    transform: scale(1.1);
                }

                .cake-icon {
                    font-size: 3rem;
                    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
                    animation: cakeBounce 2s ease-in-out infinite;
                }

                .cake-sparkle {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: gold;
                    border-radius: 50%;
                    animation: sparkle 1.5s linear infinite;
                }

                .cake-sparkle:nth-child(2) {
                    top: 10px;
                    left: 15px;
                    animation-delay: 0.5s;
                }

                .cake-sparkle:nth-child(3) {
                    top: 5px;
                    right: 10px;
                    animation-delay: 1s;
                }

                .cake-sparkle:nth-child(4) {
                    bottom: 15px;
                    left: 20px;
                    animation-delay: 0.7s;
                }

                @keyframes cakeBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(1); }
                }

                @media (max-width: 768px) {
                    .cake-icon {
                        font-size: 2.5rem;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    };

    // Add birthday styles
    const addBirthdayStyles = () => {
        if (document.getElementById('birthday-styles')) return;
        
        const styles = `
            <style id="birthday-styles">
                .birthday-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    animation: fadeIn 0.5s ease-in-out;
                }

                .birthday-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 500px;
                    width: 90%;
                    color: white;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    position: relative;
                    overflow: hidden;
                    animation: slideUp 0.5s ease-out;
                }

                .birthday-card::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                    transform: rotate(45deg);
                    animation: shine 3s infinite;
                }

                .birthday-header {
                    position: relative;
                    margin-bottom: 20px;
                }

                .birthday-header h1 {
                    margin: 0;
                    font-size: 2em;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                    animation: bounce 2s infinite;
                }

                .birthday-balloons {
                    position: absolute;
                    top: -80px;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: space-around;
                }

                .balloon {
                    font-size: 2em;
                    animation: float 3s ease-in-out infinite;
                }

                .balloon1 { animation-delay: 0s; }
                .balloon2 { animation-delay: 0.5s; }
                .balloon3 { animation-delay: 1s; }

                .birthday-confetti {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                }

                .confetti {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: #ffeb3b;
                    animation: confettiFall 5s linear infinite;
                }

                .confetti:nth-child(1) { left: 10%; animation-delay: 0s; }
                .confetti:nth-child(2) { left: 30%; animation-delay: 1s; background: #f44336; }
                .confetti:nth-child(3) { left: 50%; animation-delay: 2s; background: #4caf50; }
                .confetti:nth-child(4) { left: 70%; animation-delay: 3s; background: #2196f3; }
                .confetti:nth-child(5) { left: 90%; animation-delay: 4s; background: #9c27b0; }

                .birthday-content {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 15px;
                    padding: 20px;
                    margin: 20px 0;
                }

                .birthday-message {
                    margin-bottom: 20px;
                }

                .greeting {
                    font-size: 1.2em;
                    font-weight: bold;
                    margin: 10px 0;
                    color: #ffeb3b;
                }

                .main-message {
                    font-size: 1.4em;
                    font-weight: bold;
                    margin: 15px 0;
                }

                .user-name {
                    color: #ffeb3b;
                    text-decoration: underline;
                }

                .wish-message {
                    font-size: 1.1em;
                    margin: 10px 0;
                    font-style: italic;
                }

                .birthday-details {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                }

                .label {
                    font-weight: bold;
                    color: #e3f2fd;
                }

                .value {
                    font-weight: bold;
                }

                .value.age {
                    color: #ffeb3b;
                }

                .value.date {
                    color: #4caf50;
                }

                .birthday-footer {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }

                .btn-download, .btn-close {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 25px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-download {
                    background: linear-gradient(45deg, #4caf50, #45a049);
                    color: white;
                }

                .btn-download:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
                }

                .btn-download:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .btn-close {
                    background: linear-gradient(45deg, #f44336, #d32f2f);
                    color: white;
                }

                .btn-close:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(244, 67, 54, 0.4);
                }

                /* Animations */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(50px) scale(0.9);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }

                @keyframes confettiFall {
                    0% { 
                        transform: translateY(-100px) rotate(0deg);
                        opacity: 1;
                    }
                    100% { 
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }

                @keyframes shine {
                    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                }

                @media (max-width: 600px) {
                    .birthday-card {
                        padding: 20px;
                    }
                    
                    .birthday-header h1 {
                        font-size: 1.5em;
                    }
                    
                    .birthday-footer {
                        flex-direction: column;
                    }
                    
                    .btn-download, .btn-close {
                        width: 100%;
                        justify-content: center;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    };

    // Initialize birthday system for user
    const initBirthdaySystem = (user) => {
        if (user && user.dateOfBirth && !user.isGuest) {
            // Wait a bit for the page to load completely
            setTimeout(() => {
                manageCakeVisibility(user);
                
                // Show birthday card only on first login if it's user's birthday
                if (isBirthdayToday(user.dateOfBirth)) {
                    const lastShownDate = localStorage.getItem(birthdayCardStorageKey);
                    const today = new Date().toDateString();
                    
                    if (lastShownDate !== today) {
                        showBirthdayCard(user);
                        // Mark as shown for today
                        localStorage.setItem(birthdayCardStorageKey, today);
                    }
                }
            }, 1000);
        } else {
            removeFloatingCake();
        }
    };

    return {
        initBirthdaySystem,
        isBirthdayToday,
        calculateAge,
        formatBirthDate,
        manageCakeVisibility,
        removeFloatingCake
    };
})();

// Add missing ModalManager if not defined
if (typeof ModalManager === 'undefined') {
    const ModalManager = {
        showModal: (id) => {
            const modal = document.getElementById(id);
            if (modal) modal.style.display = 'block';
        },
        hideModal: (id) => {
            const modal = document.getElementById(id);
            if (modal) modal.style.display = 'none';
        }
    };
}