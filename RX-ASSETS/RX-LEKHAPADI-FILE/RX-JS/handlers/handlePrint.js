// handlers/handlePrint.js
function handlePrint() {
    createPrintDocument();
    setTimeout(() => {
        window.print();
    }, 500);
}