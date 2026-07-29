document.addEventListener('DOMContentLoaded', function() {
    const textElement = document.getElementById('auto-writer');
    const texts = [
        "नमस्ते, म रोसन के.सी.",
        "तपाईं हरू लाई मेरो आधिकारिक वेब पेजमा हार्दिक स्वागत छ।",
        "यस वेब पेजमार्फत तपाईंहरूले विभिन्न डिजिटल तथा सिर्जनात्मक सेवाहरू सहज रूपमा प्राप्त गर्न सक्नुहुनेछ।",
        "लेखापढी तथा लेखा सम्बन्धी सेवाहरू",
        "लेखापढीका लागि वेब-आधारित सफ्टवेयर समाधान",
        "ग्राफिक डिजाइनिङ सम्बन्धी प्रोफेशनल सेवाहरू",
        "कोरियन भाषा तयारीका लागि अनलाइन सुविधा",
        "थप जानकारीका लागि कृपया हामीलाई फलो गर्नुहोस् वा सम्पर्क गर्नुहोस्।"
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
         #auto-writer {
            min-height: 1.5em;
            font-family: 'Times new roman', sans-serif;
            font-size: 1.5rem;
            font-weight: bold;
            color: #d10823;
            line-height: 1.5;
        }
    `;
    document.head.appendChild(style);
    
    // Start the typing effect
    setTimeout(typeWriter, config.startDelay);
});