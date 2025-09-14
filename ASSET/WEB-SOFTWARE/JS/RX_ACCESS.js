// Define the home page URL for redirection
const HOME_PAGE_URL = "https://www.rosankc.com.np/"; // Ensure this is your actual home page

// --- Helper function to get current user data from localStorage ---
const getCurrentUserForAccess = () => {
    try {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        return null;
    }
};

// --- Helper function to display a temporary notification ---
const showAccessNotification = (title, message, type = "warning") => {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.rx-access-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create overlay to cover the entire screen
    const overlay = document.createElement('div');
    overlay.className = 'rx-access-notification-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 9998;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    // Create notification container
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'rx-access-notification';
    
    // Determine colors based on notification type
    let bgColor, borderColor, icon;
    switch(type) {
        case 'danger':
            bgColor = '#f8d7da';
            borderColor = '#f5c6cb';
            icon = '❌';
            break;
        case 'success':
            bgColor = '#d4edda';
            borderColor = '#c3e6cb';
            icon = '✅';
            break;
        case 'info':
            bgColor = '#d1ecf1';
            borderColor = '#bee5eb';
            icon = 'ℹ️';
            break;
        case 'warning':
        default:
            bgColor = '#fff3cd';
            borderColor = '#ffeeba';
            icon = '⚠️';
    }
    
    notificationDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background-color: ${bgColor};
        border: 1px solid ${borderColor};
        border-left: 5px solid ${borderColor};
        padding: 25px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 18px;
        text-align: center;
        max-width: 500px;
        width: 90%;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    notificationDiv.innerHTML = `
        <div style="font-size: 40px; margin-bottom: 15px;">${icon}</div>
        <strong style="font-size: 22px; color: #721c24; display: block; margin-bottom: 10px;">${title}</strong>
        <div style="color: #856404; line-height: 1.5;">${message}</div>
        <div style="margin-top: 20px; font-size: 14px; color: #666;">
            Redirecting in a few seconds...
        </div>
    `;
    
    // Add to document
    document.body.appendChild(overlay);
    document.body.appendChild(notificationDiv);
    
    // Animate in
    setTimeout(() => {
        notificationDiv.style.opacity = '1';
        notificationDiv.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Animate out and remove after a few seconds
    setTimeout(() => {
        notificationDiv.style.opacity = '0';
        notificationDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
        overlay.style.opacity = '0';
        
        setTimeout(() => {
            notificationDiv.remove();
            overlay.remove();
        }, 400);
    }, 7000);
};

// --- Function to check if a user has access to a specific file ---
const checkUserFileAccess = (currentUser, targetFileId) => {
    if (!currentUser || currentUser.isGuest) {
        // Guests might have some default public access, but by default deny restricted files.
        // For 'file3' which guests have permanent access to in your user.js, it will pass here.
        // This function will return false ONLY if it's a restricted file a guest tries to access.
        // The calling logic should handle public guest access separately if needed.
        return false; 
    }

    // Admins have full access to everything
    if (currentUser.accountType === "ADMIN") {
        return true;
    }

    // Check permanent access
    if (currentUser.access && currentUser.access.includes(targetFileId)) {
        return true;
    }

    // Check timed access
    const fileConfig = currentUser.timedAccessConfig ? currentUser.timedAccessConfig[targetFileId] : null;
    if (fileConfig && fileConfig.startDate && fileConfig.duration) {
        const startDate = new Date(`${fileConfig.startDate}T00:00:00Z`); // Use UTC to avoid timezone issues
        const timedAccessEnd = startDate.getTime() + (fileConfig.duration * 24 * 60 * 60 * 1000); // duration in milliseconds
        return timedAccessEnd > Date.now();
    }

    return false; // No access found
};

// --- Main access control function ---
const enforceAccessControl = () => {
    const currentUser = getCurrentUserForAccess();
    if (!currentUser) {
        // Should not happen if UserManager.initUser() is always called, but good fallback
        // Treat as guest if no user data found
        console.warn("No current user data found. Treating as guest.");
        localStorage.removeItem('currentUser'); // Clean up potentially corrupt data
        window.location.href = HOME_PAGE_URL;
        return;
    }

    const currentPathname = window.location.pathname;
    // Extract file name or ID from the URL (e.g., "KR-EXAM.html?exam=file2" -> "file2" or "ASSET/WEB-SOFTWARE/RX-S-QR.html" -> "file3")
    let accessedFileId = null;

    // Check for explicit 'exam' query parameter first (e.g., KR-EXAM.html?exam=file2)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('exam')) {
        accessedFileId = urlParams.get('exam');
    } else {
        // Otherwise, try to infer from pathname by matching against contentCards links
        // This requires contentCards to be available, so we'll need to define it here or fetch it.
        // For a standalone script, it's safer to have a copy or a minimal mapping.

        // IMPORTANT: For simplicity and to avoid dependency on global 'contentCards' from user.js,
        // we will manually map some common files to their IDs. For a comprehensive solution,
        // you would either include the contentCards array directly here or fetch it.

        // Minimal mapping for demonstration - extend as needed
        const fileLinkToFileIdMap = {
            "/ASSET/WEB-SOFTWARE/RX-STUDIO-KAPALI_TAMSUK_GENERATOR.html": "file1",
            "/KR-EXAM.html": "exam_launcher", // Special case handled by 'exam' param
            "/ASSET/WEB-SOFTWARE/RX-S-QR.html": "file3",
            "/ASSET/WEB-SOFTWARE/Kapali.html": "file4",
        };

        for (const link in fileLinkToFileIdMap) {
            if (currentPathname.endsWith(link)) {
                accessedFileId = fileLinkToFileIdMap[link];
                break;
            }
        }

        // Handle the case where contentCards might be explicitly designed for KR-EXAM.html
        // and its internal 'exam=' parameter. If no direct file map match and it's KR-EXAM.html,
        // but no 'exam' param, then it's an invalid access or base page. We'll deny for safety.
        if (!accessedFileId && currentPathname.includes("KR-EXAM.html")) {
             console.warn("Accessed KR-EXAM.html without 'exam' parameter. Denying access.");
             accessedFileId = "invalid_exam_access"; // Deny by default
        }
    }

    // Define public/guest accessible files (e.g., your home page, general info pages)
    // Add paths that are always accessible regardless of login status.
    const publicPaths = [
        "/index.html", // Your main dashboard/home page
        "/ASSET/WEB-SOFTWARE/RX-S-QR.html", // file3 is accessible to guests in user.js example
        // Add other public paths if any, e.g., about us, contact, privacy policy
    ];

    // Explicitly allow access to the home page or known public paths
    if (currentPathname === "/" || publicPaths.some(path => currentPathname.endsWith(path))) {
        // If it's a public path or the dashboard itself, allow access immediately
        return;
    }

    // Special handling for file3 for guest users, as per your user.js
    if (currentUser.isGuest && accessedFileId === "file3") {
        return; // Guest has access to file3
    }

    // If the file ID could not be determined OR it's a restricted file
    if (!accessedFileId || !checkUserFileAccess(currentUser, accessedFileId)) {
        const username = currentUser.userName || "Guest";
        const messageTitle = "Access Denied!";
        const message = `Dear ${username}, you do not have permission to access "${accessedFileId || 'this content'}". Please do not try to open unauthorized files. We are redirecting you to the home page.`;
        
        showAccessNotification(messageTitle, message, "danger");
        
        // Redirect after a short delay to allow the user to see the notification
        setTimeout(() => {
            window.location.href = HOME_PAGE_URL;
        }, 4000); // Redirect after 4 seconds
        
        // Stop further execution on this page
        throw new Error("Access Denied - Redirection in progress.");
    }
};

// --- Attach the access control to run when the page loads ---
document.addEventListener('DOMContentLoaded', enforceAccessControl);

// Optional: Also run it immediately in case DOMContentLoaded fires too late for some setups
// Though DOMContentLoaded is generally preferred to ensure the DOM is ready.
// enforceAccessControl();

// --- Make relevant functions globally accessible if needed (e.g., for direct calls from HTML) ---
window.enforceAccessControl = enforceAccessControl;
window.checkUserFileAccess = checkUserFileAccess; // Useful for debugging or custom components

// --- END OF FILE RX_ACCESS.js ---