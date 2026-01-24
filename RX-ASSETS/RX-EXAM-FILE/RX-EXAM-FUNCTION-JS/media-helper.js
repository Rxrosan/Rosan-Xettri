// media-helper.js - Handles media content to HTML conversion
const MediaHelper = {
    getMediaHTML: function(obj) {
        if (!obj) return "";
        let html = "";
        
        // Add text content
        if (obj.text) {
            html += `<div class="content-text" style="font-size:16px; font-weight:500; margin-bottom:5px;">${obj.text}</div>`;
        }
        
        // Add image
        if (obj.image) {
            html += `<img src="${obj.image}" class="content-image" style="max-width:260px; display:block; margin:10px 0; border:1px solid #ddd; padding:5px; background:#fff; border-radius:4px;">`;
        }
        
        // Add audio player
        if (obj.audio) {
            html += `<div class="content-audio" style="margin:10px 0;">
                <audio controls style="width:100%; height:35px;">
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