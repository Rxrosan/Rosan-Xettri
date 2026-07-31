// RX-WEB-NEWS.js - News & Announcements System

// News Database (stored in localStorage)
let newsDatabase = [];

// Load news from localStorage
function loadNewsFromStorage() {
    const stored = localStorage.getItem('rx_news_database');
    if (stored) {
        newsDatabase = JSON.parse(stored);
    } else {
        // Initialize with sample news including user-specific messages with proper dates
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        newsDatabase = [
           // {
             //   id: "news_1",
             //   title: "Welcome to RX STUDIO News System",
              //  content: "This is the official news and announcements page. Stay tuned for updates about new features, services, and important information.",
            //    target: "all",
              //  priority: "normal",
             //   date: today.toISOString(),
            //    customDate: null,
             //   userIds: []
          //  },
          //  {
             //   id: "news_2",
          //      title: "EPS Exam Practice Platform Updated",
          //      content: "New questions have been added to the EPS exam practice platform. Practice now to improve your Korean language skills!",
            //    target: "all",
              //  priority: "important",
                //date: yesterday.toISOString(),
 //               customDate: null,
   //             userIds: []
     //       },
       //     {
         //       id: "news_3",
           //     title: "Special Offer for Admin User",
             //   content: "Dear Admin, you have access to all premium features. Thank you for being our valued administrator!",
               // target: "multiple",
        //        userIds: ["RX-A-01"],
          //      priority: "important",
            //    date: today.toISOString(),
              //  customDate: null
 //           },
   //         {
     //           id: "news_4",
       //         title: "Welcome Partners & Members!",
         //       content: "Thank you for being part of RX STUDIO. Your contributions are valuable to our growth. Special benefits await you!",
           //     target: "multiple",
             //   userIds: ["RX-P-01", "RX-M-01"],
               // priority: "normal",
//                date: yesterday.toISOString(),
  //              customDate: null
    //        },
      //      {
        //        id: "news_5",
          //      title: "Membership Benefits Extended",
            //    content: "Dear Members, as a valued member you get access to exclusive content. Check out our premium resources!",
              //  target: "user",
                // userId: "RX-M-01",
 //               priority: "normal",
   //             date: lastWeek.toISOString(),
     //           customDate: null,
       //         userIds: []
         //   },
           // {
             //   id: "news_6",
               // title: "File Access Reminder",
   //             content: "Your access to LEKHAPADI services is active. Make sure to use it before expiration.",
     //           target: "multiple",
       //         userIds: ["RX-P-01", "RX-M-01"],
         //       priority: "normal",
           //     date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
             //   customDate: null
          //  }
        ];
        saveNewsToStorage();
    }
}

// Save news to localStorage
function saveNewsToStorage() {
    localStorage.setItem('rx_news_database', JSON.stringify(newsDatabase));
}

// Get current user from UserManager (from user.js)
function getCurrentUserFromGlobal() {
    if (window.UserManager && window.UserManager.getCurrentUser) {
        return window.UserManager.getCurrentUser();
    }
    // Fallback to localStorage
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : { id: "GUEST", isGuest: true, userName: "GUEST", fullName: "Guest", accountType: "GUEST", access: [], timedAccessConfig: {} };
}

// Check if news is visible to current user
function isNewsVisibleToUser(news, userId) {
    if (news.target === 'all') {
        return true;
    }
    if (news.target === 'multiple' && news.userIds && news.userIds.length > 0) {
        return news.userIds.includes(userId);
    }
    if (news.target === 'user' && news.userId) {
        return news.userId === userId;
    }
    return false;
}

// Format date for display (supports both ISO and custom date strings)
function formatDisplayDate(dateValue, customDate = null) {
    // If custom date is provided and valid, use it
    if (customDate && customDate.trim() !== "") {
        return customDate;
    }
    
    // Otherwise try to parse the date
    if (!dateValue) return "Date not available";
    
    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
            return dateValue; // Return as is if not a valid date
        }
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } catch (e) {
        return dateValue;
    }
}

// Format date for sorting (converts to timestamp for comparison)
function getDateSortValue(news) {
    if (news.customDate && news.customDate.trim() !== "") {
        // Try to parse custom date, if fails use current date
        const parsed = Date.parse(news.customDate);
        return isNaN(parsed) ? 0 : parsed;
    }
    return new Date(news.date).getTime();
}

// Format target users display
function formatTargetUsers(news) {
    if (news.target === 'all') {
        return '<i class="fas fa-globe"></i> All Users';
    }
    if (news.target === 'multiple' && news.userIds && news.userIds.length > 0) {
        if (news.userIds.length === 1) {
            return `<i class="fas fa-user"></i> User: ${news.userIds[0]}`;
        }
        return `<i class="fas fa-users"></i> ${news.userIds.length} Users: ${news.userIds.join(', ')}`;
    }
    if (news.target === 'user' && news.userId) {
        return `<i class="fas fa-user"></i> User: ${news.userId}`;
    }
    return '<i class="fas fa-users"></i> Targeted Users';
}

