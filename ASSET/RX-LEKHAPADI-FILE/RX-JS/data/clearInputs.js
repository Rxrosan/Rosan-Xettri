// data/clearInputs.js
function clearInputs() {
    if (confirm("Are you sure you want to clear all fields? This cannot be undone.")) {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        
        const allInputs = document.querySelectorAll('.page-content input, #editableWitnesses input');
        allInputs.forEach(input => input.value = '');
    }
}