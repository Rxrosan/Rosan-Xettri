(function() {
    'use strict';
    
    const config = {
        checkInterval: 250,                     // चेकिङ टाइम एकदमै फास्ट (२५०ms)
        targetUrl: 'https://www.rosankc.com.np' // कन्सोल बन्द भएपछि फर्किने यूआरएल
    };

    // सबै फाइल र कोडहरूलाई Sources ट्याबबाट नामोनिसान उडाउन वास्तविक blank मा पठाउने
    function totalNuke() {
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch(e){}

        // एउटा सानो कन्ट्याक्ट विन्डो ब्याकग्राउन्डमा खोल्ने (जसले कन्सोल बन्द भएको ट्र्याक गर्छ)
        const tracker = window.open('', '_blank', 'width=1,height=1,left=9999,top=9999');
        
        if (tracker) {
            tracker.document.write(`
                <script>
                    const mainWin = window.opener;
                    const checkLoop = setInterval(function() {
                        // यदि मुख्य विन्डो बन्द भयो भने यो लुप पनि बन्द गर्ने
                        if (!mainWin || mainWin.closed) {
                            clearInterval(checkLoop);
                            window.close();
                            return;
                        }

                        // साइज चेकर: कन्सोल बन्द भयो कि भएन हेर्ने
                        const widthThreshold = 160;
                        const heightThreshold = 160;
                        const isClosed = (mainWin.outerWidth - mainWin.innerWidth <= widthThreshold && 
                                          mainWin.outerHeight - mainWin.innerHeight <= heightThreshold);

                        if (isClosed) {
                            clearInterval(checkLoop);
                            // कन्सोल बन्द हुनासाथ मुख्य विन्डोलाई पुनः वेबसाइटमा फर्काउने
                            mainWin.location.replace("${config.targetUrl}");
                            // यो ट्र्याकर विन्डो आफैं बन्द हुने
                            window.close();
                        }
                    }, 300);
                </script>
            `);
            tracker.document.close();
        }

        // मुख्य वेबसाइटलाई तुरुन्तै वास्तविक about:blank मा लैजाने
        // यसो गर्दा Sources, Network, र Elements ट्याबका सबै जाभास्क्रिप्ट र एचटीएमएल फाइलहरू तत्कालै नष्ट हुन्छन्
        window.location.replace("about:blank");
    }

    function checkDevTools() {
        if (window.location.href === "about:blank") return;

        const widthThreshold = 160;
        const heightThreshold = 160;
        const isSizeMatch = (window.outerWidth - window.innerWidth > widthThreshold || 
                             window.outerHeight - window.innerHeight > heightThreshold);
        
        const startTime = Date.now();
        debugger;
        const isDebuggerMatch = (Date.now() - startTime > 100);

        if (isSizeMatch || isDebuggerMatch) {
            totalNuke();
        }
    }

    // टेक्स्ट सेलेक्ट र कपि गर्न दिने फङ्ग्सन
    function enableSelectionAndCopy() {
        // १. जाभास्क्रिप्ट मार्फत हुने selection र copy ब्लकहरूलाई फुकुवा गर्ने
        document.addEventListener('selectstart', e => e.stopPropagation(), true);
        document.addEventListener('copy', e => e.stopPropagation(), true);

        // २. यदि CSS मा कतै 'user-select: none' राखिएको छ भने त्यसलाई जबरजस्ती 'auto' बनाइदिने
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
        // टेक्स्ट सेलेक्सन र कपि-पेस्ट इनेबल गर्ने
        enableSelectionAndCopy();
        
        // कन्सोल चेकर मात्र ब्याकग्राउन्डमा चलाउने
        setInterval(checkDevTools, config.checkInterval);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    } else {
        initProtection();
    }
})();