// Check if user has access to specific file
function checkFileAccess(user, fileId) {
    if (!user) return false;
    if (user.access && user.access.includes(fileId)) return true;
    const fileConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
    if (fileConfig && fileConfig.startDate && fileConfig.duration) {
        const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`);
        const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000);
        return timedAccessEnd > Date.now();
    }
    return false;
}

// Get remaining time for a file
function getRemainingTimeForFile(user, fileId) {
    if (!user) return 0;
    const fileConfig = user.timedAccessConfig ? user.timedAccessConfig[fileId] : null;
    if (fileConfig && fileConfig.startDate && fileConfig.duration) {
        const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`);
        const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000);
        return timedAccessEnd - Date.now();
    }
    return 0;
}

// Format remaining time
function formatRemainingTime(ms) {
    if (ms <= 0) return "Expired";
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''} remaining`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
}

// Get files that are expiring soon (within 7 days)
function getExpiringFiles(user) {
    if (!user || user.isGuest) return [];
    const expiring = [];
    const files = [
        { id: "file1", name: "LEKHAPADI Services", page: "RX-LEKA-PADI.html" },
        { id: "file2", name: "EPS Exam Practice - Model 1", page: "RX-KR-EXAM-MODEL-1.html" },
        { id: "file3", name: "QR Scanner", page: "RX-S-QR.html" },
        { id: "file4", name: "Text to Image", page: "RX-IMG-CONVERTER.html" },
        { id: "file5", name: "EPS Exam Practice - Model 2", page: "RX-KR-EXAM-MODEL-2.html" }
    ];
    
    files.forEach(file => {
        const remaining = getRemainingTimeForFile(user, file.id);
        if (remaining > 0 && remaining <= 7 * 24 * 60 * 60 * 1000) {
            expiring.push({
                ...file,
                remaining: remaining,
                remainingText: formatRemainingTime(remaining)
            });
        }
    });
    return expiring;
}

// Render Public News
function renderPublicNews() {
    const container = document.getElementById('publicNewsContainer');
    if (!container) return;
    
    const publicNews = newsDatabase.filter(news => news.target === 'all');
    
    if (publicNews.length === 0) {
        container.innerHTML = `<div class="empty-news"><i class="fas fa-newspaper"></i><p>No public announcements available.</p></div>`;
        return;
    }
    
    // Sort by date (newest first) - using custom date support
    publicNews.sort((a, b) => getDateSortValue(b) - getDateSortValue(a));
    
    container.innerHTML = publicNews.map(news => `
        <div class="news-card ${news.priority}">
            <div class="news-card-header">
                <i class="fas ${news.priority === 'urgent' ? 'fa-bell' : news.priority === 'important' ? 'fa-star' : 'fa-info-circle'}"></i>
                <h4 class="news-title">${escapeHtml(news.title)}</h4>
                <span class="news-priority ${news.priority}">${news.priority.toUpperCase()}</span>
            </div>
            <div class="news-date">
                <i class="fas fa-calendar-alt"></i> ${formatDisplayDate(news.date, news.customDate)}
            </div>
            <div class="news-content">${escapeHtml(news.content)}</div>
            <div class="news-target"><i class="fas fa-globe"></i> Public Announcement</div>
        </div>
    `).join('');
}

// Render Personal Messages (by User ID - supports multiple user targeting)
function renderPersonalMessages() {
    const container = document.getElementById('personalNewsContainer');
    if (!container) return;
    
    const currentUser = getCurrentUserFromGlobal();
    const userId = currentUser.id;
    
    // Get messages that are visible to this user
    const personalMessages = newsDatabase.filter(news => {
        return isNewsVisibleToUser(news, userId);
    });
    
    if (personalMessages.length === 0) {
        if (userId === "GUEST") {
            container.innerHTML = `<div class="empty-news"><i class="fas fa-envelope"></i><p>You are currently logged in as GUEST. <br>Login with your User ID to see personalized messages.</p></div>`;
        } else {
            container.innerHTML = `<div class="empty-news"><i class="fas fa-envelope"></i><p>No personal messages for your User ID (${userId}) at this time.</p></div>`;
        }
        return;
    }
    
    // Sort by date (newest first) - using custom date support
    personalMessages.sort((a, b) => getDateSortValue(b) - getDateSortValue(a));
    
    container.innerHTML = personalMessages.map(news => `
        <div class="news-card ${news.priority}">
            <div class="news-card-header">
                <i class="fas ${news.priority === 'urgent' ? 'fa-bell' : news.priority === 'important' ? 'fa-star' : 'fa-user'}"></i>
                <h4 class="news-title">${escapeHtml(news.title)}</h4>
                <span class="news-priority ${news.priority}">${news.priority.toUpperCase()}</span>
            </div>
            <div class="news-date">
                <i class="fas fa-calendar-alt"></i> ${formatDisplayDate(news.date, news.customDate)}
            </div>
            <div class="news-content">${escapeHtml(news.content)}</div>
            <div class="user-id-badge">
                ${formatTargetUsers(news)}
            </div>
        </div>
    `).join('');
}

// Render Expiring Soon with Go for Renew button linking to Resource.html
function renderExpiringSoon() {
    const container = document.getElementById('expiringContainer');
    if (!container) return;
    
    const currentUser = getCurrentUserFromGlobal();
    const expiringFiles = getExpiringFiles(currentUser);
    
    if (currentUser.isGuest) {
        container.innerHTML = `<div class="empty-news"><i class="fas fa-clock"></i><p>Please login to see your system notifications.</p></div>`;
        return;
    }
    
    if (expiringFiles.length === 0) {
        container.innerHTML = `<div class="empty-news"><i class="fas fa-check-circle"></i><p>No files are expiring soon. All your access is up to date!</p></div>`;
        return;
    }
    
    container.innerHTML = expiringFiles.map(file => `
        <div class="news-card important">
            <div class="news-card-header">
                <i class="fas fa-hourglass-half"></i>
                <h4 class="news-title">${escapeHtml(file.name)}</h4>
                <span class="news-priority important">EXPIRING</span>
            </div>
            <div class="news-content">
                <p>Your access to <strong>${escapeHtml(file.name)}</strong> will expire in <strong>${file.remainingText}</strong>.</p>
                <p>Visit the Resource page to explore available services and renew your access.</p>
            </div>
            <a href="Resource.html" class="renew-btn">
                <i class="fas fa-shopping-cart"></i> Go for Renew
            </a>
        </div>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Tab switching
