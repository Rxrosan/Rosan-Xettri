/**
 * RX-Protect.js - v3 (Permanent Login & Welcome Message)
 * 
 * This script checks for a permanent login in localStorage.
 * - If not logged in: It hides the page and shows a redirect message.
 * - If logged in: It reveals the page and shows a temporary welcome toast.
 */

function enforceLogin() {
    const currentUserJSON = localStorage.getItem('currentUser');
    const body = document.body;
    
    if (!currentUserJSON) {
        showLoginRequiredMessage();
    } else {
        body.classList.remove('rx-protect-hidden');
        try {
            const user = JSON.parse(currentUserJSON);
            const userName = user.name || user.username;
            showWelcomeToast(userName);
        } catch (e) {
            console.error("Could not parse user data from localStorage.", e);
        }
    }
}

function showWelcomeToast(userName) {
    const toast = document.createElement('div');
    toast.className = 'rx-welcome-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> Welcome, <strong>${userName}</strong>!`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3500);
}

function showLoginRequiredMessage() {
    const overlay = document.createElement('div');
    overlay.id = 'rx-protect-overlay';
    const messageBox = document.createElement('div');
    messageBox.className = 'rx-protect-message';
    const textElement = document.createElement('div');
    textElement.className = 'rx-protect-text';
    textElement.textContent = '';
    const button = document.createElement('button');
    button.className = 'rx-protect-button';
    button.textContent = 'Go to Login Page';
    button.onclick = function() {
        window.location.href = 'https://rosankc.com.np/USER-LOGIN.html'; 
    };
    messageBox.appendChild(textElement);
    messageBox.appendChild(button);
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
    addStyles();
    typewriterEffect(textElement, "Access Denied. Please log in to view this page.", function() {
        textElement.style.borderRight = 'none';
        textElement.style.animation = 'none';
        button.style.display = 'block';
    });
    setTimeout(function() {
        window.location.href = 'https://rosankc.com.np/USER-LOGIN.html';
    }, 8000);
}

function typewriterEffect(element, text, callback) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        } else if (callback) {
            callback();
        }
    }
    type();
}

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .rx-protect-hidden > * { display: none; }
        #rx-protect-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: #1c1c1c; 
            display: flex; justify-content: center; align-items: center;
            z-index: 9999; font-family: 'Arial', sans-serif;
        }
        .rx-protect-message {
            background: #2a2a2a; border: 1px solid #444; padding: 2rem;
            border-radius: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
            text-align: center; max-width: 90%; width: 500px;
            animation: fadeIn 0.5s ease-in-out; color: white;
        }
        .rx-protect-text {
            font-size: 1.5rem; margin-bottom: 1.5rem; min-height: 2.2rem;
            border-right: 3px solid white; animation: blink 0.7s infinite;
            padding-right: 5px; display: inline-block;
        }
        .rx-protect-button {
            display: none; background-color: white; color: #333;
            border: none; padding: 0.8rem 1.5rem; font-size: 1rem;
            border-radius: 50px; cursor: pointer; transition: all 0.3s ease;
            font-weight: bold; margin-top: 1rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .rx-protect-button:hover {
            background-color: #f0f0f0; transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        .rx-welcome-toast {
            position: fixed; bottom: 20px; left: 50%;
            transform: translateX(-50%); background-color: #2a2a2a; color: #fff;
            padding: 12px 20px; border-radius: 50px; border: 1px solid #444;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5); z-index: 10000;
            display: flex; align-items: center; gap: 10px; font-size: 1rem;
            font-family: 'Arial', sans-serif; animation: slideInUp 0.5s ease-out;
        }
        .rx-welcome-toast.fade-out { animation: slideOutDown 0.5s ease-in forwards; }
        .rx-welcome-toast i { color: #4CAF50; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes blink { 0%, 100% { border-color: transparent; } 50% { border-color: white; } }
        @keyframes slideInUp { from { transform: translate(-50%, 100px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        @keyframes slideOutDown { from { transform: translate(-50%, 0); opacity: 1; } to { transform: translate(-50%, 100px); opacity: 0; } }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', enforceLogin);