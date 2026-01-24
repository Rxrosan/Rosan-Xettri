// id.js - Manages user identifiers and exam ID
const UserID = {
    userId: null,
    examId: 'EPS-TOPIK-2024-001',
    userName: 'Rosan kc',
    
    init: function() {
        // Generate or retrieve user ID
        this.userId = localStorage.getItem('examUserId') || this.generateUserId();
        localStorage.setItem('examUserId', this.userId);
        
        // Set username in header
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) {
            userNameEl.textContent = this.userName;
        }
    },
    
    generateUserId: function() {
        return 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },
    
    getUserId: function() {
        return this.userId;
    },
    
    getExamId: function() {
        return this.examId;
    }
};