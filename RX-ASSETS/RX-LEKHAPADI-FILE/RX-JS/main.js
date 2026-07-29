// main.js - Entry Point
// This file should be loaded last after all individual function files

document.addEventListener('DOMContentLoaded', function() {
    // Make sure all dependencies are loaded
    if (typeof CONFIG === 'undefined') {
        console.error('Config not loaded!');
        return;
    }
    
    // Initialize the application
    init();
});