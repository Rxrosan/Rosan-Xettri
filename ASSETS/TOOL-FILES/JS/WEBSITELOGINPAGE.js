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
      .popup-container h2 { margin-top: 0; margin-bottom: 20px; color: #333; }
      .popup-container h3 { margin-top: 0; color: #444; }
      .popup-container p { color: #666; line-height: 1.6; }
      .popup-container button {
          display: block; width: 100%; padding: 12px; margin: 10px 0;
          border: none; border-radius: 5px; background-color: #007bff;
          color: white; font-size: 16px; cursor: pointer;
          transition: background-color 0.3s;
      }
      .popup-container button:hover { background-color: #0056b3; }
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