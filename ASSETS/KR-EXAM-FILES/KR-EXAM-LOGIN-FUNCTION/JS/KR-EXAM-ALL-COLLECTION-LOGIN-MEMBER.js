// users.js

// This acts as a simple database of users.
// In a real-world application, this data would come from a secure server.
const USERS = [
    {
        name: "ROSAN KC",
        link: "ASSETS/KR-EXAM-FILES/KR-EXAM-LOGIN-FUNCTION/IMG/RO S AN KC.jpg", // Example profile image
        phone: "9826482279",
        key: "RX-2061",
        purchases: [
            {
                questionId: 1,
                purchaseType: 'lifetime', // This will never expire
                purchaseDate: new Date('2024-01-01').toISOString()
            },
            {
                questionId: 2,
                purchaseType: 'lifetime', // This will never expire
                purchaseDate: new Date('2024-01-01').toISOString()
            },
            {
                questionId: 3,
                purchaseType: 'lifetime', // This will never expire
                purchaseDate: new Date('2024-01-01').toISOString()
            },
            {
                questionId: 4,
                purchaseType: 'lifetime', // This will never expire
                purchaseDate: new Date('2024-01-01').toISOString()
            },
            {
                questionId: 5,
                purchaseType: 'lifetime', // This will never expire
                purchaseDate: new Date('2024-01-01').toISOString()
            }
        ]
    },
    {
        name: "Keshab Disuwa Magar",
        link: "ASSETS/KR-EXAM-FILES/KR-EXAM-LOGIN-FUNCTION/IMG/Keshab Disuwa Magar.jpg", // Example profile image
        phone: "9748780170",
        key: "RX-KDM01",
        purchases: [
            {
                questionId: 1,
                purchaseType: 'lifetime', // This will never expire
                purchaseDate: new Date('2024-01-01').toISOString()
            },
            {
                questionId: 2,
                purchaseType: 'lifetime', // This will never expire
                purchaseDate: new Date('2024-01-01').toISOString()
            },
            {
                questionId: 3,
                purchaseType: 'lifetime', // This will never expire
                purchaseDate: new Date('2024-01-01').toISOString()
            },
            {
                questionId: 4,
                purchaseType: 'lifetime', // This will never expire
                purchaseDate: new Date('2024-01-01').toISOString()
            },
            {
                questionId: 5,
                purchaseType: 'lifetime', // This will never expire
                purchaseDate: new Date('2024-01-01').toISOString()
            }
        ]
    },
    {
        name: "PUBLIC",
        link: "ASSETS/KR-EXAM-FILES/KR-EXAM-LOGIN-FUNCTION/IMG/USER.png", // Example profile image
        phone: "000",
        key: "RX-PUBLIC",
        purchases: [
            {
                questionId: 5,
                purchaseType: 'lifetime', // This will never expire
                purchaseDate: new Date('2024-01-01').toISOString()
            }
        ]
    }
];