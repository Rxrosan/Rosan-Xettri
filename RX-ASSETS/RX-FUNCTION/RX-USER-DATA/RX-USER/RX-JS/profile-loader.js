// ===== profile-loader.js ===== //
(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function () {
        // १. rx-login.js ले localStorage मा छोडेको ईमेल वा युजर विवरण सेन्स (Read) गर्ने
        const loggedInEmail = localStorage.getItem("loggedInUserEmail") || localStorage.getItem("userEmail"); 

        // २. सुरक्षा चेक (Route Guard): यदि युजर लगइन भएको छैन भने सिधै लगइन पेजमा अटो-रिडाइरेक्ट गर्ने
        if (!loggedInEmail) {
            console.log("No active session found. Redirecting to login portal...");
            window.location.href = "User-Authentication.html";
            return; // कोडलाई अगाडि बढ्न नदिने
        }

        // ३. user.js को allUsers एरेबाट डेटा रीड गरेर UI र फारम भर्ने
        if (typeof allUsers !== 'undefined' && Array.isArray(allUsers)) {
            const currentUser = allUsers.find(u => u.email === loggedInEmail);

            if (currentUser) {
                console.log("Active user sensed: " + currentUser.fullName);

                // क) प्रोफाइल सेक्सनमा विवरणहरू स्वतः देखाउने (UI Elements)
                if(document.getElementById("profileName")) document.getElementById("profileName").innerText = currentUser.fullName;
                if(document.getElementById("profileEmail")) document.getElementById("profileEmail").innerText = currentUser.email;
                if(document.getElementById("profilePhone")) document.getElementById("profilePhone").innerText = currentUser.phone || 'N/A';
                if(document.getElementById("profileAddress")) document.getElementById("profileAddress").innerText = currentUser.address || 'N/A';
                if(document.getElementById("profileUserId")) document.getElementById("profileUserId").innerText = currentUser.userId;

                // ख) फारम अपलोडर / खरिद फारम (Purchase Form) मा विवरण स्वतः भरिदिने (Auto-fill)
                // युजरले टाइप गर्नै पर्दैन, सिधै 'Read-Only' हुन्छ
                const formFields = {
                    "formFullName": currentUser.fullName,
                    "formEmail": currentUser.email,
                    "formPhone": currentUser.phone || '',
                    "formUserId": currentUser.userId
                };

                for (const [id, value] of Object.entries(formFields)) {
                    const element = document.getElementById(id);
                    if (element) {
                        element.value = value;
                        element.readOnly = true; // युजरले म्यानुअल्ली एडिट गर्न नमिल्ने बनाउने
                    }
                }
            } else {
                console.warn("Logged in email not found in allUsers database.");
            }
        } else {
            console.error("Error: 'allUsers' database is missing. Make sure user.js is loaded before profile-loader.js.");
        }

        // ४. लगआउट ह्यान्डलर र तत्काल अटो-रिडाइरेक्ट
        // HTML मा भएको लगआउट बटनको सम्भावित ID हरू (logoutBtn, logOut, profileLogout आदि) लाई चेक गर्ने
        const logoutBtn = document.getElementById("logoutBtn") || 
                          document.getElementById("logOut") || 
                          document.getElementById("profileLogout") ||
                          document.querySelector(".logout-link"); // यदि क्लास छ भने
        
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function (e) {
                e.preventDefault(); // डिफल्ट क्लिक एक्सन रोक्ने

                // ब्राउजर मेमोरीमा भएका सबै सेसन र लगइन विवरणहरू सफा गर्ने
                localStorage.removeItem("loggedInUserEmail");
                localStorage.removeItem("currentUser");
                localStorage.removeItem("userEmail");
                sessionStorage.removeItem("rxSession");
                sessionStorage.removeItem("rxPageState");

                console.log("User logged out successfully. Redirecting to login portal...");

                // तुरुन्तै लगइन पेजमा पुर्‍याउने (Instant Auto-Redirect)
                window.location.href = "User-Authentication.html";
            });
        }
    });
})();