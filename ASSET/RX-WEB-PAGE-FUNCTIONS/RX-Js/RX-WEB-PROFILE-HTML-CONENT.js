// rx-profile.js - User Profile Page Content
function rxLoadProfilePage(rxDisplayArea) {
    rxDisplayArea.style.alignItems = "center";
    rxDisplayArea.style.justifyContent = "flex-start";
    rxDisplayArea.innerHTML = `
        <div style="width: 100%; max-width: 1200px; margin: 0 auto; text-align: left;">
            <!-- Profile Section -->
            <section class="profile-section" id="profileSection" style="display: block;">
                <h2 class="section-title">USER PROFILE</h2>
                <div class="profile-container">
                    
                    <!-- LEFT SIDE: AVATAR CARD WITH CAMERA ICON -->
                    <div class="profile-left">
                        <div class="profile-image-container" title="Click to change profile picture">
                            <img id="profile-img" src="ASSET/RX-IMAGES/RX-USER-IMAGE/T-0.jpg" alt="Profile">
                            <!-- <div class="camera-overlay">
                                <i class="fa-solid fa-camera"></i>
                            </div> -->
                        </div>
                        <!-- Hidden file input -->
                        <input type="file" id="profileImageInput" accept="image/*" style="display: none;">

                        <div class="profile-name-container">
                            <h2 id="profile-fullname" class="profile-name">Loading...</h2>
                            <p id="profile-username" class="profile-nickname">-</p>
                            
                            <!-- LOGOUT BUTTON ADDED HERE -->
                            <button id="logoutBtn" style="margin-top: 20px; width: 100%; background-color: #ff0000; color: #ffffff; border: none; padding: 10px 15px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background 0.3s;">
                                Log Out
                            </button>
                        </div>
                    </div>
                    
                    <!-- RIGHT SIDE: PERSONAL INFO CONTAINER -->
                    <div class="profile-right">
                        <h3 class="details-title">Personal Information</h3>
                        <div class="detail-item-container">
                            <div class="detail-item"><div class="detail-content"><span class="detail-label">Full Name</span><span id="dropdown-name" class="detail-value">-</span></div></div>
                            <div class="detail-item"><div class="detail-content"><span class="detail-label">Username</span><span id="username" class="detail-value">-</span></div></div>
                            <div class="detail-item"><div class="detail-content"><span class="detail-label">Email</span><span id="dropdown-email" class="detail-value">-</span></div></div>
                            <div class="detail-item"><div class="detail-content"><span class="detail-label">Phone</span><span id="dropdown-phone" class="detail-value">-</span></div></div>
                            <div class="detail-item"><div class="detail-content"><span class="detail-label">Address</span><span id="dropdown-address" class="detail-value">-</span></div></div>
                            <div class="detail-item"><div class="detail-content"><span class="detail-label">Member Type</span><span id="dropdown-account-type" class="detail-value">-</span></div></div>
                            <div class="detail-item"><div class="detail-content"><span class="detail-label">User ID</span><span id="dropdown-user-id" class="detail-value">-</span></div></div>
                            <div class="detail-item"><div class="detail-content"><span class="detail-label">Date of Birth</span><span id="detailDOB" class="detail-value">-</span></div></div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    `;

    // HTML लोड हुनासाथ प्रोफाइलको जाभास्क्रिप्ट इनिसियलाइज गर्ने
    if (typeof window.rxInitProfilePage === 'function') {
        window.rxInitProfilePage();
    }
}