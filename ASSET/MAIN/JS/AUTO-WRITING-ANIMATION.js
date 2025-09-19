document.addEventListener('DOMContentLoaded', function() {
    const textElement = document.getElementById('auto-writer');
    const texts = [
        "Hello / Namaste !",
        "Welcome to my website.",
        "I am Rosan Khattri Chettri.",
        "I am a Graphic Designer.",
        "I am a Website Developer.",
        "For more Services and Updates",
        "Contact or Follow Us."
    ];
    
    // Configuration with consistent speeds
    const config = {
        typingSpeed: 75,        // Consistent typing speed (ms per character)
        deletingSpeed: 25,       // Consistent deleting speed (ms per character)
        pauseBetweenTexts: 1000, // Pause before starting next text (ms)
        startDelay: 500          // Initial delay before animation starts (ms)
    };
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentText = texts[textIndex];
        
        // Display text with cursor
        textElement.innerHTML = currentText.substring(0, charIndex) + '<span class="auto-writer-cursor"></span>';
        
        if (!isDeleting) {
            // Typing phase
            charIndex++;
            
            if (charIndex <= currentText.length) {
                setTimeout(typeWriter, config.typingSpeed);
            } else {
                // Finished typing - wait then start deleting
                isDeleting = true;
                setTimeout(typeWriter, config.pauseBetweenTexts);
            }
        } else {
            // Deleting phase
            charIndex--;
            
            if (charIndex >= 0) {
                setTimeout(typeWriter, config.deletingSpeed);
            } else {
                // Finished deleting - move to next text
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(typeWriter, config.pauseBetweenTexts);
            }
        }
    }
    
    // Add CSS for cursor animation
    const style = document.createElement('style');
    style.textContent = `
        .auto-writer-cursor {
            display: inline-block;
            width: 2px;
            height: 1em;
            background-color: currentColor;
            margin-left: 2px;
            vertical-align: middle;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        #auto-writer {
            min-height: 1.5em;
            font-family: 'Times new roman', sans-serif;
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
            line-height: 1.5;
        }
    `;
    document.head.appendChild(style);
    
    // Start the typing effect
    setTimeout(typeWriter, config.startDelay);
});