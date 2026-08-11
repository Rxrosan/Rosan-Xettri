// handlers/handleShare.js
async function handleShare() {
    try {
        createPrintDocument();
        const fullText = getFullGeneratedText();
        
        const textBlob = new Blob([fullText], { type: 'text/plain' });
        const textFile = new File([textBlob], 'Lekha-Padi-document.txt', { 
            type: 'text/plain' 
        });

        const shareData = {
            title: 'लेखापढी दस्तावेज - ROSAN XETTRI STUDIO',
            text: fullText.substring(0, 100) + '...',
            files: [textFile],
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            console.log('Document shared successfully');
        } else {
            handleDownloadFallback(fullText);
        }
    } catch (error) {
        console.error('Error sharing:', error);
        const fullText = getFullGeneratedText();
        handleDownloadFallback(fullText);
    }
}