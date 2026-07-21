// ===== profile-loader.js ===== //
(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function () {
        // १. rx-login.js ले सेसनमा राखेको 'rxSession' बाट User Data तान्ने
        const savedSession = sessionStorage.getItem("rxSession");
        const currentUser = savedSession ? JSON.parse(savedSession) : null;

        // २. यदि युजर लगइन भएको छैन भने सिधै लगइन पेजमा अटो-रिडाइरेक्ट गर्ने
        if (!currentUser) {
            console.log("No active session found. Redirecting to login portal...");
            window.location.href = "User-Authentication.html";
            return;
        }

        console.log("Active user loaded:", currentUser.name || currentUser.email);

        // ३. HTML का अनुसार Profile Data देखाउने
        if (document.getElementById("profile-fullname")) {
            document.getElementById("profile-fullname").innerText = currentUser.name || 'User';
        }
        if (document.getElementById("profile-username")) {
            document.getElementById("profile-username").innerText = currentUser.name || '-';
        }
        if (document.getElementById("dropdown-name")) {
            document.getElementById("dropdown-name").innerText = currentUser.name || '-';
        }
        if (document.getElementById("username")) {
            document.getElementById("username").innerText = currentUser.name || '-';
        }
        if (document.getElementById("dropdown-email")) {
            document.getElementById("dropdown-email").innerText = currentUser.email || '-';
        }
        if (document.getElementById("dropdown-phone")) {
            document.getElementById("dropdown-phone").innerText = currentUser.phone || '-';
        }
        if (document.getElementById("dropdown-address")) {
            document.getElementById("dropdown-address").innerText = currentUser.address || '-';
        }
        if (document.getElementById("dropdown-account-type")) {
            document.getElementById("dropdown-account-type").innerText = currentUser.role || 'Member';
        }
        if (document.getElementById("dropdown-user-id")) {
            document.getElementById("dropdown-user-id").innerText = currentUser.id || '-';
        }
        if (document.getElementById("detailDOB")) {
            document.getElementById("detailDOB").innerText = currentUser.dob || '-';
        }

        // सर्भर वा सेसनमा भएको प्रोफाइल पिक्चर लोड गर्ने (Supabase को avatar_url बाट)
        const profileImgElement = document.getElementById("profile-img");
        if (currentUser.avatar_url && profileImgElement) {
            profileImgElement.src = currentUser.avatar_url;
        }

        // ४. Image Upload & Cropper Logic
        const changeTrigger = document.getElementById("changeProfileTrigger");
        const imageInput = document.getElementById("profileImageInput");
        const cropModal = document.getElementById("cropModal");
        const imageToCrop = document.getElementById("imageToCrop");
        const cropSaveBtn = document.getElementById("cropSaveBtn");
        const cropCancelBtn = document.getElementById("cropCancelBtn");
        let cropper = null;

        if (changeTrigger && imageInput) {
            changeTrigger.addEventListener("click", function() {
                imageInput.click();
            });

            imageInput.addEventListener("change", function(e) {
                const files = e.target.files;
                if (files && files.length > 0) {
                    const file = files[0];

                    // फाइल साइज २ MB भन्दा बढी भए नभएको जाँच गर्ने
                    if (file.size > 2 * 1024 * 1024) {
                        alert("File size exceeds 2MB! Please select an image smaller than 2MB.");
                        imageInput.value = "";
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = function(event) {
                        imageToCrop.src = event.target.result;
                        cropModal.style.display = "flex";

                        if (cropper) {
                            cropper.destroy();
                        }
                        // Cropper इनिसिएट गर्ने (Square ratio मा)
                        cropper = new Cropper(imageToCrop, {
                            aspectRatio: 1,
                            viewMode: 1,
                            autoCropArea: 0.8,
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (cropSaveBtn) {
            cropSaveBtn.addEventListener("click", async function() {
                if (cropper) {
                    const canvas = cropper.croppedCanvas || cropper.getCroppedCanvas({
                        width: 300,
                        height: 300
                    });

                    if (canvas) {
                        const croppedImageUrl = canvas.toDataURL("image/jpeg");
                        
                        // युजरलाई देखाउनको लागि तत्काल इमेज चेन्ज गर्ने
                        if (profileImgElement) {
                            profileImgElement.src = croppedImageUrl;
                        }

                        // अब Render सर्भर मार्फत Supabase मा इमेज पठाएर सेभ गर्ने
                        try {
                            const response = await fetch('https://rosan-xettri.onrender.com/api/update-avatar', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: currentUser.email,
                                    avatarUrl: croppedImageUrl
                                })
                            });

                            const result = await response.json();

                            if (response.ok) {
                                // सेसन डेटा अपडेट गर्ने
                                currentUser.avatar_url = croppedImageUrl;
                                sessionStorage.setItem("rxSession", JSON.stringify(currentUser));
                                alert("Profile picture updated and saved to server successfully!");
                            } else {
                                alert(result.error || "Failed to save profile picture on server.");
                            }
                        } catch (err) {
                            console.error("Server connection error:", err);
                            alert("Server Connection Failed while saving avatar!");
                        }

                        // मोडल बन्द गर्ने
                        cropModal.style.display = "none";
                        cropper.destroy();
                        imageInput.value = "";
                    }
                }
            });
        }

        if (cropCancelBtn) {
            cropCancelBtn.addEventListener("click", function() {
                cropModal.style.display = "none";
                if (cropper) {
                    cropper.destroy();
                }
                imageInput.value = "";
            });
        }

        // ५. लगआउट (Logout) ह्यान्डल गर्ने
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function (e) {
                e.preventDefault();
                sessionStorage.removeItem("rxSession");
                sessionStorage.removeItem("rxPageState");
                console.log("Logged out successfully.");
                window.location.href = "User-Authentication.html";
            });
        }
    });
})();