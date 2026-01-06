// USER-DATABASE.js
// User database with nickname

const userDatabase = [
    {
        id: 1,
        username: "ROSAN KC",
        nickname: "ROSAN",  // Added nickname here
        email: "rkc242855@gmail.com",
        password: "Ro&@n2061",
        phone: "9826482279",
        address: "BANGANGA-10, KAPILVASTU",
        dateOfBirth: "2004-07-25",
        accountType: "ADMIN",
        profileImage: "RX-ASSETS/RX-IMAGE/RX-USER-IMAGE/A-1.jpg"
    },
    {
        id: 2,
        username: "Jane Smith",
        nickname: "Jane",  // Added nickname here
        email: "jane@example.com",
        password: "demo456",
        phone: "+1 (555) 987-6543",
        address: "456 Oak Avenue, Los Angeles, CA 90001",
        dateOfBirth: "1988-08-22",
        accountType: "Standard",
        profileImage: "https://images.unsplash.com/photo-1494790108755-d3b416303d12?w=150&h=150&fit=crop&crop=face"
    }
];

console.log('User Database: ' + userDatabase.length + ' users loaded');