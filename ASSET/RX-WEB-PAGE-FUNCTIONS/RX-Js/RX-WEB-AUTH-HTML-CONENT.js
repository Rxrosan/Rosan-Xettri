// rx-auth.js - Authentication Page Content
function rxLoadAuthPage(rxDisplayArea) {
    rxDisplayArea.style.alignItems = "center";
    rxDisplayArea.style.justifyContent = "flex-start";
    rxDisplayArea.innerHTML = `
        <div style="width: 100%; max-width: 1200px; margin: 0 auto; text-align: left;">
            <h2 style="width: 100%; text-align: center; margin-bottom: 20px;">Authentication Portal</h2>
             <!-- ===== LOGIN PAGE ===== -->
        <div class="login-section auth-page" id="loginSection">
            <div class="login-container">
                <h2 class="login-title">RX LOG-IN PORTAL</h2>
                <div class="login-form">
                    <div class="input-group">
                        <i class="fas fa-envelope input-icon"></i>
                        <input type="text" id="loginEmail" placeholder="Email" />
                    </div>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <div class="password-wrapper">
                            <input type="password" id="loginPassword" placeholder="Password" />
                            <button type="button" class="password-toggle" data-target="loginPassword" aria-label="Toggle password visibility">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <button class="login-btn" id="loginBtn">LOGIN</button>
                    <div id="loginStatus" class="login-status"></div>
                </div>
                <div class="auth-switch">
                    Don't have an account? <a id="gotoCreate">Create Account</a><br />
                    Forgot your password? <a id="gotoForgot">Reset Password</a>
                </div>
            </div>
        </div>

        <!-- ===== CREATE ACCOUNT PAGE ===== -->
        <div class="login-section auth-page page-hidden" id="createSection">
            <div class="login-container">
                <h2 class="login-title">CREATE ACCOUNT</h2>
                <div class="login-form">
                    <div class="input-group">
                        <i class="fas fa-user input-icon"></i>
                        <input type="text" id="regName" placeholder="Full Name" />
                    </div>
                    <div class="input-group">
                        <i class="fas fa-envelope input-icon"></i>
                        <input type="email" id="regEmail" placeholder="Email" />
                    </div>
                    <div class="input-group">
                        <i class="fas fa-home input-icon"></i>
                        <input type="text" id="regAddress" placeholder="Address" />
                    </div>
                    <div class="input-group">
                        <i class="fas fa-phone input-icon"></i>
                        <input type="text" id="regPhone" placeholder="Phone Number" />
                    </div>
                    
                    <div class="input-group">
                        <i class="fas fa-calendar-alt input-icon"></i>
                        <input type="date" id="regDOB" placeholder="Date of Birth" required />
                    </div>
                    
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <div class="password-wrapper">
                            <input type="password" id="regPassword" placeholder="Password" />
                            <button type="button" class="password-toggle" data-target="regPassword" aria-label="Toggle password visibility">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <button class="login-btn" id="createAccountBtn">CREATE ACCOUNT</button>
                    <div id="createStatus" class="login-status"></div>
                </div>
                <div class="auth-switch">
                    Already have an account? <a id="gotoLoginFromCreate">Login here</a><br />
                    Forgot your password? <a id="gotoForgotFromCreate">Reset Password</a>
                </div>
            </div>
        </div>

        <!-- ===== FORGOT PASSWORD PAGE ===== -->
        <div class="login-section auth-page page-hidden" id="forgotSection">
            <div class="login-container">
                <h2 class="login-title">RESET PASSWORD</h2>
                <div class="login-form">
                    
                    <div id="findAccountSection">
                        <div class="input-group">
                            <i class="fas fa-envelope input-icon"></i>
                            <input type="text" id="resetIdentifier" placeholder="Email or Phone Number" />
                        </div>
                        <div class="input-group">
                            <i class="fas fa-user-tag input-icon"></i>
                            <input type="text" id="resetNickname" placeholder="Enter your full name" />
                        </div>
                        <button class="login-btn" id="findAccountBtn">FIND MY ACCOUNT</button>
                    </div>

                    <div id="accountVerifiedSection" class="page-hidden" style="margin-top: 5px;">
                        <div id="accountFoundNotice" style="color: #00e676; font-weight: bold; text-align: center; margin-bottom: 10px; font-size: 13px;">ACCOUNT FOUND</div>
                        
                        <div id="userAvatarBox" style="text-align: center; margin-bottom: 12px;">
                            <img id="userAvatarImg" src="" alt="Profile Picture" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid #38bdf8; display: none; margin: 0 auto 8px auto;" />
                        </div>

                        <div class="input-group" style="margin-bottom: 12px;">
                            <i class="fas fa-user input-icon"></i>
                            <input type="text" id="foundUserName" placeholder="User Name" readonly style="background: rgba(10, 25, 47, 0.4); cursor: not-allowed;" />
                        </div>

                        <div class="input-group" style="margin-bottom: 12px;">
                            <i class="fas fa-calendar-alt input-icon"></i>
                            <input type="date" id="verifyDOB" placeholder="Date of Birth (English Format)" required />
                        </div>
                        <button class="login-btn" id="processDobBtn">PROCESSED</button>
                    </div>

                    <div class="password-section" id="passwordSection">
                        <div class="input-group">
                            <i class="fas fa-lock input-icon"></i>
                            <div class="password-wrapper">
                                <input type="password" id="resetNewPassword" placeholder="Input New Password" />
                                <button type="button" class="password-toggle" data-target="resetNewPassword" aria-label="Toggle password visibility">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button class="login-btn" id="submitNewPasswordBtn">
                            <i class="fas fa-paper-plane"></i> SUBMIT
                        </button>
                    </div>
                    
                    <div id="resetStatus" class="login-status"></div>
                </div>
                <div class="auth-switch">
                    Remember your password? <a id="gotoLoginFromForgot">Login here</a><br />
                    Don't have an account? <a id="gotoCreateFromForgot">Create Account</a>
                </div>
            </div>
        </div>

<!-- ===== POPUP: CONFIRM PASSWORD ===== -->
<div class="popup-overlay" id="confirmPopup">
    <div class="popup-box">
        <button class="popup-close" id="popupClose">&times;</button>
        <h3><i class="fas fa-shield-alt"></i> Confirm Password</h3>
        <div class="input-group">
            <i class="fas fa-lock input-icon"></i>
            <div class="password-wrapper">
                <!-- यहाँ 'New' शब्दलाई हटाइएको छ -->
                <input type="password" id="popupPassword" placeholder="Re-enter Password" />
                <button type="button" class="password-toggle" data-target="popupPassword" aria-label="Toggle password visibility">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
        <button class="login-btn" id="popupConfirmBtn">CONFIRM</button>
        <div id="popupStatus" class="login-status"></div>
    </div>
        </div>
    `;
}