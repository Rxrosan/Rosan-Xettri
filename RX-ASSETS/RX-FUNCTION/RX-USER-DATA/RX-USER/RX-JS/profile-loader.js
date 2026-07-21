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

        // सेभ भएको कस्ट्म प्रोफाइल पिक्चर लोड गर्ने (यदि छ भने)
        const savedAvatar = localStorage.getItem("rx_user_avatar_" + (currentUser.email || 'default'));
        const profileImgElement = document.getElementById("profile-img");
        if (savedAvatar && profileImgElement) {
            profileImgElement.src = savedAvatar;
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

                    // फाइभ साइज २ MB भन्दा बढी भए नभएको जाँच गर्ने (2MB = 2 * 1024 * 1024 bytes)
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
            cropSaveBtn.addEventListener("click", function() {
                if (cropper) {
                    const canvas = cropper.croppedCanvas || cropper.getCroppedCanvas({
                        width: 300,
                        height: 300
                    });

                    if (canvas) {
                        const croppedImageUrl = canvas.toDataURL("image/jpeg");
                        
                        // प्रोफाइल इमेज अपडेट गर्ने
                        if (profileImgElement) {
                            profileImgElement.src = croppedImageUrl;
                        }

                        // LocalStorage मा सेभ गर्ने (युजरको इमेल अनुसार)
                        localStorage.setItem("rx_user_avatar_" + (currentUser.email || 'default'), croppedImageUrl);

                        // मोडल बन्द गर्ने
                        cropModal.style.display = "none";
                        cropper.destroy();
                        imageInput.value = "";
                        alert("Profile picture updated successfully!");
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