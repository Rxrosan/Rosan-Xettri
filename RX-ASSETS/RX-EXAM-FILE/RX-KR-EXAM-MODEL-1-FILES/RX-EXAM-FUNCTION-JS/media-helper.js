// media-helper.js - Updated with IDs for media elements and custom refresh confirmation

const MediaHelper = {
    getMediaHTML: function(obj) {
        if (!obj) return "";
        let html = "";
        
        // Add text content
        if (obj.text) {
            html += `<div class="content-text" style="font-size:16px; font-weight:500; margin-bottom:5px;">${obj.text}</div>`;
        }
        
        // Add image with unique ID
        if (obj.image) {
            const imgId = 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            html += `<img src="${obj.image}" id="${imgId}" class="content-image" style="max-width:260px; display:block; margin:10px 0; border:1px solid #ddd; padding:5px; background:#fff; border-radius:4px; cursor:pointer;" title="Tap to view larger">`;
        }
        
        // Add audio player with unique ID
        if (obj.audio) {
            const audioId = 'audio-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            html += `<div class="content-audio" style="margin:15px 0;">
                <audio id="${audioId}" controls style="width:100%; height:35px;">
                    <source src="${obj.audio}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>`;
        }
        
        return html;
    },
    
    getQuestionType: function(question) {
        if (question.questionBody && question.questionBody.audio) {
            return 'listening';
        }
        return 'reading';
    },
    
    // Function to show custom refresh confirmation popup
    confirmRefresh: function() {
        let refreshConfirmed = false;
        
        // Create custom popup HTML
        const popupHTML = `
            <div id="refresh-confirm-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; display:flex; justify-content:center; align-items:center;">
                <div style="background:#fff; padding:30px; border-radius:12px; max-width:400px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
                    <div style="font-size:48px; margin-bottom:15px;">⚠️</div>
                    <h3 style="color:#333; margin-bottom:15px; font-size:24px;">Warning!</h3>
                    <p style="color:#666; margin-bottom:25px; font-size:16px; line-height:1.5;">If you refresh the page, your progress and data will be erased! Are you sure you want to continue?</p>
                    <div style="display:flex; gap:15px; justify-content:center;">
                        <button id="refresh-yes" style="background:#dc3545; color:white; border:none; padding:12px 30px; border-radius:6px; font-size:16px; font-weight:600; cursor:pointer; transition:background 0.3s;">Yes, Refresh</button>
                        <button id="refresh-no" style="background:#28a745; color:white; border:none; padding:12px 30px; border-radius:6px; font-size:16px; font-weight:600; cursor:pointer; transition:background 0.3s;">No, Stay</button>
                    </div>
                </div>
            </div>
        `;
        
        // Track if user is attempting to refresh
        let refreshAttempted = false;
        
        // Handle beforeunload event - return null to prevent default dialog
        window.addEventListener('beforeunload', function(event) {
            if (!refreshConfirmed && !refreshAttempted) {
                refreshAttempted = true;
                
                // Prevent default dialog
                event.preventDefault();
                
                // Show custom popup
                MediaHelper.removeRefreshPopup();
                document.body.insertAdjacentHTML('beforeend', popupHTML);
                
                // Add event listeners for buttons
                setTimeout(() => {
                    const yesBtn = document.getElementById('refresh-yes');
                    const noBtn = document.getElementById('refresh-no');
                    
                    if (yesBtn) {
                        yesBtn.addEventListener('click', function() {
                            refreshConfirmed = true;
                            MediaHelper.removeRefreshPopup();
                            // Trigger actual refresh
                            window.location.reload();
                        });
                    }
                    
                    if (noBtn) {
                        noBtn.addEventListener('click', function() {
                            refreshAttempted = false;
                            MediaHelper.removeRefreshPopup();
                        });
                    }
                }, 100);
                
                // Cancel the event
                event.returnValue = '';
                return '';
            }
        });
        
        // Also handle F5 key and Ctrl+R
        window.addEventListener('keydown', function(e) {
            if ((e.key === 'F5') || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.key === 'R')) {
                e.preventDefault();
                
                if (!refreshConfirmed && !refreshAttempted) {
                    refreshAttempted = true;
                    
                    MediaHelper.removeRefreshPopup();
                    document.body.insertAdjacentHTML('beforeend', popupHTML);
                    
                    setTimeout(() => {
                        const yesBtn = document.getElementById('refresh-yes');
                        const noBtn = document.getElementById('refresh-no');
                        
                        if (yesBtn) {
                            yesBtn.addEventListener('click', function() {
                                refreshConfirmed = true;
                                MediaHelper.removeRefreshPopup();
                                window.location.reload();
                            });
                        }
                        
                        if (noBtn) {
                            noBtn.addEventListener('click', function() {
                                refreshAttempted = false;
                                MediaHelper.removeRefreshPopup();
                            });
                        }
                    }, 100);
                }
            }
        });
        
        console.log('Custom refresh confirmation enabled');
    },
    
    // Helper function to remove popup
    removeRefreshPopup: function() {
        const overlay = document.getElementById('refresh-confirm-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
};

// Auto-initialize the refresh confirmation when the script loads
if (typeof window !== 'undefined') {
    setTimeout(function() {
        MediaHelper.confirmRefresh();
    }, 100);
}