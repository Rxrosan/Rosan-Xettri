// ===== profile-loader.js (Fixed Version with rxLoadAuthPage) ===== //
(function() {
    'use strict';

    // एउटा ग्लोबल फंक्शन बनाउने जसलाई rxLoadProfilePage पछि सीधै कल गर्न सकियोस्
    window.rxInitProfilePage = function() {
        const savedSession = sessionStorage.getItem("rxSession");
        const currentUser = savedSession ? JSON.parse(savedSession) : null;

        // यदि सेसन छैन भने सही मुख्य कन्टेनर एरियामा rxLoadAuthPage कल गर्ने
        if (!currentUser) {
            console.log("No active session found. Loading auth page...");
            const displayArea = document.getElementById('rx-display-area') || document.getElementById('rxDisplayArea') || document.body;
            if (typeof rxLoadAuthPage === 'function') {
                rxLoadAuthPage(displayArea);
            } else if (typeof rxLoadContent === 'function') {
                rxLoadContent('AUTHENTICATION');
            } else {
                console.error("rxLoadAuthPage function is not defined.");
            }
            return;
        }

        console.log("Active user loaded:", currentUser.user_name || currentUser.full_name || currentUser.email);

        const displayName = currentUser.full_name || currentUser.user_name || 'User';
        const displayEmail = currentUser.email || '-';
        const displayPhone = currentUser.phone || '-';
        const displayAddress = currentUser.address || '-';
        const displayRole = currentUser.account_type || 'Member';
        const displayId = currentUser.id || '-';
        const displayDob = currentUser.dateofbirth || currentUser.dob || '-';

        if (document.getElementById("profile-fullname")) {
            document.getElementById("profile-fullname").innerText = displayName;
        }
        if (document.getElementById("profile-username")) {
            document.getElementById("profile-username").innerText = displayName;
        }
        if (document.getElementById("dropdown-name")) {
            document.getElementById("dropdown-name").innerText = displayName;
        }
        if (document.getElementById("username")) {
            document.getElementById("username").innerText = displayName;
        }
        if (document.getElementById("dropdown-email")) {
            document.getElementById("dropdown-email").innerText = displayEmail;
        }
        if (document.getElementById("dropdown-phone")) {
            document.getElementById("dropdown-phone").innerText = displayPhone;
        }
        if (document.getElementById("dropdown-address")) {
            document.getElementById("dropdown-address").innerText = displayAddress;
        }
        if (document.getElementById("dropdown-account-type")) {
            document.getElementById("dropdown-account-type").innerText = displayRole;
        }
        if (document.getElementById("dropdown-user-id")) {
            document.getElementById("dropdown-user-id").innerText = displayId;
        }
        if (document.getElementById("detailDOB")) {
            document.getElementById("detailDOB").innerText = displayDob;
        }

        const profileImgElement = document.getElementById("profile-img");
        const userImage = currentUser.image || currentUser.avatar_url;
        if (userImage && profileImgElement) {
            profileImgElement.src = userImage;
        }

        // Image Upload & Cropper Logic
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

                    if (file.size > 2 * 1024 * 1024) {
                        alert("File size exceeds 2MB! Please select an image smaller than 2MB.");
                        imageInput.value = "";
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = function(event) {
                        if (imageToCrop) imageToCrop.src = event.target.result;
                        if (cropModal) cropModal.style.display = "flex";

                        if (cropper) {
                            cropper.destroy();
                        }
                        if (imageToCrop && typeof Cropper !== 'undefined') {
                            cropper = new Cropper(imageToCrop, {
                                aspectRatio: 1,
                                viewMode: 1,
                                autoCropArea: 0.8,
                            });
                        }
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
                        
                        if (profileImgElement) {
                            profileImgElement.src = croppedImageUrl;
                        }

                        try {
                            const response = await fetch('https://rx-backend-95ow.onrender.com/api/update-avatar', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: currentUser.email,
                                    avatarUrl: croppedImageUrl
                                })
                            });

                            const result = await response.json();

                            if (response.ok) {
                                currentUser.image = croppedImageUrl;
                                sessionStorage.setItem("rxSession", JSON.stringify(currentUser));
                                alert("Profile picture updated and saved to server successfully!");
                            } else {
                                alert(result.error || "Failed to save profile picture on server.");
                            }
                        } catch (err) {
                            console.error("Server connection error:", err);
                            alert("Server Connection Failed while saving avatar!");
                        }

                        if (cropModal) cropModal.style.display = "none";
                        cropper.destroy();
                        imageInput.value = "";
                    }
                }
            });
        }

        if (cropCancelBtn) {
            cropCancelBtn.addEventListener("click", function() {
                if (cropModal) cropModal.style.display = "none";
                if (cropper) {
                    cropper.destroy();
                }
                if (imageInput) imageInput.value = "";
            });
        }

        // Logout Event Handler - Fixed Version
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            // Remove any existing event listeners to prevent duplicates
            const newLogoutBtn = logoutBtn.cloneNode(true);
            logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
            
            newLogoutBtn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Clear session data
                sessionStorage.removeItem("rxSession");
                sessionStorage.removeItem("rxPageState");
                sessionStorage.removeItem("rxAuthState");
                localStorage.removeItem("rxSession");
                
                console.log("Logged out successfully. Redirecting to login...");
                
                // Redirect to User-Authentication.html or authentication page
                if (window.location.pathname.includes('User-profile.html')) {
                    window.location.href = 'User-Authentication.html';
                } else {
                    window.location.href = 'User-Authentication.html';
                }
            });
        } else {
            console.error("Logout button not found in the DOM!");
        }
    };

    // यदि यो पेज सिधै लोड भयो भने पनि काम गरोस्
    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("profileSection")) {
            window.rxInitProfilePage();
        }
    });
})();