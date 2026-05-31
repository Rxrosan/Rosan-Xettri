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
        // .replace() को प्रयोग गर्दा ब्राउजरको 'Back' बटन थिचेर पनि पुरानो कोड वा प्रश्न हेर्न मिल्दैन
        window.location.replace("about:blank");
    }

    // डेभलपर टुल खुला छ कि नाइँ निरन्तर निगरानी गर्ने फङ्ग्सन
    function checkDevTools() {
        // यदि पहिले नै ब्ल्याङ्क पेजमा पुगिसकेको छ भने चेक नगर्ने
        if (window.location.href === "about:blank") return;

        const widthThreshold = 160;
        const heightThreshold = 160;
        
        // विधि १: साइज चेकर (इन्स्पेक्ट एलिमेन्टको साइज नाप्ने)
        const isSizeMatch = (window.outerWidth - window.innerWidth > widthThreshold || 
                             window.outerHeight - window.innerHeight > heightThreshold);
        
        // विधि २: डिबगर टाइम चेकर (कन्सोल खुल्दा यो लाइनमा समय ढिलो हुन्छ)
        const startTime = Date.now();
        debugger;
        const isDebuggerMatch = (Date.now() - startTime > 100);

        // दुई मध्ये कुनै एक तरिकाबाट कन्सोल खुला भएको थाहा पाउने बित्तिकै स्थायी रूपमा ब्ल्याङ्क गर्ने
        if (isSizeMatch || isDebuggerMatch) {
            permanentNuke();
        }
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
        // राइट-क्लिक र कपि-पेस्ट सामान्य युजरको लागि खुला रहनेछ
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