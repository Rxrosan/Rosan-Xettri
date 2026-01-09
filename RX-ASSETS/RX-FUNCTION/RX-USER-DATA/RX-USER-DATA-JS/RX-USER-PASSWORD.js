// User Password Management
const RXUserPassword = {
    // Initialize with default passwords
    init: function() {
        // Initialize passwords if not exists
        if (!localStorage.getItem('rxUserPasswords')) {
            this.saveToLocalStorage();
        } else {
            this.loadFromLocalStorage();
        }
        return this;
    },

    // Save to localStorage
    saveToLocalStorage: function() {
        try {
            localStorage.setItem('rxUserPasswords', JSON.stringify(this.passwords));
        } catch (e) {
            console.error('Error saving passwords:', e);
        }
    },

    // Load from localStorage
    loadFromLocalStorage: function() {
        try {
            const savedData = localStorage.getItem('rxUserPasswords');
            if (savedData) {
                this.passwords = JSON.parse(savedData);
            }
        } catch (e) {
            console.error('Error loading passwords:', e);
        }
    },

    // Set/Update password for a user
    setPassword: function(userId, password) {
        if (!userId || !password) return false;
        
        const existingIndex = this.passwords.findIndex(p => p.userId === parseInt(userId));
        
        if (existingIndex !== -1) {
            // Update existing password
            this.passwords[existingIndex].password = password;
        } else {
            // Add new password
            this.passwords.push({ 
                userId: parseInt(userId), 
                password: password 
            });
        }
        
        this.saveToLocalStorage();
        return true;
    },

    // Verify password for a user
    verifyPassword: function(userId, password) {
        if (!userId || !password) return false;
        
        const userPassword = this.passwords.find(p => p.userId === parseInt(userId));
        return userPassword && userPassword.password === password;
    },

    // Check if user exists in password database
    userExists: function(userId) {
        return this.passwords.some(p => p.userId === parseInt(userId));
    },

    // Add new user with password
    addUserWithPassword: function(userId, userData, password) {
        // Add to user data
        const newUser = RXUserData.addUser({...userData, id: parseInt(userId)});
        
        // Add password
        this.setPassword(userId, password);
        
        return newUser;
    },

    // Get password for a user (for debugging)
    getPassword: function(userId) {
        const userPass = this.passwords.find(p => p.userId === parseInt(userId));
        return userPass ? userPass.password : null;
    }
};

// Initialize with default passwords
RXUserPassword.passwords = [
    { userId: 1, password: "ROSAN" },
    { userId: 2, password: "JOHN123" },
    { userId: 3, password: "EMMA456" }
];

RXUserPassword.init();