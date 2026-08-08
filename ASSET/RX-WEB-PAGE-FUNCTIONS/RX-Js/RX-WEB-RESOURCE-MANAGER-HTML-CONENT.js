// RX-WEB-RESOURCE-MANAGER-HTML-CONENT.js - Resource Manager Page Content
function rxLoadresourcemanagerPage(rxDisplayArea) {
    rxDisplayArea.style.alignItems = "flex-start";
    rxDisplayArea.style.justifyContent = "flex-start";
    rxDisplayArea.style.overflow = "auto";
    rxDisplayArea.style.padding = "0";
    rxDisplayArea.style.background = "#f1f5f9";
    rxDisplayArea.style.width = "100%";
    rxDisplayArea.style.minHeight = "100vh";
    
    // Check if user is logged in
    var isLoggedIn = false;
    
    // Check sessionStorage
    try {
        var sessionData = sessionStorage.getItem('rxSession');
        if (sessionData) {
            var user = JSON.parse(sessionData);
            if (user && user.id && !user.isGuest) {
                isLoggedIn = true;
            }
        }
    } catch(e) {
        isLoggedIn = false;
    }
    
    // Check localStorage if not logged in
    if (!isLoggedIn) {
        try {
            var localData = localStorage.getItem('currentUser');
            if (localData) {
                var user2 = JSON.parse(localData);
                if (user2 && user2.id && !user2.isGuest) {
                    isLoggedIn = true;
                }
            }
        } catch(e) {
            isLoggedIn = false;
        }
    }
    
    // Check UserSession if available
    if (!isLoggedIn && window.UserSession) {
        try {
            var user3 = window.UserSession.getCurrentUser();
            if (user3 && user3.id && !user3.isGuest) {
                isLoggedIn = true;
            }
        } catch(e) {
            isLoggedIn = false;
        }
    }
    
    // If NOT logged in, ONLY show login message - NO admin panel HTML at all
    if (!isLoggedIn) {
        rxDisplayArea.innerHTML = `
            <div style="width:100%; max-width:800px; margin:60px auto; padding:40px; background:#ffffff; border-radius:16px; border:1px solid #d0dbe8; text-align:center; box-shadow:0 4px 20px rgba(0,0,0,0.06);">
                <i class="fas fa-lock" style="font-size:64px; color:#1a4480; opacity:0.3; display:block; margin-bottom:20px;"></i>
                <h2 style="color:#1a4480; font-size:24px; margin-bottom:10px;">Please Login First</h2>
                <p style="color:#888888; font-size:16px; margin-bottom:25px;">You need to login to manage your accessible resources.</p>
                <button onclick="if(typeof rxLoadAuthPage === 'function') rxLoadAuthPage(document.getElementById('rx-display-area')); else if(typeof rxLoadContent === 'function') rxLoadContent('AUTHENTICATION');" 
                        style="background:#1a4480; color:#ffffff; border:none; padding:12px 40px; border-radius:10px; cursor:pointer; font-weight:700; font-size:16px; transition:all 0.3s ease;">
                    <i class="fas fa-sign-in-alt"></i> Login Now
                </button>
                <p style="color:#aaaaaa; font-size:13px; margin-top:20px;">
                    <i class="fas fa-info-circle"></i> After login, your accessible resources will appear here.
                </p>
            </div>
        `;
        return; // IMPORTANT: Stop execution here - don't show admin panel
    }
    
    // ============================================================
    // USER IS LOGGED IN - Show the full admin panel
    // ============================================================
    rxDisplayArea.innerHTML = `
        <div class="rx-resource-manager" style="width:100%; max-width:1400px; margin:0 auto; padding:20px; background:#f1f5f9; min-height:100vh;">
            <!-- Main Content - Stacked Layout (Users on top, Details below) -->
            <div class="rx-main-content" style="display:flex; flex-direction:column; gap:20px; padding:0;">
                <!-- Top Panel - User List (Horizontal scroll) -->
                <div class="rx-user-panel" style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06); max-height:280px; min-height:180px;">
                    <div class="rx-panel-header" style="padding:10px 16px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; background:#ffffff; position:sticky; top:0; z-index:10;">
                        <h2 style="font-size:14px; font-weight:600; display:flex; align-items:center; gap:6px; color:#0f172a; margin:0;">
                            <i class="fas fa-users"></i> Users <span id="rxUserCount" style="background:#818cf8; color:white; padding:0 8px; border-radius:20px; font-size:11px;">0</span>
                        </h2>
                        <button class="rx-refresh-btn" onclick="if(window.RXResourceManager) window.RXResourceManager.refreshAllUsers()" style="background:none; border:none; cursor:pointer; color:#64748b; font-size:14px; padding:4px;">
                            <i class="fas fa-sync"></i>
                        </button>
                    </div>
                    <div class="rx-search-box" style="padding:6px 14px; border-bottom:1px solid #e2e8f0; flex-shrink:0; background:#ffffff; position:sticky; top:48px; z-index:9;">
                        <input type="text" id="rxUserSearch" placeholder="Search users..." oninput="if(window.RXResourceManager) window.RXResourceManager.filterUsers(this.value)" onkeyup="if(window.RXResourceManager) window.RXResourceManager.filterUsers(this.value)" style="width:100%; padding:6px 10px; border:1px solid #e2e8f0; border-radius:6px; font-size:13px; outline:none; background:#f1f5f9;">
                    </div>
                    <div class="rx-user-list" id="rxUserList" style="flex:1; overflow-x:auto; overflow-y:hidden; padding:8px 12px; min-height:60px; display:flex; flex-wrap:nowrap; gap:8px; align-items:center;">
                        <div style="text-align:center; padding:20px; color:#64748b; width:100%;">
                            <i class="fas fa-spinner fa-spin"></i><br>
                            <span style="font-size:13px; margin-top:8px; display:block;">Loading users...</span>
                        </div>
                    </div>
                </div>

                <!-- Bottom Panel - User Details -->
                <div class="rx-detail-panel" id="rxDetailPanel" style="background:#ffffff; border-radius:12px; border:1px solid #e2e8f0; padding:20px; overflow-y:auto; box-shadow:0 1px 3px rgba(0,0,0,0.06); min-height:400px; flex:1;">
                    <div id="adminDetailPlaceholder" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#888; text-align:center; min-height:300px;">
                        <i class="fas fa-user-circle" style="font-size:56px; opacity:0.2; margin-bottom:16px;"></i>
                        <h3 style="font-size:16px; margin-bottom:4px; color:#1a4480;">Select a User</h3>
                        <p style="font-size:13px; opacity:0.7;">Choose a user from the list to view and manage their profile</p>
                    </div>
                    <div id="adminDetailContent" style="display:none;"></div>
                </div>
            </div>
        </div>
    `;
}