function setupTabs() {
    const tabBtns = document.querySelectorAll('.news-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.news-tabs .tab-content');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                const tabContent = document.getElementById(`${tabId}-tab`);
                if (tabContent) tabContent.classList.add('active');
                
                // Refresh content when switching tabs
                if (tabId === 'public') renderPublicNews();
                if (tabId === 'personal') renderPersonalMessages();
                if (tabId === 'expiring') renderExpiringSoon();
            });
        });
    }
}

// Function to add a new personal message to single user
function sendPersonalMessage(userId, title, content, priority = 'normal', customDate = null) {
    const newMessage = {
        id: 'msg_' + Date.now(),
        title: title,
        content: content,
        target: 'user',
        userId: userId,
        priority: priority,
        date: new Date().toISOString(),
        customDate: customDate && customDate.trim() !== "" ? customDate : null,
        userIds: []
    };
    
    newsDatabase.unshift(newMessage);
    saveNewsToStorage();
    
    // Refresh displays if current user matches
    const currentUser = getCurrentUserFromGlobal();
    if (currentUser.id === userId) {
        renderPersonalMessages();
    }
    
    if (window.NotificationManager) {
        window.NotificationManager.showNotification("Message Sent", `Message sent to ${userId}`, "success", 3000);
    }
    
    return true;
}

// Function to add a new message to multiple users
function sendMessageToMultipleUsers(userIds, title, content, priority = 'normal', customDate = null) {
    if (!userIds || userIds.length === 0) {
        if (window.NotificationManager) {
            window.NotificationManager.showNotification("Error", "Please specify at least one user ID.", "danger", 3000);
        }
        return false;
    }
    
    const newMessage = {
        id: 'msg_' + Date.now(),
        title: title,
        content: content,
        target: 'multiple',
        userIds: userIds,
        priority: priority,
        date: new Date().toISOString(),
        customDate: customDate && customDate.trim() !== "" ? customDate : null,
        userId: null
    };
    
    newsDatabase.unshift(newMessage);
    saveNewsToStorage();
    
    // Refresh displays for current user if they are in the list
    const currentUser = getCurrentUserFromGlobal();
    if (userIds.includes(currentUser.id)) {
        renderPersonalMessages();
    }
    
    if (window.NotificationManager) {
        window.NotificationManager.showNotification("Message Sent", `Message sent to ${userIds.length} user(s): ${userIds.join(', ')}`, "success", 4000);
    }
    
    return true;
}

// Function to add public announcement with custom date support
function sendPublicAnnouncement(title, content, priority = 'normal', customDate = null) {
    const newAnnouncement = {
        id: 'pub_' + Date.now(),
        title: title,
        content: content,
        target: 'all',
        priority: priority,
        date: new Date().toISOString(),
        customDate: customDate && customDate.trim() !== "" ? customDate : null,
        userIds: []
    };
    
    newsDatabase.unshift(newAnnouncement);
    saveNewsToStorage();
    renderPublicNews();
    
    if (window.NotificationManager) {
        window.NotificationManager.showNotification("Announcement Sent", "Public announcement published successfully.", "success", 3000);
    }
    
    return true;
}

