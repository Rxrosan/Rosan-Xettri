// media-helper.js - Updated with IDs for media elements

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
    }
};