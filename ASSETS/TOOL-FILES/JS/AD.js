(function () {
    const ads = [
        {
            id: 1,
            title: "Mirai International Language Centre",
            content: "Admissions open for Japanese and Korean language courses — for work & study!",
            image: "asset/img/ad/mirai1.jpg",
            duration: 3,
            contact: {
                phone: "07655217,9867134971, 9749909414,9761691883",
                email: "mirailanguage280@gmail.com",
                website: "",
                facebook: "https://www.facebook.com/profile.php?id=61576608577238",
                address: "Banganga 1 4NO. kapilvastu",
                moreInfo: "Enroll now to start your journey in Japan or Korea for education and work!"
            }
        },
        // Add more ads as needed...
    ];

    const ad = ads[Math.floor(Math.random() * ads.length)];

    const container = document.createElement('div');
    container.className = 'rx-ad-container';
    container.innerHTML = `
        <div class="rx-ad-card">
            <h2>${ad.title}</h2>
            <p>${ad.content}</p>
            <img src="${ad.image}" alt="Ad image">
            <div class="rx-ad-buttons">
                <button id="rx-skip" disabled>Skip (${ad.duration})</button>
                <button id="rx-more">More Details</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);
    document.body.style.overflow = 'hidden';

    const css = document.createElement('style');
    css.innerHTML = `
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
        .rx-ad-container {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            font-family: "Segoe UI", sans-serif;
        }
        .rx-ad-card {
            background: #fff;
            border-radius: 10px;
            padding: 24px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        .rx-ad-card img {
            width: 100%;
            margin: 16px 0;
            border-radius: 8px;
        }
        .rx-ad-buttons {
            margin-top: 16px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .rx-ad-buttons button {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s ease;
        }
        #rx-skip {
            background: #e53935;
            color: white;
        }
        #rx-skip:disabled {
            background: #aaa;
            cursor: not-allowed;
        }
        #rx-more {
            background: #4CAF50;
            color: white;
        }
        .rx-modal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 1000000;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px;
        }
        .rx-modal-box {
            background: white;
            border-radius: 10px;
            padding: 30px;
            max-width: 600px;
            width: 100%;
            text-align: left;
        }
        .rx-modal-box h2 {
            margin-top: 0;
        }
        .rx-modal-box p {
            margin: 6px 0;
        }
        .rx-contact a {
            color: #007BFF;
            text-decoration: none;
            margin-right: 10px;
        }
        .rx-social a {
            font-size: 22px;
            color: #4267B2;
            margin-right: 10px;
        }
        .rx-modal-box iframe {
            width: 100%;
            height: 200px;
            border: none;
            margin-top: 16px;
            border-radius: 8px;
        }
        .rx-modal-box button {
            margin-top: 20px;
            padding: 10px 18px;
            background: #333;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(css);

    // Countdown Timer
    let sec = ad.duration;
    const skipBtn = document.getElementById('rx-skip');
    const interval = setInterval(() => {
        sec--;
        skipBtn.innerText = `Skip (${sec})`;
        if (sec <= 0) {
            clearInterval(interval);
            skipBtn.disabled = false;
            skipBtn.innerText = "Skip";
        }
    }, 1000);

    // Skip Handler
    skipBtn.addEventListener('click', () => {
        container.remove();
        document.body.style.overflow = '';
    });
// More Details Handler
document.getElementById('rx-more').addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'rx-modal';

    const phoneLinks = ad.contact.phone
        .split(',')
        .map(p => `<a href="tel:${p.trim()}">${p.trim()}</a>`)
        .join(', ');

    modal.innerHTML = `
        <div class="rx-modal-box">
            <h2>${ad.title}</h2>
            <p>${ad.contact.moreInfo}</p>
            <div class="rx-contact">
                <p><strong> Address:</strong> ${ad.contact.address}</p>
                <p><strong> Phone:</strong> ${phoneLinks}</p>
                <p><strong> Email:</strong> <a href="mailto:${ad.contact.email}">${ad.contact.email}</a></p>
                <p><strong> Website:</strong> <a href="${ad.contact.website}" target="_blank">${ad.contact.website}</a></p>
                <div class="rx-social">
                    <a href="${ad.contact.facebook}" target="_blank"><i class="fab fa-facebook-square"></i></a>
                </div>
            </div>
            <button id="rx-close-modal">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('rx-close-modal').addEventListener('click', () => {
        modal.remove();
    });
});

    // Fallback auto-close after 30 seconds
    setTimeout(() => {
        if (document.body.contains(container)) {
            container.remove();
            document.body.style.overflow = '';
        }
    }, 30000);
})();

