// rx-home.js - Home Page Content
function rxLoadHomePage(rxDisplayArea) {
    rxDisplayArea.style.alignItems = "center";
    rxDisplayArea.style.justifyContent = "center";
    rxDisplayArea.innerHTML = `
        <div style="text-align: center; width: 100%; max-width: 1200px; margin: auto;">
            <img src="ASSET/RX-IMAGES/RX-Logo/L-1.gif" alt="Logo" class="rx-welcome-logo">
            <h2>Welcome</h2>
             <p>This is RX | Rosan KC New Update website v.3.0</p>
            <p>बायाँतर्फको मेनुबाट कुनैपनि अप्सन छान्नुहोस्।</p>
        </div>
    `;
    document.getElementById('rx-sidebar-heading').innerText = 'HOME';
}