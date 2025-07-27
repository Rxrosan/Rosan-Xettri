// login.js (with sessionStorage)

document.addEventListener('DOMContentLoaded', () => {

    // --- NEW: Check if the user is already logged in for this session ---
    if (sessionStorage.getItem('isWebsiteUnlocked') === 'true') {
        // If the session key exists, do nothing. The script will stop here,
        // and the website will load normally without a popup.
        return;
    }
  
    // If no session key is found, proceed to create and show the login popup.
  
    // --- 1. Create and Inject CSS Styles ---
    const styles = `
        .website-content-hidden-by-popup {
            display: none !important;
        }
        .popup-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.85); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
            font-family: Arial, sans-serif;
        }
        .popup-container {
            background-color: white; padding: 25px; border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3); text-align: center;
            width: 90%; max-width: 400px;
        }
        .popup-view { display: none; }
        .popup-view.active { display: block; }
        .popup-container .policy-content, .popup-container .tos-content {
            max-height: 300px; overflow-y: auto; margin: 15px 0;
            padding: 10px; border: 1px solid #eee; text-align: left;
            font-size: 14px;
        }
        .popup-container h2 { margin-top: 0; margin-bottom: 20px; color: #333; }
        .popup-container h3 { margin-top: 0; color: #444; }
        .popup-container h4 { margin: 15px 0 10px 0; color: #555; }
        .popup-container p { color: #666; line-height: 1.6; }
        .popup-container ul { padding-left: 20px; }
        .popup-container li { margin-bottom: 8px; }
        .popup-container button {
            display: block; width: 100%; padding: 12px; margin: 10px 0;
            border: none; border-radius: 5px; background-color: #007bff;
            color: white; font-size: 16px; cursor: pointer;
            transition: background-color 0.3s;
        }
        .popup-container button:hover { background-color: #0056b3; }
        .popup-container button.secondary-btn {
            background-color: transparent; color: #007bff;
            border: 1px solid #007bff; margin: 5px 0;
        }
        .popup-container button.secondary-btn:hover {
            background-color: #f0f7ff;
        }
        .popup-container input {
            box-sizing: border-box; width: 100%; padding: 12px; margin-bottom: 12px;
            border: 1px solid #ccc; border-radius: 5px; font-size: 16px;
        }
        .popup-container .back-button { background-color: #6c757d; }
        .popup-container .back-button:hover { background-color: #5a6268; }
        .popup-container .contact-links a {
            display: inline-block; margin: 10px 15px; color: #007bff;
            text-decoration: none; font-size: 18px;
        }
        .popup-container .contact-links a:hover { text-decoration: underline; }
        #login-message { margin-top: 15px; font-weight: bold; min-height: 20px; }
        .success-message { color: #28a745; }
        .error-message { color: #dc3545; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  
    // --- 2. Hide Main Website Content ---
    const mainContentWrapper = document.createElement('div');
    mainContentWrapper.id = 'main-website-content-wrapper';
    mainContentWrapper.classList.add('website-content-hidden-by-popup');
  
    while (document.body.firstChild) {
        mainContentWrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(mainContentWrapper);
  
    // --- 3. Create and Inject Popup HTML ---
    const popupHTML = `
      <div id="auth-popup-overlay" class="popup-overlay">
        <div class="popup-container">
          <!-- Views here -->
          <div id="initial-options" class="popup-view active">
            <h2>Rosan Xettri Studio</h2>
            <p>Please log in to continue or Purchase the model to get access key.</p>
            <button id="show-login-btn">Login</button>
            <button id="show-register-btn">Purchase</button>
            <div style="margin-top: 15px;">
              <button id="show-policy-btn" class="secondary-btn">Privacy Policy</button>
              <button id="show-tos-btn" class="secondary-btn">Terms of Service</button>
            </div>
          </div>
          <div id="login-form" class="popup-view">
            <h3>Login Access</h3>
            <input type="text" id="name-input" placeholder="Name" required>
            <input type="text" id="phone-input" placeholder="Phone Number" required>
            <input type="password" id="key-input" placeholder="Key" required>
            <button id="submit-login">Login</button>
            <button class="back-button">Back</button>
            <p id="login-message"></p>
          </div>
          <div id="register-info" class="popup-view">
            <h3>Register or Purchase</h3>
            <p>To get your registration key, please contact the website owner to purchsae the exam model and get key:</p>
            <div class="contact-links">
              <a href="https://www.facebook.com/Rosan.2061" target="_blank">Facebook</a>
              <a href="mailto:rosankc820@.com">Gmail</a>
            </div>
            <button class="back-button">Back</button>
          </div>
          <div id="policy-view" class="popup-view">
            <h3>Privacy Policy</h3>
            <div class="policy-content">
              <p><strong>Last Updated:</strong> [2025/7/27]</p>
              <p>This privacy policy explains how we collect, use, and protect your personal information when you use our website.</p>
              
              <h4>Information We Collect</h4>
              <p>When you log in to our website, we collect the following information:</p>
              <ul>
                <li>Your name</li>
                <li>Phone number</li>
                <li>Access key</li>
              </ul>
              
              <h4>How We Use Your Information</h4>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Verify your identity for access to the website</li>
                <li>Provide customer support</li>
                <li>Improve our services</li>
              </ul>
              
              <h4>Data Security</h4>
              <p>We implement appropriate security measures to protect your personal information. Your login details are stored locally in your browser's session storage and are not transmitted to our servers.</p>
              
              <h4>Changes to This Policy</h4>
              <p>We may update this privacy policy from time to time. Any changes will be posted on this page.</p>
            </div>
            <button class="back-button">Back</button>
          </div>
          <div id="tos-view" class="popup-view">
            <h3>Terms of Service</h3>
            <div class="tos-content">
              <p><strong>Last Updated:</strong> [2025/7/27]</p>
              <p>By accessing and using this website, you accept and agree to be bound by these Terms of Service.</p>
              
              <h4>1. Account Access</h4>
              <ul>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the confidentiality of your access key</li>
                <li>You are responsible for all activities that occur under your account</li>
              </ul>
              
              <h4>2. Prohibited Activities</h4>
              <p>You agree not to:</p>
              <ul>
                <li>Use the website for any illegal purpose</li>
                <li>Share your access key with others</li>
                <li>Attempt to gain unauthorized access to other accounts</li>
                <li>Disrupt or interfere with the security of the website</li>
              </ul>
              
              <h4>3. Intellectual Property</h4>
              <p>All content on this website, including models, designs, and materials, are the property of Rosan Xettri Studio and are protected by copyright laws.</p>
              
              <h4>4. Termination</h4>
              <p>We may terminate or suspend your access to the website immediately, without prior notice, for any violation of these Terms.</p>
              
              <h4>5. Limitation of Liability</h4>
              <p>Rosan Xettri Studio shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the website.</p>
              
              <h4>6. Changes to Terms</h4>
              <p>We reserve the right to modify these Terms at any time. Your continued use of the website constitutes acceptance of the modified Terms.</p>
            </div>
            <button class="back-button">Back</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
  
    // --- 4. Add Functionality and Logic ---
    const overlay = document.getElementById('auth-popup-overlay');
    const popupViews = document.querySelectorAll('.popup-view');
    const initialView = document.getElementById('initial-options');
    const loginView = document.getElementById('login-form');
    const registerView = document.getElementById('register-info');
    const policyView = document.getElementById('policy-view');
    const tosView = document.getElementById('tos-view');
  
    function showView(viewToShow) {
        popupViews.forEach(v => v.classList.remove('active'));
        viewToShow.classList.add('active');
    }
  
    document.getElementById('show-login-btn').addEventListener('click', () => {
        showView(loginView);
        document.getElementById('login-message').textContent = '';
    });
  
    document.getElementById('show-register-btn').addEventListener('click', () => {
        showView(registerView);
    });
  
    document.getElementById('show-policy-btn').addEventListener('click', () => {
        showView(policyView);
    });
  
    document.getElementById('show-tos-btn').addEventListener('click', () => {
        showView(tosView);
    });
  
    document.querySelectorAll('.back-button').forEach(btn => {
        btn.addEventListener('click', () => showView(initialView));
    });
  
    document.getElementById('submit-login').addEventListener('click', () => {
        const name = document.getElementById('name-input').value.trim();
        const phone = document.getElementById('phone-input').value.trim();
        const key = document.getElementById('key-input').value.trim();
        const loginMessage = document.getElementById('login-message');
  
        if (!name || !phone || !key) {
            loginMessage.textContent = 'All fields are required.';
            loginMessage.className = 'error-message';
            return;
        }
  
        const validUser = userDetails.find(user => 
            user.name.toLowerCase() === name.toLowerCase() && 
            user.phone === phone && 
            user.key === key
        );
  
        if (validUser) {
            loginMessage.textContent = `Welcome, ${validUser.name}!`;
            loginMessage.className = 'success-message';
  
            // --- NEW: On successful login, save the state to sessionStorage ---
            sessionStorage.setItem('isWebsiteUnlocked', 'true');
            
            setTimeout(() => {
                overlay.remove();
                mainContentWrapper.classList.remove('website-content-hidden-by-popup');
            }, 1500);
        } else {
            loginMessage.textContent = 'Invalid details. Please try again.';
            loginMessage.className = 'error-message';
        }
    });
  });