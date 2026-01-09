// User Data Storage with LocalStorage Support
const RXUserData = {
    // Default users with roles
    users: [
        {
            id: 1,
            fullName: "ROSAN KC",
            nickname: "ROSAN",
            email: "rkc242855@gmail.com",
            phone: "9826482279",
            dob: "2004-07-25",
            address: "Banganga-10, Kapilvastu",
            profileImage: "RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/A-2.png",
            role: "admin",
            joinDate: "2024-01-01"
        },
        {
            id: 2,
            fullName: "John Smith",
            nickname: "john",
            email: "john@rxstudio.com",
            phone: "+1 234 567 8900",
            dob: "1990-01-01",
            address: "New York, USA",
            profileImage: "RX-ASSETS/RX-IMAGE/RX-USER/default-profile.png",
            role: "member",
            joinDate: "2024-01-15"
        },
        {
            id: 3,
            fullName: "Emma Johnson",
            nickname: "emma",
            email: "emma@rxstudio.com",
            phone: "+44 7911 123456",
            dob: "1992-07-22",
            address: "London, UK",
            profileImage: "RX-ASSETS/RX-IMAGE/RX-USER/default-profile.png",
            role: "user",
            joinDate: "2024-02-01"
        }
    ],

    // Initialize - load from localStorage if available
    init: function() {
        this.loadFromLocalStorage();
        return this;
    },

    // Save to localStorage
    saveToLocalStorage: function() {
        try {
            localStorage.setItem('rxUsersData', JSON.stringify(this.users));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },

    // Load from localStorage
    loadFromLocalStorage: function() {
        try {
            const savedData = localStorage.getItem('rxUsersData');
            if (savedData) {
                this.users = JSON.parse(savedData);
            }
        } catch (e) {
            console.error('Error loading from localStorage:', e);
        }
    },

    // Add a new user
    addUser: function(userData) {
        const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
        const newUser = {
            id: newId,
            fullName: userData.fullName || '',
            nickname: userData.nickname || '',
            email: userData.email || '',
            phone: userData.phone || '',
            dob: userData.dob || '',
            address: userData.address || '',
            role: userData.role || "user",
            joinDate: new Date().toISOString().split('T')[0],
            profileImage: userData.profileImage || "RX-ASSETS/RX-IMAGE/RX-USER/default-profile.png"
        };
        
        this.users.push(newUser);
        this.saveToLocalStorage();
        return newUser;
    },

    // Get user by ID
    getUserById: function(id) {
        const user = this.users.find(user => user.id === parseInt(id));
        return user ? {...user} : null; // Return copy to prevent direct mutation
    },

    // Get user by nickname and email (for login)
    getUserByCredentials: function(credential) {
        if (!credential) return null;
        
        const user = this.users.find(user => 
            (user.nickname && user.nickname.toLowerCase() === credential.toLowerCase()) || 
            (user.email && user.email.toLowerCase() === credential.toLowerCase())
        );
        
        return user ? {...user} : null; // Return copy
    },

    // Update user data with localStorage save
    updateUser: function(id, updatedData) {
        const userIndex = this.users.findIndex(user => user.id === parseInt(id));
        if (userIndex !== -1) {
            // Preserve existing data and update with new data
            this.users[userIndex] = { 
                ...this.users[userIndex], 
                ...updatedData 
            };
            this.saveToLocalStorage();
            return {...this.users[userIndex]}; // Return copy
        }
        return null;
    },

    // Get all users
    getAllUsers: function() {
        return this.users.map(user => ({...user})); // Return copies
    },

    // Get current logged in user from localStorage
    getCurrentUser: function() {
        try {
            const userId = localStorage.getItem('rxCurrentUserId');
            return userId ? this.getUserById(parseInt(userId)) : null;
        } catch (e) {
            console.error('Error getting current user:', e);
            return null;
        }
    },

    // Set current user
    setCurrentUser: function(userId) {
        try {
            localStorage.setItem('rxCurrentUserId', userId.toString());
        } catch (e) {
            console.error('Error setting current user:', e);
        }
    },

    // Clear current user (logout)
    clearCurrentUser: function() {
        try {
            localStorage.removeItem('rxCurrentUserId');
        } catch (e) {
            console.error('Error clearing current user:', e);
        }
    },

    // Get role badge color
    getRoleColor: function(role) {
        const colors = {
            'admin': '#ff4d4d',
            'member': '#4d7cff',
            'user': '#64ffda'
        };
        return colors[role] || '#8892b0';
    },

    // Get role display name
    getRoleDisplayName: function(role) {
        const names = {
            'admin': 'ADMIN',
            'member': 'Member',
            'user': 'User'
        };
        return names[role] || 'User';
    },

    // Check if nickname or email already exists
    isCredentialAvailable: function(credential, excludeUserId = null) {
        return !this.users.some(user => 
            user.id !== excludeUserId && 
            (user.nickname.toLowerCase() === credential.toLowerCase() || 
             user.email.toLowerCase() === credential.toLowerCase())
        );
    }
};

// Initialize data storage
RXUserData.init();