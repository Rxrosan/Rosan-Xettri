// rx-news.js - News Page Content
function rxLoadNewsPage(rxDisplayArea) {
    rxDisplayArea.style.alignItems = "center";
    rxDisplayArea.style.justifyContent = "flex-start";
    rxDisplayArea.innerHTML = `
        <div style="width: 100%; max-width: 1200px; margin: 0 auto; text-align: left;">
            <h2 style="width: 100%; text-align: center; margin-bottom: 20px;">Latest News & Updates</h2>
            <p style="text-align: center; color: #555; margin-bottom: 30px;">यहाँ नवीनतम सूचना तथा समाचारहरू उपलब्ध हुनेछन्।</p>
        </div>
    `;
}