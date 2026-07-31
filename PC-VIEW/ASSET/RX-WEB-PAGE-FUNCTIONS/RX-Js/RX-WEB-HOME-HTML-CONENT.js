// rx-home.js - Home Page Content
// author : RX STUDIO

function rxLoadHomePage(rxDisplayArea) {
    rxDisplayArea.style.alignItems = "center";
    rxDisplayArea.style.justifyContent = "center";
    rxDisplayArea.innerHTML = `
        <div style="text-align: center; width: 100%; max-width: 1200px; margin: auto; padding: 20px;">
            <img src="ASSET/RX-IMAGES/RX-Logo/L-1.gif" alt="Logo" class="rx-welcome-logo">
            <h2 style="color: #1a4480; font-size: clamp(24px, 4vw, 32px); margin: 15px 0 10px;">Welcome</h2>
            <p style="color: #555; font-size: clamp(16px, 2.5vw, 20px); margin: 5px 0;">This is RX | Rosan KC New Update website v.3.0</p>
            <p style="color: #666; font-size: clamp(14px, 2vw, 18px); margin: 5px 0;">बायाँतर्फको मेनुबाट कुनैपनि अप्सन छान्नुहोस्।</p>
        </div>
    `;
    document.getElementById('rx-sidebar-heading').innerText = 'HOME';
}