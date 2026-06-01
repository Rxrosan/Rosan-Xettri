(function() {
    'use strict';
    
    const config = {
        checkInterval: 250                      // चेकिङ टाइम एकदमै फास्ट (२५०ms)
    };

    // कन्सोल खोल्ने बित्तिकै सबै डेटा मेट्ने र स्थायी रूपमा about:blank मा पठाइदिने
    function permanentNuke() {
        try {
            // परीक्षाको कुनै पनि डाटा मेमोरीमा बाँकी नरहोस् भनेर क्लियर गर्ने
            localStorage.clear();
            sessionStorage.clear();
            
            // ब्राउजरको कुकीजहरू पनि हटाउने प्रयास गर्ने
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
        } catch(e){}

        // नेटवर्क रिक्वेस्टहरू तुरुन्तै बन्द गर्ने ताकि थप फाइल लोड हुन नपाओस्
        window.stop();

        // मुख्य वेबसाइटलाई तुरुन्तै वास्तविक about:blank मा रिप्लेस (Redirect) गर्ने
        window.location.replace("about:blank");
    }

    // डेभलपर टुल खुला छ कि नाइँ निरन्तर निगरानी गर्ने फङ्ग्सन
    function checkDevTools() {
        if (window.location.href === "about:blank") return;

        const widthThreshold = 160;
        const heightThreshold = 160;
        
        // विधि १: साइज चेकर
        const isSizeMatch = (window.outerWidth - window.innerWidth > widthThreshold || 
                             window.outerHeight - window.innerHeight > heightThreshold);
        
        // विधि २: डिबगर टाइम चेकर
        const startTime = Date.now();
        debugger;
        const isDebuggerMatch = (Date.now() - startTime > 100);

        if (isSizeMatch || isDebuggerMatch) {
            permanentNuke();
        }
    }

    // राइट-क्लिक ब्लक गर्ने फङ्ग्सन
    function blockRightClick() {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        }, false);
    }

    // टेक्स्ट सेलेक्ट र कपि गर्न दिने फङ्ग्सन (नर्मल युजरको सहजताको लागि)
    function enableSelectionAndCopy() {
        document.addEventListener('selectstart', e => e.stopPropagation(), true);
        document.addEventListener('copy', e => e.stopPropagation(), true);

        const style = document.createElement('style');
        style.textContent = `
            html, body, body * {
                user-select: auto !important;
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    function initProtection() {
        // राइट-क्लिक ब्लक गर्ने
        blockRightClick();
        
        // सेलेक्ट र कपि खुल्ला राख्ने
        enableSelectionAndCopy();
        
        // ब्याकग्राउन्डमा कन्सोल चेकर निरन्तर चलाउने
        setInterval(checkDevTools, config.checkInterval);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    } else {
        initProtection();
    }
})();