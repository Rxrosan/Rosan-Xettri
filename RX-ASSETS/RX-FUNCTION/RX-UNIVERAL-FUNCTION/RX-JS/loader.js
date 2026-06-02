(function () {
    "use strict";

    // ==========================
    // CONFIG
    // ==========================
    const LOGO_URL = "RX-ASSETS/RX-IMAGE/RX-LOGO/L-7.gif";

    const BG_COLOR = "#0a192f";

    const PRIMARY_TEXT = "RX STUDIO";
    const SECONDARY_TEXT = "ROSAN KC";

    const SHOW_TIME = 150;
    const FAILSAFE_TIME = 2500;

    document.documentElement.style.background =
        BG_COLOR;

    // ==========================
    // CSS
    // ==========================
    const style =
        document.createElement("style");

    style.textContent = `
        html,body{
            margin:0;
            padding:0;
            width:100%;
            min-height:100%;
            background:${BG_COLOR};
        }

        #ui-loader-wrapper{
            position:fixed;
            inset:0;

            width:100vw;
            height:100dvh;

            background:${BG_COLOR};

            display:flex;
            justify-content:center;
            align-items:center;

            z-index:2147483647;

            transition:opacity .5s ease;

            overflow:hidden;
        }

        .loader-content{
            display:flex;
            flex-direction:column;

            align-items:center;
            justify-content:center;

            text-align:center;

            width:min(90vw,500px);

            padding:20px;

            box-sizing:border-box;
        }

        .loader-image{
            width:clamp(90px,22vw,150px);

            max-width:100%;

            height:auto;

            display:block;

            object-fit:contain;

            margin-bottom:15px;
        }

        .brand-name{
            color:#fff;

            font-size:
            clamp(
                20px,
                4vw,
                28px
            );

            font-weight:700;

            letter-spacing:3px;

            margin:0;

            word-break:break-word;
        }

        .author-name{
            color:
            rgba(
                255,
                255,
                255,
                .65
            );

            font-size:
            clamp(
                11px,
                2vw,
                14px
            );

            margin-top:8px;

            letter-spacing:2px;
        }

        .loader-hide{
            opacity:0;

            pointer-events:none;
        }

        @media
        (
            orientation:landscape
        )
        and
        (
            max-height:500px
        ){

            .loader-image{
                width:90px;
            }

            .brand-name{
                font-size:18px;
            }

            .author-name{
                font-size:11px;
            }
        }
    `;

    if (document.head) {

        document.head.appendChild(
            style
        );

    } else {

        document.documentElement
        .appendChild(style);

    }

    // ==========================
    // LOADER HTML
    // ==========================
    const loader =
        document.createElement("div");

    loader.id =
        "ui-loader-wrapper";

    loader.innerHTML = `
        <div class="loader-content">

            <img
                src="${LOGO_URL}"
                class="loader-image"
                alt="Logo"
            >

            <h1 class="brand-name">
                ${PRIMARY_TEXT}
            </h1>

            <div class="author-name">
                ${SECONDARY_TEXT}
            </div>

        </div>
    `;

    // ==========================
    // ADD LOADER
    // ==========================
    function addLoader(){

        if(
            document.body &&
            !document.getElementById(
                "ui-loader-wrapper"
            )
        ){

            document.body.prepend(
                loader
            );

        }

    }

    if(document.body){

        addLoader();

    }else{

        document.addEventListener(
            "DOMContentLoaded",
            addLoader
        );

    }

    // ==========================
    // REMOVE LOADER
    // ==========================
    let removed = false;

    function removeLoader(){

        if(removed) return;

        removed = true;

        loader.classList.add(
            "loader-hide"
        );

        setTimeout(()=>{

            loader.remove();

            document.documentElement
            .style.background = "";

        },500);

    }

    // FAST REMOVE
    document.addEventListener(
        "DOMContentLoaded",
        ()=>{

            requestAnimationFrame(
                ()=>{

                    setTimeout(
                        removeLoader,
                        SHOW_TIME
                    );

                }
            );

        }
    );

    // FAILSAFE
    setTimeout(
        removeLoader,
        FAILSAFE_TIME
    );

})();