// Function to add news with manual date and multiple user targeting
function addNewsWithManualDate(title, content, target, userIds = null, priority = 'normal', manualDate = null) {
    const newNews = {
        id: 'news_' + Date.now(),
        title: title,
        content: content,
        target: target,
        priority: priority,
        date: new Date().toISOString(),
        customDate: manualDate && manualDate.trim() !== "" ? manualDate : null,
        userIds: []
    };
    
    if (target === 'multiple' && userIds && userIds.length > 0) {
        newNews.userIds = userIds;
        newNews.target = 'multiple';
    } else if (target === 'user' && userIds && userIds.length === 1) {
        newNews.userId = userIds[0];
        newNews.target = 'user';
    } else if (target === 'all') {
        newNews.target = 'all';
    } else {
        if (window.NotificationManager) {
            window.NotificationManager.showNotification("Error", "Invalid target configuration.", "danger", 3000);
        }
        return false;
    }
    
    newsDatabase.unshift(newNews);
    saveNewsToStorage();
    
    // Refresh displays
    renderPublicNews();
    renderPersonalMessages();
    
    if (window.NotificationManager) {
        window.NotificationManager.showNotification("News Added", "News item added successfully.", "success", 3000);
    }
    
    return true;
}

// Function to get all news (for debugging/export)
function getAllNews() {
    return [...newsDatabase];
}

// Function to get news by ID
function getNewsById(newsId) {
    return newsDatabase.find(news => news.id === newsId);
}

// Function to delete news by ID
function deleteNewsById(newsId) {
    newsDatabase = newsDatabase.filter(news => news.id !== newsId);
    saveNewsToStorage();
    renderPublicNews();
    renderPersonalMessages();
    return true;
}

// Function to update news date
function updateNewsDate(newsId, newDate) {
    const news = newsDatabase.find(n => n.id === newsId);
    if (news) {
        news.customDate = newDate && newDate.trim() !== "" ? newDate : null;
        saveNewsToStorage();
        renderPublicNews();
        renderPersonalMessages();
        return true;
    }
    return false;
}

// Function to add notification for expiring access (auto-generated)
function addExpiringNotification(userId, fileName, daysRemaining) {
    const newNotification = {
        id: 'exp_' + Date.now(),
        title: `⚠️ Access Expiring Soon: ${fileName}`,
        content: `Your access to ${fileName} will expire in ${daysRemaining} days. Please renew to continue uninterrupted service.`,
        target: 'user',
        userId: userId,
        priority: 'important',
        date: new Date().toISOString(),
        customDate: null,
        userIds: []
    };
    
    newsDatabase.unshift(newNotification);
    saveNewsToStorage();
    
    // Refresh if current user matches
    const currentUser = getCurrentUserFromGlobal();
    if (currentUser.id === userId) {
        renderPersonalMessages();
    }
    
    return true;
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    loadNewsFromStorage();
    setupTabs();
    renderPublicNews();
    renderPersonalMessages();
    renderExpiringSoon();
    
    // Side panel toggle
    const menuToggle = document.getElementById('menuToggle');
    const closePanel = document.getElementById('closePanel');
    const panelOverlay = document.getElementById('panelOverlay');
    const sidePanel = document.getElementById('sidePanel');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (sidePanel) sidePanel.classList.add('active');
            if (panelOverlay) panelOverlay.classList.add('active');
        });
    }
    
    if (closePanel) {
        closePanel.addEventListener('click', function() {
            if (sidePanel) sidePanel.classList.remove('active');
            if (panelOverlay) panelOverlay.classList.remove('active');
        });
    }
    
    if (panelOverlay) {
        panelOverlay.addEventListener('click', function() {
            if (sidePanel) sidePanel.classList.remove('active');
            if (panelOverlay) panelOverlay.classList.remove('active');
        });
    }
    
    // Active navigation highlight
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
    
    // Listen for user login changes to refresh personal messages
    window.addEventListener('storage', function(e) {
        if (e.key === 'currentUser') {
            renderPersonalMessages();
            renderExpiringSoon();
        }
    });
});

// Make functions globally available
window.sendPersonalMessage = sendPersonalMessage;
window.sendMessageToMultipleUsers = sendMessageToMultipleUsers;
window.sendPublicAnnouncement = sendPublicAnnouncement;
window.addNewsWithManualDate = addNewsWithManualDate;
window.getAllNews = getAllNews;
window.getNewsById = getNewsById;
window.deleteNewsById = deleteNewsById;
window.updateNewsDate = updateNewsDate;
window.addExpiringNotification = addExpiringNotification;