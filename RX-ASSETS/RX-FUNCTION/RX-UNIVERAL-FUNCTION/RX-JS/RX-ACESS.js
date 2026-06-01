(function () {
"use strict";

/* ==========================
   CONFIG
========================== */

const CONTENT_MAP = {
    file1:{path:"RX-ASSETS/RX-FUNCTION/RX-UNIVERAL-FUNCTION/RX-JS/RX-SMART-BUTTON.js",type:"js",title:"Smart Button"},
    file2:{path:"RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-1-FILES/RX-EXAM-FUNCTION-JS/questions-manager.js",type:"js",title:"Exam Model 1"},
    file3:{path:"RX-ASSETS/RX-OTHER-SOFTWARE-FUNCTION/RX-JS/RX-SMART-QR-GENATOR.js",type:"js",title:"QR Generator"},
    file4:{path:"RX-ASSETS/RX-FUNCTION/RX-UNIVERAL-FUNCTION/RX-JS/RX-SMART-BUTTON.js",type:"js",title:"Functions"},
    file5:{path:"RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-2-FILES/RX-KR-EXAM-QUESTIONS-MODEL-2/SET-1.js",type:"js",title:"Set 1"},
    file6:{path:"RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-2-FILES/RX-KR-EXAM-QUESTIONS-MODEL-2/SET-2.js",type:"js",title:"Set 2"},
    file7:{path:"RX-ASSETS/RX-EXAM-FILE/RX-KR-EXAM-MODEL-2-FILES/RX-KR-EXAM-QUESTIONS-MODEL-2/SET-3.js",type:"js",title:"Set 3"}
};

const STORE_KEY = "activeContentId";
const USER_KEY = "currentUser";

/* ==========================
   SAFE JSON
========================== */

function safeJSON(data){
    try{
        return JSON.parse(data);
    }catch{
        return null;
    }
}

/* ==========================
   LOADER
========================== */

function showLoader(){

    const loader = document.createElement("div");

    loader.id = "rx-loader";

    loader.innerHTML = `
    <div style="
        position:fixed;
        inset:0;
        background:#f4f4f4;
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        font-family:sans-serif;
        flex-direction:column;
    ">
        <h2>Loading...</h2>
        <small>Please wait</small>
    </div>`;

    document.body?.appendChild(loader);
}

function removeLoader(){

    document
    .getElementById("rx-loader")
    ?.remove();
}

/* ==========================
   ERROR
========================== */

function showError(title,msg){

    removeLoader();

    document.body.innerHTML = `
    <div style="
        height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#f4f4f4;
        font-family:sans-serif;
    ">
        <div style="
            background:white;
            padding:30px;
            border-radius:15px;
            width:min(400px,90%);
            text-align:center;
            box-shadow:0 0 20px rgba(0,0,0,.1);
        ">
            <h2>${title}</h2>
            <p>${msg}</p>
            <footer style="
                margin-top:20px;
                font-size:12px;
                color:#888;
            ">
                RX STUDIO
            </footer>
        </div>
    </div>
    `;

    setTimeout(()=>{
        location.replace("Resource.html");
    },2500);
}

/* ==========================
   START
========================== */

const params =
new URLSearchParams(
location.search
);

const activeId =
params.get("content") ||
params.get("exam") ||
localStorage.getItem(
STORE_KEY
);

if(!activeId){

    showError(
        "ACESS NOT GRANTED",
        "Please select content. or make sure the file you select acess is graneted"
    );

    return;
}

const config =
CONTENT_MAP[activeId];

if(!config){

    localStorage.removeItem(
        STORE_KEY
    );

    showError(
        "Invalid",
        "Content unavailable."
    );

    return;
}

const user =
safeJSON(
localStorage.getItem(
USER_KEY
)
);

let allow=false;

if(user){

    allow =
    user.access?.includes(
        activeId
    );

    if(!allow){

        const timed =
        user.timedAccessConfig
        ?.[
            activeId
        ];

        if(
            timed?.startDate &&
            timed?.duration
        ){

            const expiry =
            new Date(
                timed.startDate
            ).getTime()

            +

            (
                timed.duration
                *
                86400000
            );

            allow =
            Date.now()
            <
            expiry;
        }
    }
}

if(!allow){

    localStorage.removeItem(
        STORE_KEY
    );

    showError(
        "Access Denied",
        "Subscription expired."
    );

    return;
}

localStorage.setItem(
STORE_KEY,
activeId
);

document.title =
config.title ||
"RX System";

showLoader();

/* ==========================
   LOAD FILES
========================== */

if(config.type==="js"){

    if(
        !document.querySelector(
            `[data-rx="${config.path}"]`
        )
    ){

        const script =
        document.createElement(
            "script"
        );

        script.src =
        config.path;

        script.defer =
        true;

        script.dataset.rx =
        config.path;

        script.onload =
        ()=>{

            removeLoader();

            history.replaceState(
                {},
                "",
                location.pathname
            );
        };

        script.onerror =
        ()=>{

            showError(
                "Load Error",
                "JS failed loading."
            );
        };

        document.head.appendChild(
            script
        );
    }

}else{

fetch(config.path)

.then(r=>{

if(!r.ok)
throw Error();

return r.text();

})

.then(html=>{

removeLoader();

const target =
document.getElementById(
config.target
);

if(target)
target.innerHTML =
html;

})

.catch(()=>{

showError(
"HTML Error",
"Content failed loading."
);

});

}

})();