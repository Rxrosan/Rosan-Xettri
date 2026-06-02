(function () {
    "use strict";

    const LOGO_URL = "RX-ASSETS/RX-IMAGE/RX-LOGO/L-7.gif";
    const BG_COLOR = "#0a192f";
    const PRIMARY_TEXT = "RX STUDIO";
    const SECONDARY_TEXT = "ROSAN KC";

    document.documentElement.style.background = BG_COLOR;

    // CSS
    const style = document.createElement("style");

    style.textContent = `
        #ui-loader-wrapper{
            position:fixed;
            inset:0;
            width:100%;
            height:100dvh;

            display:flex;
            justify-content:center;
            align-items:center;
            flex-direction:column;

            background:${BG_COLOR};

            z-index:999999999;

            transition:opacity .5s ease;
        }

        .loader-image{
            width:clamp(90px,22vw,150px);
            max-width:100%;
            height:auto;
            margin-bottom:15px;
        }

        .brand-name{
            color:#fff;
            font-size:clamp(20px,4vw,28px);
            margin:0;
            text-align:center;
        }

        .author-name{
            color:rgba(255,255,255,.6);
            margin-top:8px;
            text-align:center;
            font-size:14px;
        }

        .loader-hide{
            opacity:0;
            pointer-events:none;
        }
    `;

    (document.head || document.documentElement)
        .appendChild(style);

    const loader = document.createElement("div");

    loader.id = "ui-loader-wrapper";

    loader.innerHTML = `
        <img src="${LOGO_URL}" class="loader-image">
        <h1 class="brand-name">${PRIMARY_TEXT}</h1>
        <div class="author-name">${SECONDARY_TEXT}</div>
    `;

    // Wait until body exists
    function injectLoader() {

        if (document.body) {

            document.body.prepend(loader);

        } else {

            requestAnimationFrame(
                injectLoader
            );

        }
    }

    injectLoader();

    // Remove loader after everything loads
    window.addEventListener(
        "load",
        () => {

            setTimeout(() => {

                loader.classList.add(
                    "loader-hide"
                );

                setTimeout(() => {

                    loader.remove();

                    document.documentElement
                    .style.background = "";

                }, 500);

            }, 200);

        }
    );

    // emergency fallback
    setTimeout(() => {

        if (
            document.getElementById(
                "ui-loader-wrapper"
            )
        ) {

            loader.remove();

        }

    }, 8000);

})();