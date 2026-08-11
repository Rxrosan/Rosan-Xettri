// handlers/handleDownloadFallback.js
function handleDownloadFallback(fullText) {
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kapali-tamsuk-document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Document downloaded as text file. You can now convert it to PDF using your device\'s file manager or any PDF converter app. You can also click the print button and save as PDF directly.');
}